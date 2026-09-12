import climateNetwork from '@/features/showcases/assets/climate-network.svg'
import communityCampus from '@/features/showcases/assets/community-campus.svg'
import innovationLab from '@/features/showcases/assets/innovation-lab.svg'
import talentStudio from '@/features/showcases/assets/talent-studio.svg'
import type {
  CampusUpdate,
  CompanySector,
  CompanyStage,
  LocalizedText,
  ResidentCompany,
  RoleLevel,
  SectorRole,
} from '@/features/showcases/types'

export const companySectorLabels: Record<CompanySector, LocalizedText> = {
  ai: { en: 'AI and data', tr: 'Yapay zekâ ve veri' },
  agritech: { en: 'Agritech', tr: 'Tarım teknolojisi' },
  climate: { en: 'Climate and water', tr: 'İklim ve su' },
  cybersecurity: { en: 'Cybersecurity', tr: 'Siber güvenlik' },
  energy: { en: 'Clean energy', tr: 'Temiz enerji' },
  fintech: { en: 'Fintech', tr: 'Finans teknolojisi' },
  health: { en: 'Health tech', tr: 'Sağlık teknolojisi' },
  industrial: { en: 'Industrial software', tr: 'Endüstriyel yazılım' },
  materials: { en: 'Advanced materials', tr: 'İleri malzeme' },
  mobility: { en: 'Mobility', tr: 'Mobilite' },
  robotics: { en: 'Robotics', tr: 'Robotik' },
  space: { en: 'Space systems', tr: 'Uzay sistemleri' },
}

/**
 * A pale accent per sector, so forty-two cards do not read as one grey wall. It lives with
 * the data rather than in CSS because the sector is what picks it, not the layout.
 */
export const companySectorAccents: Record<CompanySector, string> = {
  ai: '#1877f2',
  agritech: '#2e9e5b',
  climate: '#0d9488',
  cybersecurity: '#475569',
  energy: '#e8a33d',
  fintech: '#7c3aed',
  health: '#e05260',
  industrial: '#64748b',
  materials: '#b45309',
  mobility: '#0ea5e9',
  robotics: '#c026d3',
  space: '#312e81',
}

export const companyStageLabels: Record<CompanyStage, LocalizedText> = {
  seed: { en: 'Seed', tr: 'Tohum' },
  seriesA: { en: 'Series A', tr: 'A Serisi' },
  seriesB: { en: 'Series B', tr: 'B Serisi' },
  growth: { en: 'Growth', tr: 'Büyüme' },
  scaleUp: { en: 'Scale-up', tr: 'Ölçeklenme' },
}

/**
 * A directory long enough that paging it is the honest way to render it. Forty-two entries
 * against a page size of nine is five scrolls, which is what makes the loading behaviour
 * visible at all — a list that fits on screen would never exercise it.
 */
