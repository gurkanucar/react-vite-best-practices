import type { Language } from '@/store/preferences-store'

export type Localized = Record<Language, string>

export const CAREERS_CATEGORIES = [
  'software',
  'design',
  'product',
  'data',
  'marketing',
  'sales',
  'finance',
  'hr',
  'operations',
  'success',
] as const
export type CareersCategory = (typeof CAREERS_CATEGORIES)[number]

export const WORK_MODES = ['remote', 'hybrid', 'onsite'] as const
export type WorkMode = (typeof WORK_MODES)[number]

export const EMPLOYMENT_TYPES = ['fullTime', 'partTime', 'contract', 'internship'] as const
export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number]

export const EXPERIENCE_LEVELS = ['intern', 'junior', 'mid', 'senior', 'lead'] as const
export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number]

export const CITIES = ['istanbul', 'ankara', 'izmir'] as const
export type City = (typeof CITIES)[number]
/** Where a job can be searched for: a city, or anywhere for remote work. */
export type JobLocation = City | 'remote'
export const JOB_LOCATIONS: JobLocation[] = [...CITIES, 'remote']

export const COMPANY_SIZES = ['11-50', '51-200', '201-1000', '1000+'] as const
export type CompanySize = (typeof COMPANY_SIZES)[number]

export const REVIEW_ASPECTS = ['workLife', 'culture', 'growth', 'pay', 'management'] as const
export type ReviewAspect = (typeof REVIEW_ASPECTS)[number]

export interface CompanyReview {
  id: string
  rating: number
  role: Localized
  /** Days before now, so the reviews stay recent whenever the page is opened. */
  daysAgo: number
  pros: Localized
  cons: Localized
  current: boolean
}

export interface Company {
  id: string
  name: string
  initials: string
  color: string
  industry: Localized
  industryKey: string
  size: CompanySize
  city: City
  founded: number
  rating: number
  reviewCount: number
  tagline: Localized
  about: Localized
  benefits: BenefitKey[]
  culture: Localized[]
  aspects: Record<ReviewAspect, number>
  /** Share of reviews per star, five stars first. */
  starShare: [number, number, number, number, number]
  reviews: CompanyReview[]
  followers: number
}

export const BENEFITS = [
  'health',
  'meal',
  'remoteBudget',
  'learning',
  'equity',
  'gym',
  'flexibleHours',
  'extraLeave',
  'childcare',
  'shuttle',
] as const
export type BenefitKey = (typeof BENEFITS)[number]

export interface Recruiter {
  name: string
  title: Localized
}

export interface Job {
  id: string
  companyId: string
  role: string
  title: Localized
  category: CareersCategory
  level: ExperienceLevel
  type: EmploymentType
  mode: WorkMode
  /** The office for hybrid and on-site work; a remote job is open anywhere in Türkiye. */
  city: City
  /** Gross monthly TRY; `null` when the company does not publish it. */
  salary: { min: number; max: number } | null
  /** Minutes before now: the listings are always fresh, whenever the page is opened. */
  postedMinutesAgo: number
  applicants: number
  skills: string[]
  easyApply: boolean
  responsibilities: Localized[]
  requirements: Localized[]
  niceToHave: string[]
  recruiter: Recruiter
  /** A posting's own "about the role"; generated listings use a template. */
  about?: Localized
  /** A posting's own benefits; generated listings show the company's. */
  benefits?: BenefitKey[]
  /** Extra screening questions a posting asks on easy apply. */
  questions?: string[]
  /** Written in the employer area rather than generated. */
  custom?: boolean
}

export const careersBrand = 'Workvia'

export function careersRoot(standalone: boolean) {
  return standalone ? '/preview/talent' : '/showcases/talent'
}

export function jobLocation(job: Job): JobLocation {
  return job.mode === 'remote' ? 'remote' : job.city
}

/* ------------------------------------------------------------------ roles */

interface RoleTemplate {
  key: string
  title: Localized
  skills: string[]
}

