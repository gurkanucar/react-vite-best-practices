import { GlobalOutlined } from '@ant-design/icons'
import { Button, ConfigProvider, Flex, Layout, Space, theme, Typography } from 'antd'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { usePreferencesStore } from '@/store/preferences-store'

interface SiteLink {
  href: string
  label: { en: string; tr: string }
}

interface PublicSiteShellProps {
  brand: string
  children: ReactNode
  className: string
  links: SiteLink[]
  primary: string
  tagline: { en: string; tr: string }
}

export function PublicSiteShell({
  brand,
  children,
  className,
  links,
  primary,
  tagline,
}: PublicSiteShellProps) {
  const language = usePreferencesStore((state) => state.language)
  const setLanguage = usePreferencesStore((state) => state.setLanguage)

  return (
    <ConfigProvider
      theme={{
        inherit: false,
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: primary,
          colorBgBase: '#ffffff',
          colorBgContainer: '#ffffff',
          colorBgElevated: '#ffffff',
          colorBgLayout: '#ffffff',
          colorBorder: '#dfe3e8',
          colorBorderSecondary: '#eef0f2',
          colorText: '#1c252e',
          colorTextBase: '#1c252e',
          colorTextHeading: '#1c252e',
          colorTextSecondary: '#637381',
          colorTextTertiary: '#919eab',
          borderRadius: 10,
          borderRadiusLG: 18,
          fontFamily:
            "Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        },
        components: {
          Button: { fontWeight: 600, primaryShadow: 'none' },
          Card: { paddingLG: 24 },
        },
      }}
    >
      <Layout className={`public-showcase ${className}`}>
        <header className="public-showcase__header">
          <Link className="public-showcase__brand" to={links[0]?.href ?? '/'}>
            <span className="public-showcase__brand-mark" aria-hidden="true" />
            <span>
              <Typography.Text strong>{brand}</Typography.Text>
              <Typography.Text type="secondary">{tagline[language]}</Typography.Text>
            </span>
          </Link>

          <nav className="public-showcase__nav" aria-label="Website">
            {links.map((item) => (
              <Button key={item.href} type="text" href={item.href}>
                {item.label[language]}
              </Button>
            ))}
          </nav>

          <Button
            aria-label={language === 'tr' ? 'Switch to English' : 'Türkçeye geç'}
            icon={<GlobalOutlined />}
            onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')}
          >
            {language === 'tr' ? 'EN' : 'TR'}
          </Button>
        </header>

        <main>{children}</main>

        <footer className="public-showcase__footer">
          <Flex justify="space-between" align="center" gap={16} wrap>
            <Space orientation="vertical" size={0}>
              <Typography.Text strong>{brand}</Typography.Text>
              <Typography.Text type="secondary">{tagline[language]}</Typography.Text>
            </Space>
            <Typography.Text type="secondary">
              © 2026 {brand}. {language === 'tr' ? 'Tüm hakları saklıdır.' : 'All rights reserved.'}
            </Typography.Text>
          </Flex>
        </footer>
      </Layout>
    </ConfigProvider>
  )
}
