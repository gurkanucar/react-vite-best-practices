import { http, HttpResponse } from 'msw'
import { env } from '@/config/env'
import {
  isPostSortField,
  type CreatePostRequest,
  type PostDto,
  type UpdatePostRequest,
} from '@/features/posts/types'

const INITIAL_POSTS: PostDto[] = [
  {
    body: 'This response is served by MSW in development.',
    category: 'architecture',
    id: 1,
    publishedAt: '2026-01-12',
    title: 'Mocked API responses without changing application code',
    userId: 1,
    views: 1840,
  },
  {
    body: 'The products feature still calls the real DummyJSON service.',
    category: 'architecture',
    id: 2,
    publishedAt: '2026-02-03',
    title: 'Mocked and real APIs can run side by side',
    userId: 1,
    views: 920,
  },
  {
    body: 'Disable the feature flag to let post requests reach JSONPlaceholder.',
    category: 'configuration',
    id: 3,
    publishedAt: '2026-02-21',
    title: 'Feature flags control optional behavior',
    userId: 2,
    views: 430,
  },
  {
    body: 'Every filter below is applied by the handler, not by the table.',
    category: 'tables',
    id: 4,
    publishedAt: '2026-03-08',
    title: 'Server-side filtering keeps the client honest',
    userId: 2,
    views: 2670,
  },
  {
    body: 'Reload the page and the filters are still there, because they live in the URL.',
    category: 'routing',
    id: 5,
    publishedAt: '2026-03-30',
    title: 'The address bar is the source of truth',
    userId: 3,
    views: 150,
  },
  {
    body: 'Options for this filter come from their own endpoint.',
    category: 'tables',
    id: 6,
    publishedAt: '2026-04-14',
    title: 'Dynamic filter options belong to the server',
    userId: 3,
    views: 3120,
  },
  {
    body: 'A closed set of authors does not need a request of its own.',
    category: 'tables',
    id: 7,
    publishedAt: '2026-05-02',
    title: 'Static filter options belong to the client',
    userId: 4,
    views: 780,
  },
  {
    body: 'Ranges narrow the result set on the server before it is sent.',
    category: 'performance',
    id: 8,
    publishedAt: '2026-05-27',
    title: 'Numeric and date ranges are filters too',
    userId: 4,
    views: 5410,
  },
  {
    body: 'Caching is keyed by the full filter object, so nothing leaks between views.',
    category: 'performance',
    id: 9,
    publishedAt: '2026-06-15',
    title: 'Cache keys carry every filter',
    userId: 1,
    views: 260,
  },
  {
    body: 'Deleting a row invalidates the lists that could contain it.',
    category: 'configuration',
    id: 10,
    publishedAt: '2026-07-01',
    title: 'Mutations invalidate the right caches',
    userId: 2,
    views: 1290,
  },
]

let posts = [...INITIAL_POSTS]

export function resetMockPosts() {
  posts = [...INITIAL_POSTS]
}

function readList(params: URLSearchParams, name: string): string[] {
  const value = params.get(name)
  return value ? value.split(',').filter(Boolean) : []
}

/**
 * The handler behaves like a real list endpoint: it narrows, sorts, and only then
 * limits. Doing it here rather than in the table is what makes the page an honest
 * example of server-side filtering.
 */
function queryPosts(params: URLSearchParams): PostDto[] {
  const search = params.get('q')?.trim().toLowerCase() ?? ''
  const categories = readList(params, 'categories')
  const authors = readList(params, 'authors').map(Number)
  const minViews = params.get('minViews')
  const maxViews = params.get('maxViews')
  const publishedFrom = params.get('publishedFrom')
  const publishedTo = params.get('publishedTo')

  let result = posts.filter((post) => {
    if (search && !post.title.toLowerCase().includes(search)) return false
    if (categories.length > 0 && !categories.includes(post.category ?? '')) return false
    if (authors.length > 0 && !authors.includes(post.userId)) return false
    if (minViews !== null && (post.views ?? 0) < Number(minViews)) return false
    if (maxViews !== null && (post.views ?? 0) > Number(maxViews)) return false
    if (publishedFrom && (post.publishedAt ?? '') < publishedFrom) return false
    if (publishedTo && (post.publishedAt ?? '') > publishedTo) return false
    return true
  })

  const sortBy = params.get('sortBy')
  if (isPostSortField(sortBy)) {
    const direction = params.get('order') === 'desc' ? -1 : 1
    result = [...result].sort((first, second) => {
      const firstValue = first[sortBy] ?? ''
      const secondValue = second[sortBy] ?? ''
      if (typeof firstValue === 'number' && typeof secondValue === 'number') {
        return (firstValue - secondValue) * direction
      }
      return String(firstValue).localeCompare(String(secondValue)) * direction
    })
  }

  const limit = Number(params.get('_limit')) || result.length
  return result.slice(0, limit)
}

export const postHandlers = [
  http.get(`${env.apiBaseUrl}/posts/categories`, () =>
    HttpResponse.json([...new Set(posts.map(({ category }) => category).filter(Boolean))].sort()),
  ),
  http.get(`${env.apiBaseUrl}/posts`, ({ request }) =>
    HttpResponse.json(queryPosts(new URL(request.url).searchParams)),
  ),
  http.get(`${env.apiBaseUrl}/posts/:postId`, ({ params }) => {
    const post = posts.find(({ id }) => id === Number(params.postId))
    return post
      ? HttpResponse.json(post)
      : HttpResponse.json({ message: 'Post not found' }, { status: 404 })
  }),
  http.post(`${env.apiBaseUrl}/posts`, async ({ request }) => {
    const input = (await request.json()) as CreatePostRequest
    const createdPost: PostDto = {
      ...input,
      category: 'architecture',
      id: Math.max(0, ...posts.map(({ id }) => id)) + 1,
      publishedAt: new Date().toISOString().slice(0, 10),
      views: 0,
    }
    posts = [createdPost, ...posts]
    return HttpResponse.json(createdPost, { status: 201 })
  }),
  http.put(`${env.apiBaseUrl}/posts/:postId`, async ({ params, request }) => {
    const postId = Number(params.postId)
    const existingPost = posts.find(({ id }) => id === postId)

    if (!existingPost) {
      return HttpResponse.json({ message: 'Post not found' }, { status: 404 })
    }

    const input = (await request.json()) as Omit<UpdatePostRequest, 'id'>
    const updatedPost: PostDto = { ...existingPost, ...input, id: postId }
    posts = posts.map((post) => (post.id === postId ? updatedPost : post))
    return HttpResponse.json(updatedPost)
  }),
  http.delete(`${env.apiBaseUrl}/posts/:postId`, ({ params }) => {
    const postId = Number(params.postId)

    if (!posts.some(({ id }) => id === postId)) {
      return HttpResponse.json({ message: 'Post not found' }, { status: 404 })
    }

    posts = posts.filter((post) => post.id !== postId)
    return new HttpResponse(null, { status: 204 })
  }),
]
