import { confSessions, ISTANBUL_OFFSET_MINUTES } from '@/features/showcases/data/confData'

export type TierId = 'early' | 'regular' | 'student' | 'team' | 'vip'

export interface TicketTier {
  id: TierId
  /** Per seat, in lira, VAT included. */
  price: number
  /** Most seats one order may take. */
  max: number
  /** Fewest seats an order may take, when it takes any. */
  min?: number
  /** Sales close at this instant. */
  deadline?: number
  /** Seats left; `0` is sold out. */
  remaining?: number
  featured?: boolean
}

export const VAT_RATE = 0.2
export const REGULAR_PRICE = 3900
export const TEAM_DISCOUNT = 0.15
export const TEAM_MINIMUM = 5
export const WORKSHOP_PRICE = 1200

/** 15 October 2026, 23:59 in Istanbul. */
export const EARLY_BIRD_DEADLINE = Date.UTC(2026, 9, 15, 23, 59 - ISTANBUL_OFFSET_MINUTES)

export const ticketTiers: TicketTier[] = [
  { id: 'early', price: 2900, max: 4, deadline: EARLY_BIRD_DEADLINE, remaining: 37 },
  { id: 'regular', price: REGULAR_PRICE, max: 10, featured: true },
  { id: 'student', price: 1450, max: 2 },
  {
    id: 'team',
    price: Math.round(REGULAR_PRICE * (1 - TEAM_DISCOUNT)),
    max: 30,
    min: TEAM_MINIMUM,
  },
  { id: 'vip', price: 7500, max: 2, remaining: 0 },
]

/** The workshops on the first day are sold on top of a ticket, one seat each. */
export const workshopSeats: Record<string, number> = {
  'd0-streaming-ssr': 0,
  'd0-design-tokens': 6,
  'd0-llm-feature': 14,
  'd0-profiling': 3,
  'd0-a11y-audit': 22,
  'd0-discovery': 18,
}

export const workshops = confSessions.filter(
  (session) => session.format === 'workshop' && session.day === 0,
)

export type TierState = 'onSale' | 'soldOut' | 'ended'

export function tierState(tier: TicketTier, now: number): TierState {
  if (tier.deadline !== undefined && now > tier.deadline) return 'ended'
  if (tier.remaining === 0) return 'soldOut'
  return 'onSale'
}

/** Most seats of a tier the order can hold, after the stock left. */
export function tierLimit(tier: TicketTier) {
  return Math.min(tier.max, tier.remaining ?? tier.max)
}

export interface Promo {
  code: string
  kind: 'percent' | 'perRegular'
  amount: number
  expiresAt?: number
}

export const promos: Promo[] = [
  { code: 'RELAY10', kind: 'percent', amount: 0.1 },
  { code: 'COMMUNITY', kind: 'perRegular', amount: 500 },
  { code: 'EARLY2025', kind: 'percent', amount: 0.25, expiresAt: Date.UTC(2025, 11, 31) },
]

export type PromoCheck =
  | { status: 'valid'; promo: Promo }
  | { status: 'expired' }
  | { status: 'unknown' }

export function checkPromo(code: string, now: number): PromoCheck {
  const promo = promos.find((entry) => entry.code === code.trim().toUpperCase())
  if (!promo) return { status: 'unknown' }
  if (promo.expiresAt !== undefined && now > promo.expiresAt) return { status: 'expired' }
  return { status: 'valid', promo }
}

export interface TicketSelection {
  tickets: Partial<Record<TierId, number>>
  workshops: Partial<Record<string, number>>
  promo?: string
}

export type SelectionIssue =
  | 'empty'
  | 'teamMinimum'
  | 'overLimit'
  | 'unavailable'
  | 'workshopsExceedTickets'

export interface QuoteLine {
  id: string
  kind: 'ticket' | 'workshop'
  quantity: number
  unit: number
  total: number
}

