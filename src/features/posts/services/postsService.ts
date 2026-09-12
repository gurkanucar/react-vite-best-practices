import { createPostRequest, deletePostRequest, updatePostRequest } from '@/features/posts/api'
import type { CreatePostRequest, PostDto, UpdatePostRequest } from '@/features/posts/types'

export class PostValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'PostValidationError'
  }
}

export function preparePostForCreation(input: CreatePostRequest): CreatePostRequest {
  const title = input.title.trim()
  const body = input.body.trim()

  if (!title) {
    throw new PostValidationError('Post title cannot be empty.')
  }

  if (!body) {
    throw new PostValidationError('Post body cannot be empty.')
  }

  if (!Number.isInteger(input.userId) || input.userId <= 0) {
    throw new PostValidationError('User ID must be a positive integer.')
  }

  return { body, title, userId: input.userId }
}

export function preparePostForUpdate(input: UpdatePostRequest): UpdatePostRequest {
  if (!Number.isInteger(input.id) || input.id <= 0) {
    throw new PostValidationError('Post ID must be a positive integer.')
  }

  return { ...preparePostForCreation(input), id: input.id }
}

export function createPost(input: CreatePostRequest): Promise<PostDto> {
  return createPostRequest(preparePostForCreation(input))
}

export function updatePost(input: UpdatePostRequest): Promise<PostDto> {
  return updatePostRequest(preparePostForUpdate(input))
}

export function deletePost(postId: number): Promise<void> {
  if (!Number.isInteger(postId) || postId <= 0) {
    throw new PostValidationError('Post ID must be a positive integer.')
  }

  return deletePostRequest(postId)
}
