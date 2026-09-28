import dayjs from 'dayjs'
import { escapeIcsText, foldIcsLine, icsTimestamp } from '@/features/showcases/data/confIcs'
import {
  ISO,
  nextOccurrence,
  reminderNote,
  reminderTitle,
  todayIso,
  type Reminder,
} from '@/features/showcases/data/reminders'
import type { Language } from '@/store/preferences-store'

const UID_DOMAIN = 'anlar.example'
const WEEKDAYS = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA']

const icsDate = (iso: string) => iso.replaceAll('-', '')

/**
 * How long before the start of an all-day event an alert rings, as an iCalendar duration.
 * The day starts at midnight, so "1 day before at 09:00" is 15 hours before it: `-PT15H`.
 */
export function alarmTrigger(offsetDays: number, alarmTime: string) {
  const [hours = 0, minutes = 0] = alarmTime.split(':').map(Number)
  const total = hours * 60 + minutes - offsetDays * 1440
  if (total === 0) return 'PT0M'
  const sign = total < 0 ? '-' : ''
  const abs = Math.abs(total)
  const days = Math.floor(abs / 1440)
  const h = Math.floor((abs % 1440) / 60)
  const m = abs % 60
  const time = h || m ? `T${h ? `${h}H` : ''}${m ? `${m}M` : ''}` : ''
  return `${sign}P${days ? `${days}D` : ''}${time}`
}

/**
 * The repeat rule. A 29 February birthday lands on the last day of February; a monthly bill on
 * the 30th lands on the largest of the 28th–30th each month has, as the app shows them.
 */
export function recurrenceRule(reminder: Reminder): string | undefined {
  const { rule } = reminder
  if (rule?.kind === 'nthWeekday') {
    return `FREQ=YEARLY;BYMONTH=${rule.month};BYDAY=${rule.nth}${WEEKDAYS[rule.weekday]}`
  }
  if (rule?.kind === 'dates' || reminder.repeat === 'once') return undefined
  const [, month, day] = reminder.date.split('-').map(Number) as [number, number, number]
  if (reminder.repeat === 'monthly') {
    if (day <= 28) return 'FREQ=MONTHLY'
    const days = Array.from({ length: day - 27 }, (_, index) => 28 + index).join(',')
    return `FREQ=MONTHLY;BYMONTHDAY=${days};BYSETPOS=-1`
  }
  if (month === 2 && day === 29) return 'FREQ=YEARLY;BYMONTH=2;BYMONTHDAY=-1'
  return 'FREQ=YEARLY'
}

function eventLines(
  reminder: Reminder,
  start: string,
  uid: string,
  rrule: string | undefined,
  language: Language,
  now: number,
) {
  const title = reminderTitle(reminder, language)
  const note = reminderNote(reminder, language)
  const description = [note, reminder.contact?.name, reminder.contact?.phone]
    .filter(Boolean)
    .join('\n')
  return [
    'BEGIN:VEVENT',
    `UID:${uid}@${UID_DOMAIN}`,
    `DTSTAMP:${icsTimestamp(now)}`,
    `DTSTART;VALUE=DATE:${icsDate(start)}`,
    `DTEND;VALUE=DATE:${icsDate(dayjs(start).add(1, 'day').format(ISO))}`,
    ...(rrule ? [`RRULE:${rrule}`] : []),
    `SUMMARY:${escapeIcsText(title)}`,
    ...(description ? [`DESCRIPTION:${escapeIcsText(description)}`] : []),
    'TRANSP:TRANSPARENT',
    ...reminder.offsets.flatMap((offset) => [
      'BEGIN:VALARM',
      'ACTION:DISPLAY',
      `DESCRIPTION:${escapeIcsText(title)}`,
      `TRIGGER:${alarmTrigger(offset, reminder.alarmTime)}`,
      'END:VALARM',
    ]),
    'END:VEVENT',
  ]
}

function reminderEvents(reminder: Reminder, language: Language, now: number) {
  const { rule } = reminder
  if (rule?.kind === 'dates') {
    return rule.dates.flatMap((date) =>
      eventLines(reminder, date, `${reminder.id}-${icsDate(date)}`, undefined, language, now),
    )
  }
  // A rule-based day starts on its next date, which the rule is sure to match.
  const start =
    rule?.kind === 'nthWeekday'
      ? (nextOccurrence(reminder, todayIso(now)) ?? reminder.date)
      : reminder.date
  return eventLines(reminder, start, reminder.id, recurrenceRule(reminder), language, now)
}

/** One calendar file for any number of reminders, with CRLF line endings and folded lines. */
export function buildRemindersIcs(reminders: readonly Reminder[], language: Language, now: number) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:-//Anlar//Special days//${language.toUpperCase()}`,
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${language === 'tr' ? 'Anlar · Özel günler' : 'Anlar · Special days'}`,
    ...reminders.flatMap((reminder) => reminderEvents(reminder, language, now)),
    'END:VCALENDAR',
  ]
  return `${lines.map(foldIcsLine).join('\r\n')}\r\n`
}

export function remindersIcsName(reminders: readonly Reminder[]) {
  return reminders.length === 1 ? `anlar-${reminders[0]!.id}.ics` : 'anlar-special-days.ics'
}
