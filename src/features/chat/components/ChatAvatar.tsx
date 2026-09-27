import { TeamOutlined } from '@ant-design/icons'
import { Avatar, Badge } from 'antd'
import type { ChatContact } from '@/features/chat/types'
import { initials } from '@/features/chat/components/chatText'

interface ChatAvatarProps {
  contact?: ChatContact
  /** A group has no one face; it gets the group icon instead. */
  group?: boolean
  size?: number
  /** The green dot for someone who is online right now. */
  showPresence?: boolean
}

export function ChatAvatar({ contact, group, size = 40, showPresence }: ChatAvatarProps) {
  const avatar = group ? (
    <Avatar size={size} icon={<TeamOutlined />} style={{ flex: 'none' }} />
  ) : (
    // Never squeezed by a long name beside it: antd sizes the initials to the width it has.
    <Avatar size={size} style={{ flex: 'none', backgroundColor: contact?.color }}>
      {initials(contact?.name ?? '')}
    </Avatar>
  )

  if (!showPresence || contact?.presence !== 'online') return avatar

  return (
    <Badge dot status="success" offset={[-size / 8, size - size / 8]} className="chat-avatar-badge">
      {avatar}
    </Badge>
  )
}
