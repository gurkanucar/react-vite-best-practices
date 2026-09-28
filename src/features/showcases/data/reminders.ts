import dayjs from 'dayjs'
import type { Language } from '@/store/preferences-store'

/*
 * Special days: the dates, how they repeat, and when their alarms ring. Everything here works
 * on plain `YYYY-MM-DD` strings and epoch milliseconds in the viewer's own time zone, so the
 * pages can hand it "now" and the tests can pin it.
 */

export const REMINDER_CATEGORIES = [
  'birthday',
  'anniversary',
  'wedding',
  'memorial',
  'holiday',
  'religious',
  'bill',
  'other',
] as const
export type ReminderCategory = (typeof REMINDER_CATEGORIES)[number]

export const REMINDER_REPEATS = ['yearly', 'monthly', 'once'] as const
export type ReminderRepeat = (typeof REMINDER_REPEATS)[number]

/** How many days before the day an alert may ring. 0 is the day itself. */
export const REMINDER_OFFSETS = [0, 1, 3, 7, 14, 30] as const

/**
 * Days that do not keep the same date every year: the n-th weekday of a month (Mother's Day),
 * or a published list of dates (the religious holidays follow the lunar calendar).
 */
export type ReminderRule =
  | { kind: 'nthWeekday'; month: number; weekday: number; nth: number }
  | { kind: 'dates'; dates: string[] }

export interface Localized {
  en: string
  tr: string
}

export interface GiftIdea {
  id: string
  text: string
  /** Seeded ideas carry both languages; the viewer's own ideas are one string. */
  i18n?: Localized
  done: boolean
}

export interface ReminderContact {
  name: string
  phone?: string
}

export interface Reminder {
  id: string
  title: string
  /** Seeded reminders carry both languages until the viewer renames them. */
  i18n?: Localized
  category: ReminderCategory
  /** The original date: a birth, a wedding, the first bill. */
  date: string
  repeat: ReminderRepeat
  rule?: ReminderRule
  /** Count the years since `date`: "turns 34", "8th anniversary". */
  countYears: boolean
  /** Days before the day that an alert rings, largest first. Empty means no alarm. */
  offsets: number[]
  /** `HH:mm`, the time of day every alert for this reminder rings. */
  alarmTime: string
  note?: string
  noteI18n?: Localized
  contact?: ReminderContact
  gifts: GiftIdea[]
  /** Public and religious holidays that ship with the app. */
  builtin?: boolean
}

export const ISO = 'YYYY-MM-DD'
const DAY_MS = 86_400_000

export function localized(text: string, i18n: Localized | undefined, language: Language) {
  return i18n?.[language] ?? text
}

export const reminderTitle = (reminder: Reminder, language: Language) =>
  localized(reminder.title, reminder.i18n, language)

export const reminderNote = (reminder: Reminder, language: Language) =>
  reminder.note === undefined ? undefined : localized(reminder.note, reminder.noteI18n, language)

export const giftText = (gift: GiftIdea, language: Language) =>
  localized(gift.text, gift.i18n, language)

export function isLeapYear(year: number) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

const pad = (value: number) => String(value).padStart(2, '0')
const isoOf = (year: number, month: number, day: number) => `${year}-${pad(month)}-${pad(day)}`
const daysIn = (year: number, month: number) => dayjs(isoOf(year, month, 1)).daysInMonth()

function parts(iso: string) {
  const [year = 0, month = 1, day = 1] = iso.split('-').map(Number)
  return { year, month, day }
}

/** A real `YYYY-MM-DD` date: 2026-02-30 is not one. */
export function isIsoDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && dayjs(value).format(ISO) === value
}

export const todayIso = (now: number) => dayjs(now).format(ISO)

/**
 * The n-th weekday of a month (weekday 0 is Sunday). A negative n counts from the end, so
 * -1 is the last one.
 */
export function nthWeekday(year: number, month: number, weekday: number, nth: number) {
  if (nth > 0) {
    const first = dayjs(isoOf(year, month, 1)).day()
    return isoOf(year, month, 1 + ((weekday - first + 7) % 7) + (nth - 1) * 7)
  }
  const lastDay = daysIn(year, month)
  const last = dayjs(isoOf(year, month, lastDay)).day()
  return isoOf(year, month, lastDay - ((last - weekday + 7) % 7) + (nth + 1) * 7)
}

