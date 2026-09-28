/**
 * The adoption site's catalogue: shelters and foster networks across Turkish cities and the
 * animals waiting with them. Everything is static; the visitor's favourites and applications
 * live in `usePetsStore`.
 */

export const petsBrand = 'Patiyuva'

export function petsRoot(standalone: boolean) {
  return standalone ? '/preview/pets' : '/showcases/pets'
}

export interface Bilingual {
  en: string
  tr: string
}

export type Species = 'cat' | 'dog' | 'rabbit' | 'bird'
export type Sex = 'female' | 'male'
export type PetSize = 'small' | 'medium' | 'large'
export type AgeGroup = 'baby' | 'young' | 'adult' | 'senior'
export type Energy = 'low' | 'medium' | 'high'
export type CityId = 'istanbul' | 'ankara' | 'izmir' | 'edirne' | 'bursa' | 'antalya' | 'eskisehir'
export type Companion = 'kids' | 'cats' | 'dogs'

export const SPECIES: Species[] = ['cat', 'dog', 'rabbit', 'bird']
export const AGE_GROUPS: AgeGroup[] = ['baby', 'young', 'adult', 'senior']
export const SIZES: PetSize[] = ['small', 'medium', 'large']
export const ENERGIES: Energy[] = ['low', 'medium', 'high']
export const COMPANIONS: Companion[] = ['kids', 'cats', 'dogs']

export const cities: Record<CityId, Bilingual> = {
  istanbul: { en: 'Istanbul', tr: 'İstanbul' },
  ankara: { en: 'Ankara', tr: 'Ankara' },
  izmir: { en: 'Izmir', tr: 'İzmir' },
  edirne: { en: 'Edirne', tr: 'Edirne' },
  bursa: { en: 'Bursa', tr: 'Bursa' },
  antalya: { en: 'Antalya', tr: 'Antalya' },
  eskisehir: { en: 'Eskisehir', tr: 'Eskişehir' },
}

export const CITY_IDS = Object.keys(cities) as CityId[]

export interface Shelter {
  id: string
  name: string
  kind: 'shelter' | 'foster'
  cityId: CityId
  district: string
  phone: string
  email: string
  hours: Bilingual
  founded: number
  volunteers: number
  about: Bilingual
}

