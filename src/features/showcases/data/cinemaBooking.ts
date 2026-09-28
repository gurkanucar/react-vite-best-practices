import dayjs, { type Dayjs } from 'dayjs'
import {
  findHall,
  seededRandom,
  showtimeStart,
  type AgeRating,
  type Format,
  type HallLayout,
  type Showtime,
} from '@/features/showcases/data/cinema'
import type { Language } from '@/store/preferences-store'

export type SeatType = 'standard' | 'vip' | 'wheelchair' | 'couple'

export interface Seat {
  kind: 'seat'
  /** Row letter and number, e.g. `F7`. */
  id: string
  row: string
  number: number
  type: SeatType
  /** Both halves of a couple seat share their left half's id. */
  pairId?: string
  /** Which run of seats between two aisles it sits in, for the single-seat rule. */
  block: number
}

export type Cell = Seat | { kind: 'gap' }

export interface SeatRow {
  row: string
  cells: Cell[]
}

export interface SeatMap {
  rows: SeatRow[]
  columns: number
  seats: Seat[]
}

/*
 * Each row is drawn as text: s standard, v VIP, w wheelchair space, c couple seat (always in
 * pairs), `_` an aisle and `.` an empty spot. Rows run from the screen backwards, and every
 * row has the same width so the columns line up.
 */
const layouts: Record<HallLayout, string[]> = {
  standard: [
    'ww..ss_ssssssssss_ss..ww',
    '.sssss_ssssssssss_sssss.',
    'ssssss_ssssssssss_ssssss',
    'ssssss_ssssssssss_ssssss',
    'ssssss_ssssssssss_ssssss',
    'ssssss_vvvvvvvvvv_ssssss',
    'ssssss_vvvvvvvvvv_ssssss',
    'ssssss_ssssssssss_ssssss',
    'ssssss_ssssssssss_ssssss',
    'cccccc_cccccccccc_cccccc',
  ],
  imax: [
    'ww..ssss_ssssssssssss_ssss..ww',
    '..ssssss_ssssssssssss_ssssss..',
    '.sssssss_ssssssssssss_sssssss.',
    'ssssssss_ssssssssssss_ssssssss',
    'ssssssss_ssssssssssss_ssssssss',
    'ssssssss_ssssssssssss_ssssssss',
    'ssssssss_vvvvvvvvvvvv_ssssssss',
    'ssssssss_vvvvvvvvvvvv_ssssssss',
    'ssssssss_vvvvvvvvvvvv_ssssssss',
    'ssssssss_ssssssssssss_ssssssss',
    'ssssssss_ssssssssssss_ssssssss',
    'cccccccc_cccccccccccc_cccccccc',
  ],
  lounge: [
    'w.vvv_vvvvvv_vvv.w',
    '..vvv_vvvvvv_vvv..',
    '..vvv_vvvvvv_vvv..',
    '..vvv_vvvvvv_vvv..',
    '..cc._cccccc_.cc..',
  ],
}

const typeOf: Record<string, SeatType> = { s: 'standard', v: 'vip', w: 'wheelchair', c: 'couple' }

export function buildSeatMap(layout: HallLayout): SeatMap {
  const plan = layouts[layout]
  const seats: Seat[] = []
  const rows = plan.map((line, rowIndex) => {
    const row = String.fromCharCode(65 + rowIndex)
    let number = 0
    let block = 0
    let coupleStart: string | undefined
    const cells: Cell[] = [...line].map((char) => {
      const type = typeOf[char]
      // An aisle or an empty spot ends a block: nobody is left "alone" across one.
      if (!type) block += 1
      if (!type) {
        coupleStart = undefined
        return { kind: 'gap' }
      }
      number += 1
      const id = `${row}${number}`
      let pairId: string | undefined
      if (type === 'couple') {
        pairId = coupleStart ?? id
        coupleStart = coupleStart ? undefined : id
      }
      const seat: Seat = { kind: 'seat', id, row, number, type, block, pairId }
      seats.push(seat)
      return seat
    })
    return { row, cells }
  })
  return { rows, columns: Math.max(...plan.map((line) => line.length)), seats }
}

