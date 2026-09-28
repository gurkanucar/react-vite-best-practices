import { describe, expect, it } from 'vitest'
import { caseStudies } from './agency'
import {
  CALL_TIMES,
  callSlots,
  disciplineCounts,
  filterCases,
  findCase,
  isSlotTaken,
  nextCase,
  parseDiscipline,
} from './agencyLogic'

describe('agency portfolio', () => {
  it('reads a discipline from the address and ignores anything else', () => {
    expect(parseDiscipline('motion')).toBe('motion')
    expect(parseDiscipline('Motion')).toBeNull()
    expect(parseDiscipline(null)).toBeNull()
  })

  it('filters projects by discipline and counts every discipline', () => {
    const motion = filterCases(caseStudies, 'motion')
    expect(motion.map((item) => item.id)).toEqual(['orbit-festival', 'paper-harbor', 'vela-air'])
    expect(filterCases(caseStudies, null)).toHaveLength(caseStudies.length)

    const counts = disciplineCounts(caseStudies)
    expect(counts.all).toBe(8)
    expect(counts.motion).toBe(3)
    expect(counts.branding).toBe(4)
  })

  it('finds a case study and wraps from the last project to the first', () => {
    expect(findCase('atlas-museum')?.client).toBe('Atlas Museum of Design')
    expect(findCase('nope')).toBeUndefined()
    expect(nextCase('kora-bank').id).toBe('orbit-festival')
    expect(nextCase('vela-air').id).toBe('kora-bank')
  })
})

describe('intro call slots', () => {
  it('offers the next five weekdays from tomorrow, skipping the weekend', () => {
    // A Friday afternoon: the next five working days are Monday to Friday.
    const days = callSlots(new Date(2026, 9, 2, 15, 0))
    expect(days.map((day) => day.date)).toEqual([
      '2026-10-05',
      '2026-10-06',
      '2026-10-07',
      '2026-10-08',
      '2026-10-09',
    ])
    expect(days[0]!.slots.map((slot) => slot.time)).toEqual([...CALL_TIMES])
  })

  it('never offers today, even first thing in the morning', () => {
    const [first] = callSlots(new Date(2026, 9, 6, 7, 0))
    expect(first!.date).toBe('2026-10-07')
  })

  it('keeps a booked slot booked on every visit, and leaves most slots free', () => {
    const first = callSlots(new Date(2026, 9, 2))
    const second = callSlots(new Date(2026, 9, 2, 18))
    expect(second).toEqual(first)

    const slots = first.flatMap((day) => day.slots)
    const free = slots.filter((slot) => slot.available)
    expect(free.length).toBeGreaterThan(slots.length / 2)
    expect(free.length).toBeLessThan(slots.length)
    for (const slot of slots) expect(slot.available).toBe(!isSlotTaken(slot.id))
  })
})
