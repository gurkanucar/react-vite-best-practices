import {
  ArrowLeftOutlined,
  BellOutlined,
  CheckCircleFilled,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  PhoneOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import {
  App,
  Button,
  Checkbox,
  Empty,
  Flex,
  Input,
  Popconfirm,
  Result,
  Space,
  Tag,
  Timeline,
  Typography,
} from 'antd'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { downloadFile } from '@/features/showcases/components/confFormat'
import { ReminderFormDrawer } from '@/features/showcases/components/ReminderFormDrawer'
import { CategoryBadge, DaysTag } from '@/features/showcases/components/RemindersParts'
import { formatDate } from '@/features/showcases/components/remindersMeta'
import { RemindersSiteShell } from '@/features/showcases/components/RemindersSiteShell'
import {
  alertsFor,
  countdown,
  daysBetween,
  giftText,
  nextOccurrence,
  pastOccurrences,
  reminderNote,
  reminderTitle,
  remindersRoot,
  todayIso,
  yearsAt,
} from '@/features/showcases/data/reminders'
import { buildRemindersIcs, remindersIcsName } from '@/features/showcases/data/remindersIcs'
import { useRemindersCopy } from '@/features/showcases/hooks/useRemindersCopy'
import { useRemindersNow } from '@/features/showcases/hooks/useRemindersNow'
import { useRemindersStore } from '@/features/showcases/hooks/useRemindersStore'

interface ReminderDetailPageProps {
  standalone?: boolean
}

export function ReminderDetailPage({ standalone = false }: ReminderDetailPageProps) {
  const { reminderId } = useParams()
  const { text, language } = useRemindersCopy()
  const { message } = App.useApp()
  const navigate = useNavigate()
  const root = remindersRoot(standalone)
  const now = useRemindersNow(1000)
  const today = todayIso(now)
  const reminder = useRemindersStore((state) =>
    state.reminders.find((entry) => entry.id === reminderId),
  )
  const remove = useRemindersStore((state) => state.remove)
  const toggleGift = useRemindersStore((state) => state.toggleGift)
  const addGift = useRemindersStore((state) => state.addGift)
  const removeGift = useRemindersStore((state) => state.removeGift)
  const [editing, setEditing] = useState(false)
  const [idea, setIdea] = useState('')

  const next = useMemo(() => (reminder ? nextOccurrence(reminder, today) : null), [reminder, today])
  const history = useMemo(
    () => (reminder ? pastOccurrences(reminder, today, 5) : []),
    [reminder, today],
  )

  if (!reminder) {
    return (
      <RemindersSiteShell standalone={standalone} page="detail">
        <div className="reminders-page">
          <Result
            status="404"
            title={text.detail.notFound}
            subTitle={text.detail.notFoundLead}
            extra={
              <Link to={root}>
                <Button type="primary">{text.detail.back}</Button>
              </Link>
            }
          />
        </div>
      </RemindersSiteShell>
    )
  }

  const title = reminderTitle(reminder, language)
  const note = reminderNote(reminder, language)
  const years = next ? yearsAt(reminder, next) : null
  const days = next ? daysBetween(today, next) : null
  const left = next ? countdown(now, dayjs(next).valueOf()) : null
  const alerts = next ? alertsFor(reminder, next) : []
  const giftsDone = reminder.gifts.filter((gift) => gift.done).length

  function submitIdea() {
    if (!reminder || !idea.trim()) return
    addGift(reminder.id, idea, Date.now())
    setIdea('')
  }

  return (
    <RemindersSiteShell standalone={standalone} page="detail">
      <div className="reminders-page reminders-detail">
        <Link to={root} className="reminders-back">
          <ArrowLeftOutlined aria-hidden="true" /> {text.detail.back}
        </Link>

        <header className="reminders-detail__header">
          <CategoryBadge category={reminder.category} size={64} />
          <div className="reminders-detail__heading">
            <Typography.Title level={1} className="reminders-detail__title">
              {title}
            </Typography.Title>
            <Flex gap={6} wrap>
              <Tag variant="filled">{text.categories[reminder.category]}</Tag>
              <Tag variant="filled">{text.repeats[reminder.repeat]}</Tag>
              {years !== null && (
                <Tag variant="filled" color="magenta">
                  {text.years(reminder.category, years)}
                </Tag>
              )}
            </Flex>
          </div>
          <Space wrap className="reminders-detail__actions">
            <Button icon={<EditOutlined />} onClick={() => setEditing(true)}>
              {text.detail.edit}
            </Button>
            <Button
              icon={<DownloadOutlined />}
              onClick={() =>
                downloadFile(
                  remindersIcsName([reminder]),
                  buildRemindersIcs([reminder], language, Date.now()),
                )
              }
            >
              {text.detail.export}
            </Button>
            <Popconfirm
              title={text.detail.deleteConfirm}
              onConfirm={() => {
                remove(reminder.id)
                void message.success(text.detail.deleted)
                navigate(root)
              }}
            >
              <Button danger icon={<DeleteOutlined />}>
                {text.detail.delete}
              </Button>
            </Popconfirm>
          </Space>
        </header>

        <section className="reminders-countdown" aria-label={text.detail.countdownTo}>
          {next && left && days !== null ? (
            <>
              <div className="reminders-countdown__when">
                <Typography.Text className="reminders-countdown__label">
                  {text.detail.countdownTo}
                </Typography.Text>
                <strong>{formatDate(next, language)}</strong>
                <DaysTag days={days} text={text} />
              </div>
              {days === 0 ? (
                <p className="reminders-countdown__today">{text.detail.today}</p>
              ) : (
                <div className="reminders-countdown__units" role="timer" aria-live="off">
                  {(
                    [
                      [left.days, text.detail.days],
                      [left.hours, text.detail.hours],
                      [left.minutes, text.detail.minutes],
                      [left.seconds, text.detail.seconds],
                    ] as const
                  ).map(([value, label]) => (
                    <span key={label} className="reminders-countdown__unit">
                      <strong>{String(value).padStart(2, '0')}</strong>
                      <span>{label}</span>
                    </span>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="reminders-countdown__over">{text.detail.over}</p>
          )}
        </section>

        <div className="reminders-detail__grid">
          <section className="reminders-card" aria-labelledby="reminder-details">
            <Typography.Title level={2} id="reminder-details" className="reminders-card__title">
              {text.detail.details}
            </Typography.Title>
            <dl className="reminders-facts">
              {next && (
                <div>
                  <dt>{text.detail.date}</dt>
                  <dd>{formatDate(next, language)}</dd>
                </div>
              )}
              {!reminder.rule && (
                <div>
                  <dt>{text.detail.original}</dt>
                  <dd>{formatDate(reminder.date, language)}</dd>
                </div>
              )}
              <div>
                <dt>{text.detail.repeat}</dt>
                <dd>{text.repeats[reminder.repeat]}</dd>
              </div>
              {reminder.contact && (
                <div>
                  <dt>{text.detail.contact}</dt>
                  <dd>
                    <Flex align="center" gap={8} wrap>
                      <span>{reminder.contact.name}</span>
                      {reminder.contact.phone && (
                        <Button
                          size="small"
                          icon={<PhoneOutlined />}
                          href={`tel:${reminder.contact.phone.replace(/\s/g, '')}`}
                        >
                          {text.detail.call} {reminder.contact.phone}
                        </Button>
                      )}
                    </Flex>
                  </dd>
                </div>
              )}
              {note && (
                <div>
                  <dt>{text.detail.note}</dt>
                  <dd>{note}</dd>
                </div>
              )}
            </dl>
          </section>

          <section className="reminders-card" aria-labelledby="reminder-alarms">
            <Typography.Title level={2} id="reminder-alarms" className="reminders-card__title">
              <BellOutlined aria-hidden="true" /> {text.detail.alarms}
            </Typography.Title>
            {alerts.length === 0 ? (
              <Typography.Text type="secondary">{text.detail.noAlarms}</Typography.Text>
            ) : (
              <ul className="reminders-alarms">
                {alerts.map((alert) => {
                  const rang = alert.at <= now
                  const when = `${formatDate(dayjs(alert.at).format('YYYY-MM-DD'), language, { year: false })} ${dayjs(alert.at).format('HH:mm')}`
                  return (
                    <li key={alert.key} className={rang ? 'is-rang' : undefined}>
                      <Tag variant="filled">{text.offset(alert.offset)}</Tag>
                      <span>
                        {rang ? `${text.detail.rang} · ${when}` : text.detail.rings(when)}
                      </span>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>

          <section className="reminders-card" aria-labelledby="reminder-gifts">
            <Flex justify="space-between" align="baseline" gap={8} wrap>
              <Typography.Title level={2} id="reminder-gifts" className="reminders-card__title">
                {text.detail.gifts}
              </Typography.Title>
              {reminder.gifts.length > 0 && (
                <Typography.Text type="secondary">
                  {text.detail.giftsDone(giftsDone, reminder.gifts.length)}
                </Typography.Text>
              )}
            </Flex>
            {reminder.gifts.length === 0 ? (
              <Typography.Text type="secondary">{text.detail.giftsEmpty}</Typography.Text>
            ) : (
              <ul className="reminders-gifts">
                {reminder.gifts.map((gift) => (
                  <li key={gift.id} className={gift.done ? 'is-done' : undefined}>
                    <Checkbox checked={gift.done} onChange={() => toggleGift(reminder.id, gift.id)}>
                      {giftText(gift, language)}
                    </Checkbox>
                    <Button
                      type="text"
                      size="small"
                      icon={<DeleteOutlined />}
                      aria-label={`${text.detail.remove}: ${giftText(gift, language)}`}
                      onClick={() => removeGift(reminder.id, gift.id)}
                    />
                  </li>
                ))}
              </ul>
            )}
            <Space.Compact className="reminders-gifts__add">
              <Input
                value={idea}
                maxLength={80}
                placeholder={text.detail.giftPlaceholder}
                aria-label={text.detail.giftPlaceholder}
                onChange={(event) => setIdea(event.target.value)}
                onPressEnter={submitIdea}
              />
              <Button icon={<PlusOutlined />} onClick={submitIdea} disabled={!idea.trim()}>
                {text.detail.giftAdd}
              </Button>
            </Space.Compact>
          </section>

          <section className="reminders-card" aria-labelledby="reminder-history">
            <Typography.Title level={2} id="reminder-history" className="reminders-card__title">
              {text.detail.history}
            </Typography.Title>
            {history.length === 0 ? (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={text.detail.historyEmpty} />
            ) : (
              <Timeline
                className="reminders-history"
                items={history.map((date) => {
                  const pastYears = yearsAt(reminder, date)
                  return {
                    key: date,
                    icon: <CheckCircleFilled className="reminders-history__dot" />,
                    content: (
                      <Flex justify="space-between" gap={8} wrap>
                        <span>{formatDate(date, language)}</span>
                        <Typography.Text type="secondary">
                          {pastYears !== null
                            ? text.pastYears(reminder.category, pastYears)
                            : text.daysAgo(daysBetween(date, today))}
                        </Typography.Text>
                      </Flex>
                    ),
                  }
                })}
              />
            )}
          </section>
        </div>
      </div>

      <ReminderFormDrawer open={editing} reminder={reminder} onClose={() => setEditing(false)} />
    </RemindersSiteShell>
  )
}
