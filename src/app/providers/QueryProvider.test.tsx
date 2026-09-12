import { render, screen } from '@testing-library/react'
import { useQueryClient } from '@tanstack/react-query'
import { describe, expect, it } from 'vitest'
import { QueryProvider } from '@/app/providers/QueryProvider'
import { createQueryClient } from '@/lib/query/query-client'

function QueryClientConsumer() {
  const client = useQueryClient()
  return <span>{client ? 'Query client connected' : 'Missing query client'}</span>
}

describe('QueryProvider', () => {
  it('provides the selected query client to its children', () => {
    render(
      <QueryProvider client={createQueryClient()}>
        <QueryClientConsumer />
      </QueryProvider>,
    )

    expect(screen.getByText('Query client connected')).toBeInTheDocument()
  })
})
