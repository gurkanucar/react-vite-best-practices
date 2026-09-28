/*
 * Zirve Arena — an invented multi-sport tournament site. The sports are real (football,
 * basketball, volleyball, tennis and chess) and so are their rules. Every club, player,
 * league and tournament is made up, so no real team, league or person is named.
 */

export const esportsBrand = 'Zirve Arena'

export function esportsRoot(standalone: boolean) {
  return standalone ? '/preview/esports' : '/showcases/esports'
}

export interface Loc {
  en: string
  tr: string
}

export type SportId = 'football' | 'basketball' | 'volleyball' | 'tennis' | 'chess'
export type RegionId = 'tr' | 'eu' | 'mena'
export type TournamentFormat = 'league' | 'knockout' | 'swiss'

export interface Sport {
  id: SportId
  color: string
  /** Tennis and chess are played by individuals, the rest by teams. */
  individual: boolean
  /** An emoji-free glyph for the sport's mark. */
  mark: string
}

export const sports: Record<SportId, Sport> = {
  football: { id: 'football', color: '#1f9d55', individual: false, mark: 'F' },
  basketball: { id: 'basketball', color: '#e8672c', individual: false, mark: 'B' },
  volleyball: { id: 'volleyball', color: '#2f6fed', individual: false, mark: 'V' },
  tennis: { id: 'tennis', color: '#b5c21b', individual: true, mark: 'T' },
  chess: { id: 'chess', color: '#6b4fd8', individual: true, mark: 'S' },
}

export const sportIds = Object.keys(sports) as SportId[]

export const regions: Record<RegionId, Loc> = {
  tr: { en: 'Türkiye', tr: 'Türkiye' },
  eu: { en: 'Europe', tr: 'Avrupa' },
  mena: { en: 'Middle East & North Africa', tr: 'Orta Doğu ve Kuzey Afrika' },
}

export const regionIds = Object.keys(regions) as RegionId[]

export interface Player {
  name: string
  /** Shirt number for team sports. */
  number?: number
  /** A position keyed into the copy, e.g. `gk` or `pg`. */
  position: string
  /** ISO country code. */
  country: string
  /** Chess title (GM, IM, FM). */
  title?: string
}

export interface Honour {
  year: number
  title: string
  place: 1 | 2 | 3
}

export interface Team {
  id: string
  name: string
  tag: string
  sport: SportId
  region: RegionId
  city: string
  /** Year founded for a club; year of birth for a player. */
  founded: number
  colors: [string, string]
  /** Elo-style strength used by the simulation; chess shows it as the Elo rating. */
  rating: number
  /** Rating a month ago; the rankings' trend arrows compare the two. */
  previousRating: number
  /** Tennis ranking points. */
  rankingPoints?: number
  /** Tennis: the playing hand. */
  hand?: 'right' | 'left'
  roster: Player[]
  coach: string
  honours: Honour[]
  individual: boolean
}

/* ---------- Names ---------- */

const trFirst = [
  'Emre',
  'Can',
  'Berk',
  'Deniz',
  'Mert',
  'Arda',
  'Kaan',
  'Oğuz',
  'Burak',
  'Onur',
  'Tuna',
  'Efe',
  'Umut',
  'Barış',
  'Cem',
  'Doruk',
  'Egemen',
  'Furkan',
  'Gökhan',
  'Hakan',
  'İlker',
  'Koray',
  'Levent',
  'Murat',
  'Nazım',
  'Orhan',
  'Polat',
  'Rüzgar',
  'Serkan',
  'Taylan',
  'Uğur',
  'Volkan',
  'Yiğit',
  'Zafer',
  'Alp',
  'Bora',
  'Çağan',
  'Doğan',
  'Ertan',
  'Ferit',
]
const trLast = [
  'Aksoy',
  'Balcı',
  'Cansız',
  'Demirtaş',
  'Erdem',
  'Fidan',
  'Güneş',
  'Hanoğlu',
  'Işık',
  'Kalkan',
  'Laçin',
  'Meriç',
  'Nalbant',
  'Okur',
  'Pekcan',
  'Saraç',
  'Şahinler',
  'Toprak',
  'Uysal',
  'Vural',
  'Yaman',
  'Zorlu',
  'Akın',
  'Bilgin',
  'Coşar',
  'Dalkıran',
  'Ekinci',
  'Filiz',
  'Gürel',
  'Hazar',
  'İnce',
  'Karakaya',
  'Keskin',
  'Mutlu',
  'Özbay',
  'Parlak',
  'Rona',
  'Sezer',
  'Tosun',
  'Ulaş',
]
const euFirst = [
  'Lukas',
  'Mateo',
  'Elias',
  'Jonas',
  'Marco',
  'Sven',
  'Hugo',
  'Milan',
  'Oskar',
  'Luca',
  'Tomas',
  'Nils',
]
const euLast = [
  'Brandt',
  'Rossi',
  'Novak',
  'Lindqvist',
  'Moreau',
  'Kovač',
  'Ferreira',
  'Janssen',
  'Weiss',
  'Horvath',
  'Dubois',
  'Nilsen',
]
const menaFirst = [
  'Omar',
  'Yousef',
  'Karim',
  'Rami',
  'Tariq',
  'Hamza',
  'Ziad',
  'Idris',
  'Faris',
  'Samir',
  'Hadi',
  'Nabil',
]
const menaLast = [
  'Haddad',
  'Mansour',
  'Khalil',
  'Saleh',
  'Nasser',
  'Farouk',
  'Amrani',
  'Bakri',
  'Zidan',
  'Qasim',
  'Rahal',
  'Taleb',
]

