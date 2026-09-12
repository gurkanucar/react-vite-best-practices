import type { Publication } from '@/features/showcases/types'
import climateNetwork from '@/features/showcases/assets/climate-network.svg'
import communityCampus from '@/features/showcases/assets/community-campus.svg'
import dataCenter from '@/features/showcases/assets/data-center.svg'
import innovationLab from '@/features/showcases/assets/innovation-lab.svg'
import mobilityGrid from '@/features/showcases/assets/mobility-grid.svg'
import talentStudio from '@/features/showcases/assets/talent-studio.svg'

export const corporateNews: Publication[] = [
  {
    slug: 'green-data-center-investment',
    title: {
      en: 'Northstar begins construction of its low-carbon data center',
      tr: 'Northstar düşük karbonlu veri merkezinin inşasına başladı',
    },
    summary: {
      en: 'The new facility will combine renewable power, closed-loop cooling, and regional cloud capacity.',
      tr: 'Yeni tesis yenilenebilir enerji, kapalı devre soğutma ve bölgesel bulut kapasitesini bir araya getirecek.',
    },
    body: [
      {
        en: 'Northstar Group has started construction of a new data center designed to serve growing regional demand with a substantially smaller environmental footprint.',
        tr: 'Northstar Group, artan bölgesel talebi çok daha düşük çevresel etkiyle karşılamak üzere tasarlanan yeni veri merkezinin inşasına başladı.',
      },
      {
        en: 'The campus will source renewable electricity, reuse captured heat in nearby buildings, and operate a closed-loop water system. The first phase is expected to open in the second quarter of 2027.',
        tr: 'Kampüs yenilenebilir elektrik kullanacak, yakalanan ısıyı yakındaki binalarda yeniden değerlendirecek ve kapalı devre su sistemiyle çalışacak. İlk fazın 2027 ikinci çeyreğinde açılması planlanıyor.',
      },
    ],
    category: { en: 'Investment', tr: 'Yatırım' },
    date: '2026-09-08',
    readingTime: { en: '3 min read', tr: '3 dk okuma' },
    coverImage: {
      src: dataCenter,
      alt: { en: 'Low-carbon data center campus', tr: 'Düşük karbonlu veri merkezi kampüsü' },
    },
    tags: [
      { en: 'Data infrastructure', tr: 'Veri altyapısı' },
      { en: 'Net zero', tr: 'Net sıfır' },
      { en: 'Istanbul', tr: 'İstanbul' },
    ],
    attachments: [
      {
        name: { en: '2026 impact report', tr: '2026 etki raporu' },
        href: '/sample-report.pdf',
        format: 'PDF',
        size: '42 KB',
      },
    ],
    gallery: [
      {
        src: innovationLab,
        alt: { en: 'Research and operations center', tr: 'Araştırma ve operasyon merkezi' },
        caption: { en: 'The shared operations center', tr: 'Ortak operasyon merkezi' },
      },
      {
        src: climateNetwork,
        alt: {
          en: 'Renewable energy connection map',
          tr: 'Yenilenebilir enerji bağlantı haritası',
        },
        caption: { en: 'Renewable supply network', tr: 'Yenilenebilir tedarik ağı' },
      },
      {
        src: communityCampus,
        alt: { en: 'Public spaces around the campus', tr: 'Kampüs çevresindeki kamusal alanlar' },
        caption: { en: 'The campus public realm', tr: 'Kampüs kamusal alanı' },
      },
    ],
  },
  {
    slug: 'future-talent-program',
    title: {
      en: 'Applications open for the Future Talent program',
      tr: 'Geleceğin Yeteneği programı başvuruları açıldı',
    },
    summary: {
      en: 'A six-month rotation will bring early-career talent into product, sustainability, and operations teams.',
      tr: 'Altı aylık rotasyon, kariyerinin başındaki yetenekleri ürün, sürdürülebilirlik ve operasyon ekipleriyle buluşturacak.',
    },
    body: [
      {
        en: 'The Future Talent program is accepting applications from final-year students and recent graduates across engineering, business, and design disciplines.',
        tr: 'Geleceğin Yeteneği programı mühendislik, işletme ve tasarım alanlarındaki son sınıf öğrencileri ile yeni mezunların başvurularını kabul ediyor.',
      },
      {
        en: 'Participants will work on real projects with three different teams, receive a dedicated mentor, and present their outcomes to the executive committee.',
        tr: 'Katılımcılar üç farklı ekiple gerçek projelerde çalışacak, özel bir mentordan destek alacak ve çıktılarını icra kuruluna sunacak.',
      },
    ],
    category: { en: 'People', tr: 'İnsan' },
    date: '2026-08-24',
    readingTime: { en: '2 min read', tr: '2 dk okuma' },
    coverImage: {
      src: talentStudio,
      alt: { en: 'Early-career teams collaborating', tr: 'Birlikte çalışan genç yetenek ekipleri' },
    },
    tags: [
      { en: 'Careers', tr: 'Kariyer' },
      { en: 'Early talent', tr: 'Genç yetenek' },
    ],
  },
  {
    slug: 'supplier-climate-standard',
    title: {
      en: 'A shared climate standard for 240 suppliers',
      tr: '240 tedarikçi için ortak iklim standardı',
    },
    summary: {
      en: 'A practical measurement framework will make supply-chain emissions visible and comparable.',
      tr: 'Pratik ölçüm çerçevesi tedarik zinciri emisyonlarını görünür ve karşılaştırılabilir kılacak.',
    },
    body: [
      {
        en: 'Northstar introduced a shared reporting standard to help suppliers measure emissions with consistent definitions and evidence requirements.',
        tr: 'Northstar, tedarikçilerin emisyonlarını tutarlı tanımlar ve kanıt gereksinimleriyle ölçmesine yardımcı olacak ortak raporlama standardını devreye aldı.',
      },
      {
        en: 'The first reporting cycle starts in January. Training, templates, and advisory sessions will be provided without charge to participating suppliers.',
        tr: 'İlk raporlama dönemi ocak ayında başlıyor. Katılımcı tedarikçilere eğitim, şablon ve danışmanlık oturumları ücretsiz sunulacak.',
      },
    ],
    category: { en: 'Sustainability', tr: 'Sürdürülebilirlik' },
    date: '2026-08-03',
    readingTime: { en: '4 min read', tr: '4 dk okuma' },
    coverImage: {
      src: climateNetwork,
      alt: { en: 'Connected supplier climate network', tr: 'Bağlantılı tedarikçi iklim ağı' },
    },
    tags: [
      { en: 'Supply chain', tr: 'Tedarik zinciri' },
      { en: 'Climate', tr: 'İklim' },
    ],
  },
  {
    slug: 'autonomous-freight-pilot',
    title: {
      en: 'Autonomous freight pilot completes its first 100,000 kilometers',
      tr: 'Otonom yük pilotu ilk 100.000 kilometresini tamamladı',
    },
    summary: {
      en: 'The controlled-route program reduced idle time while keeping a safety driver in every vehicle.',
      tr: 'Kontrollü rota programı, her araçta güvenlik sürücüsü bulunurken bekleme süresini azalttı.',
    },
    body: [
      {
        en: 'The pilot connected three logistics hubs with a supervised fleet operating on predefined routes and continuously monitored infrastructure.',
        tr: 'Pilot, önceden belirlenmiş rotalarda çalışan ve sürekli izlenen araç filosuyla üç lojistik merkezini birbirine bağladı.',
      },
      {
        en: 'The next phase will test mixed weather conditions and expand operational hours without changing the program’s safety controls.',
        tr: 'Sonraki faz, programın güvenlik kontrollerini değiştirmeden farklı hava koşullarını test edecek ve çalışma saatlerini genişletecek.',
      },
    ],
    category: { en: 'Innovation', tr: 'İnovasyon' },
    date: '2026-07-18',
    readingTime: { en: '3 min read', tr: '3 dk okuma' },
    coverImage: {
      src: mobilityGrid,
      alt: { en: 'Connected freight routes', tr: 'Bağlantılı yük rotaları' },
    },
    tags: [
      { en: 'Mobility', tr: 'Mobilite' },
      { en: 'Logistics', tr: 'Lojistik' },
    ],
  },
  {
    slug: 'industrial-ai-lab',
    title: {
      en: 'Industrial AI laboratory opens to operating companies',
      tr: 'Endüstriyel yapay zekâ laboratuvarı grup şirketlerine açıldı',
    },
    summary: {
      en: 'Shared compute, secure datasets, and engineering support shorten the path from prototype to production.',
      tr: 'Ortak işlem gücü, güvenli veri setleri ve mühendislik desteği prototipten üretime geçişi kısaltıyor.',
    },
    body: [
      {
        en: 'The new laboratory gives operating teams a controlled environment for testing computer vision, forecasting, and process optimization models.',
        tr: 'Yeni laboratuvar operasyon ekiplerine görüntü işleme, tahmin ve süreç optimizasyonu modellerini test etmek için kontrollü bir ortam sunuyor.',
      },
      {
        en: 'Every project begins with a measurable operating problem and must pass security, explainability, and production-readiness reviews.',
        tr: 'Her proje ölçülebilir bir operasyon problemiyle başlıyor; güvenlik, açıklanabilirlik ve üretim hazırlığı incelemelerinden geçiyor.',
      },
    ],
    category: { en: 'Technology', tr: 'Teknoloji' },
    date: '2026-06-29',
    readingTime: { en: '5 min read', tr: '5 dk okuma' },
    coverImage: {
      src: innovationLab,
      alt: { en: 'Industrial AI laboratory', tr: 'Endüstriyel yapay zekâ laboratuvarı' },
    },
    tags: [
      { en: 'Artificial intelligence', tr: 'Yapay zekâ' },
      { en: 'R&D', tr: 'Ar-Ge' },
    ],
  },
  {
    slug: 'community-learning-centers',
    title: {
      en: 'Community learning centers reach 25,000 participants',
      tr: 'Toplum öğrenme merkezleri 25.000 katılımcıya ulaştı',
    },
    summary: {
      en: 'Free digital skills and technical workshops are now active in twelve regional centers.',
      tr: 'Ücretsiz dijital beceri ve teknik atölyeler artık on iki bölgesel merkezde aktif.',
    },
    body: [
      {
        en: 'Programs are designed with local educators and employers so participants can build skills connected to real regional opportunities.',
        tr: 'Programlar, katılımcıların gerçek bölgesel fırsatlarla bağlantılı beceriler geliştirmesi için yerel eğitimciler ve işverenlerle tasarlanıyor.',
      },
      {
        en: 'The next enrollment cycle adds energy systems, data literacy, and production technologies to the existing curriculum.',
        tr: 'Yeni kayıt döneminde mevcut müfredata enerji sistemleri, veri okuryazarlığı ve üretim teknolojileri ekleniyor.',
      },
    ],
    category: { en: 'Community', tr: 'Toplum' },
    date: '2026-06-12',
    readingTime: { en: '3 min read', tr: '3 dk okuma' },
    coverImage: {
      src: communityCampus,
      alt: { en: 'Community learning campus', tr: 'Toplum öğrenme kampüsü' },
    },
    tags: [
      { en: 'Education', tr: 'Eğitim' },
      { en: 'Social impact', tr: 'Sosyal etki' },
    ],
  },
  {
    slug: 'circular-packaging-trial',
    title: {
      en: 'Circular packaging trial cuts single-use material by 38%',
      tr: 'Döngüsel ambalaj denemesi tek kullanımlık malzemeyi %38 azalttı',
    },
    summary: {
      en: 'Reusable transport packaging completed twenty cycles without compromising product protection.',
      tr: 'Yeniden kullanılabilir taşıma ambalajı ürün korumasından ödün vermeden yirmi döngüyü tamamladı.',
    },
    body: [
      {
        en: 'A six-month trial replaced single-use transport packaging on two high-volume routes with trackable reusable units.',
        tr: 'Altı aylık denemede iki yüksek hacimli rotadaki tek kullanımlık taşıma ambalajları izlenebilir yeniden kullanılabilir ünitelerle değiştirildi.',
      },
      {
        en: 'The program will expand after suppliers complete a common cleaning and reverse-logistics protocol.',
        tr: 'Program, tedarikçiler ortak temizlik ve tersine lojistik protokolünü tamamladıktan sonra genişleyecek.',
      },
    ],
    category: { en: 'Operations', tr: 'Operasyon' },
    date: '2026-05-27',
    readingTime: { en: '2 min read', tr: '2 dk okuma' },
    tags: [
      { en: 'Circular economy', tr: 'Döngüsel ekonomi' },
      { en: 'Packaging', tr: 'Ambalaj' },
    ],
  },
  {
    slug: 'coastal-wind-financing',
    title: {
      en: 'Financing secured for the 180 MW coastal wind project',
      tr: '180 MW kıyı rüzgâr projesi için finansman sağlandı',
    },
    summary: {
      en: 'The financing package links borrowing costs to biodiversity and local employment commitments.',
      tr: 'Finansman paketi borçlanma maliyetlerini biyoçeşitlilik ve yerel istihdam taahhütlerine bağlıyor.',
    },
    body: [
      {
        en: 'A consortium of three banks will finance construction under a facility tied to independently verified impact targets.',
        tr: 'Üç bankadan oluşan konsorsiyum, bağımsız olarak doğrulanan etki hedeflerine bağlı bir krediyle inşaatı finanse edecek.',
      },
      {
        en: 'Construction begins after the seasonal wildlife protection window and commercial operation is planned for late 2028.',
        tr: 'İnşaat mevsimsel yaban hayatı koruma döneminden sonra başlayacak; ticari işletmenin 2028 sonunda başlaması planlanıyor.',
      },
    ],
    category: { en: 'Energy', tr: 'Enerji' },
    date: '2026-05-08',
    readingTime: { en: '4 min read', tr: '4 dk okuma' },
    coverImage: {
      src: climateNetwork,
      alt: { en: 'Renewable energy network', tr: 'Yenilenebilir enerji ağı' },
    },
    tags: [
      { en: 'Renewables', tr: 'Yenilenebilir enerji' },
      { en: 'Finance', tr: 'Finans' },
    ],
  },
  {
    slug: 'digital-customs-corridor',
    title: {
      en: 'Digital customs corridor shortens border processing',
      tr: 'Dijital gümrük koridoru sınır işlemlerini kısalttı',
    },
    summary: {
      en: 'Pre-validated documents reduced average processing time from six hours to ninety minutes.',
      tr: 'Önceden doğrulanan belgeler ortalama işlem süresini altı saatten doksan dakikaya indirdi.',
    },
    body: [
      {
        en: 'The corridor exchanges shipment data before arrival so customs teams can complete risk checks while vehicles are still in transit.',
        tr: 'Koridor, sevkiyat verisini varıştan önce paylaşarak gümrük ekiplerinin araçlar hâlâ yoldayken risk kontrollerini tamamlamasını sağlıyor.',
      },
      {
        en: 'Following the successful pilot, the system will be offered to additional carriers during the fourth quarter.',
        tr: 'Başarılı pilotun ardından sistem dördüncü çeyrekte ek taşıyıcılara sunulacak.',
      },
    ],
    category: { en: 'Logistics', tr: 'Lojistik' },
    date: '2026-04-19',
    readingTime: { en: '3 min read', tr: '3 dk okuma' },
    coverImage: {
      src: mobilityGrid,
      alt: { en: 'Digital logistics connections', tr: 'Dijital lojistik bağlantıları' },
    },
    tags: [
      { en: 'Trade', tr: 'Ticaret' },
      { en: 'Digitalization', tr: 'Dijitalleşme' },
    ],
  },
  {
    slug: 'annual-results-2025',
    title: {
      en: 'Northstar reports resilient performance for 2025',
      tr: 'Northstar 2025 için dayanıklı performans açıkladı',
    },
    summary: {
      en: 'Investment in core infrastructure continued while leverage and operating risk remained within targets.',
      tr: 'Temel altyapı yatırımları sürerken kaldıraç ve operasyon riski hedefler içinde kaldı.',
    },
    body: [
      {
        en: 'Consolidated revenue grew across infrastructure and digital services, offsetting softer activity in cyclical markets.',
        tr: 'Konsolide gelir altyapı ve dijital hizmetlerde büyüyerek döngüsel pazarlardaki daha zayıf faaliyeti dengeledi.',
      },
      {
        en: 'The board maintained its investment plan for safety, capacity, and decarbonization projects through 2027.',
        tr: 'Yönetim kurulu güvenlik, kapasite ve karbonsuzlaşma projeleri için 2027’ye kadar olan yatırım planını korudu.',
      },
    ],
    category: { en: 'Results', tr: 'Sonuçlar' },
    date: '2026-03-26',
    readingTime: { en: '6 min read', tr: '6 dk okuma' },
    tags: [
      { en: 'Financial results', tr: 'Finansal sonuçlar' },
      { en: 'Strategy', tr: 'Strateji' },
    ],
    attachments: [
      {
        name: { en: 'Annual results summary', tr: 'Yıllık sonuç özeti' },
        href: '/sample-report.pdf',
        format: 'PDF',
        size: '42 KB',
      },
    ],
  },
]

