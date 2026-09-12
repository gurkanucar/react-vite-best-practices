import dayjs from 'dayjs'
import type { CalendarEvent, EventCategory } from '@/features/calendar/types'

/** dayjs weekday numbering: 0 is Sunday. */
const MONDAY = 1
const TUESDAY = 2
const WEDNESDAY = 3
const THURSDAY = 4
const FRIDAY = 5
const WORKING_WEEK = [MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY]

interface EventTemplate {
  titleId: string
  category: EventCategory
  /**
   * The weekday the event falls on, not an offset from the start of the week: the week
   * starts on Sunday in English and Monday in Turkish, and a standup should land on
   * Monday either way.
   */
  weekdays: number[]
  start: string
  end: string
  location?: string
  attendees: string[]
  allDay?: boolean
  /** How many days an all-day event covers, counting the day it starts on. */
  spanDays?: number
  /** Repeat every N weeks rather than every week, so a month does not read as one week copied six times. */
  everyNWeeks?: number
  /** Which of those N weeks it falls in. */
  weekOffset?: number
}

const templates: EventTemplate[] = [
  {
    titleId: 'standup',
    category: 'meeting',
    weekdays: WORKING_WEEK,
    start: '09:15',
    end: '09:30',
    location: 'Zoom',
    attendees: ['Maya Chen', 'Noah Williams', 'Ava Patel'],
  },
  {
    titleId: 'focus',
    category: 'focus',
    weekdays: [MONDAY, TUESDAY, THURSDAY],
    start: '10:00',
    end: '12:00',
    attendees: [],
  },

  {
    titleId: 'designReview',
    category: 'review',
    weekdays: [TUESDAY],
    start: '13:30',
    end: '14:30',
    location: 'Studio',
    attendees: ['Ava Patel', 'Maya Chen'],
  },
  {
    titleId: 'oneOnOne',
    category: 'meeting',
    weekdays: [MONDAY],
    start: '15:00',
    end: '15:30',
    location: 'Room 4',
    attendees: ['Noah Williams'],
    everyNWeeks: 2,
  },

  {
    titleId: 'architecture',
    category: 'review',
    weekdays: [WEDNESDAY],
    start: '11:00',
    end: '12:30',
    location: 'Room 2',
    attendees: ['Maya Chen', 'Noah Williams'],
  },
  {
    titleId: 'interview',
    category: 'meeting',
    weekdays: [WEDNESDAY],
    start: '11:30',
    end: '12:15',
    location: 'Zoom',
    attendees: ['Ava Patel'],
    everyNWeeks: 2,
    weekOffset: 1,
  },
  {
    titleId: 'retro',
    category: 'meeting',
    weekdays: [FRIDAY],
    start: '16:00',
    end: '17:00',
    location: 'Room 2',
    attendees: ['Maya Chen', 'Noah Williams', 'Ava Patel'],
    everyNWeeks: 2,
  },

  {
    titleId: 'planning',
    category: 'meeting',
    weekdays: [MONDAY],
    start: '10:30',
    end: '12:00',
    location: 'Room 1',
    attendees: ['Maya Chen', 'Noah Williams', 'Ava Patel'],
    everyNWeeks: 2,
  },
  {
    titleId: 'pairing',
    category: 'focus',
    weekdays: [THURSDAY],
    start: '14:00',
    end: '16:00',
    location: 'Zoom',
    attendees: ['Noah Williams'],
  },

  {
    titleId: 'release',
    category: 'release',
    weekdays: [THURSDAY],
    start: '17:00',
    end: '19:00',
    location: 'Production',
    attendees: ['Maya Chen'],
    everyNWeeks: 2,
    weekOffset: 1,
  },
  {
    titleId: 'customerCall',
    category: 'meeting',
    weekdays: [TUESDAY],
    start: '09:45',
    end: '10:30',
    location: 'Zoom',
    attendees: ['Ava Patel', 'Noah Williams'],
  },
  {
    titleId: 'accessibility',
    category: 'review',
    weekdays: [TUESDAY],
    start: '10:00',
    end: '11:00',
    location: 'Room 4',
    attendees: ['Ava Patel'],
    everyNWeeks: 3,
  },

  {
    titleId: 'demo',
    category: 'meeting',
    weekdays: [FRIDAY],
    start: '15:00',
    end: '16:00',
    location: 'All hands',
    attendees: ['Maya Chen', 'Noah Williams', 'Ava Patel'],
    everyNWeeks: 2,
    weekOffset: 1,
  },
  {
    titleId: 'dentist',
    category: 'personal',
    weekdays: [WEDNESDAY],
    start: '08:00',
    end: '09:00',
    attendees: [],
    everyNWeeks: 4,
    weekOffset: 2,
  },

  // All-day events, one of each shape: a single day, a long weekend, and a whole week.
  {
    titleId: 'holiday',
    category: 'personal',
    weekdays: [MONDAY],
    start: '00:00',
    end: '23:59',
    attendees: [],
    allDay: true,
    everyNWeeks: 4,
    weekOffset: 1,
  },
  {
    titleId: 'offsite',
    category: 'personal',
    weekdays: [FRIDAY],
    start: '00:00',
    end: '23:59',
    location: 'Lisbon',
    attendees: ['Maya Chen', 'Noah Williams', 'Ava Patel'],
    allDay: true,
    everyNWeeks: 4,
    weekOffset: 3,
  },
  {
    titleId: 'conference',
    category: 'review',
    weekdays: [WEDNESDAY],
    start: '00:00',
    end: '23:59',
    location: 'Berlin',
    attendees: ['Maya Chen', 'Ava Patel'],
    allDay: true,
    spanDays: 3,
    everyNWeeks: 4,
    weekOffset: 2,
  },
  {
    titleId: 'vacation',
    category: 'personal',
    weekdays: [MONDAY],
    start: '00:00',
    end: '23:59',
    attendees: ['Noah Williams'],
    allDay: true,
    spanDays: 7,
    everyNWeeks: 4,
    weekOffset: 0,
  },
]

