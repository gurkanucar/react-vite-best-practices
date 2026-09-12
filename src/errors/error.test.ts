import { afterEach, describe, expect, it, vi } from 'vitest'
import { configureErrorReporter, normalizeError, reportError } from '@/errors/error'

afterEach(() => {
  configureErrorReporter()
  vi.restoreAllMocks()
})

describe('normalizeError', () => {
  it('keeps Error instances unchanged', () => {
    const error = new Error('Already normalized')

    expect(normalizeError(error)).toBe(error)
  })

  it('turns thrown values into Error instances', () => {
    expect(normalizeError('Request failed')).toEqual(new Error('Request failed'))
    expect(normalizeError({ status: 500 })).toEqual(new Error('An unknown error occurred'))
  })
})

describe('reportError', () => {
  it('reports normalized errors during development', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    reportError('Render failed', { kind: 'caught', componentStack: 'in App' })

    expect(consoleError).toHaveBeenCalledWith(
      '[caught] Render failed',
      expect.objectContaining({
        context: { kind: 'caught', componentStack: 'in App' },
        release: __APP_VERSION__,
      }),
    )
  })

  it('passes normalized, release-aware reports to a configured adapter', () => {
    const reporter = vi.fn<(report: unknown) => void>()
    configureErrorReporter(reporter)

    reportError('Request failed', { kind: 'recoverable' })

    expect(reporter).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({ message: 'Request failed' }),
        environment: 'test',
        release: __APP_VERSION__,
      }),
    )
  })
})
