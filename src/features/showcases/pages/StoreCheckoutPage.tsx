import { LockOutlined, ShoppingOutlined } from '@ant-design/icons'
import {
  Alert,
  Button,
  Card,
  Col,
  Descriptions,
  Empty,
  Flex,
  Form,
  Input,
  Radio,
  Result,
  Row,
  Steps,
  Typography,
} from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ShowcasePreviewFrame } from '@/features/showcases/components'
import {
  CartLineItem,
  CouponField,
  TotalsList,
} from '@/features/showcases/components/StoreCartParts'
import { StoreSiteShell } from '@/features/showcases/components/StoreSiteShell'
import { storeProducts } from '@/features/showcases/data/store'
import {
  cartTotals,
  formatCardNumber,
  formatPrice,
  isValidCardNumber,
  isValidExpiry,
  orderNumber,
  resolveLines,
  SHIPPING_METHODS,
  SHIPPING_PRICES,
  type ShippingMethod,
} from '@/features/showcases/data/storeCart'
import { storeCopy, storeRoot } from '@/features/showcases/data/storeCopy'
import { useStoreCart } from '@/features/showcases/hooks/useStoreCart'
import { useStoreCopy } from '@/features/showcases/hooks/useStoreCopy'
import '../showcases.css'
import '../store.css'

interface StoreCheckoutPageProps {
  standalone?: boolean
}

interface CheckoutValues {
  email: string
  fullName: string
  phone?: string
  address: string
  city: string
  postalCode: string
  shipping: ShippingMethod
  cardName: string
  cardNumber: string
  expiry: string
  cvc: string
}

interface PlacedOrder {
  number: string
  email: string
  shipping: ShippingMethod
  total: number
}

/** Back to the steps; in the admin preview the page scrolls inside the layout, not the window. */
const scrollToTop = () =>
  document
    .querySelector('.store-checkout')
    ?.scrollIntoView?.({ behavior: 'smooth', block: 'start' })

/** "1225" becomes "12/25" while typing, so nobody has to find the slash. */
const formatExpiry = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
}

