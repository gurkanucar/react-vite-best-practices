import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'
import { findRoom, hotelRooms } from '@/features/showcases/data/hotel'
import {
  availabilityFor,
  formatMoney,
  quoteStay,
  stayParams,
  type StaySearch,
} from '@/features/showcases/data/hotelBooking'
import { HotelBookingPage } from '@/features/showcases/pages/HotelBookingPage'
import { HotelLandingPage } from '@/features/showcases/pages/HotelLandingPage'
import { HotelRoomPage } from '@/features/showcases/pages/HotelRoomPage'
import { HotelRoomsPage } from '@/features/showcases/pages/HotelRoomsPage'
import { usePreferencesStore } from '@/store/preferences-store'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/preview/hotel" element={<HotelLandingPage standalone />} />
        <Route path="/preview/hotel/rooms" element={<HotelRoomsPage standalone />} />
        <Route path="/preview/hotel/rooms/:roomId" element={<HotelRoomPage standalone />} />
        <Route path="/preview/hotel/book" element={<HotelBookingPage standalone />} />
      </Routes>
    </MemoryRouter>,
  )
}

// A week in May a year ahead: never in the past, and priced at the plain season rate.
const stay: StaySearch = {
  checkIn: '2027-05-13',
  checkOut: '2027-05-16',
  adults: 2,
  children: 0,
  rooms: 1,
}
const money = (amount: number) => formatMoney(amount, 'en')
const cardOf = (name: string) =>
  screen
    .getAllByText(name)
    .map((element) => element.closest<HTMLElement>('.hotel-result'))
    .find(Boolean)!

/*
 * jsdom matches no media query, so these run the phone layout: the filters are in a drawer.
 * Controls are found by text and label; role queries are slow over antd trees this size.
 */
