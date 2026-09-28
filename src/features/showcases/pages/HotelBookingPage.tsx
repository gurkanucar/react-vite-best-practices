import { LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons'
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Col,
  Descriptions,
  Flex,
  Form,
  Input,
  Result,
  Row,
  Select,
  Steps,
  Typography,
} from 'antd'
import dayjs from 'dayjs'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { StaySummary } from '@/features/showcases/components/HotelRoomParts'
import { HotelSiteShell } from '@/features/showcases/components/HotelSiteShell'
import {
  findRoom,
  hotelCountries,
  hotelRoot,
  hotelRoomsRoot,
} from '@/features/showcases/data/hotel'
import {
  availabilityFor,
  bookingReference,
  cardDigits,
  expiryValid,
  extraPrice,
  formatCardNumber,
  formatMoney,
  luhnValid,
  nightsOf,
  quoteStay,
  readStay,
  STAY_EXTRAS,
  stayParams,
  type RatePlan,
  type StayExtra,
} from '@/features/showcases/data/hotelBooking'
import { useHotelText } from '@/features/showcases/data/hotelCopy'

interface HotelBookingPageProps {
  standalone?: boolean
}

interface BookingValues {
  firstName: string
  lastName: string
  email: string
  phone: string
  country?: string
  arrival?: string
  requests?: string
  cardName: string
  cardNumber: string
  expiry: string
  cvc: string
  terms: boolean
}

const guestFields: (keyof BookingValues)[] = [
  'firstName',
  'lastName',
  'email',
  'phone',
  'country',
  'arrival',
  'requests',
]
const paymentFields: (keyof BookingValues)[] = ['cardName', 'cardNumber', 'expiry', 'cvc', 'terms']
const arrivalTimes = [
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
  '22:00',
  '23:00',
]

/** `0412` → `04/12`, as it is typed. */
function formatExpiry(value: string) {
  const digits = cardDigits(value).slice(0, 4)
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
}

