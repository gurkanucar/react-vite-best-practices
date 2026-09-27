import { MessageOutlined } from '@ant-design/icons'
import { Card, Empty, Grid, Typography } from 'antd'
// import { PageHeader } from '@/components/PageHeader/PageHeader'
import { ChatThread, ConversationList } from '@/features/chat/components'
import { useChat } from '@/features/chat/hooks'
import { useMessages } from '@/i18n/messages'
import '@/features/chat/pages/ChatPage.css'

export function ChatPage() {
  const messages = useMessages()
  const chat = useChat()
  // Side by side from a tablet up; on a phone the list and the open chat take turns.
  const wide = Grid.useBreakpoint().md ?? true
  const active = chat.conversations.find((conversation) => conversation.id === chat.activeId)

  const showList = wide || !active
  const showThread = wide || Boolean(active)

  return (
    <div className="admin-page">
      {/* <PageHeader title={messages.chat.title} /> */}

      <Card className="chat-panel" styles={{ body: { padding: 0 } }}>
        <div className={`chat-layout${wide ? '' : ' chat-layout--single'}`}>
          {showList && (
            <ConversationList
              conversations={chat.conversations}
              activeId={chat.activeId}
              typing={chat.typing}
              onOpen={chat.open}
            />
          )}

          {showThread &&
            (active ? (
              <ChatThread
                // A fresh thread per chat, so a half-written reply does not follow you around.
                key={active.id}
                conversation={active}
                typingAuthorId={chat.typing[active.id]}
                onBack={wide ? undefined : () => chat.open(null)}
                onSend={(draft) => chat.send(active.id, draft)}
                onReact={(messageId, emoji) => chat.react(active.id, messageId, emoji)}
                onVote={(messageId, optionId) => chat.vote(active.id, messageId, optionId)}
                onDelete={(messageId) => chat.remove(active.id, messageId)}
                onClear={() => chat.clear(active.id)}
                onToggle={(flag) => chat.toggle(active.id, flag)}
                conversations={chat.conversations}
                onMessage={chat.message}
                onOpenConversation={chat.open}
                onAddMembers={(memberIds) => chat.addMembers(active.id, memberIds)}
                onLeave={() => chat.leave(active.id)}
              />
            ) : (
              <Empty
                className="chat-placeholder"
                image={<MessageOutlined className="chat-placeholder__icon" />}
                description={
                  <>
                    <Typography.Title level={4}>{messages.chat.selectTitle}</Typography.Title>
                    <Typography.Text type="secondary">
                      {messages.chat.selectDescription}
                    </Typography.Text>
                  </>
                }
              />
            ))}
        </div>
      </Card>
    </div>
  )
}
