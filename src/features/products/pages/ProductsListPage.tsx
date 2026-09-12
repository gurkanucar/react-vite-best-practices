import { EyeOutlined, ReloadOutlined, ThunderboltOutlined } from '@ant-design/icons'
import { useQueryClient } from '@tanstack/react-query'
import {
  Alert,
  App,
  Button,
  Card,
  Empty,
  Flex,
  Input,
  Pagination,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
} from 'antd'
import type { TableProps } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import { QuickShowProductModal } from '@/features/products/components'
import { useProductCategoriesQuery, useProductsQuery } from '@/features/products/hooks'
import {
  isProductSortField,
  PRODUCT_PAGE_SIZE,
  PRODUCT_QUERY_KEYS,
  type ProductDto,
  type ProductFilterParams,
} from '@/features/products/types'
import { useMessages } from '@/i18n/messages'
import { usePreferencesStore } from '@/store/preferences-store'

export function ProductsListPage() {
  const messages = useMessages()
  const language = usePreferencesStore((state) => state.language)
  const { message } = App.useApp()
  const queryClient = useQueryClient()
  const [searchParams, setSearchParams] = useSearchParams()
  const [quickShowProductId, setQuickShowProductId] = useState<number | null>(null)

  const pageParam = Number(searchParams.get('page'))
  const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1
  const search = searchParams.get('q')?.trim() ?? ''
  const category = searchParams.get('category') ?? ''
  const sortParam = searchParams.get('sort')
  const sortBy = isProductSortField(sortParam) ? sortParam : undefined
  const order = sortBy ? (searchParams.get('order') === 'desc' ? 'desc' : 'asc') : undefined

  const filters: ProductFilterParams = {
    category: category || undefined,
    limit: PRODUCT_PAGE_SIZE,
    order,
    search: search || undefined,
    skip: (page - 1) * PRODUCT_PAGE_SIZE,
    sortBy,
  }
  const productsQuery = useProductsQuery(filters)
  // Filter options come from their own endpoint, so the table does not have to guess
  // them from the current page of rows.
  const categoriesQuery = useProductCategoriesQuery()
  const categoryOptions = Array.isArray(categoriesQuery.data) ? categoriesQuery.data : []
  const currencyFormatter = new Intl.NumberFormat(language === 'tr' ? 'tr-TR' : 'en-US', {
    currency: 'USD',
    style: 'currency',
  })
  const sortOrderFor = (field: string) =>
    sortBy === field ? (order === 'desc' ? 'descend' : 'ascend') : null

  const columns: ColumnsType<ProductDto> = [
    { title: messages.products.id, dataIndex: 'id', key: 'id', width: 72 },
    {
      title: messages.products.name,
      dataIndex: 'title',
      key: 'title',
      width: 280,
      sorter: true,
      sortOrder: sortOrderFor('title'),
    },
    {
      title: messages.products.category,
      dataIndex: 'category',
      key: 'category',
      width: 200,
      filterMultiple: false,
      filterSearch: true,
      filters: categoryOptions.map(({ name, slug }) => ({ text: name, value: slug })),
      filteredValue: category ? [category] : null,
      render: (value: string) => <Tag>{value}</Tag>,
    },
    {
      title: messages.products.price,
      dataIndex: 'price',
      key: 'price',
      width: 140,
      sorter: true,
      sortOrder: sortOrderFor('price'),
      render: (price: number) => currencyFormatter.format(price),
    },
    {
      title: messages.products.rating,
      dataIndex: 'rating',
      key: 'rating',
      width: 110,
      sorter: true,
      sortOrder: sortOrderFor('rating'),
    },
    {
      title: messages.products.stock,
      dataIndex: 'stock',
      key: 'stock',
      width: 100,
      sorter: true,
      sortOrder: sortOrderFor('stock'),
    },
    {
      title: messages.products.actions,
      key: 'actions',
      width: 220,
      fixed: 'right',
      // Two actions fit a row, so they stay inline. The posts table has five and
      // collapses them into an overflow menu instead.
      render: (_value, product) => (
        <Space size="small">
          <Link to={`/products/${product.id}`} state={{ listSearch: searchParams.toString() }}>
            <Button size="small" icon={<EyeOutlined aria-hidden="true" />}>
              {messages.products.show}
            </Button>
          </Link>
          <Button
            size="small"
            icon={<ThunderboltOutlined aria-hidden="true" />}
            onClick={() => setQuickShowProductId(product.id)}
          >
            {messages.products.quickShow}
          </Button>
        </Space>
      ),
    },
  ]

  const invalidateProducts = async () => {
    await queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.lists() })
    void message.success(messages.products.invalidated)
  }

  const updateSearch = (value: string) => {
    const nextSearch = value.trim()
    const nextParams = new URLSearchParams(searchParams)

    nextParams.delete('page')
    if (nextSearch) {
      // The API serves search and category from different endpoints, so only one wins.
      nextParams.set('q', nextSearch)
      nextParams.delete('category')
    } else {
      nextParams.delete('q')
    }

    setSearchParams(nextParams)
  }

  const updatePage = (nextPage: number) => {
    const nextParams = new URLSearchParams(searchParams)

    if (nextPage === 1) {
      nextParams.delete('page')
    } else {
      nextParams.set('page', String(nextPage))
    }

    setSearchParams(nextParams)
  }

  // Sorting and filtering are server-side, so the table reports the change and the URL
  // stays the single source of truth for what is being requested.
  const updateSortAndFilters: TableProps<ProductDto>['onChange'] = (
    _pagination,
    tableFilters,
    sorter,
  ) => {
    const nextParams = new URLSearchParams(searchParams)
    nextParams.delete('page')

    const [nextCategory] = tableFilters.category ?? []
    if (nextCategory) {
      nextParams.set('category', String(nextCategory))
      nextParams.delete('q')
    } else {
      nextParams.delete('category')
    }

    const activeSorter = Array.isArray(sorter) ? sorter[0] : sorter
    const sortedField = activeSorter?.order ? String(activeSorter.columnKey) : null

    if (sortedField && isProductSortField(sortedField)) {
      nextParams.set('sort', sortedField)
      nextParams.set('order', activeSorter?.order === 'descend' ? 'desc' : 'asc')
    } else {
      nextParams.delete('sort')
      nextParams.delete('order')
    }

    setSearchParams(nextParams)
  }

  return (
    <div className="admin-page">
      <PageHeader title={messages.products.title} description={messages.products.description} />

      <Card
        className="dashboard-panel"
        title={messages.products.listTitle}
        extra={
          <Button
            icon={<ReloadOutlined aria-hidden="true" />}
            loading={productsQuery.isFetching}
            onClick={() => void invalidateProducts()}
          >
            {messages.products.invalidate}
          </Button>
        }
      >
        <Flex vertical gap={16}>
          <Alert showIcon type="info" title={messages.products.demoNotice} />
          <Input.Search
            key={search}
            allowClear
            aria-label={messages.products.searchLabel}
            defaultValue={search}
            enterButton={messages.products.search}
            placeholder={messages.products.searchPlaceholder}
            onSearch={updateSearch}
          />
          <Typography.Text type="secondary">
            {messages.products.cacheKey}:{' '}
            <Typography.Text code>
              {JSON.stringify(PRODUCT_QUERY_KEYS.list(filters))}
            </Typography.Text>
          </Typography.Text>

          {productsQuery.isPending && (
            <output>
              <Flex align="center" justify="center" gap={12}>
                <Spin />
                <Typography.Text>{messages.common.loadingPage}</Typography.Text>
              </Flex>
            </output>
          )}

          {productsQuery.isError && (
            <Alert
              showIcon
              type="error"
              title={messages.products.loadError}
              description={productsQuery.error.message}
              action={
                <Button onClick={() => void productsQuery.refetch()}>
                  {messages.products.retry}
                </Button>
              }
            />
          )}

          {productsQuery.isSuccess && productsQuery.data.products.length === 0 && (
            <Empty description={messages.products.empty} />
          )}

          {productsQuery.isSuccess && productsQuery.data.products.length > 0 && (
            <>
              <Table<ProductDto>
                columns={columns}
                dataSource={productsQuery.data.products}
                loading={productsQuery.isFetching}
                pagination={false}
                rowKey="id"
                scroll={{ x: 'max-content' }}
                onChange={updateSortAndFilters}
              />
              <Flex justify="flex-end">
                <Pagination
                  current={page}
                  pageSize={PRODUCT_PAGE_SIZE}
                  showSizeChanger={false}
                  total={productsQuery.data.total}
                  onChange={updatePage}
                />
              </Flex>
            </>
          )}
        </Flex>
      </Card>

      <QuickShowProductModal
        productId={quickShowProductId}
        onClose={() => setQuickShowProductId(null)}
      />
    </div>
  )
}
