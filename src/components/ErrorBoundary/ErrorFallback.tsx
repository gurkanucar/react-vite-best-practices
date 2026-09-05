import { useEffect, useRef } from 'react'
import { env } from '@/config/env'
import './ErrorFallback.css'

interface ErrorFallbackProps {
  error: Error
  onRetry: () => void
}

export function ErrorFallback({ error, onRetry }: ErrorFallbackProps) {
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  return (
    <main className="error-fallback" role="alert" aria-labelledby="error-fallback-title">
      <section className="error-fallback__card">
        <p className="error-fallback__status">
          <span aria-hidden="true" />
          Application interrupted
        </p>
        <h1 id="error-fallback-title" ref={headingRef} tabIndex={-1}>
          This screen could not be loaded.
        </h1>
        <p className="error-fallback__message">
          Reload the application to try again. If the problem continues, report what you were doing
          when it happened.
        </p>
        {env.isDevelopment && (
          <details className="error-fallback__details">
            <summary>Developer details</summary>
            <code>{error.message}</code>
          </details>
        )}
        <button className="error-fallback__action" type="button" onClick={onRetry}>
          Reload application
        </button>
      </section>
    </main>
  )
}
