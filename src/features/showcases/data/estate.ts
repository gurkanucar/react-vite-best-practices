import type { Language } from '@/store/preferences-store'

export type Deal = 'sale' | 'rent'
export type City = 'istanbul' | 'izmir' | 'ankara'
export type PropertyType = 'apartment' | 'residence' | 'villa' | 'detached'
export type Heating = 'combi' | 'central' | 'underfloor'
export type Highlight =
  | 'seaView'
  | 'newBuild'
  | 'furnished'
  | 'garden'
  | 'pool'
  | 'renovated'
  | 'bright'
  | 'spacious'
  | 'quiet'
export type Feature =
  | 'balcony'
  | 'parking'
  | 'elevator'
  | 'pool'
  | 'security'
  | 'gym'
  | 'seaView'
  | 'garden'
  | 'storage'
  | 'smartHome'
  | 'fireplace'
  | 'playground'
export type PhotoKind = 'exterior' | 'living' | 'kitchen' | 'bedroom' | 'bathroom'

export const FEATURES: Feature[] = [
  'balcony',
  'parking',
  'elevator',
  'pool',
  'security',
  'gym',
  'seaView',
  'garden',
  'storage',
  'smartHome',
  'fireplace',
  'playground',
]
export const PROPERTY_TYPES: PropertyType[] = ['apartment', 'residence', 'villa', 'detached']
export const CITIES: City[] = ['istanbul', 'izmir', 'ankara']

export interface Neighbourhood {
  id: string
  city: City
  district: string
  name: string
  /** The Turkish locative, which is not a rule a template can apply: "Moda'da", "Levent'te". */
  inTr: string
  center: [number, number]
  /** Half the width of the area listings are placed in, in degrees of latitude. */
  spread: number
  /** Asking price per gross m² for a typical flat, in lira. */
  salePerM2: number
  coastal: boolean
  types: PropertyType[]
}

export interface Agent {
  id: string
  name: string
  city: City
  phone: string
  email: string
  languages: string[]
  rating: number
  reviews: number
  years: number
}

export interface ListingPhoto {
  id: string
  kind: PhotoKind
}

export interface PricePoint {
  daysAgo: number
  price: number
}

export interface Listing {
  id: string
  deal: Deal
  type: PropertyType
  city: City
  hoodId: string
  position: [number, number]
  price: number
  bedrooms: number
  livingRooms: number
  grossArea: number
  netArea: number
  /** -1 is a garden floor below street level, 0 the ground floor. Houses count as 0. */
  floor: number
  totalFloors: number
  buildingAge: number
  heating: Heating
  furnished: boolean
  dues: number
  features: Feature[]
  highlight: Highlight
  listedDaysAgo: number
  /** Oldest first; the last entry is the current price. */
  priceHistory: PricePoint[]
  photos: ListingPhoto[]
  agentId: string
  featured: boolean
  creditEligible: boolean
  nearby: { transitMinutes: number; school: number; hospital: number; market: number }
}

export function estateRoot(standalone: boolean) {
  return standalone ? '/preview/estate' : '/showcases/estate'
}

export const estateListingsPath = (standalone: boolean) => `${estateRoot(standalone)}/listings`
export const estateListingPath = (standalone: boolean, id: string) =>
  `${estateListingsPath(standalone)}/${id}`
export const estateComparePath = (standalone: boolean, ids: string[] = []) =>
  `${estateRoot(standalone)}/compare${ids.length ? `?ids=${ids.join(',')}` : ''}`

