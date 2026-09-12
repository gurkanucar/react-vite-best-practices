import { env } from '@/config/env'

export type ErrorKind = 'api-mocking-startup' | 'caught' | 'uncaught' | 'recoverable'

export interface ErrorContext {
  kind: ErrorKind
  componentStack?: string | null
}

export interface ErrorReport {
  error: Error
  context: ErrorContext
  environment: string
  release: string
  timestamp: string
  url?: string
}

export type ErrorReporter = (report: ErrorReport) => void

let productionReporter: ErrorReporter | undefined

/**
 * Connect a production monitoring SDK once during application bootstrap. Keeping the
 * adapter here prevents feature code from importing a specific vendor SDK.
 */
export function configureErrorReporter(reporter?: ErrorReporter): void {
  productionReporter = reporter
}

export function normalizeError(value: unknown): Error {
  if (value instanceof Error) {
    return value
  }

  return new Error(typeof value === 'string' ? value : 'An unknown error occurred')
}

export function reportError(value: unknown, context: ErrorContext): void {
  const error = normalizeError(value)
  const report: ErrorReport = {
    error,
    context,
    environment: env.mode,
    release: __APP_VERSION__,
    timestamp: new Date().toISOString(),
    url: typeof window === 'undefined' ? undefined : window.location.href,
  }

  // Development stays visible in DevTools. Production also falls back to the console
  // until an observability adapter is configured, so unexpected errors are never silent.
  if (env.isDevelopment || !productionReporter) {
    console.error(`[${context.kind}] ${error.message}`, report)
  }

  try {
    productionReporter?.(report)
  } catch (reporterError) {
    console.error('[error-reporter] Failed to send an error report', reporterError)
  }
}
