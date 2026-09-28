import { describe, expect, it } from 'vitest'
import {
  convert,
  formatMoney,
  parsePricingSettings,
  plans,
  quote,
  recommendedPlan,
  type PlanId,
} from '@/features/showcases/data/saas'

const plan = (id: PlanId) => plans.find((entry) => entry.id === id)!

describe('SaaS pricing', () => {
  it('bills monthly at the list price per seat', () => {
    expect(quote(plan('team'), { cycle: 'monthly', seats: 10, currency: 'USD' })).toMatchObject({
      perSeatMonthly: 12,
      monthlyTotal: 120,
      invoiceTotal: 120,
      overLimit: false,
    })
  })

  it('charges ten months for a year and reports the saving', () => {
    const yearly = quote(plan('business'), { cycle: 'yearly', seats: 10, currency: 'USD' })

    expect(yearly).toMatchObject({
      perSeatMonthly: 20,
      monthlyTotal: 200,
      invoiceTotal: 2400,
      yearlySavings: 480,
    })
  })

  it('bills the plan minimum when the team is smaller', () => {
    const small = quote(plan('business'), { cycle: 'monthly', seats: 2, currency: 'USD' })

    expect(small.billedSeats).toBe(5)
    expect(small.invoiceTotal).toBe(120)
  })

  it('flags a team too big for the plan and recommends the cheapest one that fits', () => {
    expect(quote(plan('free'), { cycle: 'monthly', seats: 4, currency: 'USD' }).overLimit).toBe(
      true,
    )
    expect(recommendedPlan(3)).toBe('free')
    expect(recommendedPlan(4)).toBe('team')
    expect(recommendedPlan(51)).toBe('business')
  })

  it('leaves enterprise to sales', () => {
    expect(quote(plan('enterprise'), { cycle: 'yearly', seats: 30, currency: 'EUR' }).custom).toBe(
      true,
    )
  })

  it('converts the seat price first, so totals are whole multiples of it', () => {
    expect(convert(12, 'TRY')).toBe(492)
    expect(convert(12, 'EUR')).toBe(11.04)
    const lira = quote(plan('team'), { cycle: 'monthly', seats: 3, currency: 'TRY' })
    expect(lira.invoiceTotal).toBe(492 * 3)
  })

  it('formats money for the reader’s language', () => {
    expect(formatMoney(1200, 'USD', 'en')).toBe('$1,200')
    expect(formatMoney(11.04, 'EUR', 'en')).toBe('€11.04')
    expect(formatMoney(1476, 'TRY', 'tr')).toMatch(/1\.476/)
  })

  it('reads the pricing controls from the address and drops invalid values', () => {
    expect(
      parsePricingSettings(new URLSearchParams('billing=monthly&seats=25&currency=EUR')),
    ).toEqual({ cycle: 'monthly', seats: 25, currency: 'EUR' })
    expect(
      parsePricingSettings(new URLSearchParams('billing=weekly&seats=-2&currency=GBP')),
    ).toEqual({ cycle: 'yearly', seats: 10, currency: 'USD' })
  })
})
