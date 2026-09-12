import { describe, expect, it } from 'vitest'
import { postQueryOptions, postsQueryOptions } from '@/features/posts/queries/post-query-options'

describe('post query options', () => {
  it('binds list and detail requests to their typed cache keys', () => {
    expect(postsQueryOptions({ limit: 20 }).queryKey).toEqual(['posts', 'list', { limit: 20 }])
    expect(postQueryOptions(42).queryKey).toEqual(['posts', 'detail', 42])
  })
})
