import { describe, expect, it } from 'vitest'
import { productsQueryOptions } from '@/features/products/hooks/useProductsQueries'
import { PRODUCT_QUERY_KEYS } from '@/features/products/types'

describe('product query hooks', () => {
  it('keeps every server-side pagination variable in the cache key', () => {
    const filters = { limit: 10, skip: 20 }

    expect(PRODUCT_QUERY_KEYS.all).toEqual(['products'])
    expect(PRODUCT_QUERY_KEYS.lists()).toEqual(['products', 'list'])
    expect(PRODUCT_QUERY_KEYS.list(filters)).toEqual(['products', 'list', filters])
    expect(PRODUCT_QUERY_KEYS.detail(42)).toEqual(['products', 'detail', 42])
    expect(productsQueryOptions(filters).queryKey).toEqual(['products', 'list', filters])
  })
})