export const shelters: Shelter[] = [
  {
    id: 'kadikoy-dostlar',
    name: 'Kadıköy Dostlar Barınağı',
    kind: 'shelter',
    cityId: 'istanbul',
    district: 'Kadıköy',
    phone: '+90 216 555 01 12',
    email: 'kadikoy@patiyuva.org',
    hours: { en: 'Tue–Sun, 11:00–17:00', tr: 'Salı–Pazar, 11.00–17.00' },
    founded: 2014,
    volunteers: 86,
    about: {
      en: 'A neighbourhood shelter run with the municipality: a cattery, a small dog run and a clinic room.',
      tr: 'Belediyeyle birlikte işletilen mahalle barınağı: kedi evi, küçük bir köpek parkı ve muayene odası.',
    },
  },
  {
    id: 'sariyer-orman',
    name: 'Sarıyer Orman Evi',
    kind: 'shelter',
    cityId: 'istanbul',
    district: 'Sarıyer',
    phone: '+90 212 555 04 38',
    email: 'sariyer@patiyuva.org',
    hours: { en: 'Sat–Sun, 10:00–16:00', tr: 'Cumartesi–Pazar, 10.00–16.00' },
    founded: 2011,
    volunteers: 124,
    about: {
      en: 'Large dogs from the forest edge live here in open runs while they wait for a family.',
      tr: 'Orman kenarından gelen iri köpekler, aile beklerken burada açık alanlarda yaşıyor.',
    },
  },
  {
    id: 'ankara-yuva',
    name: 'Çankaya Can Dostlar',
    kind: 'shelter',
    cityId: 'ankara',
    district: 'Çankaya',
    phone: '+90 312 555 22 70',
    email: 'ankara@patiyuva.org',
    hours: { en: 'Wed–Sun, 12:00–18:00', tr: 'Çarşamba–Pazar, 12.00–18.00' },
    founded: 2016,
    volunteers: 64,
    about: {
      en: 'A shelter with a rehab wing for animals recovering from surgery or injury.',
      tr: 'Ameliyat ya da yaralanma sonrası iyileşen hayvanlar için rehabilitasyon bölümü olan barınak.',
    },
  },
  {
    id: 'izmir-gecici',
    name: 'İzmir Geçici Yuva Ağı',
    kind: 'foster',
    cityId: 'izmir',
    district: 'Karşıyaka',
    phone: '+90 232 555 18 44',
    email: 'izmir@patiyuva.org',
    hours: { en: 'Visits by appointment', tr: 'Ziyaret randevuyla' },
    founded: 2019,
    volunteers: 52,
    about: {
      en: 'Animals live in volunteer homes, so fosters can tell you how they are on the sofa.',
      tr: 'Hayvanlar gönüllü evlerinde kalıyor; geçici aileler koltuktaki hâllerini anlatabiliyor.',
    },
  },
  {
    id: 'edirne-selimiye',
    name: 'Edirne Patili Dostlar',
    kind: 'shelter',
    cityId: 'edirne',
    district: 'Merkez',
    phone: '+90 284 555 30 06',
    email: 'edirne@patiyuva.org',
    hours: { en: 'Tue–Sat, 10:00–16:00', tr: 'Salı–Cumartesi, 10.00–16.00' },
    founded: 2018,
    volunteers: 31,
    about: {
      en: 'A small city shelter near the Tunca river, known for its kitten nursery in spring.',
      tr: 'Tunca kıyısına yakın küçük bir şehir barınağı; baharda yavru kedi bakım odasıyla bilinir.',
    },
  },
  {
    id: 'bursa-nilufer',
    name: 'Nilüfer Hayvan Dostları',
    kind: 'shelter',
    cityId: 'bursa',
    district: 'Nilüfer',
    phone: '+90 224 555 47 90',
    email: 'bursa@patiyuva.org',
    hours: { en: 'Daily, 11:00–17:00', tr: 'Her gün, 11.00–17.00' },
    founded: 2013,
    volunteers: 58,
    about: {
      en: 'Home to rabbits and birds handed in by families, alongside cats and dogs.',
      tr: 'Kedi ve köpeklerin yanında, ailelerin teslim ettiği tavşan ve kuşlara da yuva oluyor.',
    },
  },
  {
    id: 'antalya-sahil',
    name: 'Antalya Sahil Patileri',
    kind: 'foster',
    cityId: 'antalya',
    district: 'Muratpaşa',
    phone: '+90 242 555 63 21',
    email: 'antalya@patiyuva.org',
    hours: { en: 'Visits by appointment', tr: 'Ziyaret randevuyla' },
    founded: 2020,
    volunteers: 40,
    about: {
      en: 'Foster homes that take in animals found around the beaches and the old town.',
      tr: 'Sahillerde ve Kaleiçi çevresinde bulunan hayvanlara kapısını açan geçici yuvalar.',
    },
  },
  {
    id: 'eskisehir-porsuk',
    name: 'Porsuk Dostluk Evi',
    kind: 'shelter',
    cityId: 'eskisehir',
    district: 'Tepebaşı',
    phone: '+90 222 555 12 58',
    email: 'eskisehir@patiyuva.org',
    hours: { en: 'Thu–Sun, 12:00–17:00', tr: 'Perşembe–Pazar, 12.00–17.00' },
    founded: 2017,
    volunteers: 47,
    about: {
      en: 'Students volunteer here in shifts; the dogs get two walks a day along the Porsuk.',
      tr: 'Öğrenciler vardiyayla gönüllü oluyor; köpekler Porsuk kıyısında günde iki yürüyüş yapıyor.',
    },
  },
]

export interface Breed {
  species: Species
  size: PetSize
  name: Bilingual
}

