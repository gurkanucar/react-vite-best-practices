import {
  EnvironmentOutlined,
  FilterOutlined,
  HeartFilled,
  HeartOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons'
import { Button, Drawer, Empty, Flex, Grid, Pagination, Select, Tag, Typography } from 'antd'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router'
import { EstateCompareTray } from '@/features/showcases/components/EstateCompareTray'
import {
  DealSwitch,
  EstateFilterPanel,
  EstateQuickFilters,
} from '@/features/showcases/components/EstateFilters'
import { EstateListingCard } from '@/features/showcases/components/EstateListingCard'
import { EstateResultsMap } from '@/features/showcases/components/EstateMap'
import { EstateSiteShell } from '@/features/showcases/components/EstateSiteShell'
import {
  findHood,
  formatCompactPrice,
  formatPrice,
  listings,
} from '@/features/showcases/data/estate'
import {
  activeFilterCount,
  defaultFilters,
  filtersToParams,
  PAGE_SIZE,
  parseFilters,
  searchListings,
  SORT_OPTIONS,
  type EstateFilters,
  type SortOption,
} from '@/features/showcases/data/estateSearch'
import { useEstateStore } from '@/features/showcases/hooks/useEstateStore'
import { useEstateText } from '@/features/showcases/hooks/useEstateText'

interface EstateListingsPageProps {
  standalone?: boolean
}

interface Chip {
  key: string
  label: string
  clear: Partial<EstateFilters>
}

export function EstateListingsPage({ standalone = false }: EstateListingsPageProps) {
  const { text, language } = useEstateText()
  const [params, setParams] = useSearchParams()
  const filters = useMemo(() => parseFilters(params), [params])
  const favourites = useEstateStore((state) => state.favourites)
  const isDesktop = Grid.useBreakpoint().lg ?? false
  const [activeId, setActiveId] = useState<string | null>(null)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [mapOpen, setMapOpen] = useState(false)
  const listTop = useRef<HTMLDivElement>(null)

  // One listener on the grid rather than one per card: whichever card the pointer or focus
  // is in lights up its pin on the map.
  const trackActiveCard = useCallback((grid: HTMLDivElement | null) => {
    if (!grid) return
    const enter = (event: Event) => {
      const card = (event.target as HTMLElement).closest<HTMLElement>('[data-listing]')
      setActiveId(card?.dataset.listing ?? null)
    }
    const leave = () => setActiveId(null)
    grid.addEventListener('mouseover', enter)
    grid.addEventListener('focusin', enter)
    grid.addEventListener('mouseleave', leave)
    grid.addEventListener('focusout', leave)
    return () => {
      grid.removeEventListener('mouseover', enter)
      grid.removeEventListener('focusin', enter)
      grid.removeEventListener('mouseleave', leave)
      grid.removeEventListener('focusout', leave)
    }
  }, [])

  const results = useMemo(
    () => searchListings(listings, filters, { favourites }),
    [filters, favourites],
  )
  // The pins leave out the map area, so the homes just outside it stay visible.
  const pins = useMemo(
    () =>
      filters.bounds
        ? searchListings(listings, filters, { favourites, ignoreBounds: true })
        : results,
    [filters, favourites, results],
  )
  const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE))
  const page = Math.min(filters.page, pageCount)
  const shown = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const activeCount = activeFilterCount(filters)

  const update = (patch: Partial<EstateFilters>) =>
    setParams(filtersToParams({ ...filters, page: 1, ...patch }), { replace: true })
  const clearAll = () =>
    setParams(filtersToParams({ ...defaultFilters, deal: filters.deal, sort: filters.sort }))
  const goToPage = (next: number) => {
    setParams(filtersToParams({ ...filters, page: next }))
    listTop.current?.scrollIntoView({ block: 'start', behavior: 'smooth' })
  }

  const money = (amount: number) => formatCompactPrice(amount, language)
  const candidates: (Chip | false | '' | undefined)[] = [
    filters.q.trim() && { key: 'q', label: `“${filters.q.trim()}”`, clear: { q: '' } },
    filters.city && {
      key: 'city',
      label: text.cities[filters.city],
      clear: { city: undefined, hood: undefined },
    },
    filters.hood && {
      key: 'hood',
      label: findHood(filters.hood)?.name ?? filters.hood,
      clear: { hood: undefined },
    },
    ...filters.types.map((type) => ({
      key: `type-${type}`,
      label: text.types[type],
      clear: { types: filters.types.filter((entry) => entry !== type) },
    })),
    filters.rooms.length > 0 && {
      key: 'rooms',
      label: `${text.filters.rooms}: ${filters.rooms.join(', ')}`,
      clear: { rooms: [] },
    },
    (filters.minPrice !== undefined || filters.maxPrice !== undefined) && {
      key: 'price',
      label: `${filters.minPrice !== undefined ? money(filters.minPrice) : '₺0'} – ${
        filters.maxPrice !== undefined ? money(filters.maxPrice) : '∞'
      }`,
      clear: { minPrice: undefined, maxPrice: undefined },
    },
    (filters.minArea !== undefined || filters.maxArea !== undefined) && {
      key: 'area',
      label: `${filters.minArea ?? 0}–${filters.maxArea ?? '∞'} m²`,
      clear: { minArea: undefined, maxArea: undefined },
    },
    filters.floor && {
      key: 'floor',
      label: text.filters.floors[filters.floor],
      clear: { floor: undefined },
    },
    filters.maxAge !== undefined && {
      key: 'age',
      label: text.filters.ages(filters.maxAge),
      clear: { maxAge: undefined },
    },
    filters.maxDues !== undefined && {
      key: 'dues',
      label: `${text.listing.dues} ≤ ${formatPrice(filters.maxDues, language)}`,
      clear: { maxDues: undefined },
    },
    ...filters.amenities.map((amenity) => ({
      key: `has-${amenity}`,
      label: text.filters.amenity[amenity],
      clear: { amenities: filters.amenities.filter((entry) => entry !== amenity) },
    })),
    filters.saved && { key: 'saved', label: text.filters.saved, clear: { saved: false } },
    filters.bounds && { key: 'bounds', label: text.filters.area_, clear: { bounds: undefined } },
  ]
  const chips = candidates.filter((chip): chip is Chip => Boolean(chip))

  const map = (
    <EstateResultsMap
      listings={pins}
      area={filters.bounds}
      activeId={activeId}
      onHover={setActiveId}
      onSearchArea={(bounds) => {
        update({ bounds })
        setMapOpen(false)
      }}
      standalone={standalone}
    />
  )

  return (
    <EstateSiteShell standalone={standalone} page="listings">
      <section className="estate-search">
        <div className="estate-search__bar">
          {isDesktop ? (
            <EstateQuickFilters
              filters={filters}
              onChange={update}
              activeCount={activeCount}
              onMore={() => setFiltersOpen(true)}
            />
          ) : (
            <Flex gap={8} align="center" justify="space-between">
              <DealSwitch
                value={filters.deal}
                onChange={(deal) => update({ deal, minPrice: undefined, maxPrice: undefined })}
              />
              <Button
                icon={<FilterOutlined aria-hidden="true" />}
                onClick={() => setFiltersOpen(true)}
              >
                {text.filters.title}
                {activeCount > 0 && <span className="estate-count-badge">{activeCount}</span>}
              </Button>
            </Flex>
          )}
        </div>

        <div className={`estate-search__layout${isDesktop ? ' has-map' : ''}`}>
          <div className="estate-search__list" ref={listTop}>
            <Flex
              justify="space-between"
              align="center"
              gap={12}
              wrap
              className="estate-search__head"
            >
              <Typography.Title level={1} className="estate-search__count">
                {text.results.count(results.length, filters.deal)}
                {filters.bounds && (
                  <span className="estate-search__area"> {text.results.inArea}</span>
                )}
              </Typography.Title>
              <Flex gap={8} align="center" wrap>
                <Button
                  aria-pressed={filters.saved}
                  icon={
                    filters.saved ? (
                      <HeartFilled aria-hidden="true" />
                    ) : (
                      <HeartOutlined aria-hidden="true" />
                    )
                  }
                  className={filters.saved ? 'is-set' : undefined}
                  onClick={() => update({ saved: !filters.saved })}
                >
                  {text.results.saved(favourites.length)}
                </Button>
                <Select<SortOption>
                  className="estate-search__sort"
                  aria-label={text.sort.label}
                  value={filters.sort}
                  onChange={(sort) => update({ sort })}
                  options={SORT_OPTIONS.map((option) => ({
                    value: option,
                    label: text.sort.options[option],
                  }))}
                />
              </Flex>
            </Flex>

            {chips.length > 0 && (
              <Flex gap={6} wrap align="center" className="estate-chips">
                {chips.map((chip) => (
                  <Tag
                    key={chip.key}
                    closable
                    variant="filled"
                    className="estate-chip"
                    onClose={(event) => {
                      event.preventDefault()
                      update(chip.clear)
                    }}
                  >
                    {chip.label}
                  </Tag>
                ))}
                <Button type="link" size="small" onClick={clearAll}>
                  {text.filters.clearAll}
                </Button>
              </Flex>
            )}

            {results.length === 0 ? (
              <Empty
                className="estate-empty"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <>
                    <Typography.Text strong>{text.results.emptyTitle}</Typography.Text>
                    <br />
                    <Typography.Text type="secondary">
                      {filters.saved && favourites.length === 0
                        ? text.results.emptySaved
                        : text.results.emptyHint}
                    </Typography.Text>
                  </>
                }
              >
                {activeCount > 0 && <Button onClick={clearAll}>{text.filters.clearAll}</Button>}
              </Empty>
            ) : (
              <div className="estate-grid" ref={trackActiveCard}>
                {shown.map((listing) => (
                  <EstateListingCard
                    key={listing.id}
                    listing={listing}
                    standalone={standalone}
                    active={activeId === listing.id}
                  />
                ))}
              </div>
            )}

            {results.length > PAGE_SIZE && (
              <Pagination
                className="estate-pagination"
                align="center"
                current={page}
                pageSize={PAGE_SIZE}
                total={results.length}
                showSizeChanger={false}
                onChange={goToPage}
              />
            )}

            <div className="estate-search__dock">
              <EstateCompareTray standalone={standalone} />
              {!isDesktop && (
                <Button
                  type="primary"
                  shape="round"
                  size="large"
                  className="estate-search__map-toggle"
                  icon={<EnvironmentOutlined aria-hidden="true" />}
                  onClick={() => setMapOpen(true)}
                >
                  {text.results.showMap}
                </Button>
              )}
            </div>
          </div>

          {isDesktop && <aside className="estate-search__map">{map}</aside>}
        </div>
      </section>

      <Drawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        placement={isDesktop ? 'right' : 'bottom'}
        size={isDesktop ? 420 : '92%'}
        title={isDesktop ? text.filters.moreFilters : text.filters.title}
        rootClassName="estate-drawer"
        extra={
          activeCount > 0 && (
            <Button type="link" onClick={clearAll}>
              {text.filters.clearAll}
            </Button>
          )
        }
        footer={
          <Button type="primary" size="large" block onClick={() => setFiltersOpen(false)}>
            {text.filters.showResults(results.length)}
          </Button>
        }
      >
        <EstateFilterPanel filters={filters} onChange={update} />
      </Drawer>

      {!isDesktop && (
        <Drawer
          open={mapOpen}
          onClose={() => setMapOpen(false)}
          placement="bottom"
          size="100%"
          title={text.results.count(pins.length, filters.deal)}
          rootClassName="estate-drawer estate-drawer--map"
          destroyOnHidden
          extra={
            <Button
              icon={<UnorderedListOutlined aria-hidden="true" />}
              onClick={() => setMapOpen(false)}
            >
              {text.results.showList}
            </Button>
          }
        >
          {map}
        </Drawer>
      )}
    </EstateSiteShell>
  )
}