describe('hotel showcase', () => {
  beforeEach(() => {
    usePreferencesStore.getState().setLanguage('en')
  })

  it('searches from the landing page and lands on the rooms for that stay', async () => {
    renderAt('/preview/hotel')

    expect(screen.getByText('Slow mornings on the Aegean.')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Search'))

    expect(await screen.findByText('Choose your room')).toBeInTheDocument()
    expect(screen.getByText(/3 nights,/)).toBeInTheDocument()
  })

  it('lists every room with its price for the stay and marks the ones that cannot be booked', () => {
    renderAt(`/preview/hotel/rooms?${stayParams(stay)}`)
    const open = hotelRooms.filter((room) => availabilityFor(room, stay).available)
    const full = hotelRooms.filter((room) => availabilityFor(room, stay).reason === 'soldOut')
    // The seeded availability has both kinds for this stay.
    expect(open.length).toBeGreaterThan(0)
    expect(full.length).toBeGreaterThan(0)

    for (const room of open) {
      expect(
        within(cardOf(room.name.en)).getByText(money(quoteStay(room, stay).averageNightly)),
      ).toBeInTheDocument()
    }
    for (const room of full) {
      expect(
        within(cardOf(room.name.en)).getAllByText('Sold out for these dates'),
      ).not.toHaveLength(0)
    }
  })

  it('tells a room that is too small for the party apart from one that is sold out', () => {
    renderAt(`/preview/hotel/rooms?${stayParams({ ...stay, adults: 3 })}`)

    expect(within(cardOf('Garden Double')).getByText('Sleeps up to 2 per room')).toBeInTheDocument()
  })

  it('filters the rooms by view', async () => {
    renderAt(`/preview/hotel/rooms?${stayParams(stay)}`)

    fireEvent.click(screen.getByText('Filters'))
    const drawer = (await screen.findByText('Only show rooms I can book')).closest<HTMLElement>(
      '.hotel-filters',
    )!
    fireEvent.click(within(drawer).getByText('Garden view'))

    expect(cardOf('Garden Double')).toBeInTheDocument()
    expect(screen.queryByText('Cliff Villa')).not.toBeInTheDocument()
    expect(screen.getByText(/^1 room ·/)).toBeInTheDocument()
  })

  it('explains when a link’s dates cannot be used', () => {
    renderAt('/preview/hotel/rooms?checkIn=2020-01-01&checkOut=2020-01-04')

    expect(
      screen.getByText('Those dates have passed, so we are showing our next available dates.'),
    ).toBeInTheDocument()
  })

  it('prices a room by rate plan', () => {
    const room = findRoom('garden-double')!
    renderAt(`/preview/hotel/rooms/garden-double?${stayParams(stay)}`)

    const total = () => screen.getByTestId('hotel-total')
    expect(total()).toHaveTextContent(money(quoteStay(room, stay).total))
    expect(screen.getByText('Free cancellation until 10 May 2027')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Non-refundable'))
    expect(total()).toHaveTextContent(money(quoteStay(room, stay, 'nonRefundable').total))
    expect(screen.getByText('No free cancellation')).toBeInTheDocument()
  })

  it('shows a not-found page for a room that does not exist', () => {
    renderAt(`/preview/hotel/rooms/penthouse?${stayParams(stay)}`)

    expect(screen.getByText('Room not found')).toBeInTheDocument()
  })

  it('sends a booking link without a room back to the rooms', () => {
    renderAt(`/preview/hotel/book?${stayParams(stay)}`)

    expect(screen.getByText('Let’s start with a room')).toBeInTheDocument()
    expect(screen.getByText('Browse rooms')).toBeInTheDocument()
  })

  it('books a room: extras, guest details, a checked demo card and a confirmation', async () => {
    const room = findRoom('garden-double')!
    renderAt(`/preview/hotel/book?${stayParams(stay, { room: 'garden-double', plan: 'flexible' })}`)

    fireEvent.click(screen.getByText('Breakfast on the terrace'))
    expect(screen.getByTestId('hotel-total')).toHaveTextContent(
      money(quoteStay(room, stay, 'flexible', ['breakfast']).total),
    )
    fireEvent.click(screen.getByText('Continue'))

    // Guest details are checked before moving on.
    fireEvent.click(await screen.findByText('Continue'))
    expect(await screen.findByText('Enter your first name.')).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('First name'), { target: { value: 'Ada' } })
    fireEvent.change(screen.getByLabelText('Last name'), { target: { value: 'Lovelace' } })
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'ada@example.com' } })
    fireEvent.change(screen.getByLabelText('Mobile phone'), {
      target: { value: '+44 20 7946 0000' },
    })
    fireEvent.mouseDown(screen.getByLabelText('Country of residence'))
    fireEvent.click(await screen.findByText('Germany'))
    fireEvent.click(screen.getByText('Continue'))

    // A card number that fails the checksum is refused.
    fireEvent.change(await screen.findByLabelText('Name on card'), {
      target: { value: 'Ada Lovelace' },
    })
    fireEvent.change(screen.getByLabelText('Card number'), {
      target: { value: '4242424242424241' },
    })
    fireEvent.change(screen.getByLabelText('Expiry (MM/YY)'), { target: { value: '1239' } })
    fireEvent.change(screen.getByLabelText('CVC'), { target: { value: '123' } })
    fireEvent.click(screen.getByText('I accept the booking and cancellation conditions.'))
    fireEvent.click(screen.getByText(/^Pay /))
    expect(await screen.findByText('Enter a valid card number.')).toBeInTheDocument()
    expect(screen.getByLabelText('Expiry (MM/YY)')).toHaveValue('12/39')

    fireEvent.change(screen.getByLabelText('Card number'), {
      target: { value: '4242424242424242' },
    })
    expect(screen.getByLabelText('Card number')).toHaveValue('4242 4242 4242 4242')
    fireEvent.click(screen.getByText(/^Pay /))

    expect(await screen.findByText('You are booked!', {}, { timeout: 3000 })).toBeInTheDocument()
    expect(screen.getByText(/We have sent the confirmation to ada@example.com/)).toBeInTheDocument()
    await waitFor(() => expect(screen.getByText(/^KB-[0-9A-Z]{7}$/)).toBeInTheDocument())
    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument()
  })
})
