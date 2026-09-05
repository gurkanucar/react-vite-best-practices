import { ArrowLeftOutlined } from '@ant-design/icons'
import { Card, Flex, Typography } from 'antd'
import type { CSSProperties, ReactNode } from 'react'
import { Link } from 'react-router'
import { LanguageSelect } from '@/components/LanguageSelect/LanguageSelect'
import { ColorModeControl } from '@/components/ThemeControls/ThemeControls'
import { useMessages } from '@/i18n/messages'
import { usePreferencesStore } from '@/store/preferences-store'
import { officialThemeBackgrounds } from '@/theme/useOfficialTheme'
import './AuthPageLayout.css'

interface AuthPageLayoutProps {
  children: ReactNode
  description: string
  title: string
}

export function AuthPageLayout({ children, description, title }: AuthPageLayoutProps) {
  const messages = useMessages()
  const visualTheme = usePreferencesStore((state) => state.visualTheme)
  const backgroundImage = officialThemeBackgrounds[visualTheme]
  const backgroundStyle = backgroundImage
    ? ({ '--official-theme-background': `url(${backgroundImage})` } as CSSProperties)
    : undefined

  return (
    <main className="auth-shell" style={backgroundStyle}>
      <Flex className="auth-controls" align="center" gap="small">
        <ColorModeControl variant="menu" />
        <LanguageSelect />
      </Flex>

      <Card className="auth-card">
        <Flex className="auth-card__content" vertical gap="large">
          <div className="auth-card__heading">
            <Typography.Title level={2}>{title}</Typography.Title>
            <Typography.Paragraph type="secondary">{description}</Typography.Paragraph>
          </div>
          {children}
          <Link to="/" className="auth-home-link">
            <ArrowLeftOutlined /> {messages.auth.returnHome}
          </Link>
        </Flex>
      </Card>
    </main>
  )
}
