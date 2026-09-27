import {
  ArrowLeftOutlined,
  ClearOutlined,
  MoreOutlined,
  MutedOutlined,
  PhoneOutlined,
  PushpinOutlined,
  SoundOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons'
import { Alert, App, Button, Dropdown, Flex, Tooltip, Typography } from 'antd'
import dayjs from 'dayjs'
import { useState } from 'react'
import { ChatAvatar } from '@/features/chat/components/ChatAvatar'
import { ChatComposer } from '@/features/chat/components/ChatComposer'
import { ChatDetails } from '@/features/chat/components/ChatDetails'
import {
  authorName,
  contactById,
  conversationTitle,
  dayLabel,
  partnerOf,
} from '@/features/chat/components/chatText'
import { MessageList } from '@/features/chat/components/MessageList'
import type { Draft } from '@/features/chat/hooks'
import { ME, type ChatMessage, type Conversation } from '@/features/chat/types'
import { useMessages, type Messages } from '@/i18n/messages'
import { usePreferencesStore } from '@/store/preferences-store'

interface ChatThreadProps {
  conversation: Conversation
  typingAuthorId?: string
  /** Set on a phone, where the list and the chat take turns on the screen. */
  onBack?: () => void
  onSend: (draft: Draft) => void
  onReact: (messageId: string, emoji: string) => void
  onDelete: (messageId: string) => void
  onClear: () => void
  onToggle: (flag: 'muted' | 'pinned') => void
  conversations: Conversation[]
  onMessage: (contactId: string) => void
  onOpenConversation: (conversationId: string) => void
  onAddMembers: (memberIds: string[]) => void
  onLeave: () => void
}

function subtitle(conversation: Conversation, messages: Messages, typingAuthorId?: string) {
  if (typingAuthorId) {
    return conversation.kind === 'group'
      ? messages.chat.typingIn.replace('{name}', authorName(typingAuthorId, messages))
      : messages.chat.typing
  }

  if (conversation.kind === 'group') {
    // Everyone by first name, the user last, which is how WhatsApp lists a group.
    return [...conversation.memberIds.filter((id) => id !== ME), ME]
      .map((id) => (id === ME ? messages.chat.you : contactById(id)?.name.split(' ')[0]))
      .join(', ')
  }

  const partner = partnerOf(conversation)
  if (!partner) return ''
  if (partner.presence === 'online') return messages.chat.online
  if (!partner.lastSeen) return messages.chat.away

  const seen = dayjs(partner.lastSeen)
  return messages.chat.lastSeen.replace(
    '{time}',
    `${dayLabel(partner.lastSeen, messages).toLocaleLowerCase()} ${seen.format('HH:mm')}`,
  )
}

export function ChatThread({
  conversation,
  typingAuthorId,
  onBack,
  onSend,
  onReact,
  onDelete,
  onClear,
  onToggle,
  conversations,
  onMessage,
  onOpenConversation,
  onAddMembers,
  onLeave,
}: ChatThreadProps) {
  const messages = useMessages()
  const language = usePreferencesStore((state) => state.language)
  const { message } = App.useApp()
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null)
  const partner = partnerOf(conversation)
  const [detailsOpen, setDetailsOpen] = useState(false)
  // A group member whose profile the details show, reached from the list or a message.
  const [profileId, setProfileId] = useState<string | undefined>()
  const member = conversation.memberIds.includes(ME)

  const showDetails = (contactId?: string) => {
    setProfileId(contactId)
    setDetailsOpen(true)
  }

  const unavailable = () => void message.info(messages.chat.callUnavailable)

  return (
    <Flex vertical className="chat-thread">
      <Flex align="center" gap={12} className="chat-thread__header">
        {onBack && (
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            aria-label={messages.chat.back}
            onClick={onBack}
          />
        )}
        {/* The whole identity block opens the details, as tapping the header does in WhatsApp. */}
        <button
          type="button"
          className="chat-thread__identity"
          onClick={() => showDetails()}
          aria-label={`${messages.chat.details}: ${conversationTitle(conversation, language)}`}
        >
          <ChatAvatar contact={partner} group={conversation.kind === 'group'} showPresence />
          <Flex vertical flex={1} className="chat-thread__title">
            <Typography.Text strong ellipsis>
              {conversationTitle(conversation, language)}
            </Typography.Text>
            <Typography.Text type={typingAuthorId ? 'success' : 'secondary'} ellipsis>
              {subtitle(conversation, messages, typingAuthorId)}
            </Typography.Text>
          </Flex>
        </button>
        <Flex gap={4}>
          <Tooltip title={messages.chat.call}>
            <Button
              type="text"
              icon={<PhoneOutlined />}
              aria-label={messages.chat.call}
              onClick={unavailable}
            />
          </Tooltip>
          <Tooltip title={messages.chat.video}>
            <Button
              type="text"
              icon={<VideoCameraOutlined />}
              aria-label={messages.chat.video}
              onClick={unavailable}
            />
          </Tooltip>
          <Dropdown
            trigger={['click']}
            menu={{
              items: [
                {
                  key: 'pin',
                  icon: <PushpinOutlined />,
                  label: conversation.pinned ? messages.chat.unpin : messages.chat.pin,
                },
                {
                  key: 'mute',
                  icon: conversation.muted ? <SoundOutlined /> : <MutedOutlined />,
                  label: conversation.muted ? messages.chat.unmute : messages.chat.mute,
                },
                { type: 'divider' },
                {
                  key: 'clear',
                  icon: <ClearOutlined />,
                  label: messages.chat.clear,
                  danger: true,
                  disabled: conversation.messages.length === 0,
                },
              ],
              onClick: ({ key }) => {
                if (key === 'pin') onToggle('pinned')
                if (key === 'mute') onToggle('muted')
                if (key === 'clear') {
                  onClear()
                  setReplyTo(null)
                  void message.success(messages.chat.cleared)
                }
              },
            }}
          >
            <Button type="text" icon={<MoreOutlined />} aria-label={messages.chat.more} />
          </Dropdown>
        </Flex>
      </Flex>

      <MessageList
        conversation={conversation}
        typingAuthorId={typingAuthorId}
        onReply={setReplyTo}
        onShowAuthor={(authorId) => showDetails(authorId)}
        onReact={onReact}
        onDelete={(messageId) => {
          if (replyTo?.id === messageId) setReplyTo(null)
          onDelete(messageId)
        }}
      />

      <div className="chat-thread__composer">
        {member ? (
          <ChatComposer
            replyTo={replyTo}
            onCancelReply={() => setReplyTo(null)}
            onSend={(draft) => {
              onSend(draft)
              setReplyTo(null)
            }}
          />
        ) : (
          <Alert type="info" showIcon title={messages.chat.notMember} />
        )}
      </div>

      <ChatDetails
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        conversation={conversation}
        conversations={conversations}
        contactId={profileId}
        onShowContact={setProfileId}
        onMessage={(contactId) => {
          setDetailsOpen(false)
          onMessage(contactId)
        }}
        onOpenConversation={(conversationId) => {
          setDetailsOpen(false)
          onOpenConversation(conversationId)
        }}
        onToggleMute={() => onToggle('muted')}
        onAddMembers={onAddMembers}
        onLeave={onLeave}
      />
    </Flex>
  )
}
