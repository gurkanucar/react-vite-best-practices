import {
  STORE_CATEGORIES,
  STORE_COLOURS,
  type StoreCategory,
  type StoreProduct,
} from '@/features/showcases/data/store'
import { totalStock } from '@/features/showcases/data/storeCart'
import type { Language } from '@/store/preferences-store'

export type StoreSort = 'featured' | 'newest' | 'priceAsc' | 'priceDesc' | 'rating'

export const STORE_SORTS: StoreSort[] = ['featured', 'newest', 'priceAsc', 'priceDesc', 'rating']

export const RATING_OPTIONS = [4.5, 4] as const

export interface StoreFilters {
  q: string
  category: StoreCategory | null
  colours: string[]
  sizes: string[]
  min: number | null
  max: number | null
  inStock: boolean
  onSale: boolean
  rating: number | null
  sort: StoreSort
}

export const EMPTY_FILTERS: StoreFilters = {
  q: '',
  category: null,
  colours: [],
  sizes: [],
  min: null,
  max: null,
  inStock: false,
  onSale: false,
  rating: null,
  sort: 'featured',
}

const list = (value: string | null) => (value ? value.split(',').filter(Boolean) : [])

const amount = (value: string | null) => {
  if (value === null || value === '') return null
  const number = Number(value)
  return Number.isFinite(number) && number >= 0 ? number : null
}

/** Reads the address bar. Anything that is not a real option is dropped, not guessed at. */
export function parseFilters(params: URLSearchParams): StoreFilters {
  const category = params.get('category')
  const sort = params.get('sort')
  const rating = Number(params.get('rating'))
  const colourIds = new Set(STORE_COLOURS.map((colour) => colour.id))

  return {
    q: params.get('q')?.trim() ?? '',
    category: STORE_CATEGORIES.includes(category as StoreCategory)
      ? (category as StoreCategory)
      : null,
    colours: list(params.get('colour')).filter((id) => colourIds.has(id)),
    sizes: list(params.get('size')),
    min: amount(params.get('min')),
    max: amount(params.get('max')),
    inStock: params.get('stock') === '1',
    onSale: params.get('sale') === '1',
    rating: (RATING_OPTIONS as readonly number[]).includes(rating) ? rating : null,
    sort: STORE_SORTS.includes(sort as StoreSort) ? (sort as StoreSort) : 'featured',
  }
}

/** The reverse of `parseFilters`: defaults are left out, so a clean catalog has a clean URL. */
export function filtersToParams(filters: StoreFilters): URLSearchParams {
  const params = new URLSearchParams()
  if (filters.q) params.set('q', filters.q)
  if (filters.category) params.set('category', filters.category)
  if (filters.colours.length) params.set('colour', filters.colours.join(','))
  if (filters.sizes.length) params.set('size', filters.sizes.join(','))
  if (filters.min !== null) params.set('min', String(filters.min))
  if (filters.max !== null) params.set('max', String(filters.max))
  if (filters.inStock) params.set('stock', '1')
  if (filters.onSale) params.set('sale', '1')
  if (filters.rating !== null) params.set('rating', String(filters.rating))
  if (filters.sort !== 'featured') params.set('sort', filters.sort)
  return params
}

/** How many filters narrow the list, for the badge on the mobile "Filters" button. */
export function activeFilterCount(filters: StoreFilters): number {
  return [
    filters.category !== null,
    filters.colours.length > 0,
    filters.sizes.length > 0,
    filters.min !== null || filters.max !== null,
    filters.inStock,
    filters.onSale,
    filters.rating !== null,
  ].filter(Boolean).length
}

/** "Yastık" and "yastik" are the same search: case, accents and the dotless ı are folded away. */
const fold = (value: string) =>
  value.toLocaleLowerCase('tr').replace(/ı/g, 'i').normalize('NFD').replace(/\p{M}/gu, '')

/**
 * A product matches a colour or size filter when a variant in that colour or size exists —
 * and, with "in stock only", when that variant is in stock.
 */
export function filterProducts(
  products: StoreProduct[],
  filters: StoreFilters,
  language: Language,
): StoreProduct[] {
  const query = fold(filters.q)

  const matching = products.filter((product) => {
    if (filters.category && product.category !== filters.category) return false
    if (filters.onSale && !product.compareAt) return false
    if (filters.rating !== null && product.rating < filters.rating) return false
    if (filters.min !== null && product.price < filters.min) return false
    if (filters.max !== null && product.price > filters.max) return false
    if (filters.inStock && totalStock(product) === 0) return false
    if (query) {
      const haystack = fold(`${product.name[language]} ${product.summary[language]}`)
      if (!haystack.includes(query)) return false
    }
    if (filters.colours.length || filters.sizes.length) {
      const hit = product.variants.some(
        (variant) =>
          (!filters.colours.length || filters.colours.includes(variant.colour)) &&
          (!filters.sizes.length || (variant.size && filters.sizes.includes(variant.size))) &&
          (!filters.inStock || variant.stock > 0),
      )
      if (!hit) return false
    }
    return true
  })

  const sorted = [...matching]
  switch (filters.sort) {
    case 'newest':
      return sorted.sort((a, b) => b.addedAt.localeCompare(a.addedAt))
    case 'priceAsc':
      return sorted.sort((a, b) => a.price - b.price)
    case 'priceDesc':
      return sorted.sort((a, b) => b.price - a.price)
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
    default:
      // Featured pieces first, then the catalog's own order.
      return sorted.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)))
  }
}

/** The sizes worth offering: those of the products in the chosen category, in catalog order. */
export function sizeOptions(products: StoreProduct[], category: StoreCategory | null): string[] {
  const sizes = products
    .filter((product) => !category || product.category === category)
    .flatMap((product) => product.sizes ?? [])
  return [...new Set(sizes)]
}

/** The slider's upper end, rounded up to the next thousand. */
export function priceCeiling(products: StoreProduct[]): number {
  const highest = Math.max(...products.map((product) => product.price))
  return Math.ceil(highest / 1000) * 1000
}
