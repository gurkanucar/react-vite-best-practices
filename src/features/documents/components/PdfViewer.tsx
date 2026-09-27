import { ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons'
import { Alert, Button, Card, Flex, Tooltip, Typography } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { LoadingState } from '@/components/LoadingState/LoadingState'
import { PDF_ZOOM } from '@/features/documents/types'
import { useMessages } from '@/i18n/messages'
import './PdfViewer.css'

/**
 * pdf.js parses documents on a worker so the main thread stays responsive. Resolving it
 * through `import.meta.url` lets Vite bundle and fingerprint the worker with the rest of
 * the application, instead of loading a version-sensitive file from a CDN at runtime.
 */
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

interface PdfViewerProps {
  /** react-pdf accepts the blob directly, so no object URL has to be kept alive. */
  file: Blob
  title: string
}

export function PdfViewer({ file, title }: PdfViewerProps) {
  const messages = useMessages()
  const viewportRef = useRef<HTMLDivElement>(null)
  const [pageCount, setPageCount] = useState(0)
  const [page, setPage] = useState(1)
  const [zoom, setZoom] = useState(1)
  const [pageWidth, setPageWidth] = useState(720)

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return undefined

    const updatePageWidth = () => {
      if (viewport.clientWidth > 0) {
        setPageWidth(Math.max(280, viewport.clientWidth - 32))
      }
    }
    const observer = new ResizeObserver(updatePageWidth)

    updatePageWidth()
    observer.observe(viewport)

    return () => observer.disconnect()
  }, [])

  /*
   * Every page is rendered and the reader scrolls through them, so the indicator follows
   * the page that fills most of the viewport instead of being driven by buttons.
   */
  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport || pageCount === 0 || typeof IntersectionObserver === 'undefined') {
      return undefined
    }

    const visibility = new Map<number, number>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibility.set(
            Number((entry.target as HTMLElement).dataset.page),
            entry.intersectionRatio,
          )
        }

        let mostVisible = 1
        let highestRatio = -1
        for (const [pageNumber, ratio] of visibility) {
          if (ratio > highestRatio) {
            mostVisible = pageNumber
            highestRatio = ratio
          }
        }
        setPage(mostVisible)
      },
      { root: viewport, threshold: [0, 0.25, 0.5, 0.75, 1] },
    )

    viewport.querySelectorAll('.pdf-viewer__page').forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [pageCount])

  const changeZoom = (delta: number) =>
    setZoom((current) =>
      Math.min(Math.max(Number((current + delta).toFixed(2)), PDF_ZOOM.min), PDF_ZOOM.max),
    )

  return (
    <Card
      className="pdf-viewer"
      title={title}
      extra={
        <Flex align="center" gap={8} wrap>
          <Typography.Text aria-live="polite">
            {messages.documents.pageOf
              .replace('{page}', String(page))
              .replace('{total}', String(pageCount || 1))}
          </Typography.Text>

          <Tooltip title={messages.documents.zoomOut}>
            <Button
              aria-label={messages.documents.zoomOut}
              disabled={zoom <= PDF_ZOOM.min}
              icon={<ZoomOutOutlined aria-hidden="true" />}
              onClick={() => changeZoom(-PDF_ZOOM.step)}
            />
          </Tooltip>
          <Typography.Text>{Math.round(zoom * 100)}%</Typography.Text>
          <Tooltip title={messages.documents.zoomIn}>
            <Button
              aria-label={messages.documents.zoomIn}
              disabled={zoom >= PDF_ZOOM.max}
              icon={<ZoomInOutlined aria-hidden="true" />}
              onClick={() => changeZoom(PDF_ZOOM.step)}
            />
          </Tooltip>
        </Flex>
      }
    >
      <div className="pdf-viewer__viewport" ref={viewportRef}>
        <Document
          file={file}
          loading={<LoadingState />}
          error={<Alert showIcon type="error" title={messages.documents.loadError} />}
          onLoadSuccess={({ numPages }) => {
            setPageCount(numPages)
            setPage(1)
          }}
        >
          {pageCount > 0 && (
            <div className="pdf-viewer__pages">
              {Array.from({ length: pageCount }, (_, index) => (
                <div className="pdf-viewer__page" data-page={index + 1} key={index + 1}>
                  <Page
                    pageNumber={index + 1}
                    width={pageWidth * zoom}
                    loading={<LoadingState />}
                  />
                </div>
              ))}
            </div>
          )}
        </Document>
      </div>
    </Card>
  )
}
