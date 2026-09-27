import type { LocalizedText } from '@/features/showcases/types'

/**
 * Where the campus is and how to reach it. Made up on purpose: the phone number uses the
 * 555 range and the addresses the reserved `.example` domain, so nobody real gets the calls.
 */
export const techParkContact = {
  phone: '+90 284 555 01 20',
  email: 'hello@aurora-techpark.example',
  kep: 'aurora@kep.example',
  address: {
    en: 'Aurora University North Campus, Innovation Avenue 12',
    tr: 'Aurora Üniversitesi Kuzey Yerleşkesi, İnovasyon Caddesi No: 12',
  } satisfies LocalizedText,
  city: '22100 Edirne',
  hours: {
    en: 'Weekdays 08:30–17:30',
    tr: 'Hafta içi 08:30–17:30',
  } satisfies LocalizedText,
  /** The main gate, where the map puts its pin. */
  position: [41.6771, 26.5557] as [number, number],
}

const en = {
  eyebrow: 'About Aurora',
  title: 'A campus where research turns into companies.',
  description:
    'Aurora Tech Park brings the university’s laboratories, industry and investors onto one campus, so an idea can go from a paper to a product without changing address.',
  visionTitle: 'Our vision',
  vision: [
    'To be the place in the region where information technology and the other advanced fields meet, and a campus that reduces the country’s dependence on imported technology.',
    'A tech park that is more than an industrial zone: a scientific centre fed by art and culture, where companies reach national and international finance and grants from a single desk.',
  ],
  missionTitle: 'Our mission',
  mission: [
    'To give domestic and international companies in advanced technology, innovation and software world-class, cost-effective tech park services that let them use what they have better and create what they do not.',
    'To build the structures that make companies and universities work together, help high-potential start-ups get founded and help small companies grow.',
  ],
  goalsTitle: 'What we do',
  goalsDescription:
    'Aurora’s aim is a lasting, research-led technology base for the region. In practice that means:',
  goals: [
    'Opening the university’s laboratories and know-how to the companies on campus, so academic work reaches industry.',
    'Bringing industry’s problems back to the faculties, so research answers real questions.',
    'Encouraging academics to found companies or join existing ones as partners.',
    'Carrying new R&D companies through their first years with pre-incubation and incubation programmes.',
    'Running training, seminars and mentoring that help ventures grow.',
    'Providing the infrastructure R&D projects need, from clean rooms to test networks.',
    'Making sure companies benefit from the tax exemptions of the Technology Development Zones Law, and reporting on it.',
    'Supporting the employment and growth of academics, students and qualified R&D specialists.',
    'Leading the partnerships that connect local and international stakeholders.',
    'Raising public awareness of R&D, innovation and technology entrepreneurship.',
  ],
  structureTitle: 'Company structure',
  structureDescription:
    'Aurora Tech Park Management Inc. was founded on 14 May 2009. Its shareholders are:',
  shareholders: [
    ['Aurora University Rectorate', 80],
    ['Organised Industrial Zone Directorate', 10],
    ['Regional Chamber of Commerce and Industry', 5],
    ['Regional Commodity Exchange', 5],
  ] as [string, number][],
  legalTitle: 'Legal basis',
  legalDescription:
    'The company founds, manages and runs the technology development zone under the Technology Development Zones Law No. 4691 and its implementing regulation. Its main duties are:',
  duties: [
    'Assessing applications from companies, institutions and entrepreneurs, and allocating space to those that qualify.',
    'Managing and supervising land use, construction and facility licensing.',
    'Identifying, pricing and continuously providing the services the zone needs.',
    'Spotting activity that runs against the purpose of the zone and acting on it.',
  ],
  equalityTitle: 'Equality principles',
  equality: [
    [
      'Our commitment',
      'Aurora acts on written principles that guarantee gender equality in all its work, practices and organisational processes, and takes measures against gender-based discrimination and violence.',
    ],
    [
      'Foundations',
      'The principles rest on CEDAW, Article 10 of the Constitution, Law No. 6284 on the protection of the family and the prevention of violence against women, and the Council of Europe Gender Equality Strategy.',
    ],
    [
      'In practice',
      'Every manager and every resident company’s staff receive training on equality, cultural diversity and forms of violence. Anyone who experiences or witnesses discrimination can come to the management company, which points them to the right support.',
    ],
  ] as [string, string][],
  locationTitle: 'Find the campus',
  locationDescription:
    'The main gate is on Innovation Avenue, a ten-minute walk from the city centre tram stop.',
  directions: 'Get directions',
  contactCta: 'Write to us',
}

