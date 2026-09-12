import { createPostRequest } from '@/features/posts/api'
import type { CreatePostRequest, PostDto } from '@/features/posts/types'

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

export function createPost(input: CreatePostRequest): Promise<PostDto> {
  return createPostRequest(preparePostForCreation(input))
}
