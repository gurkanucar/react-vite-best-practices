import {
  HeartOutlined,
  MinusOutlined,
  PlusOutlined,
  ShareAltOutlined,
  ShoppingCartOutlined,
  SwapOutlined,
} from '@ant-design/icons'
import { App, Button, Divider, Flex, InputNumber, Rate, Select, Space, Tag, Typography } from 'antd'
import { useMoney } from '@/features/shop/components/useMoney'
import type { Product } from '@/features/shop/types'
import { useMessages } from '@/i18n/messages'
import { usePreferencesStore } from '@/store/preferences-store'

interface ProductPurchasePanelProps {
  product: Product
  colourIndex: number
  onColourChange: (index: number) => void
  size: number
  onSizeChange: (size: number) => void
  quantity: number
  onQuantityChange: (quantity: number) => void
}

export function ProductPurchasePanel({
  product,
  colourIndex,
  onColourChange,
  size,
  onSizeChange,
  quantity,
  onQuantityChange,
}: ProductPurchasePanelProps) {
  const messages = useMessages()
  const { message } = App.useApp()
  const money = useMoney()
  const language = usePreferencesStore((state) => state.language)
  const compactNumber = new Intl.NumberFormat(language === 'tr' ? 'tr-TR' : 'en-US', {
    notation: 'compact',
  })
  const soldOut = product.stock === 'outOfStock'

  return (
    <Flex vertical gap={12}>
      <div>
        <Tag color="blue">{messages.shop.newArrival}</Tag>
        <Typography.Text type="success" strong>
          {messages.shop.stockStatuses[product.stock]}
        </Typography.Text>
      </div>

      <Typography.Title level={3} className="product-title">
        {messages.shop.products[product.nameId as keyof typeof messages.shop.products]}
      </Typography.Title>

      <Flex align="center" gap={8} wrap>
        <Rate disabled value={product.rating} />
        <Typography.Text type="secondary">
          {messages.shop.reviewCount.replace('{count}', compactNumber.format(product.reviewCount))}
        </Typography.Text>
      </Flex>

      <Flex align="baseline" gap={8}>
        {product.compareAtPrice && (
          <Typography.Text type="secondary" delete>
            {money(product.compareAtPrice)}
          </Typography.Text>
        )}
        <Typography.Title level={3} className="product-price">
          {money(product.price)}
        </Typography.Title>
      </Flex>

      <Typography.Paragraph type="secondary">{messages.shop.productSummary}</Typography.Paragraph>

      <Divider className="product-divider" />

      <Flex align="center" justify="space-between" gap={16}>
        <Typography.Text strong>{messages.shop.colour}</Typography.Text>
        <Flex gap={8}>
          {product.colours.map((colour, index) => (
            <button
              key={colour.id}
              type="button"
              aria-label={messages.shop.colours[colour.id as keyof typeof messages.shop.colours]}
              aria-pressed={index === colourIndex}
              className={`product-swatch${index === colourIndex ? ' product-swatch--active' : ''}`}
              style={{ background: colour.swatch }}
              onClick={() => onColourChange(index)}
            />
          ))}
        </Flex>
      </Flex>

      <Flex align="center" justify="space-between" gap={16}>
        <Typography.Text strong>{messages.shop.size}</Typography.Text>
        <Select
          aria-label={messages.shop.size}
          value={size}
          onChange={onSizeChange}
          style={{ width: 96 }}
          options={product.sizes.map((value) => ({ value, label: String(value) }))}
        />
      </Flex>

      <Flex align="center" justify="space-between" gap={16}>
        <Typography.Text strong>{messages.shop.quantity}</Typography.Text>

        <Flex vertical align="end" gap={4}>
          {/* Three controls reading as one, which is what `Space.Compact` is for. */}
          <Space.Compact>
            <Button
              aria-label={messages.shop.decrease}
              icon={<MinusOutlined aria-hidden="true" />}
              disabled={quantity <= 1}
              onClick={() => onQuantityChange(quantity - 1)}
            />
            <InputNumber
              aria-label={messages.shop.quantity}
              min={1}
              max={product.available}
              value={quantity}
              controls={false}
              onChange={(value) => onQuantityChange(value ?? 1)}
              style={{ width: 64 }}
            />
            <Button
              aria-label={messages.shop.increase}
              icon={<PlusOutlined aria-hidden="true" />}
              disabled={quantity >= product.available}
              onClick={() => onQuantityChange(quantity + 1)}
            />
          </Space.Compact>
          <Typography.Text type="secondary">
            {messages.shop.available.replace('{count}', String(product.available))}
          </Typography.Text>
        </Flex>
      </Flex>

      <Divider className="product-divider" />

      <Flex gap={12} wrap>
        <Button
          size="large"
          icon={<ShoppingCartOutlined aria-hidden="true" />}
          disabled={soldOut}
          onClick={() => message.success(messages.shop.addedToCart)}
          className="product-action"
        >
          {messages.shop.addToCart}
        </Button>
        <Button
          size="large"
          type="primary"
          disabled={soldOut}
          onClick={() => message.success(messages.shop.buyingNow)}
          className="product-action"
        >
          {messages.shop.buyNow}
        </Button>
      </Flex>

      <Flex justify="center" gap={8} wrap>
        <Button type="text" icon={<SwapOutlined aria-hidden="true" />}>
          {messages.shop.compare}
        </Button>
        <Button type="text" icon={<HeartOutlined aria-hidden="true" />}>
          {messages.shop.favourite}
        </Button>
        <Button type="text" icon={<ShareAltOutlined aria-hidden="true" />}>
          {messages.shop.share}
        </Button>
      </Flex>
    </Flex>
  )
}
