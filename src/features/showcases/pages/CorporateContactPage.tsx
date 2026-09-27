import {
  ClockCircleOutlined,
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
  SendOutlined,
} from '@ant-design/icons'
import {
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Input,
  Radio,
  Result,
  Row,
  Select,
  Tag,
  Typography,
} from 'antd'
import { useState } from 'react'
import { CorporateSiteShell, ShowcasePreviewFrame } from '@/features/showcases/components'
import { usePreferencesStore } from '@/store/preferences-store'
import '../showcases.css'

interface CorporateContactPageProps {
  standalone?: boolean
}

type Topic = 'partnerships' | 'procurement' | 'investors' | 'media' | 'careers' | 'other'

interface CorporateContactValues {
  name: string
  email: string
  company?: string
  phone?: string
  topic: Topic
  reply: 'email' | 'phone'
  message: string
  consent: boolean
}

/** Invented offices: the numbers use the 555 range and the addresses a reserved domain. */
const offices = [
  {
    city: { en: 'Istanbul — headquarters', tr: 'İstanbul — genel merkez' },
    address: 'Northstar Plaza, Büyükdere Cd. No:120, 34394 Şişli',
    phone: '+90 212 555 01 86',
  },
  {
    city: { en: 'Ankara', tr: 'Ankara' },
    address: 'Kızılırmak Mah. 1450. Sk. No:8, 06510 Çankaya',
    phone: '+90 312 555 04 12',
  },
  {
    city: { en: 'Izmir', tr: 'İzmir' },
    address: 'Alsancak Liman Cd. No:44, 35220 Konak',
    phone: '+90 232 555 07 30',
  },
]

const desks = [
  { key: 'media', email: 'press@northstar-group.example' },
  { key: 'investors', email: 'ir@northstar-group.example' },
  { key: 'procurement', email: 'suppliers@northstar-group.example' },
  { key: 'careers', email: 'careers@northstar-group.example' },
] as const

const copy = {
  en: {
    eyebrow: 'Contact',
    title: 'Let’s talk.',
    description:
      'Partnerships, procurement, investor questions or a press request: write to us and the right team will answer within two business days.',
    formTitle: 'Send us a message',
    name: 'Full name',
    email: 'Work email',
    company: 'Company or organisation',
    phone: 'Phone',
    topic: 'What is it about?',
    topics: {
      partnerships: 'Partnerships and investment',
      procurement: 'Procurement and suppliers',
      investors: 'Investor relations',
      media: 'Media and press',
      careers: 'Careers',
      other: 'Something else',
    } satisfies Record<Topic, string>,
    reply: 'How should we reply?',
    replyEmail: 'By email',
    replyPhone: 'By phone',
    message: 'Message',
    messagePlaceholder: 'Tell us what you are working on and how we can help.',
    consent: 'I agree that Northstar may store my details to answer this message.',
    submit: 'Send message',
    required: 'This field is required',
    emailInvalid: 'Enter a valid email address',
    phoneRequired: 'Add a phone number so we can call you',
    messageTooShort: 'Please write at least 20 characters',
    consentRequired: 'We need your consent to reply',
    sentTitle: 'Message sent',
    sentDescription: (name: string) =>
      `Thank you, ${name}. The right team will get back to you within two business days.`,
    sendAnother: 'Send another message',
    officesTitle: 'Our offices',
    hours: 'Weekdays 09:00–18:00',
    desksTitle: 'Direct lines',
    desks: {
      media: 'Press office',
      investors: 'Investor relations',
      procurement: 'Supplier desk',
      careers: 'Careers',
    },
  },
  tr: {
    eyebrow: 'İletişim',
    title: 'Konuşalım.',
    description:
      'İş birliği, satın alma, yatırımcı soruları veya basın talebi: bize yazın, doğru ekip iki iş günü içinde yanıt versin.',
    formTitle: 'Bize mesaj gönderin',
    name: 'Ad soyad',
    email: 'İş e-postası',
    company: 'Şirket veya kurum',
    phone: 'Telefon',
    topic: 'Konu nedir?',
    topics: {
      partnerships: 'İş birliği ve yatırım',
      procurement: 'Satın alma ve tedarikçiler',
      investors: 'Yatırımcı ilişkileri',
      media: 'Medya ve basın',
      careers: 'Kariyer',
      other: 'Diğer',
    },
    reply: 'Size nasıl dönelim?',
    replyEmail: 'E-posta ile',
    replyPhone: 'Telefonla',
    message: 'Mesaj',
    messagePlaceholder: 'Neyle ilgilendiğinizi ve nasıl yardımcı olabileceğimizi yazın.',
    consent:
      'Bu mesajı yanıtlamak için bilgilerimin Northstar tarafından saklanmasını kabul ediyorum.',
    submit: 'Mesajı gönder',
    required: 'Bu alan zorunludur',
    emailInvalid: 'Geçerli bir e-posta adresi girin',
    phoneRequired: 'Sizi arayabilmemiz için telefon numarası ekleyin',
    messageTooShort: 'Lütfen en az 20 karakter yazın',
    consentRequired: 'Yanıt verebilmemiz için onayınız gerekiyor',
    sentTitle: 'Mesajınız gönderildi',
    sentDescription: (name: string) =>
      `Teşekkürler ${name}. İlgili ekip iki iş günü içinde size dönüş yapacak.`,
    sendAnother: 'Yeni mesaj gönder',
    officesTitle: 'Ofislerimiz',
    hours: 'Hafta içi 09:00–18:00',
    desksTitle: 'Doğrudan hatlar',
    desks: {
      media: 'Basın ofisi',
      investors: 'Yatırımcı ilişkileri',
      procurement: 'Tedarikçi masası',
      careers: 'Kariyer',
    },
  },
}

