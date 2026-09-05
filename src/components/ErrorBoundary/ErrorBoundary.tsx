import { Component, type ErrorInfo, type ReactNode } from 'react'
import { ErrorFallback } from '@/components/ErrorBoundary/ErrorFallback'
import { normalizeError } from '@/errors/error'

export interface ErrorFallbackRenderProps {
  error: Error
  resetErrorBoundary: () => void
}

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: (props: ErrorFallbackRenderProps) => ReactNode
  onError?: (error: Error, info: ErrorInfo) => void
}

interface ErrorBoundaryState {
  error: Error | null
}

const initialState: ErrorBoundaryState = { error: null }

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = initialState

  static getDerivedStateFromError(value: unknown): ErrorBoundaryState {
    return { error: normalizeError(value) }
  }

  componentDidCatch(value: unknown, info: ErrorInfo): void {
    this.props.onError?.(normalizeError(value), info)
  }

  private resetErrorBoundary = (): void => {
    this.setState(initialState)
  }

  private reloadApplication = (): void => {
    window.location.reload()
  }

  render(): ReactNode {
    const { children, fallback } = this.props
    const { error } = this.state

    if (!error) {
      return children
    }

    if (fallback) {
      return fallback({ error, resetErrorBoundary: this.resetErrorBoundary })
    }

    return <ErrorFallback error={error} onRetry={this.reloadApplication} />
  }
}
