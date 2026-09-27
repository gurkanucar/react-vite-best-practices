import type { LocalizedText } from '@/features/showcases/types'

export interface TeamMember {
  name: string
  role: LocalizedText
  /** Where they come from, in one line: a faculty, a company, a chamber. */
  affiliation: LocalizedText
  /** Left out for the board, who are reached through the management office. */
  email?: string
}

/** Invented people with invented addresses on the reserved `.example` domain. */
export const techParkBoard: TeamMember[] = [
  {
    name: 'Prof. Dr. Selin Arıkan',
    role: { en: 'Chairman of the Board', tr: 'Yönetim Kurulu Başkanı' },
    affiliation: { en: 'Rector, Aurora University', tr: 'Rektör, Aurora Üniversitesi' },
  },
  {
    name: 'Prof. Dr. Kerem Duman',
    role: { en: 'Vice Chairman of the Board', tr: 'Yönetim Kurulu Başkan Vekili' },
    affiliation: {
      en: 'Faculty of Engineering, Aurora University',
      tr: 'Mühendislik Fakültesi, Aurora Üniversitesi',
    },
  },
  {
    name: 'Doç. Dr. Elif Tunalı',
    role: { en: 'Board Member', tr: 'Yönetim Kurulu Üyesi' },
    affiliation: {
      en: 'Technology Transfer Office, Aurora University',
      tr: 'Teknoloji Transfer Ofisi, Aurora Üniversitesi',
    },
  },
  {
    name: 'Murat Soylu',
    role: { en: 'Board Member', tr: 'Yönetim Kurulu Üyesi' },
    affiliation: {
      en: 'Organised Industrial Zone Directorate',
      tr: 'Organize Sanayi Bölgesi Müdürlüğü',
    },
  },
  {
    name: 'Ayşe Karaca',
    role: { en: 'Board Member', tr: 'Yönetim Kurulu Üyesi' },
    affiliation: {
      en: 'Regional Chamber of Commerce and Industry',
      tr: 'Bölge Ticaret ve Sanayi Odası',
    },
  },
]

export const techParkManagement: TeamMember[] = [
  {
    name: 'Deniz Yalçın',
    role: { en: 'R&D Incentives Specialist', tr: 'Ar-Ge Teşvikleri Uzmanı' },
    affiliation: {
      en: 'Grant calls, project applications and progress reports',
      tr: 'Hibe çağrıları, proje başvuruları ve dönem raporları',
    },
    email: 'incentives@aurora-techpark.example',
  },
  {
    name: 'Burak Öztürk',
    role: { en: 'Exemption Specialist', tr: 'Muafiyet Uzmanı' },
    affiliation: {
      en: 'Tax exemptions under Law No. 4691 and monthly declarations',
      tr: '4691 sayılı Kanun kapsamındaki vergi muafiyetleri ve aylık bildirimler',
    },
    email: 'exemptions@aurora-techpark.example',
  },
  {
    name: 'Zeynep Kılıç',
    role: { en: 'Venture Office Coordinator', tr: 'Girişim Ofisi Koordinatörü' },
    affiliation: {
      en: 'Pre-incubation, incubation and mentor matching',
      tr: 'Ön kuluçka, kuluçka ve mentor eşleştirme',
    },
    email: 'ventures@aurora-techpark.example',
  },
]

const teamEn = {
  eyebrow: 'Our team',
  title: 'The people who run the campus.',
  description:
    'A board drawn from the university and the region’s industry sets the direction; a small management team makes it work day to day.',
  boardTitle: 'Board of Directors',
  boardDescription: 'Appointed by the shareholders for a three-year term.',
  managementTitle: 'Management Team',
  managementDescription:
    'Your first contacts for incentives, exemptions and the venture programmes.',
  write: 'Send an email',
}

const teamTr: typeof teamEn = {
  eyebrow: 'Ekibimiz',
  title: 'Kampüsü yöneten insanlar.',
  description:
    'Üniversiteden ve bölge sanayisinden gelen yönetim kurulu yönü belirler; küçük bir yönetim ekibi bunu her gün hayata geçirir.',
  boardTitle: 'Yönetim Kurulu',
  boardDescription: 'Ortaklar tarafından üç yıllık görev süresi için atanır.',
  managementTitle: 'Yönetim Ekibi',
  managementDescription: 'Teşvik, muafiyet ve girişim programları için ilk iletişim noktalarınız.',
  write: 'E-posta gönder',
}

export const techParkTeamCopy = { en: teamEn, tr: teamTr }

export interface TechParkProgram {
  id: string
  name: LocalizedText
  duration: LocalizedText
  audience: LocalizedText
  summary: LocalizedText
  benefits: LocalizedText[]
}

