import dayjs, { type Dayjs } from 'dayjs'
import type { Language } from '@/store/preferences-store'

type Text = Record<Language, string>

export type Format = '2D' | '3D' | 'IMAX'
export const formats: Format[] = ['2D', '3D', 'IMAX']

/** What the audience hears: a dubbed or subtitled foreign film, or a Turkish one. */
export type Audio = 'dub' | 'sub' | 'turkish'
export type AudioFilter = 'all' | 'turkish' | 'subtitled'

export type AgeRating = 'G' | '7+' | '13+' | '16+' | '18+'

export type PosterMotif =
  | 'waves'
  | 'moon'
  | 'ferry'
  | 'signal'
  | 'hills'
  | 'door'
  | 'pot'
  | 'sun'
  | 'garden'
  | 'orbit'
  | 'stars'

export interface Movie {
  id: string
  title: Text
  tagline: Text
  synopsis: Text
  genres: Text[]
  minutes: number
  rating: AgeRating
  /** Out of 10, from the chain's own audience reviews. */
  score: number
  director: string
  cast: { name: string; role: Text }[]
  formats: Format[]
  originalLanguage: 'en' | 'tr'
  poster: { colors: [string, string, string]; motif: PosterMotif; ink: string }
  featured?: boolean
  /** Coming soon: opens this many days after today, and has showings from then on. */
  opensInDays?: number
}

export type HallLayout = 'standard' | 'imax' | 'lounge'

export interface Hall {
  id: string
  cinemaId: string
  number: number
  format: Format
  layout: HallLayout
  /** The first showing of the day, in minutes after midnight. */
  opensAt: number
}

export interface Cinema {
  id: string
  name: string
  district: Text
  address: string
  halls: Hall[]
}

export interface Showtime {
  id: string
  movieId: string
  cinemaId: string
  hallId: string
  date: string
  time: string
  format: Format
  audio: Audio
}

const genre = {
  adventure: { en: 'Adventure', tr: 'Macera' },
  drama: { en: 'Drama', tr: 'Dram' },
  animation: { en: 'Animation', tr: 'Animasyon' },
  family: { en: 'Family', tr: 'Aile' },
  romance: { en: 'Romance', tr: 'Romantik' },
  comedy: { en: 'Comedy', tr: 'Komedi' },
  scifi: { en: 'Sci-fi', tr: 'Bilim kurgu' },
  thriller: { en: 'Thriller', tr: 'Gerilim' },
  western: { en: 'Western', tr: 'Western' },
  horror: { en: 'Horror', tr: 'Korku' },
  action: { en: 'Action', tr: 'Aksiyon' },
  fantasy: { en: 'Fantasy', tr: 'Fantastik' },
  history: { en: 'History', tr: 'Tarih' },
} satisfies Record<string, Text>

const role = (en: string, tr: string): Text => ({ en, tr })

