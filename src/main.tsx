import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '@/App'
import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary'
import { reportError } from '@/errors/error'
import '@/index.css'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Application root element was not found')
}

createRoot(rootElement, {
  onCaughtError: (error, errorInfo) => {
    reportError(error, { kind: 'caught', componentStack: errorInfo.componentStack })
  },
  onUncaughtError: (error, errorInfo) => {
    reportError(error, { kind: 'uncaught', componentStack: errorInfo.componentStack })
  },
  onRecoverableError: (error, errorInfo) => {
    reportError(error, { kind: 'recoverable', componentStack: errorInfo.componentStack })
  },
}).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
