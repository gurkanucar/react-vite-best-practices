import { describe, expect, it } from 'vitest'
import { postMutationKeys } from '@/features/posts/hooks/usePostsMutations'
import {
  postQueryKeys,
  postQueryOptions,
  postsQueryOptions,
} from '@/features/posts/hooks/usePostsQueries'

describe('post hooks', () => {
  it('builds predictable query and mutation keys from broad to specific scopes', () => {
    expect(postQueryKeys.all).toEqual(['posts'])
    expect(postQueryKeys.lists()).toEqual(['posts', 'list'])
    expect(postQueryKeys.list({ limit: 10 })).toEqual(['posts', 'list', { limit: 10 }])
    expect(postQueryKeys.details()).toEqual(['posts', 'detail'])
    expect(postQueryKeys.detail(42)).toEqual(['posts', 'detail', 42])
    expect(postMutationKeys.create).toEqual(['posts', 'create'])
  })

  it('binds list and detail requests to their typed cache keys', () => {
    expect(postsQueryOptions({ limit: 20 }).queryKey).toEqual(['posts', 'list', { limit: 20 }])
    expect(postQueryOptions(42).queryKey).toEqual(['posts', 'detail', 42])
  })
})
