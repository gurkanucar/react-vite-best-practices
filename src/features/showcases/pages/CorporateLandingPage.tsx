import {
  ArrowRightOutlined,
  BankOutlined,
  GlobalOutlined,
  RiseOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons'
import { Button, Card, Col, Flex, Row, Space, Statistic, Tag, Typography } from 'antd'
import { CorporateSiteShell, ShowcasePreviewFrame } from '@/features/showcases/components'
import { corporateNews } from '@/features/showcases/data'
import { localize } from '@/features/showcases/types'
import { usePreferencesStore } from '@/store/preferences-store'
import '../showcases.css'

interface CorporateLandingPageProps {
  standalone?: boolean
}

const copy = {
  en: {
    eyebrow: 'Building useful scale since 1986',
    title: 'Long-term businesses for a changing world.',
    description:
      'Northstar builds and operates resilient companies across energy, infrastructure, logistics, and digital services.',
    primary: 'Discover our businesses',
    secondary: 'Read our latest report',
    principlesTitle: 'One group, one operating standard',
    principlesText:
      'We combine local expertise with shared standards for safety, capital discipline, and measurable environmental progress.',
    principles: [
      ['Essential infrastructure', 'We focus on systems people and businesses rely on every day.'],
      [
        'Disciplined growth',
        'Investment decisions balance durable returns with responsible use of resources.',
      ],
      [
        'Visible impact',
        'Common reporting keeps commitments comparable across every operating company.',
      ],
    ] as const,
    latest: 'Latest from Northstar',
    allNews: 'View all news',
    contactTitle: 'A stronger future is a shared project.',
    contactText: 'Talk to our partnerships team about investment, procurement, and collaboration.',
  },
  tr: {
    eyebrow: '1986’dan beri faydalı ölçekte işler',
    title: 'Değişen dünya için uzun ömürlü işler.',
    description:
      'Northstar; enerji, altyapı, lojistik ve dijital hizmetler alanlarında dayanıklı şirketler kurar ve işletir.',
    primary: 'İş alanlarımızı keşfet',
    secondary: 'Son raporumuzu okuyun',
    principlesTitle: 'Tek grup, tek çalışma standardı',
    principlesText:
      'Yerel uzmanlığı güvenlik, sermaye disiplini ve ölçülebilir çevresel ilerleme için ortak standartlarla birleştiriyoruz.',
    principles: [
      ['Temel altyapı', 'İnsanların ve işletmelerin her gün güvendiği sistemlere odaklanıyoruz.'],
      [
        'Disiplinli büyüme',
        'Yatırım kararları kalıcı getiriyi kaynakların sorumlu kullanımıyla dengeler.',
      ],
      ['Görünür etki', 'Ortak raporlama, taahhütleri tüm işletmelerde karşılaştırılabilir kılar.'],
    ] as const,
    latest: 'Northstar’dan son gelişmeler',
    allNews: 'Tüm haberleri görüntüle',
    contactTitle: 'Daha güçlü bir gelecek ortak bir projedir.',
    contactText: 'Yatırım, satın alma ve iş birliği için ortaklık ekibimizle görüşün.',
  },
}

const principleIcons = [
  <BankOutlined key="infrastructure" />,
  <RiseOutlined key="growth" />,
  <SafetyCertificateOutlined key="impact" />,
]

export function CorporateLandingPage({ standalone = false }: CorporateLandingPageProps) {
  const language = usePreferencesStore((state) => state.language)
  const text = copy[language]
  const root = standalone ? '/preview/corporate' : '/showcases/corporate'

  const page = (
    <CorporateSiteShell standalone={standalone}>
      <section className="showcase-hero corporate-hero">
        <div className="showcase-hero__copy">
          <Tag variant="filled">{text.eyebrow}</Tag>
          <Typography.Title>{text.title}</Typography.Title>
          <Typography.Paragraph>{text.description}</Typography.Paragraph>
          <Space wrap>
            <Button type="primary" size="large" icon={<GlobalOutlined />}>
              {text.primary}
            </Button>
            <Button size="large">{text.secondary}</Button>
          </Space>
        </div>
        <div className="corporate-hero__panel">
          <Typography.Text>2026 / IMPACT</Typography.Text>
          <Typography.Title level={2}>64%</Typography.Title>
          <Typography.Paragraph>
            {language === 'tr'
              ? 'Operasyonlarımızda yenilenebilir elektrik payı'
              : 'Renewable electricity across our operations'}
          </Typography.Paragraph>
          <div className="corporate-hero__line" />
          <Flex gap={24} wrap>
            <Statistic title={language === 'tr' ? 'Çalışan' : 'People'} value={12400} />
            <Statistic title={language === 'tr' ? 'Pazar' : 'Markets'} value={18} />
          </Flex>
        </div>
      </section>

      <section className="showcase-section corporate-principles">
        <Row gutter={[32, 24]}>
          <Col xs={24} lg={9}>
            <Typography.Title level={2}>{text.principlesTitle}</Typography.Title>
            <Typography.Paragraph>{text.principlesText}</Typography.Paragraph>
          </Col>
          <Col xs={24} lg={15}>
            <Row gutter={[16, 16]}>
              {text.principles.map(([title, description], index) => (
                <Col xs={24} md={8} key={title}>
                  <Card variant="borderless">
                    <div className="showcase-feature-card__icon">{principleIcons[index]}</div>
                    <Typography.Title level={4}>{title}</Typography.Title>
                    <Typography.Paragraph type="secondary">{description}</Typography.Paragraph>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </section>

      <section className="showcase-section corporate-latest">
        <Flex justify="space-between" align="end" gap={16} wrap>
          <Typography.Title level={2}>{text.latest}</Typography.Title>
          <Button
            href={`${root}/news`}
            type="link"
            icon={<ArrowRightOutlined />}
            iconPlacement="end"
          >
            {text.allNews}
          </Button>
        </Flex>
        <Row gutter={[20, 20]}>
          {corporateNews.map((item, index) => (
            <Col xs={24} lg={8} key={item.slug}>
              <Card className="corporate-story-card" variant="borderless">
                <div
                  className={`corporate-story-card__image corporate-story-card__image--${index + 1}`}
                />
                <Tag variant="filled">{localize(item.category, language)}</Tag>
                <Typography.Title level={4}>{localize(item.title, language)}</Typography.Title>
                <Typography.Paragraph type="secondary">
                  {localize(item.summary, language)}
                </Typography.Paragraph>
                <Button href={`${root}/news/${item.slug}`} type="link">
                  {language === 'tr' ? 'Haberi oku' : 'Read story'}
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      <section className="showcase-section showcase-cta corporate-contact" id="contact">
        <Typography.Title level={2}>{text.contactTitle}</Typography.Title>
        <Typography.Paragraph>{text.contactText}</Typography.Paragraph>
        <Button type="primary" size="large">
          {language === 'tr' ? 'Ekibimizle iletişime geçin' : 'Contact our team'}
        </Button>
      </section>
    </CorporateSiteShell>
  )

  return (
    <ShowcasePreviewFrame
      standalone={standalone}
      standalonePath="/preview/corporate"
      title={{ en: 'Corporate landing page', tr: 'Kurumsal landing page' }}
      description={{
        en: 'An editorial corporate website with linked news and announcement examples.',
        tr: 'Bağlantılı haber ve duyuru örnekleri içeren editoryal kurumsal web sitesi.',
      }}
    >
      {page}
    </ShowcasePreviewFrame>
  )
}
