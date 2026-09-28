import dayjs, { type Dayjs } from 'dayjs'
import type { Language } from '@/store/preferences-store'
import {
  findBrand,
  findPart,
  partsCatalog,
  totalStock,
  warehouseIds,
  type Part,
  type WarehouseId,
} from '@/features/showcases/data/partsCatalog'

type Text = Record<Language, string>

/** Prices are Turkish shelf prices with VAT, so both languages show lira. */
export function formatTry(value: number, language: Language): string {
  return new Intl.NumberFormat(language === 'tr' ? 'tr-TR' : 'en-GB', {
    style: 'currency',
    currency: 'TRY',
    currencyDisplay: 'narrowSymbol',
  }).format(value)
}

export const VAT_RATE = 0.2
/** One order line never asks for more than this, whatever the stock. */
export const MAX_PER_LINE = 20

export interface CartLine {
  partId: string
  quantity: number
}

export function clampQuantity(part: Part, quantity: number): number {
  const ceiling = Math.max(1, Math.min(totalStock(part), MAX_PER_LINE))
  return Math.max(1, Math.min(Math.round(quantity) || 1, ceiling))
}

export interface ResolvedLine {
  part: Part
  quantity: number
  total: number
}

/** Cart lines with their parts; a line whose part has left the catalogue is dropped. */
export function resolveLines(lines: CartLine[]): ResolvedLine[] {
  return lines.flatMap((line) => {
    const part = findPart(line.partId)
    return part ? [{ part, quantity: line.quantity, total: round(part.price * line.quantity) }] : []
  })
}

const round = (value: number) => Math.round(value * 100) / 100

export const shippingMethodIds = ['standard', 'express', 'sameDay', 'pickup'] as const
export type ShippingMethodId = (typeof shippingMethodIds)[number]

export interface ShippingMethod {
  id: ShippingMethodId
  /** Invented carriers: a showcase should not borrow a real company's name. */
  carrier: string
  name: Text
  price: number
  /** Free above this subtotal. */
  freeOver?: number
  /** Business days after dispatch. */
  days: [number, number]
  trackingPrefix: string
}

export const shippingMethods: Record<ShippingMethodId, ShippingMethod> = {
  standard: {
    id: 'standard',
    carrier: 'Kargovia',
    name: { en: 'Standard delivery', tr: 'Standart teslimat' },
    price: 69.9,
    freeOver: 1500,
    days: [1, 3],
    trackingPrefix: 'KV',
  },
  express: {
    id: 'express',
    carrier: 'Menzil Express',
    name: { en: 'Next-day express', tr: 'Ertesi gün ekspres' },
    price: 149.9,
    days: [1, 1],
    trackingPrefix: 'ME',
  },
  sameDay: {
    id: 'sameDay',
    carrier: 'Torkline Courier',
    name: { en: 'Same-day courier (Istanbul)', tr: 'Aynı gün kurye (İstanbul)' },
    price: 249.9,
    days: [0, 0],
    trackingPrefix: 'TC',
  },
  pickup: {
    id: 'pickup',
    carrier: 'Torkline',
    name: { en: 'Collect from the Hadımköy warehouse', tr: 'Hadımköy deposundan teslim al' },
    price: 0,
    days: [0, 0],
    trackingPrefix: 'TP',
  },
}

export const cities = [
  'İstanbul',
  'Ankara',
  'İzmir',
  'Bursa',
  'Antalya',
  'Adana',
  'Konya',
  'Kocaeli',
  'Gaziantep',
  'Eskişehir',
  'Kayseri',
  'Mersin',
  'Samsun',
  'Trabzon',
  'Diyarbakır',
] as const

/**
 * Whether a method can serve this order. Same-day and pickup need every part on the shelf in
 * Istanbul; the courier only rides inside the city.
 */