export const breeds = {
  tabby: { species: 'cat', size: 'medium', name: { en: 'Tabby', tr: 'Tekir' } },
  van: { species: 'cat', size: 'medium', name: { en: 'Van cat', tr: 'Van kedisi' } },
  angora: { species: 'cat', size: 'medium', name: { en: 'Turkish Angora', tr: 'Ankara kedisi' } },
  catMix: { species: 'cat', size: 'medium', name: { en: 'Mixed breed', tr: 'Melez' } },
  british: {
    species: 'cat',
    size: 'medium',
    name: { en: 'British Shorthair mix', tr: 'British Shorthair melezi' },
  },
  kangal: { species: 'dog', size: 'large', name: { en: 'Kangal mix', tr: 'Kangal melezi' } },
  golden: {
    species: 'dog',
    size: 'large',
    name: { en: 'Golden Retriever mix', tr: 'Golden Retriever melezi' },
  },
  labrador: { species: 'dog', size: 'large', name: { en: 'Labrador mix', tr: 'Labrador melezi' } },
  beagle: { species: 'dog', size: 'medium', name: { en: 'Beagle mix', tr: 'Beagle melezi' } },
  terrier: { species: 'dog', size: 'small', name: { en: 'Terrier mix', tr: 'Terrier melezi' } },
  dogMix: { species: 'dog', size: 'medium', name: { en: 'Street mix', tr: 'Sokak melezi' } },
  lop: { species: 'rabbit', size: 'small', name: { en: 'Holland Lop', tr: 'Holland Lop' } },
  lionhead: { species: 'rabbit', size: 'small', name: { en: 'Lionhead', tr: 'Aslan başlı' } },
  rex: { species: 'rabbit', size: 'small', name: { en: 'Mini Rex', tr: 'Mini Rex' } },
  budgie: { species: 'bird', size: 'small', name: { en: 'Budgerigar', tr: 'Muhabbet kuşu' } },
  cockatiel: { species: 'bird', size: 'small', name: { en: 'Cockatiel', tr: 'Sultan papağanı' } },
  lovebird: { species: 'bird', size: 'small', name: { en: 'Lovebird', tr: 'Cennet papağanı' } },
  canary: { species: 'bird', size: 'small', name: { en: 'Canary', tr: 'Kanarya' } },
} satisfies Record<string, Breed>

export type BreedId = keyof typeof breeds

export const coats = {
  orange: { hex: '#e8913a', name: { en: 'Orange', tr: 'Sarman' } },
  grey: { hex: '#8d96a3', name: { en: 'Grey', tr: 'Gri' } },
  black: { hex: '#3a3a42', name: { en: 'Black', tr: 'Siyah' } },
  white: { hex: '#f4efe6', name: { en: 'White', tr: 'Beyaz' } },
  cream: { hex: '#e9d3a8', name: { en: 'Cream', tr: 'Krem' } },
  brown: { hex: '#8a5a3b', name: { en: 'Brown', tr: 'Kahverengi' } },
  golden: { hex: '#d8a24a', name: { en: 'Golden', tr: 'Altın sarısı' } },
  tricolor: { hex: '#b9784a', name: { en: 'Calico', tr: 'Üç renkli' } },
  tuxedo: { hex: '#2f3036', name: { en: 'Black and white', tr: 'Siyah beyaz' } },
  green: { hex: '#6fbf5a', name: { en: 'Green', tr: 'Yeşil' } },
  blue: { hex: '#5b9bd8', name: { en: 'Blue', tr: 'Mavi' } },
  yellow: { hex: '#f1cf3b', name: { en: 'Yellow', tr: 'Sarı' } },
} satisfies Record<string, { hex: string; name: Bilingual }>

export type CoatId = keyof typeof coats

export const specialNeeds = {
  threeLegs: {
    en: 'Lives happily on three legs; needs a home without steep stairs.',
    tr: 'Üç bacağıyla mutlu yaşıyor; dik merdiveni olmayan bir ev arıyor.',
  },
  deaf: {
    en: 'Deaf from birth; learns hand signals quickly.',
    tr: 'Doğuştan işitme engelli; el işaretlerini çabuk öğreniyor.',
  },
  diet: {
    en: 'Needs a kidney-friendly diet, which the shelter will show you.',
    tr: 'Böbrek dostu mamayla beslenmesi gerekiyor; barınak nasıl yapılacağını gösterecek.',
  },
  oneEye: {
    en: 'Has one eye and gets around perfectly well.',
    tr: 'Tek gözlü; hiç zorlanmadan dolaşıyor.',
  },
  anxious: {
    en: 'Nervous with strangers at first; a calm, patient home suits best.',
    tr: 'Yabancılara karşı başta ürkek; sakin ve sabırlı bir ev en iyisi.',
  },
  fiv: {
    en: 'FIV positive; healthy, but best as the only cat.',
    tr: 'FIV pozitif; sağlıklı ama evdeki tek kedi olması en iyisi.',
  },
} satisfies Record<string, Bilingual>

export type SpecialNeedId = keyof typeof specialNeeds

export const traits = {
  cuddly: { en: 'Cuddly', tr: 'Sevgi pıtırcığı' },
  playful: { en: 'Playful', tr: 'Oyuncu' },
  calm: { en: 'Calm', tr: 'Sakin' },
  curious: { en: 'Curious', tr: 'Meraklı' },
  gentle: { en: 'Gentle', tr: 'Nazik' },
  independent: { en: 'Independent', tr: 'Bağımsız' },
  chatty: { en: 'Chatty', tr: 'Konuşkan' },
  loyal: { en: 'Loyal', tr: 'Sadık' },
  smart: { en: 'Quick learner', tr: 'Çabuk öğrenen' },
  lapCat: { en: 'Lap lover', tr: 'Kucak sever' },
  walker: { en: 'Loves long walks', tr: 'Uzun yürüyüş sever' },
  shy: { en: 'A little shy', tr: 'Biraz utangaç' },
  foodie: { en: 'Food lover', tr: 'Obur' },
  singer: { en: 'Sings in the morning', tr: 'Sabahları şarkı söyler' },
} satisfies Record<string, Bilingual>

