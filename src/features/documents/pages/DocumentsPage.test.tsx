import { QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { downloadBlob } from '@/features/documents/hooks'
import { DocumentsPage } from '@/features/documents/pages/DocumentsPage'
import { createQueryClient } from '@/lib/query/query-client'
import { AppThemeProvider } from '@/theme/AppThemeProvider'

// pdf.js needs a worker and a canvas, neither of which jsdom provides. The viewer is
// exercised in the browser; this covers the fetching and blob handling around it.
vi.mock('@/features/documents/components', () => ({
  PdfViewer: ({ title }: { title: string }) => <div>{title}</div>,
}))

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('DocumentsPage', () => {
  it('requests the document as a blob and renders the viewer', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response('%PDF-1.4', {
        headers: { 'Content-Type': 'application/pdf' },
        status: 200,
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    render(
      <QueryClientProvider client={createQueryClient()}>
        <AppThemeProvider>
          <DocumentsPage />
        </AppThemeProvider>
      </QueryClientProvider>,
    )

    expect(await screen.findByText('Release report')).toBeInTheDocument()
    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce())
    expect(String(fetchMock.mock.calls[0][0])).toContain('/sample-report.pdf')
    // A JSON Accept header would make a real API return the wrong representation.
    expect(fetchMock.mock.calls[0][1]).toMatchObject({
      headers: expect.objectContaining({ Accept: '*/*' }),
    })
  })
})

describe('downloadBlob', () => {
  it('releases the object URL instead of leaving it attached to the document', () => {
    const createObjectURL = vi.fn<(blob: Blob) => string>(() => 'blob:sample')
    const revokeObjectURL = vi.fn<(url: string) => void>()
    vi.stubGlobal('URL', { ...URL, createObjectURL, revokeObjectURL })
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})

    downloadBlob(new Blob(['x']), 'report.pdf')

    expect(click).toHaveBeenCalledOnce()
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:sample')
  })
})
