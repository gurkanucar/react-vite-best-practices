import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
  ReloadOutlined,
  SendOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons'
import { useQueryClient } from '@tanstack/react-query'
import { Alert, App, Button, Card, Dropdown, Empty, Flex, Spin, Table, Tag, Typography } from 'antd'
import type { MenuProps, TableProps } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import { FEATURE_FLAGS } from '@/config/featureFlags'
import {
  PostsFilterPanel,
  QuickCreatePostModal,
  QuickEditPostDrawer,
  QuickShowPostModal,
} from '@/features/posts/components'
import { useDeletePostMutation, usePostFilterParams, usePostsQuery } from '@/features/posts/hooks'
import { isPostSortField, POST_QUERY_KEYS, type PostDto } from '@/features/posts/types'
import { useMessages } from '@/i18n/messages'

export function PostsListPage() {
  const messages = useMessages()
  const { message, modal } = App.useApp()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  // Only the mock API implements these filters, so the flag gates the whole panel
  // instead of showing controls that would silently do nothing.
  const filteringEnabled = FEATURE_FLAGS.mockPostsApi
  const { clearFilters, filters, hasActiveFilters, updateFilters, values } = usePostFilterParams()
  const postsQuery = usePostsQuery(filters)
  const deletePost = useDeletePostMutation()
  const [quickCreateOpen, setQuickCreateOpen] = useState(false)
  const [quickShowPostId, setQuickShowPostId] = useState<number | null>(null)
  const [quickEditPostId, setQuickEditPostId] = useState<number | null>(null)
  const posts = postsQuery.data ?? []
  const sortOrderFor = (field: string) =>
    values.sortBy === field ? (values.order === 'desc' ? 'descend' : 'ascend') : null

  const columns: ColumnsType<PostDto> = [
    { title: messages.posts.id, dataIndex: 'id', key: 'id', width: 80 },
    {
      title: messages.posts.titleColumn,
      dataIndex: 'title',
      key: 'title',
      width: 280,
      sorter: filteringEnabled,
      sortOrder: sortOrderFor('title'),
    },
    {
      title: messages.posts.categoryColumn,
      dataIndex: 'category',
      key: 'category',
      width: 160,
      render: (category?: string) => (category ? <Tag>{category}</Tag> : '—'),
    },
    {
      title: messages.posts.viewsColumn,
      dataIndex: 'views',
      key: 'views',
      width: 120,
      sorter: filteringEnabled,
      sortOrder: sortOrderFor('views'),
      render: (views?: number) => views?.toLocaleString() ?? '—',
    },
    {
      title: messages.posts.publishedColumn,
      dataIndex: 'publishedAt',
      key: 'publishedAt',
      width: 140,
      sorter: filteringEnabled,
      sortOrder: sortOrderFor('publishedAt'),
      render: (publishedAt?: string) => publishedAt ?? '—',
    },
    { title: messages.posts.user, dataIndex: 'userId', key: 'userId', width: 100 },
    {
      title: messages.posts.actions,
      key: 'actions',
      width: 96,
      fixed: 'right',
      align: 'center',
      // Five actions do not fit a row, so they collapse into an overflow menu. The
      // products table keeps its two actions inline instead.
      render: (_value, post) => (
        <Dropdown trigger={['click']} menu={{ items: actionItems(post) }}>
          <Button
            aria-label={messages.posts.actions}
            icon={<MoreOutlined aria-hidden="true" />}
            loading={deletePost.isPending && deletePost.variables === post.id}
          />
        </Dropdown>
      ),
    },
  ]

  const actionItems = (post: PostDto): MenuProps['items'] => [
    {
      key: 'show',
      icon: <EyeOutlined aria-hidden="true" />,
      label: messages.posts.show,
      onClick: () => void navigate(`/posts/${post.id}`),
    },
    {
      key: 'quick-show',
      icon: <ThunderboltOutlined aria-hidden="true" />,
      label: messages.posts.quickShow,
      onClick: () => setQuickShowPostId(post.id),
    },
    {
      key: 'edit',
      icon: <EditOutlined aria-hidden="true" />,
      label: messages.posts.edit,
      onClick: () => void navigate(`/posts/${post.id}/edit`),
    },
    {
      key: 'quick-edit',
      icon: <EditOutlined aria-hidden="true" />,
      label: messages.posts.quickEdit,
      onClick: () => setQuickEditPostId(post.id),
    },
    { type: 'divider' },
    {
      key: 'delete',
      danger: true,
      icon: <DeleteOutlined aria-hidden="true" />,
      label: messages.posts.delete,
      onClick: () => confirmDelete(post),
    },
  ]

  const confirmDelete = (post: PostDto) => {
    modal.confirm({
      title: messages.posts.deleteConfirm,
      content: post.title,
      cancelText: messages.common.cancel,
      okText: messages.posts.delete,
      okButtonProps: { danger: true },
      onOk: () =>
        deletePost.mutateAsync(post.id).then(
          () => void message.success(messages.posts.deleted),
          () => void message.error(messages.posts.deleteError),
        ),
    })
  }

  // Sorting is applied by the handler, so the table only reports it and the URL keeps it.
  const updateSort: TableProps<PostDto>['onChange'] = (_pagination, _tableFilters, sorter) => {
    const activeSorter = Array.isArray(sorter) ? sorter[0] : sorter
    const sortedField = activeSorter?.order ? String(activeSorter.columnKey) : null

    updateFilters(
      sortedField && isPostSortField(sortedField)
        ? { sort: sortedField, order: activeSorter?.order === 'descend' ? 'desc' : 'asc' }
        : { sort: undefined, order: undefined },
    )
  }

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
          <Alert
            showIcon
            type="info"
            title={
              FEATURE_FLAGS.mockPostsApi ? messages.posts.mockNotice : messages.posts.demoNotice
            }
          />
          {filteringEnabled && (
            <PostsFilterPanel
              hasActiveFilters={hasActiveFilters}
              values={values}
              onChange={updateFilters}
              onClear={clearFilters}
            />
          )}

          <Typography.Text type="secondary">
            {messages.posts.cacheKey}:{' '}
            <Typography.Text code>{JSON.stringify(POST_QUERY_KEYS.list(filters))}</Typography.Text>
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

          {postsQuery.isSuccess && posts.length === 0 && (
            <Empty description={messages.posts.empty} />
          )}

          {postsQuery.isSuccess && posts.length > 0 && (
            <>
              <Flex justify="space-between" align="center" gap={12} wrap>
                <Tag color="success">{messages.posts.cached}</Tag>
                <Typography.Text type="secondary">
                  {messages.posts.resultCount.replace('{count}', String(posts.length))}
                </Typography.Text>
              </Flex>
              <Table<PostDto>
                columns={columns}
                dataSource={posts}
                loading={postsQuery.isFetching}
                pagination={false}
                rowKey="id"
                scroll={{ x: 'max-content' }}
                onChange={updateSort}
              />
            </>
          )}
        </Flex>
      </Card>

      <QuickCreatePostModal open={quickCreateOpen} onClose={() => setQuickCreateOpen(false)} />
      <QuickShowPostModal postId={quickShowPostId} onClose={() => setQuickShowPostId(null)} />
      <QuickEditPostDrawer postId={quickEditPostId} onClose={() => setQuickEditPostId(null)} />
    </div>
  )
}
