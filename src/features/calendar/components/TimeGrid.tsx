import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragMoveEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { Button, Flex, Popover, Typography } from 'antd'
import dayjs from 'dayjs'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { EventBlock, OVERFLOW_RESERVE } from '@/features/calendar/components/EventBlock'
import { eventTimeRange, eventTitle } from '@/features/calendar/components/eventText'
import {
  categoryTokens,
  HOUR_HEIGHT,
  layoutAllDay,
  layoutDay,
  limitLanes,
  moveEvent,
  occursOn,
  resizeEvent,
  snapMinutes,
  type CalendarEvent,
  type EventChange,
  type HiddenCluster,
} from '@/features/calendar/types'
import { useMessages } from '@/i18n/messages'

const HOURS = Array.from({ length: 24 }, (_, hour) => hour)
/** Where the grid is scrolled on open: the working day, not midnight. */
const INITIAL_HOUR = 8
/**
 * How many overlapping events sit side by side before the rest fold behind "+N". A week
 * column is narrow; a single day has the whole width, so it can show many more.
 */
const MAX_LANES = { week: 2, day: 6 }

interface TimeGridProps {
  days: dayjs.Dayjs[]
  events: CalendarEvent[]
  onSelectEvent: (eventId: string) => void
  /** Drag to move and drag the bottom edge to resize; off on touch screens. */
  interactive: boolean
  onChangeEvent: (event: CalendarEvent, change: EventChange) => void
}

interface DragState {
  kind: 'move' | 'resize'
  event: CalendarEvent
  change: EventChange
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

function HiddenMarker({
  cluster,
  onSelectEvent,
}: {
  cluster: HiddenCluster
  onSelectEvent: (eventId: string) => void
}) {
  const messages = useMessages()
  const [open, setOpen] = useState(false)
  const count = cluster.events.length

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      trigger="click"
      content={
        <Flex vertical gap={4} className="calendar-popover-list">
          {cluster.events.map((event) => (
            <button
              key={event.id}
              type="button"
              className="calendar-chip"
              style={{ '--event-color': categoryTokens[event.category] } as CSSProperties}
              onClick={() => {
                setOpen(false)
                onSelectEvent(event.id)
              }}
            >
              <span className="calendar-chip__time">{eventTimeRange(event)}</span>
              <span className="calendar-chip__title">{eventTitle(messages, event)}</span>
            </button>
          ))}
        </Flex>
      }
    >
      <Button
        size="small"
        className="calendar-hidden-marker"
        aria-label={messages.calendar.hiddenEvents.replace('{count}', String(count))}
        style={{
          top: (cluster.startMinutes / 60) * HOUR_HEIGHT,
          width: OVERFLOW_RESERVE - 4,
        }}
      >
        +{count}
      </Button>
    </Popover>
  )
}

