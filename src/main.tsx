import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router/dom'
import 'antd/dist/reset.css'
import { QueryProvider } from '@/app/providers/QueryProvider'
import { isAnyApiMocked } from '@/config/featureFlags'
import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary'
import { reportError } from '@/errors/error'
import { router } from '@/router/router'
import { AppThemeProvider } from '@/theme/AppThemeProvider'
import '@/index.css'

function getRootElement(): HTMLElement {
  const element = document.getElementById('root')

  if (!element) {
    throw new Error('Application root element was not found')
  }

  return element
}

const rootElement = getRootElement()

/**
 * A Service Worker outlives the page that registered it, so one started by an earlier
 * run keeps intercepting every request — navigations included — after the flag is
 * turned off. Turning the flag off therefore has to remove it, not merely skip start.
 */
async function removeApiMocking() {
  const registrations = (await navigator.serviceWorker?.getRegistrations()) ?? []

  await Promise.all(
    registrations
      .filter((registration) => registration.active?.scriptURL.endsWith('/mockServiceWorker.js'))
      .map((registration) => registration.unregister()),
  )
}

async function enableApiMocking() {
  if (!import.meta.env.DEV) {
    return
  }

  if (!isAnyApiMocked()) {
    await removeApiMocking()
    return
  }

  const { worker } = await import('@/mocks/browser')
  await worker.start({ onUnhandledRequest: 'bypass' })
}

async function bootstrap() {
  try {
    await enableApiMocking()
  } catch (error) {
    reportError(error, { kind: 'api-mocking-startup' })
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
}

void bootstrap()
