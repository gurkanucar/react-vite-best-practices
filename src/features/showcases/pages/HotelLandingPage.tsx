import {
  CompassOutlined,
  ArrowRightOutlined,
  CarOutlined,
  CoffeeOutlined,
  EnvironmentOutlined,
  HeartOutlined,
  StarFilled,
  SunOutlined,
  WifiOutlined,
} from '@ant-design/icons'
import { Button, Card, Col, Flex, Image, Progress, Row, Tag, Typography } from 'antd'
import { Link, useNavigate } from 'react-router'
import { HotelSearchBar } from '@/features/showcases/components/HotelSearchBar'
import { HotelSiteShell } from '@/features/showcases/components/HotelSiteShell'
import { RoomFacts } from '@/features/showcases/components/HotelRoomParts'
import {
  hotelImages,
  hotelReviews,
  hotelRoomsRoot,
  hotelRooms,
} from '@/features/showcases/data/hotel'
import {
  defaultStay,
  formatMoney,
  quoteStay,
  stayParams,
  type StaySearch,
} from '@/features/showcases/data/hotelBooking'
import { useHotelText } from '@/features/showcases/data/hotelCopy'

interface HotelLandingPageProps {
  standalone?: boolean
}

const amenityIcons = [
  <SunOutlined key="pool" />,
  <CoffeeOutlined key="terrace" />,
  <HeartOutlined key="spa" />,
  <CompassOutlined key="jetty" />,
  <WifiOutlined key="wifi" />,
  <CarOutlined key="car" />,
]

