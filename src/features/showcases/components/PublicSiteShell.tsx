import { MenuOutlined, MoonOutlined, SunOutlined } from '@ant-design/icons'
import {
  Button,
  ConfigProvider,
  Dropdown,
  Flex,
  Grid,
  Layout,
  Space,
  theme,
  Tooltip,
  Typography,
} from 'antd'
import GB from 'country-flag-icons/react/3x2/GB'
import TR from 'country-flag-icons/react/3x2/TR'
import type { MouseEvent, ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { useShowcaseTheme } from '@/features/showcases/hooks'
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
  /** Where the brand leads; the first link when left out. */
  homeHref?: string
  /** A site's own footer; left out, the brand and the copyright line. */
  footer?: ReactNode
  /** Offer the light/dark switch. Only for a site whose styles have a dark side. */
  colorModeToggle?: boolean
  /** Always use the dark palette, for a site that is dark by design such as a stage. */
  alwaysDark?: boolean
}

const lightTokens = {
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
}

const darkTokens = {
  colorBgBase: '#0b1022',
  colorBgContainer: '#131a33',
  colorBgElevated: '#182041',
  colorBgLayout: '#0b1022',
  colorBorder: '#2a3563',
  colorBorderSecondary: '#1f2850',
  colorText: '#e6ebff',
  colorTextBase: '#e6ebff',
  colorTextHeading: '#f5f7ff',
  colorTextSecondary: '#9aa6cf',
  colorTextTertiary: '#6f7aa3',
}

/**
 * The link for the page being shown: the longest one the address starts with, so a company
 * page lights up "Companies" and the site root only lights up for itself. Hash links point
 * into a page rather than at one, so they are never the current page.
 */
function currentLink(links: SiteLink[], pathname: string): string | undefined {
  return links
    .filter(({ href }) => !href.includes('#'))
    .filter(({ href }) => pathname === href || pathname.startsWith(`${href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href
}

/** A plain left click, the only kind the router should take over from the browser. */
function isPlainClick(event: MouseEvent) {
  return (
    !event.defaultPrevented &&
    event.button === 0 &&
    !(event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
  )
}

export function PublicSiteShell({
  brand,
  children,
  className,
  links,
  primary,
  tagline,
  homeHref,
  footer,
  colorModeToggle = false,
  alwaysDark = false,
}: PublicSiteShellProps) {
  const language = usePreferencesStore((state) => state.language)
  const setLanguage = usePreferencesStore((state) => state.setLanguage)
  const storedMode = useShowcaseTheme((state) => state.colorMode)
  const toggleColorMode = useShowcaseTheme((state) => state.toggleColorMode)
  const isDesktop = Grid.useBreakpoint().md ?? false
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const active = currentLink(links, pathname)
  const dark = alwaysDark || (colorModeToggle && storedMode === 'dark')
  // The flag of the language a click switches to, which is what the button offers.
  const NextFlag = language === 'tr' ? GB : TR
  const nextLanguageLabel = language === 'tr' ? 'Switch to English' : 'Türkçeye geç'
  const colorModeLabel =
    language === 'tr'
      ? dark
        ? 'Açık temaya geç'
        : 'Koyu temaya geç'
      : dark
        ? 'Switch to light theme'
        : 'Switch to dark theme'

  return (
    <ConfigProvider
      theme={{
        inherit: false,
        algorithm: dark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: primary,
          ...(dark ? darkTokens : lightTokens),
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
      <Layout
        className={`public-showcase ${className}${dark ? ' public-showcase--dark' : ''}`}
        data-color-mode={dark ? 'dark' : 'light'}
      >
        <header className="public-showcase__header">
          <Link className="public-showcase__brand" to={homeHref ?? links[0]?.href ?? '/'}>
            <span className="public-showcase__brand-mark" aria-hidden="true" />
            <span>
              <Typography.Text strong>{brand}</Typography.Text>
              <Typography.Text type="secondary">{tagline[language]}</Typography.Text>
            </span>
          </Link>

          {isDesktop ? (
            <nav className="public-showcase__nav" aria-label="Website">
              {links.map((item) => {
                const current = item.href === active

                return (
                  <Button
                    key={item.href}
                    type="text"
                    href={item.href}
                    // Keep the real href for new tabs, but move inside the app without a reload.
                    onClick={(event) => {
                      if (!item.href.startsWith('/') || !isPlainClick(event)) return
                      event.preventDefault()
                      void navigate(item.href)
                    }}
                    className={current ? 'is-active' : undefined}
                    aria-current={current ? 'page' : undefined}
                  >
                    {item.label[language]}
                  </Button>
                )
              })}
            </nav>
          ) : (
            <Dropdown
              menu={{
                selectedKeys: active ? [active] : [],
                items: links.map((item) => ({
                  key: item.href,
                  label: <Link to={item.href}>{item.label[language]}</Link>,
                })),
              }}
              trigger={['click']}
            >
              <Button
                className="public-showcase__mobile-menu"
                aria-label={language === 'tr' ? 'Site menüsü' : 'Website navigation'}
                icon={<MenuOutlined />}
              />
            </Dropdown>
          )}

          <Space size={8} className="public-showcase__actions">
            {colorModeToggle && (
              <Tooltip title={colorModeLabel}>
                <Button
                  aria-label={colorModeLabel}
                  aria-pressed={dark}
                  icon={dark ? <SunOutlined /> : <MoonOutlined />}
                  onClick={toggleColorMode}
                />
              </Tooltip>
            )}
            <Tooltip title={nextLanguageLabel}>
              <Button
                className="public-showcase__language"
                aria-label={nextLanguageLabel}
                icon={<NextFlag aria-hidden="true" className="public-showcase__flag" />}
                onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')}
              />
            </Tooltip>
          </Space>
        </header>

        <main>{children}</main>

        <footer className="public-showcase__footer">
          {footer ?? (
            <Flex justify="space-between" align="center" gap={16} wrap>
              <Space orientation="vertical" size={0}>
                <Typography.Text strong>{brand}</Typography.Text>
                <Typography.Text type="secondary">{tagline[language]}</Typography.Text>
              </Space>
              <Typography.Text type="secondary">
                © 2026 {brand}.{' '}
                {language === 'tr' ? 'Tüm hakları saklıdır.' : 'All rights reserved.'}
              </Typography.Text>
            </Flex>
          )}
        </footer>
      </Layout>
    </ConfigProvider>
  )
}