export const estatePhotoUrl = (id: string, width = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=78`

/** Every photo was checked by eye: the building types and rooms they are used for match. */
const PHOTOS = {
  apartment: [
    '1545324418-cc1a3fa10c00',
    '1460317442991-0ec209397118',
    '1515263487990-61b07816b324',
    '1574362848149-11496d93a7c7',
  ],
  residence: [
    '1515263487990-61b07816b324',
    '1479839672679-a46483c0e7c8',
    '1545324418-cc1a3fa10c00',
  ],
  villa: [
    '1512917774080-9991f1c4c750',
    '1580587771525-78b9dba3b914',
    '1600596542815-ffad4c1539a9',
    '1613490493576-7fde63acd811',
    '1613977257363-707ba9348227',
  ],
  detached: [
    '1600585154340-be6161a56a0c',
    '1600566753190-17f0baa2a6c3',
    '1568605114967-8130f3a36994',
    '1564013799919-ab600027ffc6',
  ],
  living: [
    '1560448204-e02f11c3d0e2',
    '1502672260266-1c1ef2d93688',
    '1522708323590-d24dbb6b0267',
    '1493809842364-78817add7ffb',
    '1505691938895-1758d7feb511',
    '1600607687939-ce8a6c25118c',
    '1600210492486-724fe5c67fb0',
    '1586023492125-27b2c045efd7',
    '1554995207-c18c203602cb',
    '1598928506311-c55ded91a20c',
  ],
  kitchen: ['1484154218962-a197022b5858', '1556912173-3bb406ef7e77', '1507089947368-19c1da9775ae'],
  bedroom: ['1616594039964-ae9021a400a0', '1540518614846-7eded433c457'],
  bathroom: ['1552321554-5fefe8c9ef14'],
}

export const estateHeroPhoto = '1600596542815-ffad4c1539a9'

export const neighbourhoods: Neighbourhood[] = [
  {
    id: 'moda',
    city: 'istanbul',
    district: 'Kadıköy',
    name: 'Moda',
    inTr: "Moda'da",
    center: [40.988, 29.033],
    spread: 0.004,
    salePerM2: 96000,
    coastal: true,
    types: ['apartment', 'apartment', 'apartment', 'residence'],
  },
  {
    id: 'cihangir',
    city: 'istanbul',
    district: 'Beyoğlu',
    name: 'Cihangir',
    inTr: "Cihangir'de",
    center: [41.0322, 28.9808],
    spread: 0.003,
    salePerM2: 104000,
    coastal: true,
    types: ['apartment'],
  },
  {
    id: 'levent',
    city: 'istanbul',
    district: 'Beşiktaş',
    name: 'Levent',
    inTr: "Levent'te",
    center: [41.0795, 29.0115],
    spread: 0.006,
    salePerM2: 118000,
    coastal: false,
    types: ['residence', 'residence', 'apartment'],
  },
  {
    id: 'atasehir',
    city: 'istanbul',
    district: 'Ataşehir',
    name: 'Ataşehir',
    inTr: "Ataşehir'de",
    center: [40.9925, 29.1155],
    spread: 0.009,
    salePerM2: 68000,
    coastal: false,
    types: ['residence', 'apartment', 'apartment'],
  },
  {
    id: 'bakirkoy',
    city: 'istanbul',
    district: 'Bakırköy',
    name: 'Bakırköy',
    inTr: "Bakırköy'de",
    center: [40.9865, 28.868],
    spread: 0.005,
    salePerM2: 86000,
    coastal: true,
    types: ['apartment', 'apartment', 'residence'],
  },
  {
    id: 'tarabya',
    city: 'istanbul',
    district: 'Sarıyer',
    name: 'Tarabya',
    inTr: "Tarabya'da",
    center: [41.136, 29.046],
    spread: 0.004,
    salePerM2: 128000,
    coastal: true,
    types: ['villa', 'apartment', 'detached'],
  },
  {
    id: 'kuzguncuk',
    city: 'istanbul',
    district: 'Üsküdar',
    name: 'Kuzguncuk',
    inTr: "Kuzguncuk'ta",
    center: [41.0365, 29.038],
    spread: 0.003,
    salePerM2: 92000,
    coastal: true,
    types: ['detached', 'apartment'],
  },
  {
    id: 'basaksehir',
    city: 'istanbul',
    district: 'Başakşehir',
    name: 'Başakşehir',
    inTr: "Başakşehir'de",
    center: [41.094, 28.802],
    spread: 0.009,
    salePerM2: 44000,
    coastal: false,
    types: ['residence', 'apartment', 'apartment'],
  },
  {
    id: 'beylikduzu',
    city: 'istanbul',
    district: 'Beylikdüzü',
    name: 'Beylikdüzü',
    inTr: "Beylikdüzü'nde",
    center: [41.0, 28.64],
    spread: 0.008,
    salePerM2: 36000,
    coastal: false,
    types: ['apartment', 'residence', 'villa'],
  },
  {
    id: 'alsancak',
    city: 'izmir',
    district: 'Konak',
    name: 'Alsancak',
    inTr: "Alsancak'ta",
    center: [38.435, 27.148],
    spread: 0.004,
    salePerM2: 70000,
    coastal: true,
    types: ['apartment'],
  },
  {
    id: 'karsiyaka',
    city: 'izmir',
    district: 'Karşıyaka',
    name: 'Karşıyaka',
    inTr: "Karşıyaka'da",
    center: [38.4645, 27.115],
    spread: 0.005,
    salePerM2: 60000,
    coastal: true,
    types: ['apartment', 'apartment', 'residence'],
  },
  {
    id: 'bornova',
    city: 'izmir',
    district: 'Bornova',
    name: 'Bornova',
    inTr: "Bornova'da",
    center: [38.4665, 27.22],
    spread: 0.009,
    salePerM2: 44000,
    coastal: false,
    types: ['apartment', 'residence', 'detached'],
  },
  {
    id: 'urla',
    city: 'izmir',
    district: 'Urla',
    name: 'Urla',
    inTr: "Urla'da",
    center: [38.322, 26.768],
    spread: 0.008,
    salePerM2: 78000,
    coastal: true,
    types: ['villa', 'detached', 'detached'],
  },
  {
    id: 'goztepe',
    city: 'izmir',
    district: 'Konak',
    name: 'Göztepe',
    inTr: "Göztepe'de",
    center: [38.394, 27.088],
    spread: 0.003,
    salePerM2: 64000,
    coastal: true,
    types: ['apartment'],
  },
  {
    id: 'kavaklidere',
    city: 'ankara',
    district: 'Çankaya',
    name: 'Kavaklıdere',
    inTr: "Kavaklıdere'de",
    center: [39.906, 32.86],
    spread: 0.006,
    salePerM2: 54000,
    coastal: false,
    types: ['apartment', 'apartment', 'residence'],
  },
  {
    id: 'cayyolu',
    city: 'ankara',
    district: 'Çankaya',
    name: 'Çayyolu',
    inTr: "Çayyolu'nda",
    center: [39.887, 32.68],
    spread: 0.009,
    salePerM2: 48000,
    coastal: false,
    types: ['apartment', 'residence', 'villa'],
  },
  {
    id: 'bahcelievler',
    city: 'ankara',
    district: 'Çankaya',
    name: 'Bahçelievler',
    inTr: "Bahçelievler'de",
    center: [39.923, 32.826],
    spread: 0.006,
    salePerM2: 45000,
    coastal: false,
    types: ['apartment'],
  },
  {
    id: 'incek',
    city: 'ankara',
    district: 'Gölbaşı',
    name: 'İncek',
    inTr: "İncek'te",
    center: [39.826, 32.735],
    spread: 0.009,
    salePerM2: 46000,
    coastal: false,
    types: ['villa', 'residence', 'detached'],
  },
]

export const cityNames: Record<City, string> = {
  istanbul: 'İstanbul',
  izmir: 'İzmir',
  ankara: 'Ankara',
}

export const agents: Agent[] = [
  {
    id: 'selin',
    name: 'Selin Aydın',
    city: 'istanbul',
    phone: '+90 212 555 01 21',
    email: 'selin@mesken.example',
    languages: ['TR', 'EN'],
    rating: 4.9,
    reviews: 132,
    years: 11,
  },
  {
    id: 'mert',
    name: 'Mert Koç',
    city: 'istanbul',
    phone: '+90 216 555 01 34',
    email: 'mert@mesken.example',
    languages: ['TR', 'EN', 'DE'],
    rating: 4.8,
    reviews: 98,
    years: 8,
  },
  {
    id: 'deniz',
    name: 'Deniz Yalçın',
    city: 'istanbul',
    phone: '+90 212 555 01 47',
    email: 'deniz@mesken.example',
    languages: ['TR', 'EN', 'RU'],
    rating: 4.7,
    reviews: 76,
    years: 6,
  },
  {
    id: 'ece',
    name: 'Ece Tuna',
    city: 'izmir',
    phone: '+90 232 555 02 18',
    email: 'ece@mesken.example',
    languages: ['TR', 'EN'],
    rating: 4.9,
    reviews: 87,
    years: 9,
  },
  {
    id: 'kaan',
    name: 'Kaan Oral',
    city: 'izmir',
    phone: '+90 232 555 02 55',
    email: 'kaan@mesken.example',
    languages: ['TR', 'EN', 'FR'],
    rating: 4.6,
    reviews: 41,
    years: 4,
  },
  {
    id: 'zeynep',
    name: 'Zeynep Arslan',
    city: 'ankara',
    phone: '+90 312 555 03 09',
    email: 'zeynep@mesken.example',
    languages: ['TR', 'EN'],
    rating: 4.8,
    reviews: 104,
    years: 12,
  },
]

/** Mulberry32: small, fast and the same in every browser, so the catalogue never changes. */
function seeded(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const LISTING_COUNT = 168
const FIRST_ID = 10421

function roundTo(value: number, step: number) {
  return Math.max(step, Math.round(value / step) * step)
}

function generateListings(): Listing[] {
  const random = seeded(20260928)
  const between = (min: number, max: number) => min + random() * (max - min)
  const int = (min: number, max: number) => Math.floor(between(min, max + 1))
  const pick = <T>(items: readonly T[]): T => items[Math.floor(random() * items.length)]!
  const chance = (probability: number) => random() < probability

  return Array.from({ length: LISTING_COUNT }, (_, index): Listing => {
    const hood = neighbourhoods[index % neighbourhoods.length]!
    const type = pick(hood.types)
    const deal: Deal = chance(0.6) ? 'sale' : 'rent'

    const bedrooms =
      type === 'villa'
        ? int(4, 6)
        : type === 'detached'
          ? int(3, 5)
          : type === 'residence'
            ? int(1, 3)
            : pick([0, 1, 1, 2, 2, 2, 3, 3, 3, 4])
    const livingRooms = bedrooms >= 4 && type !== 'apartment' ? 2 : 1
    const areaRange: Record<number, [number, number]> = {
      0: [32, 50],
      1: [52, 78],
      2: [82, 118],
      3: [118, 168],
      4: [165, 240],
      5: [230, 330],
      6: [300, 420],
    }
    const [minArea, maxArea] = areaRange[bedrooms]!
    const grossArea = Math.round(between(minArea, maxArea) * (type === 'villa' ? 1.2 : 1))
    const netArea = Math.round(grossArea * between(0.78, 0.88))

    const house = type === 'villa' || type === 'detached'
    const totalFloors = house
      ? int(2, 3)
      : type === 'residence'
        ? int(12, 34)
        : int(3, hood.city === 'istanbul' ? 11 : 8)
    const floor = house ? 0 : chance(0.06) ? -1 : chance(0.12) ? 0 : int(1, totalFloors)

    const buildingAge = chance(0.16)
      ? 0
      : type === 'residence'
        ? int(1, 10)
        : pick([int(1, 5), int(6, 15), int(16, 38)])

    const features = new Set<Feature>()
    const add = (feature: Feature, probability: number) => {
      if (chance(probability)) features.add(feature)
    }
    add('balcony', house ? 0.5 : 0.8)
    add('parking', type === 'residence' || house ? 1 : 0.4)
    add('elevator', !house && totalFloors > 4 ? 0.92 : 0)
    add('pool', type === 'residence' ? 0.45 : type === 'villa' ? 0.7 : 0)
    add('security', type === 'residence' ? 1 : type === 'villa' ? 0.55 : 0.08)
    add('gym', type === 'residence' ? 0.65 : 0)
    add('seaView', hood.coastal ? (floor >= 3 || house ? 0.55 : 0.2) : 0)
    add('garden', house || floor <= 0 ? 0.85 : 0)
    add('storage', 0.45)
    add('smartHome', buildingAge <= 2 ? 0.55 : 0.05)
    add('fireplace', house ? 0.45 : 0.04)
    add('playground', type === 'residence' ? 0.6 : 0.1)

    const furnished = chance(deal === 'rent' ? 0.4 : 0.07)
    const highlight: Highlight = features.has('seaView')
      ? 'seaView'
      : buildingAge === 0
        ? 'newBuild'
        : furnished
          ? 'furnished'
          : features.has('pool')
            ? 'pool'
            : features.has('garden')
              ? 'garden'
              : buildingAge > 15 && chance(0.4)
                ? 'renovated'
                : pick(['bright', 'spacious', 'quiet'] as const)

    let valueFactor = between(0.88, 1.14)
    if (buildingAge === 0) valueFactor *= 1.14
    else if (buildingAge > 20) valueFactor *= 0.86
    if (features.has('seaView')) valueFactor *= 1.22
    if (features.has('pool')) valueFactor *= 1.06
    if (house) valueFactor *= 1.12
    if (floor === -1) valueFactor *= 0.85

    const salePrice = grossArea * hood.salePerM2 * valueFactor
    const price =
      deal === 'sale'
        ? roundTo(salePrice, salePrice > 10_000_000 ? 50_000 : 10_000)
        : roundTo((salePrice / 265) * (furnished ? 1.12 : 1), 500)

    const dues = roundTo(
      type === 'residence'
        ? between(3500, 9500)
        : type === 'villa' && features.has('security')
          ? between(4000, 12000)
          : house
            ? between(0, 900)
            : between(400, 2400) * (features.has('elevator') ? 1.3 : 1),
      50,
    )

    // Earlier asks: most sellers come down over time, a few go up with the market.
    const listedDaysAgo = int(0, 96)
    const changeDays =
      listedDaysAgo > 10
        ? [...new Set(Array.from({ length: int(0, 3) }, () => int(1, listedDaysAgo - 1)))].sort(
            (a, b) => a - b,
          )
        : []
    const newestFirst: PricePoint[] = []
    let asked = price
    for (const daysAgo of changeDays) {
      newestFirst.push({ daysAgo, price: asked })
      const factor = chance(0.18) ? between(0.94, 0.97) : between(1.03, 1.09)
      asked = roundTo(asked * factor, deal === 'sale' ? 10_000 : 500)
    }
    newestFirst.push({ daysAgo: listedDaysAgo, price: asked })
    const priceHistory = newestFirst.reverse()

    const exterior = pick(PHOTOS[type])
    const living = [...PHOTOS.living].sort(() => random() - 0.5).slice(0, 2)
    const outside: ListingPhoto = { id: exterior, kind: 'exterior' }
    const inside: ListingPhoto = { id: living[0]!, kind: 'living' }
    // Houses lead with the outside; many flats lead with the living room, as agents do.
    const lead = house || chance(0.45) ? [outside, inside] : [inside, outside]
    const photos: ListingPhoto[] = [
      ...lead,
      { id: pick(PHOTOS.kitchen), kind: 'kitchen' },
      { id: pick(PHOTOS.bedroom), kind: 'bedroom' },
      { id: living[1]!, kind: 'living' },
      { id: PHOTOS.bathroom[0]!, kind: 'bathroom' },
    ]

    const cityAgents = agents.filter((agent) => agent.city === hood.city)
    const lngScale = 1 / Math.cos((hood.center[0] * Math.PI) / 180)
    const position: [number, number] = [
      Number((hood.center[0] + (random() - 0.5) * 2 * hood.spread).toFixed(5)),
      Number((hood.center[1] + (random() - 0.5) * 2 * hood.spread * lngScale).toFixed(5)),
    ]

    return {
      id: String(FIRST_ID + index),
      deal,
      type,
      city: hood.city,
      hoodId: hood.id,
      position,
      price,
      bedrooms,
      livingRooms,
      grossArea,
      netArea,
      floor,
      totalFloors,
      buildingAge,
      heating:
        house || buildingAge <= 3 ? 'underfloor' : type === 'residence' ? 'central' : 'combi',
      furnished,
      dues,
      features: FEATURES.filter((feature) => features.has(feature)),
      highlight,
      listedDaysAgo,
      priceHistory,
      photos,
      agentId: pick(cityAgents).id,
      featured: false,
      creditEligible: deal === 'sale' && chance(0.78),
      nearby: {
        transitMinutes: house ? int(12, 30) : int(3, 18),
        school: roundTo(between(150, 1400), 50),
        hospital: roundTo(between(400, 3500), 100),
        market: roundTo(between(60, 700), 10),
      },
    }
  })
}

function markFeatured(listings: Listing[]): Listing[] {
  // Two per city, one of each deal where possible, chosen by a fixed rule rather than at random.
  const chosen = new Set<string>()
  for (const city of CITIES) {
    for (const deal of ['sale', 'rent'] as const) {
      const best = listings
        .filter((listing) => listing.city === city && listing.deal === deal)
        .sort((a, b) => b.features.length - a.features.length || a.id.localeCompare(b.id))[0]
      if (best) chosen.add(best.id)
    }
  }
  return listings.map((listing) =>
    chosen.has(listing.id) ? { ...listing, featured: true } : listing,
  )
}

export const listings: Listing[] = markFeatured(generateListings())

const byId = new Map(listings.map((listing) => [listing.id, listing]))
const hoodById = new Map(neighbourhoods.map((hood) => [hood.id, hood]))
const agentById = new Map(agents.map((agent) => [agent.id, agent]))

export const findListing = (id: string | undefined) => (id ? byId.get(id) : undefined)
export const hoodOf = (listing: Listing) => hoodById.get(listing.hoodId)!
export const findHood = (id: string | undefined) => (id ? hoodById.get(id) : undefined)
export const agentOf = (listing: Listing) => agentById.get(listing.agentId)!

/** "Moda, Kadıköy", or just "Beylikdüzü" where the neighbourhood gives the district its name. */
export const placeLabel = (hood: Neighbourhood) =>
  hood.name === hood.district ? hood.name : `${hood.name}, ${hood.district}`

/** The Turkish convention: bedrooms + living rooms, and a studio is "1+0". */
export const roomsLabel = (listing: Pick<Listing, 'bedrooms' | 'livingRooms'>) =>
  listing.bedrooms === 0 ? '1+0' : `${listing.bedrooms}+${listing.livingRooms}`

export const pricePerM2 = (listing: Listing) => Math.round(listing.price / listing.grossArea)

/** A price drop in the last two weeks: worth a tag on the card. */
export function recentDrop(listing: Listing): number | undefined {
  const history = listing.priceHistory
  if (history.length < 2) return undefined
  const last = history[history.length - 1]!
  const before = history[history.length - 2]!
  if (last.daysAgo > 14 || last.price >= before.price) return undefined
  return Math.round(((before.price - last.price) / before.price) * 100)
}

export const isNew = (listing: Listing) => listing.listedDaysAgo <= 7

const locales: Record<Language, string> = { en: 'en-GB', tr: 'tr-TR' }

export function formatPrice(amount: number, language: Language) {
  return new Intl.NumberFormat(locales[language], {
    style: 'currency',
    currency: 'TRY',
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: 0,
  }).format(amount)
}

/** The short form a map pin has room for: ₺12.5M, ₺45K / ₺12,5 Mn, ₺45 B. */
export function formatCompactPrice(amount: number, language: Language) {
  return `₺${new Intl.NumberFormat(locales[language], {
    notation: 'compact',
    maximumFractionDigits: amount >= 1_000_000 ? 1 : 0,
  }).format(amount)}`
}

export function formatNumber(value: number, language: Language) {
  return new Intl.NumberFormat(locales[language]).format(value)
}

export function formatDistance(meters: number, language: Language) {
  return meters >= 1000
    ? `${new Intl.NumberFormat(locales[language], { maximumFractionDigits: 1 }).format(meters / 1000)} km`
    : `${meters} m`
}
