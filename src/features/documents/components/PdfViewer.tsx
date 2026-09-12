import { LeftOutlined, RightOutlined, ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons'
import { Alert, Button, Card, Flex, Tooltip, Typography } from 'antd'
import { useRef, useState } from 'react'
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
  const scrollRef = useRef<HTMLDivElement>(null)
  const [pageCount, setPageCount] = useState(0)
  const [page, setPage] = useState(1)
  const [zoom, setZoom] = useState(1)
  const [loadFailed, setLoadFailed] = useState(false)

  // Every page is rendered into one scrolling column, so the reader scrolls freely and
  // the controls only jump to a page rather than being the only way to reach it.
  const scrollToPage = (target: number) => {
    const nextPage = Math.min(Math.max(target, 1), pageCount || 1)
    scrollRef.current
      ?.querySelector(`[data-page="${nextPage}"]`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setPage(nextPage)
  }

  // The indicator follows the scroll position: the current page is the last one whose
  // top edge has passed the top of the viewport.
  const trackVisiblePage = () => {
    const container = scrollRef.current
    if (!container) return

    const pages = [...container.querySelectorAll<HTMLElement>('[data-page]')]
    const containerTop = container.getBoundingClientRect().top
    const visible = pages.findLast(
      (element) => element.getBoundingClientRect().top <= containerTop + 8,
    )

    setPage(visible ? Number(visible.dataset.page) : 1)
  }

  const changeZoom = (delta: number) =>
    setZoom((current) =>
      Math.min(Math.max(Number((current + delta).toFixed(2)), PDF_ZOOM.min), PDF_ZOOM.max),
    )

  if (loadFailed) {
    return <Alert showIcon type="error" title={messages.documents.loadError} />
  }

  return (
    <Card
      className="pdf-viewer"
      title={title}
      extra={
        <Flex align="center" gap={8} wrap>
          <Tooltip title={messages.documents.previousPage}>
            <Button
              aria-label={messages.documents.previousPage}
              disabled={page <= 1}
              icon={<LeftOutlined aria-hidden="true" />}
              onClick={() => scrollToPage(page - 1)}
            />
          </Tooltip>
          <Typography.Text aria-live="polite">
            {messages.documents.pageOf
              .replace('{page}', String(page))
              .replace('{total}', String(pageCount || 1))}
          </Typography.Text>
          <Tooltip title={messages.documents.nextPage}>
            <Button
              aria-label={messages.documents.nextPage}
              disabled={page >= pageCount}
              icon={<RightOutlined aria-hidden="true" />}
              onClick={() => scrollToPage(page + 1)}
            />
          </Tooltip>

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
      <div className="pdf-viewer__scroll" ref={scrollRef} onScroll={trackVisiblePage}>
        <Document
          file={file}
          loading={<LoadingState />}
          error={<Alert showIcon type="error" title={messages.documents.loadError} />}
          onLoadSuccess={({ numPages }) => setPageCount(numPages)}
          onLoadError={() => setLoadFailed(true)}
        >
          {Array.from({ length: pageCount }, (_, index) => (
            <div className="pdf-viewer__page" data-page={index + 1} key={index + 1}>
              <Page pageNumber={index + 1} scale={zoom} loading={<LoadingState />} />
            </div>
          ))}
        </Document>
      </div>
    </Card>
  )
}
