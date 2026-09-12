import { QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useLocation } from 'react-router'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { resetMockPosts } from '@/features/posts/mocks'
import { PostsListPage } from '@/features/posts/pages/PostsListPage'
import { createQueryClient } from '@/lib/query/query-client'
import { usePreferencesStore } from '@/store/preferences-store'
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

// The ID column ships hidden, so the title is the first cell of every row.
const rowTitles = () =>
  screen
    .getAllByRole('row')
    .slice(1)
    .map((row) => within(row).getAllByRole('cell')[0]?.textContent)

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

  it('coalesces keystrokes into a single request', async () => {
    const user = userEvent.setup()
    const listRequests: string[] = []
    const recordRequest = ({ request }: { request: Request }) => {
      const url = new URL(request.url)
      if (url.pathname === '/posts') listRequests.push(url.search)
    }
    mockServer.events.on('request:start', recordRequest)

    renderPage()
    expect(await screen.findByText('Cache keys carry every filter')).toBeInTheDocument()
    listRequests.length = 0

    // Typing "500" used to ask the server for 5, then 50, then 500.
    await user.type(screen.getByPlaceholderText('Min'), '500')

    await waitFor(() => expect(listRequests).toHaveLength(1))
    expect(listRequests[0]).toContain('minViews=500')

    mockServer.events.removeListener('request:start', recordRequest)
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

  it('offers the same category filter in the column header as in the panel', async () => {
    const user = userEvent.setup()
    renderPage()

    expect(await screen.findByText('Cache keys carry every filter')).toBeInTheDocument()

    // The header filter is a second entry point into the same URL state, not a
    // second copy of it.
    const categoryHeader = screen.getByRole('columnheader', { name: /Category/ })
    await user.click(within(categoryHeader).getByRole('button', { name: /filter/i }))

    const filterDropdown = await waitFor(() => {
      const dropdown = document.querySelector<HTMLElement>('.ant-table-filter-dropdown')
      if (!dropdown) throw new Error('filter dropdown not rendered')
      return dropdown
    })

    await user.click(within(filterDropdown).getByText('routing'))
    await user.click(within(filterDropdown).getByRole('button', { name: 'OK' }))

    await waitFor(() => expect(rowTitles()).toEqual(['The address bar is the source of truth']))
    expect(screen.getByTestId('location-search')).toHaveTextContent('categories=routing')

    // ...so the panel above now shows the same selection.
    const categorySelect = screen.getByRole('combobox', { name: 'Category (from the API)' })
    expect(
      within(categorySelect.closest('.ant-select') ?? categorySelect).getByTitle('routing'),
    ).toBeInTheDocument()
  })

  it('hides the ID column by default and restores it on request', async () => {
    const user = userEvent.setup()
    renderPage()

    expect(await screen.findByText('Cache keys carry every filter')).toBeInTheDocument()
    expect(screen.queryByRole('columnheader', { name: 'ID' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Columns/ }))
    await user.click(await screen.findByRole('checkbox', { name: 'ID' }))

    expect(await screen.findByRole('columnheader', { name: 'ID' })).toBeInTheDocument()
    // The choice is a personal preference, so it is persisted rather than kept in the URL.
    expect(usePreferencesStore.getState().hiddenColumns.posts).toEqual([])
  })
})

function LocationProbe() {
  const location = useLocation()
  return <output data-testid="location-search">{location.search}</output>
}
