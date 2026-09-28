import { describe, expect, it } from 'vitest'
import {
  findHood,
  hoodOf,
  listings,
  neighbourhoods,
  recentDrop,
  roomsLabel,
  type Listing,
} from '@/features/showcases/data/estate'
import { boundsContain, clusterPoints, parseBounds } from '@/features/showcases/data/estateGeo'
import {
  affordablePrice,
  monthlyPayment,
  mortgagePlan,
  moveInCost,
} from '@/features/showcases/data/estateMortgage'
import {
  activeFilterCount,
  bestInComparison,
  defaultFilters,
  filtersToParams,
  fold,
  matchesFilters,
  parseCompareIds,
  parseFilters,
  searchListings,
  similarListings,
} from '@/features/showcases/data/estateSearch'

const params = (query: string) => new URLSearchParams(query)

describe('estate catalogue', () => {
  it('generates the same homes every time, each inside its neighbourhood', () => {
    expect(listings).toHaveLength(168)
    expect(new Set(listings.map((listing) => listing.id)).size).toBe(168)
    for (const listing of listings) {
      const hood = hoodOf(listing)
      const lngSpread = hood.spread / Math.cos((hood.center[0] * Math.PI) / 180)
      expect(Math.abs(listing.position[0] - hood.center[0])).toBeLessThanOrEqual(hood.spread)
      expect(Math.abs(listing.position[1] - hood.center[1])).toBeLessThanOrEqual(lngSpread)
      expect(listing.price).toBeGreaterThan(0)
      expect(listing.netArea).toBeLessThan(listing.grossArea)
      expect(listing.photos).toHaveLength(6)
      // The history always ends at the price the home is listed for now.
      expect(listing.priceHistory.at(-1)!.price).toBe(listing.price)
      expect(listing.priceHistory[0]!.daysAgo).toBe(listing.listedDaysAgo)
    }
    // Two featured homes in each city.
    expect(listings.filter((listing) => listing.featured)).toHaveLength(6)
  })

  it('writes rooms the Turkish way, with a studio as 1+0', () => {
    expect(roomsLabel({ bedrooms: 0, livingRooms: 1 })).toBe('1+0')
    expect(roomsLabel({ bedrooms: 3, livingRooms: 1 })).toBe('3+1')
  })

  it('reports a price drop only when the last change was recent and down', () => {
    const base = listings[0]!
    const dropped: Listing = {
      ...base,
      price: 900,
      priceHistory: [
        { daysAgo: 40, price: 1000 },
        { daysAgo: 5, price: 900 },
      ],
    }
    expect(recentDrop(dropped)).toBe(10)
    expect(
      recentDrop({
        ...dropped,
        priceHistory: [
          { daysAgo: 40, price: 1000 },
          { daysAgo: 30, price: 900 },
        ],
      }),
    ).toBeUndefined()
    expect(
      recentDrop({
        ...dropped,
        priceHistory: [
          { daysAgo: 40, price: 800 },
          { daysAgo: 5, price: 900 },
        ],
      }),
    ).toBeUndefined()
  })
})

describe('estate search', () => {
  it('reads filters from the address and drops what is not an option', () => {
    const filters = parseFilters(
      params(
        'deal=rent&city=izmir&type=villa,boat&rooms=2%2B1,9%2B9&minPrice=-5&maxAge=7&sort=nope&page=0&area=1,2',
      ),
    )
    expect(filters).toMatchObject({
      deal: 'rent',
      city: 'izmir',
      types: ['villa'],
      rooms: ['2+1'],
      minPrice: undefined,
      maxAge: undefined,
      sort: 'recommended',
      page: 1,
      bounds: undefined,
    })
  })

  it('writes an address that reads back the same, leaving the defaults out', () => {
    expect(filtersToParams(defaultFilters).toString()).toBe('')
    const filters = {
      ...defaultFilters,
      deal: 'rent' as const,
      rooms: ['1+1' as const, '2+1' as const],
      maxPrice: 40_000,
      amenities: ['furnished' as const],
      bounds: [41, 28.9, 41.1, 29.1] as [number, number, number, number],
      sort: 'priceAsc' as const,
    }
    expect(parseFilters(filtersToParams(filters))).toEqual(filters)
  })

  it('finds places without Turkish letters and in any case', () => {
    expect(fold('KADIKÖY')).toBe(fold('kadikoy'))
    const found = searchListings(listings, { ...defaultFilters, q: 'kadikoy' })
    expect(found.length).toBeGreaterThan(0)
    expect(found.every((listing) => hoodOf(listing).district === 'Kadıköy')).toBe(true)
  })

  it('combines filters and counts the ones a visitor set', () => {
    const filters = parseFilters(params('city=istanbul&rooms=3%2B1&has=parking&maxDues=3000'))
    const found = searchListings(listings, filters)
    expect(found.length).toBeGreaterThan(0)
    for (const listing of found) {
      expect(listing).toMatchObject({ deal: 'sale', city: 'istanbul', bedrooms: 3 })
      expect(listing.features).toContain('parking')
      expect(listing.dues).toBeLessThanOrEqual(3000)
    }
    expect(activeFilterCount(filters)).toBe(4)
  })

  it('keeps the map area out of the count when asked to', () => {
    const hood = findHood('moda')!
    const [lat, lng] = hood.center
    const bounds: [number, number, number, number] = [
      lat - 0.01,
      lng - 0.01,
      lat + 0.01,
      lng + 0.01,
    ]
    const filters = { ...defaultFilters, bounds }
    const inArea = listings.filter((listing) => matchesFilters(listing, filters))
    expect(inArea.length).toBeGreaterThan(0)
    expect(inArea.every((listing) => boundsContain(bounds, listing.position))).toBe(true)
    const everywhere = listings.filter((listing) =>
      matchesFilters(listing, filters, { ignoreBounds: true }),
    )
    expect(everywhere.length).toBeGreaterThan(inArea.length)
  })

  it('shows saved homes only when they are saved', () => {
    const [first, second] = listings.filter((listing) => listing.deal === 'sale')
    const found = searchListings(
      listings,
      { ...defaultFilters, saved: true },
      { favourites: [first!.id, second!.id] },
    )
    expect(found.map((listing) => listing.id).sort()).toEqual([first!.id, second!.id].sort())
    expect(searchListings(listings, { ...defaultFilters, saved: true })).toEqual([])
  })

  it('sorts by price and suggests similar homes from the same city and deal', () => {
    const sorted = searchListings(listings, { ...defaultFilters, sort: 'priceAsc' })
    expect(sorted.map((listing) => listing.price)).toEqual(
      [...sorted.map((listing) => listing.price)].sort((a, b) => a - b),
    )
    const listing = listings[0]!
    const similar = similarListings(listing, listings)
    expect(similar).toHaveLength(4)
    expect(
      similar.every(
        (other) =>
          other.id !== listing.id && other.city === listing.city && other.deal === listing.deal,
      ),
    ).toBe(true)
  })

  it('marks the best value in each comparison row, and nothing on a tie', () => {
    const [a, b] = listings
    const cheap = { ...a!, id: 'a', price: 100, grossArea: 50, dues: 0 }
    const dear = { ...b!, id: 'b', price: 200, grossArea: 80, dues: 0 }
    const best = bestInComparison([cheap, dear])
    expect(best.price).toEqual(['a'])
    expect(best.grossArea).toEqual(['b'])
    expect(best.dues).toEqual([])
    expect(bestInComparison([cheap]).price).toEqual([])
  })

  it('reads a compare link: known ids, no repeats, three at most', () => {
    const known = new Set(['1', '2', '3', '4'])
    expect(parseCompareIds('1,x,1,2,3,4', (id) => known.has(id))).toEqual(['1', '2', '3'])
    expect(parseCompareIds(null, () => true)).toEqual([])
  })
})