const ROLES: Record<CareersCategory, RoleTemplate[]> = {
  software: [
    {
      key: 'frontend',
      title: { en: 'Frontend Engineer', tr: 'Frontend Geliştirici' },
      skills: ['React', 'TypeScript', 'CSS', 'Testing', 'Next.js', 'GraphQL', 'Accessibility'],
    },
    {
      key: 'backend',
      title: { en: 'Backend Engineer', tr: 'Backend Geliştirici' },
      skills: ['Go', 'Java', 'PostgreSQL', 'Kafka', 'Docker', 'REST APIs', 'Redis'],
    },
    {
      key: 'mobile',
      title: { en: 'Mobile Developer', tr: 'Mobil Geliştirici' },
      skills: ['Kotlin', 'Swift', 'React Native', 'Flutter', 'Testing', 'CI/CD'],
    },
    {
      key: 'devops',
      title: { en: 'DevOps Engineer', tr: 'DevOps Mühendisi' },
      skills: ['AWS', 'Terraform', 'Kubernetes', 'CI/CD', 'Linux', 'Observability'],
    },
  ],
  design: [
    {
      key: 'product-designer',
      title: { en: 'Product Designer', tr: 'Ürün Tasarımcısı' },
      skills: ['Figma', 'Prototyping', 'User research', 'Design systems', 'Accessibility'],
    },
    {
      key: 'ux-researcher',
      title: { en: 'UX Researcher', tr: 'UX Araştırmacısı' },
      skills: ['User research', 'Usability testing', 'Survey design', 'Figma', 'Workshops'],
    },
    {
      key: 'brand-designer',
      title: { en: 'Brand Designer', tr: 'Marka Tasarımcısı' },
      skills: ['Illustrator', 'Typography', 'Motion', 'Figma', 'Art direction'],
    },
  ],
  product: [
    {
      key: 'product-manager',
      title: { en: 'Product Manager', tr: 'Ürün Yöneticisi' },
      skills: ['Roadmapping', 'Discovery', 'SQL', 'Analytics', 'Stakeholder management'],
    },
    {
      key: 'product-owner',
      title: { en: 'Product Owner', tr: 'Ürün Sahibi' },
      skills: ['Scrum', 'Backlog management', 'Jira', 'User stories', 'Analytics'],
    },
  ],
  data: [
    {
      key: 'data-analyst',
      title: { en: 'Data Analyst', tr: 'Veri Analisti' },
      skills: ['SQL', 'Python', 'Looker', 'Statistics', 'A/B testing', 'dbt'],
    },
    {
      key: 'data-engineer',
      title: { en: 'Data Engineer', tr: 'Veri Mühendisi' },
      skills: ['Python', 'Spark', 'Airflow', 'SQL', 'dbt', 'Kafka'],
    },
    {
      key: 'ml-engineer',
      title: { en: 'Machine Learning Engineer', tr: 'Makine Öğrenmesi Mühendisi' },
      skills: ['Python', 'PyTorch', 'MLOps', 'SQL', 'Statistics', 'Docker'],
    },
  ],
  marketing: [
    {
      key: 'growth-marketer',
      title: { en: 'Growth Marketer', tr: 'Büyüme Pazarlama Uzmanı' },
      skills: ['Performance marketing', 'SEO', 'A/B testing', 'Analytics', 'Copywriting'],
    },
    {
      key: 'content-marketer',
      title: { en: 'Content Marketing Specialist', tr: 'İçerik Pazarlama Uzmanı' },
      skills: ['Copywriting', 'SEO', 'Social media', 'Editing', 'Analytics'],
    },
  ],
  sales: [
    {
      key: 'account-executive',
      title: { en: 'Account Executive', tr: 'Satış Temsilcisi' },
      skills: ['B2B sales', 'Negotiation', 'CRM', 'Pipeline management', 'Presentations'],
    },
    {
      key: 'sdr',
      title: { en: 'Sales Development Representative', tr: 'Satış Geliştirme Uzmanı' },
      skills: ['Prospecting', 'Cold outreach', 'CRM', 'B2B sales', 'Communication'],
    },
  ],
  finance: [
    {
      key: 'financial-analyst',
      title: { en: 'Financial Analyst', tr: 'Finansal Analist' },
      skills: ['Excel', 'Financial modelling', 'Budgeting', 'SQL', 'Reporting'],
    },
    {
      key: 'accountant',
      title: { en: 'Accountant', tr: 'Muhasebe Uzmanı' },
      skills: ['Accounting', 'Tax', 'Excel', 'ERP', 'Reporting'],
    },
  ],
  hr: [
    {
      key: 'recruiter',
      title: { en: 'Talent Acquisition Specialist', tr: 'İşe Alım Uzmanı' },
      skills: ['Recruiting', 'Interviewing', 'Employer branding', 'ATS', 'Sourcing'],
    },
    {
      key: 'people-partner',
      title: { en: 'People Partner', tr: 'İK İş Ortağı' },
      skills: ['Employee relations', 'Performance management', 'Labour law', 'Coaching'],
    },
  ],
  operations: [
    {
      key: 'operations-specialist',
      title: { en: 'Operations Specialist', tr: 'Operasyon Uzmanı' },
      skills: ['Process design', 'Excel', 'Supply chain', 'Reporting', 'Lean'],
    },
    {
      key: 'project-manager',
      title: { en: 'Project Manager', tr: 'Proje Yöneticisi' },
      skills: ['Planning', 'Risk management', 'Jira', 'Stakeholder management', 'Budgeting'],
    },
  ],
  success: [
    {
      key: 'customer-success',
      title: { en: 'Customer Success Manager', tr: 'Müşteri Başarı Yöneticisi' },
      skills: ['Onboarding', 'Account management', 'CRM', 'Communication', 'Renewals'],
    },
    {
      key: 'support-engineer',
      title: { en: 'Technical Support Engineer', tr: 'Teknik Destek Mühendisi' },
      skills: ['Troubleshooting', 'SQL', 'APIs', 'Communication', 'Zendesk'],
    },
  ],
}

