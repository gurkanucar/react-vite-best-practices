import {
  ArrowRightOutlined,
  FilterOutlined,
  GiftOutlined,
  ReloadOutlined,
  SearchOutlined,
  ShopOutlined,
  SwapOutlined,
} from '@ant-design/icons'
import { Badge, Button, Drawer, Empty, Flex, Grid, Input, Select, Tag, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router'
import { ShowcasePreviewFrame } from '@/features/showcases/components'
import { StoreFilterPanel } from '@/features/showcases/components/StoreFilterPanel'
import { StoreProductCard } from '@/features/showcases/components/StoreProductCard'
import { StoreSiteShell } from '@/features/showcases/components/StoreSiteShell'
import {
  findStoreColour,
  findStoreProduct,
  STORE_CATEGORIES,
  storeProducts,
  type StoreCategory,
  type StoreProduct,
} from '@/features/showcases/data/store'
import { productArt } from '@/features/showcases/data/storeArt'
import { formatPrice } from '@/features/showcases/data/storeCart'
import { storeCopy, storeRoot } from '@/features/showcases/data/storeCopy'
import {
  activeFilterCount,
  EMPTY_FILTERS,
  filterProducts,
  filtersToParams,
  parseFilters,
  STORE_SORTS,
  type StoreFilters,
  type StoreSort,
} from '@/features/showcases/data/storeFilters'
import { useStoreCopy } from '@/features/showcases/hooks/useStoreCopy'
import '../showcases.css'
import '../store.css'

interface StoreHomePageProps {
  standalone?: boolean
}

const PAGE_SIZE = 12

const heroPieces = ['anatolia-rug', 'halo-lamp', 'terra-vase']
  .map((id) => findStoreProduct(id))
  .filter((product): product is StoreProduct => Boolean(product))

const categoryArt: Record<StoreCategory, string> = {
  ceramics: productArt('vase', findStoreColour('clay').hex),
  textiles: productArt('cushion', findStoreColour('sage').hex),
  lighting: productArt('lamp', findStoreColour('oat').hex),
  furniture: productArt('chair', findStoreColour('oat').hex),
  home: productArt('candle', findStoreColour('charcoal').hex),
}

const perkIcons = [
  <GiftOutlined key="gift" />,
  <SwapOutlined key="swap" />,
  <ShopOutlined key="shop" />,
]

const scrollToCatalog = () =>
  document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth', block: 'start' })

export function StoreHomePage({ standalone = false }: StoreHomePageProps) {
  const { text, language } = useStoreCopy()
  const root = storeRoot(standalone)
  const { hash } = useLocation()
  const [params, setParams] = useSearchParams()
  const filters = parseFilters(params)
  const results = filterProducts(storeProducts, filters, language)
  const isDesktop = Grid.useBreakpoint().lg ?? false
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [shown, setShown] = useState({ key: params.toString(), count: PAGE_SIZE })
  // A new search starts from the first page again.
  const visibleCount = shown.key === params.toString() ? shown.count : PAGE_SIZE
  const active = activeFilterCount(filters)

  useEffect(() => {
    if (hash === '#catalog') scrollToCatalog()
  }, [hash])

  const update = (next: Partial<StoreFilters>) =>
    setParams(filtersToParams({ ...filters, ...next }), { replace: true })
  const clear = () =>
    setParams(filtersToParams({ ...EMPTY_FILTERS, q: filters.q, sort: filters.sort }))

  const chips: { key: string; label: string; onClose: () => void }[] = [
    ...(filters.category
      ? [
          {
            key: 'category',
            label: text.categories[filters.category],
            onClose: () => update({ category: null, sizes: [] }),
          },
        ]
      : []),
    ...filters.colours.map((id) => ({
      key: `colour-${id}`,
      label: findStoreColour(id).name[language],
      onClose: () => update({ colours: filters.colours.filter((entry) => entry !== id) }),
    })),
    ...filters.sizes.map((size) => ({
      key: `size-${size}`,
      label: size,
      onClose: () => update({ sizes: filters.sizes.filter((entry) => entry !== size) }),
    })),
    ...(filters.min !== null || filters.max !== null
      ? [
          {
            key: 'price',
            label: text.priceRange(
              formatPrice(filters.min ?? 0, language),
              filters.max === null ? '∞' : formatPrice(filters.max, language),
            ),
            onClose: () => update({ min: null, max: null }),
          },
        ]
      : []),
    ...(filters.inStock
      ? [{ key: 'stock', label: text.inStockOnly, onClose: () => update({ inStock: false }) }]
      : []),
    ...(filters.onSale
      ? [{ key: 'sale', label: text.onSaleOnly, onClose: () => update({ onSale: false }) }]
      : []),
    ...(filters.rating !== null
      ? [
          {
            key: 'rating',
            label: `★ ${text.ratingAtLeast(filters.rating)}`,
            onClose: () => update({ rating: null }),
          },
        ]
      : []),
  ]

  const page = (
    <StoreSiteShell standalone={standalone}>
      <section className="store-hero">
        <div className="store-hero__copy">
          <Tag variant="filled" color="green">
            {text.heroEyebrow}
          </Tag>
          <Typography.Title>{text.heroTitle}</Typography.Title>
          <Typography.Paragraph>{text.heroText}</Typography.Paragraph>
          <Flex gap={12} wrap>
            <Button
              type="primary"
              size="large"
              icon={<ArrowRightOutlined aria-hidden="true" />}
              iconPlacement="end"
              onClick={scrollToCatalog}
            >
              {text.heroCta}
            </Button>
            <Button
              size="large"
              onClick={() => {
                update({ onSale: true })
                scrollToCatalog()
              }}
            >
              {text.heroSecondary}
            </Button>
          </Flex>
        </div>
        <div className="store-hero__collage" aria-hidden="true">
          {heroPieces.map((product, index) => (
            <img
              key={product.id}
              className={`store-hero__tile store-hero__tile--${index + 1}`}
              src={productArt(
                product.shape,
                findStoreColour(product.variants[0]!.colour).hex,
                index === 0 ? 'room' : 'front',
              )}
              alt=""
            />
          ))}
          <span className="store-hero__badge">{text.heroBadge}</span>
        </div>
      </section>

      <ul className="store-perks">
        {text.perks.map(([title, detail], index) => (
          <li key={title}>
            <span className="store-perks__icon" aria-hidden="true">
              {perkIcons[index]}
            </span>
            <span>
              <Typography.Text strong>{title}</Typography.Text>
              <Typography.Text type="secondary">{detail}</Typography.Text>
            </span>
          </li>
        ))}
      </ul>

      <nav className="store-categories" aria-label={text.filterCategory}>
        {STORE_CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            className="store-category"
            aria-pressed={filters.category === category}
            onClick={() => {
              update({ category: filters.category === category ? null : category, sizes: [] })
              scrollToCatalog()
            }}
          >
            <img src={categoryArt[category]} alt="" />
            <span>{text.categories[category]}</span>
          </button>
        ))}
      </nav>

      <section className="store-catalog" id="catalog" aria-labelledby="store-catalog-title">
        <Flex justify="space-between" align="end" gap={16} wrap className="store-catalog__head">
          <div>
            <Typography.Title level={2} id="store-catalog-title">
              {filters.category ? text.categories[filters.category] : text.catalogTitle}
            </Typography.Title>
            <Typography.Text type="secondary">{text.resultCount(results.length)}</Typography.Text>
          </div>
          <Flex gap={8} wrap className="store-catalog__tools">
            <Input
              allowClear
              value={filters.q}
              prefix={<SearchOutlined aria-hidden="true" />}
              placeholder={text.searchPlaceholder}
              aria-label={text.searchLabel}
              onChange={(event) => update({ q: event.target.value })}
              className="store-catalog__search"
            />
            <Select<StoreSort>
              value={filters.sort}
              aria-label={text.sortLabel}
              onChange={(sort) => update({ sort })}
              options={STORE_SORTS.map((sort) => ({ value: sort, label: text.sorts[sort] }))}
              className="store-catalog__sort"
            />
            {!isDesktop && (
              <Badge count={active} size="small">
                <Button
                  icon={<FilterOutlined aria-hidden="true" />}
                  onClick={() => setFiltersOpen(true)}
                >
                  {text.filters}
                </Button>
              </Badge>
            )}
          </Flex>
        </Flex>

        {chips.length > 0 && (
          <Flex gap={8} wrap align="center" className="store-catalog__chips">
            {chips.map((chip) => (
              <Tag
                key={chip.key}
                closable
                onClose={(event) => {
                  event.preventDefault()
                  chip.onClose()
                }}
              >
                {chip.label}
              </Tag>
            ))}
            <Button type="link" size="small" onClick={clear}>
              {text.clearFilters}
            </Button>
          </Flex>
        )}

        <div className="store-catalog__layout">
          {isDesktop && (
            <aside className="store-catalog__aside">
              <StoreFilterPanel filters={filters} onChange={update} onClear={clear} />
            </aside>
          )}

          <div className="store-catalog__results">
            {results.length === 0 ? (
              <Empty
                className="store-catalog__empty"
                description={
                  <>
                    <Typography.Text strong>{text.emptyTitle}</Typography.Text>
                    <br />
                    <Typography.Text type="secondary">{text.emptyText}</Typography.Text>
                  </>
                }
              >
                <Button icon={<ReloadOutlined aria-hidden="true" />} onClick={() => setParams({})}>
                  {text.clearFilters}
                </Button>
              </Empty>
            ) : (
              <>
                <div className="store-grid">
                  {results.slice(0, visibleCount).map((product) => (
                    <StoreProductCard key={product.id} product={product} root={root} />
                  ))}
                </div>
                {results.length > visibleCount && (
                  <Flex vertical align="center" gap={8} className="store-catalog__more">
                    <Typography.Text type="secondary">
                      {text.showing(visibleCount, results.length)}
                    </Typography.Text>
                    <Button
                      size="large"
                      onClick={() =>
                        setShown({ key: params.toString(), count: visibleCount + PAGE_SIZE })
                      }
                    >
                      {text.loadMore}
                    </Button>
                  </Flex>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {!isDesktop && (
        <Drawer
          open={filtersOpen}
          onClose={() => setFiltersOpen(false)}
          placement="left"
          size="85%"
          title={text.filters}
          rootClassName="store-drawer"
          footer={
            <Button type="primary" size="large" block onClick={() => setFiltersOpen(false)}>
              {text.showResults(results.length)}
            </Button>
          }
        >
          <StoreFilterPanel filters={filters} onChange={update} onClear={clear} showTitle={false} />
        </Drawer>
      )}
    </StoreSiteShell>
  )

  return (
    <ShowcasePreviewFrame
      standalone={standalone}
      standalonePath="/preview/store"
      title={{ en: storeCopy.en.previewTitle, tr: storeCopy.tr.previewTitle }}
      description={{ en: storeCopy.en.previewDescription, tr: storeCopy.tr.previewDescription }}
    >
      {page}
    </ShowcasePreviewFrame>
  )
}
