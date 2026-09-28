import { CloseOutlined, DeleteOutlined, TagOutlined } from '@ant-design/icons'
import { Button, Flex, Input, InputNumber, Progress, Space, Tag, Typography } from 'antd'
import { useState } from 'react'
import { Link } from 'react-router'
import { findStoreColour } from '@/features/showcases/data/store'
import { STORE_PRIMARY } from '@/features/showcases/data/storeCopy'
import { productArt } from '@/features/showcases/data/storeArt'
import {
  COUPONS,
  FREE_SHIPPING_THRESHOLD,
  formatPrice,
  type CartTotals,
  type ResolvedLine,
} from '@/features/showcases/data/storeCart'
import { useStoreCart } from '@/features/showcases/hooks/useStoreCart'
import { useStoreCopy } from '@/features/showcases/hooks/useStoreCopy'

interface CartLineItemProps {
  line: ResolvedLine
  root: string
  /** The checkout summary shows lines read-only; the drawer lets them change. */
  editable?: boolean
  onNavigate?: () => void
}

export function CartLineItem({ line, root, editable = false, onNavigate }: CartLineItemProps) {
  const { text, language } = useStoreCopy()
  const setQuantity = useStoreCart((state) => state.setQuantity)
  const remove = useStoreCart((state) => state.remove)
  const colour = findStoreColour(line.colour)
  const name = line.product.name[language]
  const variant = [colour.name[language], line.size].filter(Boolean).join(' · ')

  return (
    <li className="store-line">
      <img
        className="store-line__art"
        src={productArt(line.product.shape, colour.hex)}
        alt=""
        width={72}
        height={72}
      />
      <div className="store-line__body">
        <Link
          to={`${root}/products/${line.product.id}`}
          className="store-line__name"
          onClick={onNavigate}
        >
          {name}
        </Link>
        <Typography.Text type="secondary" className="store-line__variant">
          {variant}
          {!editable && ` · × ${line.quantity}`}
        </Typography.Text>
        {editable ? (
          <Flex align="center" gap={8} wrap>
            <InputNumber
              size="small"
              min={1}
              max={Math.max(line.stock, 1)}
              value={line.quantity}
              aria-label={text.quantityLabel(name)}
              onChange={(value) => value && setQuantity(line.key, value)}
              className="store-line__quantity"
            />
            <Button
              type="text"
              size="small"
              icon={<DeleteOutlined aria-hidden="true" />}
              aria-label={text.removeLabel(name)}
              onClick={() => remove(line.key)}
            >
              {text.remove}
            </Button>
          </Flex>
        ) : null}
      </div>
      <Typography.Text strong className="store-line__total">
        {formatPrice(line.lineTotal, language)}
      </Typography.Text>
    </li>
  )
}

/** How far the order is from free delivery, as a bar that fills up. */
export function FreeShippingMeter({ totals }: { totals: CartTotals }) {
  const { text, language } = useStoreCopy()
  const reached = totals.freeShippingRemaining === 0
  const percent = Math.round(
    ((FREE_SHIPPING_THRESHOLD - totals.freeShippingRemaining) / FREE_SHIPPING_THRESHOLD) * 100,
  )

  return (
    <div className="store-free-shipping">
      <Typography.Text strong={reached}>
        {reached
          ? text.freeShippingReached
          : text.freeShippingLeft(formatPrice(totals.freeShippingRemaining, language))}
      </Typography.Text>
      <Progress
        percent={percent}
        showInfo={false}
        size="small"
        strokeColor={reached ? '#3f8f5b' : STORE_PRIMARY}
        aria-hidden="true"
      />
    </div>
  )
}

export function CouponField({
  subtotal,
  compact = false,
}: {
  subtotal: number
  compact?: boolean
}) {
  const { text, language } = useStoreCopy()
  const coupon = useStoreCart((state) => state.coupon)
  const applyCoupon = useStoreCart((state) => state.applyCoupon)
  const removeCoupon = useStoreCart((state) => state.removeCoupon)
  const [value, setValue] = useState('')
  const [error, setError] = useState<string | null>(null)

  const apply = () => {
    const result = applyCoupon(value, subtotal)
    if (result.ok) {
      setValue('')
      setError(null)
      return
    }
    setError(
      result.reason === 'minimum'
        ? text.couponErrors.minimum(formatPrice(result.minimum ?? 0, language))
        : text.couponErrors[result.reason],
    )
  }

  if (coupon) {
    const minimum = COUPONS[coupon].minimum
    const inactive = minimum !== undefined && subtotal < minimum
    return (
      <Flex vertical gap={4} className="store-coupon">
        <Flex align="center" gap={8}>
          <Tag
            color={inactive ? 'default' : 'green'}
            variant="filled"
            icon={<TagOutlined aria-hidden="true" />}
          >
            {text.couponApplied(coupon)}
          </Tag>
          <Button
            type="text"
            size="small"
            icon={<CloseOutlined aria-hidden="true" />}
            aria-label={text.removeCoupon}
            onClick={removeCoupon}
          />
        </Flex>
        {inactive && (
          <Typography.Text type="warning">
            {text.couponInactive(formatPrice(minimum, language))}
          </Typography.Text>
        )}
      </Flex>
    )
  }

  return (
    <div className="store-coupon">
      <Space.Compact block>
        <Input
          value={value}
          placeholder={text.couponPlaceholder}
          aria-label={text.couponLabel}
          status={error ? 'error' : undefined}
          size={compact ? 'middle' : 'large'}
          onChange={(event) => {
            setValue(event.target.value)
            setError(null)
          }}
          onPressEnter={apply}
        />
        <Button size={compact ? 'middle' : 'large'} onClick={apply}>
          {text.apply}
        </Button>
      </Space.Compact>
      <Typography.Text type={error ? 'danger' : 'secondary'} className="store-coupon__hint">
        {error ?? text.couponHint}
      </Typography.Text>
    </div>
  )
}

interface TotalsListProps {
  totals: CartTotals
  /**
   * In the drawer the delivery method is not chosen yet: pass totals worked out without
   * delivery, and the line says so unless standard delivery is already free.
   */
  shippingKnown: boolean
}

export function TotalsList({ totals, shippingKnown }: TotalsListProps) {
  const { text, language } = useStoreCopy()
  const price = (value: number) => formatPrice(value, language)

  return (
    <dl className="store-totals">
      <div>
        <dt>{text.subtotal}</dt>
        <dd>{price(totals.subtotal)}</dd>
      </div>
      {totals.discount > 0 && (
        <div className="store-totals__discount">
          <dt>{text.discount}</dt>
          <dd>−{price(totals.discount)}</dd>
        </div>
      )}
      <div>
        <dt>{text.shipping}</dt>
        <dd>
          {!shippingKnown
            ? totals.freeShippingRemaining === 0
              ? text.shippingFree
              : text.shippingAtCheckout
            : totals.shipping === 0
              ? text.shippingFree
              : price(totals.shipping)}
        </dd>
      </div>
      <div className="store-totals__total">
        <dt>{text.total}</dt>
        <dd>{price(totals.total)}</dd>
      </div>
      <Typography.Text type="secondary" className="store-totals__vat">
        {text.vatIncluded(price(totals.vat))}
      </Typography.Text>
    </dl>
  )
}
