import { describe, expect, it } from 'vitest'
import {
  CITY_IDS,
  cities,
  cityEvents,
  places,
  placeById,
  servedAt,
} from '@/features/showcases/data/cityGuide'
import {
  countByCategory,
  defaultExplore,
  distanceKm,
  districtsOf,
  eventMonths,
  exploreToParams,
  filterEvents,
  fold,
  formatDistance,
  formatEventDates,
  formatPrice,
  groupByMonth,
  isOnDay,
  nearbyPlaces,
  parseEventFilters,
  parseExplore,
  planToIcs,
  searchPlaces,
} from '@/features/showcases/data/citySearch'

const noFilter = { category: 'all', month: 'all', planned: false } as const

describe('city guide data', () => {
  it('has unique ids per city and consistent references', () => {
    for (const city of CITY_IDS) {
      const ids = places.filter((place) => place.city === city).map((place) => place.id)
      expect(new Set(ids).size).toBe(ids.length)
    }
    expect(new Set(cityEvents.map((event) => event.id)).size).toBe(cityEvents.length)
    for (const place of places) {
      for (const dish of place.dishes ?? []) {
        expect(placeById(place.city, dish)?.category).toBe('food')
      }
    }
  })

  it('keeps real places without invented reviews or hours, and demo ones fully described', () => {
    const real = places.filter((place) => place.kind === 'real')
    const demo = places.filter((place) => place.kind === 'demo')
    expect(real.filter((place) => place.rating !== undefined || place.price)).toEqual([])
    expect(demo.filter((place) => !(place.rating! > 0) || !place.hours || !place.position)).toEqual(
      [],
    )
  })

  it('places every pin inside its own city', () => {
    for (const place of places) {
      if (!place.position) continue
      expect(distanceKm(place.position, cities[place.city].center)).toBeLessThan(15)
    }
  })

  it('dates every event in the last quarter of 2026, ending after it starts', () => {
    for (const event of cityEvents) {
      expect(event.date >= '2026-10-01' && event.date <= '2026-12-31').toBe(true)
      expect(!event.end || event.end > event.date).toBe(true)
    }
  })

  it('lists where a dish is served', () => {
    expect(servedAt('tava-ciger').map((place) => place.id)).toEqual(['tunca-ciger', 'kaleici-tava'])
  })
})

describe('explore search', () => {
  it('reads and writes the address, leaving defaults out', () => {
    const filters = parseExplore(new URLSearchParams('cat=food&q=ciğer&sort=rating&bogus=1'))
    expect(filters).toEqual({ ...defaultExplore(), category: 'food', q: 'ciğer', sort: 'rating' })
    expect(exploreToParams(filters).toString()).toBe('cat=food&q=ci%C4%9Fer&sort=rating')
    expect(parseExplore(new URLSearchParams('cat=nope&sort=nope'))).toEqual(defaultExplore())
  })

  it('folds Turkish letters both ways', () => {
    expect(fold('İSTANBUL Süleymaniye Çay')).toBe('istanbul suleymaniye cay')
    expect(fold('Işık')).toBe('isik')
  })

  it('finds places in either language, without Turkish letters', () => {
    const find = (q: string) =>
      searchPlaces(places, 'istanbul', { ...defaultExplore(), q }, 'tr').map((place) => place.id)
    expect(find('hagia sophia')).toEqual(['ayasofya'])
    expect(find('suleymaniye')).toEqual(['suleymaniye'])
    expect(
      searchPlaces(places, 'edirne', { ...defaultExplore(), q: 'ciger' }, 'en').length,
    ).toBeGreaterThan(2)
  })

  it('filters by category, district and saved places, and sorts', () => {
    const food = searchPlaces(places, 'edirne', { ...defaultExplore(), category: 'food' }, 'en')
    expect(food.every((place) => place.category === 'food')).toBe(true)
    expect(food[0]!.featured).toBe(true)

    const kaleici = searchPlaces(
      places,
      'edirne',
      { ...defaultExplore(), district: 'Kaleiçi' },
      'en',
    )
    expect(kaleici.every((place) => place.district === 'Kaleiçi')).toBe(true)

    const saved = searchPlaces(places, 'istanbul', { ...defaultExplore(), saved: true }, 'en', [
      'galata-kulesi',
      'selimiye',
    ])
    expect(saved.map((place) => place.id)).toEqual(['galata-kulesi'])

    const rated = searchPlaces(places, 'istanbul', { ...defaultExplore(), sort: 'rating' }, 'en')
    expect(rated[0]!.rating).toBe(Math.max(...rated.map((place) => place.rating ?? 0)))

    const named = searchPlaces(places, 'istanbul', { ...defaultExplore(), sort: 'name' }, 'tr')
    const names = named.map((place) => place.name.tr)
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b, 'tr')))
  })

  it('counts categories and lists districts', () => {
    const counts = countByCategory(places, 'edirne')
    expect(Object.values(counts).reduce((a, b) => a + b, 0)).toBe(
      places.filter((place) => place.city === 'edirne').length,
    )
    expect(districtsOf(places, 'edirne')).toContain('Karaağaç')
    expect(districtsOf(places, 'edirne')).not.toContain('')
  })
})

