import { CheckOutlined } from '@ant-design/icons'
import type { DeliveryStatus } from '@/features/chat/types'
import { useMessages } from '@/i18n/messages'

/** One tick once sent, two once delivered, and two in the accent colour once read. */
export function DeliveryTicks({ status = 'sent' }: { status?: DeliveryStatus }) {
  const messages = useMessages()

  return (
    <span className={`chat-ticks chat-ticks--${status}`}>
      <CheckOutlined aria-label={messages.chat[status]} />
      {status !== 'sent' && <CheckOutlined aria-hidden="true" />}
    </span>
  )
}
