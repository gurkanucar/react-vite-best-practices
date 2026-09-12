import { describe, expect, it } from 'vitest'
import { applyTourFilters, DEFAULT_TOUR_FILTERS, type Tour } from '@/features/tours/types'

function tour(id: string, overrides: Partial<Tour> = {}): Tour {
  return {
    id,
    nameId: id,
    countryId: 'canada',
    price: 50,
    compareAtPrice: 60,
    rating: 4,
    reviewCount: 10,
    bookedCount: 12,
    postedAt: '2026-09-01',
    startsOn: '2026-09-10',
    endsOn: '2026-09-11',
    durationNights: 3,
    status: 'published',
    guides: [],
    contactPhones: [],
    images: [],
    highlightIds: [],
    program: [],
    services: [],
    bookers: [],
    ...overrides,
  }
}

const tours = [
  tour('a', { postedAt: '2026-09-03', price: 90, rating: 3 }),
  tour('b', { postedAt: '2026-09-01', price: 20, rating: 5, countryId: 'india' }),
  tour('c', { postedAt: '2026-09-02', price: 50, rating: 4 }),
]

const idsOf = (filters: Parameters<typeof applyTourFilters>[1]) =>
  applyTourFilters(tours, filters, (entry) => entry.nameId).map((entry) => entry.id)

describe('applyTourFilters', () => {
  it('puts the newest first by default', () => {
    expect(idsOf(DEFAULT_TOUR_FILTERS)).toEqual(['a', 'c', 'b'])
  })

  it('sorts by price in both directions', () => {
    expect(idsOf({ ...DEFAULT_TOUR_FILTERS, sort: 'priceLow' })).toEqual(['b', 'c', 'a'])
    expect(idsOf({ ...DEFAULT_TOUR_FILTERS, sort: 'priceHigh' })).toEqual(['a', 'c', 'b'])
  })

  it('narrows to the chosen countries', () => {
    expect(idsOf({ ...DEFAULT_TOUR_FILTERS, countries: ['india'] })).toEqual(['b'])
    // An empty selection means every country, not none of them.
    expect(idsOf({ ...DEFAULT_TOUR_FILTERS, countries: [] })).toHaveLength(3)
  })

  it('drops anything rated below the minimum', () => {
    expect(idsOf({ ...DEFAULT_TOUR_FILTERS, minRating: 4 })).toEqual(['c', 'b'])
  })

  it('matches the search against the resolved name, not the key', () => {
    const named = applyTourFilters(tours, { ...DEFAULT_TOUR_FILTERS, search: 'ISLAND' }, (entry) =>
      entry.id === 'b' ? 'Island hopping' : 'Something else',
    )

    expect(named.map((entry) => entry.id)).toEqual(['b'])
  })

  it('leaves the original array alone', () => {
    const order = tours.map((entry) => entry.id)

    idsOf({ ...DEFAULT_TOUR_FILTERS, sort: 'priceLow' })

    expect(tours.map((entry) => entry.id)).toEqual(order)
  })
})
