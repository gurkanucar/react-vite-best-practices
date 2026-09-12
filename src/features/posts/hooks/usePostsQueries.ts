import { queryOptions, useQuery } from '@tanstack/react-query'
import { getPost, getPostCategories, getPosts } from '@/features/posts/api'
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

export function usePostQuery(postId: number, enabled = true) {
  return useQuery({ ...postQueryOptions(postId), enabled })
}

/**
 * Category options are owned by the API, so they are fetched once and cached apart from
 * the list. Author options are a closed set and stay in the code as constants instead.
 */
export function postCategoriesQueryOptions() {
  return queryOptions({
    queryFn: ({ signal }) => getPostCategories(signal),
    queryKey: POST_QUERY_KEYS.categories(),
    staleTime: 60 * 60 * 1000,
  })
}

export function usePostCategoriesQuery(enabled = true) {
  return useQuery({ ...postCategoriesQueryOptions(), enabled })
}