export function CorporateContactPage({ standalone = false }: CorporateContactPageProps) {
  const language = usePreferencesStore((state) => state.language)
  const text = copy[language]
  const [form] = Form.useForm<CorporateContactValues>()
  // A demo: nothing is sent, so the name is kept only to thank the sender.
  const [sentBy, setSentBy] = useState<string>()
  const reply = Form.useWatch('reply', form)

  const page = (
    <CorporateSiteShell standalone={standalone}>
      <section className="showcase-section publication-hero corporate-contact-hero">
        <Tag variant="filled" icon={<MailOutlined />}>
          {text.eyebrow}
        </Tag>
        <Typography.Title>{text.title}</Typography.Title>
        <Typography.Paragraph>{text.description}</Typography.Paragraph>
      </section>

      <section className="showcase-section corporate-contact-page">
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={15}>
            <Card className="corporate-contact-page__card" variant="borderless">
              {sentBy ? (
                <Result
                  status="success"
                  title={text.sentTitle}
                  subTitle={text.sentDescription(sentBy)}
                  extra={
                    <Button
                      onClick={() => {
                        form.resetFields()
                        setSentBy(undefined)
                      }}
                    >
                      {text.sendAnother}
                    </Button>
                  }
                />
              ) : (
                <>
                  <Typography.Title level={3}>{text.formTitle}</Typography.Title>
                  <Form<CorporateContactValues>
                    form={form}
                    layout="vertical"
                    requiredMark={false}
                    initialValues={{ reply: 'email' }}
                    onFinish={(values) => setSentBy(values.name.trim())}
                  >
                    <Row gutter={16}>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          name="name"
                          label={text.name}
                          rules={[{ required: true, whitespace: true, message: text.required }]}
                        >
                          <Input autoComplete="name" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          name="email"
                          label={text.email}
                          rules={[
                            { required: true, message: text.required },
                            { type: 'email', message: text.emailInvalid },
                          ]}
                        >
                          <Input type="email" autoComplete="email" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item name="company" label={text.company}>
                          <Input autoComplete="organization" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          name="phone"
                          label={text.phone}
                          dependencies={['reply']}
                          rules={[
                            {
                              required: reply === 'phone',
                              whitespace: true,
                              message: text.phoneRequired,
                            },
                          ]}
                        >
                          <Input type="tel" autoComplete="tel" />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col xs={24} sm={14}>
                        <Form.Item
                          name="topic"
                          label={text.topic}
                          rules={[{ required: true, message: text.required }]}
                        >
                          <Select
                            options={Object.entries(text.topics).map(([value, label]) => ({
                              value,
                              label,
                            }))}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={10}>
                        <Form.Item name="reply" label={text.reply}>
                          <Radio.Group
                            optionType="button"
                            options={[
                              { value: 'email', label: text.replyEmail },
                              { value: 'phone', label: text.replyPhone },
                            ]}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Form.Item
                      name="message"
                      label={text.message}
                      rules={[
                        { required: true, whitespace: true, message: text.required },
                        { min: 20, message: text.messageTooShort },
                      ]}
                    >
                      <Input.TextArea
                        rows={5}
                        showCount
                        maxLength={1000}
                        placeholder={text.messagePlaceholder}
                      />
                    </Form.Item>
                    <Form.Item
                      name="consent"
                      valuePropName="checked"
                      rules={[
                        {
                          validator: (_, value) =>
                            value
                              ? Promise.resolve()
                              : Promise.reject(new Error(text.consentRequired)),
                        },
                      ]}
                    >
                      <Checkbox>{text.consent}</Checkbox>
                    </Form.Item>
                    <Button type="primary" htmlType="submit" size="large" icon={<SendOutlined />}>
                      {text.submit}
                    </Button>
                  </Form>
                </>
              )}
            </Card>
          </Col>

          <Col xs={24} lg={9}>
            <div className="corporate-contact-page__aside">
              <Typography.Title level={3}>{text.officesTitle}</Typography.Title>
              {offices.map((office) => (
                <div className="corporate-office" key={office.phone}>
                  <Typography.Title level={5}>{office.city[language]}</Typography.Title>
                  <Typography.Text type="secondary">
                    <EnvironmentOutlined aria-hidden="true" /> {office.address}
                  </Typography.Text>
                  <a href={`tel:${office.phone.replaceAll(' ', '')}`}>
                    <PhoneOutlined aria-hidden="true" /> {office.phone}
                  </a>
                </div>
              ))}
              <Typography.Text type="secondary">
                <ClockCircleOutlined aria-hidden="true" /> {text.hours}
              </Typography.Text>

              <Typography.Title level={3}>{text.desksTitle}</Typography.Title>
              <dl className="corporate-desks">
                {desks.map((desk) => (
                  <div key={desk.key}>
                    <dt>{text.desks[desk.key]}</dt>
                    <dd>
                      <a href={`mailto:${desk.email}`}>{desk.email}</a>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Col>
        </Row>
      </section>
    </CorporateSiteShell>
  )

  return (
    <ShowcasePreviewFrame
      standalone={standalone}
      standalonePath="/preview/corporate/contact"
      title={{ en: 'Corporate contact page', tr: 'Kurumsal iletişim sayfası' }}
      description={{
        en: 'A validated enquiry form routed by topic, with offices and direct lines.',
        tr: 'Konuya göre yönlenen doğrulamalı iletişim formu, ofisler ve doğrudan hatlar.',
      }}
    >
      {page}
    </ShowcasePreviewFrame>
  )
}