export const residentCompanies: ResidentCompany[] = [
  {
    slug: 'lumen-analytics',
    name: 'Lumen Analytics',
    sector: 'ai',
    stage: 'seriesB',
    founded: 2019,
    joined: 2020,
    headcount: 184,
    building: 'A',
    hiring: true,
    openRoles: 8,
    website: 'lumen-analytics.example.com',
    email: 'hello@lumen-analytics.example.com',
    phone: '+90 312 555 0101',
    about: {
      en: 'Lumen Analytics builds the measurement layer for teams that ship machine learning into production. Its platform watches models after release — drift, cost, and the slow decay nobody notices until a quarter has passed.',
      tr: 'Lumen Analytics, makine öğrenmesini üretime alan ekipler için ölçüm katmanını kuruyor. Platformu modelleri yayına aldıktan sonra izliyor: sapma, maliyet ve bir çeyrek geçene kadar kimsenin fark etmediği yavaş bozulma.',
    },
    expertise: [
      { en: 'Model evaluation', tr: 'Model değerlendirme' },
      { en: 'MLOps', tr: 'MLOps' },
      { en: 'Natural language processing', tr: 'Doğal dil işleme' },
    ],
    products: [
      {
        name: 'Lumen Observe',
        summary: {
          en: 'Drift and cost monitoring for models already serving traffic.',
          tr: 'Halihazırda trafiğe hizmet veren modeller için sapma ve maliyet izleme.',
        },
      },
      {
        name: 'Lumen Sets',
        summary: {
          en: 'Versioned evaluation datasets that survive a model rewrite.',
          tr: 'Model baştan yazıldığında bile ayakta kalan sürümlenmiş değerlendirme veri kümeleri.',
        },
      },
    ],
    projects: [
      {
        name: 'Retail forecast audit',
        year: 2025,
        summary: {
          en: "Re-measured a national retailer's demand model against three years of held-out sales.",
          tr: 'Ulusal bir perakendecinin talep modelini üç yıllık ayrılmış satış verisiyle yeniden ölçtü.',
        },
      },
      {
        name: 'Campus model registry',
        year: 2024,
        summary: {
          en: 'A shared registry the other resident AI teams publish evaluated models to.',
          tr: 'Kampüsteki diğer yapay zekâ ekiplerinin değerlendirilmiş modellerini yayımladığı ortak kayıt.',
        },
      },
    ],
  },
  {
    slug: 'nordwind-energy',
    name: 'Nordwind Energy',
    sector: 'energy',
    stage: 'growth',
    founded: 2016,
    joined: 2018,
    headcount: 312,
    building: 'B',
    hiring: true,
    openRoles: 14,
    website: 'nordwind-energy.example.com',
    email: 'hello@nordwind-energy.example.com',
    phone: '+90 312 555 0102',
    about: {
      en: 'Nordwind Energy develops and operates mid-scale wind capacity, and builds the storage that makes it dispatchable. Most of its control software is written in-house because the schedules it has to hit are its own.',
      tr: 'Nordwind Energy orta ölçekli rüzgâr kapasitesi geliştirip işletiyor ve bunu programlanabilir kılan depolamayı kuruyor. Kontrol yazılımının büyük kısmını kendi yazıyor; çünkü tutturması gereken takvim kendi takvimi.',
    },
    expertise: [
      { en: 'Energy storage', tr: 'Enerji depolama' },
      { en: 'Generation forecasting', tr: 'Üretim tahminleme' },
      { en: 'Power electronics', tr: 'Güç elektroniği' },
    ],
    products: [
      {
        name: 'Nordwind Balance',
        summary: {
          en: 'Storage scheduling that bids a wind farm into the day-ahead market.',
          tr: 'Bir rüzgâr santralini gün öncesi piyasaya teklif eden depolama çizelgelemesi.',
        },
      },
      {
        name: 'Turbine Watch',
        summary: {
          en: 'Vibration analysis that flags a gearbox weeks before it fails.',
          tr: 'Bir dişli kutusunu arızalanmadan haftalar önce işaretleyen titreşim analizi.',
        },
      },
    ],
    projects: [
      {
        name: 'Coastal array phase two',
        year: 2026,
        summary: {
          en: 'Forty-eight turbines and a 60 MWh battery on one grid connection.',
          tr: "Tek şebeke bağlantısında kırk sekiz türbin ve 60 MWh'lik batarya.",
        },
      },
      {
        name: 'Campus supply pilot',
        year: 2024,
        summary: {
          en: 'Ran the tech park on stored wind power for six consecutive winter nights.',
          tr: 'Teknoparkı üst üste altı kış gecesi boyunca depolanmış rüzgâr enerjisiyle çalıştırdı.',
        },
      },
    ],
  },
  {
    slug: 'vektor-mobility',
    name: 'Vektor Mobility',
    sector: 'mobility',
    stage: 'seriesA',
    founded: 2021,
    joined: 2024,
    headcount: 74,
    building: 'C',
    hiring: true,
    openRoles: 3,
    website: 'vektor-mobility.example.com',
    email: 'hello@vektor-mobility.example.com',
    phone: '+90 312 555 0103',
    about: {
      en: 'Vektor Mobility converts commercial fleets to electric drivetrains and plans the charging that has to arrive with them. The hard part is rarely the vehicle; it is the depot, the shift pattern, and the grid connection behind it.',
      tr: 'Vektor Mobility ticari filoları elektrikli aktarma organlarına dönüştürüyor ve bunlarla birlikte gelmesi gereken şarj altyapısını planlıyor. Zor kısım nadiren araç; depo, vardiya düzeni ve arkasındaki şebeke bağlantısı.',
    },
    expertise: [
      { en: 'Telematics', tr: 'Telematik' },
      { en: 'Charging infrastructure', tr: 'Şarj altyapısı' },
      { en: 'Transport modelling', tr: 'Ulaşım modellemesi' },
    ],
    products: [
      {
        name: 'Vektor Depot',
        summary: {
          en: 'Charging plans that respect shift patterns and a fixed grid limit.',
          tr: 'Vardiya düzenine ve sabit şebeke limitine uyan şarj planları.',
        },
      },
      {
        name: 'Vektor Retrofit',
        summary: {
          en: 'A drivetrain conversion kit for light commercial vehicles.',
          tr: 'Hafif ticari araçlar için aktarma organı dönüşüm kiti.',
        },
      },
    ],
    projects: [
      {
        name: 'Municipal fleet conversion',
        year: 2025,
        summary: {
          en: 'Ninety refuse vehicles moved to electric across four depots.',
          tr: 'Dört depoda doksan çöp aracı elektriğe geçirildi.',
        },
      },
      {
        name: 'Campus shuttle',
        year: 2023,
        summary: {
          en: "The tech park's own shuttle loop, run as a live test route.",
          tr: 'Teknoparkın kendi ring servisi, canlı test rotası olarak işletiliyor.',
        },
      },
    ],
  },
  {
    slug: 'cellwise-bio',
    name: 'Cellwise Bio',
    sector: 'health',
    stage: 'seriesB',
    founded: 2018,
    joined: 2022,
    headcount: 141,
    building: 'D',
    hiring: false,
    openRoles: 0,
    website: 'cellwise-bio.example.com',
    email: 'hello@cellwise-bio.example.com',
    phone: '+90 312 555 0104',
    about: {
      en: 'Cellwise Bio makes benchtop instruments that count and sort cells without the sample preparation older equipment demands. Its customers are hospital laboratories, so every release carries a regulatory file with it.',
      tr: 'Cellwise Bio, eski cihazların gerektirdiği numune hazırlığı olmadan hücre sayan ve ayıran masaüstü cihazlar üretiyor. Müşterileri hastane laboratuvarları olduğu için her sürüm yanında bir regülasyon dosyası taşıyor.',
    },
    expertise: [
      { en: 'Regulatory affairs', tr: 'Regülasyon' },
      { en: 'Remote monitoring', tr: 'Uzaktan izleme' },
      { en: 'Clinical software', tr: 'Klinik yazılım' },
    ],
    products: [
      {
        name: 'Cellwise One',
        summary: {
          en: 'A benchtop cytometer that runs an unprepared sample in four minutes.',
          tr: 'Hazırlanmamış bir numuneyi dört dakikada işleyen masaüstü sitometre.',
        },
      },
      {
        name: 'Cellwise Link',
        summary: {
          en: 'Laboratory software that files results straight into the hospital record.',
          tr: 'Sonuçları doğrudan hastane kaydına işleyen laboratuvar yazılımı.',
        },
      },
    ],
    projects: [
      {
        name: 'Multi-site validation',
        year: 2025,
        summary: {
          en: 'Nine hospital laboratories ran the instrument against their existing method.',
          tr: 'Dokuz hastane laboratuvarı cihazı mevcut yöntemleriyle karşılaştırarak çalıştırdı.',
        },
      },
      {
        name: 'Clean room build',
        year: 2024,
        summary: {
          en: 'Its own assembly line inside the shared clean room in block C.',
          tr: 'C bloğundaki ortak temiz odanın içinde kendi montaj hattı.',
        },
      },
    ],
  },
  {
    slug: 'orbit-materials',
    name: 'Orbit Materials',
    sector: 'materials',
    stage: 'seriesA',
    founded: 2020,
    joined: 2021,
    headcount: 63,
    building: 'E',
    hiring: true,
    openRoles: 3,
    website: 'orbit-materials.example.com',
    email: 'hello@orbit-materials.example.com',
    phone: '+90 312 555 0105',
    about: {
      en: 'Orbit Materials formulates lightweight composites for parts that have to be strong and cannot be heavy. It works in the campus laboratories because a result here is a sample somebody can put in a press.',
      tr: 'Orbit Materials, güçlü olmak zorunda olup ağır olamayan parçalar için hafif kompozitler formüle ediyor. Kampüs laboratuvarlarında çalışıyor; çünkü buradaki sonuç, birinin prese koyabileceği bir numune.',
    },
    expertise: [
      { en: 'Structural testing', tr: 'Yapısal test' },
      { en: 'Composite formulation', tr: 'Kompozit formülasyon' },
      { en: 'Material characterisation', tr: 'Malzeme karakterizasyonu' },
    ],
    products: [
      {
        name: 'Orbit L-Series',
        summary: {
          en: 'A structural composite that holds its stiffness above 200°C.',
          tr: '200°C üzerinde rijitliğini koruyan yapısal kompozit.',
        },
      },
      {
        name: 'Orbit Bond',
        summary: {
          en: 'An adhesive system for joining composite to metal without a fastener.',
          tr: 'Kompoziti metale bağlantı elemanı olmadan birleştiren yapıştırıcı sistemi.',
        },
      },
    ],
    projects: [
      {
        name: 'Launcher fairing panel',
        year: 2026,
        summary: {
          en: 'A payload fairing section built with Aurora Orbital, two buildings away.',
          tr: 'İki bina ötedeki Aurora Orbital ile birlikte üretilen faydalı yük kaportası bölümü.',
        },
      },
      {
        name: 'Rail bogie trial',
        year: 2024,
        summary: {
          en: 'Replaced a steel bogie component and cut 34% of its mass.',
          tr: "Bir çelik boji bileşenini değiştirerek kütlesinin %34'ünü azalttı.",
        },
      },
    ],
  },
  {
    slug: 'aurora-orbital',
    name: 'Aurora Orbital',
    sector: 'space',
    stage: 'growth',
    founded: 2015,
    joined: 2017,
    headcount: 268,
    building: 'F',
    hiring: true,
    openRoles: 12,
    website: 'aurora-orbital.example.com',
    email: 'hello@aurora-orbital.example.com',
    phone: '+90 312 555 0106',
    about: {
      en: 'Aurora Orbital builds small satellite payloads and the ground software that talks to them. Its schedules are set by launch windows rather than release trains, which shapes how the whole company plans.',
      tr: 'Aurora Orbital küçük uydu faydalı yükleri ve onlarla konuşan yer yazılımını geliştiriyor. Takvimini sürüm trenleri değil fırlatma pencereleri belirliyor; bu da şirketin tüm planlamasını şekillendiriyor.',
    },
    expertise: [
      { en: 'Payload engineering', tr: 'Faydalı yük mühendisliği' },
      { en: 'Ground systems', tr: 'Yer sistemleri' },
      { en: 'Optical design', tr: 'Optik tasarım' },
    ],
    products: [
      {
        name: 'Aurora Ground',
        summary: {
          en: 'Ground station software for operators running more than one constellation.',
          tr: 'Birden fazla takımyıldız işleten operatörler için yer istasyonu yazılımı.',
        },
      },
      {
        name: 'Aurora Sensor Bus',
        summary: {
          en: 'A payload interface that takes an instrument to flight in one integration.',
          tr: 'Bir enstrümanı tek entegrasyonla uçuşa taşıyan faydalı yük arayüzü.',
        },
      },
    ],
    projects: [
      {
        name: 'Asia ground network',
        year: 2026,
        summary: {
          en: 'Ground station software for a regional satellite operator, its first export contract.',
          tr: 'Bölgesel bir uydu operatörü için yer istasyonu yazılımı; ilk ihracat sözleşmesi.',
        },
      },
      {
        name: 'Earth observation cluster',
        year: 2025,
        summary: {
          en: 'Four imaging payloads flown together on a single rideshare.',
          tr: 'Tek bir ortak yolculukta birlikte uçurulan dört görüntüleme faydalı yükü.',
        },
      },
    ],
  },
  {
    slug: 'fintrail',
    name: 'Fintrail',
    sector: 'fintech',
    stage: 'scaleUp',
    founded: 2014,
    joined: 2017,
    headcount: 402,
    building: 'A',
    hiring: false,
    openRoles: 0,
    website: 'fintrail.example.com',
    email: 'hello@fintrail.example.com',
    phone: '+90 312 555 0107',
    about: {
      en: 'Fintrail runs the reconciliation layer behind payment systems that cannot afford to disagree with themselves. It is the least visible part of a payment product and reliably the part that breaks first.',
      tr: 'Fintrail, kendisiyle çelişme lüksü olmayan ödeme sistemlerinin arkasındaki mutabakat katmanını işletiyor. Bir ödeme ürününün en görünmez parçası ve düzenli olarak ilk bozulan parçası.',
    },
    expertise: [
      { en: 'Ledger design', tr: 'Defter tasarımı' },
      { en: 'Reconciliation', tr: 'Mutabakat' },
      { en: 'Risk and fraud', tr: 'Risk ve dolandırıcılık' },
    ],
    products: [
      {
        name: 'Fintrail Ledger',
        summary: {
          en: 'Double-entry settlement that reconciles across four payment rails.',
          tr: 'Dört ödeme hattı arasında mutabakat sağlayan çift taraflı kayıt sistemi.',
        },
      },
      {
        name: 'Fintrail Dispute',
        summary: {
          en: 'Chargeback handling with a full evidence trail per case.',
          tr: 'Her vaka için tam kanıt izi tutan ters ibraz yönetimi.',
        },
      },
    ],
    projects: [
      {
        name: 'Bank core migration',
        year: 2025,
        summary: {
          en: "Moved a mid-size bank's settlement off a twenty-year-old batch process.",
          tr: 'Orta ölçekli bir bankanın mutabakatını yirmi yıllık toplu işlem sürecinden taşıdı.',
        },
      },
      {
        name: 'Marketplace payouts',
        year: 2023,
        summary: {
          en: 'Split payouts for a marketplace with 40,000 sellers in nine currencies.',
          tr: 'Dokuz para biriminde 40.000 satıcılı bir pazar yeri için bölünmüş ödemeler.',
        },
      },
    ],
  },
  {
    slug: 'terrafield',
    name: 'Terrafield',
    sector: 'agritech',
    stage: 'seed',
    founded: 2023,
    joined: 2026,
    headcount: 21,
    building: 'B',
    hiring: true,
    openRoles: 2,
    website: 'terrafield.example.com',
    email: 'hello@terrafield.example.com',
    phone: '+90 312 555 0108',
    about: {
      en: 'Terrafield puts cheap sensors in the ground and turns what they read into an irrigation decision. It is small, it is new, and its product has to survive dust, water, and a growing season that does not wait.',
      tr: 'Terrafield toprağa ucuz sensörler koyup okuduklarını bir sulama kararına çeviriyor. Küçük, yeni ve ürünü tozu, suyu ve beklemeyen bir hasat dönemini kaldırmak zorunda.',
    },
    expertise: [
      { en: 'Field robotics', tr: 'Tarla robotiği' },
      { en: 'Remote sensing', tr: 'Uzaktan algılama' },
      { en: 'Agronomy', tr: 'Ziraat' },
    ],
    products: [
      {
        name: 'Terrafield Probe',
        summary: {
          en: 'A soil moisture probe that runs three seasons on one battery.',
          tr: 'Tek bataryayla üç sezon çalışan toprak nemi probu.',
        },
      },
      {
        name: 'Terrafield Plan',
        summary: {
          en: 'Irrigation scheduling from probe readings and the local forecast.',
          tr: 'Prob ölçümleri ve yerel tahminden çıkarılan sulama çizelgesi.',
        },
      },
    ],
    projects: [
      {
        name: 'Konya field trial',
        year: 2026,
        summary: {
          en: 'Two hundred probes across eleven farms through a full season.',
          tr: 'On bir çiftlikte iki yüz prob, tam bir sezon boyunca.',
        },
      },
      {
        name: 'Campus test plot',
        year: 2025,
        summary: {
          en: 'A permanent outdoor plot behind block D used for calibration.',
          tr: 'D bloğunun arkasında kalibrasyon için kullanılan kalıcı açık hava parseli.',
        },
      },
    ],
  },
  {
    slug: 'cipherline',
    name: 'Cipherline',
    sector: 'cybersecurity',
    stage: 'seriesB',
    founded: 2017,
    joined: 2018,
    headcount: 158,
    building: 'C',
    hiring: true,
    openRoles: 7,
    website: 'cipherline.example.com',
    email: 'hello@cipherline.example.com',
    phone: '+90 312 555 0109',
    about: {
      en: 'Cipherline builds detection for networks that have already been breached once. Everything it ships is tested against the campus network before it reaches a customer, which is a demanding first customer to have.',
      tr: 'Cipherline, bir kez ihlal edilmiş ağlar için tespit sistemleri geliştiriyor. Yayımladığı her şey müşteriye ulaşmadan önce kampüs ağında test ediliyor; oldukça zorlu bir ilk müşteri.',
    },
    expertise: [
      { en: 'Supply chain security', tr: 'Tedarik zinciri güvenliği' },
      { en: 'Incident response', tr: 'Olay müdahalesi' },
      { en: 'Threat detection', tr: 'Tehdit tespiti' },
    ],
    products: [
      {
        name: 'Cipherline Signal',
        summary: {
          en: 'Detection rules that explain why they fired, not only that they did.',
          tr: 'Sadece tetiklendiğini değil neden tetiklendiğini de açıklayan tespit kuralları.',
        },
      },
      {
        name: 'Cipherline Supply',
        summary: {
          en: 'Dependency assurance for teams that ship software they did not write.',
          tr: 'Yazmadıkları yazılımı dağıtan ekipler için bağımlılık güvencesi.',
        },
      },
    ],
    projects: [
      {
        name: 'Campus network programme',
        year: 2025,
        summary: {
          en: 'Instrumented the whole tech park as a live detection testbed.',
          tr: 'Tüm teknoparkı canlı bir tespit test ortamı olarak donattı.',
        },
      },
      {
        name: 'Utility SOC build',
        year: 2024,
        summary: {
          en: 'Stood up a security operations centre for a regional energy utility.',
          tr: 'Bölgesel bir enerji kuruluşu için güvenlik operasyon merkezi kurdu.',
        },
      },
    ],
  },
  {
    slug: 'halcyon-robotics',
    name: 'Halcyon Robotics',
    sector: 'robotics',
    stage: 'seriesA',
    founded: 2020,
    joined: 2022,
    headcount: 88,
    building: 'D',
    hiring: true,
    openRoles: 4,
    website: 'halcyon-robotics.example.com',
    email: 'hello@halcyon-robotics.example.com',
    phone: '+90 312 555 0110',
    about: {
      en: 'Halcyon Robotics makes picking robots for warehouses where the items are not uniform and never will be. The demo either lifts the part or it does not, which keeps the engineering honest.',
      tr: 'Halcyon Robotics, ürünlerin tekdüze olmadığı ve hiç olmayacağı depolar için toplama robotları üretiyor. Demo parçayı ya kaldırıyor ya kaldırmıyor; bu da mühendisliği dürüst tutuyor.',
    },
    expertise: [
      { en: 'Force control', tr: 'Kuvvet kontrolü' },
      { en: 'Motion planning', tr: 'Hareket planlama' },
      { en: 'Perception', tr: 'Algı' },
    ],
    products: [
      {
        name: 'Halcyon Pick',
        summary: {
          en: 'A picking cell that handles mixed-item totes without retraining.',
          tr: 'Karışık ürünlü kasaları yeniden eğitim gerektirmeden işleyen toplama hücresi.',
        },
      },
      {
        name: 'Halcyon Grip',
        summary: {
          en: 'A compliant gripper for soft and irregular packaging.',
          tr: 'Yumuşak ve düzensiz ambalajlar için esnek tutucu.',
        },
      },
    ],
    projects: [
      {
        name: 'Grocery fulfilment line',
        year: 2026,
        summary: {
          en: 'Six picking cells running a live grocery order line.',
          tr: 'Canlı bir market sipariş hattını işleten altı toplama hücresi.',
        },
      },
      {
        name: 'Robotics hall',
        year: 2024,
        summary: {
          en: 'A shared test hall in block B, open to the other resident teams.',
          tr: 'B bloğunda diğer yerleşik ekiplere açık ortak test salonu.',
        },
      },
    ],
  },
  {
    slug: 'sablon-ai',
    name: 'Sablon AI',
    sector: 'ai',
    stage: 'seed',
    founded: 2024,
    joined: 2026,
    headcount: 14,
    building: 'E',
    hiring: true,
    openRoles: 2,
    website: 'sablon-ai.example.com',
    email: 'hello@sablon-ai.example.com',
    phone: '+90 312 555 0111',
    about: {
      en: 'Sablon AI is fourteen people building models that read structured documents — contracts, filings, forms — and return something a system can act on rather than a summary a person has to check.',
      tr: 'Sablon AI, yapılandırılmış belgeleri (sözleşme, beyan, form) okuyup bir insanın kontrol etmesi gereken özet yerine bir sistemin işleyebileceği çıktı üreten modeller geliştiren on dört kişilik bir ekip.',
    },
    expertise: [
      { en: 'Model evaluation', tr: 'Model değerlendirme' },
      { en: 'MLOps', tr: 'MLOps' },
      { en: 'Natural language processing', tr: 'Doğal dil işleme' },
    ],
    products: [
      {
        name: 'Sablon Extract',
        summary: {
          en: 'Field extraction from contracts, with a confidence score per field.',
          tr: 'Sözleşmelerden alan çıkarımı; her alan için güven skoruyla birlikte.',
        },
      },
      {
        name: 'Sablon Review',
        summary: {
          en: 'A review queue that only surfaces what the model was unsure about.',
          tr: 'Yalnızca modelin emin olmadığı kısımları öne çıkaran inceleme kuyruğu.',
        },
      },
    ],
    projects: [
      {
        name: 'Insurance intake pilot',
        year: 2026,
        summary: {
          en: 'Read 40,000 claim forms against a manual baseline.',
          tr: 'Manuel bir referansa karşı 40.000 hasar formu okudu.',
        },
      },
      {
        name: 'Public tender corpus',
        year: 2025,
        summary: {
          en: 'An open dataset of tender documents, released with the campus.',
          tr: 'Kampüsle birlikte yayımlanan açık ihale belgesi veri kümesi.',
        },
      },
    ],
  },
  {
    slug: 'helios-grid',
    name: 'Helios Grid',
    sector: 'energy',
    stage: 'seriesA',
    founded: 2021,
    joined: 2025,
    headcount: 67,
    building: 'F',
    hiring: false,
    openRoles: 0,
    website: 'helios-grid.example.com',
    email: 'hello@helios-grid.example.com',
    phone: '+90 312 555 0112',
    about: {
      en: 'Helios Grid forecasts solar output at the level of an individual site, which is harder and more useful than forecasting it for a region. Its customers are the people who have to bid that output into a market.',
      tr: 'Helios Grid, güneş üretimini bölge düzeyinde değil tek tek saha düzeyinde tahmin ediyor; daha zor ve daha faydalı olan bu. Müşterileri bu üretimi piyasaya teklif etmek zorunda olanlar.',
    },
    expertise: [
      { en: 'Energy storage', tr: 'Enerji depolama' },
      { en: 'Generation forecasting', tr: 'Üretim tahminleme' },
      { en: 'Power electronics', tr: 'Güç elektroniği' },
    ],
    products: [
      {
        name: 'Helios Forecast',
        summary: {
          en: 'Site-level generation forecasts out to seventy-two hours.',
          tr: 'Yetmiş iki saate kadar saha düzeyinde üretim tahmini.',
        },
      },
      {
        name: 'Helios Bid',
        summary: {
          en: 'Market bidding that turns a forecast into a position.',
          tr: 'Bir tahmini piyasa pozisyonuna çeviren teklif motoru.',
        },
      },
    ],
    projects: [
      {
        name: 'Rooftop portfolio',
        year: 2025,
        summary: {
          en: 'Forecasting for 1,400 rooftop installations under one operator.',
          tr: 'Tek operatör altındaki 1.400 çatı kurulumu için tahminleme.',
        },
      },
      {
        name: 'Campus array',
        year: 2023,
        summary: {
          en: "The tech park's own roof arrays, used as a calibration site.",
          tr: 'Kalibrasyon sahası olarak kullanılan teknoparkın kendi çatı panelleri.',
        },
      },
    ],
  },
  {
    slug: 'rota-systems',
    name: 'Rota Systems',
    sector: 'mobility',
    stage: 'seriesB',
    founded: 2018,
    joined: 2019,
    headcount: 133,
    building: 'A',
    hiring: true,
    openRoles: 6,
    website: 'rota-systems.example.com',
    email: 'hello@rota-systems.example.com',
    phone: '+90 312 555 0113',
    about: {
      en: 'Rota Systems plans routes for fleets that change during the day — a cancelled stop, a closed road, a driver who finishes early. Planning once at six in the morning is the easy version of this problem.',
      tr: 'Rota Systems, gün içinde değişen filolar için rota planlıyor: iptal olan durak, kapanan yol, erken biten sürücü. Sabah altıda bir kez planlamak bu problemin kolay hâli.',
    },
    expertise: [
      { en: 'Telematics', tr: 'Telematik' },
      { en: 'Charging infrastructure', tr: 'Şarj altyapısı' },
      { en: 'Transport modelling', tr: 'Ulaşım modellemesi' },
    ],
    products: [
      {
        name: 'Rota Live',
        summary: {
          en: 'Routing that replans mid-shift without stranding a driver.',
          tr: 'Vardiya ortasında sürücüyü ortada bırakmadan yeniden planlayan rotalama.',
        },
      },
      {
        name: 'Rota Fit',
        summary: {
          en: 'Vehicle and load matching for mixed fleets.',
          tr: 'Karma filolar için araç ve yük eşleştirme.',
        },
      },
    ],
    projects: [
      {
        name: 'Distribution network',
        year: 2026,
        summary: {
          en: 'Replanned a 300-vehicle distribution network in production.',
          tr: '300 araçlık bir dağıtım ağını üretim ortamında yeniden planladı.',
        },
      },
      {
        name: 'Cold chain pilot',
        year: 2024,
        summary: {
          en: 'Routing with temperature windows as a hard constraint.',
          tr: 'Sıcaklık pencerelerini katı kısıt olarak alan rotalama.',
        },
      },
    ],
  },
  {
    slug: 'medira-labs',
    name: 'Medira Labs',
    sector: 'health',
    stage: 'seriesA',
    founded: 2021,
    joined: 2023,
    headcount: 59,
    building: 'B',
    hiring: true,
    openRoles: 3,
    website: 'medira-labs.example.com',
    email: 'hello@medira-labs.example.com',
    phone: '+90 312 555 0114',
    about: {
      en: 'Medira Labs writes the software clinicians use to read a diagnostic result, which means it is built to a regulatory file from the first sprint rather than fitted to one afterwards.',
      tr: 'Medira Labs, klinisyenlerin bir tanı sonucunu okurken kullandığı yazılımı yazıyor; yani sonradan uydurulmak yerine ilk sprintten itibaren regülasyon dosyasına göre kuruluyor.',
    },
    expertise: [
      { en: 'Regulatory affairs', tr: 'Regülasyon' },
      { en: 'Remote monitoring', tr: 'Uzaktan izleme' },
      { en: 'Clinical software', tr: 'Klinik yazılım' },
    ],
    products: [
      {
        name: 'Medira Read',
        summary: {
          en: 'A reporting workstation for laboratory diagnostic results.',
          tr: 'Laboratuvar tanı sonuçları için raporlama istasyonu.',
        },
      },
      {
        name: 'Medira Audit',
        summary: {
          en: 'An audit trail that satisfies a clinical records inspection.',
          tr: 'Klinik kayıt denetimini karşılayan denetim izi.',
        },
      },
    ],
    projects: [
      {
        name: 'Regional laboratory rollout',
        year: 2026,
        summary: {
          en: 'Deployed across twelve laboratories in one health authority.',
          tr: 'Tek bir sağlık idaresindeki on iki laboratuvara kuruldu.',
        },
      },
      {
        name: 'Interop trial',
        year: 2025,
        summary: {
          en: 'Result exchange with three hospital record systems.',
          tr: 'Üç hastane kayıt sistemiyle sonuç alışverişi.',
        },
      },
    ],
  },
  {
    slug: 'kompozit-works',
    name: 'Kompozit Works',
    sector: 'materials',
    stage: 'growth',
    founded: 2013,
    joined: 2016,
    headcount: 244,
    building: 'C',
    hiring: false,
    openRoles: 0,
    website: 'kompozit-works.example.com',
    email: 'hello@kompozit-works.example.com',
    phone: '+90 312 555 0115',
    about: {
      en: 'Kompozit Works manufactures composite parts at volume, which is a different discipline from developing them. It is one of the older residents and runs the largest production floor on the campus.',
      tr: 'Kompozit Works kompozit parçaları seri üretiyor; bu, onları geliştirmekten farklı bir disiplin. Kampüsün en eski yerleşiklerinden biri ve en büyük üretim sahasını işletiyor.',
    },
    expertise: [
      { en: 'Structural testing', tr: 'Yapısal test' },
      { en: 'Composite formulation', tr: 'Kompozit formülasyon' },
      { en: 'Material characterisation', tr: 'Malzeme karakterizasyonu' },
    ],
    products: [
      {
        name: 'Press line',
        summary: {
          en: 'High-volume compression moulding for structural parts.',
          tr: 'Yapısal parçalar için yüksek hacimli baskı kalıplama.',
        },
      },
      {
        name: 'Tooling service',
        summary: {
          en: 'Mould design and tooling for other resident teams.',
          tr: 'Diğer yerleşik ekipler için kalıp tasarımı ve takım üretimi.',
        },
      },
    ],
    projects: [
      {
        name: 'Rail interior programme',
        year: 2026,
        summary: {
          en: 'Interior panels for a national rolling stock order.',
          tr: 'Ulusal bir vagon siparişi için iç panel üretimi.',
        },
      },
      {
        name: 'Campus tooling shop',
        year: 2022,
        summary: {
          en: 'Opened its tooling floor to the other materials teams.',
          tr: 'Takım üretim sahasını diğer malzeme ekiplerine açtı.',
        },
      },
    ],
  },
  {
    slug: 'yorunge-space',
    name: 'Yörünge Space',
    sector: 'space',
    stage: 'seriesA',
    founded: 2022,
    joined: 2026,
    headcount: 46,
    building: 'D',
    hiring: true,
    openRoles: 2,
    website: 'yorunge-space.example.com',
    email: 'hello@yorunge-space.example.com',
    phone: '+90 312 555 0116',
    about: {
      en: 'Yörünge Space builds cubesat payloads for research groups that need to fly an instrument without building a satellite around it. Forty-six people, and a launch manifest that runs two years ahead.',
      tr: 'Yörünge Space, bir enstrümanı etrafına uydu inşa etmeden uçurması gereken araştırma grupları için cubesat faydalı yükleri geliştiriyor. Kırk altı kişi ve iki yıl ileriye uzanan bir fırlatma listesi.',
    },
    expertise: [
      { en: 'Payload engineering', tr: 'Faydalı yük mühendisliği' },
      { en: 'Ground systems', tr: 'Yer sistemleri' },
      { en: 'Optical design', tr: 'Optik tasarım' },
    ],
    products: [
      {
        name: 'Yörünge 3U',
        summary: {
          en: 'A three-unit cubesat bus that takes a customer instrument to orbit.',
          tr: 'Müşteri enstrümanını yörüngeye taşıyan üç birimlik cubesat platformu.',
        },
      },
      {
        name: 'Yörünge Link',
        summary: {
          en: 'A downlink service for teams with no ground station of their own.',
          tr: 'Kendi yer istasyonu olmayan ekipler için indirme bağlantısı hizmeti.',
        },
      },
    ],
    projects: [
      {
        name: 'University payload flight',
        year: 2026,
        summary: {
          en: 'Four research instruments from three universities on one bus.',
          tr: 'Üç üniversiteden dört araştırma enstrümanı tek platformda.',
        },
      },
      {
        name: 'Thermal vacuum access',
        year: 2024,
        summary: {
          en: 'Shared thermal vacuum testing with the campus laboratories.',
          tr: 'Kampüs laboratuvarlarıyla ortak termal vakum testi.',
        },
      },
    ],
  },
  {
    slug: 'kasa-payments',
    name: 'Kasa Payments',
    sector: 'fintech',
    stage: 'seriesA',
    founded: 2020,
    joined: 2021,
    headcount: 81,
    building: 'E',
    hiring: true,
    openRoles: 4,
    website: 'kasa-payments.example.com',
    email: 'hello@kasa-payments.example.com',
    phone: '+90 312 555 0117',
    about: {
      en: 'Kasa Payments handles in-person payments for merchants who sell in more than one place and want one set of books at the end of the day. The terminal is the visible part; the settlement behind it is the product.',
      tr: 'Kasa Payments, birden fazla noktada satış yapan ve gün sonunda tek bir defter isteyen işletmeler için yüz yüze ödemeleri yönetiyor. Terminal görünen kısım; asıl ürün arkasındaki mutabakat.',
    },
    expertise: [
      { en: 'Ledger design', tr: 'Defter tasarımı' },
      { en: 'Reconciliation', tr: 'Mutabakat' },
      { en: 'Risk and fraud', tr: 'Risk ve dolandırıcılık' },
    ],
    products: [
      {
        name: 'Kasa Terminal',
        summary: {
          en: 'A card terminal that works offline and settles when it reconnects.',
          tr: 'Çevrimdışı çalışan ve yeniden bağlandığında mutabakat yapan kart terminali.',
        },
      },
      {
        name: 'Kasa Books',
        summary: {
          en: 'Daily settlement across every till a merchant runs.',
          tr: 'İşletmenin çalıştırdığı her kasa için günlük mutabakat.',
        },
      },
    ],
    projects: [
      {
        name: 'Retail chain rollout',
        year: 2026,
        summary: {
          en: 'Six hundred terminals across a regional retail chain.',
          tr: 'Bölgesel bir perakende zincirinde altı yüz terminal.',
        },
      },
      {
        name: 'Market traders pilot',
        year: 2024,
        summary: {
          en: 'Offline settlement for traders with no reliable connection.',
          tr: 'Güvenilir bağlantısı olmayan esnaf için çevrimdışı mutabakat.',
        },
      },
    ],
  },
  {
    slug: 'hasat-robotics',
    name: 'Hasat Robotics',
    sector: 'agritech',
    stage: 'seriesA',
    founded: 2019,
    joined: 2021,
    headcount: 72,
    building: 'F',
    hiring: false,
    openRoles: 0,
    website: 'hasat-robotics.example.com',
    email: 'hello@hasat-robotics.example.com',
    phone: '+90 312 555 0118',
    about: {
      en: 'Hasat Robotics builds harvesting machines for crops that are still picked by hand because the fruit bruises. The machine has to be gentler than a person and faster than one, in a field, in August.',
      tr: 'Hasat Robotics, meyve zedelendiği için hâlâ elle toplanan ürünler için hasat makineleri üretiyor. Makinenin bir insandan daha nazik ve daha hızlı olması gerekiyor; tarlada, ağustosta.',
    },
    expertise: [
      { en: 'Field robotics', tr: 'Tarla robotiği' },
      { en: 'Remote sensing', tr: 'Uzaktan algılama' },
      { en: 'Agronomy', tr: 'Ziraat' },
    ],
    products: [
      {
        name: 'Hasat Row',
        summary: {
          en: 'A self-driving harvest platform for orchard rows.',
          tr: 'Meyve bahçesi sıraları için sürücüsüz hasat platformu.',
        },
      },
      {
        name: 'Hasat Eye',
        summary: {
          en: 'Ripeness detection that decides what to pick and what to leave.',
          tr: 'Neyin toplanıp neyin bırakılacağına karar veren olgunluk tespiti.',
        },
      },
    ],
    projects: [
      {
        name: 'Apricot harvest season',
        year: 2025,
        summary: {
          en: 'A full commercial season across four orchards.',
          tr: 'Dört meyve bahçesinde tam bir ticari sezon.',
        },
      },
      {
        name: 'Gentle handling study',
        year: 2023,
        summary: {
          en: 'Measured bruising against hand picking over 9,000 fruit.',
          tr: '9.000 meyve üzerinde elle toplamaya karşı zedelenme ölçümü.',
        },
      },
    ],
  },
  {
    slug: 'kalkan-security',
    name: 'Kalkan Security',
    sector: 'cybersecurity',
    stage: 'seed',
    founded: 2023,
    joined: 2026,
    headcount: 19,
    building: 'A',
    hiring: true,
    openRoles: 2,
    website: 'kalkan-security.example.com',
    email: 'hello@kalkan-security.example.com',
    phone: '+90 312 555 0119',
    about: {
      en: 'Kalkan Security works on identity — who someone is, what they may do, and how to revoke that in a hurry. Nineteen people, most of whom have run an incident response before.',
      tr: 'Kalkan Security kimlik üzerine çalışıyor: birinin kim olduğu, ne yapabileceği ve bunun acilen nasıl geri alınacağı. On dokuz kişi ve çoğu daha önce olay müdahalesi yönetmiş.',
    },
    expertise: [
      { en: 'Supply chain security', tr: 'Tedarik zinciri güvenliği' },
      { en: 'Incident response', tr: 'Olay müdahalesi' },
      { en: 'Threat detection', tr: 'Tehdit tespiti' },
    ],
    products: [
      {
        name: 'Kalkan Access',
        summary: {
          en: 'Access review that shows what a permission actually reaches.',
          tr: 'Bir yetkinin gerçekte neye eriştiğini gösteren erişim incelemesi.',
        },
      },
      {
        name: 'Kalkan Break',
        summary: {
          en: 'Emergency revocation that works when the directory is down.',
          tr: 'Dizin çalışmadığında da işleyen acil yetki iptali.',
        },
      },
    ],
    projects: [
      {
        name: 'Access review programme',
        year: 2026,
        summary: {
          en: 'Reviewed 11,000 standing permissions at one customer.',
          tr: 'Bir müşteride 11.000 kalıcı yetkiyi inceledi.',
        },
      },
      {
        name: 'Campus identity pilot',
        year: 2025,
        summary: {
          en: 'Single sign-on across the shared campus laboratories.',
          tr: 'Ortak kampüs laboratuvarlarında tek oturum açma.',
        },
      },
    ],
  },
  {
    slug: 'eksen-automation',
    name: 'Eksen Automation',
    sector: 'robotics',
    stage: 'growth',
    founded: 2014,
    joined: 2018,
    headcount: 287,
    building: 'B',
    hiring: true,
    openRoles: 13,
    website: 'eksen-automation.example.com',
    email: 'hello@eksen-automation.example.com',
    phone: '+90 312 555 0120',
    about: {
      en: 'Eksen Automation automates production lines that were built before anyone planned to automate them. Its engineers spend as much time measuring an existing machine as writing the software that will drive it.',
      tr: 'Eksen Automation, otomasyon düşünülmeden çok önce kurulmuş üretim hatlarını otomatikleştiriyor. Mühendisleri mevcut bir makineyi ölçmeye, onu sürecek yazılımı yazmak kadar zaman ayırıyor.',
    },
    expertise: [
      { en: 'Force control', tr: 'Kuvvet kontrolü' },
      { en: 'Motion planning', tr: 'Hareket planlama' },
      { en: 'Perception', tr: 'Algı' },
    ],
    products: [
      {
        name: 'Eksen Cell',
        summary: {
          en: 'A retrofit robot cell that drops onto an existing line.',
          tr: 'Mevcut bir hatta monte edilen dönüşüm robot hücresi.',
        },
      },
      {
        name: 'Eksen Control',
        summary: {
          en: 'Line control software for mixed-vintage machinery.',
          tr: 'Farklı yaşlardaki makineler için hat kontrol yazılımı.',
        },
      },
    ],
    projects: [
      {
        name: 'Appliance line retrofit',
        year: 2026,
        summary: {
          en: 'Automated four stations on a thirty-year-old assembly line.',
          tr: 'Otuz yıllık bir montaj hattında dört istasyonu otomatikleştirdi.',
        },
      },
      {
        name: 'Foundry handling',
        year: 2024,
        summary: {
          en: 'Robot handling of hot castings, with Foundrysoft next door.',
          tr: 'Yan binadaki Foundrysoft ile birlikte sıcak dökümlerin robotla taşınması.',
        },
      },
    ],
  },
  {
    slug: 'atolye-systems',
    name: 'Atölye Systems',
    sector: 'industrial',
    stage: 'seriesB',
    founded: 2017,
    joined: 2018,
    headcount: 166,
    building: 'C',
    hiring: false,
    openRoles: 0,
    website: 'atolye-systems.example.com',
    email: 'hello@atolye-systems.example.com',
    phone: '+90 312 555 0121',
    about: {
      en: 'Atölye Systems writes manufacturing execution software — what to make, in what order, on which machine, and what to do when one of them stops. It is unglamorous and the factory does not run without it.',
      tr: 'Atölye Systems üretim yürütme yazılımı yazıyor: ne, hangi sırayla, hangi makinede üretilecek ve biri durduğunda ne yapılacak. Gösterişsiz bir iş ve fabrika onsuz çalışmıyor.',
    },
    expertise: [
      { en: 'Manufacturing execution', tr: 'Üretim yürütme' },
      { en: 'Production scheduling', tr: 'Üretim çizelgeleme' },
      { en: 'Traceability', tr: 'İzlenebilirlik' },
    ],
    products: [
      {
        name: 'Atölye MES',
        summary: {
          en: 'Execution and traceability from work order to shipped unit.',
          tr: 'İş emrinden sevk edilen ürüne kadar yürütme ve izlenebilirlik.',
        },
      },
      {
        name: 'Atölye Quality',
        summary: {
          en: 'In-line quality capture tied to the batch that produced it.',
          tr: 'Üreten partiye bağlı hat içi kalite kaydı.',
        },
      },
    ],
    projects: [
      {
        name: 'Automotive tier-one',
        year: 2026,
        summary: {
          en: 'Traceability across nine lines for an automotive supplier.',
          tr: 'Bir otomotiv tedarikçisi için dokuz hatta izlenebilirlik.',
        },
      },
      {
        name: 'Campus workshop system',
        year: 2024,
        summary: {
          en: "Runs the shared prototype workshop's job queue.",
          tr: 'Ortak prototip atölyesinin iş kuyruğunu yönetiyor.',
        },
      },
    ],
  },
  {
    slug: 'tideglass',
    name: 'Tideglass',
    sector: 'climate',
    stage: 'seed',
    founded: 2024,
    joined: 2026,
    headcount: 11,
    building: 'D',
    hiring: true,
    openRoles: 2,
    website: 'tideglass.example.com',
    email: 'hello@tideglass.example.com',
    phone: '+90 312 555 0122',
    about: {
      en: 'Tideglass measures water quality continuously instead of sending someone to take a sample once a week. Eleven people, one instrument, and a very specific belief that the sampling interval is the whole problem.',
      tr: 'Tideglass su kalitesini haftada bir numune almak yerine sürekli ölçüyor. On bir kişi, tek bir cihaz ve numune alma aralığının problemin kendisi olduğuna dair çok net bir inanç.',
    },
    expertise: [
      { en: 'Climate risk modelling', tr: 'İklim riski modellemesi' },
      { en: 'Hydrology', tr: 'Hidroloji' },
      { en: 'Emissions accounting', tr: 'Emisyon muhasebesi' },
    ],
    products: [
      {
        name: 'Tideglass Probe',
        summary: {
          en: 'A continuous water quality probe for rivers and reservoirs.',
          tr: 'Nehir ve barajlar için sürekli su kalitesi probu.',
        },
      },
      {
        name: 'Tideglass Alert',
        summary: {
          en: 'Threshold alerting that reaches an operator in minutes.',
          tr: 'Operatöre dakikalar içinde ulaşan eşik uyarısı.',
        },
      },
    ],
    projects: [
      {
        name: 'Reservoir monitoring',
        year: 2026,
        summary: {
          en: 'Continuous monitoring on two drinking water reservoirs.',
          tr: 'İki içme suyu barajında sürekli izleme.',
        },
      },
      {
        name: 'River baseline',
        year: 2025,
        summary: {
          en: 'A year of readings released as an open dataset.',
          tr: 'Bir yıllık ölçüm açık veri kümesi olarak yayımlandı.',
        },
      },
    ],
  },
  {
    slug: 'northbeam-data',
    name: 'Northbeam Data',
    sector: 'ai',
    stage: 'seriesA',
    founded: 2021,
    joined: 2024,
    headcount: 95,
    building: 'E',
    hiring: true,
    openRoles: 4,
    website: 'northbeam-data.example.com',
    email: 'hello@northbeam-data.example.com',
    phone: '+90 312 555 0123',
    about: {
      en: 'Northbeam Data builds the platform underneath analytics work — ingestion, storage, and the contracts between teams that stop a schema change from breaking six dashboards downstream.',
      tr: "Northbeam Data analitik çalışmanın altındaki platformu kuruyor: veri alımı, depolama ve bir şema değişikliğinin altı dashboard'u bozmasını engelleyen ekipler arası sözleşmeler.",
    },
    expertise: [
      { en: 'Natural language processing', tr: 'Doğal dil işleme' },
      { en: 'Computer vision', tr: 'Bilgisayarlı görü' },
      { en: 'Data engineering', tr: 'Veri mühendisliği' },
    ],
    products: [
      {
        name: 'Northbeam Pipe',
        summary: {
          en: 'Ingestion with schema contracts enforced at write time.',
          tr: 'Yazma anında uygulanan şema sözleşmeleriyle veri alımı.',
        },
      },
      {
        name: 'Northbeam Catalog',
        summary: {
          en: 'A catalogue that shows who depends on a table before it changes.',
          tr: 'Bir tablo değişmeden önce ona kimin bağımlı olduğunu gösteren katalog.',
        },
      },
    ],
    projects: [
      {
        name: 'Retail data platform',
        year: 2026,
        summary: {
          en: 'Replaced nightly batch with streaming ingestion for a retailer.',
          tr: 'Bir perakendecide gecelik toplu işlemi akış tabanlı veri alımıyla değiştirdi.',
        },
      },
      {
        name: 'Campus data commons',
        year: 2025,
        summary: {
          en: 'Shared datasets the resident teams publish to.',
          tr: 'Yerleşik ekiplerin yayımladığı ortak veri kümeleri.',
        },
      },
    ],
  },
  {
    slug: 'karbonsuz',
    name: 'Karbonsuz',
    sector: 'energy',
    stage: 'seed',
    founded: 2023,
    joined: 2026,
    headcount: 24,
    building: 'F',
    hiring: true,
    openRoles: 2,
    website: 'karbonsuz.example.com',
    email: 'hello@karbonsuz.example.com',
    phone: '+90 312 555 0124',
    about: {
      en: 'Karbonsuz does carbon accounting for companies that have to report it and would rather the number were defensible. Measurement before mitigation, which is a slower story than most of this sector tells.',
      tr: 'Karbonsuz, raporlamak zorunda olan ve sayının savunulabilir olmasını isteyen şirketler için karbon muhasebesi yapıyor. Azaltmadan önce ölçüm; sektörün çoğunun anlattığından daha yavaş bir hikâye.',
    },
    expertise: [
      { en: 'Power electronics', tr: 'Güç elektroniği' },
      { en: 'Market operations', tr: 'Piyasa operasyonları' },
      { en: 'Grid integration', tr: 'Şebeke entegrasyonu' },
    ],
    products: [
      {
        name: 'Karbonsuz Ledger',
        summary: {
          en: 'Emissions accounting with a source document behind every figure.',
          tr: 'Her rakamın arkasında bir kaynak belge olan emisyon muhasebesi.',
        },
      },
      {
        name: 'Karbonsuz Supply',
        summary: {
          en: 'Supplier emissions collection that does not rely on estimates.',
          tr: 'Tahminlere dayanmayan tedarikçi emisyon toplama.',
        },
      },
    ],
    projects: [
      {
        name: 'Manufacturer inventory',
        year: 2026,
        summary: {
          en: 'A full scope 1-3 inventory for a mid-size manufacturer.',
          tr: 'Orta ölçekli bir üretici için tam kapsam 1-3 envanteri.',
        },
      },
      {
        name: 'Campus footprint',
        year: 2025,
        summary: {
          en: "The tech park's own reported footprint, published in full.",
          tr: 'Teknoparkın kendi raporlanan ayak izi, tümüyle yayımlandı.',
        },
      },
    ],
  },
  {
    slug: 'freightloop',
    name: 'Freightloop',
    sector: 'mobility',
    stage: 'growth',
    founded: 2016,
    joined: 2017,
    headcount: 219,
    building: 'A',
    hiring: false,
    openRoles: 0,
    website: 'freightloop.example.com',
    email: 'hello@freightloop.example.com',
    phone: '+90 312 555 0125',
    about: {
      en: 'Freightloop matches freight to capacity that is already moving, which is a market problem more than a software one. It is one of the larger residents and most of its engineering is about trust, not routing.',
      tr: 'Freightloop, yükü zaten hareket hâlindeki kapasiteyle eşleştiriyor; bu bir yazılım probleminden çok bir piyasa problemi. Daha büyük yerleşiklerden biri ve mühendisliğinin çoğu rotalama değil güven üzerine.',
    },
    expertise: [
      { en: 'Transport modelling', tr: 'Ulaşım modellemesi' },
      { en: 'Fleet electrification', tr: 'Filo elektrifikasyonu' },
      { en: 'Route optimisation', tr: 'Rota optimizasyonu' },
    ],
    products: [
      {
        name: 'Freightloop Match',
        summary: {
          en: 'Load matching against capacity already on the road.',
          tr: 'Zaten yolda olan kapasiteyle yük eşleştirme.',
        },
      },
      {
        name: 'Freightloop Docs',
        summary: {
          en: 'Freight documentation that clears a border without a courier.',
          tr: 'Kurye olmadan sınır geçiren yük belgelendirmesi.',
        },
      },
    ],
    projects: [
      {
        name: 'Cross-border corridor',
        year: 2026,
        summary: {
          en: 'Digital documentation on a two-country freight corridor.',
          tr: 'İki ülkeli bir yük koridorunda dijital belgelendirme.',
        },
      },
      {
        name: 'Empty running study',
        year: 2024,
        summary: {
          en: 'Measured and cut empty running across 2,000 journeys.',
          tr: '2.000 sefer boyunca boş dönüşü ölçtü ve azalttı.',
        },
      },
    ],
  },
  {
    slug: 'nabiz-health',
    name: 'Nabız Health',
    sector: 'health',
    stage: 'seed',
    founded: 2024,
    joined: 2026,
    headcount: 16,
    building: 'B',
    hiring: true,
    openRoles: 2,
    website: 'nabiz-health.example.com',
    email: 'hello@nabiz-health.example.com',
    phone: '+90 312 555 0126',
    about: {
      en: 'Nabız Health does remote monitoring for patients who have been discharged but are not finished. Sixteen people, and a product whose hardest requirement is that a clinician trusts what it sends them.',
      tr: 'Nabız Health, taburcu edilmiş ama işi bitmemiş hastalar için uzaktan izleme yapıyor. On altı kişi ve en zor gereksinimi bir klinisyenin gönderdiğine güvenmesi olan bir ürün.',
    },
    expertise: [
      { en: 'Clinical software', tr: 'Klinik yazılım' },
      { en: 'Diagnostics', tr: 'Tanı' },
      { en: 'Medical devices', tr: 'Tıbbi cihaz' },
    ],
    products: [
      {
        name: 'Nabız Home',
        summary: {
          en: 'Post-discharge monitoring with clinician-set thresholds.',
          tr: 'Klinisyenin belirlediği eşiklerle taburculuk sonrası izleme.',
        },
      },
      {
        name: 'Nabız Triage',
        summary: {
          en: 'A triage queue that ranks by change, not by reading.',
          tr: 'Ölçüme değil değişime göre sıralayan triyaj kuyruğu.',
        },
      },
    ],
    projects: [
      {
        name: 'Cardiology pilot',
        year: 2026,
        summary: {
          en: 'Ninety discharged cardiology patients over four months.',
          tr: 'Dört ay boyunca doksan taburcu kardiyoloji hastası.',
        },
      },
      {
        name: 'Alert fatigue study',
        year: 2025,
        summary: {
          en: 'Cut false alerts by 61% without missing a real one.',
          tr: 'Gerçek bir uyarıyı kaçırmadan yanlış uyarıları %61 azalttı.',
        },
      },
    ],
  },
  {
    slug: 'graphene-foundry',
    name: 'Graphene Foundry',
    sector: 'materials',
    stage: 'seriesB',
    founded: 2018,
    joined: 2021,
    headcount: 127,
    building: 'C',
    hiring: true,
    openRoles: 6,
    website: 'graphene-foundry.example.com',
    email: 'hello@graphene-foundry.example.com',
    phone: '+90 312 555 0127',
    about: {
      en: 'Graphene Foundry produces graphene films at a size and consistency that makes them usable in a product rather than in a paper. Scaling a laboratory process is the entire company.',
      tr: 'Graphene Foundry, grafen filmleri bir makalede değil bir üründe kullanılabilir kılacak boyut ve tutarlılıkta üretiyor. Şirketin tamamı bir laboratuvar sürecini ölçeklendirmekten ibaret.',
    },
    expertise: [
      { en: 'Material characterisation', tr: 'Malzeme karakterizasyonu' },
      { en: 'Process scale-up', tr: 'Proses ölçekleme' },
      { en: 'Surface engineering', tr: 'Yüzey mühendisliği' },
    ],
    products: [
      {
        name: 'Foundry Film',
        summary: {
          en: 'Continuous graphene film in widths up to 600 mm.',
          tr: '600 mm genişliğe kadar sürekli grafen film.',
        },
      },
      {
        name: 'Foundry Coat',
        summary: {
          en: 'A conductive coating for flexible sensor substrates.',
          tr: 'Esnek sensör altlıkları için iletken kaplama.',
        },
      },
    ],
    projects: [
      {
        name: 'Sensor substrate supply',
        year: 2026,
        summary: {
          en: 'Supplies film to three resident sensor teams.',
          tr: 'Üç yerleşik sensör ekibine film tedarik ediyor.',
        },
      },
      {
        name: 'Continuous line',
        year: 2024,
        summary: {
          en: 'Moved from batch sheets to a continuous roll process.',
          tr: 'Parti hâlinde levhadan sürekli rulo sürecine geçti.',
        },
      },
    ],
  },
  {
    slug: 'sidereal-optics',
    name: 'Sidereal Optics',
    sector: 'space',
    stage: 'seriesB',
    founded: 2017,
    joined: 2021,
    headcount: 149,
    building: 'D',
    hiring: false,
    openRoles: 0,
    website: 'sidereal-optics.example.com',
    email: 'hello@sidereal-optics.example.com',
    phone: '+90 312 555 0128',
    about: {
      en: 'Sidereal Optics designs and builds optical payloads — the part of a satellite that has to survive launch and then work perfectly for years with nobody able to touch it.',
      tr: 'Sidereal Optics optik faydalı yükler tasarlıyor ve üretiyor: bir uydunun fırlatmadan sağ çıkıp sonra yıllarca kimsenin dokunamayacağı şekilde kusursuz çalışması gereken kısmı.',
    },
    expertise: [
      { en: 'Optical design', tr: 'Optik tasarım' },
      { en: 'Environmental qualification', tr: 'Çevresel nitelendirme' },
      { en: 'Mission operations', tr: 'Misyon operasyonları' },
    ],
    products: [
      {
        name: 'Sidereal Imager',
        summary: {
          en: 'A compact imaging payload for small satellite buses.',
          tr: 'Küçük uydu platformları için kompakt görüntüleme faydalı yükü.',
        },
      },
      {
        name: 'Sidereal Bench',
        summary: {
          en: 'Optical alignment services for other campus teams.',
          tr: 'Diğer kampüs ekipleri için optik hizalama hizmetleri.',
        },
      },
    ],
    projects: [
      {
        name: 'Observation constellation',
        year: 2026,
        summary: {
          en: 'Imaging payloads for a six-satellite observation constellation.',
          tr: 'Altı uydulu gözlem takımyıldızı için görüntüleme faydalı yükleri.',
        },
      },
      {
        name: 'Vibration qualification',
        year: 2024,
        summary: {
          en: 'Full launch qualification of the imager on campus.',
          tr: 'Görüntüleyicinin kampüste tam fırlatma nitelendirmesi.',
        },
      },
    ],
  },
  {
    slug: 'ledgerpoint',
    name: 'Ledgerpoint',
    sector: 'fintech',
    stage: 'seed',
    founded: 2023,
    joined: 2024,
    headcount: 27,
    building: 'E',
    hiring: true,
    openRoles: 2,
    website: 'ledgerpoint.example.com',
    email: 'hello@ledgerpoint.example.com',
    phone: '+90 312 555 0129',
    about: {
      en: 'Ledgerpoint builds accounting infrastructure for software companies that discovered, too late, that a payments table is not a ledger. Twenty-seven people and a very narrow product.',
      tr: 'Ledgerpoint, bir ödemeler tablosunun defter olmadığını çok geç fark eden yazılım şirketleri için muhasebe altyapısı kuruyor. Yirmi yedi kişi ve çok dar bir ürün.',
    },
    expertise: [
      { en: 'Risk and fraud', tr: 'Risk ve dolandırıcılık' },
      { en: 'Regulatory reporting', tr: 'Regülasyon raporlaması' },
      { en: 'Payment infrastructure', tr: 'Ödeme altyapısı' },
    ],
    products: [
      {
        name: 'Ledgerpoint Core',
        summary: {
          en: 'A double-entry ledger exposed as an API.',
          tr: 'API olarak sunulan çift taraflı kayıt defteri.',
        },
      },
      {
        name: 'Ledgerpoint Close',
        summary: {
          en: 'Month-end close that reconciles before it reports.',
          tr: 'Raporlamadan önce mutabakat yapan ay sonu kapanışı.',
        },
      },
    ],
    projects: [
      {
        name: 'SaaS migration',
        year: 2026,
        summary: {
          en: 'Moved a subscription business off spreadsheet accounting.',
          tr: 'Bir abonelik işletmesini tablo tabanlı muhasebeden taşıdı.',
        },
      },
      {
        name: 'Audit readiness',
        year: 2025,
        summary: {
          en: 'First customer through an external audit with no adjustments.',
          tr: 'İlk müşterisi dış denetimden düzeltmesiz geçti.',
        },
      },
    ],
  },
  {
    slug: 'verdant-sensors',
    name: 'Verdant Sensors',
    sector: 'agritech',
    stage: 'seriesB',
    founded: 2017,
    joined: 2019,
    headcount: 118,
    building: 'F',
    hiring: true,
    openRoles: 5,
    website: 'verdant-sensors.example.com',
    email: 'hello@verdant-sensors.example.com',
    phone: '+90 312 555 0130',
    about: {
      en: "Verdant Sensors reads crops from above and from the canopy, and the useful part is combining the two. It has been at this long enough to know that a season's data beats a week's demonstration.",
      tr: 'Verdant Sensors ürünleri hem yukarıdan hem bitki örtüsü içinden okuyor; faydalı kısım ikisini birleştirmek. Bir sezonluk verinin bir haftalık demoyu yendiğini bilecek kadar uzun süredir bu işte.',
    },
    expertise: [
      { en: 'Agronomy', tr: 'Ziraat' },
      { en: 'Soil sensing', tr: 'Toprak algılama' },
      { en: 'Precision irrigation', tr: 'Hassas sulama' },
    ],
    products: [
      {
        name: 'Verdant Canopy',
        summary: {
          en: 'In-canopy sensing for disease and water stress.',
          tr: 'Hastalık ve su stresi için bitki örtüsü içi algılama.',
        },
      },
      {
        name: 'Verdant Map',
        summary: {
          en: 'Field maps that combine aerial imagery with ground readings.',
          tr: 'Havadan görüntüyü yer ölçümleriyle birleştiren tarla haritaları.',
        },
      },
    ],
    projects: [
      {
        name: 'Vineyard programme',
        year: 2026,
        summary: {
          en: 'Disease prediction across 900 hectares of vineyard.',
          tr: '900 hektar bağda hastalık tahmini.',
        },
      },
      {
        name: 'Open canopy dataset',
        year: 2024,
        summary: {
          en: 'Three seasons of canopy readings released publicly.',
          tr: 'Üç sezonluk bitki örtüsü ölçümü kamuya açıldı.',
        },
      },
    ],
  },
  {
    slug: 'zeroday-labs',
    name: 'Zeroday Labs',
    sector: 'cybersecurity',
    stage: 'seriesA',
    founded: 2021,
    joined: 2024,
    headcount: 64,
    building: 'A',
    hiring: false,
    openRoles: 0,
    website: 'zeroday-labs.example.com',
    email: 'hello@zeroday-labs.example.com',
    phone: '+90 312 555 0131',
    about: {
      en: 'Zeroday Labs does vulnerability research and turns what it finds into something a defender can use. Sixty-four people, and a disclosure policy it has never quietly bent.',
      tr: 'Zeroday Labs zafiyet araştırması yapıyor ve bulduklarını bir savunmacının kullanabileceği hâle getiriyor. Altmış dört kişi ve hiçbir zaman sessizce esnetmediği bir açıklama politikası.',
    },
    expertise: [
      { en: 'Threat detection', tr: 'Tehdit tespiti' },
      { en: 'Identity and access', tr: 'Kimlik ve erişim' },
      { en: 'Vulnerability research', tr: 'Zafiyet araştırması' },
    ],
    products: [
      {
        name: 'Zeroday Feed',
        summary: {
          en: 'Research-backed detection content, updated weekly.',
          tr: 'Araştırmaya dayalı, haftalık güncellenen tespit içeriği.',
        },
      },
      {
        name: 'Zeroday Range',
        summary: {
          en: 'A practice range built from real disclosed vulnerabilities.',
          tr: 'Gerçek açıklanmış zafiyetlerden kurulmuş pratik ortamı.',
        },
      },
    ],
    projects: [
      {
        name: 'Industrial protocol review',
        year: 2026,
        summary: {
          en: 'Audited a widely deployed industrial control protocol.',
          tr: 'Yaygın kullanılan bir endüstriyel kontrol protokolünü denetledi.',
        },
      },
      {
        name: 'Campus exercise',
        year: 2025,
        summary: {
          en: 'A live defence exercise run with Cipherline and Kalkan.',
          tr: 'Cipherline ve Kalkan ile yürütülen canlı savunma tatbikatı.',
        },
      },
    ],
  },
  {
    slug: 'gripline',
    name: 'Gripline',
    sector: 'robotics',
    stage: 'seed',
    founded: 2024,
    joined: 2026,
    headcount: 13,
    building: 'B',
    hiring: true,
    openRoles: 2,
    website: 'gripline.example.com',
    email: 'hello@gripline.example.com',
    phone: '+90 312 555 0132',
    about: {
      en: 'Gripline makes grippers, and only grippers. Thirteen people who decided that the end of a robot arm is a hard enough problem to be a company on its own.',
      tr: 'Gripline tutucu üretiyor, sadece tutucu. Bir robot kolunun ucunun tek başına bir şirket olmaya yetecek kadar zor bir problem olduğuna karar vermiş on üç kişi.',
    },
    expertise: [
      { en: 'Perception', tr: 'Algı' },
      { en: 'End effectors', tr: 'Uç işlevciler' },
      { en: 'Industrial automation', tr: 'Endüstriyel otomasyon' },
    ],
    products: [
      {
        name: 'Gripline Soft',
        summary: {
          en: 'A soft gripper for produce and irregular items.',
          tr: 'Ürün ve düzensiz nesneler için yumuşak tutucu.',
        },
      },
      {
        name: 'Gripline Sense',
        summary: {
          en: 'A gripper with force feedback fine enough to feel a slip.',
          tr: 'Kaymayı hissedecek kadar hassas kuvvet geri beslemeli tutucu.',
        },
      },
    ],
    projects: [
      {
        name: 'Packing line trial',
        year: 2026,
        summary: {
          en: "Ran on Halcyon's picking cells for a full shift.",
          tr: "Halcyon'un toplama hücrelerinde tam bir vardiya çalıştı.",
        },
      },
      {
        name: 'Laboratory automation',
        year: 2025,
        summary: {
          en: 'Sample handling for the campus biotech laboratories.',
          tr: 'Kampüs biyoteknoloji laboratuvarları için numune taşıma.',
        },
      },
    ],
  },
  {
    slug: 'manufakt',
    name: 'Manufakt',
    sector: 'industrial',
    stage: 'growth',
    founded: 2015,
    joined: 2016,
    headcount: 231,
    building: 'C',
    hiring: true,
    openRoles: 10,
    website: 'manufakt.example.com',
    email: 'hello@manufakt.example.com',
    phone: '+90 312 555 0133',
    about: {
      en: 'Manufakt schedules factories — deciding what runs next when the machine that was supposed to run it has just gone down. It is one of the older residents and its software is in plants on three continents.',
      tr: 'Manufakt fabrika çizelgeliyor: çalıştırması gereken makine az önce durduğunda sırada ne olacağına karar veriyor. Eski yerleşiklerden biri ve yazılımı üç kıtadaki tesislerde çalışıyor.',
    },
    expertise: [
      { en: 'Traceability', tr: 'İzlenebilirlik' },
      { en: 'Machine integration', tr: 'Makine entegrasyonu' },
      { en: 'Quality systems', tr: 'Kalite sistemleri' },
    ],
    products: [
      {
        name: 'Manufakt Plan',
        summary: {
          en: 'Scheduling that replans around a machine going down.',
          tr: 'Bir makine durduğunda yeniden planlayan çizelgeleme.',
        },
      },
      {
        name: 'Manufakt Capacity',
        summary: {
          en: 'Capacity modelling for quoting a delivery date honestly.',
          tr: 'Dürüst bir teslim tarihi vermek için kapasite modellemesi.',
        },
      },
    ],
    projects: [
      {
        name: 'Three-plant rollout',
        year: 2026,
        summary: {
          en: 'One schedule across three plants and a shared order book.',
          tr: 'Üç tesis ve ortak sipariş defteri için tek çizelge.',
        },
      },
      {
        name: 'Changeover study',
        year: 2023,
        summary: {
          en: 'Cut changeover time 22% by resequencing alone.',
          tr: 'Yalnızca sıralamayı değiştirerek geçiş süresini %22 azalttı.',
        },
      },
    ],
  },
  {
    slug: 'iklim-analitik',
    name: 'İklim Analitik',
    sector: 'climate',
    stage: 'seriesA',
    founded: 2020,
    joined: 2022,
    headcount: 78,
    building: 'D',
    hiring: true,
    openRoles: 4,
    website: 'iklim-analitik.example.com',
    email: 'hello@iklim-analitik.example.com',
    phone: '+90 312 555 0134',
    about: {
      en: 'İklim Analitik turns decades of readings into climate risk a company can put in a filing. The modelling is the visible part; defending a number to an auditor is the work.',
      tr: 'İklim Analitik, on yılların ölçümlerini bir şirketin beyanına koyabileceği iklim riskine çeviriyor. Modelleme görünen kısım; asıl iş bir sayıyı denetçiye karşı savunmak.',
    },
    expertise: [
      { en: 'Emissions accounting', tr: 'Emisyon muhasebesi' },
      { en: 'Open data', tr: 'Açık veri' },
      { en: 'Environmental monitoring', tr: 'Çevresel izleme' },
    ],
    products: [
      {
        name: 'İklim Risk',
        summary: {
          en: 'Physical climate risk scoring by asset location.',
          tr: 'Varlık konumuna göre fiziksel iklim riski skorlaması.',
        },
      },
      {
        name: 'İklim Archive',
        summary: {
          en: 'A cleaned regional observation archive going back forty years.',
          tr: 'Kırk yıl geriye giden temizlenmiş bölgesel gözlem arşivi.',
        },
      },
    ],
    projects: [
      {
        name: 'Bank portfolio review',
        year: 2026,
        summary: {
          en: 'Physical risk scoring across a lending portfolio.',
          tr: 'Bir kredi portföyünde fiziksel risk skorlaması.',
        },
      },
      {
        name: 'Flood baseline',
        year: 2024,
        summary: {
          en: 'A regional flood baseline released with the water authority.',
          tr: 'Su idaresiyle birlikte yayımlanan bölgesel taşkın referansı.',
        },
      },
    ],
  },
  {
    slug: 'verity-models',
    name: 'Verity Models',
    sector: 'ai',
    stage: 'growth',
    founded: 2016,
    joined: 2019,
    headcount: 296,
    building: 'E',
    hiring: false,
    openRoles: 0,
    website: 'verity-models.example.com',
    email: 'hello@verity-models.example.com',
    phone: '+90 312 555 0135',
    about: {
      en: 'Verity Models evaluates machine learning systems for people who have to sign off on them. It is deliberately not in the business of building models, which is what makes its results worth anything.',
      tr: 'Verity Models, onay vermek zorunda olanlar için makine öğrenmesi sistemlerini değerlendiriyor. Bilinçli olarak model geliştirme işinde değil; sonuçlarını değerli kılan da bu.',
    },
    expertise: [
      { en: 'Data engineering', tr: 'Veri mühendisliği' },
      { en: 'Model evaluation', tr: 'Model değerlendirme' },
      { en: 'MLOps', tr: 'MLOps' },
    ],
    products: [
      {
        name: 'Verity Bench',
        summary: {
          en: 'Evaluation suites with a documented method per test.',
          tr: 'Her test için belgelenmiş yöntemi olan değerlendirme setleri.',
        },
      },
      {
        name: 'Verity Report',
        summary: {
          en: 'Assessment reports written for a risk committee, not an engineer.',
          tr: 'Bir mühendis için değil risk komitesi için yazılmış değerlendirme raporları.',
        },
      },
    ],
    projects: [
      {
        name: 'Credit model assessment',
        year: 2026,
        summary: {
          en: "Independent assessment of a bank's credit scoring model.",
          tr: 'Bir bankanın kredi skorlama modelinin bağımsız değerlendirmesi.',
        },
      },
      {
        name: 'Public evaluation set',
        year: 2025,
        summary: {
          en: 'An open benchmark for document extraction accuracy.',
          tr: 'Belge çıkarım doğruluğu için açık bir kıyaslama seti.',
        },
      },
    ],
  },
  {
    slug: 'tideline-power',
    name: 'Tideline Power',
    sector: 'energy',
    stage: 'seriesB',
    founded: 2018,
    joined: 2022,
    headcount: 152,
    building: 'F',
    hiring: true,
    openRoles: 7,
    website: 'tideline-power.example.com',
    email: 'hello@tideline-power.example.com',
    phone: '+90 312 555 0136',
    about: {
      en: 'Tideline Power works on tidal generation and the storage that makes a predictable but intermittent source useful. Predictability is its whole advantage and it builds everything around that.',
      tr: 'Tideline Power, gelgit üretimi ve öngörülebilir ama kesintili bir kaynağı faydalı kılan depolama üzerine çalışıyor. Öngörülebilirlik tek avantajı ve her şeyi bunun etrafında kuruyor.',
    },
    expertise: [
      { en: 'Grid integration', tr: 'Şebeke entegrasyonu' },
      { en: 'Energy storage', tr: 'Enerji depolama' },
      { en: 'Generation forecasting', tr: 'Üretim tahminleme' },
    ],
    products: [
      {
        name: 'Tideline Array',
        summary: {
          en: 'A modular tidal generation unit for estuary sites.',
          tr: 'Haliç sahaları için modüler gelgit üretim ünitesi.',
        },
      },
      {
        name: 'Tideline Store',
        summary: {
          en: 'Storage sized to a tidal cycle rather than a daily one.',
          tr: 'Günlük değil gelgit döngüsüne göre boyutlandırılmış depolama.',
        },
      },
    ],
    projects: [
      {
        name: 'Estuary pilot',
        year: 2026,
        summary: {
          en: 'Two units in an estuary, generating into the local grid.',
          tr: 'Bir haliçte yerel şebekeye üretim yapan iki ünite.',
        },
      },
      {
        name: 'Grid balancing trial',
        year: 2024,
        summary: {
          en: "Balanced against Nordwind's wind output for one quarter.",
          tr: "Bir çeyrek boyunca Nordwind'in rüzgâr üretimiyle dengelendi.",
        },
      },
    ],
  },
  {
    slug: 'urbanflow',
    name: 'Urbanflow',
    sector: 'mobility',
    stage: 'seed',
    founded: 2023,
    joined: 2024,
    headcount: 22,
    building: 'A',
    hiring: true,
    openRoles: 2,
    website: 'urbanflow.example.com',
    email: 'hello@urbanflow.example.com',
    phone: '+90 312 555 0137',
    about: {
      en: 'Urbanflow measures how people actually move through a city, as opposed to how a transport plan assumed they would. Twenty-two people and a lot of arguments with planning departments.',
      tr: 'Urbanflow, insanların bir şehirde gerçekte nasıl hareket ettiğini ölçüyor; bir ulaşım planının varsaydığı gibi değil. Yirmi iki kişi ve planlama birimleriyle bolca tartışma.',
    },
    expertise: [
      { en: 'Route optimisation', tr: 'Rota optimizasyonu' },
      { en: 'Telematics', tr: 'Telematik' },
      { en: 'Charging infrastructure', tr: 'Şarj altyapısı' },
    ],
    products: [
      {
        name: 'Urbanflow Count',
        summary: {
          en: 'Anonymous movement counts across a street network.',
          tr: 'Sokak ağı genelinde anonim hareket sayımı.',
        },
      },
      {
        name: 'Urbanflow Model',
        summary: {
          en: 'Demand modelling that a transport plan can be checked against.',
          tr: 'Bir ulaşım planının karşısında sınanabileceği talep modellemesi.',
        },
      },
    ],
    projects: [
      {
        name: 'City centre study',
        year: 2026,
        summary: {
          en: 'Measured the effect of a street closure over six months.',
          tr: 'Bir sokak kapanmasının etkisini altı ay boyunca ölçtü.',
        },
      },
      {
        name: 'Campus access survey',
        year: 2025,
        summary: {
          en: "How the tech park's 3,200 people actually arrive.",
          tr: 'Teknoparkın 3.200 kişisinin gerçekte nasıl geldiği.',
        },
      },
    ],
  },
  {
    slug: 'protea-diagnostics',
    name: 'Protea Diagnostics',
    sector: 'health',
    stage: 'growth',
    founded: 2015,
    joined: 2017,
    headcount: 253,
    building: 'B',
    hiring: true,
    openRoles: 12,
    website: 'protea-diagnostics.example.com',
    email: 'hello@protea-diagnostics.example.com',
    phone: '+90 312 555 0138',
    about: {
      en: 'Protea Diagnostics develops diagnostic assays and the instruments that run them. One of the largest residents, and the one with the longest gap between a good idea and a product anyone may use.',
      tr: 'Protea Diagnostics tanı testleri ve bunları çalıştıran cihazları geliştiriyor. En büyük yerleşiklerden biri ve iyi bir fikirle kullanılabilir bir ürün arasındaki mesafesi en uzun olanı.',
    },
    expertise: [
      { en: 'Medical devices', tr: 'Tıbbi cihaz' },
      { en: 'Regulatory affairs', tr: 'Regülasyon' },
      { en: 'Remote monitoring', tr: 'Uzaktan izleme' },
    ],
    products: [
      {
        name: 'Protea Panel',
        summary: {
          en: 'A multiplex assay panel for respiratory infection.',
          tr: 'Solunum yolu enfeksiyonu için çoklu test paneli.',
        },
      },
      {
        name: 'Protea Bench',
        summary: {
          en: 'The benchtop analyser the panels are certified on.',
          tr: 'Panellerin sertifikalandırıldığı masaüstü analiz cihazı.',
        },
      },
    ],
    projects: [
      {
        name: 'Regulatory submission',
        year: 2026,
        summary: {
          en: 'Full submission for the respiratory panel in two markets.',
          tr: 'Solunum paneli için iki pazarda tam başvuru.',
        },
      },
      {
        name: 'Field evaluation',
        year: 2025,
        summary: {
          en: 'Evaluated in nine clinics against the reference method.',
          tr: 'Dokuz klinikte referans yönteme karşı değerlendirildi.',
        },
      },
    ],
  },
  {
    slug: 'sonar-acoustics',
    name: 'Sonar Acoustics',
    sector: 'materials',
    stage: 'seed',
    founded: 2024,
    joined: 2026,
    headcount: 12,
    building: 'C',
    hiring: false,
    openRoles: 0,
    website: 'sonar-acoustics.example.com',
    email: 'hello@sonar-acoustics.example.com',
    phone: '+90 312 555 0139',
    about: {
      en: 'Sonar Acoustics develops materials that absorb sound in places where a thick panel will not fit. Twelve people, working almost entirely inside the campus materials laboratories.',
      tr: 'Sonar Acoustics, kalın bir panelin sığmayacağı yerlerde sesi soğuran malzemeler geliştiriyor. Neredeyse tamamen kampüs malzeme laboratuvarlarında çalışan on iki kişi.',
    },
    expertise: [
      { en: 'Surface engineering', tr: 'Yüzey mühendisliği' },
      { en: 'Structural testing', tr: 'Yapısal test' },
      { en: 'Composite formulation', tr: 'Kompozit formülasyon' },
    ],
    products: [
      {
        name: 'Sonar Thin',
        summary: {
          en: 'A 6 mm absorber with the performance of a 40 mm panel.',
          tr: "40 mm'lik bir panelin performansına sahip 6 mm'lik soğurucu.",
        },
      },
      {
        name: 'Sonar Cast',
        summary: {
          en: 'A castable acoustic material for irregular cavities.',
          tr: 'Düzensiz boşluklar için dökülebilir akustik malzeme.',
        },
      },
    ],
    projects: [
      {
        name: 'Rail cabin trial',
        year: 2026,
        summary: {
          en: 'Cabin noise reduction on a rolling stock prototype.',
          tr: 'Bir vagon prototipinde kabin gürültüsünün azaltılması.',
        },
      },
      {
        name: 'Laboratory characterisation',
        year: 2025,
        summary: {
          en: 'Built a measurement rig in the shared materials lab.',
          tr: 'Ortak malzeme laboratuvarında bir ölçüm düzeneği kurdu.',
        },
      },
    ],
  },
  {
    slug: 'foundrysoft',
    name: 'Foundrysoft',
    sector: 'industrial',
    stage: 'seriesA',
    founded: 2022,
    joined: 2026,
    headcount: 54,
    building: 'D',
    hiring: true,
    openRoles: 2,
    website: 'foundrysoft.example.com',
    email: 'hello@foundrysoft.example.com',
    phone: '+90 312 555 0140',
    about: {
      en: 'Foundrysoft writes software for foundries — heat tracking, mould scheduling, and the quality record that has to follow a casting for years. A small team in a very specific industry.',
      tr: 'Foundrysoft dökümhaneler için yazılım yazıyor: döküm takibi, kalıp çizelgeleme ve bir dökümü yıllarca izlemesi gereken kalite kaydı. Çok spesifik bir sektörde küçük bir ekip.',
    },
    expertise: [
      { en: 'Quality systems', tr: 'Kalite sistemleri' },
      { en: 'Manufacturing execution', tr: 'Üretim yürütme' },
      { en: 'Production scheduling', tr: 'Üretim çizelgeleme' },
    ],
    products: [
      {
        name: 'Foundry Track',
        summary: {
          en: 'Heat and batch tracking from melt to shipped casting.',
          tr: 'Ergitmeden sevk edilen döküme kadar döküm ve parti takibi.',
        },
      },
      {
        name: 'Foundry Spec',
        summary: {
          en: 'Alloy specification management with revision history.',
          tr: 'Revizyon geçmişiyle alaşım şartname yönetimi.',
        },
      },
    ],
    projects: [
      {
        name: 'Foundry rollout',
        year: 2026,
        summary: {
          en: 'Deployed across two foundries and a machining shop.',
          tr: 'İki dökümhane ve bir talaşlı imalat atölyesine kuruldu.',
        },
      },
      {
        name: 'Robot handling integration',
        year: 2024,
        summary: {
          en: "Integrated with Eksen's casting handling cells.",
          tr: "Eksen'in döküm taşıma hücreleriyle entegre edildi.",
        },
      },
    ],
  },
  {
    slug: 'basin-works',
    name: 'Basin Works',
    sector: 'climate',
    stage: 'seriesB',
    founded: 2019,
    joined: 2020,
    headcount: 109,
    building: 'E',
    hiring: true,
    openRoles: 5,
    website: 'basin-works.example.com',
    email: 'hello@basin-works.example.com',
    phone: '+90 312 555 0141',
    about: {
      en: 'Basin Works models water networks — where it comes from, where it leaks, and what happens when a pump stops. Its customers are utilities, so its timescales are measured in decades.',
      tr: 'Basin Works su şebekelerini modelliyor: su nereden geliyor, nereden kaçıyor ve bir pompa durduğunda ne oluyor. Müşterileri su idareleri olduğu için zaman ölçeği on yıllarla ölçülüyor.',
    },
    expertise: [
      { en: 'Environmental monitoring', tr: 'Çevresel izleme' },
      { en: 'Climate risk modelling', tr: 'İklim riski modellemesi' },
      { en: 'Hydrology', tr: 'Hidroloji' },
    ],
    products: [
      {
        name: 'Basin Model',
        summary: {
          en: 'Network modelling that finds a leak from pressure alone.',
          tr: 'Yalnızca basınçtan kaçak bulan şebeke modellemesi.',
        },
      },
      {
        name: 'Basin Plan',
        summary: {
          en: 'Renewal planning for a network nobody can shut down.',
          tr: 'Kimsenin kapatamayacağı bir şebeke için yenileme planlaması.',
        },
      },
    ],
    projects: [
      {
        name: 'Leak reduction programme',
        year: 2026,
        summary: {
          en: 'Cut non-revenue water by 18% across one utility.',
          tr: 'Bir su idaresinde gelir getirmeyen suyu %18 azalttı.',
        },
      },
      {
        name: 'Campus water loop',
        year: 2024,
        summary: {
          en: "Modelled and instrumented the tech park's own network.",
          tr: 'Teknoparkın kendi şebekesini modelledi ve donattı.',
        },
      },
    ],
  },
  {
    slug: 'palet-vision',
    name: 'Palet Vision',
    sector: 'ai',
    stage: 'scaleUp',
    founded: 2012,
    joined: 2014,
    headcount: 438,
    building: 'F',
    hiring: true,
    openRoles: 20,
    website: 'palet-vision.example.com',
    email: 'hello@palet-vision.example.com',
    phone: '+90 312 555 0142',
    about: {
      en: 'Palet Vision reads warehouses with cameras — what is on a pallet, whether it is damaged, and where it went. The oldest and largest resident, and the one whose product is least visible to the people using it.',
      tr: 'Palet Vision depoları kameralarla okuyor: bir palette ne var, hasarlı mı ve nereye gitti. En eski ve en büyük yerleşik; ürünü kullananlar için en görünmez olanı.',
    },
    expertise: [
      { en: 'MLOps', tr: 'MLOps' },
      { en: 'Natural language processing', tr: 'Doğal dil işleme' },
      { en: 'Computer vision', tr: 'Bilgisayarlı görü' },
    ],
    products: [
      {
        name: 'Palet Gate',
        summary: {
          en: 'Pallet identification and damage capture at a dock door.',
          tr: 'Rampa kapısında palet tanımlama ve hasar kaydı.',
        },
      },
      {
        name: 'Palet Count',
        summary: {
          en: 'Automated stock counting from fixed overhead cameras.',
          tr: 'Sabit tavan kameralarından otomatik stok sayımı.',
        },
      },
    ],
    projects: [
      {
        name: 'Distribution centre rollout',
        year: 2026,
        summary: {
          en: 'Twenty-two dock doors instrumented at one distribution centre.',
          tr: 'Bir dağıtım merkezinde yirmi iki rampa kapısı donatıldı.',
        },
      },
      {
        name: 'Damage claim dataset',
        year: 2024,
        summary: {
          en: 'Ten million labelled pallet images, used across the campus.',
          tr: 'Kampüs genelinde kullanılan on milyon etiketli palet görüntüsü.',
        },
      },
    ],
  },
]

