import { QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StrictMode } from 'react'
import { MemoryRouter } from 'react-router'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { resetMockPosts } from '@/features/posts/mocks'
import { PostsListPage } from '@/features/posts/pages/PostsListPage'
import { createQueryClient } from '@/lib/query/query-client'
import { mockServer } from '@/mocks/server'
import { AppThemeProvider } from '@/theme/AppThemeProvider'

beforeAll(() => mockServer.listen({ onUnhandledRequest: 'error' }))

afterEach(() => {
  mockServer.resetHandlers()
  resetMockPosts()
})

afterAll(() => mockServer.close())

/**
 * StrictMode deliberately mounts, unmounts, and remounts every component in
 * development, which is why a query can show up twice in the network panel. A mutation
 * runs from an event handler rather than an effect, so it must not be affected.
 */
describe('PostsListPage under StrictMode', () => {
  it('sends exactly one POST when a post is created', async () => {
    const user = userEvent.setup()
    const requests: string[] = []
    const record = ({ request }: { request: Request }) => {
      requests.push(`${request.method} ${new URL(request.url).pathname}`)
    }
    mockServer.events.on('request:start', record)

    render(
      <StrictMode>
        <QueryClientProvider client={createQueryClient()}>
          <AppThemeProvider>
            <MemoryRouter initialEntries={['/posts']}>
              <PostsListPage />
            </MemoryRouter>
          </AppThemeProvider>
        </QueryClientProvider>
      </StrictMode>,
    )

    expect(await screen.findByText('Feature flags control optional behavior')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Create demo post' }))
    const dialog = await screen.findByRole('dialog', { name: 'Quick create post' })
    await user.type(within(dialog).getByLabelText('Title'), 'Created once')
    await user.type(within(dialog).getByLabelText('Body'), 'Not twice.')
    await user.click(within(dialog).getByRole('button', { name: 'Create demo post' }))

    await waitFor(() => expect(screen.getByText('Created once')).toBeInTheDocument())

    expect(requests.filter((entry) => entry === 'POST /posts')).toHaveLength(1)
    // The handler stores what it receives, so a replayed mutation would show up twice.
    expect(screen.getAllByText('Created once')).toHaveLength(1)

    mockServer.events.removeListener('request:start', record)
  })
})
