import {
  ArrowRightOutlined,
  CheckCircleFilled,
  ClockCircleOutlined,
  EnvironmentOutlined,
  FireFilled,
  HeartOutlined,
  InfoCircleOutlined,
  PhoneOutlined,
  ShoppingOutlined,
  StarFilled,
} from '@ant-design/icons'
import {
  Button,
  Card,
  Col,
  Drawer,
  Flex,
  QRCode,
  Row,
  Segmented,
  Space,
  Tag,
  Typography,
} from 'antd'
import { useMemo, useState } from 'react'
import restaurantHero from '@/features/showcases/assets/restaurant-hero.png'
import { PublicSiteShell, ShowcasePreviewFrame } from '@/features/showcases/components'
import { usePreferencesStore, type Language } from '@/store/preferences-store'
import '../showcases.css'
import '../restaurant.css'

interface RestaurantMenuPageProps {
  standalone?: boolean
}

type Category = 'all' | 'mezze' | 'mains' | 'desserts' | 'drinks'

interface MenuItem {
  id: string
  category: Exclude<Category, 'all'>
  name: Record<Language, string>
  description: Record<Language, string>
  detail: Record<Language, string>
  price: number
  tags: Record<Language, string[]>
  image?: {
    url: string
    sourceUrl: string
    credit: string
    alt: Record<Language, string>
  }
  featured?: boolean
  spicy?: boolean
}

const copy = {
  en: {
    tagline: 'Modern Istanbul table',
    nav: ['Welcome', 'Menu', 'Our kitchen', 'Visit'],
    eyebrow: 'A table between two continents',
    title: 'Istanbul on a plate, made for sharing.',
    description:
      'Season-led mezze, fire-kissed seafood and recipes gathered from both shores of the Bosphorus.',
    explore: 'Explore the menu',
    reserve: 'Reserve a table',
    open: 'Open today · 12:00–23:30',
    rating: '4.9 from 840 guests',
    menuEyebrow: 'À la carte · Autumn 2026',
    menuTitle: 'Choose something wonderful',
    menuDescription: 'Tap any plate for ingredients, allergens and the story behind the recipe.',
    categories: ['All', 'Mezze', 'From the fire', 'Desserts', 'Drinks'],
    popular: 'Guest favourite',
    detailTitle: 'Plate details',
    ingredients: 'What is inside',
    photoBy: 'Photo by',
    add: 'Add to table',
    added: 'Added to your table',
    kitchenEyebrow: 'The kitchen note',
    kitchenTitle: 'Good food begins close to home.',
    kitchenText:
      'Our vegetables arrive from small farms around the Marmara, our fish follows the season, and every loaf is baked downstairs before service.',
    kitchenPoints: ['Daily market produce', 'Responsibly sourced seafood', 'Bread baked in-house'],
    qrTitle: 'Your menu, wherever you sit',
    qrText:
      'Scan at the table to reopen the menu in your language—no app, no download, no waiting.',
    scan: 'Scan to open',
    visitTitle: 'Dinner with a view of the old city.',
    address: 'Karaköy Pier, Istanbul',
    phone: '+90 212 555 07 07',
    book: 'Book your table',
  },
  tr: {
    tagline: 'Modern İstanbul sofrası',
    nav: ['Karşılama', 'Menü', 'Mutfağımız', 'Ziyaret'],
    eyebrow: 'İki kıta arasında bir sofra',
    title: 'Paylaşmak için hazırlanan tabaklarda İstanbul.',
    description:
      'Mevsimlik mezeler, ateşle buluşan deniz ürünleri ve Boğaz’ın iki yakasından toplanan tarifler.',
    explore: 'Menüyü keşfet',
    reserve: 'Masa ayırt',
    open: 'Bugün açık · 12:00–23:30',
    rating: '840 misafirden 4,9 puan',
    menuEyebrow: 'Alakart · Sonbahar 2026',
    menuTitle: 'Harika bir şey seçin',
    menuDescription:
      'İçindekiler, alerjenler ve tarifin hikâyesi için herhangi bir tabağa dokunun.',
    categories: ['Tümü', 'Mezeler', 'Ateşten', 'Tatlılar', 'İçecekler'],
    popular: 'Misafir favorisi',
    detailTitle: 'Tabak detayları',
    ingredients: 'İçindekiler',
    photoBy: 'Fotoğraf',
    add: 'Masaya ekle',
    added: 'Masanıza eklendi',
    kitchenEyebrow: 'Mutfaktan not',
    kitchenTitle: 'İyi yemek yakından başlar.',
    kitchenText:
      'Sebzelerimiz Marmara çevresindeki küçük üreticilerden gelir, balığımız mevsimi takip eder ve her ekmek servis öncesi alt kattaki fırında pişer.',
    kitchenPoints: ['Günlük pazar ürünü', 'Sorumlu deniz ürünü', 'Kendi fırınımızdan ekmek'],
    qrTitle: 'Oturduğunuz her yerde menünüz yanınızda',
    qrText: 'Masada taratın, menüyü dilinizde yeniden açın—uygulama, indirme ve bekleme yok.',
    scan: 'Açmak için taratın',
    visitTitle: 'Eski şehir manzarasıyla akşam yemeği.',
    address: 'Karaköy İskelesi, İstanbul',
    phone: '+90 212 555 07 07',
    book: 'Masanızı ayırtın',
  },
} as const

