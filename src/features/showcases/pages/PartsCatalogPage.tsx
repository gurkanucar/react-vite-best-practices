import { AppstoreOutlined, BarsOutlined, FilterOutlined, InboxOutlined } from '@ant-design/icons'
import {
  Breadcrumb,
  Button,
  Checkbox,
  Drawer,
  Empty,
  Flex,
  Grid,
  Pagination,
  Radio,
  Segmented,
  Select,
  Slider,
  Switch,
  Typography,
} from 'antd'
import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { PartCard } from '@/features/showcases/components/PartsBits'
import { PartsSiteShell } from '@/features/showcases/components/PartsSiteShell'
import {
  brands,
  categoryIds,
  categoryNames,
  filterCatalog,
  positionFilters,
  sortOptions,
  type CatalogFilters,
  type PositionFilter,
  type SortOption,
} from '@/features/showcases/data/partsCatalog'
import { formatTry } from '@/features/showcases/data/partsCommerce'
import { partsRoot } from '@/features/showcases/data/partsCopy'
import { shortCarName, type Vehicle } from '@/features/showcases/data/partsVehicles'
import { usePartsCopy } from '@/features/showcases/hooks/usePartsCopy'
import { useActiveVehicle } from '@/features/showcases/hooks/usePartsStore'

interface PartsCatalogPageProps {
  standalone?: boolean
}

const PAGE_SIZE = 24

const isOneOf = <T extends string>(options: readonly T[], value: string | null): value is T =>
  value !== null && (options as readonly string[]).includes(value)

const numberParam = (value: string | null) => {
  if (value === null || value === '') return undefined
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined
}

/** The address holds every filter, so a filtered list can be bookmarked or sent on. */
function readParams(params: URLSearchParams, vehicle: Vehicle | undefined) {
  const category = params.get('category')
  const position = params.get('pos')
  const sort = params.get('sort')
  const brandIds = new Set(brands.map((brand) => brand.id))
  const showAll = params.get('fit') === 'all'
  const filters: CatalogFilters = {
    query: params.get('q') ?? '',
    category: isOneOf(categoryIds, category) ? category : undefined,
    brands: (params.get('brand') ?? '').split(',').filter((id) => brandIds.has(id)),
    minPrice: numberParam(params.get('min')),
    maxPrice: numberParam(params.get('max')),
    inStock: params.get('stock') === '1',
    position: isOneOf(positionFilters, position) ? position : undefined,
    vehicle: showAll ? undefined : vehicle,
    sort: isOneOf(sortOptions, sort) ? sort : 'relevance',
  }
  return {
    filters,
    showAll,
    view: params.get('view') === 'list' ? ('list' as const) : ('grid' as const),
    page: Math.max(1, Math.floor(numberParam(params.get('page')) ?? 1)),
  }
}

interface FilterPanelProps {
  filters: CatalogFilters
  priceRange: [number, number]
  update: (changes: Record<string, string | undefined>) => void
}