export function TimeGrid({
  days,
  events,
  onSelectEvent,
  interactive,
  onChangeEvent,
}: TimeGridProps) {
  const messages = useMessages()
  const scrollRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const columnWidth = useRef(0)
  // The click that ends a drag should not also open the event.
  const suppressClick = useRef(false)
  const [drag, setDrag] = useState<DragState | null>(null)
  // A few pixels of travel before a press becomes a drag, so a click still opens the event.
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }))

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
  const maxLanes = days.length === 1 ? MAX_LANES.day : MAX_LANES.week

  const changeFor = (dragged: CalendarEvent, deltaX: number, deltaY: number) => {
    // Whole columns sideways, clamped to the days on screen.
    const fromIndex = visibleDays.indexOf(dragged.start.slice(0, 10))
    const width = columnWidth.current || 1
    const toIndex = Math.min(Math.max(fromIndex + Math.round(deltaX / width), 0), days.length - 1)

    return moveEvent(dragged, toIndex - fromIndex, snapMinutes(deltaY))
  }

  const handleDragStart = ({ active }: DragStartEvent) => {
    const column = canvasRef.current?.querySelector('.calendar-daycolumn')
    columnWidth.current = column?.getBoundingClientRect().width ?? 0

    const { event } = active.data.current as { event: CalendarEvent }
    setDrag({ kind: 'move', event, change: { start: event.start, end: event.end } })
  }

  const handleDragMove = ({ active, delta }: DragMoveEvent) => {
    const { event } = active.data.current as { event: CalendarEvent }
    const change = changeFor(event, delta.x, delta.y)

    setDrag((current) =>
      current && current.change.start === change.start && current.change.end === change.end
        ? current
        : { kind: 'move', event, change },
    )
  }

  const handleDragEnd = ({ active, delta }: DragEndEvent) => {
    const { event } = active.data.current as { event: CalendarEvent }
    const change = changeFor(event, delta.x, delta.y)

    setDrag(null)
    suppressClick.current = true
    // Released before the click that follows pointerup is dispatched, so reset after it.
    window.setTimeout(() => {
      suppressClick.current = false
    }, 0)

    if (change.start !== event.start || change.end !== event.end) {
      onChangeEvent(event, change)
    }
  }

  const handleResize = (resized: CalendarEvent, deltaY: number, done: boolean) => {
    const change = resizeEvent(resized, snapMinutes(deltaY))

    if (!done) {
      setDrag((current) =>
        current && current.change.end === change.end
          ? current
          : { kind: 'resize', event: resized, change },
      )
      return
    }

    setDrag(null)
    if (change.end !== resized.end) onChangeEvent(resized, change)
  }

  const select = (eventId: string) => {
    if (!suppressClick.current) onSelectEvent(eventId)
  }

  // A resize is shown live on the block itself; a move leaves the original in place and
  // draws a preview where it will land.
  const displayed =
    drag?.kind === 'resize'
      ? events.map((event) => (event.id === drag.event.id ? { ...event, ...drag.change } : event))
      : events
  const ghost = drag?.kind === 'move' ? { ...drag.event, ...drag.change } : null

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setDrag(null)}
    >
      <div className={`calendar-timegrid${drag ? ' calendar-timegrid--dragging' : ''}`}>
        <div
          className="calendar-timegrid__header"
          style={{ '--day-count': days.length } as CSSProperties}
        >
          <div className="calendar-timegrid__gutter" />
          {days.map((day) => {
            const isToday = day.isSame(dayjs(), 'day')

            return (
              <div
                key={day.toString()}
                className={`calendar-daycol${isToday ? ' calendar-daycol--today' : ''}`}
              >
                <Typography.Text type={isToday ? undefined : 'secondary'}>
                  {day.format('ddd')}
                </Typography.Text>
                <span className="calendar-daycol__date">{day.format('D')}</span>
              </div>
            )
          })}
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
              style={{ '--day-count': days.length, '--lane-count': allDayLanes } as CSSProperties}
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
          </div>
        )}

        <div className="calendar-timegrid__body" ref={scrollRef}>
          <div
            ref={canvasRef}
            className="calendar-timegrid__canvas"
            style={
              {
                '--day-count': days.length,
                '--hour-height': `${HOUR_HEIGHT}px`,
                height: HOUR_HEIGHT * 24,
              } as CSSProperties
            }
          >
            <div className="calendar-timegrid__gutter calendar-timegrid__hours">
              {HOURS.map((hour) => (
                <div key={hour} className="calendar-hour-label">
                  {hour > 0 && <span>{dayjs().hour(hour).minute(0).format('HH:mm')}</span>}
                </div>
              ))}
            </div>

            {days.map((day) => {
              const { visible, hidden } = limitLanes(layoutDay(eventsOn(displayed, day)), maxLanes)
              const isToday = day.isSame(dayjs(), 'day')
              const ghostHere = ghost && occursOn(ghost, day.format('YYYY-MM-DD'))

              return (
                <div
                  key={day.toString()}
                  className={`calendar-daycolumn${isToday ? ' calendar-daycolumn--today' : ''}`}
                >
                  {HOURS.map((hour) => (
                    <div key={hour} className="calendar-hour-slot" />
                  ))}

                  {visible.map((positioned) => (
                    <EventBlock
                      key={positioned.event.id}
                      positioned={positioned}
                      onSelect={select}
                      interactive={interactive}
                      narrow={days.length > 1}
                      // The live preview is drawn from `displayed`; resize from the original.
                      onResize={(_, deltaY, done) =>
                        handleResize(
                          events.find((event) => event.id === positioned.event.id) ??
                            positioned.event,
                          deltaY,
                          done,
                        )
                      }
                      dimmed={drag?.kind === 'move' && drag.event.id === positioned.event.id}
                    />
                  ))}

                  {hidden.map((cluster) => (
                    <HiddenMarker
                      key={cluster.events[0]!.id}
                      cluster={cluster}
                      onSelectEvent={onSelectEvent}
                    />
                  ))}

                  {ghostHere && (
                    <EventBlock
                      ghost
                      interactive={interactive}
                      onSelect={() => undefined}
                      positioned={{ ...layoutDay([ghost])[0]!, lane: 0, lanes: 1 }}
                    />
                  )}

                  {isToday && <NowIndicator />}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </DndContext>
  )
}