export const techParkPrograms: TechParkProgram[] = [
  {
    id: 'pre-incubation',
    name: { en: 'Pre-incubation', tr: 'Ön kuluçka' },
    duration: { en: '6 months', tr: '6 ay' },
    audience: {
      en: 'Researchers and students with an idea, before there is a company',
      tr: 'Henüz şirketi olmayan, fikir sahibi araştırmacı ve öğrenciler',
    },
    summary: {
      en: 'Test whether the idea has a market before you found anything.',
      tr: 'Bir şey kurmadan önce fikrin pazarı olup olmadığını sınayın.',
    },
    benefits: [
      { en: 'A desk in the shared studio', tr: 'Ortak stüdyoda çalışma alanı' },
      { en: 'Weekly customer-discovery sessions', tr: 'Haftalık müşteri keşfi oturumları' },
      { en: 'Help with the first grant application', tr: 'İlk hibe başvurusuna destek' },
    ],
  },
  {
    id: 'incubation',
    name: { en: 'Incubation', tr: 'Kuluçka' },
    duration: { en: '24 months', tr: '24 ay' },
    audience: {
      en: 'Companies under three years old with a working prototype',
      tr: 'Çalışan prototipi olan, üç yaşından küçük şirketler',
    },
    summary: {
      en: 'An office, the labs and a mentor while the product finds its first customers.',
      tr: 'Ürün ilk müşterilerini bulurken ofis, laboratuvarlar ve mentor.',
    },
    benefits: [
      { en: 'Subsidised office for two years', tr: 'İki yıl indirimli ofis' },
      {
        en: 'Booked hours in the prototype labs',
        tr: 'Prototip laboratuvarlarında ayrılmış saatler',
      },
      { en: 'A named mentor from industry', tr: 'Sanayiden atanmış bir mentor' },
      { en: 'Tax exemptions from day one', tr: 'İlk günden vergi muafiyetleri' },
    ],
  },
  {
    id: 'acceleration',
    name: { en: 'Scale-up', tr: 'Hızlandırma' },
    duration: { en: '12 weeks', tr: '12 hafta' },
    audience: {
      en: 'Resident companies with revenue, ready for new markets',
      tr: 'Geliri olan ve yeni pazarlara hazır kampüs şirketleri',
    },
    summary: {
      en: 'A focused track for industrial pilots, exports and investor readiness.',
      tr: 'Sanayi pilotları, ihracat ve yatırıma hazırlık için odaklı bir program.',
    },
    benefits: [
      {
        en: 'Pilot introductions to partner factories',
        tr: 'Ortak fabrikalarla pilot bağlantıları',
      },
      { en: 'Export and trade-fair support', tr: 'İhracat ve fuar desteği' },
      { en: 'Demo day with regional investors', tr: 'Bölge yatırımcılarıyla demo günü' },
    ],
  },
  {
    id: 'rd-support',
    name: { en: 'R&D support desk', tr: 'Ar-Ge destek masası' },
    duration: { en: 'Ongoing', tr: 'Sürekli' },
    audience: {
      en: 'Every resident company',
      tr: 'Tüm kampüs şirketleri',
    },
    summary: {
      en: 'The incentives and exemptions team on call for the paperwork.',
      tr: 'Evrak işleri için teşvik ve muafiyet ekibi yanınızda.',
    },
    benefits: [
      {
        en: 'Grant and incentive calls, matched to you',
        tr: 'Size uygun hibe ve teşvik çağrıları',
      },
      {
        en: 'Monthly exemption declarations checked',
        tr: 'Aylık muafiyet bildirimlerinin kontrolü',
      },
      { en: 'Project reporting templates', tr: 'Proje raporlama şablonları' },
    ],
  },
]

const programsEn = {
  eyebrow: 'Programs',
  title: 'A programme for every stage.',
  description:
    'From an idea on a whiteboard to a company exporting from the campus, pick the track that matches where you are.',
  duration: 'Duration',
  audience: 'Who it is for',
  benefits: 'What you get',
  apply: 'Apply',
  stepsTitle: 'How applying works',
  steps: [
    ['Send the form', 'A short description of the team and the technology.'],
    ['Meet the venture office', 'A 30-minute call to find the right programme.'],
    ['Pitch to the committee', 'Ten minutes and questions, once a month.'],
    ['Move in', 'Contract, keys and your first mentor meeting.'],
  ] as [string, string][],
  faqTitle: 'Questions we are asked',
  faq: [
    [
      'Do we need a company to apply?',
      'Not for pre-incubation. Incubation and scale-up need a registered company.',
    ],
    [
      'What does it cost?',
      'Pre-incubation is free. Incubation offices are subsidised for two years; the scale-up track is free for residents.',
    ],
    [
      'When are the deadlines?',
      'Applications are read every month; the winter residency cohort closes on October 18.',
    ],
  ] as [string, string][],
}

const programsTr: typeof programsEn = {
  eyebrow: 'Programlar',
  title: 'Her aşama için bir program.',
  description:
    'Tahtadaki bir fikirden kampüsten ihracat yapan bir şirkete kadar; bulunduğunuz aşamaya uyan programı seçin.',
  duration: 'Süre',
  audience: 'Kimler için',
  benefits: 'Neler sunuyor',
  apply: 'Başvur',
  stepsTitle: 'Başvuru nasıl işler',
  steps: [
    ['Formu gönderin', 'Ekip ve teknoloji hakkında kısa bir açıklama.'],
    ['Girişim ofisiyle görüşün', 'Doğru programı bulmak için 30 dakikalık bir görüşme.'],
    ['Komiteye sunun', 'Ayda bir; on dakika sunum ve sorular.'],
    ['Taşının', 'Sözleşme, anahtarlar ve ilk mentor görüşmesi.'],
  ],
  faqTitle: 'Sık sorulan sorular',
  faq: [
    [
      'Başvurmak için şirket gerekli mi?',
      'Ön kuluçka için hayır. Kuluçka ve hızlandırma için kayıtlı bir şirket gerekir.',
    ],
    [
      'Ücreti nedir?',
      'Ön kuluçka ücretsizdir. Kuluçka ofisleri iki yıl indirimlidir; hızlandırma programı kampüs şirketleri için ücretsizdir.',
    ],
    [
      'Son başvuru tarihleri ne zaman?',
      'Başvurular her ay değerlendirilir; kış dönemi yerleşim başvuruları 18 Ekim’de kapanır.',
    ],
  ],
}

export const techParkProgramsCopy = { en: programsEn, tr: programsTr }
