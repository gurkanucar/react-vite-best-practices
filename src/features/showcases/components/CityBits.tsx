import {
  BankOutlined,
  BgColorsOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  FireOutlined,
  HeartFilled,
  HeartOutlined,
  HomeOutlined,
  PlusOutlined,
  RestOutlined,
  ShopOutlined,
  StarFilled,
} from '@ant-design/icons'
import { App, Button, Result, Tag, Tooltip } from 'antd'
import type { CSSProperties, ReactNode } from 'react'
import { Link, useLocation } from 'react-router'
import {
  cities,
  cityEventsPath,
  cityExplorePath,
  cityPath,
  cityPlacePath,
  cityRoot,
  type City,
  type CityEvent,
  type CityId,
  type EventCategory,
  type Place,
  type PlaceCategory,
} from '@/features/showcases/data/cityGuide'
import { formatEventDates, formatPrice } from '@/features/showcases/data/citySearch'
import { useCityCopy } from '@/features/showcases/hooks/useCityCopy'
import { useCityStore } from '@/features/showcases/hooks/useCityStore'

const CATEGORY_ICONS: Record<PlaceCategory, ReactNode> = {
  history: <BankOutlined />,
  restaurant: <RestOutlined />,
  food: <FireOutlined />,
  culture: <BgColorsOutlined />,
  business: <ShopOutlined />,
  stay: <HomeOutlined />,
}

/** Stand-in artwork for a place: the city's colours and the category's icon, no photograph. */
export function CityArt({
  category,
  city,
  size = 'card',
}: {
  category: PlaceCategory
  city: CityId
  size?: 'card' | 'hero' | 'thumb'
}) {
  const [from, to] = cities[city].palette
  return (
    <div
      className={`city-art city-art--${size} city-art--${category}`}
      style={{ '--city-from': from, '--city-to': to } as CSSProperties}
      aria-hidden="true"
    >
      <span className="city-art__icon">{CATEGORY_ICONS[category]}</span>
    </div>
  )
}

/** A line drawing of the city's skyline for the heroes: domes, minarets and a tower or a bridge. */
export function Skyline({ city, className }: { city: CityId; className?: string }) {
  const minaret = (x: number, top: number, key: string) => (
    <g key={key}>
      <rect x={x - 3} y={top} width={6} height={176 - top} />
      <path d={`M${x - 4} ${top} L${x} ${top - 16} L${x + 4} ${top} Z`} />
      <rect x={x - 5} y={top + 22} width={10} height={3} />
    </g>
  )
  const dome = (cx: number, r: number, base: number) => (
    <path d={`M${cx - r} ${base} A${r} ${r} 0 0 1 ${cx + r} ${base} Z`} />
  )

  return (
    <svg
      className={`city-skyline ${className ?? ''}`}
      viewBox="0 0 600 190"
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
      focusable="false"
    >
      {city === 'istanbul' ? (
        <g>
          {dome(250, 58, 132)}
          {dome(186, 26, 150)}
          {dome(314, 26, 150)}
          <rect x={150} y={132} width={200} height={44} />
          {[128, 146, 354, 372].map((x, index) => minaret(x, index % 3 === 0 ? 62 : 48, `m${x}`))}
          <rect x={454} y={78} width={38} height={98} />
          <path d="M448 80 L473 34 L498 80 Z" />
          <rect x={20} y={148} width={46} height={28} />
          <rect x={72} y={138} width={40} height={38} />
          <rect x={512} y={140} width={34} height={36} />
          <rect x={552} y={150} width={40} height={26} />
        </g>
      ) : (
        <g>
          {dome(300, 70, 128)}
          {dome(214, 22, 150)}
          {dome(386, 22, 150)}
          <rect x={196} y={128} width={208} height={48} />
          {[176, 198, 402, 424].map((x) => minaret(x, 22, `m${x}`))}
          <path d="M430 176 L430 158 L600 158 L600 176 Z" />
          <rect x={20} y={146} width={52} height={30} />
          <rect x={80} y={136} width={44} height={40} />
        </g>
      )}
      <rect x={0} y={176} width={600} height={14} className="city-skyline__water" />
    </svg>
  )
}

