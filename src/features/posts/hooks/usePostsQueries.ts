import { queryOptions, useQuery } from '@tanstack/react-query'
import { getPost, getPosts } from '@/features/posts/api/postsApi'
import type { PostListFilters } from '@/features/posts/types'

const POST_QUERY_ROOT = ['posts'] as const

export const postQueryKeys = {
  all: POST_QUERY_ROOT,
  lists: () => [...POST_QUERY_ROOT, 'list'] as const,
  list: (filters: PostListFilters) => [...postQueryKeys.lists(), filters] as const,
  details: () => [...POST_QUERY_ROOT, 'detail'] as const,
  detail: (postId: number) => [...postQueryKeys.details(), postId] as const,
}

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

export function usePostsQuery(filters: PostListFilters = DEFAULT_POST_FILTERS) {
  return useQuery(postsQueryOptions(filters))
}
