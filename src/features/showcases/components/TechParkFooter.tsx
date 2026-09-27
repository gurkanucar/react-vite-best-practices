import { EnvironmentOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons'
import { Button, Col, Divider, Flex, Form, Input, Row, Space, Typography } from 'antd'
import { useState } from 'react'
import { techParkContact, techParkFooterCopy } from '@/features/showcases/data'
import { usePreferencesStore } from '@/store/preferences-store'

/** The campus footer: who Aurora is, the pages people look for, how to reach it, a newsletter. */
export function TechParkFooter({ rootPath }: { rootPath: string }) {
  const language = usePreferencesStore((state) => state.language)
  const text = techParkFooterCopy[language]
  const [subscribed, setSubscribed] = useState(false)
  const about = `${rootPath}/about`
  const linkTargets = [
    about,
    `${rootPath}/programs`,
    `${about}#mission`,
    `${about}#structure`,
    `${about}#legal`,
  ]

  return (
    <div className="techpark-footer">
      <Row gutter={[40, 32]}>
        <Col xs={24} md={12} lg={7}>
          <Space orientation="vertical" size={12}>
            <Flex align="center" gap={10}>
              <span className="public-showcase__brand-mark" aria-hidden="true" />
              <Typography.Text strong className="techpark-footer__brand">
                Aurora Tech Park
              </Typography.Text>
            </Flex>
            <Typography.Paragraph type="secondary">{text.about}</Typography.Paragraph>
          </Space>
        </Col>

        <Col xs={12} md={6} lg={5}>
          <Typography.Title level={5}>{text.quickLinks}</Typography.Title>
          <nav aria-label={text.quickLinks}>
            <ul className="techpark-footer__links">
              {text.links.map((label, index) => (
                <li key={label}>
                  <a href={linkTargets[index]}>{label}</a>
                </li>
              ))}
            </ul>
          </nav>
        </Col>

        <Col xs={12} md={6} lg={5}>
          <Typography.Title level={5}>{text.contact}</Typography.Title>
          <address className="techpark-footer__contact">
            <a href={`tel:${techParkContact.phone.replaceAll(' ', '')}`}>
              <PhoneOutlined /> {techParkContact.phone}
            </a>
            <span>
              <EnvironmentOutlined /> {techParkContact.address[language]}, {techParkContact.city}
            </span>
            <a href={`mailto:${techParkContact.email}`}>
              <MailOutlined /> {techParkContact.email}
            </a>
          </address>
        </Col>

        <Col xs={24} md={12} lg={7}>
          <Typography.Title level={5}>{text.newsletter}</Typography.Title>
          <Typography.Paragraph type="secondary">{text.newsletterText}</Typography.Paragraph>
          {subscribed ? (
            <output className="techpark-footer__subscribed">{text.subscribed}</output>
          ) : (
            <Form<{ email: string }>
              layout="inline"
              className="techpark-footer__newsletter"
              onFinish={() => setSubscribed(true)}
            >
              <Form.Item
                name="email"
                rules={[{ required: true, type: 'email', message: text.newsletterInvalid }]}
              >
                <Input
                  type="email"
                  aria-label={text.newsletterPlaceholder}
                  placeholder={text.newsletterPlaceholder}
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  {text.subscribe}
                </Button>
              </Form.Item>
            </Form>
          )}
        </Col>
      </Row>

      <Divider />
      <Typography.Text type="secondary">© 2026 Aurora Tech Park. {text.rights}</Typography.Text>
    </div>
  )
}
