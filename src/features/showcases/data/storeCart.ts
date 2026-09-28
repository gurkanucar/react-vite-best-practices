import type { StoreProduct, StoreVariant } from '@/features/showcases/data/store'
import type { Language } from '@/store/preferences-store'

export interface CartLine {
  productId: string
  colour: string
  size?: string
  quantity: number
}

export type ShippingMethod = 'standard' | 'express' | 'pickup'

export const SHIPPING_METHODS: ShippingMethod[] = ['standard', 'express', 'pickup']

export const SHIPPING_PRICES: Record<ShippingMethod, number> = {
  standard: 89,
  express: 179,
  pickup: 0,
}

/** Standard delivery is free from here, measured after any discount. */
export const FREE_SHIPPING_THRESHOLD = 1500

/** Turkish prices include VAT; the receipt only says how much of the total it is. */
export const VAT_RATE = 0.2

export type CouponCode = 'WELCOME10' | 'FREESHIP' | 'SAVE250'

interface Coupon {
  kind: 'percent' | 'amount' | 'freeShipping'
  value: number
  /** The subtotal the order has to reach first. */
  minimum?: number
}

export const COUPONS: Record<CouponCode, Coupon> = {
  WELCOME10: { kind: 'percent', value: 10 },
  FREESHIP: { kind: 'freeShipping', value: 0 },
  SAVE250: { kind: 'amount', value: 250, minimum: 2000 },
}

export type CouponCheck =
  | { ok: true; code: CouponCode }
  | { ok: false; reason: 'empty' | 'unknown' | 'minimum'; minimum?: number }

export function normalizeCoupon(input: string): string {
  return input.trim().toUpperCase()
}

export function checkCoupon(input: string, subtotal: number): CouponCheck {
  const code = normalizeCoupon(input)
  if (!code) return { ok: false, reason: 'empty' }
  if (!(code in COUPONS)) return { ok: false, reason: 'unknown' }
  const coupon = COUPONS[code as CouponCode]
  if (coupon.minimum && subtotal < coupon.minimum) {
    return { ok: false, reason: 'minimum', minimum: coupon.minimum }
  }
  return { ok: true, code: code as CouponCode }
}

export function lineKey(line: Pick<CartLine, 'productId' | 'colour' | 'size'>): string {
  return [line.productId, line.colour, line.size ?? ''].join('|')
}

export function findVariant(
  product: StoreProduct,
  colour: string,
  size?: string,
): StoreVariant | undefined {
  return product.variants.find(
    (variant) => variant.colour === colour && (variant.size ?? undefined) === (size ?? undefined),
  )
}

export function unitPrice(product: StoreProduct, variant?: StoreVariant): number {
  return variant?.price ?? product.price
}

/** What was struck through: the compare-at price, scaled up for a larger size. */
export function compareAtPrice(product: StoreProduct, variant?: StoreVariant): number | undefined {
  if (!product.compareAt) return undefined
  return Math.round((product.compareAt * unitPrice(product, variant)) / product.price)
}

export function discountPercent(product: StoreProduct): number | undefined {
  if (!product.compareAt || product.compareAt <= product.price) return undefined
  return Math.round((1 - product.price / product.compareAt) * 100)
}

export function totalStock(product: StoreProduct): number {
  return product.variants.reduce((sum, variant) => sum + variant.stock, 0)
}

export type StockLevel = 'in' | 'low' | 'out'

/** Five or fewer is "low": the moment a shop starts saying "only 3 left". */
export function stockLevel(stock: number): StockLevel {
  if (stock <= 0) return 'out'
  return stock <= 5 ? 'low' : 'in'
}

/** The variant quick add picks: the first colour and size that is in stock. */
export function firstAvailableVariant(product: StoreProduct): StoreVariant | undefined {
  return product.variants.find((variant) => variant.stock > 0)
}

export interface ResolvedLine extends CartLine {
  key: string
  product: StoreProduct
  unitPrice: number
  lineTotal: number
  stock: number
}

/** Lines whose product has left the catalog are dropped rather than priced at zero. */
export function resolveLines(lines: CartLine[], catalog: StoreProduct[]): ResolvedLine[] {
  return lines.flatMap((line) => {
    const product = catalog.find((entry) => entry.id === line.productId)
    if (!product) return []
    const variant = findVariant(product, line.colour, line.size)
    const price = unitPrice(product, variant)
    return [
      {
        ...line,
        key: lineKey(line),
        product,
        unitPrice: price,
        lineTotal: price * line.quantity,
        stock: variant?.stock ?? 0,
      },
    ]
  })
}

export interface CartTotals {
  itemCount: number
  subtotal: number
  discount: number
  shipping: number
  total: number
  vat: number
  /** How much more to spend for free standard delivery; 0 once it is reached. */
  freeShippingRemaining: number
  /** A coupon that no longer applies, because the cart shrank below its minimum. */
  couponInactive: boolean
}

const round2 = (value: number) => Math.round(value * 100) / 100

/**
 * The only place that adds money up. The discount comes off first, free delivery is judged on
 * what is left, and VAT is read out of the total rather than added to it.
 */
export function cartTotals(
  lines: ResolvedLine[],
  coupon: CouponCode | null,
  shippingMethod: ShippingMethod = 'standard',
): CartTotals {
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0)
  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0)
  const active = coupon && checkCoupon(coupon, subtotal).ok ? COUPONS[coupon] : null

  let discount = 0
  if (active?.kind === 'percent') discount = round2((subtotal * active.value) / 100)
  if (active?.kind === 'amount') discount = Math.min(active.value, subtotal)

  const afterDiscount = subtotal - discount
  const freeStandard = active?.kind === 'freeShipping' || afterDiscount >= FREE_SHIPPING_THRESHOLD
  const shipping =
    itemCount === 0 || (shippingMethod === 'standard' && freeStandard)
      ? 0
      : SHIPPING_PRICES[shippingMethod]
  const total = round2(afterDiscount + shipping)

  return {
    itemCount,
    subtotal,
    discount,
    shipping,
    total,
    vat: round2((total * VAT_RATE) / (1 + VAT_RATE)),
    freeShippingRemaining:
      active?.kind === 'freeShipping' ? 0 : Math.max(FREE_SHIPPING_THRESHOLD - afterDiscount, 0),
    couponInactive: Boolean(coupon) && !active,
  }
}

/** Lira in both languages: the shop is Turkish, so an English visitor pays the same number. */
export function formatPrice(value: number, language: Language): string {
  return new Intl.NumberFormat(language === 'tr' ? 'tr-TR' : 'en-US', {
    style: 'currency',
    currency: 'TRY',
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value)
}

/** `KL-` and six digits, from the time and a random part, so two tabs do not collide. */
export function orderNumber(now = Date.now(), random = Math.random()): string {
  const digits = String((Math.floor(now / 1000) + Math.floor(random * 1000)) % 1_000_000)
  return `KL-${digits.padStart(6, '0')}`
}

/** 16 digits for a demo card, with the Luhn check real card forms run before sending. */
export function isValidCardNumber(input: string): boolean {
  const digits = input.replace(/\s+/g, '')
  if (!/^\d{16}$/.test(digits)) return false
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

export function formatCardNumber(input: string): string {
  return input
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, '$1 ')
}

/** MM/YY, not before this month. */
export function isValidExpiry(input: string, now = new Date()): boolean {
  const match = /^(\d{2})\s*\/\s*(\d{2})$/.exec(input.trim())
  if (!match) return false
  const month = Number(match[1])
  const year = 2000 + Number(match[2])
  if (month < 1 || month > 12) return false
  return year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1)
}
