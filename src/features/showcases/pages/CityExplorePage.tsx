import { EnvironmentOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Checkbox, Grid, Input, Select, Tabs } from 'antd'
import { useState } from 'react'
import { useParams, useSearchParams } from 'react-router'
import { CityHero, CityNotFound, PlaceCard } from '@/features/showcases/components/CityBits'
import { CityMap } from '@/features/showcases/components/CityMap'
import { CitySiteShell } from '@/features/showcases/components/CitySiteShell'
import {
  cities,
  isCityId,
  PLACE_CATEGORIES,
  places,
  type PlaceCategory,
} from '@/features/showcases/data/cityGuide'
import {
  countByCategory,
  districtsOf,
  EXPLORE_SORTS,
  exploreToParams,
  parseExplore,
  searchPlaces,
  type ExploreFilters,
} from '@/features/showcases/data/citySearch'
import { useCityCopy } from '@/features/showcases/hooks/useCityCopy'
import { useCityStore } from '@/features/showcases/hooks/useCityStore'

interface CityExplorePageProps {
  standalone?: boolean
}

export function CityExplorePage({ standalone = false }: CityExplorePageProps) {
  const { cityId } = useParams()
  const { text, language, t } = useCityCopy()
  const [params, setParams] = useSearchParams()
  const saved = useCityStore((state) => state.saved)
  const wide = Grid.useBreakpoint().lg ?? false
  const [mapOpen, setMapOpen] = useState<boolean | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const filters = parseExplore(params)

  if (!isCityId(cityId))
    return (
      <CitySiteShell standalone={standalone} page="explore">
        <CityNotFound standalone={standalone} />
      </CitySiteShell>
    )

  const city = cities[cityId]
  const results = searchPlaces(places, cityId, filters, language, saved)
  const counts = countByCategory(places, cityId)
  const districts = districtsOf(places, cityId)
  const showMap = mapOpen ?? wide
  const unmapped = results.filter((place) => !place.position).length
  const update = (patch: Partial<ExploreFilters>) =>
    setParams(exploreToParams({ ...filters, ...patch }), { replace: true })
  const filtered = filters.q || filters.district || filters.saved || filters.sort !== 'recommended'

  return (
    <CitySiteShell standalone={standalone} page="explore">
      <CityHero
        city={city}
        standalone={standalone}
        eyebrow={t(city.name)}
        title={text.explore.title(language === 'tr' ? city.accTr : t(city.name))}
        lead={t(city.tagline)}
      />

      <div className="city-container city-explore">
        <Tabs
          className="city-explore__tabs"
          activeKey={filters.category}
          onChange={(key) => update({ category: key as PlaceCategory | 'all' })}
          items={[
            {
              key: 'all',
              label: `${text.explore.all} (${Object.values(counts).reduce((a, b) => a + b, 0)})`,
            },
            ...PLACE_CATEGORIES.map((key) => ({
              key,
              label: `${text.categories[key]} (${counts[key]})`,
            })),
          ]}
        />

        <div className="city-toolbar">
          <Input
            allowClear
            className="city-toolbar__search"
            prefix={<SearchOutlined aria-hidden="true" />}
            placeholder={text.explore.search}
            aria-label={text.explore.search}
            value={filters.q}
            onChange={(event) => update({ q: event.target.value })}
          />
          <Select
            className="city-toolbar__district"
            aria-label={text.explore.district}
            value={filters.district ?? ''}
            onChange={(value: string) => update({ district: value || null })}
            options={[
              { value: '', label: text.explore.anyDistrict },
              ...districts.map((district) => ({ value: district, label: district })),
            ]}
          />
          <Select
            className="city-toolbar__sort"
            aria-label={text.explore.sort}
            value={filters.sort}
            onChange={(sort) => update({ sort })}
            options={EXPLORE_SORTS.map((sort) => ({
              value: sort,
              label: text.explore.sorts[sort],
            }))}
          />
          <Checkbox
            checked={filters.saved}
            onChange={(event) => update({ saved: event.target.checked })}
          >
            {text.explore.savedOnly}
          </Checkbox>
        </div>

        <div className="city-results-head">
          <p className="city-results-head__count" aria-live="polite">
            {text.explore.results(results.length)}
          </p>
          <div className="city-results-head__actions">
            {filtered && (
              <Button
                type="link"
                onClick={() => update({ q: '', district: null, saved: false, sort: 'recommended' })}
              >
                {text.explore.clear}
              </Button>
            )}
            <Button
              icon={<EnvironmentOutlined />}
              aria-expanded={showMap}
              onClick={() => setMapOpen(!showMap)}
            >
              {showMap ? text.explore.hideMap : text.explore.showMap}
            </Button>
          </div>
        </div>

        <div className={`city-explore__layout${showMap ? ' has-map' : ''}`}>
          <div className="city-explore__list">
            {results.length ? (
              <div className="city-grid city-grid--explore">
                {results.map((place) => (
                  <div
                    key={place.id}
                    className={place.id === activeId ? 'is-active' : undefined}
                    onMouseEnter={() => setActiveId(place.id)}
                    onMouseLeave={() => setActiveId(null)}
                  >
                    <PlaceCard place={place} standalone={standalone} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="city-empty">
                <p>{text.explore.empty}</p>
                <Button onClick={() => setParams({}, { replace: true })}>
                  {text.explore.clear}
                </Button>
              </div>
            )}
          </div>
          {showMap && (
            <aside className="city-explore__map">
              <CityMap
                places={results}
                center={city.center}
                zoom={city.zoom}
                standalone={standalone}
                activeId={activeId}
                onHover={setActiveId}
                label={text.explore.mapTitle}
              />
              {unmapped > 0 && (
                <p className="city-explore__unmapped">{text.explore.notOnMap(unmapped)}</p>
              )}
            </aside>
          )}
        </div>
      </div>
    </CitySiteShell>
  )
}
