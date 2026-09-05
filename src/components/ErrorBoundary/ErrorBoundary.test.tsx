import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary'

describe('ErrorBoundary', () => {
  it('renders its children when no error is thrown', () => {
    render(
      <ErrorBoundary>
        <p>Application content</p>
      </ErrorBoundary>,
    )

    expect(screen.getByText('Application content')).toBeInTheDocument()
  })

  it('renders a fallback and can retry after a render error', async () => {
    const user = userEvent.setup()
    const onError = vi.fn<() => void>()
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    let shouldThrow = true

    function UnstableContent() {
      if (shouldThrow) {
        throw new Error('Render failed')
      }

      return <p>Recovered content</p>
    }

    render(
      <ErrorBoundary
        onError={onError}
        fallback={({ error, resetErrorBoundary }) => (
          <div role="alert">
            <p>{error.message}</p>
            <button
              type="button"
              onClick={() => {
                shouldThrow = false
                resetErrorBoundary()
              }}
            >
              Try again
            </button>
          </div>
        )}
      >
        <UnstableContent />
      </ErrorBoundary>,
    )

    expect(screen.getByRole('alert')).toHaveTextContent('Render failed')
    expect(onError).toHaveBeenCalledOnce()

    await user.click(screen.getByRole('button', { name: 'Try again' }))

    expect(screen.getByText('Recovered content')).toBeInTheDocument()
    consoleError.mockRestore()
  })
})
