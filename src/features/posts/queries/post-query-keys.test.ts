import { describe, expect, it } from 'vitest'
import { postMutationKeys, postQueryKeys } from '@/features/posts/queries/post-query-keys'

describe('post query keys', () => {
  it('builds predictable keys from broad to specific cache scopes', () => {
    expect(postQueryKeys.all).toEqual(['posts'])
    expect(postQueryKeys.lists()).toEqual(['posts', 'list'])
    expect(postQueryKeys.list({ limit: 10 })).toEqual(['posts', 'list', { limit: 10 }])
    expect(postQueryKeys.details()).toEqual(['posts', 'detail'])
    expect(postQueryKeys.detail(42)).toEqual(['posts', 'detail', 42])
    expect(postMutationKeys.create).toEqual(['posts', 'create'])
  })
})
