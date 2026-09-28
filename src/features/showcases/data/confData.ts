import type { Language } from '@/store/preferences-store'

/** Text in both languages. */
export type Localized = Record<Language, string>

export type ConfTrack = 'engineering' | 'design' | 'product' | 'ai'
export type ConfLevel = 'beginner' | 'intermediate' | 'advanced'
export type ConfFormat = 'keynote' | 'talk' | 'workshop' | 'panel' | 'break'
export type ConfHallId = 'main' | 'hallB' | 'studio' | 'lab'

export const CONF_TRACKS: ConfTrack[] = ['engineering', 'design', 'product', 'ai']
export const CONF_LEVELS: ConfLevel[] = ['beginner', 'intermediate', 'advanced']
/** The formats a visitor filters by; a break is never filtered out. */
export const CONF_FORMATS: Exclude<ConfFormat, 'break'>[] = ['keynote', 'talk', 'workshop', 'panel']

export interface ConfDay {
  index: number
  /** The calendar date in Istanbul. */
  date: string
  halls: ConfHallId[]
}

export interface ConfSession {
  id: string
  day: number
  /** `all` spans every hall: a keynote, a meal, the doors opening. */
  hall: ConfHallId | 'all'
  /** Istanbul wall-clock time, `HH:mm`. */
  start: string
  end: string
  format: ConfFormat
  track?: ConfTrack
  level?: ConfLevel
  speakerIds: string[]
  title: Localized
  abstract?: Localized
}

export interface ConfSpeaker {
  id: string
  name: string
  role: Localized
  company: string
  city: string
  track: ConfTrack
  /** Two colours for the initials avatar; there are no photos of invented people. */
  colors: [string, string]
  handle: string
  bio: Localized
}

export interface ConfSponsor {
  name: string
  tier: 'platinum' | 'gold' | 'silver' | 'community'
}

export const CONF_NAME = 'Relay Summit 2026'

/** Istanbul keeps GMT+3 all year, so a fixed offset turns its wall clock into an instant. */
export const ISTANBUL_OFFSET_MINUTES = 180

export const CONF_DAYS: ConfDay[] = [
  { index: 0, date: '2026-11-18', halls: ['lab', 'studio', 'hallB'] },
  { index: 1, date: '2026-11-19', halls: ['main', 'hallB', 'studio'] },
  { index: 2, date: '2026-11-20', halls: ['main', 'hallB', 'studio'] },
]

export const CONF_HALLS: Record<ConfHallId, Localized> = {
  main: { en: 'Main Stage', tr: 'Ana Sahne' },
  hallB: { en: 'Hall B', tr: 'B Salonu' },
  studio: { en: 'Studio', tr: 'Stüdyo' },
  lab: { en: 'Workshop Lab', tr: 'Atölye' },
}

export const CONF_TRACK_COLORS: Record<ConfTrack, string> = {
  engineering: '#2f6fed',
  design: '#d63384',
  product: '#c77700',
  ai: '#0f9488',
}

