import { App, Card, Grid } from 'antd'
import dayjs from 'dayjs'
import { useState } from 'react'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import {
  AgendaView,
  CalendarToolbar,
  EventDetailModal,
  MonthGrid,
  TimeGrid,
} from '@/features/calendar/components'
import { useCalendarParams, useCalendarRange } from '@/features/calendar/hooks'
import type { CalendarEvent, CalendarView, EventChange } from '@/features/calendar/types'
import { useMessages } from '@/i18n/messages'

const stepUnit: Record<CalendarView, 'month' | 'week' | 'day'> = {
  month: 'month',
  week: 'week',
  day: 'day',
  agenda: 'week',
}

export function CalendarPage() {
  const messages = useMessages()
  const { message } = App.useApp()
  const { view, date, setParams, setView, setDate } = useCalendarParams()
  /*
   * Moves and resizes are kept here, over the generated schedule, so they survive a
   * change of view or range. A real application would send them to its API instead.
   */
  const [changes, setChanges] = useState<Record<string, EventChange>>({})
  const { days, events } = useCalendarRange(view, date, changes)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  // Dragging is for a mouse on a wide screen; on a phone the same gesture has to scroll.
  const interactive = Grid.useBreakpoint().lg ?? false

  const selected = events.find((event) => event.id === selectedId) ?? null

  const changeEvent = (event: CalendarEvent, change: EventChange) => {
    setChanges((current) => ({ ...current, [event.id]: change }))
    void message.success(messages.calendar.updated)
  }

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

  const renderView = () => {
    if (view === 'month') {
      return (
        <MonthGrid
          days={days}
          events={events}
          month={date}
          onSelectEvent={setSelectedId}
          onOpenDay={(day) => setParams({ view: 'day', date: day })}
          interactive={interactive}
          onChangeEvent={changeEvent}
        />
      )
    }

    if (view === 'agenda') {
      return <AgendaView days={days} events={events} onSelectEvent={setSelectedId} />
    }

    return (
      <TimeGrid
        days={days}
        events={events}
        onSelectEvent={setSelectedId}
        interactive={interactive}
        onChangeEvent={changeEvent}
      />
    )
  }

  return (
    <div className="admin-page">
      {/* Description commented out rather than deleted: not worth the space on this screen. */}
      <PageHeader
        title={messages.calendar.title} /* description={messages.calendar.description} */
      />

      <Card className="dashboard-panel calendar-panel">
        <CalendarToolbar
          view={view}
          rangeLabel={rangeLabel()}
          onViewChange={setView}
          onStep={(direction) => setDate(date.add(direction, stepUnit[view]))}
          onToday={() => setDate(dayjs().startOf('day'))}
        />

        {renderView()}
      </Card>

      <EventDetailModal event={selected} onClose={() => setSelectedId(null)} />
    </div>
  )
}
