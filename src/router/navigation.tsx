import {
  AppstoreOutlined,
  BgColorsOutlined,
  CalendarOutlined,
  CloudServerOutlined,
  DashboardOutlined,
  DatabaseOutlined,
  FilePdfOutlined,
  FolderOpenOutlined,
  FormOutlined,
  HddOutlined,
  LineChartOutlined,
  ProjectOutlined,
  RobotOutlined,
  SettingOutlined,
  ShoppingOutlined,
} from '@ant-design/icons'
import { useMemo, type ReactNode } from 'react'
import { FEATURE_FLAGS } from '@/config/featureFlags'
import { useMessages } from '@/i18n/messages'

export interface NavigationEntry {
  /** The route the entry navigates to, including any hash. */
  key: string
  icon: ReactNode
  label: string
}

export interface NavigationSection {
  key: string
  icon: ReactNode
  label: string
  children: NavigationEntry[]
}

/**
 * One definition of where the application can go, shared by the sidebar menu and the
 * header search so a new page cannot appear in one and be missing from the other.
 */
export function useNavigationSections(): NavigationSection[] {
  const messages = useMessages()

  return useMemo(
    () => [
      {
        key: 'workspace',
        icon: <FolderOpenOutlined />,
        label: messages.navigation.workspace,
        children: [
          { key: '/dashboard', icon: <DashboardOutlined />, label: messages.navigation.dashboard },
          { key: '/analytics', icon: <LineChartOutlined />, label: messages.navigation.analytics },
          { key: '/board', icon: <ProjectOutlined />, label: messages.navigation.board },
          { key: '/calendar', icon: <CalendarOutlined />, label: messages.navigation.calendar },
          {
            key: '/components',
            icon: <AppstoreOutlined />,
            label: messages.navigation.components,
          },
          { key: '/survey', icon: <FormOutlined />, label: messages.navigation.survey },
          { key: '/posts', icon: <CloudServerOutlined />, label: messages.navigation.postsApi },
          { key: '/products', icon: <ShoppingOutlined />, label: messages.navigation.productsApi },
          { key: '/files', icon: <HddOutlined />, label: messages.navigation.files },
          { key: '/documents', icon: <FilePdfOutlined />, label: messages.navigation.documents },
          ...(FEATURE_FLAGS.assistant
            ? [
                {
                  key: '/assistant',
                  icon: <RobotOutlined />,
                  label: messages.navigation.assistant,
                },
              ]
            : []),
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
}