/** Monthly gross TRY for a mid-level role in the category. */
const BASE_SALARY: Record<CareersCategory, number> = {
  software: 105_000,
  design: 85_000,
  product: 110_000,
  data: 100_000,
  marketing: 70_000,
  sales: 65_000,
  finance: 72_000,
  hr: 62_000,
  operations: 60_000,
  success: 58_000,
}

const LEVEL_FACTOR: Record<ExperienceLevel, number> = {
  intern: 0.28,
  junior: 0.62,
  mid: 1,
  senior: 1.45,
  lead: 1.9,
}

const LEVEL_PREFIX: Record<ExperienceLevel, Localized> = {
  intern: { en: 'Intern ', tr: 'Stajyer ' },
  junior: { en: 'Junior ', tr: 'Junior ' },
  mid: { en: '', tr: '' },
  senior: { en: 'Senior ', tr: 'Kıdemli ' },
  lead: { en: 'Lead ', tr: 'Lider ' },
}

export const LEVEL_YEARS: Record<ExperienceLevel, number> = {
  intern: 0,
  junior: 1,
  mid: 3,
  senior: 5,
  lead: 8,
}

const RESPONSIBILITIES: Record<CareersCategory, Localized[]> = {
  software: [
    {
      en: 'Ship features end to end, from design review to production.',
      tr: 'Özellikleri tasarım incelemesinden canlıya kadar uçtan uca geliştirmek.',
    },
    {
      en: 'Keep the codebase healthy with reviews, tests and refactoring.',
      tr: 'Kod incelemeleri, testler ve iyileştirmelerle kod tabanını sağlıklı tutmak.',
    },
    {
      en: 'Work with product and design to shape what gets built.',
      tr: 'Neyin geliştirileceğini ürün ve tasarım ekipleriyle birlikte şekillendirmek.',
    },
    {
      en: 'Measure performance and reliability, and act on what you find.',
      tr: 'Performans ve güvenilirliği ölçmek, bulgulara göre aksiyon almak.',
    },
  ],
  design: [
    {
      en: 'Turn research and product goals into clear, tested flows.',
      tr: 'Araştırma ve ürün hedeflerini net, test edilmiş akışlara dönüştürmek.',
    },
    {
      en: 'Grow and maintain the design system with engineering.',
      tr: 'Tasarım sistemini mühendislik ekibiyle birlikte büyütmek ve korumak.',
    },
    {
      en: 'Run usability sessions and share what you learn.',
      tr: 'Kullanılabilirlik testleri yürütmek ve öğrenilenleri paylaşmak.',
    },
    {
      en: 'Present work to stakeholders and handle feedback well.',
      tr: 'Çalışmaları paydaşlara sunmak ve geri bildirimleri yönetmek.',
    },
  ],
  product: [
    {
      en: 'Own the roadmap for one product area and its outcomes.',
      tr: 'Bir ürün alanının yol haritasını ve sonuçlarını sahiplenmek.',
    },
    {
      en: 'Talk to customers every week and turn insight into bets.',
      tr: 'Her hafta müşterilerle görüşmek ve içgörüleri önceliklere çevirmek.',
    },
    {
      en: 'Write clear briefs and keep the team aligned.',
      tr: 'Net ürün dokümanları yazmak ve ekibi aynı hedefte tutmak.',
    },
    {
      en: 'Define success metrics and report on them.',
      tr: 'Başarı metriklerini tanımlamak ve raporlamak.',
    },
  ],
  data: [
    {
      en: 'Build reliable datasets and dashboards the business trusts.',
      tr: 'İş birimlerinin güvendiği veri setleri ve panolar oluşturmak.',
    },
    {
      en: 'Design experiments and read their results honestly.',
      tr: 'Deneyler tasarlamak ve sonuçlarını doğru yorumlamak.',
    },
    {
      en: 'Automate pipelines and document how data flows.',
      tr: 'Veri hatlarını otomatikleştirmek ve veri akışını belgelemek.',
    },
    {
      en: 'Answer ad-hoc questions quickly and clearly.',
      tr: 'Anlık soruları hızlı ve anlaşılır şekilde yanıtlamak.',
    },
  ],
  marketing: [
    {
      en: 'Plan and run campaigns across paid and owned channels.',
      tr: 'Ücretli ve sahip olunan kanallarda kampanyalar planlamak ve yürütmek.',
    },
    {
      en: 'Test messages and landing pages, and scale what works.',
      tr: 'Mesajları ve açılış sayfalarını test edip işe yarayanı büyütmek.',
    },
    {
      en: 'Report on acquisition cost and conversion every week.',
      tr: 'Edinme maliyeti ve dönüşümü haftalık raporlamak.',
    },
    {
      en: 'Work with sales and product on launches.',
      tr: 'Lansmanlarda satış ve ürün ekipleriyle birlikte çalışmak.',
    },
  ],
  sales: [
    {
      en: 'Build and manage a pipeline of mid-market accounts.',
      tr: 'Orta ölçekli müşterilerden oluşan bir satış hattı kurmak ve yönetmek.',
    },
    {
      en: 'Run discovery calls and tailored demos.',
      tr: 'İhtiyaç analizi görüşmeleri ve kişiye özel demolar yapmak.',
    },
    {
      en: 'Negotiate and close deals against a quarterly target.',
      tr: 'Çeyreklik hedefe karşı müzakere edip anlaşmaları kapatmak.',
    },
    {
      en: 'Keep the CRM accurate so forecasts can be trusted.',
      tr: 'Tahminlerin güvenilir olması için CRM kayıtlarını güncel tutmak.',
    },
  ],
  finance: [
    {
      en: 'Prepare monthly reporting and variance analysis.',
      tr: 'Aylık raporlamayı ve sapma analizlerini hazırlamak.',
    },
    {
      en: 'Support budgeting and the yearly plan.',
      tr: 'Bütçeleme ve yıllık planlama süreçlerine destek olmak.',
    },
    {
      en: 'Improve financial processes and controls.',
      tr: 'Finansal süreçleri ve kontrolleri iyileştirmek.',
    },
    {
      en: 'Partner with teams on spend and forecasts.',
      tr: 'Harcama ve tahminlerde ekiplerle iş ortaklığı yapmak.',
    },
  ],
  hr: [
    {
      en: 'Run hiring processes from intake to offer.',
      tr: 'İşe alım süreçlerini ihtiyaç analizinden teklife kadar yürütmek.',
    },
    {
      en: 'Give candidates a fast, respectful experience.',
      tr: 'Adaylara hızlı ve saygılı bir deneyim sunmak.',
    },
    {
      en: 'Coach managers on interviews and feedback.',
      tr: 'Yöneticilere mülakat ve geri bildirim konusunda koçluk yapmak.',
    },
    {
      en: 'Track hiring data and improve the funnel.',
      tr: 'İşe alım verilerini takip edip süreci iyileştirmek.',
    },
  ],
  operations: [
    {
      en: 'Map processes and remove the steps that slow teams down.',
      tr: 'Süreçleri haritalamak ve ekipleri yavaşlatan adımları kaldırmak.',
    },
    {
      en: 'Coordinate suppliers, schedules and budgets.',
      tr: 'Tedarikçileri, takvimleri ve bütçeleri koordine etmek.',
    },
    {
      en: 'Report on operational KPIs every week.',
      tr: 'Operasyonel performans göstergelerini haftalık raporlamak.',
    },
    {
      en: 'Lead cross-team projects to a clear finish.',
      tr: 'Ekipler arası projeleri net bir sonuca taşımak.',
    },
  ],
  success: [
    {
      en: 'Onboard new customers and get them to value quickly.',
      tr: 'Yeni müşterileri hızla ürünün değerine ulaştıracak şekilde başlatmak.',
    },
    {
      en: 'Own renewals and spot expansion opportunities.',
      tr: 'Yenilemeleri sahiplenmek ve büyüme fırsatlarını yakalamak.',
    },
    {
      en: 'Bring customer feedback to product with evidence.',
      tr: 'Müşteri geri bildirimlerini kanıtlarıyla ürün ekibine taşımak.',
    },
    {
      en: 'Keep health scores and account notes up to date.',
      tr: 'Müşteri sağlık skorlarını ve hesap notlarını güncel tutmak.',
    },
  ],
}

