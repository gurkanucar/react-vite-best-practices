import { PictureOutlined, VideoCameraOutlined } from '@ant-design/icons'
import { App, Button, Card, Flex, Input } from 'antd'
import { useState } from 'react'
import { useMessages } from '@/i18n/messages'

export function PostComposer() {
  const messages = useMessages()
  const { message } = App.useApp()
  const [body, setBody] = useState('')

  return (
    <Card>
      <Input.TextArea
        value={body}
        onChange={(event) => setBody(event.target.value)}
        placeholder={messages.profile.composerPlaceholder}
        autoSize={{ minRows: 3, maxRows: 8 }}
      />

      <Flex justify="space-between" align="center" gap={8} wrap style={{ marginTop: 16 }}>
        <Flex gap={8} wrap>
          <Button type="text" icon={<PictureOutlined aria-hidden="true" />}>
            {messages.profile.attachImage}
          </Button>
          <Button type="text" icon={<VideoCameraOutlined aria-hidden="true" />}>
            {messages.profile.startStream}
          </Button>
        </Flex>

        <Button
          type="primary"
          disabled={body.trim().length === 0}
          onClick={() => {
            setBody('')
            message.success(messages.profile.posted)
          }}
        >
          {messages.profile.post}
        </Button>
      </Flex>
    </Card>
  )
}