const mapCache = new Map<HallLayout, SeatMap>()

export function seatMapFor(show: Pick<Showtime, 'hallId'>): SeatMap {
  const layout = findHall(show.hallId)?.layout ?? 'standard'
  const cached = mapCache.get(layout)
  if (cached) return cached
  const map = buildSeatMap(layout)
  mapCache.set(layout, map)
  return map
}

/** Both halves of a couple seat, or just the seat. */
export function seatGroup(map: SeatMap, seatId: string): Seat[] {
  const seat = map.seats.find((item) => item.id === seatId)
  if (!seat) return []
  if (!seat.pairId) return [seat]
  return map.seats.filter((item) => item.pairId === seat.pairId)
}

/**
 * How full a showing is: evenings and weekends sell more, and a showing a week away has
 * sold less than tonight's. Always below 95%, so there is something left to pick.
 */
export function occupancyRate(show: Showtime, today: Dayjs = dayjs()): number {
  const random = seededRandom(`rate:${show.id}`)
  const start = showtimeStart(show)
  const hour = start.hour()
  const weekend = [0, 5, 6].includes(start.day())
  const daysAway = Math.max(0, start.startOf('day').diff(today.startOf('day'), 'day'))
  const rate =
    0.12 +
    random() * 0.4 +
    (hour >= 19 ? 0.28 : hour >= 16 ? 0.12 : 0) +
    (weekend ? 0.1 : 0) -
    daysAway * 0.05
  return Math.min(0.94, Math.max(0.04, rate))
}

/** The seats other people have bought, the same for every visitor. */
export function takenSeats(show: Showtime, today: Dayjs = dayjs()): Set<string> {
  const map = seatMapFor(show)
  const random = seededRandom(`seats:${show.id}`)
  const rate = occupancyRate(show, today)
  const taken = new Set<string>()
  for (const seat of map.seats) {
    // A couple seat sells as a pair: decided on its left half.
    if (seat.pairId && seat.pairId !== seat.id) {
      if (taken.has(seat.pairId)) taken.add(seat.id)
      continue
    }
    // People sit near the middle first.
    const pull = seat.type === 'vip' ? 0.12 : seat.type === 'wheelchair' ? -0.3 : 0
    if (random() < rate + pull) taken.add(seat.id)
  }
  return taken
}

export const MAX_SEATS = 10

export type ToggleResult = { selected: string[]; error?: 'taken' | 'max' }

/** Adds or removes a seat, or a whole couple seat, keeping the list in the hall's order. */
export function toggleSeat(
  map: SeatMap,
  selected: string[],
  seatId: string,
  taken: Set<string>,
  max = MAX_SEATS,
): ToggleResult {
  const group = seatGroup(map, seatId)
  if (group.length === 0) return { selected }
  if (group.some((seat) => taken.has(seat.id))) return { selected, error: 'taken' }

  const ids = group.map((seat) => seat.id)
  if (ids.every((id) => selected.includes(id))) {
    return { selected: selected.filter((id) => !ids.includes(id)) }
  }
  const adding = ids.filter((id) => !selected.includes(id))
  if (selected.length + adding.length > max) return { selected, error: 'max' }

  const next = new Set([...selected, ...adding])
  return { selected: map.seats.filter((seat) => next.has(seat.id)).map((seat) => seat.id) }
}

/**
 * Seats the selection would leave on their own: a free seat with a filled seat or the end of
 * the block on both sides, next to a seat just chosen. Nobody books a single seat there.
 */
