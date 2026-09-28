import type { VoteEntry } from '@/features/showcases/data/songContestRanking'

type Text = { en: string; tr: string }

export const songContestBrand = 'Sesin Rengi'

/** Where the site lives: the full-page preview or the admin's showcase section. */
export const songContestRoot = (standalone: boolean) =>
  standalone ? '/preview/song-contest' : '/showcases/song-contest'

export type HairStyle = 'long' | 'short' | 'curly' | 'bun' | 'waves'
export type Accessory = 'glasses' | 'earring' | 'hat' | 'none'

export interface Portrait {
  skin: string
  hair: string
  style: HairStyle
  accessory: Accessory
}

/** A stock stage photo standing in for the singer, with the point the crop keeps in view. */
export interface StagePhoto {
  /** The Unsplash photo id, the part after `photo-` in its image address. */
  id: string
  /** CSS object-position: where the face is, so no crop cuts it off. */
  focus: string
  alt: Text
}

export interface Contestant {
  id: string
  name: string
  age: number
  city: string
  color: string
  /** Four finalists sing on the night; the rest only appear in the results demos. */
  finalist: boolean
  coach: string
  genre: Text
  song: { title: string; credit: Text }
  /** Musical key and tempo of the arrangement, shown on the performance card. */
  key: Text
  bpm: number
  /** Length of the performance in seconds. */
  duration: number
  bio: Text
  quote: Text
  photo: StagePhoto
  /** Drawn stand-in, shown when the photo cannot load. */
  portrait: Portrait
}

