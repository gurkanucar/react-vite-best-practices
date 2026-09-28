/*
 * Şehirname: a city guide for İstanbul and Edirne. The landmarks, dishes and traditions are
 * real and described as they are; the restaurants, shops, stays and events are invented demo
 * data, and the site says so. Opening hours of real places are never guessed.
 */

export const CITY_IDS = ['istanbul', 'edirne'] as const
export type CityId = (typeof CITY_IDS)[number]

export interface Loc {
  en: string
  tr: string
}

export const PLACE_CATEGORIES = [
  'history',
  'restaurant',
  'food',
  'culture',
  'business',
  'stay',
] as const
export type PlaceCategory = (typeof PLACE_CATEGORIES)[number]

export const EVENT_CATEGORIES = ['music', 'food', 'art', 'tour', 'sport', 'family'] as const
export type EventCategory = (typeof EVENT_CATEGORIES)[number]

export interface Fact {
  label: Loc
  value: Loc
}

export interface Place {
  id: string
  city: CityId
  category: PlaceCategory
  name: Loc
  summary: Loc
  body: Loc[]
  district: string
  /** Left out for a dish or a custom that has no one address. */
  position?: [number, number]
  /** A real landmark, dish or tradition, or an invented business. */
  kind: 'real' | 'demo'
  facts?: Fact[]
  tip?: Loc
  /** Demo businesses only: a rating out of five and how many reviews it has. */
  rating?: number
  reviews?: number
  /** Demo businesses only: 1 (cheap) to 4 (special occasion). */
  price?: 1 | 2 | 3 | 4
  /** Demo businesses only; real places send visitors to their official site. */
  hours?: Loc
  /** What kind of business it is: "Meyhane", "Copper workshop". */
  type?: Loc
  /** Restaurants: the dishes they are known for, as `food` place ids. */
  dishes?: string[]
  featured?: boolean
}

export interface TimelineEntry {
  year: Loc
  title: Loc
  text: Loc
}

export interface City {
  id: CityId
  name: Loc
  /** The locative for Turkish headings: "İstanbul'da", "Edirne'de". */
  inTr: string
  /** The accusative for "İstanbul'u keşfedin". */
  accTr: string
  tagline: Loc
  intro: Loc
  center: [number, number]
  zoom: number
  facts: Fact[]
  timeline: TimelineEntry[]
  neighbourhoods: { name: string; text: Loc }[]
  practical: { key: 'getting' | 'around' | 'season' | 'tip'; text: Loc }[]
  /** The two colours of the city's artwork. */
  palette: [string, string]
}

export interface CityEvent {
  id: string
  city: CityId
  category: EventCategory
  title: Loc
  text: Loc
  /** ISO date; `end` for an event that runs over several days. */
  date: string
  end?: string
  time: string
  venue: Loc
  district: string
  /** In Turkish lira; 0 is free. */
  price: number
}

const loc = (en: string, tr: string): Loc => ({ en, tr })

export const cities: Record<CityId, City> = {
  istanbul: {
    id: 'istanbul',
    name: loc('İstanbul', 'İstanbul'),
    inTr: "İstanbul'da",
    accTr: "İstanbul'u",
    tagline: loc('Two continents, one Bosphorus', 'İki kıta, tek Boğaz'),
    intro: loc(
      'Capital of two empires for more than 1,500 years, İstanbul spreads across Europe and Asia on both shores of the Bosphorus. Come for Hagia Sophia and the bazaars, stay for the ferries, the tea gardens and the long dinners of small plates.',
      'Bin beş yüz yılı aşkın süre iki imparatorluğa başkentlik yapan İstanbul, Boğaz’ın iki yakasında Avrupa ve Asya’ya yayılır. Ayasofya ve çarşılar için gelin; vapurlar, çay bahçeleri ve uzun meze sofraları için kalın.',
    ),
    center: [41.0157, 28.9784],
    zoom: 12,
    facts: [
      {
        label: loc('Population', 'Nüfus'),
        value: loc('≈15.7 million (2024)', '≈15,7 milyon (2024)'),
      },
      { label: loc('Districts', 'İlçe'), value: loc('39', '39') },
      { label: loc('Continents', 'Kıta'), value: loc('Europe and Asia', 'Avrupa ve Asya') },
      { label: loc('Plate code', 'Plaka'), value: loc('34', '34') },
      {
        label: loc('UNESCO', 'UNESCO'),
        value: loc('Historic Areas, since 1985', 'Tarihi Alanlar, 1985’ten beri'),
      },
    ],
    timeline: [
      {
        year: loc('c. 660 BC', 'MÖ y. 660'),
        title: loc('Byzantion', 'Byzantion'),
        text: loc(
          'Greek colonists from Megara found Byzantion on the point between the Golden Horn and the Sea of Marmara.',
          'Megaralı Yunan kolonistler, Haliç ile Marmara arasındaki burunda Byzantion’u kurar.',
        ),
      },
      {
        year: loc('330', '330'),
        title: loc('Constantinople', 'Konstantinopolis'),
        text: loc(
          'Constantine the Great makes the city the new capital of the Roman Empire.',
          'Büyük Konstantin şehri Roma İmparatorluğu’nun yeni başkenti yapar.',
        ),
      },
      {
        year: loc('537', '537'),
        title: loc('Hagia Sophia', 'Ayasofya'),
        text: loc(
          'Justinian I completes Hagia Sophia, for a thousand years the largest church in the world.',
          'I. Justinianus, bin yıl boyunca dünyanın en büyük kilisesi olacak Ayasofya’yı tamamlar.',
        ),
      },
      {
        year: loc('1453', '1453'),
        title: loc('The Ottoman conquest', 'Fetih'),
        text: loc(
          'Mehmed II takes the city on 29 May 1453 and makes it the Ottoman capital.',
          'II. Mehmed 29 Mayıs 1453’te şehri alır ve Osmanlı başkenti yapar.',
        ),
      },
      {
        year: loc('1557', '1557'),
        title: loc('Süleymaniye', 'Süleymaniye'),
        text: loc(
          'Mimar Sinan completes the Süleymaniye Mosque for Süleyman the Magnificent.',
          'Mimar Sinan, Kanuni Sultan Süleyman için Süleymaniye Camii’ni tamamlar.',
        ),
      },
      {
        year: loc('1923', '1923'),
        title: loc('The Republic', 'Cumhuriyet'),
        text: loc(
          'The Republic of Türkiye is proclaimed and the capital moves to Ankara.',
          'Türkiye Cumhuriyeti ilan edilir, başkent Ankara olur.',
        ),
      },
      {
        year: loc('1973', '1973'),
        title: loc('The first bridge', 'İlk köprü'),
        text: loc(
          'The Bosphorus Bridge, today’s 15 July Martyrs Bridge, joins Europe and Asia.',
          'Boğaziçi Köprüsü, bugünkü 15 Temmuz Şehitler Köprüsü, Avrupa ile Asya’yı birleştirir.',
        ),
      },
      {
        year: loc('2013', '2013'),
        title: loc('Marmaray', 'Marmaray'),
        text: loc(
          'The Marmaray rail tunnel opens under the Bosphorus.',
          'Boğaz’ın altından geçen Marmaray raylı sistem tüneli açılır.',
        ),
      },
    ],
    neighbourhoods: [
      {
        name: 'Sultanahmet',
        text: loc(
          'The historic peninsula: Hagia Sophia, the Blue Mosque and Topkapı within a short walk.',
          'Tarihi yarımada: Ayasofya, Sultanahmet Camii ve Topkapı birkaç dakika arayla.',
        ),
      },
      {
        name: 'Beyoğlu',
        text: loc(
          'İstiklal Avenue, the old passages, meyhanes and the streets down to Galata.',
          'İstiklal Caddesi, eski pasajlar, meyhaneler ve Galata’ya inen sokaklar.',
        ),
      },
      {
        name: 'Karaköy',
        text: loc(
          'Old warehouses turned into galleries, coffee roasters and baklava shops by the water.',
          'Galeriye, kahve kavurucusuna ve baklavacıya dönüşmüş eski depolar, hemen sahilde.',
        ),
      },
      {
        name: 'Kadıköy',
        text: loc(
          'The Asian side’s market streets, Moda’s seafront and a lively evening crowd.',
          'Anadolu yakasının çarşı sokakları, Moda sahili ve hiç sönmeyen akşam kalabalığı.',
        ),
      },
      {
        name: 'Balat & Fener',
        text: loc(
          'Colourful houses on steep streets above the Golden Horn.',
          'Haliç’e bakan dik sokaklarda rengârenk evler.',
        ),
      },
      {
        name: 'Üsküdar',
        text: loc(
          'Mosques by Sinan, tea by the water and the view of the Maiden’s Tower.',
          'Sinan camileri, sahilde çay ve Kız Kulesi manzarası.',
        ),
      },
    ],
    practical: [
      {
        key: 'getting',
        text: loc(
          'Two airports: İstanbul Airport on the European side and Sabiha Gökçen on the Asian side, both linked by metro and airport buses.',
          'İki havalimanı var: Avrupa yakasında İstanbul Havalimanı, Anadolu yakasında Sabiha Gökçen; ikisine de metro ve havalimanı otobüsleriyle gidilir.',
        ),
      },
      {
        key: 'around',
        text: loc(
          'One İstanbulkart pays for the metro, trams, Marmaray, buses and the ferries. The ferry is the nicest way between the two sides.',
          'Tek bir İstanbulkart ile metro, tramvay, Marmaray, otobüs ve vapura binilir. İki yaka arasında en keyiflisi vapurdur.',
        ),
      },
      {
        key: 'season',
        text: loc(
          'April to June and September to November: mild days, tulips in spring, fewer crowds in autumn.',
          'Nisan–Haziran ve Eylül–Kasım: ılık günler, baharda laleler, sonbaharda daha az kalabalık.',
        ),
      },
      {
        key: 'tip',
        text: loc(
          'Mosques are visited outside prayer times; cover your shoulders and knees, and women cover their hair.',
          'Camiler namaz vakitleri dışında gezilir; omuz ve dizler kapalı olmalı, kadınlar başını örter.',
        ),
      },
    ],
    palette: ['#1f5f8b', '#c8553d'],
  },
  edirne: {
    id: 'edirne',
    name: loc('Edirne', 'Edirne'),
    inTr: "Edirne'de",
    accTr: "Edirne'yi",
    tagline: loc(
      'Sinan’s masterwork on the Balkan border',
      'Balkanlar’ın kapısında Sinan’ın ustalık eseri',
    ),
    intro: loc(
      'Founded as Hadrianopolis and the Ottoman capital before İstanbul, Edirne sits where the Tunca meets the Meriç, a short drive from Greece and Bulgaria. It is a city of great mosques, stone bridges, fried liver and oil wrestling.',
      'Hadrianopolis olarak kurulan ve İstanbul’dan önce Osmanlı başkenti olan Edirne, Tunca’nın Meriç’e kavuştuğu yerde, Yunanistan ve Bulgaristan’a birkaç dakika uzaklıkta. Büyük camilerin, taş köprülerin, tava ciğerin ve yağlı güreşin şehri.',
    ),
    center: [41.6771, 26.5557],
    zoom: 14,
    facts: [
      {
        label: loc('Population', 'Nüfus'),
        value: loc('≈420 thousand (province)', '≈420 bin (il)'),
      },
      { label: loc('Rivers', 'Nehirler'), value: loc('Meriç, Tunca, Arda', 'Meriç, Tunca, Arda') },
      {
        label: loc('Borders', 'Sınır'),
        value: loc('Greece and Bulgaria', 'Yunanistan ve Bulgaristan'),
      },
      { label: loc('Plate code', 'Plaka'), value: loc('22', '22') },
      {
        label: loc('UNESCO', 'UNESCO'),
        value: loc('Selimiye Mosque, since 2011', 'Selimiye Camii, 2011’den beri'),
      },
    ],
    timeline: [
      {
        year: loc('c. 125', 'y. 125'),
        title: loc('Hadrianopolis', 'Hadrianopolis'),
        text: loc(
          'The Roman emperor Hadrian refounds an older Thracian town and gives it his name.',
          'Roma imparatoru Hadrianus eski bir Trak yerleşimini yeniden kurar ve ona adını verir.',
        ),
      },
      {
        year: loc('378', '378'),
        title: loc('Battle of Adrianople', 'Edirne Savaşı'),
        text: loc(
          'The Goths defeat the Roman army outside the city; Emperor Valens is killed.',
          'Gotlar şehrin dışında Roma ordusunu yener; İmparator Valens ölür.',
        ),
      },
      {
        year: loc('1360s', '1360’lar'),
        title: loc('Ottoman capital', 'Osmanlı başkenti'),
        text: loc(
          'The Ottomans take the city (the date given varies) and rule from Edirne until 1453.',
          'Osmanlılar şehri alır (kaynaklarda tarih değişir) ve 1453’e kadar devleti Edirne’den yönetir.',
        ),
      },
      {
        year: loc('1447', '1447'),
        title: loc('Üç Şerefeli', 'Üç Şerefeli'),
        text: loc(
          'Murad II completes the Üç Şerefeli Mosque, a step towards the classical Ottoman dome.',
          'II. Murad, klasik Osmanlı kubbesine giden yolda bir adım olan Üç Şerefeli Camii’ni tamamlar.',
        ),
      },
      {
        year: loc('1488', '1488'),
        title: loc('Bayezid II Complex', 'II. Bayezid Külliyesi'),
        text: loc(
          'A mosque, a medical school and a hospital that treated patients with music and water.',
          'Hastaları müzik ve su sesiyle tedavi eden darüşşifasıyla cami, medrese ve şifahane.',
        ),
      },
      {
        year: loc('1575', '1575'),
        title: loc('Selimiye', 'Selimiye'),
        text: loc(
          'Mimar Sinan completes the Selimiye Mosque for Selim II and calls it his masterwork.',
          'Mimar Sinan, II. Selim için Selimiye Camii’ni tamamlar ve ona ustalık eserim der.',
        ),
      },
      {
        year: loc('1923', '1923'),
        title: loc('Karaağaç', 'Karaağaç'),
        text: loc(
          'Under the Treaty of Lausanne, Karaağaç across the Meriç becomes part of Türkiye.',
          'Lozan Antlaşması ile Meriç’in öte yakasındaki Karaağaç Türkiye’ye katılır.',
        ),
      },
      {
        year: loc('2011', '2011'),
        title: loc('World Heritage', 'Dünya Mirası'),
        text: loc(
          'The Selimiye Mosque and its social complex join the UNESCO World Heritage List.',
          'Selimiye Camii ve Külliyesi UNESCO Dünya Mirası Listesi’ne girer.',
        ),
      },
    ],
    neighbourhoods: [
      {
        name: 'Kaleiçi',
        text: loc(
          'The old walled town, laid out on a grid, with wooden houses and the Macedonian Tower.',
          'Izgara planlı eski sur içi; ahşap evler ve Makedon Kulesi.',
        ),
      },
      {
        name: 'Selimiye',
        text: loc(
          'The mosque, its arasta of shops below and the squares around it.',
          'Cami, altındaki arasta ve çevresindeki meydanlar.',
        ),
      },
      {
        name: 'Sarayiçi',
        text: loc(
          'The meadows by the Tunca where the palace stood and Kırkpınar is wrestled.',
          'Sarayın durduğu, Kırkpınar güreşlerinin yapıldığı Tunca kıyısındaki çayırlar.',
        ),
      },
      {
        name: 'Karaağaç',
        text: loc(
          'Across the Meriç Bridge: the old railway station, the Lausanne Monument and riverside cafés.',
          'Meriç Köprüsü’nün ötesi: eski gar binası, Lozan Anıtı ve nehir kenarı kafeleri.',
        ),
      },
    ],
    practical: [
      {
        key: 'getting',
        text: loc(
          'About 230 km from İstanbul; intercity buses take around two and a half to three hours.',
          'İstanbul’a yaklaşık 230 km; şehirlerarası otobüsle iki buçuk, üç saat sürer.',
        ),
      },
      {
        key: 'around',
        text: loc(
          'The centre is walkable: Selimiye, Eski Cami, Üç Şerefeli and the bazaars are minutes apart. Take a taxi or bike to Karaağaç and the Bayezid complex.',
          'Merkez yürünür: Selimiye, Eski Cami, Üç Şerefeli ve çarşılar birkaç dakika arayla. Karaağaç ve Bayezid Külliyesi için taksi ya da bisiklet.',
        ),
      },
      {
        key: 'season',
        text: loc(
          'May for Kakava and Hıdrellez, late June or early July for Kırkpınar; spring and autumn for walking.',
          'Kakava ve Hıdrellez için mayıs, Kırkpınar için haziran sonu ya da temmuz başı; yürüyüş için ilkbahar ve sonbahar.',
        ),
      },
      {
        key: 'tip',
        text: loc(
          'Edirne makes an easy weekend from İstanbul; book a stay early for the Kırkpınar week.',
          'Edirne, İstanbul’dan kolay bir hafta sonu kaçamağıdır; Kırkpınar haftası için konaklamayı erken ayırtın.',
        ),
      },
    ],
    palette: ['#7a3b2e', '#d49a3a'],
  },
}

