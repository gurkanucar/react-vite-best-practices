import {
  AppstoreOutlined,
  CheckCircleFilled,
  CloseCircleOutlined,
  EnvironmentOutlined,
  HeartFilled,
  HeartOutlined,
  MedicineBoxOutlined,
  PhoneOutlined,
  ReadOutlined,
  ShareAltOutlined,
  ShopOutlined,
  StarFilled,
  SwapOutlined,
} from '@ant-design/icons'
import {
  App,
  Avatar,
  Breadcrumb,
  Button,
  Checkbox,
  Descriptions,
  Flex,
  Form,
  Image,
  Input,
  Result,
  Tag,
  Typography,
} from 'antd'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { EstateListingCard } from '@/features/showcases/components/EstateListingCard'
import { EstateLocationMap } from '@/features/showcases/components/EstateMap'
import { EstateMortgageCalculator } from '@/features/showcases/components/EstateMortgage'
import { EstateSiteShell } from '@/features/showcases/components/EstateSiteShell'
import {
  agentOf,
  cityNames,
  estateListingsPath,
  estatePhotoUrl,
  estateRoot,
  FEATURES,
  findListing,
  formatDistance,
  formatNumber,
  formatPrice,
  hoodOf,
  isNew,
  listings,
  placeLabel,
  pricePerM2,
  recentDrop,
  roomsLabel,
  type Listing,
} from '@/features/showcases/data/estate'
import { moveInCost } from '@/features/showcases/data/estateMortgage'
import { similarListings } from '@/features/showcases/data/estateSearch'
import { useEstateActions } from '@/features/showcases/hooks/useEstateActions'
import { useEstateText } from '@/features/showcases/hooks/useEstateText'

interface EstateListingPageProps {
  standalone?: boolean
}

const dayMs = 24 * 60 * 60 * 1000

function Gallery({ listing }: { listing: Listing }) {
  const { text, titleOf } = useEstateText()
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState(0)
  const title = titleOf(listing)
  const show = (index: number) => {
    setCurrent(index)
    setOpen(true)
  }

  return (
    <div className="estate-gallery">
      {listing.photos.slice(0, 5).map((photo, index) => (
        <button
          type="button"
          key={`${photo.id}-${index}`}
          className={`estate-gallery__item${index === 0 ? ' estate-gallery__item--lead' : ''}`}
          onClick={() => show(index)}
          aria-label={`${text.photoKinds[photo.kind]}: ${title}`}
        >
          <img
            src={estatePhotoUrl(photo.id, index === 0 ? 1400 : 700)}
            alt=""
            loading={index === 0 ? 'eager' : 'lazy'}
          />
          <span className="estate-gallery__caption">{text.photoKinds[photo.kind]}</span>
        </button>
      ))}
      <Button
        className="estate-gallery__all"
        icon={<AppstoreOutlined aria-hidden="true" />}
        onClick={() => show(0)}
      >
        {text.listing.allPhotos(listing.photos.length)}
      </Button>
      <Image.PreviewGroup
        items={listing.photos.map((photo) => ({
          src: estatePhotoUrl(photo.id, 1800),
          alt: `${text.photoKinds[photo.kind]}: ${title}`,
        }))}
        preview={{
          open,
          current,
          onOpenChange: (next) => setOpen(next),
          onChange: (next) => setCurrent(next),
        }}
      />
    </div>
  )
}

