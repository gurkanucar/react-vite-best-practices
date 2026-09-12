import dayjs from 'dayjs'
import { useEffect, useRef } from 'react'
import { EventBlock } from '@/features/calendar/components/EventBlock'
import { categoryTokens } from '@/features/calendar/types'
import {
  HOUR_HEIGHT,
  layoutAllDay,
  layoutDay,
  occursOn,
  type CalendarEvent,
} from '@/features/calendar/types'
import { useMessages } from '@/i18n/messages'

const HOURS = Array.from({ length: 24 }, (_, hour) => hour)
/** Where the grid is scrolled on open: the working day, not midnight. */
const INITIAL_HOUR = 8

interface TimeGridProps {
  days: dayjs.Dayjs[]
  events: CalendarEvent[]
  onSelectEvent: (eventId: string) => void
}

function eventsOn(events: CalendarEvent[], day: dayjs.Dayjs): CalendarEvent[] {
  return events.filter((event) => occursOn(event, day.format('YYYY-MM-DD')))
}

/** The line marking the current time, drawn only on the column that is actually today. */
function NowIndicator() {
  const now = dayjs()
  const top = ((now.hour() * 60 + now.minute()) / 60) * HOUR_HEIGHT

  return <div className="calendar-now" style={{ top }} aria-hidden="true" />
}

export function TimeGrid({ days, events, onSelectEvent }: TimeGridProps) {
  const messages = useMessages()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Opening at midnight would show an empty grid and hide the whole working day. The
    // 8px back off the top is the overhang of the hour label, which sits on its line.
    // Assigning `scrollTop` rather than calling `scrollTo` keeps this working wherever
    // the method is missing, jsdom included.
    if (scrollRef.current) {
      scrollRef.current.scrollTop = INITIAL_HOUR * HOUR_HEIGHT - 8
    }
  }, [])

  const visibleDays = days.map((day) => day.format('YYYY-MM-DD'))
  const allDayBands = layoutAllDay(events, visibleDays)
  const allDayLanes = allDayBands.reduce((count, band) => Math.max(count, band.lane + 1), 0)

  return (
    <div className="calendar-timegrid">
      <div
        className="calendar-timegrid__header"
        style={{ '--day-count': days.length } as React.CSSProperties}
      >
        <div className="calendar-timegrid__gutter" />
        {days.map((day) => (
          <div
            key={day.toString()}
            className={`calendar-daycol${day.isSame(dayjs(), 'day') ? ' calendar-daycol--today' : ''}`}
          >
            <span className="calendar-daycol__weekday">{day.format('ddd')}</span>
            <span className="calendar-daycol__date">{day.format('D')}</span>
          </div>
        ))}
      </div>

      {allDayBands.length > 0 && (
        <div className="calendar-timegrid__allday">
          <div className="calendar-timegrid__gutter">{messages.calendar.allDay}</div>

          {/*
           * A band is one element spanning the columns it covers, rather than one chip per
           * day, so a week-long event reads as a single bar. The day cells behind it span
           * every lane so the column rules stay unbroken.
           */}
          <div
            className="calendar-allday-track"
            style={
              { '--day-count': days.length, '--lane-count': allDayLanes } as React.CSSProperties
            }
          >
            {days.map((day, index) => (
              <div
                key={day.toString()}
                className="calendar-allday-cell"
                style={{ gridColumn: index + 1, gridRow: '1 / -1' }}
              />
            ))}

            {allDayBands.map((band) => (
              <button
                key={band.event.id}
                type="button"
                className="calendar-chip calendar-chip--allday"
                onClick={() => onSelectEvent(band.event.id)}
                style={{
                  gridColumn: `${band.from + 1} / span ${band.span}`,
                  gridRow: band.lane + 1,
                  borderInlineStartColor: categoryTokens[band.event.category],
                }}
              >
                {
                  messages.calendar.events[
                    band.event.titleId as keyof typeof messages.calendar.events
                  ]
                }
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="calendar-timegrid__body" ref={scrollRef}>
        <div
          className="calendar-timegrid__canvas"
          style={
            {
              '--day-count': days.length,
              '--hour-height': `${HOUR_HEIGHT}px`,
              height: HOUR_HEIGHT * 24,
            } as React.CSSProperties
          }
        >
          <div className="calendar-timegrid__gutter calendar-timegrid__hours">
            {HOURS.map((hour) => (
              <div key={hour} className="calendar-hour-label">
                <span>{dayjs().hour(hour).minute(0).format('HH:mm')}</span>
              </div>
            ))}
          </div>

          {days.map((day) => (
            <div
              key={day.toString()}
              className={`calendar-daycolumn${day.isSame(dayjs(), 'day') ? ' calendar-daycolumn--today' : ''}`}
            >
              {HOURS.map((hour) => (
                <div key={hour} className="calendar-hour-slot" />
              ))}

              {layoutDay(eventsOn(events, day)).map((positioned) => (
                <EventBlock
                  key={positioned.event.id}
                  positioned={positioned}
                  onSelect={onSelectEvent}
                />
              ))}

              {day.isSame(dayjs(), 'day') && <NowIndicator />}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
