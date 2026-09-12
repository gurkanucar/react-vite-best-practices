import { Form, Input, InputNumber } from 'antd'
import { useMessages } from '@/i18n/messages'

/**
 * The create modal, the quick-edit drawer, and the edit page all submit the same
 * shape, so the fields live here and each surface owns only its own chrome.
 */
export function PostFormFields() {
  const messages = useMessages()

  return (
    <>
      <Form.Item
        label={messages.posts.titleLabel}
        name="title"
        rules={[{ required: true, message: messages.posts.titleRequired }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={messages.posts.bodyLabel}
        name="body"
        rules={[{ required: true, message: messages.posts.bodyRequired }]}
      >
        <Input.TextArea rows={4} />
      </Form.Item>
      <Form.Item
        label={messages.posts.userLabel}
        name="userId"
        rules={[{ required: true, message: messages.posts.userRequired }]}
      >
        <InputNumber className="full-width" min={1} precision={0} />
      </Form.Item>
    </>
  )
}