export function SaveButton({ id, compact = false }: { id: string; compact?: boolean }) {
  const { text } = useCityCopy()
  const { message } = App.useApp()
  const saved = useCityStore((state) => state.saved.includes(id))
  const toggleSaved = useCityStore((state) => state.toggleSaved)
  const label = saved ? text.place.saved : text.place.save
  const onClick = () => {
    const now = toggleSaved(id)
    void message.success(now ? text.place.savedToast : text.place.removedToast)
  }

  if (compact)
    return (
      <Tooltip title={label}>
        <Button
          shape="circle"
          className={`city-save${saved ? ' is-saved' : ''}`}
          aria-label={label}
          aria-pressed={saved}
          icon={saved ? <HeartFilled /> : <HeartOutlined />}
          onClick={onClick}
        />
      </Tooltip>
    )
  return (
    <Button
      className={`city-save${saved ? ' is-saved' : ''}`}
      aria-pressed={saved}
      icon={saved ? <HeartFilled /> : <HeartOutlined />}
      onClick={onClick}
    >
      {label}
    </Button>
  )
}

export function Rating({ place }: { place: Place }) {
  const { text } = useCityCopy()
  if (place.rating === undefined) return null
  return (
    <span className="city-rating">
      <StarFilled aria-hidden="true" className="city-rating__star" />
      <strong>{place.rating.toFixed(1)}</strong>
      {place.reviews !== undefined && <span>({text.place.reviews(place.reviews)})</span>}
    </span>
  )
}

export function PriceLevel({ level }: { level?: 1 | 2 | 3 | 4 }) {
  const { text } = useCityCopy()
  if (!level) return null
  return (
    <span className="city-price" title={text.priceLevel[level - 1]}>
      <span aria-hidden="true">
        <b>{'₺'.repeat(level)}</b>
        {'₺'.repeat(4 - level)}
      </span>
      <span className="city-sr-only">{text.priceLevel[level - 1]}</span>
    </span>
  )
}

export function PlaceCard({ place, standalone }: { place: Place; standalone: boolean }) {
  const { text, t } = useCityCopy()
  const href = cityPlacePath(standalone, place.city, place.id)
  return (
    <article className="city-card">
      <Link to={href} className="city-card__art" tabIndex={-1} aria-hidden="true">
        <CityArt category={place.category} city={place.city} />
      </Link>
      <div className="city-card__save">
        <SaveButton id={place.id} compact />
      </div>
      <div className="city-card__body">
        <div className="city-card__meta">
          <span className={`city-chip city-chip--${place.category}`}>
            {place.type ? t(place.type) : text.categoryOne[place.category]}
          </span>
          {place.district && (
            <span className="city-card__district">
              <EnvironmentOutlined aria-hidden="true" /> {place.district}
            </span>
          )}
        </div>
        <h3>
          <Link to={href}>{t(place.name)}</Link>
        </h3>
        <p>{t(place.summary)}</p>
        {place.kind === 'demo' && (
          <div className="city-card__foot">
            <Rating place={place} />
            <PriceLevel level={place.price} />
          </div>
        )}
      </div>
    </article>
  )
}

const EVENT_TONE: Record<EventCategory, string> = {
  music: 'purple',
  food: 'orange',
  art: 'magenta',
  tour: 'blue',
  sport: 'green',
  family: 'gold',
}

export function EventCategoryTag({ category }: { category: EventCategory }) {
  const { text } = useCityCopy()
  return (
    <Tag color={EVENT_TONE[category]} variant="filled" className="city-event-tag">
      {text.eventCategories[category]}
    </Tag>
  )
}

export function PlanButton({ event, block = false }: { event: CityEvent; block?: boolean }) {
  const { text, t } = useCityCopy()
  const { message } = App.useApp()
  const planned = useCityStore((state) => state.plan.includes(event.id))
  const togglePlan = useCityStore((state) => state.togglePlan)
  return (
    <Button
      type={planned ? 'default' : 'primary'}
      ghost={!planned}
      block={block}
      className={planned ? 'city-plan-button is-planned' : 'city-plan-button'}
      icon={planned ? <CheckOutlined /> : <PlusOutlined />}
      aria-pressed={planned}
      aria-label={`${planned ? text.events.inPlan : text.events.addToPlan}: ${t(event.title)}`}
      onClick={() => {
        const now = togglePlan(event.id)
        void message.success(now ? text.events.addedToast : text.events.removedToast)
      }}
    >
      {planned ? text.events.inPlan : text.events.addToPlan}
    </Button>
  )
}

