import {
  BulbOutlined,
  ClearOutlined,
  CodeOutlined,
  FileTextOutlined,
  RobotOutlined,
  TableOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Bubble, Prompts, Sender, Welcome } from '@ant-design/x'
import { Alert, App, Avatar, Button, Card, Flex } from 'antd'
import { useState } from 'react'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import { FEATURE_FLAGS } from '@/config/featureFlags'
import { useAssistantChat } from '@/features/assistant/hooks'
import { useMessages } from '@/i18n/messages'
import './AssistantPage.css'

export function AssistantPage() {
  const messages = useMessages()
  const { message } = App.useApp()
  const chat = useAssistantChat()
  const [draft, setDraft] = useState('')
  const assistantEnabled = FEATURE_FLAGS.assistant

  const suggestions = [
    { key: 'filters', icon: <TableOutlined />, description: messages.assistant.promptFilters },
    { key: 'mocking', icon: <CodeOutlined />, description: messages.assistant.promptMocking },
    { key: 'pdf', icon: <FileTextOutlined />, description: messages.assistant.promptPdf },
    { key: 'docker', icon: <BulbOutlined />, description: messages.assistant.promptDocker },
  ]

  const submit = (value: string) => {
    setDraft('')
    void chat.send(value)
  }

  return (
    <div className="admin-page">
      <PageHeader
        title={messages.assistant.title}
        description={messages.assistant.description}
        extra={
          chat.messages.length > 0 && (
            <Button icon={<ClearOutlined aria-hidden="true" />} onClick={chat.clear}>
              {messages.assistant.clear}
            </Button>
          )
        }
      />

      <Flex vertical gap={16}>
        <Alert
          showIcon
          type="info"
          title={
            FEATURE_FLAGS.mockAssistantApi
              ? messages.assistant.notice
              : messages.assistant.realApiNotice
          }
        />

        {chat.error && (
          <Alert
            showIcon
            closable
            type="error"
            title={messages.assistant.error}
            description={chat.error.message}
          />
        )}

        <Card className="assistant-panel">
          <Flex vertical gap={16} className="assistant-conversation">
            {/* The transcript takes the remaining height, which keeps the composer at the
                bottom from the first render rather than only once messages arrive. */}
            <div className="assistant-body">
              {chat.messages.length === 0 ? (
                <Flex vertical gap={16}>
                  <Welcome
                    icon={<Avatar size={48} icon={<RobotOutlined />} />}
                    title={messages.assistant.welcomeTitle}
                    description={messages.assistant.welcomeDescription}
                    variant="filled"
                  />
                  <Prompts
                    items={suggestions}
                    title={messages.assistant.promptsTitle}
                    wrap
                    onItemClick={({ data }) => submit(String(data.description))}
                  />
                </Flex>
              ) : (
                <Bubble.List
                  autoScroll
                  className="assistant-bubbles"
                  items={chat.messages.map((entry) => ({
                    content: entry.content,
                    key: entry.id,
                    loading: entry.role === 'assistant' && entry.streaming && !entry.content,
                    role: entry.role,
                  }))}
                  role={{
                    user: {
                      placement: 'end',
                      avatar: <Avatar icon={<UserOutlined />} />,
                    },
                    assistant: {
                      placement: 'start',
                      avatar: <Avatar icon={<RobotOutlined />} />,
                    },
                  }}
                />
              )}
            </div>

            <Sender
              disabled={!assistantEnabled}
              loading={chat.isStreaming}
              placeholder={messages.assistant.placeholder}
              value={draft}
              onCancel={() => {
                chat.cancel()
                void message.info(messages.assistant.cancelled)
              }}
              onChange={setDraft}
              onSubmit={submit}
            />
          </Flex>
        </Card>
      </Flex>
    </div>
  )
}
