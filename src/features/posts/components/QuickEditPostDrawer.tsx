import { Alert, App, Button, Drawer, Flex, Form } from 'antd'
import { useEffect } from 'react'
import { LoadingState } from '@/components/LoadingState/LoadingState'
import { PostFormFields } from '@/features/posts/components/PostFormFields'
import { usePostQuery, useUpdatePostMutation } from '@/features/posts/hooks'
import type { UpdatePostRequest } from '@/features/posts/types'
import { useMessages } from '@/i18n/messages'

interface QuickEditPostDrawerProps {
  postId: number | null
  onClose: () => void
}

export function QuickEditPostDrawer({ postId, onClose }: QuickEditPostDrawerProps) {
  const messages = useMessages()
  const { message } = App.useApp()
  const [form] = Form.useForm<UpdatePostRequest>()
  const open = postId !== null
  const postQuery = usePostQuery(postId ?? 0, open)
  const updatePost = useUpdatePostMutation()
  const post = postQuery.data

  // The drawer stays mounted between rows, so the form is refilled whenever the
  // loaded post changes rather than only on first render.
  useEffect(() => {
    if (post) {
      form.setFieldsValue(post)
    }
  }, [form, post])

  const submit = (values: UpdatePostRequest) => {
    if (postId === null) return

    updatePost.mutate(
      { ...values, id: postId },
      {
        onSuccess: () => {
          onClose()
          void message.success(messages.posts.updated)
        },
        onError: () => void message.error(messages.posts.updateError),
      },
    )
  }

  return (
    <Drawer
      destroyOnHidden
      open={open}
      title={messages.posts.quickEditTitle}
      width={420}
      onClose={onClose}
      footer={
        <Flex gap={8} justify="flex-end">
          <Button onClick={onClose}>{messages.common.cancel}</Button>
          <Button
            disabled={!post}
            loading={updatePost.isPending}
            type="primary"
            onClick={() => form.submit()}
          >
            {messages.posts.save}
          </Button>
        </Flex>
      }
    >
      {postQuery.isPending && <LoadingState />}

      {postQuery.isError && (
        <Alert
          showIcon
          type="error"
          title={messages.posts.detailLoadError}
          description={postQuery.error.message}
        />
      )}

      {post && (
        <Form<UpdatePostRequest>
          form={form}
          layout="vertical"
          initialValues={post}
          onFinish={submit}
        >
          <PostFormFields />
        </Form>
      )}
    </Drawer>
  )
}
