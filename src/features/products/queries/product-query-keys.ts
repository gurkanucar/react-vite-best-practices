import type { ProductListFilters } from '@/features/products/model/product'

const PRODUCT_QUERY_ROOT = ['products'] as const

export const productQueryKeys = {
  all: PRODUCT_QUERY_ROOT,
  lists: () => [...PRODUCT_QUERY_ROOT, 'list'] as const,
  list: (filters: ProductListFilters) => [...productQueryKeys.lists(), filters] as const,
  details: () => [...PRODUCT_QUERY_ROOT, 'detail'] as const,
  detail: (productId: number) => [...productQueryKeys.details(), productId] as const,
}
