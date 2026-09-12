import { Button, Result, Space, Typography } from 'antd'
import { env } from '@/config/env'
import { useMessages } from '@/i18n/messages'

interface ErrorFallbackProps {
  error: Error
  onRetry: () => void
}

export function ErrorFallback({ error, onRetry }: ErrorFallbackProps) {
  const messages = useMessages()

  return (
    <main role="alert">
      <Result
        status="error"
        title={messages.errorBoundary.title}
        subTitle={
          <Space orientation="vertical">
            <Typography.Text type="secondary">{messages.errorBoundary.description}</Typography.Text>
            {env.isDevelopment && (
              <details>
                <summary>{messages.errorBoundary.developerDetails}</summary>
                <code>{error.message}</code>
              </details>
            )}
          </Space>
        }
        extra={
          <Button type="primary" onClick={onRetry}>
            {messages.errorBoundary.reload}
          </Button>
        }
      />
    </main>
  )
}
