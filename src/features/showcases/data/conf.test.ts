import { describe, expect, it } from 'vitest'
import { confSessions, confSpeakers, findSession } from '@/features/showcases/data/confData'
import {
  buildIcs,
  escapeIcsText,
  foldIcsLine,
  icsTimestamp,
} from '@/features/showcases/data/confIcs'
import {
  agendaParam,
  CONF_STARTS_AT,
  countdownParts,
  dayLayout,
  findConflicts,
  instantOf,
  liveState,
  matchesFilters,
  emptyFilters,
  parseAgendaParam,
  parseFilters,
  parseNowOverride,
} from '@/features/showcases/data/confSchedule'
import {
  checkPromo,
  EARLY_BIRD_DEADLINE,
  expiryValid,
  luhnValid,
  quoteSelection,
  seatTiers,
  ticketTiers,
  tierState,
} from '@/features/showcases/data/confTickets'

const session = (id: string) => findSession(id)!
const SEPT_28 = Date.UTC(2026, 8, 28, 9)

describe('conference data', () => {
  it('gives every session a known speaker and keeps each hall free of double bookings', () => {
    const speakerIds = new Set(confSpeakers.map((speaker) => speaker.id))
    for (const entry of confSessions) {
      for (const id of entry.speakerIds) expect(speakerIds.has(id)).toBe(true)
    }
    const inHalls = confSessions.filter((entry) => entry.hall !== 'all')
    const clashes = findConflicts(inHalls).filter(([a, b]) => a.hall === b.hall)
    expect(clashes).toEqual([])
  })

  it('gives every speaker at least one session', () => {
    for (const speaker of confSpeakers) {
      expect(confSessions.some((entry) => entry.speakerIds.includes(speaker.id))).toBe(true)
    }
  })
})

describe('schedule logic', () => {
  it('turns Istanbul wall-clock time into UTC', () => {
    expect(new Date(instantOf(1, '09:15')).toISOString()).toBe('2026-11-19T06:15:00.000Z')
  })

  it('lays a day out in five-minute rows, with keynotes and breaks across every hall', () => {
    const layout = dayLayout(1)
    expect(layout.halls).toEqual(['main', 'hallB', 'studio'])
    expect(layout.startsAt).toBe(8 * 60 + 30)

    const keynote = layout.items.find((item) => item.session.id === 'd1-opening-keynote')!
    expect([keynote.columnStart, keynote.columnEnd]).toEqual([2, 5])
    // 09:15 is 45 minutes, nine rows, after 08:30; the header row makes it line 11.
    expect([keynote.rowStart, keynote.rowEnd]).toEqual([11, 20])

    const talk = layout.items.find((item) => item.session.id === 'd1-calm-software')!
    expect([talk.columnStart, talk.columnEnd]).toEqual([3, 4])
    expect(talk.rowEnd - talk.rowStart).toBe(8)
    expect(layout.marks[0]).toEqual({ label: '08:30', row: 2 })
  })

  it('finds sessions that overlap, but not ones that only touch', () => {
    const pairs = findConflicts([
      session('d1-rsc'),
      session('d1-calm-software'),
      session('d1-embeddings'),
      session('d1-migration'),
    ])
    expect(pairs.map(([a, b]) => `${a.id}+${b.id}`)).toEqual([
      'd1-rsc+d1-calm-software',
      'd1-rsc+d1-embeddings',
      'd1-calm-software+d1-embeddings',
    ])
    // 10:15–10:35 ends when 10:35–10:55 starts.
    expect(findConflicts([session('d1-browser-apis'), session('d1-embeddings')])).toEqual([])
  })

  it('reads a shared agenda from the address, dropping unknown ids, breaks and repeats', () => {
    expect(parseAgendaParam('d1-migration,nope,d1-lunch,d1-rsc,d1-rsc')).toEqual([
      'd1-rsc',
      'd1-migration',
    ])
    expect(agendaParam(['d2-motion', 'd1-rsc'])).toBe('d1-rsc,d2-motion')
    expect(parseAgendaParam(null)).toEqual([])
  })

  it('filters by track, format and a search in either language, keeping breaks', () => {
    const filters = parseFilters(new URLSearchParams('track=ai,bogus&format=panel'))
    expect(filters.tracks).toEqual(['ai'])
    expect(matchesFilters(session('d1-ai-panel'), filters)).toBe(true)
    expect(matchesFilters(session('d1-ai-return'), filters)).toBe(false)
    expect(matchesFilters(session('d1-lunch'), filters)).toBe(true)

    const search = (query: string) => ({ ...emptyFilters, query })
    expect(matchesFilters(session('d1-calm-software'), search('sakin yazilim'))).toBe(true)
    expect(matchesFilters(session('d1-calm-software'), search('lindqvist'))).toBe(true)
    expect(matchesFilters(session('d1-calm-software'), search('edge'))).toBe(false)
  })

  it('says what is on now and next during the event', () => {
    const state = liveState(parseNowOverride('2026-11-19T10:30')!)
    expect(state.phase).toBe('during')
    if (state.phase !== 'during') return
    expect(state.day).toBe(1)
    expect(state.now.map((entry) => entry.id)).toEqual([
      'd1-browser-apis',
      'd1-rsc',
      'd1-calm-software',
    ])
    expect(state.next.map((entry) => entry.id)).toEqual(['d1-embeddings'])

    expect(liveState(SEPT_28).phase).toBe('before')
    expect(liveState(Date.UTC(2026, 11, 1)).phase).toBe('after')
    expect(parseNowOverride('tomorrow')).toBeUndefined()
  })

  it('counts down to the doors opening and stops at zero', () => {
    expect(countdownParts(CONF_STARTS_AT, CONF_STARTS_AT - 90_061_000)).toEqual({
      days: 1,
      hours: 1,
      minutes: 1,
      seconds: 1,
      done: false,
    })
    expect(countdownParts(CONF_STARTS_AT, CONF_STARTS_AT + 5000).done).toBe(true)
  })
})

