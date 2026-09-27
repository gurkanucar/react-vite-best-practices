import { Tag } from 'antd'
import { PRIORITY_COLOR, STATUS_COLOR } from '@/features/helpdesk/components/ticketStyle'
import { useHelpdeskText } from '@/features/helpdesk/hooks'
import type { TicketPriority, TicketStatus } from '@/features/helpdesk/types'

export function StatusTag({ status }: { status: TicketStatus }) {
  const { text } = useHelpdeskText()
  return (
    <Tag color={STATUS_COLOR[status]} variant="filled" className="helpdesk-tag">
      {text.statuses[status]}
    </Tag>
  )
}

export function PriorityTag({ priority }: { priority: TicketPriority }) {
  const { text } = useHelpdeskText()
  return (
    <Tag color={PRIORITY_COLOR[priority]} variant="outlined" className="helpdesk-tag">
      <span
        className={`helpdesk-priority-dot helpdesk-priority-dot--${priority}`}
        aria-hidden="true"
      />
      {text.priorities[priority]}
    </Tag>
  )
}