export type TraitId = keyof typeof traits

export interface Pet {
  id: string
  name: string
  species: Species
  breed: BreedId
  ageMonths: number
  sex: Sex
  size: PetSize
  coat: CoatId
  cityId: CityId
  shelterId: string
  energy: Energy
  goodWith: Record<Companion, boolean>
  apartmentFriendly: boolean
  vaccinated: boolean
  neutered: boolean
  microchipped: boolean
  specialNeed?: SpecialNeedId
  traits: TraitId[]
  story: Bilingual
  /** Days since the animal came in, counted back from the catalogue date. */
  waitingDays: number
  weightKg: number
  adoptionFee: number
  status: 'available' | 'reserved'
}

/*
 * One row per animal: name, breed, age in months, sex, coat, city, energy, good with
 * kids/cats/dogs (as "kcd" letters), traits, days waiting and an optional special need.
 */
type Row = [
  string,
  BreedId,
  number,
  Sex,
  CoatId,
  CityId,
  Energy,
  string,
  TraitId[],
  number,
  SpecialNeedId?,
]

const rows: Row[] = [
  ['Pamuk', 'angora', 26, 'female', 'white', 'istanbul', 'low', 'kc', ['cuddly', 'calm'], 34],
  ['Duman', 'tabby', 40, 'male', 'grey', 'istanbul', 'medium', 'kcd', ['curious', 'playful'], 71],
  ['Zeytin', 'catMix', 4, 'female', 'black', 'istanbul', 'high', 'kc', ['playful', 'curious'], 12],
  ['Karamel', 'catMix', 3, 'male', 'orange', 'istanbul', 'high', 'kcd', ['playful', 'foodie'], 9],
  [
    'Boncuk',
    'tabby',
    64,
    'female',
    'tricolor',
    'istanbul',
    'low',
    'k',
    ['lapCat', 'calm'],
    140,
    'diet',
  ],
  ['Paşa', 'kangal', 30, 'male', 'cream', 'istanbul', 'medium', 'kd', ['loyal', 'gentle'], 188],
  ['Fındık', 'terrier', 18, 'female', 'brown', 'istanbul', 'high', 'kcd', ['playful', 'smart'], 22],
  ['Mavi', 'budgie', 14, 'male', 'blue', 'istanbul', 'medium', 'k', ['chatty', 'singer'], 41],
  ['Kontes', 'british', 52, 'female', 'grey', 'istanbul', 'low', 'k', ['independent', 'calm'], 63],
  [
    'Şans',
    'dogMix',
    84,
    'male',
    'black',
    'istanbul',
    'low',
    'kcd',
    ['gentle', 'calm'],
    312,
    'threeLegs',
  ],
  ['Limon', 'canary', 10, 'male', 'yellow', 'istanbul', 'medium', 'k', ['singer', 'curious'], 17],
  ['Lokum', 'lop', 9, 'female', 'cream', 'istanbul', 'low', 'kc', ['gentle', 'cuddly'], 28],
  ['Kartal', 'golden', 22, 'male', 'golden', 'istanbul', 'high', 'kcd', ['walker', 'playful'], 45],
  ['Tarçın', 'catMix', 110, 'male', 'orange', 'istanbul', 'low', 'c', ['lapCat', 'foodie'], 260],
  [
    'Bulut',
    'kangal',
    56,
    'male',
    'white',
    'istanbul',
    'medium',
    'd',
    ['loyal', 'independent'],
    402,
  ],
  [
    'Nazlı',
    'van',
    20,
    'female',
    'white',
    'istanbul',
    'medium',
    'kc',
    ['chatty', 'curious'],
    30,
    'oneEye',
  ],
  ['Maya', 'labrador', 38, 'female', 'black', 'ankara', 'high', 'kcd', ['walker', 'smart'], 58],
  ['Çakıl', 'dogMix', 7, 'male', 'brown', 'ankara', 'high', 'kd', ['playful', 'curious'], 14],
  [
    'Sütlaç',
    'angora',
    5,
    'female',
    'white',
    'ankara',
    'high',
    'kc',
    ['playful', 'cuddly'],
    11,
    'deaf',
  ],
  [
    'Efe',
    'kangal',
    46,
    'male',
    'cream',
    'ankara',
    'medium',
    'k',
    ['loyal', 'calm'],
    220,
    'threeLegs',
  ],
  ['Minnoş', 'tabby', 16, 'female', 'grey', 'ankara', 'medium', 'kcd', ['cuddly', 'chatty'], 27],
  ['Çiko', 'cockatiel', 28, 'male', 'grey', 'ankara', 'medium', 'k', ['chatty', 'smart'], 52],
  ['Arpa', 'rex', 20, 'male', 'brown', 'ankara', 'low', 'kc', ['calm', 'gentle'], 39],
  ['Bal', 'golden', 102, 'female', 'golden', 'ankara', 'low', 'kcd', ['gentle', 'calm'], 290],
  [
    'Leylak',
    'catMix',
    30,
    'female',
    'tuxedo',
    'ankara',
    'medium',
    'c',
    ['independent', 'curious'],
    76,
    'fiv',
  ],
  ['Poyraz', 'dogMix', 26, 'male', 'grey', 'izmir', 'high', 'kd', ['walker', 'loyal'], 61],
  ['Nane', 'catMix', 6, 'female', 'tricolor', 'izmir', 'high', 'kcd', ['playful', 'curious'], 8],
  ['İncir', 'catMix', 6, 'male', 'tuxedo', 'izmir', 'high', 'kcd', ['playful', 'foodie'], 8],
  ['Sahil', 'labrador', 60, 'male', 'golden', 'izmir', 'medium', 'kcd', ['gentle', 'foodie'], 132],
  ['Badem', 'beagle', 34, 'female', 'tricolor', 'izmir', 'high', 'kd', ['curious', 'foodie'], 49],
  ['Kiwi', 'lovebird', 18, 'female', 'green', 'izmir', 'high', 'k', ['chatty', 'playful'], 21],
  ['Mercan', 'van', 72, 'female', 'white', 'izmir', 'low', 'k', ['lapCat', 'calm'], 176],
  ['Tospik', 'lionhead', 14, 'male', 'grey', 'izmir', 'medium', 'kc', ['curious', 'shy'], 33],
  [
    'Sarmaşık',
    'terrier',
    96,
    'female',
    'white',
    'izmir',
    'low',
    'kc',
    ['cuddly', 'calm'],
    210,
    'anxious',
  ],
  ['Selim', 'tabby', 44, 'male', 'orange', 'edirne', 'medium', 'kcd', ['cuddly', 'foodie'], 88],
  ['Tunca', 'dogMix', 20, 'male', 'brown', 'edirne', 'high', 'kd', ['walker', 'playful'], 37],
  ['Meriç', 'dogMix', 20, 'female', 'cream', 'edirne', 'medium', 'kcd', ['gentle', 'smart'], 37],
  ['Ciğer', 'catMix', 2, 'male', 'orange', 'edirne', 'high', 'kcd', ['playful', 'curious'], 5],
  ['Lale', 'catMix', 2, 'female', 'tricolor', 'edirne', 'high', 'kcd', ['playful', 'cuddly'], 5],
  ['Badi', 'kangal', 120, 'male', 'cream', 'edirne', 'low', 'k', ['calm', 'loyal'], 365],
  ['Sultan', 'cockatiel', 60, 'female', 'yellow', 'edirne', 'low', 'k', ['calm', 'singer'], 95],
  [
    'Gölge',
    'catMix',
    58,
    'male',
    'black',
    'edirne',
    'low',
    'c',
    ['shy', 'independent'],
    155,
    'anxious',
  ],
  ['Kestane', 'dogMix', 44, 'male', 'brown', 'bursa', 'medium', 'kcd', ['loyal', 'gentle'], 97],
  ['Tavşan Pıtır', 'lop', 30, 'female', 'white', 'bursa', 'low', 'kc', ['cuddly', 'shy'], 64],
  ['Havuç', 'lionhead', 8, 'male', 'orange', 'bursa', 'medium', 'kc', ['curious', 'playful'], 19],
  ['Kanarya Sarı', 'canary', 24, 'male', 'yellow', 'bursa', 'low', 'k', ['singer', 'calm'], 58],
  ['Uludağ', 'kangal', 36, 'female', 'cream', 'bursa', 'high', 'd', ['walker', 'independent'], 143],
  ['Tombi', 'british', 90, 'male', 'grey', 'bursa', 'low', 'kc', ['lapCat', 'foodie'], 118, 'diet'],
  ['Şeftali', 'tabby', 12, 'female', 'orange', 'bursa', 'medium', 'kcd', ['playful', 'chatty'], 24],
  ['Zıpzıp', 'rex', 5, 'female', 'black', 'bursa', 'high', 'k', ['playful', 'curious'], 10],
  [
    'Kumsal',
    'labrador',
    16,
    'female',
    'cream',
    'antalya',
    'high',
    'kcd',
    ['playful', 'walker'],
    29,
  ],
  [
    'Portakal',
    'catMix',
    26,
    'male',
    'orange',
    'antalya',
    'medium',
    'kcd',
    ['cuddly', 'foodie'],
    44,
  ],
  ['Dalga', 'dogMix', 68, 'female', 'golden', 'antalya', 'medium', 'kd', ['loyal', 'gentle'], 199],
  ['Pırpır', 'lovebird', 8, 'male', 'green', 'antalya', 'high', 'k', ['chatty', 'playful'], 13],
  [
    'Mandalina',
    'tabby',
    3,
    'female',
    'orange',
    'antalya',
    'high',
    'kcd',
    ['playful', 'curious'],
    6,
  ],
  [
    'Rıfkı',
    'beagle',
    108,
    'male',
    'tricolor',
    'antalya',
    'low',
    'kcd',
    ['foodie', 'calm'],
    244,
    'deaf',
  ],
  [
    'Kaptan',
    'terrier',
    50,
    'male',
    'grey',
    'antalya',
    'medium',
    'k',
    ['smart', 'loyal'],
    81,
    'oneEye',
  ],
  ['Porsuk', 'dogMix', 32, 'male', 'grey', 'eskisehir', 'high', 'kd', ['walker', 'smart'], 67],
  [
    'Lületaşı',
    'angora',
    48,
    'female',
    'white',
    'eskisehir',
    'low',
    'kc',
    ['calm', 'independent'],
    102,
  ],
  ['Çıtır', 'catMix', 10, 'male', 'tuxedo', 'eskisehir', 'high', 'kcd', ['playful', 'chatty'], 18],
  [
    'Sade',
    'golden',
    70,
    'female',
    'golden',
    'eskisehir',
    'medium',
    'kcd',
    ['gentle', 'cuddly'],
    128,
  ],
  ['Minik', 'budgie', 6, 'female', 'green', 'eskisehir', 'high', 'k', ['curious', 'chatty'], 9],
  ['Kurabiye', 'lop', 44, 'male', 'brown', 'eskisehir', 'low', 'kc', ['calm', 'foodie'], 86],
  [
    'Yoda',
    'catMix',
    132,
    'male',
    'grey',
    'eskisehir',
    'low',
    'k',
    ['lapCat', 'independent'],
    330,
    'oneEye',
  ],
]

