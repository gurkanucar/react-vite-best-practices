import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons'
import { Alert, Button, Card, Flex, Spin, Typography } from 'antd'
import { Link } from 'react-router'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import { PostDetails } from '@/features/posts/components'
import { usePostQuery } from '@/features/posts/hooks'
import { useNumericRouteParam } from '@/router/useNumericRouteParam'
import { useMessages } from '@/i18n/messages'

export function PostDetailPage() {
  const messages = useMessages()
  const postId = useNumericRouteParam('postId')
  const postQuery = usePostQuery(postId ?? 0, postId !== null)

  return (
    <div className="admin-page">
      <PageHeader
        title={messages.posts.detailTitle}
        description={messages.posts.detailDescription}
      />

      <Card
        className="dashboard-panel"
        title={postId === null ? messages.posts.detailTitle : `#${postId}`}
        extra={
          <Flex gap={8} wrap>
            <Link to="/posts">
              <Button icon={<ArrowLeftOutlined aria-hidden="true" />}>
                {messages.posts.backToList}
              </Button>
            </Link>
            {postId !== null && (
              <Link to={`/posts/${postId}/edit`}>
                <Button icon={<EditOutlined aria-hidden="true" />} type="primary">
                  {messages.posts.edit}
                </Button>
              </Link>
            )}
          </Flex>
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

        {postQuery.isSuccess && <PostDetails post={postQuery.data} />}
      </Card>
    </div>
  )
}