const tr: typeof en = {
  eyebrow: 'Aurora hakkında',
  title: 'Araştırmanın şirkete dönüştüğü kampüs.',
  description:
    'Aurora Teknopark, üniversitenin laboratuvarlarını, sanayiyi ve yatırımcıları tek bir kampüste buluşturur; böylece bir fikir adres değiştirmeden makaleden ürüne ulaşır.',
  visionTitle: 'Vizyonumuz',
  vision: [
    'Bilişim teknolojileri ile diğer ileri teknoloji alanlarının buluştuğu, ülkenin teknolojide dışa bağımlılığını azaltan bölgenin öncü kampüsü olmak.',
    'Yalnızca bir sanayi bölgesi değil; sanat ve kültürle beslenen, şirketlerin ulusal ve uluslararası finansman ile hibelere tek merkezden ulaştığı bir bilim merkezi olmak.',
  ],
  missionTitle: 'Misyonumuz',
  mission: [
    'İleri teknoloji, inovasyon ve yazılım alanındaki yerli ve yabancı şirketlere, mevcut kaynaklarını daha verimli kullanmalarını ve yeni kaynak yaratmalarını sağlayan, dünya standartlarında ve uygun maliyetli teknopark hizmeti sunmak.',
    'Şirketler ile üniversiteler arasında iş birliği kuracak yapıları oluşturmak, yüksek potansiyelli girişimlerin kurulmasını ve küçük ölçekli şirketlerin büyümesini desteklemek.',
  ],
  goalsTitle: 'Neler yapıyoruz',
  goalsDescription:
    'Aurora’nın amacı, bölgede kalıcı ve Ar-Ge odaklı bir teknoloji altyapısı kurmaktır. Bunun için:',
  goals: [
    'Üniversitenin laboratuvar ve bilgi birikimini kampüsteki şirketlerin kullanımına açar; akademik bilginin sanayiye aktarılmasına aracılık eder.',
    'Sanayinin sorunlarını fakültelere taşır; araştırmaların gerçek sorulara yanıt vermesini sağlar.',
    'Akademisyenleri şirket kurmaya veya mevcut şirketlere ortak olmaya teşvik eder.',
    'Yeni kurulan Ar-Ge şirketlerini ön kuluçka ve kuluçka programlarıyla ilk yıllarında destekler.',
    'Girişimlerin gelişimine katkı sağlayacak eğitim, seminer ve mentorluk hizmetleri düzenler.',
    'Temiz odalardan test ağlarına, Ar-Ge projelerinin ihtiyaç duyduğu altyapıyı sağlar.',
    'Şirketlerin Teknoloji Geliştirme Bölgeleri Kanunu’ndaki vergi muafiyetlerinden yararlanmasını sağlar ve raporlar.',
    'Akademisyen, öğrenci ve nitelikli Ar-Ge personelinin istihdamını ve gelişimini destekler.',
    'Yerel ve uluslararası paydaşları buluşturan iş birliklerine öncülük eder.',
    'Ar-Ge, inovasyon ve teknoloji girişimciliği konusunda toplumsal farkındalık oluşturur.',
  ],
  structureTitle: 'Şirket yapısı',
  structureDescription:
    'Aurora Teknopark Yönetici A.Ş. 14 Mayıs 2009’da kurulmuştur. Ortaklık yapısı şöyledir:',
  shareholders: [
    ['Aurora Üniversitesi Rektörlüğü', 80],
    ['Organize Sanayi Bölgesi Müdürlüğü', 10],
    ['Bölge Ticaret ve Sanayi Odası', 5],
    ['Bölge Ticaret Borsası', 5],
  ],
  legalTitle: 'Yasal dayanak',
  legalDescription:
    'Şirket, 4691 sayılı Teknoloji Geliştirme Bölgeleri Kanunu ve uygulama yönetmeliği kapsamında bölgeyi kurar, yönetir ve işletir. Başlıca görevleri:',
  duties: [
    'Bölgede faaliyet göstermek isteyen şirket, kurum ve girişimcilerin başvurularını değerlendirmek ve uygun bulunanlara yer tahsis etmek.',
    'Arazi kullanımı, yapılaşma ve tesis ruhsatı süreçlerini yönetmek ve denetlemek.',
    'Bölgenin ihtiyaç duyduğu hizmetleri belirlemek, fiyatlandırmak ve kesintisiz sunmak.',
    'Bölgenin amacına aykırı faaliyetleri tespit etmek ve gerekli işlemleri yapmak.',
  ],
  equalityTitle: 'Eşitlik ilkeleri',
  equality: [
    [
      'Taahhüdümüz',
      'Aurora, tüm faaliyet, uygulama ve kurumsal süreçlerinde toplumsal cinsiyet eşitliğini güvenceye alan yazılı ilkelere göre hareket eder; cinsiyete dayalı ayrımcılık ve şiddete karşı önlem alır.',
    ],
    [
      'Dayanaklar',
      'İlkeler; CEDAW’a, Anayasa’nın 10. maddesine, 6284 sayılı Ailenin Korunması ve Kadına Karşı Şiddetin Önlenmesine Dair Kanun’a ve Avrupa Konseyi Toplumsal Cinsiyet Eşitliği Stratejisi’ne dayanır.',
    ],
    [
      'Uygulamada',
      'Tüm yöneticiler ve kampüsteki şirket çalışanları eşitlik, kültürel çeşitlilik ve şiddet türleri üzerine eğitim alır. Ayrımcılığa uğrayan veya tanık olan herkes yönetici şirkete başvurabilir; şirket kişiyi doğru destek birimine yönlendirir.',
    ],
  ],
  locationTitle: 'Kampüse ulaşım',
  locationDescription:
    'Ana giriş İnovasyon Caddesi üzerindedir; şehir merkezindeki tramvay durağına on dakika yürüme mesafesindedir.',
  directions: 'Yol tarifi al',
  contactCta: 'Bize yazın',
}

