import { Typography } from 'antd'
import dayjs from 'dayjs'
import { categoryTokens, type CalendarEvent } from '@/features/calendar/types'
import { useMessages } from '@/i18n/messages'

/** Past this many a cell shows a counter instead, so rows keep an even height. */
const MAX_VISIBLE = 3

interface MonthGridProps {
  days: dayjs.Dayjs[]
  events: CalendarEvent[]
  /** The month being shown; days either side of it are dimmed. */
  month: dayjs.Dayjs
  onSelectEvent: (eventId: string) => void
  onOpenDay: (day: dayjs.Dayjs) => void
}

export function MonthGrid({ days, events, month, onSelectEvent, onOpenDay }: MonthGridProps) {
  const messages = useMessages()
  const weekdayNames = days.slice(0, 7)

  return (
    <div className="calendar-month">
      <div className="calendar-month__header">
        {weekdayNames.map((day) => (
          <div
            key={day.toString()}
            className={`calendar-month__weekday${
              day.day() === dayjs().day() ? ' calendar-month__weekday--today' : ''
            }`}
          >
            {day.format('ddd')}
          </div>
        ))}
      </div>

      <div className="calendar-month__grid">
        {days.map((day) => {
          const dayEvents = events
            .filter((event) => dayjs(event.start).isSame(day, 'day'))
            .sort((left, right) => {
              if (left.allDay !== right.allDay) return left.allDay ? -1 : 1
              return left.start.localeCompare(right.start)
            })
          const hidden = dayEvents.length - MAX_VISIBLE

          return (
            <div
              key={day.toString()}
              className={[
                'calendar-month__cell',
                day.isSame(month, 'month') ? '' : 'calendar-month__cell--outside',
                day.isSame(dayjs(), 'day') ? 'calendar-month__cell--today' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <button
                type="button"
                className="calendar-month__daynumber"
                onClick={() => onOpenDay(day)}
                aria-label={day.format('D MMMM YYYY')}
              >
                {day.date()}
              </button>

              {dayEvents.slice(0, MAX_VISIBLE).map((event) => (
                <button
                  key={event.id}
                  type="button"
                  className={`calendar-chip${event.allDay ? ' calendar-chip--allday' : ''}`}
                  onClick={() => onSelectEvent(event.id)}
                  style={{ borderInlineStartColor: categoryTokens[event.category] }}
                >
                  {!event.allDay && (
                    <span className="calendar-chip__time">
                      {dayjs(event.start).format('HH:mm')}
                    </span>
                  )}
                  <span className="calendar-chip__title">
                    {
                      messages.calendar.events[
                        event.titleId as keyof typeof messages.calendar.events
                      ]
                    }
                  </span>
                </button>
              ))}

              {hidden > 0 && (
                <Typography.Link className="calendar-month__more" onClick={() => onOpenDay(day)}>
                  {messages.calendar.more.replace('{count}', String(hidden))}
                </Typography.Link>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
