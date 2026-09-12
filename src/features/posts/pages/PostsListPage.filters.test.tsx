import { QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useLocation } from 'react-router'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { resetMockPosts } from '@/features/posts/mocks'
import { PostsListPage } from '@/features/posts/pages/PostsListPage'
import { createQueryClient } from '@/lib/query/query-client'
import { mockServer } from '@/mocks/server'
import { AppThemeProvider } from '@/theme/AppThemeProvider'

// The filter panel is a capability of the mock API, so the flag has to be on for it.
vi.mock('@/config/featureFlags', () => ({
  FEATURE_FLAGS: { mockPostsApi: true },
  isFeatureEnabled: () => true,
}))

beforeAll(() => mockServer.listen({ onUnhandledRequest: 'error' }))

afterEach(() => {
  mockServer.resetHandlers()
  resetMockPosts()
})

afterAll(() => mockServer.close())

function renderPage() {
  return render(
    <QueryClientProvider client={createQueryClient()}>
      <AppThemeProvider>
        <MemoryRouter initialEntries={['/posts']}>
          <PostsListPage />
          <LocationProbe />
        </MemoryRouter>
      </AppThemeProvider>
    </QueryClientProvider>,
  )
}

const rowTitles = () =>
  screen
    .getAllByRole('row')
    .slice(1)
    .map((row) => within(row).getAllByRole('cell')[1]?.textContent)

describe('PostsListPage filters', () => {
  it('narrows rows through the API and keeps every filter in the URL', async () => {
    const user = userEvent.setup()
    renderPage()

    expect(await screen.findByText('Feature flags control optional behavior')).toBeInTheDocument()
    expect(rowTitles()).toHaveLength(10)

    // Category options are fetched, not derived from the rows already on screen.
    const categorySelect = screen.getByRole('combobox', { name: 'Category (from the API)' })
    await user.click(categorySelect)
    expect(await screen.findByTitle('routing')).toBeInTheDocument()
    await user.click(screen.getByTitle('routing'))

    await waitFor(() => expect(rowTitles()).toEqual(['The address bar is the source of truth']))
    expect(screen.getByTestId('location-search')).toHaveTextContent('categories=routing')
  })

  it('applies the view-count range on the server', async () => {
    const user = userEvent.setup()
    renderPage()

    expect(await screen.findByText('Cache keys carry every filter')).toBeInTheDocument()

    await user.type(screen.getByPlaceholderText('Min'), '3000')
    await waitFor(() => {
      expect(rowTitles()).toEqual([
        'Dynamic filter options belong to the server',
        'Numeric and date ranges are filters too',
      ])
    })
    expect(screen.getByTestId('location-search')).toHaveTextContent('minViews=3000')
  })

  it('sends sorting to the API rather than reordering the loaded page', async () => {
    const user = userEvent.setup()
    renderPage()

    expect(await screen.findByText('Cache keys carry every filter')).toBeInTheDocument()

    await user.click(screen.getByRole('columnheader', { name: /Views/ }))

    await waitFor(() => expect(rowTitles()[0]).toBe('The address bar is the source of truth'))
    expect(screen.getByTestId('location-search')).toHaveTextContent('sort=views')
    expect(screen.getByTestId('location-search')).toHaveTextContent('order=asc')
  })
})

function LocationProbe() {
  const location = useLocation()
  return <output data-testid="location-search">{location.search}</output>
}
