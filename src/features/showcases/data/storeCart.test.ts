import { describe, expect, it } from 'vitest'
import { findStoreProduct, storeProducts } from '@/features/showcases/data/store'
import {
  cartTotals,
  checkCoupon,
  compareAtPrice,
  findVariant,
  formatCardNumber,
  isValidCardNumber,
  isValidExpiry,
  orderNumber,
  resolveLines,
  stockLevel,
  type CartLine,
  type CouponCode,
  type ShippingMethod,
} from '@/features/showcases/data/storeCart'
import {
  activeFilterCount,
  EMPTY_FILTERS,
  filterProducts,
  filtersToParams,
  parseFilters,
  sizeOptions,
} from '@/features/showcases/data/storeFilters'

const mugs: CartLine = { productId: 'morning-mugs', colour: 'sand', quantity: 2 } // 2 × 420
const bigRug: CartLine = {
  productId: 'anatolia-rug',
  colour: 'clay',
  size: '160 × 230',
  quantity: 1,
} // 5250

const totalsFor = (lines: CartLine[], coupon: CouponCode | null, method: ShippingMethod) =>
  cartTotals(resolveLines(lines, storeProducts), coupon, method)

describe('store cart', () => {
  it('prices a line by its size and scales the compare-at price with it', () => {
    const rug = findStoreProduct('anatolia-rug')!
    const large = findVariant(rug, 'clay', '160 × 230')
    expect(large?.price).toBe(5250)
    expect(compareAtPrice(rug, large)).toBe(Math.round((3990 * 5250) / 3450))
    expect(resolveLines([bigRug], storeProducts)[0]!.lineTotal).toBe(5250)
  })

  it('drops lines whose product left the catalog', () => {
    expect(resolveLines([{ ...mugs, productId: 'gone' }], storeProducts)).toEqual([])
  })

  it('charges standard delivery below the threshold and waives it above', () => {
    const small = totalsFor([mugs], null, 'standard')
    expect(small).toMatchObject({ subtotal: 840, shipping: 89, total: 929 })
    expect(small.freeShippingRemaining).toBe(660)

    const large = totalsFor([bigRug], null, 'standard')
    expect(large).toMatchObject({ shipping: 0, freeShippingRemaining: 0, total: 5250 })
    // Express is never free; picking up in store always is.
    expect(totalsFor([bigRug], null, 'express').shipping).toBe(179)
    expect(totalsFor([mugs], null, 'pickup').shipping).toBe(0)
  })

  it('reads VAT out of the total instead of adding it', () => {
    const totals = totalsFor([bigRug], null, 'pickup')
    expect(totals.total).toBe(5250)
    expect(totals.vat).toBe(875)
  })

  it('takes the discount off before judging free delivery', () => {
    // 2 × 840 = 1680; 10% off leaves 1512, still over 1500.
    const justOver = totalsFor([{ ...mugs, quantity: 4 }], 'WELCOME10', 'standard')
    expect(justOver).toMatchObject({ subtotal: 1680, discount: 168, shipping: 0, total: 1512 })

    // 1260 − 126 = 1134: under the threshold, so delivery is charged.
    const under = totalsFor([{ ...mugs, quantity: 3 }], 'WELCOME10', 'standard')
    expect(under).toMatchObject({ discount: 126, shipping: 89, total: 1223 })
  })

  it('checks coupon codes, ignoring case and spaces', () => {
    expect(checkCoupon('  welcome10 ', 100)).toEqual({ ok: true, code: 'WELCOME10' })
    expect(checkCoupon('', 100)).toMatchObject({ ok: false, reason: 'empty' })
    expect(checkCoupon('HALFOFF', 100)).toMatchObject({ ok: false, reason: 'unknown' })
    expect(checkCoupon('SAVE250', 1999)).toMatchObject({
      ok: false,
      reason: 'minimum',
      minimum: 2000,
    })
    expect(checkCoupon('SAVE250', 2000)).toMatchObject({ ok: true })
  })

  it('makes delivery free with FREESHIP and marks a coupon the cart has shrunk below', () => {
    expect(totalsFor([mugs], 'FREESHIP', 'standard')).toMatchObject({
      shipping: 0,
      freeShippingRemaining: 0,
    })
    expect(totalsFor([mugs], 'SAVE250', 'standard')).toMatchObject({
      discount: 0,
      couponInactive: true,
    })
    expect(totalsFor([bigRug], 'SAVE250', 'pickup')).toMatchObject({
      discount: 250,
      total: 5000,
    })
  })

  it('names stock levels', () => {
    expect([0, 3, 5, 6].map(stockLevel)).toEqual(['out', 'low', 'low', 'in'])
  })

  it('validates demo card details', () => {
    expect(isValidCardNumber('4242 4242 4242 4242')).toBe(true)
    expect(isValidCardNumber('4242 4242 4242 4241')).toBe(false)
    expect(isValidCardNumber('4242')).toBe(false)
    expect(formatCardNumber('4242424242424242999')).toBe('4242 4242 4242 4242')

    const now = new Date(2026, 8, 28)
    expect(isValidExpiry('09/26', now)).toBe(true)
    expect(isValidExpiry('08/26', now)).toBe(false)
    expect(isValidExpiry('13/30', now)).toBe(false)
    expect(isValidExpiry('1230', now)).toBe(false)
  })

  it('numbers orders with the shop prefix', () => {
    expect(orderNumber(1_790_000_000_000, 0)).toMatch(/^KL-\d{6}$/)
  })
})

