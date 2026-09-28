import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import dayjs from 'dayjs'
import { MemoryRouter, Route, Routes } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'
import { findHall, findMovie, scheduleFor, type Showtime } from '@/features/showcases/data/cinema'
import { seatMapFor, takenSeats } from '@/features/showcases/data/cinemaBooking'
import { useCinemaTickets } from '@/features/showcases/hooks/useCinemaTickets'
import { CinemaBookingPage } from '@/features/showcases/pages/CinemaBookingPage'
import { CinemaHomePage } from '@/features/showcases/pages/CinemaHomePage'
import { CinemaMoviePage } from '@/features/showcases/pages/CinemaMoviePage'
import { CinemaTicketsPage } from '@/features/showcases/pages/CinemaTicketsPage'
import { usePreferencesStore } from '@/store/preferences-store'
import { AppThemeProvider } from '@/theme/AppThemeProvider'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppThemeProvider>
        <Routes>
          <Route path="/preview/cinema" element={<CinemaHomePage standalone />} />
          <Route path="/preview/cinema/movies/:movieId" element={<CinemaMoviePage standalone />} />
          <Route
            path="/preview/cinema/book/:showtimeId"
            element={<CinemaBookingPage standalone />}
          />
          <Route path="/preview/cinema/tickets" element={<CinemaTicketsPage standalone />} />
        </Routes>
      </AppThemeProvider>
    </MemoryRouter>,
  )
}

/*
 * The programme is built from today's date, so the tests read tomorrow's from the same data
 * the pages use rather than hard-coding a day. Seats are found by their `data-seat` id: the
 * map has hundreds of buttons, and role queries over it are slow in jsdom.
 */
const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD')
const tomorrowShows = () => scheduleFor(tomorrow)

/** An evening showing in a full-size hall, with free seats in both of its first two blocks. */
function eveningShow(): Showtime {
  return tomorrowShows().find(
    (show) => show.time >= '19:00' && findHall(show.hallId)?.layout === 'standard',
  )!
}

const seat = (container: HTMLElement, id: string) =>
  container.querySelector<HTMLButtonElement>(`[data-seat="${id}"]`)!

