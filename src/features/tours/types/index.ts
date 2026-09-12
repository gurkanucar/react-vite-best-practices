export type TourStatus = 'published' | 'draft'

export type SortKey = 'latest' | 'oldest' | 'priceLow' | 'priceHigh' | 'rating'

export const SORT_KEYS: SortKey[] = ['latest', 'oldest', 'priceLow', 'priceHigh', 'rating']

export interface TourBooker {
  id: string
  name: string
  bookedAt: string
  guests: number
  /** A translation key under `tours.bookerStatuses`. */
  statusId: 'confirmed' | 'pending' | 'cancelled'
}

export interface TourDay {
  /** A translation key under `tours.programDays`. */
  bodyId: string
}

export interface Tour {
  id: string
  /** A translation key under `tours.names`. */
  nameId: string
  /** A translation key under `tours.countries`. */
  countryId: string
  price: number
  compareAtPrice: number
  rating: number
  reviewCount: number
  bookedCount: number
  postedAt: string
  startsOn: string
  endsOn: string
  durationNights: number
  status: TourStatus
  guides: string[]
  contactPhones: string[]
  images: string[]
  /** Translation keys under `tours.highlights`. */
  highlightIds: string[]
  program: TourDay[]
  /** Every service, with the ones this tour does not include marked. */
  services: { id: string; included: boolean }[]
  bookers: TourBooker[]
}

export interface TourFilters {
  search: string
  sort: SortKey
  /** Translation keys under `tours.countries`; empty means every country. */
  countries: string[]
  minRating: number
}

export const DEFAULT_TOUR_FILTERS: TourFilters = {
  search: '',
  sort: 'latest',
  countries: [],
  minRating: 0,
}

/**
 * Filtering and sorting in one pass over the list, so the page never holds a half-filtered
 * copy. A real list this size would ask the server instead; see docs 021.
 */
export function applyTourFilters(
  tours: Tour[],
  filters: TourFilters,
  nameOf: (tour: Tour) => string,
): Tour[] {
  const search = filters.search.trim().toLocaleLowerCase()

  const matching = tours.filter((tour) => {
    if (search && !nameOf(tour).toLocaleLowerCase().includes(search)) return false
    if (filters.countries.length > 0 && !filters.countries.includes(tour.countryId)) return false

    return tour.rating >= filters.minRating
  })

  const sorters: Record<SortKey, (left: Tour, right: Tour) => number> = {
    latest: (left, right) => right.postedAt.localeCompare(left.postedAt),
    oldest: (left, right) => left.postedAt.localeCompare(right.postedAt),
    priceLow: (left, right) => left.price - right.price,
    priceHigh: (left, right) => right.price - left.price,
    rating: (left, right) => right.rating - left.rating,
  }

  return [...matching].sort(sorters[filters.sort])
}
