import { describe, expect, it } from 'vitest'
import { layoutDay, minutesFromMidnight, type CalendarEvent } from '@/features/calendar/types'

function event(id: string, start: string, end: string): CalendarEvent {
  return {
    id,
    titleId: id,
    category: 'meeting',
    start: `2026-09-14T${start}`,
    end: `2026-09-14T${end}`,
    attendees: [],
  }
}

const lanesOf = (events: CalendarEvent[]) =>
  Object.fromEntries(
    layoutDay(events).map((entry) => [entry.event.id, `${entry.lane}/${entry.lanes}`]),
  )

describe('layoutDay', () => {
  it('gives a lone event the full width', () => {
    expect(lanesOf([event('a', '09:00', '10:00')])).toEqual({ a: '0/1' })
  })

  it('splits two overlapping events in half', () => {
    expect(lanesOf([event('a', '09:00', '10:00'), event('b', '09:30', '10:30')])).toEqual({
      a: '0/2',
      b: '1/2',
    })
  })

  it('keeps back-to-back events at full width', () => {
    expect(lanesOf([event('a', '09:00', '10:00'), event('b', '10:00', '11:00')])).toEqual({
      a: '0/1',
      b: '0/1',
    })
  })

  it('reuses a lane once its event has ended', () => {
    // c starts after a ends, so it takes a's lane rather than opening a third.
    expect(
      lanesOf([
        event('a', '09:00', '10:00'),
        event('b', '09:30', '12:00'),
        event('c', '10:00', '11:00'),
      ]),
    ).toEqual({ a: '0/2', b: '1/2', c: '0/2' })
  })

  it('holds transitively overlapping events in one cluster', () => {
    // a and c never touch, but both overlap b, so all three share the same width.
    expect(
      lanesOf([
        event('a', '09:00', '10:00'),
        event('b', '09:30', '11:30'),
        event('c', '11:00', '12:00'),
      ]),
    ).toEqual({ a: '0/2', b: '1/2', c: '0/2' })
  })

  it('lifts an event shorter than the minimum to a readable height', () => {
    const [entry] = layoutDay([event('a', '09:00', '09:05')])

    expect(entry.endMinutes - entry.startMinutes).toBe(30)
  })

  it('leaves all-day events out of the time grid', () => {
    const allDay: CalendarEvent = { ...event('a', '00:00', '23:59'), allDay: true }

    expect(layoutDay([allDay])).toEqual([])
  })
})

describe('minutesFromMidnight', () => {
  it('reads the local time out of the stamp', () => {
    expect(minutesFromMidnight('2026-09-14T09:30')).toBe(570)
    expect(minutesFromMidnight('2026-09-14T00:00')).toBe(0)
  })
})