const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000

/**
 * A stable index for any week, without pulling in dayjs' week-of-year plugin. It only
 * has to be consistent from one week to the next, which a count of epoch weeks is.
 */
function weekIndex(day: dayjs.Dayjs): number {
  return Math.floor(day.startOf('day').valueOf() / MS_PER_WEEK)
}

function occursInWeek(template: EventTemplate, weekStart: dayjs.Dayjs): boolean {
  if (!template.everyNWeeks) return true

  return weekIndex(weekStart) % template.everyNWeeks === (template.weekOffset ?? 0)
}

/**
 * Events are generated from weekly rules rather than stored as fixed dates, so the
 * calendar always opens on a populated week however long after this was written it runs.
 * A real application would fetch a date range from an API instead.
 */
export function eventsForWeek(weekStart: dayjs.Dayjs): CalendarEvent[] {
  const events: CalendarEvent[] = []

  for (const template of templates) {
    if (!occursInWeek(template, weekStart)) continue

    for (const weekday of template.weekdays) {
      // The offset into this week that lands on the wanted weekday, whichever day the
      // locale starts the week on.
      const offset = (weekday - weekStart.day() + 7) % 7
      const startDay = weekStart.add(offset, 'day')
      const date = startDay.format('YYYY-MM-DD')
      // A multi-day event is one event with a later end date, not one event per day: that
      // is what lets the week view draw it as a single band and the detail show a range.
      const endDate = startDay.add((template.spanDays ?? 1) - 1, 'day').format('YYYY-MM-DD')

      events.push({
        id: `${template.titleId}-${date}`,
        titleId: template.titleId,
        category: template.category,
        start: `${date}T${template.start}`,
        end: `${endDate}T${template.end}`,
        location: template.location,
        attendees: template.attendees,
        allDay: template.allDay,
      })
    }
  }

  return events
}

/**
 * Every event overlapping the given range, assembled week by week. Overlap rather than
 * "starts inside": a week-long event that began before the range still belongs on the days
 * of it that fall inside. The week before is generated too, for the same reason.
 */
export function eventsInRange(rangeStart: dayjs.Dayjs, rangeEnd: dayjs.Dayjs): CalendarEvent[] {
  const events: CalendarEvent[] = []
  let cursor = rangeStart.startOf('day').subtract(7, 'day')

  while (cursor.isBefore(rangeEnd)) {
    events.push(...eventsForWeek(cursor))
    cursor = cursor.add(7, 'day')
  }

  const seen = new Set<string>()

  return events.filter((event) => {
    if (seen.has(event.id)) return false

    const start = dayjs(event.start)
    const end = dayjs(event.end)

    if (start.isAfter(rangeEnd) || end.isBefore(rangeStart)) return false

    seen.add(event.id)

    return true
  })
}
