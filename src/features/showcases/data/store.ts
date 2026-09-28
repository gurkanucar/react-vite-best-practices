import type { LocalizedText } from '@/features/showcases/types'

export type StoreCategory = 'ceramics' | 'textiles' | 'lighting' | 'furniture' | 'home'

export const STORE_CATEGORIES: StoreCategory[] = [
  'ceramics',
  'textiles',
  'lighting',
  'furniture',
  'home',
]

export type ProductShape =
  | 'vase'
  | 'mug'
  | 'bowl'
  | 'plates'
  | 'lamp'
  | 'pendant'
  | 'cushion'
  | 'throw'
  | 'rug'
  | 'stool'
  | 'basket'
  | 'candle'
  | 'towel'
  | 'chair'

export interface StoreColour {
  id: string
  name: LocalizedText
  hex: string
}

/** Every colour the catalog uses, so the filter can list them once and in one order. */
export const STORE_COLOURS: StoreColour[] = [
  { id: 'chalk', name: { en: 'Chalk', tr: 'Tebeşir' }, hex: '#f1ede4' },
  { id: 'oat', name: { en: 'Oat', tr: 'Yulaf' }, hex: '#ddd0b8' },
  { id: 'sand', name: { en: 'Sand', tr: 'Kum' }, hex: '#cfae80' },
  { id: 'natural', name: { en: 'Natural oak', tr: 'Doğal meşe' }, hex: '#b98d5c' },
  { id: 'clay', name: { en: 'Clay', tr: 'Kil' }, hex: '#b4603c' },
  { id: 'sage', name: { en: 'Sage', tr: 'Adaçayı' }, hex: '#8a9e84' },
  { id: 'ink', name: { en: 'Ink', tr: 'Mürekkep' }, hex: '#2f3d58' },
  { id: 'charcoal', name: { en: 'Charcoal', tr: 'Kömür' }, hex: '#3b3a38' },
]

export interface StoreVariant {
  colour: string
  /** Left out for products that come in one size. */
  size?: string
  stock: number
  /** A size that costs more than the product's base price. */
  price?: number
}

export interface StoreProduct {
  id: string
  name: LocalizedText
  category: StoreCategory
  shape: ProductShape
  /** In Turkish lira, VAT included, as Turkish shops show it. */
  price: number
  compareAt?: number
  rating: number
  reviewCount: number
  /** For "Newest"; an ISO date. */
  addedAt: string
  featured?: boolean
  sizes?: string[]
  variants: StoreVariant[]
  summary: LocalizedText
  description: LocalizedText
  specs: { label: LocalizedText; value: LocalizedText }[]
}

const each = (
  colours: string[],
  stock: number[],
  sizes?: string[],
  prices?: Record<string, number>,
): StoreVariant[] =>
  sizes
    ? colours.flatMap((colour, c) =>
        sizes.map((size, s) => ({
          colour,
          size,
          stock: stock[(c * sizes.length + s) % stock.length]!,
          ...(prices?.[size] ? { price: prices[size] } : {}),
        })),
      )
    : colours.map((colour, c) => ({ colour, stock: stock[c % stock.length]! }))

const spec = (en: string, tr: string, valueEn: string, valueTr = valueEn) => ({
  label: { en, tr },
  value: { en: valueEn, tr: valueTr },
})

const material = (en: string, tr: string) => spec('Material', 'Malzeme', en, tr)
const dimensions = (value: string) => spec('Dimensions', 'Ölçüler', value)
const care = (en: string, tr: string) => spec('Care', 'Bakım', en, tr)
const origin = (en: string, tr: string) => spec('Made in', 'Üretim yeri', en, tr)

