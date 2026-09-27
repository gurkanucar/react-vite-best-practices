import dayjs from 'dayjs'
import { useMemo } from 'react'
import { eventsInRange } from '@/features/calendar/data'
import {
  applyChanges,
  type CalendarEvent,
  type CalendarView,
  type EventOverride,
} from '@/features/calendar/types'

export interface CalendarRange {
  /** The days the view draws, in order. */
  days: dayjs.Dayjs[]
  start: dayjs.Dayjs
  /** Exclusive. */
  end: dayjs.Dayjs
}

/**
 * `startOf('week')` follows the active dayjs locale, so the grid starts on Sunday for
 * English and Monday for Turkish without the views knowing about it.
 */
export function calendarRange(view: CalendarView, date: dayjs.Dayjs): CalendarRange {
  if (view === 'day') {
    const start = date.startOf('day')

    return { days: [start], start, end: start.add(1, 'day') }
  }

  // The agenda lists the same week the week view draws, as rows instead of columns.
  if (view === 'week' || view === 'agenda') {
    const start = date.startOf('week')

    return {
      days: Array.from({ length: 7 }, (_, index) => start.add(index, 'day')),
      start,
      end: start.add(7, 'day'),
    }
  }

  // A month view always draws six whole weeks, so the grid does not change height from
  // one month to the next and the days either side keep their context.
  const start = date.startOf('month').startOf('week')

  return {
    days: Array.from({ length: 42 }, (_, index) => start.add(index, 'day')),
    start,
    end: start.add(42, 'day'),
  }
}

/**
 * How far either side of the visible range events are generated before changes are
 * applied. A drag can only move an event within what is on screen, and the widest view
 * is six weeks, so an event rescheduled into this range from anywhere it could have come
 * from is still found.
 */
const CHANGE_MARGIN_DAYS = 42

/** What the reader has done to the schedule, laid over the generated events. */
export interface CalendarEdits {
  /** Moves, resizes and edits, by event id; a created event is edited the same way. */
  changes?: Record<string, EventOverride>
  created?: CalendarEvent[]
  deleted?: string[]
}

const noEvents: CalendarEvent[] = []
const noIds: string[] = []
const noChanges: Record<string, EventOverride> = {}

export function useCalendarRange(
  view: CalendarView,
  date: dayjs.Dayjs,
  { changes = noChanges, created = noEvents, deleted = noIds }: CalendarEdits = {},
) {
  const key = `${view}:${date.format('YYYY-MM-DD')}`

  return useMemo(() => {
    const range = calendarRange(view, date)
    const hasChanges = Object.keys(changes).length > 0
    const generated = hasChanges
      ? eventsInRange(
          range.start.subtract(CHANGE_MARGIN_DAYS, 'day'),
          range.end.add(CHANGE_MARGIN_DAYS, 'day'),
        )
      : eventsInRange(range.start, range.end)
    const removed = new Set(deleted)
    const events = applyChanges([...generated, ...created], changes).filter(
      (event) =>
        !removed.has(event.id) &&
        !dayjs(event.start).isAfter(range.end) &&
        !dayjs(event.end).isBefore(range.start),
    )

    return { ...range, events }
    // The dayjs instance is a new object every render; its formatted value is not.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, changes, created, deleted])
}
