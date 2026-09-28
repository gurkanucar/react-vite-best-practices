import {
  CalendarOutlined,
  DeleteOutlined,
  DownloadOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons'
import { Button, Calendar, Checkbox, Grid, Segmented, Select } from 'antd'
import dayjs, { type Dayjs } from 'dayjs'
import { useState } from 'react'
import { useParams, useSearchParams } from 'react-router'
import {
  CityHero,
  CityNotFound,
  DateBadge,
  EventCard,
  EventCategoryTag,
  PlanButton,
} from '@/features/showcases/components/CityBits'
import { CitySiteShell } from '@/features/showcases/components/CitySiteShell'
import {
  cities,
  cityEvents,
  EVENT_CATEGORIES,
  isCityId,
  type CityEvent,
  type EventCategory,
} from '@/features/showcases/data/cityGuide'
import {
  eventMonths,
  filterEvents,
  formatEventDates,
  formatMonth,
  groupByMonth,
  isOnDay,
  parseEventFilters,
  planToIcs,
  type EventFilters,
} from '@/features/showcases/data/citySearch'
import { useCityCopy } from '@/features/showcases/hooks/useCityCopy'
import { useCityStore } from '@/features/showcases/hooks/useCityStore'
import { useCityToday } from '@/features/showcases/hooks/useCityToday'

interface CityEventsPageProps {
  standalone?: boolean
}

function download(fileName: string, content: string) {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
}

function paramsOf(filters: EventFilters, view: string) {
  const params = new URLSearchParams()
  if (filters.category !== 'all') params.set('cat', filters.category)
  if (filters.month !== 'all') params.set('month', filters.month)
  if (filters.planned) params.set('plan', '1')
  if (view === 'calendar') params.set('view', 'calendar')
  return params
}

function EventCalendar({
  events,
  standalone,
  initial,
}: {
  events: CityEvent[]
  standalone: boolean
  initial: string
}) {
  const { text, language, t } = useCityCopy()
  const wide = Grid.useBreakpoint().md ?? false
  const [day, setDay] = useState<Dayjs>(() => dayjs(initial))
  const iso = (value: Dayjs) => value.format('YYYY-MM-DD')
  const onDay = events.filter((event) => isOnDay(event, iso(day)))

  return (
    <div className="city-calendar">
      <Calendar
        fullscreen={wide}
        value={day}
        onSelect={setDay}
        cellRender={(value, info) => {
          if (info.type !== 'date') return info.originNode
          const here = events.filter((event) => isOnDay(event, iso(value)))
          if (!here.length) return null
          if (!wide)
            return (
              <span className="city-calendar__dot" aria-label={text.events.count(here.length)} />
            )
          return (
            <ul className="city-calendar__list">
              {here.map((event) => (
                <li
                  key={event.id}
                  className={`city-calendar__item city-calendar__item--${event.category}`}
                >
                  {t(event.title)}
                </li>
              ))}
            </ul>
          )
        }}
      />
      <section className="city-calendar__day" aria-live="polite">
        <h3>
          {text.events.onDay}:{' '}
          {new Intl.DateTimeFormat(language === 'tr' ? 'tr-TR' : 'en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          }).format(day.toDate())}
        </h3>
        {onDay.length ? (
          <div className="city-events">
            {onDay.map((event) => (
              <EventCard key={event.id} event={event} standalone={standalone} />
            ))}
          </div>
        ) : (
          <p className="city-muted">{text.events.noneOnDay}</p>
        )}
      </section>
    </div>
  )
}

export function CityEventsPage({ standalone = false }: CityEventsPageProps) {
  const { cityId } = useParams()
  const { text, language, t } = useCityCopy()
  const [params, setParams] = useSearchParams()
  const today = useCityToday()
  const plan = useCityStore((state) => state.plan)
  const clearPlan = useCityStore((state) => state.clearPlan)

  if (!isCityId(cityId))
    return (
      <CitySiteShell standalone={standalone} page="events">
        <CityNotFound standalone={standalone} />
      </CitySiteShell>
    )

  const city = cities[cityId]
  const filters = parseEventFilters(params)
  const view = params.get('view') === 'calendar' ? 'calendar' : 'list'
  const events = filterEvents(cityEvents, cityId, filters, today, plan)
  const months = eventMonths(cityEvents, cityId, today)
  const planned = filterEvents(
    cityEvents,
    cityId,
    { category: 'all', month: 'all', planned: true },
    today,
    plan,
  )
  const update = (patch: Partial<EventFilters>, nextView = view) =>
    setParams(paramsOf({ ...filters, ...patch }, nextView), { replace: true })
  const calendarStart = events[0]?.date ?? (filters.month === 'all' ? today : `${filters.month}-01`)

  return (
    <CitySiteShell standalone={standalone} page="events">
      <CityHero
        city={city}
        standalone={standalone}
        eyebrow={t(city.name)}
        title={text.events.title(t(city.name))}
        lead={text.events.lead}
      />

      <div className="city-container city-events-page">
        <div className="city-events-page__main">
          <fieldset className="city-chips">
            <legend className="city-sr-only">{text.explore.categoryTabs}</legend>
            {(['all', ...EVENT_CATEGORIES] as const).map((key) => (
              <Button
                key={key}
                shape="round"
                type={filters.category === key ? 'primary' : 'default'}
                aria-pressed={filters.category === key}
                onClick={() => update({ category: key as EventCategory | 'all' })}
              >
                {key === 'all' ? text.events.all : text.eventCategories[key]}
              </Button>
            ))}
          </fieldset>

          <div className="city-toolbar">
            <Select
              className="city-toolbar__month"
              aria-label={text.events.month}
              value={filters.month}
              onChange={(month: string) => update({ month })}
              options={[
                { value: 'all', label: text.events.anyMonth },
                ...months.map((month) => ({ value: month, label: formatMonth(month, language) })),
              ]}
            />
            <Checkbox
              checked={filters.planned}
              onChange={(event) => update({ planned: event.target.checked })}
            >
              {text.events.plannedOnly}
            </Checkbox>
            <Segmented
              className="city-toolbar__view"
              aria-label={text.events.view}
              value={view}
              onChange={(value) => update({}, value)}
              options={[
                { value: 'list', label: text.events.list, icon: <UnorderedListOutlined /> },
                { value: 'calendar', label: text.events.calendar, icon: <CalendarOutlined /> },
              ]}
            />
          </div>

          <p className="city-results-head__count" aria-live="polite">
            {text.events.count(events.length)}
          </p>

          {view === 'calendar' ? (
            <EventCalendar
              key={`${filters.month}-${calendarStart}`}
              events={events}
              standalone={standalone}
              initial={calendarStart}
            />
          ) : events.length ? (
            groupByMonth(events).map((group) => (
              <section
                key={group.month}
                className="city-month"
                aria-labelledby={`m-${group.month}`}
              >
                <h2 id={`m-${group.month}`}>{formatMonth(group.month, language)}</h2>
                <div className="city-events">
                  {group.events.map((event) => (
                    <EventCard key={event.id} event={event} standalone={standalone} />
                  ))}
                </div>
              </section>
            ))
          ) : (
            <div className="city-empty">
              <p>{text.events.empty}</p>
              <Button onClick={() => setParams({}, { replace: true })}>{text.explore.clear}</Button>
            </div>
          )}
          <p className="city-demo-note">{text.events.demo}</p>
        </div>

        <aside className="city-events-page__plan" aria-labelledby="city-plan">
          <div className="city-panel">
            <h2 id="city-plan">
              {text.events.planTitle} <span className="city-count">{planned.length}</span>
            </h2>
            {planned.length ? (
              <>
                <ul className="city-plan">
                  {planned.map((event) => (
                    <li key={event.id}>
                      <DateBadge day={event.date} />
                      <span>
                        <strong>{t(event.title)}</strong>
                        <small>
                          {formatEventDates(event, language)} · {event.time}
                        </small>
                        <EventCategoryTag category={event.category} />
                      </span>
                      <PlanButton event={event} />
                    </li>
                  ))}
                </ul>
                <div className="city-plan__actions">
                  <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    onClick={() =>
                      download(
                        `sehirname-${cityId}.ics`,
                        planToIcs(
                          planned,
                          (event) => t(event.title),
                          (event) => `${t(event.venue)}, ${event.district}, ${t(city.name)}`,
                        ),
                      )
                    }
                  >
                    {text.events.download}
                  </Button>
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => clearPlan(planned.map((event) => event.id))}
                  >
                    {text.events.clearPlan}
                  </Button>
                </div>
              </>
            ) : (
              <p className="city-muted">{text.events.planEmpty}</p>
            )}
          </div>
        </aside>
      </div>
    </CitySiteShell>
  )
}
