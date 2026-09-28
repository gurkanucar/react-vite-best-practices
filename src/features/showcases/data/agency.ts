import type { Language } from '@/store/preferences-store'

/** Oda Studio: an invented brand and digital studio in Istanbul and Berlin. */
export type Localized = Record<Language, string>

export function agencyRoot(standalone: boolean) {
  return standalone ? '/preview/agency' : '/showcases/agency'
}

export const DISCIPLINES = ['branding', 'web', 'product', 'motion', 'campaign'] as const
export type Discipline = (typeof DISCIPLINES)[number]

export interface Palette {
  bg: string
  ink: string
  accent: string
  soft: string
}

export type ArtVariant = 'orbit' | 'grid' | 'wave' | 'type' | 'stack' | 'sun' | 'bars' | 'petal'

export interface Artwork {
  variant: ArtVariant
  palette: Palette
  /** The letter a `type` composition is built around. */
  glyph?: string
}

export interface CaseStudy {
  id: string
  client: string
  year: number
  disciplines: Discipline[]
  cover: Artwork
  /** The client's identity before the project, for the comparison slider. */
  before: Artwork
  gallery: [Artwork, Artwork]
  title: Localized
  summary: Localized
  services: Localized[]
  challenge: Localized
  approach: Localized
  result: Localized
  metrics: { value: string; label: Localized }[]
  quote: { text: Localized; author: string; role: Localized }
  credits: { role: Localized; name: string }[]
}

const muted: Palette = { bg: '#d9d6cf', ink: '#6b675f', accent: '#9a958b', soft: '#c7c3ba' }

