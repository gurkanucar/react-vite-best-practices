import {
  BellOutlined,
  CalendarOutlined,
  DownloadOutlined,
  ExperimentOutlined,
  PlusOutlined,
  SoundOutlined,
} from '@ant-design/icons'
import { App, Button, Empty, Flex, Input, Popconfirm, Select, Switch, Tag, Typography } from 'antd'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { ReminderFormDrawer } from '@/features/showcases/components/ReminderFormDrawer'
import { CategoryBadge, ReminderRow } from '@/features/showcases/components/RemindersParts'
import { formatDate } from '@/features/showcases/components/remindersMeta'
import { RemindersSiteShell } from '@/features/showcases/components/RemindersSiteShell'
import {
  notificationState,
  unlockAudio,
  type NotificationState,
} from '@/features/showcases/components/remindersAudio'
import { downloadFile } from '@/features/showcases/components/confFormat'
import {
  ISO,
  nextAlert,
  occurrencesByDay,
  REMINDER_CATEGORIES,
  reminderTitle,
  remindersRoot,
  todayIso,
  upcoming,
  upcomingGroup,
  yearsAt,
  type ReminderCategory,
  type UpcomingGroup,
} from '@/features/showcases/data/reminders'
import { buildRemindersIcs, remindersIcsName } from '@/features/showcases/data/remindersIcs'
import { useRemindersCopy } from '@/features/showcases/hooks/useRemindersCopy'
import { useRemindersNow } from '@/features/showcases/hooks/useRemindersNow'
import { useRemindersStore, visibleReminders } from '@/features/showcases/hooks/useRemindersStore'

interface RemindersHomePageProps {
  standalone?: boolean
}

const GROUPS: UpcomingGroup[] = ['today', 'week', 'month', 'later']

export function RemindersHomePage({ standalone = false }: RemindersHomePageProps) {
  const { text, language } = useRemindersCopy()
  const { message } = App.useApp()
  const navigate = useNavigate()
  const root = remindersRoot(standalone)
  const now = useRemindersNow()
  const today = todayIso(now)
  const all = useRemindersStore((state) => state.reminders)
  const showHolidays = useRemindersStore((state) => state.showHolidays)
  const reset = useRemindersStore((state) => state.reset)
  const [adding, setAdding] = useState(false)
  const [category, setCategory] = useState<ReminderCategory | 'all'>('all')
  const [query, setQuery] = useState('')

  const reminders = useMemo(() => visibleReminders(all, showHolidays), [all, showHolidays])
  const items = useMemo(() => upcoming(reminders, today), [reminders, today])
  const alert = useMemo(() => nextAlert(reminders, now), [reminders, now])
  const alertReminder = alert && reminders.find((reminder) => reminder.id === alert.reminderId)
  const monthCount = useMemo(() => {
    const start = dayjs(today).startOf('month').format(ISO)
    const end = dayjs(today).endOf('month').format(ISO)
    return [...occurrencesByDay(reminders, start, end).values()].reduce(
      (sum, day) => sum + day.length,
      0,
    )
  }, [reminders, today])

  const needle = query.trim().toLocaleLowerCase(language)
  const filtered = items.filter(
    ({ reminder }) =>
      (category === 'all' || reminder.category === category) &&
      (!needle || reminderTitle(reminder, language).toLocaleLowerCase(language).includes(needle)),
  )
  const month = dayjs(today).locale(language).format('MMMM')
  const monthName = month.charAt(0).toLocaleUpperCase(language) + month.slice(1)
  const first = items[0]
  const firstYears = first ? yearsAt(first.reminder, first.occurrence) : null

  function exportAll() {
    downloadFile(remindersIcsName(reminders), buildRemindersIcs(reminders, language, Date.now()))
    void message.success(text.alarms.exported)
  }

  return (
    <RemindersSiteShell standalone={standalone} page="home">
      <section className="reminders-hero">
        <div className="reminders-hero__inner">
          <div className="reminders-hero__copy">
            <Tag className="reminders-hero__eyebrow" variant="filled">
              {text.hero.eyebrow}
            </Tag>
            <Typography.Title level={1} className="reminders-hero__title">
              {text.hero.title}
            </Typography.Title>
            <Typography.Paragraph className="reminders-hero__lead">
              {text.hero.lead}
            </Typography.Paragraph>
            <Flex gap={12} wrap>
              <Button
                type="primary"
                size="large"
                icon={<PlusOutlined />}
                onClick={() => setAdding(true)}
              >
                {text.hero.add}
              </Button>
              <Link to={`${root}/calendar`} className="reminders-hero__link">
                <CalendarOutlined aria-hidden="true" /> {text.hero.calendar}
              </Link>
            </Flex>
          </div>

          <aside className="reminders-next" aria-label={text.next.label}>
            <Typography.Text className="reminders-next__label">{text.next.label}</Typography.Text>
            {first ? (
              <Link to={`${root}/${first.reminder.id}`} className="reminders-next__main">
                <span className="reminders-next__count">
                  <strong>{first.days}</strong>
                  <span>{text.detail.days}</span>
                </span>
                <span className="reminders-next__what">
                  <CategoryBadge category={first.reminder.category} size={36} />
                  <span>
                    <strong>{reminderTitle(first.reminder, language)}</strong>
                    <span>
                      {formatDate(first.occurrence, language)}
                      {firstYears !== null &&
                        ` · ${text.years(first.reminder.category, firstYears)}`}
                    </span>
                  </span>
                </span>
              </Link>
            ) : (
              <Typography.Paragraph className="reminders-next__none">
                {text.next.none}
              </Typography.Paragraph>
            )}
            <dl className="reminders-next__facts">
              <div>
                <dt>
                  <BellOutlined aria-hidden="true" /> {text.next.alarm}
                </dt>
                <dd>
                  {alert && alertReminder
                    ? `${formatDate(dayjs(alert.at).format(ISO), language, { year: false })} ${dayjs(alert.at).format('HH:mm')} · ${reminderTitle(alertReminder, language)}`
                    : text.next.noAlarm}
                </dd>
              </div>
              <div>
                <dt>
                  <CalendarOutlined aria-hidden="true" /> {monthName}
                </dt>
                <dd>{text.next.thisMonth(monthCount)}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      <div className="reminders-page">
        <AlarmSettings onExport={exportAll} />

        <Flex gap={12} wrap className="reminders-filters">
          <Input.Search
            allowClear
            placeholder={text.list.search}
            aria-label={text.list.search}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="reminders-filters__search"
          />
          <Select<ReminderCategory | 'all'>
            value={category}
            onChange={setCategory}
            aria-label={text.form.category}
            className="reminders-filters__category"
            options={[
              { value: 'all', label: text.list.all },
              ...REMINDER_CATEGORIES.map((value) => ({ value, label: text.categories[value] })),
            ]}
          />
          <Typography.Text type="secondary" className="reminders-filters__count">
            {text.list.count(filtered.length)}
          </Typography.Text>
        </Flex>

        {filtered.length === 0 ? (
          <Empty description={text.list.empty} className="reminders-empty">
            <Button
              onClick={() => {
                setCategory('all')
                setQuery('')
              }}
            >
              {text.list.clear}
            </Button>
          </Empty>
        ) : (
          GROUPS.map((group) => {
            const groupItems = filtered.filter((item) => upcomingGroup(item.days) === group)
            if (groupItems.length === 0) return null
            return (
              <section
                key={group}
                className="reminders-group"
                aria-labelledby={`reminders-${group}`}
              >
                <Typography.Title
                  level={2}
                  id={`reminders-${group}`}
                  className="reminders-group__title"
                >
                  {text.groups[group]}
                  <span className="reminders-group__count">{groupItems.length}</span>
                </Typography.Title>
                <div className="reminders-list">
                  {groupItems.map((item) => (
                    <ReminderRow
                      key={item.reminder.id}
                      item={item}
                      root={root}
                      text={text}
                      language={language}
                    />
                  ))}
                </div>
              </section>
            )
          })
        )}

        <Flex justify="center" className="reminders-reset">
          <Popconfirm
            title={text.list.resetConfirm}
            onConfirm={() => {
              reset()
              void message.success(text.list.resetDone)
            }}
          >
            <Button type="link">{text.list.reset}</Button>
          </Popconfirm>
        </Flex>
      </div>

      <ReminderFormDrawer
        open={adding}
        onClose={() => setAdding(false)}
        onSaved={(id) => navigate(`${root}/${id}`)}
      />
    </RemindersSiteShell>
  )
}