/* -------------------------------------------------------------- companies */

interface CompanySeed {
  id: string
  name: string
  color: string
  industry: Localized
  industryKey: string
  size: CompanySize
  city: City
  founded: number
  categories: CareersCategory[]
  tagline: Localized
  benefits: BenefitKey[]
}

const COMPANY_SEEDS: CompanySeed[] = [
  {
    id: 'lumora-pay',
    name: 'Lumora Pay',
    color: '#5b4ce6',
    industry: { en: 'Fintech', tr: 'Finansal teknoloji' },
    industryKey: 'fintech',
    size: '201-1000',
    city: 'istanbul',
    founded: 2016,
    categories: ['software', 'data', 'product', 'finance'],
    tagline: { en: 'Payments for small businesses', tr: 'Küçük işletmeler için ödeme' },
    benefits: ['health', 'meal', 'equity', 'learning', 'flexibleHours'],
  },
  {
    id: 'kestane-games',
    name: 'Kestane Games',
    color: '#d9480f',
    industry: { en: 'Gaming', tr: 'Oyun' },
    industryKey: 'gaming',
    size: '51-200',
    city: 'istanbul',
    founded: 2018,
    categories: ['software', 'design', 'data', 'marketing'],
    tagline: { en: 'Casual games, played daily', tr: 'Her gün oynanan oyunlar' },
    benefits: ['health', 'equity', 'gym', 'remoteBudget', 'flexibleHours'],
  },
  {
    id: 'ardic-health',
    name: 'Ardıç Health',
    color: '#0c8599',
    industry: { en: 'Health tech', tr: 'Sağlık teknolojisi' },
    industryKey: 'health',
    size: '201-1000',
    city: 'ankara',
    founded: 2014,
    categories: ['software', 'product', 'operations', 'success'],
    tagline: { en: 'Clinic software that doctors like', tr: 'Hekimlerin sevdiği klinik yazılımı' },
    benefits: ['health', 'meal', 'learning', 'childcare', 'shuttle'],
  },
  {
    id: 'vela-mobility',
    name: 'Vela Mobility',
    color: '#2b8a3e',
    industry: { en: 'Mobility', tr: 'Mobilite' },
    industryKey: 'mobility',
    size: '51-200',
    city: 'izmir',
    founded: 2020,
    categories: ['software', 'operations', 'data', 'marketing'],
    tagline: {
      en: 'Shared e-bikes for coastal cities',
      tr: 'Kıyı şehirleri için paylaşımlı e-bisiklet',
    },
    benefits: ['health', 'remoteBudget', 'flexibleHours', 'extraLeave'],
  },
  {
    id: 'orbiton-cloud',
    name: 'Orbiton Cloud',
    color: '#1864ab',
    industry: { en: 'Cloud infrastructure', tr: 'Bulut altyapısı' },
    industryKey: 'cloud',
    size: '201-1000',
    city: 'istanbul',
    founded: 2012,
    categories: ['software', 'sales', 'success', 'data'],
    tagline: { en: 'Hosting built in Türkiye', tr: 'Türkiye’de kurulan barındırma' },
    benefits: ['health', 'meal', 'learning', 'equity', 'gym'],
  },
  {
    id: 'papatya-market',
    name: 'Papatya Market',
    color: '#e8590c',
    industry: { en: 'E-commerce', tr: 'E-ticaret' },
    industryKey: 'ecommerce',
    size: '1000+',
    city: 'istanbul',
    founded: 2009,
    categories: ['software', 'marketing', 'operations', 'success', 'data'],
    tagline: { en: 'Groceries at the door in 30 minutes', tr: '30 dakikada kapınızda market' },
    benefits: ['health', 'meal', 'shuttle', 'learning', 'childcare'],
  },
  {
    id: 'tessera-analytics',
    name: 'Tessera Analytics',
    color: '#862e9c',
    industry: { en: 'Analytics', tr: 'Veri analitiği' },
    industryKey: 'analytics',
    size: '11-50',
    city: 'ankara',
    founded: 2021,
    categories: ['data', 'software', 'sales'],
    tagline: {
      en: 'Forecasts retailers can act on',
      tr: 'Perakendeciler için uygulanabilir tahminler',
    },
    benefits: ['equity', 'remoteBudget', 'flexibleHours', 'learning'],
  },
  {
    id: 'kuzgun-security',
    name: 'Kuzgun Security',
    color: '#343a40',
    industry: { en: 'Cybersecurity', tr: 'Siber güvenlik' },
    industryKey: 'security',
    size: '51-200',
    city: 'ankara',
    founded: 2015,
    categories: ['software', 'sales', 'success'],
    tagline: { en: 'Threat detection for banks', tr: 'Bankalar için tehdit tespiti' },
    benefits: ['health', 'meal', 'learning', 'extraLeave'],
  },
  {
    id: 'halcyon-travel',
    name: 'Halcyon Travel',
    color: '#1098ad',
    industry: { en: 'Travel', tr: 'Seyahat' },
    industryKey: 'travel',
    size: '201-1000',
    city: 'izmir',
    founded: 2011,
    categories: ['marketing', 'success', 'software', 'operations'],
    tagline: { en: 'Holidays planned in minutes', tr: 'Dakikalar içinde planlanan tatiller' },
    benefits: ['health', 'extraLeave', 'meal', 'flexibleHours'],
  },
  {
    id: 'mercan-foods',
    name: 'Mercan Foods',
    color: '#c92a2a',
    industry: { en: 'Food & beverage', tr: 'Gıda ve içecek' },
    industryKey: 'food',
    size: '1000+',
    city: 'izmir',
    founded: 1998,
    categories: ['finance', 'operations', 'hr', 'sales', 'marketing'],
    tagline: { en: 'Olive oil and pantry staples', tr: 'Zeytinyağı ve kiler ürünleri' },
    benefits: ['health', 'meal', 'shuttle', 'childcare'],
  },
  {
    id: 'pusula-education',
    name: 'Pusula Education',
    color: '#f08c00',
    industry: { en: 'Education tech', tr: 'Eğitim teknolojisi' },
    industryKey: 'edtech',
    size: '51-200',
    city: 'ankara',
    founded: 2017,
    categories: ['product', 'design', 'software', 'marketing'],
    tagline: { en: 'Maths practice that adapts', tr: 'Öğrenciye uyum sağlayan matematik' },
    benefits: ['health', 'learning', 'remoteBudget', 'extraLeave'],
  },
  {
    id: 'sarmasik-hr',
    name: 'Sarmaşık HR',
    color: '#37b24d',
    industry: { en: 'HR tech', tr: 'İK teknolojisi' },
    industryKey: 'hrtech',
    size: '11-50',
    city: 'istanbul',
    founded: 2022,
    categories: ['sales', 'hr', 'software', 'success'],
    tagline: { en: 'Payroll without spreadsheets', tr: 'Tablosuz bordro' },
    benefits: ['equity', 'remoteBudget', 'flexibleHours'],
  },
  {
    id: 'lodos-energy',
    name: 'Lodos Energy',
    color: '#0b7285',
    industry: { en: 'Renewable energy', tr: 'Yenilenebilir enerji' },
    industryKey: 'energy',
    size: '201-1000',
    city: 'izmir',
    founded: 2013,
    categories: ['operations', 'data', 'finance', 'hr'],
    tagline: { en: 'Wind and solar across the Aegean', tr: 'Ege genelinde rüzgâr ve güneş' },
    benefits: ['health', 'meal', 'shuttle', 'learning'],
  },
  {
    id: 'zeytin-studio',
    name: 'Zeytin Studio',
    color: '#5c940d',
    industry: { en: 'Design agency', tr: 'Tasarım ajansı' },
    industryKey: 'agency',
    size: '11-50',
    city: 'istanbul',
    founded: 2015,
    categories: ['design', 'marketing', 'product'],
    tagline: {
      en: 'Brands and products, made with care',
      tr: 'Özenle yapılmış markalar ve ürünler',
    },
    benefits: ['flexibleHours', 'learning', 'extraLeave'],
  },
  {
    id: 'gokce-media',
    name: 'Gökçe Media',
    color: '#d6336c',
    industry: { en: 'Media', tr: 'Medya' },
    industryKey: 'media',
    size: '51-200',
    city: 'istanbul',
    founded: 2010,
    categories: ['marketing', 'data', 'sales', 'design'],
    tagline: { en: 'Newsletters people open', tr: 'Açılarak okunan bültenler' },
    benefits: ['health', 'flexibleHours', 'remoteBudget'],
  },
  {
    id: 'ayaz-logistics',
    name: 'Ayaz Logistics',
    color: '#495057',
    industry: { en: 'Logistics', tr: 'Lojistik' },
    industryKey: 'logistics',
    size: '1000+',
    city: 'ankara',
    founded: 2003,
    categories: ['operations', 'finance', 'hr', 'software'],
    tagline: { en: 'Freight across three continents', tr: 'Üç kıtada yük taşımacılığı' },
    benefits: ['health', 'meal', 'shuttle', 'childcare'],
  },
]

