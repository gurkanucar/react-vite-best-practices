import { QueryClientProvider } from '@tanstack/react-query'
import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BoardPage } from '@/features/board/pages/BoardPage'
import { createQueryClient } from '@/lib/query/query-client'
import { AppThemeProvider } from '@/theme/AppThemeProvider'

function renderPage() {
  return render(
    <QueryClientProvider client={createQueryClient()}>
      <AppThemeProvider>
        <BoardPage />
      </AppThemeProvider>
    </QueryClientProvider>,
  )
}

describe('BoardPage', () => {
  it('renders every column with its cards once the board loads', async () => {
    const { container } = renderPage()

    expect(await screen.findByText('Backlog')).toBeInTheDocument()
    for (const column of ['In progress', 'In review', 'Done']) {
      expect(screen.getByText(column)).toBeInTheDocument()
    }

    expect(container.querySelectorAll('.board-column')).toHaveLength(4)
    expect(container.querySelectorAll('.board-card').length).toBeGreaterThan(0)
  })

  it('gives every card a drag handle, so the board is reachable from the keyboard', async () => {
    const { container } = renderPage()

    await screen.findByText('Backlog')

    const cards = container.querySelectorAll('.board-card')
    const handles = screen.getAllByRole('button', { name: /^Drag: / })

    expect(handles).toHaveLength(cards.length)
  })

  it('shows the work-in-progress cap on the columns that have one', async () => {
    renderPage()

    await screen.findByText('Backlog')

    expect(screen.getByText('WIP limit 3')).toBeInTheDocument()
    expect(screen.getByText('WIP limit 2')).toBeInTheDocument()
  })

  it('counts the cards in each column', async () => {
    const { container } = renderPage()

    await screen.findByText('Done')

    const done = [...container.querySelectorAll<HTMLElement>('.board-column')].find((column) =>
      column.textContent?.startsWith('Done'),
    )!

    expect(within(done).getAllByText(/^RVB-/)).toHaveLength(
      done.querySelectorAll('.board-card').length,
    )
  })
})
