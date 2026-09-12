import { describe, expect, it } from 'vitest'
import {
  layoutAllDay,
  layoutDay,
  minutesFromMidnight,
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