/** An Unsplash image at a given width, cropped and compressed by their image service. */
export const stagePhotoUrl = (id: string, width: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=80`

export const STAGE_PHOTO_WIDTHS = [600, 900, 1200, 1600]

/*
 * Everyone here is invented. The songs are traditional, in the public domain, or the
 * contestant's own (made-up) composition, so nothing borrows a real artist's work.
 */
export const contestants: Contestant[] = [
  {
    id: 'elif',
    name: 'Elif Şahin',
    age: 23,
    city: 'Ankara',
    color: '#8b6cff',
    finalist: true,
    coach: 'Selin Tan',
    genre: { en: 'Folk', tr: 'Folk' },
    song: {
      title: 'Scarborough Fair',
      credit: { en: 'Traditional English ballad', tr: 'Geleneksel İngiliz baladı' },
    },
    key: { en: 'D minor', tr: 'Re minör' },
    bpm: 84,
    duration: 214,
    bio: {
      en: 'An architecture student who started singing in the echo of Ankara’s underpasses. She arranges old ballads for voice and a single loop pedal, and her blind audition turned all four chairs.',
      tr: 'Ankara’nın alt geçitlerindeki yankıda şarkı söylemeye başlayan bir mimarlık öğrencisi. Eski baladları tek bir loop pedalı ve kendi sesiyle yeniden düzenliyor; kör seçmelerde dört koltuğu da çevirdi.',
    },
    quote: {
      en: 'An old song is a room other people have lived in. I just open the windows.',
      tr: 'Eski bir şarkı, başkalarının yaşadığı bir oda gibi. Ben sadece pencereleri açıyorum.',
    },
    photo: {
      id: '1718851332146-4f99cbefdf6d',
      focus: '62% 38%',
      alt: {
        en: 'Stock photo: A singer in profile at a microphone, in black and white',
        tr: 'Temsili fotoğraf: Mikrofon başında, profilden bir şarkıcı; siyah beyaz',
      },
    },
    portrait: { skin: '#f1c7a5', hair: '#2b1d16', style: 'long', accessory: 'earring' },
  },
  {
    id: 'deniz',
    name: 'Deniz Aksoy',
    age: 27,
    city: 'İzmir',
    color: '#ff4f8b',
    finalist: true,
    coach: 'Barış Er',
    genre: { en: 'Anatolian pop', tr: 'Anadolu pop' },
    song: {
      title: 'Sarı Gelin',
      credit: { en: 'Anonymous Anatolian folk song', tr: 'Anonim Anadolu türküsü' },
    },
    key: { en: 'A minor', tr: 'La minör' },
    bpm: 72,
    duration: 236,
    bio: {
      en: 'A ferry worker from Karşıyaka who sang to passengers on the night crossing until one of them filmed it. Deniz blends bağlama patterns with electronic beats she builds on a laptop between shifts.',
      tr: 'Gece seferinde yolculara şarkı söyleyen Karşıyakalı bir vapur çalışanı; yolculardan biri çekip paylaşana kadar. Bağlama kalıplarını, vardiya aralarında dizüstünde kurduğu elektronik ritimlerle harmanlıyor.',
    },
    quote: {
      en: 'The sea keeps time better than any metronome.',
      tr: 'Deniz, hiçbir metronomun tutamadığı kadar iyi tempo tutar.',
    },
    photo: {
      id: '1717278920189-f69e4697dcc1',
      focus: '46% 26%',
      alt: {
        en: 'Stock photo: A singer pointing to the crowd under blue stage light',
        tr: 'Temsili fotoğraf: Mavi sahne ışığında seyirciyi işaret eden bir şarkıcı',
      },
    },
    portrait: { skin: '#d9a47f', hair: '#7a2e1f', style: 'curly', accessory: 'none' },
  },
  {
    id: 'mert',
    name: 'Mert Kaya',
    age: 31,
    city: 'Trabzon',
    color: '#ffb020',
    finalist: true,
    coach: 'Nur Ada',
    genre: { en: 'Rock', tr: 'Rock' },
    song: {
      title: 'Gece Yarısı Treni',
      credit: { en: 'Original song by Mert Kaya', tr: 'Mert Kaya’nın kendi bestesi' },
    },
    key: { en: 'E major', tr: 'Mi majör' },
    bpm: 128,
    duration: 198,
    bio: {
      en: 'A carpenter who plays drums on anything with a flat surface. He wrote “Gece Yarısı Treni” about the last train out of a town he never left, and has sung it at every stage of the show.',
      tr: 'Düz yüzeyi olan her şeyde davul çalan bir marangoz. “Gece Yarısı Treni”ni hiç ayrılmadığı bir kasabadan kalkan son tren için yazdı ve yarışmanın her aşamasında bu şarkıyı söyledi.',
    },
    quote: {
      en: 'If the floor isn’t shaking, the song isn’t finished.',
      tr: 'Sahne sallanmıyorsa şarkı bitmemiştir.',
    },
    photo: {
      id: '1761521299899-3e6824f290ea',
      focus: '42% 42%',
      alt: {
        en: 'Stock photo: A singer gripping a microphone close up, guitars behind',
        tr: 'Temsili fotoğraf: Mikrofonu sıkıca tutan bir şarkıcı, arkada gitarlar',
      },
    },
    portrait: { skin: '#e8b48c', hair: '#15110f', style: 'short', accessory: 'hat' },
  },
  {
    id: 'can',
    name: 'Can Yıldız',
    age: 25,
    city: 'Diyarbakır',
    color: '#1fc7a8',
    finalist: true,
    coach: 'Kaan Demir',
    genre: { en: 'Soul', tr: 'Soul' },
    song: {
      title: 'Amazing Grace',
      credit: { en: 'Hymn by John Newton (1779)', tr: 'John Newton’ın ilahisi (1779)' },
    },
    key: { en: 'G major', tr: 'Sol majör' },
    bpm: 66,
    duration: 252,
    bio: {
      en: 'A music teacher who runs a children’s choir on weekends. Can’s low register and long, patient phrasing made him the jury’s favourite in the semi-final.',
      tr: 'Hafta sonları bir çocuk korosu yöneten müzik öğretmeni. Pes sesi ve sabırla uzattığı cümleleriyle yarı finalde jürinin gözdesi oldu.',
    },
    quote: {
      en: 'Silence is part of the melody. Most people rush it.',
      tr: 'Sessizlik de melodinin parçası. Çoğu kişi onu aceleye getiriyor.',
    },
    photo: {
      id: '1575285113814-f770cb8c796e',
      focus: '55% 34%',
      alt: {
        en: 'Stock photo: A singer lit in blue, eyes closed at the microphone',
        tr: 'Temsili fotoğraf: Mavi ışıkta, gözleri kapalı mikrofona söyleyen bir şarkıcı',
      },
    },
    portrait: { skin: '#b9825c', hair: '#1c1512', style: 'waves', accessory: 'glasses' },
  },
  {
    id: 'zeynep',
    name: 'Zeynep Arslan',
    age: 19,
    city: 'Eskişehir',
    color: '#3aa8ff',
    finalist: false,
    coach: 'Selin Tan',
    genre: { en: 'Pop', tr: 'Pop' },
    song: {
      title: 'Deniz Kokusu',
      credit: { en: 'Original song by Zeynep Arslan', tr: 'Zeynep Arslan’ın kendi bestesi' },
    },
    key: { en: 'C major', tr: 'Do majör' },
    bpm: 112,
    duration: 188,
    bio: {
      en: 'The youngest singer of the season and the jury’s wildcard. A first-year music student, she writes bright, hook-heavy pop on a borrowed keyboard.',
      tr: 'Sezonun en genç sesi ve jürinin sürpriz kartı. Konservatuvar birinci sınıf öğrencisi; ödünç aldığı bir klavyede parlak, akılda kalan pop şarkılar yazıyor.',
    },
    quote: {
      en: 'A chorus should feel like a door swinging open.',
      tr: 'Nakarat, ardına kadar açılan bir kapı gibi hissettirmeli.',
    },
    photo: {
      id: '1712669310182-051011bb61c5',
      focus: '64% 42%',
      alt: {
        en: 'Stock photo: A singer with a raised hand in purple stage light',
        tr: 'Temsili fotoğraf: Mor sahne ışığında elini kaldırmış bir şarkıcı',
      },
    },
    portrait: { skin: '#f4d0b5', hair: '#c9772f', style: 'bun', accessory: 'none' },
  },
]

/** A made-up organiser for the show's credit line. */
export const songContestOrganiser = 'Mavi Nota Kültür Vakfı'

const VOWELS = 'aeıioöuü'

/**
 * The Turkish genitive ending for a name: "Tan’ın", "Er’in", "Ada’nın", "Ünlü’nün". It follows
 * the last vowel (a/ı → ı, e/i → i, o/u → u, ö/ü → ü) and takes a buffer "n" after a vowel.
 */
export function turkishGenitive(name: string): string {
  const lower = name.trim().toLocaleLowerCase('tr-TR')
  const lastVowel = [...lower].reverse().find((letter) => VOWELS.includes(letter)) ?? 'e'
  const vowel =
    lastVowel === 'a' || lastVowel === 'ı'
      ? 'ı'
      : lastVowel === 'e' || lastVowel === 'i'
        ? 'i'
        : lastVowel === 'o' || lastVowel === 'u'
          ? 'u'
          : 'ü'
  const endsInVowel = VOWELS.includes(lower.at(-1) ?? '')
  return `${name.trim()}’${endsInVowel ? 'n' : ''}${vowel}n`
}

/** "Selin Tan’ın takımı" / "Team Selin Tan". */
export function teamName(coach: string, language: 'en' | 'tr'): string {
  return language === 'tr' ? `${turkishGenitive(coach)} takımı` : `Team ${coach}`
}

/** Upper case that knows Turkish dotted and dotless i. */
export function upper(value: string, language: 'en' | 'tr'): string {
  return value.toLocaleUpperCase(language === 'tr' ? 'tr-TR' : 'en-GB')
}

export const finalists = contestants.filter((contestant) => contestant.finalist)

export const findContestant = (id: string | undefined) =>
  contestants.find((contestant) => contestant.id === id)

/* ---------------------------------------------------------------------------------------
 * The live round. Every 30 minutes a new round opens; voting runs for 27 minutes and the
 * last 3 are the "results are in" break. Everything below is worked out from the clock and
 * a seed, so the page shows the same numbers on every screen at the same moment.
 * ------------------------------------------------------------------------------------- */

export const ROUND_MS = 30 * 60_000
export const VOTING_MS = 27 * 60_000
const VOTING_SECONDS = VOTING_MS / 1000

export interface Round {
  id: number
  startsAt: number
  closesAt: number
  nextOpensAt: number
  open: boolean
  /** Whole seconds of voting so far, capped at the length of the window. */
  elapsed: number
}

export function roundAt(now: number): Round {
  const id = Math.floor(now / ROUND_MS)
  const startsAt = id * ROUND_MS
  const closesAt = startsAt + VOTING_MS
  return {
    id,
    startsAt,
    closesAt,
    nextOpensAt: startsAt + ROUND_MS,
    open: now < closesAt,
    elapsed: Math.min(VOTING_SECONDS, Math.max(0, Math.floor((now - startsAt) / 1000))),
  }
}

/** A stable number in [0, 1) for a pair of integers. */
export function noise(a: number, b: number): number {
  let h = Math.imul(a ^ 0x9e3779b9, 0x85ebca6b) ^ Math.imul(b + 0x632be5ab, 0xc2b2ae35)
  h = Math.imul(h ^ (h >>> 15), 0x2c1b3c6d)
  h = Math.imul(h ^ (h >>> 12), 0x297a2d39)
  return ((h ^ (h >>> 15)) >>> 0) / 4294967296
}

/** Moments a performance replay ends and the phones light up. */
const RECAPS = [4, 10, 16, 22].map((minute) => minute * 60)

/** A Poisson draw for rate `lambda`, from a uniform number `u` in [0, 1). */
export function poisson(lambda: number, u: number): number {
  let k = 0
  let p = Math.exp(-lambda)
  let cdf = p
  while (u > cdf && k < 60) {
    k += 1
    p *= lambda / k
    cdf += p
  }
  return k
}

/**
 * The expected votes per second at a moment of a round: a slow rise through the round, a
 * short warm-up, spikes when a replay ends, a few random bursts a minute, and a rush before
 * the lines close. Seconds then draw from a Poisson spread around it, so arrivals come in
 * uneven clumps of one to eight rather than a steady drip.
 */
export function voteRate(roundId: number, second: number): number {
  if (second < 0 || second >= VOTING_SECONDS) return 0
  const trend = 1.4 + 2.6 * (second / VOTING_SECONDS)
  let rate = trend * (0.35 + 0.65 * (1 - Math.exp(-second / 60)))
  for (const recap of RECAPS) {
    if (second >= recap && second < recap + 150) rate += 3.2 * Math.exp(-(second - recap) / 35)
  }
  const block = Math.floor(second / 50)
  const burstStart = block * 50 + Math.floor(noise(roundId + 900, block) * 35)
  const burstLength = 5 + noise(roundId + 901, block) * 10
  if (second >= burstStart && second < burstStart + burstLength)
    rate *= 1.5 + noise(roundId + 902, block) * 1.3
  const rush = second - (VOTING_SECONDS - 120)
  if (rush > 0) rate += (2.5 * rush) / 120
  return rate
}

/** Votes that arrive in one second of a round. */
export function votesInSecond(roundId: number, second: number): number {
  if (second < 0 || second >= VOTING_SECONDS) return 0
  return poisson(voteRate(roundId, second), noise(roundId, second))
}

/** Votes from the start of the round up to (not including) `second`. */
export function votesUntil(roundId: number, second: number): number {
  let sum = 0
  for (let s = 0; s < Math.min(second, VOTING_SECONDS); s += 1) sum += votesInSecond(roundId, s)
  return sum
}

export interface MinutePoint {
  minute: number
  votes: number
}

/** Votes per finished minute so far, plus the minute in progress. */
export function votesPerMinute(roundId: number, elapsed: number): MinutePoint[] {
  const points: MinutePoint[] = []
  for (let start = 0; start < elapsed; start += 60) {
    let votes = 0
    for (let s = start; s < Math.min(start + 60, elapsed); s += 1)
      votes += votesInSecond(roundId, s)
    points.push({ minute: start / 60 + 1, votes })
  }
  return points
}

export interface RatePoint {
  /** Seconds into the round where the slice starts. */
  second: number
  /** Votes per minute over the slice, so a half-finished slice is not a dip. */
  perMinute: number
}

/**
 * The vote rate over the last few minutes in short slices, for a chart that scrolls left as
 * the round goes on. Slices line up on fixed boundaries so earlier ones never change shape.
 */
export function rollingRate(
  roundId: number,
  elapsed: number,
  windowSeconds = 360,
  slice = 15,
): RatePoint[] {
  const end = Math.max(slice, elapsed)
  const first = Math.max(0, Math.floor((end - windowSeconds) / slice) * slice)
  const points: RatePoint[] = []
  for (let start = first; start < end; start += slice) {
    const stop = Math.min(start + slice, end)
    let votes = 0
    for (let s = start; s < stop; s += 1) votes += votesInSecond(roundId, s)
    points.push({ second: start, perMinute: Math.round((votes / (stop - start)) * 60) })
  }
  return points
}

export interface LiveStats {
  total: number
  lastMinute: number
  peakMinute: number
  /** People rather than votes: many voters send more than one. */
  voters: number
}

export function liveStats(roundId: number, elapsed: number): LiveStats {
  const total = votesUntil(roundId, elapsed)
  let lastMinute = 0
  for (let s = Math.max(0, elapsed - 60); s < elapsed; s += 1)
    lastMinute += votesInSecond(roundId, s)
  const minutes = votesPerMinute(roundId, elapsed)
  // The minute still running is not a fair peak; only whole minutes count.
  const whole = minutes.slice(0, Math.floor(elapsed / 60))
  return {
    total,
    lastMinute,
    peakMinute: whole.reduce((max, point) => Math.max(max, point.votes), 0),
    voters: Math.round(total / 1.6),
  }
}

/** The round's turnout goal, the figure the hosts keep pointing at. */
export const TURNOUT_TARGET = 7_000

/* ---- The split of the vote, with nobody named ---- */

/** Relative support behind the scenes; only ever shown as unlabelled slices. */
const HIDDEN_WEIGHTS = [58, 52, 44, 38]

/**
 * The live split of the votes so far as unlabelled slices, largest first. Sorting by size
 * means a slice's position says nothing about whose it is, and the counts always add up to
 * `total`. The shares drift a little as the round goes on so the ring visibly moves.
 */
export function anonymousSplit(roundId: number, elapsed: number, total: number): number[] {
  const weights = HIDDEN_WEIGHTS.map(
    (weight, index) =>
      weight *
      (1 + 0.09 * Math.sin(elapsed / 170 + index * 1.9 + roundId) + 0.05 * noise(roundId, index)),
  )
  const sum = weights.reduce((acc, weight) => acc + weight, 0)
  const exact = weights.map((weight) => (total * weight) / sum)
  const counts = exact.map(Math.floor)
  let left = total - counts.reduce((acc, count) => acc + count, 0)
  const order = exact
    .map((value, index) => ({ index, rest: value % 1 }))
    .sort((a, b) => b.rest - a.rest)
  for (const { index } of order) {
    if (left <= 0) break
    counts[index] += 1
    left -= 1
  }
  return counts.sort((a, b) => b - a)
}

/* ---- The feed of people voting: masked names only ---- */

const FIRST_NAMES = [
  'Ayşe',
  'Mehmet',
  'Zehra',
  'Emre',
  'Buse',
  'Kerem',
  'Ece',
  'Oğuz',
  'Selin',
  'Burak',
  'Derya',
  'Tolga',
  'İrem',
  'Umut',
  'Nazlı',
  'Hakan',
  'Gizem',
  'Serkan',
  'Melis',
  'Onur',
  'Sena',
  'Arda',
  'Dilan',
  'Yusuf',
  'Pelin',
  'Cem',
  'Hande',
  'Ozan',
  'Tuba',
  'Efe',
  'Ali',
  'Nur',
  'Elif',
  'Mustafa',
  'Fatma',
  'Ahmet',
  'Zeynep',
  'Hüseyin',
  'Emine',
  'Hasan',
  'Merve',
  'İbrahim',
  'Esra',
  'Murat',
  'Büşra',
  'Ömer',
  'Kübra',
  'Yasin',
  'Sibel',
  'Kaan',
  'Ceren',
  'Berk',
  'Aslı',
  'Deniz',
  'Tuğba',
  'Barış',
  'Özge',
  'Volkan',
  'Sinem',
  'Cansu',
  'Gökhan',
  'Seda',
  'Batuhan',
  'Eda',
  'Furkan',
  'Yağmur',
  'Oğuzhan',
  'Damla',
  'Sercan',
  'Ebru',
  'Taylan',
  'Gülşen',
  'Koray',
  'Şule',
  'Levent',
  'Öykü',
  'Çağan',
  'Ilgın',
  'Mert',
  'Duygu',
  'Erkan',
  'Nilay',
]
const SURNAMES = [
  'Yılmaz',
  'Kaya',
  'Demir',
  'Çelik',
  'Şahin',
  'Yıldız',
  'Aydın',
  'Öztürk',
  'Arslan',
  'Doğan',
  'Kılıç',
  'Aslan',
  'Çetin',
  'Koç',
  'Kurt',
  'Özdemir',
  'Güneş',
  'Ekinci',
  'Uçar',
  'İnce',
  'Polat',
  'Erdoğan',
  'Kara',
  'Tekin',
  'Aktaş',
  'Yalçın',
  'Güler',
  'Bulut',
  'Keskin',
  'Özkan',
  'Şimşek',
  'Avcı',
  'Taş',
  'Karaca',
  'Ünal',
  'Aksoy',
  'Sarı',
  'Yavuz',
  'Özer',
  'Bozkurt',
  'Işık',
  'Tuncer',
  'Oral',
  'Coşkun',
  'Başaran',
  'Duman',
  'Akın',
  'Gündüz',
  'Erdem',
  'Çakır',
]

/**
 * A name as the screen may show it: the first one or two letters of the first name, the rest
 * as stars, and only the initial of every other name. "Ayşe Yılmaz" → "Ay** Y.",
 * "Ali Kaya" → "A** K.". Short names keep at least two stars, so a name is never shown whole.
 */
export function maskName(fullName: string): string {
  const [first = '', ...rest] = fullName.trim().split(/\s+/)
  const letters = Array.from(first)
  const keep = letters.length >= 4 ? 2 : 1
  const stars = '*'.repeat(Math.max(2, letters.length - keep))
  const initials = rest.map((name) => `${Array.from(name)[0] ?? ''}.`)
  return [`${letters.slice(0, keep).join('')}${stars}`, ...initials].join(' ')
}

export interface FeedItem {
  id: string
  /** Already masked; the full name never leaves this module. */
  name: string
  initials: string
  /** Second of the round the vote came in. */
  second: number
  /** 1 to 3: how many votes this person just cast. */
  count: number
  hue: number
}

/** A voter for a given second, or nothing when that second is quiet in the feed. */
function feedItemAt(roundId: number, second: number): FeedItem | undefined {
  // Showing every vote would be a blur; roughly one second in two makes the feed.
  if (votesInSecond(roundId, second) === 0 || noise(roundId + 7, second) > 0.5) return undefined
  const first = FIRST_NAMES[Math.floor(noise(roundId + 11, second) * FIRST_NAMES.length)]
  const last = SURNAMES[Math.floor(noise(roundId + 13, second) * SURNAMES.length)]
  const roll = noise(roundId + 17, second)
  return {
    id: `${roundId}-${second}`,
    name: maskName(`${first} ${last}`),
    initials: `${Array.from(first)[0]}${Array.from(last)[0]}`,
    second,
    count: roll > 0.8 ? 3 : roll > 0.5 ? 2 : 1,
    hue: Math.floor(noise(roundId + 23, second) * 360),
  }
}

/**
 * Voters from `from` up to (not including) `to`, oldest first, for a feed that adds names as
 * they arrive. The same masked name never shows twice in a row.
 */
export function votersBetween(roundId: number, from: number, to: number): FeedItem[] {
  const items: FeedItem[] = []
  for (let s = Math.max(0, from); s < Math.min(to, VOTING_SECONDS); s += 1) {
    const item = feedItemAt(roundId, s)
    if (item && item.name !== items.at(-1)?.name) items.push(item)
  }
  return items
}

/** The latest voters, newest first. */
export function recentVoters(roundId: number, elapsed: number, limit = 8): FeedItem[] {
  const items: FeedItem[] = []
  for (let s = elapsed - 1; s >= 0 && items.length < limit; s -= 1) {
    const item = feedItemAt(roundId, s)
    if (item && item.name !== items.at(-1)?.name) items.push(item)
  }
  return items
}

/* ---- Results demos ---- */

export type ScenarioId = 'final' | 'five' | 'tie' | 'joint' | 'duo' | 'solo'

export interface Scenario {
  id: ScenarioId
  label: Text
  note: Text
  votes: VoteEntry[]
}

/*
 * The night's result, and the other shapes a final can take. The demos exist so the reveal
 * can be seen coping with a tie, joint winners, five finalists or a single one.
 */
export const scenarios: Scenario[] = [
  {
    id: 'final',
    label: { en: '4 finalists', tr: '4 aday' },
    note: {
      en: 'Tonight’s final: four singers, no ties.',
      tr: 'Bu geceki final: dört ses, beraberlik yok.',
    },
    votes: [
      { id: 'elif', votes: 2_184 },
      { id: 'deniz', votes: 1_937 },
      { id: 'mert', votes: 1_652 },
      { id: 'can', votes: 1_421 },
    ],
  },
  {
    id: 'five',
    label: { en: '5 finalists', tr: '5 aday' },
    note: {
      en: 'The jury’s wildcard joins the final.',
      tr: 'Jürinin sürpriz kartı da finalde.',
    },
    votes: [
      { id: 'elif', votes: 1_541 },
      { id: 'deniz', votes: 1_782 },
      { id: 'mert', votes: 1_114 },
      { id: 'can', votes: 1_313 },
      { id: 'zeynep', votes: 1_455 },
    ],
  },
  {
    id: 'tie',
    label: { en: 'Tie for 2nd', tr: '2.’lik beraberliği' },
    note: {
      en: 'Two singers share second place, so the next place is fourth.',
      tr: 'İki ses ikinciliği paylaşıyor, bu yüzden sıradaki yer dördüncülük.',
    },
    votes: [
      { id: 'elif', votes: 1_956 },
      { id: 'deniz', votes: 1_651 },
      { id: 'mert', votes: 1_651 },
      { id: 'can', votes: 1_160 },
    ],
  },
  {
    id: 'joint',
    label: { en: 'Joint winners', tr: 'Ortak birinci' },
    note: {
      en: 'Five singers, a tie at the top and another for third.',
      tr: 'Beş ses: zirvede bir beraberlik, üçüncülükte bir tane daha.',
    },
    votes: [
      { id: 'elif', votes: 1_750 },
      { id: 'zeynep', votes: 1_750 },
      { id: 'deniz', votes: 1_258 },
      { id: 'can', votes: 1_258 },
      { id: 'mert', votes: 1_014 },
    ],
  },
  {
    id: 'duo',
    label: { en: '2 finalists', tr: '2 aday' },
    note: { en: 'A head-to-head final.', tr: 'İki sesin kafa kafaya finali.' },
    votes: [
      { id: 'deniz', votes: 2_299 },
      { id: 'elif', votes: 2_240 },
    ],
  },
  {
    id: 'solo',
    label: { en: 'Single finalist', tr: 'Tek aday' },
    note: {
      en: 'Only one singer is left, so there is just the winner to reveal.',
      tr: 'Yalnızca bir ses kaldı; açılacak tek kart kazananın kartı.',
    },
    votes: [{ id: 'zeynep', votes: 2_704 }],
  },
]

export const findScenario = (id: string | null | undefined) =>
  scenarios.find((scenario) => scenario.id === id) ?? scenarios[0]

/** "3:34" for a performance length or a countdown in seconds. */
export function clock(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds))
  const hours = Math.floor(safe / 3600)
  const minutes = Math.floor((safe % 3600) / 60)
  const rest = String(safe % 60).padStart(2, '0')
  return hours > 0 ? `${hours}:${String(minutes).padStart(2, '0')}:${rest}` : `${minutes}:${rest}`
}
