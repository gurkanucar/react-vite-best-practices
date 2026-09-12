import {
  CalendarOutlined,
  CheckCircleFilled,
  ClockCircleOutlined,
  HeartOutlined,
  MedicineBoxOutlined,
  PhoneOutlined,
  SafetyCertificateOutlined,
  SmileOutlined,
  StarFilled,
} from '@ant-design/icons'
import { Avatar, Button, Card, Col, Flex, Form, Input, Row, Space, Tag, Typography } from 'antd'
import { PublicSiteShell, ShowcasePreviewFrame } from '@/features/showcases/components'
import { usePreferencesStore } from '@/store/preferences-store'
import '../showcases.css'

interface DentalClinicLandingPageProps {
  standalone?: boolean
}

const copy = {
  en: {
    tagline: 'Modern dental care',
    nav: ['Home', 'Treatments', 'Our team', 'Appointment'],
    eyebrow: 'Calm, precise, personal',
    title: 'A healthier smile starts with care you can trust.',
    description:
      'Evidence-led dentistry in a calm clinic, with transparent treatment plans and one team beside you at every step.',
    appointment: 'Book an appointment',
    call: 'Call the clinic',
    trust: ['Same-week appointments', 'Transparent pricing', 'Multilingual team'],
    servicesTitle: 'Complete care under one roof',
    servicesDescription:
      'From preventive care to complex smile restoration, your plan stays coordinated.',
    services: [
      [
        'Preventive dentistry',
        'Routine examinations, hygiene, imaging, and personal prevention plans.',
      ],
      [
        'Smile restoration',
        'Natural-looking crowns, implants, and digitally planned restorative treatment.',
      ],
      [
        'Gentle orthodontics',
        'Clear aligner and orthodontic options for children, teenagers, and adults.',
      ],
    ] as const,
    doctorTitle: 'Care led by people who listen',
    doctorText:
      'Our clinicians explain every option in plain language and build the treatment plan around your health, comfort, and priorities.',
    formTitle: 'Request an appointment',
    formDescription:
      'Leave your details and our patient coordinator will call you the same business day.',
    name: 'Full name',
    phone: 'Phone number',
    note: 'How can we help?',
    send: 'Request a call',
  },
  tr: {
    tagline: 'Modern ağız ve diş sağlığı',
    nav: ['Ana sayfa', 'Tedaviler', 'Ekibimiz', 'Randevu'],
    eyebrow: 'Sakin, hassas, kişisel',
    title: 'Daha sağlıklı bir gülüş, güvenebileceğiniz bakımla başlar.',
    description:
      'Sakin bir klinikte kanıta dayalı diş hekimliği; şeffaf tedavi planı ve her adımda yanınızda olan tek bir ekip.',
    appointment: 'Randevu oluştur',
    call: 'Kliniği ara',
    trust: ['Aynı hafta randevu', 'Şeffaf fiyatlandırma', 'Çok dilli ekip'],
    servicesTitle: 'Tüm tedaviler tek çatı altında',
    servicesDescription:
      'Koruyucu bakımdan kapsamlı gülüş tasarımına kadar planınız tek ekipte ilerler.',
    services: [
      ['Koruyucu diş hekimliği', 'Rutin muayene, hijyen, görüntüleme ve kişisel koruma planları.'],
      [
        'Gülüş restorasyonu',
        'Doğal görünümlü kron, implant ve dijital olarak planlanan restoratif tedaviler.',
      ],
      [
        'Konforlu ortodonti',
        'Çocuklar, gençler ve yetişkinler için şeffaf plak ve ortodonti seçenekleri.',
      ],
    ] as const,
    doctorTitle: 'Sizi dinleyen bir ekipten bakım',
    doctorText:
      'Hekimlerimiz her seçeneği sade bir dille açıklar; tedavi planını sağlığınız, konforunuz ve öncelikleriniz etrafında kurar.',
    formTitle: 'Randevu talep edin',
    formDescription:
      'Bilgilerinizi bırakın, hasta koordinatörümüz aynı iş günü içinde sizi arasın.',
    name: 'Ad soyad',
    phone: 'Telefon numarası',
    note: 'Size nasıl yardımcı olabiliriz?',
    send: 'Arama talep et',
  },
}

const serviceIcons = [
  <SafetyCertificateOutlined key="preventive" />,
  <SmileOutlined key="smile" />,
  <MedicineBoxOutlined key="orthodontics" />,
]

