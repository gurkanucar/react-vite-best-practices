import dayjs from 'dayjs'
import { describe, expect, it } from 'vitest'
import { eventsForWeek, eventsInRange } from '@/features/calendar/data'

// 2026-09-06 is a Sunday and 2026-09-07 the Monday after it.
const sundayStart = dayjs('2026-09-06')
const mondayStart = dayjs('2026-09-07')

const weekdaysOf = (titleId: string, weekStart: dayjs.Dayjs) =>
  eventsForWeek(weekStart)
    .filter((event) => event.titleId === titleId)
    .map((event) => dayjs(event.start).format('ddd'))

describe('eventsForWeek', () => {
  it('puts the standup on weekdays whichever day the locale starts the week on', () => {
    expect(weekdaysOf('standup', sundayStart)).toEqual(['Mon', 'Tue', 'Wed', 'Thu', 'Fri'])
    expect(weekdaysOf('standup', mondayStart)).toEqual(['Mon', 'Tue', 'Wed', 'Thu', 'Fri'])
  })

  it('keeps every generated event inside the week it was asked for', () => {
    const events = eventsForWeek(sundayStart)

    for (const event of events) {
      const start = dayjs(event.start)

      expect(start.isBefore(sundayStart)).toBe(false)
      expect(start.isBefore(sundayStart.add(7, 'day'))).toBe(true)
    }
  })

  it('does not repeat a fortnightly event in consecutive weeks', () => {
    const thisWeek = eventsForWeek(sundayStart).some((event) => event.titleId === 'retro')
    const nextWeek = eventsForWeek(sundayStart.add(7, 'day')).some((e) => e.titleId === 'retro')

    expect(thisWeek).not.toBe(nextWeek)
  })
})

describe('eventsInRange', () => {
  it('returns only events starting inside the range', () => {
    const start = dayjs('2026-09-07')
    const end = start.add(1, 'day')

    for (const event of eventsInRange(start, end)) {
      expect(dayjs(event.start).format('YYYY-MM-DD')).toBe('2026-09-07')
    }
  })

  it('gives every event a unique id across a month', () => {
    const ids = eventsInRange(dayjs('2026-09-01'), dayjs('2026-10-01')).map((event) => event.id)

    expect(new Set(ids).size).toBe(ids.length)
  })
})
