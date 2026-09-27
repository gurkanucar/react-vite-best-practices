import { PaperClipOutlined } from '@ant-design/icons'
import { Button, Divider, Empty, Flex, Segmented, Timeline, Typography } from 'antd'
import dayjs from 'dayjs'
import { useState } from 'react'
import { Link } from 'react-router'
import { describeChange } from '@/features/helpdesk/components/activityText'
import { timelineItems } from '@/features/helpdesk/components/historyTimeline'
import { PriorityTag, StatusTag } from '@/features/helpdesk/components/TicketTags'
import { useHelpdeskText } from '@/features/helpdesk/hooks'
import {
  filterHistory,
  formatDuration,
  groupByDay,
  HISTORY_FILTERS,
  historyCounts,
  ticketHistory,
  type HistoryEntry,
  type HistoryFilter,
  type Ticket,
  type TicketPriority,
  type TicketStatus,
} from '@/features/helpdesk/types'

interface HistoryItemProps {
  entry: HistoryEntry
  /** When the ticket was opened, for the "2h after opening" offset. */
  openedAt?: string
  /** Set in the queue-wide feed, where every entry needs to say which ticket it is about. */
  ticketSubject?: string
  onShowMessage?: (messageId: string) => void
}

/** The words of one entry. A status or priority change shows both values as their tags. */
export function HistoryItem({ entry, openedAt, ticketSubject, onShowMessage }: HistoryItemProps) {
  const { text, language } = useHelpdeskText()
  const actor = entry.actorName ?? ''

  const headline = () => {
    if (entry.group === 'sla') return text.historySla[entry.kind as keyof typeof text.historySla]
    if (entry.group === 'message') {
      return text.historyMessage[entry.kind as keyof typeof text.historyMessage](actor)
    }
    return describeChange(text, {
      kind: entry.kind as Parameters<typeof describeChange>[1]['kind'],
      actorName: actor,
      from: entry.from,
      to: entry.to,
    })
  }

  const offset = openedAt ? Math.round((Date.parse(entry.at) - Date.parse(openedAt)) / 60_000) : 0

  return (
    <div className={`helpdesk-history-item helpdesk-history-item--${entry.group}`}>
      <Typography.Text strong={entry.group !== 'change'}>{headline()}</Typography.Text>

      {entry.kind === 'status' && entry.from && entry.to && (
        <Flex align="center" gap={6} className="helpdesk-history-item__change">
          <StatusTag status={entry.from as TicketStatus} />
          <span aria-hidden="true">→</span>
          <StatusTag status={entry.to as TicketStatus} />
        </Flex>
      )}
      {entry.kind === 'priority' && entry.from && entry.to && (
        <Flex align="center" gap={6} className="helpdesk-history-item__change">
          <PriorityTag priority={entry.from as TicketPriority} />
          <span aria-hidden="true">→</span>
          <PriorityTag priority={entry.to as TicketPriority} />
        </Flex>
      )}

      {entry.body && (
        <Typography.Paragraph
          type="secondary"
          ellipsis={{ rows: 2 }}
          className="helpdesk-history-item__excerpt"
        >
          {entry.body}
        </Typography.Paragraph>
      )}

      <Flex align="center" gap={8} wrap className="helpdesk-history-item__meta">
        <Typography.Text type="secondary">
          <time dateTime={entry.at}>
            {dayjs(entry.at).format(ticketSubject ? 'D MMM, HH:mm' : 'HH:mm')}
          </time>
          {openedAt &&
            ` · ${offset <= 0 ? text.atOpening : text.afterOpening(formatDuration(offset, language))}`}
        </Typography.Text>
        {entry.attachments && entry.attachments.length > 0 && (
          <Typography.Text type="secondary">
            <PaperClipOutlined aria-hidden="true" /> {entry.attachments.length}
          </Typography.Text>
        )}
        {ticketSubject && (
          <Link to={`/helpdesk/${entry.ticketId}`} className="helpdesk-history-item__ticket">
            #{entry.ticketId} {ticketSubject}
          </Link>
        )}
        {entry.messageId && onShowMessage && (
          <Button
            type="link"
            size="small"
            className="helpdesk-history-item__jump"
            onClick={() => onShowMessage(entry.messageId!)}
          >
            {text.showInConversation}
          </Button>
        )}
      </Flex>
    </div>
  )
}

interface TicketHistoryProps {
  ticket: Ticket
  now: number
  onShowMessage: (messageId: string) => void
}

/**
 * The ticket's whole life on one line: messages, property changes and the SLA deadlines it
 * met or missed, grouped by day, filterable by kind and readable in either direction.
 */
export function TicketHistory({ ticket, now, onShowMessage }: TicketHistoryProps) {
  const { text } = useHelpdeskText()
  const [filter, setFilter] = useState<HistoryFilter>('all')
  const [newestFirst, setNewestFirst] = useState(false)

  const history = ticketHistory(ticket, now)
  const counts = historyCounts(history)
  const shown = filterHistory(history, filter)
  const ordered = newestFirst ? [...shown].reverse() : shown

  const dayLabel = (day: string) => {
    const date = dayjs(day)
    if (date.isSame(dayjs(now), 'day')) return text.today
    if (date.isSame(dayjs(now).subtract(1, 'day'), 'day')) return text.yesterday
    return date.format('dddd, D MMMM YYYY')
  }

  return (
    <div className="helpdesk-history-panel">
      <Flex justify="space-between" align="center" gap={12} wrap>
        <div className="helpdesk-history-filters">
          <Segmented<HistoryFilter>
            value={filter}
            onChange={setFilter}
            options={HISTORY_FILTERS.map((option) => ({
              value: option,
              label: `${text.historyFilters[option]} (${counts[option]})`,
            }))}
          />
        </div>
        <Segmented<'oldest' | 'newest'>
          value={newestFirst ? 'newest' : 'oldest'}
          onChange={(value) => setNewestFirst(value === 'newest')}
          options={[
            { value: 'oldest', label: text.oldestFirst },
            { value: 'newest', label: text.newestFirst },
          ]}
        />
      </Flex>

      {ordered.length === 0 ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={text.historyEmpty} />
      ) : (
        groupByDay(ordered).map((group) => (
          <section key={group.day} className="helpdesk-history-day">
            <Divider titlePlacement="start" plain>
              {dayLabel(group.day)}
            </Divider>
            <Timeline
              items={timelineItems(group.entries, (entry) => (
                <HistoryItem
                  entry={entry}
                  openedAt={ticket.createdAt}
                  onShowMessage={onShowMessage}
                />
              ))}
            />
          </section>
        ))
      )}
    </div>
  )
}