/** Sound, browser notifications, a test alarm, holidays on or off, and the export. */
function AlarmSettings({ onExport }: { onExport: () => void }) {
  const { text } = useRemindersCopy()
  const { message } = App.useApp()
  const muted = useRemindersStore((state) => state.muted)
  const setMuted = useRemindersStore((state) => state.setMuted)
  const showHolidays = useRemindersStore((state) => state.showHolidays)
  const setShowHolidays = useRemindersStore((state) => state.setShowHolidays)
  const snooze = useRemindersStore((state) => state.snooze)
  const [permission, setPermission] = useState<NotificationState>(notificationState)

  async function askPermission() {
    unlockAudio()
    try {
      setPermission(await Notification.requestPermission())
    } catch {
      setPermission(notificationState())
    }
  }

  function testAlarm() {
    unlockAudio()
    const now = Date.now()
    snooze(
      { key: `test:${now}`, reminderId: '', occurrence: todayIso(now), offset: 0, at: now },
      10 / 60,
      now,
    )
    void message.info(text.alarms.testQueued)
  }

  return (
    <section className="reminders-settings" aria-labelledby="reminders-alarms">
      <div className="reminders-settings__intro">
        <Typography.Title level={2} id="reminders-alarms" className="reminders-settings__title">
          <BellOutlined aria-hidden="true" /> {text.alarms.title}
        </Typography.Title>
        <Typography.Text type="secondary">{text.alarms.lead}</Typography.Text>
      </div>
      <div className="reminders-settings__grid">
        <label className="reminders-setting">
          <span>
            <SoundOutlined aria-hidden="true" /> {text.alarms.sound}
          </span>
          <Switch
            checked={!muted}
            onChange={(on) => {
              unlockAudio()
              setMuted(!on)
            }}
            checkedChildren={text.alarms.soundOn}
            unCheckedChildren={text.alarms.soundOff}
          />
        </label>
        <div className="reminders-setting">
          <span>{text.alarms.notifications}</span>
          {permission === 'default' ? (
            <Button size="small" onClick={() => void askPermission()}>
              {text.alarms.allow}
            </Button>
          ) : (
            <Tag color={permission === 'granted' ? 'success' : 'default'} variant="filled">
              {permission === 'granted'
                ? text.alarms.granted
                : permission === 'denied'
                  ? text.alarms.denied
                  : text.alarms.unsupported}
            </Tag>
          )}
        </div>
        <label className="reminders-setting">
          <span>{text.alarms.holidays}</span>
          <Switch checked={showHolidays} onChange={setShowHolidays} />
        </label>
        <Flex gap={8} wrap className="reminders-setting reminders-setting--actions">
          <Button icon={<ExperimentOutlined />} onClick={testAlarm}>
            {text.alarms.test}
          </Button>
          <Button icon={<DownloadOutlined />} onClick={onExport}>
            {text.alarms.export}
          </Button>
        </Flex>
      </div>
    </section>
  )
}