const CULTURE: Localized[] = [
  { en: 'Written decisions', tr: 'Yazılı kararlar' },
  { en: 'No-meeting Wednesdays', tr: 'Toplantısız çarşambalar' },
  { en: 'Mentoring for everyone', tr: 'Herkese mentorluk' },
  { en: 'Quarterly hack days', tr: 'Çeyreklik hackathon günleri' },
  { en: 'Open salary bands', tr: 'Açık maaş bantları' },
  { en: 'Four-day summer weeks', tr: 'Yazın dört günlük hafta' },
  { en: 'Blameless post-mortems', tr: 'Suçlamasız olay değerlendirmesi' },
  { en: 'Team offsites twice a year', tr: 'Yılda iki ekip buluşması' },
]

const REVIEW_TEXT: { pros: Localized; cons: Localized }[] = [
  {
    pros: {
      en: 'Kind colleagues and managers who actually give feedback.',
      tr: 'Nazik çalışma arkadaşları ve gerçekten geri bildirim veren yöneticiler.',
    },
    cons: {
      en: 'Priorities change a bit too often.',
      tr: 'Öncelikler biraz fazla sık değişiyor.',
    },
  },
  {
    pros: {
      en: 'Real ownership from the first month.',
      tr: 'İlk aydan itibaren gerçek sorumluluk.',
    },
    cons: {
      en: 'Tooling can be slow in places.',
      tr: 'Bazı araçlar yavaş kalabiliyor.',
    },
  },
  {
    pros: {
      en: 'Good pay and a clear levelling guide.',
      tr: 'İyi maaş ve net bir kariyer seviye rehberi.',
    },
    cons: {
      en: 'Busy seasons mean long weeks.',
      tr: 'Yoğun dönemlerde haftalar uzun geçiyor.',
    },
  },
  {
    pros: {
      en: 'Flexible hours and a sensible remote policy.',
      tr: 'Esnek saatler ve makul bir uzaktan çalışma politikası.',
    },
    cons: {
      en: 'Promotions depend a lot on your manager.',
      tr: 'Terfiler büyük ölçüde yöneticinize bağlı.',
    },
  },
  {
    pros: {
      en: 'Learning budget that people really use.',
      tr: 'Gerçekten kullanılan bir eğitim bütçesi.',
    },
    cons: {
      en: 'The office is far from public transport.',
      tr: 'Ofis toplu taşımaya uzak.',
    },
  },
]