const usedNames = new Set<string>()

/** A made-up name that no other player on the site has. */
function uniqueName(region: RegionId, seed: number) {
  const [firsts, lasts] =
    region === 'tr'
      ? [trFirst, trLast]
      : region === 'eu'
        ? [euFirst, euLast]
        : [menaFirst, menaLast]
  for (let step = 0; ; step += 1) {
    const n = seed + step * 7
    const name = `${firsts[n % firsts.length]} ${lasts[(n * 5 + Math.floor(n / firsts.length)) % lasts.length]}`
    if (!usedNames.has(name)) {
      usedNames.add(name)
      return name
    }
  }
}

const countryOf: Record<RegionId, string[]> = {
  tr: ['TR'],
  eu: ['DE', 'IT', 'HR', 'SE', 'FR', 'SI', 'PT', 'NL', 'AT', 'NO'],
  mena: ['EG', 'MA', 'JO', 'LB', 'TN', 'QA', 'AE', 'KW'],
}

const positions: Record<'football' | 'basketball' | 'volleyball', string[]> = {
  // Eleven starters, then the bench.
  football: ['gk', 'rb', 'cb', 'cb', 'lb', 'dm', 'cm', 'am', 'rw', 'lw', 'st', 'gk', 'cm', 'st'],
  basketball: ['pg', 'sg', 'sf', 'pf', 'c', 'pg', 'sg', 'sf', 'pf', 'c'],
  // Six starters and the libero, then the bench.
  volleyball: ['s', 'oh', 'oh', 'mb', 'mb', 'opp', 'l', 's', 'oh', 'mb'],
}

const shirtNumbers: Record<'football' | 'basketball' | 'volleyball', number[]> = {
  football: [1, 2, 4, 5, 3, 6, 8, 10, 7, 11, 9, 12, 14, 19],
  basketball: [3, 7, 11, 23, 15, 0, 5, 9, 21, 34],
  volleyball: [2, 7, 9, 12, 14, 18, 1, 5, 10, 17],
}

interface ClubSeed {
  id: string
  name: string
  tag: string
  region: RegionId
  city: string
  founded: number
  colors: [string, string]
  rating: number
  previousRating: number
  honours?: Honour[]
}

let squadCursor = 0

function buildClub(seed: ClubSeed, sport: 'football' | 'basketball' | 'volleyball'): Team {
  const roster = positions[sport].map((position, slot) => {
    // Two or three signings from abroad per squad, the rest local.
    const foreign = seed.region !== 'tr' ? slot % 3 !== 0 : slot === 3 || slot === 9
    const region: RegionId = foreign
      ? seed.region === 'tr'
        ? slot === 3
          ? 'eu'
          : 'mena'
        : seed.region
      : 'tr'
    squadCursor += 1
    const countries = countryOf[region]
    return {
      name: uniqueName(region, squadCursor * 3),
      number: shirtNumbers[sport][slot],
      position,
      country: countries[(squadCursor + slot) % countries.length],
    }
  })
  squadCursor += 1
  return {
    ...seed,
    sport,
    roster,
    coach: uniqueName(seed.region, squadCursor * 11),
    honours: seed.honours ?? [],
    individual: false,
  }
}

