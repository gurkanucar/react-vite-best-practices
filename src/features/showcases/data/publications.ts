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

/**
 * Aurora Tech Park's own feed: stories about what happened on campus (`news`) and notices that
 * ask residents to do something by a date (`announcement`). Newest first.
 */
export const campusAnnouncements: Publication[] = [
  {
    slug: 'september-personnel-declarations',
    type: 'announcement',
    title: {
      en: 'September R&D personnel declarations due by October 5',
      tr: 'Eylül dönemi Ar-Ge personel bildirimleri için son gün 5 Ekim',
    },
    summary: {
      en: 'Resident companies must submit September personnel lists and working-time records through the resident portal.',
      tr: 'Bölge firmalarının eylül ayı personel listelerini ve çalışma süresi kayıtlarını firma portalı üzerinden iletmesi gerekiyor.',
    },
    body: [
      {
        en: 'Under Law No. 4691 on Technology Development Zones, the income tax withholding incentive and the employer insurance premium support for R&D and support staff are applied on the basis of monthly declarations. The management company forwards the zone’s consolidated list to the Ministry of Industry and Technology each month.',
        tr: '4691 sayılı Teknoloji Geliştirme Bölgeleri Kanunu kapsamında Ar-Ge ve destek personeline uygulanan gelir vergisi stopajı teşviki ile sigorta primi işveren hissesi desteği, aylık bildirimler esas alınarak uygulanmaktadır. Yönetici şirket, bölgenin toplu listesini her ay Sanayi ve Teknoloji Bakanlığına iletmektedir.',
      },
      {
        en: 'September declarations, including days worked outside the zone and remote-working ratios, must be entered in the resident portal by Monday, October 5 at 17:00. Late or incomplete declarations may mean the incentives cannot be applied for that month.',
        tr: 'Bölge dışında geçirilen günler ve uzaktan çalışma oranları dahil eylül ayı bildirimlerinin 5 Ekim Pazartesi saat 17.00’ye kadar firma portalına girilmesi gerekmektedir. Geç ya da eksik yapılan bildirimler, ilgili ay için teşviklerin uygulanamamasına yol açabilir.',
      },
      {
        en: 'Questions about the form can be sent to Burak Öztürk, Exemption Specialist, at exemptions@aurora-techpark.example.',
        tr: 'Formla ilgili sorularınızı Muafiyet Uzmanı Burak Öztürk’e exemptions@aurora-techpark.example adresinden iletebilirsiniz.',
      },
    ],
    category: { en: 'Exemptions & reporting', tr: 'Muafiyet ve bildirimler' },
    date: '2026-09-25',
    tags: [
      { en: 'Law No. 4691', tr: '4691 sayılı Kanun' },
      { en: 'Deadline', tr: 'Son tarih' },
      { en: 'Resident companies', tr: 'Bölge firmaları' },
    ],
    attachments: [
      {
        name: { en: 'Personnel declaration template', tr: 'Personel bildirim şablonu' },
        href: '/showcase-attachments/personnel-declaration-template.csv',
        format: 'CSV',
        size: '1 KB',
      },
      {
        name: { en: 'Monthly declaration guide', tr: 'Aylık bildirim rehberi' },
        href: '/sample-report.pdf',
        format: 'PDF',
        size: '42 KB',
      },
    ],
  },
  {
    slug: 'block-c-power-maintenance',
    type: 'announcement',
    title: {
      en: 'Planned power maintenance in Block C on October 10',
      tr: 'C Blok’ta 10 Ekim’de planlı elektrik bakımı',
    },
    summary: {
      en: 'Mains power in Block C will be off on Saturday morning while the main distribution panel is serviced.',
      tr: 'Ana dağıtım panosunun bakımı nedeniyle C Blok’ta cumartesi sabahı şebeke elektriği kesilecek.',
    },
    body: [
      {
        en: 'Mains power in Block C will be cut on Saturday, October 10 between 08:00 and 14:00 for the annual maintenance of the main distribution panel and the transformer protection relays.',
        tr: 'C Blok’ta ana dağıtım panosu ve trafo koruma rölelerinin yıllık bakımı için 10 Ekim Cumartesi günü 08.00–14.00 saatleri arasında şebeke elektriği kesilecektir.',
      },
      {
        en: 'The shared clean room and the server room stay on generator power throughout. Offices, meeting rooms and the ground-floor kitchen will be without power, and the lifts will not run.',
        tr: 'Ortak temiz oda ve sunucu odası bakım süresince jeneratörden beslenecektir. Ofisler, toplantı salonları ve zemin kattaki mutfak enerjisiz kalacak, asansörler çalışmayacaktır.',
      },
      {
        en: 'Please shut down test rigs and any equipment that does not tolerate a hard power cut by Friday evening. Teams that need an exception should write to the facilities desk by October 7.',
        tr: 'Test düzeneklerinizi ve ani enerji kesintisinden etkilenebilecek cihazlarınızı cuma akşamı kapatmanızı rica ederiz. İstisna talebi olan ekiplerin 7 Ekim’e kadar teknik işler birimine yazması gerekmektedir.',
      },
    ],
    category: { en: 'Campus services', tr: 'Kampüs hizmetleri' },
    date: '2026-09-24',
    coverImage: {
      src: dataCenter,
      alt: { en: 'Block C plant room', tr: 'C Blok teknik hacmi' },
    },
    tags: [
      { en: 'Block C', tr: 'C Blok' },
      { en: 'Maintenance', tr: 'Bakım' },
    ],
    attachments: [
      {
        name: { en: 'Maintenance schedule by floor', tr: 'Kat bazında bakım takvimi' },
        href: '/showcase-attachments/maintenance-window.csv',
        format: 'CSV',
        size: '1 KB',
      },
    ],
  },
  {
    slug: 'shared-clean-room-expansion',
    type: 'news',
    title: {
      en: 'The shared clean room in Block C doubles in size',
      tr: 'C Blok’taki ortak temiz oda iki katına çıktı',
    },
    summary: {
      en: 'A second ISO 7 hall adds 180 m² of bookable space; Cellwise Bio is the first team to move a production line in.',
      tr: 'ISO 7 sınıfındaki ikinci salon 180 m² rezerve edilebilir alan ekliyor; buraya üretim hattını taşıyan ilk ekip Cellwise Bio oldu.',
    },
    body: [
      {
        en: 'The second hall of the shared clean room opened on September 22. Built to ISO 7, it adds 180 m² to the existing space, with its own gowning room, a pass-through for materials and continuous particle monitoring.',
        tr: 'Ortak temiz odanın ikinci salonu 22 Eylül’de hizmete girdi. ISO 7 sınıfında inşa edilen salon mevcut alana 180 m² ekliyor; ayrı soyunma odası, malzeme geçiş kabini ve sürekli partikül izleme sistemiyle donatıldı.',
      },
      {
        en: 'Cellwise Bio has moved the assembly line for its benchtop cytometer into the new hall. “Until now we booked the room by the hour and packed up every evening,” says the company’s operations lead. “A fixed line means we can plan production, not just prototypes.”',
        tr: 'Cellwise Bio, masaüstü sitometresinin montaj hattını yeni salona taşıdı. Şirketin operasyon sorumlusu, “Şimdiye kadar odayı saatlik kiralıyor, her akşam toparlıyorduk. Sabit bir hat, yalnızca prototip değil üretim planlayabileceğimiz anlamına geliyor.” diyor.',
      },
      {
        en: 'The remaining capacity is open to every resident company through the prototype laboratory booking system. Users need the updated laboratory safety training before their first session.',
        tr: 'Kalan kapasite, prototip laboratuvarları rezervasyon sistemi üzerinden tüm bölge firmalarının kullanımına açık. İlk kullanımdan önce güncel laboratuvar güvenliği eğitiminin tamamlanması gerekiyor.',
      },
    ],
    category: { en: 'Infrastructure', tr: 'Altyapı' },
    date: '2026-09-23',
    readingTime: { en: '3 min read', tr: '3 dk okuma' },
    coverImage: {
      src: innovationLab,
      alt: { en: 'The new clean room hall', tr: 'Yeni temiz oda salonu' },
    },
    tags: [
      { en: 'Clean room', tr: 'Temiz oda' },
      { en: 'Cellwise Bio', tr: 'Cellwise Bio' },
      { en: 'Laboratories', tr: 'Laboratuvarlar' },
    ],
    gallery: [
      {
        src: innovationLab,
        alt: { en: 'Assembly benches in the clean room', tr: 'Temiz odadaki montaj tezgâhları' },
        caption: { en: 'Cellwise Bio’s assembly line', tr: 'Cellwise Bio montaj hattı' },
      },
      {
        src: dataCenter,
        alt: {
          en: 'Air handling plant for the clean room',
          tr: 'Temiz oda iklimlendirme santrali',
        },
        caption: { en: 'The new air handling plant', tr: 'Yeni iklimlendirme santrali' },
      },
    ],
  },
  {
    slug: 'republic-day-working-hours',
    type: 'announcement',
    title: {
      en: 'Working hours for Republic Day, October 29',
      tr: '29 Ekim Cumhuriyet Bayramı çalışma düzeni',
    },
    summary: {
      en: 'The management office closes at 13:00 on October 28 and stays closed on October 29.',
      tr: 'Yönetim ofisi 28 Ekim’de saat 13.00’te kapanacak, 29 Ekim’de hizmet vermeyecek.',
    },
    body: [
      {
        en: 'October 28 is the eve of Republic Day and a half-day holiday: the management office, the reception desk and the laboratory booking desk will close at 13:00. On Thursday, October 29 the offices are closed, and normal hours resume on Friday, October 30.',
        tr: '28 Ekim Çarşamba günü Cumhuriyet Bayramı arifesi olması nedeniyle yarım gündür; yönetim ofisi, danışma ve laboratuvar rezervasyon masası saat 13.00’te kapanacaktır. 29 Ekim Perşembe günü ofislerimiz kapalı olacak, 30 Ekim Cuma günü normal çalışma düzenine dönülecektir.',
      },
      {
        en: 'Security and card access to the buildings continue around the clock. No laboratory bookings are taken for the afternoon of October 28 or for October 29, and the campus shuttle runs its weekend timetable on both days.',
        tr: 'Güvenlik hizmeti ve binalara kartlı giriş kesintisiz devam edecektir. 28 Ekim öğleden sonrası ve 29 Ekim için laboratuvar rezervasyonu alınmayacak, kampüs servisi her iki gün hafta sonu tarifesiyle çalışacaktır.',
      },
      {
        en: 'We wish the whole Aurora community a happy 103rd anniversary of the Republic.',
        tr: 'Cumhuriyetimizin 103. yıl dönümünü tüm Aurora topluluğuyla birlikte kutlarız.',
      },
    ],
    category: { en: 'Working hours', tr: 'Çalışma düzeni' },
    date: '2026-09-21',
    tags: [
      { en: 'Public holiday', tr: 'Resmî tatil' },
      { en: 'Office hours', tr: 'Çalışma saatleri' },
    ],
  },
  {
    slug: 'winter-incubation-call',
    type: 'announcement',
    title: {
      en: 'Winter incubation cohort: applications close October 18',
      tr: 'Kuluçka programı kış dönemi başvuruları 18 Ekim’de kapanıyor',
    },
    summary: {
      en: 'Twelve places for companies under three years old with a working prototype.',
      tr: 'Çalışan prototipi olan, üç yaşından küçük şirketler için on iki kontenjan.',
    },
    body: [
      {
        en: 'Applications are open for the winter cohort of the incubation programme. Selected companies get a subsidised office for two years, booked hours in the prototype laboratories, a named mentor from industry and the tax exemptions of the zone from their first day.',
        tr: 'Kuluçka programının kış dönemi başvuruları açıldı. Seçilen şirketler iki yıl boyunca indirimli ofis, prototip laboratuvarlarında ayrılmış kullanım saatleri, sanayiden atanmış bir mentor ve ilk günden itibaren bölgenin vergi muafiyetlerinden yararlanacak.',
      },
      {
        en: 'Companies must be under three years old, have a working prototype and at least one founder working full time on the product. Projects are assessed for technological novelty, commercial potential and team capability.',
        tr: 'Başvuracak şirketlerin üç yaşından küçük olması, çalışan bir prototipe sahip olması ve en az bir kurucunun tam zamanlı olarak ürün üzerinde çalışması gerekmektedir. Projeler teknolojik yenilik, ticari potansiyel ve ekip yetkinliği açısından değerlendirilecektir.',
      },
      {
        en: 'The deadline is Sunday, October 18 at 23:59. Shortlisted teams will pitch to the evaluation committee on November 4. For questions, contact Zeynep Kılıç, Venture Office Coordinator, at ventures@aurora-techpark.example.',
        tr: 'Son başvuru tarihi 18 Ekim Pazar saat 23.59’dur. Ön elemeyi geçen ekipler 4 Kasım’da değerlendirme kuruluna sunum yapacaktır. Sorularınız için Girişim Ofisi Koordinatörü Zeynep Kılıç’a ventures@aurora-techpark.example adresinden ulaşabilirsiniz.',
      },
    ],
    category: { en: 'Programs', tr: 'Programlar' },
    date: '2026-09-18',
    coverImage: {
      src: talentStudio,
      alt: {
        en: 'Founders working in the shared studio',
        tr: 'Ortak stüdyoda çalışan girişimciler',
      },
    },
    tags: [
      { en: 'Incubation', tr: 'Kuluçka' },
      { en: 'Call for applications', tr: 'Başvuru çağrısı' },
      { en: 'Deadline', tr: 'Son tarih' },
    ],
    attachments: [
      {
        name: { en: 'Application form', tr: 'Başvuru formu' },
        href: '/sample-report.pdf',
        format: 'PDF',
        size: '42 KB',
      },
      {
        name: { en: 'Eligibility criteria', tr: 'Başvuru koşulları' },
        href: '/showcase-attachments/incubation-eligibility.txt',
        format: 'TXT',
        size: '1 KB',
      },
    ],
  },
  {
    slug: 'sablon-ai-seed-round',
    type: 'news',
    title: {
      en: 'Sablon AI raises a $2.4 million seed round',
      tr: 'Sablon AI 2,4 milyon dolarlık tohum yatırım aldı',
    },
    summary: {
      en: 'The fourteen-person document AI team, on campus since January, will use the round to grow its insurance pilots.',
      tr: 'Ocak ayından bu yana kampüste olan on dört kişilik belge yapay zekâsı ekibi, yatırımı sigorta pilotlarını büyütmek için kullanacak.',
    },
    body: [
      {
        en: 'Sablon AI, which builds models that read contracts, filings and forms and return structured fields with a confidence score for each, has closed a $2.4 million seed round led by a regional technology fund, with participation from two angel investors from the tech park network.',
        tr: 'Sözleşme, dilekçe ve formları okuyup her alan için güven skoruyla birlikte yapılandırılmış veri üreten modeller geliştiren Sablon AI, bölgesel bir teknoloji fonunun liderliğinde, teknopark ağından iki melek yatırımcının da katıldığı 2,4 milyon dolarlık tohum yatırım turunu tamamladı.',
      },
      {
        en: 'The company joined the incubation programme in January. Its insurance intake pilot now processes claim forms for two insurers, and the round will fund new hires in machine learning and a Frankfurt sales office next year.',
        tr: 'Şirket ocak ayında kuluçka programına katıldı. Sigorta başvuru pilotu bugün iki sigorta şirketinin hasar formlarını işliyor; yatırım, makine öğrenmesi alanındaki yeni işe alımları ve gelecek yıl açılacak Frankfurt satış ofisini finanse edecek.',
      },
    ],
    category: { en: 'Startups', tr: 'Girişimler' },
    date: '2026-09-15',
    readingTime: { en: '2 min read', tr: '2 dk okuma' },
    tags: [
      { en: 'Investment', tr: 'Yatırım' },
      { en: 'Sablon AI', tr: 'Sablon AI' },
      { en: 'Artificial intelligence', tr: 'Yapay zekâ' },
    ],
  },
  {
    slug: 'grant-info-day-october',
    type: 'announcement',
    title: {
      en: 'TÜBİTAK and KOSGEB support programmes: information day on October 8',
      tr: 'TÜBİTAK ve KOSGEB destekleri bilgilendirme günü 8 Ekim’de',
    },
    summary: {
      en: 'A morning on public R&D support calls, followed by one-to-one sessions with the incentives team.',
      tr: 'Kamu Ar-Ge destek çağrılarına ayrılmış bir sabah ve ardından teşvik ekibiyle birebir görüşmeler.',
    },
    body: [
      {
        en: 'The R&D support desk is holding an information day on Thursday, October 8, from 10:00 to 13:00 in the Block A conference hall. Sessions cover the application process for TÜBİTAK TEYDEB industrial R&D programmes, including 1501 and 1507, and KOSGEB’s R&D, innovation and industrial application support.',
        tr: 'Ar-Ge destek masası, 8 Ekim Perşembe günü 10.00–13.00 saatleri arasında A Blok konferans salonunda bilgilendirme günü düzenliyor. Oturumlarda 1501 ve 1507 başta olmak üzere TÜBİTAK TEYDEB sanayi Ar-Ge destek programlarının başvuru süreçleri ile KOSGEB Ar-Ge, İnovasyon ve Endüstriyel Uygulama Destek Programı ele alınacak.',
      },
      {
        en: 'In the afternoon, Deniz Yalçın, R&D Incentives Specialist, will hold 20-minute one-to-one sessions to look at specific project ideas. Places are limited and booked in order of registration.',
        tr: 'Öğleden sonra Ar-Ge Teşvikleri Uzmanı Deniz Yalçın, somut proje fikirlerini değerlendirmek üzere 20 dakikalık birebir görüşmeler yapacak. Kontenjan sınırlı olup randevular kayıt sırasına göre verilecektir.',
      },
      {
        en: 'Current call dates and conditions are those published by the programme owners; please check their official pages before applying.',
        tr: 'Güncel çağrı tarihleri ve koşulları için programları yürüten kurumların resmî duyuruları esas alınmalıdır; başvuru öncesinde bu sayfaları kontrol etmenizi öneririz.',
      },
    ],
    category: { en: 'Grants & incentives', tr: 'Destek ve teşvikler' },
    date: '2026-09-10',
    coverImage: {
      src: communityCampus,
      alt: { en: 'The Block A conference hall', tr: 'A Blok konferans salonu' },
    },
    tags: [
      { en: 'TÜBİTAK', tr: 'TÜBİTAK' },
      { en: 'KOSGEB', tr: 'KOSGEB' },
      { en: 'Event', tr: 'Etkinlik' },
    ],
    attachments: [
      {
        name: { en: 'Add to calendar', tr: 'Takvime ekle' },
        href: '/showcase-attachments/grant-info-day.ics',
        format: 'ICS',
        size: '1 KB',
      },
    ],
  },
  {
    slug: 'scale-up-demo-day',
    type: 'news',
    title: {
      en: 'Nine companies pitch at the scale-up programme’s demo day',
      tr: 'Hızlandırma programı demo gününde dokuz şirket sahneye çıktı',
    },
    summary: {
      en: 'More than forty investors and plant managers came to campus; three industrial pilots were agreed on the day.',
      tr: 'Kampüse kırkı aşkın yatırımcı ve fabrika yöneticisi geldi; gün içinde üç sanayi pilotu için anlaşma sağlandı.',
    },
    body: [
      {
        en: 'The summer cohort of the twelve-week scale-up programme closed with a demo day on September 3. Nine resident companies presented to regional investors and to production managers from the partner factories in the organised industrial zone.',
        tr: 'On iki haftalık hızlandırma programının yaz dönemi, 3 Eylül’de düzenlenen demo günüyle tamamlandı. Dokuz bölge firması; bölge yatırımcılarına ve organize sanayi bölgesindeki ortak fabrikaların üretim yöneticilerine sunum yaptı.',
      },
      {
        en: 'Halcyon Robotics agreed a three-month picking pilot with a grocery distributor, and Hasat Robotics will run its harvest platform in two orchards next season. A third pilot, between Medira Labs and a regional hospital laboratory, starts in November.',
        tr: 'Halcyon Robotics bir gıda dağıtım firmasıyla üç aylık bir toplama pilotu için anlaştı; Hasat Robotics ise hasat platformunu önümüzdeki sezon iki meyve bahçesinde çalıştıracak. Medira Labs ile bölgedeki bir hastane laboratuvarı arasındaki üçüncü pilot kasım ayında başlıyor.',
      },
      {
        en: 'Applications for the next cohort open in January.',
        tr: 'Bir sonraki dönemin başvuruları ocak ayında açılacak.',
      },
    ],
    category: { en: 'Acceleration', tr: 'Hızlandırma' },
    date: '2026-09-04',
    readingTime: { en: '3 min read', tr: '3 dk okuma' },
    coverImage: {
      src: communityCampus,
      alt: { en: 'Demo day in the campus plaza', tr: 'Kampüs meydanında demo günü' },
    },
    tags: [
      { en: 'Demo day', tr: 'Demo günü' },
      { en: 'Halcyon Robotics', tr: 'Halcyon Robotics' },
      { en: 'Hasat Robotics', tr: 'Hasat Robotics' },
    ],
    gallery: [
      {
        src: communityCampus,
        alt: { en: 'Audience at the demo day', tr: 'Demo günü izleyicileri' },
        caption: { en: 'The pitch stage in the plaza', tr: 'Meydandaki sunum sahnesi' },
      },
      {
        src: talentStudio,
        alt: {
          en: 'Investor meetings after the pitches',
          tr: 'Sunumların ardından yatırımcı görüşmeleri',
        },
        caption: { en: 'Afternoon investor meetings', tr: 'Öğleden sonraki yatırımcı görüşmeleri' },
      },
    ],
  },
  {
    slug: 'prototype-lab-safety-training',
    type: 'announcement',
    title: {
      en: 'Laboratory safety training required before October 15',
      tr: 'Laboratuvar güvenliği eğitimi 15 Ekim’e kadar tamamlanmalı',
    },
    summary: {
      en: 'Everyone who books the prototype laboratories or the clean room needs the updated module.',
      tr: 'Prototip laboratuvarlarını ya da temiz odayı kullanan herkesin güncellenen modülü tamamlaması gerekiyor.',
    },
    body: [
      {
        en: 'The laboratory safety module has been updated for the new clean room hall. It covers booking rules, gowning, chemical and waste handling, incident reporting and after-hours access.',
        tr: 'Laboratuvar güvenliği modülü, yeni temiz oda salonu için güncellendi. Modül; rezervasyon kuralları, temiz oda kıyafet prosedürü, kimyasal ve atık yönetimi, olay bildirimi ve mesai dışı erişim konularını kapsıyor.',
      },
      {
        en: 'The online module takes about 40 minutes and ends with a short test. Laboratory access on campus cards will be suspended from October 15 for users who have not completed it.',
        tr: 'Çevrim içi modül yaklaşık 40 dakika sürüyor ve kısa bir sınavla tamamlanıyor. Modülü 15 Ekim’e kadar tamamlamayan kullanıcıların kampüs kartlarındaki laboratuvar erişimi askıya alınacaktır.',
      },
    ],
    category: { en: 'Laboratories', tr: 'Laboratuvarlar' },
    date: '2026-08-26',
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
    slug: 'aurora-campus-open-day',
    type: 'announcement',
    title: {
      en: 'Aurora Open Day on October 3: registration is open',
      tr: 'Aurora Açık Gün 3 Ekim’de: kayıtlar açıldı',
    },
    summary: {
      en: 'Laboratory tours, resident-company demos and programme sessions for students, researchers and founders.',
      tr: 'Öğrenciler, araştırmacılar ve girişimciler için laboratuvar turları, firma demoları ve program oturumları.',
    },
    body: [
      {
        en: 'The campus opens its doors on Saturday, October 3, from 10:00 to 17:00. The day includes guided tours of the prototype laboratories and the clean room, demonstrations by resident companies and short sessions on the pre-incubation and incubation programmes.',
        tr: 'Kampüs, 3 Ekim Cumartesi günü 10.00–17.00 saatleri arasında kapılarını açıyor. Programda prototip laboratuvarları ve temiz odaya rehberli turlar, bölge firmalarının ürün demoları ile ön kuluçka ve kuluçka programları hakkında kısa oturumlar yer alıyor.',
      },
      {
        en: 'Aurora University students can meet the resident companies that are hiring interns this year. Registration is free but required, and laboratory tours are limited to fifteen people each.',
        tr: 'Aurora Üniversitesi öğrencileri bu yıl stajyer alacak bölge firmalarıyla tanışabilecek. Katılım ücretsizdir ancak kayıt zorunludur; laboratuvar turları on beşer kişilik gruplarla yapılacaktır.',
      },
    ],
    category: { en: 'Events', tr: 'Etkinlikler' },
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
    slug: 'aurora-orbital-export-contract',
    type: 'news',
    title: {
      en: 'Aurora Orbital signs its first export contract',
      tr: 'Aurora Orbital ilk ihracat sözleşmesini imzaladı',
    },
    summary: {
      en: 'The ground station software company will run the ground network of a regional satellite operator in Asia.',
      tr: 'Yer istasyonu yazılımı geliştiren şirket, Asya’daki bölgesel bir uydu operatörünün yer ağını yönetecek.',
    },
    body: [
      {
        en: 'Aurora Orbital, on campus since 2017, has signed a five-year contract to supply ground station software to a regional satellite operator in Asia. The software will schedule passes for three constellations from a single operations centre.',
        tr: '2017’den bu yana kampüste bulunan Aurora Orbital, Asya’daki bölgesel bir uydu operatörüne yer istasyonu yazılımı sağlamak için beş yıllık bir sözleşme imzaladı. Yazılım, üç ayrı takımyıldızın geçişlerini tek bir operasyon merkezinden planlayacak.',
      },
      {
        en: 'The company’s engineers will spend the first quarter of 2027 on site for the rollout. Aurora Orbital also works with Orbit Materials, two buildings away, on a composite payload fairing section.',
        tr: 'Şirketin mühendisleri kurulum için 2027’nin ilk çeyreğini sahada geçirecek. Aurora Orbital, iki bina ötedeki Orbit Materials ile kompozit bir faydalı yük kaportası üzerinde de birlikte çalışıyor.',
      },
    ],
    category: { en: 'Exports', tr: 'İhracat' },
    date: '2026-08-18',
    readingTime: { en: '2 min read', tr: '2 dk okuma' },
    coverImage: {
      src: climateNetwork,
      alt: { en: 'A satellite ground network', tr: 'Uydu yer ağı' },
    },
    tags: [
      { en: 'Space systems', tr: 'Uzay sistemleri' },
      { en: 'Export', tr: 'İhracat' },
      { en: 'Aurora Orbital', tr: 'Aurora Orbital' },
    ],
  },
  {
    slug: 'admission-committee-results-august',
    type: 'announcement',
    title: {
      en: 'Evaluation committee results: seven new companies admitted',
      tr: 'Değerlendirme kurulu sonuçları: yedi yeni firma bölgeye kabul edildi',
    },
    summary: {
      en: 'Eleven project applications were reviewed at the committee’s July meeting.',
      tr: 'Kurulun temmuz toplantısında on bir proje başvurusu değerlendirildi.',
    },
    body: [
      {
        en: 'At its July 30 meeting, the evaluation committee reviewed eleven R&D project applications. Seven companies were admitted to the zone, two were asked to resubmit with a revised project plan and two applications were declined.',
        tr: 'Değerlendirme kurulu 30 Temmuz’daki toplantısında on bir Ar-Ge projesi başvurusunu inceledi. Yedi firma bölgeye kabul edildi, iki firmadan proje planını revize ederek yeniden başvurması istendi, iki başvuru ise uygun bulunmadı.',
      },
      {
        en: 'Admitted companies will receive their lease offers from the management office within ten working days. Their projects become eligible for the zone’s exemptions from the date the lease is signed and the company is registered at its campus address.',
        tr: 'Kabul edilen firmalara kira teklifleri on iş günü içinde yönetim ofisi tarafından iletilecektir. Projeler, kira sözleşmesinin imzalanması ve firmanın kampüs adresinde tescil edilmesiyle birlikte bölge muafiyetlerinden yararlanmaya başlayacaktır.',
      },
      {
        en: 'The next committee meeting is on October 28. Applications submitted by October 14 will be on its agenda.',
        tr: 'Kurulun bir sonraki toplantısı 28 Ekim’de yapılacaktır. 14 Ekim’e kadar yapılan başvurular bu toplantının gündemine alınacaktır.',
      },
    ],
    category: { en: 'Admissions', tr: 'Firma kabul' },
    date: '2026-08-05',
    tags: [
      { en: 'Evaluation committee', tr: 'Değerlendirme kurulu' },
      { en: 'New companies', tr: 'Yeni firmalar' },
    ],
    attachments: [
      {
        name: { en: 'Project application guide', tr: 'Proje başvuru rehberi' },
        href: '/sample-report.pdf',
        format: 'PDF',
        size: '42 KB',
      },
    ],
  },
  {
    slug: 'ai-and-security-training-series',
    type: 'announcement',
    title: {
      en: 'Autumn training series on applied AI and cybersecurity',
      tr: 'Uygulamalı yapay zekâ ve siber güvenlik eğitim serisi',
    },
    summary: {
      en: 'Six Wednesday sessions from October 14, led by engineers from resident companies.',
      tr: '14 Ekim’den itibaren bölge firmalarının mühendislerinin vereceği altı çarşamba oturumu.',
    },
    body: [
      {
        en: 'The series runs on Wednesdays from 16:00 to 18:00 between October 14 and November 25 in the Block E training room, with no session on October 28, the eve of Republic Day. Engineers from Lumen Analytics, Cipherline and Sablon AI will cover monitoring models in production, securing machine-learning pipelines and incident response for small teams.',
        tr: 'Seri, 14 Ekim–25 Kasım tarihleri arasında çarşamba günleri 16.00–18.00 saatlerinde E Blok eğitim salonunda yapılacak; Cumhuriyet Bayramı arifesi olan 28 Ekim’de oturum olmayacak. Lumen Analytics, Cipherline ve Sablon AI mühendisleri; canlı ortamdaki modellerin izlenmesi, makine öğrenmesi hatlarının güvenliği ve küçük ekipler için olay müdahalesi konularını anlatacak.',
      },
      {
        en: 'The training is free for employees of resident companies. Registration closes on October 7; participants who attend at least five sessions receive a certificate.',
        tr: 'Eğitimler bölge firmalarının çalışanları için ücretsizdir. Kayıtlar 7 Ekim’de kapanacak; en az beş oturuma katılanlara katılım belgesi verilecektir.',
      },
    ],
    category: { en: 'Training', tr: 'Eğitim' },
    date: '2026-07-28',
    tags: [
      { en: 'Artificial intelligence', tr: 'Yapay zekâ' },
      { en: 'Cybersecurity', tr: 'Siber güvenlik' },
      { en: 'Training', tr: 'Eğitim' },
    ],
    attachments: [
      {
        name: { en: 'Session schedule', tr: 'Oturum takvimi' },
        href: '/showcase-attachments/training-series.csv',
        format: 'CSV',
        size: '1 KB',
      },
    ],
  },
  {
    slug: 'university-industry-matchmaking',
    type: 'news',
    title: {
      en: 'University–industry matchmaking day leads to fourteen project agreements',
      tr: 'Üniversite–sanayi eşleştirme günü on dört proje ön mutabakatıyla tamamlandı',
    },
    summary: {
      en: '58 academics and 37 companies held 126 one-to-one meetings in a single day.',
      tr: '58 akademisyen ve 37 firma bir günde 126 ikili görüşme gerçekleştirdi.',
    },
    body: [
      {
        en: 'The matchmaking day, organised with the Aurora University Technology Transfer Office on July 15, paired faculty members with companies from the zone and the organised industrial zone around specific technical problems submitted in advance.',
        tr: 'Aurora Üniversitesi Teknoloji Transfer Ofisi ile birlikte 15 Temmuz’da düzenlenen eşleştirme gününde öğretim üyeleri, teknopark ve organize sanayi bölgesindeki firmalarla önceden iletilen teknik problemler üzerinden bir araya geldi.',
      },
      {
        en: 'Fourteen pairs agreed to prepare joint project applications, most of them in materials, energy storage and agricultural sensing. “The problems came from the factory floor, which made the conversations very concrete,” says Assoc. Prof. Dr. Elif Tunalı from the Technology Transfer Office.',
        tr: 'On dört eşleşme ortak proje başvurusu hazırlama konusunda mutabık kaldı; projelerin çoğu ileri malzeme, enerji depolama ve tarımsal algılama alanlarında. Teknoloji Transfer Ofisi’nden Doç. Dr. Elif Tunalı, “Problemler doğrudan üretim sahasından geldiği için görüşmeler çok somut ilerledi.” diyor.',
      },
    ],
    category: { en: 'University–industry', tr: 'Üniversite–sanayi' },
    date: '2026-07-16',
    readingTime: { en: '2 min read', tr: '2 dk okuma' },
    coverImage: {
      src: talentStudio,
      alt: {
        en: 'One-to-one meetings at the matchmaking day',
        tr: 'Eşleştirme gününde ikili görüşmeler',
      },
    },
    tags: [
      { en: 'Technology transfer', tr: 'Teknoloji transferi' },
      { en: 'Aurora University', tr: 'Aurora Üniversitesi' },
    ],
  },
  {
    slug: 'energy-report-2025',
    type: 'news',
    title: {
      en: 'Campus energy report: consumption per square metre down 11%',
      tr: 'Kampüs enerji raporu: metrekare başına tüketim yüzde 11 azaldı',
    },
    summary: {
      en: 'Rooftop solar on Block B and a storage pilot by Nordwind Energy did most of the work.',
      tr: 'Düşüşün büyük kısmı B Blok’taki çatı güneş santrali ve Nordwind Energy’nin depolama pilotundan geldi.',
    },
    body: [
      {
        en: 'The 2025 energy and sustainability report shows electricity use per square metre falling by 11% on the previous year, while the number of people on campus grew. The rooftop solar plant on Block B covered 18% of the campus’s daytime demand.',
        tr: '2025 yılı enerji ve sürdürülebilirlik raporuna göre kampüsteki çalışan sayısı artarken metrekare başına elektrik tüketimi bir önceki yıla göre yüzde 11 azaldı. B Blok’taki çatı güneş santrali kampüsün gündüz talebinin yüzde 18’ini karşıladı.',
      },
      {
        en: 'In a pilot with resident company Nordwind Energy, the campus ran on stored wind power for six consecutive winter nights. Building-level consumption for every block is now visible to resident companies on the campus energy dashboard.',
        tr: 'Bölge firması Nordwind Energy ile yürütülen pilot çalışmada kampüs, üst üste altı kış gecesi boyunca depolanmış rüzgâr enerjisiyle çalıştı. Her bloğun tüketimi artık kampüs enerji paneli üzerinden bölge firmalarının erişimine açık.',
      },
    ],
    category: { en: 'Sustainability', tr: 'Sürdürülebilirlik' },
    date: '2026-07-02',
    readingTime: { en: '4 min read', tr: '4 dk okuma' },
    coverImage: {
      src: climateNetwork,
      alt: { en: 'Campus energy network', tr: 'Kampüs enerji ağı' },
    },
    tags: [
      { en: 'Energy', tr: 'Enerji' },
      { en: 'Nordwind Energy', tr: 'Nordwind Energy' },
    ],
    attachments: [
      {
        name: {
          en: '2025 energy and sustainability report',
          tr: '2025 enerji ve sürdürülebilirlik raporu',
        },
        href: '/sample-report.pdf',
        format: 'PDF',
        size: '42 KB',
      },
    ],
  },
  {
    slug: 'shuttle-summer-schedule',
    type: 'announcement',
    title: { en: 'Campus shuttle summer timetable', tr: 'Kampüs servisi yaz tarifesi' },
    summary: {
      en: 'From July 1 to August 31, evening shuttles to the city centre run every 30 minutes.',
      tr: '1 Temmuz–31 Ağustos arasında şehir merkezine akşam seferleri 30 dakikada bir yapılacak.',
    },
    body: [
      {
        en: 'Morning routes from the city centre and the intercity bus terminal are unchanged. During the summer, evening departures from the campus run every 30 minutes and the last weekday departure moves to 22:30.',
        tr: 'Şehir merkezi ve otogardan kalkan sabah seferlerinde değişiklik yoktur. Yaz döneminde kampüsten akşam seferleri 30 dakikada bir yapılacak, hafta içi son kalkış 22.30’a alınacaktır.',
      },
      {
        en: 'Live shuttle locations and accessible vehicles are shown in the campus mobile app.',
        tr: 'Servislerin canlı konumları ve erişilebilir araçlar kampüs mobil uygulamasında görüntülenebilir.',
      },
    ],
    category: { en: 'Transport', tr: 'Ulaşım' },
    date: '2026-06-24',
    tags: [
      { en: 'Shuttle', tr: 'Servis' },
      { en: 'Timetable', tr: 'Tarife' },
    ],
  },
  {
    slug: 'orbit-materials-patent',
    type: 'news',
    title: {
      en: 'Orbit Materials granted a patent for its high-temperature composite',
      tr: 'Orbit Materials yüksek sıcaklık kompoziti için patent aldı',
    },
    summary: {
      en: 'The resin system keeps its stiffness above 200°C; an international application is under way.',
      tr: '200°C’nin üzerinde rijitliğini koruyan reçine sistemi için uluslararası başvuru süreci de devam ediyor.',
    },
    body: [
      {
        en: 'Orbit Materials has been granted a patent by the Turkish Patent and Trademark Office for the resin system behind its structural composite, which keeps its stiffness above 200°C. The company has also filed an international application under the Patent Cooperation Treaty.',
        tr: 'Orbit Materials, 200°C’nin üzerinde rijitliğini koruyan yapısal kompozitinin temelindeki reçine sistemi için Türk Patent ve Marka Kurumu’ndan patent aldı. Şirket, Patent İşbirliği Antlaşması kapsamında uluslararası başvurusunu da yaptı.',
      },
      {
        en: 'The application was prepared with support from the Aurora University Technology Transfer Office. It is the tech park’s twelfth patent grant this year.',
        tr: 'Başvuru, Aurora Üniversitesi Teknoloji Transfer Ofisi’nin desteğiyle hazırlandı. Bu, teknopark firmalarının bu yıl aldığı on ikinci patent oldu.',
      },
    ],
    category: { en: 'Intellectual property', tr: 'Fikrî mülkiyet' },
    date: '2026-06-10',
    readingTime: { en: '2 min read', tr: '2 dk okuma' },
    tags: [
      { en: 'Patent', tr: 'Patent' },
      { en: 'Advanced materials', tr: 'İleri malzeme' },
      { en: 'Orbit Materials', tr: 'Orbit Materials' },
    ],
  },
  {
    slug: 'field-data-hackathon',
    type: 'news',
    title: {
      en: '24 teams, 36 hours: the Field Data hackathon',
      tr: '24 takım, 36 saat: Tarladan Veriye hackathonu',
    },
    summary: {
      en: 'The winning team predicted irrigation needs from a season of soil probe data.',
      tr: 'Birinci olan takım, bir sezonluk toprak sensörü verisinden sulama ihtiyacını tahmin etti.',
    },
    body: [
      {
        en: 'The agritech hackathon on May 16–17 brought 112 students and young engineers to campus. Teams worked on a full season of anonymised soil moisture data shared by Terrafield from its field trial across eleven farms.',
        tr: '16–17 Mayıs’ta düzenlenen tarım teknolojileri hackathonu kampüse 112 öğrenci ve genç mühendisi getirdi. Takımlar, Terrafield’ın on bir çiftlikte yürüttüğü saha denemesinden paylaştığı bir sezonluk anonim toprak nemi verisi üzerinde çalıştı.',
      },
      {
        en: 'The winning team’s model predicted irrigation needs three days ahead. The top three teams earn direct entry to the pre-incubation programme’s autumn intake.',
        tr: 'Birinci takımın modeli sulama ihtiyacını üç gün önceden tahmin etti. İlk üç takım, ön kuluçka programının sonbahar dönemine doğrudan kabul hakkı kazandı.',
      },
    ],
    category: { en: 'Events', tr: 'Etkinlikler' },
    date: '2026-05-18',
    readingTime: { en: '2 min read', tr: '2 dk okuma' },
    coverImage: {
      src: mobilityGrid,
      alt: { en: 'Teams at work during the hackathon', tr: 'Hackathon sırasında çalışan takımlar' },
    },
    tags: [
      { en: 'Hackathon', tr: 'Hackathon' },
      { en: 'Agritech', tr: 'Tarım teknolojisi' },
      { en: 'Terrafield', tr: 'Terrafield' },
    ],
  },
  {
    slug: 'international-delegation-visit',
    type: 'news',
    title: {
      en: 'Technology transfer delegation from Germany and the Netherlands visits campus',
      tr: 'Almanya ve Hollanda’dan teknoloji transferi heyeti kampüsü ziyaret etti',
    },
    summary: {
      en: 'Sixteen representatives of clusters and research institutes met agricultural robotics and materials companies.',
      tr: 'Küme ve araştırma enstitülerinden on altı temsilci tarım robotiği ve ileri malzeme firmalarıyla görüştü.',
    },
    body: [
      {
        en: 'A sixteen-person delegation of cluster managers and applied research institutes visited the tech park on April 21. The programme included the robotics hall in Block B, Hasat Robotics’ orchard platform and a round table on joint applications to European research programmes.',
        tr: 'Küme yöneticileri ve uygulamalı araştırma enstitülerinden oluşan on altı kişilik heyet 21 Nisan’da teknoparkı ziyaret etti. Programda B Blok’taki robotik test salonu, Hasat Robotics’in meyve bahçesi platformu ve Avrupa araştırma programlarına ortak başvurular üzerine bir yuvarlak masa toplantısı yer aldı.',
      },
      {
        en: 'Four resident companies agreed follow-up meetings, and a return visit by Aurora companies is planned for the spring.',
        tr: 'Dört bölge firması takip görüşmeleri için anlaştı; Aurora firmalarının karşı ziyaretinin ilkbaharda yapılması planlanıyor.',
      },
    ],
    category: { en: 'International', tr: 'Uluslararası' },
    date: '2026-04-22',
    readingTime: { en: '2 min read', tr: '2 dk okuma' },
    tags: [
      { en: 'Delegation', tr: 'Heyet ziyareti' },
      { en: 'Robotics', tr: 'Robotik' },
    ],
  },
  {
    slug: 'annual-activity-report-2025',
    type: 'news',
    title: {
      en: '2025 activity report: 148 companies, 3,200 R&D professionals',
      tr: '2025 faaliyet raporu: 148 firma, 3.200 Ar-Ge çalışanı',
    },
    summary: {
      en: 'Eighteen new companies, 34 export markets and 286 active patents across the zone.',
      tr: 'Bölgede on sekiz yeni firma, 34 ihracat pazarı ve 286 aktif patent.',
    },
    body: [
      {
        en: 'The tech park’s 2025 activity report counts 148 resident companies at year end, eighteen of them new, and 3,200 people working in R&D and support roles. Companies on campus exported to 34 countries and held 286 active patents.',
        tr: 'Teknoparkın 2025 faaliyet raporuna göre yıl sonunda bölgede 18’i yeni olmak üzere 148 firma ve Ar-Ge ile destek pozisyonlarında 3.200 çalışan bulunuyor. Kampüs firmaları 34 ülkeye ihracat yaptı ve 286 aktif patente sahip.',
      },
      {
        en: 'The figures feed into the Ministry of Industry and Technology’s annual performance assessment of technology development zones. The full report, including sector breakdowns, is available to download.',
        tr: 'Bu veriler, Sanayi ve Teknoloji Bakanlığının teknoloji geliştirme bölgelerine yönelik yıllık performans değerlendirmesine de esas oluyor. Sektör kırılımlarını içeren raporun tamamı indirilebilir.',
      },
    ],
    category: { en: 'Performance', tr: 'Performans' },
    date: '2026-04-06',
    readingTime: { en: '3 min read', tr: '3 dk okuma' },
    coverImage: {
      src: dataCenter,
      alt: { en: 'Campus in numbers', tr: 'Rakamlarla kampüs' },
    },
    tags: [
      { en: 'Annual report', tr: 'Faaliyet raporu' },
      { en: 'Statistics', tr: 'İstatistik' },
    ],
    attachments: [
      {
        name: { en: '2025 activity report', tr: '2025 faaliyet raporu' },
        href: '/sample-report.pdf',
        format: 'PDF',
        size: '42 KB',
      },
    ],
  },
]