export const caseStudies: CaseStudy[] = [
  {
    id: 'kora-bank',
    client: 'Kora Bank',
    year: 2026,
    disciplines: ['branding', 'product'],
    cover: {
      variant: 'orbit',
      palette: { bg: '#0f2a24', ink: '#e8f3e2', accent: '#c6f36b', soft: '#1e4a3f' },
    },
    before: { variant: 'grid', palette: muted },
    gallery: [
      {
        variant: 'type',
        glyph: 'K',
        palette: { bg: '#c6f36b', ink: '#0f2a24', accent: '#0f2a24', soft: '#b0dd58' },
      },
      {
        variant: 'stack',
        palette: { bg: '#e8f3e2', ink: '#0f2a24', accent: '#c6f36b', soft: '#cfe3c6' },
      },
    ],
    title: {
      en: 'A bank that talks like a neighbour',
      tr: 'Komşu gibi konuşan bir banka',
    },
    summary: {
      en: 'Identity, tone of voice and a mobile app for a regional bank going fully digital.',
      tr: 'Tamamen dijitale geçen bölgesel bir banka için kimlik, marka dili ve mobil uygulama.',
    },
    services: [
      { en: 'Brand strategy', tr: 'Marka stratejisi' },
      { en: 'Visual identity', tr: 'Görsel kimlik' },
      { en: 'Mobile app', tr: 'Mobil uygulama' },
    ],
    challenge: {
      en: 'Kora had closed half of its branches in two years. Customers trusted the people behind the counter, not the logo, and the app felt like a form to fill in.',
      tr: 'Kora iki yılda şubelerinin yarısını kapatmıştı. Müşteriler logoya değil gişedeki insanlara güveniyordu ve uygulama doldurulacak bir form gibi hissettiriyordu.',
    },
    approach: {
      en: 'We moved the warmth of the branch into the product: plain words, a round and friendly wordmark, and an orbit motif that shows money moving around the people you know.',
      tr: 'Şubenin sıcaklığını ürüne taşıdık: sade kelimeler, yuvarlak ve samimi bir logo, ve paranın tanıdığınız insanların etrafında dolaştığını anlatan bir yörünge motifi.',
    },
    result: {
      en: 'The new app launched with the identity. Within six months it became the way most customers bank, and complaints about unclear fees fell sharply.',
      tr: 'Yeni uygulama kimlikle birlikte yayına çıktı. Altı ay içinde müşterilerin çoğunun bankacılık yaptığı yer oldu ve anlaşılmayan ücret şikâyetleri belirgin biçimde azaldı.',
    },
    metrics: [
      { value: '4.8', label: { en: 'App store rating', tr: 'Uygulama mağazası puanı' } },
      { value: '+62%', label: { en: 'Monthly active users', tr: 'Aylık aktif kullanıcı' } },
      { value: '−41%', label: { en: 'Fee complaints', tr: 'Ücret şikâyeti' } },
    ],
    quote: {
      text: {
        en: 'They listened to our tellers before they opened a design file. You can feel that in every screen.',
        tr: 'Tasarım dosyasını açmadan önce gişe çalışanlarımızı dinlediler. Bunu her ekranda hissedebiliyorsunuz.',
      },
      author: 'Aylin Demir',
      role: { en: 'Chief Digital Officer, Kora Bank', tr: 'Dijital Direktör, Kora Bank' },
    },
    credits: [
      { role: { en: 'Creative direction', tr: 'Kreatif direktörlük' }, name: 'Deniz Aksoy' },
      { role: { en: 'Product design', tr: 'Ürün tasarımı' }, name: 'Jonas Richter' },
      { role: { en: 'Strategy', tr: 'Strateji' }, name: 'Ece Tan' },
    ],
  },
  {
    id: 'orbit-festival',
    client: 'Orbit Festival',
    year: 2026,
    disciplines: ['motion', 'campaign'],
    cover: {
      variant: 'bars',
      palette: { bg: '#1a0f3d', ink: '#fff4e0', accent: '#ff5a36', soft: '#3a2a7a' },
    },
    before: { variant: 'sun', palette: muted },
    gallery: [
      {
        variant: 'wave',
        palette: { bg: '#ff5a36', ink: '#1a0f3d', accent: '#fff4e0', soft: '#ff7d5f' },
      },
      {
        variant: 'type',
        glyph: 'O',
        palette: { bg: '#1a0f3d', ink: '#ff5a36', accent: '#fff4e0', soft: '#3a2a7a' },
      },
    ],
    title: { en: 'A festival you can hear in the poster', tr: 'Afişinden duyulan bir festival' },
    summary: {
      en: 'A sound-reactive identity and campaign for a three-day electronic music festival.',
      tr: 'Üç günlük bir elektronik müzik festivali için sese tepki veren kimlik ve kampanya.',
    },
    services: [
      { en: 'Campaign', tr: 'Kampanya' },
      { en: 'Motion system', tr: 'Hareket sistemi' },
      { en: 'Stage visuals', tr: 'Sahne görselleri' },
    ],
    challenge: {
      en: 'Every festival poster looks like a line-up in a nice font. Orbit wanted people to feel the sound system before buying a ticket.',
      tr: 'Her festival afişi güzel bir yazı tipiyle yazılmış bir sanatçı listesine benziyor. Orbit, insanların bilet almadan önce ses sistemini hissetmesini istedi.',
    },
    approach: {
      en: 'We built the identity from the music itself: bars that follow real frequency data, so every headliner gets a poster drawn by their own track.',
      tr: 'Kimliği müziğin kendisinden kurduk: gerçek frekans verisini izleyen çubuklar sayesinde her ana sanatçının afişi kendi parçasıyla çiziliyor.',
    },
    result: {
      en: 'The campaign sold out early-bird tickets in a weekend, and the same system drove the stage screens for all three nights.',
      tr: 'Kampanya erken kayıt biletlerini bir hafta sonunda tüketti; aynı sistem üç gece boyunca sahne ekranlarını da yönetti.',
    },
    metrics: [
      { value: '48h', label: { en: 'Early-bird sell-out', tr: 'Erken biletler tükendi' } },
      { value: '3.1M', label: { en: 'Campaign views', tr: 'Kampanya izlenmesi' } },
      { value: '27', label: { en: 'Artist posters', tr: 'Sanatçı afişi' } },
    ],
    quote: {
      text: {
        en: 'For the first time our visuals felt like part of the line-up.',
        tr: 'İlk kez görsellerimiz de programın bir parçası gibi hissettirdi.',
      },
      author: 'Kaan Yıldız',
      role: { en: 'Festival Director, Orbit', tr: 'Festival Direktörü, Orbit' },
    },
    credits: [
      { role: { en: 'Motion direction', tr: 'Hareket direktörlüğü' }, name: 'Lina Vogel' },
      { role: { en: 'Creative code', tr: 'Kreatif kodlama' }, name: 'Mert Kaya' },
      { role: { en: 'Production', tr: 'Prodüksiyon' }, name: 'Selin Oral' },
    ],
  },
  {
    id: 'atlas-museum',
    client: 'Atlas Museum of Design',
    year: 2025,
    disciplines: ['web', 'branding'],
    cover: {
      variant: 'grid',
      palette: { bg: '#f4f1ea', ink: '#141414', accent: '#2f5bff', soft: '#e2ddd2' },
    },
    before: { variant: 'type', glyph: 'A', palette: muted },
    gallery: [
      {
        variant: 'stack',
        palette: { bg: '#2f5bff', ink: '#f4f1ea', accent: '#141414', soft: '#4a72ff' },
      },
      {
        variant: 'grid',
        palette: { bg: '#141414', ink: '#f4f1ea', accent: '#2f5bff', soft: '#2a2a2a' },
      },
    ],
    title: {
      en: 'A collection that opens like a drawer',
      tr: 'Bir çekmece gibi açılan koleksiyon',
    },
    summary: {
      en: 'A new website and online collection for a design museum with 40,000 objects.',
      tr: '40.000 nesnelik bir tasarım müzesi için yeni web sitesi ve çevrim içi koleksiyon.',
    },
    services: [
      { en: 'Website', tr: 'Web sitesi' },
      { en: 'Collection platform', tr: 'Koleksiyon platformu' },
      { en: 'Wayfinding', tr: 'Yön bulma' },
    ],
    challenge: {
      en: 'Only a fraction of the collection was ever on display, and the online archive was a search box that returned catalogue numbers.',
      tr: 'Koleksiyonun yalnızca küçük bir kısmı sergileniyordu ve çevrim içi arşiv, katalog numarası döndüren bir arama kutusundan ibaretti.',
    },
    approach: {
      en: 'We designed the site around the museum’s storage grid: every object has a place, and you browse by pulling out drawers of colour, material and decade.',
      tr: 'Siteyi müzenin depo ızgarası etrafında tasarladık: her nesnenin bir yeri var ve renk, malzeme ve on yıl çekmecelerini açarak geziniyorsunuz.',
    },
    result: {
      en: 'Visitors now spend minutes, not seconds, in the collection, and schools use the drawers as a teaching tool.',
      tr: 'Ziyaretçiler artık koleksiyonda saniyeler değil dakikalar geçiriyor; okullar çekmeceleri ders aracı olarak kullanıyor.',
    },
    metrics: [
      { value: '6×', label: { en: 'Time in collection', tr: 'Koleksiyonda geçen süre' } },
      { value: '40k', label: { en: 'Objects online', tr: 'Çevrim içi nesne' } },
      { value: 'AA', label: { en: 'Accessibility level', tr: 'Erişilebilirlik seviyesi' } },
    ],
    quote: {
      text: {
        en: 'The archive used to be our storeroom. Now it is our most visited gallery.',
        tr: 'Arşiv eskiden depomuzdu. Şimdi en çok ziyaret edilen galerimiz.',
      },
      author: 'Dr. Helena Brandt',
      role: { en: 'Director, Atlas Museum of Design', tr: 'Müdür, Atlas Tasarım Müzesi' },
    },
    credits: [
      { role: { en: 'Design direction', tr: 'Tasarım direktörlüğü' }, name: 'Jonas Richter' },
      { role: { en: 'Engineering', tr: 'Yazılım' }, name: 'Mert Kaya' },
      { role: { en: 'Content strategy', tr: 'İçerik stratejisi' }, name: 'Ece Tan' },
    ],
  },
  {
    id: 'nimbus-roasters',
    client: 'Nimbus Roasters',
    year: 2025,
    disciplines: ['branding', 'campaign'],
    cover: {
      variant: 'sun',
      palette: { bg: '#f6e3c8', ink: '#3b1f14', accent: '#d9501e', soft: '#eccba1' },
    },
    before: { variant: 'bars', palette: muted },
    gallery: [
      {
        variant: 'petal',
        palette: { bg: '#3b1f14', ink: '#f6e3c8', accent: '#d9501e', soft: '#5a3322' },
      },
      {
        variant: 'type',
        glyph: 'N',
        palette: { bg: '#d9501e', ink: '#f6e3c8', accent: '#3b1f14', soft: '#e36d3f' },
      },
    ],
    title: { en: 'Packaging that tastes like the morning', tr: 'Sabahın tadını veren ambalajlar' },
    summary: {
      en: 'Identity and packaging for a specialty roaster moving into supermarkets.',
      tr: 'Süpermarket raflarına çıkan bir nitelikli kahve kavurucusu için kimlik ve ambalaj.',
    },
    services: [
      { en: 'Identity', tr: 'Kimlik' },
      { en: 'Packaging', tr: 'Ambalaj' },
      { en: 'Launch campaign', tr: 'Lansman kampanyası' },
    ],
    challenge: {
      en: 'On a supermarket shelf, specialty coffee looks exactly like the coffee that costs half as much. Tasting notes were in six-point type.',
      tr: 'Süpermarket rafında nitelikli kahve, yarı fiyatına satılan kahveyle birebir aynı görünüyor. Tat notları altı punto yazılmıştı.',
    },
    approach: {
      en: 'Each roast got a sunrise: the colour of the sky shows how dark the roast is, and the tasting notes became the headline.',
      tr: 'Her kavruma bir gün doğumu verdik: gökyüzünün rengi kavrumanın koyuluğunu gösteriyor, tat notları da başlığa dönüştü.',
    },
    result: {
      en: 'Nimbus is now stocked in 300 stores, and the sunrise scale is printed on their café menus too.',
      tr: 'Nimbus artık 300 mağazada satılıyor; gün doğumu skalası kafe menülerine de basılıyor.',
    },
    metrics: [
      { value: '300', label: { en: 'Stores stocking', tr: 'Satış noktası' } },
      { value: '+35%', label: { en: 'Sell-through', tr: 'Raf satış hızı' } },
      { value: '9', label: { en: 'Roasts, one system', tr: 'Kavruma, tek sistem' } },
    ],
    quote: {
      text: {
        en: 'People pick up the bag because of the colour and buy it because they understand it.',
        tr: 'İnsanlar paketi renginden dolayı elinize alıyor, anladıkları için satın alıyor.',
      },
      author: 'Tomas Lind',
      role: { en: 'Founder, Nimbus Roasters', tr: 'Kurucu, Nimbus Roasters' },
    },
    credits: [
      { role: { en: 'Creative direction', tr: 'Kreatif direktörlük' }, name: 'Deniz Aksoy' },
      { role: { en: 'Packaging design', tr: 'Ambalaj tasarımı' }, name: 'Jonas Richter' },
      { role: { en: 'Illustration', tr: 'İllüstrasyon' }, name: 'Lina Vogel' },
    ],
  },
  {
    id: 'fern-health',
    client: 'Fern Health',
    year: 2025,
    disciplines: ['product', 'web'],
    cover: {
      variant: 'stack',
      palette: { bg: '#e7efe9', ink: '#10352a', accent: '#3fb58a', soft: '#cfe0d5' },
    },
    before: { variant: 'grid', palette: muted },
    gallery: [
      {
        variant: 'petal',
        palette: { bg: '#10352a', ink: '#e7efe9', accent: '#3fb58a', soft: '#1d4a3c' },
      },
      {
        variant: 'wave',
        palette: { bg: '#3fb58a', ink: '#10352a', accent: '#e7efe9', soft: '#5cc49c' },
      },
    ],
    title: {
      en: 'Care plans people actually finish',
      tr: 'İnsanların gerçekten tamamladığı tedavi planları',
    },
    summary: {
      en: 'A patient app and clinician dashboard for a physiotherapy network.',
      tr: 'Bir fizyoterapi ağı için hasta uygulaması ve klinisyen paneli.',
    },
    services: [
      { en: 'Product design', tr: 'Ürün tasarımı' },
      { en: 'Design system', tr: 'Tasarım sistemi' },
      { en: 'Research', tr: 'Araştırma' },
    ],
    challenge: {
      en: 'Most patients stopped their home exercises after the second week. The printed plans were lost, and nobody knew who needed a nudge.',
      tr: 'Hastaların çoğu ev egzersizlerini ikinci haftadan sonra bırakıyordu. Basılı planlar kayboluyor, kimin hatırlatmaya ihtiyacı olduğunu kimse bilmiyordu.',
    },
    approach: {
      en: 'We turned the plan into a daily five-minute routine with gentle progress and gave clinicians one screen showing who was drifting.',
      tr: 'Planı yumuşak bir ilerleme hissiyle günlük beş dakikalık bir rutine çevirdik ve klinisyenlere kimin koptuğunu gösteren tek bir ekran verdik.',
    },
    result: {
      en: 'Plan completion more than doubled, and clinicians call fewer patients but the right ones.',
      tr: 'Plan tamamlama oranı iki katından fazla arttı; klinisyenler daha az hastayı ama doğru hastaları arıyor.',
    },
    metrics: [
      { value: '2.3×', label: { en: 'Plan completion', tr: 'Plan tamamlama' } },
      { value: '5 min', label: { en: 'Daily routine', tr: 'Günlük rutin' } },
      { value: '120', label: { en: 'Clinics onboarded', tr: 'Katılan klinik' } },
    ],
    quote: {
      text: {
        en: 'The app never makes a patient feel behind. That turned out to be the whole trick.',
        tr: 'Uygulama hastaya asla geride kaldığını hissettirmiyor. Bütün sır buymuş.',
      },
      author: 'Dr. Murat Şahin',
      role: { en: 'Clinical Lead, Fern Health', tr: 'Klinik Lider, Fern Health' },
    },
    credits: [
      { role: { en: 'Product design', tr: 'Ürün tasarımı' }, name: 'Jonas Richter' },
      { role: { en: 'Research', tr: 'Araştırma' }, name: 'Ece Tan' },
      { role: { en: 'Engineering', tr: 'Yazılım' }, name: 'Mert Kaya' },
    ],
  },
  {
    id: 'solace-hotels',
    client: 'Solace Hotels',
    year: 2024,
    disciplines: ['web', 'campaign'],
    cover: {
      variant: 'wave',
      palette: { bg: '#0d2436', ink: '#f2ebe0', accent: '#e8b86b', soft: '#1b3a52' },
    },
    before: { variant: 'stack', palette: muted },
    gallery: [
      {
        variant: 'sun',
        palette: { bg: '#e8b86b', ink: '#0d2436', accent: '#f2ebe0', soft: '#efc98a' },
      },
      {
        variant: 'orbit',
        palette: { bg: '#f2ebe0', ink: '#0d2436', accent: '#e8b86b', soft: '#e0d6c6' },
      },
    ],
    title: {
      en: 'Booking that feels like arriving',
      tr: 'Varmış gibi hissettiren bir rezervasyon',
    },
    summary: {
      en: 'A booking website and seasonal campaign for a group of seaside hotels.',
      tr: 'Bir sahil otelleri grubu için rezervasyon sitesi ve sezon kampanyası.',
    },
    services: [
      { en: 'Website', tr: 'Web sitesi' },
      { en: 'Booking flow', tr: 'Rezervasyon akışı' },
      { en: 'Campaign', tr: 'Kampanya' },
    ],
    challenge: {
      en: 'Guests loved the hotels and hated the booking site. Most reservations went through agencies that took a large commission.',
      tr: 'Misafirler otelleri seviyor, rezervasyon sitesinden nefret ediyordu. Rezervasyonların çoğu yüksek komisyon alan acentelerden geliyordu.',
    },
    approach: {
      en: 'We cut the booking to three calm steps, moved the rooms to the front, and let the tide set the rhythm of the whole site.',
      tr: 'Rezervasyonu üç sakin adıma indirdik, odaları öne çıkardık ve sitenin ritmini gelgite bıraktık.',
    },
    result: {
      en: 'Direct bookings overtook agency bookings in the first summer, which paid for the project within a season.',
      tr: 'İlk yazda doğrudan rezervasyonlar acente rezervasyonlarını geçti; proje kendini bir sezonda amorti etti.',
    },
    metrics: [
      { value: '+74%', label: { en: 'Direct bookings', tr: 'Doğrudan rezervasyon' } },
      { value: '3', label: { en: 'Steps to book', tr: 'Rezervasyon adımı' } },
      { value: '1', label: { en: 'Season to pay back', tr: 'Sezonda geri dönüş' } },
    ],
    quote: {
      text: {
        en: 'Our website finally feels like the lobby.',
        tr: 'Web sitemiz nihayet lobimiz gibi hissettiriyor.',
      },
      author: 'Irene Costa',
      role: { en: 'Commercial Director, Solace Hotels', tr: 'Ticari Direktör, Solace Hotels' },
    },
    credits: [
      { role: { en: 'Creative direction', tr: 'Kreatif direktörlük' }, name: 'Deniz Aksoy' },
      { role: { en: 'Web design', tr: 'Web tasarımı' }, name: 'Jonas Richter' },
      { role: { en: 'Production', tr: 'Prodüksiyon' }, name: 'Selin Oral' },
    ],
  },
  {
    id: 'paper-harbor',
    client: 'Paper Harbor',
    year: 2024,
    disciplines: ['branding', 'motion'],
    cover: {
      variant: 'type',
      glyph: 'P',
      palette: { bg: '#f3eee4', ink: '#1a1a1a', accent: '#ff4f1f', soft: '#e3dccd' },
    },
    before: { variant: 'orbit', palette: muted },
    gallery: [
      {
        variant: 'grid',
        palette: { bg: '#ff4f1f', ink: '#f3eee4', accent: '#1a1a1a', soft: '#ff6f45' },
      },
      {
        variant: 'bars',
        palette: { bg: '#1a1a1a', ink: '#f3eee4', accent: '#ff4f1f', soft: '#333' },
      },
    ],
    title: {
      en: 'An independent press, set in motion',
      tr: 'Harekete geçen bağımsız bir yayınevi',
    },
    summary: {
      en: 'Identity, type system and book trailers for an independent publisher.',
      tr: 'Bağımsız bir yayınevi için kimlik, yazı sistemi ve kitap tanıtım filmleri.',
    },
    services: [
      { en: 'Identity', tr: 'Kimlik' },
      { en: 'Type system', tr: 'Tipografi sistemi' },
      { en: 'Book trailers', tr: 'Kitap tanıtım filmleri' },
    ],
    challenge: {
      en: 'Paper Harbor publishes forty very different books a year. Each cover looked good, but nobody could tell they came from the same house.',
      tr: 'Paper Harbor yılda birbirinden çok farklı kırk kitap yayımlıyor. Her kapak güzeldi ama hiçbiri aynı yayınevinden çıkmış gibi durmuyordu.',
    },
    approach: {
      en: 'We designed a spine first: one bold letterform and a margin rule that every cover follows, leaving the rest free for the book.',
      tr: 'Önce bir sırt tasarladık: her kapağın uyduğu tek bir güçlü harf formu ve bir kenar boşluğu kuralı; geri kalanı kitaba bıraktık.',
    },
    result: {
      en: 'Their shelf in bookshops is now recognisable from across the room, and the trailers became a small series of their own.',
      tr: 'Kitapçılardaki rafları artık odanın öbür ucundan tanınıyor; tanıtım filmleri de başlı başına küçük bir seriye dönüştü.',
    },
    metrics: [
      { value: '40', label: { en: 'Covers a year', tr: 'Yılda kapak' } },
      { value: '1', label: { en: 'Rule to follow', tr: 'Uyulacak kural' } },
      { value: '+28%', label: { en: 'Pre-orders', tr: 'Ön sipariş' } },
    ],
    quote: {
      text: {
        en: 'Our designers got more freedom, not less. The rule does the brand work for them.',
        tr: 'Tasarımcılarımız daha az değil, daha çok özgürlük kazandı. Marka işini kural yapıyor.',
      },
      author: 'Nora Keller',
      role: { en: 'Publisher, Paper Harbor', tr: 'Yayıncı, Paper Harbor' },
    },
    credits: [
      { role: { en: 'Type design', tr: 'Harf tasarımı' }, name: 'Deniz Aksoy' },
      { role: { en: 'Motion', tr: 'Hareket' }, name: 'Lina Vogel' },
      { role: { en: 'Production', tr: 'Prodüksiyon' }, name: 'Selin Oral' },
    ],
  },
  {
    id: 'vela-air',
    client: 'Vela Air',
    year: 2023,
    disciplines: ['product', 'motion'],
    cover: {
      variant: 'petal',
      palette: { bg: '#e9ecff', ink: '#171a4a', accent: '#6f5bff', soft: '#d3d8ff' },
    },
    before: { variant: 'wave', palette: muted },
    gallery: [
      {
        variant: 'orbit',
        palette: { bg: '#171a4a', ink: '#e9ecff', accent: '#6f5bff', soft: '#262a6b' },
      },
      {
        variant: 'stack',
        palette: { bg: '#6f5bff', ink: '#e9ecff', accent: '#171a4a', soft: '#8574ff' },
      },
    ],
    title: { en: 'A calmer way through the airport', tr: 'Havalimanından daha sakin bir geçiş' },
    summary: {
      en: 'Travel app and in-app motion language for a regional airline.',
      tr: 'Bölgesel bir havayolu için seyahat uygulaması ve uygulama içi hareket dili.',
    },
    services: [
      { en: 'Product design', tr: 'Ürün tasarımı' },
      { en: 'Motion language', tr: 'Hareket dili' },
      { en: 'Prototyping', tr: 'Prototipleme' },
    ],
    challenge: {
      en: 'Travellers opened the app at the most stressful moments: at security, at the gate, when a flight moved. It shouted at them in red.',
      tr: 'Yolcular uygulamayı en stresli anlarda açıyordu: güvenlikte, kapıda, uçuş değiştiğinde. Uygulama onlara kırmızıyla bağırıyordu.',
    },
    approach: {
      en: 'We designed around the journey, not the booking, with motion that slows down when something goes wrong and tells you the next step first.',
      tr: 'Tasarımı rezervasyona değil yolculuğa göre kurduk; bir şey ters gittiğinde yavaşlayan ve önce bir sonraki adımı söyleyen bir hareket diliyle.',
    },
    result: {
      en: 'Calls to the service centre during delays fell, and the app became the most-used channel on travel days.',
      tr: 'Rötarlarda çağrı merkezine gelen aramalar azaldı; uygulama yolculuk günlerinde en çok kullanılan kanal oldu.',
    },
    metrics: [
      { value: '−38%', label: { en: 'Delay-day calls', tr: 'Rötar günü aramaları' } },
      { value: '4.7', label: { en: 'App rating', tr: 'Uygulama puanı' } },
      { value: '12', label: { en: 'Motion principles', tr: 'Hareket ilkesi' } },
    ],
    quote: {
      text: {
        en: 'It is the first airline app that lowers your heart rate.',
        tr: 'Kalp atışınızı düşüren ilk havayolu uygulaması.',
      },
      author: 'Samuel Okafor',
      role: { en: 'Head of Digital, Vela Air', tr: 'Dijital Lideri, Vela Air' },
    },
    credits: [
      { role: { en: 'Product design', tr: 'Ürün tasarımı' }, name: 'Jonas Richter' },
      { role: { en: 'Motion', tr: 'Hareket' }, name: 'Lina Vogel' },
      { role: { en: 'Prototyping', tr: 'Prototipleme' }, name: 'Mert Kaya' },
    ],
  },
]