function FilterPanel({ filters, priceRange, update }: FilterPanelProps) {
  const { text, language } = usePartsCopy()
  const [low, high] = priceRange
  const current: [number, number] = [
    Math.max(filters.minPrice ?? low, low),
    Math.min(filters.maxPrice ?? high, high),
  ]
  // The slider moves freely and only filters when let go.
  const [draft, setDraft] = useState<[number, number] | null>(null)
  const shown = draft ?? current
  const active =
    filters.category ||
    filters.brands.length > 0 ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.inStock ||
    filters.position

  return (
    <div className="parts-filters">
      <section>
        <Typography.Title level={5}>{text.catalog.category}</Typography.Title>
        <Radio.Group
          className="parts-filters__radios"
          value={filters.category ?? ''}
          onChange={(event) =>
            update({ category: (event.target.value as string) || undefined, brand: undefined })
          }
          options={[
            { value: '', label: text.catalog.allCategories },
            ...categoryIds.map((id) => ({ value: id, label: categoryNames[id][language] })),
          ]}
        />
      </section>
      <section>
        <Typography.Title level={5}>{text.catalog.brand}</Typography.Title>
        <Checkbox.Group
          className="parts-filters__checks"
          value={filters.brands}
          onChange={(values) => update({ brand: values.length ? values.join(',') : undefined })}
          options={brands.map((brand) => ({ value: brand.id, label: brand.name }))}
        />
      </section>
      <section>
        <Typography.Title level={5}>{text.catalog.price}</Typography.Title>
        <Slider
          range
          min={low}
          max={high}
          step={10}
          value={shown}
          aria-label={text.catalog.price}
          tooltip={{ formatter: (value) => formatTry(value ?? 0, language) }}
          onChange={(value) => setDraft(value as [number, number])}
          onChangeComplete={(value) => {
            const [min, max] = value as [number, number]
            setDraft(null)
            update({
              min: min > low ? String(min) : undefined,
              max: max < high ? String(max) : undefined,
            })
          }}
        />
        <Flex justify="space-between">
          <Typography.Text type="secondary">{formatTry(shown[0], language)}</Typography.Text>
          <Typography.Text type="secondary">{formatTry(shown[1], language)}</Typography.Text>
        </Flex>
      </section>
      <section>
        <Typography.Title level={5}>{text.catalog.position}</Typography.Title>
        <Segmented<PositionFilter | ''>
          block
          value={filters.position ?? ''}
          onChange={(value) => update({ pos: value || undefined })}
          options={[
            { value: '', label: '—' },
            ...positionFilters.map((value) => ({
              value,
              label: text.catalog.positions[value],
            })),
          ]}
        />
      </section>
      <section>
        <Typography.Title level={5}>{text.catalog.availability}</Typography.Title>
        <Checkbox
          checked={filters.inStock}
          onChange={(event) => update({ stock: event.target.checked ? '1' : undefined })}
        >
          {text.catalog.inStockOnly}
        </Checkbox>
      </section>
      {active && (
        <Button
          block
          onClick={() =>
            update({
              category: undefined,
              brand: undefined,
              min: undefined,
              max: undefined,
              stock: undefined,
              pos: undefined,
            })
          }
        >
          {text.catalog.clear}
        </Button>
      )}
    </div>
  )
}