const see = loc('Check the official site before you go.', 'Gitmeden önce resmi sitesine bakın.')
const history = (
  city: CityId,
  id: string,
  name: Loc,
  district: string,
  position: [number, number],
  summary: Loc,
  body: Loc[],
  facts: Fact[],
  tip?: Loc,
  featured = false,
): Place => ({
  id,
  city,
  category: 'history',
  name,
  district,
  position,
  summary,
  body,
  facts,
  tip,
  kind: 'real',
  hours: see,
  featured,
})

const built = (en: string, tr = en): Fact => ({ label: loc('Built', 'Yapım'), value: loc(en, tr) })
const by = (en: string, tr = en): Fact => ({
  label: loc('Built by', 'Yaptıran / mimar'),
  value: loc(en, tr),
})

const landmarks: Place[] = [
  history(
    'istanbul',
    'ayasofya',
    loc('Hagia Sophia', 'Ayasofya'),
    'Sultanahmet',
    [41.0086, 28.9802],
    loc(
      'Justinian’s great domed church of 537, a mosque after 1453, a museum from 1934 and a mosque again since 2020.',
      'Justinianus’un 537’de tamamlanan kubbeli büyük kilisesi; 1453’ten sonra cami, 1934’te müze, 2020’den beri yeniden cami.',
    ),
    [
      loc(
        'Anthemius of Tralles and Isidore of Miletus built it in under six years. Its dome, floating on a ring of windows, shaped church and mosque architecture for a thousand years.',
        'Trallesli Anthemius ve Miletli İsidoros onu altı yıldan kısa sürede inşa etti. Bir pencere halkasının üstünde süzülür gibi duran kubbesi, bin yıl boyunca kilise ve cami mimarisini etkiledi.',
      ),
      loc(
        'Inside, Byzantine mosaics sit beside the great round calligraphy panels added in the 19th century.',
        'İçeride Bizans mozaikleri, 19. yüzyılda eklenen büyük yuvarlak hat levhalarıyla yan yana durur.',
      ),
    ],
    [built('532–537'), by('Anthemius & Isidore', 'Anthemius ve İsidoros')],
    loc(
      'It is a working mosque: visit outside prayer times and dress modestly.',
      'İbadete açık bir cami: namaz vakitleri dışında ve uygun kıyafetle gezin.',
    ),
    true,
  ),
  history(
    'istanbul',
    'topkapi',
    loc('Topkapı Palace', 'Topkapı Sarayı'),
    'Sultanahmet',
    [41.0115, 28.9834],
    loc(
      'Home of the Ottoman sultans for almost four centuries, on the point above the Bosphorus.',
      'Yaklaşık dört yüzyıl Osmanlı padişahlarının evi; Boğaz’a bakan burnun üstünde.',
    ),
    [
      loc(
        'Mehmed II began the palace soon after the conquest. It grew into a series of courtyards, kiosks and the Harem, and was the seat of government until the court moved to Dolmabahçe in the 1850s.',
        'II. Mehmed sarayı fetihten kısa süre sonra yaptırmaya başladı. Avlular, köşkler ve Harem ile büyüdü; saray 1850’lerde Dolmabahçe’ye taşınana kadar yönetimin merkezi oldu.',
      ),
      loc(
        'A museum since 1924, it holds the Imperial Treasury, the Sacred Relics and the palace kitchens.',
        '1924’ten beri müze; Hazine, Kutsal Emanetler ve saray mutfakları burada.',
      ),
    ],
    [built('from 1459', '1459’dan itibaren'), by('Mehmed II', 'II. Mehmed')],
    loc(
      'Allow half a day; the Harem has its own entrance inside.',
      'Yarım gün ayırın; Harem’in içeride ayrı girişi var.',
    ),
    true,
  ),
  history(
    'istanbul',
    'suleymaniye',
    loc('Süleymaniye Mosque', 'Süleymaniye Camii'),
    'Fatih',
    [41.0162, 28.9639],
    loc(
      'Sinan’s mosque for Süleyman the Magnificent, crowning the third hill above the Golden Horn.',
      'Sinan’ın Kanuni için yaptığı cami; Haliç’e bakan üçüncü tepenin tacı.',
    ),
    [
      loc(
        'Built between 1550 and 1557, the mosque stands in a complex of schools, a hospital, a soup kitchen and baths. Süleyman and Hürrem Sultan are buried in the garden, and Sinan’s own tomb is just outside the walls.',
        '1550–1557 arasında inşa edilen cami; medreseler, darüşşifa, imaret ve hamamla birlikte bir külliyenin içinde. Kanuni ve Hürrem Sultan bahçedeki türbelerde yatar, Sinan’ın türbesi de duvarın hemen dışında.',
      ),
    ],
    [built('1550–1557'), by('Mimar Sinan')],
    loc(
      'Walk round to the back terrace for the view over the Golden Horn.',
      'Haliç manzarası için arka terasa dolaşın.',
    ),
    true,
  ),
  history(
    'istanbul',
    'yerebatan',
    loc('Basilica Cistern', 'Yerebatan Sarnıcı'),
    'Sultanahmet',
    [41.0084, 28.9779],
    loc(
      'A sixth-century underground water store held up by 336 columns.',
      '336 sütunun taşıdığı, altıncı yüzyıldan kalma yeraltı su deposu.',
    ),
    [
      loc(
        'Built under Justinian I to store water for the Great Palace, the cistern is a forest of columns in the half-light. Two of them stand on Medusa heads, one sideways and one upside down.',
        'I. Justinianus döneminde Büyük Saray’a su sağlamak için yapılan sarnıç, loş ışıkta bir sütun ormanıdır. Sütunlardan ikisi, biri yan biri ters duran Medusa başlarının üstünde yükselir.',
      ),
    ],
    [
      built('6th century', '6. yüzyıl'),
      { label: loc('Columns', 'Sütun'), value: loc('336', '336') },
    ],
  ),
  history(
    'istanbul',
    'galata-kulesi',
    loc('Galata Tower', 'Galata Kulesi'),
    'Beyoğlu',
    [41.0256, 28.9742],
    loc(
      'The Genoese tower of 1348, with a balcony that circles the whole city.',
      'Cenevizlilerin 1348’de yaptığı kule; balkonundan bütün şehir görünür.',
    ),
    [
      loc(
        'The Genoese built it as part of the walls of their colony at Galata. It has been a watchtower and a fire lookout, and is now a museum with the city’s best-known view.',
        'Cenevizliler onu Galata’daki kolonilerinin surlarının parçası olarak yaptı. Gözetleme ve yangın kulesi oldu; bugün şehrin en bilinen manzarasına sahip bir müze.',
      ),
    ],
    [
      built('1348'),
      { label: loc('Height', 'Yükseklik'), value: loc('about 63 m', 'yaklaşık 63 m') },
    ],
    loc(
      'Go early or near closing time; the queue is shortest then.',
      'Sabah erken ya da kapanışa yakın gidin; kuyruk o zaman en kısa.',
    ),
  ),
  history(
    'istanbul',
    'sultanahmet',
    loc('Blue Mosque', 'Sultanahmet Camii'),
    'Sultanahmet',
    [41.0054, 28.9768],
    loc(
      'The six-minaret mosque of Ahmed I, named in English for the blue İznik tiles inside.',
      'I. Ahmed’in altı minareli camii; İngilizcedeki adı içindeki mavi İznik çinilerinden gelir.',
    ),
    [
      loc(
        'Sedefkâr Mehmed Ağa, a student of Sinan, built it facing Hagia Sophia across the old Hippodrome. More than twenty thousand hand-made tiles line the upper walls.',
        'Sinan’ın öğrencisi Sedefkâr Mehmed Ağa onu eski Hipodrom’un karşısına, Ayasofya’ya bakacak şekilde yaptı. Üst duvarları yirmi binden fazla el yapımı çini kaplar.',
      ),
    ],
    [built('1609–1616'), by('Sedefkâr Mehmed Ağa')],
  ),
  history(
    'istanbul',
    'kapalicarsi',
    loc('Grand Bazaar', 'Kapalıçarşı'),
    'Fatih',
    [41.0107, 28.9681],
    loc(
      'One of the oldest covered markets in the world: carpets, gold, lamps and leather under painted vaults.',
      'Dünyanın en eski kapalı çarşılarından biri: boyalı kemerler altında halı, altın, lamba ve deri.',
    ),
    [
      loc(
        'It grew around two domed halls built under Mehmed II in the 1450s and 60s, and today is a small city of streets, inns and thousands of shops.',
        '1450 ve 60’larda II. Mehmed döneminde yapılan iki kubbeli bedesten çevresinde büyüdü; bugün sokakları, hanları ve binlerce dükkânıyla küçük bir şehir.',
      ),
    ],
    [built('from the 1450s', '1450’lerden itibaren')],
    loc('It is closed on Sundays.', 'Pazar günleri kapalıdır.'),
  ),
  history(
    'istanbul',
    'misir-carsisi',
    loc('Spice Bazaar', 'Mısır Çarşısı'),
    'Fatih',
    [41.0166, 28.9706],
    loc(
      'The L-shaped bazaar of spices, dried fruit, lokum and coffee beside the New Mosque.',
      'Yeni Cami’nin yanında baharat, kuruyemiş, lokum ve kahve kokan L biçimli çarşı.',
    ),
    [
      loc(
        'Completed in 1664 as part of the New Mosque complex, it was paid for by the rent of its shops. The name comes from the goods that once arrived from Egypt.',
        '1664’te Yeni Cami külliyesinin parçası olarak tamamlandı ve dükkân kiraları caminin giderlerini karşıladı. Adını bir zamanlar Mısır’dan gelen mallardan alır.',
      ),
    ],
    [built('1664')],
  ),
  history(
    'istanbul',
    'dolmabahce',
    loc('Dolmabahçe Palace', 'Dolmabahçe Sarayı'),
    'Beşiktaş',
    [41.0391, 29.0003],
    loc(
      'The European-style palace on the Bosphorus that replaced Topkapı in the 1850s.',
      '1850’lerde Topkapı’nın yerini alan, Boğaz kıyısındaki Avrupa üslubunda saray.',
    ),
    [
      loc(
        'Built for Abdülmecid I by the Balyan family of architects, it mixes Ottoman and European styles. Atatürk died here on 10 November 1938; the clocks in his room are stopped at 9:05.',
        'Balyan ailesinden mimarlar tarafından I. Abdülmecid için yapıldı; Osmanlı ve Avrupa üsluplarını birleştirir. Atatürk 10 Kasım 1938’de burada öldü; odasındaki saatler 9.05’i gösterir.',
      ),
    ],
    [built('1843–1856'), by('Balyan family', 'Balyan ailesi')],
  ),
  history(
    'istanbul',
    'rumeli-hisari',
    loc('Rumeli Fortress', 'Rumeli Hisarı'),
    'Sarıyer',
    [41.0848, 29.0567],
    loc(
      'The fortress Mehmed II raised in a few months in 1452 to close the Bosphorus.',
      'II. Mehmed’in 1452’de Boğaz’ı kapatmak için birkaç ayda yükselttiği hisar.',
    ),
    [
      loc(
        'Built at the narrowest point of the strait, facing the older Anadolu Fortress across the water, a year before the conquest.',
        'Boğaz’ın en dar yerine, karşı kıyıdaki Anadolu Hisarı’nın tam karşısına, fetihten bir yıl önce yapıldı.',
      ),
    ],
    [built('1452'), by('Mehmed II', 'II. Mehmed')],
  ),
  history(
    'istanbul',
    'kiz-kulesi',
    loc('Maiden’s Tower', 'Kız Kulesi'),
    'Üsküdar',
    [41.0211, 29.0041],
    loc(
      'A small tower on its own islet off Üsküdar, with legends as old as the city.',
      'Üsküdar açığında kendi adacığında duran, şehir kadar eski efsaneleri olan küçük kule.',
    ),
    [
      loc(
        'There has been a tower here since antiquity. The building you see was largely rebuilt in the Ottoman period and reopened in 2023 after a long restoration. Boats run from Üsküdar and Karaköy.',
        'Burada antik çağdan beri bir kule var. Bugün gördüğünüz yapı büyük ölçüde Osmanlı döneminde yeniden inşa edildi ve uzun bir restorasyonun ardından 2023’te yeniden açıldı. Üsküdar ve Karaköy’den tekne kalkar.',
      ),
    ],
    [{ label: loc('Reopened', 'Yeniden açılış'), value: loc('2023', '2023') }],
    loc(
      'Watch the sunset from the Üsküdar shore opposite.',
      'Gün batımını karşıdaki Üsküdar sahilinden izleyin.',
    ),
  ),
  history(
    'edirne',
    'selimiye',
    loc('Selimiye Mosque', 'Selimiye Camii'),
    'Selimiye',
    [41.6779, 26.5594],
    loc(
      'Mimar Sinan’s masterwork, a single great dome on eight piers, and a UNESCO World Heritage Site.',
      'Mimar Sinan’ın ustalık eseri; sekiz ayağa oturan tek büyük kubbe ve UNESCO Dünya Mirası.',
    ),
    [
      loc(
        'Sinan was around eighty when he finished the mosque for Selim II in 1575. The dome seems to hang over one open space, and four slender minarets, each with three balconies, rise more than seventy metres at the corners.',
        'Sinan camiyi II. Selim için 1575’te bitirdiğinde seksen yaşlarındaydı. Kubbe tek bir açık mekânın üstünde asılı gibi durur; köşelerde her biri üç şerefeli dört ince minare yetmiş metreyi aşar.',
      ),
      loc(
        'The complex also includes the arasta of shops, a medrese that is now the Turkish and Islamic Arts Museum, and a school of Hadith.',
        'Külliyede arasta, bugün Türk ve İslam Eserleri Müzesi olan medrese ve darülhadis de var.',
      ),
    ],
    [
      built('1568–1575'),
      by('Mimar Sinan'),
      { label: loc('UNESCO', 'UNESCO'), value: loc('2011', '2011') },
    ],
    loc(
      'Look for the upside-down tulip carved on one of the marble columns of the müezzin’s platform.',
      'Müezzin mahfilinin mermer sütunlarından birindeki ters laleyi arayın.',
    ),
    true,
  ),
  history(
    'edirne',
    'eski-cami',
    loc('Old Mosque', 'Eski Cami'),
    'Merkez',
    [41.677, 26.5553],
    loc(
      'The oldest of Edirne’s great mosques, nine domes and walls of giant calligraphy.',
      'Edirne’nin büyük camilerinin en eskisi; dokuz kubbe ve dev hat yazılarıyla kaplı duvarlar.',
    ),
    [
      loc(
        'Begun under Emir Süleyman in 1403 and finished by Mehmed I in 1414, it is a square hall of nine domes. Some of the letters painted on its walls are taller than a person.',
        '1403’te Emir Süleyman döneminde başlanan ve 1414’te I. Mehmed döneminde tamamlanan cami, dokuz kubbeli kare bir salondur. Duvarlarındaki bazı harfler insan boyundan uzundur.',
      ),
    ],
    [built('1403–1414')],
    undefined,
    true,
  ),
  history(
    'edirne',
    'uc-serefeli',
    loc('Üç Şerefeli Mosque', 'Üç Şerefeli Camii'),
    'Merkez',
    [41.6785, 26.554],
    loc(
      'Named for the minaret with three balconies, and a milestone on the way to the classical Ottoman dome.',
      'Adını üç şerefeli minaresinden alır; klasik Osmanlı kubbesine giden yolda bir dönüm noktası.',
    ),
    [
      loc(
        'Built for Murad II between 1438 and 1447, it was the first Ottoman mosque with a wide central dome and an arcaded courtyard. Each of its four minarets is different.',
        'II. Murad için 1438–1447 arasında yapılan cami, geniş merkezi kubbesi ve revaklı avlusu olan ilk Osmanlı camisidir. Dört minaresinin her biri farklıdır.',
      ),
    ],
    [built('1438–1447'), by('Murad II', 'II. Murad')],
  ),
  history(
    'edirne',
    'bayezid-kulliyesi',
    loc('Sultan Bayezid II Complex Health Museum', 'Sultan II. Bayezid Külliyesi Sağlık Müzesi'),
    'Yeniimaret',
    [41.6893, 26.5436],
    loc(
      'A 15th-century hospital by the Tunca where patients were treated with music, water and scent.',
      'Tunca kıyısında, hastaların müzik, su sesi ve kokularla tedavi edildiği 15. yüzyıl şifahanesi.',
    ),
    [
      loc(
        'Architect Hayreddin built the complex for Bayezid II between 1484 and 1488: a mosque, a medical school, a soup kitchen and the darüşşifa. Its hexagonal hall, with a fountain beneath the dome, is where musicians played for the patients.',
        'Mimar Hayreddin külliyeyi II. Bayezid için 1484–1488 arasında yaptı: cami, tıp medresesi, imaret ve darüşşifa. Kubbesinin altında bir çeşme olan altıgen salonda musikişinaslar hastalar için çalardı.',
      ),
      loc(
        'Today it is Trakya University’s Health Museum, which won the Council of Europe Museum Prize in 2004.',
        'Bugün Trakya Üniversitesi’nin Sağlık Müzesi; 2004’te Avrupa Konseyi Müze Ödülü’nü kazandı.',
      ),
    ],
    [built('1484–1488'), by('Mimar Hayreddin')],
    undefined,
    true,
  ),
  history(
    'edirne',
    'meric-koprusu',
    loc('Meriç Bridge', 'Meriç Köprüsü'),
    'Karaağaç',
    [41.6585, 26.5485],
    loc(
      'The long stone bridge of the 1840s over the Meriç, and the city’s sunset spot.',
      '1840’larda Meriç üzerine yapılan uzun taş köprü; şehrin gün batımı noktası.',
    ),
    [
      loc(
        'Built in the reign of Abdülmecid I, it carries the road from the city to Karaağaç. A small kiosk in the middle looks down the river.',
        'I. Abdülmecid döneminde yapılan köprü, şehirden Karaağaç’a giden yolu taşır. Ortadaki küçük köşk nehre bakar.',
      ),
    ],
    [built('1840s', '1840’lar'), by('Abdülmecid I', 'I. Abdülmecid')],
    loc(
      'Come half an hour before sunset and have tea by the river.',
      'Gün batımından yarım saat önce gelin, nehir kenarında çay için.',
    ),
  ),
  history(
    'edirne',
    'karaagac',
    loc('Karaağaç & the Lausanne Monument', 'Karaağaç ve Lozan Anıtı'),
    'Karaağaç',
    [41.6515, 26.532],
    loc(
      'The old railway station, now a university building, and the monument to the Treaty of Lausanne.',
      'Bugün üniversite binası olan eski gar ve Lozan Antlaşması’nın anıtı.',
    ),
    [
      loc(
        'Karaağaç, across the Meriç, was the station of the old Orient railway line. It became part of Türkiye under the 1923 Treaty of Lausanne. The station building is Trakya University’s rectorate today, with the Lausanne Monument and museum in front of it.',
        'Meriç’in karşısındaki Karaağaç, eski Şark Demiryolu hattının istasyonuydu ve 1923 Lozan Antlaşması ile Türkiye’ye katıldı. Gar binası bugün Trakya Üniversitesi rektörlüğü; önünde Lozan Anıtı ve müzesi var.',
      ),
    ],
    [{ label: loc('Treaty', 'Antlaşma'), value: loc('Lausanne, 1923', 'Lozan, 1923') }],
  ),
  history(
    'edirne',
    'ali-pasa-carsisi',
    loc('Ali Paşa Bazaar', 'Ali Paşa Çarşısı'),
    'Merkez',
    [41.6755, 26.5547],
    loc(
      'Sinan’s long covered bazaar with red-and-white arches, for fruit soap, lace and souvenirs.',
      'Sinan’ın kırmızı beyaz kemerli uzun kapalı çarşısı; meyve sabunu, dantel ve hediyelik.',
    ),
    [
      loc(
        'Mimar Sinan built it in 1569 for the grand vizier Semiz Ali Paşa. Shops line both sides of a single vaulted street with gates at each end.',
        'Mimar Sinan onu 1569’da sadrazam Semiz Ali Paşa için yaptı. Dükkânlar, iki ucunda kapısı olan tek bir tonozlu sokağın iki yanına dizilir.',
      ),
    ],
    [built('1569'), by('Mimar Sinan')],
  ),
  history(
    'edirne',
    'makedon-kulesi',
    loc('Macedonian Tower', 'Makedon Kulesi'),
    'Kaleiçi',
    [41.6746, 26.5533],
    loc(
      'A tower of the Roman walls, with the excavated remains of the old city around it.',
      'Roma surlarından kalma bir kule; çevresinde antik şehrin kazı kalıntıları.',
    ),
    [
      loc(
        'It is one of the few surviving parts of the walls of Hadrianopolis. After restoration it opened with an open-air display of the finds around its base.',
        'Hadrianopolis surlarının ayakta kalan az sayıdaki parçasından biri. Restorasyonun ardından dibindeki buluntuların açık hava sergisiyle ziyarete açıldı.',
      ),
    ],
    [built('Roman period', 'Roma dönemi')],
  ),
  history(
    'edirne',
    'adalet-kasri',
    loc('Justice Pavilion at Sarayiçi', 'Sarayiçi Adalet Kasrı'),
    'Sarayiçi',
    [41.6893, 26.5567],
    loc(
      'The stone tower that survives from the vanished Edirne Palace, beside the Kırkpınar arena.',
      'Yok olan Edirne Sarayı’ndan geriye kalan taş kule; Kırkpınar arenasının yanında.',
    ),
    [
      loc(
        'Edirne Palace was begun under Murad II and was one of the largest Ottoman palaces. Most of it was destroyed in the war of 1877–78. The Justice Pavilion of 1561 still stands on the meadow by the Tunca.',
        'Edirne Sarayı II. Murad döneminde başlandı ve en büyük Osmanlı saraylarından biriydi. Büyük bölümü 1877–78 savaşında yok oldu. 1561 tarihli Adalet Kasrı hâlâ Tunca kıyısındaki çayırda duruyor.',
      ),
    ],
    [built('1561')],
  ),
]