describe('distances', () => {
  it('measures Selimiye to Eski Cami at a few hundred metres', () => {
    const selimiye = placeById('edirne', 'selimiye')!
    const km = distanceKm(selimiye.position!, placeById('edirne', 'eski-cami')!.position!)
    expect(km).toBeGreaterThan(0.2)
    expect(km).toBeLessThan(0.5)
  })

  it('lists the nearest places first, never itself or other cities', () => {
    const near = nearbyPlaces(placeById('istanbul', 'ayasofya')!, places, 4)
    expect(near).toHaveLength(4)
    expect(near.map(({ place }) => place.id)).not.toContain('ayasofya')
    expect(near.every(({ place }) => place.city === 'istanbul')).toBe(true)
    expect(near.map(({ km }) => km)).toEqual([...near.map(({ km }) => km)].sort((a, b) => a - b))
    expect(nearbyPlaces(placeById('edirne', 'tava-ciger')!, places)).toEqual([])
  })

  it('formats metres and kilometres', () => {
    expect(formatDistance(0.34, 'en')).toBe('350 m')
    expect(formatDistance(0.01, 'en')).toBe('50 m')
    expect(formatDistance(2.345, 'tr')).toBe('2,3 km')
  })
})

describe('events', () => {
  it('drops past events and keeps ones that are still on', () => {
    const all = filterEvents(cityEvents, 'edirne', noFilter, '2026-12-01')
    expect(all.map((event) => event.id)).toContain('edirnekari-sergi')
    expect(all.map((event) => event.id)).not.toContain('selimiye-turu')
    expect(all.map((event) => event.date)).toEqual([...all.map((event) => event.date)].sort())
  })

  it('matches a month an event runs into', () => {
    const december = filterEvents(
      cityEvents,
      'edirne',
      { ...noFilter, month: '2026-12' },
      '2026-09-28',
    )
    expect(december.map((event) => event.id)).toContain('edirnekari-sergi')
    expect(eventMonths(cityEvents, 'edirne', '2026-09-28')).toEqual([
      '2026-10',
      '2026-11',
      '2026-12',
    ])
  })

  it('filters by category and plan', () => {
    const music = filterEvents(
      cityEvents,
      'istanbul',
      { ...noFilter, category: 'music' },
      '2026-09-28',
    )
    expect(music.every((event) => event.category === 'music')).toBe(true)
    const planned = filterEvents(cityEvents, 'all', { ...noFilter, planned: true }, '2026-09-28', [
      'kis-caz',
      'balkan-gecesi',
    ])
    expect(planned.map((event) => event.id)).toEqual(['balkan-gecesi', 'kis-caz'])
  })

  it('parses filters from the address', () => {
    expect(parseEventFilters(new URLSearchParams('cat=art&month=2026-11&plan=1'))).toEqual({
      category: 'art',
      month: '2026-11',
      planned: true,
    })
    expect(parseEventFilters(new URLSearchParams('cat=x&month=november'))).toEqual(noFilter)
  })

  it('groups by month and tells which days an event is on', () => {
    const groups = groupByMonth(filterEvents(cityEvents, 'istanbul', noFilter, '2026-09-28'))
    expect(groups.map((group) => group.month)).toEqual(['2026-10', '2026-11', '2026-12'])
    const exhibition = cityEvents.find((event) => event.id === 'edirnekari-sergi')!
    expect(isOnDay(exhibition, '2026-12-01')).toBe(true)
    expect(isOnDay(exhibition, '2026-12-07')).toBe(false)
  })

  it('formats single days, weekends and ranges across months', () => {
    const one = cityEvents.find((event) => event.id === 'bogaz-sonbahar')!
    const weekend = cityEvents.find((event) => event.id === 'kadikoy-sokak')!
    const across = cityEvents.find((event) => event.id === 'edirnekari-sergi')!
    expect(formatEventDates(one, 'en')).toBe('Sat 3 Oct')
    expect(formatEventDates(weekend, 'en')).toBe('17–18 Oct')
    expect(formatEventDates(across, 'en')).toBe('28 Nov – 6 Dec')
  })

  it('prices in lira, and free as a word', () => {
    expect(formatPrice(0, 'tr')).toBe('Ücretsiz')
    expect(formatPrice(250, 'en')).toBe('₺250')
    expect(formatPrice(1250, 'tr')).toBe('₺1.250')
  })

  it('writes a calendar file with timed and all-day events', () => {
    const picked = cityEvents.filter((event) =>
      ['bogaz-sonbahar', 'kadikoy-sokak'].includes(event.id),
    )
    const ics = planToIcs(
      picked,
      (event) => event.title.en,
      () => 'Kadıköy, İstanbul',
    )
    expect(ics).toContain('DTSTART;TZID=Europe/Istanbul:20261003T193000')
    expect(ics).toContain('DTSTART;VALUE=DATE:20261017')
    expect(ics).toContain('DTEND;VALUE=DATE:20261019')
    expect(ics).toContain('LOCATION:Kadıköy\\, İstanbul')
    expect(ics.split('BEGIN:VEVENT')).toHaveLength(3)
  })
})
