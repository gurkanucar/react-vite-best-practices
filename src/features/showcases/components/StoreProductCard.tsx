import { PlusOutlined, StarFilled } from '@ant-design/icons'
import { App, Button, Flex, Tag, Typography } from 'antd'
import { Link } from 'react-router'
import { findStoreColour, type StoreProduct } from '@/features/showcases/data/store'
import { productArt } from '@/features/showcases/data/storeArt'
import {
  discountPercent,
  firstAvailableVariant,
  formatPrice,
  stockLevel,
  totalStock,
} from '@/features/showcases/data/storeCart'
import { useStoreCart } from '@/features/showcases/hooks/useStoreCart'
import { useStoreCopy } from '@/features/showcases/hooks/useStoreCopy'

/** Pieces from this season's drop carry a "New" badge. */
const NEW_SINCE = '2026-09-01'

export function StoreProductCard({ product, root }: { product: StoreProduct; root: string }) {
  const { text, language } = useStoreCopy()
  const { message } = App.useApp()
  const add = useStoreCart((state) => state.add)
  const name = product.name[language]
  const href = `${root}/products/${product.id}`
  const colours = [...new Set(product.variants.map((variant) => variant.colour))]
  const level = stockLevel(totalStock(product))
  const sale = discountPercent(product)
  const firstColour = findStoreColour(colours[0]!)

  const quickAdd = () => {
    const variant = firstAvailableVariant(product)
    if (!variant) return
    add({ productId: product.id, colour: variant.colour, size: variant.size, quantity: 1 })
    void message.success(text.addedToCart(name))
  }

  return (
    <article className="store-card">
      <Link to={href} className="store-card__media" aria-label={name}>
        <img src={productArt(product.shape, firstColour.hex)} alt="" loading="lazy" />
        <Flex gap={6} className="store-card__badges">
          {sale && (
            <Tag color="volcano" variant="solid">
              −{sale}%
            </Tag>
          )}
          {product.addedAt >= NEW_SINCE && <Tag variant="solid">{text.newBadge}</Tag>}
        </Flex>
      </Link>
      <Button
        className="store-card__quick-add"
        shape="round"
        icon={<PlusOutlined aria-hidden="true" />}
        disabled={level === 'out'}
        aria-label={text.quickAddLabel(name)}
        onClick={quickAdd}
      >
        {level === 'out' ? text.soldOut : text.quickAdd}
      </Button>

      <div className="store-card__body">
        <Flex justify="space-between" align="center" gap={8}>
          <Typography.Text type="secondary" className="store-card__category">
            {text.categories[product.category]}
          </Typography.Text>
          <span className="store-card__rating" aria-label={text.ratingLabel(product.rating)}>
            <StarFilled aria-hidden="true" /> {product.rating.toFixed(1)}
            <Typography.Text type="secondary"> ({product.reviewCount})</Typography.Text>
          </span>
        </Flex>
        <Link to={href} className="store-card__name">
          {name}
        </Link>
        <Flex align="baseline" gap={8} wrap>
          <Typography.Text
            strong
            className={sale ? 'store-price store-price--sale' : 'store-price'}
          >
            {formatPrice(product.price, language)}
          </Typography.Text>
          {product.compareAt && (
            <Typography.Text delete type="secondary">
              {formatPrice(product.compareAt, language)}
            </Typography.Text>
          )}
        </Flex>
        <Flex justify="space-between" align="center" gap={8}>
          <Flex gap={4} align="center">
            {colours.map((id) => (
              <span
                key={id}
                className="store-dot"
                style={{ background: findStoreColour(id).hex }}
                title={findStoreColour(id).name[language]}
                aria-hidden="true"
              />
            ))}
            <span className="store-visually-hidden">{text.colourCount(colours.length)}</span>
          </Flex>
          {level === 'low' && (
            <Tag color="orange" variant="filled">
              {text.lowStock}
            </Tag>
          )}
          {level === 'out' && <Tag variant="filled">{text.soldOut}</Tag>}
        </Flex>
      </div>
    </article>
  )
}
