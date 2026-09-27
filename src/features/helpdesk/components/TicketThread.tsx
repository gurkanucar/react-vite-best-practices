import { LockOutlined, PaperClipOutlined } from '@ant-design/icons'
import { Avatar, Flex, Tag, Typography } from 'antd'
import dayjs from 'dayjs'
import { agents } from '@/features/helpdesk/data'
import { useHelpdeskText } from '@/features/helpdesk/hooks'
import { initials, type TicketMessage } from '@/features/helpdesk/types'

function MessageItem({ entry }: { entry: TicketMessage }) {
  const { text } = useHelpdeskText()
  const agent = agents.find((candidate) => candidate.name === entry.authorName)
  const label =
    entry.kind === 'customer'
      ? text.customer
      : entry.kind === 'note'
        ? text.internalNote
        : text.agentReply

  return (
    <li
      id={`helpdesk-message-${entry.id}`}
      className={`helpdesk-message helpdesk-message--${entry.kind}`}
    >
      <Avatar
        size={36}
        style={agent ? { backgroundColor: agent.color } : undefined}
        className="helpdesk-message__avatar"
        aria-hidden="true"
      >
        {initials(entry.authorName)}
      </Avatar>
      <div className="helpdesk-message__bubble">
        <Flex align="center" gap={8} wrap className="helpdesk-message__header">
          <Typography.Text strong>{entry.authorName}</Typography.Text>
          <Tag
            variant="filled"
            color={entry.kind === 'note' ? 'gold' : entry.kind === 'reply' ? 'blue' : undefined}
            icon={entry.kind === 'note' ? <LockOutlined /> : undefined}
          >
            {label}
          </Tag>
          <Typography.Text type="secondary" className="helpdesk-message__time">
            <time dateTime={entry.createdAt}>{dayjs(entry.createdAt).format('D MMM, HH:mm')}</time>
          </Typography.Text>
        </Flex>
        <Typography.Paragraph className="helpdesk-message__body">{entry.body}</Typography.Paragraph>
        {entry.attachments && (
          <Flex gap={6} wrap>
            {entry.attachments.map((file) => (
              <Tag key={file.name} icon={<PaperClipOutlined />} className="helpdesk-attachment">
                {file.name} <Typography.Text type="secondary">{file.size}</Typography.Text>
              </Tag>
            ))}
          </Flex>
        )}
      </div>
    </li>
  )
}

/** The thread, oldest first, as it happened: customer messages, replies and notes in one line. */
export function TicketThread({ messages }: { messages: TicketMessage[] }) {
  const { text } = useHelpdeskText()

  return (
    <ol className="helpdesk-thread" aria-label={text.conversation}>
      {messages.map((entry) => (
        <MessageItem key={entry.id} entry={entry} />
      ))}
    </ol>
  )
}