export const clients = [
  'Kora Bank',
  'Orbit Festival',
  'Atlas Museum',
  'Nimbus Roasters',
  'Fern Health',
  'Solace Hotels',
  'Paper Harbor',
  'Vela Air',
  'Lindqvist Furniture',
  'Quarry & Co.',
  'Halden Records',
  'Tessera Tiles',
]

export interface TeamMember {
  name: string
  role: Localized
  city: Localized
  palette: Palette
}

export const team: TeamMember[] = [
  {
    name: 'Deniz Aksoy',
    role: { en: 'Founder, Creative Director', tr: 'Kurucu, Kreatif Direktör' },
    city: { en: 'Istanbul', tr: 'İstanbul' },
    palette: { bg: '#ff4f1f', ink: '#121212', accent: '#f2eee6', soft: '#ff7a55' },
  },
  {
    name: 'Jonas Richter',
    role: { en: 'Design Director', tr: 'Tasarım Direktörü' },
    city: { en: 'Berlin', tr: 'Berlin' },
    palette: { bg: '#2f5bff', ink: '#f2eee6', accent: '#121212', soft: '#5577ff' },
  },
  {
    name: 'Ece Tan',
    role: { en: 'Head of Strategy', tr: 'Strateji Lideri' },
    city: { en: 'Istanbul', tr: 'İstanbul' },
    palette: { bg: '#c6f36b', ink: '#121212', accent: '#0f2a24', soft: '#d6f78f' },
  },
  {
    name: 'Mert Kaya',
    role: { en: 'Technical Director', tr: 'Teknik Direktör' },
    city: { en: 'Istanbul', tr: 'İstanbul' },
    palette: { bg: '#121212', ink: '#f2eee6', accent: '#ff4f1f', soft: '#2a2a2a' },
  },
  {
    name: 'Lina Vogel',
    role: { en: 'Motion Director', tr: 'Hareket Direktörü' },
    city: { en: 'Berlin', tr: 'Berlin' },
    palette: { bg: '#e8b86b', ink: '#121212', accent: '#0d2436', soft: '#efca8f' },
  },
  {
    name: 'Selin Oral',
    role: { en: 'Executive Producer', tr: 'Yapım Direktörü' },
    city: { en: 'Istanbul', tr: 'İstanbul' },
    palette: { bg: '#6f5bff', ink: '#f2eee6', accent: '#121212', soft: '#8a7aff' },
  },
]

