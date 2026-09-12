import { App, Form, Input, InputNumber, Modal } from 'antd'
import { usePostsMutations } from '@/features/posts/hooks'
import type { CreatePostRequest } from '@/features/posts/types'
import { useMessages } from '@/i18n/messages'

interface QuickCreatePostModalProps {
  open: boolean
  onClose: () => void
}

export function QuickCreatePostModal({ open, onClose }: QuickCreatePostModalProps) {
  const messages = useMessages()
  const { message } = App.useApp()
  const [form] = Form.useForm<CreatePostRequest>()
  const { createPost } = usePostsMutations()

  const submit = (values: CreatePostRequest) => {
    createPost.mutate(values, {
      onSuccess: () => {
        form.resetFields()
        onClose()
        void message.success(messages.posts.created)
      },
      onError: () => void message.error(messages.posts.createError),
    })
  }

  return (
    <Modal
      destroyOnHidden
      cancelText={messages.common.cancel}
      confirmLoading={createPost.isPending}
      okText={messages.posts.create}
      open={open}
      title={messages.posts.quickCreateTitle}
      onCancel={onClose}
      onOk={() => form.submit()}
    >
      <Form<CreatePostRequest>
        form={form}
        layout="vertical"
        initialValues={{ userId: 1 }}
        onFinish={submit}
      >
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
      </Form>
    </Modal>
  )
}