const menuItems: MenuItem[] = [
  {
    id: 'smoked-aubergine',
    category: 'mezze',
    name: { en: 'Ember aubergine', tr: 'Köz patlıcan' },
    description: {
      en: 'Sheep yoghurt, burnt pepper oil, toasted walnut',
      tr: 'Koyun yoğurdu, yanık biber yağı, kavrulmuş ceviz',
    },
    detail: {
      en: 'Whole aubergines are cooked directly in the embers, then folded with strained yoghurt and a bright sumac dressing.',
      tr: 'Bütün patlıcanlar közün içinde pişirilir; süzme yoğurt ve sumaklı ferah bir sosla birleştirilir.',
    },
    price: 320,
    tags: {
      en: ['Vegetarian', 'Contains dairy', 'Walnut'],
      tr: ['Vejetaryen', 'Süt ürünü', 'Ceviz'],
    },
    image: {
      url: 'https://images.unsplash.com/photo-1627308595127-d9acf19107ce?auto=format&fit=crop&w=900&q=82',
      sourceUrl: 'https://unsplash.com/@vickyng',
      credit: 'Vicky Ng',
      alt: {
        en: 'Smoky aubergine dip served with crisp pita',
        tr: 'Çıtır pideyle servis edilen közlü patlıcan mezesi',
      },
    },
    featured: true,
  },
  {
    id: 'sea-bass-crudo',
    category: 'mezze',
    name: { en: 'Sea bass crudo', tr: 'Levrek çiğleme' },
    description: {
      en: 'Green plum, fennel, dill and citrus',
      tr: 'Yeşil erik, rezene, dereotu ve narenciye',
    },
    detail: {
      en: 'Line-caught sea bass sliced to order with tart green plum and cold-pressed olive oil.',
      tr: 'Olta levreği siparişle dilimlenir; ekşi yeşil erik ve soğuk sıkım zeytinyağıyla servis edilir.',
    },
    price: 460,
    tags: { en: ['Gluten-free', 'Raw fish'], tr: ['Glütensiz', 'Çiğ balık'] },
  },
  {
    id: 'charred-octopus',
    category: 'mains',
    name: { en: 'Charred octopus', tr: 'Izgara ahtapot' },
    description: {
      en: 'White bean purée, caper leaf, pul biber',
      tr: 'Fasulye püresi, kapari yaprağı, pul biber',
    },
    detail: {
      en: 'Slow-braised octopus finished over olive wood for a tender centre and crisp, smoky edges.',
      tr: 'Ağır ateşte yumuşatılan ahtapot, içi sulu dışı isli ve çıtır olsun diye zeytin odununda tamamlanır.',
    },
    price: 790,
    tags: { en: ['Gluten-free', 'Shellfish'], tr: ['Glütensiz', 'Kabuklu deniz ürünü'] },
    image: {
      url: 'https://images.unsplash.com/photo-1764397514678-3169fbd58430?auto=format&fit=crop&w=900&q=82',
      sourceUrl: 'https://unsplash.com/@udatommo',
      credit: 'Tomi Saputra',
      alt: {
        en: 'Charred octopus with greens and lemon on a ceramic plate',
        tr: 'Seramik tabakta yeşillik ve limonla servis edilen ızgara ahtapot',
      },
    },
    featured: true,
    spicy: true,
  },
  {
    id: 'lamb-shoulder',
    category: 'mains',
    name: { en: 'Seven-hour lamb', tr: 'Yedi saat kuzu' },
    description: {
      en: 'Sour cherry jus, firik pilaf, garden herbs',
      tr: 'Vişne sos, firik pilavı, bahçe otları',
    },
    detail: {
      en: 'Lamb shoulder cooked overnight and glazed with sour cherry—a generous plate for the middle of the table.',
      tr: 'Gece boyunca pişen kuzu kol vişneyle cilalanır; masanın ortasında paylaşmak için cömert bir tabaktır.',
    },
    price: 980,
    tags: { en: ['For sharing', 'Contains gluten'], tr: ['Paylaşımlık', 'Glüten içerir'] },
    image: {
      url: 'https://images.unsplash.com/photo-1504649346668-2cc86afaa2e1?auto=format&fit=crop&w=900&q=82',
      sourceUrl: 'https://unsplash.com/@m15ky',
      credit: 'Mike Tinnion',
      alt: {
        en: 'Slow-roasted lamb served as a generous sharing plate',
        tr: 'Paylaşımlık tabakta servis edilen ağır pişmiş kuzu',
      },
    },
  },
  {
    id: 'tahini-souffle',
    category: 'desserts',
    name: { en: 'Tahini soufflé', tr: 'Tahinli sufle' },
    description: {
      en: 'Caramelised sesame, milk ice cream',
      tr: 'Karamelize susam, süt dondurması',
    },
    detail: {
      en: 'A warm, nutty centre with a paper-thin crust, balanced by lightly salted milk ice cream.',
      tr: 'İncecik kabuğun altında sıcak ve fındıksı bir merkez; hafif tuzlu süt dondurmasıyla dengelenir.',
    },
    price: 360,
    tags: { en: ['Vegetarian', 'Sesame', 'Dairy'], tr: ['Vejetaryen', 'Susam', 'Süt ürünü'] },
    image: {
      url: 'https://images.unsplash.com/photo-1762631934868-745b3258d7f9?auto=format&fit=crop&w=900&q=82',
      sourceUrl: 'https://unsplash.com/@joestudios',
      credit: 'Joe Boshra',
      alt: {
        en: 'Warm soufflé served with a scoop of milk ice cream',
        tr: 'Bir top süt dondurmasıyla servis edilen sıcak sufle',
      },
    },
    featured: true,
  },
  {
    id: 'lokma',
    category: 'desserts',
    name: { en: 'Orange blossom lokma', tr: 'Portakal çiçekli lokma' },
    description: {
      en: 'Pistachio, citrus honey, kaymak',
      tr: 'Antep fıstığı, narenciye balı, kaymak',
    },
    detail: {
      en: 'Crisp lokma glazed just before serving with fragrant honey and a spoon of cool kaymak.',
      tr: 'Çıtır lokmalar servis öncesi kokulu balla cilalanır; yanında serin kaymakla gelir.',
    },
    price: 290,
    tags: { en: ['Vegetarian', 'Pistachio'], tr: ['Vejetaryen', 'Antep fıstığı'] },
  },
  {
    id: 'sumac-tonic',
    category: 'drinks',
    name: { en: 'Sumac tonic', tr: 'Sumak tonik' },
    description: {
      en: 'Sumac cordial, grapefruit, sparkling water',
      tr: 'Sumak şurubu, greyfurt, soda',
    },
    detail: {
      en: 'Our tart, ruby-red house cordial lengthened with grapefruit peel and sparkling water.',
      tr: 'Ekşi, yakut renkli ev yapımı şurubumuz; greyfurt kabuğu ve sodayla uzatılır.',
    },
    price: 210,
    tags: { en: ['Alcohol-free', 'Vegan'], tr: ['Alkolsüz', 'Vegan'] },
  },
  {
    id: 'house-raki',
    category: 'drinks',
    name: { en: 'House rakı highball', tr: 'Ev yapımı rakı highball' },
    description: {
      en: 'Rakı, mastic, cucumber, mineral water',
      tr: 'Rakı, damla sakızı, salatalık, maden suyu',
    },
    detail: {
      en: 'A long, cooling take on the classic table ritual, served over a single clear ice spear.',
      tr: 'Klasik sofra ritüeline uzun ve ferah bir yorum; tek parça berrak buz üzerinde servis edilir.',
    },
    price: 390,
    tags: { en: ['Contains alcohol'], tr: ['Alkol içerir'] },
  },
]

