import { Tooltip } from 'antd'
import dayjs from 'dayjs'
import { categoryTokens, HOUR_HEIGHT, type PositionedEvent } from '@/features/calendar/types'
import { useMessages } from '@/i18n/messages'

interface EventBlockProps {
  positioned: PositionedEvent
  onSelect: (eventId: string) => void
}

export function EventBlock({ positioned, onSelect }: EventBlockProps) {
  const messages = useMessages()
  const { event, startMinutes, endMinutes, lane, lanes } = positioned
  const title = messages.calendar.events[event.titleId as keyof typeof messages.calendar.events]
  const time = `${dayjs(event.start).format('HH:mm')} – ${dayjs(event.end).format('HH:mm')}`

  return (
    <Tooltip title={`${title} · ${time}`}>
      <button
        type="button"
        className="calendar-event"
        onClick={() => onSelect(event.id)}
        style={{
          top: (startMinutes / 60) * HOUR_HEIGHT,
          height: ((endMinutes - startMinutes) / 60) * HOUR_HEIGHT - 2,
          // Overlapping events divide the column between them. The 2% inset keeps a
          // visible seam so two adjacent blocks do not read as one.
          left: `calc(${(lane / lanes) * 100}% + 2px)`,
          width: `calc(${(1 / lanes) * 100}% - 4px)`,
          borderInlineStartColor: categoryTokens[event.category],
        }}
      >
        <span className="calendar-event__title">{title}</span>
        <span className="calendar-event__time">{time}</span>
      </button>
    </Tooltip>
  )
}
