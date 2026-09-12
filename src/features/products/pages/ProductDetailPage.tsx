import { ArrowLeftOutlined } from '@ant-design/icons'
import { Alert, Button, Card } from 'antd'
import { Link, useLocation } from 'react-router'
import { LoadingState } from '@/components/LoadingState/LoadingState'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import { ProductDetails } from '@/features/products/components'
import { useProductQuery } from '@/features/products/hooks'
import { useMessages } from '@/i18n/messages'
import { useNumericRouteParam } from '@/router/useNumericRouteParam'

interface ProductDetailLocationState {
  listSearch?: string
}

export function ProductDetailPage() {
  const messages = useMessages()
  const location = useLocation()
  const productId = useNumericRouteParam('productId')
  const productQuery = useProductQuery(productId ?? 0, productId !== null)
  // The list keeps its page, search, sort, and filter in the URL, so returning there
  // means restoring that query string rather than dropping the reader on page one.
  const { listSearch } = (location.state ?? {}) as ProductDetailLocationState

  return (
    <div className="admin-page">
      <PageHeader
        title={messages.products.detailTitle}
        description={messages.products.detailDescription}
      />

      <Card
        className="dashboard-panel"
        title={productId === null ? messages.products.detailTitle : `#${productId}`}
        extra={
          <Link to={{ pathname: '/products', search: listSearch }}>
            <Button icon={<ArrowLeftOutlined aria-hidden="true" />}>
              {messages.products.backToList}
            </Button>
          </Link>
        }
      >
        {productId === null && <Alert showIcon type="error" title={messages.products.invalidId} />}

        {productQuery.isPending && productId !== null && <LoadingState />}

        {productQuery.isError && (
          <Alert
            showIcon
            type="error"
            title={messages.products.detailLoadError}
            description={productQuery.error.message}
            action={
              <Button onClick={() => void productQuery.refetch()}>{messages.products.retry}</Button>
            }
          />
        )}

        {productQuery.isSuccess && <ProductDetails product={productQuery.data} />}
      </Card>
    </div>
  )
}