export const corporateAnnouncements: Publication[] = [
  {
    slug: 'extraordinary-general-meeting',
    title: {
      en: 'Extraordinary General Meeting information',
      tr: 'Olağanüstü Genel Kurul bilgilendirmesi',
    },
    summary: {
      en: 'Meeting agenda, participation instructions, and proxy documents are now available.',
      tr: 'Toplantı gündemi, katılım bilgileri ve vekâlet belgeleri yayımlandı.',
    },
    body: [
      {
        en: 'The Extraordinary General Meeting will be held on October 14, 2026 at 10:00 at Northstar Campus, Istanbul.',
        tr: 'Olağanüstü Genel Kurul 14 Ekim 2026 saat 10.00’da Northstar Kampüs, İstanbul adresinde gerçekleştirilecektir.',
      },
      {
        en: 'Shareholders may attend in person or appoint a representative by following the instructions included in the meeting information pack.',
        tr: 'Pay sahipleri toplantıya bizzat katılabilir veya bilgilendirme dosyasındaki adımları izleyerek temsilci atayabilir.',
      },
    ],
    category: { en: 'Investor relations', tr: 'Yatırımcı ilişkileri' },
    date: '2026-09-10',
    coverImage: {
      src: innovationLab,
      alt: {
        en: 'Northstar meeting and innovation hall',
        tr: 'Northstar toplantı ve inovasyon salonu',
      },
    },
    tags: [
      { en: 'General meeting', tr: 'Genel kurul' },
      { en: 'Shareholders', tr: 'Pay sahipleri' },
    ],
    attachments: [
      {
        name: { en: 'Meeting agenda', tr: 'Toplantı gündemi' },
        href: '/showcase-attachments/general-meeting-agenda.txt',
        format: 'TXT',
        size: '1 KB',
      },
      {
        name: { en: 'Information document', tr: 'Bilgilendirme belgesi' },
        href: '/sample-report.pdf',
        format: 'PDF',
        size: '42 KB',
      },
    ],
  },
  {
    slug: 'planned-service-maintenance',
    title: { en: 'Planned service maintenance', tr: 'Planlı servis bakımı' },
    summary: {
      en: 'Partner portals will be briefly unavailable during infrastructure maintenance.',
      tr: 'Altyapı bakımı sırasında iş ortağı portalları kısa süreliğine erişime kapalı olacak.',
    },
    body: [
      {
        en: 'Partner portals will be unavailable between 01:00 and 03:00 UTC on September 20 while network infrastructure is upgraded.',
        tr: 'Ağ altyapısı güncellenirken iş ortağı portalları 20 Eylül tarihinde 04.00–06.00 arasında erişime kapalı olacaktır.',
      },
      {
        en: 'No customer action is required. Workloads and queued transactions will resume automatically after the maintenance window.',
        tr: 'Müşterilerin işlem yapması gerekmemektedir. İş yükleri ve sıradaki işlemler bakım penceresinden sonra otomatik olarak devam edecektir.',
      },
    ],
    category: { en: 'Service notice', tr: 'Servis bildirimi' },
    date: '2026-09-07',
    coverImage: {
      src: mobilityGrid,
      alt: { en: 'Connected service infrastructure', tr: 'Bağlantılı servis altyapısı' },
    },
    tags: [
      { en: 'Maintenance', tr: 'Bakım' },
      { en: 'Digital services', tr: 'Dijital servisler' },
    ],
    attachments: [
      {
        name: { en: 'Maintenance schedule', tr: 'Bakım takvimi' },
        href: '/showcase-attachments/maintenance-window.csv',
        format: 'CSV',
        size: '1 KB',
      },
    ],
    gallery: [
      {
        src: innovationLab,
        alt: { en: 'Network operations center', tr: 'Ağ operasyon merkezi' },
        caption: { en: 'Operations monitoring room', tr: 'Operasyon izleme odası' },
      },
      {
        src: dataCenter,
        alt: { en: 'Primary data center', tr: 'Birincil veri merkezi' },
        caption: { en: 'Primary infrastructure campus', tr: 'Birincil altyapı kampüsü' },
      },
    ],
  },
  {
    slug: 'office-closure-holiday',
    title: { en: 'Public holiday office schedule', tr: 'Resmî tatil çalışma düzeni' },
    summary: {
      en: 'Customer operations remain available while corporate offices follow the holiday schedule.',
      tr: 'Müşteri operasyonları devam ederken kurumsal ofisler tatil düzenini uygulayacak.',
    },
    body: [
      {
        en: 'Corporate offices will be closed on October 29. Critical operations and the customer support line will continue without interruption.',
        tr: 'Kurumsal ofisler 29 Ekim tarihinde kapalı olacaktır. Kritik operasyonlar ve müşteri destek hattı kesintisiz devam edecektir.',
      },
      {
        en: 'Regular office hours resume on October 30. Digital support requests can be submitted at any time through the partner portal.',
        tr: 'Normal çalışma düzeni 30 Ekim’de devam edecektir. Dijital destek talepleri iş ortağı portalı üzerinden her zaman iletilebilir.',
      },
    ],
    category: { en: 'Corporate', tr: 'Kurumsal' },
    date: '2026-08-31',
    tags: [
      { en: 'Office hours', tr: 'Çalışma saatleri' },
      { en: 'Customer support', tr: 'Müşteri desteği' },
    ],
  },
  {
    slug: 'aurora-campus-open-day',
    title: { en: 'Aurora Campus Open Day registrations', tr: 'Aurora Kampüs Açık Gün kayıtları' },
    summary: {
      en: 'Founders, researchers, and students can now register for laboratory tours and company sessions.',
      tr: 'Girişimciler, araştırmacılar ve öğrenciler laboratuvar turları ile şirket oturumlarına kayıt olabilir.',
    },
    body: [
      {
        en: 'The open day includes guided laboratory visits, resident-company demonstrations, and short sessions about campus application programs.',
        tr: 'Açık gün programında rehberli laboratuvar ziyaretleri, yerleşik şirket demoları ve kampüs başvuru programları hakkında kısa oturumlar yer alıyor.',
      },
      {
        en: 'Registration is free and required for every visitor. Capacity for laboratory tours is limited.',
        tr: 'Kayıt ücretsizdir ve her ziyaretçi için zorunludur. Laboratuvar turlarının kapasitesi sınırlıdır.',
      },
    ],
    category: { en: 'Campus', tr: 'Kampüs' },
    date: '2026-08-20',
    coverImage: {
      src: communityCampus,
      alt: { en: 'Aurora campus gathering area', tr: 'Aurora kampüs buluşma alanı' },
    },
    tags: [
      { en: 'Open day', tr: 'Açık gün' },
      { en: 'Registration', tr: 'Kayıt' },
    ],
    attachments: [
      {
        name: { en: 'Add to calendar', tr: 'Takvime ekle' },
        href: '/showcase-attachments/campus-open-day.ics',
        format: 'ICS',
        size: '1 KB',
      },
    ],
    gallery: [
      {
        src: communityCampus,
        alt: { en: 'Aurora public campus', tr: 'Aurora kamusal kampüs alanı' },
        caption: { en: 'Central campus plaza', tr: 'Merkez kampüs meydanı' },
      },
      {
        src: innovationLab,
        alt: { en: 'Research laboratory', tr: 'Araştırma laboratuvarı' },
        caption: { en: 'Applied research laboratory', tr: 'Uygulamalı araştırma laboratuvarı' },
      },
    ],
  },
  {
    slug: 'prototype-lab-safety-training',
    title: {
      en: 'Prototype laboratory safety training schedule',
      tr: 'Prototip laboratuvarı güvenlik eğitim takvimi',
    },
    summary: {
      en: 'New and returning laboratory users must complete the updated safety module before October.',
      tr: 'Yeni ve mevcut laboratuvar kullanıcıları ekim ayından önce güncel güvenlik modülünü tamamlamalıdır.',
    },
    body: [
      {
        en: 'The updated module covers booking rules, protective equipment, incident reporting, and after-hours access procedures.',
        tr: 'Güncel modül rezervasyon kuralları, koruyucu ekipman, olay bildirimi ve mesai dışı erişim prosedürlerini kapsıyor.',
      },
      {
        en: 'Existing access cards remain active until September 30. Completion records sync automatically with campus access.',
        tr: 'Mevcut erişim kartları 30 Eylül’e kadar aktif kalacaktır. Tamamlama kayıtları kampüs erişimiyle otomatik eşitlenir.',
      },
    ],
    category: { en: 'Safety', tr: 'Güvenlik' },
    date: '2026-08-11',
    coverImage: {
      src: innovationLab,
      alt: { en: 'Aurora prototype laboratory', tr: 'Aurora prototip laboratuvarı' },
    },
    tags: [
      { en: 'Laboratories', tr: 'Laboratuvarlar' },
      { en: 'Required training', tr: 'Zorunlu eğitim' },
    ],
  },
  {
    slug: 'resident-company-reporting-window',
    title: {
      en: 'Quarterly resident company reporting window',
      tr: 'Çeyreklik yerleşik şirket raporlama dönemi',
    },
    summary: {
      en: 'Company administrators can submit employment, export, and R&D indicators until September 5.',
      tr: 'Şirket yöneticileri istihdam, ihracat ve Ar-Ge göstergelerini 5 Eylül’e kadar iletebilir.',
    },
    body: [
      {
        en: 'The quarterly form is available in the partner portal. Saved drafts from the previous reporting cycle have been carried forward.',
        tr: 'Çeyreklik form iş ortağı portalında erişime açıldı. Önceki raporlama dönemindeki taslaklar yeni döneme aktarıldı.',
      },
      {
        en: 'Reporting guidance and validation rules are available inside each form section.',
        tr: 'Raporlama rehberi ve doğrulama kuralları formun her bölümünde görülebilir.',
      },
    ],
    category: { en: 'Resident companies', tr: 'Yerleşik şirketler' },
    date: '2026-08-01',
    tags: [
      { en: 'Reporting', tr: 'Raporlama' },
      { en: 'Deadline', tr: 'Son tarih' },
    ],
    attachments: [
      {
        name: { en: 'Reporting guide', tr: 'Raporlama rehberi' },
        href: '/sample-report.pdf',
        format: 'PDF',
        size: '42 KB',
      },
    ],
  },
  {
    slug: 'north-gate-access-change',
    title: {
      en: 'North gate access route changes',
      tr: 'Kuzey kapısı erişim rotası değişiklikleri',
    },
    summary: {
      en: 'Vehicle access will move to the temporary east lane during road improvements.',
      tr: 'Yol iyileştirme çalışmaları sırasında araç erişimi geçici doğu şeridine taşınacak.',
    },
    body: [
      {
        en: 'The temporary route starts August 5 and is expected to remain in place for three weeks. Pedestrian access is unchanged.',
        tr: 'Geçici rota 5 Ağustos’ta başlayacak ve üç hafta boyunca uygulanacaktır. Yaya erişimi değişmeyecektir.',
      },
      {
        en: 'Delivery drivers should follow the blue campus signs and allow additional time during the morning peak.',
        tr: 'Teslimat sürücüleri mavi kampüs yönlendirmelerini izlemeli ve sabah yoğunluğunda ek süre ayırmalıdır.',
      },
    ],
    category: { en: 'Campus operations', tr: 'Kampüs operasyonları' },
    date: '2026-07-29',
    coverImage: {
      src: mobilityGrid,
      alt: { en: 'Aurora campus access routes', tr: 'Aurora kampüs erişim rotaları' },
    },
    tags: [
      { en: 'Access', tr: 'Erişim' },
      { en: 'Traffic', tr: 'Trafik' },
    ],
  },
  {
    slug: 'seed-fund-office-hours',
    title: {
      en: 'Seed fund office hours in August',
      tr: 'Ağustos ayı tohum fonu görüşme saatleri',
    },
    summary: {
      en: 'Resident founders can reserve twenty-minute sessions with the investment team.',
      tr: 'Yerleşik girişimciler yatırım ekibiyle yirmi dakikalık görüşmeler için rezervasyon yapabilir.',
    },
    body: [
      {
        en: 'Office hours are intended for early feedback on fundraising plans, investor materials, and capital strategy.',
        tr: 'Görüşme saatleri fon toplama planı, yatırımcı materyalleri ve sermaye stratejisi hakkında erken geri bildirim için düzenlenmektedir.',
      },
      {
        en: 'Sessions are advisory and do not form part of the fund’s formal investment process.',
        tr: 'Oturumlar danışmanlık niteliğindedir ve fonun resmî yatırım sürecinin bir parçası değildir.',
      },
    ],
    category: { en: 'Funding', tr: 'Fonlama' },
    date: '2026-07-17',
    coverImage: {
      src: talentStudio,
      alt: { en: 'Founder investment sessions', tr: 'Girişimci yatırım görüşmeleri' },
    },
    tags: [
      { en: 'Founders', tr: 'Girişimciler' },
      { en: 'Investment', tr: 'Yatırım' },
    ],
  },
  {
    slug: 'energy-monitoring-dashboard-release',
    title: {
      en: 'Campus energy dashboard release',
      tr: 'Kampüs enerji paneli kullanıma açıldı',
    },
    summary: {
      en: 'Resident teams can now view building-level electricity and emissions indicators.',
      tr: 'Yerleşik ekipler artık bina bazlı elektrik ve emisyon göstergelerini görüntüleyebilir.',
    },
    body: [
      {
        en: 'The dashboard refreshes every fifteen minutes and compares current use with building baselines and seasonal targets.',
        tr: 'Panel her on beş dakikada bir güncellenir; güncel kullanımı bina referansları ve mevsimsel hedeflerle karşılaştırır.',
      },
      {
        en: 'Company administrators can export monthly records from the sustainability section of the partner portal.',
        tr: 'Şirket yöneticileri aylık kayıtları iş ortağı portalının sürdürülebilirlik bölümünden dışa aktarabilir.',
      },
    ],
    category: { en: 'Digital services', tr: 'Dijital servisler' },
    date: '2026-07-02',
    coverImage: {
      src: climateNetwork,
      alt: { en: 'Campus energy network', tr: 'Kampüs enerji ağı' },
    },
    tags: [
      { en: 'Energy', tr: 'Enerji' },
      { en: 'Dashboard', tr: 'Panel' },
    ],
  },
  {
    slug: 'shuttle-summer-schedule',
    title: { en: 'Campus shuttle summer schedule', tr: 'Kampüs servisi yaz tarifesi' },
    summary: {
      en: 'Evening departures will run every thirty minutes from July 1 through August 31.',
      tr: 'Akşam seferleri 1 Temmuz–31 Ağustos arasında otuz dakikada bir yapılacak.',
    },
    body: [
      {
        en: 'Morning routes remain unchanged. The last weekday departure from the campus moves to 22:30 during the summer period.',
        tr: 'Sabah rotaları değişmemektedir. Yaz döneminde kampüsten son hafta içi kalkışı 22.30’a alınmıştır.',
      },
      {
        en: 'Live vehicle locations and accessibility details remain available in the campus mobile application.',
        tr: 'Canlı araç konumları ve erişilebilirlik ayrıntıları kampüs mobil uygulamasında yer almaya devam edecektir.',
      },
    ],
    category: { en: 'Transportation', tr: 'Ulaşım' },
    date: '2026-06-24',
    tags: [
      { en: 'Shuttle', tr: 'Servis' },
      { en: 'Schedule', tr: 'Tarife' },
    ],
  },
]
