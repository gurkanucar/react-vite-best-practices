import {
  ClockCircleOutlined,
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
  SafetyCertificateOutlined,
  SendOutlined,
} from '@ant-design/icons'
import {
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Input,
  Result,
  Row,
  Select,
  Tag,
  Typography,
} from 'antd'
import { useState, type ReactNode } from 'react'
import { CampusMap } from '@/features/showcases/components/CampusMap'
import { ShowcasePreviewFrame, TechParkSiteShell } from '@/features/showcases/components'
import { techParkContact, techParkContactCopy } from '@/features/showcases/data'
import { usePreferencesStore } from '@/store/preferences-store'
import '../showcases.css'

interface TechParkContactPageProps {
  standalone?: boolean
}

interface ContactFormValues {
  name: string
  email: string
  phone?: string
  company?: string
  topic: keyof (typeof techParkContactCopy)['en']['topics']
  message: string
  consent: boolean
}

function ContactDetail({
  icon,
  label,
  children,
}: {
  icon: ReactNode
  label: string
  children: ReactNode
}) {
  return (
    <div className="techpark-contact-detail">
      <span className="techpark-contact-detail__icon" aria-hidden="true">
        {icon}
      </span>
      <div>
        <Typography.Text type="secondary">{label}</Typography.Text>
        <div>{children}</div>
      </div>
    </div>
  )
}

export function TechParkContactPage({ standalone = false }: TechParkContactPageProps) {
  const language = usePreferencesStore((state) => state.language)
  const text = techParkContactCopy[language]
  const rootPath = standalone ? '/preview/technopark' : '/showcases/technopark'
  const [form] = Form.useForm<ContactFormValues>()
  // Only a demo: the message goes nowhere, so "sent" is the name to thank, kept for the result.
  const [sentBy, setSentBy] = useState<string>()
  const address = `${techParkContact.address[language]}, ${techParkContact.city}`

  const page = (
    <TechParkSiteShell rootPath={rootPath}>
      <section className="showcase-section techpark-about-hero">
        <Tag color="blue" variant="filled" icon={<MailOutlined />}>
          {text.eyebrow}
        </Tag>
        <Typography.Title>{text.title}</Typography.Title>
        <Typography.Paragraph className="techpark-about-hero__description">
          {text.description}
        </Typography.Paragraph>
      </section>

      <section className="showcase-section techpark-contact-page">
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={14}>
            <Card className="techpark-about-card" variant="borderless">
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
                  <Form<ContactFormValues>
                    form={form}
                    layout="vertical"
                    requiredMark={false}
                    onFinish={(values) => setSentBy(values.name.trim())}
                  >
                    <Row gutter={16}>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          name="name"
                          label={text.name}
                          rules={[{ required: true, whitespace: true, message: text.nameRequired }]}
                        >
                          <Input placeholder={text.namePlaceholder} autoComplete="name" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          name="email"
                          label={text.email}
                          rules={[
                            { required: true, message: text.emailRequired },
                            { type: 'email', message: text.emailInvalid },
                          ]}
                        >
                          <Input
                            type="email"
                            placeholder={text.emailPlaceholder}
                            autoComplete="email"
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item name="phone" label={text.phone}>
                          <Input type="tel" autoComplete="tel" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item name="company" label={text.company}>
                          <Input autoComplete="organization" />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Form.Item
                      name="topic"
                      label={text.topic}
                      rules={[{ required: true, message: text.topicRequired }]}
                    >
                      <Select
                        options={Object.entries(text.topics).map(([value, label]) => ({
                          value,
                          label,
                        }))}
                      />
                    </Form.Item>
                    <Form.Item
                      name="message"
                      label={text.message}
                      rules={[
                        { required: true, whitespace: true, message: text.messageRequired },
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

          <Col xs={24} lg={10}>
            <Card
              className="techpark-about-card techpark-contact-page__details"
              variant="borderless"
            >
              <Typography.Title level={3}>{text.detailsTitle}</Typography.Title>
              <ContactDetail icon={<PhoneOutlined />} label={text.phoneLabel}>
                <a href={`tel:${techParkContact.phone.replaceAll(' ', '')}`}>
                  {techParkContact.phone}
                </a>
              </ContactDetail>
              <ContactDetail icon={<MailOutlined />} label={text.emailLabel}>
                <a href={`mailto:${techParkContact.email}`}>{techParkContact.email}</a>
              </ContactDetail>
              <ContactDetail icon={<SafetyCertificateOutlined />} label={text.kepLabel}>
                {techParkContact.kep}
              </ContactDetail>
              <ContactDetail icon={<EnvironmentOutlined />} label={text.addressLabel}>
                {address}
              </ContactDetail>
              <ContactDetail icon={<ClockCircleOutlined />} label={text.hoursLabel}>
                {techParkContact.hours[language]}
              </ContactDetail>
            </Card>
          </Col>
        </Row>

        <div className="techpark-contact-page__map">
          <CampusMap
            position={techParkContact.position}
            label="Aurora Tech Park"
            address={address}
          />
        </div>
      </section>
    </TechParkSiteShell>
  )

  return (
    <ShowcasePreviewFrame
      standalone={standalone}
      standalonePath="/preview/technopark/contact"
      title={{ en: 'Tech park contact page', tr: 'Teknopark iletişim sayfası' }}
      description={{
        en: 'A validated contact form, the campus desk details and a Leaflet map.',
        tr: 'Doğrulamalı iletişim formu, kampüs masası bilgileri ve Leaflet haritası.',
      }}
    >
      {page}
    </ShowcasePreviewFrame>
  )
}
