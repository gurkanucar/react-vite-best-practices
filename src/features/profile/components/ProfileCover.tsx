import { Avatar, Tabs, Typography } from 'antd'
import type { TabsProps } from 'antd'
import cover from '@/features/profile/assets/cover.svg'
import { initialsOf, type ProfilePerson } from '@/features/profile/types'
import { useMessages } from '@/i18n/messages'

interface ProfileCoverProps {
  person: ProfilePerson
  items: TabsProps['items']
  activeKey: string
  onChange: (key: string) => void
}

/**
 * The only part of this screen that needs its own CSS: a name sitting on top of a banner
 * is a stacking problem no Ant Design component solves. Everything below is components.
 */
export function ProfileCover({ person, items, activeKey, onChange }: ProfileCoverProps) {
  const messages = useMessages()

  return (
    <div className="profile-cover">
      {/*
       * Quoted deliberately. Vite inlines a small SVG as a data URI, and this one carries
       * single quotes from its own attributes; an unquoted `url()` may not contain them, so
       * the browser drops the whole declaration and the banner renders blank.
       */}
      <div className="profile-cover__banner" style={{ backgroundImage: `url("${cover}")` }}>
        <div className="profile-cover__identity">
          <Avatar size={96} className="profile-cover__avatar">
            {initialsOf(person.name)}
          </Avatar>
          <div>
            <Typography.Title level={2} className="profile-cover__name">
              {person.name}
            </Typography.Title>
            <Typography.Text className="profile-cover__role">
              {messages.profile.roles[person.roleId as keyof typeof messages.profile.roles]}
            </Typography.Text>
          </div>
        </div>
      </div>

      <Tabs
        items={items}
        activeKey={activeKey}
        onChange={onChange}
        tabBarStyle={{ marginBottom: 0 }}
        className="profile-cover__tabs"
      />
    </div>
  )
}