/** Where each species tends to come from; `{name}` is replaced. */
const origins: Record<Species, Bilingual[]> = {
  cat: [
    {
      en: '{name} was found in a parked car’s engine bay on a cold morning and hasn’t stopped purring since.',
      tr: '{name}, soğuk bir sabah park hâlindeki bir arabanın motorunda bulundu ve o günden beri mırlamayı bırakmadı.',
    },
    {
      en: '{name} grew up in a courtyard where neighbours fed the cats, until a new building went up.',
      tr: '{name}, komşuların kedileri beslediği bir avluda büyüdü; ta ki oraya yeni bir bina yapılana kadar.',
    },
    {
      en: '{name} came in when an elderly owner moved to a care home and could not take them along.',
      tr: '{name}, yaşlı sahibi bakımevine taşınıp onu yanına alamayınca bize geldi.',
    },
    {
      en: 'A café owner brought {name} in after weeks of sharing breakfast on the terrace.',
      tr: 'Haftalarca terasta kahvaltısını paylaştığı {name} için bir kafe sahibi bize ulaştı.',
    },
  ],
  dog: [
    {
      en: '{name} was found tied to a fence near the highway, thin but wagging at everyone who passed.',
      tr: '{name}, otoyol kenarında bir çite bağlı bulundu; zayıftı ama geçen herkese kuyruk salladı.',
    },
    {
      en: '{name} walked into a building site every morning for a month before the workers called us.',
      tr: '{name}, işçiler bizi arayana kadar bir ay boyunca her sabah şantiyeye uğradı.',
    },
    {
      en: '{name}’s family moved abroad and asked us to find the right home for them.',
      tr: 'Ailesi yurt dışına taşınınca {name} için doğru yuvayı bulmamızı istedi.',
    },
    {
      en: 'Volunteers met {name} at a park feeding station, where they waited politely for dinner.',
      tr: 'Gönüllüler {name} ile parktaki mama noktasında tanıştı; akşam yemeğini kibarca bekliyordu.',
    },
  ],
  rabbit: [
    {
      en: '{name} was a gift nobody had planned for, and the family could not keep them.',
      tr: '{name}, kimsenin planlamadığı bir hediyeydi ve aile ona bakamadı.',
    },
    {
      en: '{name} was spotted in a city park, far too tame to survive there.',
      tr: '{name}, bir şehir parkında görüldü; orada hayatta kalamayacak kadar evcildi.',
    },
  ],
  bird: [
    {
      en: '{name} flew onto a balcony in the middle of winter and landed on a surprised neighbour’s shoulder.',
      tr: '{name}, kışın ortasında bir balkona uçtu ve şaşkın bir komşunun omzuna kondu.',
    },
    {
      en: '{name}’s owner developed an allergy and handed them in with their cage and toys.',
      tr: 'Sahibinde alerji başlayınca {name}, kafesi ve oyuncaklarıyla birlikte bize teslim edildi.',
    },
  ],
}

