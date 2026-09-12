import '@testing-library/jest-dom/vitest'
import { cleanup, configure } from '@testing-library/react'
import { afterEach, beforeEach } from 'vitest'
import { initialPreferences, usePreferencesStore } from '@/store/preferences-store'

/*
 * Several tests wait on a lazy route: the `findBy*` that follows a navigation is waiting on
 * a dynamic import, not on a render. One second is enough on an idle machine and not enough
 * when the rest of the suite is competing for the same cores, which showed up as tests that
 * passed alone and failed in the full run.
 */
configure({ asyncUtilTimeout: 5_000 })

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string): MediaQueryList => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false,
  }),
})

class ResizeObserverMock implements ResizeObserver {
  disconnect() {}
  observe() {}
  unobserve() {}
}

Object.defineProperty(globalThis, 'ResizeObserver', {
  writable: true,
  value: ResizeObserverMock,
})

beforeEach(() => {
  window.localStorage.clear()
  usePreferencesStore.setState(initialPreferences)
  usePreferencesStore.persist.clearStorage()
  delete document.documentElement.dataset.theme
  delete document.documentElement.dataset.visualTheme
  document.documentElement.style.removeProperty('color-scheme')
})

afterEach(() => {
  cleanup()
})
