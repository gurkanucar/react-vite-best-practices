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
