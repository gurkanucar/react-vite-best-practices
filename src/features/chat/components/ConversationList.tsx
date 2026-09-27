import { MutedOutlined, PushpinFilled, SearchOutlined } from '@ant-design/icons'
import { Conversations } from '@ant-design/x'
import { Badge, Empty, Flex, Input, Segmented, theme, Typography } from 'antd'
import { useState } from 'react'
import { ChatAvatar } from '@/features/chat/components/ChatAvatar'
import { DeliveryTicks } from '@/features/chat/components/DeliveryTicks'
import {
  authorName,
  conversationTitle,
  listTime,
  messagePreview,
  partnerOf,
} from '@/features/chat/components/chatText'
import { ME, type Conversation } from '@/features/chat/types'
import { useMessages } from '@/i18n/messages'
import { usePreferencesStore } from '@/store/preferences-store'

type Filter = 'all' | 'unread' | 'groups'

interface ConversationListProps {
  conversations: Conversation[]
  activeId: string | null
  typing: Record<string, string | undefined>
  onOpen: (conversationId: string) => void
}

function lastActivity(conversation: Conversation): string {
  return conversation.messages.at(-1)?.sentAt ?? ''
}

export function ConversationList({
  conversations,
  activeId,
  typing,
  onOpen,
}: ConversationListProps) {
  const messages = useMessages()
  const language = usePreferencesStore((state) => state.language)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const { token } = theme.useToken()

  const needle = query.trim().toLocaleLowerCase(language)
  const visible = conversations
    .filter((conversation) => {
      if (filter === 'unread' && conversation.unread === 0) return false
      if (filter === 'groups' && conversation.kind !== 'group') return false
      return conversationTitle(conversation, language).toLocaleLowerCase(language).includes(needle)
    })
    // Pinned chats stay on top; the rest follow the latest message, as in any chat app.
    .sort((left, right) => {
      if (Boolean(left.pinned) !== Boolean(right.pinned)) return left.pinned ? -1 : 1
      return lastActivity(right).localeCompare(lastActivity(left))
    })

  const preview = (conversation: Conversation) => {
    const typist = typing[conversation.id]
    if (typist) {
      return (
        <Typography.Text type="success" ellipsis>
          {conversation.kind === 'group'
            ? messages.chat.typingIn.replace('{name}', authorName(typist, messages).split(' ')[0]!)
            : messages.chat.typing}
        </Typography.Text>
      )
    }

    const last = conversation.messages.at(-1)
    if (!last) return <Typography.Text type="secondary">{messages.chat.noMessages}</Typography.Text>

    // A group line says who wrote it; one of the user's own says whether it was read.
    const prefix = last.system
      ? ''
      : last.authorId === ME
        ? ''
        : conversation.kind === 'group'
          ? `${authorName(last.authorId, messages).split(' ')[0]}: `
          : ''

    return (
      <Typography.Text type="secondary" ellipsis>
        {last.authorId === ME && !last.system && <DeliveryTicks status={last.status} />}
        {prefix}
        {messagePreview(last, messages, language)}
      </Typography.Text>
    )
  }

  const items = visible.map((conversation) => {
    const last = conversation.messages.at(-1)

    return {
      key: conversation.id,
      label: (
        <Flex gap={12} align="center" className="chat-list-item">
          <ChatAvatar
            contact={partnerOf(conversation)}
            group={conversation.kind === 'group'}
            showPresence
            size={44}
          />
          <Flex vertical flex={1} className="chat-list-item__body">
            <Flex justify="space-between" gap={8}>
              <Typography.Text strong ellipsis>
                {conversationTitle(conversation, language)}
              </Typography.Text>
              {last && (
                <Typography.Text
                  type={conversation.unread > 0 ? 'success' : 'secondary'}
                  className="chat-list-item__time"
                >
                  {listTime(last.sentAt, messages)}
                </Typography.Text>
              )}
            </Flex>
            <Flex justify="space-between" align="center" gap={8}>
              {preview(conversation)}
              <Flex gap={4} align="center" className="chat-list-item__flags">
                {conversation.muted && (
                  <MutedOutlined aria-label={messages.chat.muted} className="chat-muted-icon" />
                )}
                {conversation.pinned && (
                  <PushpinFilled aria-label={messages.chat.pinned} className="chat-muted-icon" />
                )}
                {conversation.unread > 0 && (
                  <Badge
                    count={conversation.unread}
                    // A muted chat still counts, but in grey, so it does not call for attention.
                    color={conversation.muted ? token.colorTextQuaternary : token.colorSuccess}
                  />
                )}
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      ),
    }
  })

  return (
    <Flex vertical gap={12} className="chat-sidebar">
      <Flex vertical gap={12} className="chat-sidebar__tools">
        <Input
          allowClear
          prefix={<SearchOutlined aria-hidden="true" />}
          placeholder={messages.chat.searchPlaceholder}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <Segmented<Filter>
          block
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'all', label: messages.chat.all },
            { value: 'unread', label: messages.chat.unread },
            { value: 'groups', label: messages.chat.groups },
          ]}
        />
      </Flex>

      <div className="chat-sidebar__list">
        {items.length === 0 ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={messages.chat.noConversations} />
        ) : (
          <Conversations
            items={items}
            activeKey={activeId ?? undefined}
            onActiveChange={(key) => onOpen(String(key))}
          />
        )}
      </div>
    </Flex>
  )
}