/** The day and month in a square, for event lists. */
export function DateBadge({ day }: { day: string }) {
  const { language } = useCityCopy()
  const date = new Date(`${day}T12:00:00`)
  const month = new Intl.DateTimeFormat(language === 'tr' ? 'tr-TR' : 'en-GB', {
    month: 'short',
  }).format(date)
  return (
    <span className="city-date" aria-hidden="true">
      <strong>{date.getDate()}</strong>
      <span>{month}</span>
    </span>
  )
}

export function EventCard({
  event,
  showCity = false,
  standalone,
}: {
  event: CityEvent
  showCity?: boolean
  standalone: boolean
}) {
  const { language, t } = useCityCopy()
  return (
    <article className="city-event">
      <DateBadge day={event.date} />
      <div className="city-event__body">
        <div className="city-event__meta">
          <EventCategoryTag category={event.category} />
          {showCity && (
            <Link to={cityEventsPath(standalone, event.city)} className="city-event__city">
              {t(cities[event.city].name)}
            </Link>
          )}
        </div>
        <h3>{t(event.title)}</h3>
        <p>{t(event.text)}</p>
        <ul className="city-event__facts">
          <li>
            <ClockCircleOutlined aria-hidden="true" /> {formatEventDates(event, language)} ·{' '}
            {event.time}
          </li>
          <li>
            <EnvironmentOutlined aria-hidden="true" /> {t(event.venue)}, {event.district}
          </li>
          <li className="city-event__price">{formatPrice(event.price, language)}</li>
        </ul>
      </div>
      <div className="city-event__action">
        <PlanButton event={event} />
      </div>
    </article>
  )
}

/** Overview, explore and events for one city, as a row of links under the hero. */
export function CityTabs({ city, standalone }: { city: CityId; standalone: boolean }) {
  const { text } = useCityCopy()
  const { pathname } = useLocation()
  const items = [
    { href: cityPath(standalone, city), label: text.city.overview },
    { href: cityExplorePath(standalone, city), label: text.city.explore },
    { href: cityEventsPath(standalone, city), label: text.city.events },
  ]
  return (
    <nav className="city-tabs" aria-label={text.city.cityMenu}>
      {items.map((item) => {
        const current = pathname === item.href
        return (
          <Link
            key={item.href}
            to={item.href}
            className={current ? 'is-active' : undefined}
            aria-current={current ? 'page' : undefined}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

export function CityNotFound({
  standalone,
  title,
  subTitle,
}: {
  standalone: boolean
  title?: string
  subTitle?: string
}) {
  const { text } = useCityCopy()
  return (
    <div className="city-container city-not-found">
      <Result
        status="404"
        title={title ?? text.city.notFoundTitle}
        subTitle={subTitle ?? text.city.notFoundText}
        extra={
          <Button type="primary" href={cityRoot(standalone)}>
            {text.city.backHome}
          </Button>
        }
      />
    </div>
  )
}

/** The hero every page of a city opens with: its skyline, name and the city's own tabs. */
export function CityHero({
  city,
  standalone,
  title,
  lead,
  eyebrow,
}: {
  city: City
  standalone: boolean
  title: string
  lead: string
  eyebrow: string
}) {
  const [from, to] = city.palette
  return (
    <section
      className="city-hero"
      style={{ '--city-from': from, '--city-to': to } as CSSProperties}
    >
      <div className="city-container city-hero__inner">
        <p className="city-eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="city-lead">{lead}</p>
      </div>
      <Skyline city={city.id} className="city-hero__skyline" />
      <div className="city-container">
        <CityTabs city={city.id} standalone={standalone} />
      </div>
    </section>
  )
}
