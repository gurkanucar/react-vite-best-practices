import type { CreatePostRequest, PostDto, PostFilterParams } from '@/features/posts/types'
import { apiRequest } from '@/lib/api/api-client'

export function getPosts(filters: PostFilterParams, signal?: AbortSignal): Promise<PostDto[]> {
  return apiRequest<PostDto[]>('/posts', {
    query: { _limit: filters.limit },
    signal,
  })
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
