import { Spin, Typography } from 'antd'
import { useMessages } from '@/i18n/messages'
import './RouteLoading.css'

interface RouteLoadingProps {
  fullPage?: boolean
}

export function RouteLoading({ fullPage = false }: RouteLoadingProps) {
  const messages = useMessages()

  return (
    <output
      className={`route-loading${fullPage ? ' route-loading--full-page' : ''}`}
      aria-live="polite"
    >
      <Spin size="large" />
      <Typography.Text type="secondary">{messages.common.loadingPage}</Typography.Text>
    </output>
  )
}
