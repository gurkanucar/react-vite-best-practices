import {
  ArrowRightOutlined,
  BulbOutlined,
  CarOutlined,
  EnvironmentOutlined,
  SunOutlined,
  SwapOutlined,
} from '@ant-design/icons'
import { Button, Timeline } from 'antd'
import type { ReactNode } from 'react'
import { Link, useParams } from 'react-router'
import {
  CityHero,
  CityNotFound,
  EventCard,
  PlaceCard,
} from '@/features/showcases/components/CityBits'
import { CitySiteShell } from '@/features/showcases/components/CitySiteShell'
import {
  cities,
  cityEvents,
  cityEventsPath,
  cityExplorePath,
  isCityId,
  placesIn,
  type City,
  type PlaceCategory,
} from '@/features/showcases/data/cityGuide'
import { filterEvents } from '@/features/showcases/data/citySearch'
import { useCityCopy } from '@/features/showcases/hooks/useCityCopy'
import { useCityStore } from '@/features/showcases/hooks/useCityStore'
import { useCityToday } from '@/features/showcases/hooks/useCityToday'

interface CityOverviewPageProps {
  standalone?: boolean
}

const PRACTICAL_ICONS: Record<City['practical'][number]['key'], ReactNode> = {
  getting: <CarOutlined />,
  around: <SwapOutlined />,
  season: <SunOutlined />,
  tip: <BulbOutlined />,
}

function SectionHead({
  id,
  title,
  lead,
  more,
}: {
  id: string
  title: string
  lead?: string
  more?: { href: string; label: string }
}) {
  return (
    <div className="city-section__head">
      <div>
        <h2 id={id}>{title}</h2>
        {lead && <p>{lead}</p>}
      </div>
      {more && (
        <Link to={more.href} className="city-more">
          {more.label} <ArrowRightOutlined aria-hidden="true" />
        </Link>
      )}
    </div>
  )
}

export function CityOverviewPage({ standalone = false }: CityOverviewPageProps) {
  const { cityId } = useParams()
  const { text, t } = useCityCopy()
  const today = useCityToday()
  const saved = useCityStore((state) => state.saved)

  if (!isCityId(cityId))
    return (
      <CitySiteShell standalone={standalone} page="overview">
        <CityNotFound standalone={standalone} />
      </CitySiteShell>
    )

  const city = cities[cityId]
  const here = placesIn(cityId)
  const of = (category: PlaceCategory) => here.filter((place) => place.category === category)
  const mustSee = [...of('history')]
    .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)))
    .slice(0, 6)
  const savedHere = saved
    .map((id) => here.find((place) => place.id === id))
    .filter((place) => place !== undefined)
  const upcoming = filterEvents(
    cityEvents,
    cityId,
    { category: 'all', month: 'all', planned: false },
    today,
  ).slice(0, 3)
  const explore = (category: PlaceCategory) =>
    cityExplorePath(standalone, cityId, `cat=${category}`)

  return (
    <CitySiteShell standalone={standalone} page="overview">
      <CityHero
        city={city}
        standalone={standalone}
        eyebrow={t(city.tagline)}
        title={t(city.name)}
        lead={t(city.intro)}
      />

      <section className="city-container city-facts" aria-label={text.city.factsTitle}>
        {city.facts.map((fact) => (
          <div key={fact.label.en}>
            <span>{t(fact.label)}</span>
            <strong>{t(fact.value)}</strong>
          </div>
        ))}
      </section>

      <section className="city-section city-container" aria-labelledby="city-must">
        <SectionHead
          id="city-must"
          title={text.city.mustTitle}
          lead={text.city.mustLead}
          more={{ href: explore('history'), label: text.city.seeAll }}
        />
        <div className="city-grid">
          {mustSee.map((place) => (
            <PlaceCard key={place.id} place={place} standalone={standalone} />
          ))}
        </div>
      </section>

      <section className="city-section city-section--sand" aria-labelledby="city-story">
        <div className="city-container city-story">
          <SectionHead id="city-story" title={text.city.storyTitle} />
          <Timeline
            className="city-timeline"
            items={city.timeline.map((entry) => ({
              key: entry.year.en,
              content: (
                <div className="city-timeline__item">
                  <span className="city-timeline__year">{t(entry.year)}</span>
                  <strong>{t(entry.title)}</strong>
                  <p>{t(entry.text)}</p>
                </div>
              ),
            }))}
          />
        </div>
      </section>

      <section className="city-section city-container" aria-labelledby="city-food">
        <SectionHead
          id="city-food"
          title={text.city.foodTitle}
          more={{ href: explore('food'), label: text.city.seeAll }}
        />
        <div className="city-grid">
          {of('food').map((place) => (
            <PlaceCard key={place.id} place={place} standalone={standalone} />
          ))}
        </div>
      </section>

      <section className="city-section city-container" aria-labelledby="city-culture">
        <SectionHead
          id="city-culture"
          title={text.city.cultureTitle}
          more={{ href: explore('culture'), label: text.city.seeAll }}
        />
        <div className="city-grid">
          {of('culture').map((place) => (
            <PlaceCard key={place.id} place={place} standalone={standalone} />
          ))}
        </div>
      </section>

      <section className="city-section city-section--sand" aria-labelledby="city-hoods">
        <div className="city-container">
          <SectionHead id="city-hoods" title={text.city.hoodsTitle} />
          <div className="city-hoods">
            {city.neighbourhoods.map((hood) => (
              <Link
                key={hood.name}
                to={cityExplorePath(
                  standalone,
                  cityId,
                  new URLSearchParams({ district: hood.name.split(' ')[0]! }).toString(),
                )}
                className="city-hood"
              >
                <EnvironmentOutlined aria-hidden="true" />
                <strong>{hood.name}</strong>
                <span>{t(hood.text)}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="city-section city-container" aria-labelledby="city-upcoming">
        <SectionHead
          id="city-upcoming"
          title={text.city.upcomingTitle}
          more={{ href: cityEventsPath(standalone, cityId), label: text.city.seeAll }}
        />
        <div className="city-events">
          {upcoming.map((event) => (
            <EventCard key={event.id} event={event} standalone={standalone} />
          ))}
        </div>
      </section>

      <section className="city-section city-container" aria-labelledby="city-practical">
        <SectionHead id="city-practical" title={text.city.practicalTitle} />
        <div className="city-practical">
          {city.practical.map((item) => (
            <div key={item.key} className="city-practical__item">
              <span className="city-practical__icon" aria-hidden="true">
                {PRACTICAL_ICONS[item.key]}
              </span>
              <strong>{text.city.practical[item.key]}</strong>
              <p>{t(item.text)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="city-section city-container" aria-labelledby="city-saved">
        <SectionHead id="city-saved" title={text.city.savedTitle} />
        {savedHere.length ? (
          <div className="city-grid">
            {savedHere.map((place) => (
              <PlaceCard key={place.id} place={place} standalone={standalone} />
            ))}
          </div>
        ) : (
          <div className="city-empty">
            <p>{text.city.savedEmpty}</p>
            <Button href={cityExplorePath(standalone, cityId)}>{text.city.explore}</Button>
          </div>
        )}
      </section>
    </CitySiteShell>
  )
}
