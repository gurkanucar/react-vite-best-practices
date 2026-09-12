import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { forChart, useChartFormatters } from '@/features/analytics/hooks'
import { usePreferencesStore } from '@/store/preferences-store'

describe('useChartFormatters', () => {
  it('formats axis values in the selected language', () => {
    const { result, rerender } = renderHook(() => useChartFormatters())

    expect(result.current.number(724_600)).toBe('724,600')
    expect(result.current.compact(724_600)).toBe('725K')
    expect(result.current.month('2026-09')).toBe('Sep 2026')

    act(() => {
      usePreferencesStore.setState({ language: 'tr' })
    })
    rerender()

    expect(result.current.number(724_600)).toBe('724.600')
    expect(result.current.month('2026-09')).toBe('Eyl 2026')
  })

  it('keeps the month readable regardless of the machine time zone', () => {
    const { result } = renderHook(() => useChartFormatters())

    // Parsing `2026-01` as a bare date would land on the previous year west of UTC.
    expect(result.current.month('2026-01')).toBe('Jan 2026')
  })
})

describe('forChart', () => {
  it('applies the formatter only to numbers recharts actually supplies', () => {
    const format = forChart((value) => `${value} ms`)

    expect(format(42)).toBe('42 ms')
    // Recharts passes `undefined` while a tooltip has no active point.
    expect(format(undefined)).toBe('')
    expect(format('n/a')).toBe('n/a')
  })
})
