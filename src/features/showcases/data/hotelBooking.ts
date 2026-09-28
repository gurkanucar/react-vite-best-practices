import dayjs, { type Dayjs } from 'dayjs'
import type { Language } from '@/store/preferences-store'

export type RatePlan = 'flexible' | 'nonRefundable'
export type StayExtra = 'breakfast' | 'transfer' | 'lateCheckout'

/** What the pricing rules need to know about a room. */
export interface PricedRoom {
  id: string
  baseRate: number
  maxGuests: number
  /** Rooms of this type in the hotel. */
  inventory: number
  /** Out of 100: how often a night is sold out. Suites sell out more than doubles. */
  demand: number
}

export interface StaySearch {
  checkIn: string
  checkOut: string
  adults: number
  children: number
  rooms: number
}

export type StayIssue = 'missing' | 'invalid' | 'past' | 'tooLong'

export const DATE_FORMAT = 'YYYY-MM-DD'
export const MAX_NIGHTS = 21
export const GUEST_LIMITS = {
  adults: { min: 1, max: 8 },
  children: { min: 0, max: 6 },
  rooms: { min: 1, max: 4 },
} as const

export const RATE_PLANS: RatePlan[] = ['flexible', 'nonRefundable']
export const STAY_EXTRAS: StayExtra[] = ['breakfast', 'transfer', 'lateCheckout']
export const NON_REFUNDABLE_DISCOUNT = 0.12
/** Friday and Saturday nights. */
export const WEEKEND_UPLIFT = 0.2
export const VAT_RATE = 0.1
/** Per room, per night, as the municipality charges it. */
export const CITY_TAX = 2
export const FREE_CANCELLATION_DAYS = 3
export const EXTRA_PRICES: Record<StayExtra, number> = {
  /** Per guest, per night. */
  breakfast: 22,
  /** Per booking, both ways. */
  transfer: 90,
  /** Per room. */
  lateCheckout: 45,
}

export function defaultStay(today: Dayjs = dayjs()): StaySearch {
  const checkIn = today.startOf('day').add(21, 'day')
  return {
    checkIn: checkIn.format(DATE_FORMAT),
    checkOut: checkIn.add(3, 'day').format(DATE_FORMAT),
    adults: 2,
    children: 0,
    rooms: 1,
  }
}

function readDate(value: string | null): Dayjs | undefined {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined
  const date = dayjs(value)
  // dayjs rolls 2026-02-31 over into March; a date that does not format back is not real.
  return date.isValid() && date.format(DATE_FORMAT) === value ? date : undefined
}

function readCount(value: string | null, limits: { min: number; max: number }, fallback: number) {
  const count = Number(value)
  if (value === null || !Number.isInteger(count)) return fallback
  return Math.min(Math.max(count, limits.min), limits.max)
}

/**
 * The stay a link asks for. A link with no dates, or dates that cannot be booked, falls back
 * to the default stay and says why, so the page can explain rather than show nothing.
 */
export function readStay(
  params: URLSearchParams,
  today: Dayjs = dayjs(),
): { stay: StaySearch; issue?: StayIssue } {
  const fallback = defaultStay(today)
  const guests = {
    adults: readCount(params.get('adults'), GUEST_LIMITS.adults, fallback.adults),
    children: readCount(params.get('children'), GUEST_LIMITS.children, fallback.children),
    rooms: readCount(params.get('rooms'), GUEST_LIMITS.rooms, fallback.rooms),
  }
  const rawIn = params.get('checkIn')
  const rawOut = params.get('checkOut')
  if (!rawIn && !rawOut) return { stay: { ...fallback, ...guests }, issue: 'missing' }

  const checkIn = readDate(rawIn)
  const checkOut = readDate(rawOut)
  let issue: StayIssue | undefined
  if (!checkIn || !checkOut || !checkOut.isAfter(checkIn, 'day')) issue = 'invalid'
  else if (checkIn.isBefore(today, 'day')) issue = 'past'
  else if (checkOut.diff(checkIn, 'day') > MAX_NIGHTS) issue = 'tooLong'

  if (issue) return { stay: { ...fallback, ...guests }, issue }
  return { stay: { checkIn: rawIn!, checkOut: rawOut!, ...guests } }
}

export function stayParams(stay: StaySearch, extra: Record<string, string> = {}): string {
  return new URLSearchParams({
    ...extra,
    checkIn: stay.checkIn,
    checkOut: stay.checkOut,
    adults: String(stay.adults),
    children: String(stay.children),
    rooms: String(stay.rooms),
  }).toString()
}

export function nightsOf(stay: StaySearch): number {
  return dayjs(stay.checkOut).diff(dayjs(stay.checkIn), 'day')
}

export function guestsOf(stay: StaySearch): number {
  return stay.adults + stay.children
}

/** The date of each night, by the evening it starts on. */
export function stayDates(stay: StaySearch): string[] {
  const start = dayjs(stay.checkIn)
  return Array.from({ length: nightsOf(stay) }, (_, index) =>
    start.add(index, 'day').format(DATE_FORMAT),
  )
}

/** High summer costs most; the quiet months cost least. */
export function seasonFactor(date: Dayjs): number {
  const month = date.month() + 1
  if (month === 7 || month === 8) return 1.3
  if (month === 6 || month === 9) return 1.15
  if (month === 5 || month === 10) return 1
  return 0.8
}

export function isWeekendNight(date: Dayjs): boolean {
  return date.day() === 5 || date.day() === 6
}