export const movies: Movie[] = [
  {
    id: 'northern-drift',
    title: { en: 'Northern Drift', tr: 'Kuzey Akıntısı' },
    tagline: {
      en: 'Four hundred miles of ice. One radio. No way back.',
      tr: 'Dört yüz mil buz. Tek bir telsiz. Dönüş yok.',
    },
    synopsis: {
      en: 'When a research station breaks loose from the Arctic shelf, its last two crew members have eleven days of fuel and a radio that only receives. A survival story shot on real sea ice, made for the biggest screen you can find.',
      tr: 'Bir araştırma istasyonu Arktik buz sahanlığından koptuğunda, son iki mürettebatın elinde on bir günlük yakıt ve yalnızca dinleyebilen bir telsiz vardır. Gerçek deniz buzunda çekilmiş, bulabileceğiniz en büyük perde için yapılmış bir hayatta kalma hikâyesi.',
    },
    genres: [genre.adventure, genre.drama],
    minutes: 138,
    rating: '13+',
    score: 8.6,
    director: 'Ines Halvorsen',
    cast: [
      { name: 'Mara Ellison', role: role('Dr. Ruth Calder', 'Dr. Ruth Calder') },
      { name: 'Tobias Renn', role: role('Eli Varga', 'Eli Varga') },
      { name: 'Sanne Ottesen', role: role('Station chief', 'İstasyon şefi') },
    ],
    formats: ['IMAX', '2D'],
    originalLanguage: 'en',
    poster: { colors: ['#0c2340', '#1d5c8c', '#cfe8f5'], motif: 'waves', ink: '#ffffff' },
    featured: true,
  },
  {
    id: 'paper-moons',
    title: { en: 'Paper Moons', tr: 'Kâğıt Aylar' },
    tagline: {
      en: 'Every night, someone has to fold the moon.',
      tr: 'Her gece birinin ayı katlaması gerekir.',
    },
    synopsis: {
      en: 'Pip, a paper crane who lives in a stationery shop, learns that the moon over the city is folded fresh every night, and that the old folder has retired. A warm, funny animation for everyone over four.',
      tr: 'Bir kırtasiyede yaşayan kâğıt turna Pip, şehrin üzerindeki ayın her gece yeniden katlandığını ve eski katlayıcının emekli olduğunu öğrenir. Dört yaşından büyük herkes için sıcak ve komik bir animasyon.',
    },
    genres: [genre.animation, genre.family],
    minutes: 102,
    rating: 'G',
    score: 8.1,
    director: 'Hana Kobori',
    cast: [
      { name: 'Lila Moreau', role: role('Pip (voice)', 'Pip (ses)') },
      { name: 'Arthur Beale', role: role('Mr. Crease (voice)', 'Bay Kırışık (ses)') },
      { name: 'Nell Okafor', role: role('Luna (voice)', 'Luna (ses)') },
    ],
    formats: ['3D', '2D'],
    originalLanguage: 'en',
    poster: { colors: ['#231942', '#5e548e', '#f7d488'], motif: 'moon', ink: '#fff7e0' },
  },
  {
    id: 'last-ferry',
    title: { en: 'The Last Ferry to Kadıköy', tr: 'Kadıköy’e Son Vapur' },
    tagline: {
      en: 'Twenty minutes across the Bosphorus. Twenty years to say it.',
      tr: 'Boğaz’ı geçmek yirmi dakika. Söylemek yirmi yıl.',
    },
    synopsis: {
      en: 'Two old classmates meet on the last ferry of the night and have until the pier to settle an argument that ended their friendship. A bittersweet comedy set almost entirely on deck.',
      tr: 'İki eski sınıf arkadaşı gecenin son vapurunda karşılaşır ve dostluklarını bitiren tartışmayı iskeleye varana kadar çözmek zorundadır. Neredeyse tamamı güvertede geçen buruk bir komedi.',
    },
    genres: [genre.romance, genre.comedy],
    minutes: 116,
    rating: '13+',
    score: 7.9,
    director: 'Selin Akbaş',
    cast: [
      { name: 'Deniz Aksoy', role: role('Kerem', 'Kerem') },
      { name: 'Ece Talay', role: role('Nazlı', 'Nazlı') },
      { name: 'Orhan Gürel', role: role('The captain', 'Kaptan') },
    ],
    formats: ['2D'],
    originalLanguage: 'tr',
    poster: { colors: ['#14213d', '#fca311', '#e5e5e5'], motif: 'ferry', ink: '#ffffff' },
  },
  {
    id: 'signal-lost',
    title: { en: 'Signal Lost', tr: 'Sinyal Kayboldu' },
    tagline: {
      en: 'The message came from inside the ship.',
      tr: 'Mesaj geminin içinden geliyordu.',
    },
    synopsis: {
      en: 'A deep-space relay picks up a distress call in its own voice. Its sole operator has one shift to find out who sent it, and when. A tight, twisting thriller in the dark.',
      tr: 'Derin uzaydaki bir aktarma istasyonu, kendi sesiyle gönderilmiş bir yardım çağrısı alır. Tek operatörün, onu kimin ve ne zaman gönderdiğini bulmak için tek bir vardiyası vardır. Karanlıkta geçen, sıkı ve ters köşeli bir gerilim.',
    },
    genres: [genre.scifi, genre.thriller],
    minutes: 127,
    rating: '16+',
    score: 8.3,
    director: 'Julian Ferro',
    cast: [
      { name: 'Priya Castell', role: role('Operator Hale', 'Operatör Hale') },
      { name: 'Wes Andrade', role: role('The voice', 'Ses') },
    ],
    formats: ['IMAX', '3D', '2D'],
    originalLanguage: 'en',
    poster: { colors: ['#03071e', '#370617', '#e85d04'], motif: 'signal', ink: '#ffe8d6' },
  },
  {
    id: 'copper-hills',
    title: { en: 'Copper Hills', tr: 'Bakır Tepeler' },
    tagline: {
      en: 'The town sold its mine. The mine did not agree.',
      tr: 'Kasaba madenini sattı. Maden buna razı olmadı.',
    },
    synopsis: {
      en: 'A retired surveyor returns to the mining town she mapped forty years ago to stop its last hill being blown up for the ore beneath. A slow-burning modern western.',
      tr: 'Emekli bir haritacı, kırk yıl önce haritasını çıkardığı maden kasabasına, son tepenin altındaki cevher için havaya uçurulmasını durdurmak üzere geri döner. Yavaş yanan modern bir western.',
    },
    genres: [genre.western, genre.drama],
    minutes: 144,
    rating: '16+',
    score: 7.6,
    director: 'Carl Whitlow',
    cast: [
      { name: 'Joan Mercer', role: role('Abigail Rourke', 'Abigail Rourke') },
      { name: 'Dale Pruitt', role: role('Sheriff Hayes', 'Şerif Hayes') },
      { name: 'Rosa Ibarra', role: role('Marta', 'Marta') },
    ],
    formats: ['2D'],
    originalLanguage: 'en',
    poster: { colors: ['#3d1f0f', '#b5562b', '#f2c078'], motif: 'hills', ink: '#fff4e0' },
  },
  {
    id: 'quiet-hours',
    title: { en: 'Quiet Hours', tr: 'Sessiz Saatler' },
    tagline: {
      en: 'The building has rules. Rule one: do not answer the door.',
      tr: 'Binanın kuralları var. Birinci kural: kapıyı açma.',
    },
    synopsis: {
      en: 'A night nurse moves into a block of flats where every tenant is silent between two and four in the morning. On her first night, someone knocks.',
      tr: 'Bir gece hemşiresi, tüm sakinlerin sabahın ikisiyle dördü arasında sessiz kaldığı bir apartmana taşınır. İlk gecesinde kapısı çalınır.',
    },
    genres: [genre.horror],
    minutes: 98,
    rating: '18+',
    score: 7.2,
    director: 'Mika Rautio',
    cast: [
      { name: 'Clara Veen', role: role('Anna', 'Anna') },
      { name: 'Otto Sillanpää', role: role('The caretaker', 'Kapıcı') },
    ],
    formats: ['2D'],
    originalLanguage: 'en',
    poster: { colors: ['#0b0b0f', '#2b2d42', '#8d99ae'], motif: 'door', ink: '#edf2f4' },
  },
  {
    id: 'grandmas-recipe',
    title: { en: 'Grandma’s Last Recipe', tr: 'Babaannemin Son Tarifi' },
    tagline: {
      en: 'Three siblings. One notebook. No measurements.',
      tr: 'Üç kardeş. Bir defter. Hiç ölçü yok.',
    },
    synopsis: {
      en: 'After their grandmother dies, three siblings who have not spoken in years must cook her famous dolma for two hundred wedding guests, from a notebook that only says “enough”.',
      tr: 'Babaanneleri öldükten sonra yıllardır konuşmayan üç kardeş, iki yüz düğün misafiri için onun meşhur dolmasını, yalnızca “kararınca” yazan bir defterden pişirmek zorundadır.',
    },
    genres: [genre.comedy, genre.family],
    minutes: 109,
    rating: '7+',
    score: 8.0,
    director: 'Murat Çelikkol',
    cast: [
      { name: 'Aylin Soylu', role: role('Zeynep', 'Zeynep') },
      { name: 'Barış Ergin', role: role('Can', 'Can') },
      { name: 'Hülya Sezer', role: role('Grandma Saniye', 'Saniye Babaanne') },
    ],
    formats: ['2D'],
    originalLanguage: 'tr',
    poster: { colors: ['#6a040f', '#d00000', '#ffba08'], motif: 'pot', ink: '#fff8e7' },
  },
  {
    id: 'tidal-kings',
    title: { en: 'Tidal Kings', tr: 'Dalga Kralları' },
    tagline: {
      en: 'The heist happens at low tide. They have six hours.',
      tr: 'Soygun cezirde yapılacak. Altı saatleri var.',
    },
    synopsis: {
      en: 'A crew of retired salvage divers plans to lift a sunken armoured car from a harbour that is only walkable twice a day. Loud, fast and very wet.',
      tr: 'Emekli bir kurtarma dalgıcı ekibi, günde yalnızca iki kez yürünebilen bir limandan batmış bir zırhlı aracı çıkarmayı planlar. Gürültülü, hızlı ve bol ıslak.',
    },
    genres: [genre.action, genre.adventure],
    minutes: 131,
    rating: '13+',
    score: 7.4,
    director: 'Rafael Quint',
    cast: [
      { name: 'Marcus Doyle', role: role('Finn Harker', 'Finn Harker') },
      { name: 'Yara Salim', role: role('Nadia', 'Nadia') },
      { name: 'Gus Kowalczyk', role: role('Old Pete', 'Yaşlı Pete') },
    ],
    formats: ['IMAX', '3D', '2D'],
    originalLanguage: 'en',
    poster: { colors: ['#001d3d', '#0077b6', '#ffd60a'], motif: 'sun', ink: '#ffffff' },
  },
  {
    id: 'glass-garden',
    title: { en: 'The Glass Garden', tr: 'Cam Bahçe' },
    tagline: {
      en: 'Nothing grows here. Everything remembers.',
      tr: 'Burada hiçbir şey büyümez. Her şey hatırlar.',
    },
    synopsis: {
      en: 'A botanist inherits a greenhouse where the flowers are made of glass and each one holds a memory of the person who planted it.',
      tr: 'Bir botanikçi, çiçeklerin camdan yapıldığı ve her birinin onu dikenin bir anısını sakladığı bir sera miras alır.',
    },
    genres: [genre.fantasy, genre.drama],
    minutes: 121,
    rating: '7+',
    score: 0,
    director: 'Amélie Dufresne',
    cast: [
      { name: 'Iris Langley', role: role('Dr. Wren Hollis', 'Dr. Wren Hollis') },
      { name: 'Theo Marsh', role: role('Silas', 'Silas') },
    ],
    formats: ['3D', '2D'],
    originalLanguage: 'en',
    poster: { colors: ['#073b3a', '#0b6e4f', '#b8f2e6'], motif: 'garden', ink: '#f1fffa' },
    opensInDays: 3,
  },
  {
    id: 'orbit-nine',
    title: { en: 'Orbit Nine', tr: 'Yörünge Dokuz' },
    tagline: {
      en: 'Nine astronauts launched. Ten came back.',
      tr: 'Dokuz astronot fırlatıldı. On kişi döndü.',
    },
    synopsis: {
      en: 'A crewed mission to a distant moon returns to Earth with one passenger nobody can account for, and every one of them swears the stranger was always there.',
      tr: 'Uzak bir aya giden mürettebatlı bir görev, kimsenin açıklayamadığı bir yolcuyla Dünya’ya döner ve hepsi yabancının baştan beri orada olduğuna yemin eder.',
    },
    genres: [genre.scifi, genre.thriller],
    minutes: 139,
    rating: '13+',
    score: 0,
    director: 'Julian Ferro',
    cast: [
      { name: 'Priya Castell', role: role('Commander Osei', 'Komutan Osei') },
      { name: 'Leo Brandt', role: role('The tenth', 'Onuncu') },
    ],
    formats: ['IMAX', '3D', '2D'],
    originalLanguage: 'en',
    poster: { colors: ['#10002b', '#5a189a', '#e0aaff'], motif: 'orbit', ink: '#ffffff' },
    opensInDays: 12,
  },
  {
    id: 'anatolian-nights',
    title: { en: 'Anatolian Nights', tr: 'Anadolu Geceleri' },
    tagline: {
      en: 'A caravan, a storyteller and a thousand kilometres of stars.',
      tr: 'Bir kervan, bir hikâye anlatıcısı ve bin kilometre yıldız.',
    },
    synopsis: {
      en: 'In the thirteenth century, a young storyteller joins a silk caravan and has to keep its quarrelling merchants entertained, and alive, all the way to Konya.',
      tr: 'On üçüncü yüzyılda genç bir hikâye anlatıcısı bir ipek kervanına katılır ve kavgacı tüccarları Konya’ya kadar hem eğlendirmek hem de hayatta tutmak zorundadır.',
    },
    genres: [genre.history, genre.adventure],
    minutes: 152,
    rating: '13+',
    score: 0,
    director: 'Selin Akbaş',
    cast: [
      { name: 'Emre Yalçınkaya', role: role('Yusuf', 'Yusuf') },
      { name: 'Defne Arıkan', role: role('Gülbahar', 'Gülbahar') },
    ],
    formats: ['2D'],
    originalLanguage: 'tr',
    poster: { colors: ['#1b1b3a', '#693668', '#f4a259'], motif: 'stars', ink: '#fff6e5' },
    opensInDays: 26,
  },
]