export function singleSeatGaps(map: SeatMap, selected: string[], taken: Set<string>): string[] {
  const chosen = new Set(selected)
  const gaps: string[] = []
  for (const { cells } of map.rows) {
    const blocks = new Map<number, Seat[]>()
    for (const cell of cells) {
      if (cell.kind !== 'seat') continue
      blocks.set(cell.block, [...(blocks.get(cell.block) ?? []), cell])
    }
    for (const block of blocks.values()) {
      if (block.length < 3) continue
      const filled = block.map((seat) => chosen.has(seat.id) || taken.has(seat.id))
      block.forEach((seat, index) => {
        if (filled[index] || seat.pairId) return
        const leftClosed = index === 0 || filled[index - 1]
        const rightClosed = index === block.length - 1 || filled[index + 1]
        const besideChoice =
          chosen.has(block[index - 1]?.id ?? '') || chosen.has(block[index + 1]?.id ?? '')
        if (leftClosed && rightClosed && besideChoice) gaps.push(seat.id)
      })
    }
  }
  return gaps
}

/* Prices */

export type TicketType = 'full' | 'student' | 'child'
export const ticketTypes: TicketType[] = ['full', 'student', 'child']

const formatPrice: Record<Format, number> = { '2D': 260, '3D': 310, IMAX: 390 }
const seatSurcharge: Record<SeatType, number> = { standard: 0, vip: 90, wheelchair: 0, couple: 40 }
const ticketFactor: Record<TicketType, number> = { full: 1, student: 0.8, child: 0.7 }

export const SERVICE_FEE = 10
export const MATINEE_DISCOUNT = 0.2
/** Showings that start before this hour are matinees. */
export const MATINEE_BEFORE = 13

export function isMatinee(show: Pick<Showtime, 'time'>): boolean {
  return Number(show.time.slice(0, 2)) < MATINEE_BEFORE
}

/** Under-12 tickets are only for films a child may see. */
export function childAllowed(rating: AgeRating): boolean {
  return rating === 'G' || rating === '7+'
}

export function ticketPrice(
  show: Pick<Showtime, 'format' | 'time'>,
  seatType: SeatType,
  ticket: TicketType = 'full',
): number {
  const base = formatPrice[show.format] * (isMatinee(show) ? 1 - MATINEE_DISCOUNT : 1)
  const price = (base + seatSurcharge[seatType]) * ticketFactor[ticket]
  return Math.round(price / 5) * 5
}

/** The cheapest full ticket for a showing, for "from ₺…" labels. */
export function fromPrice(show: Pick<Showtime, 'format' | 'time'>): number {
  return ticketPrice(show, 'standard')
}

export interface Concession {
  id: string
  name: Record<Language, string>
  description: Record<Language, string>
  price: number
  icon: string
}

export const concessions: Concession[] = [
  {
    id: 'popcorn-menu',
    name: { en: 'Popcorn menu', tr: 'Mısır menü' },
    description: { en: 'Medium popcorn and a soft drink', tr: 'Orta mısır ve bir içecek' },
    price: 210,
    icon: '🍿',
  },
  {
    id: 'couple-menu',
    name: { en: 'Couple menu', tr: 'Çift menü' },
    description: { en: 'Large popcorn and two soft drinks', tr: 'Büyük mısır ve iki içecek' },
    price: 360,
    icon: '💞',
  },
  {
    id: 'nachos',
    name: { en: 'Nachos', tr: 'Nachos' },
    description: { en: 'With cheese and salsa dips', tr: 'Peynir ve salsa soslu' },
    price: 165,
    icon: '🌮',
  },
  {
    id: 'soft-drink',
    name: { en: 'Soft drink', tr: 'İçecek' },
    description: { en: 'Large, with refills in the lobby', tr: 'Büyük boy, fuayede tazelenir' },
    price: 85,
    icon: '🥤',
  },
  {
    id: 'water',
    name: { en: 'Water', tr: 'Su' },
    description: { en: '500 ml', tr: '500 ml' },
    price: 35,
    icon: '💧',
  },
]

export interface BookingLine {
  seatId: string
  seatType: SeatType
  ticket: TicketType
  price: number
}

