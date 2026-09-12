import type { CreatePostInput, Post, PostListFilters } from '@/features/posts/types'
import { apiRequest } from '@/lib/api/api-client'

export function getPosts(filters: PostListFilters, signal?: AbortSignal): Promise<Post[]> {
  return apiRequest<Post[]>('/posts', {
    query: { _limit: filters.limit },
    signal,
  })
}

export function getPost(postId: number, signal?: AbortSignal): Promise<Post> {
  return apiRequest<Post>(`/posts/${postId}`, { signal })
}

export function createPost(input: CreatePostInput): Promise<Post> {
  return apiRequest<Post>('/posts', {
    body: input,
    method: 'POST',
  })
}