export const confSpeakers: ConfSpeaker[] = [
  {
    id: 'elif-sancak',
    name: 'Elif Sancak',
    role: { en: 'Principal Engineer', tr: 'Baş Mühendis' },
    company: 'Tessera Cloud',
    city: 'İstanbul',
    track: 'engineering',
    colors: ['#2f6fed', '#7b5cff'],
    handle: 'elifsancak',
    bio: {
      en: 'Elif leads the rendering platform at Tessera Cloud, where she moved forty product teams to server components without a feature freeze. She writes about the parts of React nobody puts on slides.',
      tr: 'Elif, Tessera Cloud’da render platformunu yönetiyor; kırk ürün ekibini özellik dondurmadan server component’lere taşıdı. React’in slaytlara girmeyen taraflarını yazıyor.',
    },
  },
  {
    id: 'marco-bellini',
    name: 'Marco Bellini',
    role: { en: 'Design Systems Lead', tr: 'Tasarım Sistemleri Lideri' },
    company: 'Northwind Studio',
    city: 'Milan',
    track: 'design',
    colors: ['#d63384', '#ff8a5b'],
    handle: 'marcobellini',
    bio: {
      en: 'Marco has built design systems for a bank, a fashion house and a public broadcaster. He believes a token is only as good as the argument it ends.',
      tr: 'Marco bir banka, bir moda evi ve bir kamu yayıncısı için tasarım sistemi kurdu. Bir token’ın değerinin, bitirdiği tartışma kadar olduğuna inanıyor.',
    },
  },
  {
    id: 'ayse-korkmaz',
    name: 'Ayşe Korkmaz',
    role: { en: 'VP of Product', tr: 'Ürün Başkan Yardımcısı' },
    company: 'Kuzey Pay',
    city: 'İstanbul',
    track: 'product',
    colors: ['#c77700', '#f2b705'],
    handle: 'aysekorkmaz',
    bio: {
      en: 'Ayşe grew Kuzey Pay from a checkout button to a wallet used by eleven million people. Before product, she was a front-end engineer for eight years.',
      tr: 'Ayşe, Kuzey Pay’i bir ödeme butonundan on bir milyon kişinin kullandığı bir cüzdana büyüttü. Ürüne geçmeden önce sekiz yıl front-end mühendisiydi.',
    },
  },
  {
    id: 'jonas-weber',
    name: 'Jonas Weber',
    role: { en: 'Staff Engineer', tr: 'Kıdemli Mühendis' },
    company: 'Lumen Labs',
    city: 'Berlin',
    track: 'engineering',
    colors: ['#1d4ed8', '#22c55e'],
    handle: 'jonasweber',
    bio: {
      en: 'Jonas works on streaming rendering and edge runtimes, and maintains two open-source routers. He likes demos that could fail on stage.',
      tr: 'Jonas streaming render ve edge çalışma ortamları üzerinde çalışıyor, iki açık kaynak router’ın bakımını yapıyor. Sahnede bozulabilecek demoları seviyor.',
    },
  },
  {
    id: 'deniz-aydin',
    name: 'Deniz Aydın',
    role: { en: 'AI Engineer', tr: 'Yapay Zekâ Mühendisi' },
    company: 'Orbit Health',
    city: 'Ankara',
    track: 'ai',
    colors: ['#0f9488', '#38bdf8'],
    handle: 'denizaydin',
    bio: {
      en: 'Deniz builds the assistant that helps Orbit Health’s nurses write shift notes. Her team measures trust before it measures speed.',
      tr: 'Deniz, Orbit Health hemşirelerinin vardiya notlarını yazmasına yardım eden asistanı geliştiriyor. Ekibi hızdan önce güveni ölçüyor.',
    },
  },
  {
    id: 'priya-raman',
    name: 'Priya Raman',
    role: { en: 'Accessibility Specialist', tr: 'Erişilebilirlik Uzmanı' },
    company: 'Fieldwork',
    city: 'London',
    track: 'design',
    colors: ['#9333ea', '#ec4899'],
    handle: 'priyaraman',
    bio: {
      en: 'Priya audits public services and teaches teams to test with a screen reader in their first week. She has never met a focus ring she did not want to make bigger.',
      tr: 'Priya kamu hizmetlerini denetliyor ve ekiplere ilk haftalarında ekran okuyucuyla test etmeyi öğretiyor. Büyütmek istemediği bir odak halkası görmedi.',
    },
  },
  {
    id: 'kerem-yildiz',
    name: 'Kerem Yıldız',
    role: { en: 'Frontend Architect', tr: 'Frontend Mimarı' },
    company: 'Çarşı',
    city: 'İstanbul',
    track: 'engineering',
    colors: ['#0ea5e9', '#6366f1'],
    handle: 'keremyildiz',
    bio: {
      en: 'Kerem led the migration of Çarşı’s two-million-line storefront to a modern stack while it kept taking orders. He is fond of boring architecture.',
      tr: 'Kerem, Çarşı’nın iki milyon satırlık vitrinini sipariş almaya devam ederken modern bir yapıya taşıyan ekibi yönetti. Sıkıcı mimariyi seviyor.',
    },
  },
  {
    id: 'sofia-lindqvist',
    name: 'Sofia Lindqvist',
    role: { en: 'Head of Design', tr: 'Tasarım Direktörü' },
    company: 'Nordvik',
    city: 'Stockholm',
    track: 'design',
    colors: ['#e11d48', '#f97316'],
    handle: 'sofialindqvist',
    bio: {
      en: 'Sofia runs a design team of thirty across four countries. Her work on calm, quiet interfaces has been taught in three design schools.',
      tr: 'Sofia dört ülkeye yayılmış otuz kişilik bir tasarım ekibini yönetiyor. Sakin ve sessiz arayüzler üzerine çalışmaları üç tasarım okulunda okutuluyor.',
    },
  },
  {
    id: 'emre-tas',
    name: 'Emre Taş',
    role: { en: 'CTO', tr: 'CTO' },
    company: 'Rota Mobility',
    city: 'İzmir',
    track: 'engineering',
    colors: ['#14b8a6', '#3b82f6'],
    handle: 'emretas',
    bio: {
      en: 'Emre’s team builds the apps that run a city’s buses, including on the stretches with no signal. He started programming on a borrowed laptop at sixteen.',
      tr: 'Emre’nin ekibi bir şehrin otobüslerini çalıştıran uygulamaları, çekmeyen bölgeler dahil geliştiriyor. On altı yaşında ödünç bir dizüstüyle programlamaya başladı.',
    },
  },
  {
    id: 'hannah-okafor',
    name: 'Hannah Okafor',
    role: { en: 'Product Director', tr: 'Ürün Direktörü' },
    company: 'Loopline',
    city: 'Lagos',
    track: 'product',
    colors: ['#f59e0b', '#ef4444'],
    handle: 'hannahokafor',
    bio: {
      en: 'Hannah has run product discovery for marketplaces in three continents. Her rule: if an interview did not change a plan, it was a meeting.',
      tr: 'Hannah üç kıtada pazar yerleri için ürün keşfi yürüttü. Kuralı şu: bir görüşme planı değiştirmediyse, o bir toplantıydı.',
    },
  },
  {
    id: 'can-ozturk',
    name: 'Can Öztürk',
    role: { en: 'Machine Learning Engineer', tr: 'Makine Öğrenmesi Mühendisi' },
    company: 'Veri Atölyesi',
    city: 'İstanbul',
    track: 'ai',
    colors: ['#059669', '#84cc16'],
    handle: 'canozturk',
    bio: {
      en: 'Can builds search and evaluation tooling for teams shipping language models. He treats every prompt as code that needs a test.',
      tr: 'Can dil modeli geliştiren ekipler için arama ve değerlendirme araçları yapıyor. Her prompt’a test isteyen bir kod gibi davranıyor.',
    },
  },
  {
    id: 'lea-moreau',
    name: 'Léa Moreau',
    role: { en: 'Performance Engineer', tr: 'Performans Mühendisi' },
    company: 'Parcel & Co',
    city: 'Lyon',
    track: 'engineering',
    colors: ['#7c3aed', '#2563eb'],
    handle: 'leamoreau',
    bio: {
      en: 'Léa cut Parcel & Co’s checkout time in half on low-end phones. She keeps a drawer of cheap Android devices for testing.',
      tr: 'Léa, Parcel & Co’nun ödeme süresini düşük donanımlı telefonlarda yarıya indirdi. Test için ucuz Android telefonlarla dolu bir çekmecesi var.',
    },
  },
  {
    id: 'zeynep-arslan',
    name: 'Zeynep Arslan',
    role: { en: 'UX Researcher', tr: 'UX Araştırmacısı' },
    company: 'Poyraz Bank',
    city: 'İstanbul',
    track: 'design',
    colors: ['#db2777', '#a855f7'],
    handle: 'zeyneparslan',
    bio: {
      en: 'Zeynep has run more than three hundred usability sessions for a bank’s mobile app, many of them with first-time smartphone users.',
      tr: 'Zeynep bir bankanın mobil uygulaması için, çoğu ilk kez akıllı telefon kullananlarla olmak üzere üç yüzden fazla kullanılabilirlik testi yaptı.',
    },
  },
  {
    id: 'tomas-novak',
    name: 'Tomáš Novák',
    role: { en: 'Developer Advocate', tr: 'Geliştirici Savunucusu' },
    company: 'Stackyard',
    city: 'Prague',
    track: 'engineering',
    colors: ['#0891b2', '#4f46e5'],
    handle: 'tomasnovak',
    bio: {
      en: 'Tomáš writes about the web platform and type-safe APIs, and hosts a podcast about small tools with big consequences.',
      tr: 'Tomáš web platformu ve tip güvenli API’ler üzerine yazıyor; büyük sonuçları olan küçük araçlar hakkında bir podcast sunuyor.',
    },
  },
  {
    id: 'selin-demir',
    name: 'Selin Demir',
    role: { en: 'Senior Product Designer', tr: 'Kıdemli Ürün Tasarımcısı' },
    company: 'Yolcu',
    city: 'İstanbul',
    track: 'product',
    colors: ['#ea580c', '#db2777'],
    handle: 'selindemir',
    bio: {
      en: 'Selin designs pricing, onboarding and the other screens that decide whether a product earns money. She reads support tickets every Friday.',
      tr: 'Selin fiyatlandırmayı, onboarding’i ve bir ürünün para kazanıp kazanmayacağına karar veren diğer ekranları tasarlıyor. Her cuma destek taleplerini okuyor.',
    },
  },
  {
    id: 'omar-haddad',
    name: 'Omar Haddad',
    role: { en: 'AI Product Lead', tr: 'Yapay Zekâ Ürün Lideri' },
    company: 'Quill',
    city: 'Dubai',
    track: 'ai',
    colors: ['#0d9488', '#6366f1'],
    handle: 'omarhaddad',
    bio: {
      en: 'Omar leads the writing assistant at Quill, used by half a million people a week. He is more interested in the second use than the first.',
      tr: 'Omar, haftada yarım milyon kişinin kullandığı Quill yazma asistanını yönetiyor. İlk kullanımdan çok ikincisiyle ilgileniyor.',
    },
  },
]

