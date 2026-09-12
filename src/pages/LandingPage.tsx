import {
  ApiOutlined,
  CheckCircleOutlined,
  CodeOutlined,
  DashboardOutlined,
  ExperimentOutlined,
  LoginOutlined,
  SafetyCertificateOutlined,
  UserAddOutlined,
} from '@ant-design/icons'
import { Button, Card, Col, Descriptions, Flex, Layout, Row, Space, Tag, Typography } from 'antd'
import type { CSSProperties } from 'react'
import { Link, useNavigate } from 'react-router'
import { AppVersion } from '@/components/AppVersion/AppVersion'
import { LanguageSelect } from '@/components/LanguageSelect/LanguageSelect'
import { ColorModeControl } from '@/components/ThemeControls/ThemeControls'
import { env } from '@/config/env'
import { useMessages } from '@/i18n/messages'
import { usePreferencesStore } from '@/store/preferences-store'
import { officialThemeBackgrounds } from '@/theme/useOfficialTheme'
import './LandingPage.css'

const { Content, Footer, Header } = Layout

export function LandingPage() {
  const messages = useMessages()
  const navigate = useNavigate()
  const visualTheme = usePreferencesStore((state) => state.visualTheme)
  const backgroundImage = officialThemeBackgrounds[visualTheme]
  const backgroundStyle = backgroundImage
    ? ({ '--official-theme-background': `url(${backgroundImage})` } as CSSProperties)
    : undefined

  const features = [
    {
      icon: <CodeOutlined />,
      title: messages.landing.typedTitle,
      description: messages.landing.typedDescription,
    },
    {
      icon: <SafetyCertificateOutlined />,
      title: messages.landing.qualityTitle,
      description: messages.landing.qualityDescription,
    },
    {
      icon: <ExperimentOutlined />,
      title: messages.landing.uiTitle,
      description: messages.landing.uiDescription,
    },
  ]

  return (
    <Layout className="landing-shell" style={backgroundStyle}>
      <Header className="landing-header">
        <Flex
          className="landing-header__inner"
          align="center"
          justify="space-between"
          gap="middle"
          wrap
        >
          <Link className="landing-brand" to="/">
            <img src="/favicon.svg" alt="" width="40" height="40" />
            <Typography.Text strong>{env.appName}</Typography.Text>
          </Link>
          <Space wrap>
            <ColorModeControl variant="menu" />
            <LanguageSelect />
            <Button icon={<LoginOutlined />} onClick={() => void navigate('/login')}>
              {messages.auth.signIn}
            </Button>
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={() => void navigate('/register')}
            >
              {messages.auth.createAccount}
            </Button>
            <Button icon={<DashboardOutlined />} onClick={() => void navigate('/dashboard')}>
              {messages.landing.openDashboard}
            </Button>
          </Space>
        </Flex>
      </Header>

      <Content className="landing-content">
        <section className="landing-hero">
          <div>
            <Space orientation="vertical" size="large">
              <Tag icon={<CheckCircleOutlined />} color="success">
                {messages.landing.ready}
              </Tag>
              <Typography.Title>{messages.landing.title}</Typography.Title>
              <Typography.Paragraph>{messages.landing.description}</Typography.Paragraph>
              <Space size="middle" wrap>
                <Button type="primary" size="large" onClick={() => void navigate('/dashboard')}>
                  {messages.landing.exploreDashboard}
                </Button>
                <Button size="large" onClick={() => void navigate('/components')}>
                  {messages.landing.viewComponents}
                </Button>
              </Space>
            </Space>
          </div>

          <Card title={messages.landing.foundationTitle} extra={<ApiOutlined />}>
            <Descriptions
              column={1}
              items={[
                { key: 'runtime', label: 'Runtime', children: 'React 19 + TypeScript 6' },
                { key: 'build', label: 'Build', children: 'Vite 8 + pnpm' },
                { key: 'ui', label: 'Interface', children: 'Ant Design 6' },
                { key: 'routing', label: 'Routing', children: 'React Router 8' },
                { key: 'state', label: 'State', children: 'Zustand 5' },
              ]}
            />
            <Space orientation="vertical">
              <Typography.Text strong>{messages.landing.included}</Typography.Text>
              {messages.landing.includedItems.map((item) => (
                <Typography.Text key={item}>
                  <Space>
                    <CheckCircleOutlined />
                    {item}
                  </Space>
                </Typography.Text>
              ))}
            </Space>
          </Card>
        </section>

        <Row gutter={[16, 16]}>
          {features.map((feature) => (
            <Col xs={24} md={8} key={feature.title}>
              <Card
                title={
                  <Space>
                    {feature.icon}
                    {feature.title}
                  </Space>
                }
              >
                <Typography.Paragraph type="secondary">{feature.description}</Typography.Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </Content>

      <Footer className="landing-footer">
        <span>{messages.landing.footer}</span>
        <AppVersion />
      </Footer>
    </Layout>
  )
}
