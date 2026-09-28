import {
  ArrowLeftOutlined,
  BulbOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  ExportOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons'
import { Alert, Button, Tag } from 'antd'
import { Link, useParams } from 'react-router'
import {
  CityArt,
  CityNotFound,
  PlaceCard,
  PriceLevel,
  Rating,
  SaveButton,
} from '@/features/showcases/components/CityBits'
import { CityMap } from '@/features/showcases/components/CityMap'
import { CitySiteShell } from '@/features/showcases/components/CitySiteShell'
import {
  cities,
  cityExplorePath,
  cityPath,
  cityPlacePath,
  isCityId,
  placeById,
  places,
  servedAt,
} from '@/features/showcases/data/cityGuide'
import { formatDistance, nearbyPlaces, walkMinutes } from '@/features/showcases/data/citySearch'
import { useCityCopy } from '@/features/showcases/hooks/useCityCopy'

interface CityPlacePageProps {
  standalone?: boolean
}

export function CityPlacePage({ standalone = false }: CityPlacePageProps) {
  const { cityId, placeId } = useParams()
  const { text, language, t } = useCityCopy()
  const place = isCityId(cityId) ? placeById(cityId, placeId) : undefined

  if (!isCityId(cityId) || !place)
    return (
      <CitySiteShell standalone={standalone} page="place">
        <CityNotFound
          standalone={standalone}
          title={isCityId(cityId) ? text.place.notFoundTitle : undefined}
          subTitle={isCityId(cityId) ? text.place.notFoundText : undefined}
        />
      </CitySiteShell>
    )

  const city = cities[cityId]
  const nearby = nearbyPlaces(place, places, 5)
  const tryAt = place.category === 'food' ? servedAt(place.id) : []
  const knownFor = (place.dishes ?? [])
    .map((id) => placeById(cityId, id))
    .filter((dish) => dish !== undefined)
  const more = places
    .filter(
      (other) =>
        other.city === cityId && other.category === place.category && other.id !== place.id,
    )
    .slice(0, 3)
  const directions = place.position
    ? `https://www.openstreetmap.org/?mlat=${place.position[0]}&mlon=${place.position[1]}#map=17/${place.position[0]}/${place.position[1]}`
    : undefined

  return (
    <CitySiteShell standalone={standalone} page="place">
      <div className="city-container city-place">
        <Link to={cityPath(standalone, cityId)} className="city-back">
          <ArrowLeftOutlined aria-hidden="true" /> {text.place.back(t(city.name))}
        </Link>

        <header className="city-place__head">
          <CityArt category={place.category} city={cityId} size="hero" />
          <div className="city-place__title">
            <div className="city-place__chips">
              <Link
                to={cityExplorePath(standalone, cityId, `cat=${place.category}`)}
                className={`city-chip city-chip--${place.category}`}
              >
                {place.type ? t(place.type) : text.categoryOne[place.category]}
              </Link>
              {place.kind === 'demo' ? (
                <Tag color="orange" variant="filled">
                  {text.place.demoBadge}
                </Tag>
              ) : (
                <Tag color="green" variant="filled">
                  {place.position ? text.place.realBadge : text.place.realItem}
                </Tag>
              )}
            </div>
            <h1>{t(place.name)}</h1>
            <p className="city-lead">{t(place.summary)}</p>
            <div className="city-place__meta">
              {place.district && (
                <span>
                  <EnvironmentOutlined aria-hidden="true" /> {place.district}, {t(city.name)}
                </span>
              )}
              <Rating place={place} />
              <PriceLevel level={place.price} />
            </div>
            <SaveButton id={place.id} />
          </div>
        </header>

        <div className="city-place__layout">
          <div className="city-place__main">
            {place.body.map((paragraph) => (
              <p key={paragraph.en}>{t(paragraph)}</p>
            ))}
            {place.tip && (
              <Alert
                type="info"
                showIcon
                icon={<BulbOutlined />}
                title={text.place.tip}
                description={t(place.tip)}
                className="city-place__tip"
              />
            )}
            {place.kind === 'demo' && (
              <Alert
                type="warning"
                showIcon
                icon={<InfoCircleOutlined />}
                title={text.place.demoText}
                className="city-place__tip"
              />
            )}

            {place.category === 'food' && (
              <section aria-labelledby="city-try">
                <h2 id="city-try">{text.place.whereToTry}</h2>
                {tryAt.length ? (
                  <div className="city-grid">
                    {tryAt.map((other) => (
                      <PlaceCard key={other.id} place={other} standalone={standalone} />
                    ))}
                  </div>
                ) : (
                  <p className="city-muted">{text.place.noneServing}</p>
                )}
              </section>
            )}

            {knownFor.length > 0 && (
              <section aria-labelledby="city-known">
                <h2 id="city-known">{text.place.knownFor}</h2>
                <ul className="city-known">
                  {knownFor.map((dish) => (
                    <li key={dish.id}>
                      <Link to={cityPlacePath(standalone, cityId, dish.id)}>
                        <CityArt category="food" city={cityId} size="thumb" />
                        <span>
                          <strong>{t(dish.name)}</strong>
                          <small>{t(dish.summary)}</small>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <aside className="city-place__aside">
            <div className="city-panel">
              <h2>{text.place.facts}</h2>
              <dl className="city-dl">
                {place.hours && (
                  <div>
                    <dt>
                      <ClockCircleOutlined aria-hidden="true" /> {text.place.hours}
                    </dt>
                    <dd>{t(place.hours)}</dd>
                  </div>
                )}
                {place.district && (
                  <div>
                    <dt>{text.place.district}</dt>
                    <dd>{place.district}</dd>
                  </div>
                )}
                {place.price && (
                  <div>
                    <dt>{text.place.price}</dt>
                    <dd>{text.priceLevel[place.price - 1]}</dd>
                  </div>
                )}
                {place.facts?.map((fact) => (
                  <div key={fact.label.en}>
                    <dt>{t(fact.label)}</dt>
                    <dd>{t(fact.value)}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="city-panel">
              <h2>{text.place.location}</h2>
              {place.position ? (
                <>
                  <CityMap
                    places={[place]}
                    center={place.position}
                    zoom={15}
                    standalone={standalone}
                    className="city-map--small"
                    label={text.place.location}
                  />
                  <Button
                    block
                    icon={<ExportOutlined />}
                    href={directions}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {text.place.directions}
                  </Button>
                </>
              ) : (
                <p className="city-muted">{text.place.noAddress}</p>
              )}
            </div>

            {nearby.length > 0 && (
              <div className="city-panel">
                <h2>{text.place.nearby}</h2>
                <ul className="city-nearby">
                  {nearby.map(({ place: other, km }) => (
                    <li key={other.id}>
                      <Link to={cityPlacePath(standalone, cityId, other.id)}>
                        <CityArt category={other.category} city={cityId} size="thumb" />
                        <span>
                          <strong>{t(other.name)}</strong>
                          <small>
                            {formatDistance(km, language)} · {text.place.walk(walkMinutes(km))}
                          </small>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>

        {more.length > 0 && (
          <section className="city-section" aria-labelledby="city-more">
            <div className="city-section__head">
              <h2 id="city-more">{text.place.more(text.categories[place.category])}</h2>
            </div>
            <div className="city-grid">
              {more.map((other) => (
                <PlaceCard key={other.id} place={other} standalone={standalone} />
              ))}
            </div>
          </section>
        )}
      </div>
    </CitySiteShell>
  )
}
