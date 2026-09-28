import { DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { Button, Drawer, Empty, Flex, InputNumber, Progress, Typography } from 'antd'
import { Link, useNavigate } from 'react-router'
import { findBrand, totalStock } from '@/features/showcases/data/partsCatalog'
import {
  formatTry,
  MAX_PER_LINE,
  orderTotals,
  resolveLines,
  shippingMethods,
} from '@/features/showcases/data/partsCommerce'
import { PartVisual } from '@/features/showcases/components/PartsBits'
import { usePartsCopy } from '@/features/showcases/hooks/usePartsCopy'
import { usePartsStore } from '@/features/showcases/hooks/usePartsStore'

export function PartsCartDrawer({ root }: { root: string }) {
  const { text, language } = usePartsCopy()
  const navigate = useNavigate()
  const open = usePartsStore((state) => state.cartOpen)
  const cart = usePartsStore((state) => state.cart)
  const closeCart = usePartsStore((state) => state.closeCart)
  const setQuantity = usePartsStore((state) => state.setQuantity)
  const removeFromCart = usePartsStore((state) => state.removeFromCart)

  const lines = resolveLines(cart)
  const { subtotal } = orderTotals(lines, undefined, undefined)
  const threshold = shippingMethods.standard.freeOver ?? 0
  const left = Math.max(threshold - subtotal, 0)

  return (
    <Drawer
      open={open}
      onClose={closeCart}
      title={text.cart.title}
      className="parts-cart"
      footer={
        lines.length > 0 && (
          <Flex vertical gap={10}>
            <Flex justify="space-between" align="baseline">
              <Typography.Text>{text.cart.subtotal}</Typography.Text>
              <Typography.Text strong className="parts-cart__subtotal">
                {formatTry(subtotal, language)}
              </Typography.Text>
            </Flex>
            <Typography.Text type="secondary">{text.cart.note}</Typography.Text>
            <Button
              type="primary"
              size="large"
              block
              onClick={() => {
                closeCart()
                void navigate(`${root}/checkout`)
              }}
            >
              {text.cart.checkout}
            </Button>
            <Button block onClick={closeCart}>
              {text.cart.continue}
            </Button>
          </Flex>
        )
      }
    >
      {lines.length === 0 ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={text.cart.empty}>
          <Button
            type="primary"
            icon={<ShoppingCartOutlined />}
            onClick={() => {
              closeCart()
              void navigate(`${root}/catalog`)
            }}
          >
            {text.cart.browse}
          </Button>
        </Empty>
      ) : (
        <>
          <div className="parts-cart__free">
            <Typography.Text>
              {left > 0 ? text.cart.freeLeft(formatTry(left, language)) : text.cart.freeReached}
            </Typography.Text>
            <Progress
              percent={Math.min(100, Math.round((subtotal / threshold) * 100))}
              showInfo={false}
              size="small"
              status={left > 0 ? 'active' : 'success'}
            />
          </div>
          <ul className="parts-cart__lines">
            {lines.map(({ part, quantity, total }) => {
              const name = part.name[language]
              return (
                <li key={part.id} className="parts-cart__line">
                  <PartVisual category={part.category} size="small" />
                  <div className="parts-cart__info">
                    <Link
                      to={`${root}/products/${part.id}`}
                      onClick={closeCart}
                      className="parts-cart__name"
                    >
                      {name}
                    </Link>
                    <Typography.Text type="secondary" className="parts-cart__brand">
                      {findBrand(part.brandId)?.name} ·{' '}
                      <span className="parts-mono">{part.sku}</span>
                    </Typography.Text>
                    <Flex justify="space-between" align="center" gap={8} wrap>
                      <Flex align="center" gap={4}>
                        <InputNumber
                          size="small"
                          min={1}
                          max={Math.max(1, Math.min(totalStock(part), MAX_PER_LINE))}
                          value={quantity}
                          aria-label={text.cart.quantityLabel(name)}
                          onChange={(value) => value !== null && setQuantity(part.id, value)}
                          className="parts-cart__qty"
                        />
                        <Button
                          size="small"
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          aria-label={text.cart.removeLabel(name)}
                          onClick={() => removeFromCart(part.id)}
                        />
                      </Flex>
                      <Typography.Text strong>{formatTry(total, language)}</Typography.Text>
                    </Flex>
                  </div>
                </li>
              )
            })}
          </ul>
        </>
      )}
    </Drawer>
  )
}
