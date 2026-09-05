import { describe, expect, it, vi } from 'vitest'
import { normalizeError, reportError } from '@/errors/error'

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
      expect.objectContaining({ componentStack: 'in App' }),
    )

    consoleError.mockRestore()
  })
})
