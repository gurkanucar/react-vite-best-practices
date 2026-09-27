import { BarChartOutlined, CheckOutlined } from '@ant-design/icons'
import {
  Avatar,
  Button,
  Checkbox,
  Divider,
  Flex,
  Modal,
  Progress,
  Radio,
  Tooltip,
  Typography,
} from 'antd'
import { useState } from 'react'
import { ChatAvatar } from '@/features/chat/components/ChatAvatar'
import { authorName, contactById } from '@/features/chat/components/chatText'
import { localize, ME, pollVoters, type ChatPoll } from '@/features/chat/types'
import { useMessages, type Messages } from '@/i18n/messages'
import { usePreferencesStore } from '@/store/preferences-store'

interface PollViewProps {
  poll: ChatPoll
  onVote: (optionId: string) => void
  /** A poll the user can no longer answer, such as one in a group they have left. */
  readOnly?: boolean
}

function voteCount(count: number, messages: Messages) {
  return count === 1 ? messages.chat.vote : messages.chat.votes.replace('{count}', String(count))
}

function VoterAvatar({ id, size }: { id: string; size: number }) {
  const messages = useMessages()

  return id === ME ? (
    <Avatar size={size}>{messages.chat.you[0]}</Avatar>
  ) : (
    <ChatAvatar contact={contactById(id)} size={size} />
  )
}

/**
 * A poll in a bubble, as WhatsApp draws one: each option with a bar for its share of the
 * voters, the faces of who picked it, and a way to see every vote by name.
 */
export function PollView({ poll, onVote, readOnly }: PollViewProps) {
  const messages = useMessages()
  const language = usePreferencesStore((state) => state.language)
  const [resultsOpen, setResultsOpen] = useState(false)
  const voters = pollVoters(poll)
  const Control = poll.multiple ? Checkbox : Radio

  return (
    <div className="chat-poll">
      <Typography.Text strong className="chat-poll__question">
        {localize(poll.question, language)}
      </Typography.Text>
      <Typography.Text type="secondary" className="chat-poll__hint">
        {poll.multiple ? (
          <>
            <CheckOutlined /> <CheckOutlined className="chat-poll__hint-second" />
          </>
        ) : (
          <CheckOutlined />
        )}{' '}
        {poll.multiple ? messages.chat.selectMany : messages.chat.selectOne}
      </Typography.Text>

      <Flex vertical gap={12} className="chat-poll__options">
        {poll.options.map((option) => {
          const picked = poll.votes[option.id] ?? []
          const mine = picked.includes(ME)
          const text = localize(option.text, language)

          return (
            <div key={option.id} className="chat-poll__option">
              <Flex align="center" gap={8}>
                <Control
                  checked={mine}
                  disabled={readOnly}
                  // A radio does not report a click on the one already chosen; the poll
                  // takes that click as taking the vote back, so it listens to clicks.
                  onClick={() => onVote(option.id)}
                  className="chat-poll__control"
                >
                  {text}
                </Control>
                {picked.length > 0 && (
                  <Avatar.Group size={20} max={{ count: 3 }}>
                    {picked.map((id) => (
                      <VoterAvatar key={id} id={id} size={20} />
                    ))}
                  </Avatar.Group>
                )}
                <Typography.Text className="chat-poll__count">{picked.length}</Typography.Text>
              </Flex>
              <Progress
                percent={voters === 0 ? 0 : (picked.length / voters) * 100}
                showInfo={false}
                size="small"
                status="success"
                aria-label={`${text}: ${voteCount(picked.length, messages)}`}
              />
            </div>
          )
        })}
      </Flex>

      <Divider className="chat-poll__divider" />
      <Tooltip title={voteCount(voters, messages)}>
        <Button
          type="link"
          block
          icon={<BarChartOutlined />}
          disabled={voters === 0}
          onClick={() => setResultsOpen(true)}
        >
          {voters === 0 ? messages.chat.noVotes : messages.chat.viewVotes}
        </Button>
      </Tooltip>

      <Modal
        open={resultsOpen}
        onCancel={() => setResultsOpen(false)}
        footer={null}
        title={messages.chat.pollResults}
        width={420}
      >
        <Typography.Title level={5}>{localize(poll.question, language)}</Typography.Title>
        <Flex vertical gap={16}>
          {poll.options.map((option) => {
            const picked = poll.votes[option.id] ?? []

            return (
              <div key={option.id}>
                <Flex justify="space-between" gap={8}>
                  <Typography.Text strong>{localize(option.text, language)}</Typography.Text>
                  <Typography.Text type="secondary">
                    {voteCount(picked.length, messages)}
                  </Typography.Text>
                </Flex>
                <Flex vertical gap={8} className="chat-poll__voters">
                  {picked.map((id) => (
                    <Flex key={id} align="center" gap={8}>
                      <VoterAvatar id={id} size={28} />
                      <Typography.Text>{authorName(id, messages)}</Typography.Text>
                    </Flex>
                  ))}
                </Flex>
              </div>
            )
          })}
        </Flex>
      </Modal>
    </div>
  )
}
