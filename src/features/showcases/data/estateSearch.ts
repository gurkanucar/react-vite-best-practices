import {
  CITIES,
  cityNames,
  hoodOf,
  pricePerM2,
  PROPERTY_TYPES,
  type City,
  type Deal,
  type Feature,
  type Listing,
  type PropertyType,
} from '@/features/showcases/data/estate'
import {
  boundsContain,
  formatBounds,
  parseBounds,
  type Bounds,
} from '@/features/showcases/data/estateGeo'

export const ROOM_OPTIONS = ['1+0', '1+1', '2+1', '3+1', '4+1', '5+'] as const
export type RoomOption = (typeof ROOM_OPTIONS)[number]
export const FLOOR_OPTIONS = ['ground', 'middle', 'high', 'notGround'] as const
export type FloorOption = (typeof FLOOR_OPTIONS)[number]
export const AGE_OPTIONS = [0, 5, 10, 20] as const
export const SORT_OPTIONS = [
  'recommended',
  'newest',
  'priceAsc',
  'priceDesc',
  'pricePerM2',
  'areaDesc',
] as const
export type SortOption = (typeof SORT_OPTIONS)[number]
export const AMENITY_FILTERS = ['furnished', 'parking', 'balcony'] as const
export type AmenityFilter = (typeof AMENITY_FILTERS)[number]

export const PAGE_SIZE = 12

export interface EstateFilters {
  deal: Deal
  city?: City
  /** Free text matched against the city, district and neighbourhood names. */
  q: string
  hood?: string
  types: PropertyType[]
  rooms: RoomOption[]
  minPrice?: number
  maxPrice?: number
  minArea?: number
  maxArea?: number
  floor?: FloorOption
  maxAge?: number
  maxDues?: number
  amenities: AmenityFilter[]
  saved: boolean
  bounds?: Bounds
  sort: SortOption
  page: number
}

export const defaultFilters: EstateFilters = {
  deal: 'sale',
  q: '',
  types: [],
  rooms: [],
  amenities: [],
  saved: false,
  sort: 'recommended',
  page: 1,
}

const positive = (value: string | null) => {
  if (value === null || value.trim() === '') return undefined
  const number = Number(value)
  return Number.isFinite(number) && number >= 0 ? Math.round(number) : undefined
}

const list = <T extends string>(value: string | null, allowed: readonly T[]): T[] =>
  (value ?? '')
    .split(',')
    .filter((item): item is T => (allowed as readonly string[]).includes(item))
    .filter((item, index, items) => items.indexOf(item) === index)

const oneOf = <T extends string>(value: string | null, allowed: readonly T[]): T | undefined =>
  (allowed as readonly string[]).includes(value ?? '') ? (value as T) : undefined

/** Reads the filters from the address. Anything that is not a valid option is dropped. */
export function parseFilters(params: URLSearchParams): EstateFilters {
  const maxAge = positive(params.get('maxAge'))
  return {
    deal: params.get('deal') === 'rent' ? 'rent' : 'sale',
    city: oneOf(params.get('city'), CITIES),
    q: (params.get('q') ?? '').slice(0, 60),
    hood: params.get('hood') || undefined,
    types: list(params.get('type'), PROPERTY_TYPES),
    rooms: list(params.get('rooms'), ROOM_OPTIONS),
    minPrice: positive(params.get('minPrice')),
    maxPrice: positive(params.get('maxPrice')),
    minArea: positive(params.get('minArea')),
    maxArea: positive(params.get('maxArea')),
    floor: oneOf(params.get('floor'), FLOOR_OPTIONS),
    maxAge: AGE_OPTIONS.includes(maxAge as (typeof AGE_OPTIONS)[number]) ? maxAge : undefined,
    maxDues: positive(params.get('maxDues')),
    amenities: list(params.get('has'), AMENITY_FILTERS),
    saved: params.get('saved') === '1',
    bounds: parseBounds(params.get('area')),
    sort: oneOf(params.get('sort'), SORT_OPTIONS) ?? 'recommended',
    page: Math.max(1, positive(params.get('page')) ?? 1),
  }
}