const wishes: Record<Energy, Bilingual> = {
  low: {
    en: 'They are looking for a quiet home with a warm spot by the window.',
    tr: 'Pencere kenarında sıcak bir köşesi olan sakin bir ev arıyor.',
  },
  medium: {
    en: 'They would love a family with some time for play every day.',
    tr: 'Her gün biraz oyuna vakit ayırabilecek bir aileyi çok sever.',
  },
  high: {
    en: 'They need an active family who can keep up with their energy.',
    tr: 'Enerjisine yetişebilecek hareketli bir aileye ihtiyacı var.',
  },
}

const fees: Record<Species, number> = { cat: 750, dog: 1000, rabbit: 400, bird: 300 }

const weights: Record<Species, Record<PetSize, number>> = {
  cat: { small: 2, medium: 4.2, large: 6 },
  dog: { small: 7, medium: 16, large: 34 },
  rabbit: { small: 1.6, medium: 2.4, large: 3.5 },
  bird: { small: 0.05, medium: 0.09, large: 0.3 },
}

/** The Turkish templates never put a suffix on the name, so the name drops in as it is. */
function fill(text: Bilingual, name: string): Bilingual {
  return { en: text.en.replaceAll('{name}', name), tr: text.tr.replaceAll('{name}', name) }
}

