export type ProductStatus = 'published' | 'draft'
export type StockStatus = 'inStock' | 'lowStock' | 'outOfStock'

export interface ProductColour {
  id: string
  /** A CSS colour, used for the swatch only. */
  swatch: string
  image: string
}

export interface ProductReview {
  id: string
  author: string
  rating: number
  postedAt: string
  /** A translation key under `shop.reviewBodies`. */
  bodyId: string
  helpful: number
}

export interface Product {
  id: string
  /** A translation key under `shop.products`. */
  nameId: string
  sku: string
  price: number
  compareAtPrice?: number
  rating: number
  reviewCount: number
  status: ProductStatus
  stock: StockStatus
  available: number
  colours: ProductColour[]
  sizes: number[]
  images: string[]
  /** Translation keys under `shop.specs`. */
  specs: { id: string; value: string }[]
  reviews: ProductReview[]
}

export type OrderStatus = 'pending' | 'packing' | 'shipped' | 'delivered'

export interface OrderLine {
  id: string
  /** A translation key under `shop.products`. */
  nameId: string
  sku: string
  image: string
  quantity: number
  unitPrice: number
}

export interface OrderEvent {
  /** A translation key under `shop.orderEvents`. */
  id: string
  at: string
  done: boolean
}

export interface Order {
  id: string
  placedAt: string
  status: OrderStatus
  customer: { name: string; email: string; phone: string }
  shipTo: string[]
  /** A translation key under `shop.shippingMethods`. */
  shippingMethodId: string
  trackingNumber: string
  lines: OrderLine[]
  shipping: number
  discount: number
  taxRate: number
  timeline: OrderEvent[]
}

export type InvoiceStatus = 'paid' | 'pending' | 'overdue'

export interface InvoiceLine {
  id: string
  /** A translation key under `shop.services`. */
  titleId: string
  /** A translation key under `shop.serviceDescriptions`. */
  descriptionId: string
  quantity: number
  unitPrice: number
}

export interface Invoice {
  id: string
  status: InvoiceStatus
  issuedAt: string
  dueAt: string
  from: { name: string; address: string[]; phone: string }
  to: { name: string; address: string[]; phone: string }
  lines: InvoiceLine[]
  shipping: number
  discount: number
  taxRate: number
}

export function lineTotal(quantity: number, unitPrice: number): number {
  return quantity * unitPrice
}

export interface MoneyTotals {
  subtotal: number
  shipping: number
  discount: number
  tax: number
  total: number
}

/**
 * One place that decides what a document adds up to. Tax is charged on the discounted
 * subtotal rather than the list price, and shipping is added after it — get that order
 * wrong and every figure below the subtotal is off by a little.
 */
export function totalsFor(
  lines: { quantity: number; unitPrice: number }[],
  { shipping, discount, taxRate }: { shipping: number; discount: number; taxRate: number },
): MoneyTotals {
  const subtotal = lines.reduce((sum, line) => sum + lineTotal(line.quantity, line.unitPrice), 0)
  const taxed = Math.max(subtotal - discount, 0)
  const tax = Math.round(taxed * taxRate * 100) / 100

  return { subtotal, shipping, discount, tax, total: taxed + tax + shipping }
}
