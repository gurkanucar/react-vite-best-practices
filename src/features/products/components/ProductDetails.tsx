import { Descriptions, Tag, Typography } from 'antd'
import type { ProductDto } from '@/features/products/types'
import { useMessages } from '@/i18n/messages'
import { usePreferencesStore } from '@/store/preferences-store'

interface ProductDetailsProps {
  product: ProductDto
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const messages = useMessages()
  const language = usePreferencesStore((state) => state.language)
  const currencyFormatter = new Intl.NumberFormat(language === 'tr' ? 'tr-TR' : 'en-US', {
    currency: 'USD',
    style: 'currency',
  })

  return (
    <Descriptions column={1} bordered size="small">
      <Descriptions.Item label={messages.products.id}>{product.id}</Descriptions.Item>
      <Descriptions.Item label={messages.products.name}>{product.title}</Descriptions.Item>
      <Descriptions.Item label={messages.products.category}>
        <Tag>{product.category}</Tag>
      </Descriptions.Item>
      <Descriptions.Item label={messages.products.price}>
        {currencyFormatter.format(product.price)}
      </Descriptions.Item>
      <Descriptions.Item label={messages.products.rating}>{product.rating}</Descriptions.Item>
      <Descriptions.Item label={messages.products.stock}>{product.stock}</Descriptions.Item>
      <Descriptions.Item label={messages.products.descriptionColumn}>
        <Typography.Paragraph style={{ marginBottom: 0 }}>
          {product.description}
        </Typography.Paragraph>
      </Descriptions.Item>
    </Descriptions>
  )
}