/**
 * The day a yearly reminder falls on in `year`. A 29 February outside a leap year is kept on
 * the 28th, the last day of the same month, as most people celebrate it.
 */
export function occurrenceInYear(reminder: Reminder, year: number): string | null {
  const { rule } = reminder
  if (rule?.kind === 'nthWeekday') return nthWeekday(year, rule.month, rule.weekday, rule.nth)
  if (rule?.kind === 'dates') return rule.dates.find((date) => date.startsWith(`${year}-`)) ?? null
  const original = parts(reminder.date)
  if (year < original.year) return null
  const day = original.month === 2 && original.day === 29 && !isLeapYear(year) ? 28 : original.day
  return isoOf(year, original.month, day)
}

/** A monthly reminder on the 31st falls on the last day of shorter months. */
function monthlyIn(reminder: Reminder, year: number, month: number) {
  return isoOf(year, month, Math.min(parts(reminder.date).day, daysIn(year, month)))
}

/** Every day the reminder falls on between `from` and `to`, both included, in order. */
export function occurrencesBetween(reminder: Reminder, from: string, to: string): string[] {
  if (to < from) return []
  const inRange = (date: string | null): date is string =>
    date !== null && date >= from && date <= to

  if (reminder.rule?.kind === 'dates') return [...reminder.rule.dates].sort().filter(inRange)
  if (reminder.repeat === 'once') return inRange(reminder.date) ? [reminder.date] : []

  const start = parts(from)
  const end = parts(to)
  const dates: string[] = []
  if (reminder.repeat === 'monthly') {
    for (let year = start.year, month = start.month; year < end.year || month <= end.month;) {
      const date = monthlyIn(reminder, year, month)
      if (inRange(date) && date >= reminder.date) dates.push(date)
      month += 1
      if (month > 12) {
        month = 1
        year += 1
      }
      if (year > end.year) break
    }
    return dates
  }
  for (let year = start.year; year <= end.year; year += 1) {
    const date = occurrenceInYear(reminder, year)
    if (inRange(date)) dates.push(date)
  }
  return dates
}

/** The first day on or after `from` that the reminder falls on; null once it never will. */
export function nextOccurrence(reminder: Reminder, from: string): string | null {
  const horizon = dayjs(from)
    .add(reminder.rule?.kind === 'dates' ? 10 : 2, 'year')
    .format(ISO)
  return occurrencesBetween(reminder, from, horizon)[0] ?? null
}

/** The days it fell on before `before`, most recent first, at most `limit`. */
export function pastOccurrences(reminder: Reminder, before: string, limit = 5): string[] {
  const span = reminder.repeat === 'monthly' ? 1 : limit + 1
  const from = dayjs(before).subtract(Math.max(span, 1), 'year').format(ISO)
  const until = dayjs(before).subtract(1, 'day').format(ISO)
  return occurrencesBetween(reminder, from, until)
    .filter((date) => date > reminder.date || reminder.repeat === 'once')
    .reverse()
    .slice(0, limit)
}

/** Whole days from one date to another: 0 today, 1 tomorrow. */
export function daysBetween(from: string, to: string) {
  return Math.round((dayjs(to).valueOf() - dayjs(from).valueOf()) / DAY_MS)
}

/** The age turned or the anniversary reached on `occurrence`, when the years are counted. */
export function yearsAt(reminder: Reminder, occurrence: string): number | null {
  if (!reminder.countYears || reminder.repeat !== 'yearly') return null
  const years = parts(occurrence).year - parts(reminder.date).year
  return years > 0 ? years : null
}

export interface UpcomingItem {
  reminder: Reminder
  occurrence: string
  days: number
}

/** Each reminder's next day from `today`, soonest first. Reminders that are over drop out. */
export function upcoming(reminders: readonly Reminder[], today: string): UpcomingItem[] {
  return reminders
    .flatMap((reminder) => {
      const occurrence = nextOccurrence(reminder, today)
      return occurrence ? [{ reminder, occurrence, days: daysBetween(today, occurrence) }] : []
    })
    .sort(
      (a, b) =>
        a.days - b.days ||
        a.reminder.alarmTime.localeCompare(b.reminder.alarmTime) ||
        a.reminder.id.localeCompare(b.reminder.id),
    )
}

