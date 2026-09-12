import { describe, expect, it } from 'vitest'
import { PostValidationError, preparePostForCreation } from '@/features/posts/services/postsService'

describe('postsService', () => {
  it('normalizes a valid create request', () => {
    expect(
      preparePostForCreation({ body: '  Body copy  ', title: '  Feature services  ', userId: 3 }),
    ).toEqual({ body: 'Body copy', title: 'Feature services', userId: 3 })
  })

  it.each([
    [{ body: 'Body', title: '   ', userId: 1 }, 'Post title cannot be empty.'],
    [{ body: '   ', title: 'Title', userId: 1 }, 'Post body cannot be empty.'],
    [{ body: 'Body', title: 'Title', userId: 0 }, 'User ID must be a positive integer.'],
  ])('rejects an invalid create request', (input, expectedMessage) => {
    expect(() => preparePostForCreation(input)).toThrow(new PostValidationError(expectedMessage))
  })
})
