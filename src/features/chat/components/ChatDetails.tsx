import {
  ArrowLeftOutlined,
  LogoutOutlined,
  MailOutlined,
  MessageOutlined,
  PhoneOutlined,
  UserAddOutlined,
} from '@ant-design/icons'
import {
  App,
  Avatar,
  Button,
  Descriptions,
  Drawer,
  Empty,
  Flex,
  Grid,
  Image,
  Select,
  Space,
  Switch,
  Table,
  Tabs,
  Tag,
  Typography,
} from 'antd'
import dayjs from 'dayjs'
import { useState } from 'react'
import { AttachmentView } from '@/features/chat/components/AttachmentView'
import { ChatAvatar } from '@/features/chat/components/ChatAvatar'
import { contactById, conversationTitle, partnerOf } from '@/features/chat/components/chatText'
import { chatContacts } from '@/features/chat/data'
import { localize, ME, type ChatContact, type Conversation } from '@/features/chat/types'
import { useMessages } from '@/i18n/messages'
import { usePreferencesStore } from '@/store/preferences-store'

interface ChatDetailsProps {
  open: boolean
  onClose: () => void
  conversation: Conversation
  /** Every conversation, for the groups a contact shares with the user. */
  conversations: Conversation[]
  /** Set to show a group member's profile instead of the conversation's own details. */
  contactId?: string
  onShowContact: (contactId: string | undefined) => void
  onMessage: (contactId: string) => void
  onOpenConversation: (conversationId: string) => void
  onToggleMute: () => void
  onAddMembers: (memberIds: string[]) => void
  onLeave: () => void
}

/** Photos, videos and files that went through a conversation, newest first. */
function SharedContent({ conversation }: { conversation: Conversation }) {
  const messages = useMessages()
  const newest = [...conversation.messages].reverse()
  const photos = newest.flatMap((message) => message.images ?? [])
  const videos = newest.flatMap((message) =>
    message.attachment?.kind === 'video' ? [message.attachment] : [],
  )
  const files = newest.flatMap((message) =>
    message.attachment && message.attachment.kind !== 'video'
      ? [{ attachment: message.attachment, authorId: message.authorId }]
      : [],
  )

  return (
    <Tabs
      size="small"
      items={[
        {
          key: 'media',
          label: `${messages.chat.media} (${photos.length + videos.length})`,
          children:
            photos.length + videos.length === 0 ? (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={messages.chat.noMedia} />
            ) : (
              <div className="chat-details__media">
                <Image.PreviewGroup>
                  {photos.map((src, index) => (
                    <Image key={`${src}-${index}`} src={src} alt="" />
                  ))}
                </Image.PreviewGroup>
                {videos.map((video) => (
                  // oxlint-disable-next-line jsx-a11y/media-has-caption -- a user's own clip has no captions
                  <video
                    key={video.src}
                    src={video.src}
                    poster={video.poster}
                    controls
                    preload="none"
                  />
                ))}
              </div>
            ),
        },
        {
          key: 'docs',
          label: `${messages.chat.docs} (${files.length})`,
          children:
            files.length === 0 ? (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={messages.chat.noDocs} />
            ) : (
              <Flex vertical gap={8}>
                {files.map(({ attachment, authorId }) => (
                  <AttachmentView
                    key={attachment.src}
                    attachment={attachment}
                    color={contactById(authorId)?.color}
                  />
                ))}
              </Flex>
            ),
        },
      ]}
    />
  )
}