export const awards: { year: number; award: string; project: string; honour: Localized }[] = [
  {
    year: 2026,
    award: 'European Design Circle',
    project: 'Kora Bank',
    honour: { en: 'Gold, Identity', tr: 'Altın, Kimlik' },
  },
  {
    year: 2026,
    award: 'Motion Annual',
    project: 'Orbit Festival',
    honour: { en: 'Best Live Visuals', tr: 'En İyi Canlı Görsel' },
  },
  {
    year: 2025,
    award: 'Digital Craft Awards',
    project: 'Atlas Museum',
    honour: { en: 'Site of the Year', tr: 'Yılın Sitesi' },
  },
  {
    year: 2025,
    award: 'Pack & Shelf',
    project: 'Nimbus Roasters',
    honour: { en: 'Silver, Packaging', tr: 'Gümüş, Ambalaj' },
  },
  {
    year: 2024,
    award: 'Istanbul Design Week',
    project: 'Paper Harbor',
    honour: { en: 'Grand Prix', tr: 'Büyük Ödül' },
  },
]

export const studios = [
  {
    city: { en: 'Istanbul', tr: 'İstanbul' },
    address: 'Kemankeş Karamustafa Paşa Mh., Karaköy, 34425 Beyoğlu',
    phone: '+90 212 555 01 40',
    hours: { en: 'GMT+3 · Mon–Fri, 9:30–18:30', tr: 'GMT+3 · Pzt–Cum, 09.30–18.30' },
  },
  {
    city: { en: 'Berlin', tr: 'Berlin' },
    address: 'Lohmühlenstraße 65, 12435 Berlin',
    phone: '+49 30 5550 1840',
    hours: { en: 'GMT+1 · Mon–Fri, 9:00–18:00', tr: 'GMT+1 · Pzt–Cum, 09.00–18.00' },
  },
]

export const agencyEmail = 'hello@oda-studio.example'