export function shippingAvailable(
  method: ShippingMethodId,
  lines: ResolvedLine[],
  city: string | undefined,
  now: Dayjs,
): boolean {
  const allInIstanbul = lines.every((line) => line.part.stock.ist >= line.quantity)
  if (method === 'sameDay') {
    return city === 'İstanbul' && allInIstanbul && dispatchCutoff(now).shipsToday
  }
  if (method === 'pickup') return allInIstanbul
  return true
}

export function shippingPrice(method: ShippingMethodId, subtotal: number): number {
  const entry = shippingMethods[method]
  return entry.freeOver !== undefined && subtotal >= entry.freeOver ? 0 : entry.price
}

export const paymentMethodIds = ['card', 'transfer', 'cod'] as const
export type PaymentMethodId = (typeof paymentMethodIds)[number]

/** Paying by bank transfer saves the card fee, and the shop passes it on. */
export const TRANSFER_DISCOUNT = 0.03
/** Cash on delivery costs the carrier a collection; above the limit they will not carry cash. */
export const COD_FEE = 39.9
export const COD_LIMIT = 15000

export interface Totals {
  subtotal: number
  discount: number
  shipping: number
  codFee: number
  total: number
  /** The VAT already inside the total, for the invoice line. */
  vat: number
}

export function orderTotals(
  lines: ResolvedLine[],
  shipping: ShippingMethodId | undefined,
  payment: PaymentMethodId | undefined,
): Totals {
  const subtotal = round(lines.reduce((sum, line) => sum + line.total, 0))
  const discount = payment === 'transfer' ? round(subtotal * TRANSFER_DISCOUNT) : 0
  const shippingCost = shipping && lines.length > 0 ? shippingPrice(shipping, subtotal) : 0
  const codFee = payment === 'cod' ? COD_FEE : 0
  const total = round(subtotal - discount + shippingCost + codFee)
  return {
    subtotal,
    discount,
    shipping: shippingCost,
    codFee,
    total,
    vat: round(total - total / (1 + VAT_RATE)),
  }
}

export function codAllowed(totals: Totals): boolean {
  return totals.total - totals.codFee <= COD_LIMIT
}

const CUTOFF = { weekday: 16, saturday: 13 }

/**
 * Warehouses dispatch until 16:00 on weekdays and 13:00 on Saturdays. Returns whether an
 * order placed now leaves today, how long is left to make it, and the day it leaves.
 */
export function dispatchCutoff(now: Dayjs): {
  shipsToday: boolean
  minutesLeft: number
  dispatchDay: Dayjs
} {
  const cutoffHour = (day: Dayjs) =>
    day.day() === 0 ? undefined : day.day() === 6 ? CUTOFF.saturday : CUTOFF.weekday
  const todayCutoff = cutoffHour(now)
  if (todayCutoff !== undefined) {
    const cutoff = now.startOf('day').hour(todayCutoff)
    if (now.isBefore(cutoff)) {
      return { shipsToday: true, minutesLeft: cutoff.diff(now, 'minute'), dispatchDay: now }
    }
  }
  let next = now.add(1, 'day').startOf('day')
  while (cutoffHour(next) === undefined) next = next.add(1, 'day')
  return { shipsToday: false, minutesLeft: 0, dispatchDay: next }
}

function addBusinessDays(day: Dayjs, count: number): Dayjs {
  let result = day
  let left = count
  while (left > 0) {
    result = result.add(1, 'day')
    if (result.day() !== 0) left -= 1
  }
  return result
}

/** The first and last day a delivery can arrive, counted from dispatch, skipping Sundays. */
export function deliveryWindow(method: ShippingMethodId, now: Dayjs): [Dayjs, Dayjs] {
  const { dispatchDay } = dispatchCutoff(now)
  const [from, to] = shippingMethods[method].days
  return [addBusinessDays(dispatchDay, from), addBusinessDays(dispatchDay, to)]
}