describe('estate geography', () => {
  it('parses a map area and refuses one that is upside down', () => {
    expect(parseBounds('40.9,28.9,41.1,29.1')).toEqual([40.9, 28.9, 41.1, 29.1])
    expect(parseBounds('41.1,28.9,40.9,29.1')).toBeUndefined()
    expect(parseBounds('a,b,c,d')).toBeUndefined()
  })

  it('clusters points until no two bubbles are closer than the radius', () => {
    const points: [number, number][] = [
      [0, 0],
      [0, 10],
      [0, 20],
      [0, 100],
      [0, 300],
    ]
    const clusters = clusterPoints(
      points,
      (point) => point,
      ([x, y]) => ({ x, y }),
      30,
    )
    expect(clusters.map((cluster) => cluster.items.length).sort()).toEqual([1, 1, 3])
    expect(clusters.reduce((sum, cluster) => sum + cluster.items.length, 0)).toBe(points.length)
    for (const a of clusters) {
      for (const b of clusters) {
        if (a === b) continue
        expect(
          Math.hypot(a.position[0] - b.position[0], a.position[1] - b.position[1]),
        ).toBeGreaterThan(30)
      }
    }
  })

  it('places every neighbourhood in the city it belongs to', () => {
    const cityLatitude = { istanbul: [40.9, 41.2], izmir: [38.2, 38.6], ankara: [39.7, 40] }
    for (const hood of neighbourhoods) {
      const [min, max] = cityLatitude[hood.city]
      expect(hood.center[0]).toBeGreaterThan(min!)
      expect(hood.center[0]).toBeLessThan(max!)
    }
  })
})

describe('estate money', () => {
  it('works out a fixed instalment, with or without interest', () => {
    expect(monthlyPayment(1_000_000, 0.02, 12)).toBeCloseTo(94_559.6, 1)
    expect(monthlyPayment(1_200_000, 0, 12)).toBe(100_000)
    expect(monthlyPayment(0, 0.02, 12)).toBe(0)
  })

  it('splits a plan into a down payment, a loan and years that pay it off', () => {
    const plan = mortgagePlan({
      price: 10_000_000,
      downPaymentPct: 30,
      months: 120,
      monthlyRatePct: 2.49,
    })
    expect(plan.downPayment).toBe(3_000_000)
    expect(plan.loan).toBe(7_000_000)
    expect(plan.years).toHaveLength(10)
    expect(plan.years.at(-1)!.balance).toBe(0)
    const principal = plan.years.reduce((sum, year) => sum + year.principal, 0)
    expect(Math.abs(principal - plan.loan)).toBeLessThanOrEqual(10)
    expect(plan.totalPaid).toBe(plan.loan + plan.totalInterest)
  })

  it('turns a monthly budget back into the price it pays for', () => {
    const input = { downPaymentPct: 25, months: 120, monthlyRatePct: 2.49 }
    const price = affordablePrice(80_000, input)
    expect(mortgagePlan({ price, ...input }).monthly).toBeCloseTo(80_000, -1)
  })

  it('adds up what moving into a rented home costs', () => {
    expect(moveInCost(30_000)).toEqual({
      firstRent: 30_000,
      deposit: 60_000,
      agencyFee: 36_000,
      total: 126_000,
    })
  })
})