export function nightlyRate(room: PricedRoom, date: string): number {
  const day = dayjs(date)
  return Math.round(
    room.baseRate * seasonFactor(day) * (isWeekendNight(day) ? 1 + WEEKEND_UPLIFT : 1),
  )
}

/** FNV-1a: small, fast and the same on every machine, so "sold out" is the same for everyone. */
function hash(value: string): number {
  let result = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index)
    result = Math.imul(result, 16777619)
  }
  return result >>> 0
}

/** Rooms of this type still free on one night. Seeded by room and date, so it never flickers. */
export function roomsLeft(room: PricedRoom, date: string): number {
  const seed = hash(`${room.id}:${date}`)
  if (seed % 100 < room.demand) return 0
  return 1 + (Math.floor(seed / 100) % room.inventory)
}

export interface Availability {
  available: boolean
  /** The fewest rooms free on any night of the stay. */
  left: number
  reason?: 'soldOut' | 'capacity'
  soldOutNights: string[]
}

export function availabilityFor(room: PricedRoom, stay: StaySearch): Availability {
  const dates = stayDates(stay)
  const perNight = dates.map((date) => roomsLeft(room, date))
  const left = Math.min(...perNight)
  const soldOutNights = dates.filter((_, index) => perNight[index]! < stay.rooms)
  if (guestsOf(stay) > room.maxGuests * stay.rooms) {
    return { available: false, left, reason: 'capacity', soldOutNights }
  }
  if (soldOutNights.length > 0) return { available: false, left, reason: 'soldOut', soldOutNights }
  return { available: true, left, soldOutNights }
}

export interface StayQuote {
  nights: { date: string; rate: number }[]
  /** Every night, for every room, before any discount. */
  roomTotal: number
  discount: number
  extras: { extra: StayExtra; amount: number }[]
  extrasTotal: number
  vat: number
  cityTax: number
  total: number
  /** What one room costs per night on average, the number room cards lead with. */
  averageNightly: number
}

export function extraPrice(extra: StayExtra, stay: StaySearch): number {
  if (extra === 'breakfast') return EXTRA_PRICES.breakfast * guestsOf(stay) * nightsOf(stay)
  if (extra === 'lateCheckout') return EXTRA_PRICES.lateCheckout * stay.rooms
  return EXTRA_PRICES.transfer
}

/**
 * The one place a stay is added up. VAT is charged on the room after the discount and on the
 * extras; the city tax is a flat charge per room per night and is not discounted.
 */
export function quoteStay(
  room: PricedRoom,
  stay: StaySearch,
  plan: RatePlan = 'flexible',
  selectedExtras: StayExtra[] = [],
): StayQuote {
  const nights = stayDates(stay).map((date) => ({ date, rate: nightlyRate(room, date) }))
  const oneRoom = nights.reduce((sum, night) => sum + night.rate, 0)
  const roomTotal = oneRoom * stay.rooms
  const discount = plan === 'nonRefundable' ? Math.round(roomTotal * NON_REFUNDABLE_DISCOUNT) : 0
  const extras = STAY_EXTRAS.filter((extra) => selectedExtras.includes(extra)).map((extra) => ({
    extra,
    amount: extraPrice(extra, stay),
  }))
  const extrasTotal = extras.reduce((sum, item) => sum + item.amount, 0)
  const vat = Math.round((roomTotal - discount + extrasTotal) * VAT_RATE)
  const cityTax = CITY_TAX * stay.rooms * nights.length

  return {
    nights,
    roomTotal,
    discount,
    extras,
    extrasTotal,
    vat,
    cityTax,
    total: roomTotal - discount + extrasTotal + vat + cityTax,
    averageNightly: nights.length ? Math.round(oneRoom / nights.length) : 0,
  }
}

/**
 * Until when a flexible booking can be cancelled for free: the end of the day, three days
 * before arrival. `null` for a non-refundable rate, or when that moment has already passed.
 */
export function freeCancellationUntil(
  stay: StaySearch,
  plan: RatePlan,
  now: Dayjs = dayjs(),
): Dayjs | null {
  if (plan === 'nonRefundable') return null
  const deadline = dayjs(stay.checkIn).subtract(FREE_CANCELLATION_DAYS, 'day').endOf('day')
  return deadline.isAfter(now) ? deadline : null
}

export function bookingReference(seed: string): string {
  return `KB-${hash(seed).toString(36).toUpperCase().padStart(7, '0').slice(-7)}`
}

export function formatMoney(amount: number, language: Language): string {
  return new Intl.NumberFormat(language === 'tr' ? 'tr-TR' : 'en-GB', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amount)
}

/* Demo card checks: enough to show validation, never a payment. */

export function cardDigits(value: string): string {
  return value.replace(/\D/g, '')
}

export function formatCardNumber(value: string): string {
  return cardDigits(value)
    .slice(0, 19)
    .replace(/(\d{4})(?=\d)/g, '$1 ')
}

export function luhnValid(value: string): boolean {
  const digits = cardDigits(value)
  if (digits.length < 13 || digits.length > 19) return false
  let sum = 0
  for (let index = 0; index < digits.length; index += 1) {
    let digit = Number(digits[digits.length - 1 - index])
    if (index % 2 === 1) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
  }
  return sum % 10 === 0
}

/** `MM/YY`, not before the current month. */
export function expiryValid(value: string, now: Dayjs = dayjs()): boolean {
  const match = /^(\d{2})\s*\/\s*(\d{2})$/.exec(value.trim())
  if (!match) return false
  const month = Number(match[1])
  if (month < 1 || month > 12) return false
  const expiry = dayjs(`20${match[2]}-${match[1]}-01`).endOf('month')
  return !expiry.isBefore(now)
}
