import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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
  it('keeps the landing page separate from the dashboard', async () => {
    const router = createMemoryRouter(routes, { initialEntries: ['/'] })
    render(
      <AppThemeProvider>
        <RouterProvider router={router} />
      </AppThemeProvider>,
    )

    expect(
      await screen.findByRole(
        'heading',
        {
          level: 1,
          name: 'Start with a React foundation you can understand and trust.',
        },
        { timeout: 5_000 },
      ),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Explore the dashboard' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Color theme: System' })).toBeInTheDocument()
    expect(screen.queryByRole('switch', { name: 'Compact density' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Visual theme:/ })).not.toBeInTheDocument()
    expect(screen.queryByText('Operational overview')).not.toBeInTheDocument()
  }, 10_000)

  it('renders and navigates between routed pages', async () => {
    const router = createMemoryRouter(routes, { initialEntries: ['/dashboard'] })
    render(
      <AppThemeProvider>
        <RouterProvider router={router} />
      </AppThemeProvider>,
    )
    expect(
      await screen.findByRole(
        'heading',
        { level: 1, name: 'Operational overview' },
        { timeout: 5_000 },
      ),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Color theme: System' })).toBeInTheDocument()
    expect(screen.getByText('Monthly revenue')).toBeInTheDocument()
    await act(async () => {
      await router.navigate('/settings')
    })
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Workspace preferences' }),
    ).toBeInTheDocument()

    await act(async () => {
      await router.navigate('/settings#state')
    })
    expect(screen.getByRole('menuitem', { name: /Persisted state/ })).toHaveClass(
      'ant-menu-item-selected',
    )

    await act(async () => {
      await router.navigate('/components')
    })
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Component workspace' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Inputs' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByPlaceholderText('Workspace owner')).toBeInTheDocument()

    await act(async () => {
      await router.navigate('/missing')
    })
    expect(await screen.findByText('Page not found')).toBeInTheDocument()
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Return to dashboard' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Go to home page' })).toBeInTheDocument()
  }, 15_000)

  it('renders nested navigation and collapses the sidebar', async () => {
    const router = createMemoryRouter(routes, { initialEntries: ['/dashboard'] })
    render(
      <AppThemeProvider>
        <RouterProvider router={router} />
      </AppThemeProvider>,
    )

    expect(await screen.findByRole('menuitem', { name: /Workspace/ })).toHaveAttribute(
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

  it('opens interactive component examples', async () => {
    const router = createMemoryRouter(routes, { initialEntries: ['/components'] })
    render(
      <AppThemeProvider>
        <RouterProvider router={router} />
      </AppThemeProvider>,
    )

    fireEvent.click(await screen.findByRole('tab', { name: 'Feedback' }))
    fireEvent.click(screen.getByRole('button', { name: 'Open modal' }))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Review workspace changes')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
  })

  it('renders and completes the lazy-loaded authentication and survey examples', async () => {
    const user = userEvent.setup()
    usePreferencesStore.setState({ visualTheme: 'illustration' })
    const router = createMemoryRouter(routes, { initialEntries: ['/login'] })
    render(
      <AppThemeProvider>
        <RouterProvider router={router} />
      </AppThemeProvider>,
    )

    expect(
      await screen.findByRole('heading', { level: 2, name: 'Welcome back' }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('banner')).not.toBeInTheDocument()
    expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Color theme: System' })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Language' })).toBeInTheDocument()
    await user.type(screen.getByLabelText('Email address'), 'owner@example.com')
    await user.type(screen.getByLabelText('Password'), 'Password123')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/dashboard'))

    await act(async () => {
      await router.navigate('/register')
    })
    expect(
      await screen.findByRole('heading', { level: 2, name: 'Create your account' }),
    ).toBeInTheDocument()
    await user.type(screen.getByLabelText('Full name'), 'Maya Chen')
    await user.type(screen.getByLabelText('Email address'), 'maya@example.com')
    await user.type(screen.getByLabelText('Password'), 'Password123')
    await user.click(screen.getByRole('button', { name: 'Create an account' }))
    expect(await screen.findByText('Confirm your password.')).toBeInTheDocument()
    expect(screen.getByText('Accept the terms to continue.')).toBeInTheDocument()

    await user.type(screen.getByLabelText('Confirm password'), 'Different123')
    await user.click(screen.getByRole('checkbox', { name: /terms and privacy policy/i }))
    await user.click(screen.getByRole('button', { name: 'Create an account' }))
    expect(await screen.findByText('The passwords do not match.')).toBeInTheDocument()

    await user.clear(screen.getByLabelText('Confirm password'))
    await user.type(screen.getByLabelText('Confirm password'), 'Password123')
    await user.click(screen.getByRole('button', { name: 'Create an account' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/otp'))

    expect(
      await screen.findByRole('heading', { level: 2, name: 'Verify your account' }),
    ).toBeInTheDocument()
    for (const [index, digit] of [...'123456'].entries()) {
      await user.type(screen.getByLabelText(`OTP Input ${index + 1}`), digit)
    }
    await user.click(screen.getByRole('button', { name: 'Verify account' }))
    await waitFor(() => expect(router.state.location.pathname).toBe('/dashboard'))

    await act(async () => {
      await router.navigate('/survey')
    })
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Product feedback survey' }),
    ).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Reset form' }))
    await user.click(screen.getByRole('combobox', { name: 'Which team are you part of?' }))
    await user.click(await screen.findByRole('option', { name: 'Product' }))
    await user.type(screen.getByLabelText('What is your main goal?'), 'Launch the admin console')
    await user.click(screen.getByRole('radio', { name: 'Very satisfied' }))
    expect(screen.getByRole('button', { name: 'Send feedback' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Send feedback' }))
    expect(await screen.findByText('Example feedback submitted.')).toBeInTheDocument()
  }, 15_000)
})

it('uses the persistent sidebar on desktop screens', async () => {
  usePreferencesStore.setState({ visualTheme: 'glass' })
  const router = createMemoryRouter(routes, { initialEntries: ['/dashboard'] })
  render(
    <AppThemeProvider>
      <RouterProvider router={router} />
    </AppThemeProvider>,
  )
  expect(await screen.findByRole('link', { name: /RVBP/ })).toBeInTheDocument()
})
