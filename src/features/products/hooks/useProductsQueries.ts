import { keepPreviousData, queryOptions, useQuery } from '@tanstack/react-query'
import { getProduct, getProductCategories, getProducts } from '@/features/products/api'
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

export function productQueryOptions(productId: number) {
  return queryOptions({
    queryFn: ({ signal }) => getProduct(productId, signal),
    queryKey: PRODUCT_QUERY_KEYS.detail(productId),
  })
}

export function useProductQuery(productId: number, enabled = true) {
  return useQuery({ ...productQueryOptions(productId), enabled })
}

/**
 * Filter options are reference data owned by the server, not by the table, so they are
 * fetched once and reused. The posts table shows the opposite case, where the options
 * are derived from rows that are already loaded.
 */
export function productCategoriesQueryOptions() {
  return queryOptions({
    queryFn: ({ signal }) => getProductCategories(signal),
    queryKey: PRODUCT_QUERY_KEYS.categories(),
    staleTime: 60 * 60 * 1000,
  })
}

export function useProductCategoriesQuery() {
  return useQuery(productCategoriesQueryOptions())
}