describe('calendar export', () => {
  it('escapes text values and writes UTC timestamps', () => {
    expect(escapeIcsText('a, b; c\\d\nnext')).toBe('a\\, b\\; c\\\\d\\nnext')
    expect(icsTimestamp(Date.UTC(2026, 10, 19, 7, 15))).toBe('20261119T071500Z')
  })

  it('folds long lines at 75 bytes without splitting a Turkish letter', () => {
    const folded = foldIcsLine(`SUMMARY:${'ğ'.repeat(60)}`)
    const lines = folded.split('\r\n')
    expect(lines.length).toBeGreaterThan(1)
    const encoder = new TextEncoder()
    for (const line of lines) expect(encoder.encode(line).length).toBeLessThanOrEqual(75)
    expect(lines.slice(1).every((line) => line.startsWith(' '))).toBe(true)
    expect(folded.replace(/\r\n /g, '')).toBe(`SUMMARY:${'ğ'.repeat(60)}`)
  })

  it('builds one calendar with an event per session', () => {
    const ics = buildIcs([session('d1-rsc'), session('d2-motion')], {
      language: 'tr',
      now: Date.UTC(2026, 8, 28, 10),
    })
    expect(ics.startsWith('BEGIN:VCALENDAR\r\nVERSION:2.0\r\n')).toBe(true)
    expect(ics.endsWith('END:VCALENDAR\r\n')).toBe(true)
    expect(ics.match(/BEGIN:VEVENT/g)).toHaveLength(2)
    expect(ics).toContain('UID:d1-rsc@relaysummit.example')
    expect(ics).toContain('DTSTART:20261119T071500Z')
    expect(ics).toContain('DTEND:20261119T075500Z')
    expect(ics).toContain('SUMMARY:Anlamı olan hareket')
    expect(ics).toContain('LOCATION:Ana Sahne\\, Kıyı Hall')
    expect(ics).not.toMatch(/[^\r]\n/)
  })
})

describe('tickets', () => {
  it('closes early bird after its deadline and keeps sold-out tiers closed', () => {
    const early = ticketTiers.find((tier) => tier.id === 'early')!
    expect(tierState(early, SEPT_28)).toBe('onSale')
    expect(tierState(early, EARLY_BIRD_DEADLINE + 1)).toBe('ended')
    expect(
      tierState(
        ticketTiers.find((tier) => tier.id === 'vip')!,
        SEPT_28,
      ),
    ).toBe('soldOut')
  })

  it('prices tickets and workshops, with VAT worked back out of the total', () => {
    const quote = quoteSelection(
      { tickets: { regular: 2, student: 1 }, workshops: { 'd0-design-tokens': 1 } },
      SEPT_28,
    )
    expect(quote.subtotal).toBe(2 * 3900 + 1450 + 1200)
    expect(quote.total).toBe(10_450)
    expect(quote.vat).toBeCloseTo(10_450 - 10_450 / 1.2, 2)
    expect(quote.issues).toEqual([])
    expect(seatTiers({ tickets: { regular: 2, student: 1 }, workshops: {} })).toEqual([
      'regular',
      'regular',
      'student',
    ])
  })

  it('applies promo codes, but never to team seats that are already discounted', () => {
    const percent = quoteSelection(
      { tickets: { team: 5, regular: 1 }, workshops: {}, promo: 'relay10' },
      SEPT_28,
    )
    expect(percent.discount).toBe(390)

    const community = quoteSelection(
      { tickets: { regular: 3 }, workshops: {}, promo: 'COMMUNITY' },
      SEPT_28,
    )
    expect(community.discount).toBe(1500)

    expect(checkPromo('EARLY2025', SEPT_28).status).toBe('expired')
    expect(checkPromo('FREE', SEPT_28).status).toBe('unknown')
  })

  it('reports what is wrong with an order', () => {
    expect(quoteSelection({ tickets: {}, workshops: {} }, SEPT_28).issues).toEqual(['empty'])
    expect(quoteSelection({ tickets: { team: 3 }, workshops: {} }, SEPT_28).issues).toEqual([
      'teamMinimum',
    ])
    expect(
      quoteSelection({ tickets: { regular: 1 }, workshops: { 'd0-llm-feature': 2 } }, SEPT_28)
        .issues,
    ).toEqual(['workshopsExceedTickets'])
    expect(
      quoteSelection({ tickets: { regular: 1 }, workshops: { 'd0-streaming-ssr': 1 } }, SEPT_28)
        .issues,
    ).toEqual(['unavailable'])
  })

  it('checks card numbers and expiry dates', () => {
    expect(luhnValid('4242 4242 4242 4242')).toBe(true)
    expect(luhnValid('4242 4242 4242 4241')).toBe(false)
    expect(expiryValid('12/30', SEPT_28)).toBe(true)
    expect(expiryValid('09/26', SEPT_28)).toBe(true)
    expect(expiryValid('08/26', SEPT_28)).toBe(false)
    expect(expiryValid('13/30', SEPT_28)).toBe(false)
  })
})
