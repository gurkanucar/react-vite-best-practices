import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CheckCircleFilled,
  LockOutlined,
  PrinterOutlined,
  TagOutlined,
} from '@ant-design/icons'
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Flex,
  Form,
  Grid,
  Input,
  InputNumber,
  QRCode,
  Result,
  Row,
  Select,
  Space,
  Steps,
  Tag,
  Typography,
} from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ConfSiteShell } from '@/features/showcases/components/ConfSiteShell'
import { CONF_HALLS, CONF_NAME, confRoot } from '@/features/showcases/data/confData'
import {
  checkPromo,
  expiryValid,
  formatCardNumber,
  formatExpiry,
  formatLira,
  luhnValid,
  orderReference,
  quoteSelection,
  seatTiers,
  ticketTiers,
  tierLimit,
  tierState,
  workshops,
  workshopSeats,
  WORKSHOP_PRICE,
  type Quote,
  type TicketSelection,
  type TierId,
} from '@/features/showcases/data/confTickets'
import { useConfNow } from '@/features/showcases/hooks/useConfNow'
import { useConfText } from '@/features/showcases/hooks/useConfText'

interface EventTicketsPageProps {
  standalone?: boolean
}

interface Attendee {
  fullName: string
  email: string
  company?: string
  role?: string
  shirt?: string
  dietary?: string
  university?: string
}

interface Payment {
  cardName: string
  cardNumber: string
  expiry: string
  cvc: string
  email: string
  invoice?: boolean
  companyName?: string
  taxNumber?: string
}

interface Confirmation {
  reference: string
  email: string
  attendees: (Attendee & { tier: TierId })[]
}

const SHIRTS = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const SAMPLE_NAMES = [
  ['Ada Yılmaz', 'ada@example.com', 'Kuzey Pay', 'Frontend Engineer'],
  ['Mert Kaya', 'mert@example.com', 'Rota Mobility', 'Product Designer'],
  ['Lina Costa', 'lina@example.com', 'Stackyard', 'Engineering Manager'],
  ['Burak Şen', 'burak@example.com', 'Çarşı', 'Product Manager'],
  ['Nora Berg', 'nora@example.com', 'Nordvik', 'UX Researcher'],
]

/**
 * Buying tickets in four steps: seats and workshops, a name for every seat, a demo payment,
 * then a badge with a QR code per attendee. The summary beside each step is the same quote.
 */
