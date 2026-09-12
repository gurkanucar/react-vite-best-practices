import { useMemo } from 'react'
import { usePreferencesStore } from '@/store/preferences-store'

const numberLocales = { en: 'en-US', tr: 'tr-TR' }

export interface ChartFormatters {
  /** `724600` → `724,600` */
  number: (value: number) => string
  /** `724600` → `$725K`, for axis ticks where full numbers do not fit. */
  compactCurrency: (value: number) => string
  /** `724600` → `725K` */
  compact: (value: number) => string
  /** `26.5` → `26.5%` */
  percent: (value: number) => string
  /** `'2026-09'` → `Sep 2026` */
  month: (value: string) => string
}

/**
 * Charts render numbers outside of Ant Design's components, so they miss the locale that
 * `ConfigProvider` applies everywhere else. These formatters follow the selected language
 * instead, which is why axis ticks and tooltips switch with it.
 */
export function useChartFormatters(): ChartFormatters {
  const language = usePreferencesStore((state) => state.language)

  return useMemo(() => {
    const locale = numberLocales[language]
    const number = new Intl.NumberFormat(locale)
    const compact = new Intl.NumberFormat(locale, { notation: 'compact' })
    const compactCurrency = new Intl.NumberFormat(locale, {
      notation: 'compact',
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    })
    const month = new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric' })

    return {
      number: (value) => number.format(value),
      compact: (value) => compact.format(value),
      compactCurrency: (value) => compactCurrency.format(value),
      percent: (value) => `${number.format(value)}%`,
      // The datasets store `YYYY-MM`; the day is added so the string parses as a date.
      month: (value) => month.format(new Date(`${value}-01T00:00:00`)),
    }
  }, [language])
}