const footballSeeds: ClubSeed[] = [
  {
    id: 'bogaz-fk',
    name: 'Boğaz FK',
    tag: 'BGZ',
    region: 'tr',
    city: 'İstanbul',
    founded: 1921,
    colors: ['#1d3fa8', '#f2c230'],
    rating: 1812,
    previousRating: 1790,
    honours: [{ year: 2025, title: 'Anadolu Kupası 2025', place: 1 }],
  },
  {
    id: 'ege-firtinasi',
    name: 'Ege Fırtınası',
    tag: 'EGE',
    region: 'tr',
    city: 'İzmir',
    founded: 1934,
    colors: ['#0f8fb3', '#ffffff'],
    rating: 1776,
    previousRating: 1781,
    honours: [{ year: 2025, title: 'Anadolu Kupası 2025', place: 2 }],
  },
  {
    id: 'toros-spor',
    name: 'Toros Spor',
    tag: 'TRS',
    region: 'tr',
    city: 'Adana',
    founded: 1946,
    colors: ['#2f6b2f', '#f1f1f1'],
    rating: 1741,
    previousRating: 1722,
  },
  {
    id: 'kapadokya-sk',
    name: 'Kapadokya SK',
    tag: 'KPD',
    region: 'tr',
    city: 'Nevşehir',
    founded: 1968,
    colors: ['#c2562b', '#f5deb3'],
    rating: 1702,
    previousRating: 1710,
  },
  {
    id: 'galata-genclik',
    name: 'Galata Gençlik',
    tag: 'GLT',
    region: 'tr',
    city: 'İstanbul',
    founded: 1957,
    colors: ['#5b2a86', '#f7b32b'],
    rating: 1688,
    previousRating: 1661,
  },
  {
    id: 'karadeniz-dalga',
    name: 'Karadeniz Dalga',
    tag: 'KDZ',
    region: 'tr',
    city: 'Trabzon',
    founded: 1972,
    colors: ['#7a1f3d', '#4fb3e8'],
    rating: 1669,
    previousRating: 1675,
  },
  {
    id: 'anka-fk',
    name: 'Anka FK',
    tag: 'ANK',
    region: 'tr',
    city: 'Ankara',
    founded: 1938,
    colors: ['#d4262e', '#ffb347'],
    rating: 1655,
    previousRating: 1640,
  },
  {
    id: 'kordon-sk',
    name: 'Kordon SK',
    tag: 'KRD',
    region: 'tr',
    city: 'İzmir',
    founded: 1980,
    colors: ['#e63946', '#1d3557'],
    rating: 1624,
    previousRating: 1633,
  },
]

const basketballSeeds: ClubSeed[] = [
  {
    id: 'baskent-devleri',
    name: 'Başkent Devleri',
    tag: 'BSK',
    region: 'tr',
    city: 'Ankara',
    founded: 1966,
    colors: ['#3a0ca3', '#f72585'],
    rating: 1798,
    previousRating: 1770,
    honours: [{ year: 2025, title: 'Pota Kupası 2025', place: 1 }],
  },
  {
    id: 'moda-simsekleri',
    name: 'Moda Şimşekleri',
    tag: 'MDA',
    region: 'tr',
    city: 'İstanbul',
    founded: 1971,
    colors: ['#118ab2', '#ffd23f'],
    rating: 1780,
    previousRating: 1792,
  },
  {
    id: 'korfez-yunuslari',
    name: 'Körfez Yunusları',
    tag: 'KRF',
    region: 'tr',
    city: 'İzmir',
    founded: 1983,
    colors: ['#006d77', '#83c5be'],
    rating: 1744,
    previousRating: 1731,
  },
  {
    id: 'uludag-ayilari',
    name: 'Uludağ Ayıları',
    tag: 'ULU',
    region: 'tr',
    city: 'Bursa',
    founded: 1975,
    colors: ['#5e3023', '#f3e9dc'],
    rating: 1721,
    previousRating: 1700,
  },
  {
    id: 'cukurova-pars',
    name: 'Çukurova Pars',
    tag: 'CKR',
    region: 'tr',
    city: 'Adana',
    founded: 1990,
    colors: ['#f4a261', '#264653'],
    rating: 1693,
    previousRating: 1702,
  },
  {
    id: 'marmara-martilari',
    name: 'Marmara Martıları',
    tag: 'MRM',
    region: 'tr',
    city: 'Tekirdağ',
    founded: 1994,
    colors: ['#e5e5e5', '#0b3d91'],
    rating: 1668,
    previousRating: 1650,
  },
  {
    id: 'trakya-atlari',
    name: 'Trakya Atları',
    tag: 'TRK',
    region: 'tr',
    city: 'Edirne',
    founded: 1988,
    colors: ['#9e1b32', '#fbe3a1'],
    rating: 1645,
    previousRating: 1657,
  },
  {
    id: 'van-kedileri',
    name: 'Van Kedileri',
    tag: 'VAN',
    region: 'tr',
    city: 'Van',
    founded: 2001,
    colors: ['#f0f0f0', '#d4a017'],
    rating: 1619,
    previousRating: 1603,
  },
]

