import { ArrowLeftOutlined, CheckCircleOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { Alert, Button, Card, Collapse, Image, Radio, Result, Tag, Typography } from 'antd'
import dayjs from 'dayjs'
import { useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router'
import { HotelSearchBar } from '@/features/showcases/components/HotelSearchBar'
import { HotelSiteShell } from '@/features/showcases/components/HotelSiteShell'
import { AmenityList, RoomFacts, StaySummary } from '@/features/showcases/components/HotelRoomParts'
import { findRoom, hotelImages, hotelRoot, hotelRoomsRoot } from '@/features/showcases/data/hotel'
import {
  availabilityFor,
  formatMoney,
  freeCancellationUntil,
  isWeekendNight,
  quoteStay,
  RATE_PLANS,
  readStay,
  stayParams,
  type RatePlan,
  type StaySearch,
} from '@/features/showcases/data/hotelBooking'
import { useHotelText } from '@/features/showcases/data/hotelCopy'

interface HotelRoomPageProps {
  standalone?: boolean
}

export function HotelRoomPage({ standalone = false }: HotelRoomPageProps) {
  const { text, language } = useHotelText()
  const navigate = useNavigate()
  const { roomId } = useParams()
  const [params] = useSearchParams()
  const { stay, issue } = readStay(params)
  const [plan, setPlan] = useState<RatePlan>(
    params.get('plan') === 'nonRefundable' ? 'nonRefundable' : 'flexible',
  )
  const room = findRoom(roomId)
  const roomsPath = hotelRoomsRoot(standalone)
  const frame = {
    standalone,
    title: { en: 'Hotel room', tr: 'Otel odası' },
    description: {
      en: 'One room: gallery, amenities, rate plans and a price that adds up night by night.',
      tr: 'Tek oda: galeri, olanaklar, fiyat seçenekleri ve gece gece hesaplanan fiyat.',
    },
  }

  if (!room) {
    return (
      <HotelSiteShell {...frame}>
        <Result
          status="404"
          title={text.room.notFoundTitle}
          subTitle={text.room.notFoundText}
          extra={
            <Button type="primary" onClick={() => navigate(`${roomsPath}?${stayParams(stay)}`)}>
              {text.room.back}
            </Button>
          }
        />
      </HotelSiteShell>
    )
  }

  const availability = availabilityFor(room, stay)
  const quote = quoteStay(room, stay, plan)
  const changeStay = (next: StaySearch) =>
    navigate(`${roomsPath}/${room.id}?${stayParams(next, { plan })}`)
  const book = () =>
    navigate(`${hotelRoot(standalone)}/book?${stayParams(stay, { room: room.id, plan })}`)
  const photos = [...room.images, ...hotelImages.gallery.slice(0, 3)]

  return (
    <HotelSiteShell {...frame}>
      <div className="showcase-section hotel-room">
        <Link to={`${roomsPath}?${stayParams(stay)}`} className="hotel-link hotel-back">
          <ArrowLeftOutlined aria-hidden="true" /> {text.room.back}
        </Link>

        <div className="hotel-room__gallery">
          <Image.PreviewGroup>
            {photos.map((image, index) => (
              <Image
                key={image.url}
                src={index === 0 ? image.url : image.url.replace('w=1200', 'w=600')}
                preview={{ src: image.url }}
                alt={image.alt[language]}
                rootClassName={index === 0 ? 'hotel-room__cover' : undefined}
              />
            ))}
          </Image.PreviewGroup>
        </div>

        <div className="hotel-room__layout">
          <div className="hotel-room__main">
            <Typography.Title>{room.name[language]}</Typography.Title>
            <RoomFacts room={room} />
            {issue && (
              <Alert
                type="info"
                showIcon
                icon={<InfoCircleOutlined />}
                title={text.rooms.issue[issue]}
                className="hotel-issue"
              />
            )}

            <section>
              <Typography.Title level={3}>{text.room.overview}</Typography.Title>
              <Typography.Paragraph className="hotel-room__description">
                {room.description[language]}
              </Typography.Paragraph>
            </section>

            <section>
              <Typography.Title level={3}>{text.room.amenities}</Typography.Title>
              <AmenityList amenities={room.amenities} />
            </section>

            <section>
              <Typography.Title level={3}>{text.room.ratePlans}</Typography.Title>
              <Radio.Group
                value={plan}
                onChange={(event) => setPlan(event.target.value as RatePlan)}
                className="hotel-plans"
              >
                {RATE_PLANS.map((option) => {
                  const optionQuote = quoteStay(room, stay, option)
                  const deadline = freeCancellationUntil(stay, option)
                  return (
                    <Radio key={option} value={option} className="hotel-plan">
                      <span className="hotel-plan__head">
                        <strong>{text.plans[option].title}</strong>
                        <strong>{formatMoney(optionQuote.total, language)}</strong>
                      </span>
                      <span className="hotel-plan__text">{text.plans[option].text}</span>
                      {deadline && (
                        <span className="hotel-plan__deadline">
                          <CheckCircleOutlined aria-hidden="true" />{' '}
                          {text.freeCancellation(deadline.format('D MMMM'))}
                        </span>
                      )}
                    </Radio>
                  )
                })}
              </Radio.Group>
            </section>

            <section>
              <Collapse
                items={[
                  {
                    key: 'nights',
                    label: text.room.nightByNight,
                    children: (
                      <ul className="hotel-nights">
                        {quote.nights.map((night) => (
                          <li key={night.date}>
                            <span>
                              {dayjs(night.date).format('ddd, D MMM')}
                              {isWeekendNight(dayjs(night.date)) && (
                                <Tag variant="filled" color="gold">
                                  {text.room.weekend}
                                </Tag>
                              )}
                            </span>
                            <span>{formatMoney(night.rate, language)}</span>
                          </li>
                        ))}
                      </ul>
                    ),
                  },
                ]}
              />
            </section>

            <section>
              <Typography.Title level={3}>{text.room.policies}</Typography.Title>
              <ul className="hotel-policies">
                {text.room.policyItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="hotel-room__aside" aria-label={text.room.yourStay}>
            <Card variant="borderless" className="hotel-card">
              <Typography.Title level={4}>{text.room.yourStay}</Typography.Title>
              <HotelSearchBar
                key={stayParams(stay)}
                value={stay}
                onSearch={changeStay}
                layout="stacked"
                submitLabel={text.room.changeDates}
              />
              <StaySummary room={room} stay={stay} plan={plan}>
                {availability.available ? (
                  <Button type="primary" size="large" block onClick={book}>
                    {text.room.book}
                  </Button>
                ) : (
                  <Alert
                    type="warning"
                    showIcon
                    title={
                      availability.reason === 'capacity'
                        ? text.rooms.tooSmall(room.maxGuests)
                        : text.room.unavailable
                    }
                    description={
                      availability.reason === 'capacity'
                        ? text.rooms.tooSmallHint
                        : text.rooms.soldOutNights(availability.soldOutNights.length)
                    }
                  />
                )}
              </StaySummary>
            </Card>
          </aside>
        </div>
      </div>
    </HotelSiteShell>
  )
}
