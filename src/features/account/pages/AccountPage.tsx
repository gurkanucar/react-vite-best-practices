import {
  BellOutlined,
  CreditCardOutlined,
  IdcardOutlined,
  KeyOutlined,
  ShareAltOutlined,
} from '@ant-design/icons'
import { Breadcrumb, Flex, Tabs } from 'antd'
import { useSearchParams } from 'react-router'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import {
  BillingTab,
  GeneralTab,
  NotificationsTab,
  SecurityTab,
  SocialLinksTab,
} from '@/features/account/components'
import { ACCOUNT_TABS, type AccountTab } from '@/features/account/types'
import { useMessages } from '@/i18n/messages'

const icons: Record<AccountTab, typeof IdcardOutlined> = {
  general: IdcardOutlined,
  billing: CreditCardOutlined,
  notifications: BellOutlined,
  social: ShareAltOutlined,
  security: KeyOutlined,
}

const panes: Record<AccountTab, () => React.ReactElement> = {
  general: GeneralTab,
  billing: BillingTab,
  notifications: NotificationsTab,
  social: SocialLinksTab,
  security: SecurityTab,
}

function isAccountTab(value: string | null): value is AccountTab {
  return value !== null && (ACCOUNT_TABS as string[]).includes(value)
}

export function AccountPage() {
  const messages = useMessages()
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')
  const tab: AccountTab = isAccountTab(tabParam) ? tabParam : 'general'
  const Pane = panes[tab]

  return (
    <div className="admin-page">
      {/* Description commented out rather than deleted: not worth the space on this screen. */}
      <PageHeader title={messages.account.title} /* description={messages.account.description} */ />

      <Breadcrumb
        className="profile-breadcrumb"
        items={[
          { title: messages.navigation.dashboard },
          { title: messages.account.user },
          { title: messages.account.title },
        ]}
      />

      <Tabs
        activeKey={tab}
        onChange={(key) =>
          setSearchParams((current) => {
            const next = new URLSearchParams(current)
            next.set('tab', key)
            return next
          })
        }
        items={ACCOUNT_TABS.map((key) => {
          const Icon = icons[key]

          return {
            key,
            label: (
              <Flex align="center" gap={8}>
                <Icon aria-hidden="true" />
                <span>{messages.account.tabs[key]}</span>
              </Flex>
            ),
          }
        })}
      />

      {/*
       * The panes are rendered outside `Tabs` rather than as `children` of each item, so
       * only the open one mounts. Five forms mounted at once would each run their own
       * validation and hold their own state for no reason.
       */}
      <Pane />
    </div>
  )
}