function ContactProfile({
  contact,
  conversations,
  onMessage,
  onOpenConversation,
}: {
  contact: ChatContact
  conversations: Conversation[]
  onMessage?: () => void
  onOpenConversation: (conversationId: string) => void
}) {
  const messages = useMessages()
  const language = usePreferencesStore((state) => state.language)
  const shared = conversations.filter(
    (conversation) =>
      conversation.kind === 'group' &&
      conversation.memberIds.includes(contact.id) &&
      conversation.memberIds.includes(ME),
  )

  return (
    <Flex vertical gap={16}>
      <Flex vertical align="center" gap={4} className="chat-details__hero">
        <ChatAvatar contact={contact} size={96} showPresence />
        <Typography.Title level={4}>{contact.name}</Typography.Title>
        <Typography.Text type="secondary">{localize(contact.role, language)}</Typography.Text>
        {onMessage && (
          <Button icon={<MessageOutlined />} onClick={onMessage}>
            {messages.chat.message}
          </Button>
        )}
      </Flex>

      <Descriptions
        column={1}
        size="small"
        items={[
          { key: 'about', label: messages.chat.about, children: localize(contact.about, language) },
          {
            key: 'phone',
            label: messages.chat.phone,
            children: (
              <Typography.Link href={`tel:${contact.phone.replaceAll(' ', '')}`}>
                <PhoneOutlined /> {contact.phone}
              </Typography.Link>
            ),
          },
          {
            key: 'email',
            label: messages.chat.email,
            children: (
              <Typography.Link href={`mailto:${contact.email}`}>
                <MailOutlined /> {contact.email}
              </Typography.Link>
            ),
          },
        ]}
      />

      <div>
        <Typography.Text strong>{messages.chat.commonGroups}</Typography.Text>
        {shared.length === 0 ? (
          <Typography.Paragraph type="secondary">
            {messages.chat.noCommonGroups}
          </Typography.Paragraph>
        ) : (
          <Flex vertical gap={4} className="chat-details__groups">
            {shared.map((group) => (
              <Button
                key={group.id}
                type="text"
                block
                className="chat-details__row"
                onClick={() => onOpenConversation(group.id)}
              >
                <ChatAvatar group size={32} />
                <Typography.Text ellipsis>{conversationTitle(group, language)}</Typography.Text>
              </Button>
            ))}
          </Flex>
        )}
      </div>
    </Flex>
  )
}

function GroupMembers({
  conversation,
  onShowContact,
  onAddMembers,
}: {
  conversation: Conversation
  onShowContact: (contactId: string) => void
  onAddMembers: (memberIds: string[]) => void
}) {
  const messages = useMessages()
  const language = usePreferencesStore((state) => state.language)
  const [adding, setAdding] = useState<string[]>([])
  const member = conversation.memberIds.includes(ME)
  // The user first, then admins, then everyone else by name — WhatsApp's order.
  const members = [...conversation.memberIds].sort((left, right) => {
    const rank = (id: string) => (id === ME ? 0 : conversation.adminIds?.includes(id) ? 1 : 2)
    return (
      rank(left) - rank(right) ||
      (contactById(left)?.name ?? '').localeCompare(contactById(right)?.name ?? '')
    )
  })
  const candidates = chatContacts.filter((contact) => !conversation.memberIds.includes(contact.id))

  return (
    <Flex vertical gap={12}>
      <Typography.Text strong>
        {messages.chat.membersTitle.replace('{count}', String(conversation.memberIds.length))}
      </Typography.Text>

      {member && candidates.length > 0 && (
        <Space.Compact block>
          <Select
            mode="multiple"
            allowClear
            className="chat-details__add"
            placeholder={messages.chat.addMemberPlaceholder}
            value={adding}
            onChange={setAdding}
            options={candidates.map((contact) => ({ value: contact.id, label: contact.name }))}
            maxTagCount="responsive"
          />
          <Button
            icon={<UserAddOutlined />}
            disabled={adding.length === 0}
            onClick={() => {
              onAddMembers(adding)
              setAdding([])
            }}
          >
            {messages.chat.add}
          </Button>
        </Space.Compact>
      )}

      <Table
        size="small"
        tableLayout="fixed"
        showHeader={false}
        pagination={false}
        rowKey={(id) => id}
        dataSource={members}
        onRow={(id) =>
          id === ME ? {} : { onClick: () => onShowContact(id), className: 'chat-details__member' }
        }
        columns={[
          {
            key: 'member',
            render: (_, id: string) => {
              const contact = contactById(id)

              return (
                <Flex align="center" gap={12}>
                  {id === ME ? (
                    <Avatar size={36}>{messages.chat.you[0]}</Avatar>
                  ) : (
                    <ChatAvatar contact={contact} size={36} showPresence />
                  )}
                  <Flex vertical flex={1} className="chat-details__member-text">
                    <Typography.Text strong ellipsis>
                      {id === ME ? messages.chat.you : contact?.name}
                    </Typography.Text>
                    {contact && (
                      <Typography.Text type="secondary" ellipsis>
                        {localize(contact.about, language)}
                      </Typography.Text>
                    )}
                  </Flex>
                  {conversation.adminIds?.includes(id) && (
                    <Tag color="green">{messages.chat.admin}</Tag>
                  )}
                </Flex>
              )
            },
          },
        ]}
      />
    </Flex>
  )
}