export interface Quote {
  lines: QuoteLine[]
  seats: number
  subtotal: number
  discount: number
  total: number
  /** The VAT inside the total. */
  vat: number
  promo?: Promo
  issues: SelectionIssue[]
}

const roundLira = (value: number) => Math.round(value * 100) / 100

/**
 * What an order costs and what is wrong with it. Prices include VAT, so the VAT is worked out
 * backwards from the total. A promo never touches team seats, which are already discounted.
 */
export function quoteSelection(selection: TicketSelection, now: number): Quote {
  const issues = new Set<SelectionIssue>()
  const lines: QuoteLine[] = []

  for (const tier of ticketTiers) {
    const quantity = selection.tickets[tier.id] ?? 0
    if (quantity <= 0) continue
    if (tierState(tier, now) !== 'onSale') issues.add('unavailable')
    if (quantity > tierLimit(tier)) issues.add('overLimit')
    if (tier.min !== undefined && quantity < tier.min) issues.add('teamMinimum')
    lines.push({
      id: tier.id,
      kind: 'ticket',
      quantity,
      unit: tier.price,
      total: tier.price * quantity,
    })
  }

  const seats = lines.reduce((sum, line) => sum + line.quantity, 0)

  for (const workshop of workshops) {
    const quantity = selection.workshops[workshop.id] ?? 0
    if (quantity <= 0) continue
    const left = workshopSeats[workshop.id] ?? 0
    if (left === 0) issues.add('unavailable')
    else if (quantity > left) issues.add('overLimit')
    if (quantity > seats) issues.add('workshopsExceedTickets')
    lines.push({
      id: workshop.id,
      kind: 'workshop',
      quantity,
      unit: WORKSHOP_PRICE,
      total: WORKSHOP_PRICE * quantity,
    })
  }

  if (seats === 0) issues.add('empty')

  const subtotal = lines.reduce((sum, line) => sum + line.total, 0)
  const check = selection.promo ? checkPromo(selection.promo, now) : undefined
  const promo = check?.status === 'valid' ? check.promo : undefined
  let discount = 0
  if (promo?.kind === 'percent') {
    const eligible = lines.filter((line) => line.id !== 'team')
    discount = eligible.reduce((sum, line) => sum + line.total, 0) * promo.amount
  } else if (promo?.kind === 'perRegular') {
    discount = (selection.tickets.regular ?? 0) * promo.amount
  }
  discount = roundLira(Math.min(discount, subtotal))

  const total = roundLira(subtotal - discount)
  const vat = roundLira(total - total / (1 + VAT_RATE))

  return { lines, seats, subtotal, discount, total, vat, promo, issues: [...issues] }
}

/** One attendee per seat, each with the tier they hold. */
export function seatTiers(selection: TicketSelection) {
  return ticketTiers.flatMap((tier) =>
    Array.from({ length: Math.max(0, selection.tickets[tier.id] ?? 0) }, () => tier.id),
  )
}

export function luhnValid(cardNumber: string) {
  const digits = cardNumber.replace(/\D/g, '')
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

/** `MM/YY`, valid through the last day of that month. */
export function expiryValid(value: string, now: number) {
  const match = value.match(/^(\d{2})\/(\d{2})$/)
  if (!match) return false
  const month = Number(match[1])
  const year = 2000 + Number(match[2])
  if (month < 1 || month > 12) return false
  return Date.UTC(year, month, 1) > now
}

export function formatCardNumber(value: string) {
  return value
    .replace(/\D/g, '')
    .slice(0, 19)
    .replace(/(\d{4})(?=\d)/g, '$1 ')
}

export function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
}

/** `RS26-` and six characters from the moment of purchase. */
export function orderReference(now: number) {
  return `RS26-${(now % 2_176_782_336).toString(36).toUpperCase().padStart(6, '0')}`
}

export function formatLira(amount: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'TRY',
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount)
}
