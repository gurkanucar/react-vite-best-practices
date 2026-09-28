import dayjs from 'dayjs'
import { describe, expect, it } from 'vitest'
import {
  alertTime,
  alertsFor,
  applyInput,
  countdown,
  dueAlerts,
  nextAlert,
  nextOccurrence,
  nthWeekday,
  occurrencesBetween,
  occurrencesByDay,
  pastOccurrences,
  reminderIssues,
  sanitizeReminder,
  upcoming,
  upcomingGroup,
  yearsAt,
  type Reminder,
} from '@/features/showcases/data/reminders'
import {
  alarmTrigger,
  buildRemindersIcs,
  recurrenceRule,
} from '@/features/showcases/data/remindersIcs'
import { seedReminders } from '@/features/showcases/data/remindersSeed'
import { cleanPersisted } from '@/features/showcases/hooks/useRemindersStore'

function reminder(overrides: Partial<Reminder> = {}): Reminder {
  return {
    id: 'r',
    title: 'Test',
    category: 'birthday',
    date: '1990-10-09',
    repeat: 'yearly',
    countYears: true,
    offsets: [1, 0],
    alarmTime: '09:00',
    gifts: [],
    ...overrides,
  }
}

const seed = (id: string) => seedReminders.find((entry) => entry.id === id)!
const at = (iso: string) => dayjs(iso).valueOf()

describe('occurrences', () => {
  it('finds the next yearly date, this year or next', () => {
    expect(nextOccurrence(reminder(), '2026-09-28')).toBe('2026-10-09')
    expect(nextOccurrence(reminder(), '2026-10-09')).toBe('2026-10-09')
    expect(nextOccurrence(reminder(), '2026-10-10')).toBe('2027-10-09')
  })

  it('keeps a 29 February birthday on the 28th outside leap years', () => {
    const leap = reminder({ date: '1996-02-29' })
    expect(nextOccurrence(leap, '2026-09-28')).toBe('2027-02-28')
    expect(nextOccurrence(leap, '2027-03-01')).toBe('2028-02-29')
    expect(yearsAt(leap, '2028-02-29')).toBe(32)
  })

  it('puts a monthly day on the last day of shorter months', () => {
    const bill = reminder({ date: '2024-01-31', repeat: 'monthly', countYears: false })
    expect(occurrencesBetween(bill, '2027-01-01', '2027-04-30')).toEqual([
      '2027-01-31',
      '2027-02-28',
      '2027-03-31',
      '2027-04-30',
    ])
    expect(nextOccurrence(bill, '2026-09-01')).toBe('2026-09-30')
  })

  it('does not repeat before the first date or after a one-time date', () => {
    const monthly = reminder({ date: '2026-11-05', repeat: 'monthly' })
    expect(nextOccurrence(monthly, '2026-09-28')).toBe('2026-11-05')
    const once = reminder({ date: '2026-10-01', repeat: 'once' })
    expect(nextOccurrence(once, '2026-09-28')).toBe('2026-10-01')
    expect(nextOccurrence(once, '2026-10-02')).toBeNull()
  })

  it('works out Mother’s and Father’s Day from their weekday rule', () => {
    expect(nthWeekday(2027, 5, 0, 2)).toBe('2027-05-09')
    expect(nthWeekday(2027, 6, 0, 3)).toBe('2027-06-20')
    expect(nthWeekday(2026, 12, 5, -1)).toBe('2026-12-25')
    expect(nextOccurrence(seed('mothers-day'), '2026-09-28')).toBe('2027-05-09')
  })

  it('takes the bayrams from their published dates', () => {
    expect(nextOccurrence(seed('ramadan-feast'), '2026-09-28')).toBe('2027-03-09')
    expect(nextOccurrence(seed('sacrifice-feast'), '2026-09-28')).toBe('2027-05-16')
    expect(nextOccurrence(seed('sacrifice-feast'), '2027-05-17')).toBeNull()
  })

  it('counts the years of a birthday, a wedding and a holiday', () => {
    expect(yearsAt(seed('mum-birthday'), '2026-10-09')).toBe(64)
    expect(yearsAt(seed('wedding'), '2026-10-19')).toBe(7)
    expect(yearsAt(seed('republic-day'), '2026-10-29')).toBe(103)
    expect(yearsAt(seed('rent'), '2026-10-05')).toBeNull()
  })

  it('lists past years, most recent first, without the original date', () => {
    expect(pastOccurrences(seed('wedding'), '2026-09-28', 3)).toEqual([
      '2025-10-19',
      '2024-10-19',
      '2023-10-19',
    ])
    expect(pastOccurrences(reminder({ date: '2025-10-09' }), '2026-09-28')).toEqual([])
  })

  it('sorts upcoming days and groups them', () => {
    const list = upcoming(seedReminders, '2026-09-28')
    expect(list[0]?.reminder.id).toBe('phone-bill')
    expect(list[0]?.days).toBe(2)
    expect(list.map((item) => item.reminder.id)).toContain('passport')
    expect(upcomingGroup(0)).toBe('today')
    expect(upcomingGroup(7)).toBe('week')
    expect(upcomingGroup(20)).toBe('month')
    expect(upcomingGroup(40)).toBe('later')
  })

  it('maps a month to the reminders on each day', () => {
    const days = occurrencesByDay(seedReminders, '2026-10-01', '2026-10-31')
    expect(days.get('2026-10-29')?.map((entry) => entry.id)).toEqual(['republic-day'])
    expect(days.get('2026-10-09')?.map((entry) => entry.id)).toEqual(['mum-birthday'])
  })
})

