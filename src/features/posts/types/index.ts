// ─── Query and mutation keys ─────────────────────────────────────────────────

export const POST_QUERY_KEYS = {
  all: ['posts'] as const,
  lists: () => [...POST_QUERY_KEYS.all, 'list'] as const,
  list: (filters: PostFilterParams) => [...POST_QUERY_KEYS.lists(), filters] as const,
  details: () => [...POST_QUERY_KEYS.all, 'detail'] as const,
  detail: (postId: number) => [...POST_QUERY_KEYS.details(), postId] as const,
  categories: () => [...POST_QUERY_KEYS.all, 'categories'] as const,
}

export const POST_MUTATION_KEYS = {
  create: [...POST_QUERY_KEYS.all, 'create'] as const,
  update: [...POST_QUERY_KEYS.all, 'update'] as const,
  remove: [...POST_QUERY_KEYS.all, 'remove'] as const,
}

export const DEFAULT_POST_FILTERS = { limit: 10 } as const satisfies PostFilterParams

/**
 * Authors are a closed set that the UI already knows, so these options are static.
 * Categories are owned by the server and are fetched instead — the two filters exist
 * side by side to show when each approach applies.
 */
export const POST_AUTHOR_OPTIONS = [1, 2, 3, 4] as const

export const POST_SORT_FIELDS = ['publishedAt', 'title', 'views'] as const

export type PostSortField = (typeof POST_SORT_FIELDS)[number]

export type SortDirection = 'asc' | 'desc'

export function isPostSortField(value: string | null): value is PostSortField {
  return POST_SORT_FIELDS.includes(value as PostSortField)
}

// ─── DTOs ────────────────────────────────────────────────────────────────────

/**
 * `category`, `publishedAt`, and `views` are served by the MSW handlers only.
 * JSONPlaceholder does not return them, so they are optional and the rich filter
 * panel is gated behind the `mockPostsApi` feature flag.
 */
export interface PostDto {
  body: string
  category?: string
  id: number
  publishedAt?: string
  title: string
  userId: number
  views?: number
}

// ─── Request types ───────────────────────────────────────────────────────────

export type CreatePostRequest = Pick<PostDto, 'body' | 'title' | 'userId'>

export type UpdatePostRequest = CreatePostRequest & Pick<PostDto, 'id'>

// ─── Filter types ────────────────────────────────────────────────────────────

export interface PostFilterParams {
  authors?: number[]
  categories?: string[]
  limit: number
  maxViews?: number
  minViews?: number
  order?: SortDirection
  publishedFrom?: string
  publishedTo?: string
  search?: string
  sortBy?: PostSortField
}
