import dayjs from 'dayjs'
// Strict parsing lives in a plugin. Without it dayjs treats the format as a hint and
// accepts `?date=2026-13-45` or `?date=09/14/2026` as valid, which then renders a grid
// around a date nobody asked for.
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { useSearchParams } from 'react-router'

dayjs.extend(customParseFormat)
import { CALENDAR_VIEWS, type CalendarView } from '@/features/calendar/types'

const DATE_FORMAT = 'YYYY-MM-DD'

function isCalendarView(value: string | null): value is CalendarView {
  return value !== null && (CALENDAR_VIEWS as string[]).includes(value)
}

/**
 * The view and the visible date both live in the address bar, so "the week of the 14th"
 * is a link a colleague can open and the back button steps through the weeks the reader
 * actually looked at.
 */
export function useCalendarParams() {
  const [searchParams, setSearchParams] = useSearchParams()
  const viewParam = searchParams.get('view')
  const dateParam = searchParams.get('date')
  const parsed = dayjs(dateParam ?? undefined, DATE_FORMAT, true)

  const view: CalendarView = isCalendarView(viewParam) ? viewParam : 'week'
  // A malformed `date` falls back to today rather than rendering an invalid grid.
  const date = parsed.isValid() ? parsed : dayjs().startOf('day')

  /**
   * View and date are written together. Two `setSearchParams` calls in one handler both
   * read the params of the render they were created in, so the second silently discards
   * what the first wrote — which is what made opening a day from the month grid land on
   * the wrong date.
   */
  const setParams = (next: { view?: CalendarView; date?: dayjs.Dayjs }) => {
    setSearchParams(
      (current) => {
        const params = new URLSearchParams(current)

        if (next.view) params.set('view', next.view)
        if (next.date) params.set('date', next.date.format(DATE_FORMAT))

        return params
      },
      { replace: true },
    )
  }

  return {
    view,
    date,
    setParams,
    setView: (nextView: CalendarView) => setParams({ view: nextView }),
    setDate: (nextDate: dayjs.Dayjs) => setParams({ date: nextDate }),
  }
}
