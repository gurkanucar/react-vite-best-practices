import {
  CopyOutlined,
  DeleteOutlined,
  MoreOutlined,
  RollbackOutlined,
  SmileOutlined,
} from '@ant-design/icons'
import { Bubble, type BubbleItemType } from '@ant-design/x'
import { App, Button, Dropdown, Flex, Image, Popover, Tooltip, Typography } from 'antd'
import dayjs from 'dayjs'
import { useRef, useState, type ComponentRef, type CSSProperties } from 'react'
import { AttachmentView } from '@/features/chat/components/AttachmentView'
import { ChatAvatar } from '@/features/chat/components/ChatAvatar'
import { PollView } from '@/features/chat/components/PollView'
import {
  authorName,
  contactById,
  dayLabel,
  messagePreview,
} from '@/features/chat/components/chatText'
import { DeliveryTicks } from '@/features/chat/components/DeliveryTicks'
import {
  buildTimeline,
  isEmojiOnly,
  localize,
  ME,
  type ChatMessage,
  type Conversation,
} from '@/features/chat/types'
import { useMessages } from '@/i18n/messages'
import { usePreferencesStore } from '@/store/preferences-store'

/** The reactions offered on a message, as in WhatsApp's quick row. */
const QUICK_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🙏']

/** A message shows up to this many photos; the rest are behind "+N" and in the preview. */
const MAX_TILES = 4

interface MessageListProps {
  conversation: Conversation
  typingAuthorId?: string
  onReply: (message: ChatMessage) => void
  /** A group member's name or avatar opens their profile. */
  onShowAuthor: (authorId: string) => void
  onReact: (messageId: string, emoji: string) => void
  onVote: (messageId: string, optionId: string) => void
  onDelete: (messageId: string) => void
}

function PhotoGrid({ images }: { images: string[] }) {
  const tiles = images.slice(0, MAX_TILES)
  const hidden = images.length - tiles.length

  return (
    // The group previews every photo, including those without a tile of their own.
    <Image.PreviewGroup items={images}>
      <div className={`chat-photos chat-photos--${Math.min(images.length, MAX_TILES)}`}>
        {tiles.map((src, index) => (
          <div key={`${src}-${index}`} className="chat-photos__tile">
            <Image src={src} alt="" />
            {hidden > 0 && index === tiles.length - 1 && (
              <span className="chat-photos__more" aria-hidden="true">
                +{hidden}
              </span>
            )}
          </div>
        ))}
      </div>
    </Image.PreviewGroup>
  )
}