export type UpcomingGroup = 'today' | 'week' | 'month' | 'later'

export function upcomingGroup(days: number): UpcomingGroup {
  if (days === 0) return 'today'
  if (days <= 7) return 'week'
  if (days <= 31) return 'month'
  return 'later'
}

/** Every reminder that falls on each day of a range, keyed by date. */
export function occurrencesByDay(reminders: readonly Reminder[], from: string, to: string) {
  const days = new Map<string, Reminder[]>()
  for (const reminder of reminders) {
    for (const date of occurrencesBetween(reminder, from, to)) {
      days.set(date, [...(days.get(date) ?? []), reminder])
    }
  }
  return days
}

/* Alarms */

export interface ReminderAlert {
  /** Unique per reminder, day and offset, so an alert rings once. */
  key: string
  reminderId: string
  occurrence: string
  offset: number
  at: number
}

export function isValidTime(time: string) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(time)
}

/** When the alert `offset` days before `occurrence` rings, at the reminder's alarm time. */
export function alertTime(occurrence: string, offset: number, alarmTime: string) {
  const time = isValidTime(alarmTime) ? alarmTime : '09:00'
  return dayjs(`${occurrence}T${time}`).subtract(offset, 'day').valueOf()
}

export const alertKey = (reminderId: string, occurrence: string, offset: number) =>
  `${reminderId}:${occurrence}:${offset}`

export function alertsFor(reminder: Reminder, occurrence: string): ReminderAlert[] {
  return reminder.offsets
    .map((offset) => ({
      key: alertKey(reminder.id, occurrence, offset),
      reminderId: reminder.id,
      occurrence,
      offset,
      at: alertTime(occurrence, offset, reminder.alarmTime),
    }))
    .sort((a, b) => a.at - b.at)
}

const maxOffset = Math.max(...REMINDER_OFFSETS)

/** Every alert that rings between two moments, earliest first. */
export function alertsBetween(reminders: readonly Reminder[], fromMs: number, toMs: number) {
  const from = todayIso(fromMs)
  const to = dayjs(toMs).add(maxOffset, 'day').format(ISO)
  return reminders
    .flatMap((reminder) =>
      occurrencesBetween(reminder, from, to).flatMap((occurrence) =>
        alertsFor(reminder, occurrence),
      ),
    )
    .filter((alert) => alert.at > fromMs && alert.at <= toMs)
    .sort((a, b) => a.at - b.at || a.key.localeCompare(b.key))
}

/** How long a missed alert may still ring when the app opens late: a quarter of an hour. */
export const ALARM_GRACE_MS = 15 * 60_000

/**
 * The alerts that should ring now: due, not rung before, and not older than the grace window.
 * An app that was closed at the alarm time does not wake up to yesterday's alarms.
 */
export function dueAlerts(
  reminders: readonly Reminder[],
  now: number,
  handled: ReadonlySet<string>,
  graceMs = ALARM_GRACE_MS,
) {
  return alertsBetween(reminders, now - graceMs, now).filter((alert) => !handled.has(alert.key))
}

/** The next alert to ring after `now`, looking a year ahead. */
export function nextAlert(reminders: readonly Reminder[], now: number): ReminderAlert | undefined {
  return alertsBetween(reminders, now, dayjs(now).add(400, 'day').valueOf())[0]
}

export interface Countdown {
  days: number
  hours: number
  minutes: number
  seconds: number
  past: boolean
}

export function countdown(fromMs: number, toMs: number): Countdown {
  const diff = Math.max(0, toMs - fromMs)
  return {
    days: Math.floor(diff / DAY_MS),
    hours: Math.floor(diff / 3_600_000) % 24,
    minutes: Math.floor(diff / 60_000) % 60,
    seconds: Math.floor(diff / 1000) % 60,
    past: toMs <= fromMs,
  }
}

/* Editing */

export interface ReminderInput {
  title: string
  category: ReminderCategory
  date: string
  repeat: ReminderRepeat
  countYears: boolean
  offsets: number[]
  alarmTime: string
  note?: string
  contact?: ReminderContact
  gifts?: string[]
}

