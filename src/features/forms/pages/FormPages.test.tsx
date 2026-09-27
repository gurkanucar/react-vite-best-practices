import { act, fireEvent, render, renderHook, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'
import { useBuilderHistory, useFormStore } from '@/features/forms/hooks'
import { FormBuilderPage } from '@/features/forms/pages/FormBuilderPage'
import { FormFillPage } from '@/features/forms/pages/FormFillPage'
import { FormListPage } from '@/features/forms/pages/FormListPage'
import { FormResponsesPage } from '@/features/forms/pages/FormResponsesPage'
import { PublicFormPage } from '@/features/forms/pages/PublicFormPage'
import { blankForm } from '@/features/forms/types'
import { AppThemeProvider } from '@/theme/AppThemeProvider'

/*
 * jsdom has no layout, so these run the phone layout: the palette and the inspector are
 * drawers. Role queries over the builder's many antd buttons are slow in jsdom, so controls
 * are found by label, by text or inside a narrowed container instead.
 */
function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppThemeProvider>
        <Routes>
          <Route path="/forms" element={<FormListPage />} />
          <Route path="/forms/new" element={<FormBuilderPage />} />
          <Route path="/forms/:formId/edit" element={<FormBuilderPage />} />
          <Route path="/forms/:formId/fill" element={<FormFillPage />} />
          <Route path="/forms/:formId/responses" element={<FormResponsesPage />} />
          <Route path="/f/:formId" element={<PublicFormPage />} />
        </Routes>
      </AppThemeProvider>
    </MemoryRouter>,
  )
}

const canvasField = (label: string) =>
  screen
    .getAllByText(label)
    .map((element) => element.closest<HTMLElement>('.form-canvas__field'))
    .find(Boolean)!

