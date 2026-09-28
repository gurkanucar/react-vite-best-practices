import {
  BankOutlined,
  CarOutlined,
  CreditCardOutlined,
  EditOutlined,
  EnvironmentOutlined,
  InfoCircleOutlined,
  ShoppingCartOutlined,
  WalletOutlined,
} from '@ant-design/icons'
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Empty,
  Flex,
  Form,
  Input,
  Radio,
  Result,
  Row,
  Select,
  Steps,
  Typography,
} from 'antd'
import type { Dayjs } from 'dayjs'
import { useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router'
import { PartVisual } from '@/features/showcases/components/PartsBits'
import { PartsSiteShell } from '@/features/showcases/components/PartsSiteShell'
import {
  cities,
  codAllowed,
  deliveryWindow,
  dispatchCutoff,
  expiryValid,
  formatTry,
  luhnValid,
  orderTotals,
  paymentMethodIds,
  phoneValid,
  resolveLines,
  shippingAvailable,
  shippingMethodIds,
  shippingMethods,
  shippingPrice,
  type Address,
  type Order,
  type PaymentMethodId,
  type ResolvedLine,
  type ShippingMethodId,
  type Totals,
} from '@/features/showcases/data/partsCommerce'
import { partsRoot, type PartsCopy } from '@/features/showcases/data/partsCopy'
import { usePartsCopy } from '@/features/showcases/hooks/usePartsCopy'
import { usePartsNow } from '@/features/showcases/hooks/usePartsNow'
import { usePartsStore } from '@/features/showcases/hooks/usePartsStore'

interface PartsCheckoutPageProps {
  standalone?: boolean
}

interface CheckoutValues extends Address {
  shipping: ShippingMethodId
  payment: PaymentMethodId
  cardName?: string
  cardNumber?: string
  cardExpiry?: string
  cardCvc?: string
  terms?: boolean
}

const addressFields: Array<keyof Address> = [
  'fullName',
  'phone',
  'email',
  'city',
  'district',
  'line',
  'postcode',
]
const cardFields: Array<keyof CheckoutValues> = ['cardName', 'cardNumber', 'cardExpiry', 'cardCvc']

const demoAddress: Address = {
  fullName: 'Deniz Aydın',
  phone: '0555 010 20 30',
  email: 'deniz@example.com',
  city: 'İstanbul',
  district: 'Kadıköy',
  line: 'Caferağa Mah. Moda Cad. No: 41/3',
  postcode: '34710',
}

const paymentIcons: Record<PaymentMethodId, ReactNode> = {
  card: <CreditCardOutlined />,
  transfer: <BankOutlined />,
  cod: <WalletOutlined />,
}

/** "4242424242424242" → "4242 4242 4242 4242" as it is typed. */
const groupCardNumber = (value: string) =>
  value
    .replace(/\D/g, '')
    .slice(0, 19)
    .replace(/(\d{4})(?=\d)/g, '$1 ')

/** "1228" → "12/28". */
const formatExpiry = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
}

function arrivalText(
  text: PartsCopy,
  method: ShippingMethodId,
  now: Dayjs,
  language: 'en' | 'tr',
): string {
  const [from, to] = deliveryWindow(method, now)
  const format = (day: Dayjs) =>
    day.isSame(now, 'day') ? text.checkout.today : day.locale(language).format('ddd D MMM')
  if (method === 'pickup') {
    return from.isSame(now, 'day') ? text.checkout.readyToday : text.checkout.readyOn(format(from))
  }
  return text.checkout.arrives(format(from), format(to))
}

