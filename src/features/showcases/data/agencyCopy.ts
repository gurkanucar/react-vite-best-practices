import type { Discipline } from './agency'
import type { BudgetBand, Service, Timeline } from './agencyLogic'

interface HeadlinePart {
  text: string
  /** Set in the italic serif, the one word the line leans on. */
  accent?: boolean
}

const en = {
  brand: 'Oda Studio',
  tagline: 'Brand & digital studio',
  nav: { work: 'Work', studio: 'Studio', services: 'Services', contact: 'Contact' },
  preview: {
    home: {
      title: 'Creative agency portfolio',
      description:
        'An editorial portfolio site: big type, a work grid with hover reveals, scroll motion and a studio story.',
    },
    work: {
      title: 'Creative agency · Work',
      description: 'A filterable project grid whose filter lives in the address.',
    },
    case: {
      title: 'Creative agency · Case study',
      description: 'A case study template with a before/after comparison slider.',
    },
    contact: {
      title: 'Creative agency · Contact',
      description: 'A project brief form and a slot picker for an intro call.',
    },
  },
  disciplines: {
    branding: 'Branding',
    web: 'Web',
    product: 'Product',
    motion: 'Motion',
    campaign: 'Campaign',
  } satisfies Record<Discipline, string>,

  home: {
    eyebrow: 'Independent studio · Istanbul & Berlin',
    headline: [
      { text: 'We design brands people ' },
      { text: 'remember.', accent: true },
    ] satisfies HeadlinePart[],
    intro:
      'Oda is a studio of 38 designers, writers and engineers. We build identities, websites and products for teams who would rather be understood than be loud.',
    startProject: 'Start a project',
    seeWork: 'See our work',
    availability: 'Booking projects for spring 2027 · ',
    watchReel: 'Watch the reel',
    reelTitle: 'Showreel 2026',
    reelCaption: 'Eight projects, seventy-two seconds, no stock footage.',
    reelClose: 'Close',
    clientsLabel: 'Some of the teams we work with',
    selectedTitle: 'Selected work',
    selectedIntro:
      'A few projects from the last three years. Each one started with a problem, not a brief.',
    allWork: 'All work',
    view: 'View',
    servicesTitle: 'What we do',
    services: [
      {
        title: 'Brand strategy & identity',
        text: 'Positioning, naming, voice and the visual system that carries them, down to the last icon.',
        deliverables: ['Positioning', 'Naming', 'Identity', 'Guidelines'],
      },
      {
        title: 'Websites',
        text: 'Editorial sites and platforms that load fast, read well and are a pleasure to update.',
        deliverables: ['Art direction', 'UX', 'Development', 'CMS'],
      },
      {
        title: 'Digital products',
        text: 'Apps and tools designed with the people who use them, and design systems your team can keep growing.',
        deliverables: ['Research', 'Product design', 'Design systems', 'Prototypes'],
      },
      {
        title: 'Motion & campaigns',
        text: 'Launch films, motion languages and campaigns that give a brand a voice when it moves.',
        deliverables: ['Motion identity', 'Launch films', 'Campaigns', 'Live visuals'],
      },
    ],
    processTitle: 'How a project runs',
    process: [
      {
        title: 'Discover',
        duration: '2–3 weeks',
        text: 'Interviews, workshops and a look at what already works. We leave with one sentence everyone agrees on.',
      },
      {
        title: 'Define',
        duration: '2 weeks',
        text: 'Strategy, structure and the first sketches, shown early and rough on purpose.',
      },
      {
        title: 'Design',
        duration: '4–8 weeks',
        text: 'One team designs and builds together, with a working review every week rather than a big reveal.',
      },
      {
        title: 'Deliver & grow',
        duration: 'Ongoing',
        text: 'Launch, then measure. Most clients keep us on to look after what we made together.',
      },
    ],
    numbers: [
      { value: '14', label: 'years in practice' },
      { value: '180+', label: 'launches' },
      { value: '32', label: 'awards' },
      { value: '38', label: 'people in two studios' },
    ],
    testimonialsTitle: 'In their words',
    previous: 'Previous quote',
    next: 'Next quote',
    awardsTitle: 'Recognition',
    awardColumns: { year: 'Year', award: 'Award', project: 'Project', honour: 'Honour' },
    teamTitle: 'The studio',
    teamIntro:
      'Small senior teams, the same people from the first workshop to launch day. No hand-offs to a team you never met.',
    ctaTitle: 'Have a project in mind?',
    ctaText: 'Tell us what you are working on. We reply to every brief within two working days.',
    ctaButton: 'Write us a brief',
    ctaOr: 'or email',
  },

  work: {
    title: 'Work',
    intro:
      'Identities, websites, products and campaigns. Filter by discipline, or scroll through all of it.',
    filterLabel: 'Filter by discipline',
    all: 'All',
    showing: (count: number) => `${count} ${count === 1 ? 'project' : 'projects'}`,
    empty: 'No projects in this discipline yet.',
    ctaTitle: 'Your project could be next.',
  },

  caseStudy: {
    backToWork: 'All work',
    client: 'Client',
    year: 'Year',
    services: 'Services',
    disciplines: 'Disciplines',
    challenge: 'The challenge',
    approach: 'Our approach',
    result: 'The result',
    compareTitle: 'Before and after',
    compareHint: 'Drag the handle, or use the arrow keys.',
    before: 'Before',
    after: 'After',
    compareLabel: 'Comparison position',
    resultsTitle: 'By the numbers',
    creditsTitle: 'Credits',
    nextProject: 'Next project',
    notFoundTitle: 'Project not found',
    notFoundText: 'This project is not in the portfolio. It may have been renamed.',
  },

  contact: {
    title: 'Tell us about your project.',
    intro:
      'A few details help us put the right people on the reply. Nothing here is binding, and rough answers are fine.',
    name: 'Your name',
    email: 'Email',
    company: 'Company',
    companyPlaceholder: 'Optional',
    services: 'What do you need?',
    serviceOptions: {
      brand: 'Brand identity',
      website: 'Website',
      product: 'Digital product',
      motion: 'Motion',
      campaign: 'Campaign',
      strategy: 'Strategy',
    } satisfies Record<Service, string>,
    budget: 'Budget',
    budgetOptions: {
      under25: 'Under €25k',
      '25to50': '€25–50k',
      '50to100': '€50–100k',
      over100: '€100k+',
    } satisfies Record<BudgetBand, string>,
    timeline: 'When do you want to start?',
    timelineOptions: {
      asap: 'As soon as possible',
      quarter: 'In 1–3 months',
      half: 'In 3–6 months',
      flexible: 'We are flexible',
    } satisfies Record<Timeline, string>,
    details: 'Project details',
    detailsPlaceholder: 'What are you making, who is it for, and what would success look like?',
    attach: 'Attach files',
    attachHint:
      'Briefs, decks or references. Up to 5 files; only their names are kept in this demo.',
    consent: 'I agree that Oda Studio may use these details to reply to my enquiry.',
    submit: 'Send brief',
    required: {
      name: 'Tell us your name.',
      email: 'Enter an email we can reply to.',
      emailInvalid: 'That email does not look right.',
      services: 'Pick at least one thing you need.',
      budget: 'Pick a budget range.',
      timeline: 'Pick a start date.',
      details: 'Tell us a little about the project.',
      detailsShort: 'A few more words, please: at least 30 characters.',
      consent: 'We need your consent to reply.',
    },
    successTitle: 'Brief received. Thank you.',
    successText: (name: string) =>
      `${name}, we will read it this week and reply within two working days.`,
    summary: 'You asked for',
    sendAnother: 'Send another brief',
    studiosTitle: 'Studios',
    emailTitle: 'New business',
    callTitle: 'Book a 20-minute intro call',
    callIntro: 'Prefer to talk first? Pick a slot with Deniz or Jonas.',
    timezone: 'Times are Istanbul time (GMT+3).',
    pickDay: 'Day',
    pickTime: 'Time',
    taken: 'Booked',
    bookCall: 'Book this slot',
    callBooked: (when: string) => `Booked for ${when}. A calendar invite is on its way.`,
    changeCall: 'Choose another slot',
  },

  footer: {
    studios: 'Studios',
    contact: 'Contact',
    follow: 'Follow',
    socials: ['Instagram', 'LinkedIn', 'Vimeo'],
    rights: 'All rights reserved.',
    note: 'A demo site. Clients, people and projects are invented.',
  },
}

