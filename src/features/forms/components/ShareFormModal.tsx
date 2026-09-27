import { CopyOutlined, DownloadOutlined, ExportOutlined } from '@ant-design/icons'
import { Alert, App, Button, Flex, Input, Modal, QRCode, Space, Typography } from 'antd'
import { useRef } from 'react'
import { useFormCopy } from '@/features/forms/hooks'
import { exportFileName, publicFormPath, type FormSchema } from '@/features/forms/types'

interface ShareFormModalProps {
  /** `null` keeps the modal closed. */
  form: FormSchema | null
  onClose: () => void
}

/**
 * The link people answer on, three ways: to paste, to open, and as a QR code for a poster.
 * The link is absolute, because it is meant to leave this app.
 */
export function ShareFormModal({ form, onClose }: ShareFormModalProps) {
  const copy = useFormCopy()
  const { message } = App.useApp()
  const qrRef = useRef<HTMLDivElement>(null)
  const path = form ? publicFormPath(form.id) : ''
  const url = `${window.location.origin}${path}`

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      void message.success(copy.linkCopied)
    } catch {
      // Clipboard access needs a secure context and permission; the field stays selectable.
      void message.warning(copy.copyFailed)
    }
  }

  const downloadQr = () => {
    const canvas = qrRef.current?.querySelector('canvas')
    if (!canvas || !form) return
    const link = document.createElement('a')
    link.href = canvas.toDataURL('image/png')
    link.download = `${exportFileName(form.title)}-qr.png`
    link.click()
  }

  return (
    <Modal open={form !== null} onCancel={onClose} footer={null} title={copy.shareTitle}>
      {form && (
        <Flex vertical gap={16}>
          <Typography.Text type="secondary">{copy.shareDescription}</Typography.Text>

          {form.status !== 'published' && (
            <Alert
              type="warning"
              showIcon
              title={form.status === 'draft' ? copy.shareDraft : copy.shareClosed}
            />
          )}

          <div>
            <Typography.Text strong>{copy.publicLink}</Typography.Text>
            <Space.Compact block className="form-share__link">
              <Input
                readOnly
                value={url}
                aria-label={copy.publicLink}
                onFocus={(event) => event.target.select()}
              />
              <Button icon={<CopyOutlined aria-hidden="true" />} onClick={() => void copyLink()}>
                {copy.copyLink}
              </Button>
            </Space.Compact>
            <Button
              type="link"
              href={path}
              target="_blank"
              rel="noreferrer"
              icon={<ExportOutlined aria-hidden="true" />}
              className="form-share__open"
            >
              {copy.openPublic}
            </Button>
          </div>

          <Flex gap={16} align="center" wrap className="form-share__qr">
            <div ref={qrRef}>
              <QRCode value={url} size={148} bordered={false} type="canvas" />
            </div>
            <Flex vertical gap={8} className="form-share__qr-text">
              <Typography.Text strong>{copy.qrCode}</Typography.Text>
              <Typography.Text type="secondary">{copy.qrHint}</Typography.Text>
              <div>
                <Button icon={<DownloadOutlined aria-hidden="true" />} onClick={downloadQr}>
                  {copy.downloadQr}
                </Button>
              </div>
            </Flex>
          </Flex>
        </Flex>
      )}
    </Modal>
  )
}