const volleyballSeeds: ClubSeed[] = [
  {
    id: 'kuzey-ruzgari',
    name: 'Kuzey Rüzgarı VK',
    tag: 'KZY',
    region: 'tr',
    city: 'Samsun',
    founded: 1979,
    colors: ['#0c3b3a', '#5ef2c2'],
    rating: 1790,
    previousRating: 1778,
    honours: [{ year: 2025, title: 'File Kupası 2025', place: 1 }],
  },
  {
    id: 'mavi-dalga',
    name: 'Mavi Dalga VK',
    tag: 'MVD',
    region: 'tr',
    city: 'Antalya',
    founded: 1985,
    colors: ['#1252a3', '#9ad0ff'],
    rating: 1772,
    previousRating: 1780,
  },
  {
    id: 'yildiz-smac',
    name: 'Yıldız Smaç',
    tag: 'YSM',
    region: 'tr',
    city: 'İstanbul',
    founded: 1992,
    colors: ['#23135c', '#ffd166'],
    rating: 1745,
    previousRating: 1719,
  },
  {
    id: 'ada-blok',
    name: 'Ada Blok SK',
    tag: 'ADA',
    region: 'tr',
    city: 'Büyükada',
    founded: 1999,
    colors: ['#b85c1e', '#fff1dc'],
    rating: 1716,
    previousRating: 1722,
  },
  {
    id: 'sahil-pasor',
    name: 'Sahil Pasör VK',
    tag: 'SHL',
    region: 'tr',
    city: 'Mersin',
    founded: 1987,
    colors: ['#2d6a4f', '#fefae0'],
    rating: 1690,
    previousRating: 1679,
  },
  {
    id: 'zirve-voleybol',
    name: 'Zirve Voleybol',
    tag: 'ZRV',
    region: 'tr',
    city: 'Erzurum',
    founded: 2004,
    colors: ['#6d1a36', '#f0c75e'],
    rating: 1667,
    previousRating: 1671,
  },
  {
    id: 'lodos-vk',
    name: 'Lodos VK',
    tag: 'LDS',
    region: 'tr',
    city: 'Çanakkale',
    founded: 1996,
    colors: ['#2a2d5c', '#d0d6ff'],
    rating: 1648,
    previousRating: 1630,
  },
  {
    id: 'poyraz-sk',
    name: 'Poyraz SK',
    tag: 'PYZ',
    region: 'tr',
    city: 'Sinop',
    founded: 2008,
    colors: ['#8a1c1c', '#2bb3a3'],
    rating: 1622,
    previousRating: 1628,
  },
]

interface PersonSeed {
  id: string
  name: string
  tag: string
  region: RegionId
  country: string
  city: string
  born: number
  colors: [string, string]
  rating: number
  previousRating: number
  title?: string
  rankingPoints?: number
  hand?: 'right' | 'left'
  coach: string
  honours?: Honour[]
}

function buildPerson(seed: PersonSeed, sport: 'tennis' | 'chess'): Team {
  usedNames.add(seed.name)
  return {
    id: seed.id,
    name: seed.name,
    tag: seed.tag,
    sport,
    region: seed.region,
    city: seed.city,
    founded: seed.born,
    colors: seed.colors,
    rating: seed.rating,
    previousRating: seed.previousRating,
    rankingPoints: seed.rankingPoints,
    hand: seed.hand,
    roster: [
      {
        name: seed.name,
        position: sport === 'tennis' ? 'singles' : 'player',
        country: seed.country,
        title: seed.title,
      },
    ],
    coach: seed.coach,
    honours: seed.honours ?? [],
    individual: true,
  }
}

const tennisSeeds: PersonSeed[] = [
  {
    id: 'can-demirel',
    name: 'Can Demirel',
    tag: 'DEM',
    region: 'tr',
    country: 'TR',
    city: 'İstanbul',
    born: 2001,
    colors: ['#c1121f', '#fdf0d5'],
    rating: 1840,
    previousRating: 1818,
    rankingPoints: 4820,
    hand: 'right',
    coach: 'Selim Aras',
    honours: [{ year: 2025, title: 'Zirve Open 2025', place: 1 }],
  },
  {
    id: 'tomas-varga',
    name: 'Tomas Varga',
    tag: 'VRG',
    region: 'eu',
    country: 'HU',
    city: 'Budapest',
    born: 1998,
    colors: ['#386641', '#f2e8cf'],
    rating: 1822,
    previousRating: 1830,
    rankingPoints: 4410,
    hand: 'right',
    coach: 'Peter Hollo',
    honours: [{ year: 2025, title: 'Zirve Open 2025', place: 2 }],
  },
  {
    id: 'yusuf-amrani',
    name: 'Yusuf Amrani',
    tag: 'AMR',
    region: 'mena',
    country: 'MA',
    city: 'Rabat',
    born: 2003,
    colors: ['#9d0208', '#ffba08'],
    rating: 1790,
    previousRating: 1762,
    rankingPoints: 3890,
    hand: 'left',
    coach: 'Driss Alaoui',
  },
  {
    id: 'jonas-weber',
    name: 'Jonas Weber',
    tag: 'WEB',
    region: 'eu',
    country: 'DE',
    city: 'Hamburg',
    born: 1997,
    colors: ['#14213d', '#fca311'],
    rating: 1771,
    previousRating: 1783,
    rankingPoints: 3605,
    hand: 'right',
    coach: 'Anke Lorenz',
  },
  {
    id: 'emir-tekin',
    name: 'Emir Tekin',
    tag: 'TEK',
    region: 'tr',
    country: 'TR',
    city: 'Ankara',
    born: 2004,
    colors: ['#3a86ff', '#ffffff'],
    rating: 1748,
    previousRating: 1725,
    rankingPoints: 3120,
    hand: 'right',
    coach: 'Ayla Sungur',
  },
  {
    id: 'mateo-ruiz',
    name: 'Mateo Ruiz',
    tag: 'RUZ',
    region: 'eu',
    country: 'ES',
    city: 'Valencia',
    born: 2000,
    colors: ['#e76f51', '#264653'],
    rating: 1730,
    previousRating: 1741,
    rankingPoints: 2875,
    hand: 'left',
    coach: 'Pau Serrat',
  },
  {
    id: 'kerem-aydin',
    name: 'Kerem Aydın',
    tag: 'AYD',
    region: 'tr',
    country: 'TR',
    city: 'İzmir',
    born: 2002,
    colors: ['#023e8a', '#90e0ef'],
    rating: 1707,
    previousRating: 1690,
    rankingPoints: 2410,
    hand: 'right',
    coach: 'Nevzat Oral',
  },
  {
    id: 'luka-horvat',
    name: 'Luka Horvat',
    tag: 'HRV',
    region: 'eu',
    country: 'HR',
    city: 'Split',
    born: 1999,
    colors: ['#d00000', '#ffffff'],
    rating: 1685,
    previousRating: 1694,
    rankingPoints: 2150,
    hand: 'right',
    coach: 'Ivo Babić',
  },
]

