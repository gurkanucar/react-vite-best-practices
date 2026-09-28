import dayjs from 'dayjs'
import { describe, expect, it } from 'vitest'
import {
  findHall,
  findShowtime,
  matchesFilters,
  movies,
  scheduleFor,
  type Showtime,
} from '@/features/showcases/data/cinema'
import {
  bookedSeats,
  buildSeatMap,
  canCancel,
  childAllowed,
  createBooking,
  formatCountdown,
  holdSecondsLeft,
  occupancyRate,
  quoteBooking,
  singleSeatGaps,
  takenSeats,
  ticketPrice,
  toggleSeat,
} from '@/features/showcases/data/cinemaBooking'

// A Monday morning, so "today" and the week ahead never depend on when the tests run.
const today = dayjs('2026-10-05T09:00')
const date = '2026-10-06'

const show = (overrides: Partial<Showtime> = {}): Showtime => ({
  id: 'moda-3-20261006-2030',
  movieId: 'copper-hills',
  cinemaId: 'moda',
  hallId: 'moda-3',
  date,
  time: '20:30',
  format: '2D',
  audio: 'sub',
  ...overrides,
})

describe('cinema schedule', () => {
  it('builds the same day every time, in start order, and finds a showing by its id', () => {
    const first = scheduleFor(date, today)
    expect(scheduleFor(date, today)).toEqual(first)
    expect(first.map((item) => item.time)).toEqual([...first.map((item) => item.time)].sort())

    const picked = first[Math.floor(first.length / 2)]!
    expect(findShowtime(picked.id, today)).toEqual(picked)
    expect(findShowtime('moda-3-20261006-0415', today)).toBeUndefined()
    expect(findShowtime('not-an-id', today)).toBeUndefined()
  })

  it('only shows a film in a hall that has its format, between opening and 23:15', () => {
    const shows = scheduleFor(date, today).map((item) => ({
      item,
      hall: findHall(item.hallId)!,
      movie: movies.find((film) => film.id === item.movieId)!,
    }))
    expect(shows.every(({ hall, movie }) => movie.formats.includes(hall.format))).toBe(true)
    expect(shows.every(({ item }) => item.time >= '10:45' && item.time <= '23:15')).toBe(true)
    expect(
      shows
        .filter(({ movie }) => movie.originalLanguage === 'tr')
        .every(({ item }) => item.audio === 'turkish'),
    ).toBe(true)
    expect(
      shows.filter(({ hall }) => hall.format === 'IMAX').every(({ item }) => item.audio === 'sub'),
    ).toBe(true)
  })

  it('keeps a coming-soon film off the schedule until it opens', () => {
    const shows = (day: string) =>
      scheduleFor(day, today).filter((item) => item.movieId === 'glass-garden')
    expect(shows('2026-10-07')).toHaveLength(0)
    expect(shows('2026-10-08').length).toBeGreaterThan(0)
  })

  it('treats a Turkish film as Turkish audio, and only foreign films as subtitled', () => {
    const filters = { cinema: 'all', formats: [] }
    expect(matchesFilters(show({ audio: 'turkish' }), { ...filters, audio: 'turkish' })).toBe(true)
    expect(matchesFilters(show({ audio: 'dub' }), { ...filters, audio: 'turkish' })).toBe(true)
    expect(matchesFilters(show({ audio: 'sub' }), { ...filters, audio: 'turkish' })).toBe(false)
    expect(matchesFilters(show({ audio: 'turkish' }), { ...filters, audio: 'subtitled' })).toBe(
      false,
    )
    expect(matchesFilters(show(), { cinema: 'levent', formats: [], audio: 'all' })).toBe(false)
    expect(matchesFilters(show(), { cinema: 'all', formats: ['IMAX'], audio: 'all' })).toBe(false)
  })
})

