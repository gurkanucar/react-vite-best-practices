import { keepPreviousData, queryOptions, useQuery } from '@tanstack/react-query'
import { getProducts } from '@/features/products/api'
import { PRODUCT_QUERY_KEYS, type ProductFilterParams } from '@/features/products/types'

export function productsQueryOptions(filters: ProductFilterParams) {
  return queryOptions({
    placeholderData: keepPreviousData,
    queryFn: ({ signal }) => getProducts(filters, signal),
    queryKey: PRODUCT_QUERY_KEYS.list(filters),
  })
}

export function useProductsQuery(filters: ProductFilterParams) {
  return useQuery(productsQueryOptions(filters))
}