export function HotelLandingPage({ standalone = false }: HotelLandingPageProps) {
  const { text, language } = useHotelText()
  const navigate = useNavigate()
  const rooms = hotelRoomsRoot(standalone)
  const stay = defaultStay()
  const search = (next: StaySearch) => navigate(`${rooms}?${stayParams(next)}`)
  const featured = hotelRooms.filter((room) =>
    ['sea-view-king', 'family-suite', 'cliff-villa'].includes(room.id),
  )

  return (
    <HotelSiteShell
      standalone={standalone}
      title={{ en: 'Hotel booking', tr: 'Otel rezervasyonu' }}
      description={{
        en: 'A boutique hotel site: date and guest search, room results, rate plans and a four-step booking.',
        tr: 'Butik otel sitesi: tarih ve misafir araması, oda sonuçları, fiyat seçenekleri ve dört adımlı rezervasyon.',
      }}
    >
      <section className="hotel-hero">
        <img
          src={hotelImages.hero.url}
          alt={hotelImages.hero.alt[language]}
          className="hotel-hero__image"
        />
        <div className="hotel-hero__inner">
          <Tag variant="filled" className="hotel-hero__eyebrow" icon={<EnvironmentOutlined />}>
            {text.landing.eyebrow}
          </Tag>
          <Typography.Title>{text.landing.title}</Typography.Title>
          <Typography.Paragraph className="hotel-hero__lead">
            {text.landing.lead}
          </Typography.Paragraph>
        </div>
      </section>

      <div className="hotel-search-dock">
        <HotelSearchBar value={stay} onSearch={search} />
      </div>

      <section className="showcase-section hotel-stats" aria-label={text.landing.reviewsTitle}>
        {text.landing.stats.map((stat) => (
          <div key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </section>

      <section className="showcase-section" id="hotel-rooms">
        <Flex justify="space-between" align="end" gap={16} wrap className="hotel-section-heading">
          <div className="showcase-section__heading">
            <Typography.Title level={2}>{text.landing.roomsTitle}</Typography.Title>
            <Typography.Paragraph type="secondary">{text.landing.roomsLead}</Typography.Paragraph>
          </div>
          <Link to={`${rooms}?${stayParams(stay)}`} className="hotel-link">
            {text.landing.allRooms} <ArrowRightOutlined aria-hidden="true" />
          </Link>
        </Flex>
        <Row gutter={[24, 24]}>
          {featured.map((room) => {
            const quote = quoteStay(room, stay)
            return (
              <Col xs={24} md={8} key={room.id}>
                <Card
                  className="hotel-room-teaser"
                  variant="borderless"
                  cover={
                    <img
                      src={room.images[0]!.url.replace('w=1200', 'w=800')}
                      alt={room.images[0]!.alt[language]}
                      loading="lazy"
                    />
                  }
                >
                  <Typography.Title level={4}>{room.name[language]}</Typography.Title>
                  <Typography.Paragraph type="secondary">
                    {room.summary[language]}
                  </Typography.Paragraph>
                  <RoomFacts room={room} />
                  <Flex
                    justify="space-between"
                    align="center"
                    gap={12}
                    className="hotel-room-teaser__foot"
                  >
                    <span>
                      <Typography.Text type="secondary">{text.from} </Typography.Text>
                      <Typography.Text strong className="hotel-price">
                        {formatMoney(quote.averageNightly, language)}
                      </Typography.Text>
                      <Typography.Text type="secondary"> {text.perNight}</Typography.Text>
                    </span>
                    <Link to={`${rooms}/${room.id}?${stayParams(stay)}`}>
                      {text.landing.viewRoom}
                    </Link>
                  </Flex>
                </Card>
              </Col>
            )
          })}
        </Row>
      </section>

      <section className="hotel-band" id="hotel-dining">
        <div className="showcase-section">
          <div className="showcase-section__heading">
            <Typography.Title level={2}>{text.landing.amenitiesTitle}</Typography.Title>
          </div>
          <Row gutter={[24, 24]}>
            {text.landing.amenities.map((amenity, index) => (
              <Col xs={24} sm={12} lg={8} key={amenity.title}>
                <div className="hotel-amenity">
                  <span className="hotel-amenity__icon" aria-hidden="true">
                    {amenityIcons[index]}
                  </span>
                  <div>
                    <Typography.Title level={5}>{amenity.title}</Typography.Title>
                    <Typography.Text type="secondary">{amenity.text}</Typography.Text>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      <section className="showcase-section">
        <div className="showcase-section__heading">
          <Typography.Title level={2}>{text.landing.galleryTitle}</Typography.Title>
          <Typography.Paragraph type="secondary">{text.landing.galleryHint}</Typography.Paragraph>
        </div>
        <div className="hotel-gallery">
          <Image.PreviewGroup>
            {hotelImages.gallery.slice(0, 5).map((image) => (
              <Image
                key={image.url}
                src={image.url.replace('w=1200', 'w=700')}
                preview={{ src: image.url }}
                alt={image.alt[language]}
                loading="lazy"
              />
            ))}
          </Image.PreviewGroup>
        </div>
      </section>

      <section className="showcase-section hotel-reviews">
        <Row gutter={[48, 32]}>
          <Col xs={24} lg={9}>
            <Typography.Title level={2}>{text.landing.reviewsTitle}</Typography.Title>
            <Flex align="center" gap={16} className="hotel-score">
              <span className="hotel-score__badge">
                {hotelReviews.score.toLocaleString(language === 'tr' ? 'tr-TR' : 'en-GB')}
              </span>
              <div>
                <Typography.Text strong>{text.landing.reviewScore}</Typography.Text>
                <Typography.Text type="secondary" className="hotel-summary__block">
                  {text.landing.reviewsFrom(hotelReviews.count)}
                </Typography.Text>
              </div>
            </Flex>
            {hotelReviews.categories.map((category) => (
              <div key={category.key} className="hotel-score__row">
                <Flex justify="space-between">
                  <Typography.Text>{text.landing.reviewCategories[category.key]}</Typography.Text>
                  <Typography.Text strong>
                    {category.score.toLocaleString(language === 'tr' ? 'tr-TR' : 'en-GB')}
                  </Typography.Text>
                </Flex>
                <Progress
                  percent={category.score * 10}
                  showInfo={false}
                  size="small"
                  strokeColor="#1f5f7a"
                />
              </div>
            ))}
          </Col>
          <Col xs={24} lg={15}>
            <div className="hotel-quotes">
              {hotelReviews.quotes.map((quote) => (
                <figure key={quote.name} className="hotel-quote">
                  <span className="hotel-quote__stars" aria-hidden="true">
                    {Array.from({ length: 5 }, (_, index) => (
                      <StarFilled key={index} />
                    ))}
                  </span>
                  <blockquote>{quote.text[language]}</blockquote>
                  <figcaption>
                    <strong>{quote.name}</strong> · {quote.origin[language]}
                  </figcaption>
                </figure>
              ))}
            </div>
          </Col>
        </Row>
      </section>

      <section className="showcase-section hotel-location" id="hotel-location">
        <Row gutter={[48, 32]} align="middle">
          <Col xs={24} lg={11}>
            <Typography.Title level={2}>{text.landing.locationTitle}</Typography.Title>
            <Typography.Paragraph type="secondary">
              {text.landing.locationLead}
            </Typography.Paragraph>
            <dl className="hotel-distances">
              {text.landing.distances.map((item) => (
                <div key={item.place}>
                  <dt>{item.place}</dt>
                  <dd>{item.distance}</dd>
                </div>
              ))}
            </dl>
            <Typography.Paragraph>
              <EnvironmentOutlined aria-hidden="true" /> {text.address}
            </Typography.Paragraph>
            <Button
              href="https://www.openstreetmap.org/?mlat=37.1236&mlon=27.3561#map=13/37.1236/27.3561"
              target="_blank"
              rel="noreferrer"
              icon={<EnvironmentOutlined aria-hidden="true" />}
            >
              {text.landing.directions}
            </Button>
          </Col>
          <Col xs={24} lg={13}>
            <HotelMap />
          </Col>
        </Row>
      </section>

      <section className="showcase-section">
        <div className="hotel-cta">
          <div>
            <Typography.Title level={2}>{text.landing.ctaTitle}</Typography.Title>
            <Typography.Paragraph>{text.landing.ctaText}</Typography.Paragraph>
          </div>
          <Button
            size="large"
            onClick={() => navigate(`${rooms}?${stayParams(stay)}`)}
            icon={<ArrowRightOutlined aria-hidden="true" />}
            iconPlacement="end"
          >
            {text.landing.ctaButton}
          </Button>
        </div>
      </section>
    </HotelSiteShell>
  )
}

/** A drawn map: the bay, the headland and where the hotel sits on it. The address is beside it. */
function HotelMap() {
  return (
    <svg className="hotel-map" viewBox="0 0 480 320" aria-hidden="true">
      <rect width="480" height="320" rx="24" className="hotel-map__sea" />
      <path
        d="M0 190 C60 170 90 120 150 128 C200 134 210 190 262 196 C320 204 330 150 390 140 C430 134 460 150 480 160 L480 320 L0 320 Z"
        className="hotel-map__land"
      />
      <path d="M262 196 C250 230 240 260 250 320" className="hotel-map__road" fill="none" />
      <path d="M40 250 L170 262 L262 250" className="hotel-map__road" fill="none" />
      <circle cx="214" cy="178" r="26" className="hotel-map__halo" />
      <circle cx="214" cy="178" r="9" className="hotel-map__pin" />
      <text x="214" y="142" textAnchor="middle" className="hotel-map__label">
        Kaia Bay
      </text>
      <text x="96" y="84" className="hotel-map__water">
        Kızılağaç Koyu
      </text>
      <text x="300" y="290" className="hotel-map__town">
        Gündoğan
      </text>
    </svg>
  )
}
