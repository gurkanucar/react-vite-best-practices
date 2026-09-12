import type { Publication } from '@/features/showcases/types'

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
  },
]
