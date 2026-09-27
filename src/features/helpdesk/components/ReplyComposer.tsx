import { DownOutlined, LockOutlined, SendOutlined } from '@ant-design/icons'
import { Button, Dropdown, Flex, Form, Input, Segmented, Select, Space } from 'antd'
import { useState } from 'react'
import { useHelpdeskText } from '@/features/helpdesk/hooks'
import type { TicketStatus } from '@/features/helpdesk/types'

type ComposerMode = 'reply' | 'note'

interface ReplyComposerProps {
  onSubmit: (kind: ComposerMode, body: string, status?: TicketStatus) => void
}

/**
 * One box for both kinds of message. A note is tinted like the notes in the thread, so it
 * is obvious before sending that the customer will not see it.
 */
export function ReplyComposer({ onSubmit }: ReplyComposerProps) {
  const { text } = useHelpdeskText()
  const [mode, setMode] = useState<ComposerMode>('reply')
  const [body, setBody] = useState('')
  const [error, setError] = useState(false)

  const submit = (status?: TicketStatus) => {
    if (!body.trim()) {
      setError(true)
      return
    }
    onSubmit(mode, body, status)
    setBody('')
    setError(false)
  }

  return (
    <div className={`helpdesk-composer helpdesk-composer--${mode}`}>
      <Flex justify="space-between" align="center" gap={8} wrap>
        <Segmented<ComposerMode>
          value={mode}
          onChange={setMode}
          options={[
            { value: 'reply', label: text.reply, icon: <SendOutlined aria-hidden="true" /> },
            { value: 'note', label: text.note, icon: <LockOutlined aria-hidden="true" /> },
          ]}
        />
        <Select
          placeholder={text.cannedResponses}
          aria-label={text.cannedResponses}
          value={null}
          className="helpdesk-composer__canned"
          options={text.cannedReplies.map((reply, index) => ({ value: index, label: reply.label }))}
          // A saved reply is added to what is already written, not swapped in over it.
          onChange={(index: number) => {
            const canned = text.cannedReplies[index]?.body ?? ''
            setBody((current) => (current.trim() ? `${current.trimEnd()}\n\n${canned}` : canned))
            setError(false)
          }}
        />
      </Flex>

      <Form.Item
        className="helpdesk-composer__field"
        validateStatus={error ? 'error' : undefined}
        help={error ? text.bodyRequired : undefined}
      >
        <Input.TextArea
          value={body}
          onChange={(event) => {
            setBody(event.target.value)
            if (error) setError(false)
          }}
          autoSize={{ minRows: 4, maxRows: 12 }}
          placeholder={mode === 'reply' ? text.replyPlaceholder : text.notePlaceholder}
          aria-label={mode === 'reply' ? text.replyPlaceholder : text.notePlaceholder}
        />
      </Form.Item>

      <Flex justify="end">
        {mode === 'reply' ? (
          <Space.Compact>
            <Button
              type="primary"
              icon={<SendOutlined aria-hidden="true" />}
              onClick={() => submit()}
            >
              {text.send}
            </Button>
            <Dropdown
              trigger={['click']}
              menu={{
                items: (['pending', 'resolved'] as const).map((status) => ({
                  key: status,
                  label: text.sendAnd(text.statuses[status]),
                })),
                onClick: ({ key }) => submit(key as TicketStatus),
              }}
            >
              <Button type="primary" icon={<DownOutlined />} aria-label={text.sendAnd('…')} />
            </Dropdown>
          </Space.Compact>
        ) : (
          <Button icon={<LockOutlined aria-hidden="true" />} onClick={() => submit()}>
            {text.addNote}
          </Button>
        )}
      </Flex>
    </div>
  )
}
