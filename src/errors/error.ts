import { env } from '@/config/env'

export type ErrorKind = 'api-mocking-startup' | 'caught' | 'uncaught' | 'recoverable'

export interface ErrorContext {
  kind: ErrorKind
  componentStack?: string | null
}

export function normalizeError(value: unknown): Error {
  if (value instanceof Error) {
    return value
  }

  return new Error(typeof value === 'string' ? value : 'An unknown error occurred')
}

export function reportError(value: unknown, context: ErrorContext): void {
  const error = normalizeError(value)

  // Replace this development reporter with an observability service in production.
  if (env.isDevelopment) {
    console.error(`[${context.kind}] ${error.message}`, {
      error,
      componentStack: context.componentStack,
    })
  }
}