export interface BookingQuote {
  lines: BookingLine[]
  tickets: number
  snacks: number
  fee: number
  total: number
}

export function quoteBooking(
  show: Showtime,
  map: SeatMap,
  seats: string[],
  tickets: Record<string, TicketType>,
  snacks: Record<string, number>,
): BookingQuote {
  const lines = seats.flatMap((seatId) => {
    const seat = map.seats.find((item) => item.id === seatId)
    if (!seat) return []
    const ticket = tickets[seatId] ?? 'full'
    return [{ seatId, seatType: seat.type, ticket, price: ticketPrice(show, seat.type, ticket) }]
  })
  const ticketTotal = lines.reduce((sum, line) => sum + line.price, 0)
  const snackTotal = concessions.reduce(
    (sum, item) => sum + item.price * Math.max(0, snacks[item.id] ?? 0),
    0,
  )
  const fee = SERVICE_FEE * lines.length
  return {
    lines,
    tickets: ticketTotal,
    snacks: snackTotal,
    fee,
    total: ticketTotal + snackTotal + fee,
  }
}

/* Holding seats while paying */

export const HOLD_SECONDS = 10 * 60

export function holdSecondsLeft(expiresAt: number, now: number): number {
  return Math.max(0, Math.ceil((expiresAt - now) / 1000))
}

export function formatCountdown(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  return `${String(minutes).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`
}

/* After booking */

/** Tickets can be cancelled until two hours before the showing. */
export const CANCEL_HOURS = 2

export function canCancel(start: Dayjs, now: Dayjs = dayjs()): boolean {
  return start.diff(now, 'minute') > CANCEL_HOURS * 60
}

export function bookingCode(seed: string): string {
  const random = seededRandom(seed)
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const code = Array.from({ length: 6 }, () => alphabet[Math.floor(random() * alphabet.length)])
  return `LM-${code.join('')}`
}

export function formatMoney(amount: number, language: Language): string {
  return new Intl.NumberFormat(language === 'tr' ? 'tr-TR' : 'en-GB', {
    style: 'currency',
    currency: 'TRY',
    // "₺350" in both languages, rather than "TRY 350" in English.
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: 0,
  }).format(amount)
}

/* Saved bookings */

export interface CinemaBooking {
  code: string
  showtimeId: string
  movieId: string
  cinemaId: string
  hallId: string
  date: string
  time: string
  format: Format
  audio: Showtime['audio']
  lines: BookingLine[]
  snacks: Record<string, number>
  total: number
  email: string
  createdAt: string
  cancelledAt?: string
}

export function createBooking(
  show: Showtime,
  quote: BookingQuote,
  snacks: Record<string, number>,
  email: string,
  now: Dayjs = dayjs(),
): CinemaBooking {
  return {
    code: bookingCode(
      `${show.id}:${quote.lines.map((line) => line.seatId).join(',')}:${now.valueOf()}`,
    ),
    showtimeId: show.id,
    movieId: show.movieId,
    cinemaId: show.cinemaId,
    hallId: show.hallId,
    date: show.date,
    time: show.time,
    format: show.format,
    audio: show.audio,
    lines: quote.lines,
    snacks: Object.fromEntries(Object.entries(snacks).filter(([, count]) => count > 0)),
    total: quote.total,
    email,
    createdAt: now.toISOString(),
  }
}

/** The seats this visitor has booked for a showing, which the map marks as theirs. */
export function bookedSeats(bookings: CinemaBooking[], showtimeId: string): Set<string> {
  return new Set(
    bookings
      .filter((booking) => booking.showtimeId === showtimeId && !booking.cancelledAt)
      .flatMap((booking) => booking.lines.map((line) => line.seatId)),
  )
}

/** QR contents: enough for a door scanner to look the booking up. */
export function ticketPayload(booking: CinemaBooking): string {
  return `LUMEN|${booking.code}|${booking.showtimeId}|${booking.lines.map((line) => line.seatId).join(',')}`
}
