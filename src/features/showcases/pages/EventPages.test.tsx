import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useConfAgenda } from '@/features/showcases/hooks/useConfAgenda'
import { EventHomePage } from '@/features/showcases/pages/EventHomePage'
import { EventSchedulePage } from '@/features/showcases/pages/EventSchedulePage'
import { EventSpeakerPage } from '@/features/showcases/pages/EventSpeakerPage'
import { EventSpeakersPage } from '@/features/showcases/pages/EventSpeakersPage'
import { EventTicketsPage } from '@/features/showcases/pages/EventTicketsPage'
import { usePreferencesStore } from '@/store/preferences-store'
import { AppThemeProvider } from '@/theme/AppThemeProvider'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppThemeProvider>
        <Routes>
          <Route path="/preview/event" element={<EventHomePage standalone />} />
          <Route path="/preview/event/schedule" element={<EventSchedulePage standalone />} />
          <Route path="/preview/event/speakers" element={<EventSpeakersPage standalone />} />
          <Route
            path="/preview/event/speakers/:speakerId"
            element={<EventSpeakerPage standalone />}
          />
          <Route path="/preview/event/tickets" element={<EventTicketsPage standalone />} />
          <Route path="/showcases/event" element={<EventHomePage />} />
        </Routes>
      </AppThemeProvider>
    </MemoryRouter>,
  )
}

const SEPT_28 = Date.UTC(2026, 8, 28, 9)

/*
 * jsdom matches no media query, so the program is the phone's list view. Controls are found by
 * label or text, because role queries over antd trees are slow in jsdom.
 */
