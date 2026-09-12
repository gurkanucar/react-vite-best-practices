import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import { getProducts } from '@/features/products/api/products-api'
import type { ProductListFilters } from '@/features/products/model/product'
import { productQueryKeys } from '@/features/products/queries/product-query-keys'

export const PRODUCT_PAGE_SIZE = 10

export function productsQueryOptions(filters: ProductListFilters) {
  return queryOptions({
    placeholderData: keepPreviousData,
    queryFn: ({ signal }) => getProducts(filters, signal),
    queryKey: productQueryKeys.list(filters),
  })
}
