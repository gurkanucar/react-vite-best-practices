import { FilterOutlined, SearchOutlined } from '@ant-design/icons'
import {
  Badge,
  Button,
  Drawer,
  Empty,
  Flex,
  Grid,
  Input,
  Pagination,
  Select,
  Typography,
} from 'antd'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import { PetCard } from '@/features/showcases/components/PetsBits'
import { PetsFilters } from '@/features/showcases/components/PetsFilters'
import { PetsSiteShell } from '@/features/showcases/components/PetsSiteShell'
import { pets, petsRoot } from '@/features/showcases/data/pets'
import {
  PET_SORTS,
  countActiveFilters,
  emptyPetFilters,
  filterPets,
  filtersFromParams,
  filtersToParams,
  matchesAtLeast,
  sortFromParams,
  sortPets,
  type PetFilters,
  type PetSort,
} from '@/features/showcases/data/petsMatch'
import { usePetsCopy, usePetsStore } from '@/features/showcases/hooks/usePetsStore'

const PAGE_SIZE = 12

export function PetsListPage({ standalone = false }: { standalone?: boolean }) {
  const { text } = usePetsCopy()
  const root = petsRoot(standalone)
  const wide = Grid.useBreakpoint().lg ?? false
  const [params, setParams] = useSearchParams()
  const [drawer, setDrawer] = useState(false)
  const household = usePetsStore((state) => state.household)
  const filters = useMemo(() => filtersFromParams(params), [params])
  const sort = sortFromParams(params)
  const matchOnly = params.get('match') === '1'
  const page = Math.max(1, Number(params.get('page')) || 1)

  const results = useMemo(() => {
    const found = filterPets(pets, filters)
    return sortPets(
      matchOnly ? found.filter((pet) => matchesAtLeast(pet, household, 60)) : found,
      sort,
    )
  }, [filters, sort, matchOnly, household])
  const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE))
  const current = Math.min(page, pageCount)
  const shown = results.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)

  const update = (next: PetFilters, nextSort: PetSort = sort, nextPage = 1, match = matchOnly) => {
    const search = filtersToParams(next, nextSort, nextPage)
    if (match) search.set('match', '1')
    setParams(search, { replace: true })
  }
  const active = countActiveFilters(filters) + Number(matchOnly)
  const panel = (embedded: boolean) => (
    <PetsFilters
      embedded={embedded}
      filters={filters}
      onChange={(next) => update(next)}
      matchOnly={matchOnly}
      onMatchOnly={(value) => update(filters, sort, 1, value)}
    />
  )

  return (
    <PetsSiteShell standalone={standalone}>
      <section className="pets-listhead">
        <div className="pets-wrap">
          <Typography.Title>{text.list.title}</Typography.Title>
          <Typography.Paragraph type="secondary">{text.list.lead}</Typography.Paragraph>
          <Input
            size="large"
            allowClear
            prefix={<SearchOutlined aria-hidden="true" />}
            placeholder={text.list.searchPlaceholder}
            aria-label={text.list.searchPlaceholder}
            value={filters.query}
            onChange={(event) => update({ ...filters, query: event.target.value })}
            className="pets-listhead__search"
          />
        </div>
      </section>

      <div className="pets-wrap pets-list">
        {wide && <aside className="pets-list__aside">{panel(false)}</aside>}
        <div className="pets-list__main">
          <Flex justify="space-between" align="center" gap={12} wrap className="pets-list__bar">
            <Typography.Text strong aria-live="polite">
              {text.list.results(results.length)}
            </Typography.Text>
            <Flex gap={8} align="center">
              {!wide && (
                <Badge count={active} size="small" color="#e0663e">
                  <Button icon={<FilterOutlined />} onClick={() => setDrawer(true)}>
                    {text.list.filters}
                  </Button>
                </Badge>
              )}
              <Select<PetSort>
                aria-label={text.list.sortLabel}
                value={sort}
                onChange={(value) => update(filters, value)}
                options={PET_SORTS.map((value) => ({ value, label: text.list.sorts[value] }))}
                popupMatchSelectWidth={false}
              />
            </Flex>
          </Flex>

          {shown.length ? (
            <>
              <div className="pets-grid pets-grid--list">
                {shown.map((pet) => (
                  <PetCard key={pet.id} pet={pet} root={root} />
                ))}
              </div>
              {pageCount > 1 && (
                <Pagination
                  className="pets-pagination"
                  current={current}
                  pageSize={PAGE_SIZE}
                  total={results.length}
                  showSizeChanger={false}
                  onChange={(next) => {
                    update(filters, sort, next)
                    window.scrollTo({ top: 0 })
                  }}
                />
              )}
            </>
          ) : (
            <Empty description={text.list.empty} className="pets-empty">
              <Button onClick={() => update({ ...emptyPetFilters }, sort, 1, false)}>
                {text.list.emptyAction}
              </Button>
            </Empty>
          )}
        </div>
      </div>

      {!wide && (
        <Drawer
          open={drawer}
          onClose={() => setDrawer(false)}
          placement="bottom"
          size="85%"
          title={text.list.filters}
          footer={
            <Button type="primary" block onClick={() => setDrawer(false)}>
              {text.list.show(results.length)}
            </Button>
          }
        >
          {panel(true)}
        </Drawer>
      )}
    </PetsSiteShell>
  )
}