/**
 * Figures the hero cannot carry. The hero states four headline numbers; these are the ones a
 * reader looks for once the headline has done its job.
 */
export const campusStatistics: { label: LocalizedText; value: string; note: LocalizedText }[] = [
  {
    label: { en: 'Campus area', tr: 'Kampüs alanı' },
    value: '182,000 m²',
    note: { en: 'Across six buildings', tr: 'Altı binada' },
  },
  {
    label: { en: 'Shared laboratories', tr: 'Ortak laboratuvar' },
    value: '24',
    note: { en: 'Bookable by the hour', tr: 'Saatlik rezerve edilebilir' },
  },
  {
    label: { en: 'R&D spend on campus', tr: 'Kampüsteki Ar-Ge harcaması' },
    value: '€418M',
    note: { en: 'Reported for 2025', tr: '2025 için raporlandı' },
  },
  {
    label: { en: 'University partners', tr: 'Üniversite ortağı' },
    value: '11',
    note: { en: 'Joint research programs', tr: 'Ortak araştırma programı' },
  },
  {
    label: { en: 'Capital raised by residents', tr: 'Yerleşiklerin topladığı sermaye' },
    value: '€1.2B',
    note: { en: 'Since the campus opened', tr: 'Kampüs açıldığından beri' },
  },
  {
    label: { en: 'Open roles today', tr: 'Bugünkü açık pozisyon' },
    value: '640',
    note: { en: 'Across 31 companies', tr: '31 şirkette' },
  },
  {
    label: { en: 'Industrial pilots', tr: 'Endüstriyel pilot' },
    value: '96',
    note: { en: 'Run in the last year', tr: 'Son bir yılda yürütüldü' },
  },
  {
    label: { en: 'Renewable supply', tr: 'Yenilenebilir tedarik' },
    value: '78%',
    note: { en: 'Of campus electricity', tr: 'Kampüs elektriğinin' },
  },
]

