import { QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { PostsPage } from '@/features/posts/pages/PostsPage'
import { createQueryClient } from '@/lib/query/query-client'
import { AppThemeProvider } from '@/theme/AppThemeProvider'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('PostsPage', () => {
  it('loads posts and invalidates the list after a demo mutation', async () => {
    const user = userEvent.setup()
    const posts = [{ body: 'Body', id: 1, title: 'First post', userId: 1 }]
    const fetchMock = vi.fn<typeof fetch>().mockImplementation((_input, init) => {
      const data = init?.method === 'POST' ? { ...posts[0], id: 101 } : posts
      return Promise.resolve(
        new Response(JSON.stringify(data), {
          headers: { 'Content-Type': 'application/json' },
          status: 200,
        }),
      )
    })
    vi.stubGlobal('fetch', fetchMock)
    const client = createQueryClient()

    render(
      <QueryClientProvider client={client}>
        <AppThemeProvider>
          <PostsPage />
        </AppThemeProvider>
      </QueryClientProvider>,
    )

    expect(await screen.findByText('First post')).toBeInTheDocument()
    expect(screen.getByText('["posts","list",{"limit":10}]')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Invalidate cache' }))
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(2)
    })

    await user.click(screen.getByRole('button', { name: 'Create demo post' }))

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(4)
    })
    expect(fetchMock).toHaveBeenNthCalledWith(
      3,
      'https://jsonplaceholder.typicode.com/posts',
      expect.objectContaining({ method: 'POST' }),
    )
  })
})