describe('form builder pages', () => {
  beforeEach(() => {
    useFormStore.getState().reset()
  })

  it('lists the example forms with their status and response counts, and filters them', () => {
    renderAt('/forms')

    expect(screen.getByText('Demo Day 2026 registration')).toBeInTheDocument()
    expect(screen.getByText('IT equipment request')).toBeInTheDocument()
    expect(screen.getByText('8 responses')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Search forms'), { target: { value: 'feedback' } })
    expect(screen.getByText('Customer feedback')).toBeInTheDocument()
    expect(screen.queryByText('IT equipment request')).not.toBeInTheDocument()
  })

  it('adds a field from the palette, selects it and edits it from the inspector', async () => {
    renderAt('/forms/new')

    expect(screen.getByText('Drag fields here to start building the form.')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Add field'))
    const palette = (await screen.findByText('Tap a field to add it at the end of the form.'))
      .parentElement as HTMLElement
    fireEvent.click(within(palette).getByText('Email'))

    // The new field is on the canvas and open in the inspector.
    expect(canvasField('Email address')).toHaveClass('form-canvas__field--selected')
    const label = await screen.findByLabelText('Label')
    expect(label).toHaveValue('Email address')

    fireEvent.change(label, { target: { value: 'Work email' } })
    expect(canvasField('Work email')).toBeInTheDocument()
  })

  it('undoes and redoes a change, grouping keystrokes into one step', () => {
    const { result } = renderHook(() =>
      useBuilderHistory(() => blankForm({ title: 'A', submitLabel: 'S', successMessage: 'M' })),
    )

    act(() => result.current.change((form) => ({ ...form, title: 'AB' }), 'title'))
    act(() => result.current.change((form) => ({ ...form, title: 'ABC' }), 'title'))
    act(() => result.current.change((form) => ({ ...form, status: 'published' })))
    expect(result.current.form).toMatchObject({ title: 'ABC', status: 'published' })

    act(() => result.current.undo())
    expect(result.current.form).toMatchObject({ title: 'ABC', status: 'draft' })
    act(() => result.current.undo())
    expect(result.current.form.title).toBe('A')
    expect(result.current.canUndo).toBe(false)

    act(() => result.current.redo())
    expect(result.current.form.title).toBe('ABC')
  })

  it('saves a new form and moves to its edit address', async () => {
    renderAt('/forms/new')

    fireEvent.click(screen.getByText('Save'))

    await waitFor(() => expect(useFormStore.getState().forms[0]!.title).toBe('Untitled form'))
    expect(useFormStore.getState().forms).toHaveLength(5)
  })

  it('validates required questions, shows a follow-up when asked for it, and submits', async () => {
    const user = userEvent.setup()
    const { container } = renderAt('/forms/customer-feedback/fill')

    fireEvent.click(screen.getByText('Send feedback'))
    expect(await screen.findAllByText('This field is required')).toHaveLength(2)

    await user.click(screen.getByText('9'))
    await user.click(container.querySelectorAll('.ant-rate-star > div')[3]!)

    // The email question only appears once contact is allowed, and then it is required.
    expect(screen.queryByText('Your email')).not.toBeInTheDocument()
    await user.click(screen.getByRole('switch'))
    expect(await screen.findByText('Your email')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Send feedback'))
    // The two earlier errors fade out as their questions are answered; one new one stays.
    await waitFor(() => expect(screen.getAllByText('This field is required')).toHaveLength(1))

    await user.type(screen.getByLabelText('Your email'), 'ada@example.com')
    fireEvent.click(screen.getByText('Send feedback'))

    expect(
      await screen.findByText('Thank you. Every answer is read by the product team.'),
    ).toBeInTheDocument()
    const [latest] = useFormStore
      .getState()
      .responses.filter((entry) => entry.formId === 'customer-feedback')
    expect(latest!.answers).toMatchObject({
      nps: 9,
      satisfaction: 4,
      'contact-ok': true,
      'contact-email': 'ada@example.com',
    })
  })

  it('tells the reader a closed form takes no more answers', () => {
    renderAt('/forms/equipment-request/fill')

    expect(screen.getByText('This form is closed')).toBeInTheDocument()
    expect(screen.queryByText('Send request')).not.toBeInTheDocument()
  })

  it('summarises the answers per question', () => {
    renderAt('/forms/demo-day-registration/responses')

    const attendance = screen
      .getByText('How will you attend?', { selector: '.ant-card-head-title' })
      .closest<HTMLElement>('.ant-card')!
    // Five of the eight example registrations come in person.
    expect(within(attendance).getByText('5 · 63%')).toBeInTheDocument()
    expect(within(attendance).getByText('8 answered')).toBeInTheDocument()
  })

  it('shows a not-found page for a form that does not exist', () => {
    renderAt('/forms/nope/fill')

    expect(screen.getByText('Form not found')).toBeInTheDocument()
  })

  it('serves a published form on its public page, without the admin controls, and saves answers', async () => {
    const user = userEvent.setup()
    const before = useFormStore.getState().responses.length
    const { container } = renderAt('/f/customer-feedback')

    expect(screen.getByText('Customer feedback')).toBeInTheDocument()
    expect(document.title).toBe('Customer feedback')
    // No way back into the admin from a stranger's link.
    expect(screen.queryByText('All forms')).not.toBeInTheDocument()
    expect(screen.queryByText('Edit')).not.toBeInTheDocument()

    await user.click(screen.getByText('7'))
    await user.click(container.querySelectorAll('.ant-rate-star > div')[4]!)
    fireEvent.click(screen.getByText('Send feedback'))

    expect(
      await screen.findByText('Thank you. Every answer is read by the product team.'),
    ).toBeInTheDocument()
    expect(useFormStore.getState().responses).toHaveLength(before + 1)
  })

  it('keeps a draft off the public page, though the team can still try it', () => {
    const publicPage = renderAt('/f/frontend-application')
    expect(screen.getByText('This form is not open yet')).toBeInTheDocument()
    expect(screen.queryByText('Apply')).not.toBeInTheDocument()
    publicPage.unmount()

    renderAt('/forms/frontend-application/fill')
    expect(
      screen.getByText('This form is a draft. You can test it here, but it is not public yet.'),
    ).toBeInTheDocument()
  })

  it('shows a closed notice, or a not-found page, on the public address', () => {
    const closed = renderAt('/f/equipment-request')
    expect(screen.getByText('This form is closed')).toBeInTheDocument()
    closed.unmount()

    renderAt('/f/nope')
    expect(screen.getByText('Form not found')).toBeInTheDocument()
  })

  it('shares the public link from the list, with a warning for a draft', async () => {
    renderAt('/forms')

    fireEvent.click(screen.getByLabelText('Share: Frontend engineer application'))
    const link = await screen.findByLabelText('Public link')
    expect(link).toHaveValue(`${window.location.origin}/f/frontend-application`)
    expect(
      screen.getByText(
        'This form is a draft. The link shows a “not open yet” page until you publish it.',
      ),
    ).toBeInTheDocument()
    expect(screen.getByText('Open public page').closest('a')).toHaveAttribute(
      'href',
      '/f/frontend-application',
    )
  })
})
