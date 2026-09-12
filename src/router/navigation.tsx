import {
  AppstoreOutlined,
  ApiOutlined,
  BgColorsOutlined,
  BookOutlined,
  BulbOutlined,
  CalendarOutlined,
  CloudServerOutlined,
  CompassOutlined,
  DashboardOutlined,
  DatabaseOutlined,
  ExperimentOutlined,
  FileDoneOutlined,
  FilePdfOutlined,
  FileTextOutlined,
  FlagOutlined,
  FolderOpenOutlined,
  FormOutlined,
  HddOutlined,
  IdcardOutlined,
  LineChartOutlined,
  PieChartOutlined,
  ProjectOutlined,
  ReadOutlined,
  RobotOutlined,
  SafetyOutlined,
  SettingOutlined,
  ShopOutlined,
  ShoppingOutlined,
  TagOutlined,
  TeamOutlined,
  TrophyOutlined,
  UnorderedListOutlined,
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
 *
 * Sections are grouped by what a reader is trying to do rather than by which feature
 * folder a page lives in: one flat list of everything grew to thirteen entries and stopped
 * being scannable.
 */
export function useNavigationSections(): NavigationSection[] {
  const messages = useMessages()

  return useMemo(
    () => [
      {
        key: 'overview',
        icon: <PieChartOutlined />,
        label: messages.navigation.overview,
        children: [
          { key: '/dashboard', icon: <DashboardOutlined />, label: messages.navigation.dashboard },
          { key: '/analytics', icon: <LineChartOutlined />, label: messages.navigation.analytics },
        ],
      },
      {
        key: 'workspace',
        icon: <FolderOpenOutlined />,
        label: messages.navigation.workspace,
        children: [
          { key: '/board', icon: <ProjectOutlined />, label: messages.navigation.board },
          { key: '/calendar', icon: <CalendarOutlined />, label: messages.navigation.calendar },
          { key: '/files', icon: <HddOutlined />, label: messages.navigation.files },
          { key: '/documents', icon: <FilePdfOutlined />, label: messages.navigation.documents },
        ],
      },
      {
        key: 'shop',
        icon: <ShopOutlined />,
        label: messages.navigation.shopSection,
        children: [
          { key: '/shop/product', icon: <TagOutlined />, label: messages.navigation.productDetail },
          {
            key: '/shop/order',
            icon: <ShoppingOutlined />,
            label: messages.navigation.orderDetail,
          },
          {
            key: '/shop/invoice',
            icon: <FileTextOutlined />,
            label: messages.navigation.invoiceDetail,
          },
        ],
      },
      {
        key: 'tours',
        icon: <CompassOutlined />,
        label: messages.navigation.toursSection,
        children: [
          { key: '/tours', icon: <UnorderedListOutlined />, label: messages.navigation.tourList },
          {
            key: '/tours/island-hopping',
            icon: <FlagOutlined />,
            label: messages.navigation.tourDetail,
          },
        ],
      },
      {
        key: 'learning',
        icon: <BookOutlined />,
        label: messages.navigation.learningSection,
        children: [
          {
            key: '/learning/courses',
            icon: <ReadOutlined />,
            label: messages.navigation.coursesNav,
          },
          { key: '/learning/exam', icon: <FileDoneOutlined />, label: messages.navigation.examNav },
          {
            key: '/learning/flashcards',
            icon: <BulbOutlined />,
            label: messages.navigation.flashcardsNav,
          },
          {
            key: '/learning/results',
            icon: <TrophyOutlined />,
            label: messages.navigation.resultsNav,
          },
        ],
      },
      {
        key: 'apis',
        icon: <ApiOutlined />,
        label: messages.navigation.apisSection,
        children: [
          { key: '/posts', icon: <CloudServerOutlined />, label: messages.navigation.postsApi },
          { key: '/products', icon: <ShoppingOutlined />, label: messages.navigation.productsApi },
        ],
      },
      {
        key: 'account',
        icon: <TeamOutlined />,
        label: messages.navigation.accountSection,
        children: [
          { key: '/profile', icon: <IdcardOutlined />, label: messages.navigation.profile },
          { key: '/account', icon: <SafetyOutlined />, label: messages.navigation.account },
        ],
      },
      {
        key: 'examples',
        icon: <ExperimentOutlined />,
        label: messages.navigation.examplesSection,
        children: [
          {
            key: '/components',
            icon: <AppstoreOutlined />,
            label: messages.navigation.components,
          },
          { key: '/survey', icon: <FormOutlined />, label: messages.navigation.survey },
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

/** The section a route belongs to, so the menu can open it without being told. */
export function sectionKeyFor(sections: NavigationSection[], routeKey: string): string | undefined {
  return sections.find((section) => section.children.some((entry) => entry.key === routeKey))?.key
}
