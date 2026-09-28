import { ShoppingOutlined } from '@ant-design/icons'
import { Button, Drawer, Empty, Flex, Grid } from 'antd'
import { useNavigate } from 'react-router'
import {
  CartLineItem,
  CouponField,
  FreeShippingMeter,
  TotalsList,
} from '@/features/showcases/components/StoreCartParts'
import { storeProducts } from '@/features/showcases/data/store'
import { cartTotals, resolveLines } from '@/features/showcases/data/storeCart'
import { useStoreCart } from '@/features/showcases/hooks/useStoreCart'
import { useStoreCopy } from '@/features/showcases/hooks/useStoreCopy'

export function StoreCartDrawer({ root }: { root: string }) {
  const { text } = useStoreCopy()
  const navigate = useNavigate()
  const open = useStoreCart((state) => state.drawerOpen)
  const close = useStoreCart((state) => state.closeDrawer)
  const lines = resolveLines(
    useStoreCart((state) => state.lines),
    storeProducts,
  )
  const coupon = useStoreCart((state) => state.coupon)
  // Worked out without delivery: the method is picked at checkout.
  const totals = cartTotals(lines, coupon, 'pickup')
  const isPhone = !(Grid.useBreakpoint().sm ?? false)

  return (
    <Drawer
      open={open}
      onClose={close}
      title={`${text.cartTitle}${totals.itemCount ? ` (${totals.itemCount})` : ''}`}
      placement="right"
      size={isPhone ? '100%' : 440}
      rootClassName="store-drawer"
      footer={
        lines.length > 0 ? (
          <Flex vertical gap={12}>
            <TotalsList totals={totals} shippingKnown={false} />
            <Button
              type="primary"
              size="large"
              block
              onClick={() => {
                close()
                void navigate(`${root}/checkout`)
              }}
            >
              {text.checkout}
            </Button>
          </Flex>
        ) : null
      }
    >
      {lines.length === 0 ? (
        <Empty
          image={<ShoppingOutlined className="store-drawer__empty-icon" aria-hidden="true" />}
          description={
            <>
              <strong>{text.cartEmpty}</strong>
              <br />
              {text.cartEmptyText}
            </>
          }
        >
          <Button type="primary" onClick={close}>
            {text.continueShopping}
          </Button>
        </Empty>
      ) : (
        <Flex vertical gap={20}>
          <FreeShippingMeter totals={totals} />
          <ul className="store-lines">
            {lines.map((line) => (
              <CartLineItem key={line.key} line={line} root={root} editable onNavigate={close} />
            ))}
          </ul>
          <CouponField subtotal={totals.subtotal} compact />
        </Flex>
      )}
    </Drawer>
  )
}
