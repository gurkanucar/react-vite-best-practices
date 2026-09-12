import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { getPosts } from '@/features/posts/api'
import { resetMockPosts } from '@/features/posts/mocks'
import { createPost } from '@/features/posts/services'
import { mockServer } from '@/mocks/server'

beforeAll(() => mockServer.listen({ onUnhandledRequest: 'error' }))

afterEach(() => {
  mockServer.resetHandlers()
  resetMockPosts()
})

afterAll(() => mockServer.close())

describe('posts API with MSW', () => {
  it('uses reusable handlers without replacing the fetch implementation', async () => {
    expect(await getPosts({ limit: 2 })).toHaveLength(2)

    const createdPost = await createPost({
      body: '  Created through a service  ',
      title: '  MSW integration  ',
      userId: 4,
    })

    expect(createdPost).toMatchObject({
      body: 'Created through a service',
      title: 'MSW integration',
      userId: 4,
    })
    expect((await getPosts({ limit: 1 }))[0]).toEqual(createdPost)
  })
})
