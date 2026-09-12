// ─── Query keys ──────────────────────────────────────────────────────────────

export const PRODUCT_QUERY_KEYS = {
  all: ['products'] as const,
  lists: () => [...PRODUCT_QUERY_KEYS.all, 'list'] as const,
  list: (filters: ProductFilterParams) => [...PRODUCT_QUERY_KEYS.lists(), filters] as const,
  details: () => [...PRODUCT_QUERY_KEYS.all, 'detail'] as const,
  detail: (productId: number) => [...PRODUCT_QUERY_KEYS.details(), productId] as const,
  categories: () => [...PRODUCT_QUERY_KEYS.all, 'categories'] as const,
}

export const PRODUCT_PAGE_SIZE = 10

// ─── DTOs ────────────────────────────────────────────────────────────────────

export interface ProductDto {
  category: string
  description: string
  id: number
  price: number
  rating: number
  stock: number
  thumbnail: string
  title: string
}

export interface ProductCategoryDto {
  name: string
  slug: string
  url: string
}

export interface ProductListResponseDto {
  limit: number
  products: ProductDto[]
  skip: number
  total: number
}

// ─── Filter types ────────────────────────────────────────────────────────────

export type ProductSortField = 'price' | 'rating' | 'stock' | 'title'

export type SortDirection = 'asc' | 'desc'

export interface ProductFilterParams {
  category?: string
  limit: number
  order?: SortDirection
  search?: string
  skip: number
  sortBy?: ProductSortField
}

export const PRODUCT_SORT_FIELDS = ['price', 'rating', 'stock', 'title'] as const

export function isProductSortField(value: string | null): value is ProductSortField {
  return PRODUCT_SORT_FIELDS.includes(value as ProductSortField)
}
