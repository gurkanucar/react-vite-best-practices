import type { PricedRoom } from '@/features/showcases/data/hotelBooking'
import type { Language } from '@/store/preferences-store'

export type Localized = Record<Language, string>
export type BedType = 'king' | 'twin' | 'family'
export type RoomView = 'garden' | 'pool' | 'sea'
export type RoomAmenity =
  | 'balcony'
  | 'terrace'
  | 'bathtub'
  | 'plungePool'
  | 'espresso'
  | 'workspace'
  | 'kitchenette'
  | 'soundproof'

export const BED_TYPES: BedType[] = ['king', 'twin', 'family']
export const ROOM_VIEWS: RoomView[] = ['garden', 'pool', 'sea']
export const ROOM_AMENITIES: RoomAmenity[] = [
  'balcony',
  'terrace',
  'bathtub',
  'plungePool',
  'espresso',
  'workspace',
  'kitchenette',
  'soundproof',
]

export interface HotelImage {
  url: string
  alt: Localized
}

export interface HotelRoom extends PricedRoom {
  name: Localized
  summary: Localized
  description: Localized
  size: number
  bed: BedType
  view: RoomView
  amenities: RoomAmenity[]
  images: HotelImage[]
}

export function hotelRoot(standalone: boolean) {
  return standalone ? '/preview/hotel' : '/showcases/hotel'
}

export function hotelRoomsRoot(standalone: boolean) {
  return `${hotelRoot(standalone)}/rooms`
}

