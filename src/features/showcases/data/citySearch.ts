import {
  EVENT_CATEGORIES,
  PLACE_CATEGORIES,
  type CityEvent,
  type CityId,
  type EventCategory,
  type Loc,
  type Place,
  type PlaceCategory,
} from '@/features/showcases/data/cityGuide'

type Language = keyof Loc

export const EXPLORE_SORTS = ['recommended', 'rating', 'name'] as const
export type ExploreSort = (typeof EXPLORE_SORTS)[number]

export interface ExploreFilters {
  category: PlaceCategory | 'all'
  q: string
  district: string | null
  sort: ExploreSort
  /** Only places the visitor saved. */
  saved: boolean
}

export const defaultExplore = (): ExploreFilters => ({
  category: 'all',
  q: '',
  district: null,
  sort: 'recommended',
  saved: false,
})

export function parseExplore(params: URLSearchParams): ExploreFilters {
  const category = params.get('cat')
  const sort = params.get('sort')
  return {
    category: PLACE_CATEGORIES.includes(category as PlaceCategory)
      ? (category as PlaceCategory)
      : 'all',
    q: params.get('q')?.trim() ?? '',
    district: params.get('district') || null,
    sort: EXPLORE_SORTS.includes(sort as ExploreSort) ? (sort as ExploreSort) : 'recommended',
    saved: params.get('saved') === '1',
  }
}

/** The shortest query string for the filters: defaults are left out. */
export function exploreToParams(filters: ExploreFilters): URLSearchParams {
  const params = new URLSearchParams()
  if (filters.category !== 'all') params.set('cat', filters.category)
  if (filters.q) params.set('q', filters.q)
  if (filters.district) params.set('district', filters.district)
  if (filters.sort !== 'recommended') params.set('sort', filters.sort)
  if (filters.saved) params.set('saved', '1')
  return params
}