function PriceHistory({ listing }: { listing: Listing }) {
  const { text, language } = useEstateText()
  const [now] = useState(() => Date.now())
  const date = (daysAgo: number) =>
    new Intl.DateTimeFormat(language === 'tr' ? 'tr-TR' : 'en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(now - daysAgo * dayMs))
  const points = listing.priceHistory
  const prices = points.map((point) => point.price)
  const [low, high] = [Math.min(...prices), Math.max(...prices)]
  const span = Math.max(high - low, 1)
  const path = points
    .map((point, index) => {
      const x = points.length === 1 ? 50 : (index / (points.length - 1)) * 100
      const y = 36 - ((point.price - low) / span) * 28
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')

  return (
    <div className="estate-history">
      {points.length > 1 && (
        <svg
          viewBox="0 0 100 40"
          preserveAspectRatio="none"
          className="estate-history__chart"
          aria-hidden="true"
        >
          <polyline points={path} fill="none" vectorEffect="non-scaling-stroke" />
        </svg>
      )}
      <ol className="estate-history__list">
        {[...points].reverse().map((point, index, newestFirst) => {
          const older = newestFirst[index + 1]
          const change = older ? ((point.price - older.price) / older.price) * 100 : 0
          const label =
            index === newestFirst.length - 1
              ? text.listing.historyListed
              : index === 0
                ? text.listing.historyNow
                : text.listing.historyChange
          return (
            <li key={point.daysAgo}>
              <span className="estate-history__when">
                <Typography.Text strong>{label}</Typography.Text>
                <Typography.Text type="secondary">{date(point.daysAgo)}</Typography.Text>
              </span>
              <span className="estate-history__price">
                {formatPrice(point.price, language)}
                {older && (
                  <Tag variant="filled" color={change < 0 ? 'green' : 'orange'}>
                    {change > 0 ? '+' : '−'}
                    {Math.abs(change).toFixed(1)}%
                  </Tag>
                )}
              </span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

interface ContactValues {
  name: string
  phone: string
  email?: string
  message: string
  viewing?: boolean
  consent?: boolean
}

function ContactAgent({ listing }: { listing: Listing }) {
  const { text, titleOf } = useEstateText()
  const agent = agentOf(listing)
  const [sent, setSent] = useState(false)
  const [form] = Form.useForm<ContactValues>()
  const initials = agent.name
    .split(' ')
    .map((part) => part[0])
    .join('')

  return (
    <div className="estate-agent">
      <Flex gap={12} align="center" className="estate-agent__head">
        <Avatar size={52} className="estate-avatar">
          {initials}
        </Avatar>
        <div>
          <Typography.Text strong>{agent.name}</Typography.Text>
          <br />
          <Typography.Text type="secondary">
            <StarFilled className="estate-star" aria-hidden="true" /> {agent.rating} ·{' '}
            {agent.languages.join(' · ')}
          </Typography.Text>
        </div>
      </Flex>
      <Button
        block
        icon={<PhoneOutlined aria-hidden="true" />}
        href={`tel:${agent.phone.replace(/\s/g, '')}`}
      >
        {text.contact.call} {agent.phone}
      </Button>

      {sent ? (
        <Result
          status="success"
          className="estate-agent__sent"
          title={text.contact.sentTitle}
          subTitle={text.contact.sentBody(agent.name)}
          extra={
            <Button
              onClick={() => {
                form.resetFields()
                setSent(false)
              }}
            >
              {text.contact.sendAnother}
            </Button>
          }
        />
      ) : (
        <Form<ContactValues>
          form={form}
          layout="vertical"
          requiredMark={false}
          className="estate-agent__form"
          initialValues={{
            message: text.contact.messageDefault(titleOf(listing), listing.id),
            viewing: true,
          }}
          onFinish={() => setSent(true)}
        >
          <Typography.Text strong className="estate-agent__title">
            {text.contact.title}
          </Typography.Text>
          <Form.Item
            label={text.contact.name}
            name="name"
            rules={[{ required: true, whitespace: true, message: text.contact.nameRequired }]}
          >
            <Input autoComplete="name" />
          </Form.Item>
          <Form.Item
            label={text.contact.phone}
            name="phone"
            rules={[
              { required: true, message: text.contact.phoneRequired },
              { pattern: /^\+?[\d\s()-]{10,18}$/, message: text.contact.phoneInvalid },
            ]}
          >
            <Input autoComplete="tel" inputMode="tel" />
          </Form.Item>
          <Form.Item
            label={text.contact.email}
            name="email"
            rules={[{ type: 'email', message: text.contact.emailInvalid }]}
          >
            <Input autoComplete="email" inputMode="email" />
          </Form.Item>
          <Form.Item label={text.contact.message} name="message">
            <Input.TextArea autoSize={{ minRows: 3, maxRows: 6 }} />
          </Form.Item>
          <Form.Item name="viewing" valuePropName="checked" className="estate-agent__check">
            <Checkbox>{text.contact.viewing}</Checkbox>
          </Form.Item>
          <Form.Item
            name="consent"
            valuePropName="checked"
            className="estate-agent__check"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(new Error(text.contact.consentRequired)),
              },
            ]}
          >
            <Checkbox>{text.contact.consent}</Checkbox>
          </Form.Item>
          <Button type="primary" htmlType="submit" block size="large">
            {text.contact.send}
          </Button>
          <Typography.Text type="secondary" className="estate-agent__demo">
            {text.contact.demo}
          </Typography.Text>
        </Form>
      )}
    </div>
  )
}

function MoveInCost({ rent }: { rent: number }) {
  const { text, language } = useEstateText()
  const cost = moveInCost(rent)
  const rows = [
    [text.listing.moveIn.firstRent, cost.firstRent],
    [text.listing.moveIn.deposit, cost.deposit],
    [text.listing.moveIn.agencyFee, cost.agencyFee],
  ] as const
  return (
    <dl className="estate-move-in">
      {rows.map(([label, amount]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{formatPrice(amount, language)}</dd>
        </div>
      ))}
      <div className="estate-move-in__total">
        <dt>{text.listing.moveIn.total}</dt>
        <dd>{formatPrice(cost.total, language)}</dd>
      </div>
    </dl>
  )
}

export function EstateListingPage({ standalone = false }: EstateListingPageProps) {
  const { listingId } = useParams()
  const { text, language, titleOf } = useEstateText()
  const { message } = App.useApp()
  const navigate = useNavigate()
  const actions = useEstateActions()
  const listing = findListing(listingId)
  const searchPath = estateListingsPath(standalone)

  if (!listing) {
    return (
      <EstateSiteShell standalone={standalone} page="listing">
        <Result
          status="404"
          className="estate-not-found"
          title={text.listing.notFound}
          subTitle={text.listing.notFoundLead}
          extra={
            <Button type="primary" onClick={() => void navigate(searchPath)}>
              {text.listing.backToSearch}
            </Button>
          }
        />
      </EstateSiteShell>
    )
  }

  const hood = hoodOf(listing)
  const title = titleOf(listing)
  const drop = recentDrop(listing)
  const saved = actions.isSaved(listing)
  const compared = actions.isCompared(listing)
  const money = (amount: number) => formatPrice(amount, language)
  const features = listing.features.map((feature) => text.features[feature])
  const similar = similarListings(listing, listings)

  const share = async () => {
    const url = window.location.href
    try {
      if (navigator.share) await navigator.share({ title, url })
      else {
        await navigator.clipboard.writeText(url)
        void message.success(text.listing.linkCopied)
      }
    } catch (error) {
      // Closing the share sheet is not a failure worth a message.
      if ((error as Error).name !== 'AbortError') void message.warning(text.listing.copyFailed)
    }
  }

  const facts = [
    {
      key: 'rooms',
      label: text.listing.rooms,
      children: `${roomsLabel(listing)} · ${text.rooms(listing)}`,
    },
    {
      key: 'gross',
      label: text.listing.gross,
      children: `${formatNumber(listing.grossArea, language)} m²`,
    },
    {
      key: 'net',
      label: text.listing.net,
      children: `${formatNumber(listing.netArea, language)} m²`,
    },
    { key: 'floor', label: text.listing.floor, children: text.floor(listing) },
    { key: 'age', label: text.listing.age, children: text.age(listing.buildingAge) },
    { key: 'heating', label: text.listing.heating, children: text.heating[listing.heating] },
    {
      key: 'furnished',
      label: text.listing.furnished,
      children: listing.furnished ? text.listing.yes : text.listing.no,
    },
    {
      key: 'dues',
      label: text.listing.dues,
      children: listing.dues ? money(listing.dues) : text.listing.noDues,
    },
    listing.deal === 'sale'
      ? {
          key: 'credit',
          label: text.listing.credit,
          children: listing.creditEligible ? text.listing.creditYes : text.listing.creditNo,
        }
      : { key: 'deposit', label: text.listing.deposit, children: money(listing.price * 2) },
    { key: 'listed', label: text.listing.listed, children: text.daysAgo(listing.listedDaysAgo) },
    { key: 'no', label: text.listing.listingNo, children: listing.id },
  ]

  return (
    <EstateSiteShell standalone={standalone} page="listing">
      <article className="estate-detail">
        <Breadcrumb
          className="estate-detail__crumbs"
          items={[
            { title: <Link to={estateRoot(standalone)}>{text.listing.breadcrumbHome}</Link> },
            {
              title: (
                <Link to={`${searchPath}?city=${listing.city}`}>{cityNames[listing.city]}</Link>
              ),
            },
            {
              title: (
                <Link
                  to={`${searchPath}?city=${listing.city}&hood=${hood.id}${listing.deal === 'rent' ? '&deal=rent' : ''}`}
                >
                  {hood.name}
                </Link>
              ),
            },
            { title: listing.id },
          ]}
        />

        <header className="estate-detail__head">
          <div className="estate-detail__heading">
            <Flex gap={6} wrap>
              <Tag variant="filled" className={`estate-deal estate-deal--${listing.deal}`}>
                {text.dealTag[listing.deal]}
              </Tag>
              <Tag variant="filled">{text.types[listing.type]}</Tag>
              {isNew(listing) && (
                <Tag variant="filled" color="green">
                  {text.card.new}
                </Tag>
              )}
              {drop !== undefined && (
                <Tag variant="filled" color="red">
                  {text.card.drop(drop)}
                </Tag>
              )}
            </Flex>
            <Typography.Title level={1}>{title}</Typography.Title>
            <Typography.Text type="secondary">
              <EnvironmentOutlined aria-hidden="true" /> {placeLabel(hood)},{' '}
              {cityNames[listing.city]} · {text.listedAgo(listing.listedDaysAgo)}
            </Typography.Text>
            {/* On a phone the price card is far below; the price belongs up here too. */}
            <div className="estate-detail__mobile-price">
              <strong>{money(listing.price)}</strong>
              <Typography.Text type="secondary">
                {listing.deal === 'rent' ? text.perMonth : text.perM2(money(pricePerM2(listing)))}
              </Typography.Text>
            </div>
          </div>
          <Flex gap={8} wrap className="estate-detail__actions">
            <Button
              aria-pressed={saved}
              className={saved ? 'is-set' : undefined}
              icon={
                saved ? <HeartFilled aria-hidden="true" /> : <HeartOutlined aria-hidden="true" />
              }
              onClick={() => actions.toggleFavourite(listing)}
            >
              {saved ? text.card.unsave : text.card.save}
            </Button>
            <Button
              aria-pressed={compared}
              className={compared ? 'is-set' : undefined}
              icon={<SwapOutlined aria-hidden="true" />}
              onClick={() => actions.toggleCompare(listing)}
            >
              {text.card.compare}
            </Button>
            <Button icon={<ShareAltOutlined aria-hidden="true" />} onClick={() => void share()}>
              {text.listing.share}
            </Button>
          </Flex>
        </header>

        <Gallery listing={listing} />

        <div className="estate-detail__layout">
          <div className="estate-detail__main">
            <section className="estate-detail__section" aria-labelledby="estate-facts">
              <Typography.Title level={2} id="estate-facts">
                {text.listing.facts}
              </Typography.Title>
              <Descriptions
                bordered
                size="small"
                column={{ xs: 1, sm: 2, lg: 2, xl: 3 }}
                items={facts}
                className="estate-facts"
              />
            </section>

            <section className="estate-detail__section" aria-labelledby="estate-about">
              <Typography.Title level={2} id="estate-about">
                {text.listing.about}
              </Typography.Title>
              {text.description(listing, hood, features).map((line) => (
                <Typography.Paragraph key={line}>{line}</Typography.Paragraph>
              ))}
            </section>

            <section className="estate-detail__section" aria-labelledby="estate-features">
              <Typography.Title level={2} id="estate-features">
                {text.listing.featuresTitle}
              </Typography.Title>
              <ul className="estate-features">
                {FEATURES.map((feature) => {
                  const has = listing.features.includes(feature)
                  return (
                    <li key={feature} className={has ? 'has' : 'lacks'}>
                      {has ? (
                        <CheckCircleFilled aria-hidden="true" />
                      ) : (
                        <CloseCircleOutlined aria-hidden="true" />
                      )}
                      <span>{text.features[feature]}</span>
                      <span className="estate-sr-only">
                        {has ? text.listing.yes : text.listing.no}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </section>

            <section className="estate-detail__section" aria-labelledby="estate-location">
              <Typography.Title level={2} id="estate-location">
                {text.listing.locationTitle}
              </Typography.Title>
              <EstateLocationMap position={listing.position} />
              <Typography.Text type="secondary" className="estate-detail__approx">
                {text.map.approximate}
              </Typography.Text>
              <ul className="estate-nearby">
                <li>
                  <EnvironmentOutlined aria-hidden="true" />
                  {text.listing.nearby.transit(listing.nearby.transitMinutes)}
                </li>
                <li>
                  <ReadOutlined aria-hidden="true" />
                  {text.listing.nearby.school}: {formatDistance(listing.nearby.school, language)}
                </li>
                <li>
                  <MedicineBoxOutlined aria-hidden="true" />
                  {text.listing.nearby.hospital}:{' '}
                  {formatDistance(listing.nearby.hospital, language)}
                </li>
                <li>
                  <ShopOutlined aria-hidden="true" />
                  {text.listing.nearby.market}: {formatDistance(listing.nearby.market, language)}
                </li>
              </ul>
            </section>

            <section className="estate-detail__section" aria-labelledby="estate-money">
              <Typography.Title level={2} id="estate-money">
                {listing.deal === 'sale' ? text.mortgage.title : text.listing.moveInTitle}
              </Typography.Title>
              {listing.deal === 'sale' ? (
                <>
                  <Typography.Paragraph type="secondary">{text.mortgage.lead}</Typography.Paragraph>
                  <EstateMortgageCalculator key={listing.id} price={listing.price} />
                </>
              ) : (
                <MoveInCost rent={listing.price} />
              )}
            </section>

            <section className="estate-detail__section" aria-labelledby="estate-history">
              <Typography.Title level={2} id="estate-history">
                {text.listing.historyTitle}
              </Typography.Title>
              <PriceHistory listing={listing} />
            </section>
          </div>

          <aside className="estate-detail__aside">
            <div className="estate-price-card">
              <div className="estate-price-card__price">
                <strong>{money(listing.price)}</strong>
                {listing.deal === 'rent' && (
                  <Typography.Text type="secondary"> {text.perMonth}</Typography.Text>
                )}
              </div>
              <Typography.Text type="secondary">
                {listing.deal === 'sale'
                  ? text.perM2(money(pricePerM2(listing)))
                  : `${text.listing.dues}: ${listing.dues ? money(listing.dues) : text.listing.noDues}`}
              </Typography.Text>
              <ContactAgent key={listing.id} listing={listing} />
            </div>
          </aside>
        </div>

        {similar.length > 0 && (
          <section className="estate-detail__similar" aria-labelledby="estate-similar">
            <Typography.Title level={2} id="estate-similar">
              {text.listing.similarTitle}
            </Typography.Title>
            <div className="estate-grid estate-grid--four">
              {similar.map((other) => (
                <EstateListingCard key={other.id} listing={other} standalone={standalone} />
              ))}
            </div>
          </section>
        )}
      </article>
    </EstateSiteShell>
  )
}
