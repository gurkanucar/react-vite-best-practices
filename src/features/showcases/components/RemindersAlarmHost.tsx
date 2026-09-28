import { BellFilled } from '@ant-design/icons'
import { Button, notification, Space } from 'antd'
import { useEffect, useRef } from 'react'
import { Link } from 'react-router'
import { playChime, showSystemNotification } from '@/features/showcases/components/remindersAudio'
import {
  dueAlerts,
  reminderTitle,
  todayIso,
  daysBetween,
  type ReminderAlert,
} from '@/features/showcases/data/reminders'
import { useRemindersCopy } from '@/features/showcases/hooks/useRemindersCopy'
import { useRemindersStore, visibleReminders } from '@/features/showcases/hooks/useRemindersStore'

/** How often the host looks for alarms that are due. */
const TICK_MS = 1000

/**
 * Rings the alarms while any page of the app is open: an antd notification that stays until it
 * is dismissed or snoozed, the chime unless muted, and a system notification when allowed.
 * Every alert is marked as rung the moment it shows, so a reload does not ring it again.
 */
export function RemindersAlarmHost({ root }: { root: string }) {
  const [api, contextHolder] = notification.useNotification({ stack: { threshold: 3 } })
  const { text, language } = useRemindersCopy()
  const latest = useRef({ text, language, root })

  useEffect(() => {
    latest.current = { text, language, root }
  }, [text, language, root])

  useEffect(() => {
    function ring(alert: ReminderAlert) {
      const { text: copy, language: lang, root: base } = latest.current
      const state = useRemindersStore.getState()
      const reminder = state.reminders.find((entry) => entry.id === alert.reminderId)
      const title = reminder ? reminderTitle(reminder, lang) : copy.alarms.testTitle
      const days = daysBetween(todayIso(Date.now()), alert.occurrence)
      const when = days >= 0 ? copy.daysLeft(days) : copy.daysAgo(-days)
      const body = reminder
        ? `${copy.categories[reminder.category]} · ${when}`
        : copy.alarms.testBody
      const close = () => api.destroy(alert.key)
      const snooze = (minutes: number) => {
        useRemindersStore.getState().snooze(alert, minutes, Date.now())
        close()
      }

      api.open({
        key: alert.key,
        title: (
          <span className="reminders-alarm__title">
            {copy.alarms.ringing}: {title}
          </span>
        ),
        description: reminder ? (
          <Link to={`${base}/${reminder.id}`} onClick={close}>
            {body}
          </Link>
        ) : (
          body
        ),
        icon: <BellFilled className="reminders-alarm__icon" />,
        duration: 0,
        className: 'reminders-alarm',
        role: 'alert',
        actions: (
          <Space wrap size={6}>
            <Button size="small" onClick={() => snooze(5)}>
              {copy.alarms.snooze(5)}
            </Button>
            <Button size="small" onClick={() => snooze(10)}>
              {copy.alarms.snooze(10)}
            </Button>
            <Button size="small" type="primary" onClick={close}>
              {copy.alarms.dismiss}
            </Button>
          </Space>
        ),
      })
      if (!state.muted) playChime()
      showSystemNotification(`${copy.alarms.ringing}: ${title}`, body, alert.key)
    }

    function tick() {
      const now = Date.now()
      const state = useRemindersStore.getState()
      const reminders = visibleReminders(state.reminders, state.showHolidays)
      const due = [
        ...dueAlerts(reminders, now, new Set(state.handled)),
        ...state.snoozes.filter((entry) => entry.until <= now),
      ]
      if (due.length === 0) return
      state.markRung(due.map((alert) => alert.key))
      due.forEach(ring)
    }

    tick()
    const timer = window.setInterval(tick, TICK_MS)
    return () => window.clearInterval(timer)
  }, [api])

  return contextHolder
}
