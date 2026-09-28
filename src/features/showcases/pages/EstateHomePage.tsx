import {
  ArrowRightOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  SearchOutlined,
  StarFilled,
} from '@ant-design/icons'
import { AutoComplete, Avatar, Button, Flex, InputNumber, Select, Slider, Typography } from 'antd'
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { DealSwitch } from '@/features/showcases/components/EstateFilters'
import { EstateListingCard } from '@/features/showcases/components/EstateListingCard'
import { EstateSiteShell } from '@/features/showcases/components/EstateSiteShell'
import {
  agents,
  CITIES,
  cityNames,
  estateHeroPhoto,
  estateListingsPath,
  estatePhotoUrl,
  formatPrice,
  listings,
  neighbourhoods,
  pricePerM2,
  PROPERTY_TYPES,
  type City,
  type Deal,
  type PropertyType,
} from '@/features/showcases/data/estate'
import {
  affordablePrice,
  DEFAULT_MORTGAGE,
  MORTGAGE_TERMS,
} from '@/features/showcases/data/estateMortgage'
import { defaultFilters, filtersToParams, fold } from '@/features/showcases/data/estateSearch'
import { useEstateText } from '@/features/showcases/hooks/useEstateText'

interface EstateHomePageProps {
  standalone?: boolean
}

const PRICE_PRESETS: Record<Deal, number[]> = {
  sale: [5_000_000, 7_500_000, 10_000_000, 15_000_000, 25_000_000, 50_000_000],
  rent: [20_000, 30_000, 45_000, 60_000, 90_000, 150_000],
}

/** The neighbourhoods on the home page: the ones with the most homes, a spread of cities. */
const hoodStats = neighbourhoods
  .map((hood) => {
    const here = listings.filter((listing) => listing.hoodId === hood.id)
    const flats = here.filter((listing) => listing.deal === 'sale')
    const perM2 = flats.length
      ? Math.round(flats.reduce((sum, listing) => sum + pricePerM2(listing), 0) / flats.length)
      : hood.salePerM2
    return { hood, count: here.length, perM2, photo: here[0]?.photos[0]?.id }
  })
  .filter((_, index) => [0, 2, 5, 6, 9, 12, 14, 17].includes(index))

function HeroSearch({ standalone }: { standalone: boolean }) {
  const { text, language } = useEstateText()
  const navigate = useNavigate()
  const [deal, setDeal] = useState<Deal>('sale')
  const [place, setPlace] = useState('')
  const [type, setType] = useState<PropertyType | ''>('')
  const [maxPrice, setMaxPrice] = useState<number>(0)

  const options = useMemo(() => {
    const query = fold(place)
    const cities = CITIES.map((city) => ({ value: cityNames[city], label: cityNames[city] }))
    const hoods = neighbourhoods.map((hood) => ({
      value: `${hood.name}, ${hood.district}`,
      label: (
        <span>
          {hood.name}
          <Typography.Text type="secondary">
            {' '}
            · {hood.district}, {cityNames[hood.city]}
          </Typography.Text>
        </span>
      ),
    }))
    return [...cities, ...hoods].filter((option) => !query || fold(option.value).includes(query))
  }, [place])

  const submit = () => {
    const folded = fold(place)
    const city = CITIES.find((entry) => fold(cityNames[entry]) === folded)
    const hood = neighbourhoods.find((entry) => fold(`${entry.name}, ${entry.district}`) === folded)
    const params = filtersToParams({
      ...defaultFilters,
      deal,
      city: (hood?.city ?? city) as City | undefined,
      hood: hood?.id,
      q: city || hood ? '' : place,
      types: type ? [type] : [],
      maxPrice: maxPrice || undefined,
    })
    void navigate(`${estateListingsPath(standalone)}?${params}`)
  }

  return (
    <form
      className="estate-hero-search"
      onSubmit={(event) => {
        event.preventDefault()
        submit()
      }}
    >
      <DealSwitch
        value={deal}
        onChange={(next) => {
          setDeal(next)
          setMaxPrice(0)
        }}
      />
      <div className="estate-hero-search__fields">
        <label className="estate-hero-search__field estate-hero-search__field--place">
          <span>{text.search.location}</span>
          <AutoComplete
            value={place}
            options={options}
            onChange={setPlace}
            placeholder={text.search.locationPlaceholder}
            aria-label={text.search.location}
            variant="borderless"
          />
        </label>
        <label className="estate-hero-search__field">
          <span>{text.search.type}</span>
          <Select<PropertyType | ''>
            value={type}
            onChange={setType}
            variant="borderless"
            aria-label={text.search.type}
            options={[
              { value: '', label: text.search.anyType },
              ...PROPERTY_TYPES.map((entry) => ({ value: entry, label: text.types[entry] })),
            ]}
          />
        </label>
        <label className="estate-hero-search__field">
          <span>{text.search.maxPrice}</span>
          <Select<number>
            value={maxPrice}
            onChange={setMaxPrice}
            variant="borderless"
            aria-label={text.search.maxPrice}
            options={[
              { value: 0, label: text.search.anyPrice },
              ...PRICE_PRESETS[deal].map((price) => ({
                value: price,
                label: formatPrice(price, language),
              })),
            ]}
          />
        </label>
        <Button
          type="primary"
          size="large"
          htmlType="submit"
          icon={<SearchOutlined aria-hidden="true" />}
          className="estate-hero-search__submit"
        >
          {text.search.submit}
        </Button>
      </div>
    </form>
  )
}

