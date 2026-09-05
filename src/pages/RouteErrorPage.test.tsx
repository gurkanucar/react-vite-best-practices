import { render, screen } from '@testing-library/react'
import { createMemoryRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { describe, expect, it } from 'vitest'
import { RouteErrorPage } from './RouteErrorPage'

function renderFailedRoute(error: unknown) {
  const router = createMemoryRouter([
    {
      path: '/',
      loader: () => {
        throw error
      },
      errorElement: <RouteErrorPage />,
    },
  ])
  render(<RouterProvider router={router} />)
}

describe('RouteErrorPage', () => {
  it('shows route response details', async () => {
    renderFailedRoute(new Response(null, { status: 404, statusText: 'Not Found' }))
    expect(await screen.findByText('404 Not Found')).toBeInTheDocument()
  })

  it('uses a safe message for unexpected errors', async () => {
    renderFailedRoute(new Error('Private implementation detail'))
    expect(await screen.findByText('The route could not be rendered.')).toBeInTheDocument()
  })
})
