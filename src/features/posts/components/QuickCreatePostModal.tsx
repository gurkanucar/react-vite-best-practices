import { App, Form, Modal } from 'antd'
import { PostFormFields } from '@/features/posts/components/PostFormFields'
import { useCreatePostMutation } from '@/features/posts/hooks'
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
  const createPost = useCreatePostMutation()

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
        <PostFormFields />
      </Form>
    </Modal>
  )
}
