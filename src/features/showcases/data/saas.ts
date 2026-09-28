import type { Language } from '@/store/preferences-store'

export function saasRoot(standalone: boolean) {
  return standalone ? '/preview/saas' : '/showcases/saas'
}

export type BillingCycle = 'monthly' | 'yearly'
export type Currency = 'USD' | 'EUR' | 'TRY'
export type PlanId = 'free' | 'team' | 'business' | 'enterprise'

export const BILLING_CYCLES: BillingCycle[] = ['monthly', 'yearly']
export const CURRENCIES: Currency[] = ['USD', 'EUR', 'TRY']
export const MIN_SEATS = 1
export const MAX_SEATS = 500

export interface Plan {
  id: PlanId
  /** Per seat, per month, billed monthly, in US dollars. `null` is priced by sales. */
  monthlyPerSeat: number | null
  /** Seats billed even when fewer are used. */
  minSeats: number
  /** Seats the plan allows; beyond it a larger plan is needed. */
  maxSeats: number | null
  popular?: boolean
}

export const plans: Plan[] = [
  { id: 'free', monthlyPerSeat: 0, minSeats: 1, maxSeats: 3 },
  { id: 'team', monthlyPerSeat: 12, minSeats: 1, maxSeats: 50 },
  { id: 'business', monthlyPerSeat: 24, minSeats: 5, maxSeats: null, popular: true },
  { id: 'enterprise', monthlyPerSeat: null, minSeats: 25, maxSeats: null },
]

/** Fixed demo rates, so a price reads the same on every visit. */
export const exchangeRates: Record<Currency, number> = { USD: 1, EUR: 0.92, TRY: 41 }

/** Yearly billing charges ten months for twelve. */
export const YEARLY_MONTHS_CHARGED = 10

export interface Quote {
  /** What one seat costs per month on this cycle, in the chosen currency. */
  perSeatMonthly: number
  /** The seats actually billed, after the plan's minimum. */
  billedSeats: number
  /** One month for the whole team, averaged over the cycle. */
  monthlyTotal: number
  /** What one invoice comes to: a month, or the year up front. */
  invoiceTotal: number
  /** What yearly billing saves over twelve monthly invoices, per year. */
  yearlySavings: number
  /** The plan cannot hold this many seats. */
  overLimit: boolean
  /** No list price: sales quotes it. */
  custom: boolean
}

const roundMoney = (amount: number, currency: Currency) =>
  currency === 'TRY' ? Math.round(amount) : Math.round(amount * 100) / 100

export function convert(usd: number, currency: Currency) {
  return roundMoney(usd * exchangeRates[currency], currency)
}

/**
 * The one place that prices a plan. The per-seat price is converted and rounded first, and
 * everything else is multiplied from it, so the card, the total and the invoice always agree.
 */
export function quote(
  plan: Plan,
  { cycle, seats, currency }: { cycle: BillingCycle; seats: number; currency: Currency },
): Quote {
  const overLimit = plan.maxSeats !== null && seats > plan.maxSeats
  const billedSeats = Math.max(seats, plan.minSeats)

  if (plan.monthlyPerSeat === null) {
    return {
      perSeatMonthly: 0,
      billedSeats,
      monthlyTotal: 0,
      invoiceTotal: 0,
      yearlySavings: 0,
      overLimit,
      custom: true,
    }
  }

  const monthlyRate = convert(plan.monthlyPerSeat, currency)
  const perSeatMonthly =
    cycle === 'yearly'
      ? roundMoney((monthlyRate * YEARLY_MONTHS_CHARGED) / 12, currency)
      : monthlyRate
  const yearlyTotal = roundMoney(monthlyRate * YEARLY_MONTHS_CHARGED * billedSeats, currency)
  const monthlyTotal =
    cycle === 'yearly'
      ? roundMoney(yearlyTotal / 12, currency)
      : roundMoney(monthlyRate * billedSeats, currency)

  return {
    perSeatMonthly,
    billedSeats,
    monthlyTotal,
    invoiceTotal: cycle === 'yearly' ? yearlyTotal : monthlyTotal,
    yearlySavings: roundMoney(monthlyRate * 12 * billedSeats - yearlyTotal, currency),
    overLimit,
    custom: false,
  }
}

