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
  it('renders only the active responsive page and pages through the document', async () => {
    const user = userEvent.setup()
    const { PdfViewer } = await import('@/features/documents/components/PdfViewer')

    render(
      <AppThemeProvider>
        <PdfViewer file={new Blob(['pdf'])} title="Report" />
      </AppThemeProvider>,
    )

    fireEvent.click(screen.getByTestId('load-pdf'))

    expect(screen.getAllByTestId('pdf-page')).toHaveLength(1)
    expect(screen.getByTestId('pdf-page')).toHaveAttribute('data-page-number', '1')
    expect(screen.getByText('Page 1 of 3')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Next page' }))
    expect(screen.getByTestId('pdf-page')).toHaveAttribute('data-page-number', '2')

    const initialWidth = Number(screen.getByTestId('pdf-page').dataset.width)
    await user.click(screen.getByRole('button', { name: 'Zoom in' }))
    expect(Number(screen.getByTestId('pdf-page').dataset.width)).toBeGreaterThan(initialWidth)
  })
})
