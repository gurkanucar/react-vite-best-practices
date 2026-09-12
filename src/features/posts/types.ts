export interface Post {
  body: string
  id: number
  title: string
  userId: number
}

export interface PostListFilters {
  limit: number
}

export type CreatePostInput = Omit<Post, 'id'>