const hall = (
  cinemaId: string,
  number: number,
  format: Format,
  layout: HallLayout,
  opensAt: number,
): Hall => ({ id: `${cinemaId}-${number}`, cinemaId, number, format, layout, opensAt })

export const cinemas: Cinema[] = [
  {
    id: 'moda',
    name: 'Lumen Moda',
    district: { en: 'Kadıköy, Istanbul', tr: 'Kadıköy, İstanbul' },
    address: 'Moda Cd. 112, Kadıköy / İstanbul',
    halls: [
      hall('moda', 1, 'IMAX', 'imax', 11 * 60),
      hall('moda', 2, '3D', 'standard', 11 * 60 + 15),
      hall('moda', 3, '2D', 'standard', 11 * 60 + 30),
      hall('moda', 4, '2D', 'lounge', 13 * 60),
    ],
  },
  {
    id: 'levent',
    name: 'Lumen Levent',
    district: { en: 'Beşiktaş, Istanbul', tr: 'Beşiktaş, İstanbul' },
    address: 'Büyükdere Cd. 201, Levent / İstanbul',
    halls: [
      hall('levent', 1, 'IMAX', 'imax', 10 * 60 + 45),
      hall('levent', 2, '2D', 'standard', 11 * 60),
      hall('levent', 3, '3D', 'standard', 11 * 60 + 45),
    ],
  },
  {
    id: 'kizilay',
    name: 'Lumen Kızılay',
    district: { en: 'Çankaya, Ankara', tr: 'Çankaya, Ankara' },
    address: 'Atatürk Blv. 64, Kızılay / Ankara',
    halls: [
      hall('kizilay', 1, '3D', 'standard', 11 * 60),
      hall('kizilay', 2, '2D', 'standard', 11 * 60 + 30),
      hall('kizilay', 3, '2D', 'lounge', 12 * 60 + 30),
    ],
  },
]

