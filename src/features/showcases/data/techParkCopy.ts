import type { LocalizedText } from '@/features/showcases/types'

/**
 * The landing page and the company directory are two routes of one site, so the header, the
 * navigation, and the shared labels are written once here rather than copied into both.
 */
export const techParkCopy = {
  en: {
    tagline: 'Technology campus',
    nav: ['Campus', 'Programs', 'Companies', 'Contact'],
    eyebrow: 'Build what comes next',
    title: 'Where ambitious technology companies become category leaders.',
    description:
      'An applied innovation campus connecting founders, research teams, industry partners, and global capital in one productive ecosystem.',
    primary: 'Apply to the campus',
    secondary: 'Explore programs',
    metrics: [
      ['Resident companies', 148, '+18 this year'],
      ['R&D professionals', 3200, '42 nationalities'],
      ['Active patents', 286, 'Across 9 sectors'],
      ['Export markets', 34, 'From one campus'],
    ] as const,
    capabilitiesTitle: 'Infrastructure for serious invention',
    capabilitiesDescription:
      'The right technical environment, commercial network, and operating support—ready when the team is.',
    capabilities: [
      [
        'Prototype laboratories',
        'Electronics, robotics, biotech, and clean-room facilities bookable by resident teams.',
      ],
      [
        'Scale-up programs',
        'Focused tracks for product validation, industrial pilots, exports, and investor readiness.',
      ],
      [
        'Enterprise network',
        'Structured access to procurement teams, mentors, universities, and global partners.',
      ],
    ] as const,
    programTitle: 'A campus designed around momentum',
    programText:
      'From a first technical hypothesis to an international commercial contract, every stage has a place here.',
    programSteps: ['Validate in shared labs', 'Pilot with industry', 'Scale into new markets'],
    statsEyebrow: 'Campus in numbers',
    statsTitle: 'What the campus actually runs on',
    statsDescription:
      'The figures behind the headline: the space, the shared equipment, the money moving through it, and the people it takes.',
    sectorShareTitle: 'Residents by sector',
    sectorShareNote: 'The five largest, as a share of all resident companies.',
    stripTitle: 'In residence',
    stripNote: '148 companies across twelve sectors.',
    allCompanies: 'See the whole directory',
    directoryTitle: 'Resident companies',
    directoryDescription:
      'Every team in residence, with the sector they work in, the stage they are at, and whether they are hiring.',
    backToCampus: 'Back to the campus',
    backToDirectory: 'All resident companies',
    about: 'About',
    expertiseTitle: 'Areas of expertise',
    workTitle: 'Products and projects',
    productLabel: 'Product',
    projectLabel: 'Project',
    contactTitle: 'Get in touch',
    websiteLabel: 'Website',
    emailLabel: 'Email',
    phoneLabel: 'Phone',
    atAGlance: 'At a glance',
    sectorLabel: 'Sector',
    stageLabel: 'Stage',
    foundedLabel: 'Founded',
    joinedLabel: 'On campus since',
    headcountLabel: 'Team size',
    buildingLabel: 'Building',
    openRolesTitle: 'Open roles',
    openRolesNone: 'This team is not hiring at the moment.',
    openRolesLead: 'Open one to see what the role involves, and apply to it directly.',
    skillsLabel: 'What you will need',
    applyLabel: 'Apply for this role',
    positionsOne: '1 position',
    positionsMany: 'positions',
    neighbours: 'Others in this sector',
    contactCompany: 'Contact the team',
    companyNotFound: 'No company with that name is in residence.',
    sectorFilter: 'All sectors',
    loadMore: 'Load more companies',
    allShown: 'That is every company in this list.',
    founded: 'Founded',
    people: 'people',
    hiring: 'Hiring',
    updatesTitle: 'News and announcements',
    updatesDescription: 'What changed on campus this month.',
    allUpdates: 'All updates',
    news: 'News',
    announcement: 'Announcement',
    ctaTitle: 'Bring your next breakthrough to Aurora.',
    ctaText: 'Applications for the winter residency cohort close on October 18.',
  },
  tr: {
    tagline: 'Teknoloji kampüsü',
    nav: ['Kampüs', 'Programlar', 'Şirketler', 'İletişim'],
    eyebrow: 'Geleceği burada kurun',
    title: 'İddialı teknoloji şirketlerinin kategori liderine dönüştüğü yer.',
    description:
      'Girişimcileri, araştırma ekiplerini, sanayi ortaklarını ve küresel sermayeyi üretken bir ekosistemde buluşturan uygulamalı inovasyon kampüsü.',
    primary: 'Kampüse başvur',
    secondary: 'Programları keşfet',
    metrics: [
      ['Yerleşik şirket', 148, 'Bu yıl +18'],
      ['Ar-Ge profesyoneli', 3200, '42 farklı ülke'],
      ['Aktif patent', 286, '9 farklı sektörde'],
      ['İhracat pazarı', 34, 'Tek kampüsten'],
    ] as const,
    capabilitiesTitle: 'Gerçek inovasyon için altyapı',
    capabilitiesDescription:
      'Doğru teknik ortam, ticari ağ ve operasyon desteği; ekibiniz hazır olduğunda sizi bekliyor.',
    capabilities: [
      [
        'Prototip laboratuvarları',
        'Elektronik, robotik, biyoteknoloji ve temiz oda tesisleri ekiplerin kullanımına açık.',
      ],
      [
        'Büyüme programları',
        'Ürün doğrulama, endüstriyel pilot, ihracat ve yatırım hazırlığına odaklı programlar.',
      ],
      [
        'Kurumsal ağ',
        'Satın alma ekipleri, mentorlar, üniversiteler ve küresel ortaklarla yapılandırılmış erişim.',
      ],
    ] as const,
    programTitle: 'Hız kazanmak için tasarlanan kampüs',
    programText:
      'İlk teknik hipotezden uluslararası ticari sözleşmeye kadar her aşamanın burada bir karşılığı var.',
    programSteps: [
      'Ortak laboratuvarda doğrula',
      'Sanayi ile pilot yap',
      'Yeni pazarlara ölçeklen',
    ],
    statsEyebrow: 'Rakamlarla kampüs',
    statsTitle: 'Kampüsü ayakta tutan rakamlar',
    statsDescription:
      'Manşetin arkasındaki veriler: alan, ortak ekipman, kampüsten geçen kaynak ve bunun için gereken insan.',
    sectorShareTitle: 'Sektöre göre yerleşikler',
    sectorShareNote: 'Tüm yerleşik şirketler içinde en büyük beş sektörün payı.',
    stripTitle: 'Kampüste',
    stripNote: 'On iki sektörde 148 şirket.',
    allCompanies: 'Tüm dizini gör',
    directoryTitle: 'Yerleşik şirketler',
    directoryDescription:
      'Kampüsteki her ekip; çalıştığı sektör, bulunduğu aşama ve işe alım yapıp yapmadığıyla birlikte.',
    backToCampus: 'Kampüse dön',
    backToDirectory: 'Tüm yerleşik şirketler',
    about: 'Hakkında',
    expertiseTitle: 'Uzmanlık alanları',
    workTitle: 'Ürünler ve projeler',
    productLabel: 'Ürün',
    projectLabel: 'Proje',
    contactTitle: 'İletişim',
    websiteLabel: 'Web sitesi',
    emailLabel: 'E-posta',
    phoneLabel: 'Telefon',
    atAGlance: 'Künye',
    sectorLabel: 'Sektör',
    stageLabel: 'Aşama',
    foundedLabel: 'Kuruluş',
    joinedLabel: 'Kampüste',
    headcountLabel: 'Ekip büyüklüğü',
    buildingLabel: 'Bina',
    openRolesTitle: 'Açık pozisyonlar',
    openRolesNone: 'Bu ekip şu anda işe alım yapmıyor.',
    openRolesLead: 'Pozisyonu açarak ne iş olduğunu görebilir, doğrudan başvurabilirsiniz.',
    skillsLabel: 'Aranan yetkinlikler',
    applyLabel: 'Bu pozisyona başvur',
    positionsOne: '1 pozisyon',
    positionsMany: 'pozisyon',
    neighbours: 'Bu sektördeki diğerleri',
    contactCompany: 'Ekiple iletişime geç',
    companyNotFound: 'Bu isimde yerleşik bir şirket yok.',
    sectorFilter: 'Tüm sektörler',
    loadMore: 'Daha fazla şirket yükle',
    allShown: 'Bu listedeki tüm şirketler gösterildi.',
    founded: 'Kuruluş',
    people: 'kişi',
    hiring: 'İşe alıyor',
    updatesTitle: 'Haberler ve duyurular',
    updatesDescription: 'Bu ay kampüste neler değişti.',
    allUpdates: 'Tüm güncellemeler',
    news: 'Haber',
    announcement: 'Duyuru',
    ctaTitle: 'Sıradaki büyük fikrinizi Aurora’ya taşıyın.',
    ctaText: 'Kış dönemi yerleşim programı başvuruları 18 Ekim’de kapanıyor.',
  },
}

/**
 * The site header, for whichever route family the reader arrived through: the admin preview
 * and the standalone page differ only in their root, and a link that crossed between them
 * would drop the reader out of the example they were looking at.
 */
export function techParkLinks(rootPath: string): { href: string; label: LocalizedText }[] {
  const targets = [
    rootPath,
    `${rootPath}#section-1`,
    `${rootPath}/companies`,
    `${rootPath}#section-3`,
  ]

  return targets.map((href, index) => ({
    href,
    label: {
      en: techParkCopy.en.nav[index] ?? '',
      tr: techParkCopy.tr.nav[index] ?? '',
    },
  }))
}

/**
 * No logos to ship, so the mark is the name: the initials of the first two words, or the
 * first two letters when the name is a single word.
 */
export function techParkMonogram(name: string): string {
  const words = name.split(' ').filter(Boolean)
  const initials =
    words.length > 1 ? `${words[0]?.charAt(0) ?? ''}${words[1]?.charAt(0) ?? ''}` : name.slice(0, 2)

  return initials.toLocaleUpperCase()
}