const chessSeeds: PersonSeed[] = [
  {
    id: 'deniz-aksoy',
    name: 'Deniz Aksoy',
    tag: 'AKS',
    region: 'tr',
    country: 'TR',
    city: 'İstanbul',
    born: 1999,
    colors: ['#1b1b1b', '#e9d8a6'],
    rating: 2688,
    previousRating: 2671,
    title: 'GM',
    coach: 'Rıfat Gönül',
    honours: [{ year: 2025, title: 'Boğaziçi Açık 2025', place: 1 }],
  },
  {
    id: 'lukas-brenner',
    name: 'Lukas Brenner',
    tag: 'BRN',
    region: 'eu',
    country: 'AT',
    city: 'Vienna',
    born: 1995,
    colors: ['#3d405b', '#f4f1de'],
    rating: 2662,
    previousRating: 2669,
    title: 'GM',
    coach: 'Hanna Graf',
  },
  {
    id: 'elif-karan',
    name: 'Elif Karan',
    tag: 'KRN',
    region: 'tr',
    country: 'TR',
    city: 'Ankara',
    born: 2002,
    colors: ['#6b4fd8', '#f2e9ff'],
    rating: 2641,
    previousRating: 2618,
    title: 'GM',
    coach: 'Metin Uz',
  },
  {
    id: 'mert-yalin',
    name: 'Mert Yalın',
    tag: 'YLN',
    region: 'tr',
    country: 'TR',
    city: 'İzmir',
    born: 1997,
    colors: ['#344e41', '#dad7cd'],
    rating: 2615,
    previousRating: 2622,
    title: 'GM',
    coach: 'Oya Esen',
  },
  {
    id: 'selin-tunali',
    name: 'Selin Tunalı',
    tag: 'TNL',
    region: 'tr',
    country: 'TR',
    city: 'Eskişehir',
    born: 2004,
    colors: ['#9c6644', '#ede0d4'],
    rating: 2533,
    previousRating: 2511,
    title: 'IM',
    coach: 'Kemal Tan',
  },
  {
    id: 'nadia-haddad',
    name: 'Nadia Haddad',
    tag: 'HDD',
    region: 'mena',
    country: 'LB',
    city: 'Beirut',
    born: 2000,
    colors: ['#006400', '#f5f5dc'],
    rating: 2521,
    previousRating: 2530,
    title: 'IM',
    coach: 'Samir Azar',
  },
  {
    id: 'kaan-ersoy',
    name: 'Kaan Ersoy',
    tag: 'ERS',
    region: 'tr',
    country: 'TR',
    city: 'Bursa',
    born: 2005,
    colors: ['#bc4749', '#f2e8cf'],
    rating: 2508,
    previousRating: 2480,
    title: 'IM',
    coach: 'Leyla Kurt',
  },
  {
    id: 'zeynep-ilgaz',
    name: 'Zeynep Ilgaz',
    tag: 'ILG',
    region: 'tr',
    country: 'TR',
    city: 'Trabzon',
    born: 2006,
    colors: ['#0077b6', '#caf0f8'],
    rating: 2467,
    previousRating: 2452,
    title: 'FM',
    coach: 'Harun Sel',
  },
]

export const teams: Team[] = [
  ...tennisSeeds.map((seed) => buildPerson(seed, 'tennis')),
  ...chessSeeds.map((seed) => buildPerson(seed, 'chess')),
  ...footballSeeds.map((seed) => buildClub(seed, 'football')),
  ...basketballSeeds.map((seed) => buildClub(seed, 'basketball')),
  ...volleyballSeeds.map((seed) => buildClub(seed, 'volleyball')),
]

