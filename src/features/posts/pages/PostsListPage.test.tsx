import { QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { PostsListPage } from '@/features/posts/pages/PostsListPage'
import { createQueryClient } from '@/lib/query/query-client'
import { AppThemeProvider } from '@/theme/AppThemeProvider'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('PostsListPage', () => {
  it('loads posts and submits the quick-create modal without changing pages', async () => {
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

    render(
      <QueryClientProvider client={createQueryClient()}>
        <AppThemeProvider>
          <MemoryRouter initialEntries={['/posts']}>
            <PostsListPage />
          </MemoryRouter>
        </AppThemeProvider>
      </QueryClientProvider>,
    )

    expect(await screen.findByText('First post')).toBeInTheDocument()
    expect(screen.getByText('["posts","list",{"limit":10}]')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Invalidate cache' }))
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2))

    await user.click(screen.getByRole('button', { name: 'Create demo post' }))
    const dialog = await screen.findByRole('dialog', { name: 'Quick create post' })

    await user.type(within(dialog).getByLabelText('Title'), 'A modal-created post')
    await user.type(within(dialog).getByLabelText('Body'), 'Created without route navigation.')
    await user.click(within(dialog).getByRole('button', { name: 'Create demo post' }))

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(4))
    expect(fetchMock).toHaveBeenNthCalledWith(
      3,
      'https://jsonplaceholder.typicode.com/posts',
      expect.objectContaining({ method: 'POST' }),
    )
    expect(screen.getByRole('heading', { name: 'TanStack Query API' })).toBeInTheDocument()
  })
})
