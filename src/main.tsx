import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router/dom'
import 'antd/dist/reset.css'
import { QueryProvider } from '@/app/providers/QueryProvider'
import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary'
import { reportError } from '@/errors/error'
import { router } from '@/router/router'
import { AppThemeProvider } from '@/theme/AppThemeProvider'
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
      <QueryProvider>
        <AppThemeProvider>
          <RouterProvider router={router} />
        </AppThemeProvider>
      </QueryProvider>
    </ErrorBoundary>
  </StrictMode>,
)