const REVIEW_ROLES: Localized[] = [
  { en: 'Software engineer', tr: 'Yazılım mühendisi' },
  { en: 'Product designer', tr: 'Ürün tasarımcısı' },
  { en: 'Account executive', tr: 'Satış temsilcisi' },
  { en: 'Data analyst', tr: 'Veri analisti' },
  { en: 'Operations specialist', tr: 'Operasyon uzmanı' },
]

const FIRST_NAMES = [
  'Elif',
  'Can',
  'Zeynep',
  'Mert',
  'Ayşe',
  'Emre',
  'Selin',
  'Burak',
  'Derya',
  'Kaan',
]
const LAST_NAMES = ['Aydın', 'Kaya', 'Demir', 'Çelik', 'Şahin', 'Yıldız', 'Arslan', 'Koç', 'Öztürk']

/* ---------------------------------------------------------------- random */

/** Mulberry32: small, fast, and the same numbers in every browser and in Node. */
function seeded(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296
  }
}

type Random = ReturnType<typeof seeded>

function pick<T>(random: Random, items: readonly T[]): T {
  return items[Math.floor(random() * items.length)]!
}

/** A fixed-length sample without repeats, in a shuffled order. */
function sample<T>(random: Random, items: readonly T[], count: number): T[] {
  const pool = [...items]
  for (let index = pool.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1))
    ;[pool[index], pool[swap]] = [pool[swap]!, pool[index]!]
  }
  return pool.slice(0, count)
}

