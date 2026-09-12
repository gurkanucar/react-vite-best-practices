import { Card } from 'antd'
import dayjs from 'dayjs'
import { useState } from 'react'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import {
  CalendarToolbar,
  EventDetailModal,
  MonthGrid,
  TimeGrid,
} from '@/features/calendar/components'
import { useCalendarParams, useCalendarRange } from '@/features/calendar/hooks'
import type { CalendarView } from '@/features/calendar/types'
import { useMessages } from '@/i18n/messages'

const stepUnit: Record<CalendarView, 'month' | 'week' | 'day'> = {
  month: 'month',
  week: 'week',
  day: 'day',
}

export function CalendarPage() {
  const messages = useMessages()
  const { view, date, setParams, setView, setDate } = useCalendarParams()
  const { days, events } = useCalendarRange(view, date)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selected = events.find((event) => event.id === selectedId) ?? null

  const rangeLabel = () => {
    if (view === 'day') return date.format('D MMMM YYYY')
    if (view === 'month') return date.format('MMMM YYYY')

    const [first] = days
    const last = days.at(-1)

    if (!first || !last) return ''

    // A week that straddles two months needs both named; one that does not would read
    // oddly repeating the same month twice.
    return first.isSame(last, 'month')
      ? `${first.format('D')} – ${last.format('D MMMM YYYY')}`
      : `${first.format('D MMM')} – ${last.format('D MMM YYYY')}`
  }

  return (
    <div className="admin-page">
      <PageHeader title={messages.calendar.title} description={messages.calendar.description} />

      <Card className="dashboard-panel calendar-panel">
        <CalendarToolbar
          view={view}
          date={date}
          rangeLabel={rangeLabel()}
          onViewChange={setView}
          onStep={(direction) => setDate(date.add(direction, stepUnit[view]))}
          onToday={() => setDate(dayjs().startOf('day'))}
        />

        {view === 'month' ? (
          <MonthGrid
            days={days}
            events={events}
            month={date}
            onSelectEvent={setSelectedId}
            onOpenDay={(day) => setParams({ view: 'day', date: day })}
          />
        ) : (
          <TimeGrid days={days} events={events} onSelectEvent={setSelectedId} />
        )}
      </Card>

      <EventDetailModal event={selected} onClose={() => setSelectedId(null)} />
    </div>
  )
}