export function StoreCheckoutPage({ standalone = false }: StoreCheckoutPageProps) {
  const { text, language } = useStoreCopy()
  const navigate = useNavigate()
  const root = storeRoot(standalone)
  const [form] = Form.useForm<CheckoutValues>()
  const [step, setStep] = useState(0)
  const [placed, setPlaced] = useState<PlacedOrder | null>(null)
  const storedLines = useStoreCart((state) => state.lines)
  const coupon = useStoreCart((state) => state.coupon)
  const clear = useStoreCart((state) => state.clear)
  const shipping =
    Form.useWatch('shipping', { form, preserve: true }) ?? ('standard' as ShippingMethod)
  const lines = resolveLines(storedLines, storeProducts)
  const totals = cartTotals(lines, coupon, shipping)
  const price = (value: number) => formatPrice(value, language)

  // Only the step on screen has its fields mounted, so submitting checks just those.
  const advance = () => {
    setStep((current) => current + 1)
    scrollToTop()
  }

  const placeOrder = () => {
    const values = form.getFieldsValue(true) as CheckoutValues
    setPlaced({
      number: orderNumber(),
      email: values.email,
      shipping: values.shipping,
      total: totals.total,
    })
    clear()
    scrollToTop()
  }

  const summary = (
    <Card
      className="store-summary"
      title={
        <Flex justify="space-between" align="center">
          <span>{text.orderSummary}</span>
          <Typography.Text type="secondary">{text.itemsCount(totals.itemCount)}</Typography.Text>
        </Flex>
      }
    >
      <ul className="store-lines store-lines--compact">
        {lines.map((line) => (
          <CartLineItem key={line.key} line={line} root={root} />
        ))}
      </ul>
      <CouponField subtotal={totals.subtotal} compact />
      <TotalsList totals={totals} shippingKnown />
    </Card>
  )

  const values = form.getFieldsValue(true) as Partial<CheckoutValues>

  const steps = [
    <div key="details" className="store-checkout__step">
      <Typography.Title level={4}>{text.contact}</Typography.Title>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item
            name="email"
            label={text.email}
            rules={[
              { required: true, message: text.emailRequired },
              { type: 'email', message: text.emailInvalid },
            ]}
          >
            <Input type="email" autoComplete="email" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name="phone"
            label={text.phone}
            rules={[
              {
                validator: (_, value?: string) =>
                  !value || value.replace(/\D/g, '').length >= 10
                    ? Promise.resolve()
                    : Promise.reject(new Error(text.phoneInvalid)),
              },
            ]}
          >
            <Input type="tel" autoComplete="tel" />
          </Form.Item>
        </Col>
      </Row>
      <Typography.Title level={4}>{text.shipTo}</Typography.Title>
      <Form.Item
        name="fullName"
        label={text.fullName}
        rules={[{ required: true, whitespace: true, message: text.fullNameRequired }]}
      >
        <Input autoComplete="name" />
      </Form.Item>
      <Form.Item
        name="address"
        label={text.address}
        rules={[{ required: true, whitespace: true, message: text.addressRequired }]}
      >
        <Input.TextArea autoSize={{ minRows: 2, maxRows: 4 }} autoComplete="street-address" />
      </Form.Item>
      <Row gutter={16}>
        <Col xs={24} md={14}>
          <Form.Item
            name="city"
            label={text.city}
            rules={[{ required: true, whitespace: true, message: text.cityRequired }]}
          >
            <Input autoComplete="address-level2" />
          </Form.Item>
        </Col>
        <Col xs={24} md={10}>
          <Form.Item
            name="postalCode"
            label={text.postalCode}
            rules={[{ required: true, pattern: /^\d{5}$/, message: text.postalInvalid }]}
          >
            <Input inputMode="numeric" autoComplete="postal-code" maxLength={5} />
          </Form.Item>
        </Col>
      </Row>
    </div>,

    <div key="delivery" className="store-checkout__step">
      <Typography.Title level={4}>{text.deliveryMethod}</Typography.Title>
      <Form.Item name="shipping" noStyle>
        <Radio.Group className="store-methods">
          {SHIPPING_METHODS.map((method) => {
            const [title, detail] = text.methods[method]
            const cost = cartTotals(lines, coupon, method).shipping
            return (
              <Radio key={method} value={method} className="store-method">
                <span className="store-method__text">
                  <Typography.Text strong>{title}</Typography.Text>
                  <Typography.Text type="secondary">{detail}</Typography.Text>
                </span>
                <Typography.Text strong className="store-method__price">
                  {cost === 0 ? text.shippingFree : price(cost)}
                  {cost === 0 && SHIPPING_PRICES[method] > 0 && (
                    <Typography.Text delete type="secondary">
                      {' '}
                      {price(SHIPPING_PRICES[method])}
                    </Typography.Text>
                  )}
                </Typography.Text>
              </Radio>
            )
          })}
        </Radio.Group>
      </Form.Item>
    </div>,

    <div key="payment" className="store-checkout__step">
      <Typography.Title level={4}>{text.payment}</Typography.Title>
      <Alert type="info" showIcon title={text.demoPayment} className="store-checkout__demo" />
      <Form.Item
        name="cardName"
        label={text.cardName}
        rules={[{ required: true, whitespace: true, message: text.cardNameRequired }]}
      >
        <Input autoComplete="cc-name" />
      </Form.Item>
      <Form.Item
        name="cardNumber"
        label={text.cardNumber}
        normalize={formatCardNumber}
        rules={[
          { required: true, message: text.cardNumberInvalid },
          {
            validator: (_, value?: string) =>
              !value || isValidCardNumber(value)
                ? Promise.resolve()
                : Promise.reject(new Error(text.cardNumberInvalid)),
          },
        ]}
      >
        <Input
          inputMode="numeric"
          autoComplete="cc-number"
          placeholder="4242 4242 4242 4242"
          prefix={<LockOutlined aria-hidden="true" />}
        />
      </Form.Item>
      <Row gutter={16}>
        <Col xs={14}>
          <Form.Item
            name="expiry"
            label={text.expiry}
            normalize={formatExpiry}
            rules={[
              { required: true, message: text.expiryInvalid },
              {
                validator: (_, value?: string) =>
                  !value || isValidExpiry(value)
                    ? Promise.resolve()
                    : Promise.reject(new Error(text.expiryInvalid)),
              },
            ]}
          >
            <Input inputMode="numeric" autoComplete="cc-exp" placeholder="MM/YY" />
          </Form.Item>
        </Col>
        <Col xs={10}>
          <Form.Item
            name="cvc"
            label={text.cvc}
            rules={[{ required: true, pattern: /^\d{3,4}$/, message: text.cvcInvalid }]}
          >
            <Input inputMode="numeric" autoComplete="cc-csc" maxLength={4} />
          </Form.Item>
        </Col>
      </Row>
    </div>,

    <div key="review" className="store-checkout__step">
      <Typography.Title level={4}>{text.review}</Typography.Title>
      <Descriptions
        bordered
        column={1}
        size="small"
        items={[
          {
            key: 'contact',
            label: text.contact,
            children: [values.email, values.phone].filter(Boolean).join(' · '),
          },
          {
            key: 'address',
            label: text.shipTo,
            children: (
              <>
                {values.fullName}
                <br />
                {values.address}
                <br />
                {values.postalCode} {values.city}
              </>
            ),
          },
          {
            key: 'shipping',
            label: text.deliveryMethod,
            children: `${text.methods[shipping][0]} · ${
              totals.shipping === 0 ? text.shippingFree : price(totals.shipping)
            }`,
          },
          {
            key: 'payment',
            label: text.paidWith,
            children: text.cardEnding(values.cardNumber?.replace(/\s/g, '').slice(-4) ?? ''),
          },
        ]}
      />
      <Flex gap={8} wrap className="store-checkout__edit">
        {[0, 1, 2].map((target) => (
          <Button key={target} size="small" onClick={() => setStep(target)}>
            {text.edit}: {text.steps[target]}
          </Button>
        ))}
      </Flex>
    </div>,
  ]

  let content
  if (placed) {
    content = (
      <Result
        status="success"
        className="store-checkout__done"
        title={text.orderPlaced}
        subTitle={
          <>
            {text.orderPlacedText(placed.number, placed.email)}
            <br />
            {text.orderEta[placed.shipping]} {text.total}: {price(placed.total)}
          </>
        }
        extra={
          <Button type="primary" size="large" onClick={() => void navigate(root)}>
            {text.keepShopping}
          </Button>
        }
      />
    )
  } else if (lines.length === 0) {
    content = (
      <Empty
        className="store-checkout__empty"
        image={<ShoppingOutlined className="store-drawer__empty-icon" aria-hidden="true" />}
        description={
          <>
            <Typography.Text strong>{text.checkoutEmptyTitle}</Typography.Text>
            <br />
            <Typography.Text type="secondary">{text.checkoutEmptyText}</Typography.Text>
          </>
        }
      >
        <Button type="primary" onClick={() => void navigate(root)}>
          {text.backToShop}
        </Button>
      </Empty>
    )
  } else {
    content = (
      <>
        <Typography.Title className="store-checkout__title">{text.checkoutTitle}</Typography.Title>
        <Steps
          current={step}
          size="small"
          className="store-checkout__steps"
          // Going back is always allowed; going forward goes through "Continue".
          onChange={(target) => target < step && setStep(target)}
          items={text.steps.map((title) => ({ title }))}
        />
        <div className="store-checkout__layout">
          <Form<CheckoutValues>
            form={form}
            layout="vertical"
            requiredMark="optional"
            initialValues={{ shipping: 'standard' }}
            className="store-checkout__form"
            onFinish={step === 3 ? placeOrder : advance}
          >
            {steps[step]}
            <Flex justify="space-between" gap={12} className="store-checkout__nav">
              {step > 0 ? (
                <Button size="large" onClick={() => setStep((current) => current - 1)}>
                  {text.back}
                </Button>
              ) : (
                <Button size="large" type="text" onClick={() => void navigate(root)}>
                  {text.continueShopping}
                </Button>
              )}
              <Button type="primary" size="large" htmlType="submit">
                {step === 3 ? text.placeOrder(price(totals.total)) : text.next}
              </Button>
            </Flex>
          </Form>
          <aside className="store-checkout__aside">{summary}</aside>
        </div>
      </>
    )
  }

  const page = (
    <StoreSiteShell standalone={standalone}>
      <div className="store-page store-checkout">{content}</div>
    </StoreSiteShell>
  )

  return (
    <ShowcasePreviewFrame
      standalone={standalone}
      standalonePath="/preview/store/checkout"
      title={{ en: storeCopy.en.previewTitle, tr: storeCopy.tr.previewTitle }}
      description={{ en: storeCopy.en.previewDescription, tr: storeCopy.tr.previewDescription }}
    >
      {page}
    </ShowcasePreviewFrame>
  )
}
