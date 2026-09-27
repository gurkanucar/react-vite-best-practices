import { useDraggable } from '@dnd-kit/core'
import { Tooltip } from 'antd'
import dayjs from 'dayjs'
import { useRef, type CSSProperties, type MouseEvent, type PointerEvent } from 'react'
import { eventTimeRange, eventTitle } from '@/features/calendar/components/eventText'
import { categoryTokens, HOUR_HEIGHT, type PositionedEvent } from '@/features/calendar/types'
import { useMessages } from '@/i18n/messages'

/** The strip a crowded cluster leaves free on its right for the "+N" marker. */
export const OVERFLOW_RESERVE = 28

/** Below this height the time and the title share one line. */
const COMPACT_HEIGHT = 40

interface EventBlockProps {
  positioned: PositionedEvent
  onSelect: (eventId: string) => void
  /** Drag and resize are desktop-only; on touch they would fight the scroll. */
  interactive: boolean
  /** A preview of where a dragged event will land: drawn, but not clickable or draggable. */
  ghost?: boolean
  /** The original stays in place, dimmed, while its preview follows the pointer. */
  dimmed?: boolean
  /**
   * In a week column a block that is short or shares its width shows its start time only,
   * leaving the room for the title; the full range is in the tooltip.
   */
  narrow?: boolean
  /** Pixels the bottom edge has been dragged; `done` is set on release. */
  onResize?: (event: PositionedEvent['event'], deltaY: number, done: boolean) => void
}

function eventBlockStyle({
  event,
  startMinutes,
  endMinutes,
  lane,
  lanes,
  overflow,
}: PositionedEvent): CSSProperties {
  const reserve = overflow ? OVERFLOW_RESERVE : 0

  return {
    top: (startMinutes / 60) * HOUR_HEIGHT,
    height: ((endMinutes - startMinutes) / 60) * HOUR_HEIGHT - 2,
    // Overlapping events divide the column between them, with a 2px seam so two
    // neighbouring blocks do not read as one.
    left: `calc((100% - ${reserve}px) * ${lane / lanes} + 2px)`,
    width: `calc((100% - ${reserve}px) / ${lanes} - 4px)`,
    '--event-color': categoryTokens[event.category],
  } as CSSProperties
}

export function EventBlock({
  positioned,
  onSelect,
  interactive,
  ghost,
  dimmed,
  narrow,
  onResize,
}: EventBlockProps) {
  const messages = useMessages()
  const { event, startMinutes, endMinutes } = positioned
  const title = eventTitle(messages, event)
  const time = eventTimeRange(event)
  const compact = ((endMinutes - startMinutes) / 60) * HOUR_HEIGHT < COMPACT_HEIGHT
  const enabled = interactive && !ghost
  const startOnly = narrow && (compact || positioned.lanes > 1)

  const {
    setNodeRef: setMoveRef,
    listeners: moveListeners,
    attributes: moveAttributes,
  } = useDraggable({
    id: `move:${event.id}${ghost ? ':ghost' : ''}`,
    data: { event },
    disabled: !enabled,
  })
  /*
   * Resizing is plain pointer capture rather than a second draggable: the handle moves as
   * the block grows, and a drag library that re-measures its node would then report the
   * distance from where the handle is now instead of from where it was pressed.
   */
  const resizeStart = useRef<number | null>(null)

  const resizeHandlers = {
    onPointerDown: (pointerEvent: PointerEvent<HTMLSpanElement>) => {
      // The handle sits inside the block, so its press would also start a move.
      pointerEvent.stopPropagation()
      pointerEvent.preventDefault()
      pointerEvent.currentTarget.setPointerCapture(pointerEvent.pointerId)
      resizeStart.current = pointerEvent.clientY
    },
    onPointerMove: (pointerEvent: PointerEvent<HTMLSpanElement>) => {
      if (resizeStart.current === null) return
      onResize?.(event, pointerEvent.clientY - resizeStart.current, false)
    },
    onPointerUp: (pointerEvent: PointerEvent<HTMLSpanElement>) => {
      if (resizeStart.current === null) return
      onResize?.(event, pointerEvent.clientY - resizeStart.current, true)
      resizeStart.current = null
    },
    onPointerCancel: () => {
      if (resizeStart.current === null) return
      onResize?.(event, 0, true)
      resizeStart.current = null
    },
    // The click that ends a resize lands on the block; it should not open the event.
    onClick: (clickEvent: MouseEvent) => clickEvent.stopPropagation(),
  }

  const className = [
    'calendar-event',
    compact && 'calendar-event--compact',
    ghost && 'calendar-event--ghost',
    dimmed && 'calendar-event--dimmed',
    enabled && 'calendar-event--interactive',
  ]
    .filter(Boolean)
    .join(' ')

  const block = (
    <button
      type="button"
      ref={setMoveRef}
      className={className}
      style={eventBlockStyle(positioned)}
      onClick={() => onSelect(event.id)}
      tabIndex={ghost ? -1 : undefined}
      aria-hidden={ghost || undefined}
      {...(enabled ? moveListeners : {})}
      {...(enabled ? moveAttributes : {})}
    >
      <span className="calendar-event__time">
        {startOnly ? dayjs(event.start).format('HH:mm') : time}
      </span>
      <span className="calendar-event__title">{title}</span>

      {enabled && (
        <span
          className="calendar-event__resize"
          title={messages.calendar.resize}
          aria-hidden="true"
          {...resizeHandlers}
        />
      )}
    </button>
  )

  // A tooltip on a block being dragged, or on its preview, only gets in the way.
  return ghost || dimmed ? block : <Tooltip title={`${title} · ${time}`}>{block}</Tooltip>
}
