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
import {
  Alert,
  App,
  Button,
  Card,
  Dropdown,
  Empty,
  Flex,
  InputNumber,
  Table,
  Tag,
  Typography,
} from 'antd'
import type { MenuProps, TableProps } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ColumnVisibilityButton } from '@/components/ColumnVisibility/ColumnVisibilityButton'
import { useColumnVisibility } from '@/components/ColumnVisibility/useColumnVisibility'
import { LoadingState } from '@/components/LoadingState/LoadingState'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import { FEATURE_FLAGS } from '@/config/featureFlags'
import {
  PostsFilterPanel,
  QuickCreatePostModal,
  QuickEditPostDrawer,
  QuickShowPostModal,
} from '@/features/posts/components'
import {
  useDeletePostMutation,
  usePostCategoriesQuery,
  usePostFilterParams,
  usePostsQuery,
} from '@/features/posts/hooks'
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
  // The ID is rarely what a reader needs, so it ships hidden and stays one click away.
  const { hiddenKeys, resetColumns, toggleColumn, visibleColumns } = useColumnVisibility<PostDto>(
    'posts',
    ['id'],
  )
  const postsQuery = usePostsQuery(filters)
  const categoriesQuery = usePostCategoriesQuery(filteringEnabled)
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
      width: 180,
      // The same filter is offered twice: here in the header and in the panel above.
      // Both write `categories` to the URL, so neither can drift out of sync.
      filters: (categoriesQuery.data ?? []).map((category: string) => ({
        text: category,
        value: category,
      })),
      filteredValue: values.categories.length > 0 ? values.categories : null,
      render: (category?: string) => (category ? <Tag>{category}</Tag> : '—'),
    },
    {
      title: messages.posts.viewsColumn,
      dataIndex: 'views',
      key: 'views',
      width: 140,
      sorter: filteringEnabled,
      sortOrder: sortOrderFor('views'),
      // A range does not fit the checkbox list antd renders by default, so the header
      // filter supplies its own dropdown and writes the same parameters as the panel.
      filteredValue: (values.minViews ?? values.maxViews) ? ['range'] : null,
      filterDropdown: filteringEnabled
        ? ({ confirm }) => (
            <Flex vertical gap={8} style={{ padding: 8 }}>
              <InputNumber
                min={0}
                placeholder={messages.posts.minPlaceholder}
                value={values.minViews}
                onChange={(minViews) => updateFilters({ minViews: minViews?.toString() })}
              />
              <InputNumber
                min={0}
                placeholder={messages.posts.maxPlaceholder}
                value={values.maxViews}
                onChange={(maxViews) => updateFilters({ maxViews: maxViews?.toString() })}
              />
              <Button size="small" type="primary" onClick={() => confirm({ closeDropdown: true })}>
                {messages.common.apply}
              </Button>
            </Flex>
          )
        : undefined,
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

  // Sorting and header filters are applied by the handler, so the table only reports
  // them and the URL keeps them.
  const updateSortAndFilters: TableProps<PostDto>['onChange'] = (
    _pagination,
    tableFilters,
    sorter,
  ) => {
    const activeSorter = Array.isArray(sorter) ? sorter[0] : sorter
    const sortedField = activeSorter?.order ? String(activeSorter.columnKey) : null
    const selectedCategories = (tableFilters.category ?? []).map(String)

    updateFilters({
      categories: selectedCategories.join(',') || undefined,
      ...(sortedField && isPostSortField(sortedField)
        ? { sort: sortedField, order: activeSorter?.order === 'descend' ? 'desc' : 'asc' }
        : { sort: undefined, order: undefined }),
    })
  }

  const columnOptions = columns
    .filter((column) => column.key !== 'actions')
    .map((column) => ({ key: String(column.key), label: String(column.title) }))

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
            <ColumnVisibilityButton
              hiddenKeys={hiddenKeys}
              options={columnOptions}
              onReset={resetColumns}
              onToggle={toggleColumn}
            />
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

          {postsQuery.isPending && <LoadingState />}

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
                columns={visibleColumns(columns)}
                dataSource={posts}
                loading={postsQuery.isFetching}
                pagination={false}
                rowKey="id"
                scroll={{ x: 'max-content' }}
                onChange={updateSortAndFilters}
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
