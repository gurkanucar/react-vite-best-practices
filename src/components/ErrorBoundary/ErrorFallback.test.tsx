import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ErrorFallback } from '@/components/ErrorBoundary/ErrorFallback'

describe('ErrorFallback', () => {
  it('explains the failure and supports retrying', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn<() => void>()

    render(<ErrorFallback error={new Error('Render failed')} onRetry={onRetry} />)

    expect(screen.getByRole('alert')).toHaveTextContent('This screen could not be loaded.')
    expect(screen.getByText('Render failed')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Reload application' }))

    expect(onRetry).toHaveBeenCalledOnce()
  })
})
