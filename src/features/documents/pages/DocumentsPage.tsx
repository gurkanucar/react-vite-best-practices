import { DownloadOutlined } from '@ant-design/icons'
import { Alert, Button, Flex } from 'antd'
import { LoadingState } from '@/components/LoadingState/LoadingState'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import { PdfViewer } from '@/features/documents/components'
import { downloadBlob, useDocumentQuery } from '@/features/documents/hooks'
import { SAMPLE_DOCUMENT_PATH } from '@/features/documents/types'
import { useMessages } from '@/i18n/messages'

export function DocumentsPage() {
  const messages = useMessages()
  const documentQuery = useDocumentQuery(SAMPLE_DOCUMENT_PATH)

  return (
    <div className="admin-page">
      <PageHeader
        title={messages.documents.title}
        // Commented out rather than deleted: available, just not worth the space on this screen.
        // description={messages.documents.description}
        extra={
          documentQuery.data && (
            <Button
              icon={<DownloadOutlined aria-hidden="true" />}
              onClick={() => downloadBlob(documentQuery.data, 'sample-report.pdf')}
            >
              {messages.documents.download}
            </Button>
          )
        }
      />

      <Flex vertical gap={16}>
        <Alert showIcon type="info" title={messages.documents.notice} />

        {documentQuery.isPending && <LoadingState />}

        {documentQuery.isError && (
          <Alert
            showIcon
            type="error"
            title={messages.documents.loadError}
            description={documentQuery.error.message}
            action={
              <Button onClick={() => void documentQuery.refetch()}>
                {messages.documents.retry}
              </Button>
            }
          />
        )}

        {documentQuery.data && (
          <PdfViewer file={documentQuery.data} title={messages.documents.sampleTitle} />
        )}
      </Flex>
    </div>
  )
}