const t = (en: string, tr: string): Localized => ({ en, tr })

export const confSessions: ConfSession[] = [
  // Day 0: workshops
  {
    id: 'd0-registration',
    day: 0,
    hall: 'all',
    start: '08:30',
    end: '09:30',
    format: 'break',
    speakerIds: [],
    title: t('Registration and coffee', 'Kayıt ve kahve'),
  },
  {
    id: 'd0-streaming-ssr',
    day: 0,
    hall: 'lab',
    start: '09:30',
    end: '12:30',
    format: 'workshop',
    track: 'engineering',
    level: 'advanced',
    speakerIds: ['jonas-weber'],
    title: t('Build a streaming SSR app from scratch', 'Sıfırdan streaming SSR uygulaması'),
    abstract: t(
      'Write a small server renderer that streams HTML, then add suspense boundaries and see what each one costs.',
      'HTML’i akış hâlinde gönderen küçük bir sunucu render’ı yazın, sonra suspense sınırları ekleyip her birinin maliyetini görün.',
    ),
  },
  {
    id: 'd0-design-tokens',
    day: 0,
    hall: 'studio',
    start: '09:30',
    end: '12:30',
    format: 'workshop',
    track: 'design',
    level: 'intermediate',
    speakerIds: ['marco-bellini'],
    title: t(
      'Design tokens that survive a rebrand',
      'Yeniden markalaşmaya dayanan tasarım token’ları',
    ),
    abstract: t(
      'Name, layer and ship tokens so a new brand colour is a one-line change instead of a quarter-long project.',
      'Token’ları öyle adlandırın ve katmanlayın ki yeni bir marka rengi, bir çeyrek süren proje yerine tek satırlık bir değişiklik olsun.',
    ),
  },
  {
    id: 'd0-llm-feature',
    day: 0,
    hall: 'hallB',
    start: '09:30',
    end: '12:30',
    format: 'workshop',
    track: 'ai',
    level: 'intermediate',
    speakerIds: ['deniz-aydin'],
    title: t('Ship an LLM feature users trust', 'Kullanıcının güvendiği bir LLM özelliği'),
    abstract: t(
      'From prompt to evaluation set to the interface that shows its sources: build one feature end to end.',
      'Prompt’tan değerlendirme setine, kaynaklarını gösteren arayüze kadar tek bir özelliği baştan sona geliştirin.',
    ),
  },
  {
    id: 'd0-lunch',
    day: 0,
    hall: 'all',
    start: '12:30',
    end: '13:30',
    format: 'break',
    speakerIds: [],
    title: t('Lunch', 'Öğle yemeği'),
  },
  {
    id: 'd0-profiling',
    day: 0,
    hall: 'lab',
    start: '13:30',
    end: '16:30',
    format: 'workshop',
    track: 'engineering',
    level: 'intermediate',
    speakerIds: ['lea-moreau'],
    title: t('Performance profiling, hands on', 'Uygulamalı performans profilleme'),
    abstract: t(
      'Bring a slow page. Leave with a trace you can read, three fixes and a budget that keeps them fixed.',
      'Yavaş bir sayfa getirin. Okuyabildiğiniz bir trace, üç düzeltme ve onları öyle tutan bir bütçeyle ayrılın.',
    ),
  },
  {
    id: 'd0-a11y-audit',
    day: 0,
    hall: 'studio',
    start: '13:30',
    end: '16:30',
    format: 'workshop',
    track: 'design',
    level: 'beginner',
    speakerIds: ['priya-raman'],
    title: t(
      'An accessibility audit in an afternoon',
      'Bir öğleden sonrada erişilebilirlik denetimi',
    ),
    abstract: t(
      'Keyboard, screen reader, zoom and contrast: audit a real product together and write findings a team will act on.',
      'Klavye, ekran okuyucu, yakınlaştırma ve kontrast: gerçek bir ürünü birlikte denetleyin, ekibin uygulayacağı bulgular yazın.',
    ),
  },
  {
    id: 'd0-discovery',
    day: 0,
    hall: 'hallB',
    start: '13:30',
    end: '15:30',
    format: 'workshop',
    track: 'product',
    level: 'beginner',
    speakerIds: ['hannah-okafor'],
    title: t(
      'Discovery interviews that change the roadmap',
      'Yol haritasını değiştiren keşif görüşmeleri',
    ),
    abstract: t(
      'Practise interviews in pairs, then turn the notes into a decision rather than a slide.',
      'Çiftler hâlinde görüşme pratiği yapın, sonra notları bir slayta değil bir karara dönüştürün.',
    ),
  },
  {
    id: 'd0-welcome',
    day: 0,
    hall: 'all',
    start: '17:00',
    end: '19:00',
    format: 'break',
    speakerIds: [],
    title: t('Welcome drinks on the terrace', 'Terasta karşılama'),
  },

  // Day 1
  {
    id: 'd1-doors',
    day: 1,
    hall: 'all',
    start: '08:30',
    end: '09:15',
    format: 'break',
    speakerIds: [],
    title: t('Doors open and breakfast', 'Kapılar açılıyor, kahvaltı'),
  },
  {
    id: 'd1-opening-keynote',
    day: 1,
    hall: 'all',
    start: '09:15',
    end: '10:00',
    format: 'keynote',
    track: 'product',
    level: 'beginner',
    speakerIds: ['ayse-korkmaz'],
    title: t(
      'Opening keynote: The product is the interface',
      'Açılış konuşması: Ürün, arayüzün ta kendisi',
    ),
    abstract: t(
      'Why the teams that ship the best products treat the front end as strategy, not as the last step.',
      'En iyi ürünleri çıkaran ekipler neden front end’i son adım değil strateji olarak görüyor?',
    ),
  },
  {
    id: 'd1-rsc',
    day: 1,
    hall: 'main',
    start: '10:15',
    end: '10:55',
    format: 'talk',
    track: 'engineering',
    level: 'intermediate',
    speakerIds: ['elif-sancak'],
    title: t(
      'React Server Components after the hype',
      'Heyecan geçtikten sonra React Server Components',
    ),
    abstract: t(
      'Two years, forty teams, one platform: what got faster, what got harder and what we would do again.',
      'İki yıl, kırk ekip, tek platform: neler hızlandı, neler zorlaştı ve neyi yine yapardık.',
    ),
  },
  {
    id: 'd1-calm-software',
    day: 1,
    hall: 'hallB',
    start: '10:15',
    end: '10:55',
    format: 'talk',
    track: 'design',
    level: 'beginner',
    speakerIds: ['sofia-lindqvist'],
    title: t('Designing calm software', 'Sakin yazılım tasarlamak'),
    abstract: t(
      'Notifications, badges and red dots compete for attention. Here is how to design a product that gives some back.',
      'Bildirimler, rozetler ve kırmızı noktalar dikkat için yarışıyor. Kullanıcıya dikkatini geri veren bir ürün nasıl tasarlanır?',
    ),
  },
  {
    id: 'd1-browser-apis',
    day: 1,
    hall: 'studio',
    start: '10:15',
    end: '10:35',
    format: 'talk',
    track: 'engineering',
    level: 'beginner',
    speakerIds: ['tomas-novak'],
    title: t(
      'Lightning: Five browser APIs you are not using',
      'Kısa sunum: Kullanmadığınız beş tarayıcı API’si',
    ),
    abstract: t(
      'Popover, view transitions, the scheduler and two more, each in four minutes.',
      'Popover, view transitions, scheduler ve iki tane daha; her biri dört dakikada.',
    ),
  },
  {
    id: 'd1-embeddings',
    day: 1,
    hall: 'studio',
    start: '10:35',
    end: '10:55',
    format: 'talk',
    track: 'ai',
    level: 'beginner',
    speakerIds: ['can-ozturk'],
    title: t('Lightning: Embeddings in ten minutes', 'Kısa sunum: On dakikada embedding'),
    abstract: t(
      'What a vector is, why search got better and where it still fails.',
      'Vektör nedir, arama neden iyileşti ve hâlâ nerede yanılıyor?',
    ),
  },
  {
    id: 'd1-migration',
    day: 1,
    hall: 'main',
    start: '11:10',
    end: '11:50',
    format: 'talk',
    track: 'engineering',
    level: 'advanced',
    speakerIds: ['kerem-yildiz'],
    title: t('Migrating a two-million-line frontend', 'İki milyon satırlık bir frontend’i taşımak'),
    abstract: t(
      'Strangler patterns, codemods and the spreadsheet that kept three hundred engineers moving in one direction.',
      'Strangler desenleri, codemod’lar ve üç yüz mühendisi aynı yöne yürüten o tablo.',
    ),
  },
  {
    id: 'd1-usability',
    day: 1,
    hall: 'hallB',
    start: '11:10',
    end: '11:50',
    format: 'talk',
    track: 'design',
    level: 'intermediate',
    speakerIds: ['zeynep-arslan'],
    title: t('What 300 usability tests taught us', '300 kullanılabilirlik testinin öğrettikleri'),
    abstract: t(
      'Patterns from a bank’s app, tested with first-time smartphone users in six cities.',
      'Altı şehirde, ilk kez akıllı telefon kullananlarla test edilmiş bir banka uygulamasından çıkan desenler.',
    ),
  },
  {
    id: 'd1-ai-return',
    day: 1,
    hall: 'studio',
    start: '11:10',
    end: '11:50',
    format: 'talk',
    track: 'ai',
    level: 'intermediate',
    speakerIds: ['omar-haddad'],
    title: t(
      'Designing AI features people come back to',
      'İnsanların geri döndüğü yapay zekâ özellikleri',
    ),
    abstract: t(
      'The first use is a demo. What we changed to make the second, tenth and hundredth use worth it.',
      'İlk kullanım bir demodur. İkinci, onuncu ve yüzüncü kullanımı değerli kılmak için neleri değiştirdik?',
    ),
  },
  {
    id: 'd1-lunch',
    day: 1,
    hall: 'all',
    start: '12:00',
    end: '13:15',
    format: 'break',
    speakerIds: [],
    title: t('Lunch', 'Öğle yemeği'),
  },
  {
    id: 'd1-offline',
    day: 1,
    hall: 'main',
    start: '13:15',
    end: '13:55',
    format: 'talk',
    track: 'engineering',
    level: 'advanced',
    speakerIds: ['emre-tas'],
    title: t('Offline-first for a city’s buses', 'Bir şehrin otobüsleri için offline-first'),
    abstract: t(
      'Sync, conflicts and the tunnel under the river: building apps that work where the signal does not.',
      'Senkronizasyon, çakışmalar ve nehrin altındaki tünel: çekmeyen yerde çalışan uygulamalar yapmak.',
    ),
  },
  {
    id: 'd1-pricing-page',
    day: 1,
    hall: 'hallB',
    start: '13:15',
    end: '13:55',
    format: 'talk',
    track: 'product',
    level: 'intermediate',
    speakerIds: ['selin-demir'],
    title: t('The pricing page is a product', 'Fiyat sayfası da bir üründür'),
    abstract: t(
      'Eleven experiments on one page, and the three that paid for the rest.',
      'Tek bir sayfada on bir deney ve geri kalanların masrafını çıkaran üçü.',
    ),
  },
  {
    id: 'd1-ds-clinic',
    day: 1,
    hall: 'studio',
    start: '13:15',
    end: '14:45',
    format: 'workshop',
    track: 'design',
    level: 'intermediate',
    speakerIds: ['marco-bellini', 'priya-raman'],
    title: t('Design systems clinic', 'Tasarım sistemi kliniği'),
    abstract: t(
      'Bring the component your team argues about most. Marco and Priya will take it apart with you.',
      'Ekibinizin en çok tartıştığı bileşeni getirin; Marco ve Priya onu sizinle birlikte söküp yeniden kuracak.',
    ),
  },
  {
    id: 'd1-milliseconds',
    day: 1,
    hall: 'main',
    start: '14:05',
    end: '14:45',
    format: 'talk',
    track: 'engineering',
    level: 'intermediate',
    speakerIds: ['lea-moreau'],
    title: t('Every millisecond is a decision', 'Her milisaniye bir karardır'),
    abstract: t(
      'Performance budgets that product managers defend, and the dashboard that made it happen.',
      'Ürün yöneticilerinin savunduğu performans bütçeleri ve bunu mümkün kılan pano.',
    ),
  },
  {
    id: 'd1-braver-metrics',
    day: 1,
    hall: 'hallB',
    start: '14:05',
    end: '14:45',
    format: 'talk',
    track: 'product',
    level: 'intermediate',
    speakerIds: ['hannah-okafor'],
    title: t('Metrics that make teams braver', 'Ekipleri cesurlaştıran metrikler'),
    abstract: t(
      'Choosing numbers that reward learning instead of punishing failed bets.',
      'Başarısız denemeleri cezalandırmak yerine öğrenmeyi ödüllendiren sayıları seçmek.',
    ),
  },
  {
    id: 'd1-coffee',
    day: 1,
    hall: 'all',
    start: '14:45',
    end: '15:15',
    format: 'break',
    speakerIds: [],
    title: t('Coffee break', 'Kahve arası'),
  },
  {
    id: 'd1-ai-panel',
    day: 1,
    hall: 'main',
    start: '15:15',
    end: '16:15',
    format: 'panel',
    track: 'ai',
    level: 'intermediate',
    speakerIds: ['deniz-aydin', 'omar-haddad', 'can-ozturk', 'ayse-korkmaz'],
    title: t(
      'Panel: Who is accountable when the model is wrong?',
      'Panel: Model yanıldığında sorumlu kim?',
    ),
    abstract: t(
      'Engineers, a product lead and a VP on where responsibility sits when an AI feature fails a user.',
      'Mühendisler, bir ürün lideri ve bir başkan yardımcısı, yapay zekâ özelliği kullanıcıyı yarı yolda bıraktığında sorumluluğun nerede olduğunu tartışıyor.',
    ),
  },
  {
    id: 'd1-accessible-default',
    day: 1,
    hall: 'hallB',
    start: '15:15',
    end: '15:55',
    format: 'talk',
    track: 'design',
    level: 'intermediate',
    speakerIds: ['priya-raman'],
    title: t(
      'Accessible by default, not by audit',
      'Denetimle değil, varsayılan olarak erişilebilir',
    ),
    abstract: t(
      'Moving accessibility from a pre-launch checklist into the components themselves.',
      'Erişilebilirliği yayın öncesi kontrol listesinden bileşenlerin içine taşımak.',
    ),
  },
  {
    id: 'd1-edge',
    day: 1,
    hall: 'studio',
    start: '15:15',
    end: '15:55',
    format: 'talk',
    track: 'engineering',
    level: 'advanced',
    speakerIds: ['jonas-weber'],
    title: t('Edge rendering without the magic', 'Sihirsiz edge render'),
    abstract: t(
      'What actually runs where, what it costs and when a plain server is the better answer.',
      'Gerçekte ne nerede çalışıyor, maliyeti ne ve ne zaman sade bir sunucu daha iyi bir cevap?',
    ),
  },
  {
    id: 'd1-closing-keynote',
    day: 1,
    hall: 'all',
    start: '16:30',
    end: '17:15',
    format: 'keynote',
    track: 'engineering',
    level: 'beginner',
    speakerIds: ['elif-sancak'],
    title: t('Keynote: The web is still the platform', 'Konuşma: Platform hâlâ web'),
    abstract: t(
      'A tour of what the browser can do today that needed a framework five years ago.',
      'Beş yıl önce framework gerektiren ve bugün tarayıcının kendi başına yapabildiği şeylerde bir tur.',
    ),
  },

  // Day 2
  {
    id: 'd2-doors',
    day: 2,
    hall: 'all',
    start: '08:30',
    end: '09:15',
    format: 'break',
    speakerIds: [],
    title: t('Doors open and breakfast', 'Kapılar açılıyor, kahvaltı'),
  },
  {
    id: 'd2-opening-keynote',
    day: 2,
    hall: 'all',
    start: '09:15',
    end: '10:00',
    format: 'keynote',
    track: 'design',
    level: 'beginner',
    speakerIds: ['sofia-lindqvist'],
    title: t('Keynote: Taste is a team sport', 'Konuşma: Zevk bir takım sporudur'),
    abstract: t(
      'How a team, not one person, learns to tell good from nearly good.',
      'Tek bir kişinin değil, bir ekibin iyiyi neredeyse iyiden ayırmayı nasıl öğrendiği.',
    ),
  },
  {
    id: 'd2-llm-evals',
    day: 2,
    hall: 'main',
    start: '10:15',
    end: '10:55',
    format: 'talk',
    track: 'ai',
    level: 'advanced',
    speakerIds: ['can-ozturk'],
    title: t(
      'Evaluate LLM output like a test suite',
      'LLM çıktısını bir test paketi gibi değerlendirmek',
    ),
    abstract: t(
      'Golden sets, graders and the CI job that stops a prompt change from breaking production.',
      'Altın setler, puanlayıcılar ve bir prompt değişikliğinin canlıyı bozmasını engelleyen CI işi.',
    ),
  },
  {
    id: 'd2-outcomes',
    day: 2,
    hall: 'hallB',
    start: '10:15',
    end: '10:55',
    format: 'talk',
    track: 'product',
    level: 'intermediate',
    speakerIds: ['ayse-korkmaz'],
    title: t('From feature factory to outcomes', 'Özellik fabrikasından sonuçlara'),
    abstract: t(
      'The quarter we shipped nothing new, and why it was our best one.',
      'Hiç yeni özellik çıkarmadığımız çeyrek ve neden en iyimiz olduğu.',
    ),
  },
  {
    id: 'd2-shoestring',
    day: 2,
    hall: 'studio',
    start: '10:15',
    end: '10:55',
    format: 'talk',
    track: 'design',
    level: 'beginner',
    speakerIds: ['zeynep-arslan'],
    title: t('Research on a shoestring', 'Kısıtlı bütçeyle araştırma'),
    abstract: t(
      'Recruiting, consent and synthesis for teams without a research budget.',
      'Araştırma bütçesi olmayan ekipler için katılımcı bulma, onam ve sentez.',
    ),
  },
  {
    id: 'd2-typesafe',
    day: 2,
    hall: 'main',
    start: '11:10',
    end: '11:50',
    format: 'talk',
    track: 'engineering',
    level: 'intermediate',
    speakerIds: ['tomas-novak'],
    title: t('Type-safe from database to button', 'Veritabanından butona tip güvenliği'),
    abstract: t(
      'One schema, generated clients and the errors that now fail the build instead of the user.',
      'Tek şema, üretilen istemciler ve artık kullanıcıyı değil build’i bozan hatalar.',
    ),
  },
  {
    id: 'd2-motion',
    day: 2,
    hall: 'hallB',
    start: '11:10',
    end: '11:50',
    format: 'talk',
    track: 'design',
    level: 'intermediate',
    speakerIds: ['marco-bellini'],
    title: t('Motion with meaning', 'Anlamı olan hareket'),
    abstract: t(
      'Animation as information: when it helps people follow a change and when it only slows them down.',
      'Bilgi olarak animasyon: ne zaman bir değişikliği izlemeye yardım eder, ne zaman sadece yavaşlatır?',
    ),
  },
  {
    id: 'd2-prompting',
    day: 2,
    hall: 'studio',
    start: '11:10',
    end: '11:50',
    format: 'talk',
    track: 'ai',
    level: 'beginner',
    speakerIds: ['omar-haddad'],
    title: t('Prompting is product writing', 'Prompt yazmak ürün yazımıdır'),
    abstract: t(
      'Why the best prompts on our team are written by the people who write our onboarding.',
      'Ekibimizdeki en iyi prompt’ları neden onboarding metinlerini yazanlar yazıyor?',
    ),
  },
  {
    id: 'd2-lunch',
    day: 2,
    hall: 'all',
    start: '12:00',
    end: '13:15',
    format: 'break',
    speakerIds: [],
    title: t('Lunch', 'Öğle yemeği'),
  },
  {
    id: 'd2-turkiye-panel',
    day: 2,
    hall: 'main',
    start: '13:15',
    end: '14:15',
    format: 'panel',
    track: 'product',
    level: 'beginner',
    speakerIds: ['emre-tas', 'selin-demir', 'kerem-yildiz', 'hannah-okafor'],
    title: t(
      'Panel: Building in Türkiye for the world',
      'Panel: Türkiye’den dünyaya ürün geliştirmek',
    ),
    abstract: t(
      'Hiring, payments, time zones and the advantages nobody mentions.',
      'İşe alım, ödemeler, saat dilimleri ve kimsenin bahsetmediği avantajlar.',
    ),
  },
  {
    id: 'd2-testing',
    day: 2,
    hall: 'hallB',
    start: '13:15',
    end: '13:55',
    format: 'talk',
    track: 'engineering',
    level: 'intermediate',
    speakerIds: ['jonas-weber'],
    title: t('Test the parts users touch', 'Kullanıcının dokunduğu yerleri test edin'),
    abstract: t(
      'Fewer mocks, more real browsers, and a suite the team trusts enough to deploy on Friday.',
      'Daha az mock, daha çok gerçek tarayıcı ve cuma günü deploy edecek kadar güvenilen bir test paketi.',
    ),
  },
  {
    id: 'd2-focus-rings',
    day: 2,
    hall: 'studio',
    start: '13:15',
    end: '13:35',
    format: 'talk',
    track: 'design',
    level: 'beginner',
    speakerIds: ['priya-raman'],
    title: t('Lightning: Focus rings are beautiful', 'Kısa sunum: Odak halkaları güzeldir'),
    abstract: t(
      'Six products that made keyboard focus part of the brand.',
      'Klavye odağını markasının bir parçası yapan altı ürün.',
    ),
  },
  {
    id: 'd2-streaming-ui',
    day: 2,
    hall: 'studio',
    start: '13:35',
    end: '13:55',
    format: 'talk',
    track: 'ai',
    level: 'intermediate',
    speakerIds: ['deniz-aydin'],
    title: t(
      'Lightning: Streaming UI for AI answers',
      'Kısa sunum: Yapay zekâ yanıtları için akan arayüz',
    ),
    abstract: t(
      'Tokens arrive one at a time; layout should not jump with each one.',
      'Token’lar teker teker gelir; düzen her birinde zıplamamalı.',
    ),
  },
  {
    id: 'd2-onboarding',
    day: 2,
    hall: 'hallB',
    start: '14:05',
    end: '14:45',
    format: 'talk',
    track: 'product',
    level: 'beginner',
    speakerIds: ['selin-demir'],
    title: t('Onboarding that does not feel like homework', 'Ödev gibi hissettirmeyen onboarding'),
    abstract: t(
      'Cutting a nine-step setup to two, and what we learned about the seven we removed.',
      'Dokuz adımlık kurulumu ikiye indirmek ve çıkardığımız yedisinden öğrendiklerimiz.',
    ),
  },
  {
    id: 'd2-delete-css',
    day: 2,
    hall: 'studio',
    start: '14:05',
    end: '14:45',
    format: 'talk',
    track: 'engineering',
    level: 'beginner',
    speakerIds: ['lea-moreau'],
    title: t('CSS you can delete', 'Silebileceğiniz CSS'),
    abstract: t(
      'Container queries, :has() and cascade layers, and the utility classes they make unnecessary.',
      'Container query’ler, :has() ve cascade katmanları; gereksiz kıldıkları yardımcı sınıflar.',
    ),
  },
  {
    id: 'd2-guardrails',
    day: 2,
    hall: 'main',
    start: '14:25',
    end: '15:05',
    format: 'talk',
    track: 'ai',
    level: 'intermediate',
    speakerIds: ['deniz-aydin'],
    title: t('Guardrails in the interface', 'Arayüzdeki korkuluklar'),
    abstract: t(
      'Confidence, citations and undo: the interface patterns that keep an assistant honest.',
      'Güven düzeyi, kaynak gösterme ve geri alma: bir asistanı dürüst tutan arayüz desenleri.',
    ),
  },
  {
    id: 'd2-coffee',
    day: 2,
    hall: 'all',
    start: '15:05',
    end: '15:30',
    format: 'break',
    speakerIds: [],
    title: t('Coffee break', 'Kahve arası'),
  },
  {
    id: 'd2-boring-architecture',
    day: 2,
    hall: 'main',
    start: '15:30',
    end: '16:10',
    format: 'talk',
    track: 'engineering',
    level: 'advanced',
    speakerIds: ['kerem-yildiz'],
    title: t('The boring architecture that scaled', 'Ölçeklenen sıkıcı mimari'),
    abstract: t(
      'Monolith, queues and a very good cache: the stack behind a storefront’s busiest week.',
      'Monolit, kuyruklar ve çok iyi bir önbellek: bir vitrinin en yoğun haftasının arkasındaki yapı.',
    ),
  },
  {
    id: 'd2-saying-no',
    day: 2,
    hall: 'hallB',
    start: '15:30',
    end: '16:10',
    format: 'talk',
    track: 'product',
    level: 'advanced',
    speakerIds: ['hannah-okafor'],
    title: t('Saying no to your best customer', 'En iyi müşterinize hayır demek'),
    abstract: t(
      'How to turn down a feature request from the account that pays the most, and keep the account.',
      'En çok ödeyen müşterinin özellik isteğini geri çevirip müşteriyi kaybetmemek.',
    ),
  },
  {
    id: 'd2-community',
    day: 2,
    hall: 'studio',
    start: '15:30',
    end: '16:10',
    format: 'talk',
    track: 'engineering',
    level: 'beginner',
    speakerIds: [],
    title: t('Community lightning talks', 'Topluluk kısa sunumları'),
    abstract: t(
      'Five-minute talks from attendees, chosen by vote on the first day.',
      'Katılımcılardan beş dakikalık sunumlar; ilk gün oylamayla seçiliyor.',
    ),
  },
  {
    id: 'd2-closing-keynote',
    day: 2,
    hall: 'all',
    start: '16:30',
    end: '17:15',
    format: 'keynote',
    track: 'product',
    level: 'beginner',
    speakerIds: ['emre-tas'],
    title: t(
      'Closing keynote: Software for the next hundred million',
      'Kapanış konuşması: Sonraki yüz milyon kişi için yazılım',
    ),
    abstract: t(
      'Cheap phones, patchy networks and first-time users: who we build for next.',
      'Ucuz telefonlar, kesintili ağlar ve ilk kez kullananlar: sırada kimin için yazılım yapıyoruz?',
    ),
  },
]

