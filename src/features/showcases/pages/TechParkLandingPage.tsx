import {
  ArrowRightOutlined,
  ExperimentOutlined,
  GlobalOutlined,
  RocketOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons'
import { Button, Card, Col, Flex, Row, Space, Statistic, Tag, Typography } from 'antd'
import { PublicSiteShell, ShowcasePreviewFrame } from '@/features/showcases/components'
import { usePreferencesStore } from '@/store/preferences-store'
import '../showcases.css'

interface TechParkLandingPageProps {
  standalone?: boolean
}

const copy = {
  en: {
    tagline: 'Technology campus',
    nav: ['Campus', 'Programs', 'Companies', 'Contact'],
    eyebrow: 'Build what comes next',
    title: 'Where ambitious technology companies become category leaders.',
    description:
      'An applied innovation campus connecting founders, research teams, industry partners, and global capital in one productive ecosystem.',
    primary: 'Apply to the campus',
    secondary: 'Explore programs',
    metrics: [
      ['Resident companies', 148, '+18 this year'],
      ['R&D professionals', 3200, '42 nationalities'],
      ['Active patents', 286, 'Across 9 sectors'],
      ['Export markets', 34, 'From one campus'],
    ] as const,
    capabilitiesTitle: 'Infrastructure for serious invention',
    capabilitiesDescription:
      'The right technical environment, commercial network, and operating support—ready when the team is.',
    capabilities: [
      [
        'Prototype laboratories',
        'Electronics, robotics, biotech, and clean-room facilities bookable by resident teams.',
      ],
      [
        'Scale-up programs',
        'Focused tracks for product validation, industrial pilots, exports, and investor readiness.',
      ],
      [
        'Enterprise network',
        'Structured access to procurement teams, mentors, universities, and global partners.',
      ],
    ] as const,
    programTitle: 'A campus designed around momentum',
    programText:
      'From a first technical hypothesis to an international commercial contract, every stage has a place here.',
    programSteps: ['Validate in shared labs', 'Pilot with industry', 'Scale into new markets'],
    ctaTitle: 'Bring your next breakthrough to Aurora.',
    ctaText: 'Applications for the winter residency cohort close on October 18.',
  },
  tr: {
    tagline: 'Teknoloji kampüsü',
    nav: ['Kampüs', 'Programlar', 'Şirketler', 'İletişim'],
    eyebrow: 'Geleceği burada kurun',
    title: 'İddialı teknoloji şirketlerinin kategori liderine dönüştüğü yer.',
    description:
      'Girişimcileri, araştırma ekiplerini, sanayi ortaklarını ve küresel sermayeyi üretken bir ekosistemde buluşturan uygulamalı inovasyon kampüsü.',
    primary: 'Kampüse başvur',
    secondary: 'Programları keşfet',
    metrics: [
      ['Yerleşik şirket', 148, 'Bu yıl +18'],
      ['Ar-Ge profesyoneli', 3200, '42 farklı ülke'],
      ['Aktif patent', 286, '9 farklı sektörde'],
      ['İhracat pazarı', 34, 'Tek kampüsten'],
    ] as const,
    capabilitiesTitle: 'Gerçek inovasyon için altyapı',
    capabilitiesDescription:
      'Doğru teknik ortam, ticari ağ ve operasyon desteği; ekibiniz hazır olduğunda sizi bekliyor.',
    capabilities: [
      [
        'Prototip laboratuvarları',
        'Elektronik, robotik, biyoteknoloji ve temiz oda tesisleri ekiplerin kullanımına açık.',
      ],
      [
        'Büyüme programları',
        'Ürün doğrulama, endüstriyel pilot, ihracat ve yatırım hazırlığına odaklı programlar.',
      ],
      [
        'Kurumsal ağ',
        'Satın alma ekipleri, mentorlar, üniversiteler ve küresel ortaklarla yapılandırılmış erişim.',
      ],
    ] as const,
    programTitle: 'Hız kazanmak için tasarlanan kampüs',
    programText:
      'İlk teknik hipotezden uluslararası ticari sözleşmeye kadar her aşamanın burada bir karşılığı var.',
    programSteps: [
      'Ortak laboratuvarda doğrula',
      'Sanayi ile pilot yap',
      'Yeni pazarlara ölçeklen',
    ],
    ctaTitle: 'Sıradaki büyük fikrinizi Aurora’ya taşıyın.',
    ctaText: 'Kış dönemi yerleşim programı başvuruları 18 Ekim’de kapanıyor.',
  },
}

const capabilityIcons = [
  <ExperimentOutlined key="lab" />,
  <RocketOutlined key="rocket" />,
  <GlobalOutlined key="global" />,
]

export function TechParkLandingPage({ standalone = false }: TechParkLandingPageProps) {
  const language = usePreferencesStore((state) => state.language)
  const text = copy[language]
  const rootPath = standalone ? '/preview/technopark' : '/showcases/technopark'

  const page = (
    <PublicSiteShell
      brand="Aurora Tech Park"
      tagline={{ en: copy.en.tagline, tr: copy.tr.tagline }}
      className="techpark-site"
      primary="#3157d5"
      links={text.nav.map((label, index) => ({
        href: index === 0 ? rootPath : `${rootPath}#section-${index}`,
        label: { en: copy.en.nav[index] ?? label, tr: copy.tr.nav[index] ?? label },
      }))}
    >
      <section className="showcase-hero techpark-hero">
        <div className="showcase-hero__copy">
          <Tag color="blue" variant="filled" icon={<SafetyCertificateOutlined />}>
            {text.eyebrow}
          </Tag>
          <Typography.Title>{text.title}</Typography.Title>
          <Typography.Paragraph>{text.description}</Typography.Paragraph>
          <Space wrap>
            <Button type="primary" size="large" icon={<RocketOutlined />}>
              {text.primary}
            </Button>
            <Button size="large" href="#section-1" icon={<ArrowRightOutlined />}>
              {text.secondary}
            </Button>
          </Space>
        </div>
        <div
          className="techpark-hero__visual"
          aria-label="Connected innovation campus illustration"
        >
          <span className="techpark-orbit techpark-orbit--one" />
          <span className="techpark-orbit techpark-orbit--two" />
          <div className="techpark-core">
            <RocketOutlined />
            <strong>AURORA / 01</strong>
          </div>
          <div className="techpark-signal">AI</div>
          <div className="techpark-signal techpark-signal--lower">BIO</div>
        </div>
      </section>

      <section className="showcase-section techpark-metrics">
        <Row gutter={[16, 16]}>
          {text.metrics.map(([title, value, suffix]) => (
            <Col xs={24} sm={12} lg={6} key={title}>
              <Card variant="borderless">
                <Statistic title={title} value={value} />
                <Typography.Text type="secondary">{suffix}</Typography.Text>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      <section className="showcase-section" id="section-1">
        <div className="showcase-section__heading">
          <Typography.Title level={2}>{text.capabilitiesTitle}</Typography.Title>
          <Typography.Paragraph>{text.capabilitiesDescription}</Typography.Paragraph>
        </div>
        <Row gutter={[20, 20]}>
          {text.capabilities.map(([title, description], index) => (
            <Col xs={24} lg={8} key={title}>
              <Card className="showcase-feature-card" variant="borderless">
                <div className="showcase-feature-card__icon">{capabilityIcons[index]}</div>
                <Typography.Title level={4}>{title}</Typography.Title>
                <Typography.Paragraph type="secondary">{description}</Typography.Paragraph>
                <Button type="link" icon={<ArrowRightOutlined />} iconPlacement="end">
                  {language === 'tr' ? 'Detayları gör' : 'See details'}
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      <section className="showcase-section techpark-program" id="section-2">
        <Row gutter={[32, 32]} align="middle">
          <Col xs={24} lg={10}>
            <Tag variant="filled">{language === 'tr' ? 'Büyüme yolculuğu' : 'Growth journey'}</Tag>
            <Typography.Title level={2}>{text.programTitle}</Typography.Title>
            <Typography.Paragraph>{text.programText}</Typography.Paragraph>
          </Col>
          <Col xs={24} lg={14}>
            <Flex className="techpark-steps" gap={12} wrap>
              {text.programSteps.map((step, index) => (
                <Card variant="borderless" key={step}>
                  <Typography.Text type="secondary">0{index + 1}</Typography.Text>
                  <Typography.Title level={4}>{step}</Typography.Title>
                </Card>
              ))}
            </Flex>
          </Col>
        </Row>
      </section>

      <section className="showcase-section showcase-cta" id="section-3">
        <Space orientation="vertical" size="middle">
          <Typography.Title level={2}>{text.ctaTitle}</Typography.Title>
          <Typography.Paragraph>{text.ctaText}</Typography.Paragraph>
          <Button type="primary" size="large">
            {text.primary}
          </Button>
        </Space>
      </section>
    </PublicSiteShell>
  )

  return (
    <ShowcasePreviewFrame
      standalone={standalone}
      standalonePath="/preview/technopark"
      title={{ en: 'Technology park landing page', tr: 'Teknopark landing page' }}
      description={{
        en: 'A focused B2B landing experience built with Ant Design primitives.',
        tr: 'Ant Design yapı taşlarıyla oluşturulmuş odaklı bir B2B landing deneyimi.',
      }}
    >
      {page}
    </ShowcasePreviewFrame>
  )
}
