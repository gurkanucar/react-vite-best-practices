import type {
  CreatePostRequest,
  PostDto,
  PostFilterParams,
  UpdatePostRequest,
} from '@/features/posts/types'
import { apiRequest } from '@/lib/api/api-client'

export function getPosts(filters: PostFilterParams, signal?: AbortSignal): Promise<PostDto[]> {
  return apiRequest<PostDto[]>('/posts', {
    query: {
      _limit: filters.limit,
      authors: filters.authors?.join(','),
      categories: filters.categories?.join(','),
      maxViews: filters.maxViews,
      minViews: filters.minViews,
      order: filters.order,
      publishedFrom: filters.publishedFrom,
      publishedTo: filters.publishedTo,
      q: filters.search,
      sortBy: filters.sortBy,
    },
    signal,
  })
}

export function getPostCategories(signal?: AbortSignal): Promise<string[]> {
  return apiRequest<string[]>('/posts/categories', { signal })
}

export function getPost(postId: number, signal?: AbortSignal): Promise<PostDto> {
  return apiRequest<PostDto>(`/posts/${postId}`, { signal })
}

export function createPostRequest(input: CreatePostRequest): Promise<PostDto> {
  return apiRequest<PostDto>('/posts', {
    body: input,
    method: 'POST',
  })
}

export function updatePostRequest({ id, ...input }: UpdatePostRequest): Promise<PostDto> {
  return apiRequest<PostDto>(`/posts/${id}`, {
    body: input,
    method: 'PUT',
  })
}

export function deletePostRequest(postId: number): Promise<void> {
  return apiRequest<void>(`/posts/${postId}`, { method: 'DELETE' })
}
