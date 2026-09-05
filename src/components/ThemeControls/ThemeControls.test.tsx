import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { ColorModeControl, ThemeControls } from '@/components/ThemeControls/ThemeControls'
import { AppThemeProvider } from '@/theme/AppThemeProvider'
import { preferencesStorageKey } from '@/store/preferences-store'

describe('ThemeControls', () => {
  it('switches supported color and density themes and persists the preference', async () => {
    const user = userEvent.setup()

    render(
      <AppThemeProvider>
        <ThemeControls />
      </AppThemeProvider>,
    )

    await user.click(screen.getByText('Dark'))

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
    })

    await user.click(screen.getByRole('switch', { name: 'Compact density' }))

    await user.click(screen.getByRole('button', { name: 'Visual theme: Ant Design' }))
    await user.click(screen.getByRole('button', { name: 'Blossom' }))

    expect(screen.getByRole('radiogroup', { name: 'Color theme' })).toBeInTheDocument()
    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
    })

    expect(JSON.parse(window.localStorage.getItem(preferencesStorageKey) ?? '{}').state).toEqual({
      language: 'en',
      colorMode: 'dark',
      compact: true,
      visualTheme: 'blossom',
    })
  })

  it('uses a compact dropdown variant for navigation bars', async () => {
    const user = userEvent.setup()

    render(
      <AppThemeProvider>
        <ColorModeControl variant="menu" />
      </AppThemeProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'Color theme: System' }))
    await user.click(await screen.findByText('Dark'))

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
    })
  })
})
