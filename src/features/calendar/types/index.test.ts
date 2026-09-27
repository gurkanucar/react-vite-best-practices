import { describe, expect, it } from 'vitest'
import {
  applyChanges,
  layoutAllDay,
  layoutDay,
  limitLanes,
  minutesFromMidnight,
  moveEvent,
  resizeEvent,
  selectionRange,
  slotAt,
  stampAt,
  snapMinutes,
  occursOn,
  spanInDays,
  type CalendarEvent,
} from '@/features/calendar/types'

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

function allDay(id: string, startDate: string, endDate: string): CalendarEvent {
  return {
    id,
    titleId: id,
    category: 'personal',
    start: `${startDate}T00:00`,
    end: `${endDate}T23:59`,
    attendees: [],
    allDay: true,
  }
}

describe('occursOn', () => {
  it('ties a timed event to the single day it starts on', () => {
    const timed = event('a', '09:00', '10:00')

    expect(occursOn(timed, '2026-09-14')).toBe(true)
    expect(occursOn(timed, '2026-09-15')).toBe(false)
  })

  it('spreads an all-day event over every day it covers, ends included', () => {
    const week = allDay('leave', '2026-09-14', '2026-09-20')

    expect(occursOn(week, '2026-09-13')).toBe(false)
    expect(occursOn(week, '2026-09-14')).toBe(true)
    expect(occursOn(week, '2026-09-17')).toBe(true)
    expect(occursOn(week, '2026-09-20')).toBe(true)
    expect(occursOn(week, '2026-09-21')).toBe(false)
  })
})

describe('spanInDays', () => {
  it('counts the day it starts on', () => {
    expect(spanInDays(allDay('a', '2026-09-14', '2026-09-14'))).toBe(1)
    expect(spanInDays(allDay('b', '2026-09-14', '2026-09-16'))).toBe(3)
    expect(spanInDays(allDay('c', '2026-09-14', '2026-09-20'))).toBe(7)
  })
})

describe('layoutAllDay', () => {
  const week = [
    '2026-09-13',
    '2026-09-14',
    '2026-09-15',
    '2026-09-16',
    '2026-09-17',
    '2026-09-18',
    '2026-09-19',
  ]

  it('places a band across the columns the event covers', () => {
    const [band] = layoutAllDay([allDay('conf', '2026-09-16', '2026-09-18')], week)

    expect(band).toMatchObject({ from: 3, span: 3, lane: 0 })
  })

  it('clips an event that began before the first visible day', () => {
    // Runs Mon the 7th to Sun the 13th; only its last day is in this week.
    const [band] = layoutAllDay([allDay('leave', '2026-09-07', '2026-09-13')], week)

    expect(band).toMatchObject({ from: 0, span: 1 })
  })

  it('gives overlapping bands their own lane and lets a later one reuse it', () => {
    const bands = layoutAllDay(
      [
        allDay('a', '2026-09-14', '2026-09-16'),
        allDay('b', '2026-09-15', '2026-09-17'),
        allDay('c', '2026-09-18', '2026-09-19'),
      ],
      week,
    )

    expect(bands.map((band) => band.lane)).toEqual([0, 1, 0])
  })

  it('leaves timed events out of the all-day area', () => {
    expect(layoutAllDay([event('a', '09:00', '10:00')], week)).toEqual([])
  })
})

describe('limitLanes', () => {
  const crowded = [
    event('a', '09:00', '10:00'),
    event('b', '09:15', '10:00'),
    event('c', '09:30', '10:30'),
    event('d', '09:45', '11:00'),
  ]

  it('leaves a cluster alone when it fits', () => {
    const { visible, hidden } = limitLanes(layoutDay(crowded), 4)

    expect(visible).toHaveLength(4)
    expect(hidden).toHaveLength(0)
  })

  it('keeps the first lanes and gathers the rest behind one marker', () => {
    const { visible, hidden } = limitLanes(layoutDay(crowded), 2)

    expect(visible.map((entry) => entry.event.id)).toEqual(['a', 'b'])
    expect(visible.every((entry) => entry.lanes === 2)).toBe(true)
    expect(hidden).toEqual([
      { startMinutes: 9 * 60 + 30, endMinutes: 11 * 60, events: [crowded[2], crowded[3]] },
    ])
  })
})

describe('moving and resizing', () => {
  const standup = event('s', '09:00', '09:30')

  it('snaps a drag distance to quarter hours', () => {
    // An hour row is 52px, so 20px is about 23 minutes and snaps to 30, and 10px to 15.
    expect(snapMinutes(20)).toBe(30)
    expect(snapMinutes(10)).toBe(15)
    expect(snapMinutes(-40)).toBe(-45)
  })

  it('moves an event across days and hours, keeping its length', () => {
    expect(moveEvent(standup, 2, 90)).toEqual({
      start: '2026-09-16T10:30',
      end: '2026-09-16T11:00',
    })
  })

  it('keeps a moved event inside its day', () => {
    expect(moveEvent(standup, 0, 20 * 60)).toEqual({
      start: '2026-09-14T23:30',
      end: '2026-09-15T00:00',
    })
    expect(moveEvent(standup, 0, -12 * 60).start).toBe('2026-09-14T00:00')
  })

  it('stretches from the bottom edge but never below one step', () => {
    expect(resizeEvent(standup, 45).end).toBe('2026-09-14T10:15')
    expect(resizeEvent(standup, -120).end).toBe('2026-09-14T09:15')
  })

  it('applies changes over the generated schedule by id', () => {
    const [changed] = applyChanges([standup], { s: { start: 'x', end: 'y' } })

    expect(changed).toMatchObject({ id: 's', start: 'x', end: 'y' })
  })

  describe('sweeping out a new event', () => {
    it('reads the slot under the pointer, rounded down to a quarter hour', () => {
      // 52px an hour: 9.9 hours down is 09:54, which is inside the 09:45 slot.
      expect(slotAt(9.9 * 52)).toBe(9 * 60 + 45)
      expect(slotAt(-20)).toBe(0)
      expect(slotAt(30 * 52)).toBe(24 * 60 - 15)
    })

    it('covers both ends of a drag in either direction, and an hour for a plain press', () => {
      expect(selectionRange(540, 600)).toEqual({ start: 540, end: 615 })
      expect(selectionRange(600, 540)).toEqual({ start: 540, end: 615 })
      expect(selectionRange(540, 540)).toEqual({ start: 540, end: 600 })
      // A press late in the evening stops at the end of the day.
      expect(selectionRange(23 * 60 + 30, 23 * 60 + 30).end).toBe(24 * 60 - 1)
    })

    it('writes minutes back as a local stamp', () => {
      expect(stampAt('2026-09-14', 9 * 60 + 5)).toBe('2026-09-14T09:05')
      expect(stampAt('2026-09-14', 24 * 60)).toBe('2026-09-14T23:59')
    })
  })
})