describe('store filters', () => {
  it('reads the address bar and drops values that are not options', () => {
    const filters = parseFilters(
      new URLSearchParams(
        'category=lighting&colour=ink,purple&sort=cheap&rating=4.5&min=-5&sale=1',
      ),
    )
    expect(filters).toMatchObject({
      category: 'lighting',
      colours: ['ink'],
      sort: 'featured',
      rating: 4.5,
      min: null,
      onSale: true,
    })
  })

  it('writes only what differs from the defaults', () => {
    expect(filtersToParams(EMPTY_FILTERS).toString()).toBe('')
    const params = filtersToParams({ ...EMPTY_FILTERS, colours: ['sage', 'ink'], sort: 'newest' })
    expect(params.toString()).toBe('colour=sage%2Cink&sort=newest')
    expect(parseFilters(params)).toMatchObject({ colours: ['sage', 'ink'], sort: 'newest' })
  })

  it('counts filters, not the search or sort', () => {
    expect(
      activeFilterCount({ ...EMPTY_FILTERS, q: 'vase', sort: 'rating', min: 100, max: 500 }),
    ).toBe(1)
  })

  it('matches a colour and size only through a variant that has both', () => {
    const ids = (filters: Partial<typeof EMPTY_FILTERS>) =>
      filterProducts(storeProducts, { ...EMPTY_FILTERS, ...filters }, 'en').map((p) => p.id)

    expect(ids({ colours: ['ink'], sizes: ['50 × 50'] })).toEqual(['linen-cushion'])
    // The clay cushion is sold out in 50 × 50, though other clay pieces are in stock.
    expect(ids({ colours: ['clay'], sizes: ['50 × 50'] })).toEqual(['linen-cushion'])
    expect(ids({ colours: ['clay'], sizes: ['50 × 50'], inStock: true })).toEqual([])
  })

  it('searches in either language, ignoring accents, and sorts', () => {
    const search = (q: string, language: 'en' | 'tr') =>
      filterProducts(storeProducts, { ...EMPTY_FILTERS, q }, language).map((p) => p.id)

    expect(search('lamp', 'en')).toEqual(['halo-lamp'])
    expect(search('kilim', 'tr')).toEqual(['anatolia-rug'])
    expect(search('yastik', 'tr')).toEqual(['linen-cushion'])

    const cheapest = filterProducts(storeProducts, { ...EMPTY_FILTERS, sort: 'priceAsc' }, 'en')
    expect(cheapest[0]!.id).toBe('fig-cedar-candle')
  })

  it('offers only the sizes of the chosen category', () => {
    expect(sizeOptions(storeProducts, 'furniture')).toEqual([])
    expect(sizeOptions(storeProducts, 'home')).toEqual(['S', 'M', 'L'])
  })
})