export const storeProducts: StoreProduct[] = [
  {
    id: 'terra-vase',
    name: { en: 'Terra stoneware vase', tr: 'Terra taş vazo' },
    category: 'ceramics',
    shape: 'vase',
    price: 890,
    compareAt: 1090,
    rating: 4.8,
    reviewCount: 124,
    addedAt: '2026-08-02',
    featured: true,
    sizes: ['S', 'L'],
    variants: each(['clay', 'sand', 'charcoal'], [14, 6, 9, 3, 0, 7], ['S', 'L'], { L: 1190 }),
    summary: {
      en: 'Wheel-thrown, with a raw foot and a satin glaze.',
      tr: 'Çarkta şekillendirilmiş, ham tabanlı ve saten sırlı.',
    },
    description: {
      en: 'Each Terra vase is thrown by hand in a small Avanos studio, so no two lines are quite the same. The inside is fully glazed and holds water; the outside keeps the texture of the clay.',
      tr: 'Her Terra vazo Avanos’taki küçük bir atölyede elde çekilir; bu yüzden hiçbir çizgisi birbirinin aynı değildir. İçi tamamen sırlıdır ve su tutar, dışı ise kilin dokusunu korur.',
    },
    specs: [
      material('Stoneware, satin glaze', 'Taş seramik, saten sır'),
      dimensions('S: Ø12 × 18 cm · L: Ø16 × 28 cm'),
      care('Hand wash', 'Elde yıkayın'),
      origin('Avanos, Türkiye', 'Avanos, Türkiye'),
    ],
  },
  {
    id: 'morning-mugs',
    name: { en: 'Morning mugs, set of 2', tr: 'Sabah kupası, 2’li set' },
    category: 'ceramics',
    shape: 'mug',
    price: 420,
    rating: 4.6,
    reviewCount: 212,
    addedAt: '2026-05-14',
    variants: each(['sand', 'sage', 'ink'], [30, 18, 4]),
    summary: {
      en: 'A heavy, round-handled mug for the first coffee.',
      tr: 'Günün ilk kahvesi için ağır, yuvarlak kulplu kupa.',
    },
    description: {
      en: 'A generous 350 ml mug with a thick wall that keeps coffee warm, and a handle wide enough for three fingers.',
      tr: 'Kahveyi sıcak tutan kalın cidarlı, üç parmağın rahatça sığdığı kulplu, cömert 350 ml kupa.',
    },
    specs: [
      material('Stoneware', 'Taş seramik'),
      dimensions('Ø9 × 10 cm · 350 ml'),
      care('Dishwasher and microwave safe', 'Bulaşık makinesi ve mikrodalgaya uygun'),
      origin('Kütahya, Türkiye', 'Kütahya, Türkiye'),
    ],
  },
  {
    id: 'ridge-bowl',
    name: { en: 'Ridge serving bowl', tr: 'Ridge servis kasesi' },
    category: 'ceramics',
    shape: 'bowl',
    price: 640,
    rating: 4.7,
    reviewCount: 58,
    addedAt: '2026-07-21',
    variants: each(['chalk', 'clay'], [11, 2]),
    summary: {
      en: 'A wide bowl with carved ridges, for salads and fruit.',
      tr: 'Salata ve meyve için oymalı çizgili geniş kase.',
    },
    description: {
      en: 'The ridges are carved into the leather-hard clay by hand before firing, and catch the light around the rim.',
      tr: 'Çizgiler, pişirimden önce deri sertliğindeki kile elle oyulur ve ağız kenarında ışığı yakalar.',
    },
    specs: [
      material('Stoneware', 'Taş seramik'),
      dimensions('Ø28 × 9 cm'),
      care('Dishwasher safe', 'Bulaşık makinesine uygun'),
      origin('Avanos, Türkiye', 'Avanos, Türkiye'),
    ],
  },
  {
    id: 'dune-plates',
    name: { en: 'Dune dinner plates, set of 4', tr: 'Dune yemek tabağı, 4’lü set' },
    category: 'ceramics',
    shape: 'plates',
    price: 1180,
    compareAt: 1390,
    rating: 4.5,
    reviewCount: 87,
    addedAt: '2026-03-30',
    variants: each(['chalk', 'sand', 'charcoal'], [9, 12, 5]),
    summary: {
      en: 'Low-rimmed plates with a speckled, reactive glaze.',
      tr: 'Benekli, reaktif sırlı, alçak kenarlı tabaklar.',
    },
    description: {
      en: 'A reactive glaze pools differently on every plate, so a set of four reads as a family rather than four copies.',
      tr: 'Reaktif sır her tabakta farklı toplanır; dörtlü set dört kopya değil, bir aile gibi görünür.',
    },
    specs: [
      material('Stoneware, reactive glaze', 'Taş seramik, reaktif sır'),
      dimensions('Ø27 cm'),
      care('Dishwasher safe', 'Bulaşık makinesine uygun'),
      origin('Kütahya, Türkiye', 'Kütahya, Türkiye'),
    ],
  },
  {
    id: 'halo-lamp',
    name: { en: 'Halo table lamp', tr: 'Halo masa lambası' },
    category: 'lighting',
    shape: 'lamp',
    price: 2450,
    rating: 4.9,
    reviewCount: 46,
    addedAt: '2026-09-05',
    featured: true,
    variants: each(['oat', 'charcoal'], [8, 5]),
    summary: {
      en: 'A pleated linen shade on a turned ceramic base.',
      tr: 'Tornalanmış seramik gövde üzerinde pliseli keten abajur.',
    },
    description: {
      en: 'The shade softens the bulb into an even, warm glow. A dimmer sits on the cord, and the base is heavy enough to stay put.',
      tr: 'Abajur ampulü eşit, sıcak bir ışığa dönüştürür. Kablonun üzerinde bir dimmer vardır; gövde yerinden oynamayacak kadar ağırdır.',
    },
    specs: [
      material('Ceramic base, linen shade', 'Seramik gövde, keten abajur'),
      dimensions('Ø30 × 46 cm'),
      spec('Bulb', 'Ampul', 'E27, up to 8 W LED', 'E27, en fazla 8 W LED'),
      origin('İzmir, Türkiye', 'İzmir, Türkiye'),
    ],
  },
  {
    id: 'orbit-pendant',
    name: { en: 'Orbit pendant light', tr: 'Orbit sarkıt lamba' },
    category: 'lighting',
    shape: 'pendant',
    price: 3200,
    rating: 4.4,
    reviewCount: 19,
    addedAt: '2026-06-18',
    variants: each(['chalk', 'ink'], [2, 3]),
    summary: {
      en: 'A spun-metal dome with a soft, downward light.',
      tr: 'Işığı yumuşakça aşağı veren metal kubbe.',
    },
    description: {
      en: 'Spun from a single sheet of aluminium and powder-coated inside and out. Hangs on a 150 cm fabric cord you can shorten at the canopy.',
      tr: 'Tek parça alüminyumdan döndürülür, içi ve dışı toz boyalıdır. Tavan kapağından kısaltılabilen 150 cm kumaş kabloyla asılır.',
    },
    specs: [
      material('Powder-coated aluminium', 'Toz boyalı alüminyum'),
      dimensions('Ø38 × 24 cm'),
      spec('Bulb', 'Ampul', 'E27, up to 12 W LED', 'E27, en fazla 12 W LED'),
      origin('İstanbul, Türkiye', 'İstanbul, Türkiye'),
    ],
  },
  {
    id: 'linen-cushion',
    name: { en: 'Washed linen cushion', tr: 'Yıkanmış keten yastık' },
    category: 'textiles',
    shape: 'cushion',
    price: 540,
    compareAt: 690,
    rating: 4.7,
    reviewCount: 301,
    addedAt: '2026-04-09',
    featured: true,
    sizes: ['45 × 45', '50 × 50'],
    variants: each(
      ['oat', 'clay', 'sage', 'ink'],
      [20, 14, 7, 0, 16, 9, 4, 11],
      ['45 × 45', '50 × 50'],
      {
        '50 × 50': 620,
      },
    ),
    summary: {
      en: 'Stone-washed linen with a feather insert.',
      tr: 'Taşla yıkanmış keten, kaz tüyü dolgulu.',
    },
    description: {
      en: 'Stone-washing makes the linen soft from the first day and gives it the gentle creases it keeps for years. The cover zips off for washing.',
      tr: 'Taşla yıkama keteni ilk günden yumuşak yapar ve yıllarca koruyacağı hafif kırışıklıkları verir. Kılıf fermuarla çıkar ve yıkanabilir.',
    },
    specs: [
      material('100% European linen', '%100 Avrupa keteni'),
      spec('Insert', 'Dolgu', 'Duck feather', 'Ördek tüyü'),
      care('Cover machine washable at 40 °C', 'Kılıf 40 °C’de makinede yıkanabilir'),
      origin('Denizli, Türkiye', 'Denizli, Türkiye'),
    ],
  },
  {
    id: 'waffle-throw',
    name: { en: 'Waffle cotton throw', tr: 'Waffle pamuk battaniye' },
    category: 'textiles',
    shape: 'throw',
    price: 1290,
    rating: 4.8,
    reviewCount: 142,
    addedAt: '2026-09-12',
    variants: each(['chalk', 'sand', 'sage'], [13, 8, 6]),
    summary: {
      en: 'A deep waffle weave that is warm without weight.',
      tr: 'Ağırlık yapmadan ısıtan derin waffle dokuma.',
    },
    description: {
      en: 'Woven on slow looms from long-staple Aegean cotton. The honeycomb traps air, so it is warm on a cool evening and breathes in summer.',
      tr: 'Uzun lifli Ege pamuğundan yavaş tezgâhlarda dokunur. Petek doku havayı hapseder; serin akşamlarda ısıtır, yazın nefes alır.',
    },
    specs: [
      material('100% Aegean cotton', '%100 Ege pamuğu'),
      dimensions('130 × 180 cm'),
      care('Machine wash at 30 °C', '30 °C’de makinede yıkayın'),
      origin('Denizli, Türkiye', 'Denizli, Türkiye'),
    ],
  },
  {
    id: 'anatolia-rug',
    name: { en: 'Anatolia flatweave rug', tr: 'Anadolu düz dokuma kilim' },
    category: 'textiles',
    shape: 'rug',
    price: 3450,
    compareAt: 3990,
    rating: 4.9,
    reviewCount: 37,
    addedAt: '2026-08-27',
    featured: true,
    sizes: ['120 × 180', '160 × 230', '200 × 300'],
    variants: each(['clay', 'ink'], [6, 4, 1, 5, 3, 0], ['120 × 180', '160 × 230', '200 × 300'], {
      '160 × 230': 5250,
      '200 × 300': 7900,
    }),
    summary: {
      en: 'Hand-woven wool with a quiet, graphic border.',
      tr: 'Sade, grafik bordürlü el dokuması yün kilim.',
    },
    description: {
      en: 'Woven by a cooperative in Uşak from undyed and plant-dyed wool. Flatweave lies flat from day one and turns over, so it wears evenly.',
      tr: 'Uşak’taki bir kooperatifte boyasız ve bitki boyalı yünden dokunur. Düz dokuma ilk günden düz durur ve iki yüzü de kullanılabildiği için eşit yıpranır.',
    },
    specs: [
      material('100% wool, plant dyes', '%100 yün, bitkisel boya'),
      spec('Pile', 'Hav', 'Flatweave, reversible', 'Düz dokuma, çift yüzlü'),
      care('Professional clean', 'Profesyonel temizlik'),
      origin('Uşak, Türkiye', 'Uşak, Türkiye'),
    ],
  },
  {
    id: 'oak-stool',
    name: { en: 'Oak stool', tr: 'Meşe tabure' },
    category: 'furniture',
    shape: 'stool',
    price: 2890,
    rating: 4.6,
    reviewCount: 64,
    addedAt: '2026-02-11',
    variants: each(['natural', 'charcoal'], [7, 4]),
    summary: {
      en: 'Solid oak, joined without screws. A seat, a side table, a plant stand.',
      tr: 'Vidasız birleştirilmiş masif meşe. Oturak, yan sehpa ya da saksı standı.',
    },
    description: {
      en: 'The legs are wedged through the seat, the way stools were made before screws were cheap. Finished with a hard-wax oil you can refresh at home.',
      tr: 'Ayaklar, vidanın ucuz olmadığı zamanlardaki gibi oturağın içinden kamalanır. Evde yenilenebilen sert mum yağıyla bitirilmiştir.',
    },
    specs: [
      material('Solid European oak', 'Masif Avrupa meşesi'),
      dimensions('Ø34 × 45 cm'),
      care('Wipe clean; re-oil once a year', 'Silerek temizleyin; yılda bir yağlayın'),
      origin('Bursa, Türkiye', 'Bursa, Türkiye'),
    ],
  },
  {
    id: 'ash-lounge-chair',
    name: { en: 'Ash lounge chair', tr: 'Dişbudak dinlenme koltuğu' },
    category: 'furniture',
    shape: 'chair',
    price: 7450,
    compareAt: 8200,
    rating: 4.8,
    reviewCount: 22,
    addedAt: '2026-09-20',
    variants: each(['oat', 'sage'], [3, 2]),
    summary: {
      en: 'A low, deep seat in steam-bent ash and wool bouclé.',
      tr: 'Buharla bükülmüş dişbudak ve yün bukle ile alçak, derin oturum.',
    },
    description: {
      en: 'Low enough to sink into with a book, firm enough to get out of. The cushions are removable and filled with recycled fibre.',
      tr: 'Bir kitapla gömülecek kadar alçak, kalkarken zorlamayacak kadar sıkı. Minderler çıkarılabilir ve geri dönüştürülmüş elyafla doludur.',
    },
    specs: [
      material('Ash frame, wool bouclé', 'Dişbudak iskelet, yün bukle'),
      dimensions('72 × 80 × 74 cm'),
      spec('Seat height', 'Oturma yüksekliği', '38 cm'),
      origin('Bursa, Türkiye', 'Bursa, Türkiye'),
    ],
  },
  {
    id: 'rattan-basket',
    name: { en: 'Rattan storage basket', tr: 'Rattan saklama sepeti' },
    category: 'home',
    shape: 'basket',
    price: 480,
    rating: 4.5,
    reviewCount: 96,
    addedAt: '2026-06-02',
    sizes: ['S', 'M', 'L'],
    variants: each(['natural'], [22, 15, 6], ['S', 'M', 'L'], { M: 620, L: 790 }),
    summary: {
      en: 'Woven rattan for throws, toys and firewood.',
      tr: 'Battaniye, oyuncak ve odun için örme rattan.',
    },
    description: {
      en: 'Woven tight enough to hold its shape when full, with two handles woven into the rim rather than added after.',
      tr: 'Doluyken şeklini koruyacak kadar sık örülür; iki kulp sonradan eklenmez, ağız kenarına örülür.',
    },
    specs: [
      material('Natural rattan', 'Doğal rattan'),
      dimensions('S: Ø30 · M: Ø38 · L: Ø46 cm'),
      care('Dust with a dry brush', 'Kuru fırçayla tozunu alın'),
      origin('Hand-woven in Indonesia', 'Endonezya’da el örgüsü'),
    ],
  },
  {
    id: 'fig-cedar-candle',
    name: { en: 'Fig & cedar candle', tr: 'İncir ve sedir mumu' },
    category: 'home',
    shape: 'candle',
    price: 360,
    rating: 4.7,
    reviewCount: 188,
    addedAt: '2026-09-15',
    variants: each(['chalk', 'clay', 'charcoal'], [26, 0, 12]),
    summary: {
      en: 'Soy wax in a reusable ceramic cup; about 45 hours.',
      tr: 'Tekrar kullanılabilir seramik kapta soya mumu; yaklaşık 45 saat.',
    },
    description: {
      en: 'Green fig leaf over a warm base of cedar and vetiver. When the wax is gone, the cup is a planter or a pencil pot.',
      tr: 'Sıcak sedir ve vetiver notaları üzerinde yeşil incir yaprağı. Mum bittiğinde kap saksı ya da kalemlik olur.',
    },
    specs: [
      material('Soy wax, cotton wick', 'Soya mumu, pamuk fitil'),
      spec('Burn time', 'Yanma süresi', 'About 45 hours', 'Yaklaşık 45 saat'),
      dimensions('Ø8 × 9 cm · 220 g'),
      origin('İstanbul, Türkiye', 'İstanbul, Türkiye'),
    ],
  },
  {
    id: 'peshtemal-towel',
    name: { en: 'Striped peshtemal towel', tr: 'Çizgili peştemal' },
    category: 'textiles',
    shape: 'towel',
    price: 390,
    compareAt: 450,
    rating: 4.6,
    reviewCount: 256,
    addedAt: '2026-05-27',
    variants: each(['sand', 'sage', 'ink', 'clay'], [18, 9, 14, 3]),
    summary: {
      en: 'Light, quick-drying Turkish cotton for bath and beach.',
      tr: 'Banyo ve plaj için hafif, çabuk kuruyan Türk pamuğu.',
    },
    description: {
      en: 'Flat-woven on shuttle looms in Buldan and finished with hand-knotted tassels. It gets softer and more absorbent with every wash.',
      tr: 'Buldan’da mekikli tezgâhlarda düz dokunur, el düğümlü püsküllerle bitirilir. Her yıkamada daha yumuşak ve daha emici olur.',
    },
    specs: [
      material('100% cotton', '%100 pamuk'),
      dimensions('95 × 180 cm'),
      care('Machine wash at 40 °C', '40 °C’de makinede yıkayın'),
      origin('Buldan, Türkiye', 'Buldan, Türkiye'),
    ],
  },
]

