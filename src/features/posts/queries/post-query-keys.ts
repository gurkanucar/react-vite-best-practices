import type { PostListFilters } from '@/features/posts/model/post'

const POST_QUERY_ROOT = ['posts'] as const

export const postQueryKeys = {
  all: POST_QUERY_ROOT,
  lists: () => [...POST_QUERY_ROOT, 'list'] as const,
  list: (filters: PostListFilters) => [...postQueryKeys.lists(), filters] as const,
  details: () => [...POST_QUERY_ROOT, 'detail'] as const,
  detail: (postId: number) => [...postQueryKeys.details(), postId] as const,
}

export const postMutationKeys = {
  create: [...POST_QUERY_ROOT, 'create'] as const,
}
