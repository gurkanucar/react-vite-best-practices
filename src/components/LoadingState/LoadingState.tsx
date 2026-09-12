import { Spin, Typography } from 'antd'
import { useMessages } from '@/i18n/messages'
import './LoadingState.css'

export function LoadingState() {
  const messages = useMessages()

  return (
    <output className="loading-state" aria-live="polite">
      <Spin />
      <Typography.Text>{messages.common.loadingPage}</Typography.Text>
    </output>
  )
}