/** Categories that usually count years: an age, an anniversary. */
export const COUNTS_YEARS: readonly ReminderCategory[] = [
  'birthday',
  'anniversary',
  'wedding',
  'memorial',
]

export function cleanOffsets(offsets: readonly number[]) {
  return [...new Set(offsets)]
    .filter((offset) => (REMINDER_OFFSETS as readonly number[]).includes(offset))
    .sort((a, b) => b - a)
}

export function reminderIssues(input: ReminderInput): string[] {
  const issues: string[] = []
  if (!input.title.trim()) issues.push('title')
  if (input.title.trim().length > 80) issues.push('titleLength')
  if (!isIsoDate(input.date)) issues.push('date')
  if (!isValidTime(input.alarmTime)) issues.push('alarmTime')
  return issues
}

let sequence = 0

/** A fresh id that can never be mistaken for a page ("calendar"). */
export function newReminderId(now: number) {
  sequence += 1
  return `r-${now.toString(36)}-${sequence.toString(36)}`
}

/** Applies the form to a new reminder, or on top of an existing one. */
export function applyInput(input: ReminderInput, now: number, existing?: Reminder): Reminder {
  const title = input.title.trim()
  const note = input.note?.trim() || undefined
  const contactName = input.contact?.name.trim()
  const phone = input.contact?.phone?.trim()
  const keepI18n =
    existing?.i18n && (title === existing.i18n.en || title === existing.i18n.tr)
      ? existing.i18n
      : undefined
  const keepNoteI18n =
    existing?.noteI18n && note && (note === existing.noteI18n.en || note === existing.noteI18n.tr)
      ? existing.noteI18n
      : undefined
  const giftTexts = input.gifts?.map((gift) => gift.trim()).filter(Boolean)
  const gifts =
    giftTexts === undefined
      ? (existing?.gifts ?? [])
      : giftTexts.map(
          (text, index) =>
            existing?.gifts.find(
              (gift) => gift.text === text || gift.i18n?.en === text || gift.i18n?.tr === text,
            ) ?? { id: `g-${now.toString(36)}-${index}`, text, done: false },
        )

  return {
    ...existing,
    id: existing?.id ?? newReminderId(now),
    title,
    i18n: keepI18n,
    category: input.category,
    date: existing?.rule ? existing.date : input.date,
    repeat: existing?.rule ? existing.repeat : input.repeat,
    countYears: input.repeat === 'yearly' && input.countYears,
    offsets: cleanOffsets(input.offsets),
    alarmTime: isValidTime(input.alarmTime) ? input.alarmTime : '09:00',
    note,
    noteI18n: keepNoteI18n,
    contact: contactName ? { name: contactName, ...(phone ? { phone } : {}) } : undefined,
    gifts,
  }
}

/** Whatever was stored, a reminder the pages can trust, or nothing. */
export function sanitizeReminder(value: unknown): Reminder | null {
  if (!value || typeof value !== 'object') return null
  const raw = value as Partial<Reminder>
  if (typeof raw.id !== 'string' || typeof raw.title !== 'string') return null
  if (typeof raw.date !== 'string' || !isIsoDate(raw.date)) return null
  const category = REMINDER_CATEGORIES.includes(raw.category as ReminderCategory)
    ? (raw.category as ReminderCategory)
    : 'other'
  const repeat = REMINDER_REPEATS.includes(raw.repeat as ReminderRepeat)
    ? (raw.repeat as ReminderRepeat)
    : 'yearly'
  return {
    ...raw,
    id: raw.id,
    title: raw.title,
    category,
    date: raw.date,
    repeat,
    countYears: Boolean(raw.countYears),
    offsets: Array.isArray(raw.offsets) ? cleanOffsets(raw.offsets.filter(Number.isInteger)) : [],
    alarmTime:
      typeof raw.alarmTime === 'string' && isValidTime(raw.alarmTime) ? raw.alarmTime : '09:00',
    gifts: Array.isArray(raw.gifts)
      ? raw.gifts.filter(
          (gift): gift is GiftIdea =>
            Boolean(gift) && typeof gift.id === 'string' && typeof gift.text === 'string',
        )
      : [],
  }
}

/** Where the app lives: inside the admin, or on its own. */
export const remindersRoot = (standalone: boolean) =>
  standalone ? '/preview/reminders' : '/showcases/reminders'
