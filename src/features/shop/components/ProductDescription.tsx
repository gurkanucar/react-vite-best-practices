import { Descriptions, Typography } from 'antd'
import type { Product } from '@/features/shop/types'
import { useMessages } from '@/i18n/messages'

export function ProductDescription({ product }: { product: Product }) {
  const messages = useMessages()

  return (
    <>
      <Typography.Title level={5}>{messages.shop.specifications}</Typography.Title>

      {/* `Descriptions` bordered with one column is the label/value table in the design. */}
      <Descriptions bordered column={1} size="small">
        {product.specs.map((spec) => (
          <Descriptions.Item
            key={spec.id}
            label={messages.shop.specs[spec.id as keyof typeof messages.shop.specs]}
          >
            {spec.id === 'warranty'
              ? messages.shop.warrantyMonths.replace('{count}', spec.value)
              : spec.value}
          </Descriptions.Item>
        ))}
      </Descriptions>

      <Typography.Title level={5}>{messages.shop.productDetails}</Typography.Title>
      <Typography>
        <ul>
          {messages.shop.detailPoints.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </Typography>

      <Typography.Title level={5}>{messages.shop.benefits}</Typography.Title>
      <Typography>
        <ul>
          {messages.shop.benefitPoints.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </Typography>

      <Typography.Title level={5}>{messages.shop.delivery}</Typography.Title>
      <Typography.Paragraph>{messages.shop.deliveryFree}</Typography.Paragraph>
      <Typography>
        <ul>
          {messages.shop.deliveryOptions.map((option) => (
            <li key={option}>{option}</li>
          ))}
        </ul>
      </Typography>
      <Typography.Paragraph type="secondary">{messages.shop.deliveryNote}</Typography.Paragraph>
    </>
  )
}
