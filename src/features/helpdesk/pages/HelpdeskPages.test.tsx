import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'
import { createInitialHelpdeskState, useHelpdeskStore } from '@/features/helpdesk/hooks'
import {
  HelpdeskListPage,
  HelpdeskNewTicketPage,
  HelpdeskTicketPage,
} from '@/features/helpdesk/pages'
import { AppThemeProvider } from '@/theme/AppThemeProvider'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppThemeProvider>
        <Routes>
          <Route path="/helpdesk" element={<HelpdeskListPage />} />
          <Route path="/helpdesk/new" element={<HelpdeskNewTicketPage />} />
          <Route path="/helpdesk/:ticketId" element={<HelpdeskTicketPage />} />
        </Routes>
      </AppThemeProvider>
    </MemoryRouter>,
  )
}

/*
 * Big antd trees make role queries slow in jsdom, because each one computes styles for every
 * candidate; these tests find controls by their text or label and scope with `within`.
 */
describe('helpdesk', () => {
  beforeEach(() => {
    useHelpdeskStore.setState(createInitialHelpdeskState())
  })

  it('lists the queue and narrows it by status from the address bar', () => {
    renderAt('/helpdesk?status=pending')

    // jsdom matches no media query, so the queue is the phone's card list.
    expect(screen.getByText('Two-factor codes arrive several minutes late')).toBeInTheDocument()
    expect(screen.getByText('Vessel positions stopped updating on the map')).toBeInTheDocument()
    expect(screen.queryByText('Checkout fails with a 502 after the payment step')).toBeNull()

    fireEvent.click(screen.getByText('Closed'))
    expect(screen.getByText('How do I change the company name on invoices?')).toBeInTheDocument()
    expect(screen.queryByText('Two-factor codes arrive several minutes late')).toBeNull()
  })

  it('finds a ticket by its number', () => {
    renderAt('/helpdesk')

    fireEvent.change(screen.getByLabelText('Search by number, subject or requester'), {
      target: { value: '#1037' },
    })
    expect(screen.getByText('Card was charged twice for the annual plan')).toBeInTheDocument()
    expect(screen.queryByText('Checkout fails with a 502 after the payment step')).toBeNull()
  })

  it('creates a ticket and opens it, with the SLA its priority sets', async () => {
    renderAt('/helpdesk/new')

    fireEvent.click(screen.getByText('New contact'))
    fireEvent.change(await screen.findByLabelText('Full name'), { target: { value: 'Ada Byron' } })
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'ada@engines.example' } })
    fireEvent.change(screen.getByLabelText('Subject'), {
      target: { value: 'Cannot export reports' },
    })
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'The export button spins forever.' },
    })
    fireEvent.click(screen.getByText('Create ticket'))

    expect(await screen.findByText('Cannot export reports')).toBeInTheDocument()
    expect(screen.getByText('#1041')).toBeInTheDocument()
    expect(screen.getByText('The export button spins forever.')).toBeInTheDocument()
    expect(useHelpdeskStore.getState().contacts.some((c) => c.name === 'Ada Byron')).toBe(true)
  })

  it('refuses a ticket without a requester or subject', async () => {
    renderAt('/helpdesk/new')

    fireEvent.click(screen.getByText('Create ticket'))
    expect(await screen.findByText('Choose who the ticket is for.')).toBeInTheDocument()
    expect(screen.getByText('Give the ticket a subject.')).toBeInTheDocument()
  })

  it('adds a reply and an internal note to the thread, each marked for what it is', async () => {
    renderAt('/helpdesk/1035')
    const thread = screen.getByLabelText('Conversation')

    fireEvent.change(screen.getByLabelText('Write a reply the customer will see…'), {
      target: { value: 'We raised your limit while we look into it.' },
    })
    fireEvent.click(screen.getByText('Send'))
    const reply = await within(thread).findByText('We raised your limit while we look into it.')
    expect(reply.closest('.helpdesk-message')).toHaveClass('helpdesk-message--reply')
    // The first answer stops the first-response clock.
    expect(
      useHelpdeskStore.getState().tickets.find((t) => t.id === 1035)?.firstResponseAt,
    ).toBeDefined()

    fireEvent.click(screen.getByText('Internal note'))
    fireEvent.change(screen.getByLabelText('Only the team sees notes.'), {
      target: { value: 'Check the gateway logs.' },
    })
    fireEvent.click(screen.getByText('Add note'))
    const note = await within(thread).findByText('Check the gateway logs.')
    expect(note.closest('.helpdesk-message')).toHaveClass('helpdesk-message--note')
  })

  it('will not send an empty reply', () => {
    renderAt('/helpdesk/1035')

    fireEvent.click(screen.getByText('Send'))
    expect(screen.getByText('Write something first.')).toBeInTheDocument()
  })

  it('logs a status change in the activity timeline', async () => {
    renderAt('/helpdesk/1035')

    useHelpdeskStore.getState().updateTicket(1035, { status: 'resolved' })
    expect(
      await screen.findByText('Demo Admin changed status from Open to Resolved'),
    ).toBeInTheDocument()
    await waitFor(() =>
      expect(
        useHelpdeskStore.getState().tickets.find((t) => t.id === 1035)?.resolvedAt,
      ).toBeDefined(),
    )
  })

  it('shows the ticket history, filters it and jumps back into the conversation', async () => {
    const { container } = renderAt('/helpdesk/1036')

    fireEvent.click(screen.getByText(/^History \(/))
    await screen.findAllByText('First response target met')
    // Scoped to the tab: the sidebar repeats the latest changes.
    const history = within(container.querySelector<HTMLElement>('.helpdesk-history-panel')!)
    // A resolved ticket: routed, answered in time, resolved, all on one line.
    expect(history.getByText('Lukas Weber opened the ticket')).toBeInTheDocument()
    expect(history.getByText('Demo Admin replied')).toBeInTheDocument()
    expect(history.getByText('First response target met')).toBeInTheDocument()
    expect(history.getByText('Resolved within target')).toBeInTheDocument()
    expect(history.getByText(/changed status from Open to Resolved/)).toBeInTheDocument()

    fireEvent.click(screen.getByText(/^Service level \(/))
    expect(history.queryByText('Demo Admin replied')).toBeNull()
    expect(history.getByText('Resolved within target')).toBeInTheDocument()

    fireEvent.click(screen.getByText(/^Everything \(/))
    fireEvent.click(screen.getAllByText('Show in conversation')[0]!)
    expect(await screen.findByLabelText('Conversation')).toBeInTheDocument()
  })

  it('adds a change to the history as soon as it is made', async () => {
    renderAt('/helpdesk/1035')

    fireEvent.click(screen.getByText(/^History \(/))
    useHelpdeskStore.getState().updateTicket(1035, { priority: 'urgent' })
    expect(
      await screen.findAllByText('Demo Admin changed priority from Normal to Urgent'),
    ).not.toHaveLength(0)
  })

  it('opens the queue-wide activity feed from the list', async () => {
    renderAt('/helpdesk')

    fireEvent.click(screen.getByText('Recent activity'))
    expect(
      await screen.findByText('The latest changes, messages and deadlines across the queue.'),
    ).toBeInTheDocument()
    expect(screen.getAllByText(/#1031 Checkout fails/).length).toBeGreaterThan(0)
  })

  it('shows a not-found page for a ticket that does not exist', () => {
    renderAt('/helpdesk/9999')

    expect(screen.getByText('Ticket not found')).toBeInTheDocument()
    expect(screen.getByText('Back to tickets')).toBeInTheDocument()
  })
})