export type AgencyCopy = typeof en

const tr: AgencyCopy = {
  brand: 'Oda Studio',
  tagline: 'Marka ve dijital stüdyo',
  nav: { work: 'İşler', studio: 'Stüdyo', services: 'Hizmetler', contact: 'İletişim' },
  preview: {
    home: {
      title: 'Kreatif ajans portfolyosu',
      description:
        'Editoryal bir portfolyo sitesi: büyük tipografi, üzerine gelince açılan iş kartları, kaydırma animasyonları ve stüdyo hikâyesi.',
    },
    work: {
      title: 'Kreatif ajans · İşler',
      description: 'Filtresi adres çubuğunda tutulan, süzülebilir bir proje ızgarası.',
    },
    case: {
      title: 'Kreatif ajans · Vaka çalışması',
      description: 'Öncesi/sonrası karşılaştırma kaydırıcılı bir vaka çalışması şablonu.',
    },
    contact: {
      title: 'Kreatif ajans · İletişim',
      description: 'Proje brifi formu ve tanışma görüşmesi için saat seçici.',
    },
  },
  disciplines: {
    branding: 'Marka',
    web: 'Web',
    product: 'Ürün',
    motion: 'Hareket',
    campaign: 'Kampanya',
  },

  home: {
    eyebrow: 'Bağımsız stüdyo · İstanbul ve Berlin',
    headline: [
      { text: 'İnsanların ' },
      { text: 'hatırladığı', accent: true },
      { text: ' markalar tasarlıyoruz.' },
    ],
    intro:
      'Oda; 38 tasarımcı, yazar ve yazılımcıdan oluşan bir stüdyo. Gürültü yapmak yerine anlaşılmak isteyen ekipler için kimlikler, web siteleri ve ürünler tasarlıyoruz.',
    startProject: 'Proje başlat',
    seeWork: 'İşlerimizi gör',
    availability: '2027 baharı için proje alıyoruz · ',
    watchReel: 'Tanıtım filmini izle',
    reelTitle: 'Tanıtım filmi 2026',
    reelCaption: 'Sekiz proje, yetmiş iki saniye, hazır görüntü yok.',
    reelClose: 'Kapat',
    clientsLabel: 'Birlikte çalıştığımız ekiplerden bazıları',
    selectedTitle: 'Seçili işler',
    selectedIntro: 'Son üç yılın birkaç projesi. Her biri bir brifle değil, bir sorunla başladı.',
    allWork: 'Tüm işler',
    view: 'İncele',
    servicesTitle: 'Neler yapıyoruz',
    services: [
      {
        title: 'Marka stratejisi ve kimlik',
        text: 'Konumlandırma, isimlendirme, marka dili ve bunları taşıyan görsel sistem; son ikonuna kadar.',
        deliverables: ['Konumlandırma', 'İsimlendirme', 'Kimlik', 'Kılavuzlar'],
      },
      {
        title: 'Web siteleri',
        text: 'Hızlı açılan, rahat okunan ve güncellemesi keyifli editoryal siteler ve platformlar.',
        deliverables: ['Sanat yönetimi', 'UX', 'Geliştirme', 'CMS'],
      },
      {
        title: 'Dijital ürünler',
        text: 'Kullanan insanlarla birlikte tasarlanan uygulamalar ve ekibinizin büyütebileceği tasarım sistemleri.',
        deliverables: ['Araştırma', 'Ürün tasarımı', 'Tasarım sistemi', 'Prototip'],
      },
      {
        title: 'Hareket ve kampanyalar',
        text: 'Lansman filmleri, hareket dilleri ve markaya hareket ettiğinde de ses veren kampanyalar.',
        deliverables: ['Hareket kimliği', 'Lansman filmi', 'Kampanya', 'Canlı görsel'],
      },
    ],
    processTitle: 'Bir proje nasıl ilerler',
    process: [
      {
        title: 'Keşif',
        duration: '2–3 hafta',
        text: 'Görüşmeler, atölyeler ve hâlihazırda işe yarayanlara bir bakış. Herkesin üzerinde anlaştığı tek bir cümleyle çıkıyoruz.',
      },
      {
        title: 'Tanım',
        duration: '2 hafta',
        text: 'Strateji, yapı ve ilk eskizler; bilerek erken ve kaba hâlleriyle paylaşılır.',
      },
      {
        title: 'Tasarım',
        duration: '4–8 hafta',
        text: 'Tek bir ekip birlikte tasarlar ve geliştirir; büyük bir sunum yerine her hafta çalışan bir ara teslim.',
      },
      {
        title: 'Teslim ve büyüme',
        duration: 'Sürekli',
        text: 'Yayına alırız, sonra ölçeriz. Çoğu müşterimiz birlikte yaptığımız şeyi büyütmek için bizimle kalıyor.',
      },
    ],
    numbers: [
      { value: '14', label: 'yıllık deneyim' },
      { value: '180+', label: 'lansman' },
      { value: '32', label: 'ödül' },
      { value: '38', label: 'kişi, iki stüdyo' },
    ],
    testimonialsTitle: 'Onların sözleriyle',
    previous: 'Önceki yorum',
    next: 'Sonraki yorum',
    awardsTitle: 'Ödüller',
    awardColumns: { year: 'Yıl', award: 'Ödül', project: 'Proje', honour: 'Derece' },
    teamTitle: 'Stüdyo',
    teamIntro:
      'Küçük ve deneyimli ekipler; ilk atölyeden lansman gününe kadar aynı insanlar. Hiç tanımadığınız bir ekibe devir yok.',
    ctaTitle: 'Aklınızda bir proje mi var?',
    ctaText: 'Ne üzerinde çalıştığınızı anlatın. Her brife iki iş günü içinde yanıt veriyoruz.',
    ctaButton: 'Bize brif yazın',
    ctaOr: 'ya da e-posta',
  },

  work: {
    title: 'İşler',
    intro:
      'Kimlikler, web siteleri, ürünler ve kampanyalar. Disipline göre süzün ya da hepsine göz atın.',
    filterLabel: 'Disipline göre süz',
    all: 'Tümü',
    showing: (count: number) => `${count} proje`,
    empty: 'Bu disiplinde henüz proje yok.',
    ctaTitle: 'Sıradaki proje sizinki olabilir.',
  },

  caseStudy: {
    backToWork: 'Tüm işler',
    client: 'Müşteri',
    year: 'Yıl',
    services: 'Hizmetler',
    disciplines: 'Disiplinler',
    challenge: 'Sorun',
    approach: 'Yaklaşımımız',
    result: 'Sonuç',
    compareTitle: 'Öncesi ve sonrası',
    compareHint: 'Tutamacı sürükleyin ya da ok tuşlarını kullanın.',
    before: 'Önce',
    after: 'Sonra',
    compareLabel: 'Karşılaştırma konumu',
    resultsTitle: 'Rakamlarla',
    creditsTitle: 'Emeği geçenler',
    nextProject: 'Sonraki proje',
    notFoundTitle: 'Proje bulunamadı',
    notFoundText: 'Bu proje portfolyoda yok. Adı değişmiş olabilir.',
  },

  contact: {
    title: 'Projenizden bahsedin.',
    intro:
      'Birkaç ayrıntı, yanıtı doğru kişilerin yazmasını sağlıyor. Hiçbiri bağlayıcı değil; yaklaşık cevaplar da olur.',
    name: 'Adınız',
    email: 'E-posta',
    company: 'Şirket',
    companyPlaceholder: 'İsteğe bağlı',
    services: 'Neye ihtiyacınız var?',
    serviceOptions: {
      brand: 'Marka kimliği',
      website: 'Web sitesi',
      product: 'Dijital ürün',
      motion: 'Hareket',
      campaign: 'Kampanya',
      strategy: 'Strateji',
    },
    budget: 'Bütçe',
    budgetOptions: {
      under25: '25 bin € altı',
      '25to50': '25–50 bin €',
      '50to100': '50–100 bin €',
      over100: '100 bin € üzeri',
    },
    timeline: 'Ne zaman başlamak istiyorsunuz?',
    timelineOptions: {
      asap: 'Olabildiğince erken',
      quarter: '1–3 ay içinde',
      half: '3–6 ay içinde',
      flexible: 'Esneğiz',
    },
    details: 'Proje ayrıntıları',
    detailsPlaceholder: 'Ne yapıyorsunuz, kimin için, ve başarı neye benzerdi?',
    attach: 'Dosya ekle',
    attachHint:
      'Brif, sunum ya da referanslar. En fazla 5 dosya; bu demoda yalnızca adları saklanır.',
    consent: 'Oda Studio’nun talebime yanıt vermek için bu bilgileri kullanmasını kabul ediyorum.',
    submit: 'Brifi gönder',
    required: {
      name: 'Adınızı yazın.',
      email: 'Yanıt verebileceğimiz bir e-posta girin.',
      emailInvalid: 'Bu e-posta doğru görünmüyor.',
      services: 'İhtiyacınız olan en az bir şeyi seçin.',
      budget: 'Bir bütçe aralığı seçin.',
      timeline: 'Bir başlangıç zamanı seçin.',
      details: 'Projeden biraz bahsedin.',
      detailsShort: 'Birkaç kelime daha lütfen: en az 30 karakter.',
      consent: 'Yanıt verebilmemiz için onayınız gerekiyor.',
    },
    successTitle: 'Brifiniz ulaştı. Teşekkürler.',
    successText: (name: string) => `${name}, bu hafta okuyup iki iş günü içinde yanıt vereceğiz.`,
    summary: 'İstedikleriniz',
    sendAnother: 'Yeni brif gönder',
    studiosTitle: 'Stüdyolar',
    emailTitle: 'Yeni iş',
    callTitle: '20 dakikalık tanışma görüşmesi',
    callIntro: 'Önce konuşmayı mı tercih edersiniz? Deniz ya da Jonas ile bir saat seçin.',
    timezone: 'Saatler İstanbul saatidir (GMT+3).',
    pickDay: 'Gün',
    pickTime: 'Saat',
    taken: 'Dolu',
    bookCall: 'Bu saati ayır',
    callBooked: (when: string) => `${when} için ayrıldı. Takvim daveti yolda.`,
    changeCall: 'Başka bir saat seç',
  },

  footer: {
    studios: 'Stüdyolar',
    contact: 'İletişim',
    follow: 'Takip edin',
    socials: ['Instagram', 'LinkedIn', 'Vimeo'],
    rights: 'Tüm hakları saklıdır.',
    note: 'Demo site. Müşteriler, kişiler ve projeler hayalidir.',
  },
}

export const agencyCopy = { en, tr }
