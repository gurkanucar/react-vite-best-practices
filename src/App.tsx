import { BellOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { Avatar, Badge, Button, Flex, Grid, Layout, Menu, Tooltip, Typography } from 'antd'
import { useEffect, useState, type CSSProperties } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router'
import { AppVersion } from '@/components/AppVersion/AppVersion'
import { GlobalSearch } from '@/components/GlobalSearch/GlobalSearch'
import { LanguageSelect } from '@/components/LanguageSelect/LanguageSelect'
import { ColorModeControl } from '@/components/ThemeControls/ThemeControls'
import { env } from '@/config/env'
import { useMessages } from '@/i18n/messages'
import { usePreferencesStore } from '@/store/preferences-store'
import { useNavigationSections } from '@/router/navigation'
import { officialThemeBackgrounds } from '@/theme/useOfficialTheme'
import './App.css'

const { Content, Footer, Header, Sider } = Layout

function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const messages = useMessages()
  const [collapsed, setCollapsed] = useState(false)
  // On a narrow screen an icon rail is still a column of wasted width, so the sider
  // collapses to nothing instead and the header button is the only way back.
  const isDesktop = Grid.useBreakpoint().lg ?? false
  const navigationSections = useNavigationSections()
  const visualTheme = usePreferencesStore((state) => state.visualTheme)
  const backgroundImage = officialThemeBackgrounds[visualTheme]
  const backgroundStyle = backgroundImage
    ? ({ '--official-theme-background': `url(${backgroundImage})` } as CSSProperties)
    : undefined

  useEffect(() => {
    const target = document.getElementById(location.hash.slice(1))

    if (!target) return

    const targetBounds = target.getBoundingClientRect()
    const headerBottom = document.querySelector('header')?.getBoundingClientRect().bottom ?? 0
    const isVisible = targetBounds.top >= headerBottom && targetBounds.bottom <= window.innerHeight

    if (!isVisible) {
      target.scrollIntoView({ block: 'nearest' })
    }
  }, [location.hash])

  const selectedNavigationKey =
    location.pathname === '/settings'
      ? `/settings${location.hash === '#state' ? '#state' : '#appearance'}`
      : location.pathname

  const navigation = (
    <>
      <Link
        className={`admin-brand${collapsed ? ' admin-brand--collapsed' : ''}`}
        to="/dashboard"
        aria-label={`${messages.shell.product} home`}
      >
        <img src="/favicon.svg" alt="" width="42" height="42" />
        {!collapsed && (
          <span>
            <Typography.Text strong>{messages.shell.product}</Typography.Text>
            <Typography.Text type="secondary">{messages.shell.workspace}</Typography.Text>
          </span>
        )}
      </Link>
      <Menu
        defaultOpenKeys={['workspace', 'configuration']}
        mode="inline"
        selectedKeys={[selectedNavigationKey]}
        items={navigationSections.map((section) => ({
          key: section.key,
          icon: section.icon,
          label: section.label,
          children: section.children.map((entry) => ({
            key: entry.key,
            icon: entry.icon,
            label: entry.label,
          })),
        }))}
        onClick={({ key }) => {
          void navigate(key)
        }}
      />
    </>
  )

  return (
    <Layout className="admin-shell">
      <Sider
        breakpoint="lg"
        className="admin-sider"
        collapsed={collapsed}
        collapsedWidth={isDesktop ? 80 : 0}
        collapsible
        theme="light"
        trigger={null}
        width={252}
        onCollapse={setCollapsed}
      >
        {navigation}
      </Sider>

      <Layout className="admin-workspace" style={backgroundStyle}>
        <Header className="admin-header">
          <Flex className="admin-header__lead" align="center" gap={12}>
            <Tooltip title={collapsed ? messages.shell.expandMenu : messages.shell.collapseMenu}>
              <Button
                aria-expanded={!collapsed}
                aria-label={collapsed ? messages.shell.expandMenu : messages.shell.collapseMenu}
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                type="text"
                onClick={() => setCollapsed(!collapsed)}
              />
            </Tooltip>

            <GlobalSearch />
          </Flex>

          <Flex className="admin-header__actions" align="center" gap={10}>
            <ColorModeControl variant="menu" />
            <LanguageSelect />
            <Tooltip title={messages.common.notifications}>
              <Badge dot offset={[-5, 5]}>
                <Button aria-label={messages.common.notifications} icon={<BellOutlined />} />
              </Badge>
            </Tooltip>
            <Tooltip title={messages.shell.profile}>
              <Avatar className="admin-profile">DA</Avatar>
            </Tooltip>
          </Flex>
        </Header>

        <Content className="admin-content">
          <Outlet />
        </Content>

        <Footer className="admin-footer">
          <span>{env.appName}</span>
          <AppVersion />
        </Footer>
      </Layout>
    </Layout>
  )
}

export default App
