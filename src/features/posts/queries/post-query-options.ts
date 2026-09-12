import { queryOptions } from '@tanstack/react-query'
import { getPost, getPosts } from '@/features/posts/api/posts-api'
import type { PostListFilters } from '@/features/posts/model/post'
import { postQueryKeys } from '@/features/posts/queries/post-query-keys'

export const DEFAULT_POST_FILTERS = { limit: 10 } as const satisfies PostListFilters

export function postsQueryOptions(filters: PostListFilters = DEFAULT_POST_FILTERS) {
  return queryOptions({
    queryKey: postQueryKeys.list(filters),
    queryFn: ({ signal }) => getPosts(filters, signal),
  })
}

export function postQueryOptions(postId: number) {
  return queryOptions({
    queryKey: postQueryKeys.detail(postId),
    queryFn: ({ signal }) => getPost(postId, signal),
  })
}