/** Luhn check: catches a mistyped digit before the "bank" would. */
export function luhnValid(number: string): boolean {
  const digits = number.replace(/\s/g, '')
  if (!/^\d{13,19}$/.test(digits)) return false
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

/** "MM/YY", valid through the last day of that month. */
export function expiryValid(value: string, now: Dayjs): boolean {
  const match = /^(\d{2})\s?\/\s?(\d{2})$/.exec(value.trim())
  if (!match) return false
  const month = Number(match[1])
  if (month < 1 || month > 12) return false
  const end = dayjs(new Date(2000 + Number(match[2]), month, 0)).endOf('day')
  return !end.isBefore(now)
}

/** A Turkish mobile number: 05xx xxx xx xx, with or without the leading zero and spaces. */
export function phoneValid(value: string): boolean {
  return /^0?5\d{9}$/.test(value.replace(/[\s()-]/g, ''))
}

export interface Address {
  fullName: string
  phone: string
  email: string
  city: string
  district: string
  line: string
  postcode: string
}

export interface OrderLine {
  partId: string
  name: Text
  brand: string
  sku: string
  quantity: number
  unitPrice: number
}

export interface Order {
  id: string
  placedAt: string
  lines: OrderLine[]
  address: Address
  shipping: ShippingMethodId
  payment: PaymentMethodId
  totals: Totals
  trackingNumber: string
  warehouse: WarehouseId
  /**
   * `demo` plays the delivery back in minutes so a fresh order visibly moves; `real` keeps
   * the hours a delivery takes, for the example history.
   */
  pace: 'demo' | 'real'
  vehicle?: string
  cancelledAt?: string
  returnRequestedAt?: string
}

export type TrackingStage =
  | 'received'
  | 'preparing'
  | 'shipped'
  | 'inTransit'
  | 'outForDelivery'
  | 'delivered'
  | 'ready'

/** When each step happens, in hours after the order was placed. */
const trackingPlans: Record<ShippingMethodId, Array<[TrackingStage, number]>> = {
  standard: [
    ['received', 0],
    ['preparing', 1.5],
    ['shipped', 6],
    ['inTransit', 20],
    ['outForDelivery', 44],
    ['delivered', 49],
  ],
  express: [
    ['received', 0],
    ['preparing', 0.5],
    ['shipped', 3],
    ['inTransit', 10],
    ['outForDelivery', 20],
    ['delivered', 23],
  ],
  sameDay: [
    ['received', 0],
    ['preparing', 0.5],
    ['shipped', 1.5],
    ['outForDelivery', 2],
    ['delivered', 4.5],
  ],
  pickup: [
    ['received', 0],
    ['preparing', 1],
    ['ready', 3],
  ],
}

/** A demo order's whole standard delivery plays out in about a quarter of an hour. */
const DEMO_MINUTES_PER_HOUR = 0.3

const hubFor = (city: string): Text => {
  const hubs: Record<string, string> = {
    İstanbul: 'Hadımköy',
    Kocaeli: 'Gebze',
    Bursa: 'Gebze',
    İzmir: 'Manisa',
    Antalya: 'Isparta',
    Adana: 'Adana',
    Mersin: 'Adana',
    Gaziantep: 'Adana',
    Diyarbakır: 'Malatya',
    Samsun: 'Samsun',
    Trabzon: 'Samsun',
  }
  const hub = hubs[city] ?? 'Ankara'
  return { en: `${hub} transfer centre`, tr: `${hub} transfer merkezi` }
}

export interface TrackingEvent {
  stage: TrackingStage | 'cancelled' | 'returnRequested'
  at: Dayjs
  done: boolean
  location: Text
}

/** Every step of the delivery: the ones behind with their time, the ones ahead as expected. */
export function trackingEvents(order: Order, now: Dayjs): TrackingEvent[] {
  const placed = dayjs(order.placedAt)
  const minutesPerHour = order.pace === 'demo' ? DEMO_MINUTES_PER_HOUR : 60
  const warehouse = warehouseLabel(order.warehouse)
  const destination: Text = {
    en: `${order.address.district}, ${order.address.city}`,
    tr: `${order.address.district}, ${order.address.city}`,
  }
  const locations: Record<TrackingStage, Text> = {
    received: { en: 'Online order', tr: 'Online sipariş' },
    preparing: warehouse,
    shipped: warehouse,
    inTransit: hubFor(order.address.city),
    outForDelivery: {
      en: `${order.address.city} delivery branch`,
      tr: `${order.address.city} dağıtım şubesi`,
    },
    delivered: destination,
    ready: warehouse,
  }
  const cancelled = order.cancelledAt ? dayjs(order.cancelledAt) : undefined
  const events: TrackingEvent[] = []
  for (const [stage, hours] of trackingPlans[order.shipping]) {
    const at = placed.add(Math.round(hours * minutesPerHour * 60), 'second')
    if (cancelled && !at.isBefore(cancelled)) break
    events.push({ stage, at, done: !at.isAfter(now), location: locations[stage] })
  }
  if (cancelled) {
    events.push({
      stage: 'cancelled',
      at: cancelled,
      done: true,
      location: { en: 'Cancelled by you', tr: 'Sizin tarafınızdan iptal edildi' },
    })
  }
  if (order.returnRequestedAt) {
    events.push({
      stage: 'returnRequested',
      at: dayjs(order.returnRequestedAt),
      done: true,
      location: { en: 'Return pickup booked', tr: 'İade alımı planlandı' },
    })
  }
  return events
}

function warehouseLabel(id: WarehouseId): Text {
  const labels: Record<WarehouseId, Text> = {
    ist: { en: 'Istanbul warehouse, Hadımköy', tr: 'İstanbul deposu, Hadımköy' },
    ank: { en: 'Ankara warehouse, Ostim', tr: 'Ankara deposu, Ostim' },
    izm: { en: 'İzmir warehouse, Kemalpaşa', tr: 'İzmir deposu, Kemalpaşa' },
  }
  return labels[id]
}

export type OrderStatus = TrackingEvent['stage']

export function orderStatus(order: Order, now: Dayjs): OrderStatus {
  const events = trackingEvents(order, now).filter((event) => event.done)
  return events.at(-1)?.stage ?? 'received'
}

/** The last planned step's time: delivery, or ready for collection. */
export function estimatedArrival(order: Order, now: Dayjs): Dayjs | undefined {
  if (order.cancelledAt) return undefined
  return trackingEvents(order, now)
    .filter((event) => event.stage !== 'returnRequested')
    .at(-1)?.at
}

/** Until the parcel is handed to the carrier, the warehouse can still take it off the shelf. */
export function canCancel(order: Order, now: Dayjs): boolean {
  const status = orderStatus(order, now)
  return status === 'received' || status === 'preparing'
}

export const RETURN_DAYS = 14

export function canReturn(order: Order, now: Dayjs): boolean {
  if (order.cancelledAt || order.returnRequestedAt) return false
  const finished = trackingEvents(order, now).find(
    (event) => (event.stage === 'delivered' || event.stage === 'ready') && event.done,
  )
  return finished !== undefined && now.diff(finished.at, 'day', true) <= RETURN_DAYS
}

/** The warehouse that can send the most of the order in one parcel. */
export function pickWarehouse(lines: ResolvedLine[], shipping: ShippingMethodId): WarehouseId {
  if (shipping === 'sameDay' || shipping === 'pickup') return 'ist'
  const covered = (id: WarehouseId) =>
    lines.reduce((sum, line) => sum + Math.min(line.part.stock[id], line.quantity), 0)
  return [...warehouseIds].sort((a, b) => covered(b) - covered(a))[0]!
}

function hash(value: string): number {
  let result = 2166136261
  for (const char of value) {
    result ^= char.charCodeAt(0)
    result = Math.imul(result, 16777619)
  }
  return result >>> 0
}

export function trackingNumberFor(orderId: string, shipping: ShippingMethodId): string {
  const digits = String(hash(orderId)).padStart(10, '0').slice(0, 10)
  return `${shippingMethods[shipping].trackingPrefix}${digits}`
}

export function orderNumber(now: Dayjs, sequence: number): string {
  return `TL-${now.format('YYMMDD')}-${String(sequence).padStart(4, '0')}`
}

export function createOrder(values: {
  id: string
  now: Dayjs
  lines: ResolvedLine[]
  address: Address
  shipping: ShippingMethodId
  payment: PaymentMethodId
  vehicle?: string
  pace?: Order['pace']
}): Order {
  return {
    id: values.id,
    placedAt: values.now.toISOString(),
    lines: values.lines.map((line) => ({
      partId: line.part.id,
      name: line.part.name,
      brand: findBrand(line.part.brandId)?.name ?? '',
      sku: line.part.sku,
      quantity: line.quantity,
      unitPrice: line.part.price,
    })),
    address: values.address,
    shipping: values.shipping,
    payment: values.payment,
    totals: orderTotals(values.lines, values.shipping, values.payment),
    trackingNumber: trackingNumberFor(values.id, values.shipping),
    warehouse: pickWarehouse(values.lines, values.shipping),
    pace: values.pace ?? 'demo',
    vehicle: values.vehicle,
  }
}

const demoAddress: Address = {
  fullName: 'Deniz Aydın',
  phone: '0555 010 20 30',
  email: 'deniz@example.com',
  city: 'Ankara',
  district: 'Çankaya',
  line: 'Kavaklıdere Mah. Tunus Cad. No: 12/4',
  postcode: '06680',
}

const firstPart = (predicate: (part: Part) => boolean) =>
  partsCatalog.find((part) => predicate(part) && totalStock(part) > 0) ?? partsCatalog[0]!

const forClio = (typeId: string) => (part: Part) =>
  part.typeId === typeId &&
  part.fitment.kind === 'vehicles' &&
  part.fitment.applications.some((entry) => entry.engineIds.includes('clio4-15dci'))

/**
 * An order history in every state a customer sees: delivered, on the road, still being
 * packed and cancelled. Dated from now, so it reads the same whenever the demo is opened.
 */
export function seedOrders(now: Dayjs): Order[] {
  const line = (part: Part, quantity: number): ResolvedLine => ({
    part,
    quantity,
    total: round(part.price * quantity),
  })
  const vehicle = 'Renault Clio 1.5 dCi 90 · 2016'
  return [
    createOrder({
      id: orderNumber(now.subtract(9, 'day'), 1182),
      now: now.subtract(9, 'day').hour(10).minute(24),
      lines: [
        line(firstPart(forClio('oilFilter')), 1),
        line(firstPart(forClio('airFilter')), 1),
        line(
          firstPart((part) => part.typeId === 'engineOil'),
          1,
        ),
      ],
      address: demoAddress,
      shipping: 'standard',
      payment: 'card',
      vehicle,
      pace: 'real',
    }),
    createOrder({
      id: orderNumber(now.subtract(22, 'hour'), 1207),
      now: now.subtract(22, 'hour'),
      lines: [line(firstPart(forClio('frontPads')), 1), line(firstPart(forClio('frontDiscs')), 1)],
      address: demoAddress,
      shipping: 'standard',
      payment: 'transfer',
      vehicle,
      pace: 'real',
    }),
    {
      ...createOrder({
        id: orderNumber(now.subtract(4, 'day'), 1194),
        now: now.subtract(4, 'day').hour(18).minute(5),
        lines: [
          line(
            firstPart((part) => part.typeId === 'battery'),
            1,
          ),
        ],
        address: demoAddress,
        shipping: 'express',
        payment: 'cod',
        pace: 'real',
      }),
      cancelledAt: now.subtract(4, 'day').hour(18).minute(20).toISOString(),
    },
    createOrder({
      id: orderNumber(now.subtract(50, 'minute'), 1213),
      now: now.subtract(50, 'minute'),
      lines: [line(firstPart(forClio('frontWipers')), 1)],
      address: demoAddress,
      shipping: 'express',
      payment: 'card',
      vehicle,
      pace: 'real',
    }),
  ].sort((a, b) => b.placedAt.localeCompare(a.placedAt))
}