/**
 * The panel behind a chat's header, as in WhatsApp: a contact's profile for a private chat,
 * the group's description and members for a group, and what the two have shared either way.
 * A member picked from a group's list is shown in the same drawer, with a way back.
 */
export function ChatDetails({
  open,
  onClose,
  conversation,
  conversations,
  contactId,
  onShowContact,
  onMessage,
  onOpenConversation,
  onToggleMute,
  onAddMembers,
  onLeave,
}: ChatDetailsProps) {
  const messages = useMessages()
  const language = usePreferencesStore((state) => state.language)
  const { modal } = App.useApp()
  const screens = Grid.useBreakpoint()
  const group = conversation.kind === 'group'
  const member = contactId ? contactById(contactId) : undefined
  const partner = partnerOf(conversation)
  const title = conversationTitle(conversation, language)

  const mute = (
    <Flex justify="space-between" align="center">
      <Typography.Text>{messages.chat.mute}</Typography.Text>
      <Switch
        checked={Boolean(conversation.muted)}
        onChange={onToggleMute}
        aria-label={messages.chat.mute}
      />
    </Flex>
  )

  const body = () => {
    if (member) {
      return (
        <ContactProfile
          contact={member}
          conversations={conversations}
          onMessage={() => onMessage(member.id)}
          onOpenConversation={onOpenConversation}
        />
      )
    }

    if (!group && partner) {
      return (
        <Flex vertical gap={16}>
          <ContactProfile
            contact={partner}
            conversations={conversations}
            onOpenConversation={onOpenConversation}
          />
          {mute}
          <SharedContent conversation={conversation} />
        </Flex>
      )
    }

    const inGroup = conversation.memberIds.includes(ME)

    return (
      <Flex vertical gap={16}>
        <Flex vertical align="center" gap={4} className="chat-details__hero">
          <ChatAvatar group size={96} />
          <Typography.Title level={4}>{title}</Typography.Title>
          <Typography.Text type="secondary">
            {messages.chat.groupMeta.replace('{count}', String(conversation.memberIds.length))}
          </Typography.Text>
        </Flex>

        {conversation.description && (
          <Typography.Paragraph className="chat-details__description">
            {localize(conversation.description, language)}
          </Typography.Paragraph>
        )}
        {conversation.createdAt && (
          <Typography.Text type="secondary">
            {messages.chat.createdOn.replace(
              '{date}',
              dayjs(conversation.createdAt).format('D MMMM YYYY'),
            )}
          </Typography.Text>
        )}

        {mute}
        <SharedContent conversation={conversation} />
        <GroupMembers
          conversation={conversation}
          onShowContact={onShowContact}
          onAddMembers={onAddMembers}
        />

        {inGroup && (
          <Button
            danger
            block
            icon={<LogoutOutlined />}
            onClick={() =>
              modal.confirm({
                title: messages.chat.leaveConfirm.replace('{name}', title),
                content: messages.chat.leaveDescription,
                okText: messages.chat.leave,
                okButtonProps: { danger: true },
                onOk: onLeave,
              })
            }
          >
            {messages.chat.leave}
          </Button>
        )}
      </Flex>
    )
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      // A phone gives the details the whole screen, as the chat itself has.
      size={screens.sm ? 400 : '100%'}
      title={
        member
          ? messages.chat.contactInfo
          : group
            ? messages.chat.groupInfo
            : messages.chat.contactInfo
      }
      // Back from a member's profile to the group, rather than out of the drawer altogether.
      extra={
        member && (
          <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => onShowContact(undefined)}>
            {title}
          </Button>
        )
      }
      destroyOnHidden
    >
      {body()}
    </Drawer>
  )
}
