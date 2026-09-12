import { EditOutlined, EyeOutlined, LeftOutlined } from '@ant-design/icons'
import { App, Button, Card, Col, Dropdown, Flex, Row, Tabs } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import {
  ProductDescription,
  ProductGallery,
  ProductHighlights,
  ProductPurchasePanel,
  ProductReviews,
} from '@/features/shop/components'
import { product } from '@/features/shop/data'
import type { ProductStatus } from '@/features/shop/types'
import { useMessages } from '@/i18n/messages'

export function ShopProductPage() {
  const messages = useMessages()
  const { message } = App.useApp()
  const navigate = useNavigate()

  const [colourIndex, setColourIndex] = useState(0)
  const [size, setSize] = useState(product.sizes[2] ?? product.sizes[0]!)
  const [quantity, setQuantity] = useState(1)
  const [status, setStatus] = useState<ProductStatus>(product.status)

  const name = messages.shop.products[product.nameId as keyof typeof messages.shop.products]
  /* Picking a colour swaps the main image, which is why the gallery index is shared. */
  const images = product.colours.map((colour) => colour.image)

  return (
    <div className="admin-page">
      <PageHeader
        title={name}
        extra={
          <Flex align="center" gap={8} wrap>
            <Button
              type="text"
              icon={<EyeOutlined aria-hidden="true" />}
              aria-label={messages.shop.preview}
              onClick={() => message.info(messages.shop.previewHint)}
            />
            <Button
              type="text"
              icon={<EditOutlined aria-hidden="true" />}
              aria-label={messages.shop.edit}
              onClick={() => message.info(messages.shop.editHint)}
            />
            <Dropdown
              trigger={['click']}
              menu={{
                selectable: true,
                selectedKeys: [status],
                items: [
                  { key: 'published', label: messages.shop.statuses.published },
                  { key: 'draft', label: messages.shop.statuses.draft },
                ],
                onClick: ({ key }) => setStatus(key as ProductStatus),
              }}
            >
              <Button type="primary">{messages.shop.statuses[status]}</Button>
            </Dropdown>
          </Flex>
        }
      />

      <Button
        type="link"
        className="shop-back"
        icon={<LeftOutlined aria-hidden="true" />}
        onClick={() => navigate(-1)}
      >
        {messages.shop.back}
      </Button>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <ProductGallery
            images={images}
            activeIndex={colourIndex}
            onChange={setColourIndex}
            alt={name}
          />
        </Col>

        <Col xs={24} lg={12}>
          <ProductPurchasePanel
            product={product}
            colourIndex={colourIndex}
            onColourChange={setColourIndex}
            size={size}
            onSizeChange={setSize}
            quantity={quantity}
            onQuantityChange={setQuantity}
          />
        </Col>
      </Row>

      <ProductHighlights />

      <Card className="shop-tabs-card">
        <Tabs
          items={[
            {
              key: 'description',
              label: messages.shop.description,
              children: <ProductDescription product={product} />,
            },
            {
              key: 'reviews',
              label: `${messages.shop.reviews} (${product.reviews.length})`,
              children: <ProductReviews product={product} />,
            },
          ]}
        />
      </Card>
    </div>
  )
}
