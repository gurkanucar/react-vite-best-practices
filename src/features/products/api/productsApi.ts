import { env } from '@/config/env'
import type { ProductFilterParams, ProductListResponseDto } from '@/features/products/types'
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
  filters: ProductFilterParams,
  signal?: AbortSignal,
): Promise<ProductListResponseDto> {
  return apiRequest<ProductListResponseDto>('/products', {
    baseUrl: env.dummyJsonApiBaseUrl,
    query: {
      limit: filters.limit,
      select: PRODUCT_FIELDS,
      skip: filters.skip,
    },
    signal,
  })
}
