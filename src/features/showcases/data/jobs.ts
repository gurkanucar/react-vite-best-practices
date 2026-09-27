import type { ShowcaseJob } from '@/features/showcases/types'

export const showcaseJobs: ShowcaseJob[] = [
  {
    slug: 'senior-frontend-engineer',
    title: { en: 'Senior Frontend Engineer', tr: 'Kıdemli Önyüz Geliştirici' },
    company: 'Lumen Analytics',
    companyInitials: 'LA',
    companyColor: '#3157d5',
    location: { en: 'Ankara, Türkiye', tr: 'Ankara, Türkiye' },
    department: { en: 'Product engineering', tr: 'Ürün mühendisliği' },
    employmentType: 'fullTime',
    workMode: 'hybrid',
    experience: { en: '5+ years', tr: '5+ yıl' },
    salary: { en: '₺110k–₺145k / month', tr: 'Aylık ₺110 bin–₺145 bin' },
    summary: {
      en: 'Shape the product surfaces that turn complex industrial data into clear decisions.',
      tr: 'Karmaşık endüstriyel verileri net kararlara dönüştüren ürün deneyimlerini şekillendirin.',
    },
    description: [
      {
        en: 'Lumen builds operational intelligence tools for energy and mobility teams. You will join a small product group with direct access to customers, designers, and the data platform.',
        tr: 'Lumen, enerji ve mobilite ekipleri için operasyonel zekâ araçları geliştiriyor. Müşterilere, tasarımcılara ve veri platformuna doğrudan erişimi olan küçük bir ürün ekibine katılacaksınız.',
      },
      {
        en: 'This is a hands-on role for an engineer who cares about information architecture, resilient component systems, and shipping useful software every week.',
        tr: 'Bu rol; bilgi mimarisine, dayanıklı bileşen sistemlerine ve her hafta faydalı yazılım sunmaya önem veren uygulamacı bir geliştirici içindir.',
      },
    ],
    responsibilities: [
      {
        en: 'Lead the frontend architecture of our monitoring and planning products.',
        tr: 'İzleme ve planlama ürünlerimizin önyüz mimarisine liderlik etmek.',
      },
      {
        en: 'Turn dense data workflows into accessible, responsive interfaces.',
        tr: 'Yoğun veri iş akışlarını erişilebilir ve duyarlı arayüzlere dönüştürmek.',
      },
      {
        en: 'Pair with product and platform engineers from discovery through release.',
        tr: 'Keşiften yayına kadar ürün ve platform geliştiricileriyle birlikte çalışmak.',
      },
      {
        en: 'Improve performance, testing discipline, and the shared component library.',
        tr: 'Performansı, test disiplinini ve ortak bileşen kütüphanesini geliştirmek.',
      },
    ],
    qualifications: [
      {
        en: 'Strong TypeScript and React experience in production products.',
        tr: 'Canlı ürünlerde güçlü TypeScript ve React deneyimi.',
      },
      {
        en: 'A practical understanding of accessibility and browser performance.',
        tr: 'Erişilebilirlik ve tarayıcı performansı konusunda uygulamalı bilgi.',
      },
      {
        en: 'Clear written communication and comfort with product trade-offs.',
        tr: 'Güçlü yazılı iletişim ve ürün ödünleşimleriyle çalışma rahatlığı.',
      },
    ],
    benefits: [
      { en: 'Flexible hybrid schedule', tr: 'Esnek hibrit çalışma' },
      { en: 'Learning budget', tr: 'Eğitim bütçesi' },
      { en: 'Private health insurance', tr: 'Özel sağlık sigortası' },
      { en: 'Campus shuttle', tr: 'Kampüs servisi' },
    ],
    skills: ['React', 'TypeScript', 'Design systems', 'Testing'],
    postedAt: '2026-09-22',
    expiresAt: '2026-10-24',
    applicants: 28,
    status: 'published',
  },
  {
    slug: 'computer-vision-researcher',
    title: { en: 'Computer Vision Researcher', tr: 'Bilgisayarlı Görü Araştırmacısı' },
    company: 'Sablon AI',
    companyInitials: 'SA',
    companyColor: '#7447d8',
    location: { en: 'Istanbul, Türkiye', tr: 'İstanbul, Türkiye' },
    department: { en: 'Applied research', tr: 'Uygulamalı araştırma' },
    employmentType: 'fullTime',
    workMode: 'hybrid',
    experience: { en: '3+ years', tr: '3+ yıl' },
    salary: { en: 'Competitive', tr: 'Rekabetçi' },
    summary: {
      en: 'Develop perception systems for precise, low-latency industrial inspection.',
      tr: 'Hassas ve düşük gecikmeli endüstriyel denetim için algı sistemleri geliştirin.',
    },
    description: [
      {
        en: 'Work with an applied AI team taking visual models from experiments to factory floors.',
        tr: 'Görsel modelleri deneylerden fabrika sahalarına taşıyan uygulamalı yapay zekâ ekibiyle çalışın.',
      },
    ],
    responsibilities: [
      {
        en: 'Design and evaluate vision models.',
        tr: 'Görü modelleri tasarlamak ve değerlendirmek.',
      },
      {
        en: 'Build reproducible training pipelines.',
        tr: 'Tekrarlanabilir eğitim hatları kurmak.',
      },
    ],
    qualifications: [
      { en: 'Python and PyTorch in production.', tr: 'Canlı ortamda Python ve PyTorch deneyimi.' },
      { en: 'Strong experimental discipline.', tr: 'Güçlü deney disiplini.' },
    ],
    benefits: [
      { en: 'Conference budget', tr: 'Konferans bütçesi' },
      { en: 'GPU lab access', tr: 'GPU laboratuvarı erişimi' },
    ],
    skills: ['Python', 'PyTorch', 'OpenCV'],
    postedAt: '2026-09-20',
    expiresAt: '2026-10-20',
    applicants: 16,
    status: 'published',
  },
  {
    slug: 'product-designer',
    title: { en: 'Product Designer', tr: 'Ürün Tasarımcısı' },
    company: 'Kora Mobility',
    companyInitials: 'KM',
    companyColor: '#0c8c78',
    location: { en: 'Ankara, Türkiye', tr: 'Ankara, Türkiye' },
    department: { en: 'Product', tr: 'Ürün' },
    employmentType: 'fullTime',
    workMode: 'onSite',
    experience: { en: '4+ years', tr: '4+ yıl' },
    salary: { en: '₺90k–₺120k / month', tr: 'Aylık ₺90 bin–₺120 bin' },
    summary: {
      en: 'Design calm, legible tools for teams coordinating thousands of daily journeys.',
      tr: 'Her gün binlerce yolculuğu koordine eden ekipler için sade ve okunaklı araçlar tasarlayın.',
    },
    description: [
      {
        en: 'Own research and interaction design across our fleet suite.',
        tr: 'Filo ürün grubumuzdaki araştırma ve etkileşim tasarımını yönetin.',
      },
    ],
    responsibilities: [
      {
        en: 'Run field research with operators.',
        tr: 'Operatörlerle saha araştırmaları yürütmek.',
      },
      {
        en: 'Prototype and test critical workflows.',
        tr: 'Kritik iş akışlarını prototiplemek ve test etmek.',
      },
    ],
    qualifications: [
      {
        en: 'A portfolio of complex product work.',
        tr: 'Karmaşık ürün çalışmalarından oluşan portföy.',
      },
      { en: 'Strong systems thinking.', tr: 'Güçlü sistem düşüncesi.' },
    ],
    benefits: [
      { en: 'Mobility allowance', tr: 'Ulaşım desteği' },
      { en: 'Flexible hours', tr: 'Esnek saatler' },
    ],
    skills: ['Figma', 'Research', 'Prototyping'],
    postedAt: '2026-09-18',
    expiresAt: '2026-10-18',
    applicants: 34,
    status: 'published',
  },
  {
    slug: 'growth-marketing-lead',
    title: { en: 'Growth Marketing Lead', tr: 'Büyüme Pazarlaması Lideri' },
    company: 'Meriç Climate',
    companyInitials: 'MC',
    companyColor: '#d46b08',
    location: { en: 'Remote, Türkiye', tr: 'Uzaktan, Türkiye' },
    department: { en: 'Growth', tr: 'Büyüme' },
    employmentType: 'fullTime',
    workMode: 'remote',
    experience: { en: '5+ years', tr: '5+ yıl' },
    salary: { en: 'Competitive', tr: 'Rekabetçi' },
    summary: {
      en: 'Build the commercial narrative for measurable climate infrastructure.',
      tr: 'Ölçülebilir iklim altyapısı için ticari anlatıyı oluşturun.',
    },
    description: [
      {
        en: 'Lead a focused B2B growth program across Europe.',
        tr: 'Avrupa genelinde odaklı bir B2B büyüme programına liderlik edin.',
      },
    ],
    responsibilities: [
      {
        en: 'Own positioning, campaigns, and pipeline.',
        tr: 'Konumlandırma, kampanya ve satış hattını yönetin.',
      },
    ],
    qualifications: [{ en: 'B2B SaaS growth experience.', tr: 'B2B SaaS büyüme deneyimi.' }],
    benefits: [
      { en: 'Remote-first', tr: 'Uzaktan öncelikli' },
      { en: 'Home office budget', tr: 'Ev ofis bütçesi' },
    ],
    skills: ['Positioning', 'Demand gen', 'Analytics'],
    postedAt: '2026-09-16',
    expiresAt: '2026-10-16',
    applicants: 21,
    status: 'published',
  },
  {
    slug: 'embedded-systems-engineer',
    title: { en: 'Embedded Systems Engineer', tr: 'Gömülü Sistemler Mühendisi' },
    company: 'Aurora Orbital',
    companyInitials: 'AO',
    companyColor: '#b42318',
    location: { en: 'Ankara, Türkiye', tr: 'Ankara, Türkiye' },
    department: { en: 'Flight systems', tr: 'Uçuş sistemleri' },
    employmentType: 'fullTime',
    workMode: 'onSite',
    experience: { en: '3+ years', tr: '3+ yıl' },
    salary: { en: '₺105k–₺135k / month', tr: 'Aylık ₺105 bin–₺135 bin' },
    summary: {
      en: 'Build reliable control software for small satellite payloads.',
      tr: 'Küçük uydu yükleri için güvenilir kontrol yazılımı geliştirin.',
    },
    description: [
      {
        en: 'Join the team responsible for payload electronics and flight software.',
        tr: 'Yük elektroniği ve uçuş yazılımından sorumlu ekibe katılın.',
      },
    ],
    responsibilities: [
      {
        en: 'Develop and verify embedded firmware.',
        tr: 'Gömülü yazılım geliştirmek ve doğrulamak.',
      },
    ],
    qualifications: [
      { en: 'C/C++, RTOS, and hardware debugging.', tr: 'C/C++, RTOS ve donanım hata ayıklama.' },
    ],
    benefits: [
      { en: 'Private health insurance', tr: 'Özel sağlık sigortası' },
      { en: 'Lab access', tr: 'Laboratuvar erişimi' },
    ],
    skills: ['C++', 'RTOS', 'CAN'],
    postedAt: '2026-09-14',
    expiresAt: '2026-10-14',
    applicants: 12,
    status: 'published',
  },
  {
    slug: 'people-operations-specialist',
    title: { en: 'People Operations Specialist', tr: 'İnsan ve Kültür Uzmanı' },
    company: 'Cellwise Bio',
    companyInitials: 'CB',
    companyColor: '#18794e',
    location: { en: 'Ankara, Türkiye', tr: 'Ankara, Türkiye' },
    department: { en: 'People', tr: 'İnsan ve kültür' },
    employmentType: 'partTime',
    workMode: 'hybrid',
    experience: { en: '2+ years', tr: '2+ yıl' },
    salary: { en: 'Negotiable', tr: 'Görüşülebilir' },
    summary: {
      en: 'Create thoughtful employee experiences for a growing research team.',
      tr: 'Büyüyen bir araştırma ekibi için özenli çalışan deneyimleri oluşturun.',
    },
    description: [
      {
        en: 'Support the everyday systems behind a healthy laboratory culture.',
        tr: 'Sağlıklı bir laboratuvar kültürünün arkasındaki günlük sistemleri destekleyin.',
      },
    ],
    responsibilities: [
      {
        en: 'Coordinate onboarding and people programs.',
        tr: 'İşe alım sonrası uyum ve çalışan programlarını koordine etmek.',
      },
    ],
    qualifications: [
      { en: 'People operations or HR experience.', tr: 'İnsan ve kültür veya İK deneyimi.' },
    ],
    benefits: [{ en: 'Flexible schedule', tr: 'Esnek çalışma' }],
    skills: ['Onboarding', 'HRIS', 'Operations'],
    postedAt: '2026-09-12',
    expiresAt: '2026-10-12',
    applicants: 19,
    status: 'draft',
  },
  {
    slug: 'data-platform-intern',
    title: { en: 'Data Platform Intern', tr: 'Veri Platformu Stajyeri' },
    company: 'Lumen Analytics',
    companyInitials: 'LA',
    companyColor: '#3157d5',
    location: { en: 'Ankara, Türkiye', tr: 'Ankara, Türkiye' },
    department: { en: 'Data platform', tr: 'Veri platformu' },
    employmentType: 'internship',
    workMode: 'hybrid',
    experience: { en: 'Entry level', tr: 'Başlangıç seviyesi' },
    salary: { en: 'Paid internship', tr: 'Ücretli staj' },
    summary: {
      en: 'Learn how production data products are built, observed, and improved.',
      tr: 'Canlı veri ürünlerinin nasıl geliştirildiğini, izlendiğini ve iyileştirildiğini öğrenin.',
    },
    description: [
      {
        en: 'A twelve-week program with a scoped production project.',
        tr: 'Kapsamı belirlenmiş canlı proje içeren on iki haftalık program.',
      },
    ],
    responsibilities: [
      {
        en: 'Build a monitored data pipeline with a mentor.',
        tr: 'Mentorla birlikte izlenebilir bir veri hattı geliştirmek.',
      },
    ],
    qualifications: [{ en: 'Foundational Python and SQL.', tr: 'Temel Python ve SQL bilgisi.' }],
    benefits: [
      { en: 'Mentorship', tr: 'Mentorluk' },
      { en: 'Lunch', tr: 'Öğle yemeği' },
    ],
    skills: ['Python', 'SQL', 'dbt'],
    postedAt: '2026-09-10',
    expiresAt: '2026-10-10',
    applicants: 43,
    status: 'published',
  },
  {
    slug: 'business-development-manager',
    title: { en: 'Business Development Manager', tr: 'İş Geliştirme Müdürü' },
    company: 'NordGrid Energy',
    companyInitials: 'NG',
    companyColor: '#006d75',
    location: { en: 'Istanbul, Türkiye', tr: 'İstanbul, Türkiye' },
    department: { en: 'Commercial', tr: 'Ticari' },
    employmentType: 'contract',
    workMode: 'remote',
    experience: { en: '6+ years', tr: '6+ yıl' },
    salary: { en: 'Base + commission', tr: 'Sabit + prim' },
    summary: {
      en: 'Turn grid-modernization partnerships into durable commercial programs.',
      tr: 'Şebeke modernizasyonu ortaklıklarını kalıcı ticari programlara dönüştürün.',
    },
    description: [
      {
        en: 'Develop enterprise and public-sector partnerships.',
        tr: 'Kurumsal ve kamu sektörü ortaklıkları geliştirin.',
      },
    ],
    responsibilities: [
      {
        en: 'Own strategic accounts from first meeting to contract.',
        tr: 'Stratejik hesapları ilk görüşmeden sözleşmeye kadar yönetin.',
      },
    ],
    qualifications: [
      {
        en: 'Energy-sector enterprise sales experience.',
        tr: 'Enerji sektöründe kurumsal satış deneyimi.',
      },
    ],
    benefits: [
      { en: 'Commission plan', tr: 'Prim planı' },
      { en: 'Travel support', tr: 'Seyahat desteği' },
    ],
    skills: ['Enterprise sales', 'Energy', 'Partnerships'],
    postedAt: '2026-09-08',
    expiresAt: '2026-10-08',
    applicants: 9,
    status: 'closed',
  },
]

export function findShowcaseJob(slug: string | undefined): ShowcaseJob | undefined {
  return showcaseJobs.find((job) => job.slug === slug)
}
