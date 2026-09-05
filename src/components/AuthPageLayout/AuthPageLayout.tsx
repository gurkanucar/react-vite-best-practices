import { ArrowLeftOutlined } from '@ant-design/icons'
import { Card, Flex, Layout, Space, Typography } from 'antd'
import type { CSSProperties, ReactNode } from 'react'
import { Link } from 'react-router'
import { AppVersion } from '@/components/AppVersion/AppVersion'
import { LanguageSelect } from '@/components/LanguageSelect/LanguageSelect'
import { ThemeControls } from '@/components/ThemeControls/ThemeControls'
import { usePreferencesStore } from '@/store/preferences-store'
import { officialThemeBackgrounds } from '@/theme/useOfficialTheme'
import './AuthPageLayout.css'

const { Content, Footer, Header } = Layout

interface AuthPageLayoutProps {
  children: ReactNode
  description: string
  title: string
}

export function AuthPageLayout({ children, description, title }: AuthPageLayoutProps) {
  const visualTheme = usePreferencesStore((state) => state.visualTheme)
  const backgroundImage = officialThemeBackgrounds[visualTheme]
  const backgroundStyle = backgroundImage
    ? ({ '--official-theme-background': `url(${backgroundImage})` } as CSSProperties)
    : undefined

  return (
    <Layout className="auth-shell" style={backgroundStyle}>
      <Header className="auth-header">
        <Flex align="center" justify="space-between" gap="middle" wrap>
          <Link className="auth-brand" to="/">
            <img src="/favicon.svg" alt="" width="40" height="40" />
            <Typography.Text strong>React Vite Best Practices</Typography.Text>
          </Link>
          <Space wrap>
            <LanguageSelect />
            <ThemeControls />
          </Space>
        </Flex>
      </Header>

      <Content className="auth-content">
        <Card className="auth-card">
          <Space orientation="vertical" size="large" className="full-width">
            <div>
              <Typography.Title level={2}>{title}</Typography.Title>
              <Typography.Paragraph type="secondary">{description}</Typography.Paragraph>
            </div>
            {children}
            <Link to="/" className="auth-home-link">
              <ArrowLeftOutlined /> Return to home
            </Link>
          </Space>
        </Card>
      </Content>

      <Footer className="auth-footer">
        <span>React Vite Best Practices</span>
        <AppVersion />
      </Footer>
    </Layout>
  )
}
