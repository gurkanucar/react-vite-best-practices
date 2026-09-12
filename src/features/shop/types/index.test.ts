import { describe, expect, it } from 'vitest'
import { totalsFor } from '@/features/shop/types'

const lines = [
  { quantity: 2, unitPrice: 97.14 },
  { quantity: 1, unitPrice: 45.5 },
]

describe('totalsFor', () => {
  it('adds the lines up', () => {
    expect(totalsFor(lines, { shipping: 0, discount: 0, taxRate: 0 }).subtotal).toBeCloseTo(239.78)
  })

  it('charges tax on the discounted subtotal, not the list price', () => {
    const { tax, total } = totalsFor(lines, { shipping: 0, discount: 39.78, taxRate: 0.1 })

    expect(tax).toBeCloseTo(20)
    expect(total).toBeCloseTo(220)
  })

  it('adds shipping after tax', () => {
    const { total } = totalsFor(lines, { shipping: 10, discount: 39.78, taxRate: 0.1 })

    expect(total).toBeCloseTo(230)
  })

  it('never taxes a negative subtotal when the discount exceeds it', () => {
    const { tax, total } = totalsFor([{ quantity: 1, unitPrice: 10 }], {
      shipping: 5,
      discount: 40,
      taxRate: 0.2,
    })

    expect(tax).toBe(0)
    expect(total).toBe(5)
  })
})
