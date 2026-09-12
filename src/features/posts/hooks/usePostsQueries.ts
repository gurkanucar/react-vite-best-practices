import { queryOptions, useQuery } from '@tanstack/react-query'
import { getPost, getPosts } from '@/features/posts/api'
import {
  DEFAULT_POST_FILTERS,
  POST_QUERY_KEYS,
  type PostFilterParams,
} from '@/features/posts/types'

export function postsQueryOptions(filters: PostFilterParams = DEFAULT_POST_FILTERS) {
  return queryOptions({
    queryKey: POST_QUERY_KEYS.list(filters),
    queryFn: ({ signal }) => getPosts(filters, signal),
  })
}

export function postQueryOptions(postId: number) {
  return queryOptions({
    queryKey: POST_QUERY_KEYS.detail(postId),
    queryFn: ({ signal }) => getPost(postId, signal),
  })
}

export function usePostsQuery(filters: PostFilterParams = DEFAULT_POST_FILTERS) {
  return useQuery(postsQueryOptions(filters))
}
