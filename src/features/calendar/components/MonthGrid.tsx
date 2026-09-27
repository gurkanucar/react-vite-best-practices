import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { Flex, Grid, Popover, Typography } from 'antd'
import dayjs from 'dayjs'
import { useRef, useState, type CSSProperties } from 'react'
import { eventTimeRange, eventTitle } from '@/features/calendar/components/eventText'
import {
  categoryTokens,
  isoDate,
  layoutAllDay,
  moveEvent,
  occursOn,
  type AllDayBand,
  type CalendarEvent,
  type EventChange,
} from '@/features/calendar/types'
import { useMessages } from '@/i18n/messages'

/** Rows a cell gives to events, bands included, before the rest fold into "+N more". */
const MAX_ROWS = 4

interface MonthGridProps {
  days: dayjs.Dayjs[]
  events: CalendarEvent[]
  /** The month being shown; days either side of it are dimmed. */
  month: dayjs.Dayjs
  onSelectEvent: (eventId: string) => void
  onOpenDay: (day: dayjs.Dayjs) => void
  /** Drag a timed event onto another day; off on touch screens. */
  interactive: boolean
  onChangeEvent: (event: CalendarEvent, change: EventChange) => void
}

function sortForDay(events: CalendarEvent[]): CalendarEvent[] {
  return [...events].sort((left, right) => {
    if (left.allDay !== right.allDay) return left.allDay ? -1 : 1
    return left.start.localeCompare(right.start)
  })
}

function EventChip({
  event,
  onSelect,
  overlay,
}: {
  event: CalendarEvent
  onSelect?: (eventId: string) => void
  overlay?: boolean
}) {
  const messages = useMessages()

  return (
    <button
      type="button"
      className={`calendar-chip${overlay ? ' calendar-chip--overlay' : ''}`}
      style={{ '--event-color': categoryTokens[event.category] } as CSSProperties}
      onClick={onSelect ? () => onSelect(event.id) : undefined}
    >
      {!event.allDay && (
        <span className="calendar-chip__time">{dayjs(event.start).format('HH:mm')}</span>
      )}
      <span className="calendar-chip__title">{eventTitle(messages, event)}</span>
    </button>
  )
}

function DraggableChip({
  event,
  onSelect,
  interactive,
}: {
  event: CalendarEvent
  onSelect: (eventId: string) => void
  interactive: boolean
}) {
  const { setNodeRef, listeners, attributes, isDragging } = useDraggable({
    id: event.id,
    data: { event },
    disabled: !interactive,
  })

  return (
    <div
      ref={setNodeRef}
      className={`calendar-chip-slot${isDragging ? ' calendar-chip-slot--dragging' : ''}`}
      {...(interactive ? listeners : {})}
      {...(interactive ? attributes : {})}
      // The wrapper carries the drag; the chip inside stays the button that is focused.
      tabIndex={-1}
      role="presentation"
    >
      <EventChip event={event} onSelect={onSelect} />
    </div>
  )
}

function MoreLink({
  day,
  events,
  hidden,
  onSelectEvent,
}: {
  day: dayjs.Dayjs
  events: CalendarEvent[]
  hidden: number
  onSelectEvent: (eventId: string) => void
}) {
  const messages = useMessages()
  const [open, setOpen] = useState(false)
  // A phone's month cell is too narrow for the words; the count alone still reads.
  const wide = Grid.useBreakpoint().md ?? false

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      trigger="click"
      title={day.format('dddd, D MMMM')}
      content={
        <Flex vertical gap={4} className="calendar-popover-list">
          {events.map((event) => (
            <EventChip
              key={event.id}
              event={event}
              onSelect={(eventId) => {
                setOpen(false)
                onSelectEvent(eventId)
              }}
            />
          ))}
        </Flex>
      }
    >
      <Typography.Link className="calendar-month__more">
        {wide ? messages.calendar.more.replace('{count}', String(hidden)) : `+${hidden}`}
      </Typography.Link>
    </Popover>
  )
}

