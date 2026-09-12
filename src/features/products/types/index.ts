// ─── Query keys ──────────────────────────────────────────────────────────────

export const PRODUCT_QUERY_KEYS = {
  all: ['products'] as const,
  lists: () => [...PRODUCT_QUERY_KEYS.all, 'list'] as const,
  list: (filters: ProductFilterParams) => [...PRODUCT_QUERY_KEYS.lists(), filters] as const,
  details: () => [...PRODUCT_QUERY_KEYS.all, 'detail'] as const,
  detail: (productId: number) => [...PRODUCT_QUERY_KEYS.details(), productId] as const,
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

export interface ProductListResponseDto {
  limit: number
  products: ProductDto[]
  skip: number
  total: number
}

// ─── Filter types ────────────────────────────────────────────────────────────

export interface ProductFilterParams {
  limit: number
  skip: number
}
