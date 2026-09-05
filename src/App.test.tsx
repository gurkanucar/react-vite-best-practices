import { act, render, screen } from '@testing-library/react'
import { createMemoryRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { describe, expect, it, vi } from 'vitest'
import { routes } from '@/router/router'
import { usePreferencesStore } from '@/store/preferences-store'
import { AppThemeProvider } from '@/theme/AppThemeProvider'

vi.mock('@ant-design/charts', () => ({
  Column: () => <div data-testid="weekly-throughput-chart" />,
}))

describe('admin application', () => {
  it('keeps the landing page separate from the dashboard', () => {
    const router = createMemoryRouter(routes, { initialEntries: ['/'] })
    render(
      <AppThemeProvider>
        <RouterProvider router={router} />
      </AppThemeProvider>,
    )

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Start with a React foundation you can understand and trust.',
      }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Explore the dashboard' })).toBeInTheDocument()
    expect(screen.queryByText('Operational overview')).not.toBeInTheDocument()
  })

  it('renders and navigates between routed pages', async () => {
    const router = createMemoryRouter(routes, { initialEntries: ['/dashboard'] })
    render(
      <AppThemeProvider>
        <RouterProvider router={router} />
      </AppThemeProvider>,
    )
    expect(
      screen.getByRole('heading', { level: 1, name: 'Operational overview' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Color theme: System' })).toBeInTheDocument()
    expect(screen.getByText('Monthly revenue')).toBeInTheDocument()
    await act(async () => {
      await router.navigate('/settings')
    })
    expect(
      screen.getByRole('heading', { level: 1, name: 'Workspace preferences' }),
    ).toBeInTheDocument()

    await act(async () => {
      await router.navigate('/components')
    })
    expect(
      screen.getByRole('heading', { level: 1, name: 'Component workspace' }),
    ).toBeInTheDocument()

    await act(async () => {
      await router.navigate('/missing')
    })
    expect(screen.getByText('Page not found')).toBeInTheDocument()
  })
})

it('uses the persistent sidebar on desktop screens', () => {
  usePreferencesStore.setState({ visualTheme: 'glass' })
  const router = createMemoryRouter(routes, { initialEntries: ['/dashboard'] })
  render(
    <AppThemeProvider>
      <RouterProvider router={router} />
    </AppThemeProvider>,
  )
  expect(screen.getByRole('link', { name: /RVBP/ })).toBeInTheDocument()
})
