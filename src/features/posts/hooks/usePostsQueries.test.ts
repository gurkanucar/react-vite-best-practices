import { describe, expect, it } from 'vitest'
import { postQueryOptions, postsQueryOptions } from '@/features/posts/hooks/usePostsQueries'
import { POST_MUTATION_KEYS, POST_QUERY_KEYS } from '@/features/posts/types'

describe('post hooks', () => {
  it('builds predictable query and mutation keys from broad to specific scopes', () => {
    expect(POST_QUERY_KEYS.all).toEqual(['posts'])
    expect(POST_QUERY_KEYS.lists()).toEqual(['posts', 'list'])
    expect(POST_QUERY_KEYS.list({ limit: 10 })).toEqual(['posts', 'list', { limit: 10 }])
    expect(POST_QUERY_KEYS.details()).toEqual(['posts', 'detail'])
    expect(POST_QUERY_KEYS.detail(42)).toEqual(['posts', 'detail', 42])
    expect(POST_MUTATION_KEYS.create).toEqual(['posts', 'create'])
  })

  it('binds list and detail requests to their typed cache keys', () => {
    expect(postsQueryOptions({ limit: 20 }).queryKey).toEqual(['posts', 'list', { limit: 20 }])
    expect(postQueryOptions(42).queryKey).toEqual(['posts', 'detail', 42])
  })
})