const photo = (id: string, width = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=80`

export const hotelImages = {
  hero: {
    url: photo('1564501049412-61c2a3083791', 2000),
    alt: {
      en: 'The white hotel building behind a long pool at dusk',
      tr: 'Alacakaranlıkta uzun bir havuzun ardındaki beyaz otel binası',
    },
  },
  gallery: [
    {
      url: photo('1571896349842-33c89424de2d'),
      alt: { en: 'The infinity pool above the bay', tr: 'Koyun üzerindeki sonsuzluk havuzu' },
    },
    {
      url: photo('1540541338287-41700207dee6'),
      alt: { en: 'Sun loungers on the pool deck', tr: 'Havuz güvertesindeki şezlonglar' },
    },
    {
      url: photo('1414235077428-338989a2e8c0'),
      alt: {
        en: 'Dinner at Lodos, the terrace restaurant',
        tr: 'Teras restoranı Lodos’ta akşam yemeği',
      },
    },
    {
      url: photo('1544161515-4ab6ce6db874'),
      alt: { en: 'A massage at the spa', tr: 'Spa’da masaj' },
    },
    {
      url: photo('1533105079780-92b9be482077'),
      alt: {
        en: 'The whitewashed lanes of the old town',
        tr: 'Eski kasabanın beyaz badanalı sokakları',
      },
    },
    {
      url: photo('1507525428034-b723cf961d3e'),
      alt: { en: 'The beach at sunrise', tr: 'Gün doğarken plaj' },
    },
  ],
} satisfies { hero: HotelImage; gallery: HotelImage[] }

export const hotelRooms: HotelRoom[] = [
  {
    id: 'garden-double',
    name: { en: 'Garden Double', tr: 'Bahçe Çift Kişilik' },
    summary: {
      en: 'A quiet room on the olive grove, a few steps from the pool.',
      tr: 'Zeytinliğe bakan, havuza birkaç adım mesafede sakin bir oda.',
    },
    description: {
      en: 'Linen, lime-washed walls and a small patio among the olive trees. The quietest rooms in the house, and the closest to the garden pool.',
      tr: 'Keten, kireç badanalı duvarlar ve zeytin ağaçlarının arasında küçük bir veranda. Otelin en sessiz odaları ve bahçe havuzuna en yakın olanları.',
    },
    size: 24,
    maxGuests: 2,
    bed: 'king',
    view: 'garden',
    amenities: ['terrace', 'espresso', 'soundproof'],
    baseRate: 140,
    inventory: 8,
    demand: 6,
    images: [
      {
        url: photo('1618773928121-c32242e63f39'),
        alt: { en: 'Garden Double with a king bed', tr: 'King yataklı Bahçe Çift Kişilik oda' },
      },
      {
        url: photo('1631049307264-da0ec9d70304'),
        alt: { en: 'Bedside lamps and linen', tr: 'Başucu lambaları ve keten nevresim' },
      },
    ],
  },
  {
    id: 'twin-pool',
    name: { en: 'Pool Twin', tr: 'Havuz Manzaralı İki Yataklı' },
    summary: {
      en: 'Two single beds and a balcony over the main pool.',
      tr: 'İki tek kişilik yatak ve ana havuza bakan bir balkon.',
    },
    description: {
      en: 'Made for friends travelling together: two full-size single beds, a desk by the window and a balcony looking over the main pool towards the sea.',
      tr: 'Birlikte seyahat eden arkadaşlar için: iki geniş tek kişilik yatak, pencere önünde bir çalışma masası ve ana havuzdan denize uzanan manzaralı bir balkon.',
    },
    size: 28,
    maxGuests: 2,
    bed: 'twin',
    view: 'pool',
    amenities: ['balcony', 'workspace', 'espresso'],
    baseRate: 165,
    inventory: 6,
    demand: 10,
    images: [
      {
        url: photo('1596394516093-501ba68a0ba6'),
        alt: { en: 'Pool Twin with a balcony', tr: 'Balkonlu Havuz Manzaralı İki Yataklı oda' },
      },
      {
        url: photo('1611892440504-42a792e24d32'),
        alt: { en: 'Evening light in the room', tr: 'Odada akşam ışığı' },
      },
    ],
  },
  {
    id: 'sea-view-king',
    name: { en: 'Sea View King', tr: 'Deniz Manzaralı King' },
    summary: {
      en: 'Floor-to-ceiling windows and the whole bay from bed.',
      tr: 'Tavana kadar pencereler; yataktan tüm koy görünüyor.',
    },
    description: {
      en: 'Our most booked room. The bed faces the windows, the windows face the bay, and the balcony catches the sunset every evening of the summer.',
      tr: 'En çok tercih edilen odamız. Yatak pencerelere, pencereler koya bakar; balkon yaz boyunca her akşam gün batımını görür.',
    },
    size: 32,
    maxGuests: 2,
    bed: 'king',
    view: 'sea',
    amenities: ['balcony', 'bathtub', 'espresso', 'soundproof'],
    baseRate: 210,
    inventory: 6,
    demand: 22,
    images: [
      {
        url: photo('1582719478250-c89cae4dc85b'),
        alt: {
          en: 'Sea View King with open windows',
          tr: 'Pencereleri açık Deniz Manzaralı King oda',
        },
      },
      {
        url: photo('1602002418082-a4443e081dd1'),
        alt: { en: 'The bay from the room', tr: 'Odadan koy manzarası' },
      },
    ],
  },
  {
    id: 'terrace-deluxe',
    name: { en: 'Terrace Deluxe', tr: 'Teraslı Deluxe' },
    summary: {
      en: 'A wide private terrace with daybeds, half garden and half sea.',
      tr: 'Şezlonglu geniş özel teras; yarısı bahçe, yarısı deniz.',
    },
    description: {
      en: 'The terrace is as big as the room: two daybeds, a table for breakfast outside and a view that runs from the olive grove down to the water.',
      tr: 'Teras, oda kadar büyük: iki şezlong, dışarıda kahvaltı için bir masa ve zeytinlikten denize inen bir manzara.',
    },
    size: 38,
    maxGuests: 3,
    bed: 'king',
    view: 'sea',
    amenities: ['terrace', 'bathtub', 'espresso', 'workspace'],
    baseRate: 260,
    inventory: 4,
    demand: 18,
    images: [
      {
        url: photo('1590490360182-c33d57733427'),
        alt: { en: 'Terrace Deluxe bedroom', tr: 'Teraslı Deluxe yatak odası' },
      },
      {
        url: photo('1520250497591-112f2f40a3f4'),
        alt: { en: 'The view from the terrace', tr: 'Terastan manzara' },
      },
    ],
  },
  {
    id: 'family-suite',
    name: { en: 'Family Suite', tr: 'Aile Süiti' },
    summary: {
      en: 'Two bedrooms, a kitchenette and room for four to spread out.',
      tr: 'İki yatak odası, mini mutfak ve dört kişinin rahat edeceği alan.',
    },
    description: {
      en: 'A king room for the parents, a twin room for the children, a door between them and a kitchenette for the early breakfasts. Cots and high chairs on request.',
      tr: 'Ebeveynler için king yataklı, çocuklar için iki yataklı birer oda, aralarında bir kapı ve erken kahvaltılar için mini mutfak. Bebek yatağı ve mama sandalyesi talep üzerine.',
    },
    size: 54,
    maxGuests: 4,
    bed: 'family',
    view: 'pool',
    amenities: ['balcony', 'kitchenette', 'bathtub', 'espresso'],
    baseRate: 320,
    inventory: 3,
    demand: 26,
    images: [
      {
        url: photo('1578683010236-d716f9a3f461'),
        alt: { en: 'The Family Suite living room', tr: 'Aile Süiti oturma alanı' },
      },
      {
        url: photo('1584132967334-10e028bd69f7'),
        alt: { en: 'The children’s room', tr: 'Çocuk odası' },
      },
    ],
  },
  {
    id: 'cliff-villa',
    name: { en: 'Cliff Villa', tr: 'Yamaç Villası' },
    summary: {
      en: 'A private villa on the headland with its own plunge pool.',
      tr: 'Burunda, kendine ait dalma havuzu olan özel bir villa.',
    },
    description: {
      en: 'Set apart at the end of the headland: a living room that opens onto a plunge pool, an outdoor shower, and nothing between you and the Aegean.',
      tr: 'Burnun ucunda, diğer odalardan ayrı: dalma havuzuna açılan bir oturma odası, açık hava duşu ve sizinle Ege arasında hiçbir şey.',
    },
    size: 85,
    maxGuests: 4,
    bed: 'king',
    view: 'sea',
    amenities: ['plungePool', 'terrace', 'bathtub', 'kitchenette', 'espresso', 'soundproof'],
    baseRate: 540,
    inventory: 2,
    demand: 34,
    images: [
      {
        url: photo('1613977257363-707ba9348227'),
        alt: { en: 'The Cliff Villa and its plunge pool', tr: 'Yamaç Villası ve dalma havuzu' },
      },
      {
        url: photo('1631049307264-da0ec9d70304'),
        alt: { en: 'The villa bedroom', tr: 'Villa yatak odası' },
      },
    ],
  },
]

export function findRoom(id: string | undefined): HotelRoom | undefined {
  return hotelRooms.find((room) => room.id === id)
}

export const hotelReviews = {
  score: 9.4,
  count: 1284,
  categories: [
    { key: 'staff', score: 9.7 },
    { key: 'cleanliness', score: 9.5 },
    { key: 'location', score: 9.6 },
    { key: 'comfort', score: 9.3 },
    { key: 'value', score: 8.8 },
  ],
  quotes: [
    {
      name: 'Hannah M.',
      origin: { en: 'Hamburg, Germany', tr: 'Hamburg, Almanya' },
      text: {
        en: 'We asked for a quiet room and got the whole olive grove. Breakfast on the terrace is worth the trip alone.',
        tr: 'Sessiz bir oda istedik, bütün zeytinliği aldık. Terastaki kahvaltı tek başına yolculuğa değer.',
      },
    },
    {
      name: 'Deniz K.',
      origin: { en: 'Istanbul, Türkiye', tr: 'İstanbul, Türkiye' },
      text: {
        en: 'The team remembered our names from the first evening. The Cliff Villa is exactly as good as the photos.',
        tr: 'Ekip ilk akşamdan isimlerimizi hatırladı. Yamaç Villası fotoğraflardaki kadar güzel.',
      },
    },
    {
      name: 'Oliver & Sam',
      origin: { en: 'Leeds, UK', tr: 'Leeds, Birleşik Krallık' },
      text: {
        en: 'Easy with two small children: the family suite had everything, and the pool is shallow at one end.',
        tr: 'İki küçük çocukla bile kolaydı: aile süitinde her şey vardı, havuzun bir ucu da sığ.',
      },
    },
  ],
}

export const hotelCountries = [
  { value: 'TR', label: { en: 'Türkiye', tr: 'Türkiye' } },
  { value: 'DE', label: { en: 'Germany', tr: 'Almanya' } },
  { value: 'GB', label: { en: 'United Kingdom', tr: 'Birleşik Krallık' } },
  { value: 'NL', label: { en: 'Netherlands', tr: 'Hollanda' } },
  { value: 'FR', label: { en: 'France', tr: 'Fransa' } },
  { value: 'IT', label: { en: 'Italy', tr: 'İtalya' } },
  { value: 'US', label: { en: 'United States', tr: 'Amerika Birleşik Devletleri' } },
  { value: 'OTHER', label: { en: 'Another country', tr: 'Başka bir ülke' } },
]