export const techParkAboutCopy = { en, tr }

const contactEn = {
  eyebrow: 'Contact',
  title: 'Tell us what you are building.',
  description:
    'Applications, office space, programmes or a press question: write to the campus desk and the right team answers within two working days.',
  formTitle: 'Send a message',
  name: 'Full name',
  namePlaceholder: 'Ada Lovelace',
  nameRequired: 'Please tell us your name.',
  email: 'Email',
  emailPlaceholder: 'you@company.com',
  emailRequired: 'We need an email address to reply to.',
  emailInvalid: 'That does not look like an email address.',
  phone: 'Phone (optional)',
  company: 'Company or institution',
  topic: 'Topic',
  topicRequired: 'Pick the topic closest to your question.',
  topics: {
    residency: 'Residency application',
    office: 'Office or lab space',
    programs: 'Incubation programmes',
    press: 'Press and media',
    other: 'Something else',
  },
  message: 'Message',
  messagePlaceholder: 'A few lines about your team and what you need.',
  messageRequired: 'Write a short message.',
  messageTooShort: 'A little more detail, please: at least 20 characters.',
  consent: 'I agree that my details are used to answer this message.',
  consentRequired: 'We can only answer if you agree.',
  submit: 'Send message',
  sentTitle: 'Message sent',
  sentDescription: (name: string) =>
    `Thank you, ${name}. The campus desk will reply within two working days.`,
  sendAnother: 'Send another message',
  detailsTitle: 'Campus desk',
  phoneLabel: 'Phone',
  emailLabel: 'Email',
  kepLabel: 'Registered email (KEP)',
  addressLabel: 'Address',
  hoursLabel: 'Office hours',
}