function DayCell({
  day,
  month,
  weekLanes,
  dayEvents,
  onSelectEvent,
  onOpenDay,
  interactive,
}: {
  day: dayjs.Dayjs
  month: dayjs.Dayjs
  weekLanes: number
  dayEvents: CalendarEvent[]
  onSelectEvent: (eventId: string) => void
  onOpenDay: (day: dayjs.Dayjs) => void
  interactive: boolean
}) {
  const { setNodeRef, isOver } = useDroppable({ id: day.format('YYYY-MM-DD') })
  const timed = dayEvents.filter((event) => !event.allDay)
  /*
   * The week's bands take their rows in every cell, so the chips line up under them; the
   * timed events get what is left. When they do not all fit, the "+N more" link needs a
   * row of its own, which is why one fewer chip is shown than there is room for.
   */
  const room = Math.max(MAX_ROWS - weekLanes, 0)
  const shown = timed.length <= room ? timed : timed.slice(0, Math.max(room - 1, 0))
  const hidden = timed.length - shown.length
  const weekend = day.day() === 0 || day.day() === 6

  return (
    <div
      ref={setNodeRef}
      className={[
        'calendar-month__cell',
        weekend && 'calendar-month__cell--weekend',
        !day.isSame(month, 'month') && 'calendar-month__cell--outside',
        day.isSame(dayjs(), 'day') && 'calendar-month__cell--today',
        isOver && 'calendar-month__cell--over',
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

      {/* Holds the rows the week's bands are drawn over, so the chips start below them. */}
      <div className="calendar-month__band-space" style={{ height: weekLanes * 24 }} />

      {shown.map((event) => (
        <DraggableChip
          key={event.id}
          event={event}
          onSelect={onSelectEvent}
          interactive={interactive}
        />
      ))}

      {hidden > 0 && (
        <MoreLink day={day} events={dayEvents} hidden={hidden} onSelectEvent={onSelectEvent} />
      )}
    </div>
  )
}

function WeekRow({
  week,
  month,
  events,
  onSelectEvent,
  onOpenDay,
  interactive,
}: {
  week: dayjs.Dayjs[]
  month: dayjs.Dayjs
  events: CalendarEvent[]
  onSelectEvent: (eventId: string) => void
  onOpenDay: (day: dayjs.Dayjs) => void
  interactive: boolean
}) {
  const messages = useMessages()
  const isoDays = week.map((day) => day.format('YYYY-MM-DD'))
  const bands: AllDayBand[] = layoutAllDay(events, isoDays)
  const lanes = bands.reduce((count, band) => Math.max(count, band.lane + 1), 0)

  return (
    <div className="calendar-month__week">
      {week.map((day, index) => {
        const iso = isoDays[index]!

        return (
          <DayCell
            key={iso}
            day={day}
            month={month}
            weekLanes={lanes}
            dayEvents={sortForDay(events.filter((event) => occursOn(event, iso)))}
            onSelectEvent={onSelectEvent}
            onOpenDay={onOpenDay}
            interactive={interactive}
          />
        )
      })}

      {/*
       * An all-day event is one bar across the days it covers, laid over the cells of its
       * week, rather than a chip repeated in every one of them.
       */}
      {bands.length > 0 && (
        <div className="calendar-month__bands" aria-label={messages.calendar.allDay}>
          {bands.map((band) => (
            <button
              key={band.event.id}
              type="button"
              className="calendar-chip calendar-chip--band"
              onClick={() => onSelectEvent(band.event.id)}
              style={
                {
                  gridColumn: `${band.from + 1} / span ${band.span}`,
                  gridRow: band.lane + 1,
                  '--event-color': categoryTokens[band.event.category],
                } as CSSProperties
              }
            >
              <span className="calendar-chip__title">{eventTitle(messages, band.event)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function MonthGrid({
  days,
  events,
  month,
  onSelectEvent,
  onOpenDay,
  interactive,
  onChangeEvent,
}: MonthGridProps) {
  const [dragged, setDragged] = useState<CalendarEvent | null>(null)
  const suppressClick = useRef(false)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }))
  const weeks = Array.from({ length: days.length / 7 }, (_, index) =>
    days.slice(index * 7, index * 7 + 7),
  )

  const handleDragStart = ({ active }: DragStartEvent) => {
    setDragged((active.data.current as { event: CalendarEvent }).event)
  }

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    const { event } = active.data.current as { event: CalendarEvent }

    setDragged(null)
    suppressClick.current = true
    window.setTimeout(() => {
      suppressClick.current = false
    }, 0)

    if (!over) return

    const dayShift = dayjs(String(over.id)).diff(dayjs(isoDate(event.start)), 'day')

    // The time of day is kept; only the date changes.
    if (dayShift !== 0) onChangeEvent(event, moveEvent(event, dayShift, 0))
  }

  const select = (eventId: string) => {
    if (!suppressClick.current) onSelectEvent(eventId)
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setDragged(null)}
    >
      <div className="calendar-month">
        <div className="calendar-month__header">
          {weeks[0]?.map((day) => (
            <Typography.Text
              key={day.toString()}
              type="secondary"
              className="calendar-month__weekday"
            >
              {day.format('ddd')}
            </Typography.Text>
          ))}
        </div>

        <div className="calendar-month__grid">
          {weeks.map((week) => (
            <WeekRow
              key={week[0]!.toString()}
              week={week}
              month={month}
              events={events}
              onSelectEvent={select}
              onOpenDay={onOpenDay}
              interactive={interactive}
            />
          ))}
        </div>
      </div>

      <DragOverlay dropAnimation={null}>
        {dragged && (
          <div className="calendar-chip-drag" title={eventTimeRange(dragged)}>
            <EventChip event={dragged} overlay />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