function weighted<T>(random: Random, entries: [T, number][]): T {
  const total = entries.reduce((sum, [, weight]) => sum + weight, 0)
  let roll = random() * total
  for (const [value, weight] of entries) {
    roll -= weight
    if (roll < 0) return value
  }
  return entries[entries.length - 1]![0]
}

function roundTo(value: number, step: number) {
  return Math.round(value / step) * step
}

/* -------------------------------------------------------------- building */

function buildCompany(seed: CompanySeed, index: number): Company {
  const random = seeded(1000 + index * 7919)
  const rating = Math.round((3.4 + random() * 1.4) * 10) / 10
  const high = Math.min(0.7, 0.18 + (rating - 3.4) * 0.35)
  const shares = [high, 0.28, 0.14, 0.07, 0.04]
  const shareTotal = shares.reduce((sum, value) => sum + value, 0)
  const starShare = shares.map((value) =>
    Math.round((value / shareTotal) * 100),
  ) as Company['starShare']
  const aspects = Object.fromEntries(
    REVIEW_ASPECTS.map((aspect) => [
      aspect,
      Math.round(Math.min(5, Math.max(2.8, rating + (random() - 0.5) * 0.9)) * 10) / 10,
    ]),
  ) as Record<ReviewAspect, number>

  const reviews = sample(random, REVIEW_TEXT, 3).map((text, reviewIndex) => ({
    id: `${seed.id}-review-${reviewIndex}`,
    rating: Math.max(3, Math.min(5, Math.round(rating + (random() - 0.4)))),
    role: pick(random, REVIEW_ROLES),
    daysAgo: 3 + Math.floor(random() * 120),
    pros: text.pros,
    cons: text.cons,
    current: random() > 0.3,
  }))

  const words = seed.name.split(' ')
  return {
    id: seed.id,
    name: seed.name,
    initials: `${words[0]![0]}${words[1]?.[0] ?? ''}`.toLocaleUpperCase('tr-TR'),
    color: seed.color,
    industry: seed.industry,
    industryKey: seed.industryKey,
    size: seed.size,
    city: seed.city,
    founded: seed.founded,
    rating,
    reviewCount: 20 + Math.floor(random() * 380),
    tagline: seed.tagline,
    about: {
      en: `${seed.name} was founded in ${seed.founded} in ${CITY_NAMES.en[seed.city]}. ${seed.tagline.en}, built by a team that ships in small steps and talks to customers every week.`,
      tr: `${seed.name}, ${seed.founded} yılında ${CITY_NAMES.tr[seed.city]}’da kuruldu. ${seed.tagline.tr}; küçük adımlarla ilerleyen ve her hafta müşterileriyle konuşan bir ekip tarafından geliştiriliyor.`,
    },
    benefits: seed.benefits,
    culture: sample(random, CULTURE, 4),
    aspects,
    starShare,
    reviews,
    followers: 300 + Math.floor(random() * 9000),
  }
}

export const CITY_NAMES: Record<Language, Record<JobLocation, string>> = {
  en: { istanbul: 'Istanbul', ankara: 'Ankara', izmir: 'Izmir', remote: 'Remote' },
  tr: { istanbul: 'İstanbul', ankara: 'Ankara', izmir: 'İzmir', remote: 'Uzaktan' },
}

export const careersCompanies: Company[] = COMPANY_SEEDS.map(buildCompany)

const JOB_COUNT = 120
const DAY = 24 * 60

