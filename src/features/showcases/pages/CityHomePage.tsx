import {
  ArrowRightOutlined,
  CalendarOutlined,
  CarOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import { AutoComplete, Button, Input } from 'antd'
import { useMemo, useState, type CSSProperties } from 'react'
import { Link, useNavigate } from 'react-router'
import { CityArt, EventCard, PlaceCard, Skyline } from '@/features/showcases/components/CityBits'
import { CitySiteShell } from '@/features/showcases/components/CitySiteShell'
import {
  CITY_IDS,
  cities,
  cityEvents,
  cityEventsPath,
  cityPath,
  cityPlacePath,
  places,
  placesIn,
  type CityId,
} from '@/features/showcases/data/cityGuide'
import { filterEvents, fold } from '@/features/showcases/data/citySearch'
import { useCityCopy } from '@/features/showcases/hooks/useCityCopy'
import { useCityToday } from '@/features/showcases/hooks/useCityToday'

interface CityHomePageProps {
  standalone?: boolean
}

const allEvents = { category: 'all', month: 'all', planned: false } as const

function GuideSearch({ standalone }: { standalone: boolean }) {
  const { text, t } = useCityCopy()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const options = useMemo(() => {
    const words = fold(query).split(/\s+/).filter(Boolean)
    if (!words.length) return []
    return CITY_IDS.map((city) => {
      const found = placesIn(city)
        .filter((place) => {
          const haystack = fold(`${place.name.en} ${place.name.tr} ${place.district}`)
          return words.every((word) => haystack.includes(word))
        })
        .slice(0, 6)
      return {
        label: t(cities[city].name),
        options: found.map((place) => ({
          value: `${city}/${place.id}`,
          label: (
            <span className="city-search__option">
              <CityArt category={place.category} city={city} size="thumb" />
              <span>
                <strong>{t(place.name)}</strong>
                <small>
                  {text.categoryOne[place.category]}
                  {place.district && ` · ${place.district}`}
                </small>
              </span>
            </span>
          ),
        })),
      }
    }).filter((group) => group.options.length)
  }, [query, t, text])

  return (
    <AutoComplete
      className="city-search"
      options={options}
      value={query}
      onChange={setQuery}
      onSelect={(value: string) => {
        const [city, id] = value.split('/') as [CityId, string]
        void navigate(cityPlacePath(standalone, city, id))
      }}
      notFoundContent={query.trim() ? text.home.noResults : null}
      popupMatchSelectWidth
    >
      <Input
        size="large"
        allowClear
        prefix={<SearchOutlined aria-hidden="true" />}
        placeholder={text.home.searchPlaceholder}
        aria-label={text.home.searchLabel}
      />
    </AutoComplete>
  )
}

export function CityHomePage({ standalone = false }: CityHomePageProps) {
  const { text, t } = useCityCopy()
  const today = useCityToday()
  const coming = filterEvents(cityEvents, 'all', allEvents, today).slice(0, 4)
  const tastes = places.filter((place) => place.category === 'food' && place.featured)

  return (
    <CitySiteShell standalone={standalone} page="home">
      <section className="city-home-hero">
        <div className="city-container city-home-hero__inner">
          <p className="city-eyebrow">{text.home.eyebrow}</p>
          <h1>{text.home.title}</h1>
          <p className="city-lead">{text.home.lead}</p>
          <GuideSearch standalone={standalone} />
        </div>
        <div className="city-home-hero__skylines" aria-hidden="true">
          <Skyline city="istanbul" />
          <Skyline city="edirne" />
        </div>
      </section>

      <section className="city-section city-container" aria-labelledby="city-pick">
        <h2 id="city-pick">{text.home.citiesTitle}</h2>
        <div className="city-pick">
          {CITY_IDS.map((id) => {
            const city = cities[id]
            const [from, to] = city.palette
            return (
              <Link
                key={id}
                to={cityPath(standalone, id)}
                className="city-pick__card"
                style={{ '--city-from': from, '--city-to': to } as CSSProperties}
              >
                <Skyline city={id} className="city-pick__skyline" />
                <span className="city-pick__body">
                  <strong>{t(city.name)}</strong>
                  <span>{t(city.tagline)}</span>
                  <span className="city-pick__stats">
                    {text.home.places(placesIn(id).length)} ·{' '}
                    {text.home.events(cityEvents.filter((event) => event.city === id).length)}
                  </span>
                  <span className="city-pick__cta">
                    {text.home.open} <ArrowRightOutlined aria-hidden="true" />
                  </span>
                </span>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="city-section city-section--sand" aria-labelledby="city-taste">
        <div className="city-container">
          <div className="city-section__head">
            <div>
              <h2 id="city-taste">{text.home.tasteTitle}</h2>
              <p>{text.home.tasteLead}</p>
            </div>
          </div>
          <div className="city-grid">
            {tastes.map((place) => (
              <PlaceCard key={place.id} place={place} standalone={standalone} />
            ))}
          </div>
        </div>
      </section>

      <section className="city-section city-container" aria-labelledby="city-coming">
        <div className="city-section__head">
          <div>
            <h2 id="city-coming">{text.home.comingTitle}</h2>
            <p>{text.home.comingLead}</p>
          </div>
          <div className="city-section__links">
            {CITY_IDS.map((id) => (
              <Button key={id} icon={<CalendarOutlined />} href={cityEventsPath(standalone, id)}>
                {t(cities[id].name)}
              </Button>
            ))}
          </div>
        </div>
        <div className="city-events">
          {coming.map((event) => (
            <EventCard key={event.id} event={event} showCity standalone={standalone} />
          ))}
        </div>
      </section>

      <section className="city-section city-container" aria-labelledby="city-route">
        <div className="city-route">
          <span className="city-route__icon" aria-hidden="true">
            <CarOutlined />
          </span>
          <div>
            <h2 id="city-route">{text.home.routeTitle}</h2>
            <p>{text.home.routeText}</p>
            <ol>
              {text.home.routeSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </CitySiteShell>
  )
}
