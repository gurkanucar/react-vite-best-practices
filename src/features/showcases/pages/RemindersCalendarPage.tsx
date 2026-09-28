import { PlusOutlined } from '@ant-design/icons'
import { Button, Calendar, Empty, Flex, Grid, Typography } from 'antd'
import dayjs, { type Dayjs } from 'dayjs'
import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { ReminderFormDrawer } from '@/features/showcases/components/ReminderFormDrawer'
import { ReminderRow } from '@/features/showcases/components/RemindersParts'
import { CATEGORY_META, formatDate } from '@/features/showcases/components/remindersMeta'
import { RemindersSiteShell } from '@/features/showcases/components/RemindersSiteShell'
import {
  daysBetween,
  ISO,
  isIsoDate,
  occurrencesByDay,
  reminderTitle,
  remindersRoot,
  todayIso,
} from '@/features/showcases/data/reminders'
import { useRemindersCopy } from '@/features/showcases/hooks/useRemindersCopy'
import { useRemindersNow } from '@/features/showcases/hooks/useRemindersNow'
import { useRemindersStore, visibleReminders } from '@/features/showcases/hooks/useRemindersStore'

interface RemindersCalendarPageProps {
  standalone?: boolean
}

/** A valid `?date=` or today. */
function parseDate(value: string | null, today: string) {
  return value && isIsoDate(value) ? value : today
}

export function RemindersCalendarPage({ standalone = false }: RemindersCalendarPageProps) {
  const { text, language } = useRemindersCopy()
  const root = remindersRoot(standalone)
  const now = useRemindersNow()
  const today = todayIso(now)
  const wide = Grid.useBreakpoint().lg ?? false
  const [params, setParams] = useSearchParams()
  const selected = parseDate(params.get('date'), today)
  const all = useRemindersStore((state) => state.reminders)
  const showHolidays = useRemindersStore((state) => state.showHolidays)
  const [adding, setAdding] = useState(false)

  const reminders = visibleReminders(all, showHolidays)
  const month = selected.slice(0, 7)
  // The grid shows the days around the month too, so the range reaches past both ends.
  const monthStart = dayjs(`${month}-01`)
  const byDay = occurrencesByDay(
    reminders,
    monthStart.subtract(7, 'day').format(ISO),
    monthStart.endOf('month').add(14, 'day').format(ISO),
  )
  const dayItems = (byDay.get(selected) ?? []).map((reminder) => ({
    reminder,
    occurrence: selected,
    days: daysBetween(today, selected),
  }))

  function select(date: Dayjs) {
    const next = new URLSearchParams(params)
    next.set('date', date.format(ISO))
    setParams(next, { replace: true })
  }

  function cell(date: Dayjs) {
    const entries = byDay.get(date.format(ISO)) ?? []
    if (entries.length === 0) return null
    if (!wide) {
      return (
        <span className="reminders-cal__dots" aria-hidden="true">
          {entries.slice(0, 3).map((reminder) => (
            <span
              key={reminder.id}
              style={{ background: CATEGORY_META[reminder.category].color }}
            />
          ))}
        </span>
      )
    }
    return (
      <ul className="reminders-cal__events">
        {entries.slice(0, 3).map((reminder) => (
          <li key={reminder.id} style={{ borderColor: CATEGORY_META[reminder.category].color }}>
            {reminderTitle(reminder, language)}
          </li>
        ))}
        {entries.length > 3 && (
          <li className="reminders-cal__more">{text.calendar.more(entries.length - 3)}</li>
        )}
      </ul>
    )
  }

  return (
    <RemindersSiteShell standalone={standalone} page="calendar">
      <div className="reminders-page reminders-page--calendar">
        <header className="reminders-page__header">
          <Typography.Title level={1} className="reminders-page__title">
            {text.calendar.title}
          </Typography.Title>
          <Typography.Paragraph type="secondary">{text.calendar.lead}</Typography.Paragraph>
        </header>

        <div className="reminders-cal">
          <div className="reminders-cal__grid">
            <Calendar
              fullscreen={wide}
              value={dayjs(selected)}
              onSelect={select}
              onPanelChange={select}
              cellRender={(date, info) => (info.type === 'date' ? cell(date) : info.originNode)}
            />
          </div>

          <aside className="reminders-cal__day" aria-labelledby="reminders-selected">
            <Typography.Text type="secondary">{text.calendar.selected}</Typography.Text>
            <Typography.Title
              level={2}
              id="reminders-selected"
              className="reminders-cal__day-title"
            >
              {formatDate(selected, language)}
            </Typography.Title>
            {selected !== today && (
              <Button
                type="link"
                className="reminders-cal__today"
                onClick={() => select(dayjs(today))}
              >
                {text.calendar.today}
              </Button>
            )}
            {dayItems.length === 0 ? (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={text.calendar.nothing} />
            ) : (
              <div className="reminders-list">
                {dayItems.map((item) => (
                  <ReminderRow
                    key={item.reminder.id}
                    item={item}
                    root={root}
                    text={text}
                    language={language}
                  />
                ))}
              </div>
            )}
            <Flex>
              <Button icon={<PlusOutlined />} onClick={() => setAdding(true)} block>
                {text.calendar.addOn}
              </Button>
            </Flex>
          </aside>
        </div>
      </div>

      <ReminderFormDrawer open={adding} defaultDate={selected} onClose={() => setAdding(false)} />
    </RemindersSiteShell>
  )
}