function buildJobs(): Job[] {
  const random = seeded(20260928)
  const jobs: Job[] = []

  for (let index = 0; index < JOB_COUNT; index += 1) {
    const seed = COMPANY_SEEDS[index % COMPANY_SEEDS.length]!
    const category =
      random() < 0.8 ? pick(random, seed.categories) : pick(random, CAREERS_CATEGORIES)
    const role = pick(random, ROLES[category])
    const level = weighted<ExperienceLevel>(random, [
      ['intern', 1],
      ['junior', 3],
      ['mid', 5],
      ['senior', 4],
      ['lead', 1.5],
    ])
    const type: EmploymentType =
      level === 'intern'
        ? 'internship'
        : weighted<EmploymentType>(random, [
            ['fullTime', 12],
            ['contract', 1.5],
            ['partTime', 1],
          ])
    const mode = weighted<WorkMode>(random, [
      ['hybrid', 5],
      ['remote', 3],
      ['onsite', 3],
    ])
    const city = random() < 0.75 ? seed.city : pick(random, CITIES)
    const base = BASE_SALARY[category] * LEVEL_FACTOR[level] * (0.9 + random() * 0.25)
    const min = roundTo(base, 2_500)
    const salary =
      random() < 0.25 ? null : { min, max: roundTo(min * (1.2 + random() * 0.2), 2_500) }
    // A few listings from the last day, most within two weeks, a tail up to a month.
    const postedMinutesAgo =
      index % 9 === 0
        ? 20 + Math.floor(random() * (DAY - 60))
        : weighted<number>(random, [
            [Math.floor(random() * 7 * DAY), 6],
            [7 * DAY + Math.floor(random() * 7 * DAY), 3],
            [14 * DAY + Math.floor(random() * 16 * DAY), 2],
          ])
    const skillCount = Math.min(role.skills.length, 4 + Math.floor(random() * 3))
    const skills = sample(random, role.skills, skillCount)
    const rest = role.skills.filter((skill) => !skills.includes(skill))

    jobs.push({
      id: `${role.key}-${seed.id}-${index + 101}`,
      companyId: seed.id,
      role: role.key,
      title: {
        en: `${LEVEL_PREFIX[level].en}${role.title.en}`,
        tr: `${LEVEL_PREFIX[level].tr}${role.title.tr}`,
      },
      category,
      level,
      type,
      mode,
      city,
      salary,
      postedMinutesAgo: Math.max(5, postedMinutesAgo),
      applicants: 3 + Math.floor(random() * (postedMinutesAgo < DAY ? 30 : 240)),
      skills,
      easyApply: random() < 0.65,
      responsibilities: sample(random, RESPONSIBILITIES[category], 3),
      requirements: [
        level === 'intern'
          ? {
              en: 'A final-year student or recent graduate in a related field.',
              tr: 'İlgili bir bölümde son sınıf öğrencisi ya da yeni mezun.',
            }
          : {
              en: `${LEVEL_YEARS[level]}+ years of experience in a similar role.`,
              tr: `Benzer bir rolde en az ${LEVEL_YEARS[level]} yıl deneyim.`,
            },
        {
          en: `Hands-on with ${skills.slice(0, 3).join(', ')}.`,
          tr: `${skills.slice(0, 3).join(', ')} konularında uygulamalı deneyim.`,
        },
        {
          en: 'Clear written and spoken Turkish; good working English.',
          tr: 'Yazılı ve sözlü olarak net Türkçe; iyi düzeyde iş İngilizcesi.',
        },
      ],
      niceToHave: rest.slice(0, 2),
      recruiter: {
        name: `${pick(random, FIRST_NAMES)} ${pick(random, LAST_NAMES)}`,
        title:
          random() < 0.5
            ? { en: 'Talent partner', tr: 'Yetenek iş ortağı' }
            : { en: 'Hiring manager', tr: 'İşe alım yöneticisi' },
      },
    })
  }
  return jobs
}

export const careersJobs: Job[] = buildJobs()

const jobsById = new Map(careersJobs.map((job) => [job.id, job]))
const companiesById = new Map(careersCompanies.map((company) => [company.id, company]))

export function findJob(id: string | null | undefined): Job | undefined {
  return id ? jobsById.get(id) : undefined
}

export function findCompany(id: string | null | undefined): Company | undefined {
  return id ? companiesById.get(id) : undefined
}

export function companyOf(job: Job): Company {
  return companiesById.get(job.companyId)!
}

export function jobsOfCompany(companyId: string, jobs: Job[] = careersJobs): Job[] {
  return jobs.filter((job) => job.companyId === companyId)
}

/** Every skill in the catalogue, for the profile's skill picker and the search suggestions. */
export const ALL_SKILLS = [...new Set(careersJobs.flatMap((job) => job.skills))].sort((a, b) =>
  a.localeCompare(b),
)

/** A role's title without a level, e.g. "Product Manager". */
export function roleTitle(role: string): Localized | undefined {
  return Object.values(ROLES)
    .flat()
    .find((template) => template.key === role)?.title
}

/** Every role title in both languages, for the search suggestions. */
export const ROLE_TITLES: Localized[] = Object.values(ROLES).flatMap((roles) =>
  roles.map((role) => role.title),
)