export function MessageList({
  conversation,
  typingAuthorId,
  onReply,
  onShowAuthor,
  onReact,
  onVote,
  onDelete,
}: MessageListProps) {
  const messages = useMessages()
  const language = usePreferencesStore((state) => state.language)
  const { message: toast } = App.useApp()
  const listRef = useRef<ComponentRef<typeof Bubble.List>>(null)
  const [highlighted, setHighlighted] = useState<string | null>(null)
  // One reaction row open at a time, closed again once an emoji is picked.
  const [reactingId, setReactingId] = useState<string | null>(null)
  const group = conversation.kind === 'group'

  const byId = new Map(conversation.messages.map((message) => [message.id, message]))

  const jumpTo = (messageId: string) => {
    listRef.current?.scrollTo({ key: messageId, block: 'center', behavior: 'smooth' })
    setHighlighted(messageId)
    window.setTimeout(
      () => setHighlighted((current) => (current === messageId ? null : current)),
      1600,
    )
  }

  const nameTag = (authorId: string) => (
    <button
      type="button"
      className="chat-author chat-author--link"
      style={{ '--member-color': contactById(authorId)?.color } as CSSProperties}
      onClick={() => onShowAuthor(authorId)}
    >
      {authorName(authorId, messages)}
    </button>
  )

  const renderContent = (message: ChatMessage) => {
    const text = message.text ? localize(message.text, language) : ''
    const quoted = message.replyToId ? byId.get(message.replyToId) : undefined
    const meta = (
      <span className="chat-meta">
        {dayjs(message.sentAt).format('HH:mm')}
        {message.authorId === ME && <DeliveryTicks status={message.status} />}
      </span>
    )

    return (
      <div className="chat-message">
        {message.replyToId && (
          <button
            type="button"
            className="chat-quote"
            style={
              { '--member-color': contactById(quoted?.authorId ?? '')?.color } as CSSProperties
            }
            onClick={() => quoted && jumpTo(quoted.id)}
            disabled={!quoted}
          >
            {quoted ? (
              <>
                <span className="chat-author">{authorName(quoted.authorId, messages)}</span>
                <Typography.Text type="secondary" ellipsis>
                  {messagePreview(quoted, messages, language)}
                </Typography.Text>
              </>
            ) : (
              <Typography.Text type="secondary" italic>
                {messages.chat.deleted}
              </Typography.Text>
            )}
          </button>
        )}

        {message.images && <PhotoGrid images={message.images} />}

        {message.poll && (
          <PollView
            poll={message.poll}
            readOnly={!conversation.memberIds.includes(ME)}
            onVote={(optionId) => onVote(message.id, optionId)}
          />
        )}

        {message.attachment && (
          <AttachmentView
            attachment={message.attachment}
            color={contactById(message.authorId)?.color}
          />
        )}

        {text ? (
          <span className={isEmojiOnly(text) ? 'chat-text chat-text--emoji' : 'chat-text'}>
            {text}
            {meta}
          </span>
        ) : (
          <span className="chat-text chat-text--bare">{meta}</span>
        )}
      </div>
    )
  }

  const renderReactions = (message: ChatMessage) => {
    const entries = Object.entries(message.reactions ?? {})
    if (entries.length === 0) return null

    return (
      <Flex gap={4} wrap className="chat-reactions">
        {entries.map(([emoji, users]) => (
          <Tooltip key={emoji} title={users.map((id) => authorName(id, messages)).join(', ')}>
            <Button
              size="small"
              shape="round"
              type={users.includes(ME) ? 'primary' : 'default'}
              ghost={users.includes(ME)}
              onClick={() => onReact(message.id, emoji)}
            >
              {emoji} {users.length > 1 && users.length}
            </Button>
          </Tooltip>
        ))}
      </Flex>
    )
  }

  const renderActions = (message: ChatMessage) => (
    <Flex className="chat-actions" gap={2}>
      <Popover
        open={reactingId === message.id}
        onOpenChange={(open) => setReactingId(open ? message.id : null)}
        trigger="click"
        placement="top"
        content={
          <Flex gap={2}>
            {QUICK_REACTIONS.map((emoji) => (
              <Button
                key={emoji}
                type="text"
                className="chat-emoji-button"
                aria-label={emoji}
                onClick={() => {
                  setReactingId(null)
                  onReact(message.id, emoji)
                }}
              >
                {emoji}
              </Button>
            ))}
          </Flex>
        }
      >
        <Button
          type="text"
          size="small"
          shape="circle"
          icon={<SmileOutlined />}
          aria-label={messages.chat.react}
        />
      </Popover>
      <Tooltip title={messages.chat.reply}>
        <Button
          type="text"
          size="small"
          shape="circle"
          icon={<RollbackOutlined />}
          aria-label={messages.chat.reply}
          onClick={() => onReply(message)}
        />
      </Tooltip>
      <Dropdown
        trigger={['click']}
        menu={{
          items: [
            { key: 'reply', icon: <RollbackOutlined />, label: messages.chat.reply },
            ...(message.text
              ? [{ key: 'copy', icon: <CopyOutlined />, label: messages.chat.copy }]
              : []),
            { type: 'divider' as const },
            { key: 'delete', icon: <DeleteOutlined />, label: messages.chat.delete, danger: true },
          ],
          onClick: ({ key }) => {
            if (key === 'reply') onReply(message)
            if (key === 'delete') onDelete(message.id)
            if (key === 'copy' && message.text) {
              void navigator.clipboard?.writeText(localize(message.text, language))
              void toast.success(messages.chat.copied)
            }
          },
        }}
      >
        <Button
          type="text"
          size="small"
          shape="circle"
          icon={<MoreOutlined />}
          aria-label={messages.chat.more}
        />
      </Dropdown>
    </Flex>
  )

  const items: BubbleItemType[] = buildTimeline(conversation.messages).map((entry) => {
    if (entry.kind === 'day') {
      return { key: entry.key, role: 'divider', content: dayLabel(entry.date, messages) }
    }

    if (entry.kind === 'system') {
      return {
        key: entry.key,
        role: 'system',
        content: localize(entry.message.text ?? '', language),
      }
    }

    const { message, first, last } = entry
    const mine = message.authorId === ME
    const text = message.text ? localize(message.text, language) : ''
    const bare =
      isEmojiOnly(text) &&
      !message.images &&
      !message.attachment &&
      !message.poll &&
      !message.replyToId

    return {
      key: message.id,
      role: mine ? 'mine' : 'theirs',
      content: renderContent(message),
      // The tail marks where a run starts; the messages after it tuck in under it.
      shape: first ? 'corner' : 'default',
      variant: bare ? 'borderless' : 'filled',
      // In a group the avatar and name say who is talking; in a private chat it is obvious.
      avatar:
        group && !mine ? (
          first ? (
            <button
              type="button"
              className="chat-avatar-button"
              aria-label={`${messages.chat.viewProfile}: ${authorName(message.authorId, messages)}`}
              onClick={() => onShowAuthor(message.authorId)}
            >
              <ChatAvatar contact={contactById(message.authorId)} size={32} />
            </button>
          ) : (
            <span className="chat-avatar-space" />
          )
        ) : undefined,
      header: group && !mine && first ? nameTag(message.authorId) : undefined,
      footer: renderReactions(message),
      extra: renderActions(message),
      className: [
        'chat-bubble',
        mine ? 'chat-bubble--mine' : 'chat-bubble--theirs',
        first && 'chat-bubble--first',
        last && 'chat-bubble--last',
        highlighted === message.id && 'chat-bubble--highlighted',
      ]
        .filter(Boolean)
        .join(' '),
    }
  })

  if (typingAuthorId) {
    items.push({
      key: 'typing',
      role: 'theirs',
      content: '',
      loading: true,
      shape: 'corner',
      className: 'chat-bubble chat-bubble--theirs chat-bubble--first chat-bubble--last',
      avatar: group ? <ChatAvatar contact={contactById(typingAuthorId)} size={32} /> : undefined,
      header: group ? nameTag(typingAuthorId) : undefined,
    })
  }

  if (items.length === 0) {
    return (
      <Flex className="chat-messages chat-messages--empty" align="center" justify="center">
        <Typography.Text type="secondary" className="chat-system-pill">
          {messages.chat.noMessages}
        </Typography.Text>
      </Flex>
    )
  }

  return (
    <Bubble.List
      ref={listRef}
      className="chat-messages"
      items={items}
      role={{
        mine: { placement: 'end' },
        theirs: { placement: 'start' },
      }}
    />
  )
}
