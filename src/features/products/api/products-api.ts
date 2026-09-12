import { env } from '@/config/env'
import type { ProductListFilters, ProductListResponse } from '@/features/products/model/product'
import { apiRequest } from '@/lib/api/api-client'

const PRODUCT_FIELDS = [
  'id',
  'title',
  'description',
  'category',
  'price',
  'rating',
  'stock',
  'thumbnail',
].join(',')

export function getProducts(
  filters: ProductListFilters,
  signal?: AbortSignal,
): Promise<ProductListResponse> {
  return apiRequest<ProductListResponse>('/products', {
    baseUrl: env.dummyJsonApiBaseUrl,
    query: {
      limit: filters.limit,
      select: PRODUCT_FIELDS,
      skip: filters.skip,
    },
    signal,
  })
}
