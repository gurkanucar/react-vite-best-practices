import { render, screen } from '@testing-library/react'
import { beforeAll, describe, expect, it } from 'vitest'
import { AnalyticsPage } from '@/features/analytics/pages/AnalyticsPage'
import { getMessages } from '@/i18n/messages'
import { usePreferencesStore } from '@/store/preferences-store'
import { AppThemeProvider } from '@/theme/AppThemeProvider'

/**
 * jsdom lays nothing out, so every element measures zero and Recharts refuses to draw at
 * 0x0. Reporting a size makes the charts render, which is what lets these tests assert
 * that they did. It is stubbed here rather than globally because a component that
 * re-observes while handling a resize — antd's tree, for one — loops forever against an
 * observer that answers every `observe` call.
 */
beforeAll(() => {
  class SizedResizeObserver implements ResizeObserver {
    private readonly callback: ResizeObserverCallback

    constructor(callback: ResizeObserverCallback) {
      this.callback = callback
    }

    observe(target: Element) {
      const contentRect = {
        width: 800,
        height: 400,
        top: 0,
        left: 0,
        bottom: 400,
        right: 800,
        x: 0,
        y: 0,
      }

      this.callback([{ target, contentRect } as ResizeObserverEntry], this)
    }

    disconnect() {}
    unobserve() {}
  }

  globalThis.ResizeObserver = SizedResizeObserver
})

function renderPage() {
  render(
    <AppThemeProvider>
      <AnalyticsPage />
    </AppThemeProvider>,
  )
}

const cardTitleKeys = [
  'revenueTitle',
  'devicesTitle',
  'signupsTitle',
  'funnelTitle',
  'latencyTitle',
  'objectivesTitle',
  'routesTitle',
  'lighthouseTitle',
  'bundleTitle',
  'plansTitle',
] as const

describe('AnalyticsPage', () => {
  it('mounts every chart', () => {
    const { container } = render(
      <AppThemeProvider>
        <AnalyticsPage />
      </AppThemeProvider>,
    )

    const messages = getMessages('en')
    for (const key of cardTitleKeys) {
      expect(screen.getByText(messages.analytics[key])).toBeInTheDocument()
    }
    // A card can render its title while the chart inside it fails to draw. Legend
    // swatches are surfaces of their own, so the wrapper is what counts one chart.
    expect(container.querySelectorAll('.recharts-wrapper')).toHaveLength(cardTitleKeys.length)
  })

  it('translates every chart heading, so none of them falls back to English', () => {
    usePreferencesStore.setState({ language: 'tr' })
    renderPage()

    const turkish = getMessages('tr')
    const english = getMessages('en')
    for (const key of cardTitleKeys) {
      expect(screen.getByText(turkish.analytics[key])).toBeInTheDocument()
      expect(screen.queryByText(english.analytics[key])).not.toBeInTheDocument()
    }
  })
})