export function PartsCatalogPage({ standalone = false }: PartsCatalogPageProps) {
  const { text, language } = usePartsCopy()
  const root = partsRoot(standalone)
  const vehicle = useActiveVehicle()
  const [params, setParams] = useSearchParams()
  const isDesktop = Grid.useBreakpoint().lg ?? false
  const [filtersOpen, setFiltersOpen] = useState(false)
  const { filters, showAll, view, page } = useMemo(
    () => readParams(params, vehicle),
    [params, vehicle],
  )

  const results = useMemo(() => filterCatalog(filters), [filters])
  // The price bounds follow the other filters, so the slider always spans parts on offer.
  const priceRange = useMemo<[number, number]>(() => {
    const unpriced = filterCatalog({
      ...filters,
      minPrice: undefined,
      maxPrice: undefined,
      sort: 'relevance',
    })
    if (unpriced.length === 0) return [0, 100]
    const prices = unpriced.map((part) => part.price)
    return [Math.floor(Math.min(...prices) / 10) * 10, Math.ceil(Math.max(...prices) / 10) * 10]
  }, [filters])

  const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const shown = results.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const update = (changes: Record<string, string | undefined>, keepPage = false) => {
    const next = new URLSearchParams(params)
    for (const [key, value] of Object.entries(changes)) {
      if (value === undefined) next.delete(key)
      else next.set(key, value)
    }
    if (!keepPage) next.delete('page')
    setParams(next, { replace: true })
  }

  const title = filters.query
    ? text.catalog.searchFor(filters.query)
    : filters.category
      ? categoryNames[filters.category][language]
      : text.catalog.title

  const panel = <FilterPanel filters={filters} priceRange={priceRange} update={update} />

  return (
    <PartsSiteShell standalone={standalone}>
      <div className="parts-section parts-catalog">
        <Breadcrumb
          className="parts-breadcrumb"
          items={[
            { title: <Link to={root}>{text.product.home}</Link> },
            filters.category
              ? { title: <Link to={`${root}/catalog`}>{text.product.catalog}</Link> }
              : { title: text.product.catalog },
            ...(filters.category ? [{ title: categoryNames[filters.category][language] }] : []),
          ]}
        />
        <div className="parts-catalog__layout">
          {isDesktop && <aside className="parts-catalog__aside">{panel}</aside>}

          <div className="parts-results" id="parts-results">
            <div className="parts-results__head">
              <div>
                <Typography.Title level={2} className="parts-results__title">
                  {title}
                </Typography.Title>
                <Typography.Text type="secondary">
                  {text.catalog.results(results.length)}
                </Typography.Text>
              </div>
              <Flex gap={8} wrap align="center" className="parts-results__controls">
                {!isDesktop && (
                  <Button icon={<FilterOutlined />} onClick={() => setFiltersOpen(true)}>
                    {text.catalog.filters}
                  </Button>
                )}
                <Select<SortOption>
                  value={filters.sort}
                  aria-label={text.catalog.sort}
                  className="parts-results__sort"
                  onChange={(value) => update({ sort: value === 'relevance' ? undefined : value })}
                  options={sortOptions.map((value) => ({
                    value,
                    label: text.catalog.sorts[value],
                  }))}
                />
                <Segmented<'grid' | 'list'>
                  value={view}
                  aria-label={text.catalog.view}
                  onChange={(value) =>
                    update({ view: value === 'list' ? 'list' : undefined }, true)
                  }
                  options={[
                    { value: 'grid', icon: <AppstoreOutlined />, title: text.catalog.grid },
                    { value: 'list', icon: <BarsOutlined />, title: text.catalog.list },
                  ]}
                />
              </Flex>
            </div>

            {vehicle && (
              <div className="parts-results__car">
                <Typography.Text>
                  {showAll ? text.catalog.showAll : text.catalog.forCar(shortCarName(vehicle))}
                </Typography.Text>
                <Switch
                  checked={!showAll}
                  aria-label={text.catalog.showFitting}
                  onChange={(checked) => update({ fit: checked ? undefined : 'all' })}
                />
                <Typography.Text type="secondary">{text.catalog.showFitting}</Typography.Text>
              </div>
            )}

            {shown.length === 0 ? (
              <Empty
                image={<InboxOutlined className="parts-empty__icon" />}
                description={
                  <>
                    <Typography.Title level={4}>{text.catalog.emptyTitle}</Typography.Title>
                    <Typography.Text type="secondary">{text.catalog.emptyText}</Typography.Text>
                  </>
                }
              >
                <Flex gap={8} justify="center" wrap>
                  <Button onClick={() => setParams(new URLSearchParams(), { replace: true })}>
                    {text.catalog.clear}
                  </Button>
                  {vehicle && !showAll && (
                    <Button type="primary" onClick={() => update({ fit: 'all' })}>
                      {text.catalog.showAll}
                    </Button>
                  )}
                </Flex>
              </Empty>
            ) : (
              <div className={view === 'list' ? 'parts-list' : 'parts-grid parts-grid--catalog'}>
                {shown.map((part) => (
                  <PartCard key={part.id} part={part} root={root} vehicle={vehicle} layout={view} />
                ))}
              </div>
            )}

            {results.length > PAGE_SIZE && (
              <Pagination
                className="parts-pagination"
                current={currentPage}
                pageSize={PAGE_SIZE}
                total={results.length}
                showSizeChanger={false}
                onChange={(next) => {
                  update({ page: next > 1 ? String(next) : undefined }, true)
                  document.getElementById('parts-results')?.scrollIntoView({ block: 'start' })
                }}
              />
            )}
          </div>
        </div>
      </div>

      {!isDesktop && (
        <Drawer
          open={filtersOpen}
          onClose={() => setFiltersOpen(false)}
          title={text.catalog.filters}
          placement="left"
          footer={
            <Button type="primary" block size="large" onClick={() => setFiltersOpen(false)}>
              {text.catalog.applyFilters(results.length)}
            </Button>
          }
        >
          {panel}
        </Drawer>
      )}
    </PartsSiteShell>
  )
}
