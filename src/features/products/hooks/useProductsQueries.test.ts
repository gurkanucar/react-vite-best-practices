import { describe, expect, it } from 'vitest'
import {
  productQueryKeys,
  productsQueryOptions,
} from '@/features/products/hooks/useProductsQueries'

describe('product query hooks', () => {
  it('keeps every server-side pagination variable in the cache key', () => {
    const filters = { limit: 10, skip: 20 }

    expect(productQueryKeys.all).toEqual(['products'])
    expect(productQueryKeys.lists()).toEqual(['products', 'list'])
    expect(productQueryKeys.list(filters)).toEqual(['products', 'list', filters])
    expect(productQueryKeys.detail(42)).toEqual(['products', 'detail', 42])
    expect(productsQueryOptions(filters).queryKey).toEqual(['products', 'list', filters])
  })
})
