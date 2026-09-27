import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { Button, Drawer, Flex, Grid, Layout, Menu, Tooltip, Typography, type MenuProps } from 'antd'
import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router'
import { AppVersion } from '@/components/AppVersion/AppVersion'
import { GlobalSearch } from '@/components/GlobalSearch/GlobalSearch'
import { HeaderNotifications } from '@/components/HeaderNotifications/HeaderNotifications'
import { LanguageSelect } from '@/components/LanguageSelect/LanguageSelect'
import { ProfileMenu } from '@/components/ProfileMenu/ProfileMenu'
import { ColorModeControl } from '@/components/ThemeControls/ThemeControls'
import { env } from '@/config/env'
import { useMessages } from '@/i18n/messages'
import { usePreferencesStore } from '@/store/preferences-store'
import { navigationKeyFor, sectionKeyFor, useNavigationSections } from '@/router/navigation'
import { officialThemeBackgrounds } from '@/theme/useOfficialTheme'
import './App.css'

const { Content, Footer, Header, Sider } = Layout
/**
 * A short fold for opening and shutting a section. It skips the first paint, so the section
 * holding the current page is simply open on load instead of sliding open, which is why the
 * motion was switched off before. The timing lives with the class names in App.css.
 */
const menuMotion: MenuProps['motion'] = {
  motionName: 'admin-menu-fold',
  motionAppear: false,
  motionDeadline: 400,
  onEnterStart: () => ({ height: 0, opacity: 0 }),
  onEnterActive: (node) => ({ height: node.scrollHeight, opacity: 1 }),
  onLeaveStart: (node) => ({ height: node.offsetHeight }),
  onLeaveActive: () => ({ height: 0, opacity: 0 }),
}

function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const messages = useMessages()
  const [collapsed, setCollapsed] = useState(false)
  /**
   * On a narrow screen the menu is a drawer over the page rather than a column beside it: a
   * sider opened there took 280px from a 390px screen and crushed the page into what was left.
   */
  const isDesktop = Grid.useBreakpoint().lg ?? false
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [lastPathname, setLastPathname] = useState(location.pathname)
  // Arriving somewhere puts the drawer away, however the reader got there.
  if (lastPathname !== location.pathname) {
    setLastPathname(location.pathname)
    setDrawerOpen(false)
  }
  const menuOpen = isDesktop ? !collapsed : drawerOpen
  const navigationSections = useNavigationSections()
  const visualTheme = usePreferencesStore((state) => state.visualTheme)
  const backgroundImage = officialThemeBackgrounds[visualTheme]
  const backgroundStyle = backgroundImage
    ? ({ '--official-theme-background': `url(${backgroundImage})` } as CSSProperties)
    : undefined
  const navigationItems = useMemo(
    () =>
      navigationSections.map((section) => ({
        key: section.key,
        icon: section.icon,
        label: section.label,
        children: section.children.map((entry) => ({
          key: entry.key,
          icon: entry.icon,
          label: entry.label,
        })),
      })),
    [navigationSections],
  )

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
      : navigationKeyFor(navigationSections, location.pathname)

  const activeSectionKey = sectionKeyFor(navigationSections, selectedNavigationKey)
  const [openKeys, setOpenKeys] = useState<string[]>(() =>
    activeSectionKey ? [activeSectionKey] : [],
  )
  const [lastSectionKey, setLastSectionKey] = useState(activeSectionKey)

  /**
   * With nine sections the menu is only readable when most of them are shut, so the one
   * holding the current page is opened and the rest are left alone. Adjusting during
   * render rather than in an effect keeps the section from drawing closed for a frame
   * after a deep link or a jump from the header search.
   */
  if (lastSectionKey !== activeSectionKey) {
    setLastSectionKey(activeSectionKey)

    if (activeSectionKey) {
      setOpenKeys((current) =>
        current.includes(activeSectionKey) ? current : [...current, activeSectionKey],
      )
    }
  }

  // The drawer is always full width, so only the desktop rail ever draws the narrow brand.
  const railCollapsed = isDesktop && collapsed
  const navigation = (
    <>
      <Link
        className={`admin-brand${railCollapsed ? ' admin-brand--collapsed' : ''}`}
        to="/dashboard"
        aria-label={`${messages.shell.product} home`}
      >
        <img src="/favicon.svg" alt="" width="42" height="42" />
        {!railCollapsed && (
          <span>
            <Typography.Text strong>{messages.shell.product}</Typography.Text>
            <Typography.Text type="secondary">{messages.shell.workspace}</Typography.Text>
          </span>
        )}
      </Link>
      <Menu
        mode="inline"
        motion={menuMotion}
        openKeys={openKeys}
        onOpenChange={(keys) => setOpenKeys(keys)}
        selectedKeys={[selectedNavigationKey]}
        items={navigationItems}
        onClick={({ key }) => {
          // Also closes on the page already open, where the pathname does not change.
          setDrawerOpen(false)
          void navigate(key)
        }}
      />
    </>
  )

  return (
    <Layout className="admin-shell" data-visual-theme={visualTheme} style={backgroundStyle}>
      {isDesktop ? (
        <Sider
          className="admin-sider"
          collapsed={collapsed}
          collapsedWidth={80}
          collapsible
          theme="light"
          trigger={null}
          width={280}
        >
          {navigation}
        </Sider>
      ) : (
        <Drawer
          open={drawerOpen}
          placement="left"
          size={280}
          closable={false}
          onClose={() => setDrawerOpen(false)}
          className="admin-drawer"
          styles={{ body: { padding: 0 } }}
          aria-label={messages.shell.navigation}
        >
          {navigation}
        </Drawer>
      )}

      <Layout className="admin-workspace">
        <Header className="admin-header">
          <Flex className="admin-header__lead" align="center" gap={12}>
            <Tooltip title={menuOpen ? messages.shell.collapseMenu : messages.shell.expandMenu}>
              <Button
                aria-expanded={menuOpen}
                aria-label={menuOpen ? messages.shell.collapseMenu : messages.shell.expandMenu}
                icon={menuOpen ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
                type="text"
                onClick={() => (isDesktop ? setCollapsed(!collapsed) : setDrawerOpen(!drawerOpen))}
              />
            </Tooltip>

            <GlobalSearch />
          </Flex>

          <Flex className="admin-header__actions" align="center" gap={10}>
            <ColorModeControl variant="menu" />
            <LanguageSelect />
            <HeaderNotifications />
            <ProfileMenu />
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