describe('alarms', () => {
  it('rings each offset at the alarm time', () => {
    const alerts = alertsFor(reminder({ offsets: [7, 1, 0] }), '2026-10-09')
    expect(alerts.map((alert) => dayjs(alert.at).format('YYYY-MM-DD HH:mm'))).toEqual([
      '2026-10-02 09:00',
      '2026-10-08 09:00',
      '2026-10-09 09:00',
    ])
    expect(alerts[0]?.key).toBe('r:2026-10-09:7')
    expect(alertTime('2026-10-09', 0, 'nonsense')).toBe(at('2026-10-09T09:00'))
  })

  it('rings a due alert once, and not after the grace window', () => {
    const list = [reminder()]
    const now = at('2026-10-08T09:05')
    expect(dueAlerts(list, now, new Set()).map((alert) => alert.key)).toEqual(['r:2026-10-09:1'])
    expect(dueAlerts(list, now, new Set(['r:2026-10-09:1']))).toEqual([])
    expect(dueAlerts(list, at('2026-10-08T09:30'), new Set())).toEqual([])
    expect(dueAlerts(list, at('2026-10-08T08:59'), new Set())).toEqual([])
  })

  it('finds the next alarm, across a year boundary', () => {
    const next = nextAlert([reminder({ date: '1990-01-02' })], at('2026-12-31T12:00'))
    expect(next?.key).toBe('r:2027-01-02:1')
  })

  it('counts down in days, hours, minutes and seconds', () => {
    expect(countdown(at('2026-10-08T09:00'), at('2026-10-09T10:30'))).toEqual({
      days: 1,
      hours: 1,
      minutes: 30,
      seconds: 0,
      past: false,
    })
    expect(countdown(at('2026-10-09'), at('2026-10-08')).past).toBe(true)
  })
})