function AffordabilityTeaser({ standalone }: { standalone: boolean }) {
  const { text, language } = useEstateText()
  const navigate = useNavigate()
  const [budget, setBudget] = useState(90_000)
  const [downPaymentPct, setDownPaymentPct] = useState(DEFAULT_MORTGAGE.downPaymentPct)
  const [months, setMonths] = useState(DEFAULT_MORTGAGE.months)
  const price = affordablePrice(budget, {
    downPaymentPct,
    months,
    monthlyRatePct: DEFAULT_MORTGAGE.monthlyRatePct,
  })
  const numberLocale = language === 'tr' ? 'tr-TR' : 'en-GB'
  const pct = (value: number) => {
    const number = new Intl.NumberFormat(numberLocale, { maximumFractionDigits: 2 }).format(value)
    return language === 'tr' ? `%${number}` : `${number}%`
  }

  return (
    <div className="estate-afford">
      <div className="estate-afford__inputs">
        <div className="estate-filter-field">
          <label htmlFor="estate-afford-budget" className="estate-filter-field__label">
            {text.home.budget}
          </label>
          <InputNumber<number>
            id="estate-afford-budget"
            className="full-width"
            size="large"
            min={5_000}
            max={1_000_000}
            step={5_000}
            prefix="₺"
            value={budget}
            formatter={(value) => new Intl.NumberFormat(numberLocale).format(Number(value ?? 0))}
            parser={(value) => Number((value ?? '').replace(/\D/g, '')) || 0}
            onChange={(value) => setBudget(value ?? 0)}
          />
          <Slider
            min={10_000}
            max={400_000}
            step={5_000}
            value={Math.min(Math.max(budget, 10_000), 400_000)}
            onChange={setBudget}
            aria-label={text.home.budget}
            tooltip={{ formatter: (value) => formatPrice(value ?? 0, language) }}
          />
        </div>
        <Flex gap={12}>
          <div className="estate-filter-field">
            <label htmlFor="estate-afford-down" className="estate-filter-field__label">
              {text.mortgage.downPayment}
            </label>
            <Select<number>
              id="estate-afford-down"
              className="full-width"
              value={downPaymentPct}
              onChange={setDownPaymentPct}
              options={[20, 30, 40, 50].map((value) => ({ value, label: pct(value) }))}
            />
          </div>
          <div className="estate-filter-field">
            <label htmlFor="estate-afford-term" className="estate-filter-field__label">
              {text.mortgage.term}
            </label>
            <Select<number>
              id="estate-afford-term"
              className="full-width"
              value={months}
              onChange={setMonths}
              options={MORTGAGE_TERMS.map((term) => ({
                value: term,
                label: text.mortgage.months(term),
              }))}
            />
          </div>
        </Flex>
      </div>
      <div className="estate-afford__result" aria-live="polite">
        <Typography.Text type="secondary">
          {formatPrice(budget, language)} {text.perMonth} {text.home.budgetBuys}
        </Typography.Text>
        <strong>{formatPrice(price, language)}</strong>
        <Typography.Text type="secondary">
          {text.mortgage.rate}: {pct(DEFAULT_MORTGAGE.monthlyRatePct)}
        </Typography.Text>
        <Button
          type="primary"
          size="large"
          onClick={() =>
            void navigate(
              `${estateListingsPath(standalone)}?${filtersToParams({ ...defaultFilters, maxPrice: price, sort: 'priceDesc' })}`,
            )
          }
        >
          {text.home.browseAffordable} <ArrowRightOutlined aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}

export function EstateHomePage({ standalone = false }: EstateHomePageProps) {
  const { text, language } = useEstateText()
  const listingsPath = estateListingsPath(standalone)
  const featured = listings.filter((listing) => listing.featured)

  return (
    <EstateSiteShell standalone={standalone} page="home">
      <section
        className="estate-hero"
        style={{ backgroundImage: `url(${estatePhotoUrl(estateHeroPhoto, 2000)})` }}
      >
        <div className="estate-hero__inner">
          <span className="estate-eyebrow">{text.home.eyebrow(listings.length)}</span>
          <Typography.Title level={1}>{text.home.title}</Typography.Title>
          <Typography.Paragraph className="estate-hero__lead">
            {text.home.lead}
          </Typography.Paragraph>
          <HeroSearch standalone={standalone} />
          <dl className="estate-hero__stats">
            <div>
              <dt>{text.home.stats.listings}</dt>
              <dd>{listings.length}</dd>
            </div>
            <div>
              <dt>{text.home.stats.neighbourhoods}</dt>
              <dd>{neighbourhoods.length}</dd>
            </div>
            <div>
              <dt>{text.home.stats.agents}</dt>
              <dd>{agents.length}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="estate-section" aria-labelledby="estate-featured">
        <Flex
          justify="space-between"
          align="flex-end"
          gap={16}
          wrap
          className="estate-section__head"
        >
          <div>
            <Typography.Title level={2} id="estate-featured">
              {text.home.featuredTitle}
            </Typography.Title>
            <Typography.Text type="secondary">{text.home.featuredLead}</Typography.Text>
          </div>
          <Link to={listingsPath} className="estate-link">
            {text.home.viewAll} <ArrowRightOutlined aria-hidden="true" />
          </Link>
        </Flex>
        <div className="estate-grid estate-grid--three">
          {featured.map((listing) => (
            <EstateListingCard key={listing.id} listing={listing} standalone={standalone} />
          ))}
        </div>
      </section>

      <section
        className="estate-section estate-section--tinted"
        id="estate-neighbourhoods"
        aria-labelledby="estate-hoods-title"
      >
        <div className="estate-section__inner">
          <div className="estate-section__head">
            <Typography.Title level={2} id="estate-hoods-title">
              {text.home.hoodsTitle}
            </Typography.Title>
            <Typography.Text type="secondary">{text.home.hoodsLead}</Typography.Text>
          </div>
          <ul className="estate-hoods">
            {hoodStats.map(({ hood, count, perM2, photo }) => (
              <li key={hood.id}>
                <Link
                  to={`${listingsPath}?city=${hood.city}&hood=${hood.id}`}
                  className="estate-hood"
                  style={
                    photo ? { backgroundImage: `url(${estatePhotoUrl(photo, 600)})` } : undefined
                  }
                >
                  <span className="estate-hood__city">{cityNames[hood.city]}</span>
                  <strong>{hood.name}</strong>
                  <span>
                    {text.perM2(formatPrice(perM2, language))} · {text.home.hoodHomes(count)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        className="estate-section"
        id="estate-mortgage"
        aria-labelledby="estate-mortgage-title"
      >
        <div className="estate-mortgage-teaser">
          <div>
            <Typography.Title level={2} id="estate-mortgage-title">
              {text.home.mortgageTitle}
            </Typography.Title>
            <Typography.Paragraph type="secondary">{text.home.mortgageLead}</Typography.Paragraph>
          </div>
          <AffordabilityTeaser standalone={standalone} />
        </div>
      </section>

      <section
        className="estate-section estate-section--tinted"
        id="estate-agents"
        aria-labelledby="estate-agents-title"
      >
        <div className="estate-section__inner">
          <div className="estate-section__head">
            <Typography.Title level={2} id="estate-agents-title">
              {text.home.agentsTitle}
            </Typography.Title>
            <Typography.Text type="secondary">{text.home.agentsLead}</Typography.Text>
          </div>
          <ul className="estate-agents">
            {agents.map((agent) => (
              <li key={agent.id} className="estate-agent-card">
                <Avatar size={56} className="estate-avatar">
                  {agent.name
                    .split(' ')
                    .map((part) => part[0])
                    .join('')}
                </Avatar>
                <div className="estate-agent-card__body">
                  <Typography.Text strong>{agent.name}</Typography.Text>
                  <Typography.Text type="secondary">
                    <EnvironmentOutlined aria-hidden="true" /> {cityNames[agent.city]} ·{' '}
                    {agent.languages.join(' · ')}
                  </Typography.Text>
                  <Typography.Text type="secondary">
                    <StarFilled className="estate-star" aria-hidden="true" /> {agent.rating} ·{' '}
                    {text.home.reviews(agent.reviews)}
                  </Typography.Text>
                  <Typography.Text type="secondary">
                    {text.home.yearsExperience(agent.years)}
                  </Typography.Text>
                  <a href={`tel:${agent.phone.replace(/\s/g, '')}`} className="estate-link">
                    <PhoneOutlined aria-hidden="true" /> {agent.phone}
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="estate-section">
        <div className="estate-cta">
          <div>
            <Typography.Title level={2}>{text.home.valuationTitle}</Typography.Title>
            <Typography.Paragraph>{text.home.valuationLead}</Typography.Paragraph>
          </div>
          <Button size="large" href="mailto:hello@mesken.example">
            {text.home.valuationCta}
          </Button>
        </div>
      </section>
    </EstateSiteShell>
  )
}
