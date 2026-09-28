import {
  AppstoreOutlined,
  CalendarOutlined,
  CoffeeOutlined,
  ColumnWidthOutlined,
  DesktopOutlined,
  EnvironmentOutlined,
  ExpandOutlined,
  FireOutlined,
  HomeOutlined,
  MutedOutlined,
  SunOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import { Divider, Flex, Typography } from 'antd'
import dayjs from 'dayjs'
import type { ReactNode } from 'react'
import type { HotelRoom, RoomAmenity } from '@/features/showcases/data/hotel'
import {
  formatMoney,
  freeCancellationUntil,
  guestsOf,
  nightsOf,
  quoteStay,
  type RatePlan,
  type StayExtra,
  type StaySearch,
} from '@/features/showcases/data/hotelBooking'
import { useHotelText } from '@/features/showcases/data/hotelCopy'

const amenityIcons: Record<RoomAmenity, ReactNode> = {
  balcony: <SunOutlined />,
  terrace: <HomeOutlined />,
  bathtub: <ExpandOutlined />,
  plungePool: <FireOutlined />,
  espresso: <CoffeeOutlined />,
  workspace: <DesktopOutlined />,
  kitchenette: <AppstoreOutlined />,
  soundproof: <MutedOutlined />,
}

/** Size, sleeps, bed and view on one line. */
export function RoomFacts({ room }: { room: HotelRoom }) {
  const { text } = useHotelText()
  return (
    <Flex gap={16} wrap className="hotel-room-facts">
      <span>
        <ColumnWidthOutlined aria-hidden="true" /> {text.size(room.size)}
      </span>
      <span>
        <TeamOutlined aria-hidden="true" /> {text.upToGuests(room.maxGuests)}
      </span>
      <span>{text.beds[room.bed]}</span>
      <span>
        <EnvironmentOutlined aria-hidden="true" /> {text.views[room.view]}
      </span>
    </Flex>
  )
}

export function AmenityList({ amenities }: { amenities: RoomAmenity[] }) {
  const { text } = useHotelText()
  return (
    <ul className="hotel-amenity-list">
      {amenities.map((amenity) => (
        <li key={amenity}>
          <span aria-hidden="true">{amenityIcons[amenity]}</span>
          {text.amenityNames[amenity]}
        </li>
      ))}
    </ul>
  )
}

interface StaySummaryProps {
  room: HotelRoom
  stay: StaySearch
  plan: RatePlan
  extras?: StayExtra[]
  /** The action under the total. */
  children?: ReactNode
}

/** The stay and every line of its price, so the total never comes as a surprise. */
export function StaySummary({ room, stay, plan, extras = [], children }: StaySummaryProps) {
  const { text, language } = useHotelText()
  const quote = quoteStay(room, stay, plan, extras)
  const nights = nightsOf(stay)
  const deadline = freeCancellationUntil(stay, plan)
  const money = (amount: number) => formatMoney(amount, language)

  return (
    <div className="hotel-summary">
      <Flex gap={12} align="center">
        <img src={room.images[0]!.url} alt="" className="hotel-summary__thumb" />
        <div>
          <Typography.Text strong>{room.name[language]}</Typography.Text>
          <Typography.Text type="secondary" className="hotel-summary__block">
            {text.plans[plan].title}
          </Typography.Text>
        </div>
      </Flex>

      <dl className="hotel-summary__stay">
        <div>
          <dt>{text.search.checkIn}</dt>
          <dd>{dayjs(stay.checkIn).format('ddd, D MMM YYYY')}</dd>
        </div>
        <div>
          <dt>{text.search.checkOut}</dt>
          <dd>{dayjs(stay.checkOut).format('ddd, D MMM YYYY')}</dd>
        </div>
      </dl>
      <Typography.Text type="secondary">
        <CalendarOutlined aria-hidden="true" /> {text.nights(nights)} ·{' '}
        {text.guests(guestsOf(stay))} · {text.roomsCount(stay.rooms)}
      </Typography.Text>

      <Divider className="hotel-summary__divider" />

      <dl className="hotel-summary__lines">
        <div>
          <dt>{text.quote.rooms(nights, stay.rooms)}</dt>
          <dd>{money(quote.roomTotal)}</dd>
        </div>
        {quote.discount > 0 && (
          <div className="hotel-summary__discount">
            <dt>{text.quote.discount}</dt>
            <dd>−{money(quote.discount)}</dd>
          </div>
        )}
        {quote.extras.map((item) => (
          <div key={item.extra}>
            <dt>{text.extras[item.extra].title}</dt>
            <dd>{money(item.amount)}</dd>
          </div>
        ))}
        <div>
          <dt>{text.quote.vat}</dt>
          <dd>{money(quote.vat)}</dd>
        </div>
        <div>
          <dt>{text.quote.cityTax}</dt>
          <dd>{money(quote.cityTax)}</dd>
        </div>
        <div className="hotel-summary__total">
          <dt>{text.quote.total}</dt>
          <dd data-testid="hotel-total">{money(quote.total)}</dd>
        </div>
      </dl>

      <Typography.Text
        type={deadline ? 'success' : 'secondary'}
        className="hotel-summary__cancellation"
      >
        {deadline ? text.freeCancellation(deadline.format('D MMMM YYYY')) : text.noCancellation}
      </Typography.Text>

      {children}
    </div>
  )
}
