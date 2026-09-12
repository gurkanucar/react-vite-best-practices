import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { getPosts } from '@/features/posts/api'
import { resetMockPosts } from '@/features/posts/mocks'
import { getProducts } from '@/features/products/api'
import { mockServer } from '@/mocks/server'

/**
 * Stands in for the real network. MSW captures whatever `fetch` is installed when it
 * starts and forwards every request it has no handler for to that original reference,
 * so calls landing here are exactly the ones that were left unmocked.
 */
const networkFetch = vi.fn<typeof fetch>(() =>
  Promise.resolve(
    Response.json({
      limit: 10,
      products: [{ id: 1, title: 'Product from the real API' }],
      skip: 0,
      total: 1,
    }),
  ),
)

beforeAll(() => {
  vi.stubGlobal('fetch', networkFetch)
  mockServer.listen({ onUnhandledRequest: 'bypass' })
})

afterEach(() => {
  mockServer.resetHandlers()
  resetMockPosts()
  networkFetch.mockClear()
})

afterAll(() => {
  mockServer.close()
  vi.unstubAllGlobals()
})

describe('selective API mocking', () => {
  it('serves mocked posts while products still reach the network', async () => {
    const posts = await getPosts({ limit: 3 })

    expect(posts).toHaveLength(3)
    expect(posts[0].body).toContain('served by MSW')
    expect(networkFetch).not.toHaveBeenCalled()

    const products = await getProducts({ limit: 10, skip: 0 })

    expect(products.products[0].title).toBe('Product from the real API')
    expect(networkFetch).toHaveBeenCalledOnce()
    expect(requestedUrl(networkFetch.mock.calls[0][0])).toContain('https://dummyjson.com/products')
  })
})

function requestedUrl(input: Parameters<typeof fetch>[0]): string {
  return input instanceof Request ? input.url : String(input)
}
