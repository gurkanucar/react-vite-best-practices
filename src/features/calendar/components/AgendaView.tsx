import { Badge, Empty, Table, Typography, type TableColumnsType } from 'antd'
import dayjs from 'dayjs'
import { eventTimeRange, eventTitle } from '@/features/calendar/components/eventText'
import { categoryTokens, occursOn, type CalendarEvent } from '@/features/calendar/types'
import { useMessages } from '@/i18n/messages'

interface AgendaViewProps {
  days: dayjs.Dayjs[]
  events: CalendarEvent[]
  onSelectEvent: (eventId: string) => void
}

type AgendaRow =
  | { kind: 'day'; key: string; day: dayjs.Dayjs }
  | { kind: 'event'; key: string; event: CalendarEvent }

/**
 * The agenda is a headerless table: a full-width row per day that has anything on it,
 * followed by that day's events. Days with nothing are left out, which is the point of an
 * agenda — it reads as a list of what is coming, not as a grid with holes in it.
 */
export function AgendaView({ days, events, onSelectEvent }: AgendaViewProps) {
  const messages = useMessages()

  const rows: AgendaRow[] = days.flatMap((day) => {
    const iso = day.format('YYYY-MM-DD')
    const dayEvents = events
      .filter((event) => occursOn(event, iso))
      .sort((left, right) => {
        if (left.allDay !== right.allDay) return left.allDay ? -1 : 1
        return left.start.localeCompare(right.start)
      })

    if (dayEvents.length === 0) return []

    return [
      { kind: 'day' as const, key: iso, day },
      ...dayEvents.map((event) => ({ kind: 'event' as const, key: `${iso}:${event.id}`, event })),
    ]
  })

  // A day row spans the table; the event columns give up their cells to it.
  const spanDay = (row: AgendaRow) => ({ colSpan: row.kind === 'day' ? 0 : 1 })

  const columns: TableColumnsType<AgendaRow> = [
    {
      key: 'time',
      width: 160,
      onCell: (row) => ({ colSpan: row.kind === 'day' ? 3 : 1 }),
      render: (_, row) => {
        if (row.kind === 'day') {
          const isToday = row.day.isSame(dayjs(), 'day')

          return (
            <div className="calendar-agenda__day">
              <Typography.Text strong type={isToday ? undefined : 'secondary'}>
                {row.day.format('dddd')}
              </Typography.Text>
              <Typography.Text strong={isToday}>{row.day.format('D MMMM YYYY')}</Typography.Text>
            </div>
          )
        }

        return (
          <Typography.Text type="secondary">
            {row.event.allDay ? messages.calendar.allDay : eventTimeRange(row.event)}
          </Typography.Text>
        )
      },
    },
    {
      key: 'title',
      onCell: spanDay,
      render: (_, row) =>
        row.kind === 'event' && (
          <Typography.Link
            onClick={(clickEvent) => {
              // The row opens the event too; this keeps one click from opening it twice.
              clickEvent.stopPropagation()
              onSelectEvent(row.event.id)
            }}
          >
            <Badge
              color={categoryTokens[row.event.category]}
              text={eventTitle(messages, row.event)}
            />
          </Typography.Link>
        ),
    },
    {
      key: 'location',
      responsive: ['md'],
      onCell: spanDay,
      render: (_, row) =>
        row.kind === 'event' &&
        row.event.location && (
          <Typography.Text type="secondary">{row.event.location}</Typography.Text>
        ),
    },
  ]

  return (
    <Table<AgendaRow>
      className="calendar-agenda"
      showHeader={false}
      pagination={false}
      size="middle"
      rowKey="key"
      columns={columns}
      dataSource={rows}
      rowClassName={(row) => (row.kind === 'day' ? 'calendar-agenda__day-row' : '')}
      onRow={(row) =>
        row.kind === 'event'
          ? { onClick: () => onSelectEvent(row.event.id), style: { cursor: 'pointer' } }
          : {}
      }
      locale={{ emptyText: <Empty description={messages.calendar.noEvents} /> }}
    />
  )
}