export function findStoreProduct(id: string | undefined): StoreProduct | undefined {
  return storeProducts.find((product) => product.id === id)
}

export function findStoreColour(id: string): StoreColour {
  return STORE_COLOURS.find((colour) => colour.id === id) ?? STORE_COLOURS[0]!
}

/** A short bank of reviews; each product shows the three its position picks. */
export const storeReviews: {
  author: string
  rating: number
  date: string
  body: LocalizedText
}[] = [
  {
    author: 'Deniz A.',
    rating: 5,
    date: '2026-09-03',
    body: {
      en: 'Even nicer in person. Arrived well packed, two days after I ordered.',
      tr: 'Yakından daha da güzel. Sipariş verdikten iki gün sonra, özenle paketlenmiş geldi.',
    },
  },
  {
    author: 'Hannah M.',
    rating: 4,
    date: '2026-08-19',
    body: {
      en: 'Lovely quality. The colour is a little warmer than on screen, which I ended up liking.',
      tr: 'Kalitesi çok güzel. Rengi ekrandakinden biraz daha sıcak, sonunda bunu sevdim.',
    },
  },
  {
    author: 'Mert K.',
    rating: 5,
    date: '2026-07-30',
    body: {
      en: 'Bought one, came back for two more as gifts.',
      tr: 'Bir tane aldım, hediye için iki tane daha almaya geri geldim.',
    },
  },
  {
    author: 'Selin Ö.',
    rating: 5,
    date: '2026-07-11',
    body: {
      en: 'You can tell it was made by hand. Worth the wait for the restock.',
      tr: 'El yapımı olduğu belli. Stoğa girmesini beklemeye değdi.',
    },
  },
  {
    author: 'Tom R.',
    rating: 3,
    date: '2026-06-24',
    body: {
      en: 'Beautiful, but smaller than I pictured. Check the dimensions.',
      tr: 'Çok güzel ama hayal ettiğimden küçük. Ölçülere mutlaka bakın.',
    },
  },
  {
    author: 'Ayşe Y.',
    rating: 4,
    date: '2026-06-02',
    body: {
      en: 'Exchanged the colour without any fuss. Customer service answered within an hour.',
      tr: 'Rengi hiç sorun çıkmadan değiştirdiler. Müşteri hizmetleri bir saat içinde döndü.',
    },
  },
]
