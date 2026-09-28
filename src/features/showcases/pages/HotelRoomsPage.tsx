import { CalendarOutlined, FilterOutlined, InfoCircleOutlined } from '@ant-design/icons'
import {
  Alert,
  Badge,
  Button,
  Checkbox,
  Drawer,
  Empty,
  Flex,
  Grid,
  Select,
  Slider,
  Switch,
  Tag,
  Typography,
} from 'antd'
import dayjs from 'dayjs'
import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { HotelSearchBar } from '@/features/showcases/components/HotelSearchBar'
import { HotelSiteShell } from '@/features/showcases/components/HotelSiteShell'
import { RoomFacts } from '@/features/showcases/components/HotelRoomParts'
import {
  BED_TYPES,
  hotelRooms,
  hotelRoomsRoot,
  ROOM_AMENITIES,
  ROOM_VIEWS,
  type BedType,
  type HotelRoom,
  type RoomAmenity,
  type RoomView,
} from '@/features/showcases/data/hotel'
import {
  availabilityFor,
  formatMoney,
  nightsOf,
  quoteStay,
  readStay,
  stayParams,
  type Availability,
  type StaySearch,
} from '@/features/showcases/data/hotelBooking'
import { useHotelText } from '@/features/showcases/data/hotelCopy'

interface HotelRoomsPageProps {
  standalone?: boolean
}

type SortKey = 'recommended' | 'priceLow' | 'priceHigh' | 'size'

interface Filters {
  price: [number, number] | null
  beds: BedType[]
  views: RoomView[]
  amenities: RoomAmenity[]
  onlyAvailable: boolean
}

const noFilters: Filters = { price: null, beds: [], views: [], amenities: [], onlyAvailable: false }

interface RoomResult {
  room: HotelRoom
  availability: Availability
  nightly: number
  total: number
}

