import { ArrowLeftOutlined } from '@ant-design/icons'
import { Alert, App, Button, Card, Flex, Form, Spin, Typography } from 'antd'
import { Link, useNavigate } from 'react-router'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import { PostFormFields } from '@/features/posts/components'
import { usePostQuery, useUpdatePostMutation } from '@/features/posts/hooks'
import { useNumericRouteParam } from '@/router/useNumericRouteParam'
import type { UpdatePostRequest } from '@/features/posts/types'
import { useMessages } from '@/i18n/messages'

export function PostEditPage() {
  const messages = useMessages()
  const { message } = App.useApp()
  const navigate = useNavigate()
  const postId = useNumericRouteParam('postId')
  const postQuery = usePostQuery(postId ?? 0, postId !== null)
  const updatePost = useUpdatePostMutation()
  const post = postQuery.data

  const submit = (values: UpdatePostRequest) => {
    if (postId === null) return

    updatePost.mutate(
      { ...values, id: postId },
      {
        onSuccess: () => {
          void message.success(messages.posts.updated)
          void navigate(`/posts/${postId}`)
        },
        onError: () => void message.error(messages.posts.updateError),
      },
    )
  }

  return (
    <div className="admin-page">
      <PageHeader title={messages.posts.editTitle} description={messages.posts.editDescription} />

      <Card
        className="dashboard-panel"
        title={postId === null ? messages.posts.editTitle : `#${postId}`}
        extra={
          <Link to={postId === null ? '/posts' : `/posts/${postId}`}>
            <Button icon={<ArrowLeftOutlined aria-hidden="true" />}>
              {messages.posts.backToList}
            </Button>
          </Link>
        }
      >
        {postId === null && <Alert showIcon type="error" title={messages.posts.invalidId} />}

        {postQuery.isPending && postId !== null && (
          <output>
            <Flex align="center" justify="center" gap={12}>
              <Spin />
              <Typography.Text>{messages.common.loadingPage}</Typography.Text>
            </Flex>
          </output>
        )}

        {postQuery.isError && (
          <Alert
            showIcon
            type="error"
            title={messages.posts.detailLoadError}
            description={postQuery.error.message}
            action={
              <Button onClick={() => void postQuery.refetch()}>{messages.posts.retry}</Button>
            }
          />
        )}

        {post && (
          <Form<UpdatePostRequest>
            layout="vertical"
            initialValues={post}
            onFinish={submit}
            style={{ maxWidth: 560 }}
          >
            <PostFormFields />
            <Flex gap={8}>
              <Button htmlType="submit" loading={updatePost.isPending} type="primary">
                {messages.posts.save}
              </Button>
              <Link to={`/posts/${postId}`}>
                <Button>{messages.common.cancel}</Button>
              </Link>
            </Flex>
          </Form>
        )}
      </Card>
    </div>
  )
}