/** The plan that fits a team: the cheapest one whose limit holds every seat. */
export function recommendedPlan(seats: number): PlanId {
  return plans.find((plan) => plan.maxSeats === null || seats <= plan.maxSeats)?.id ?? 'business'
}

export function formatMoney(amount: number, currency: Currency, language: Language) {
  return new Intl.NumberFormat(language === 'tr' ? 'tr-TR' : 'en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount)
}

export interface PricingSettings {
  cycle: BillingCycle
  seats: number
  currency: Currency
}

export const defaultPricingSettings: PricingSettings = {
  cycle: 'yearly',
  seats: 10,
  currency: 'USD',
}

/** Reads the pricing controls from the address, dropping anything that is not a valid choice. */
export function parsePricingSettings(params: URLSearchParams): PricingSettings {
  const cycle = params.get('billing')
  const currency = params.get('currency')
  const seats = Number(params.get('seats'))

  return {
    cycle: BILLING_CYCLES.includes(cycle as BillingCycle)
      ? (cycle as BillingCycle)
      : defaultPricingSettings.cycle,
    currency: CURRENCIES.includes(currency as Currency)
      ? (currency as Currency)
      : defaultPricingSettings.currency,
    seats:
      Number.isInteger(seats) && seats >= MIN_SEATS && seats <= MAX_SEATS
        ? seats
        : defaultPricingSettings.seats,
  }
}

type Localized = Record<Language, string>

/** `true`/`false` is a tick or a cross; text is a limit, like "90 days". */
export type FeatureValue = boolean | Localized

export interface ComparisonGroup {
  key: string
  title: Localized
  features: { key: string; label: Localized; values: Record<PlanId, FeatureValue> }[]
}

const same = (value: FeatureValue): Record<PlanId, FeatureValue> => ({
  free: value,
  team: value,
  business: value,
  enterprise: value,
})

const text = (en: string, tr: string): Localized => ({ en, tr })

export const comparison: ComparisonGroup[] = [
  {
    key: 'monitoring',
    title: text('Monitoring', 'İzleme'),
    features: [
      {
        key: 'services',
        label: text('Monitored services', 'İzlenen servis'),
        values: {
          free: text('5', '5'),
          team: text('50', '50'),
          business: text('Unlimited', 'Sınırsız'),
          enterprise: text('Unlimited', 'Sınırsız'),
        },
      },
      {
        key: 'retention',
        label: text('Metric retention', 'Metrik saklama'),
        values: {
          free: text('7 days', '7 gün'),
          team: text('30 days', '30 gün'),
          business: text('13 months', '13 ay'),
          enterprise: text('Custom', 'Özel'),
        },
      },
      {
        key: 'interval',
        label: text('Check interval', 'Kontrol aralığı'),
        values: {
          free: text('5 min', '5 dk'),
          team: text('1 min', '1 dk'),
          business: text('15 sec', '15 sn'),
          enterprise: text('15 sec', '15 sn'),
        },
      },
      {
        key: 'dashboards',
        label: text('Custom dashboards', 'Özel panolar'),
        values: same(true),
      },
    ],
  },
  {
    key: 'incidents',
    title: text('Incident response', 'Olay yönetimi'),
    features: [
      {
        key: 'alerts',
        label: text('Alerts by email and Slack', 'E-posta ve Slack uyarıları'),
        values: same(true),
      },
      {
        key: 'oncall',
        label: text('On-call schedules', 'Nöbet çizelgeleri'),
        values: { free: false, team: true, business: true, enterprise: true },
      },
      {
        key: 'status',
        label: text('Public status page', 'Herkese açık durum sayfası'),
        values: { free: false, team: true, business: true, enterprise: true },
      },
      {
        key: 'postmortems',
        label: text('Postmortem templates', 'Olay sonrası rapor şablonları'),
        values: { free: false, team: false, business: true, enterprise: true },
      },
    ],
  },
  {
    key: 'security',
    title: text('Security and admin', 'Güvenlik ve yönetim'),
    features: [
      {
        key: 'sso',
        label: text('SAML single sign-on', 'SAML tek oturum açma'),
        values: { free: false, team: false, business: true, enterprise: true },
      },
      {
        key: 'audit',
        label: text('Audit log', 'Denetim kaydı'),
        values: {
          free: false,
          team: false,
          business: text('90 days', '90 gün'),
          enterprise: text('Unlimited', 'Sınırsız'),
        },
      },
      {
        key: 'residency',
        label: text('EU data residency', 'AB veri yerleşimi'),
        values: { free: false, team: false, business: false, enterprise: true },
      },
    ],
  },
  {
    key: 'support',
    title: text('Support', 'Destek'),
    features: [
      {
        key: 'channel',
        label: text('Support channel', 'Destek kanalı'),
        values: {
          free: text('Community', 'Topluluk'),
          team: text('Email', 'E-posta'),
          business: text('Chat and email', 'Sohbet ve e-posta'),
          enterprise: text('Dedicated manager', 'Özel müşteri yöneticisi'),
        },
      },
      {
        key: 'sla',
        label: text('Uptime SLA', 'Erişilebilirlik SLA'),
        values: {
          free: false,
          team: false,
          business: text('99.9%', '%99,9'),
          enterprise: text('99.99%', '%99,99'),
        },
      },
    ],
  },
]

export const saasCopy = {
  en: {
    tagline: 'Observability for busy teams',
    nav: ['Product', 'Features', 'Customers', 'Pricing'],
    eyebrow: 'New: AI incident summaries',
    title: 'See every service. Fix what matters first.',
    description:
      'Pulseboard brings metrics, uptime checks and incidents onto one screen, so the on-call engineer knows what broke and who is affected before the first customer writes in.',
    startFree: 'Start free',
    bookDemo: 'Book a demo',
    heroNote: 'Free for up to 3 people. No credit card.',
    mock: {
      title: 'Production overview',
      live: 'Live',
      uptime: 'Uptime',
      latency: 'p95 latency',
      errors: 'Error rate',
      requests: 'Requests per minute',
      incidents: 'Open incidents',
      incidentItems: [
        ['Checkout API slow in eu-west', 'Investigating'],
        ['Webhook retries rising', 'Monitoring'],
      ],
    },
    logosTitle: 'Trusted by engineering teams at',
    featuresTitle: 'One place for the whole on-call shift',
    featuresDescription:
      'Everything the team needs when something breaks, without stitching five tools together.',
    features: [
      [
        'Live dashboards',
        'Drag metrics from any source onto a board that refreshes every 15 seconds.',
      ],
      [
        'Uptime checks',
        'HTTP, TCP and browser checks from 12 regions, with screenshots of failures.',
      ],
      ['Smart alerts', 'Alerts group related failures, so one outage sends one page, not forty.'],
      [
        'On-call rotations',
        'Weekly rotations, overrides and escalation that follows the time zone.',
      ],
      [
        'Status pages',
        'Tell customers what is going on, on your own domain, from the same incident.',
      ],
      ['AI summaries', 'A plain-language summary of each incident, ready for the postmortem.'],
    ] as const,
    stepsTitle: 'Live in an afternoon',
    steps: [
      ['Connect', 'Add the agent or plug in Datadog, Prometheus or CloudWatch.'],
      ['Set targets', 'Pick the services that matter and the latency they must stay under.'],
      ['Invite the team', 'Import rotations from your calendar and route alerts to Slack.'],
      ['Sleep better', 'Pulseboard pages the right person, with the context to fix it.'],
    ] as const,
    testimonialQuote:
      '“We cut our time to resolve incidents by 43% in the first quarter. The on-call engineer now opens one tab instead of six.”',
    testimonialName: 'Selin Aydın',
    testimonialRole: 'VP Engineering, Lumen Pay',
    stats: [
      ['43%', 'faster resolution'],
      ['12k', 'teams on call'],
      ['99.99%', 'platform uptime'],
    ] as const,
    integrationsTitle: 'Works with the tools you already run',
    integrationsDescription: '80+ integrations, and an open API for everything else.',
    pricingTeaserTitle: 'Simple pricing that grows with the team',
    pricingTeaserDescription: 'Pay per seat. Start free, and switch plans whenever you like.',
    perSeat: 'per seat / month',
    seePricing: 'Compare all plans',
    faqTitle: 'Questions, answered',
    faq: [
      [
        'Do I need to install anything?',
        'Only if you want host metrics. Uptime checks and cloud integrations work without an agent.',
      ],
      [
        'Can I try the paid features first?',
        'Every new workspace gets 14 days of Business, then drops to Free unless you pick a plan.',
      ],
      [
        'Where is my data stored?',
        'In Frankfurt by default. Enterprise workspaces can choose the region and keep data in the EU.',
      ],
      [
        'What happens if we add people mid-month?',
        'New seats are charged pro rata on the next invoice. Removed seats become credit.',
      ],
    ] as const,
    ctaTitle: 'Your next incident could be the shortest one yet.',
    ctaDescription: 'Set up Pulseboard in minutes and see your services live today.',
    workEmail: 'Work email',
    footer: {
      about: 'Observability and incident response for teams that ship every day.',
      columns: [
        ['Product', ['Dashboards', 'Uptime', 'Alerts', 'Status pages', 'Changelog']],
        ['Company', ['About', 'Customers', 'Careers', 'Press']],
        ['Resources', ['Documentation', 'API reference', 'Guides', 'System status']],
      ] as const,
      legal: ['Privacy', 'Terms', 'Security'],
      rights: 'All rights reserved.',
    },
    previewTitle: 'SaaS product site',
    previewDescription:
      'A product landing page and a pricing page with billing, seats and a full plan comparison.',
  },
  tr: {
    tagline: 'Yoğun ekipler için gözlemlenebilirlik',
    nav: ['Ürün', 'Özellikler', 'Müşteriler', 'Fiyatlar'],
    eyebrow: 'Yeni: yapay zekâ ile olay özetleri',
    title: 'Tüm servisleri görün. Önce önemli olanı çözün.',
    description:
      'Pulseboard metrikleri, erişilebilirlik kontrollerini ve olayları tek ekranda toplar; nöbetçi mühendis, ilk müşteri yazmadan neyin bozulduğunu ve kimin etkilendiğini bilir.',
    startFree: 'Ücretsiz başla',
    bookDemo: 'Demo planla',
    heroNote: '3 kişiye kadar ücretsiz. Kredi kartı gerekmez.',
    mock: {
      title: 'Canlı ortam özeti',
      live: 'Canlı',
      uptime: 'Erişilebilirlik',
      latency: 'p95 gecikme',
      errors: 'Hata oranı',
      requests: 'Dakikadaki istek',
      incidents: 'Açık olaylar',
      incidentItems: [
        ['Ödeme API’si eu-west’te yavaş', 'İnceleniyor'],
        ['Webhook tekrarları artıyor', 'İzleniyor'],
      ],
    },
    logosTitle: 'Bu şirketlerin mühendislik ekipleri kullanıyor',
    featuresTitle: 'Nöbetin tamamı için tek yer',
    featuresDescription:
      'Bir şey bozulduğunda ekibin ihtiyaç duyduğu her şey; beş aracı birbirine bağlamadan.',
    features: [
      ['Canlı panolar', 'Her kaynaktan metrikleri 15 saniyede bir yenilenen panoya sürükleyin.'],
      [
        'Erişilebilirlik kontrolleri',
        '12 bölgeden HTTP, TCP ve tarayıcı kontrolleri; hatalarda ekran görüntüsü.',
      ],
      [
        'Akıllı uyarılar',
        'İlişkili hatalar gruplanır; tek kesinti kırk değil tek bildirim gönderir.',
      ],
      ['Nöbet rotasyonları', 'Haftalık rotasyon, istisnalar ve saat dilimine göre yükseltme.'],
      ['Durum sayfaları', 'Müşterilere kendi alan adınızda, aynı olaydan bilgi verin.'],
      ['Yapay zekâ özetleri', 'Her olayın sade bir özeti, olay sonrası rapora hazır.'],
    ] as const,
    stepsTitle: 'Bir öğleden sonrada devrede',
    steps: [
      ['Bağlayın', 'Ajanı ekleyin ya da Datadog, Prometheus veya CloudWatch’u bağlayın.'],
      ['Hedef belirleyin', 'Önemli servisleri ve aşmamaları gereken gecikmeyi seçin.'],
      ['Ekibi davet edin', 'Rotasyonları takviminizden alın, uyarıları Slack’e yönlendirin.'],
      ['Rahat uyuyun', 'Pulseboard doğru kişiyi, çözmesi için gereken bağlamla uyarır.'],
    ] as const,
    testimonialQuote:
      '“İlk çeyrekte olay çözme süremizi %43 kısalttık. Nöbetçi mühendis artık altı sekme yerine tek sekme açıyor.”',
    testimonialName: 'Selin Aydın',
    testimonialRole: 'Mühendislik Direktörü, Lumen Pay',
    stats: [
      ['%43', 'daha hızlı çözüm'],
      ['12 bin', 'nöbetteki ekip'],
      ['%99,99', 'platform erişilebilirliği'],
    ] as const,
    integrationsTitle: 'Zaten kullandığınız araçlarla çalışır',
    integrationsDescription: '80’den fazla entegrasyon ve geri kalan her şey için açık API.',
    pricingTeaserTitle: 'Ekiple birlikte büyüyen sade fiyatlandırma',
    pricingTeaserDescription:
      'Kullanıcı başına ödeyin. Ücretsiz başlayın, planı istediğiniz zaman değiştirin.',
    perSeat: 'kullanıcı başına / ay',
    seePricing: 'Tüm planları karşılaştır',
    faqTitle: 'Sık sorulan sorular',
    faq: [
      [
        'Bir şey kurmam gerekiyor mu?',
        'Yalnızca sunucu metrikleri istiyorsanız. Erişilebilirlik kontrolleri ve bulut entegrasyonları ajan olmadan çalışır.',
      ],
      [
        'Ücretli özellikleri önce deneyebilir miyim?',
        'Her yeni çalışma alanı 14 gün Business kullanır; plan seçmezseniz Free’ye geçer.',
      ],
      [
        'Verilerim nerede saklanıyor?',
        'Varsayılan olarak Frankfurt’ta. Enterprise çalışma alanları bölgeyi seçip veriyi AB’de tutabilir.',
      ],
      [
        'Ay ortasında kişi eklersek ne olur?',
        'Yeni kullanıcılar bir sonraki faturada kıst olarak yansır. Çıkarılan kullanıcılar krediye dönüşür.',
      ],
    ] as const,
    ctaTitle: 'Bir sonraki olayınız en kısası olabilir.',
    ctaDescription: 'Pulseboard’u dakikalar içinde kurun, servislerinizi bugün canlı görün.',
    workEmail: 'İş e-postası',
    footer: {
      about: 'Her gün yayına çıkan ekipler için gözlemlenebilirlik ve olay yönetimi.',
      columns: [
        ['Ürün', ['Panolar', 'Erişilebilirlik', 'Uyarılar', 'Durum sayfaları', 'Değişiklikler']],
        ['Şirket', ['Hakkımızda', 'Müşteriler', 'Kariyer', 'Basın']],
        ['Kaynaklar', ['Dokümantasyon', 'API referansı', 'Rehberler', 'Sistem durumu']],
      ] as const,
      legal: ['Gizlilik', 'Koşullar', 'Güvenlik'],
      rights: 'Tüm hakları saklıdır.',
    },
    previewTitle: 'SaaS ürün sitesi',
    previewDescription:
      'Ürün tanıtım sayfası ile faturalama, kullanıcı sayısı ve plan karşılaştırması içeren fiyat sayfası.',
  },
}

export const planCopy: Record<
  Language,
  Record<PlanId, { name: string; description: string; cta: string; highlights: string[] }>
> = {
  en: {
    free: {
      name: 'Free',
      description: 'For side projects and trying things out.',
      cta: 'Start free',
      highlights: ['Up to 3 people', '5 monitored services', '7-day retention', 'Email alerts'],
    },
    team: {
      name: 'Team',
      description: 'For small teams putting their first rotation together.',
      cta: 'Start 14-day trial',
      highlights: ['Up to 50 people', '50 services', 'On-call schedules', 'Public status page'],
    },
    business: {
      name: 'Business',
      description: 'For companies where downtime costs money.',
      cta: 'Start 14-day trial',
      highlights: ['Unlimited services', '13-month retention', 'SAML SSO', '99.9% uptime SLA'],
    },
    enterprise: {
      name: 'Enterprise',
      description: 'For regulated teams with their own security review.',
      cta: 'Talk to sales',
      highlights: [
        'EU data residency',
        'Unlimited audit log',
        'Dedicated manager',
        'Custom contract',
      ],
    },
  },
  tr: {
    free: {
      name: 'Free',
      description: 'Yan projeler ve denemek için.',
      cta: 'Ücretsiz başla',
      highlights: ['3 kişiye kadar', '5 izlenen servis', '7 gün saklama', 'E-posta uyarıları'],
    },
    team: {
      name: 'Team',
      description: 'İlk nöbet rotasyonunu kuran küçük ekipler için.',
      cta: '14 gün dene',
      highlights: [
        '50 kişiye kadar',
        '50 servis',
        'Nöbet çizelgeleri',
        'Herkese açık durum sayfası',
      ],
    },
    business: {
      name: 'Business',
      description: 'Kesintinin para kaybettirdiği şirketler için.',
      cta: '14 gün dene',
      highlights: ['Sınırsız servis', '13 ay saklama', 'SAML SSO', '%99,9 erişilebilirlik SLA'],
    },
    enterprise: {
      name: 'Enterprise',
      description: 'Kendi güvenlik incelemesi olan düzenlemeye tabi ekipler için.',
      cta: 'Satış ekibiyle görüş',
      highlights: ['AB veri yerleşimi', 'Sınırsız denetim kaydı', 'Özel yönetici', 'Özel sözleşme'],
    },
  },
}

export const pricingCopy = {
  en: {
    eyebrow: 'Pricing',
    title: 'Pay for the people on call, not the data you send.',
    description:
      'Every plan includes unlimited dashboards and alerts. Change seats or plans at any time.',
    billing: 'Billing',
    monthly: 'Monthly',
    yearly: 'Yearly',
    twoMonthsFree: '2 months free',
    currency: 'Currency',
    seats: 'Team size',
    seatsLabel: (count: number) => `${count} ${count === 1 ? 'person' : 'people'}`,
    popular: 'Most popular',
    recommended: 'Fits your team',
    free: 'Free',
    custom: 'Custom',
    customNote: 'Priced for your contract',
    perSeat: 'per seat / month',
    billedMonthly: (total: string) => `${total} billed monthly`,
    billedYearly: (total: string) => `${total} billed yearly`,
    youSave: (amount: string) => `You save ${amount} a year`,
    minimumSeats: (seats: number) => `Billed for at least ${seats} seats`,
    overLimit: (max: number) => `Up to ${max} people. Choose a larger plan for your team.`,
    compareTitle: 'Compare every feature',
    compareDescription: 'The full list, so there are no surprises on the invoice.',
    feature: 'Feature',
    included: 'Included',
    notIncluded: 'Not included',
    comparePlan: 'Plan',
    enterpriseTitle: 'Need a security review or a custom contract?',
    enterpriseDescription:
      'Enterprise adds EU data residency, unlimited audit logs, a dedicated manager and invoicing in your own terms.',
    enterpriseCta: 'Talk to sales',
    enterprisePoints: [
      'SOC 2 Type II and ISO 27001',
      'SAML, SCIM and custom roles',
      'Invoice and PO billing',
    ],
    faqTitle: 'Billing questions',
    faq: [
      [
        'How does yearly billing work?',
        'You pay for ten months and get twelve. The price per seat is fixed for the whole year.',
      ],
      [
        'What counts as a seat?',
        'Anyone who can sign in. Stakeholders who only read status pages are free.',
      ],
      [
        'Can I switch plans later?',
        'Yes. Upgrades take effect immediately and are charged pro rata; downgrades apply at the next renewal.',
      ],
      [
        'Which currencies can I pay in?',
        'US dollars, euros and Turkish lira. Prices in other currencies here are shown at a fixed rate.',
      ],
    ] as const,
  },
  tr: {
    eyebrow: 'Fiyatlar',
    title: 'Gönderdiğiniz veriye değil, nöbetteki kişilere ödeyin.',
    description:
      'Her plan sınırsız pano ve uyarı içerir. Kullanıcı sayısını veya planı istediğiniz zaman değiştirin.',
    billing: 'Faturalama',
    monthly: 'Aylık',
    yearly: 'Yıllık',
    twoMonthsFree: '2 ay bedava',
    currency: 'Para birimi',
    seats: 'Ekip büyüklüğü',
    seatsLabel: (count: number) => `${count} kişi`,
    popular: 'En popüler',
    recommended: 'Ekibinize uygun',
    free: 'Ücretsiz',
    custom: 'Özel',
    customNote: 'Sözleşmenize göre fiyatlanır',
    perSeat: 'kullanıcı başına / ay',
    billedMonthly: (total: string) => `Aylık ${total} faturalanır`,
    billedYearly: (total: string) => `Yıllık ${total} faturalanır`,
    youSave: (amount: string) => `Yılda ${amount} tasarruf`,
    minimumSeats: (seats: number) => `En az ${seats} kullanıcı faturalanır`,
    overLimit: (max: number) => `En fazla ${max} kişi. Ekibiniz için daha büyük bir plan seçin.`,
    compareTitle: 'Tüm özellikleri karşılaştırın',
    compareDescription: 'Faturada sürpriz olmasın diye listenin tamamı.',
    feature: 'Özellik',
    included: 'Dahil',
    notIncluded: 'Dahil değil',
    comparePlan: 'Plan',
    enterpriseTitle: 'Güvenlik incelemesi veya özel sözleşme mi gerekiyor?',
    enterpriseDescription:
      'Enterprise; AB veri yerleşimi, sınırsız denetim kaydı, özel müşteri yöneticisi ve kendi koşullarınızla faturalama ekler.',
    enterpriseCta: 'Satış ekibiyle görüş',
    enterprisePoints: [
      'SOC 2 Type II ve ISO 27001',
      'SAML, SCIM ve özel roller',
      'Fatura ve satın alma siparişi',
    ],
    faqTitle: 'Faturalama soruları',
    faq: [
      [
        'Yıllık faturalama nasıl işliyor?',
        'On ay ödersiniz, on iki ay kullanırsınız. Kullanıcı başı fiyat tüm yıl boyunca sabittir.',
      ],
      [
        'Kimler kullanıcı sayılır?',
        'Oturum açabilen herkes. Yalnızca durum sayfasını okuyan paydaşlar ücretsizdir.',
      ],
      [
        'Planı sonra değiştirebilir miyim?',
        'Evet. Yükseltmeler hemen geçerli olur ve kıst olarak ücretlendirilir; düşürmeler sonraki yenilemede uygulanır.',
      ],
      [
        'Hangi para birimleriyle ödeyebilirim?',
        'ABD doları, euro ve Türk lirası. Buradaki diğer para birimlerindeki fiyatlar sabit kurla gösterilir.',
      ],
    ] as const,
  },
}