export const halls: Hall[] = cinemas.flatMap((cinema) => cinema.halls)

export function findMovie(id: string | undefined): Movie | undefined {
  return movies.find((movie) => movie.id === id)
}

export function findCinema(id: string | undefined): Cinema | undefined {
  return cinemas.find((cinema) => cinema.id === id)
}

export function findHall(id: string | undefined): Hall | undefined {
  return halls.find((item) => item.id === id)
}

export function cinemaRoot(standalone: boolean): string {
  return standalone ? '/preview/cinema' : '/showcases/cinema'
}

export const cinemaPaths = (standalone: boolean) => {
  const root = cinemaRoot(standalone)
  return {
    root,
    movie: (id: string) => `${root}/movies/${id}`,
    book: (showtimeId: string) => `${root}/book/${showtimeId}`,
    tickets: `${root}/tickets`,
  }
}

/* Schedule */

/** How many days ahead the box office sells. */
export const SALE_DAYS = 7

function hash(value: string): number {
  let result = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index)
    result = Math.imul(result, 16777619)
  }
  return result >>> 0
}

/** mulberry32: the same sequence on every machine, so a showing never moves or refills. */
export function seededRandom(seed: string): () => number {
  let state = hash(seed)
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let value = Math.imul(state ^ (state >>> 15), 1 | state)
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

export function isOpen(movie: Movie, date: string, today: Dayjs = dayjs()): boolean {
  if (!movie.opensInDays) return true
  return !dayjs(date).isBefore(today.startOf('day').add(movie.opensInDays, 'day'), 'day')
}

export function opensOn(movie: Movie, today: Dayjs = dayjs()): Dayjs | null {
  return movie.opensInDays ? today.startOf('day').add(movie.opensInDays, 'day') : null
}

export const nowShowing = (today: Dayjs = dayjs()) =>
  movies.filter((movie) => isOpen(movie, today.format('YYYY-MM-DD'), today))

export const comingSoon = (today: Dayjs = dayjs()) =>
  movies.filter((movie) => !isOpen(movie, today.format('YYYY-MM-DD'), today))

function hallShows(movie: Movie, target: Hall): boolean {
  // A lounge is a 2D room with recliners; IMAX and 3D rooms only show their own format.
  return movie.formats.includes(target.format)
}

const pad = (value: number) => String(value).padStart(2, '0')

export function showtimeId(hallId: string, date: string, time: string): string {
  return `${hallId}-${date.replaceAll('-', '')}-${time.replace(':', '')}`
}

/** The showings in every hall on one day: two or three films per hall, back to back. */
export function scheduleFor(date: string, today: Dayjs = dayjs()): Showtime[] {
  const shows: Showtime[] = []

  for (const room of halls) {
    const random = seededRandom(`${room.id}:${date}`)
    const eligible = movies.filter((movie) => hallShows(movie, room) && isOpen(movie, date, today))
    if (eligible.length === 0) continue

    // A seeded shuffle, then the first two or three become the day's rotation.
    const order = eligible
      .map((movie) => ({ movie, key: random() }))
      .sort((a, b) => a.key - b.key)
      .map(({ movie }) => movie)
    const rotation = order.slice(0, Math.min(order.length, random() < 0.5 ? 2 : 3))

    let start = room.opensAt
    let index = 0
    while (start <= 23 * 60 + 15) {
      const movie = rotation[index % rotation.length]!
      const time = `${pad(Math.floor(start / 60))}:${pad(start % 60)}`
      const audio: Audio =
        movie.originalLanguage === 'tr'
          ? 'turkish'
          : room.format !== 'IMAX' && random() < (movie.rating === 'G' ? 0.65 : 0.3)
            ? 'dub'
            : 'sub'
      shows.push({
        id: showtimeId(room.id, date, time),
        movieId: movie.id,
        cinemaId: room.cinemaId,
        hallId: room.id,
        date,
        time,
        format: room.format,
        audio,
      })
      // Trailers and cleaning take half an hour; showings start on the quarter hour.
      start += Math.ceil((movie.minutes + 30) / 15) * 15
      index += 1
    }
  }

  return shows.sort((a, b) => a.time.localeCompare(b.time) || a.hallId.localeCompare(b.hallId))
}

const idPattern = /^([a-z]+-\d+)-(\d{4})(\d{2})(\d{2})-(\d{2})(\d{2})$/

/** Rebuilds the day from the id, so a showing needs no storage to be found again. */
export function findShowtime(id: string | undefined, today: Dayjs = dayjs()): Showtime | undefined {
  const match = id ? idPattern.exec(id) : null
  if (!match) return undefined
  const date = `${match[2]}-${match[3]}-${match[4]}`
  return scheduleFor(date, today).find((show) => show.id === id)
}

export function showtimeStart(show: Pick<Showtime, 'date' | 'time'>): Dayjs {
  return dayjs(`${show.date}T${show.time}`)
}

/** Today and the days after it that are on sale. */
export function saleDates(today: Dayjs = dayjs()): string[] {
  return Array.from({ length: SALE_DAYS }, (_, index) =>
    today.startOf('day').add(index, 'day').format('YYYY-MM-DD'),
  )
}

export interface ShowtimeFilters {
  cinema: string
  formats: Format[]
  audio: AudioFilter
}

export function matchesFilters(show: Showtime, filters: ShowtimeFilters): boolean {
  if (filters.cinema !== 'all' && show.cinemaId !== filters.cinema) return false
  if (filters.formats.length > 0 && !filters.formats.includes(show.format)) return false
  if (filters.audio === 'turkish' && show.audio === 'sub') return false
  if (filters.audio === 'subtitled' && show.audio !== 'sub') return false
  return true
}

/** A showing can be booked until it starts. */
export function isBookable(show: Showtime, now: Dayjs = dayjs()): boolean {
  return showtimeStart(show).isAfter(now)
}

export interface HallShowings {
  cinema: Cinema
  hall: Hall
  shows: Showtime[]
}

/** One film's showings, grouped by cinema and then hall, in the order the cinemas are listed. */
export function groupShowings(shows: Showtime[]): HallShowings[] {
  const groups: HallShowings[] = []
  for (const cinema of cinemas) {
    for (const room of cinema.halls) {
      const inHall = shows.filter((show) => show.hallId === room.id)
      if (inHall.length > 0) groups.push({ cinema, hall: room, shows: inHall })
    }
  }
  return groups
}

export function formatRuntime(minutes: number, language: Language): string {
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return language === 'tr' ? `${hours} sa ${rest} dk` : `${hours}h ${rest}m`
}
