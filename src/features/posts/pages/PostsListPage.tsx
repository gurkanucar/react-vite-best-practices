import { ReloadOutlined, SendOutlined } from '@ant-design/icons'
import { useQueryClient } from '@tanstack/react-query'
import { Alert, App, Button, Card, Empty, Flex, Spin, Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useState } from 'react'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import { QuickCreatePostModal } from '@/features/posts/components'
import { usePostsQuery } from '@/features/posts/hooks'
import { DEFAULT_POST_FILTERS, POST_QUERY_KEYS, type PostDto } from '@/features/posts/types'
import { useMessages } from '@/i18n/messages'

export function PostsListPage() {
  const messages = useMessages()
  const { message } = App.useApp()
  const queryClient = useQueryClient()
  const postsQuery = usePostsQuery()
  const [quickCreateOpen, setQuickCreateOpen] = useState(false)

  const columns: ColumnsType<PostDto> = [
    { title: messages.posts.id, dataIndex: 'id', key: 'id', width: 80 },
    { title: messages.posts.titleColumn, dataIndex: 'title', key: 'title', width: 300 },
    { title: messages.posts.body, dataIndex: 'body', key: 'body' },
    { title: messages.posts.user, dataIndex: 'userId', key: 'userId', width: 100 },
  ]

  const invalidatePosts = async () => {
    await queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.lists() })
    void message.success(messages.posts.invalidated)
  }

  return (
    <div className="admin-page">
      <PageHeader title={messages.posts.title} description={messages.posts.description} />

      <Card
        className="dashboard-panel"
        title={messages.posts.listTitle}
        extra={
          <Flex gap={8} wrap>
            <Button
              icon={<ReloadOutlined aria-hidden="true" />}
              loading={postsQuery.isFetching}
              onClick={() => void invalidatePosts()}
            >
              {messages.posts.invalidate}
            </Button>
            <Button
              icon={<SendOutlined aria-hidden="true" />}
              type="primary"
              onClick={() => setQuickCreateOpen(true)}
            >
              {messages.posts.create}
            </Button>
          </Flex>
        }
      >
        <Flex vertical gap={16}>
          <Alert showIcon type="info" title={messages.posts.demoNotice} />
          <Typography.Text type="secondary">
            {messages.posts.cacheKey}:{' '}
            <Typography.Text code>
              {JSON.stringify(POST_QUERY_KEYS.list(DEFAULT_POST_FILTERS))}
            </Typography.Text>
          </Typography.Text>

          {postsQuery.isPending && (
            <output>
              <Flex align="center" justify="center" gap={12}>
                <Spin />
                <Typography.Text>{messages.common.loadingPage}</Typography.Text>
              </Flex>
            </output>
          )}

          {postsQuery.isError && (
            <Alert
              showIcon
              type="error"
              title={messages.posts.loadError}
              description={postsQuery.error.message}
              action={
                <Button onClick={() => void postsQuery.refetch()}>{messages.posts.retry}</Button>
              }
            />
          )}

          {postsQuery.isSuccess && postsQuery.data.length === 0 && (
            <Empty description={messages.posts.empty} />
          )}

          {postsQuery.isSuccess && postsQuery.data.length > 0 && (
            <>
              <Flex justify="space-between" align="center" gap={12} wrap>
                <Tag color="success">{messages.posts.cached}</Tag>
                <Typography.Text type="secondary">
                  {messages.posts.resultCount.replace('{count}', String(postsQuery.data.length))}
                </Typography.Text>
              </Flex>
              <Table<PostDto>
                columns={columns}
                dataSource={postsQuery.data}
                pagination={false}
                rowKey="id"
                scroll={{ x: 'max-content' }}
              />
            </>
          )}
        </Flex>
      </Card>

      <QuickCreatePostModal open={quickCreateOpen} onClose={() => setQuickCreateOpen(false)} />
    </div>
  )
}