/** The five sectors with the most residents, as a share of the campus. */
export const campusSectorShare: { sector: CompanySector; share: number }[] = [
  { sector: 'ai', share: 22 },
  { sector: 'energy', share: 18 },
  { sector: 'health', share: 15 },
  { sector: 'mobility', share: 12 },
  { sector: 'robotics', share: 9 },
]

export const campusUpdates: CampusUpdate[] = [
  {
    id: 'winter-cohort-applications',
    kind: 'announcement',
    title: {
      en: 'Winter residency applications close on October 18',
      tr: 'Kış dönemi yerleşim başvuruları 18 Ekim’de kapanıyor',
    },
    summary: {
      en: 'Eighteen places are open for teams with a working prototype and a named industrial partner.',
      tr: 'Çalışan prototipi ve belirlenmiş bir sanayi ortağı olan ekipler için on sekiz yer açık.',
    },
    category: { en: 'Applications', tr: 'Başvurular' },
    date: '2026-09-11',
  },
  {
    id: 'lab-block-c-opens',
    kind: 'news',
    title: {
      en: 'Laboratory block C opens with a shared clean room',
      tr: 'C laboratuvar bloğu ortak temiz odayla açıldı',
    },
    summary: {
      en: 'An ISO 7 clean room, two electronics benches, and a materials testing bay are now bookable.',
      tr: 'ISO 7 temiz oda, iki elektronik tezgâhı ve bir malzeme test alanı artık rezerve edilebiliyor.',
    },
    category: { en: 'Campus', tr: 'Kampüs' },
    date: '2026-09-04',
    image: {
      src: innovationLab,
      alt: { en: 'The new laboratory block', tr: 'Yeni laboratuvar bloğu' },
    },
  },
  {
    id: 'aurora-orbital-contract',
    kind: 'news',
    title: {
      en: 'Aurora Orbital signs its first export contract in Asia',
      tr: 'Aurora Orbital Asya’daki ilk ihracat sözleşmesini imzaladı',
    },
    summary: {
      en: 'The resident company will supply ground station software to a regional satellite operator.',
      tr: 'Yerleşik şirket bölgesel bir uydu operatörüne yer istasyonu yazılımı sağlayacak.',
    },
    category: { en: 'Residents', tr: 'Yerleşikler' },
    date: '2026-08-27',
    image: {
      src: climateNetwork,
      alt: { en: 'Ground station coverage map', tr: 'Yer istasyonu kapsama haritası' },
    },
  },
  {
    id: 'maintenance-window',
    kind: 'announcement',
    title: {
      en: 'Planned power maintenance in buildings A and B',
      tr: 'A ve B binalarında planlı elektrik bakımı',
    },
    summary: {
      en: 'Supply will switch to generators between 02:00 and 05:00 on September 21. Labs stay powered.',
      tr: '21 Eylül 02:00–05:00 arasında besleme jeneratöre geçecek. Laboratuvarların enerjisi kesilmeyecek.',
    },
    category: { en: 'Operations', tr: 'Operasyon' },
    date: '2026-08-22',
  },
  {
    id: 'investor-day',
    kind: 'news',
    title: {
      en: 'Autumn investor day brings 60 funds to the campus',
      tr: 'Sonbahar yatırımcı günü kampüse 60 fon getiriyor',
    },
    summary: {
      en: 'Twenty-four resident teams will present, with one-to-one meetings booked through the campus app.',
      tr: 'Yirmi dört yerleşik ekip sunum yapacak; birebir görüşmeler kampüs uygulamasından planlanıyor.',
    },
    category: { en: 'Programs', tr: 'Programlar' },
    date: '2026-08-14',
    image: {
      src: talentStudio,
      alt: { en: 'Teams presenting on investor day', tr: 'Yatırımcı gününde sunum yapan ekipler' },
    },
  },
  {
    id: 'campus-open-day',
    kind: 'announcement',
    title: {
      en: 'Open day for students on October 4',
      tr: '4 Ekim’de öğrencilere açık gün',
    },
    summary: {
      en: 'Lab tours, a hiring fair with 31 resident companies, and evening talks from four founders.',
      tr: 'Laboratuvar turları, 31 yerleşik şirketle kariyer fuarı ve dört kurucudan akşam konuşmaları.',
    },
    category: { en: 'Community', tr: 'Topluluk' },
    date: '2026-08-05',
    image: {
      src: communityCampus,
      alt: { en: 'The campus public realm', tr: 'Kampüs kamusal alanı' },
    },
  },
]

