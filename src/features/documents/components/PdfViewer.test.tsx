import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { AppThemeProvider } from '@/theme/AppThemeProvider'

vi.mock('react-pdf', () => ({
  pdfjs: { GlobalWorkerOptions: {} },
  Document: ({
    children,
    onLoadSuccess,
  }: {
    children: React.ReactNode
    onLoadSuccess: (result: { numPages: number }) => void
  }) => (
    <div>
      <button
        aria-label="Complete PDF loading"
        data-testid="load-pdf"
        onClick={() => onLoadSuccess({ numPages: 3 })}
      />
      {children}
    </div>
  ),
  Page: ({ pageNumber, width }: { pageNumber: number; width: number }) => (
    <div data-testid="pdf-page" data-page-number={pageNumber} data-width={width} />
  ),
}))

describe('PdfViewer', () => {
  it('renders every page of the document in one scrollable column', async () => {
    const user = userEvent.setup()
    const { PdfViewer } = await import('@/features/documents/components/PdfViewer')

    render(
      <AppThemeProvider>
        <PdfViewer file={new Blob(['pdf'])} title="Report" />
      </AppThemeProvider>,
    )

    fireEvent.click(screen.getByTestId('load-pdf'))

    const pages = screen.getAllByTestId('pdf-page')
    expect(pages.map((page) => page.dataset.pageNumber)).toEqual(['1', '2', '3'])
    expect(screen.getByText('Page 1 of 3')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Next page' })).not.toBeInTheDocument()

    const initialWidth = Number(pages[0].dataset.width)
    await user.click(screen.getByRole('button', { name: 'Zoom in' }))
    for (const page of screen.getAllByTestId('pdf-page')) {
      expect(Number(page.dataset.width)).toBeGreaterThan(initialWidth)
    }
  })
})