const dish = (
  city: CityId,
  id: string,
  name: Loc,
  summary: Loc,
  body: Loc[],
  tip?: Loc,
  featured = false,
): Place => ({
  id,
  city,
  category: 'food',
  name,
  summary,
  body,
  tip,
  district: '',
  kind: 'real',
  featured,
})

const dishes: Place[] = [
  dish(
    'istanbul',
    'balik-ekmek',
    loc('Balık ekmek', 'Balık ekmek'),
    loc(
      'Grilled mackerel in bread by the water at Eminönü.',
      'Eminönü’nde deniz kenarında ekmek arası ızgara uskumru.',
    ),
    [
      loc(
        'A fillet of fish, grilled and tucked into half a loaf with onion and lettuce, with a squeeze of lemon. Drink the pickle juice (turşu suyu) sold beside it.',
        'Izgarada pişen balık, soğan ve marulla yarım ekmeğin arasına konur, üstüne limon sıkılır. Yanında satılan turşu suyuyla için.',
      ),
    ],
    undefined,
    true,
  ),
  dish(
    'istanbul',
    'simit',
    loc('Simit', 'Simit'),
    loc('The sesame ring of every İstanbul morning.', 'Her İstanbul sabahının susamlı halkası.'),
    [
      loc(
        'Dipped in grape molasses and sesame, then baked until crisp. Street sellers carry them on trays; eat one with tea and a slice of white cheese.',
        'Pekmeze ve susama bulanıp çıtır olana kadar pişirilir. Seyyar satıcılar tablada taşır; çay ve bir dilim beyaz peynirle yiyin.',
      ),
    ],
    undefined,
    true,
  ),
  dish(
    'istanbul',
    'midye-dolma',
    loc('Midye dolma', 'Midye dolma'),
    loc(
      'Mussels stuffed with spiced rice, eaten standing, one after another.',
      'Baharatlı pilavla doldurulmuş midye; ayakta, arka arkaya yenir.',
    ),
    [
      loc(
        'Rice with pine nuts, currants and spices is cooked inside the shell. Sellers open them for you and hand over the lemon.',
        'Çam fıstıklı, kuş üzümlü, baharatlı pilav kabuğun içinde pişer. Satıcı açar, limonu uzatır.',
      ),
    ],
  ),
  dish(
    'istanbul',
    'kokorec',
    loc('Kokoreç', 'Kokoreç'),
    loc(
      'Spiced lamb intestines grilled on a spit and chopped into bread.',
      'Şişte pişen, doğranıp ekmeğe konan baharatlı kuzu bağırsağı.',
    ),
    [
      loc(
        'Wrapped around a long skewer and turned over charcoal, then chopped with tomatoes, peppers, oregano and chilli flakes. A late-night favourite.',
        'Uzun bir şişe sarılıp kömür ateşinde çevrilir, sonra domates, biber, kekik ve pul biberle doğranır. Gece yarısının gözdesi.',
      ),
    ],
  ),
  dish(
    'istanbul',
    'meze',
    loc('Meyhane mezes', 'Meyhane mezeleri'),
    loc(
      'Small plates for a long evening: the heart of the meyhane.',
      'Uzun bir akşamın küçük tabakları: meyhanenin kalbi.',
    ),
    [
      loc(
        'White cheese and melon, haydari, fava, stuffed vine leaves, lakerda and fried calamari arrive a few at a time, with rakı and a lot of conversation.',
        'Beyaz peynir ve kavun, haydari, fava, yaprak sarma, lakerda ve kalamar birkaç tabak halinde gelir; yanında rakı ve bol sohbet.',
      ),
    ],
    loc(
      'Beyoğlu, Kumkapı and Kadıköy are the meyhane districts.',
      'Meyhane semtleri Beyoğlu, Kumkapı ve Kadıköy’dür.',
    ),
    true,
  ),
  dish(
    'istanbul',
    'baklava',
    loc('Baklava', 'Baklava'),
    loc('Paper-thin pastry, pistachio and syrup.', 'İncecik yufka, fıstık ve şerbet.'),
    [
      loc(
        'Dozens of layers of hand-rolled pastry with butter and pistachios, baked and soaked in syrup. Try it with a scoop of kaymak.',
        'El açması onlarca kat yufka, tereyağı ve fıstıkla pişer, şerbetle buluşur. Bir kaşık kaymakla deneyin.',
      ),
    ],
  ),
  dish(
    'istanbul',
    'kumpir',
    loc('Kumpir', 'Kumpir'),
    loc(
      'A giant baked potato loaded with toppings, by the mosque at Ortaköy.',
      'Ortaköy Camii’nin yanında, istediğiniz her şeyle doldurulan dev fırın patates.',
    ),
    [
      loc(
        'The potato is mashed in its skin with butter and cheese, then piled with corn, olives, pickles, sausage and salads of your choice.',
        'Patates kabuğunun içinde tereyağı ve kaşarla ezilir, üstüne mısır, zeytin, turşu, sosis ve seçtiğiniz salatalar yığılır.',
      ),
    ],
  ),
  dish(
    'edirne',
    'tava-ciger',
    loc('Edirne tava ciğeri', 'Edirne tava ciğeri'),
    loc(
      'Paper-thin fried calf’s liver with crisp dried red peppers: the dish of Edirne.',
      'İncecik kızartılmış dana ciğeri ve çıtır kuru kırmızı biber: Edirne’nin yemeği.',
    ),
    [
      loc(
        'The liver is cleaned, chilled and cut very thin, dusted with flour and fried in hot oil for moments. It comes with fried dried peppers, sliced onion, tomato and a glass of ayran.',
        'Ciğer temizlenip soğutulur, çok ince kesilir, una bulanıp kızgın yağda birkaç saniye kızartılır. Yanında kızarmış kuru biber, soğan, domates ve bir bardak ayranla gelir.',
      ),
    ],
    loc('Crumble a fried pepper over each bite.', 'Her lokmaya bir parça kızarmış biber ufalayın.'),
    true,
  ),
  dish(
    'edirne',
    'badem-ezmesi',
    loc('Badem ezmesi', 'Badem ezmesi'),
    loc(
      'Edirne’s white almond paste, soft and not too sweet.',
      'Edirne’nin yumuşacık, çok tatlı olmayan beyaz badem ezmesi.',
    ),
    [
      loc(
        'Blanched almonds are ground with sugar into a smooth paste. It is the classic edible souvenir from Edirne.',
        'Kabuğu soyulmuş bademler şekerle ezilerek pürüzsüz bir hamur olur. Edirne’den getirilen klasik hediyedir.',
      ),
    ],
    undefined,
    true,
  ),
  dish(
    'edirne',
    'deva-i-misk',
    loc('Deva-i misk', 'Deva-i misk'),
    loc(
      'A spiced almond sweet with an old Ottoman name.',
      'Osmanlıca adıyla baharatlı bir badem tatlısı.',
    ),
    [
      loc(
        'A small, firm sweet of almonds, sugar and a mix of spices. Its name means “musk remedy”, and it is sold beside badem ezmesi in the city’s sweet shops.',
        'Badem, şeker ve baharat karışımından yapılan küçük, sert bir tatlı. Adı “misk devası” demektir; şehrin tatlıcılarında badem ezmesinin yanında satılır.',
      ),
    ],
  ),
  dish(
    'edirne',
    'peynir-helvasi',
    loc('Peynir helvası', 'Peynir helvası'),
    loc('A warm halva made with unsalted cheese.', 'Tuzsuz peynirle yapılan sıcak helva.'),
    [
      loc(
        'Fresh unsalted cheese is cooked slowly with flour, butter and sugar until it turns golden. Eat it warm.',
        'Tuzsuz taze peynir un, tereyağı ve şekerle altın rengini alana kadar ağır ağır pişirilir. Sıcak yenir.',
      ),
    ],
    undefined,
    true,
  ),
  dish(
    'edirne',
    'beyaz-peynir',
    loc('Edirne white cheese', 'Edirne beyaz peyniri'),
    loc(
      'The creamy brined cheese Thrace is known for.',
      'Trakya’nın meşhur kremsi salamura peyniri.',
    ),
    [
      loc(
        'Made from sheep’s and cow’s milk and ripened in brine, it has a registered geographical indication. Find it at breakfast and in the city’s cheese shops.',
        'Koyun ve inek sütünden yapılıp salamurada olgunlaşır; coğrafi işaretlidir. Kahvaltıda ve şehrin peynircilerinde bulursunuz.',
      ),
    ],
  ),
]