function Summary({
  lines,
  totals,
  shippingChosen,
}: {
  lines: ResolvedLine[]
  totals: Totals
  shippingChosen: boolean
}) {
  const { text, language } = usePartsCopy()
  const money = (value: number) => formatTry(value, language)
  const count = lines.reduce((sum, line) => sum + line.quantity, 0)

  return (
    <Card className="parts-summary" title={text.checkout.summary}>
      <Typography.Text type="secondary">{text.checkout.items(count)}</Typography.Text>
      <ul className="parts-summary__lines">
        {lines.map(({ part, quantity, total }) => (
          <li key={part.id}>
            <PartVisual category={part.category} size="small" />
            <span className="parts-summary__name">
              {part.name[language]}
              <Typography.Text type="secondary"> × {quantity}</Typography.Text>
            </span>
            <span>{money(total)}</span>
          </li>
        ))}
      </ul>
      <Divider />
      <dl className="parts-summary__totals">
        <div>
          <dt>{text.checkout.subtotal}</dt>
          <dd>{money(totals.subtotal)}</dd>
        </div>
        {totals.discount > 0 && (
          <div className="is-discount">
            <dt>{text.checkout.discount}</dt>
            <dd>−{money(totals.discount)}</dd>
          </div>
        )}
        <div>
          <dt>{text.checkout.shipping}</dt>
          <dd>
            {!shippingChosen
              ? text.checkout.chooseLater
              : totals.shipping === 0
                ? text.checkout.free
                : money(totals.shipping)}
          </dd>
        </div>
        {totals.codFee > 0 && (
          <div>
            <dt>{text.checkout.codFee}</dt>
            <dd>{money(totals.codFee)}</dd>
          </div>
        )}
        <div className="is-total">
          <dt>{text.checkout.total}</dt>
          <dd>{money(totals.total)}</dd>
        </div>
      </dl>
      <Typography.Text type="secondary">{text.checkout.vat(money(totals.vat))}</Typography.Text>
    </Card>
  )
}

