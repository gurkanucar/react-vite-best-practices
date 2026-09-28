import { ClockCircleOutlined, LockOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons'
import {
  Alert,
  App,
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Flex,
  Form,
  Input,
  Result,
  Row,
  Select,
  Steps,
  Tag,
  Typography,
} from 'antd'
import dayjs from 'dayjs'
import { useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { CinemaETicket } from '@/features/showcases/components/CinemaETicket'
import { CinemaPoster } from '@/features/showcases/components/CinemaPoster'
import { CinemaSeatMap } from '@/features/showcases/components/CinemaSeatMap'
import { CinemaSiteShell } from '@/features/showcases/components/CinemaSiteShell'
import {
  cinemaPaths,
  findCinema,
  findHall,
  findMovie,
  findShowtime,
  isBookable,
} from '@/features/showcases/data/cinema'
import {
  bookedSeats,
  childAllowed,
  concessions,
  createBooking,
  formatCountdown,
  formatMoney,
  HOLD_SECONDS,
  holdSecondsLeft,
  MAX_SEATS,
  quoteBooking,
  seatMapFor,
  singleSeatGaps,
  takenSeats,
  ticketPrice,
  ticketTypes,
  toggleSeat,
  type CinemaBooking,
  type TicketType,
} from '@/features/showcases/data/cinemaBooking'
import { useCinemaText } from '@/features/showcases/data/cinemaCopy'
import { expiryValid, formatCardNumber, luhnValid } from '@/features/showcases/data/hotelBooking'
import { useCinemaNow } from '@/features/showcases/hooks/useCinemaNow'
import { useCinemaTickets } from '@/features/showcases/hooks/useCinemaTickets'

interface CinemaBookingPageProps {
  standalone?: boolean
}

interface PaymentValues {
  email: string
  phone: string
  cardName: string
  cardNumber: string
  expiry: string
  cvc: string
  terms: boolean
}

const MAX_SNACKS = 10

export function CinemaBookingPage({ standalone = false }: CinemaBookingPageProps) {
  const { showtimeId } = useParams()
  const { text, language } = useCinemaText()
  const t = text.booking
  const { message } = App.useApp()
  const navigate = useNavigate()
  const paths = cinemaPaths(standalone)
  const now = useCinemaNow(1000)
  const [form] = Form.useForm<PaymentValues>()
  const topRef = useRef<HTMLDivElement>(null)

  const bookings = useCinemaTickets((state) => state.bookings)
  const addBooking = useCinemaTickets((state) => state.addBooking)

  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState<string[]>([])
  const [tickets, setTickets] = useState<Record<string, TicketType>>({})
  const [snacks, setSnacks] = useState<Record<string, number>>({})
  const [holdUntil, setHoldUntil] = useState<number | null>(null)
  const [paying, setPaying] = useState(false)
  const [confirmation, setConfirmation] = useState<CinemaBooking | null>(null)

  const dayDate = dayjs(now).format('YYYY-MM-DD')
  const show = useMemo(() => findShowtime(showtimeId, dayjs(dayDate)), [showtimeId, dayDate])
  const map = useMemo(() => (show ? seatMapFor(show) : null), [show])
  const taken = useMemo(
    () => (show ? takenSeats(show, dayjs(dayDate)) : new Set<string>()),
    [show, dayDate],
  )
  const mine = useMemo(
    () => (show ? bookedSeats(bookings, show.id) : new Set<string>()),
    [bookings, show],
  )

  const money = (amount: number) => formatMoney(amount, language)

  const goTo = (next: number) => {
    setStep(next)
    topRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'start' })
  }

  if (!show || !map) {
    return (
      <CinemaSiteShell standalone={standalone} page="booking">
        <Result
          status="404"
          title={t.notFound}
          subTitle={t.notFoundText}
          extra={
            <Button type="primary" onClick={() => navigate(paths.root)}>
              {text.movie.back}
            </Button>
          }
        />
      </CinemaSiteShell>
    )
  }

  const movie = findMovie(show.movieId)!
  const cinema = findCinema(show.cinemaId)!
  const hall = findHall(show.hallId)!
  const start = dayjs(`${show.date}T${show.time}`).locale(language)

  if (!confirmation && !isBookable(show, dayjs(now))) {
    return (
      <CinemaSiteShell standalone={standalone} page="booking">
        <Result
          status="warning"
          title={t.started}
          subTitle={t.startedText}
          extra={
            <Button type="primary" onClick={() => navigate(paths.movie(movie.id))}>
              {t.otherShows}
            </Button>
          }
        />
      </CinemaSiteShell>
    )
  }

  const unavailable = new Set([...taken, ...mine])
  const gaps = singleSeatGaps(map, selected, unavailable)
  const quote = quoteBooking(show, map, selected, tickets, snacks)
  const secondsLeft = holdUntil ? holdSecondsLeft(holdUntil, now) : null
  const expired = secondsLeft === 0 && (step === 1 || step === 2)

  const toggle = (seatId: string) => {
    const result = toggleSeat(map, selected, seatId, unavailable)
    if (result.error === 'max') void message.warning(t.maxSeats(MAX_SEATS))
    if (result.error === 'taken') void message.warning(t.seatTaken)
    setSelected(result.selected)
  }

  const startHold = () => {
    setTickets((current) =>
      Object.fromEntries(selected.map((seatId) => [seatId, current[seatId] ?? 'full'])),
    )
    setHoldUntil(now + HOLD_SECONDS * 1000)
    goTo(1)
  }

  const releaseSeats = () => {
    setHoldUntil(null)
    setSelected([])
    goTo(0)
  }

  const pay = async () => {
    try {
      await form.validateFields()
    } catch {
      return
    }
    const values = form.getFieldsValue(true) as PaymentValues
    setPaying(true)
    // Stands in for the payment provider; nothing leaves the browser.
    window.setTimeout(() => {
      const booking = createBooking(show, quote, snacks, values.email)
      addBooking(booking)
      setConfirmation(booking)
      setHoldUntil(null)
      setPaying(false)
      goTo(3)
    }, 500)
  }

  const summary = (
    <Card variant="borderless" className="cinema-card cinema-summary">
      <Typography.Title level={4}>{t.summary}</Typography.Title>
      {secondsLeft !== null && step > 0 && step < 3 && (
        <div
          className={`cinema-hold${secondsLeft <= 60 ? ' cinema-hold--urgent' : ''}`}
          role="timer"
          aria-live="off"
        >
          <ClockCircleOutlined aria-hidden="true" />
          <span>
            {t.hold} <strong>{formatCountdown(secondsLeft)}</strong>
          </span>
        </div>
      )}
      <dl className="cinema-summary__list">
        <div>
          <dt>{t.seats}</dt>
          <dd>{selected.length > 0 ? selected.join(', ') : t.noSeats}</dd>
        </div>
        {quote.lines.map((line) => (
          <div key={line.seatId} className="cinema-summary__line">
            <dt>
              {line.seatId} · {text.ticketType[line.ticket]}
            </dt>
            <dd>{money(line.price)}</dd>
          </div>
        ))}
        {concessions
          .filter((item) => (snacks[item.id] ?? 0) > 0)
          .map((item) => (
            <div key={item.id} className="cinema-summary__line">
              <dt>
                {snacks[item.id]} × {item.name[language]}
              </dt>
              <dd>{money(item.price * snacks[item.id]!)}</dd>
            </div>
          ))}
        {quote.fee > 0 && (
          <div className="cinema-summary__line">
            <dt>{t.fee}</dt>
            <dd>{money(quote.fee)}</dd>
          </div>
        )}
      </dl>
      <Divider />
      <Flex justify="space-between" align="baseline">
        <Typography.Text strong>{t.total}</Typography.Text>
        <Typography.Text strong className="cinema-summary__total">
          {money(quote.total)}
        </Typography.Text>
      </Flex>
    </Card>
  )

  const stepper = (name: string, id: string) => {
    const count = snacks[id] ?? 0
    const set = (value: number) =>
      setSnacks((current) => ({ ...current, [id]: Math.min(MAX_SNACKS, Math.max(0, value)) }))
    return (
      <Flex align="center" gap={8} className="cinema-stepper">
        <Button
          shape="circle"
          size="small"
          icon={<MinusOutlined />}
          aria-label={t.removeOne(name)}
          disabled={count === 0}
          onClick={() => set(count - 1)}
        />
        <span className="cinema-stepper__count" aria-label={t.quantity(name)}>
          {count}
        </span>
        <Button
          shape="circle"
          size="small"
          icon={<PlusOutlined />}
          aria-label={t.addOne(name)}
          disabled={count >= MAX_SNACKS}
          onClick={() => set(count + 1)}
        />
      </Flex>
    )
  }

  return (
    <CinemaSiteShell standalone={standalone} page="booking">
      <div className="showcase-section cinema-booking" ref={topRef}>
        <div className="cinema-booking__head">
          <CinemaPoster movie={movie} showTitle={false} className="cinema-booking__poster" />
          <div>
            <Link to={paths.movie(movie.id)} className="cinema-booking__film">
              <Typography.Title level={2}>{movie.title[language]}</Typography.Title>
            </Link>
            <Flex gap={6} wrap align="center">
              <Tag
                variant="solid"
                color={movie.rating === '18+' || movie.rating === '16+' ? 'red' : 'blue'}
              >
                {text.rating[movie.rating]}
              </Tag>
              <Tag variant="filled">{show.format}</Tag>
              <Tag variant="filled">{text.audio[show.audio]}</Tag>
              {hall.layout === 'lounge' && (
                <Tag variant="filled" color="gold">
                  Lounge
                </Tag>
              )}
            </Flex>
            <Typography.Text type="secondary" className="cinema-booking__when">
              {start.format('dddd, D MMMM')} · <strong>{show.time}</strong> · {cinema.name} ·{' '}
              {text.hall(hall.number)}
            </Typography.Text>
          </div>
        </div>

        <Steps
          current={step}
          size="small"
          responsive={false}
          className="cinema-steps"
          items={t.steps.map((title) => ({ title }))}
        />

        {step === 3 && confirmation ? (
          <div className="cinema-done">
            <Result
              status="success"
              title={t.doneTitle}
              subTitle={t.doneText(confirmation.email)}
              extra={[
                <Button key="tickets" type="primary" onClick={() => navigate(paths.tickets)}>
                  {t.myTickets}
                </Button>,
                <Button key="films" onClick={() => navigate(paths.root)}>
                  {t.moreFilms}
                </Button>,
              ]}
            />
            <CinemaETicket booking={confirmation} />
          </div>
        ) : expired ? (
          <Result
            status="warning"
            title={t.expiredTitle}
            subTitle={t.expiredText}
            extra={
              <Button type="primary" onClick={releaseSeats}>
                {t.pickAgain}
              </Button>
            }
          />
        ) : (
          <div className="cinema-booking__layout">
            <div className="cinema-booking__main">
              {step === 0 && (
                <>
                  <CinemaSeatMap
                    map={map}
                    taken={taken}
                    mine={mine}
                    selected={selected}
                    priceOf={(seat) => money(ticketPrice(show, seat.type))}
                    onToggle={toggle}
                  />
                  {gaps.length > 0 && (
                    <Alert type="warning" showIcon title={t.gapWarning(gaps.join(', '))} />
                  )}
                  <Flex justify="space-between" align="center" gap={12} wrap>
                    <Typography.Text strong>
                      {selected.length > 0 ? t.seatsSelected(selected.length) : t.noSeats}
                    </Typography.Text>
                    <Flex gap={8}>
                      {selected.length > 0 && (
                        <Button onClick={() => setSelected([])}>{t.clear}</Button>
                      )}
                      <Button type="primary" disabled={selected.length === 0} onClick={startHold}>
                        {t.continue}
                      </Button>
                    </Flex>
                  </Flex>
                </>
              )}

              {step === 1 && (
                <>
                  <Card variant="borderless" className="cinema-card">
                    <Typography.Title level={4}>{t.ticketsTitle}</Typography.Title>
                    <Typography.Paragraph type="secondary">
                      {t.ticketsLead}
                      {!childAllowed(movie.rating) &&
                        ` ${t.childNotAllowed(text.rating[movie.rating])}`}
                    </Typography.Paragraph>
                    <ul className="cinema-ticket-lines">
                      {quote.lines.map((line) => (
                        <li key={line.seatId}>
                          <span className="cinema-ticket-lines__seat">{line.seatId}</span>
                          <Typography.Text type="secondary" className="cinema-ticket-lines__type">
                            {text.seatType[line.seatType]}
                          </Typography.Text>
                          <Select<TicketType>
                            value={line.ticket}
                            aria-label={`${line.seatId} · ${text.booking.tickets}`}
                            onChange={(value) =>
                              setTickets((current) => ({ ...current, [line.seatId]: value }))
                            }
                            options={ticketTypes.map((type) => ({
                              value: type,
                              label: text.ticketType[type],
                              disabled: type === 'child' && !childAllowed(movie.rating),
                            }))}
                            className="cinema-ticket-lines__select"
                          />
                          <Typography.Text strong className="cinema-ticket-lines__price">
                            {money(line.price)}
                          </Typography.Text>
                        </li>
                      ))}
                    </ul>
                  </Card>

                  <Card variant="borderless" className="cinema-card">
                    <Typography.Title level={4}>{t.snacksTitle}</Typography.Title>
                    <Typography.Paragraph type="secondary">{t.snacksLead}</Typography.Paragraph>
                    <ul className="cinema-snacks">
                      {concessions.map((item) => (
                        <li key={item.id}>
                          <span className="cinema-snacks__icon" aria-hidden="true">
                            {item.icon}
                          </span>
                          <span className="cinema-snacks__text">
                            <Typography.Text strong>{item.name[language]}</Typography.Text>
                            <Typography.Text type="secondary">
                              {item.description[language]} · {money(item.price)}
                            </Typography.Text>
                          </span>
                          {stepper(item.name[language], item.id)}
                        </li>
                      ))}
                    </ul>
                  </Card>

                  <Flex justify="space-between" gap={12}>
                    <Button onClick={releaseSeats}>{t.back}</Button>
                    <Button type="primary" onClick={() => goTo(2)}>
                      {t.continue}
                    </Button>
                  </Flex>
                </>
              )}

              {step === 2 && (
                <Card variant="borderless" className="cinema-card">
                  <Typography.Title level={4}>{t.paymentTitle}</Typography.Title>
                  <Alert
                    type="info"
                    showIcon
                    icon={<LockOutlined />}
                    title={t.demoNotice}
                    className="cinema-demo-note"
                  />
                  <Form form={form} layout="vertical" requiredMark="optional" disabled={paying}>
                    <Row gutter={16}>
                      <Col xs={24} md={12}>
                        <Form.Item
                          name="email"
                          label={t.email}
                          rules={[{ required: true, type: 'email', message: t.required.email }]}
                        >
                          <Input autoComplete="email" inputMode="email" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={12}>
                        <Form.Item
                          name="phone"
                          label={t.phone}
                          rules={[{ required: true, min: 10, message: t.required.phone }]}
                        >
                          <Input autoComplete="tel" inputMode="tel" />
                        </Form.Item>
                      </Col>
                      <Col xs={24}>
                        <Form.Item
                          name="cardName"
                          label={t.cardName}
                          rules={[
                            { required: true, whitespace: true, message: t.required.cardName },
                          ]}
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
                            { required: true, message: t.required.cardNumber },
                            {
                              validator: (_, value?: string) =>
                                !value || luhnValid(value)
                                  ? Promise.resolve()
                                  : Promise.reject(new Error(t.required.cardNumber)),
                            },
                          ]}
                        >
                          <Input autoComplete="cc-number" inputMode="numeric" />
                        </Form.Item>
                      </Col>
                      <Col xs={12}>
                        <Form.Item
                          name="expiry"
                          label={t.expiry}
                          rules={[
                            { required: true, message: t.required.expiry },
                            {
                              validator: (_, value?: string) =>
                                !value || expiryValid(value)
                                  ? Promise.resolve()
                                  : Promise.reject(new Error(t.required.expiry)),
                            },
                          ]}
                        >
                          <Input autoComplete="cc-exp" placeholder="MM/YY" />
                        </Form.Item>
                      </Col>
                      <Col xs={12}>
                        <Form.Item
                          name="cvc"
                          label={t.cvc}
                          rules={[
                            { required: true, pattern: /^\d{3,4}$/, message: t.required.cvc },
                          ]}
                        >
                          <Input autoComplete="cc-csc" inputMode="numeric" maxLength={4} />
                        </Form.Item>
                      </Col>
                      <Col xs={24}>
                        <Form.Item
                          name="terms"
                          valuePropName="checked"
                          rules={[
                            {
                              validator: (_, value?: boolean) =>
                                value
                                  ? Promise.resolve()
                                  : Promise.reject(new Error(t.required.terms)),
                            },
                          ]}
                        >
                          <Checkbox>{t.terms}</Checkbox>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                  <Flex justify="space-between" gap={12}>
                    <Button onClick={() => goTo(1)} disabled={paying}>
                      {t.back}
                    </Button>
                    <Button type="primary" loading={paying} onClick={() => void pay()}>
                      {t.pay(money(quote.total))}
                    </Button>
                  </Flex>
                </Card>
              )}
            </div>
            <aside className="cinema-booking__side">{summary}</aside>
          </div>
        )}
      </div>
    </CinemaSiteShell>
  )
}