describe('conference showcase', () => {
  beforeEach(() => {
    usePreferencesStore.getState().setLanguage('en')
    useConfAgenda.getState().clear()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('counts down to the doors opening, second by second', () => {
    vi.useFakeTimers({ toFake: ['Date', 'setInterval', 'clearInterval'] })
    // Exactly one day before 09:30 in Istanbul on 18 November.
    vi.setSystemTime(Date.UTC(2026, 10, 17, 6, 30))
    const { container } = renderAt('/preview/event')

    expect(screen.getByText('Where frontend meets product.')).toBeInTheDocument()
    const units = () =>
      [...container.querySelectorAll('.conf-countdown__unit strong')].map(
        (unit) => unit.textContent,
      )
    expect(units()).toEqual(['01', '00', '00', '00'])

    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(units()).toEqual(['00', '23', '59', '59'])
  })

  it('keeps the admin preview frame outside the standalone site', () => {
    renderAt('/showcases/event')

    expect(screen.getByText('Open in a new tab').closest('a')).toHaveAttribute(
      'href',
      '/preview/event',
    )
  })

  it('warns when two starred sessions overlap and lists them in the agenda', async () => {
    renderAt('/preview/event/schedule?day=1')

    fireEvent.click(
      screen.getByLabelText('Add to my agenda: React Server Components after the hype'),
    )
    fireEvent.click(screen.getByLabelText('Add to my agenda: Designing calm software'))
    expect(useConfAgenda.getState().starred).toEqual(['d1-rsc', 'd1-calm-software'])

    fireEvent.click(screen.getByText('My agenda (2)'))
    expect(
      await screen.findByText(
        '1 pair of sessions in your agenda overlap. You can only be in one room at a time.',
      ),
    ).toBeInTheDocument()
    expect(screen.getByText('Clashes with “Designing calm software”')).toBeInTheDocument()
    expect(
      screen.getByText('Clashes with “React Server Components after the hype”'),
    ).toBeInTheDocument()
  })

  it('exports the agenda as an .ics file', async () => {
    const created: Blob[] = []
    URL.createObjectURL = vi.fn<(blob: Blob) => string>((blob) => {
      created.push(blob)
      return 'blob:agenda'
    })
    URL.revokeObjectURL = vi.fn<(url: string) => void>()
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
    useConfAgenda.getState().add(['d1-rsc', 'd2-motion'])
    renderAt('/preview/event/schedule?view=agenda')

    fireEvent.click(screen.getByText('Export agenda (.ics)'))

    expect(click).toHaveBeenCalled()
    const ics = await created[0]!.text()
    expect(ics.match(/BEGIN:VEVENT/g)).toHaveLength(2)
    expect(ics).toContain('SUMMARY:Motion with meaning')
    click.mockRestore()
  })

  it('filters the program from the address', () => {
    renderAt('/preview/event/schedule?day=2&track=ai')

    expect(screen.getByText('4 sessions match')).toBeInTheDocument()
    expect(screen.getByText('Guardrails in the interface')).toBeInTheDocument()
    expect(screen.queryByText('Motion with meaning')).toBeNull()
    // Breaks stay, so the day keeps its shape.
    expect(screen.getByText('Lunch')).toBeInTheDocument()
  })

  it('offers to add a shared agenda to your own', async () => {
    renderAt('/preview/event/schedule?view=agenda&agenda=d1-rsc,d2-motion,nope')

    expect(screen.getByText('Someone shared an agenda with 2 sessions.')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Add them to my agenda'))

    await waitFor(() => expect(useConfAgenda.getState().starred).toEqual(['d1-rsc', 'd2-motion']))
    expect(screen.queryByText('Someone shared an agenda with 2 sessions.')).toBeNull()
  })

  it('opens a session from the address in the details drawer', async () => {
    renderAt('/preview/event/schedule?day=1&session=d1-ai-panel')

    expect(
      await screen.findByText(
        'Engineers, a product lead and a VP on where responsibility sits when an AI feature fails a user.',
      ),
    ).toBeInTheDocument()
    expect(screen.getByText('Add to calendar')).toBeInTheDocument()
    expect(screen.getAllByText('Omar Haddad').length).toBeGreaterThan(0)
  })

  it('shows what is on now during the event', () => {
    renderAt('/preview/event/schedule?now=2026-11-19T10:30')

    const banner = document.querySelector<HTMLElement>('.conf-live')!
    expect(within(banner).getByText('Live now')).toBeInTheDocument()
    expect(within(banner).getByText('Lightning: Embeddings in ten minutes')).toBeInTheDocument()
  })

  it('searches and filters the speakers', () => {
    renderAt('/preview/event/speakers?track=ai')
    expect(screen.getByText('3 speakers')).toBeInTheDocument()
    expect(screen.queryByText('Elif Sancak')).toBeNull()

    fireEvent.change(screen.getByLabelText('Search by name or company'), {
      target: { value: 'quill' },
    })
    expect(screen.getByText('1 speaker')).toBeInTheDocument()
    expect(screen.getByText('Omar Haddad')).toBeInTheDocument()
  })

  it('shows a speaker with their sessions, or a not-found page', () => {
    const page = renderAt('/preview/event/speakers/priya-raman')
    expect(screen.getByText('Priya Raman', { selector: 'h1' })).toBeInTheDocument()
    expect(screen.getByText('Accessible by default, not by audit')).toBeInTheDocument()
    expect(screen.getByText('Design systems clinic')).toBeInTheDocument()
    page.unmount()

    renderAt('/preview/event/speakers/nobody')
    expect(screen.getByText('Speaker not found')).toBeInTheDocument()
  })

  it('sells tickets: promo code, attendee names, a demo payment and a badge each', async () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(SEPT_28)
    const { container } = renderAt('/preview/event/tickets')

    expect(screen.getByText('Until 15 October')).toBeInTheDocument()
    expect(screen.getByText('Sold out')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Regular quantity'), { target: { value: '2' } })
    fireEvent.change(screen.getByLabelText('Promo code'), { target: { value: 'nope' } })
    fireEvent.click(screen.getByText('Apply'))
    expect(screen.getByText('That code does not exist.')).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Promo code'), { target: { value: 'relay10' } })
    fireEvent.click(screen.getByText('Apply'))
    expect(screen.getByText('RELAY10 applied')).toBeInTheDocument()
    expect(screen.getByText('−₺780')).toBeInTheDocument()
    expect(screen.getByText('₺7,020')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Continue'))
    expect(await screen.findByText('Attendee 1 · Regular')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Continue'))
    expect(await screen.findAllByText('Full name is required.')).toHaveLength(2)

    fireEvent.click(screen.getByText('Fill in sample attendees'))
    fireEvent.click(screen.getByText('Continue'))
    const cardNumber = await screen.findByLabelText('Card number')
    fireEvent.change(screen.getByLabelText('Name on card'), { target: { value: 'Ada Yılmaz' } })
    fireEvent.change(cardNumber, { target: { value: '4242424242424241' } })
    fireEvent.change(screen.getByLabelText('Expiry (MM/YY)'), { target: { value: '1230' } })
    fireEvent.change(screen.getByLabelText('CVC'), { target: { value: '123' } })
    const pay = () => fireEvent.click(container.querySelector('.conf-summary .ant-btn-primary')!)
    pay()
    expect(await screen.findByText('This card number is not valid.')).toBeInTheDocument()

    fireEvent.change(cardNumber, { target: { value: '4242424242424242' } })
    expect(cardNumber).toHaveValue('4242 4242 4242 4242')
    pay()

    expect(await screen.findByText('You are going to Relay Summit!')).toBeInTheDocument()
    expect(container.querySelectorAll('.conf-badge')).toHaveLength(2)
    expect(screen.getByText('Ada Yılmaz')).toBeInTheDocument()
    expect(screen.getByText('Mert Kaya')).toBeInTheDocument()
  })
})