export const roleLevelLabels: Record<RoleLevel, LocalizedText> = {
  junior: { en: 'Junior', tr: 'Yeni başlayan' },
  mid: { en: 'Mid-level', tr: 'Orta seviye' },
  senior: { en: 'Senior', tr: 'Kıdemli' },
}

/**
 * The vacancies open in each sector. A company lists the ones it is filling; see SectorRole
 * for why the posting is written here rather than forty-two times over.
 */
export const companySectorRoles: Record<CompanySector, SectorRole[]> = {
  ai: [
    {
      id: 'research-engineer',
      title: { en: 'Research engineer', tr: 'Araştırma mühendisi' },
      level: 'senior',
      summary: {
        en: 'Take a model from a paper result to something that holds up on production traffic.',
        tr: 'Bir modeli makaledeki sonuçtan üretim trafiğinde ayakta kalan bir şeye taşıyın.',
      },
      skills: [
        { en: 'PyTorch', tr: 'PyTorch' },
        { en: 'Evaluation design', tr: 'Değerlendirme tasarımı' },
        { en: 'Distributed training', tr: 'Dağıtık eğitim' },
        { en: 'Python', tr: 'Python' },
      ],
    },
    {
      id: 'data-platform-engineer',
      title: { en: 'Data platform engineer', tr: 'Veri platformu mühendisi' },
      level: 'mid',
      summary: {
        en: 'Own the pipelines the models train on, including the part where the schema changes.',
        tr: 'Modellerin üzerinde eğitildiği veri hatlarını, şemanın değiştiği kısım dahil, sahiplenin.',
      },
      skills: [
        { en: 'Spark', tr: 'Spark' },
        { en: 'Data modelling', tr: 'Veri modelleme' },
        { en: 'Airflow', tr: 'Airflow' },
        { en: 'SQL', tr: 'SQL' },
      ],
    },
    {
      id: 'applied-scientist',
      title: { en: 'Applied scientist', tr: 'Uygulamalı bilimci' },
      level: 'mid',
      summary: {
        en: 'Decide what to measure, then defend the measurement when the result is inconvenient.',
        tr: 'Neyin ölçüleceğine karar verin, sonuç işinize gelmediğinde de ölçümü savunun.',
      },
      skills: [
        { en: 'Statistics', tr: 'İstatistik' },
        { en: 'Experiment design', tr: 'Deney tasarımı' },
        { en: 'Python', tr: 'Python' },
      ],
    },
  ],
  agritech: [
    {
      id: 'field-systems-engineer',
      title: { en: 'Field systems engineer', tr: 'Saha sistemleri mühendisi' },
      level: 'mid',
      summary: {
        en: 'Build hardware that keeps working after a season of dust, water and vibration.',
        tr: 'Bir sezonluk toz, su ve titreşimden sonra da çalışmaya devam eden donanım kurun.',
      },
      skills: [
        { en: 'Embedded C', tr: 'Gömülü C' },
        { en: 'Sensor integration', tr: 'Sensör entegrasyonu' },
        { en: 'Field testing', tr: 'Saha testi' },
      ],
    },
    {
      id: 'agronomist',
      title: { en: 'Agronomist', tr: 'Ziraat mühendisi' },
      level: 'mid',
      summary: {
        en: 'Turn sensor readings into advice a grower will actually follow.',
        tr: 'Sensör ölçümlerini bir üreticinin gerçekten uygulayacağı tavsiyeye çevirin.',
      },
      skills: [
        { en: 'Crop science', tr: 'Bitki bilimi' },
        { en: 'Field trials', tr: 'Tarla denemeleri' },
        { en: 'Data analysis', tr: 'Veri analizi' },
      ],
    },
    {
      id: 'mechanical-engineer',
      title: { en: 'Mechanical engineer', tr: 'Makine mühendisi' },
      level: 'junior',
      summary: {
        en: 'Design the mechanism that has to be gentler than a hand and faster than one.',
        tr: 'Bir elden daha nazik ve daha hızlı olması gereken mekanizmayı tasarlayın.',
      },
      skills: [
        { en: 'CAD', tr: 'CAD' },
        { en: 'Mechanism design', tr: 'Mekanizma tasarımı' },
        { en: 'Prototyping', tr: 'Prototipleme' },
      ],
    },
  ],
  climate: [
    {
      id: 'environmental-data-scientist',
      title: { en: 'Environmental data scientist', tr: 'Çevre veri bilimci' },
      level: 'mid',
      summary: {
        en: 'Work with forty years of messy observations and say what they support.',
        tr: 'Kırk yıllık dağınık gözlemle çalışın ve bunların neyi desteklediğini söyleyin.',
      },
      skills: [
        { en: 'Python', tr: 'Python' },
        { en: 'Geospatial analysis', tr: 'Coğrafi analiz' },
        { en: 'Time series', tr: 'Zaman serisi' },
      ],
    },
    {
      id: 'hydrology-engineer',
      title: { en: 'Hydrology engineer', tr: 'Hidroloji mühendisi' },
      level: 'senior',
      summary: {
        en: 'Model networks nobody can switch off, and be right about where the water goes.',
        tr: 'Kimsenin kapatamayacağı şebekeleri modelleyin ve suyun nereye gittiği konusunda haklı çıkın.',
      },
      skills: [
        { en: 'Hydraulic modelling', tr: 'Hidrolik modelleme' },
        { en: 'GIS', tr: 'CBS' },
        { en: 'Field measurement', tr: 'Saha ölçümü' },
      ],
    },
    {
      id: 'instrumentation-technician',
      title: { en: 'Instrumentation technician', tr: 'Enstrümantasyon teknisyeni' },
      level: 'junior',
      summary: {
        en: 'Install and calibrate probes that will sit outdoors for years without a visit.',
        tr: 'Yıllarca ziyaretsiz açıkta kalacak probları kurun ve kalibre edin.',
      },
      skills: [
        { en: 'Calibration', tr: 'Kalibrasyon' },
        { en: 'Field electronics', tr: 'Saha elektroniği' },
        { en: 'Maintenance', tr: 'Bakım' },
      ],
    },
  ],
  cybersecurity: [
    {
      id: 'detection-engineer',
      title: { en: 'Detection engineer', tr: 'Tespit mühendisi' },
      level: 'mid',
      summary: {
        en: 'Write detections that explain themselves, and cut the ones that only make noise.',
        tr: 'Kendini açıklayan tespitler yazın, yalnızca gürültü üretenleri ayıklayın.',
      },
      skills: [
        { en: 'SIEM', tr: 'SIEM' },
        { en: 'Threat modelling', tr: 'Tehdit modelleme' },
        { en: 'Python', tr: 'Python' },
      ],
    },
    {
      id: 'security-researcher',
      title: { en: 'Security researcher', tr: 'Güvenlik araştırmacısı' },
      level: 'senior',
      summary: {
        en: 'Find the thing nobody has reported yet, then disclose it properly.',
        tr: 'Henüz kimsenin raporlamadığı şeyi bulun, sonra düzgünce açıklayın.',
      },
      skills: [
        { en: 'Reverse engineering', tr: 'Tersine mühendislik' },
        { en: 'Fuzzing', tr: 'Fuzzing' },
        { en: 'Protocol analysis', tr: 'Protokol analizi' },
      ],
    },
    {
      id: 'identity-engineer',
      title: { en: 'Identity engineer', tr: 'Kimlik mühendisi' },
      level: 'mid',
      summary: {
        en: 'Make revocation work on the day the directory is the thing that is down.',
        tr: 'Dizinin kendisinin çöktüğü gün yetki iptalinin çalışmasını sağlayın.',
      },
      skills: [
        { en: 'OAuth and OIDC', tr: 'OAuth ve OIDC' },
        { en: 'Directory services', tr: 'Dizin hizmetleri' },
        { en: 'Go', tr: 'Go' },
      ],
    },
  ],
  energy: [
    {
      id: 'power-systems-engineer',
      title: { en: 'Power systems engineer', tr: 'Güç sistemleri mühendisi' },
      level: 'senior',
      summary: {
        en: 'Connect generation to a grid that was not designed for it.',
        tr: 'Üretimi, onun için tasarlanmamış bir şebekeye bağlayın.',
      },
      skills: [
        { en: 'Grid codes', tr: 'Şebeke yönetmelikleri' },
        { en: 'Protection design', tr: 'Koruma tasarımı' },
        { en: 'MATLAB', tr: 'MATLAB' },
      ],
    },
    {
      id: 'grid-software-engineer',
      title: { en: 'Grid software engineer', tr: 'Şebeke yazılımı mühendisi' },
      level: 'mid',
      summary: {
        en: 'Write the scheduler that has to bid before the forecast is certain.',
        tr: 'Tahmin kesinleşmeden teklif vermek zorunda olan çizelgeleyiciyi yazın.',
      },
      skills: [
        { en: 'Go', tr: 'Go' },
        { en: 'Optimisation', tr: 'Optimizasyon' },
        { en: 'Time series', tr: 'Zaman serisi' },
      ],
    },
    {
      id: 'commissioning-lead',
      title: { en: 'Field commissioning lead', tr: 'Saha devreye alma sorumlusu' },
      level: 'senior',
      summary: {
        en: 'Be the person on site when the design meets the actual installation.',
        tr: 'Tasarımın gerçek kurulumla karşılaştığı anda sahada olan kişi olun.',
      },
      skills: [
        { en: 'Commissioning', tr: 'Devreye alma' },
        { en: 'HV safety', tr: 'YG güvenliği' },
        { en: 'Site coordination', tr: 'Saha koordinasyonu' },
      ],
    },
  ],
  fintech: [
    {
      id: 'backend-engineer',
      title: { en: 'Backend engineer', tr: 'Backend mühendisi' },
      level: 'mid',
      summary: {
        en: 'Build ledgers that balance, including on the day something fails halfway through.',
        tr: 'Bir işlemin yarısında bir şey bozulduğu gün de denk gelen defterler kurun.',
      },
      skills: [
        { en: 'Go', tr: 'Go' },
        { en: 'PostgreSQL', tr: 'PostgreSQL' },
        { en: 'Distributed systems', tr: 'Dağıtık sistemler' },
      ],
    },
    {
      id: 'risk-analyst',
      title: { en: 'Risk analyst', tr: 'Risk analisti' },
      level: 'mid',
      summary: {
        en: 'Decide what to block without blocking the customers who pay for everything.',
        tr: 'Her şeyin parasını ödeyen müşterileri engellemeden neyin engelleneceğine karar verin.',
      },
      skills: [
        { en: 'SQL', tr: 'SQL' },
        { en: 'Fraud analytics', tr: 'Dolandırıcılık analitiği' },
        { en: 'Statistics', tr: 'İstatistik' },
      ],
    },
    {
      id: 'compliance-engineer',
      title: { en: 'Compliance engineer', tr: 'Uyum mühendisi' },
      level: 'junior',
      summary: {
        en: 'Turn a regulation into a control someone can actually run and evidence.',
        tr: 'Bir düzenlemeyi birinin gerçekten işletip kanıtlayabileceği bir kontrole çevirin.',
      },
      skills: [
        { en: 'Regulatory reporting', tr: 'Regülasyon raporlaması' },
        { en: 'Python', tr: 'Python' },
        { en: 'Audit', tr: 'Denetim' },
      ],
    },
  ],
  health: [
    {
      id: 'clinical-software-engineer',
      title: { en: 'Clinical software engineer', tr: 'Klinik yazılım mühendisi' },
      level: 'senior',
      summary: {
        en: 'Ship software into a hospital, with the regulatory file written as you go.',
        tr: 'Regülasyon dosyasını yol boyunca yazarak bir hastaneye yazılım teslim edin.',
      },
      skills: [
        { en: 'TypeScript', tr: 'TypeScript' },
        { en: 'IEC 62304', tr: 'IEC 62304' },
        { en: 'HL7 and FHIR', tr: 'HL7 ve FHIR' },
      ],
    },
    {
      id: 'regulatory-specialist',
      title: { en: 'Regulatory affairs specialist', tr: 'Regülasyon uzmanı' },
      level: 'mid',
      summary: {
        en: 'Keep a submission moving through two markets that disagree about the evidence.',
        tr: 'Kanıt konusunda anlaşamayan iki pazarda bir başvuruyu ilerletin.',
      },
      skills: [
        { en: 'MDR', tr: 'MDR' },
        { en: 'Technical files', tr: 'Teknik dosya' },
        { en: 'Clinical evaluation', tr: 'Klinik değerlendirme' },
      ],
    },
    {
      id: 'biomedical-engineer',
      title: { en: 'Biomedical engineer', tr: 'Biyomedikal mühendisi' },
      level: 'junior',
      summary: {
        en: 'Build the instrument the assay runs on, then prove it runs the same every time.',
        tr: 'Testin üzerinde çalıştığı cihazı kurun, sonra her seferinde aynı çalıştığını kanıtlayın.',
      },
      skills: [
        { en: 'Instrument design', tr: 'Cihaz tasarımı' },
        { en: 'Validation', tr: 'Validasyon' },
        { en: 'Laboratory work', tr: 'Laboratuvar çalışması' },
      ],
    },
  ],
  industrial: [
    {
      id: 'controls-engineer',
      title: { en: 'Controls engineer', tr: 'Kontrol mühendisi' },
      level: 'mid',
      summary: {
        en: 'Drive machines that were installed before anyone planned to automate them.',
        tr: 'Otomasyon düşünülmeden çok önce kurulmuş makineleri sürün.',
      },
      skills: [
        { en: 'PLC programming', tr: 'PLC programlama' },
        { en: 'Fieldbus', tr: 'Alan veri yolu' },
        { en: 'Safety systems', tr: 'Güvenlik sistemleri' },
      ],
    },
    {
      id: 'integration-engineer',
      title: { en: 'Integration engineer', tr: 'Entegrasyon mühendisi' },
      level: 'mid',
      summary: {
        en: 'Make the new system talk to four old ones without a shutdown.',
        tr: 'Yeni sistemi, hattı durdurmadan dört eski sistemle konuşturun.',
      },
      skills: [
        { en: 'OPC UA', tr: 'OPC UA' },
        { en: 'C#', tr: 'C#' },
        { en: 'MES', tr: 'MES' },
      ],
    },
    {
      id: 'production-analyst',
      title: { en: 'Production analyst', tr: 'Üretim analisti' },
      level: 'junior',
      summary: {
        en: 'Find where the line actually loses time, not where everyone assumes it does.',
        tr: 'Hattın zamanı gerçekten nerede kaybettiğini bulun, herkesin sandığı yeri değil.',
      },
      skills: [
        { en: 'SQL', tr: 'SQL' },
        { en: 'Lean methods', tr: 'Yalın yöntemler' },
        { en: 'Data analysis', tr: 'Veri analizi' },
      ],
    },
  ],
  materials: [
    {
      id: 'process-engineer',
      title: { en: 'Process engineer', tr: 'Proses mühendisi' },
      level: 'senior',
      summary: {
        en: 'Take a formulation that works in a flask and make it work by the tonne.',
        tr: 'Balonda çalışan bir formülasyonu ton bazında çalışır hâle getirin.',
      },
      skills: [
        { en: 'Process scale-up', tr: 'Proses ölçekleme' },
        { en: 'DOE', tr: 'Deney tasarımı' },
        { en: 'Quality control', tr: 'Kalite kontrol' },
      ],
    },
    {
      id: 'materials-scientist',
      title: { en: 'Materials scientist', tr: 'Malzeme bilimci' },
      level: 'mid',
      summary: {
        en: 'Characterise what you made and explain why it behaves the way it does.',
        tr: 'Ürettiğinizi karakterize edin ve neden öyle davrandığını açıklayın.',
      },
      skills: [
        { en: 'SEM', tr: 'SEM' },
        { en: 'Mechanical testing', tr: 'Mekanik test' },
        { en: 'Polymer chemistry', tr: 'Polimer kimyası' },
      ],
    },
    {
      id: 'laboratory-technician',
      title: { en: 'Laboratory technician', tr: 'Laboratuvar teknisyeni' },
      level: 'junior',
      summary: {
        en: 'Run the samples, keep the records, and notice when a result looks wrong.',
        tr: 'Numuneleri çalıştırın, kayıtları tutun ve bir sonuç yanlış göründüğünde fark edin.',
      },
      skills: [
        { en: 'Sample preparation', tr: 'Numune hazırlama' },
        { en: 'Laboratory safety', tr: 'Laboratuvar güvenliği' },
        { en: 'Record keeping', tr: 'Kayıt tutma' },
      ],
    },
  ],
  mobility: [
    {
      id: 'embedded-engineer',
      title: { en: 'Embedded engineer', tr: 'Gömülü sistem mühendisi' },
      level: 'mid',
      summary: {
        en: 'Write firmware for a vehicle that will be serviced by someone who never met you.',
        tr: 'Sizi hiç tanımayan birinin bakımını yapacağı bir araç için yazılım yazın.',
      },
      skills: [
        { en: 'Embedded C++', tr: 'Gömülü C++' },
        { en: 'CAN bus', tr: 'CAN veri yolu' },
        { en: 'Automotive safety', tr: 'Otomotiv güvenliği' },
      ],
    },
    {
      id: 'fleet-operations-lead',
      title: { en: 'Fleet operations lead', tr: 'Filo operasyon sorumlusu' },
      level: 'senior',
      summary: {
        en: 'Run the depot on the day the plan and the shift pattern disagree.',
        tr: 'Planla vardiya düzeninin çeliştiği gün depoyu işletin.',
      },
      skills: [
        { en: 'Fleet operations', tr: 'Filo operasyonu' },
        { en: 'Scheduling', tr: 'Çizelgeleme' },
        { en: 'Depot planning', tr: 'Depo planlama' },
      ],
    },
    {
      id: 'optimisation-engineer',
      title: { en: 'Optimisation engineer', tr: 'Optimizasyon mühendisi' },
      level: 'mid',
      summary: {
        en: 'Replan a live route without stranding the driver already halfway through it.',
        tr: 'Yolun yarısındaki sürücüyü ortada bırakmadan canlı bir rotayı yeniden planlayın.',
      },
      skills: [
        { en: 'Operations research', tr: 'Yöneylem araştırması' },
        { en: 'Python', tr: 'Python' },
        { en: 'Constraint solving', tr: 'Kısıt çözümü' },
      ],
    },
  ],
  robotics: [
    {
      id: 'motion-planning-engineer',
      title: { en: 'Motion planning engineer', tr: 'Hareket planlama mühendisi' },
      level: 'senior',
      summary: {
        en: 'Plan a path through a workspace that changed while you were planning it.',
        tr: 'Siz planlarken değişmiş bir çalışma alanında rota planlayın.',
      },
      skills: [
        { en: 'ROS 2', tr: 'ROS 2' },
        { en: 'C++', tr: 'C++' },
        { en: 'Motion planning', tr: 'Hareket planlama' },
      ],
    },
    {
      id: 'perception-engineer',
      title: { en: 'Perception engineer', tr: 'Algı mühendisi' },
      level: 'mid',
      summary: {
        en: 'See the part clearly enough to pick it up, in the lighting the warehouse actually has.',
        tr: 'Deponun gerçek aydınlatmasında parçayı alacak kadar net görün.',
      },
      skills: [
        { en: 'Computer vision', tr: 'Bilgisayarlı görü' },
        { en: 'Point clouds', tr: 'Nokta bulutu' },
        { en: 'Python', tr: 'Python' },
      ],
    },
    {
      id: 'mechatronics-engineer',
      title: { en: 'Mechatronics engineer', tr: 'Mekatronik mühendisi' },
      level: 'junior',
      summary: {
        en: 'Build the end effector, then find out what it does to a soft package.',
        tr: 'Uç işlevciyi üretin, sonra yumuşak bir ambalaja ne yaptığını öğrenin.',
      },
      skills: [
        { en: 'Mechanism design', tr: 'Mekanizma tasarımı' },
        { en: 'Actuators', tr: 'Aktüatörler' },
        { en: 'Force control', tr: 'Kuvvet kontrolü' },
      ],
    },
  ],
  space: [
    {
      id: 'optical-systems-engineer',
      title: { en: 'Optical systems engineer', tr: 'Optik sistem mühendisi' },
      level: 'senior',
      summary: {
        en: 'Design optics that survive launch and then work untouched for years.',
        tr: 'Fırlatmadan sağ çıkıp sonra yıllarca dokunulmadan çalışan optik tasarlayın.',
      },
      skills: [
        { en: 'Optical design', tr: 'Optik tasarım' },
        { en: 'Zemax', tr: 'Zemax' },
        { en: 'Thermal analysis', tr: 'Termal analiz' },
      ],
    },
    {
      id: 'ground-software-engineer',
      title: { en: 'Ground software engineer', tr: 'Yer yazılımı mühendisi' },
      level: 'mid',
      summary: {
        en: 'Talk to a spacecraft on a pass that lasts eleven minutes.',
        tr: 'On bir dakika süren bir geçişte uzay aracıyla konuşun.',
      },
      skills: [
        { en: 'Python', tr: 'Python' },
        { en: 'CCSDS', tr: 'CCSDS' },
        { en: 'Distributed systems', tr: 'Dağıtık sistemler' },
      ],
    },
    {
      id: 'avionics-engineer',
      title: { en: 'Avionics engineer', tr: 'Aviyonik mühendisi' },
      level: 'junior',
      summary: {
        en: 'Build the board that cannot be repaired after it ships.',
        tr: 'Gönderildikten sonra tamir edilemeyecek kartı üretin.',
      },
      skills: [
        { en: 'PCB design', tr: 'PCB tasarımı' },
        { en: 'Radiation tolerance', tr: 'Radyasyon dayanımı' },
        { en: 'Embedded C', tr: 'Gömülü C' },
      ],
    },
  ],
}

export function findCompany(slug: string | undefined): ResidentCompany | undefined {
  return residentCompanies.find((company) => company.slug === slug)
}
