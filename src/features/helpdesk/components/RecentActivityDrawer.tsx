import { Drawer, Timeline, Typography } from 'antd'
import { timelineItems } from '@/features/helpdesk/components/historyTimeline'
import { HistoryItem } from '@/features/helpdesk/components/TicketHistory'
import { useHelpdeskText } from '@/features/helpdesk/hooks'
import { queueHistory, type Ticket } from '@/features/helpdesk/types'

interface RecentActivityDrawerProps {
  open: boolean
  onClose: () => void
  tickets: Ticket[]
  now: number
}

/** What the team has been doing lately, across every ticket, newest first. */
export function RecentActivityDrawer({ open, onClose, tickets, now }: RecentActivityDrawerProps) {
  const { text } = useHelpdeskText()
  const subjects = new Map(tickets.map((ticket) => [ticket.id, ticket.subject]))

  return (
    <Drawer open={open} onClose={onClose} title={text.recentActivity} size={440}>
      <Typography.Paragraph type="secondary">{text.recentActivityHint}</Typography.Paragraph>
      {open && (
        <Timeline
          className="helpdesk-recent"
          items={timelineItems(queueHistory(tickets, now), (entry) => (
            <HistoryItem entry={entry} ticketSubject={subjects.get(entry.ticketId)} />
          ))}
        />
      )}
    </Drawer>
  )
}
