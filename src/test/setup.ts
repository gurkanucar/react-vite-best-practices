import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach } from 'vitest'
import { initialPreferences, usePreferencesStore } from '@/store/preferences-store'

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