export function EventTicketsPage({ standalone = false }: EventTicketsPageProps) {
  const { text, language } = useConfText()
  const t = text.tickets
  const root = confRoot(standalone)
  const navigate = useNavigate()
  const now = useConfNow(60_000)
  const wide = Grid.useBreakpoint().md ?? false
  const [step, setStep] = useState(0)
  const [selection, setSelection] = useState<TicketSelection>({ tickets: {}, workshops: {} })
  const [promoInput, setPromoInput] = useState('')
  const [promoError, setPromoError] = useState<string>()
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [confirmation, setConfirmation] = useState<Confirmation>()
  const [attendeeForm] = Form.useForm<{ attendees: Attendee[] }>()
  const [paymentForm] = Form.useForm<Payment>()

  const quote = quoteSelection(selection, now)
  const seats = seatTiers(selection)
  const money = (amount: number) => formatLira(amount, text.locale)
  const dateText = (ms: number) =>
    new Intl.DateTimeFormat(text.locale, {
      day: 'numeric',
      month: 'long',
      timeZone: 'Europe/Istanbul',
    }).format(ms)

  const setTickets = (tier: TierId, value: number | null) =>
    setSelection((previous) => ({
      ...previous,
      tickets: { ...previous.tickets, [tier]: value ?? 0 },
    }))
  const setWorkshop = (id: string, value: number | null) =>
    setSelection((previous) => ({
      ...previous,
      workshops: { ...previous.workshops, [id]: value ?? 0 },
    }))

  const applyPromo = () => {
    const check = checkPromo(promoInput, now)
    if (check.status === 'valid') {
      setSelection((previous) => ({ ...previous, promo: check.promo.code }))
      setPromoError(undefined)
    } else {
      setPromoError(check.status === 'expired' ? t.promoExpired : t.promoUnknown)
    }
  }

  const toAttendees = () => {
    // One form row per seat, keeping whatever was typed for the seats that are still there.
    attendeeForm.setFieldsValue({
      attendees: seats.map((_, index) => attendees[index] ?? { fullName: '', email: '' }),
    })
    setStep(1)
  }

  const saveAttendees = async () => {
    // A rejected validation has already put its messages under the fields.
    const values = await attendeeForm.validateFields().catch(() => undefined)
    if (!values) return
    setAttendees(values.attendees)
    if (!paymentForm.getFieldValue('email')) {
      paymentForm.setFieldValue('email', values.attendees[0]?.email)
    }
    setStep(2)
  }

  const pay = async () => {
    const values = await paymentForm.validateFields().catch(() => undefined)
    if (!values) return
    const stamp = Date.now()
    setConfirmation({
      reference: orderReference(stamp),
      email: values.email,
      attendees: attendees.map((attendee, index) => ({
        ...attendee,
        tier: seats[index] ?? 'regular',
      })),
    })
    setStep(3)
  }

  const startOver = () => {
    setSelection({ tickets: {}, workshops: {} })
    setAttendees([])
    setPromoInput('')
    setConfirmation(undefined)
    attendeeForm.resetFields()
    paymentForm.resetFields()
    setStep(0)
  }

  const fillSample = () =>
    attendeeForm.setFieldsValue({
      attendees: seats.map((tier, index) => {
        const [fullName, email, company, role] = SAMPLE_NAMES[index % SAMPLE_NAMES.length]!
        return {
          fullName,
          email: index < SAMPLE_NAMES.length ? email : email.replace('@', `+${index}@`),
          company,
          role,
          shirt: 'M',
          dietary: t.dietaryOptions[0],
          university: tier === 'student' ? 'Boğaziçi Üniversitesi' : undefined,
        }
      }),
    })

  const tickets = (
    <Flex vertical gap={16}>
      <div className="conf-tiers">
        {ticketTiers.map((tier) => {
          const state = tierState(tier, now)
          const name = t.tierNames[tier.id]
          const quantity = selection.tickets[tier.id] ?? 0
          return (
            <div
              key={tier.id}
              className={`conf-tier${tier.featured ? ' conf-tier--featured' : ''}${state === 'onSale' ? '' : ' conf-tier--off'}${quantity > 0 ? ' conf-tier--chosen' : ''}`}
            >
              <div className="conf-tier__text">
                <Flex gap={8} align="center" wrap>
                  <Typography.Title level={4} className="conf-tier__name">
                    {name}
                  </Typography.Title>
                  {tier.featured && (
                    <Tag color="volcano" variant="filled">
                      {t.mostPopular}
                    </Tag>
                  )}
                  {state === 'soldOut' && <Tag variant="outlined">{t.soldOut}</Tag>}
                  {state === 'ended' && <Tag variant="outlined">{t.ended}</Tag>}
                </Flex>
                <Typography.Text type="secondary">{t.tierText[tier.id]}</Typography.Text>
                <Flex gap={6} wrap className="conf-tier__facts">
                  {state === 'onSale' && tier.deadline !== undefined && (
                    <Tag variant="filled" color="orange">
                      {t.endsOn(dateText(tier.deadline))}
                    </Tag>
                  )}
                  {state === 'onSale' && tier.remaining !== undefined && (
                    <Tag variant="filled" color="red">
                      {t.left(tier.remaining)}
                    </Tag>
                  )}
                  {tier.min !== undefined && <Tag variant="filled">{t.minSeats(tier.min)}</Tag>}
                  {state === 'onSale' && <Tag variant="filled">{t.maxSeats(tierLimit(tier))}</Tag>}
                </Flex>
              </div>
              <div className="conf-tier__buy">
                <Typography.Text className="conf-tier__price">
                  {money(tier.price)} <span>{t.perSeat}</span>
                </Typography.Text>
                <InputNumber
                  min={0}
                  max={tierLimit(tier)}
                  precision={0}
                  value={quantity}
                  disabled={state !== 'onSale'}
                  aria-label={t.quantity(name)}
                  onChange={(value) => setTickets(tier.id, value)}
                  className="conf-tier__quantity"
                />
              </div>
            </div>
          )
        })}
      </div>

      <Card title={t.workshopsTitle} className="conf-workshops">
        <Typography.Paragraph type="secondary">{t.workshopsText}</Typography.Paragraph>
        <ul className="conf-workshops__list">
          {workshops.map((workshop) => {
            const left = workshopSeats[workshop.id] ?? 0
            const title = workshop.title[language]
            return (
              <li key={workshop.id} className={left === 0 ? 'is-full' : undefined}>
                <div>
                  <Typography.Text strong>{title}</Typography.Text>
                  <Typography.Text type="secondary">
                    {workshop.start}–{workshop.end} ·{' '}
                    {workshop.hall === 'all' ? text.allHalls : CONF_HALLS[workshop.hall][language]}{' '}
                    · {left === 0 ? t.full : t.seatsLeft(left)}
                  </Typography.Text>
                </div>
                <Flex align="center" gap={12}>
                  <Typography.Text>{money(WORKSHOP_PRICE)}</Typography.Text>
                  <InputNumber
                    min={0}
                    max={Math.max(0, Math.min(left, seats.length))}
                    precision={0}
                    value={selection.workshops[workshop.id] ?? 0}
                    disabled={left === 0 || seats.length === 0}
                    aria-label={t.quantity(title)}
                    onChange={(value) => setWorkshop(workshop.id, value)}
                    className="conf-tier__quantity"
                  />
                </Flex>
              </li>
            )
          })}
        </ul>
      </Card>
    </Flex>
  )

  const attendeeStep = (
    <Form form={attendeeForm} layout="vertical" requiredMark="optional" className="conf-attendees">
      <Flex justify="flex-end">
        <Button type="link" onClick={fillSample}>
          {t.fillSample}
        </Button>
      </Flex>
      <Form.List name="attendees">
        {(fields) =>
          fields.map((field, index) => {
            const tier = seats[index] ?? 'regular'
            return (
              <Card
                key={field.key}
                size="small"
                title={t.attendee(index + 1, t.tierNames[tier])}
                className="conf-attendee"
              >
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name={[field.name, 'fullName']}
                      label={t.fullName}
                      rules={[
                        { required: true, whitespace: true, message: t.required(t.fullName) },
                      ]}
                    >
                      <Input autoComplete="name" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name={[field.name, 'email']}
                      label={t.email}
                      rules={[
                        { required: true, message: t.required(t.email) },
                        { type: 'email', message: t.invalidEmail },
                      ]}
                    >
                      <Input type="email" autoComplete="email" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name={[field.name, 'company']} label={t.company}>
                      <Input autoComplete="organization" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name={[field.name, 'role']} label={t.role}>
                      <Input autoComplete="organization-title" />
                    </Form.Item>
                  </Col>
                  <Col xs={12} md={6}>
                    <Form.Item name={[field.name, 'shirt']} label={t.shirt}>
                      <Select options={SHIRTS.map((size) => ({ value: size, label: size }))} />
                    </Form.Item>
                  </Col>
                  <Col xs={12} md={6}>
                    <Form.Item name={[field.name, 'dietary']} label={t.dietary}>
                      <Select
                        options={t.dietaryOptions.map((option) => ({
                          value: option,
                          label: option,
                        }))}
                      />
                    </Form.Item>
                  </Col>
                  {tier === 'student' && (
                    <Col xs={24} md={12}>
                      <Form.Item
                        name={[field.name, 'university']}
                        label={t.university}
                        rules={[
                          { required: true, whitespace: true, message: t.required(t.university) },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  )}
                </Row>
              </Card>
            )
          })
        }
      </Form.List>
    </Form>
  )

  const paymentStep = (
    <Form form={paymentForm} layout="vertical" requiredMark="optional" className="conf-payment">
      <Alert
        type="info"
        showIcon
        icon={<LockOutlined />}
        title={t.demoPayment}
        className="conf-payment__demo"
      />
      <Row gutter={16}>
        <Col xs={24}>
          <Form.Item
            name="cardName"
            label={t.cardName}
            rules={[{ required: true, whitespace: true, message: t.required(t.cardName) }]}
          >
            <Input autoComplete="cc-name" />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item
            name="cardNumber"
            label={t.cardNumber}
            normalize={formatCardNumber}
            rules={[
              { required: true, message: t.required(t.cardNumber) },
              {
                validator: (_, value: string) =>
                  !value || luhnValid(value)
                    ? Promise.resolve()
                    : Promise.reject(new Error(t.invalidCard)),
              },
            ]}
          >
            <Input inputMode="numeric" autoComplete="cc-number" placeholder="4242 4242 4242 4242" />
          </Form.Item>
        </Col>
        <Col xs={12}>
          <Form.Item
            name="expiry"
            label={t.expiry}
            normalize={formatExpiry}
            rules={[
              { required: true, message: t.required(t.expiry) },
              {
                validator: (_, value: string) =>
                  !value || expiryValid(value, Date.now())
                    ? Promise.resolve()
                    : Promise.reject(new Error(t.invalidExpiry)),
              },
            ]}
          >
            <Input inputMode="numeric" autoComplete="cc-exp" placeholder="MM/YY" />
          </Form.Item>
        </Col>
        <Col xs={12}>
          <Form.Item
            name="cvc"
            label={t.cvc}
            normalize={(value: string) => value.replace(/\D/g, '').slice(0, 4)}
            rules={[
              { required: true, message: t.required(t.cvc) },
              { pattern: /^\d{3,4}$/, message: t.invalidCvc },
            ]}
          >
            <Input inputMode="numeric" autoComplete="cc-csc" />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item
            name="email"
            label={t.billingEmail}
            rules={[
              { required: true, message: t.required(t.billingEmail) },
              { type: 'email', message: t.invalidEmail },
            ]}
          >
            <Input type="email" autoComplete="email" />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item name="invoice" valuePropName="checked">
            <Checkbox>{t.invoice}</Checkbox>
          </Form.Item>
        </Col>
        <Form.Item noStyle dependencies={['invoice']}>
          {({ getFieldValue }) =>
            getFieldValue('invoice') ? (
              <>
                <Col xs={24} md={14}>
                  <Form.Item
                    name="companyName"
                    label={t.companyName}
                    rules={[
                      { required: true, whitespace: true, message: t.required(t.companyName) },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={10}>
                  <Form.Item
                    name="taxNumber"
                    label={t.taxNumber}
                    rules={[
                      { required: true, pattern: /^\d{10,11}$/, message: t.required(t.taxNumber) },
                    ]}
                  >
                    <Input inputMode="numeric" />
                  </Form.Item>
                </Col>
              </>
            ) : null
          }
        </Form.Item>
      </Row>
    </Form>
  )

  const summary = (
    <OrderSummary
      quote={quote}
      money={money}
      step={step}
      promoInput={promoInput}
      promoError={promoError}
      onPromoInput={(value) => {
        setPromoInput(value)
        setPromoError(undefined)
      }}
      onApply={applyPromo}
      onRemovePromo={() => {
        setSelection((previous) => ({ ...previous, promo: undefined }))
        setPromoInput('')
      }}
      onContinue={() => {
        if (step === 0) toAttendees()
        else if (step === 1) void saveAttendees()
        else void pay()
      }}
      onBack={() => setStep((current) => Math.max(0, current - 1))}
    />
  )

  return (
    <ConfSiteShell
      standalone={standalone}
      title={{ en: 'Conference tickets', tr: 'Konferans biletleri' }}
      description={{
        en: 'Ticket tiers with stock and deadlines, workshop add-ons, promo codes, attendee forms and QR badges.',
        tr: 'Stoklu ve süreli bilet türleri, atölye eklentileri, indirim kodu, katılımcı formları ve QR yaka kartları.',
      }}
    >
      <section className="showcase-section conf-page-head">
        <Typography.Title>{t.title}</Typography.Title>
        <Typography.Paragraph type="secondary">{t.description}</Typography.Paragraph>
      </section>

      <section className="showcase-section conf-checkout">
        <Steps
          current={step}
          size="small"
          responsive={false}
          titlePlacement={wide ? 'horizontal' : 'vertical'}
          className="conf-steps"
          items={t.steps.map((title) => ({ title }))}
        />

        {step === 3 && confirmation ? (
          <div className="conf-done">
            <Result
              status="success"
              icon={<CheckCircleFilled />}
              title={t.doneTitle}
              subTitle={t.doneText(confirmation.reference, confirmation.email)}
              extra={[
                <Button
                  key="print"
                  icon={<PrinterOutlined aria-hidden="true" />}
                  onClick={() => window.print()}
                >
                  {t.printBadges}
                </Button>,
                <Button
                  key="program"
                  type="primary"
                  onClick={() => void navigate(`${root}/schedule`)}
                >
                  {t.seeProgram}
                </Button>,
                <Button key="more" onClick={startOver}>
                  {t.buyMore}
                </Button>,
              ]}
            />
            <Divider titlePlacement="start">{t.badges}</Divider>
            <Typography.Paragraph type="secondary">{t.badgeHint}</Typography.Paragraph>
            <div className="conf-badges">
              {confirmation.attendees.map((attendee, index) => (
                <article
                  key={`${attendee.email}-${index}`}
                  className={`conf-badge conf-badge--${attendee.tier}`}
                >
                  <div className="conf-badge__top">
                    <span>{CONF_NAME}</span>
                    <span>{t.conferenceDays}</span>
                  </div>
                  <strong className="conf-badge__name">{attendee.fullName}</strong>
                  <span className="conf-badge__company">
                    {[attendee.role, attendee.company].filter(Boolean).join(' · ') || ' '}
                  </span>
                  <Flex justify="space-between" align="flex-end" gap={12}>
                    <Tag variant="solid" className="conf-badge__tier">
                      {t.tierNames[attendee.tier]}
                    </Tag>
                    <QRCode
                      value={`${confirmation.reference}-${index + 1}`}
                      size={96}
                      bordered={false}
                      color="#0f1222"
                      bgColor="#ffffff"
                      className="conf-badge__qr"
                    />
                  </Flex>
                  <span className="conf-badge__code">
                    {confirmation.reference}-{index + 1}
                  </span>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={15}>
              {step === 0 && tickets}
              <div hidden={step !== 1}>{attendeeStep}</div>
              <div hidden={step !== 2}>{paymentStep}</div>
            </Col>
            <Col xs={24} lg={9}>
              <div className="conf-summary-wrap">{summary}</div>
            </Col>
          </Row>
        )}
      </section>
    </ConfSiteShell>
  )
}

interface OrderSummaryProps {
  quote: Quote
  money: (amount: number) => string
  step: number
  promoInput: string
  promoError?: string
  onPromoInput: (value: string) => void
  onApply: () => void
  onRemovePromo: () => void
  onContinue: () => void
  onBack: () => void
}

function OrderSummary({
  quote,
  money,
  step,
  promoInput,
  promoError,
  onPromoInput,
  onApply,
  onRemovePromo,
  onContinue,
  onBack,
}: OrderSummaryProps) {
  const { text, language } = useConfText()
  const t = text.tickets
  const lineName = (id: string, kind: 'ticket' | 'workshop') =>
    kind === 'ticket'
      ? t.tierNames[id as TierId]
      : (workshops.find((workshop) => workshop.id === id)?.title[language] ?? id)

  return (
    <Card title={t.summary} className="conf-summary">
      {quote.lines.length === 0 ? (
        <Typography.Text type="secondary">{t.emptySummary}</Typography.Text>
      ) : (
        <ul className="conf-summary__lines">
          {quote.lines.map((line) => (
            <li key={line.id}>
              <span>
                {line.quantity} × {lineName(line.id, line.kind)}
              </span>
              <span>{money(line.total)}</span>
            </li>
          ))}
        </ul>
      )}

      {step === 0 && (
        <div className="conf-summary__promo">
          {quote.promo ? (
            <Flex justify="space-between" align="center">
              <Tag icon={<TagOutlined />} color="green" variant="filled">
                {t.promoApplied(quote.promo.code)}
              </Tag>
              <Button type="link" size="small" onClick={onRemovePromo}>
                {t.remove}
              </Button>
            </Flex>
          ) : (
            <Form.Item
              label={t.promo}
              validateStatus={promoError ? 'error' : undefined}
              help={promoError}
              className="conf-summary__promo-field"
            >
              <Space.Compact block>
                <Input
                  value={promoInput}
                  placeholder={t.promoPlaceholder}
                  aria-label={t.promo}
                  onChange={(event) => onPromoInput(event.target.value)}
                  onPressEnter={onApply}
                />
                <Button onClick={onApply} disabled={promoInput.trim() === ''}>
                  {t.apply}
                </Button>
              </Space.Compact>
            </Form.Item>
          )}
        </div>
      )}

      <Divider />
      <dl className="conf-summary__totals">
        <div>
          <dt>{t.subtotal}</dt>
          <dd>{money(quote.subtotal)}</dd>
        </div>
        {quote.discount > 0 && (
          <div className="conf-summary__discount">
            <dt>{t.discount}</dt>
            <dd>−{money(quote.discount)}</dd>
          </div>
        )}
        <div className="conf-summary__total">
          <dt>{t.total}</dt>
          <dd>{money(quote.total)}</dd>
        </div>
      </dl>
      <Typography.Text type="secondary" className="conf-summary__vat">
        {t.vatIncluded(money(quote.vat))}
      </Typography.Text>

      {step === 0 && quote.lines.length > 0 && quote.issues.length > 0 && (
        <ul className="conf-summary__issues">
          {quote.issues
            .filter((issue) => issue !== 'empty')
            .map((issue) => (
              <li key={issue}>{t.issues[issue]}</li>
            ))}
        </ul>
      )}

      <Flex gap={8} className="conf-summary__actions">
        {step > 0 && (
          <Button icon={<ArrowLeftOutlined aria-hidden="true" />} onClick={onBack}>
            {t.back}
          </Button>
        )}
        <Button
          type="primary"
          block
          size="large"
          disabled={quote.issues.length > 0}
          onClick={onContinue}
          icon={
            step < 2 ? (
              <ArrowRightOutlined aria-hidden="true" />
            ) : (
              <LockOutlined aria-hidden="true" />
            )
          }
          iconPlacement="end"
        >
          {step < 2 ? t.continue : t.pay(money(quote.total))}
        </Button>
      </Flex>
    </Card>
  )
}