/** The address for a set of filters, leaving out every default so links stay short. */
export function filtersToParams(filters: EstateFilters): URLSearchParams {
  const params = new URLSearchParams()
  const set = (key: string, value: string | number | undefined | false) => {
    if (value !== undefined && value !== false && value !== '') params.set(key, String(value))
  }
  if (filters.deal === 'rent') params.set('deal', 'rent')
  set('city', filters.city)
  set('q', filters.q.trim())
  set('hood', filters.hood)
  set('type', filters.types.join(','))
  set('rooms', filters.rooms.join(','))
  set('minPrice', filters.minPrice)
  set('maxPrice', filters.maxPrice)
  set('minArea', filters.minArea)
  set('maxArea', filters.maxArea)
  set('floor', filters.floor)
  set('maxAge', filters.maxAge)
  set('maxDues', filters.maxDues)
  set('has', filters.amenities.join(','))
  if (filters.saved) params.set('saved', '1')
  if (filters.bounds) params.set('area', formatBounds(filters.bounds))
  if (filters.sort !== 'recommended') params.set('sort', filters.sort)
  if (filters.page > 1) params.set('page', String(filters.page))
  return params
}

/** Filters a visitor chose beyond the deal, for the "Filters (3)" badge and "Clear all". */
export function activeFilterCount(filters: EstateFilters) {
  return [
    filters.city,
    filters.q.trim(),
    filters.hood,
    filters.types.length,
    filters.rooms.length,
    filters.minPrice !== undefined || filters.maxPrice !== undefined,
    filters.minArea !== undefined || filters.maxArea !== undefined,
    filters.floor,
    filters.maxAge !== undefined,
    filters.maxDues !== undefined,
    filters.amenities.length,
    filters.saved,
    filters.bounds,
  ].filter(Boolean).length
}

/** Lower case with Turkish letters folded, so "kadikoy" finds Kadıköy and "IZMIR" İzmir. */
export function fold(text: string) {
  return text
    .toLocaleLowerCase('tr-TR')
    .replace(/ı/g, 'i')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
}

export function roomOptionOf(listing: Pick<Listing, 'bedrooms'>): RoomOption {
  return listing.bedrooms >= 5 ? '5+' : (ROOM_OPTIONS[listing.bedrooms] ?? '1+1')
}

function matchesFloor(listing: Listing, floor: FloorOption) {
  if (listing.type === 'villa' || listing.type === 'detached') return floor !== 'high'
  switch (floor) {
    case 'ground':
      return listing.floor <= 0
    case 'notGround':
      return listing.floor > 0
    case 'middle':
      return listing.floor > 0 && listing.floor < listing.totalFloors
    case 'high':
      return listing.floor >= 6
  }
}

const AMENITY_FEATURE: Partial<Record<AmenityFilter, Feature>> = {
  parking: 'parking',
  balcony: 'balcony',
}

interface FilterContext {
  favourites?: string[]
  /** Leave the map area out, to count what the whole search would find. */
  ignoreBounds?: boolean
}

export function matchesFilters(
  listing: Listing,
  filters: EstateFilters,
  context: FilterContext = {},
) {
  const hood = hoodOf(listing)
  if (listing.deal !== filters.deal) return false
  if (filters.city && listing.city !== filters.city) return false
  if (filters.hood && listing.hoodId !== filters.hood) return false
  if (filters.q.trim()) {
    const words = fold(filters.q).split(/\s+/)
    const haystack = fold(`${hood.name} ${hood.district} ${cityNames[listing.city]} ${listing.id}`)
    if (!words.every((word) => haystack.includes(word))) return false
  }
  if (filters.types.length && !filters.types.includes(listing.type)) return false
  if (filters.rooms.length && !filters.rooms.includes(roomOptionOf(listing))) return false
  if (filters.minPrice !== undefined && listing.price < filters.minPrice) return false
  if (filters.maxPrice !== undefined && listing.price > filters.maxPrice) return false
  if (filters.minArea !== undefined && listing.grossArea < filters.minArea) return false
  if (filters.maxArea !== undefined && listing.grossArea > filters.maxArea) return false
  if (filters.floor && !matchesFloor(listing, filters.floor)) return false
  if (filters.maxAge !== undefined && listing.buildingAge > filters.maxAge) return false
  if (filters.maxDues !== undefined && listing.dues > filters.maxDues) return false
  for (const amenity of filters.amenities) {
    if (
      amenity === 'furnished'
        ? !listing.furnished
        : !listing.features.includes(AMENITY_FEATURE[amenity]!)
    ) {
      return false
    }
  }
  if (filters.saved && !(context.favourites ?? []).includes(listing.id)) return false
  if (filters.bounds && !context.ignoreBounds && !boundsContain(filters.bounds, listing.position)) {
    return false
  }
  return true
}