const contactTr: typeof contactEn = {
  eyebrow: 'İletişim',
  title: 'Ne geliştirdiğinizi anlatın.',
  description:
    'Başvuru, ofis alanı, programlar ya da basın sorusu: kampüs masasına yazın, doğru ekip iki iş günü içinde yanıt versin.',
  formTitle: 'Mesaj gönderin',
  name: 'Ad soyad',
  namePlaceholder: 'Ada Lovelace',
  nameRequired: 'Lütfen adınızı yazın.',
  email: 'E-posta',
  emailPlaceholder: 'siz@sirket.com',
  emailRequired: 'Yanıt verebilmemiz için e-posta adresi gerekli.',
  emailInvalid: 'Bu bir e-posta adresine benzemiyor.',
  phone: 'Telefon (isteğe bağlı)',
  company: 'Şirket veya kurum',
  topic: 'Konu',
  topicRequired: 'Sorunuza en yakın konuyu seçin.',
  topics: {
    residency: 'Yerleşim başvurusu',
    office: 'Ofis veya laboratuvar alanı',
    programs: 'Kuluçka programları',
    press: 'Basın ve medya',
    other: 'Diğer',
  },
  message: 'Mesaj',
  messagePlaceholder: 'Ekibiniz ve ihtiyacınız hakkında birkaç satır.',
  messageRequired: 'Kısa bir mesaj yazın.',
  messageTooShort: 'Biraz daha ayrıntı lütfen: en az 20 karakter.',
  consent: 'Bilgilerimin bu mesajı yanıtlamak için kullanılmasını kabul ediyorum.',
  consentRequired: 'Yanıt verebilmemiz için onay gerekli.',
  submit: 'Mesajı gönder',
  sentTitle: 'Mesajınız iletildi',
  sentDescription: (name: string) =>
    `Teşekkürler ${name}. Kampüs masası iki iş günü içinde yanıt verecek.`,
  sendAnother: 'Yeni mesaj gönder',
  detailsTitle: 'Kampüs masası',
  phoneLabel: 'Telefon',
  emailLabel: 'E-posta',
  kepLabel: 'KEP adresi',
  addressLabel: 'Adres',
  hoursLabel: 'Çalışma saatleri',
}

export const techParkContactCopy = { en: contactEn, tr: contactTr }

const footerEn = {
  about:
    'Aurora Tech Park is a technology campus in Edirne: a place for research, start-ups and industry to grow side by side.',
  quickLinks: 'Quick links',
  links: ['About', 'Programmes', 'Mission and vision', 'Company structure', 'Legal basis'],
  contact: 'Contact',
  newsletter: 'Stay up to date',
  newsletterText: 'Get the campus announcements and programme calls by email.',
  newsletterPlaceholder: 'Email address',
  newsletterInvalid: 'Enter a valid email address.',
  subscribe: 'Sign up',
  subscribed: 'Thanks, you are on the list.',
  rights: 'All rights reserved.',
}

const footerTr: typeof footerEn = {
  about:
    'Aurora Teknopark, Edirne’de araştırmanın, girişimlerin ve sanayinin yan yana büyüdüğü bir teknoloji kampüsüdür.',
  quickLinks: 'Hızlı bağlantılar',
  links: ['Hakkımızda', 'Programlar', 'Misyon ve vizyon', 'Şirket yapısı', 'Yasal dayanak'],
  contact: 'İletişim',
  newsletter: 'Gelişmelerden haberdar olun',
  newsletterText: 'Kampüs duyurularını ve program çağrılarını e-postayla alın.',
  newsletterPlaceholder: 'E-posta adresi',
  newsletterInvalid: 'Geçerli bir e-posta adresi girin.',
  subscribe: 'Kaydol',
  subscribed: 'Teşekkürler, listeye eklendiniz.',
  rights: 'Tüm hakları saklıdır.',
}

export const techParkFooterCopy = { en: footerEn, tr: footerTr }
