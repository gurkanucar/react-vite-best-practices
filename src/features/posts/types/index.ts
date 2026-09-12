// ─── Query and mutation keys ─────────────────────────────────────────────────

export const POST_QUERY_KEYS = {
  all: ['posts'] as const,
  lists: () => [...POST_QUERY_KEYS.all, 'list'] as const,
  list: (filters: PostFilterParams) => [...POST_QUERY_KEYS.lists(), filters] as const,
  details: () => [...POST_QUERY_KEYS.all, 'detail'] as const,
  detail: (postId: number) => [...POST_QUERY_KEYS.details(), postId] as const,
}

export const POST_MUTATION_KEYS = {
  create: [...POST_QUERY_KEYS.all, 'create'] as const,
}

export const DEFAULT_POST_FILTERS = { limit: 10 } as const satisfies PostFilterParams

// ─── DTOs ────────────────────────────────────────────────────────────────────

export interface PostDto {
  body: string
  id: number
  title: string
  userId: number
}

// ─── Request types ───────────────────────────────────────────────────────────

export type CreatePostRequest = Omit<PostDto, 'id'>

// ─── Filter types ────────────────────────────────────────────────────────────

export interface PostFilterParams {
  limit: number
}