export function sortListings(items: Listing[], sort: SortOption): Listing[] {
  const sorted = [...items]
  switch (sort) {
    case 'newest':
      return sorted.sort((a, b) => a.listedDaysAgo - b.listedDaysAgo)
    case 'priceAsc':
      return sorted.sort((a, b) => a.price - b.price)
    case 'priceDesc':
      return sorted.sort((a, b) => b.price - a.price)
    case 'pricePerM2':
      return sorted.sort((a, b) => pricePerM2(a) - pricePerM2(b))
    case 'areaDesc':
      return sorted.sort((a, b) => b.grossArea - a.grossArea)
    case 'recommended':
      // Featured first, then fresh listings with the most to show.
      return sorted.sort(
        (a, b) =>
          Number(b.featured) - Number(a.featured) ||
          Math.floor(a.listedDaysAgo / 14) - Math.floor(b.listedDaysAgo / 14) ||
          b.features.length - a.features.length ||
          a.id.localeCompare(b.id),
      )
  }
}

export function searchListings(
  items: Listing[],
  filters: EstateFilters,
  context: FilterContext = {},
): Listing[] {
  return sortListings(
    items.filter((listing) => matchesFilters(listing, filters, context)),
    filters.sort,
  )
}

/** Same deal and city, close in size and price; the listing itself never. */
export function similarListings(listing: Listing, items: Listing[], count = 4): Listing[] {
  return items
    .filter(
      (other) =>
        other.id !== listing.id && other.deal === listing.deal && other.city === listing.city,
    )
    .map((other) => ({
      other,
      score:
        Math.abs(Math.log(other.price / listing.price)) * 3 +
        Math.abs(other.bedrooms - listing.bedrooms) +
        (other.hoodId === listing.hoodId ? -0.5 : 0) +
        (other.type === listing.type ? -0.3 : 0),
    }))
    .sort((a, b) => a.score - b.score || a.other.id.localeCompare(b.other.id))
    .slice(0, count)
    .map(({ other }) => other)
}

export type CompareRow =
  | 'price'
  | 'pricePerM2'
  | 'grossArea'
  | 'bedrooms'
  | 'buildingAge'
  | 'dues'
  | 'features'

/** For each comparable row, the listings with the best value. A tie marks every one of them. */
export function bestInComparison(items: Listing[]): Record<CompareRow, string[]> {
  const best = (value: (listing: Listing) => number, direction: 'low' | 'high') => {
    if (items.length < 2) return []
    const values = items.map(value)
    const target = direction === 'low' ? Math.min(...values) : Math.max(...values)
    if (values.every((entry) => entry === target)) return []
    return items.filter((_, index) => values[index] === target).map((listing) => listing.id)
  }
  return {
    price: best((listing) => listing.price, 'low'),
    pricePerM2: best(pricePerM2, 'low'),
    grossArea: best((listing) => listing.grossArea, 'high'),
    bedrooms: best((listing) => listing.bedrooms, 'high'),
    buildingAge: best((listing) => listing.buildingAge, 'low'),
    dues: best((listing) => listing.dues, 'low'),
    features: best((listing) => listing.features.length, 'high'),
  }
}

/** The ids in a compare link: known listings only, no repeats, at most three. */
export function parseCompareIds(value: string | null, exists: (id: string) => boolean) {
  return (value ?? '')
    .split(',')
    .map((id) => id.trim())
    .filter((id, index, ids) => id && exists(id) && ids.indexOf(id) === index)
    .slice(0, MAX_COMPARE)
}

export const MAX_COMPARE = 3