export function HotelBookingPage({ standalone = false }: HotelBookingPageProps) {
  const { text, language } = useHotelText()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { stay, issue } = readStay(params)
  const room = findRoom(params.get('room') ?? undefined)
  const plan: RatePlan = params.get('plan') === 'nonRefundable' ? 'nonRefundable' : 'flexible'
  const [form] = Form.useForm<BookingValues>()
  const [step, setStep] = useState(0)
  const [extras, setExtras] = useState<StayExtra[]>([])
  const [paying, setPaying] = useState(false)
  const [confirmation, setConfirmation] = useState<{
    reference: string
    email: string
    name: string
  }>()
  const payTimer = useRef<number>(undefined)
  const topRef = useRef<HTMLDivElement>(null)
  const roomsPath = hotelRoomsRoot(standalone)
  const t = text.booking

  useEffect(() => () => window.clearTimeout(payTimer.current), [])

  const frame = {
    standalone,
    title: { en: 'Hotel booking', tr: 'Otel rezervasyonu' },
    description: {
      en: 'A four-step booking: extras, guest details, a demo payment and the confirmation.',
      tr: 'Dört adımlı rezervasyon: ekstralar, misafir bilgileri, demo ödeme ve onay.',
    },
  }

  if (!room || issue) {
    return (
      <HotelSiteShell {...frame}>
        <Result
          status="info"
          title={t.missingTitle}
          subTitle={t.missingText}
          extra={
            <Button type="primary" onClick={() => navigate(`${roomsPath}?${stayParams(stay)}`)}>
              {t.browseRooms}
            </Button>
          }
        />
      </HotelSiteShell>
    )
  }

  const availability = availabilityFor(room, stay)
  if (!availability.available && !confirmation) {
    return (
      <HotelSiteShell {...frame}>
        <Result
          status="warning"
          title={t.unavailableTitle}
          subTitle={t.unavailableText}
          extra={
            <Button type="primary" onClick={() => navigate(`${roomsPath}?${stayParams(stay)}`)}>
              {t.browseRooms}
            </Button>
          }
        />
      </HotelSiteShell>
    )
  }

  const quote = quoteStay(room, stay, plan, extras)
  const money = (amount: number) => formatMoney(amount, language)

  const goTo = (next: number) => {
    setStep(next)
    topRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'start' })
  }

  const next = async () => {
    if (step === 1) {
      try {
        await form.validateFields(guestFields)
      } catch {
        return
      }
    }
    goTo(step + 1)
  }

  const pay = async () => {
    try {
      await form.validateFields(paymentFields)
    } catch {
      return
    }
    const values = form.getFieldsValue(true) as BookingValues
    setPaying(true)
    // Stands in for the payment provider's round trip; nothing leaves the browser.
    payTimer.current = window.setTimeout(() => {
      setPaying(false)
      setConfirmation({
        reference: bookingReference(`${values.email}:${room.id}:${stay.checkIn}:${Date.now()}`),
        email: values.email,
        name: `${values.firstName} ${values.lastName}`,
      })
      goTo(3)
    }, 600)
  }

  return (
    <HotelSiteShell {...frame}>
      <div className="showcase-section hotel-booking" ref={topRef}>
        <Typography.Title>{t.title}</Typography.Title>
        <Steps
          current={step}
          size="small"
          responsive={false}
          className="hotel-steps"
          items={t.steps.map((title) => ({ title }))}
        />

        {step === 3 && confirmation ? (
          <Card variant="borderless" className="hotel-card hotel-confirmation">
            <Result
              status="success"
              title={t.confirmedTitle}
              subTitle={t.confirmedText(confirmation.email)}
              extra={[
                <Button key="home" type="primary" onClick={() => navigate(hotelRoot(standalone))}>
                  {t.backHome}
                </Button>,
                <Button key="again" onClick={() => navigate(`${roomsPath}?${stayParams(stay)}`)}>
                  {t.another}
                </Button>,
              ]}
            />
            <Descriptions
              column={{ xs: 1, sm: 2 }}
              bordered
              size="small"
              items={[
                {
                  key: 'reference',
                  label: t.reference,
                  children: (
                    <Typography.Text strong copyable>
                      {confirmation.reference}
                    </Typography.Text>
                  ),
                },
                { key: 'guest', label: t.guest, children: confirmation.name },
                {
                  key: 'room',
                  label: t.room,
                  children: `${room.name[language]} · ${text.roomsCount(stay.rooms)}`,
                },
                {
                  key: 'dates',
                  label: t.dates,
                  children: `${dayjs(stay.checkIn).format('D MMM')} – ${dayjs(stay.checkOut).format('D MMM YYYY')} · ${text.nights(nightsOf(stay))}`,
                },
                { key: 'rate', label: t.rate, children: text.plans[plan].title },
                { key: 'paid', label: t.paid, children: money(quote.total) },
              ]}
            />
          </Card>
        ) : (
          <div className="hotel-booking__layout">
            <Card variant="borderless" className="hotel-card">
              <Form<BookingValues>
                form={form}
                layout="vertical"
                requiredMark="optional"
                initialValues={{ country: language === 'tr' ? 'TR' : undefined, terms: false }}
              >
                {step === 0 && (
                  <section>
                    <Typography.Title level={3}>{t.extrasTitle}</Typography.Title>
                    <Typography.Paragraph type="secondary">{t.extrasLead}</Typography.Paragraph>
                    <Checkbox.Group
                      value={extras}
                      onChange={(value) => setExtras(value)}
                      className="hotel-extras"
                    >
                      {STAY_EXTRAS.map((extra) => (
                        <Checkbox key={extra} value={extra} className="hotel-extra">
                          <span className="hotel-plan__head">
                            <strong>{text.extras[extra].title}</strong>
                            <strong>{money(extraPrice(extra, stay))}</strong>
                          </span>
                          <span className="hotel-plan__text">{text.extras[extra].unit}</span>
                        </Checkbox>
                      ))}
                    </Checkbox.Group>
                  </section>
                )}

                {step === 1 && (
                  <section>
                    <Typography.Title level={3}>{t.guestTitle}</Typography.Title>
                    <Row gutter={16}>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          name="firstName"
                          label={t.firstName}
                          rules={[
                            { required: true, whitespace: true, message: t.required.firstName },
                          ]}
                        >
                          <Input autoComplete="given-name" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          name="lastName"
                          label={t.lastName}
                          rules={[
                            { required: true, whitespace: true, message: t.required.lastName },
                          ]}
                        >
                          <Input autoComplete="family-name" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          name="email"
                          label={t.email}
                          extra={t.emailHint}
                          rules={[
                            { required: true, message: t.required.email },
                            { type: 'email', message: t.required.emailFormat },
                          ]}
                        >
                          <Input type="email" autoComplete="email" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          name="phone"
                          label={t.phone}
                          rules={[
                            { required: true, message: t.required.phone },
                            { pattern: /^\+?[\d\s()-]{7,20}$/, message: t.required.phoneFormat },
                          ]}
                        >
                          <Input type="tel" autoComplete="tel" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          name="country"
                          label={t.country}
                          rules={[{ required: true, message: t.required.country }]}
                        >
                          <Select
                            showSearch={{ optionFilterProp: 'label' }}
                            options={hotelCountries.map((country) => ({
                              value: country.value,
                              label: country.label[language],
                            }))}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item name="arrival" label={t.arrival}>
                          <Select
                            allowClear
                            placeholder={t.arrivalPlaceholder}
                            options={arrivalTimes.map((time) => ({ value: time, label: time }))}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Form.Item name="requests" label={t.requests}>
                      <Input.TextArea
                        rows={3}
                        maxLength={500}
                        showCount
                        placeholder={t.requestsPlaceholder}
                      />
                    </Form.Item>
                  </section>
                )}

                {step === 2 && (
                  <section>
                    <Typography.Title level={3}>
                      <LockOutlined aria-hidden="true" /> {t.paymentTitle}
                    </Typography.Title>
                    <Alert type="info" showIcon title={t.demoNotice} className="hotel-issue" />
                    <Form.Item
                      name="cardName"
                      label={t.cardName}
                      rules={[{ required: true, whitespace: true, message: t.required.cardName }]}
                    >
                      <Input autoComplete="off" />
                    </Form.Item>
                    <Form.Item
                      name="cardNumber"
                      label={t.cardNumber}
                      normalize={formatCardNumber}
                      rules={[
                        { required: true, message: t.required.cardNumber },
                        {
                          validator: (_, value: string | undefined) =>
                            !value || luhnValid(value)
                              ? Promise.resolve()
                              : Promise.reject(new Error(t.required.cardNumber)),
                        },
                      ]}
                    >
                      <Input
                        inputMode="numeric"
                        autoComplete="off"
                        placeholder="4242 4242 4242 4242"
                      />
                    </Form.Item>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          name="expiry"
                          label={t.expiry}
                          normalize={formatExpiry}
                          rules={[
                            { required: true, message: t.required.expiry },
                            {
                              validator: (_, value: string | undefined) =>
                                !value || expiryValid(value)
                                  ? Promise.resolve()
                                  : Promise.reject(new Error(t.required.expiry)),
                            },
                          ]}
                        >
                          <Input inputMode="numeric" autoComplete="off" placeholder="MM/YY" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name="cvc"
                          label={t.cvc}
                          normalize={(value: string) => cardDigits(value).slice(0, 4)}
                          rules={[
                            { pattern: /^\d{3,4}$/, required: true, message: t.required.cvc },
                          ]}
                        >
                          <Input inputMode="numeric" autoComplete="off" placeholder="123" />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Form.Item
                      name="terms"
                      valuePropName="checked"
                      rules={[
                        {
                          validator: (_, value: boolean) =>
                            value ? Promise.resolve() : Promise.reject(new Error(t.required.terms)),
                        },
                      ]}
                    >
                      <Checkbox>{t.terms}</Checkbox>
                    </Form.Item>
                  </section>
                )}

                <Flex justify="space-between" gap={12} className="hotel-booking__actions">
                  {step > 0 ? (
                    <Button onClick={() => goTo(step - 1)} disabled={paying}>
                      {t.back}
                    </Button>
                  ) : (
                    <Button
                      onClick={() =>
                        navigate(`${roomsPath}/${room.id}?${stayParams(stay, { plan })}`)
                      }
                    >
                      {t.back}
                    </Button>
                  )}
                  {step < 2 ? (
                    <Button type="primary" onClick={() => void next()}>
                      {t.continue}
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      icon={<SafetyCertificateOutlined aria-hidden="true" />}
                      loading={paying}
                      onClick={() => void pay()}
                    >
                      {paying ? t.paying : t.pay(money(quote.total))}
                    </Button>
                  )}
                </Flex>
              </Form>
            </Card>

            <aside aria-label={text.room.yourStay} className="hotel-booking__aside">
              <Card variant="borderless" className="hotel-card">
                <StaySummary room={room} stay={stay} plan={plan} extras={extras} />
              </Card>
            </aside>
          </div>
        )}
      </div>
    </HotelSiteShell>
  )
}
