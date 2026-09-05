import {
  AppstoreOutlined,
  BellOutlined,
  DashboardOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { Avatar, Badge, Button, Flex, Layout, Menu, Tooltip, Typography } from 'antd'
import { useEffect, useMemo, type CSSProperties } from 'react'
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
  const language = usePreferencesStore((state) => state.language)
  const visualTheme = usePreferencesStore((state) => state.visualTheme)
  const backgroundImage = officialThemeBackgrounds[visualTheme]
  const backgroundStyle = backgroundImage
    ? ({ '--official-theme-background': `url(${backgroundImage})` } as CSSProperties)
    : undefined

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const navigationItems = useMemo(
    () => [
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
        key: '/settings',
        icon: <SettingOutlined />,
        label: messages.navigation.settings,
      },
    ],
    [messages],
  )

  const navigation = (
    <>
      <Link className="admin-brand" to="/dashboard" aria-label={`${messages.shell.product} home`}>
        <img src="/favicon.svg" alt="" width="42" height="42" />
        <span>
          <Typography.Text strong>{messages.shell.product}</Typography.Text>
          <Typography.Text type="secondary">{messages.shell.workspace}</Typography.Text>
        </span>
      </Link>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={navigationItems}
        onClick={({ key }) => {
          void navigate(key)
        }}
      />
    </>
  )

  return (
    <Layout className="admin-shell">
      <Sider className="admin-sider" breakpoint="lg" collapsedWidth="0" theme="light" width={252}>
        {navigation}
      </Sider>

      <Layout className="admin-workspace" style={backgroundStyle}>
        <Header className="admin-header">
          <Flex className="admin-header__actions" align="center" gap={10}>
            <ColorModeControl size="small" variant="menu" />
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