describe('seat map', () => {
  const map = buildSeatMap('standard')

  it('numbers seats across the row, skipping aisles, and pairs couple seats', () => {
    expect(map.rows).toHaveLength(10)
    expect(map.columns).toBe(24)
    const rowA = map.seats.filter((seat) => seat.row === 'A')
    expect(rowA.map((seat) => seat.id).slice(0, 4)).toEqual(['A1', 'A2', 'A3', 'A4'])
    expect(rowA[0]!.type).toBe('wheelchair')
    expect(rowA[2]!.type).toBe('standard')

    const couples = map.seats.filter((seat) => seat.row === 'J')
    expect(couples[0]!.pairId).toBe('J1')
    expect(couples[1]!.pairId).toBe('J1')
    expect(couples[2]!.pairId).toBe('J3')
  })

  it('fills the same seats for every visitor, and sells a couple seat whole', () => {
    const evening = show()
    const taken = takenSeats(evening, today)
    expect(takenSeats(evening, today)).toEqual(taken)
    for (const seat of map.seats.filter((item) => item.pairId === item.id)) {
      const other = map.seats.find((item) => item.pairId === seat.id && item.id !== seat.id)!
      expect(taken.has(seat.id)).toBe(taken.has(other.id))
    }
    const rate = occupancyRate(evening, today)
    expect(rate).toBeGreaterThan(0)
    expect(rate).toBeLessThan(0.95)
  })

  it('selects both halves of a couple seat, refuses taken seats and stops at ten', () => {
    const none = new Set<string>()
    expect(toggleSeat(map, [], 'J2', none).selected).toEqual(['J1', 'J2'])
    expect(toggleSeat(map, ['J1', 'J2'], 'J1', none).selected).toEqual([])
    expect(toggleSeat(map, [], 'C3', new Set(['C3']))).toEqual({ selected: [], error: 'taken' })

    const nine = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'E1', 'E2', 'E3']
    expect(toggleSeat(map, nine, 'E4', none).selected).toHaveLength(10)
    expect(toggleSeat(map, nine, 'J1', none).error).toBe('max')
    // Kept in the hall's order, not the order they were clicked.
    expect(toggleSeat(map, ['C5'], 'C2', none).selected).toEqual(['C2', 'C5'])
  })

  it('warns about a single empty seat left beside the selection', () => {
    // Row C's left block is C1–C6. With C1 sold, taking C3 strands C2.
    expect(singleSeatGaps(map, ['C3'], new Set(['C1']))).toEqual(['C2'])
    expect(singleSeatGaps(map, ['C2', 'C3'], new Set(['C1']))).toEqual([])
    // A seat at the aisle end counts too.
    expect(singleSeatGaps(map, ['C5'], new Set())).toEqual(['C6'])
    // C2, stranded by other people, is not the visitor's to fix; C4 and C6 are.
    expect(singleSeatGaps(map, ['C5'], new Set(['C1', 'C3']))).toEqual(['C4', 'C6'])
  })
})

describe('cinema prices', () => {
  it('prices by format, seat, ticket type and matinee, rounded to ₺5', () => {
    expect(ticketPrice({ format: 'IMAX', time: '20:00' }, 'standard')).toBe(390)
    expect(ticketPrice({ format: '2D', time: '20:00' }, 'vip')).toBe(350)
    expect(ticketPrice({ format: '2D', time: '20:00' }, 'vip', 'student')).toBe(280)
    // 260 less the 20% matinee discount is 208, which rounds to 210.
    expect(ticketPrice({ format: '2D', time: '11:30' }, 'standard')).toBe(210)
    expect(ticketPrice({ format: '3D', time: '19:00' }, 'standard', 'child')).toBe(215)
  })

  it('allows child tickets only for films a child may see', () => {
    expect(childAllowed('G')).toBe(true)
    expect(childAllowed('7+')).toBe(true)
    expect(childAllowed('13+')).toBe(false)
  })

  it('adds tickets, snacks and a fee per ticket', () => {
    const map = buildSeatMap('standard')
    const quote = quoteBooking(
      show(),
      map,
      ['F7', 'F8'],
      { F8: 'student' },
      { 'popcorn-menu': 2, water: 0 },
    )
    expect(quote.lines.map((line) => line.price)).toEqual([350, 280])
    expect(quote.snacks).toBe(420)
    expect(quote.fee).toBe(20)
    expect(quote.total).toBe(350 + 280 + 420 + 20)
  })
})

describe('holds and bookings', () => {
  it('counts the hold down to zero and never below', () => {
    expect(holdSecondsLeft(10_000, 0)).toBe(10)
    expect(holdSecondsLeft(10_000, 9_001)).toBe(1)
    expect(holdSecondsLeft(10_000, 12_000)).toBe(0)
    expect(formatCountdown(600)).toBe('10:00')
    expect(formatCountdown(61)).toBe('01:01')
  })

  it('allows cancelling until two hours before the showing', () => {
    const start = dayjs('2026-10-06T20:30')
    expect(canCancel(start, dayjs('2026-10-06T18:29'))).toBe(true)
    expect(canCancel(start, dayjs('2026-10-06T18:30'))).toBe(false)
  })

  it('marks booked seats as the visitor’s until the booking is cancelled', () => {
    const map = buildSeatMap('standard')
    const evening = show()
    const booking = createBooking(
      evening,
      quoteBooking(evening, map, ['G7', 'G8'], {}, {}),
      {},
      'ada@example.com',
      today,
    )
    expect(booking.code).toMatch(/^LM-[A-Z2-9]{6}$/)
    expect(bookedSeats([booking], evening.id)).toEqual(new Set(['G7', 'G8']))
    expect(bookedSeats([{ ...booking, cancelledAt: today.toISOString() }], evening.id).size).toBe(0)
    expect(bookedSeats([booking], 'another-show').size).toBe(0)
  })
})