const custom = (
  city: CityId,
  id: string,
  name: Loc,
  summary: Loc,
  body: Loc[],
  district: string,
  position?: [number, number],
  facts?: Fact[],
  featured = false,
): Place => ({
  id,
  city,
  category: 'culture',
  name,
  summary,
  body,
  district,
  position,
  facts,
  kind: 'real',
  featured,
})

const unesco = (en: string, tr: string): Fact => ({
  label: loc('UNESCO', 'UNESCO'),
  value: loc(en, tr),
})

const customs: Place[] = [
  custom(
    'istanbul',
    'vapur',
    loc('The Bosphorus ferries', 'Boğaz vapurları'),
    loc(
      'The city’s best tour costs a transit fare: a ferry between Europe and Asia.',
      'Şehrin en iyi turu bir toplu taşıma bileti: Avrupa ile Asya arasında vapur.',
    ),
    [
      loc(
        'Commuter ferries cross from Eminönü, Karaköy and Beşiktaş to Kadıköy and Üsküdar all day. Buy tea and a simit on board, and throw nothing to the gulls that follow.',
        'Eminönü, Karaköy ve Beşiktaş’tan Kadıköy ve Üsküdar’a gün boyu vapur kalkar. Gemide çay ve simit alın; peşinizden gelen martılarla paylaşmak da gelenektir.',
      ),
    ],
    'Eminönü',
    [41.0172, 28.9744],
    undefined,
    true,
  ),
  custom(
    'istanbul',
    'turk-kahvesi',
    loc('Turkish coffee', 'Türk kahvesi'),
    loc('Brewed in a cezve, served with water and lokum.', 'Cezvede pişer, su ve lokumla gelir.'),
    [
      loc(
        'Finely ground coffee is brewed slowly with water and sugar to taste, and the foam is the mark of a good cup. Turkish coffee culture and tradition is on UNESCO’s list of intangible heritage.',
        'İnce çekilmiş kahve, istenen şekerle suyla ağır ağır pişirilir; köpüğü iyi kahvenin işaretidir. Türk kahvesi kültürü ve geleneği UNESCO Somut Olmayan Kültürel Miras listesindedir.',
      ),
    ],
    '',
    undefined,
    [unesco('Intangible heritage, 2013', 'Somut olmayan miras, 2013')],
  ),
  custom(
    'istanbul',
    'hamam',
    loc('The hamam', 'Hamam'),
    loc(
      'Steam, a warm marble slab and a scrub: the Ottoman bath.',
      'Buhar, sıcak göbek taşı ve kese: Osmanlı hamamı.',
    ),
    [
      loc(
        'Historic hamams, several of them by Sinan, still work in the old city. Lie on the heated central stone, then a tellak scrubs you with a kese and washes you with foam.',
        'Aralarında Sinan’ın yaptıkları da olan tarihi hamamlar eski şehirde hâlâ çalışır. Isıtılmış göbek taşına uzanırsınız; tellak kese yapar ve köpükle yıkar.',
      ),
    ],
    '',
  ),
  custom(
    'istanbul',
    'ebru',
    loc('Ebru (paper marbling)', 'Ebru'),
    loc(
      'Paint floated on water and lifted onto paper.',
      'Suyun üstünde yüzdürülen boyanın kâğıda alınması.',
    ),
    [
      loc(
        'Colours are sprinkled onto thickened water, drawn into patterns and flowers with a needle, then printed onto a single sheet. Workshops in the old city let you try it.',
        'Boyalar kıvamlı suyun üstüne serpilir, iğneyle desen ve çiçeklere dönüştürülür, sonra tek bir kâğıda alınır. Tarihi yarımadadaki atölyelerde deneyebilirsiniz.',
      ),
    ],
    '',
    undefined,
    [unesco('Intangible heritage, 2014', 'Somut olmayan miras, 2014')],
  ),
  custom(
    'istanbul',
    'cay-bahcesi',
    loc('Tea gardens', 'Çay bahçeleri'),
    loc(
      'Tulip glasses of tea, backgammon and a view of the water.',
      'İnce belli bardakta çay, tavla ve deniz manzarası.',
    ),
    [
      loc(
        'From Emirgan and Çamlıca to the shore at Üsküdar, tea gardens are where the city sits down. Order a samovar for the table and stay for hours.',
        'Emirgan ve Çamlıca’dan Üsküdar sahiline, şehir çay bahçelerinde oturur. Masaya semaver isteyin ve saatlerce kalın.',
      ),
    ],
    '',
  ),
  custom(
    'istanbul',
    'bienal',
    loc('The İstanbul Biennial', 'İstanbul Bienali'),
    loc(
      'Contemporary art across the city, every two years.',
      'İki yılda bir, şehrin dört bir yanında çağdaş sanat.',
    ),
    [
      loc(
        'Organised by the İstanbul Foundation for Culture and Arts (İKSV) since 1987, the biennial fills historic buildings and new venues with contemporary art.',
        '1987’den beri İstanbul Kültür Sanat Vakfı (İKSV) tarafından düzenlenen bienal, tarihi yapıları ve yeni mekânları çağdaş sanatla doldurur.',
      ),
    ],
    '',
  ),
  custom(
    'edirne',
    'kirkpinar',
    loc('Kırkpınar oil wrestling', 'Kırkpınar Yağlı Güreşleri'),
    loc(
      'Wrestlers in leather trousers, covered in olive oil, on the meadow at Sarayiçi every summer.',
      'Her yaz Sarayiçi çayırında zeytinyağına bulanmış, kıspetli pehlivanlar.',
    ),
    [
      loc(
        'Held every year in late June or early July, Kırkpınar is counted among the oldest sports competitions still held. Hundreds of wrestlers compete over three days, and the winner of the top class becomes başpehlivan and takes the golden belt.',
        'Her yıl haziran sonu ya da temmuz başında düzenlenen Kırkpınar, hâlâ yapılan en eski spor organizasyonlarından sayılır. Yüzlerce pehlivan üç gün boyunca güreşir; baş altında kazanan başpehlivan olur ve altın kemeri alır.',
      ),
    ],
    'Sarayiçi',
    [41.6905, 26.5583],
    [
      unesco('Intangible heritage, 2010', 'Somut olmayan miras, 2010'),
      { label: loc('When', 'Ne zaman'), value: loc('Every summer', 'Her yaz') },
    ],
    true,
  ),
  custom(
    'edirne',
    'kakava',
    loc('Kakava and Hıdrellez', 'Kakava ve Hıdrellez'),
    loc(
      'Bonfires, music and wishes for spring on the night of 5 to 6 May.',
      '5’i 6 Mayıs’a bağlayan gece ateşler, müzik ve bahar dilekleri.',
    ),
    [
      loc(
        'Edirne’s Roma community celebrates Kakava with music and dancing, and at dawn people jump over fires and tie their wishes to the branches of trees by the river. Hıdrellez, the spring celebration, is on UNESCO’s intangible heritage list.',
        'Edirne’nin Roman toplumu Kakava’yı müzik ve dansla kutlar; şafakta ateşin üstünden atlanır, dilekler nehir kıyısındaki ağaçların dallarına bağlanır. Bahar bayramı Hıdrellez UNESCO Somut Olmayan Kültürel Miras listesindedir.',
      ),
    ],
    'Sarayiçi',
    undefined,
    [
      unesco('Intangible heritage, 2017', 'Somut olmayan miras, 2017'),
      { label: loc('When', 'Ne zaman'), value: loc('5–6 May', '5–6 Mayıs') },
    ],
    true,
  ),
  custom(
    'edirne',
    'meyve-sabunu',
    loc('Edirne fruit soap', 'Edirne meyve sabunu'),
    loc(
      'Scented soaps shaped and painted like fruit, an Ottoman craft.',
      'Meyve biçiminde yapılıp boyanan kokulu sabunlar; bir Osmanlı zanaatı.',
    ),
    [
      loc(
        'Soap is shaped by hand into apples, pears, figs and strawberries, painted and scented. Once a palace gift, it is now the city’s best-loved souvenir.',
        'Sabun elle elma, armut, incir ve çilek biçiminde şekillendirilir, boyanır ve kokulandırılır. Bir zamanlar saray hediyesiydi; bugün şehrin en sevilen hatırası.',
      ),
    ],
    '',
  ),
  custom(
    'edirne',
    'edirnekari',
    loc('Edirnekâri', 'Edirnekâri'),
    loc(
      'Painted and lacquered woodwork covered in flowers, named after the city.',
      'Adını şehirden alan, çiçeklerle bezeli boyalı ve laklı ahşap işçiliği.',
    ),
    [
      loc(
        'Chests, cupboards, doors and bookstands are painted with flowers, fruit bowls and landscapes, then lacquered. You can see examples in the city’s museums and mosques.',
        'Sandık, dolap, kapı ve rahleler çiçek, meyve kâsesi ve manzaralarla boyanır, sonra laklanır. Örneklerini şehrin müze ve camilerinde görebilirsiniz.',
      ),
    ],
    '',
  ),
]

