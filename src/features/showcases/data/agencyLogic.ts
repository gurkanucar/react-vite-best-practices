import dayjs from 'dayjs'
import { caseStudies, DISCIPLINES, type CaseStudy, type Discipline } from './agency'

/** A `?discipline=` value, or `null` for anything that is not one: the whole portfolio. */
export function parseDiscipline(value: string | null): Discipline | null {
  return DISCIPLINES.find((discipline) => discipline === value) ?? null
}

export function filterCases(cases: CaseStudy[], discipline: Discipline | null) {
  return discipline ? cases.filter((item) => item.disciplines.includes(discipline)) : cases
}

export function disciplineCounts(cases: CaseStudy[]): Record<Discipline | 'all', number> {
  const counts = { all: cases.length } as Record<Discipline | 'all', number>
  for (const discipline of DISCIPLINES) {
    counts[discipline] = cases.filter((item) => item.disciplines.includes(discipline)).length
  }
  return counts
}

export function findCase(id: string | undefined) {
  return caseStudies.find((item) => item.id === id)
}

/** The project after this one, wrapping to the first, so a case study never ends in a wall. */
export function nextCase(id: string, cases: CaseStudy[] = caseStudies) {
  const index = cases.findIndex((item) => item.id === id)
  return cases[(index + 1) % cases.length]!
}

export const SERVICES = ['brand', 'website', 'product', 'motion', 'campaign', 'strategy'] as const
export type Service = (typeof SERVICES)[number]

export const BUDGET_BANDS = ['under25', '25to50', '50to100', 'over100'] as const
export type BudgetBand = (typeof BUDGET_BANDS)[number]

export const TIMELINES = ['asap', 'quarter', 'half', 'flexible'] as const
export type Timeline = (typeof TIMELINES)[number]

export const CALL_TIMES = ['10:00', '11:30', '14:00', '15:30', '17:00'] as const

export interface CallSlot {
  /** Local start, `YYYY-MM-DDTHH:mm`. */
  id: string
  time: string
  available: boolean
}

export interface CallDay {
  /** `YYYY-MM-DD`. */
  date: string
  slots: CallSlot[]
}

/**
 * A slot another client already booked. Derived from the date and time, so a slot that is taken
 * stays taken on every visit instead of changing with each render.
 */
export function isSlotTaken(id: string) {
  let hash = 7
  for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) % 1_000_003
  return hash % 10 < 3
}

/**
 * Intro calls on the next `days` weekdays, starting tomorrow: a call needs a day's notice, and
 * the studio does not take calls at weekends.
 */
export function callSlots(now: Date, days = 5): CallDay[] {
  const result: CallDay[] = []
  let day = dayjs(now).startOf('day').add(1, 'day')

  while (result.length < days) {
    const weekday = day.day()
    if (weekday !== 0 && weekday !== 6) {
      const date = day.format('YYYY-MM-DD')
      result.push({
        date,
        slots: CALL_TIMES.map((time) => {
          const id = `${date}T${time}`
          return { id, time, available: !isSlotTaken(id) }
        }),
      })
    }
    day = day.add(1, 'day')
  }

  return result
}
