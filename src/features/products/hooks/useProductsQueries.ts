import { keepPreviousData, queryOptions, useQuery } from '@tanstack/react-query'
import { getProducts } from '@/features/products/api/productsApi'
import type { ProductListFilters } from '@/features/products/types'

const PRODUCT_QUERY_ROOT = ['products'] as const

export const productQueryKeys = {
  all: PRODUCT_QUERY_ROOT,
  lists: () => [...PRODUCT_QUERY_ROOT, 'list'] as const,
  list: (filters: ProductListFilters) => [...productQueryKeys.lists(), filters] as const,
  details: () => [...PRODUCT_QUERY_ROOT, 'detail'] as const,
  detail: (productId: number) => [...productQueryKeys.details(), productId] as const,
}

export const PRODUCT_PAGE_SIZE = 10

export function productsQueryOptions(filters: ProductListFilters) {
  return queryOptions({
    placeholderData: keepPreviousData,
    queryFn: ({ signal }) => getProducts(filters, signal),
    queryKey: productQueryKeys.list(filters),
  })
}

export function useProductsQuery(filters: ProductListFilters) {
  return useQuery(productsQueryOptions(filters))
}