describe('editing', () => {
  it('checks the form values', () => {
    const input = {
      title: ' ',
      category: 'birthday' as const,
      date: '2026-13-40',
      repeat: 'yearly' as const,
      countYears: true,
      offsets: [],
      alarmTime: '25:00',
    }
    expect(reminderIssues(input)).toEqual(['title', 'date', 'alarmTime'])
  })

  it('builds a reminder from the form and keeps a seeded translation only for the same title', () => {
    const created = applyInput(
      {
        title: '  Elif’s birthday ',
        category: 'birthday',
        date: '1999-05-03',
        repeat: 'monthly',
        countYears: true,
        offsets: [0, 7, 7, 5],
        alarmTime: '08:15',
        gifts: ['Book', ' '],
      },
      1_000,
    )
    expect(created.title).toBe('Elif’s birthday')
    expect(created.countYears).toBe(false)
    expect(created.offsets).toEqual([7, 0])
    expect(created.gifts.map((gift) => gift.text)).toEqual(['Book'])
    expect(created.id).not.toBe('calendar')

    const mum = seed('mum-birthday')
    const base = {
      category: mum.category,
      date: mum.date,
      repeat: mum.repeat,
      countYears: true,
      offsets: mum.offsets,
      alarmTime: mum.alarmTime,
    }
    expect(applyInput({ ...base, title: 'Annemin doğum günü' }, 1, mum).i18n).toEqual(mum.i18n)
    expect(applyInput({ ...base, title: 'Anne' }, 1, mum).i18n).toBeUndefined()
  })

  it('keeps the calendar of a day that moves every year', () => {
    const edited = applyInput(
      {
        title: 'Mother’s Day',
        category: 'holiday',
        date: '2030-01-01',
        repeat: 'once',
        countYears: false,
        offsets: [0],
        alarmTime: '10:00',
      },
      1,
      seed('mothers-day'),
    )
    expect(edited.rule).toEqual(seed('mothers-day').rule)
    expect(edited.repeat).toBe('yearly')
  })

  it('cleans whatever was stored', () => {
    expect(sanitizeReminder({ id: 1 })).toBeNull()
    expect(
      sanitizeReminder({
        id: 'x',
        title: 'X',
        date: '2020-01-01',
        category: 'nope',
        offsets: [99, 1],
      }),
    ).toMatchObject({
      category: 'other',
      repeat: 'yearly',
      offsets: [1],
      alarmTime: '09:00',
      gifts: [],
    })
    const state = cleanPersisted({ reminders: [{ id: 'bad' }], handled: [1, 'a'], muted: 'yes' })
    expect(state.reminders).toEqual([])
    expect(state.handled).toEqual(['a'])
    expect(state.muted).toBe(false)
    expect(cleanPersisted(undefined).reminders).toHaveLength(seedReminders.length)
  })
})

describe('ics export', () => {
  it('writes alarm triggers relative to the start of the day', () => {
    expect(alarmTrigger(0, '09:00')).toBe('PT9H')
    expect(alarmTrigger(1, '09:00')).toBe('-PT15H')
    expect(alarmTrigger(7, '08:30')).toBe('-P6DT15H30M')
    expect(alarmTrigger(1, '00:00')).toBe('-P1D')
    expect(alarmTrigger(0, '00:00')).toBe('PT0M')
  })

  it('repeats each kind of day the way the app does', () => {
    expect(recurrenceRule(reminder())).toBe('FREQ=YEARLY')
    expect(recurrenceRule(reminder({ date: '1996-02-29' }))).toBe(
      'FREQ=YEARLY;BYMONTH=2;BYMONTHDAY=-1',
    )
    expect(recurrenceRule(reminder({ date: '2024-01-30', repeat: 'monthly' }))).toBe(
      'FREQ=MONTHLY;BYMONTHDAY=28,29,30;BYSETPOS=-1',
    )
    expect(recurrenceRule(reminder({ date: '2024-01-05', repeat: 'monthly' }))).toBe('FREQ=MONTHLY')
    expect(recurrenceRule(seed('fathers-day'))).toBe('FREQ=YEARLY;BYMONTH=6;BYDAY=3SU')
    expect(recurrenceRule(seed('ramadan-feast'))).toBeUndefined()
  })

  it('builds a calendar with all-day events and alarms', () => {
    const ics = buildRemindersIcs(
      [seed('mum-birthday'), seed('ramadan-feast')],
      'tr',
      at('2026-09-28T10:00'),
    )
    expect(ics).toContain('BEGIN:VCALENDAR\r\n')
    expect(ics).toContain('DTSTART;VALUE=DATE:19621009')
    expect(ics).toContain('SUMMARY:Annemin doğum günü')
    expect(ics).toContain('TRIGGER:-P6DT15H')
    expect(ics).toContain('UID:ramadan-feast-20270309@anlar.example')
    expect(ics.match(/BEGIN:VEVENT/g)).toHaveLength(3)
    expect(ics.endsWith('END:VCALENDAR\r\n')).toBe(true)
  })
})