export function PartsCheckoutPage({ standalone = false }: PartsCheckoutPageProps) {
  const { text, language } = usePartsCopy()
  const navigate = useNavigate()
  const root = partsRoot(standalone)
  const now = usePartsNow(60_000)
  const cart = usePartsStore((state) => state.cart)
  const placeOrder = usePartsStore((state) => state.placeOrder)
  const [form] = Form.useForm<CheckoutValues>()
  const [step, setStep] = useState(0)
  const [placed, setPlaced] = useState<Order | null>(null)
  const [maxStep, setMaxStep] = useState(0)

  const city = Form.useWatch('city', { form, preserve: true }) as string | undefined
  const shipping =
    (Form.useWatch('shipping', { form, preserve: true }) as ShippingMethodId | undefined) ??
    'standard'
  const payment =
    (Form.useWatch('payment', { form, preserve: true }) as PaymentMethodId | undefined) ?? 'card'

  const lines = resolveLines(cart)
  // Delivery and payment only count once the shopper has reached their steps.
  const totals = orderTotals(
    lines,
    step >= 1 ? shipping : undefined,
    step >= 2 ? payment : undefined,
  )
  const money = (value: number) => formatTry(value, language)

  const stepFields: Array<Array<keyof CheckoutValues>> = [
    addressFields,
    ['shipping'],
    payment === 'card' ? ['payment', ...cardFields] : ['payment'],
    ['terms'],
  ]

  const goTo = async (next: number) => {
    if (next > step) {
      try {
        await form.validateFields(stepFields[step])
      } catch {
        return
      }
    }
    // A delivery the new address cannot have falls back to standard delivery.
    if (next >= 1 && !shippingAvailable(shipping, lines, city, now)) {
      form.setFieldValue('shipping', 'standard')
    }
    if (next >= 2 && payment === 'cod' && !codAllowed(orderTotals(lines, shipping, 'cod'))) {
      form.setFieldValue('payment', 'card')
    }
    setStep(next)
    setMaxStep((current) => Math.max(current, next))
    window.scrollTo?.({ top: 0 })
  }

  const submit = async () => {
    try {
      await form.validateFields(['terms'])
    } catch {
      return
    }
    const values = form.getFieldsValue(true) as CheckoutValues
    const order = placeOrder({
      address: {
        fullName: values.fullName,
        phone: values.phone,
        email: values.email,
        city: values.city,
        district: values.district,
        line: values.line,
        postcode: values.postcode,
      },
      shipping: values.shipping,
      payment: values.payment,
    })
    if (order) setPlaced(order)
  }

  if (placed) {
    return (
      <PartsSiteShell standalone={standalone}>
        <div className="parts-section">
          <Result
            status="success"
            title={text.checkout.doneTitle}
            subTitle={text.checkout.doneText(placed.id)}
            extra={[
              <Button
                key="track"
                type="primary"
                size="large"
                icon={<CarOutlined />}
                onClick={() => void navigate(`${root}/orders/${placed.id}`)}
              >
                {text.checkout.track}
              </Button>,
              <Button key="shop" size="large" onClick={() => void navigate(`${root}/catalog`)}>
                {text.checkout.continue}
              </Button>,
            ]}
          />
        </div>
      </PartsSiteShell>
    )
  }

  if (lines.length === 0) {
    return (
      <PartsSiteShell standalone={standalone}>
        <div className="parts-section">
          <Empty
            image={<ShoppingCartOutlined className="parts-empty__icon" />}
            description={
              <>
                <Typography.Title level={4}>{text.checkout.emptyTitle}</Typography.Title>
                <Typography.Text type="secondary">{text.checkout.emptyText}</Typography.Text>
              </>
            }
          >
            <Link to={`${root}/catalog`}>
              <Button type="primary">{text.cart.browse}</Button>
            </Link>
          </Empty>
        </div>
      </PartsSiteShell>
    )
  }

  const values = form.getFieldsValue(true) as Partial<CheckoutValues>
  const required = { required: true, message: text.checkout.required }

  return (
    <PartsSiteShell standalone={standalone}>
      <div className="parts-section parts-checkout">
        <Typography.Title level={2}>{text.checkout.title}</Typography.Title>
        <Steps
          className="parts-checkout__steps"
          current={step}
          size="small"
          responsive
          onChange={(next) => {
            if (next <= maxStep) void goTo(next)
          }}
          items={(['address', 'delivery', 'payment', 'review'] as const).map((key, index) => ({
            title: text.checkout.steps[key],
            disabled: index > maxStep,
          }))}
        />

        <div className="parts-checkout__layout">
          <Card className="parts-checkout__form">
            <Form<CheckoutValues>
              form={form}
              layout="vertical"
              requiredMark={false}
              initialValues={{ shipping: 'standard', payment: 'card' }}
            >
              {step === 0 && (
                <>
                  <Flex justify="space-between" align="center" wrap gap={8}>
                    <Typography.Title level={4}>
                      <EnvironmentOutlined /> {text.checkout.steps.address}
                    </Typography.Title>
                    <Button type="link" onClick={() => form.setFieldsValue(demoAddress)}>
                      {text.checkout.sampleAddress}
                    </Button>
                  </Flex>
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item name="fullName" label={text.checkout.fullName} rules={[required]}>
                        <Input autoComplete="name" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="phone"
                        label={text.checkout.phone}
                        rules={[
                          required,
                          {
                            validator: (_, value: string | undefined) =>
                              !value || phoneValid(value)
                                ? Promise.resolve()
                                : Promise.reject(new Error(text.checkout.phoneInvalid)),
                          },
                        ]}
                      >
                        <Input autoComplete="tel" inputMode="tel" placeholder="05xx xxx xx xx" />
                      </Form.Item>
                    </Col>
                    <Col xs={24}>
                      <Form.Item
                        name="email"
                        label={text.checkout.email}
                        rules={[required, { type: 'email', message: text.checkout.emailInvalid }]}
                      >
                        <Input autoComplete="email" inputMode="email" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item name="city" label={text.checkout.city} rules={[required]}>
                        <Select
                          showSearch
                          placeholder={text.checkout.citySelect}
                          options={cities.map((value) => ({ value, label: value }))}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item name="district" label={text.checkout.district} rules={[required]}>
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xs={24}>
                      <Form.Item name="line" label={text.checkout.line} rules={[required]}>
                        <Input.TextArea rows={2} autoComplete="street-address" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="postcode"
                        label={text.checkout.postcode}
                        rules={[
                          required,
                          { pattern: /^\d{5}$/, message: text.checkout.postcodeInvalid },
                        ]}
                      >
                        <Input inputMode="numeric" maxLength={5} autoComplete="postal-code" />
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              )}

              {step === 1 && (
                <>
                  <Typography.Title level={4}>
                    <CarOutlined /> {text.checkout.steps.delivery}
                  </Typography.Title>
                  <Form.Item name="shipping" rules={[required]}>
                    <Radio.Group className="parts-options">
                      {shippingMethodIds.map((id) => {
                        const method = shippingMethods[id]
                        const available = shippingAvailable(id, lines, city, now)
                        const price = shippingPrice(id, totals.subtotal)
                        return (
                          <Radio key={id} value={id} disabled={!available} className="parts-option">
                            <span className="parts-option__body">
                              <span className="parts-option__title">
                                <Typography.Text strong>{method.name[language]}</Typography.Text>
                                <Typography.Text strong>
                                  {price === 0 ? text.checkout.free : money(price)}
                                </Typography.Text>
                              </span>
                              <Typography.Text type="secondary">
                                {available
                                  ? `${arrivalText(text, id, now, language)} · ${text.checkout.carrier(method.carrier)}`
                                  : text.checkout.unavailable[id as 'sameDay' | 'pickup']}
                              </Typography.Text>
                              {method.freeOver && price > 0 && (
                                <Typography.Text type="secondary">
                                  {text.checkout.freeOver(money(method.freeOver))}
                                </Typography.Text>
                              )}
                            </span>
                          </Radio>
                        )
                      })}
                    </Radio.Group>
                  </Form.Item>
                  {!dispatchCutoff(now).shipsToday && (
                    <Alert
                      type="info"
                      showIcon
                      icon={<InfoCircleOutlined />}
                      title={text.product.leavesOn(
                        dispatchCutoff(now).dispatchDay.locale(language).format('dddd, D MMMM'),
                      )}
                    />
                  )}
                </>
              )}

              {step === 2 && (
                <>
                  <Typography.Title level={4}>
                    <CreditCardOutlined /> {text.checkout.steps.payment}
                  </Typography.Title>
                  <Alert
                    type="warning"
                    showIcon
                    title={text.checkout.demo}
                    className="parts-demo"
                  />
                  <Form.Item name="payment" rules={[required]}>
                    <Radio.Group className="parts-options">
                      {paymentMethodIds.map((id) => {
                        const disabled =
                          id === 'cod' && !codAllowed(orderTotals(lines, shipping, 'cod'))
                        return (
                          <Radio key={id} value={id} disabled={disabled} className="parts-option">
                            <span className="parts-option__body">
                              <span className="parts-option__title">
                                <Typography.Text strong>
                                  {paymentIcons[id]} {text.checkout.payments[id]}
                                </Typography.Text>
                              </span>
                              <Typography.Text type="secondary">
                                {disabled
                                  ? text.checkout.codTooHigh
                                  : text.checkout.paymentNotes[id]}
                              </Typography.Text>
                            </span>
                          </Radio>
                        )
                      })}
                    </Radio.Group>
                  </Form.Item>

                  {payment === 'card' && (
                    <Row gutter={16} className="parts-card-fields">
                      <Col xs={24}>
                        <Form.Item
                          name="cardName"
                          label={text.checkout.cardName}
                          rules={[required]}
                        >
                          <Input autoComplete="cc-name" />
                        </Form.Item>
                      </Col>
                      <Col xs={24}>
                        <Form.Item
                          name="cardNumber"
                          label={text.checkout.cardNumber}
                          normalize={groupCardNumber}
                          extra={text.checkout.testCard}
                          rules={[
                            required,
                            {
                              validator: (_, value: string | undefined) =>
                                !value || luhnValid(value)
                                  ? Promise.resolve()
                                  : Promise.reject(new Error(text.checkout.cardInvalid)),
                            },
                          ]}
                        >
                          <Input
                            inputMode="numeric"
                            autoComplete="cc-number"
                            className="parts-mono"
                            placeholder="0000 0000 0000 0000"
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={12}>
                        <Form.Item
                          name="cardExpiry"
                          label={text.checkout.cardExpiry}
                          normalize={formatExpiry}
                          rules={[
                            required,
                            {
                              validator: (_, value: string | undefined) =>
                                !value || expiryValid(value, now)
                                  ? Promise.resolve()
                                  : Promise.reject(new Error(text.checkout.expiryInvalid)),
                            },
                          ]}
                        >
                          <Input inputMode="numeric" autoComplete="cc-exp" placeholder="MM/YY" />
                        </Form.Item>
                      </Col>
                      <Col xs={12}>
                        <Form.Item
                          name="cardCvc"
                          label={text.checkout.cardCvc}
                          rules={[
                            required,
                            { pattern: /^\d{3,4}$/, message: text.checkout.cvcInvalid },
                          ]}
                        >
                          <Input inputMode="numeric" autoComplete="cc-csc" maxLength={4} />
                        </Form.Item>
                      </Col>
                    </Row>
                  )}
                  {payment === 'transfer' && (
                    <div className="parts-iban">
                      <Typography.Text type="secondary">{text.checkout.iban}</Typography.Text>
                      <Typography.Text strong copyable className="parts-mono">
                        TR00 0000 0000 0000 0000 0000 00
                      </Typography.Text>
                    </div>
                  )}
                </>
              )}

              {step === 3 && (
                <>
                  <Typography.Title level={4}>{text.checkout.steps.review}</Typography.Title>
                  <div className="parts-review">
                    <section>
                      <Flex justify="space-between" align="center">
                        <Typography.Text strong>{text.checkout.reviewAddress}</Typography.Text>
                        <Button
                          type="link"
                          size="small"
                          icon={<EditOutlined />}
                          onClick={() => void goTo(0)}
                        >
                          {text.checkout.edit}
                        </Button>
                      </Flex>
                      <address>
                        {values.fullName}
                        <br />
                        {values.line}
                        <br />
                        {values.postcode} {values.district} / {values.city}
                        <br />
                        {values.phone} · {values.email}
                      </address>
                    </section>
                    <section>
                      <Flex justify="space-between" align="center">
                        <Typography.Text strong>{text.checkout.reviewDelivery}</Typography.Text>
                        <Button
                          type="link"
                          size="small"
                          icon={<EditOutlined />}
                          onClick={() => void goTo(1)}
                        >
                          {text.checkout.edit}
                        </Button>
                      </Flex>
                      <Typography.Text>
                        {shippingMethods[shipping].name[language]} ·{' '}
                        {arrivalText(text, shipping, now, language)}
                      </Typography.Text>
                    </section>
                    <section>
                      <Flex justify="space-between" align="center">
                        <Typography.Text strong>{text.checkout.reviewPayment}</Typography.Text>
                        <Button
                          type="link"
                          size="small"
                          icon={<EditOutlined />}
                          onClick={() => void goTo(2)}
                        >
                          {text.checkout.edit}
                        </Button>
                      </Flex>
                      <Typography.Text>
                        {text.checkout.payments[payment]}
                        {payment === 'card' && values.cardNumber
                          ? ` · •••• ${values.cardNumber.replace(/\s/g, '').slice(-4)}`
                          : ''}
                      </Typography.Text>
                    </section>
                  </div>
                  <Form.Item
                    name="terms"
                    valuePropName="checked"
                    rules={[
                      {
                        validator: (_, value: boolean | undefined) =>
                          value
                            ? Promise.resolve()
                            : Promise.reject(new Error(text.checkout.termsRequired)),
                      },
                    ]}
                  >
                    <Checkbox>{text.checkout.terms}</Checkbox>
                  </Form.Item>
                </>
              )}

              <Flex justify="space-between" gap={8} className="parts-checkout__nav">
                {step > 0 ? (
                  <Button size="large" onClick={() => void goTo(step - 1)}>
                    {text.checkout.back}
                  </Button>
                ) : (
                  <span />
                )}
                {step < 3 ? (
                  <Button type="primary" size="large" onClick={() => void goTo(step + 1)}>
                    {text.checkout.next}
                  </Button>
                ) : (
                  <Button type="primary" size="large" onClick={() => void submit()}>
                    {text.checkout.place} · {money(totals.total)}
                  </Button>
                )}
              </Flex>
            </Form>
          </Card>

          <aside className="parts-checkout__aside">
            <Summary lines={lines} totals={totals} shippingChosen={step >= 1} />
          </aside>
        </div>
      </div>
    </PartsSiteShell>
  )
}
