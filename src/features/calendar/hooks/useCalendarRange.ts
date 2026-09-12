import dayjs from 'dayjs'
import { useMemo } from 'react'
import { eventsInRange } from '@/features/calendar/data'
import type { CalendarView } from '@/features/calendar/types'

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

  if (view === 'week') {
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

export function useCalendarRange(view: CalendarView, date: dayjs.Dayjs) {
  const key = `${view}:${date.format('YYYY-MM-DD')}`

  return useMemo(() => {
    const range = calendarRange(view, date)

    return { ...range, events: eventsInRange(range.start, range.end) }
    // The dayjs instance is a new object every render; its formatted value is not.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
}
