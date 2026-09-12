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

/** jsdom lays nothing out, so every element measures zero. */
const measuredSize = { width: 800, height: 400 }

/**
 * Reporting a real size matters for anything that draws itself from its measured box —
 * Recharts' `ResponsiveContainer` refuses to render a chart at 0x0 and warns instead.
 */
class ResizeObserverMock implements ResizeObserver {
  private readonly callback: ResizeObserverCallback

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback
  }

  observe(target: Element) {
    const contentRect = { ...measuredSize, top: 0, left: 0, bottom: 400, right: 800, x: 0, y: 0 }

    this.callback([{ target, contentRect } as ResizeObserverEntry], this)
  }

  disconnect() {}
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
