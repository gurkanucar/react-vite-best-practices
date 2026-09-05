import { act, render } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { initialPreferences, usePreferencesStore } from '@/store/preferences-store'
import { AppThemeProvider } from '@/theme/AppThemeProvider'

describe('AppThemeProvider', () => {
  beforeEach(() => usePreferencesStore.setState(initialPreferences))
  it('applies preferences from the Zustand store', () => {
    usePreferencesStore.setState({ colorMode: 'light', compact: true, visualTheme: 'blossom' })
    render(
      <AppThemeProvider>
        <p>Preview</p>
      </AppThemeProvider>,
    )
    expect(document.documentElement).toHaveAttribute('data-theme', 'light')
    expect(document.documentElement).toHaveAttribute('data-visual-theme', 'blossom')
  })
  it('tracks the operating-system color preference', () => {
    let handler: ((event: MediaQueryListEvent) => void) | undefined
    const removeEventListener =
      vi.fn<(type: string, listener: EventListenerOrEventListenerObject) => void>()
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: true,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addListener: vi.fn<MediaQueryList['addListener']>(),
      removeListener: vi.fn<MediaQueryList['removeListener']>(),
      addEventListener: (_type: string, listener: EventListenerOrEventListenerObject) => {
        handler = listener as (event: MediaQueryListEvent) => void
      },
      removeEventListener,
      dispatchEvent: vi.fn<EventTarget['dispatchEvent']>().mockReturnValue(false),
    })
    const { unmount } = render(
      <AppThemeProvider>
        <p>Preview</p>
      </AppThemeProvider>,
    )
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
    act(() => handler?.({ matches: false } as MediaQueryListEvent))
    expect(document.documentElement).toHaveAttribute('data-theme', 'light')
    unmount()
    expect(removeEventListener).toHaveBeenCalledWith('change', expect.any(Function))
  })

  it('updates the browser chrome color for a dark theme', () => {
    const meta = document.createElement('meta')
    meta.id = 'theme-color'
    document.head.append(meta)
    usePreferencesStore.setState({ colorMode: 'dark' })
    render(
      <AppThemeProvider>
        <p>Preview</p>
      </AppThemeProvider>,
    )
    expect(meta).toHaveAttribute('content', '#0b101b')
    meta.remove()
  })
})