export function DentalClinicLandingPage({ standalone = false }: DentalClinicLandingPageProps) {
  const language = usePreferencesStore((state) => state.language)
  const text = copy[language]
  const rootPath = standalone ? '/preview/dental-clinic' : '/showcases/dental-clinic'

  const page = (
    <PublicSiteShell
      brand="Mira Dental"
      tagline={{ en: copy.en.tagline, tr: copy.tr.tagline }}
      className="dental-site"
      primary="#147d73"
      links={text.nav.map((label, index) => ({
        href: index === 0 ? rootPath : `${rootPath}#dental-${index}`,
        label: { en: copy.en.nav[index] ?? label, tr: copy.tr.nav[index] ?? label },
      }))}
    >
      <section className="showcase-hero dental-hero">
        <div className="showcase-hero__copy">
          <Tag variant="filled" color="cyan" icon={<HeartOutlined />}>
            {text.eyebrow}
          </Tag>
          <Typography.Title>{text.title}</Typography.Title>
          <Typography.Paragraph>{text.description}</Typography.Paragraph>
          <Space wrap>
            <Button type="primary" size="large" icon={<CalendarOutlined />} href="#dental-3">
              {text.appointment}
            </Button>
            <Button size="large" icon={<PhoneOutlined />} href="tel:+902120001212">
              {text.call}
            </Button>
          </Space>
          <Flex className="dental-trust" gap={16} wrap>
            {text.trust.map((item) => (
              <Typography.Text key={item}>
                <CheckCircleFilled /> {item}
              </Typography.Text>
            ))}
          </Flex>
        </div>

        <Card className="dental-availability" variant="borderless">
          <div className="dental-smile-mark">
            <SmileOutlined />
          </div>
          <Typography.Title level={3}>
            {language === 'tr' ? 'Bugün size nasıl yardımcı olabiliriz?' : 'How can we help today?'}
          </Typography.Title>
          <Typography.Paragraph type="secondary">
            {language === 'tr'
              ? 'Acil durumlar için hafta içi aynı gün değerlendirme.'
              : 'Same-day weekday assessment for urgent concerns.'}
          </Typography.Paragraph>
          <Space orientation="vertical" className="full-width">
            <Button block size="large" icon={<ClockCircleOutlined />}>
              {language === 'tr' ? 'Uygun saatleri görüntüle' : 'View available times'}
            </Button>
            <Flex justify="space-between" align="center">
              <Avatar.Group>
                <Avatar>EA</Avatar>
                <Avatar>MK</Avatar>
                <Avatar>SL</Avatar>
              </Avatar.Group>
              <Typography.Text>
                <StarFilled /> 4.9 / 5
              </Typography.Text>
            </Flex>
          </Space>
        </Card>
      </section>

      <section className="showcase-section dental-services" id="dental-1">
        <div className="showcase-section__heading">
          <Typography.Title level={2}>{text.servicesTitle}</Typography.Title>
          <Typography.Paragraph>{text.servicesDescription}</Typography.Paragraph>
        </div>
        <Row gutter={[20, 20]}>
          {text.services.map(([title, description], index) => (
            <Col xs={24} lg={8} key={title}>
              <Card className="showcase-feature-card" variant="borderless">
                <div className="showcase-feature-card__icon">{serviceIcons[index]}</div>
                <Typography.Title level={4}>{title}</Typography.Title>
                <Typography.Paragraph type="secondary">{description}</Typography.Paragraph>
                <Button type="link">
                  {language === 'tr' ? 'Tedaviyi incele' : 'Explore treatment'}
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      <section className="showcase-section dental-team" id="dental-2">
        <Row gutter={[40, 32]} align="middle">
          <Col xs={24} lg={10}>
            <div className="dental-portrait" aria-hidden="true">
              <div className="dental-portrait__badge">
                <SafetyCertificateOutlined /> 18{' '}
                {language === 'tr' ? 'yıllık deneyim' : 'years of care'}
              </div>
            </div>
          </Col>
          <Col xs={24} lg={14}>
            <Typography.Title level={2}>{text.doctorTitle}</Typography.Title>
            <Typography.Paragraph>{text.doctorText}</Typography.Paragraph>
            <Typography.Title level={4}>Dr. Ece Arslan</Typography.Title>
            <Typography.Text type="secondary">
              {language === 'tr'
                ? 'Kurucu hekim · Restoratif diş hekimliği'
                : 'Clinical director · Restorative dentistry'}
            </Typography.Text>
          </Col>
        </Row>
      </section>

      <section className="showcase-section" id="dental-3">
        <Card className="dental-form" variant="borderless">
          <Row gutter={[32, 24]} align="middle">
            <Col xs={24} lg={9}>
              <Typography.Title level={2}>{text.formTitle}</Typography.Title>
              <Typography.Paragraph>{text.formDescription}</Typography.Paragraph>
            </Col>
            <Col xs={24} lg={15}>
              <Form layout="vertical">
                <Row gutter={12}>
                  <Col xs={24} sm={12}>
                    <Form.Item label={text.name} required>
                      <Input size="large" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item label={text.phone} required>
                      <Input size="large" />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item label={text.note}>
                  <Input.TextArea rows={3} />
                </Form.Item>
                <Button type="primary" size="large">
                  {text.send}
                </Button>
              </Form>
            </Col>
          </Row>
        </Card>
      </section>
    </PublicSiteShell>
  )

  return (
    <ShowcasePreviewFrame
      standalone={standalone}
      standalonePath="/preview/dental-clinic"
      title={{ en: 'Dental clinic landing page', tr: 'Diş kliniği landing page' }}
      description={{
        en: 'A calm patient-facing website composed from Ant Design form and display components.',
        tr: 'Ant Design form ve gösterim bileşenleriyle oluşturulmuş sakin bir hasta deneyimi.',
      }}
    >
      {page}
    </ShowcasePreviewFrame>
  )
}
