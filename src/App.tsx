import {
  AppstoreOutlined,
  BgColorsOutlined,
  BellOutlined,
  DashboardOutlined,
  DatabaseOutlined,
  FolderOpenOutlined,
  FormOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { Avatar, Badge, Button, Flex, Layout, Menu, Tooltip, Typography } from 'antd'
import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router'
import { AppVersion } from '@/components/AppVersion/AppVersion'
import { LanguageSelect } from '@/components/LanguageSelect/LanguageSelect'
import { ColorModeControl } from '@/components/ThemeControls/ThemeControls'
import { useMessages } from '@/i18n/messages'
import { usePreferencesStore } from '@/store/preferences-store'
import { officialThemeBackgrounds } from '@/theme/useOfficialTheme'
import './App.css'

const { Content, Footer, Header, Sider } = Layout

function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const messages = useMessages()
  const [collapsed, setCollapsed] = useState(false)
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

  const navigationItems = useMemo(
    () => [
      {
        key: 'workspace',
        icon: <FolderOpenOutlined />,
        label: messages.navigation.workspace,
        children: [
          {
            key: '/dashboard',
            icon: <DashboardOutlined />,
            label: messages.navigation.dashboard,
          },
          {
            key: '/components',
            icon: <AppstoreOutlined />,
            label: messages.navigation.components,
          },
          {
            key: '/survey',
            icon: <FormOutlined />,
            label: messages.navigation.survey,
          },
        ],
      },
      {
        key: 'configuration',
        icon: <SettingOutlined />,
        label: messages.navigation.configuration,
        children: [
          {
            key: '/settings#appearance',
            icon: <BgColorsOutlined />,
            label: messages.navigation.appearance,
          },
          {
            key: '/settings#state',
            icon: <DatabaseOutlined />,
            label: messages.navigation.persistedState,
          },
        ],
      },
    ],
    [messages],
  )

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
        items={navigationItems}
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
        collapsible
        theme="light"
        width={252}
        onCollapse={setCollapsed}
      >
        {navigation}
      </Sider>

      <Layout className="admin-workspace" style={backgroundStyle}>
        <Header className="admin-header">
          <Flex className="admin-header__actions" align="center" gap={10}>
            <ColorModeControl variant="menu" />
            <LanguageSelect />
            <Tooltip title="Notifications">
              <Badge dot offset={[-5, 5]}>
                <Button aria-label="Notifications" icon={<BellOutlined />} />
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
          <span>React Vite Best Practices</span>
          <AppVersion />
        </Footer>
      </Layout>
    </Layout>
  )
}

export default App
