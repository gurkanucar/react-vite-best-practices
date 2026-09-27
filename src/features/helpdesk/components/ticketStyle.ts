import type { TicketPriority, TicketStatus } from '@/features/helpdesk/types'

/** antd preset colours, so a status reads the same in the table, the header and the timeline. */
export const STATUS_COLOR: Record<TicketStatus, string> = {
  open: 'blue',
  pending: 'gold',
  onHold: 'purple',
  resolved: 'green',
  closed: 'default',
}

export const PRIORITY_COLOR: Record<TicketPriority, string> = {
  urgent: 'red',
  high: 'orange',
  normal: 'blue',
  low: 'default',
}
