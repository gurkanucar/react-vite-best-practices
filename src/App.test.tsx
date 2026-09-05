import { act, fireEvent, render, screen } from '@testing-library/react'
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
    expect(screen.getByRole('tab', { name: 'Inputs' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByPlaceholderText('Workspace owner')).toBeInTheDocument()

    await act(async () => {
      await router.navigate('/missing')
    })
    expect(screen.getByText('Page not found')).toBeInTheDocument()
  })

  it('renders nested navigation and collapses the sidebar', () => {
    const router = createMemoryRouter(routes, { initialEntries: ['/dashboard'] })
    render(
      <AppThemeProvider>
        <RouterProvider router={router} />
      </AppThemeProvider>,
    )

    expect(screen.getByRole('menuitem', { name: /Workspace/ })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
    expect(screen.getByRole('menuitem', { name: /Dashboard/ })).toBeVisible()

    const sidebar = screen.getByRole('complementary')
    const collapseTrigger = sidebar.querySelector<HTMLElement>('.ant-layout-sider-trigger')

    expect(collapseTrigger).not.toBeNull()
    fireEvent.click(collapseTrigger!)

    expect(sidebar).toHaveClass('ant-layout-sider-collapsed')
    expect(screen.queryByText('Foundation workspace')).not.toBeInTheDocument()
  })

  it('opens interactive component examples', () => {
    const router = createMemoryRouter(routes, { initialEntries: ['/components'] })
    render(
      <AppThemeProvider>
        <RouterProvider router={router} />
      </AppThemeProvider>,
    )

    fireEvent.click(screen.getByRole('tab', { name: 'Feedback' }))
    fireEvent.click(screen.getByRole('button', { name: 'Open modal' }))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Review workspace changes')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
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