export const teamById = new Map(teams.map((team) => [team.id, team]))

export function teamsOf(sport: SportId) {
  return teams.filter((team) => team.sport === sport)
}

/* ---------- Tournaments ---------- */

export interface PrizeShare {
  /** Inclusive range of places sharing this line, e.g. [3, 4]. */
  places: [number, number]
  /** Percent of the pool for each place in the range. */
  percent: number
}

export interface TournamentBase {
  id: string
  name: string
  sport: SportId
  format: TournamentFormat
  tier: 'S' | 'A' | 'B'
  location: Loc
  prizePool: number
  currency: 'TRY' | 'USD' | 'EUR'
  prizes: PrizeShare[]
  about: Loc
  /** Hue pair for the banner art. */
  art: [string, string]
}

/** One scheduled match: `[day offset from today, "HH:MM"]`. */
export type Slot = [number, string]

export interface KnockoutTournament extends TournamentBase {
  format: 'knockout'
  /** Seeded order: 1 v 2, 3 v 4, … in the first round. */
  seeds: string[]
  /** One list of slots per round, first round first. */
  schedule: Slot[][]
  /** Tennis: sets needed to win (2 for best of three, 3 for best of five). */
  setsToWin?: number
}

/**
 * A league that never stops: a new fixture every `every` minutes, all day, cycling through
 * every pairing. The table covers today's finished matches.
 */
export interface LeagueTournament extends TournamentBase {
  format: 'league'
  teams: string[]
  every: number
}

/** Chess Swiss: each round pairs players on the same score; one round a day. */
export interface SwissTournament extends TournamentBase {
  format: 'swiss'
  players: string[]
  rounds: Slot[]
}

export type Tournament = KnockoutTournament | LeagueTournament | SwissTournament

const idsOf = (seeds: { id: string }[]) => seeds.map((seed) => seed.id)
const footballIds = idsOf(footballSeeds)
const basketballIds = idsOf(basketballSeeds)
const volleyballIds = idsOf(volleyballSeeds)
const tennisIds = idsOf(tennisSeeds)
const chessIds = idsOf(chessSeeds)

/** Standard seeding for eight: the top two can only meet in the final. */
const seeded = (ids: string[]) => [0, 7, 3, 4, 1, 6, 2, 5].map((index) => ids[index])

const leaguePrizes: PrizeShare[] = [
  { places: [1, 1], percent: 40 },
  { places: [2, 2], percent: 25 },
  { places: [3, 3], percent: 15 },
  { places: [4, 4], percent: 10 },
  { places: [5, 8], percent: 2.5 },
]

const knockoutPrizes: PrizeShare[] = [
  { places: [1, 1], percent: 45 },
  { places: [2, 2], percent: 25 },
  { places: [3, 4], percent: 10 },
  { places: [5, 8], percent: 2.5 },
]

