import { env } from '@/config/env'
import type {
  ProductCategoryDto,
  ProductDto,
  ProductFilterParams,
  ProductListResponseDto,
} from '@/features/products/types'
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

/**
 * DummyJSON exposes search and category as separate endpoints rather than as query
 * parameters, so they cannot be combined. Search wins, and the list page clears one
 * whenever the other is set.
 */
function productsPath({ category, search }: ProductFilterParams): string {
  if (search) return '/products/search'
  if (category) return `/products/category/${category}`
  return '/products'
}

export function getProducts(
  filters: ProductFilterParams,
  signal?: AbortSignal,
): Promise<ProductListResponseDto> {
  return apiRequest<ProductListResponseDto>(productsPath(filters), {
    baseUrl: env.dummyJsonApiBaseUrl,
    query: {
      limit: filters.limit,
      order: filters.order,
      q: filters.search,
      select: PRODUCT_FIELDS,
      skip: filters.skip,
      sortBy: filters.sortBy,
    },
    signal,
  })
}

export function getProduct(productId: number, signal?: AbortSignal): Promise<ProductDto> {
  return apiRequest<ProductDto>(`/products/${productId}`, {
    baseUrl: env.dummyJsonApiBaseUrl,
    query: { select: PRODUCT_FIELDS },
    signal,
  })
}

export function getProductCategories(signal?: AbortSignal): Promise<ProductCategoryDto[]> {
  return apiRequest<ProductCategoryDto[]>('/products/categories', {
    baseUrl: env.dummyJsonApiBaseUrl,
    signal,
  })
}
