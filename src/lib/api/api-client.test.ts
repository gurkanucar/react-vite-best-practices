import { afterEach, describe, expect, it, vi } from 'vitest'
import { apiRequest } from '@/lib/api/api-client'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('apiRequest', () => {
  it('builds a request from the configured base URL and parses JSON', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify([{ id: 1 }]), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    await expect(
      apiRequest<Array<{ id: number }>>('/posts', { query: { _limit: 10 } }),
    ).resolves.toEqual([{ id: 1 }])
    expect(fetchMock).toHaveBeenCalledWith(
      'https://jsonplaceholder.typicode.com/posts?_limit=10',
      expect.objectContaining({ headers: { Accept: 'application/json' } }),
    )
  })

  it('serializes JSON bodies and exposes unsuccessful responses as ApiError', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ reason: 'invalid' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 422,
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    const request = apiRequest('/posts', {
      body: { title: 'Demo' },
      method: 'POST',
    })

    await expect(request).rejects.toMatchObject({
      details: { reason: 'invalid' },
      name: 'ApiError',
      status: 422,
    })
    expect(fetchMock).toHaveBeenCalledWith(
      'https://jsonplaceholder.typicode.com/posts',
      expect.objectContaining({
        body: JSON.stringify({ title: 'Demo' }),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'POST',
      }),
    )
  })
})