describe('cinema showcase', () => {
  beforeEach(() => {
    usePreferencesStore.getState().setLanguage('en')
    useCinemaTickets.getState().reset()
  })

  it('lists the day’s films and narrows them to one format from the address', () => {
    renderAt(`/preview/cinema?date=${tomorrow}&format=IMAX`)

    expect(screen.getAllByText('Northern Drift').length).toBeGreaterThan(0)
    const imaxFilms = new Set(
      tomorrowShows()
        .filter((show) => show.format === 'IMAX')
        .map((show) => findMovie(show.movieId)!.title.en),
    )
    const listed = [...document.querySelectorAll('.cinema-film__title h3')].map(
      (heading) => heading.textContent,
    )
    expect(new Set(listed)).toEqual(imaxFilms)
    // Copper Hills is only ever shown in 2D.
    expect(listed).not.toContain('Copper Hills')
    expect(screen.getByText('Coming soon', { selector: 'h2' })).toBeInTheDocument()
  })

  it('shows a film with its cast and a trailer, and a not-found page for an unknown one', async () => {
    const page = renderAt('/preview/cinema/movies/signal-lost')

    expect(screen.getByText('Signal Lost', { selector: 'h1' })).toBeInTheDocument()
    expect(screen.getByText('Julian Ferro')).toBeInTheDocument()
    expect(screen.getByText('Priya Castell')).toBeInTheDocument()
    fireEvent.click(screen.getByLabelText('Play the trailer for Signal Lost'))
    expect(
      await screen.findByText('The trailer is a placeholder in this demo.'),
    ).toBeInTheDocument()
    page.unmount()

    renderAt('/preview/cinema/movies/nope')
    expect(screen.getByText('Film not found')).toBeInTheDocument()
  })

  it('picks seats on the map, holds them, adds snacks and pays for an e-ticket', async () => {
    const show = eveningShow()
    const taken = takenSeats(show)
    const free = seatMapFor(show).seats.filter(
      (item) => item.type === 'standard' && !taken.has(item.id),
    )
    const [first, second] = free
    const { container } = renderAt(`/preview/cinema/book/${show.id}`)

    fireEvent.click(seat(container, first!.id))
    fireEvent.click(seat(container, second!.id))
    expect(seat(container, first!.id)).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('2 seats')).toBeInTheDocument()

    // A seat someone else bought cannot be picked. An evening showing always has some.
    const soldId = [...taken][0]!
    fireEvent.click(seat(container, soldId))
    expect(seat(container, soldId)).toHaveAttribute('aria-pressed', 'false')
    expect(seat(container, soldId)).toHaveAttribute('aria-disabled', 'true')

    fireEvent.click(screen.getByText('Continue'))
    expect(await screen.findByText('Who is each seat for?')).toBeInTheDocument()
    expect(screen.getByText('10:00')).toBeInTheDocument()
    fireEvent.click(screen.getByLabelText('Add one Popcorn menu'))
    expect(screen.getByText('1 × Popcorn menu')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Continue'))
    fireEvent.change(await screen.findByLabelText('Email for your tickets'), {
      target: { value: 'ada@example.com' },
    })
    fireEvent.change(screen.getByLabelText('Mobile number'), { target: { value: '05321234567' } })
    fireEvent.change(screen.getByLabelText('Name on card'), { target: { value: 'Ada Lovelace' } })
    fireEvent.change(screen.getByLabelText('Card number'), {
      target: { value: '4242424242424242' },
    })
    fireEvent.change(screen.getByLabelText('Expiry (MM/YY)'), { target: { value: '12/39' } })
    fireEvent.change(screen.getByLabelText('CVC'), { target: { value: '123' } })
    fireEvent.click(
      screen.getByText('I accept the ticket terms: no refunds within two hours of the showing.'),
    )
    fireEvent.click(screen.getByText(/^Pay /))

    expect(await screen.findByText('Enjoy the film!', {}, { timeout: 3000 })).toBeInTheDocument()
    const [booking] = useCinemaTickets.getState().bookings
    expect(booking!.showtimeId).toBe(show.id)
    expect(booking!.lines.map((line) => line.seatId)).toEqual([first!.id, second!.id])
    expect(booking!.snacks).toEqual({ 'popcorn-menu': 1 })
    expect(screen.getByText(booking!.code)).toBeInTheDocument()
    expect(screen.getByLabelText(`QR code for booking ${booking!.code}`)).toBeInTheDocument()
  })

  it('refuses to take payment without valid card details', async () => {
    const show = eveningShow()
    const taken = takenSeats(show)
    const free = seatMapFor(show).seats.find((item) => !taken.has(item.id) && !item.pairId)!
    const { container } = renderAt(`/preview/cinema/book/${show.id}`)

    fireEvent.click(seat(container, free.id))
    fireEvent.click(screen.getByText('Continue'))
    fireEvent.click(await screen.findByText('Continue'))
    fireEvent.change(await screen.findByLabelText('Card number'), {
      target: { value: '4242424242424241' },
    })
    fireEvent.click(screen.getByText(/^Pay /))

    expect(await screen.findByText('Enter a valid card number.')).toBeInTheDocument()
    expect(screen.getByText('Accept the terms to continue.')).toBeInTheDocument()
    expect(useCinemaTickets.getState().bookings).toHaveLength(2)
  })

  it('selects both halves of a couple seat together', () => {
    const show = eveningShow()
    const taken = takenSeats(show)
    const pair = seatMapFor(show).seats.find(
      (item) => item.pairId === item.id && !taken.has(item.id),
    )!
    const { container } = renderAt(`/preview/cinema/book/${show.id}`)

    fireEvent.click(seat(container, pair.id))
    const halves = container.querySelectorAll('.cinema-seat.is-selected')
    expect(halves).toHaveLength(2)
    expect(screen.getByText('2 seats')).toBeInTheDocument()
  })

  it('says when a showing has started or does not exist', () => {
    const yesterday = scheduleFor(dayjs().subtract(1, 'day').format('YYYY-MM-DD'))[0]!
    const started = renderAt(`/preview/cinema/book/${yesterday.id}`)
    expect(screen.getByText('This showing has started')).toBeInTheDocument()
    started.unmount()

    renderAt('/preview/cinema/book/moda-1-19990101-1200x')
    expect(screen.getByText('Showing not found')).toBeInTheDocument()
  })

  it('lists my tickets, shows the e-ticket and cancels an upcoming booking', async () => {
    const { container } = renderAt('/preview/cinema/tickets')
    const [upcoming] = useCinemaTickets
      .getState()
      .bookings.filter((booking) => !booking.cancelledAt && booking.date === tomorrow)

    expect(screen.getByText('Upcoming (1)')).toBeInTheDocument()
    expect(screen.getByText('Past (1)')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Show e-ticket'))
    expect(
      await screen.findByLabelText(`QR code for booking ${upcoming!.code}`),
    ).toBeInTheDocument()

    fireEvent.click(
      within(container.querySelector<HTMLElement>('.cinema-booking-card')!).getByText(
        'Cancel booking',
      ),
    )
    const confirm = await screen.findByText('Cancel this booking?')
    fireEvent.click(
      within(confirm.closest<HTMLElement>('.ant-popover')!).getByText('Cancel booking'),
    )

    await waitFor(() =>
      expect(
        useCinemaTickets.getState().bookings.find((booking) => booking.code === upcoming!.code)
          ?.cancelledAt,
      ).toBeDefined(),
    )
    expect(screen.getByText('Upcoming (0)')).toBeInTheDocument()
    expect(screen.getByText('Past (2)')).toBeInTheDocument()
  })
})