export function HotelRoomsPage({ standalone = false }: HotelRoomsPageProps) {
  const { text, language } = useHotelText()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { stay, issue } = readStay(params)
  const root = hotelRoomsRoot(standalone)
  const isDesktop = Grid.useBreakpoint().lg ?? false
  const [filters, setFilters] = useState<Filters>(noFilters)
  const [sort, setSort] = useState<SortKey>('recommended')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const search = (next: StaySearch) => navigate(`${root}?${stayParams(next)}`)
  const nights = nightsOf(stay)

  const results: RoomResult[] = hotelRooms.map((room) => {
    const quote = quoteStay(room, stay)
    return {
      room,
      availability: availabilityFor(room, stay),
      nightly: quote.averageNightly,
      total: quote.total,
    }
  })
  const prices = results.map((result) => result.nightly)
  const bounds: [number, number] = [
    Math.floor(Math.min(...prices) / 10) * 10,
    Math.ceil(Math.max(...prices) / 10) * 10,
  ]
  const price = filters.price ?? bounds

  const shown = results
    .filter(({ room, availability, nightly }) => {
      if (nightly < price[0] || nightly > price[1]) return false
      if (filters.beds.length && !filters.beds.includes(room.bed)) return false
      if (filters.views.length && !filters.views.includes(room.view)) return false
      if (!filters.amenities.every((amenity) => room.amenities.includes(amenity))) return false
      return !filters.onlyAvailable || availability.available
    })
    .sort((a, b) => {
      // Rooms that can be booked always come first; the sort orders within each group.
      if (a.availability.available !== b.availability.available) {
        return a.availability.available ? -1 : 1
      }
      if (sort === 'priceLow') return a.nightly - b.nightly
      if (sort === 'priceHigh') return b.nightly - a.nightly
      if (sort === 'size') return b.room.size - a.room.size
      return 0
    })

  const activeFilters =
    (filters.price ? 1 : 0) +
    filters.beds.length +
    filters.views.length +
    filters.amenities.length +
    (filters.onlyAvailable ? 1 : 0)
  const available = results.filter((result) => result.availability.available).length

  const filterPanel = (
    <div className="hotel-filters">
      <section>
        <Typography.Text strong>{text.rooms.price}</Typography.Text>
        <Slider
          range
          min={bounds[0]}
          max={bounds[1]}
          step={10}
          value={price}
          onChange={(value) =>
            setFilters((current) => ({ ...current, price: [value[0]!, value[1]!] }))
          }
          tooltip={{ formatter: (value) => formatMoney(value ?? 0, language) }}
          aria-label={text.rooms.price}
        />
        <Flex justify="space-between">
          <Typography.Text type="secondary">{formatMoney(price[0], language)}</Typography.Text>
          <Typography.Text type="secondary">{formatMoney(price[1], language)}</Typography.Text>
        </Flex>
      </section>
      <section>
        <Typography.Text strong>{text.rooms.bed}</Typography.Text>
        <Checkbox.Group
          value={filters.beds}
          onChange={(beds) => setFilters((current) => ({ ...current, beds }))}
          options={BED_TYPES.map((bed) => ({ value: bed, label: text.beds[bed] }))}
        />
      </section>
      <section>
        <Typography.Text strong>{text.rooms.view}</Typography.Text>
        <Checkbox.Group
          value={filters.views}
          onChange={(views) => setFilters((current) => ({ ...current, views }))}
          options={ROOM_VIEWS.map((view) => ({ value: view, label: text.views[view] }))}
        />
      </section>
      <section>
        <Typography.Text strong>{text.rooms.amenities}</Typography.Text>
        <Checkbox.Group
          value={filters.amenities}
          onChange={(amenities) => setFilters((current) => ({ ...current, amenities }))}
          options={ROOM_AMENITIES.map((amenity) => ({
            value: amenity,
            label: text.amenityNames[amenity],
          }))}
        />
      </section>
      <label className="hotel-filters__switch">
        <Switch
          size="small"
          checked={filters.onlyAvailable}
          onChange={(onlyAvailable) => setFilters((current) => ({ ...current, onlyAvailable }))}
        />
        {text.rooms.onlyAvailable}
      </label>
      <Button onClick={() => setFilters(noFilters)} disabled={activeFilters === 0} block>
        {text.rooms.clear}
      </Button>
    </div>
  )

  return (
    <HotelSiteShell
      standalone={standalone}
      title={{ en: 'Hotel rooms', tr: 'Otel odaları' }}
      description={{
        en: 'Search results for a stay: filters, sorting and availability that holds for the dates.',
        tr: 'Bir konaklama için arama sonuçları: filtreler, sıralama ve tarihlere göre müsaitlik.',
      }}
    >
      <div className="hotel-page-head">
        <div className="showcase-section hotel-page-head__inner">
          <Typography.Title>{text.rooms.title}</Typography.Title>
          <Typography.Paragraph type="secondary">
            <CalendarOutlined aria-hidden="true" />{' '}
            {text.rooms.lead(
              nights,
              dayjs(stay.checkIn).format('D MMM'),
              dayjs(stay.checkOut).format('D MMM YYYY'),
            )}{' '}
            · {text.guests(stay.adults + stay.children)} · {text.roomsCount(stay.rooms)}
          </Typography.Paragraph>
          <HotelSearchBar
            key={stayParams(stay)}
            value={stay}
            onSearch={search}
            submitLabel={text.search.update}
          />
          {issue && (
            <Alert
              type="info"
              showIcon
              icon={<InfoCircleOutlined />}
              title={text.rooms.issue[issue]}
              className="hotel-issue"
            />
          )}
        </div>
      </div>

      <section className="showcase-section hotel-results">
        {isDesktop && (
          <aside aria-label={text.rooms.filters}>
            <Typography.Title level={4}>{text.rooms.filters}</Typography.Title>
            {filterPanel}
          </aside>
        )}

        <div>
          <Flex justify="space-between" align="center" gap={12} wrap className="hotel-results__bar">
            <Typography.Text type="secondary">
              {text.rooms.count(shown.length, available)}
            </Typography.Text>
            <Flex gap={8} align="center">
              {!isDesktop && (
                <Badge count={activeFilters} size="small">
                  <Button
                    icon={<FilterOutlined aria-hidden="true" />}
                    onClick={() => setFiltersOpen(true)}
                  >
                    {text.rooms.filters}
                  </Button>
                </Badge>
              )}
              <Select<SortKey>
                value={sort}
                onChange={setSort}
                aria-label={text.rooms.sort}
                prefix={isDesktop ? `${text.rooms.sort}:` : undefined}
                popupMatchSelectWidth={false}
                options={(Object.keys(text.rooms.sortOptions) as SortKey[]).map((key) => ({
                  value: key,
                  label: text.rooms.sortOptions[key],
                }))}
              />
            </Flex>
          </Flex>

          {shown.length === 0 ? (
            <Empty description={text.rooms.empty} className="hotel-empty">
              <Button onClick={() => setFilters(noFilters)}>{text.rooms.clear}</Button>
            </Empty>
          ) : (
            <ol className="hotel-room-list">
              {shown.map((result) => (
                <li key={result.room.id}>
                  <RoomResultCard result={result} stay={stay} root={root} />
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>

      {!isDesktop && (
        <Drawer
          open={filtersOpen}
          onClose={() => setFiltersOpen(false)}
          title={text.rooms.filters}
          placement="bottom"
          size="80%"
        >
          {filterPanel}
        </Drawer>
      )}
    </HotelSiteShell>
  )
}

function RoomResultCard({
  result,
  stay,
  root,
}: {
  result: RoomResult
  stay: StaySearch
  root: string
}) {
  const { text, language } = useHotelText()
  const navigate = useNavigate()
  const { room, availability, nightly, total } = result
  const href = `${root}/${room.id}?${stayParams(stay)}`
  const image = room.images[0]!

  return (
    <article
      className={`hotel-result${availability.available ? '' : ' hotel-result--unavailable'}`}
      aria-label={room.name[language]}
    >
      <Link to={href} className="hotel-result__image" tabIndex={-1} aria-hidden="true">
        <img src={image.url.replace('w=1200', 'w=700')} alt="" loading="lazy" />
        {availability.reason === 'soldOut' && (
          <span className="hotel-result__ribbon">{text.rooms.soldOut}</span>
        )}
      </Link>

      <div className="hotel-result__body">
        <Typography.Title level={3}>
          <Link to={href}>{room.name[language]}</Link>
        </Typography.Title>
        <RoomFacts room={room} />
        <Typography.Paragraph type="secondary">{room.summary[language]}</Typography.Paragraph>
        <Flex gap={6} wrap>
          {room.amenities.slice(0, 4).map((amenity) => (
            <Tag key={amenity} variant="filled">
              {text.amenityNames[amenity]}
            </Tag>
          ))}
        </Flex>
      </div>

      <div className="hotel-result__price">
        {availability.available ? (
          <>
            {availability.left <= 2 && (
              <Tag color="volcano" variant="filled">
                {text.rooms.fewLeft(availability.left)}
              </Tag>
            )}
            <div>
              <Typography.Text strong className="hotel-price">
                {formatMoney(nightly, language)}
              </Typography.Text>
              <Typography.Text type="secondary"> {text.perNight}</Typography.Text>
            </div>
            <Typography.Text type="secondary">
              {formatMoney(total, language)} {text.totalFor(nightsOf(stay), stay.rooms)}
            </Typography.Text>
            <Typography.Text type="secondary" className="hotel-result__fine">
              {text.taxesIncluded}
            </Typography.Text>
            <Button type="primary" onClick={() => navigate(href)} className="hotel-result__cta">
              {text.rooms.select}
            </Button>
          </>
        ) : availability.reason === 'capacity' ? (
          <>
            <Typography.Text strong>{text.rooms.tooSmall(room.maxGuests)}</Typography.Text>
            <Typography.Text type="secondary">{text.rooms.tooSmallHint}</Typography.Text>
          </>
        ) : (
          <>
            <Typography.Text strong>{text.rooms.soldOut}</Typography.Text>
            <Typography.Text type="secondary">
              {text.rooms.soldOutNights(availability.soldOutNights.length)}
            </Typography.Text>
            <Link to={href}>{text.rooms.tryOtherDates}</Link>
          </>
        )}
      </div>
    </article>
  )
}