/** Lower case without Turkish letters or accents, so "suleymaniye" finds "Süleymaniye". */
export function fold(text: string) {
  return text
    .replace(/İ/g, 'i')
    .toLowerCase()
    .replace(/ı/g, 'i')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

const CATEGORY_ORDER = Object.fromEntries(PLACE_CATEGORIES.map((key, index) => [key, index]))

export function searchPlaces(
  all: Place[],
  city: CityId,
  filters: ExploreFilters,
  language: Language,
  saved: string[] = [],
): Place[] {
  const words = fold(filters.q).split(/\s+/).filter(Boolean)
  const found = all.filter((place) => {
    if (place.city !== city) return false
    if (filters.category !== 'all' && place.category !== filters.category) return false
    if (filters.district && place.district !== filters.district) return false
    if (filters.saved && !saved.includes(place.id)) return false
    if (!words.length) return true
    // Both languages, so a visitor can type "Hagia Sophia" on the Turkish site.
    const haystack = fold(
      [
        place.name.en,
        place.name.tr,
        place.summary[language],
        place.district,
        place.type?.[language],
      ]
        .filter(Boolean)
        .join(' '),
    )
    return words.every((word) => haystack.includes(word))
  })

  const name = (place: Place) => place.name[language]
  const compare = {
    name: (a: Place, b: Place) => name(a).localeCompare(name(b), language),
    rating: (a: Place, b: Place) =>
      (b.rating ?? 0) - (a.rating ?? 0) || name(a).localeCompare(name(b), language),
    // Featured first, then the categories in the order of the tabs, keeping the guide's order.
    recommended: (a: Place, b: Place) =>
      Number(Boolean(b.featured)) - Number(Boolean(a.featured)) ||
      CATEGORY_ORDER[a.category]! - CATEGORY_ORDER[b.category]!,
  }[filters.sort]
  return found.sort(compare)
}

/** Districts that have at least one place, for the district filter. */
export function districtsOf(all: Place[], city: CityId): string[] {
  const set = new Set(
    all.filter((place) => place.city === city && place.district).map((place) => place.district),
  )
  return [...set].sort((a, b) => a.localeCompare(b, 'tr'))
}

export function countByCategory(all: Place[], city: CityId): Record<PlaceCategory, number> {
  const counts = Object.fromEntries(PLACE_CATEGORIES.map((key) => [key, 0])) as Record<
    PlaceCategory,
    number
  >
  for (const place of all) if (place.city === city) counts[place.category] += 1
  return counts
}

/** Great-circle distance in kilometres. */
export function distanceKm([lat1, lng1]: [number, number], [lat2, lng2]: [number, number]) {
  const rad = Math.PI / 180
  const dLat = (lat2 - lat1) * rad
  const dLng = (lng2 - lng1) * rad
  const a =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLng / 2) ** 2
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

/** The closest places on the map, nearest first. Nothing for a place without an address. */
export function nearbyPlaces(place: Place, all: Place[], limit = 4) {
  const from = place.position
  if (!from) return []
  return all
    .filter((other) => other.city === place.city && other.id !== place.id && other.position)
    .map((other) => ({ place: other, km: distanceKm(from, other.position!) }))
    .sort((a, b) => a.km - b.km)
    .slice(0, limit)
}

export function formatDistance(km: number, language: Language) {
  const locale = language === 'tr' ? 'tr-TR' : 'en-GB'
  if (km < 1) return `${Math.max(50, Math.round((km * 1000) / 50) * 50)} m`
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(km)} km`
}

/** About twelve minutes a kilometre, the pace of a walk with stops for photos. */
export const walkMinutes = (km: number) => Math.max(1, Math.round(km * 12))

export interface EventFilters {
  category: EventCategory | 'all'
  /** `YYYY-MM`, or every month. */
  month: string | 'all'
  /** Only events in the visitor's plan. */
  planned: boolean
}

export function parseEventFilters(params: URLSearchParams): EventFilters {
  const category = params.get('cat')
  const month = params.get('month')
  return {
    category: EVENT_CATEGORIES.includes(category as EventCategory)
      ? (category as EventCategory)
      : 'all',
    month: month && /^\d{4}-\d{2}$/.test(month) ? month : 'all',
    planned: params.get('plan') === '1',
  }
}

export const lastDay = (event: CityEvent) => event.end ?? event.date

/** Today as `YYYY-MM-DD` in the visitor's own time zone. */
export function isoDay(now: Date | number) {
  const date = new Date(now)
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

/** An event is on a day from its first to its last day. */
export const isOnDay = (event: CityEvent, day: string) => event.date <= day && day <= lastDay(event)

/**
 * The events still to come (or on now), soonest first. A month matches an event that runs on
 * any day of it, so a show from 28 November to 6 December is in both months.
 */
export function filterEvents(
  all: CityEvent[],
  city: CityId | 'all',
  filters: EventFilters,
  today: string,
  plan: string[] = [],
): CityEvent[] {
  return all
    .filter((event) => city === 'all' || event.city === city)
    .filter((event) => lastDay(event) >= today)
    .filter((event) => filters.category === 'all' || event.category === filters.category)
    .filter(
      (event) =>
        filters.month === 'all' ||
        (event.date.slice(0, 7) <= filters.month && filters.month <= lastDay(event).slice(0, 7)),
    )
    .filter((event) => !filters.planned || plan.includes(event.id))
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
}

/** The months that have events, for the month filter. */
export function eventMonths(all: CityEvent[], city: CityId, today: string): string[] {
  const months = new Set<string>()
  for (const event of all) {
    if (event.city !== city || lastDay(event) < today) continue
    months.add(event.date.slice(0, 7))
    months.add(lastDay(event).slice(0, 7))
  }
  return [...months].sort()
}

export function groupByMonth(events: CityEvent[]): { month: string; events: CityEvent[] }[] {
  const groups: { month: string; events: CityEvent[] }[] = []
  for (const event of events) {
    const month = event.date.slice(0, 7)
    const last = groups.at(-1)
    if (last?.month === month) last.events.push(event)
    else groups.push({ month, events: [event] })
  }
  return groups
}

const dateOf = (day: string) => new Date(`${day}T12:00:00`)

export function formatMonth(month: string, language: Language) {
  return new Intl.DateTimeFormat(language === 'tr' ? 'tr-TR' : 'en-GB', {
    month: 'long',
    year: 'numeric',
  }).format(dateOf(`${month}-01`))
}

/** "Sat 3 Oct", or "17–18 Oct" for a weekend, "28 Nov – 6 Dec" across months. */
export function formatEventDates(event: CityEvent, language: Language) {
  const locale = language === 'tr' ? 'tr-TR' : 'en-GB'
  const day = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' })
  const weekday = new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
  if (!event.end) return weekday.format(dateOf(event.date))
  if (event.date.slice(0, 7) === event.end.slice(0, 7)) {
    const month = new Intl.DateTimeFormat(locale, { month: 'short' }).format(dateOf(event.date))
    return `${Number(event.date.slice(8))}–${Number(event.end.slice(8))} ${month}`
  }
  return `${day.format(dateOf(event.date))} – ${day.format(dateOf(event.end))}`
}

export function formatPrice(lira: number, language: Language) {
  if (lira === 0) return language === 'tr' ? 'Ücretsiz' : 'Free'
  return new Intl.NumberFormat(language === 'tr' ? 'tr-TR' : 'en-GB', {
    style: 'currency',
    currency: 'TRY',
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: 0,
  }).format(lira)
}

/** A calendar file with the visitor's planned events, all-day for multi-day ones. */
export function planToIcs(
  events: CityEvent[],
  title: (event: CityEvent) => string,
  venue: (event: CityEvent) => string,
) {
  const compact = (day: string) => day.replace(/-/g, '')
  const nextDay = (day: string) => {
    const date = dateOf(day)
    date.setDate(date.getDate() + 1)
    return compact(isoDay(date))
  }
  const escape = (text: string) => text.replace(/[\\;,]/g, (match) => `\\${match}`)
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Sehirname//City guide//EN']
  for (const event of events) {
    lines.push('BEGIN:VEVENT', `UID:${event.id}@sehirname.example`)
    if (event.end) {
      lines.push(
        `DTSTART;VALUE=DATE:${compact(event.date)}`,
        `DTEND;VALUE=DATE:${nextDay(event.end)}`,
      )
    } else {
      const start = `${compact(event.date)}T${event.time.replace(':', '')}00`
      lines.push(`DTSTART;TZID=Europe/Istanbul:${start}`)
    }
    lines.push(`SUMMARY:${escape(title(event))}`, `LOCATION:${escape(venue(event))}`, 'END:VEVENT')
  }
  lines.push('END:VCALENDAR')
  return lines.join('\r\n')
}
