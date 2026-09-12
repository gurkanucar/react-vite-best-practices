import { ReloadOutlined } from '@ant-design/icons'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Alert,
  App,
  Button,
  Card,
  Empty,
  Flex,
  Pagination,
  Spin,
  Table,
  Tag,
  Typography,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useState } from 'react'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import type { Product, ProductListFilters } from '@/features/products/model/product'
import { productQueryKeys } from '@/features/products/queries/product-query-keys'
import {
  PRODUCT_PAGE_SIZE,
  productsQueryOptions,
} from '@/features/products/queries/product-query-options'
import { useMessages } from '@/i18n/messages'
import { usePreferencesStore } from '@/store/preferences-store'

export function ProductsPage() {
  const messages = useMessages()
  const language = usePreferencesStore((state) => state.language)
  const { message } = App.useApp()
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const filters: ProductListFilters = {
    limit: PRODUCT_PAGE_SIZE,
    skip: (page - 1) * PRODUCT_PAGE_SIZE,
  }
  const productsQuery = useQuery(productsQueryOptions(filters))
  const currencyFormatter = new Intl.NumberFormat(language === 'tr' ? 'tr-TR' : 'en-US', {
    currency: 'USD',
    style: 'currency',
  })

  const columns: ColumnsType<Product> = [
    { title: messages.products.id, dataIndex: 'id', key: 'id', width: 72 },
    { title: messages.products.name, dataIndex: 'title', key: 'title', width: 280 },
    {
      title: messages.products.category,
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => <Tag>{category}</Tag>,
      width: 180,
    },
    {
      title: messages.products.price,
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => currencyFormatter.format(price),
      width: 140,
    },
    { title: messages.products.rating, dataIndex: 'rating', key: 'rating', width: 110 },
    { title: messages.products.stock, dataIndex: 'stock', key: 'stock', width: 100 },
  ]

  const invalidateProducts = async () => {
    await queryClient.invalidateQueries({ queryKey: productQueryKeys.lists() })
    void message.success(messages.products.invalidated)
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
          <Typography.Text type="secondary">
            {messages.products.cacheKey}:{' '}
            <Typography.Text code>{JSON.stringify(productQueryKeys.list(filters))}</Typography.Text>
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
              <Table<Product>
                columns={columns}
                dataSource={productsQuery.data.products}
                loading={productsQuery.isFetching}
                pagination={false}
                rowKey="id"
                scroll={{ x: 'max-content' }}
              />
              <Flex justify="flex-end">
                <Pagination
                  current={page}
                  pageSize={PRODUCT_PAGE_SIZE}
                  showSizeChanger={false}
                  total={productsQuery.data.total}
                  onChange={setPage}
                />
              </Flex>
            </>
          )}
        </Flex>
      </Card>
    </div>
  )
}