function slug(name: string) {
  return name
    .toLocaleLowerCase('tr')
    .replace(
      /[çğıöşü]/g,
      (char) => ({ ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u' })[char] ?? char,
    )
    .replace(/[^a-z0-9]+/g, '-')
}

function buildPet(row: Row, index: number): Pet {
  const [name, breedId, ageMonths, sex, coat, cityId, energy, companions, traitIds, waiting, need] =
    row
  const breed: Breed = breeds[breedId]
  const species = breed.species
  const size: PetSize = species === 'dog' && ageMonths < 8 ? 'small' : breed.size
  const cityShelters = shelters.filter((shelter) => shelter.cityId === cityId)
  const shelter = cityShelters[index % cityShelters.length]!
  const origin = origins[species][index % origins[species].length]!
  const story = fill(
    {
      en: `${origin.en} ${wishes[energy].en}`,
      tr: `${origin.tr} ${wishes[energy].tr}`,
    },
    name,
  )
  const young = ageMonths < 6
  const growth = young ? 0.45 : ageMonths < 12 ? 0.75 : 1
  return {
    id: slug(name),
    name,
    species,
    breed: breedId,
    ageMonths,
    sex,
    size,
    coat,
    cityId,
    shelterId: shelter.id,
    energy,
    goodWith: {
      kids: companions.includes('k'),
      cats: companions.includes('c'),
      dogs: companions.includes('d'),
    },
    apartmentFriendly: species !== 'dog' || size !== 'large' || energy === 'low',
    vaccinated: !young || index % 3 !== 0,
    neutered: (species === 'cat' || species === 'dog') && !young && index % 7 !== 3,
    microchipped: species === 'cat' || species === 'dog',
    specialNeed: need,
    traits: traitIds,
    story,
    waitingDays: waiting,
    weightKg: Math.round(weights[species][size] * growth * (0.9 + (index % 5) * 0.05) * 100) / 100,
    adoptionFee: need || ageMonths >= 96 ? 0 : fees[species],
    status: index % 17 === 5 ? 'reserved' : 'available',
  }
}

export const pets: Pet[] = rows.map(buildPet)

export function findPet(id: string | undefined) {
  return pets.find((pet) => pet.id === id)
}

export function findShelter(id: string) {
  return shelters.find((shelter) => shelter.id === id)
}

export function petsOfShelter(shelterId: string) {
  return pets.filter((pet) => pet.shelterId === shelterId)
}

export function ageGroup(ageMonths: number): AgeGroup {
  if (ageMonths < 12) return 'baby'
  if (ageMonths < 36) return 'young'
  if (ageMonths < 96) return 'adult'
  return 'senior'
}

/** "3 months", "2 years", "1 yr 6 mo" style ages in either language. */
export function formatAge(ageMonths: number, language: 'en' | 'tr') {
  const years = Math.floor(ageMonths / 12)
  const months = ageMonths % 12
  if (language === 'tr') {
    if (years === 0) return `${months} aylık`
    return months === 0 || years >= 3 ? `${years} yaşında` : `${years} yaş ${months} ay`
  }
  if (years === 0) return `${months} ${months === 1 ? 'month' : 'months'}`
  if (months === 0 || years >= 3) return `${years} ${years === 1 ? 'year' : 'years'}`
  return `${years} yr ${months} mo`
}

/** Others of the same species, nearest in age first, preferring the same city. */
export function similarPets(pet: Pet, count = 4) {
  return pets
    .filter((other) => other.id !== pet.id && other.species === pet.species)
    .sort(
      (a, b) =>
        Number(b.cityId === pet.cityId) - Number(a.cityId === pet.cityId) ||
        Math.abs(a.ageMonths - pet.ageMonths) - Math.abs(b.ageMonths - pet.ageMonths),
    )
    .slice(0, count)
}

/** The home page's picks: a mix of species, favouring those who have waited longest. */
export function featuredPets(count = 8) {
  const available = pets.filter((pet) => pet.status === 'available')
  const bySpecies = SPECIES.map((species) =>
    available
      .filter((pet) => pet.species === species)
      .sort((a, b) => b.waitingDays - a.waitingDays),
  )
  const picked: Pet[] = []
  for (let round = 0; picked.length < count && round < 20; round += 1) {
    for (const list of bySpecies) {
      const pet = list[round]
      if (pet && picked.length < count) picked.push(pet)
    }
  }
  return picked
}

export interface SuccessStory {
  id: string
  petName: string
  species: Species
  coat: CoatId
  family: string
  cityId: CityId
  adoptedOn: string
  quote: Bilingual
}

export const successStories: SuccessStory[] = [
  {
    id: 'reis',
    petName: 'Reis',
    species: 'dog',
    coat: 'cream',
    family: 'Deniz & Onur',
    cityId: 'istanbul',
    adoptedOn: '2026-05-12',
    quote: {
      en: 'He waited 400 days at the shelter. Now he waits by the door for us every evening.',
      tr: 'Barınakta 400 gün bekledi. Şimdi her akşam kapının önünde bizi bekliyor.',
    },
  },
  {
    id: 'misket',
    petName: 'Misket',
    species: 'cat',
    coat: 'grey',
    family: 'Ayşe Hanım',
    cityId: 'edirne',
    adoptedOn: '2026-03-02',
    quote: {
      en: 'At 71 I wanted a calm companion. Misket reads the newspaper with me every morning.',
      tr: '71 yaşında sakin bir arkadaş istedim. Misket her sabah gazeteyi benimle okuyor.',
    },
  },
  {
    id: 'pofuduk',
    petName: 'Pofuduk',
    species: 'rabbit',
    coat: 'white',
    family: 'Kaya ailesi',
    cityId: 'bursa',
    adoptedOn: '2026-07-20',
    quote: {
      en: 'The kids learned how to care for a rabbit before we met her. The volunteers were so patient.',
      tr: 'Çocuklar onunla tanışmadan önce tavşan bakımını öğrendi. Gönüllüler çok sabırlıydı.',
    },
  },
  {
    id: 'zorba',
    petName: 'Zorba',
    species: 'dog',
    coat: 'black',
    family: 'Mert',
    cityId: 'izmir',
    adoptedOn: '2026-08-08',
    quote: {
      en: 'Three legs, endless energy. We run by the sea together every Sunday.',
      tr: 'Üç bacak, bitmeyen enerji. Her pazar sahilde birlikte koşuyoruz.',
    },
  },
]

export const petsStats = {
  adoptedThisYear: 1284,
  volunteers: shelters.reduce((sum, shelter) => sum + shelter.volunteers, 0),
}