export const confSponsors: ConfSponsor[] = [
  { name: 'Tessera Cloud', tier: 'platinum' },
  { name: 'Kuzey Pay', tier: 'platinum' },
  { name: 'Lumen Labs', tier: 'gold' },
  { name: 'Rota Mobility', tier: 'gold' },
  { name: 'Stackyard', tier: 'gold' },
  { name: 'Nordvik', tier: 'silver' },
  { name: 'Loopline', tier: 'silver' },
  { name: 'Parcel & Co', tier: 'silver' },
  { name: 'Quill', tier: 'silver' },
  { name: 'Poyraz Bank', tier: 'silver' },
  { name: 'Boğaziçi Devs', tier: 'community' },
  { name: 'UX Circle Ankara', tier: 'community' },
  { name: 'Kod Gecesi', tier: 'community' },
]

export function confRoot(standalone: boolean) {
  return standalone ? '/preview/event' : '/showcases/event'
}

const sessionIndex = new Map(confSessions.map((session) => [session.id, session]))
const speakerIndex = new Map(confSpeakers.map((speaker) => [speaker.id, speaker]))

export function findSession(id: string) {
  return sessionIndex.get(id)
}

export function findSpeaker(id: string) {
  return speakerIndex.get(id)
}

/** A speaker's sessions in the order they happen. */
export function sessionsBySpeaker(speakerId: string) {
  return confSessions
    .filter((session) => session.speakerIds.includes(speakerId))
    .sort((a, b) => a.day - b.day || a.start.localeCompare(b.start))
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0] ?? '')
    .join('')
    .slice(0, 2)
    .toLocaleUpperCase('tr')
}
