import { Alert, Button, Flex, Modal, Spin, Typography } from 'antd'
import { Link } from 'react-router'
import { ProductDetails } from '@/features/products/components/ProductDetails'
import { useProductQuery } from '@/features/products/hooks'
import { useMessages } from '@/i18n/messages'

interface QuickShowProductModalProps {
  productId: number | null
  onClose: () => void
}

export function QuickShowProductModal({ productId, onClose }: QuickShowProductModalProps) {
  const messages = useMessages()
  const open = productId !== null
  const productQuery = useProductQuery(productId ?? 0, open)

  return (
    <Modal
      destroyOnHidden
      open={open}
      title={messages.products.quickShowTitle}
      onCancel={onClose}
      footer={
        <Flex gap={8} justify="flex-end">
          {open && (
            <Link to={`/products/${productId}`}>
              <Button type="primary">{messages.products.openDetail}</Button>
            </Link>
          )}
          <Button onClick={onClose}>{messages.common.cancel}</Button>
        </Flex>
      }
    >
      {productQuery.isPending && (
        <output>
          <Flex align="center" justify="center" gap={12}>
            <Spin />
            <Typography.Text>{messages.common.loadingPage}</Typography.Text>
          </Flex>
        </output>
      )}

      {productQuery.isError && (
        <Alert
          showIcon
          type="error"
          title={messages.products.detailLoadError}
          description={productQuery.error.message}
        />
      )}

      {productQuery.isSuccess && <ProductDetails product={productQuery.data} />}
    </Modal>
  )
}