const categories: Category[] = ['all', 'mezze', 'mains', 'desserts', 'drinks']

export function RestaurantMenuPage({ standalone = false }: RestaurantMenuPageProps) {
  const language = usePreferencesStore((state) => state.language)
  const text = copy[language]
  const rootPath = standalone ? '/preview/restaurant' : '/showcases/restaurant'
  const [category, setCategory] = useState<Category>('all')
  const [selectedItem, setSelectedItem] = useState<MenuItem>()
  const [added, setAdded] = useState(false)
  const filteredItems = useMemo(
    () => menuItems.filter((item) => category === 'all' || item.category === category),
    [category],
  )

  const page = (
    <PublicSiteShell
      brand="Sofra No. 7"
      tagline={{ en: copy.en.tagline, tr: copy.tr.tagline }}
      className="restaurant-site"
      primary="#164aa8"
      colorModeToggle
      links={text.nav.map((label, index) => ({
        href: index === 0 ? rootPath : `${rootPath}#restaurant-${index}`,
        label: { en: copy.en.nav[index] ?? label, tr: copy.tr.nav[index] ?? label },
      }))}
    >
      <section className="restaurant-hero">
        <img src={restaurantHero} alt="" aria-hidden="true" className="restaurant-hero__image" />
        <div className="restaurant-hero__content">
          <Typography.Text className="restaurant-kicker">{text.eyebrow}</Typography.Text>
          <Typography.Title>{text.title}</Typography.Title>
          <Typography.Paragraph>{text.description}</Typography.Paragraph>
          <Space wrap size={12}>
            <Button type="primary" size="large" href="#restaurant-1" icon={<ArrowRightOutlined />}>
              {text.explore}
            </Button>
            <Button ghost size="large" href="#restaurant-3">
              {text.reserve}
            </Button>
          </Space>
          <Flex className="restaurant-hero__proof" gap={20} wrap>
            <Typography.Text>
              <ClockCircleOutlined /> {text.open}
            </Typography.Text>
            <Typography.Text>
              <StarFilled /> {text.rating}
            </Typography.Text>
          </Flex>
        </div>
      </section>

      <section className="restaurant-menu" id="restaurant-1">
        <div className="restaurant-section-heading">
          <Typography.Text className="restaurant-kicker">{text.menuEyebrow}</Typography.Text>
          <Typography.Title level={2}>{text.menuTitle}</Typography.Title>
          <Typography.Paragraph>{text.menuDescription}</Typography.Paragraph>
        </div>

        <Segmented
          block
          className="restaurant-categories"
          aria-label={language === 'tr' ? 'Menü kategorileri' : 'Menu categories'}
          options={text.categories.map((label, index) => ({ label, value: categories[index] }))}
          value={category}
          onChange={(value) => setCategory(value as Category)}
        />

        <div className="restaurant-menu__grid" aria-live="polite">
          {filteredItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className="restaurant-dish-trigger"
              aria-label={`${item.name[language]}, ₺${item.price}`}
              onClick={() => {
                setAdded(false)
                setSelectedItem(item)
              }}
            >
              <Card hoverable className="restaurant-dish" styles={{ body: { padding: 0 } }}>
                <div
                  className={`restaurant-dish__body${item.image ? ' restaurant-dish__body--with-image' : ''}`}
                >
                  {item.image && (
                    <img
                      src={item.image.url}
                      alt=""
                      loading="lazy"
                      className="restaurant-dish__image"
                    />
                  )}
                  <div className="restaurant-dish__details">
                    <Flex justify="space-between" align="start" gap={16}>
                      <div>
                        <Flex align="center" gap={8} wrap>
                          <Typography.Title level={4}>
                            {item.name[language]} {item.spicy && <FireFilled aria-label="Spicy" />}
                          </Typography.Title>
                          {item.featured && (
                            <Typography.Text className="restaurant-dish__popular">
                              <StarFilled /> {text.popular}
                            </Typography.Text>
                          )}
                        </Flex>
                        <Typography.Paragraph>{item.description[language]}</Typography.Paragraph>
                      </div>
                      <Typography.Text strong className="restaurant-price">
                        ₺{item.price}
                      </Typography.Text>
                    </Flex>
                    <Flex gap={6} wrap>
                      {item.tags[language].slice(0, 2).map((tag) => (
                        <Tag key={tag} variant="filled">
                          {tag}
                        </Tag>
                      ))}
                    </Flex>
                  </div>
                </div>
              </Card>
            </button>
          ))}
        </div>
      </section>

      <section className="restaurant-story" id="restaurant-2">
        <div className="restaurant-story__visual" aria-hidden="true">
          <span className="restaurant-story__number">7</span>
          <span className="restaurant-story__place">
            Marmara
            <br />
            Karaköy
          </span>
        </div>
        <div className="restaurant-story__copy">
          <Typography.Text className="restaurant-kicker">{text.kitchenEyebrow}</Typography.Text>
          <Typography.Title level={2}>{text.kitchenTitle}</Typography.Title>
          <Typography.Paragraph>{text.kitchenText}</Typography.Paragraph>
          <Space orientation="vertical" size={14}>
            {text.kitchenPoints.map((point) => (
              <Typography.Text key={point}>
                <CheckCircleFilled /> {point}
              </Typography.Text>
            ))}
          </Space>
        </div>
      </section>

      <section className="restaurant-qr">
        <div>
          <Typography.Text className="restaurant-kicker">QR MENU</Typography.Text>
          <Typography.Title level={2}>{text.qrTitle}</Typography.Title>
          <Typography.Paragraph>{text.qrText}</Typography.Paragraph>
        </div>
        <div className="restaurant-qr__code">
          <QRCode
            value={`https://sofra-no7.example${rootPath}`}
            size={148}
            bordered={false}
            type="svg"
          />
          <Typography.Text strong>{text.scan}</Typography.Text>
        </div>
      </section>

      <section className="restaurant-visit" id="restaurant-3">
        <Row align="middle" gutter={[28, 24]}>
          <Col xs={24} lg={14}>
            <Typography.Text className="restaurant-kicker">KARAKÖY · ISTANBUL</Typography.Text>
            <Typography.Title level={2}>{text.visitTitle}</Typography.Title>
            <Space size={[16, 8]} wrap>
              <Typography.Text>
                <EnvironmentOutlined /> {text.address}
              </Typography.Text>
              <Typography.Text>
                <PhoneOutlined /> {text.phone}
              </Typography.Text>
            </Space>
          </Col>
          <Col xs={24} lg={10} className="restaurant-visit__action">
            <Button type="primary" size="large" icon={<HeartOutlined />}>
              {text.book}
            </Button>
          </Col>
        </Row>
      </section>

      <Drawer
        open={Boolean(selectedItem)}
        onClose={() => setSelectedItem(undefined)}
        placement="right"
        size="large"
        title={text.detailTitle}
        className="restaurant-drawer"
      >
        {selectedItem && (
          <Space orientation="vertical" size={24} className="restaurant-drawer__content">
            {selectedItem.image && (
              <figure className="restaurant-drawer__figure">
                <img
                  src={selectedItem.image.url}
                  alt={selectedItem.image.alt[language]}
                  className="restaurant-drawer__image"
                />
                <Typography.Text type="secondary" className="restaurant-drawer__credit">
                  {text.photoBy}{' '}
                  <a href={selectedItem.image.sourceUrl} target="_blank" rel="noreferrer">
                    {selectedItem.image.credit} / Unsplash
                  </a>
                </Typography.Text>
              </figure>
            )}
            <div>
              <Typography.Text className="restaurant-kicker">
                {text.categories[categories.indexOf(selectedItem.category)]}
              </Typography.Text>
              <Typography.Title level={2}>{selectedItem.name[language]}</Typography.Title>
              <Typography.Text strong className="restaurant-price restaurant-price--large">
                ₺{selectedItem.price}
              </Typography.Text>
            </div>
            <Typography.Paragraph className="restaurant-drawer__description">
              {selectedItem.detail[language]}
            </Typography.Paragraph>
            <div>
              <Typography.Title level={5}>{text.ingredients}</Typography.Title>
              <Flex gap={8} wrap>
                {selectedItem.tags[language].map((tag) => (
                  <Tag key={tag} icon={<InfoCircleOutlined />}>
                    {tag}
                  </Tag>
                ))}
              </Flex>
            </div>
            <Button
              block
              size="large"
              type="primary"
              icon={added ? <CheckCircleFilled /> : <ShoppingOutlined />}
              onClick={() => setAdded(true)}
            >
              {added ? text.added : text.add}
            </Button>
          </Space>
        )}
      </Drawer>
    </PublicSiteShell>
  )

  return (
    <ShowcasePreviewFrame
      standalone={standalone}
      standalonePath="/preview/restaurant"
      title={{ en: 'Restaurant & QR menu', tr: 'Restoran ve QR menü' }}
      description={{
        en: 'A bilingual, animated restaurant website with a touch-friendly digital menu.',
        tr: 'Dokunmatik kullanıma uygun dijital menüye sahip, iki dilli ve animasyonlu restoran sitesi.',
      }}
    >
      {page}
    </ShowcasePreviewFrame>
  )
}
