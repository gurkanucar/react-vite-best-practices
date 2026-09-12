import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AnalyticsPage } from '@/features/analytics/pages/AnalyticsPage'
import { getMessages } from '@/i18n/messages'
import { usePreferencesStore } from '@/store/preferences-store'
import { AppThemeProvider } from '@/theme/AppThemeProvider'

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