const demo = (
  city: CityId,
  category: 'restaurant' | 'business' | 'stay',
  id: string,
  name: string,
  type: Loc,
  district: string,
  position: [number, number],
  summary: Loc,
  extra: Partial<Place> & Pick<Place, 'rating' | 'reviews' | 'price' | 'hours'>,
): Place => ({
  id,
  city,
  category,
  name: loc(name, name),
  type,
  district,
  position,
  summary,
  body: [],
  kind: 'demo',
  ...extra,
})

const daily = (from: string, to: string) => loc(`Every day ${from}–${to}`, `Her gün ${from}–${to}`)
const exceptMonday = (from: string, to: string) =>
  loc(`Tue–Sun ${from}–${to}`, `Salı–Pazar ${from}–${to}`)

const businesses: Place[] = [
  demo(
    'istanbul',
    'restaurant',
    'lodos-meyhane',
    'Lodos Meyhane',
    loc('Meyhane', 'Meyhane'),
    'Beyoğlu',
    [41.0336, 28.9785],
    loc(
      'Thirty cold mezes on the tray and fish of the day, in a narrow street off İstiklal.',
      'Tepside otuz soğuk meze ve günün balığı; İstiklal’in ara sokağında.',
    ),
    {
      rating: 4.7,
      reviews: 1284,
      price: 3,
      hours: daily('17:00', '01:00'),
      dishes: ['meze'],
      featured: true,
    },
  ),
  demo(
    'istanbul',
    'restaurant',
    'mavi-kayik',
    'Mavi Kayık Balık',
    loc('Fish sandwiches', 'Balık ekmek'),
    'Eminönü',
    [41.0178, 28.9713],
    loc(
      'Balık ekmek grilled on the boat and handed over the rail.',
      'Teknede pişip küpeşteden uzatılan balık ekmek.',
    ),
    {
      rating: 4.4,
      reviews: 3120,
      price: 1,
      hours: daily('10:00', '22:00'),
      dishes: ['balik-ekmek'],
    },
  ),
  demo(
    'istanbul',
    'restaurant',
    'sabah-firini',
    'Sabah Fırını',
    loc('Bakery & breakfast', 'Fırın ve kahvaltı'),
    'Kadıköy',
    [40.9905, 29.0253],
    loc(
      'Simit straight from the oven and a breakfast plate in the market street.',
      'Fırından yeni çıkmış simit ve çarşı sokağında kahvaltı tabağı.',
    ),
    { rating: 4.6, reviews: 842, price: 1, hours: daily('06:30', '14:00'), dishes: ['simit'] },
  ),
  demo(
    'istanbul',
    'restaurant',
    'midyeci-ruzgar',
    'Midyeci Rüzgâr',
    loc('Street food', 'Sokak lezzeti'),
    'Beşiktaş',
    [41.0428, 29.0071],
    loc(
      'Stuffed mussels by the dozen on the Beşiktaş waterfront.',
      'Beşiktaş sahilinde düzinelerle midye dolma.',
    ),
    {
      rating: 4.5,
      reviews: 1610,
      price: 1,
      hours: daily('16:00', '03:00'),
      dishes: ['midye-dolma'],
    },
  ),
  demo(
    'istanbul',
    'restaurant',
    'gece-kokorec',
    'Gece Kokoreç',
    loc('Late-night grill', 'Gece mekânı'),
    'Beyoğlu',
    [41.0361, 28.9834],
    loc(
      'Kokoreç over charcoal until the early hours.',
      'Sabaha karşıya kadar kömür ateşinde kokoreç.',
    ),
    { rating: 4.3, reviews: 975, price: 1, hours: daily('19:00', '05:00'), dishes: ['kokorec'] },
  ),
  demo(
    'istanbul',
    'restaurant',
    'fistik-ustasi',
    'Fıstık Ustası',
    loc('Baklava & desserts', 'Baklava ve tatlı'),
    'Karaköy',
    [41.0228, 28.9776],
    loc(
      'Pistachio baklava with kaymak and a view of the Golden Horn.',
      'Kaymaklı fıstıklı baklava ve Haliç manzarası.',
    ),
    {
      rating: 4.8,
      reviews: 2210,
      price: 2,
      hours: daily('08:00', '23:00'),
      dishes: ['baklava'],
      featured: true,
    },
  ),
  demo(
    'istanbul',
    'restaurant',
    'patates-duragi',
    'Patates Durağı',
    loc('Kumpir', 'Kumpir'),
    'Ortaköy',
    [41.0474, 29.0268],
    loc(
      'Kumpir with twenty toppings beside the Ortaköy pier.',
      'Ortaköy iskelesinin yanında yirmi çeşit malzemeyle kumpir.',
    ),
    { rating: 4.2, reviews: 690, price: 1, hours: daily('11:00', '00:00'), dishes: ['kumpir'] },
  ),
  demo(
    'istanbul',
    'restaurant',
    'uc-kapi',
    'Üç Kapı Ev Yemekleri',
    loc('Home cooking', 'Ev yemekleri'),
    'Balat',
    [41.0297, 28.9489],
    loc(
      'Stews, pilaf and stuffed vegetables from the day’s trays.',
      'Günün tepsilerinden sulu yemek, pilav ve dolma.',
    ),
    { rating: 4.6, reviews: 512, price: 2, hours: exceptMonday('11:30', '17:00') },
  ),
  demo(
    'istanbul',
    'business',
    'pera-bakir',
    'Pera Bakır Atölyesi',
    loc('Copper workshop', 'Bakır atölyesi'),
    'Beyoğlu',
    [41.0303, 28.9751],
    loc(
      'Hand-hammered copper cezves and trays, made in the back room.',
      'Arka odada elde dövülen bakır cezve ve tepsiler.',
    ),
    { rating: 4.9, reviews: 214, price: 2, hours: exceptMonday('10:00', '19:00') },
  ),
  demo(
    'istanbul',
    'business',
    'moda-plak',
    'Moda Plak',
    loc('Record shop', 'Plakçı'),
    'Kadıköy',
    [40.9868, 29.0271],
    loc(
      'Turkish psych and Anatolian rock on vinyl, and a listening corner.',
      'Plakta Anadolu rock ve Türk psikedelik; bir de dinleme köşesi.',
    ),
    { rating: 4.7, reviews: 388, price: 2, hours: daily('12:00', '21:00') },
  ),
  demo(
    'istanbul',
    'business',
    'su-ustu-ebru',
    'Su Üstü Ebru Atölyesi',
    loc('Marbling classes', 'Ebru atölyesi'),
    'Fatih',
    [41.0092, 28.9722],
    loc(
      'One-hour ebru lessons in small groups; take your sheets home.',
      'Küçük gruplarla bir saatlik ebru dersi; kâğıtlarınızı götürürsünüz.',
    ),
    { rating: 4.8, reviews: 460, price: 2, hours: exceptMonday('10:00', '18:00'), featured: true },
  ),
  demo(
    'istanbul',
    'business',
    'yunus-tekne',
    'Yunus Tekne Turları',
    loc('Boat tours', 'Tekne turu'),
    'Beşiktaş',
    [41.0411, 29.0052],
    loc(
      'Two-hour Bosphorus cruises at sunset on a wooden boat.',
      'Ahşap teknede gün batımında iki saatlik Boğaz turu.',
    ),
    { rating: 4.5, reviews: 1030, price: 3, hours: daily('10:00', '21:00') },
  ),
  demo(
    'istanbul',
    'stay',
    'sur-kapi',
    'Hotel Sur Kapı',
    loc('Boutique hotel', 'Butik otel'),
    'Sultanahmet',
    [41.0065, 28.9745],
    loc(
      'Sixteen rooms in a restored wooden house, a roof terrace facing the sea.',
      'Restore edilmiş ahşap evde on altı oda; denize bakan çatı terası.',
    ),
    {
      rating: 4.8,
      reviews: 620,
      price: 3,
      hours: loc('Check-in from 14:00', 'Giriş 14:00’ten itibaren'),
      featured: true,
    },
  ),
  demo(
    'istanbul',
    'stay',
    'galata-kiremit',
    'Galata Kiremit Suites',
    loc('Apartments', 'Apart'),
    'Beyoğlu',
    [41.0262, 28.9727],
    loc(
      'Serviced flats with kitchens, a minute from the tower.',
      'Kuleye bir dakika, mutfaklı hizmetli daireler.',
    ),
    {
      rating: 4.5,
      reviews: 410,
      price: 3,
      hours: loc('Check-in from 15:00', 'Giriş 15:00’ten itibaren'),
    },
  ),
  demo(
    'istanbul',
    'stay',
    'moda-pansiyon',
    'Moda Bahçe Pansiyon',
    loc('Guesthouse', 'Pansiyon'),
    'Kadıköy',
    [40.9848, 29.0292],
    loc(
      'A family guesthouse with a garden, near the Moda seafront.',
      'Moda sahiline yakın, bahçeli aile pansiyonu.',
    ),
    {
      rating: 4.6,
      reviews: 298,
      price: 2,
      hours: loc('Check-in from 13:00', 'Giriş 13:00’ten itibaren'),
    },
  ),
  demo(
    'edirne',
    'restaurant',
    'tunca-ciger',
    'Tunca Ciğer Salonu',
    loc('Tava ciğer', 'Tava ciğer'),
    'Merkez',
    [41.6763, 26.5568],
    loc(
      'Tava ciğer fried to order, with a mountain of crisp peppers.',
      'Siparişle kızaran tava ciğer ve bir tepe çıtır biber.',
    ),
    {
      rating: 4.8,
      reviews: 2840,
      price: 2,
      hours: daily('10:30', '21:00'),
      dishes: ['tava-ciger'],
      featured: true,
    },
  ),
  demo(
    'edirne',
    'restaurant',
    'kaleici-tava',
    'Kaleiçi Tava Evi',
    loc('Tava ciğer', 'Tava ciğer'),
    'Kaleiçi',
    [41.6741, 26.5545],
    loc(
      'A small tava ciğer house in the old town, three tables and a queue.',
      'Eski şehirde küçük bir ciğerci; üç masa ve bir kuyruk.',
    ),
    {
      rating: 4.6,
      reviews: 1320,
      price: 1,
      hours: exceptMonday('11:00', '20:00'),
      dishes: ['tava-ciger'],
    },
  ),
  demo(
    'edirne',
    'restaurant',
    'arasta-tatlicisi',
    'Arasta Tatlıcısı',
    loc('Sweet shop', 'Tatlıcı'),
    'Selimiye',
    [41.6772, 26.5578],
    loc(
      'Badem ezmesi, deva-i misk and warm peynir helvası below Selimiye.',
      'Selimiye’nin altında badem ezmesi, deva-i misk ve sıcak peynir helvası.',
    ),
    {
      rating: 4.7,
      reviews: 980,
      price: 1,
      hours: daily('08:00', '22:00'),
      dishes: ['badem-ezmesi', 'deva-i-misk', 'peynir-helvasi'],
      featured: true,
    },
  ),
  demo(
    'edirne',
    'restaurant',
    'meric-kiyisi',
    'Meriç Kıyısı',
    loc('Riverside restaurant', 'Nehir kenarı'),
    'Karaağaç',
    [41.6572, 26.5467],
    loc(
      'Grilled fish and mezes on a terrace over the Meriç, with the bridge in view.',
      'Meriç’e bakan terasta ızgara balık ve meze, karşıda köprü.',
    ),
    {
      rating: 4.4,
      reviews: 760,
      price: 3,
      hours: daily('12:00', '00:00'),
      dishes: ['beyaz-peynir'],
    },
  ),
  demo(
    'edirne',
    'restaurant',
    'sarayici-cay',
    'Sarayiçi Çay Bahçesi',
    loc('Tea garden', 'Çay bahçesi'),
    'Sarayiçi',
    [41.6885, 26.5548],
    loc(
      'Tea and gözleme under the plane trees by the Tunca.',
      'Tunca kıyısında çınarların altında çay ve gözleme.',
    ),
    { rating: 4.3, reviews: 540, price: 1, hours: daily('08:00', '23:00') },
  ),
  demo(
    'edirne',
    'restaurant',
    'kaleici-kahvalti',
    'Taş Avlu Kahvaltı',
    loc('Breakfast', 'Kahvaltı'),
    'Kaleiçi',
    [41.6736, 26.5561],
    loc(
      'A long Thracian breakfast with Edirne white cheese in a stone courtyard.',
      'Taş avluda Edirne beyaz peynirli uzun bir Trakya kahvaltısı.',
    ),
    {
      rating: 4.6,
      reviews: 430,
      price: 2,
      hours: daily('08:00', '15:00'),
      dishes: ['beyaz-peynir'],
    },
  ),
  demo(
    'edirne',
    'business',
    'ayva-sabun',
    'Ayva Sabun Evi',
    loc('Fruit soap workshop', 'Meyve sabunu atölyesi'),
    'Merkez',
    [41.6758, 26.5551],
    loc(
      'Fruit soaps made and painted in front of you; short classes at weekends.',
      'Gözünüzün önünde yapılıp boyanan meyve sabunları; hafta sonu kısa dersler.',
    ),
    { rating: 4.9, reviews: 305, price: 1, hours: daily('09:30', '19:30'), featured: true },
  ),
  demo(
    'edirne',
    'business',
    'nakis-atolyesi',
    'Lale Nakış Atölyesi',
    loc('Edirnekâri studio', 'Edirnekâri atölyesi'),
    'Kaleiçi',
    [41.6751, 26.5526],
    loc(
      'Painted boxes and trays in the Edirnekâri style, and a small workshop.',
      'Edirnekâri üslubunda boyalı kutu ve tepsiler, küçük bir atölye.',
    ),
    { rating: 4.8, reviews: 122, price: 2, hours: exceptMonday('10:00', '18:00') },
  ),
  demo(
    'edirne',
    'business',
    'tunca-pedal',
    'Tunca Pedal',
    loc('Bike hire', 'Bisiklet kiralama'),
    'Merkez',
    [41.6788, 26.5519],
    loc(
      'City bikes by the hour for the ride to Karaağaç and the Bayezid complex.',
      'Karaağaç ve Bayezid Külliyesi turu için saatlik şehir bisikleti.',
    ),
    { rating: 4.5, reviews: 188, price: 1, hours: daily('09:00', '19:00') },
  ),
  demo(
    'edirne',
    'business',
    'beyaz-tepsi',
    'Beyaz Tepsi Peynircilik',
    loc('Cheese shop', 'Peynirci'),
    'Merkez',
    [41.6766, 26.5536],
    loc(
      'Edirne white cheese, kaşar and butter, vacuum-packed for the road.',
      'Edirne beyaz peyniri, kaşar ve tereyağı; yol için vakumlu paket.',
    ),
    { rating: 4.7, reviews: 356, price: 2, hours: daily('08:30', '20:00') },
  ),
  demo(
    'edirne',
    'stay',
    'tas-konak',
    'Kaleiçi Taş Konak',
    loc('Boutique hotel', 'Butik otel'),
    'Kaleiçi',
    [41.6743, 26.5539],
    loc(
      'A restored stone mansion with eleven rooms and a courtyard.',
      'Restore edilmiş taş konakta on bir oda ve bir avlu.',
    ),
    {
      rating: 4.8,
      reviews: 390,
      price: 3,
      hours: loc('Check-in from 14:00', 'Giriş 14:00’ten itibaren'),
      featured: true,
    },
  ),
  demo(
    'edirne',
    'stay',
    'selimiye-manzara',
    'Manzara Otel Edirne',
    loc('Hotel', 'Otel'),
    'Merkez',
    [41.6792, 26.5608],
    loc(
      'Rooms facing Selimiye’s minarets, five minutes’ walk from everything.',
      'Selimiye minarelerine bakan odalar; her yere beş dakika yürüme.',
    ),
    {
      rating: 4.4,
      reviews: 610,
      price: 2,
      hours: loc('Check-in from 14:00', 'Giriş 14:00’ten itibaren'),
    },
  ),
  demo(
    'edirne',
    'stay',
    'karaagac-bahce',
    'Karaağaç Bahçe Evi',
    loc('Guesthouse', 'Pansiyon'),
    'Karaağaç',
    [41.6531, 26.5351],
    loc(
      'A quiet guesthouse with a garden, across the river from the centre.',
      'Merkeze nehrin karşısından bakan, bahçeli sakin bir pansiyon.',
    ),
    {
      rating: 4.6,
      reviews: 144,
      price: 2,
      hours: loc('Check-in from 13:00', 'Giriş 13:00’ten itibaren'),
    },
  ),
]

