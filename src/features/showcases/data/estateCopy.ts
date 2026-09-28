import { placeLabel, roomsLabel } from '@/features/showcases/data/estate'
import type {
  City,
  Deal,
  Feature,
  Heating,
  Highlight,
  Listing,
  Neighbourhood,
  PhotoKind,
  PropertyType,
} from '@/features/showcases/data/estate'
import type {
  AmenityFilter,
  CompareRow,
  FloorOption,
  SortOption,
} from '@/features/showcases/data/estateSearch'

const plural = (count: number, one: string, many: string) => `${count} ${count === 1 ? one : many}`

const listEn = (items: string[]) =>
  items.length <= 1
    ? (items[0] ?? '')
    : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`
const listTr = (items: string[]) =>
  items.length <= 1
    ? (items[0] ?? '')
    : `${items.slice(0, -1).join(', ')} ve ${items[items.length - 1]}`

const en = {
  brand: 'Mesken',
  tagline: 'Homes in İstanbul, İzmir and Ankara',
  photoCredit: 'Photography: Unsplash',
  footerNote: 'A demo agency. Every listing is generated; none of these homes is for sale or rent.',
  footerColumns: { cities: 'Cities', services: 'Services', contact: 'Contact' },
  services: ['Buying', 'Renting', 'Free valuation', 'Mortgage advice'],
  office: 'Bağdat Caddesi 214, Kadıköy, İstanbul',
  nav: {
    listings: 'Homes',
    neighbourhoods: 'Neighbourhoods',
    mortgage: 'Mortgage',
    agents: 'Agents',
    compare: 'Compare',
  },
  frame: {
    home: {
      title: 'Real estate: home',
      description: 'A property search with price pins on a map, a mortgage calculator and compare.',
    },
    listings: {
      title: 'Real estate: search',
      description: 'Filters in the address, a list beside a map, favourites and compare.',
    },
    listing: {
      title: 'Real estate: listing',
      description: 'Gallery, facts, location, mortgage calculator, price history and contact.',
    },
    compare: {
      title: 'Real estate: compare',
      description: 'Up to three homes side by side, with the best value in each row marked.',
    },
  },

  deals: { sale: 'Buy', rent: 'Rent' } satisfies Record<Deal, string>,
  dealTag: { sale: 'For sale', rent: 'For rent' } satisfies Record<Deal, string>,
  cities: { istanbul: 'İstanbul', izmir: 'İzmir', ankara: 'Ankara' } satisfies Record<City, string>,
  types: {
    apartment: 'Apartment',
    residence: 'Residence',
    villa: 'Villa',
    detached: 'Detached house',
  } satisfies Record<PropertyType, string>,
  typeNoun: {
    apartment: 'apartment',
    residence: 'residence flat',
    villa: 'villa',
    detached: 'detached house',
  } satisfies Record<PropertyType, string>,
  highlights: {
    seaView: 'Sea-view',
    newBuild: 'Brand-new',
    furnished: 'Furnished',
    garden: 'Leafy',
    pool: 'Resort-style',
    renovated: 'Renovated',
    bright: 'Bright',
    spacious: 'Spacious',
    quiet: 'Quiet',
  } satisfies Record<Highlight, string>,
  features: {
    balcony: 'Balcony',
    parking: 'Parking',
    elevator: 'Lift',
    pool: 'Pool',
    security: '24h security',
    gym: 'Gym',
    seaView: 'Sea view',
    garden: 'Garden',
    storage: 'Storage room',
    smartHome: 'Smart home',
    fireplace: 'Fireplace',
    playground: 'Playground',
  } satisfies Record<Feature, string>,
  heating: {
    combi: 'Combi boiler',
    central: 'Central heating',
    underfloor: 'Underfloor heating',
  } satisfies Record<Heating, string>,
  photoKinds: {
    exterior: 'Building',
    living: 'Living room',
    kitchen: 'Kitchen',
    bedroom: 'Bedroom',
    bathroom: 'Bathroom',
  } satisfies Record<PhotoKind, string>,

  title: (listing: Listing, hood: Neighbourhood) =>
    `${en.highlights[listing.highlight]} ${roomsLabel(listing)} ${en.typeNoun[listing.type]} in ${hood.name}`,
  floor: (listing: Listing) =>
    listing.type === 'villa' || listing.type === 'detached'
      ? `${listing.totalFloors} storeys`
      : listing.floor === -1
        ? 'Garden floor'
        : listing.floor === 0
          ? 'Ground floor'
          : `Floor ${listing.floor} of ${listing.totalFloors}`,
  floorShort: (listing: Listing) =>
    listing.type === 'villa' || listing.type === 'detached'
      ? `${listing.totalFloors} storeys`
      : listing.floor === -1
        ? 'Garden floor'
        : listing.floor === 0
          ? 'Ground floor'
          : `Floor ${listing.floor}/${listing.totalFloors}`,
  age: (years: number) => (years === 0 ? 'New build' : plural(years, 'year', 'years')),
  rooms: (listing: Listing) =>
    listing.bedrooms === 0
      ? 'Studio'
      : `${plural(listing.bedrooms, 'bedroom', 'bedrooms')}, ${plural(listing.livingRooms, 'living room', 'living rooms')}`,
  listedAgo: (days: number) =>
    days === 0 ? 'Listed today' : days === 1 ? 'Listed yesterday' : `Listed ${days} days ago`,
  daysAgo: (days: number) => (days === 0 ? 'Today' : days === 1 ? 'Yesterday' : `${days} days ago`),
  perMonth: '/ month',
  perM2: (value: string) => `${value} / m²`,
  description: (listing: Listing, hood: Neighbourhood, features: string[]) => {
    const house = listing.type === 'villa' || listing.type === 'detached'
    const lines = [
      `This ${en.typeNoun[listing.type]} in ${placeLabel(hood)} has ${
        listing.bedrooms === 0
          ? 'one open-plan room'
          : plural(listing.bedrooms, 'bedroom', 'bedrooms')
      } across ${listing.grossArea} m² (${listing.netArea} m² net)${
        house
          ? `, over ${listing.totalFloors} storeys`
          : listing.floor > 0
            ? `, on floor ${listing.floor} of ${listing.totalFloors}`
            : ', at garden level'
      }.`,
      `${listing.buildingAge === 0 ? 'The building is brand new' : `The building is ${listing.buildingAge} years old`} and the home is heated by ${en.heating[listing.heating].toLowerCase()}.${
        features.length
          ? ` It comes with ${listEn(features.map((item) => item.toLowerCase()))}.`
          : ''
      }`,
      listing.deal === 'rent'
        ? `It is let ${listing.furnished ? 'furnished' : 'unfurnished'}, with a deposit of two months' rent, for a minimum of one year.`
        : listing.creditEligible
          ? 'The title deed is ready and the home qualifies for a mortgage.'
          : 'The seller would prefer a cash buyer.',
    ]
    return lines
  },

  home: {
    eyebrow: (count: number) => `${count} homes, three cities, one map`,
    title: 'Find the home that fits the way you live.',
    lead: 'Search homes to buy or rent across İstanbul, İzmir and Ankara, see them on the map, and work out the mortgage before you call.',
    stats: {
      listings: 'homes listed',
      neighbourhoods: 'neighbourhoods',
      agents: 'local agents',
    },
    featuredTitle: 'Featured homes',
    featuredLead: 'Picked by our agents this week, two in every city.',
    viewAll: 'See every home',
    hoodsTitle: 'Neighbourhoods people ask about',
    hoodsLead: 'The average asking price per m² for a flat, and how many homes are listed now.',
    hoodHomes: (count: number) => plural(count, 'home', 'homes'),
    mortgageTitle: 'What could you borrow?',
    mortgageLead:
      'Tell us the monthly payment you are comfortable with. We work out the price it buys, with the down payment and the term you choose.',
    budget: 'Monthly budget',
    budgetBuys: 'buys a home up to',
    browseAffordable: 'Show homes in my budget',
    agentsTitle: 'Agents who know the street',
    agentsLead:
      'Every listing has one agent who has been inside it, answers the phone and speaks your language.',
    reviews: (count: number) => plural(count, 'review', 'reviews'),
    yearsExperience: (years: number) => `${years} years with Mesken`,
    valuationTitle: 'Selling or letting?',
    valuationLead:
      'Get a free valuation from an agent who has sold in your building. No obligation, an answer within two working days.',
    valuationCta: 'Book a valuation',
  },

  search: {
    location: 'Location',
    locationPlaceholder: 'City, district or neighbourhood',
    type: 'Property type',
    anyType: 'Any type',
    maxPrice: 'Max price',
    anyPrice: 'No limit',
    submit: 'Search',
  },

  filters: {
    title: 'Filters',
    moreFilters: 'More filters',
    clearAll: 'Clear all',
    showResults: (count: number) => `Show ${plural(count, 'home', 'homes')}`,
    city: 'City',
    anyCity: 'All cities',
    type: 'Property type',
    rooms: 'Rooms',
    price: 'Price',
    min: 'Min',
    max: 'Max',
    area: 'Size (m²)',
    floor: 'Floor',
    anyFloor: 'Any floor',
    floors: {
      ground: 'Ground or garden floor',
      middle: 'Not the top or ground floor',
      high: 'Floor 6 or higher',
      notGround: 'Not the ground floor',
    } satisfies Record<FloorOption, string>,
    age: 'Building age',
    anyAge: 'Any age',
    ages: (years: number) => (years === 0 ? 'New build' : `Up to ${years} years`),
    dues: 'Max monthly dues',
    amenities: 'Must have',
    amenity: {
      furnished: 'Furnished',
      parking: 'Parking',
      balcony: 'Balcony',
    } satisfies Record<AmenityFilter, string>,
    saved: 'Saved homes only',
    area_: 'Map area',
    removeArea: 'Remove map area',
    neighbourhood: 'Neighbourhood',
    anyHood: 'Any neighbourhood',
  },

  sort: {
    label: 'Sort',
    options: {
      recommended: 'Recommended',
      newest: 'Newest',
      priceAsc: 'Lowest price',
      priceDesc: 'Highest price',
      pricePerM2: 'Lowest price per m²',
      areaDesc: 'Largest',
    } satisfies Record<SortOption, string>,
  },

  results: {
    count: (count: number, deal: Deal) =>
      `${plural(count, 'home', 'homes')} ${deal === 'sale' ? 'for sale' : 'to rent'}`,
    inArea: 'in the map area',
    emptyTitle: 'No homes match these filters',
    emptySaved: 'You have not saved any homes yet. Tap the heart on a listing to keep it here.',
    emptyHint: 'Try a wider price range, fewer rooms or another neighbourhood.',
    showMap: 'Map',
    showList: 'List',
    mapTitle: 'Homes on the map',
    saved: (count: number) => `Saved (${count})`,
  },

  card: {
    save: 'Save',
    unsave: 'Remove from saved',
    saveLabel: (title: string) => `Save ${title}`,
    unsaveLabel: (title: string) => `Remove ${title} from saved`,
    compare: 'Compare',
    new: 'New',
    drop: (pct: number) => `Price down ${pct}%`,
    featured: 'Featured',
    photos: (count: number) => plural(count, 'photo', 'photos'),
  },

  map: {
    searchArea: 'Search this area',
    homesHere: (count: number) => `${plural(count, 'home', 'homes')} here, zoom in`,
    view: 'View home',
    approximate: 'Approximate location. The exact address is shared when you book a viewing.',
    loading: 'Loading map…',
  },

  compareTray: {
    title: (count: number) => `Comparing ${count} of 3`,
    open: 'Compare',
    clear: 'Clear',
    remove: (title: string) => `Remove ${title} from compare`,
    full: 'You can compare up to three homes. Remove one first.',
    added: 'Added to compare',
    removed: 'Removed from compare',
    saved: 'Saved. Find it under “Saved”.',
    unsaved: 'Removed from saved homes',
  },

  listing: {
    breadcrumbHome: 'Home',
    notFound: 'This home is no longer listed',
    notFoundLead: 'It may have been sold or let. Similar homes are still on the map.',
    backToSearch: 'Back to search',
    allPhotos: (count: number) => `All ${count} photos`,
    share: 'Share',
    linkCopied: 'Link copied',
    copyFailed: 'Copy the address from the browser bar instead.',
    listingNo: 'Listing no.',
    facts: 'Key facts',
    rooms: 'Rooms',
    gross: 'Gross area',
    net: 'Net area',
    floor: 'Floor',
    age: 'Building age',
    heating: 'Heating',
    furnished: 'Furnished',
    dues: 'Monthly dues',
    listed: 'Listed',
    deposit: 'Deposit',
    credit: 'Mortgage',
    creditYes: 'Eligible',
    creditNo: 'Cash only',
    yes: 'Yes',
    no: 'No',
    noDues: 'None',
    about: 'About this home',
    featuresTitle: 'Features',
    locationTitle: 'Location',
    nearby: {
      transit: (minutes: number) => `${minutes} min walk to public transport`,
      school: 'Nearest school',
      hospital: 'Nearest hospital',
      market: 'Nearest grocery',
    },
    historyTitle: 'Price history',
    historyListed: 'Listed',
    historyChange: 'Price changed',
    historyNow: 'Current price',
    similarTitle: 'Similar homes',
    moveInTitle: 'What moving in costs',
    moveIn: {
      firstRent: 'First month’s rent',
      deposit: 'Deposit (2 months)',
      agencyFee: 'Agency fee (1 month + VAT)',
      total: 'Due at signing',
    },
  },

  mortgage: {
    title: 'Mortgage calculator',
    lead: 'A fixed-rate housing loan, paid in equal monthly instalments.',
    price: 'Home price',
    downPayment: 'Down payment',
    term: 'Term',
    months: (months: number) =>
      months % 12 === 0 ? plural(months / 12, 'year', 'years') : plural(months, 'month', 'months'),
    rate: 'Monthly interest',
    rateHint: (annual: string) => `About ${annual}% a year`,
    monthly: 'Monthly payment',
    loan: 'Loan amount',
    totalInterest: 'Total interest',
    totalPaid: 'Total repaid',
    principalShare: 'Principal',
    interestShare: 'Interest',
    incomeHint: (income: string) =>
      `Banks usually want the instalment to be under half your income: about ${income} a month.`,
    schedule: 'Year by year',
    year: 'Year',
    principal: 'Principal',
    interest: 'Interest',
    balance: 'Balance',
    disclaimer: 'An estimate. The rate you are offered depends on the bank and your income.',
  },

  contact: {
    title: 'Ask about this home',
    call: 'Call',
    name: 'Full name',
    nameRequired: 'Tell us your name.',
    phone: 'Phone',
    phoneRequired: 'We need a number to call you back.',
    phoneInvalid: 'Enter a phone number, e.g. 0532 555 12 34.',
    email: 'Email',
    emailInvalid: 'Enter a valid email address.',
    message: 'Message',
    messageDefault: (title: string, id: string) =>
      `Hello, I am interested in “${title}” (no. ${id}). Is it still available, and when could I see it?`,
    viewing: 'I would like to book a viewing',
    consent: 'The agent may contact me about this home.',
    consentRequired: 'Please agree so the agent can reply.',
    send: 'Send message',
    sentTitle: 'Message sent',
    sentBody: (agent: string) => `${agent} will get back to you within one working day.`,
    sendAnother: 'Send another',
    demo: 'Demo form: nothing is sent.',
  },

  compare: {
    title: 'Compare homes',
    lead: 'Up to three homes side by side. The best value in each row is highlighted.',
    emptyTitle: 'Nothing to compare yet',
    emptyLead: 'Tick “Compare” on up to three listings and they will line up here.',
    browse: 'Browse homes',
    copyLink: 'Copy link',
    clear: 'Clear',
    remove: 'Remove',
    best: 'Best',
    rows: {
      price: 'Price',
      pricePerM2: 'Price per m²',
      grossArea: 'Gross area',
      bedrooms: 'Bedrooms',
      buildingAge: 'Building age',
      dues: 'Monthly dues',
      features: 'Features',
    } satisfies Record<CompareRow, string>,
    location: 'Location',
    type: 'Type',
    floor: 'Floor',
    heating: 'Heating',
    view: 'View home',
    addMore: 'Add another home',
  },
}

