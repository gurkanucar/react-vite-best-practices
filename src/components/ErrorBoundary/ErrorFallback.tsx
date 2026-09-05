import { Button, Result, Space, Typography } from 'antd'
import { env } from '@/config/env'

interface ErrorFallbackProps {
  error: Error
  onRetry: () => void
}

export function ErrorFallback({ error, onRetry }: ErrorFallbackProps) {
  return (
    <main role="alert">
      <Result
        status="error"
        title="This screen could not be loaded."
        subTitle={
          <Space orientation="vertical">
            <Typography.Text type="secondary">
              Reload the application to try again. If the problem continues, report what you were
              doing when it happened.
            </Typography.Text>
            {env.isDevelopment && (
              <details>
                <summary>Developer details</summary>
                <code>{error.message}</code>
              </details>
            )}
          </Space>
        }
        extra={
          <Button type="primary" onClick={onRetry}>
            Reload application
          </Button>
        }
      />
    </main>
  )
}