export const places: Place[] = [...landmarks, ...dishes, ...customs, ...businesses]

const event = (
  city: CityId,
  id: string,
  category: EventCategory,
  date: string,
  time: string,
  price: number,
  district: string,
  venue: Loc,
  title: Loc,
  text: Loc,
  end?: string,
): CityEvent => ({ id, city, category, date, end, time, price, district, venue, title, text })

export const cityEvents: CityEvent[] = [
  event(
    'istanbul',
    'bogaz-sonbahar',
    'music',
    '2026-10-03',
    '19:30',
    0,
    'Beşiktaş',
    loc('Waterfront stage', 'Sahil sahnesi'),
    loc('Autumn Concert by the Bosphorus', 'Boğaz’da Sonbahar Konseri'),
    loc(
      'A string orchestra plays film music as the sun goes down over the water.',
      'Güneş denize inerken bir yaylı orkestra film müzikleri çalıyor.',
    ),
  ),
  event(
    'istanbul',
    'balat-foto',
    'tour',
    '2026-10-10',
    '10:00',
    350,
    'Balat',
    loc('Meeting point: Fener pier', 'Buluşma: Fener iskelesi'),
    loc('Balat Photo Walk', 'Balat Fotoğraf Yürüyüşü'),
    loc(
      'Three hours through the colourful streets of Balat and Fener with a photographer.',
      'Bir fotoğrafçıyla Balat ve Fener’in renkli sokaklarında üç saat.',
    ),
  ),
  event(
    'istanbul',
    'kadikoy-sokak',
    'food',
    '2026-10-17',
    '12:00',
    0,
    'Kadıköy',
    loc('Kadıköy market streets', 'Kadıköy çarşı sokakları'),
    loc('Kadıköy Street Food Days', 'Kadıköy Sokak Lezzetleri Günleri'),
    loc(
      'Forty stalls of midye, kokoreç, pickles and desserts over a weekend.',
      'Bir hafta sonu boyunca midye, kokoreç, turşu ve tatlılardan kırk tezgâh.',
    ),
    '2026-10-18',
  ),
  event(
    'istanbul',
    'genc-tasarim',
    'art',
    '2026-10-24',
    '11:00',
    0,
    'Karaköy',
    loc('Old warehouse, Karaköy', 'Eski antrepo, Karaköy'),
    loc('Young Designers’ Market', 'Genç Tasarımcılar Pazarı'),
    loc(
      'Ceramics, prints and jewellery from sixty independent designers.',
      'Altmış bağımsız tasarımcıdan seramik, baskı ve takı.',
    ),
    '2026-10-25',
  ),
  event(
    'istanbul',
    'halic-kosu',
    'sport',
    '2026-11-07',
    '08:30',
    450,
    'Eyüpsultan',
    loc('Golden Horn shore path', 'Haliç sahil yolu'),
    loc('Golden Horn 10K', 'Haliç 10K'),
    loc(
      'A flat morning run along the Golden Horn, with a 3K route for families.',
      'Haliç boyunca düz bir sabah koşusu; aileler için 3K parkur.',
    ),
  ),
  event(
    'istanbul',
    'meyhane-soylesi',
    'food',
    '2026-11-14',
    '19:00',
    250,
    'Beyoğlu',
    loc('Pera library hall', 'Pera kütüphane salonu'),
    loc('A Night on Meyhane Culture', 'Meyhane Kültürü Söyleşisi'),
    loc(
      'A food writer and a meyhane owner on mezes, manners and the old songs.',
      'Bir yemek yazarı ve bir meyhaneci; mezeler, adap ve eski şarkılar üzerine.',
    ),
  ),
  event(
    'istanbul',
    'cocuk-ebru',
    'family',
    '2026-11-21',
    '14:00',
    200,
    'Fatih',
    loc('Su Üstü Ebru Atölyesi', 'Su Üstü Ebru Atölyesi'),
    loc('Ebru for Children', 'Çocuklar İçin Ebru'),
    loc(
      'A one-hour marbling class for ages 6 to 12; every child takes home two sheets.',
      '6–12 yaş için bir saatlik ebru dersi; her çocuk iki kâğıt götürüyor.',
    ),
  ),
  event(
    'istanbul',
    'kis-caz',
    'music',
    '2026-12-05',
    '21:00',
    600,
    'Beyoğlu',
    loc('Basement club, Asmalımescit', 'Bodrum kulüp, Asmalımescit'),
    loc('Winter Jazz Nights', 'Kış Caz Geceleri'),
    loc(
      'A quartet from Kadıköy plays standards and Anatolian tunes.',
      'Kadıköy’den bir dörtlü standartlar ve Anadolu ezgileri çalıyor.',
    ),
    '2026-12-06',
  ),
  event(
    'istanbul',
    'yilbasi-pazari',
    'family',
    '2026-12-12',
    '11:00',
    0,
    'Kadıköy',
    loc('Moda seafront park', 'Moda sahil parkı'),
    loc('Handmade Gift Market', 'El Yapımı Hediye Pazarı'),
    loc(
      'Candles, knits and illustrations for the new year, with mulled apple juice.',
      'Yeni yıl için mum, örgü ve illüstrasyonlar; yanında sıcak elma suyu.',
    ),
    '2026-12-13',
  ),
  event(
    'istanbul',
    'isik-yuruyusu',
    'tour',
    '2026-12-19',
    '18:00',
    300,
    'Sultanahmet',
    loc('Meeting point: the German Fountain', 'Buluşma: Alman Çeşmesi'),
    loc('Evening Walk on the Historic Peninsula', 'Tarihi Yarımada’da Akşam Yürüyüşü'),
    loc(
      'Two hours around the Hippodrome and the lit-up mosques with a guide.',
      'Rehberle Hipodrom ve ışıklandırılmış camiler çevresinde iki saat.',
    ),
  ),
  event(
    'edirne',
    'selimiye-turu',
    'tour',
    '2026-10-04',
    '10:30',
    250,
    'Selimiye',
    loc('Meeting point: Selimiye courtyard', 'Buluşma: Selimiye avlusu'),
    loc('Reading Selimiye: an Architecture Walk', 'Selimiye’yi Okumak: Mimari Yürüyüş'),
    loc(
      'An architect shows how Sinan’s dome stands, from the courtyard to the arasta.',
      'Bir mimar, avludan arastaya Sinan’ın kubbesinin nasıl ayakta durduğunu anlatıyor.',
    ),
  ),
  event(
    'edirne',
    'ciger-ustalari',
    'food',
    '2026-10-11',
    '12:00',
    0,
    'Merkez',
    loc('Hürriyet Square', 'Hürriyet Meydanı'),
    loc('Tava Ciğer Masters’ Day', 'Tava Ciğer Ustaları Buluşması'),
    loc(
      'Live frying, tastings and a talk on how to slice the liver thin enough.',
      'Canlı kızartma, tadım ve ciğerin ne kadar ince kesilmesi gerektiği üzerine bir sohbet.',
    ),
  ),
  event(
    'edirne',
    'kopru-gunbatimi',
    'music',
    '2026-10-18',
    '17:30',
    0,
    'Karaağaç',
    loc('Meriç riverbank', 'Meriç kıyısı'),
    loc('Sunset Concert at the Meriç Bridge', 'Meriç Köprüsü’nde Gün Batımı Konseri'),
    loc(
      'Clarinet and violin on the riverbank as the light goes.',
      'Işık kararırken nehir kıyısında klarnet ve keman.',
    ),
  ),
  event(
    'edirne',
    'sabun-atolyesi',
    'family',
    '2026-10-25',
    '14:00',
    180,
    'Merkez',
    loc('Ayva Sabun Evi', 'Ayva Sabun Evi'),
    loc('Make Your Own Fruit Soap', 'Kendi Meyve Sabununu Yap'),
    loc(
      'Shape and paint two fruit soaps; for ages 7 and up.',
      'İki meyve sabunu şekillendirip boyayın; 7 yaş ve üzeri için.',
    ),
  ),
  event(
    'edirne',
    'bag-rotasi',
    'tour',
    '2026-11-08',
    '09:00',
    950,
    'Merkez',
    loc('Departure: Selimiye car park', 'Kalkış: Selimiye otoparkı'),
    loc('Thracian Vineyard Day Trip', 'Trakya Bağ Rotası Günübirlik Tur'),
    loc(
      'A minibus day to two family vineyards, with lunch and a tasting.',
      'İki aile bağına minibüsle günübirlik gezi; öğle yemeği ve tadım dahil.',
    ),
  ),
  event(
    'edirne',
    'karaagac-bisiklet',
    'sport',
    '2026-11-15',
    '10:00',
    0,
    'Karaağaç',
    loc('Start: Meriç Bridge', 'Başlangıç: Meriç Köprüsü'),
    loc('Karaağaç Bike Ride', 'Karaağaç Bisiklet Turu'),
    loc(
      'An easy 18 km ride along the rivers to the Lausanne Monument and back.',
      'Nehirler boyunca Lozan Anıtı’na gidip dönen kolay bir 18 km tur.',
    ),
  ),
  event(
    'edirne',
    'edirnekari-sergi',
    'art',
    '2026-11-28',
    '10:00',
    0,
    'Kaleiçi',
    loc('Kaleiçi culture house', 'Kaleiçi kültür evi'),
    loc('Edirnekâri: Painted Wood', 'Edirnekâri: Boyalı Ahşap'),
    loc(
      'Chests and panels from private collections, and new work by young artists.',
      'Özel koleksiyonlardan sandık ve panolar, genç sanatçıların yeni işleri.',
    ),
    '2026-12-06',
  ),
  event(
    'edirne',
    'balkan-gecesi',
    'music',
    '2026-12-05',
    '20:30',
    400,
    'Merkez',
    loc('Old cinema hall', 'Eski sinema salonu'),
    loc('Balkan Music Night', 'Balkan Müzikleri Gecesi'),
    loc(
      'Brass and clarinet from both sides of the border.',
      'Sınırın iki yakasından nefesli ve klarnet.',
    ),
  ),
  event(
    'edirne',
    'kis-kitap',
    'family',
    '2026-12-19',
    '11:00',
    0,
    'Merkez',
    loc('City library', 'Şehir kütüphanesi'),
    loc('Winter Book Days', 'Kış Kitap Günleri'),
    loc(
      'Readings for children, a used-book swap and hot salep.',
      'Çocuklar için okuma saatleri, ikinci el kitap takası ve sıcak salep.',
    ),
    '2026-12-20',
  ),
]

export const cityRoot = (standalone: boolean) => (standalone ? '/preview/city' : '/showcases/city')
export const cityPath = (standalone: boolean, city: CityId) => `${cityRoot(standalone)}/${city}`
export const cityExplorePath = (standalone: boolean, city: CityId, query = '') =>
  `${cityPath(standalone, city)}/explore${query ? `?${query}` : ''}`
export const cityPlacePath = (standalone: boolean, city: CityId, id: string) =>
  `${cityPath(standalone, city)}/places/${id}`
export const cityEventsPath = (standalone: boolean, city: CityId) =>
  `${cityPath(standalone, city)}/events`

export const isCityId = (value: string | undefined): value is CityId =>
  CITY_IDS.includes(value as CityId)

export const placeById = (city: CityId, id: string | undefined) =>
  places.find((place) => place.city === city && place.id === id)

export const placesIn = (city: CityId) => places.filter((place) => place.city === city)

export const eventsIn = (city: CityId) => cityEvents.filter((item) => item.city === city)

/** The restaurants of a city that are known for a dish. */
export const servedAt = (dishId: string) => places.filter((place) => place.dishes?.includes(dishId))
