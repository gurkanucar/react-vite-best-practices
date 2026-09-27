import { App, Card, Grid } from 'antd'
import dayjs from 'dayjs'
import { useState } from 'react'
// import { PageHeader } from '@/components/PageHeader/PageHeader'
import {
  AgendaView,
  CalendarToolbar,
  EventDetailModal,
  EventFormModal,
  MonthGrid,
  TimeGrid,
} from '@/features/calendar/components'
import { useCalendarParams, useCalendarRange } from '@/features/calendar/hooks'
import { eventTitle } from '@/features/calendar/components/eventText'
import {
  allDayDraft,
  draftAt,
  type CalendarEvent,
  type CalendarView,
  type EventChange,
  type EventDraft,
  type EventOverride,
} from '@/features/calendar/types'
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
  const [changes, setChanges] = useState<Record<string, EventOverride>>({})
  const [created, setCreated] = useState<CalendarEvent[]>([])
  const [deleted, setDeleted] = useState<string[]>([])
  const { days, events } = useCalendarRange(view, date, { changes, created, deleted })
  const [selectedId, setSelectedId] = useState<string | null>(null)
  /** The event form: a new draft, or the id of the event it edits. */
  const [editor, setEditor] = useState<{ draft: EventDraft; eventId?: string } | null>(null)
  // Dragging is for a mouse on a wide screen; on a phone the same gesture has to scroll.
  const interactive = Grid.useBreakpoint().lg ?? false

  const selected = events.find((event) => event.id === selectedId) ?? null

  const changeEvent = (event: CalendarEvent, change: EventChange) => {
    setChanges((current) => ({ ...current, [event.id]: { ...current[event.id], ...change } }))
    void message.success(messages.calendar.updated)
  }

  const openCreate = (draft: EventDraft) => setEditor({ draft })

  const openEdit = (event: CalendarEvent) => {
    setSelectedId(null)
    // A generated event's title is a translation key; editing turns it into its own text.
    setEditor({ eventId: event.id, draft: { ...event, title: eventTitle(messages, event) } })
  }

  const saveDraft = (draft: EventDraft) => {
    if (editor?.eventId) {
      const eventId = editor.eventId
      setChanges((current) => ({ ...current, [eventId]: { ...current[eventId], ...draft } }))
      void message.success(messages.calendar.saved)
    } else {
      setCreated((current) => [...current, { ...draft, id: `custom-${crypto.randomUUID()}` }])
      void message.success(messages.calendar.created)
      // Show the new event where it landed when that is outside the range on screen.
      const start = dayjs(draft.start)
      if (!days.some((day) => day.isSame(start, 'day'))) setDate(start.startOf('day'))
    }
    setEditor(null)
  }

  const deleteEvent = (eventId: string) => {
    setDeleted((current) => [...current, eventId])
    setSelectedId(null)
    setEditor(null)
    void message.success(messages.calendar.deleted)
  }

  const newEventDraft = () => {
    // The next whole hour today, or nine in the morning on the day being looked at.
    const now = dayjs()
    const onScreen = days.some((day) => day.isSame(now, 'day'))
    const day = (onScreen ? now : date).format('YYYY-MM-DD')
    const hour = onScreen ? Math.min(now.hour() + 1, 23) : 9
    return draftAt(day, hour * 60, Math.min(hour * 60 + 60, 24 * 60 - 1))
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
          onCreateRange={(from, to) => openCreate(allDayDraft(from, to))}
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
        onCreateRange={(day, start, end) => openCreate(draftAt(day, start, end))}
      />
    )
  }

  return (
    <div className="admin-page">
      {/* Description commented out rather than deleted: not worth the space on this screen. */}
      {/* <PageHeader
        title={messages.calendar.title} description={messages.calendar.description} 
      /> */}

      <Card className="dashboard-panel calendar-panel">
        <CalendarToolbar
          view={view}
          rangeLabel={rangeLabel()}
          onViewChange={setView}
          onStep={(direction) => setDate(date.add(direction, stepUnit[view]))}
          onToday={() => setDate(dayjs().startOf('day'))}
          onCreate={() => openCreate(newEventDraft())}
        />

        {renderView()}
      </Card>

      <EventDetailModal
        event={selected}
        onClose={() => setSelectedId(null)}
        onEdit={openEdit}
        onDelete={(event) => deleteEvent(event.id)}
      />

      <EventFormModal
        draft={editor?.draft ?? null}
        mode={editor?.eventId ? 'edit' : 'create'}
        onCancel={() => setEditor(null)}
        onSave={saveDraft}
        onDelete={editor?.eventId ? () => deleteEvent(editor.eventId!) : undefined}
      />
    </div>
  )
}