type EstateCopy = typeof en

const tr: EstateCopy = {
  brand: 'Mesken',
  tagline: 'İstanbul, İzmir ve Ankara’da konut',
  photoCredit: 'Fotoğraflar: Unsplash',
  footerNote:
    'Demo emlak ofisi. İlanların hepsi üretilmiştir; bu evlerin hiçbiri satılık ya da kiralık değildir.',
  footerColumns: { cities: 'Şehirler', services: 'Hizmetler', contact: 'İletişim' },
  services: ['Satın alma', 'Kiralama', 'Ücretsiz değerleme', 'Kredi danışmanlığı'],
  office: 'Bağdat Caddesi 214, Kadıköy, İstanbul',
  nav: {
    listings: 'İlanlar',
    neighbourhoods: 'Semtler',
    mortgage: 'Konut kredisi',
    agents: 'Danışmanlar',
    compare: 'Karşılaştır',
  },
  frame: {
    home: {
      title: 'Emlak: ana sayfa',
      description:
        'Haritada fiyat pinleri, kredi hesaplayıcı ve karşılaştırmalı bir ilan arama sitesi.',
    },
    listings: {
      title: 'Emlak: arama',
      description:
        'Adreste tutulan filtreler, harita ile yan yana liste, favoriler ve karşılaştırma.',
    },
    listing: {
      title: 'Emlak: ilan detayı',
      description: 'Galeri, bilgiler, konum, kredi hesaplayıcı, fiyat geçmişi ve iletişim.',
    },
    compare: {
      title: 'Emlak: karşılaştırma',
      description: 'En fazla üç ev yan yana; her satırda en iyi değer işaretli.',
    },
  },

  deals: { sale: 'Satılık', rent: 'Kiralık' },
  dealTag: { sale: 'Satılık', rent: 'Kiralık' },
  cities: { istanbul: 'İstanbul', izmir: 'İzmir', ankara: 'Ankara' },
  types: {
    apartment: 'Daire',
    residence: 'Rezidans',
    villa: 'Villa',
    detached: 'Müstakil ev',
  },
  typeNoun: {
    apartment: 'daire',
    residence: 'rezidans dairesi',
    villa: 'villa',
    detached: 'müstakil ev',
  },
  highlights: {
    seaView: 'deniz manzaralı',
    newBuild: 'sıfır',
    furnished: 'eşyalı',
    garden: 'bahçeli',
    pool: 'havuzlu',
    renovated: 'yenilenmiş',
    bright: 'ferah',
    spacious: 'geniş',
    quiet: 'sakin',
  },
  features: {
    balcony: 'Balkon',
    parking: 'Otopark',
    elevator: 'Asansör',
    pool: 'Havuz',
    security: '7/24 güvenlik',
    gym: 'Spor salonu',
    seaView: 'Deniz manzarası',
    garden: 'Bahçe',
    storage: 'Depo',
    smartHome: 'Akıllı ev',
    fireplace: 'Şömine',
    playground: 'Çocuk parkı',
  },
  heating: {
    combi: 'Kombi (doğalgaz)',
    central: 'Merkezi sistem',
    underfloor: 'Yerden ısıtma',
  },
  photoKinds: {
    exterior: 'Bina',
    living: 'Salon',
    kitchen: 'Mutfak',
    bedroom: 'Yatak odası',
    bathroom: 'Banyo',
  },

  title: (listing, hood) =>
    `${hood.inTr} ${tr.highlights[listing.highlight]} ${roomsLabel(listing)} ${tr.typeNoun[listing.type]}`,
  floor: (listing) =>
    listing.type === 'villa' || listing.type === 'detached'
      ? `${listing.totalFloors} katlı`
      : listing.floor === -1
        ? 'Bahçe katı'
        : listing.floor === 0
          ? 'Giriş katı'
          : `${listing.totalFloors} katlı binanın ${listing.floor}. katı`,
  floorShort: (listing) =>
    listing.type === 'villa' || listing.type === 'detached'
      ? `${listing.totalFloors} katlı`
      : listing.floor === -1
        ? 'Bahçe katı'
        : listing.floor === 0
          ? 'Giriş katı'
          : `${listing.floor}/${listing.totalFloors}. kat`,
  age: (years) => (years === 0 ? 'Sıfır bina' : `${years} yıllık`),
  rooms: (listing) =>
    listing.bedrooms === 0
      ? 'Stüdyo (1+0)'
      : `${listing.bedrooms} oda, ${listing.livingRooms} salon`,
  listedAgo: (days) =>
    days === 0 ? 'Bugün yayınlandı' : days === 1 ? 'Dün yayınlandı' : `${days} gün önce yayınlandı`,
  daysAgo: (days) => (days === 0 ? 'Bugün' : days === 1 ? 'Dün' : `${days} gün önce`),
  perMonth: '/ ay',
  perM2: (value) => `${value} / m²`,
  description: (listing, hood, features) => {
    const house = listing.type === 'villa' || listing.type === 'detached'
    return [
      `${hood.name === hood.district ? '' : `${hood.district}, `}${hood.inTr}ki bu ${tr.typeNoun[listing.type]} ${listing.grossArea} m² brüt (${listing.netArea} m² net) alana ${
        listing.bedrooms === 0 ? 'açık planlı tek bir oda' : `${listing.bedrooms} yatak odası`
      } sığdırıyor${
        house
          ? ` ve ${listing.totalFloors} kattan oluşuyor`
          : listing.floor > 0
            ? `; ${listing.totalFloors} katlı binanın ${listing.floor}. katında`
            : '; bahçe seviyesinde'
      }.`,
      `${listing.buildingAge === 0 ? 'Bina sıfır' : `Bina ${listing.buildingAge} yıllık`}, ısınma ${tr.heating[listing.heating].toLocaleLowerCase('tr-TR')} ile sağlanıyor.${
        features.length
          ? ` ${listTr(features.map((item) => item.toLocaleLowerCase('tr-TR')))} mevcut.`
          : ''
      }`,
      listing.deal === 'rent'
        ? `${listing.furnished ? 'Eşyalı' : 'Eşyasız'} olarak, iki kira depozito ve en az bir yıllık sözleşmeyle kiraya veriliyor.`
        : listing.creditEligible
          ? 'Tapusu hazır, konut kredisine uygun.'
          : 'Mal sahibi peşin satışı tercih ediyor.',
    ]
  },

  home: {
    eyebrow: (count) => `${count} ev, üç şehir, tek harita`,
    title: 'Yaşam tarzınıza uyan evi bulun.',
    lead: 'İstanbul, İzmir ve Ankara’da satılık ve kiralık evleri arayın, haritada görün ve aramadan önce kredinizi hesaplayın.',
    stats: {
      listings: 'ilan',
      neighbourhoods: 'semt',
      agents: 'yerel danışman',
    },
    featuredTitle: 'Öne çıkan evler',
    featuredLead: 'Danışmanlarımızın bu hafta seçtikleri; her şehirden iki ev.',
    viewAll: 'Tüm ilanları gör',
    hoodsTitle: 'En çok sorulan semtler',
    hoodsLead: 'Bir dairenin ortalama m² fiyatı ve şu an ilandaki ev sayısı.',
    hoodHomes: (count) => `${count} ilan`,
    mortgageTitle: 'Ne kadar kredi çekebilirsiniz?',
    mortgageLead:
      'Rahatça ödeyebileceğiniz aylık taksiti yazın; seçtiğiniz peşinat ve vadeyle alabileceğiniz ev fiyatını hesaplayalım.',
    budget: 'Aylık bütçe',
    budgetBuys: 'ile alınabilecek en yüksek fiyat',
    browseAffordable: 'Bütçeme uyan evleri göster',
    agentsTitle: 'Sokağı bilen danışmanlar',
    agentsLead:
      'Her ilanın, evin içini görmüş, telefonu açan ve dilinizi konuşan bir danışmanı var.',
    reviews: (count) => `${count} değerlendirme`,
    yearsExperience: (years) => `${years} yıldır Mesken’de`,
    valuationTitle: 'Satmak ya da kiraya vermek mi istiyorsunuz?',
    valuationLead:
      'Binanızda satış yapmış bir danışmandan ücretsiz değerleme alın. Hiçbir yükümlülük yok, iki iş günü içinde yanıt.',
    valuationCta: 'Değerleme randevusu al',
  },

  search: {
    location: 'Konum',
    locationPlaceholder: 'Şehir, ilçe ya da semt',
    type: 'Emlak tipi',
    anyType: 'Tüm tipler',
    maxPrice: 'En yüksek fiyat',
    anyPrice: 'Sınır yok',
    submit: 'Ara',
  },

  filters: {
    title: 'Filtreler',
    moreFilters: 'Diğer filtreler',
    clearAll: 'Tümünü temizle',
    showResults: (count) => `${count} ilanı göster`,
    city: 'Şehir',
    anyCity: 'Tüm şehirler',
    type: 'Emlak tipi',
    rooms: 'Oda sayısı',
    price: 'Fiyat',
    min: 'En az',
    max: 'En çok',
    area: 'Büyüklük (m²)',
    floor: 'Kat',
    anyFloor: 'Tüm katlar',
    floors: {
      ground: 'Giriş ya da bahçe katı',
      middle: 'Ara kat',
      high: '6. kat ve üstü',
      notGround: 'Giriş katı hariç',
    },
    age: 'Bina yaşı',
    anyAge: 'Tümü',
    ages: (years) => (years === 0 ? 'Sıfır bina' : `En fazla ${years} yıllık`),
    dues: 'En fazla aidat',
    amenities: 'Olmazsa olmazlar',
    amenity: {
      furnished: 'Eşyalı',
      parking: 'Otopark',
      balcony: 'Balkon',
    },
    saved: 'Yalnızca kaydettiklerim',
    area_: 'Harita alanı',
    removeArea: 'Harita alanını kaldır',
    neighbourhood: 'Semt',
    anyHood: 'Tüm semtler',
  },

  sort: {
    label: 'Sırala',
    options: {
      recommended: 'Önerilen',
      newest: 'En yeni',
      priceAsc: 'En düşük fiyat',
      priceDesc: 'En yüksek fiyat',
      pricePerM2: 'En düşük m² fiyatı',
      areaDesc: 'En büyük',
    },
  },

  results: {
    count: (count, deal) => `${count} ${deal === 'sale' ? 'satılık' : 'kiralık'} ilan`,
    inArea: 'harita alanında',
    emptyTitle: 'Bu filtrelere uyan ilan yok',
    emptySaved: 'Henüz kaydettiğiniz bir ev yok. Bir ilandaki kalbe dokunun, burada saklansın.',
    emptyHint: 'Fiyat aralığını genişletin, oda sayısını azaltın ya da başka bir semt deneyin.',
    showMap: 'Harita',
    showList: 'Liste',
    mapTitle: 'Haritadaki ilanlar',
    saved: (count) => `Kaydedilenler (${count})`,
  },

  card: {
    save: 'Kaydet',
    unsave: 'Kayıtlılardan çıkar',
    saveLabel: (title) => `${title} ilanını kaydet`,
    unsaveLabel: (title) => `${title} ilanını kayıtlılardan çıkar`,
    compare: 'Karşılaştır',
    new: 'Yeni',
    drop: (pct) => `Fiyat %${pct} düştü`,
    featured: 'Öne çıkan',
    photos: (count) => `${count} fotoğraf`,
  },

  map: {
    searchArea: 'Bu alanda ara',
    homesHere: (count) => `Burada ${count} ilan var, yakınlaştırın`,
    view: 'İlanı gör',
    approximate: 'Yaklaşık konum. Tam adres, görüntüleme randevusunda paylaşılır.',
    loading: 'Harita yükleniyor…',
  },

  compareTray: {
    title: (count) => `3 evden ${count} tanesi seçili`,
    open: 'Karşılaştır',
    clear: 'Temizle',
    remove: (title) => `${title} ilanını karşılaştırmadan çıkar`,
    full: 'En fazla üç ev karşılaştırabilirsiniz. Önce birini çıkarın.',
    added: 'Karşılaştırmaya eklendi',
    removed: 'Karşılaştırmadan çıkarıldı',
    saved: 'Kaydedildi. “Kaydedilenler” altında bulabilirsiniz.',
    unsaved: 'Kayıtlılardan çıkarıldı',
  },

  listing: {
    breadcrumbHome: 'Ana sayfa',
    notFound: 'Bu ilan artık yayında değil',
    notFoundLead: 'Satılmış ya da kiralanmış olabilir. Benzer evler haritada duruyor.',
    backToSearch: 'Aramaya dön',
    allPhotos: (count) => `${count} fotoğrafın tümü`,
    share: 'Paylaş',
    linkCopied: 'Bağlantı kopyalandı',
    copyFailed: 'Adresi tarayıcının adres çubuğundan kopyalayın.',
    listingNo: 'İlan no.',
    facts: 'Temel bilgiler',
    rooms: 'Oda sayısı',
    gross: 'Brüt alan',
    net: 'Net alan',
    floor: 'Kat',
    age: 'Bina yaşı',
    heating: 'Isınma',
    furnished: 'Eşyalı',
    dues: 'Aylık aidat',
    listed: 'İlan tarihi',
    deposit: 'Depozito',
    credit: 'Krediye uygunluk',
    creditYes: 'Uygun',
    creditNo: 'Yalnızca peşin',
    yes: 'Evet',
    no: 'Hayır',
    noDues: 'Yok',
    about: 'Ev hakkında',
    featuresTitle: 'Özellikler',
    locationTitle: 'Konum',
    nearby: {
      transit: (minutes) => `Toplu taşımaya ${minutes} dk yürüme`,
      school: 'En yakın okul',
      hospital: 'En yakın hastane',
      market: 'En yakın market',
    },
    historyTitle: 'Fiyat geçmişi',
    historyListed: 'Yayınlandı',
    historyChange: 'Fiyat değişti',
    historyNow: 'Güncel fiyat',
    similarTitle: 'Benzer evler',
    moveInTitle: 'Taşınma maliyeti',
    moveIn: {
      firstRent: 'İlk ay kirası',
      deposit: 'Depozito (2 kira)',
      agencyFee: 'Emlak komisyonu (1 kira + KDV)',
      total: 'Sözleşmede ödenecek',
    },
  },

  mortgage: {
    title: 'Konut kredisi hesaplayıcı',
    lead: 'Sabit faizli, eşit aylık taksitlerle ödenen bir konut kredisi.',
    price: 'Ev fiyatı',
    downPayment: 'Peşinat',
    term: 'Vade',
    months: (months) => (months % 12 === 0 ? `${months / 12} yıl` : `${months} ay`),
    rate: 'Aylık faiz',
    rateHint: (annual) => `Yıllık yaklaşık %${annual}`,
    monthly: 'Aylık taksit',
    loan: 'Kredi tutarı',
    totalInterest: 'Toplam faiz',
    totalPaid: 'Toplam geri ödeme',
    principalShare: 'Anapara',
    interestShare: 'Faiz',
    incomeHint: (income) =>
      `Bankalar genellikle taksitin gelirin yarısını geçmemesini ister: aylık yaklaşık ${income}.`,
    schedule: 'Yıl yıl ödeme planı',
    year: 'Yıl',
    principal: 'Anapara',
    interest: 'Faiz',
    balance: 'Kalan borç',
    disclaimer: 'Tahmini bir hesaptır. Size sunulacak faiz bankaya ve gelirinize göre değişir.',
  },

  contact: {
    title: 'Bu ev hakkında sorun',
    call: 'Ara',
    name: 'Ad soyad',
    nameRequired: 'Adınızı yazın.',
    phone: 'Telefon',
    phoneRequired: 'Sizi geri arayabilmemiz için bir numara gerekli.',
    phoneInvalid: 'Bir telefon numarası yazın, örneğin 0532 555 12 34.',
    email: 'E-posta',
    emailInvalid: 'Geçerli bir e-posta adresi yazın.',
    message: 'Mesaj',
    messageDefault: (title, id) =>
      `Merhaba, “${title}” (ilan no. ${id}) ile ilgileniyorum. Hâlâ müsait mi, ne zaman görebilirim?`,
    viewing: 'Görüntüleme randevusu istiyorum',
    consent: 'Danışman bu ev hakkında benimle iletişime geçebilir.',
    consentRequired: 'Danışmanın yanıt verebilmesi için onay verin.',
    send: 'Mesajı gönder',
    sentTitle: 'Mesajınız iletildi',
    sentBody: (agent) => `${agent} bir iş günü içinde size dönecek.`,
    sendAnother: 'Yeni mesaj',
    demo: 'Demo form: hiçbir şey gönderilmez.',
  },

  compare: {
    title: 'Evleri karşılaştır',
    lead: 'En fazla üç ev yan yana. Her satırdaki en iyi değer vurgulanır.',
    emptyTitle: 'Karşılaştırılacak ev yok',
    emptyLead: 'En fazla üç ilanda “Karşılaştır”ı işaretleyin; burada yan yana dizilsinler.',
    browse: 'İlanlara göz at',
    copyLink: 'Bağlantıyı kopyala',
    clear: 'Temizle',
    remove: 'Çıkar',
    best: 'En iyi',
    rows: {
      price: 'Fiyat',
      pricePerM2: 'm² fiyatı',
      grossArea: 'Brüt alan',
      bedrooms: 'Yatak odası',
      buildingAge: 'Bina yaşı',
      dues: 'Aylık aidat',
      features: 'Özellikler',
    },
    location: 'Konum',
    type: 'Tip',
    floor: 'Kat',
    heating: 'Isınma',
    view: 'İlanı gör',
    addMore: 'Başka bir ev ekle',
  },
}

export const estateCopy = { en, tr }
export type { EstateCopy }
