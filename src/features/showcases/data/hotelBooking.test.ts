import dayjs from 'dayjs'
import { describe, expect, it } from 'vitest'
import {
  availabilityFor,
  bookingReference,
  expiryValid,
  formatCardNumber,
  freeCancellationUntil,
  luhnValid,
  nightlyRate,
  nightsOf,
  quoteStay,
  readStay,
  roomsLeft,
  stayDates,
  type PricedRoom,
  type StaySearch,
} from '@/features/showcases/data/hotelBooking'

const room: PricedRoom = { id: 'test', baseRate: 100, maxGuests: 2, inventory: 3, demand: 0 }
// Thursday to Sunday in May, when the season factor is 1: Thu, Fri and Sat nights.
const stay: StaySearch = {
  checkIn: '2027-05-13',
  checkOut: '2027-05-16',
  adults: 2,
  children: 0,
  rooms: 1,
}
const today = dayjs('2026-09-28')

describe('hotel booking rules', () => {
  it('counts nights by the evening they start on', () => {
    expect(nightsOf(stay)).toBe(3)
    expect(stayDates(stay)).toEqual(['2027-05-13', '2027-05-14', '2027-05-15'])
  })

  it('charges more on Friday and Saturday nights and in high summer', () => {
    expect(nightlyRate(room, '2027-05-13')).toBe(100)
    expect(nightlyRate(room, '2027-05-14')).toBe(120)
    expect(nightlyRate(room, '2027-07-05')).toBe(130)
    expect(nightlyRate(room, '2027-01-11')).toBe(80)
  })

  it('adds up a stay: discount, extras, VAT on both and a flat city tax', () => {
    expect(quoteStay(room, stay)).toMatchObject({
      roomTotal: 340,
      discount: 0,
      vat: 34,
      cityTax: 6,
      total: 380,
      averageNightly: 113,
    })

    // 12% off the room only; the city tax is not discounted.
    expect(quoteStay(room, stay, 'nonRefundable')).toMatchObject({
      discount: 41,
      vat: 30,
      total: 335,
    })

    // Breakfast is per guest per night (22 × 2 × 3), the transfer per booking.
    const withExtras = quoteStay(room, stay, 'flexible', ['breakfast', 'transfer'])
    expect(withExtras.extras).toEqual([
      { extra: 'breakfast', amount: 132 },
      { extra: 'transfer', amount: 90 },
    ])
    expect(withExtras.total).toBe(340 + 222 + 56 + 6)

    expect(quoteStay(room, { ...stay, rooms: 2 }).roomTotal).toBe(680)
  })

  it('reads a stay from a link, and falls back with a reason when it cannot be booked', () => {
    const read = (query: string) => readStay(new URLSearchParams(query), today)

    expect(read('checkIn=2027-05-13&checkOut=2027-05-16&adults=3&children=1&rooms=2')).toEqual({
      stay: { checkIn: '2027-05-13', checkOut: '2027-05-16', adults: 3, children: 1, rooms: 2 },
    })
    expect(read('').issue).toBe('missing')
    expect(read('checkIn=2027-02-30&checkOut=2027-03-02').issue).toBe('invalid')
    expect(read('checkIn=2027-05-16&checkOut=2027-05-13').issue).toBe('invalid')
    expect(read('checkIn=2026-09-01&checkOut=2026-09-03').issue).toBe('past')
    expect(read('checkIn=2027-05-01&checkOut=2027-06-01').issue).toBe('tooLong')
    // Guest counts are clamped rather than rejected.
    expect(read('checkIn=2027-05-13&checkOut=2027-05-16&adults=99&rooms=0').stay).toMatchObject({
      adults: 8,
      rooms: 1,
    })
    // The fallback is three weeks out, for three nights.
    expect(read('').stay).toMatchObject({ checkIn: '2026-10-19', checkOut: '2026-10-22' })
  })

  it('decides availability the same way every time, and explains a refusal', () => {
    expect(roomsLeft(room, '2027-05-13')).toBe(roomsLeft(room, '2027-05-13'))
    expect(availabilityFor(room, stay).available).toBe(true)

    const full = availabilityFor({ ...room, demand: 100 }, stay)
    expect(full).toMatchObject({ available: false, reason: 'soldOut', left: 0 })
    expect(full.soldOutNights).toHaveLength(3)

    expect(availabilityFor(room, { ...stay, adults: 3 })).toMatchObject({
      available: false,
      reason: 'capacity',
    })
  })

  it('allows free cancellation until the end of the day three days before arrival', () => {
    expect(freeCancellationUntil(stay, 'flexible', today)?.format('YYYY-MM-DD HH:mm')).toBe(
      '2027-05-10 23:59',
    )
    expect(freeCancellationUntil(stay, 'nonRefundable', today)).toBeNull()
    expect(freeCancellationUntil(stay, 'flexible', dayjs('2027-05-12'))).toBeNull()
  })

  it('checks demo card details', () => {
    expect(formatCardNumber('4242424242424242')).toBe('4242 4242 4242 4242')
    expect(luhnValid('4242 4242 4242 4242')).toBe(true)
    expect(luhnValid('4242 4242 4242 4241')).toBe(false)
    expect(expiryValid('12/30', today)).toBe(true)
    expect(expiryValid('09/26', today)).toBe(true)
    expect(expiryValid('08/26', today)).toBe(false)
    expect(expiryValid('13/30', today)).toBe(false)
    expect(bookingReference('a')).toMatch(/^KB-[0-9A-Z]{7}$/)
  })
})