export const tournaments: Tournament[] = [
  {
    id: 'zirve-futbol-ligi',
    name: 'Zirve Futbol Ligi',
    sport: 'football',
    format: 'league',
    tier: 'S',
    location: { en: 'Stadiums across Türkiye', tr: 'Türkiye’nin dört bir yanındaki stadyumlar' },
    prizePool: 2_000_000,
    currency: 'TRY',
    prizes: leaguePrizes,
    about: {
      en: 'Eight clubs, a match every twenty minutes, all day long. Three points for a win, one for a draw; the table starts again at midnight. Broadcasts run fast: a match minute lasts twenty seconds.',
      tr: 'Sekiz kulüp, gün boyu her yirmi dakikada bir maç. Galibiyet üç, beraberlik bir puan; tablo gece yarısı sıfırlanır. Yayınlar hızlıdır: bir maç dakikası yirmi saniye sürer.',
    },
    art: ['#1f9d55', '#0b2e1c'],
    teams: footballIds,
    every: 20,
  },
  {
    id: 'anadolu-kupasi',
    name: 'Anadolu Kupası',
    sport: 'football',
    format: 'knockout',
    tier: 'A',
    location: { en: 'Final at Kordon Stadium, İzmir', tr: 'Final Kordon Stadı’nda, İzmir' },
    prizePool: 3_500_000,
    currency: 'TRY',
    prizes: knockoutPrizes,
    about: {
      en: 'The cup: one match per tie. Level after 90 minutes means extra time, and level after 120 means penalties.',
      tr: 'Kupa: her tur tek maç. 90 dakika berabere biterse uzatmaya, 120 dakika da berabere biterse penaltılara gidilir.',
    },
    art: ['#d4262e', '#2a0f0f'],
    seeds: seeded(footballIds),
    schedule: [
      [
        [-1, '14:00'],
        [-1, '16:30'],
        [-1, '19:00'],
        [-1, '21:30'],
      ],
      [
        [0, '17:00'],
        [0, '20:30'],
      ],
      [[1, '20:45']],
    ],
  },
  {
    id: 'pota-ligi',
    name: 'Pota Ligi',
    sport: 'basketball',
    format: 'league',
    tier: 'S',
    location: { en: 'Arenas across Türkiye', tr: 'Türkiye’nin salonları' },
    prizePool: 1_600_000,
    currency: 'TRY',
    prizes: leaguePrizes,
    about: {
      en: 'Four ten-minute quarters under FIBA rules, a tip-off every fifteen minutes. Two points for a win, one for a loss. The game clock runs at double speed on the broadcast.',
      tr: 'FIBA kurallarıyla onar dakikalık dört çeyrek, her on beş dakikada bir hava atışı. Galibiyet iki, mağlubiyet bir puan. Yayında oyun saati iki kat hızlı akar.',
    },
    art: ['#e8672c', '#2b1204'],
    teams: basketballIds,
    every: 15,
  },
  {
    id: 'pota-kupasi',
    name: 'Pota Kupası',
    sport: 'basketball',
    format: 'knockout',
    tier: 'A',
    location: { en: 'Başkent Arena, Ankara', tr: 'Başkent Arena, Ankara' },
    prizePool: 1_200_000,
    currency: 'TRY',
    prizes: knockoutPrizes,
    about: {
      en: 'A final-eight weekend. Single games, overtime until there is a winner.',
      tr: 'Sekizli final hafta sonu. Tek maç, kazanan çıkana kadar uzatma.',
    },
    art: ['#f72585', '#3a0ca3'],
    seeds: seeded(basketballIds),
    schedule: [
      [
        [-25, '13:00'],
        [-25, '15:30'],
        [-25, '18:00'],
        [-25, '20:30'],
      ],
      [
        [-24, '17:00'],
        [-24, '20:00'],
      ],
      [[-23, '19:00']],
    ],
  },
  {
    id: 'file-ligi',
    name: 'File Ligi',
    sport: 'volleyball',
    format: 'league',
    tier: 'S',
    location: { en: 'Halls across Türkiye', tr: 'Türkiye’nin salonları' },
    prizePool: 1_200_000,
    currency: 'TRY',
    prizes: leaguePrizes,
    about: {
      en: 'Best of five sets, rally scoring to 25 (the fifth to 15), win by two. A 3–0 or 3–1 win is worth three points; a 3–2 win two, and the loser takes one.',
      tr: 'Beş set üzerinden, her ralli sayı, 25’e kadar (beşinci set 15’e), iki sayı farkla. 3–0 ya da 3–1 galibiyet üç puan; 3–2’de kazanan iki, kaybeden bir puan alır.',
    },
    art: ['#2f6fed', '#0b1a3d'],
    teams: volleyballIds,
    every: 25,
  },
  {
    id: 'file-kupasi',
    name: 'File Kupası',
    sport: 'volleyball',
    format: 'knockout',
    tier: 'A',
    location: { en: 'Sahil Salonu, Antalya', tr: 'Sahil Salonu, Antalya' },
    prizePool: 900_000,
    currency: 'TRY',
    prizes: knockoutPrizes,
    about: {
      en: 'Eight clubs, three days, one trophy. Every tie is a single best-of-five match.',
      tr: 'Sekiz kulüp, üç gün, tek kupa. Her tur beş set üzerinden tek maç.',
    },
    art: ['#5ec8ff', '#1a1446'],
    seeds: seeded(volleyballIds),
    schedule: [
      [
        [9, '14:00'],
        [9, '16:30'],
        [9, '19:00'],
        [9, '21:00'],
      ],
      [
        [10, '17:00'],
        [10, '19:30'],
      ],
      [[11, '19:00']],
    ],
  },
  {
    id: 'zirve-open',
    name: 'Zirve Open',
    sport: 'tennis',
    format: 'knockout',
    tier: 'S',
    location: { en: 'Center Court, İstanbul', tr: 'Merkez Kort, İstanbul' },
    prizePool: 450_000,
    currency: 'USD',
    prizes: knockoutPrizes,
    about: {
      en: 'An eight-man singles draw on hard courts. Best of three sets with a tie-break at 6–6.',
      tr: 'Sert kortta sekiz kişilik tekler ana tablosu. Üç set üzerinden, 6–6’da tie-break.',
    },
    art: ['#b5c21b', '#1f3a10'],
    seeds: seeded(tennisIds),
    schedule: [
      [
        [-1, '12:00'],
        [-1, '14:30'],
        [-1, '17:00'],
        [-1, '19:30'],
      ],
      [
        [0, '16:00'],
        [0, '19:00'],
      ],
      [[1, '18:00']],
    ],
    setsToWin: 2,
  },
  {
    id: 'tenis-serisi',
    name: 'Kort Serisi',
    sport: 'tennis',
    format: 'league',
    tier: 'B',
    location: { en: 'Court 2, İstanbul', tr: '2 No’lu Kort, İstanbul' },
    prizePool: 60_000,
    currency: 'USD',
    prizes: leaguePrizes,
    about: {
      en: 'Exhibition singles around the clock on Court 2: best of three sets, a new match every twenty minutes. Points are played at broadcast pace.',
      tr: '2 No’lu Kort’ta gece gündüz gösteri maçları: üç set üzerinden, her yirmi dakikada yeni maç. Sayılar yayın hızında oynanır.',
    },
    art: ['#d4e157', '#33691e'],
    teams: tennisIds,
    every: 20,
  },
  {
    id: 'kis-masters',
    name: 'Kış Masters',
    sport: 'tennis',
    format: 'knockout',
    tier: 'S',
    location: { en: 'Indoor Arena, Ankara', tr: 'Kapalı Arena, Ankara' },
    prizePool: 800_000,
    currency: 'USD',
    prizes: knockoutPrizes,
    about: {
      en: 'The season’s grand event: best of five sets from the first round, tie-break at 6–6 in every set.',
      tr: 'Sezonun büyük etkinliği: ilk turdan itibaren beş set üzerinden, her sette 6–6’da tie-break.',
    },
    art: ['#023e8a', '#90e0ef'],
    seeds: seeded(tennisIds),
    schedule: [
      [
        [-40, '12:00'],
        [-40, '15:00'],
        [-40, '18:00'],
        [-40, '21:00'],
      ],
      [
        [-39, '15:00'],
        [-39, '19:00'],
      ],
      [[-38, '18:00']],
    ],
    setsToWin: 3,
  },
  {
    id: 'satranc-kapali',
    name: 'Zirve Hızlı Satranç',
    sport: 'chess',
    format: 'league',
    tier: 'S',
    location: { en: 'Online, all day', tr: 'Çevrim içi, gün boyu' },
    prizePool: 50_000,
    currency: 'USD',
    prizes: leaguePrizes,
    about: {
      en: 'A rapid round robin (25 minutes + 10 seconds a move) that never sleeps: a new game every fifteen minutes. Win 1, draw ½, loss 0. Ties are split by Buchholz.',
      tr: 'Hiç durmayan bir hızlı satranç çift devresi (25 dakika + hamle başı 10 saniye): her on beş dakikada yeni bir oyun. Galibiyet 1, beraberlik ½, yenilgi 0. Eşitlikte Buchholz bakılır.',
    },
    art: ['#6b4fd8', '#150d33'],
    teams: chessIds,
    every: 15,
  },
  {
    id: 'bogazici-acik',
    name: 'Boğaziçi Açık',
    sport: 'chess',
    format: 'swiss',
    tier: 'A',
    location: { en: 'Kongre Salonu, İstanbul', tr: 'Kongre Salonu, İstanbul' },
    prizePool: 30_000,
    currency: 'EUR',
    prizes: [
      { places: [1, 1], percent: 40 },
      { places: [2, 2], percent: 25 },
      { places: [3, 3], percent: 15 },
      { places: [4, 4], percent: 10 },
      { places: [5, 6], percent: 5 },
    ],
    about: {
      en: 'Five-round Swiss: each round pairs players on the same score who have not met yet. Buchholz breaks ties.',
      tr: 'Beş turlu İsviçre sistemi: her tur aynı puandaki ve daha önce karşılaşmamış oyuncular eşleşir. Eşitliği Buchholz bozar.',
    },
    art: ['#e9d8a6', '#3d2b1f'],
    players: chessIds,
    rounds: [
      [-2, '15:00'],
      [-1, '15:00'],
      [0, '15:00'],
      [1, '15:00'],
      [2, '15:00'],
    ],
  },
  {
    id: 'satranc-kupasi',
    name: 'Satranç Kupası',
    sport: 'chess',
    format: 'knockout',
    tier: 'A',
    location: { en: 'Online', tr: 'Çevrim içi' },
    prizePool: 25_000,
    currency: 'USD',
    prizes: knockoutPrizes,
    about: {
      en: 'Knockout rapid: one game per tie. A draw goes to an Armageddon game with colours reversed, where Black wins on a draw.',
      tr: 'Eleme usulü hızlı satranç: her tur tek oyun. Beraberlikte renkler değişir ve Armageddon oynanır; orada beraberlik Siyah’ın galibiyetidir.',
    },
    art: ['#3d405b', '#f4f1de'],
    seeds: seeded(chessIds),
    schedule: [
      [
        [-14, '15:00'],
        [-14, '15:00'],
        [-14, '17:00'],
        [-14, '17:00'],
      ],
      [
        [-13, '15:00'],
        [-13, '17:00'],
      ],
      [[-12, '16:00']],
    ],
  },
]

export const tournamentById = new Map(tournaments.map((tournament) => [tournament.id, tournament]))

export function tournamentTeams(tournament: Tournament): string[] {
  switch (tournament.format) {
    case 'knockout':
      return tournament.seeds
    case 'league':
      return tournament.teams
    case 'swiss':
      return tournament.players
  }
}
