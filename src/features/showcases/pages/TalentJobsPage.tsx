import { BellOutlined, FilterOutlined, SearchOutlined, ThunderboltFilled } from '@ant-design/icons'
import {
  App,
  Badge,
  Button,
  Drawer,
  Empty,
  Flex,
  Grid,
  Pagination,
  Select,
  Tag,
  Typography,
} from 'antd'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'
import { BookmarkIcon } from '@/features/showcases/components/CareersIcons'
import { JobCard } from '@/features/showcases/components/CareersBits'
import { CareersFilterFields } from '@/features/showcases/components/CareersFilters'
import { CareersJobDetail } from '@/features/showcases/components/CareersJobDetail'
import { CareersSavedDrawer } from '@/features/showcases/components/CareersSavedDrawer'
import { CareersKeywordInput } from '@/features/showcases/components/CareersSearchBar'
import { CareersSiteShell } from '@/features/showcases/components/CareersSiteShell'
import {
  CITY_NAMES,
  JOB_LOCATIONS,
  WORK_MODES,
  careersRoot,
} from '@/features/showcases/data/careers'
import {
  POSTED_WITHIN,
  SORT_MODES,
  activeFilterCount,
  describeSearch,
  emptyFilters,
  filtersToParams,
  parseFilters,
  searchJobs,
  type JobFilters,
} from '@/features/showcases/data/careersSearch'
import { useCareersCopy } from '@/features/showcases/hooks/useCareersCopy'
import { useCareersJobs, useCareersStore } from '@/features/showcases/hooks/useCareersStore'

interface TalentJobsPageProps {
  standalone?: boolean
}

const PAGE_SIZE = 10

export function TalentJobsPage({ standalone = false }: TalentJobsPageProps) {
  const root = careersRoot(standalone)
  const { text, language } = useCareersCopy()
  const { message } = App.useApp()
  const [params, setParams] = useSearchParams()
  // Two panes need a wide window: inside the admin frame there is a sidebar beside them.
  const split = Grid.useBreakpoint().xl ?? false
  const { published, find } = useCareersJobs()
  const profileSkills = useCareersStore((state) => state.profile.skills)
  const savedCount = useCareersStore((state) => state.savedJobs.length)
  const alertCount = useCareersStore((state) => state.alerts.length)
  const addAlert = useCareersStore((state) => state.addAlert)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [drawer, setDrawer] = useState<'saved' | 'alerts' | null>(null)

  const filters = useMemo(() => parseFilters(params), [params])
  const results = useMemo(
    () => searchJobs(filters, profileSkills, published),
    [filters, profileSkills, published],
  )
  const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE))
  const page = Math.min(Math.max(1, Number(params.get('page')) || 1), pageCount)
  const shown = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const selected = find(params.get('job')) ?? shown[0]
  const [keyword, setKeyword] = useState(filters.q)
  const [lastQ, setLastQ] = useState(filters.q)
  // A search from elsewhere (an alert, the back button) refills the box.
  if (lastQ !== filters.q) {
    setLastQ(filters.q)
    setKeyword(filters.q)
  }

  /** Every filter change starts again from the first page and forgets the selected job. */
  const update = (patch: Partial<JobFilters>) => {
    setParams(filtersToParams({ ...filters, ...patch }), { replace: true })
  }

  const setPage = (next: number) => {
    const nextParams = new URLSearchParams(params)
    nextParams.set('page', String(next))
    nextParams.delete('job')
    setParams(nextParams)
    document.querySelector('.careers-results')?.scrollIntoView({ block: 'start' })
  }

  const select = (jobId: string) => {
    const nextParams = new URLSearchParams(params)
    nextParams.set('job', jobId)
    setParams(nextParams, { replace: true })
    document.querySelector('.careers-split__detail')?.scrollTo({ top: 0 })
  }

  const createAlert = () => {
    const created = addAlert(filtersToParams({ ...filters, sort: 'relevance' }).toString())
    if (created) void message.success(text.jobs.alertCreated)
    else void message.info(text.jobs.alertExists)
  }

  const count = activeFilterCount(filters)
  const toggleMode = (mode: (typeof WORK_MODES)[number]) =>
    update({
      modes: filters.modes.includes(mode)
        ? filters.modes.filter((item) => item !== mode)
        : [...filters.modes, mode],
    })

  return (
    <CareersSiteShell standalone={standalone}>
      <section className="careers-jobs">
        <div className="careers-jobs__toolbar">
          <search>
            <form
              className="careers-jobs__search"
              onSubmit={(event) => {
                event.preventDefault()
                update({ q: keyword })
              }}
            >
              <div className="careers-jobs__keyword">
                <CareersKeywordInput
                  size="middle"
                  value={keyword}
                  onChange={setKeyword}
                  onSubmit={(value) => {
                    setKeyword(value)
                    update({ q: value })
                  }}
                />
              </div>
              <Select
                allowClear
                className="careers-jobs__location"
                aria-label={text.home.location}
                placeholder={text.home.anyLocation}
                value={filters.location}
                onChange={(location) => update({ location })}
                options={JOB_LOCATIONS.map((value) => ({
                  value,
                  label: CITY_NAMES[language][value],
                }))}
              />
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                {text.home.search}
              </Button>
            </form>
          </search>

          <Flex gap={8} wrap align="center" className="careers-jobs__quick">
            {split &&
              WORK_MODES.map((mode) => (
                <Tag.CheckableTag
                  key={mode}
                  checked={filters.modes.includes(mode)}
                  onChange={() => toggleMode(mode)}
                  className="careers-chip"
                >
                  {text.modes[mode]}
                </Tag.CheckableTag>
              ))}
            {split && (
              <Tag.CheckableTag
                checked={filters.easy}
                onChange={(easy) => update({ easy })}
                className="careers-chip"
              >
                <ThunderboltFilled aria-hidden="true" /> {text.common.easyApply}
              </Tag.CheckableTag>
            )}
            {split && (
              <Select
                allowClear
                size="small"
                className="careers-jobs__posted"
                aria-label={text.jobs.posted}
                placeholder={text.jobs.posted}
                value={filters.posted}
                onChange={(posted) => update({ posted })}
                options={POSTED_WITHIN.map((value) => ({ value, label: text.posted[value] }))}
              />
            )}
            <Badge count={count} size="small" color="#1f5eff">
              <Button icon={<FilterOutlined />} onClick={() => setFiltersOpen(true)}>
                {text.jobs.filters}
              </Button>
            </Badge>
            <Select
              className="careers-jobs__sort"
              aria-label={text.jobs.sortLabel}
              value={filters.sort}
              onChange={(sort) => update({ sort })}
              options={SORT_MODES.map((value) => ({ value, label: text.sort[value] }))}
            />
            <span className="careers-jobs__spacer" />
            <Button icon={<BookmarkIcon />} onClick={() => setDrawer('saved')}>
              {text.jobs.saved(savedCount)}
            </Button>
            <Button icon={<BellOutlined />} onClick={() => setDrawer('alerts')}>
              {text.jobs.alerts(alertCount)}
            </Button>
          </Flex>
        </div>

        <Flex justify="space-between" align="center" gap={8} wrap className="careers-results">
          <div>
            <Typography.Title level={2} className="careers-results__title">
              {text.jobs.resultsTitle(results.length, filters.q)}
            </Typography.Title>
            <Typography.Text type="secondary">
              {describeSearch(filters, text, language)}
            </Typography.Text>
          </div>
          <Flex gap={8} wrap>
            {(count > 0 || filters.q) && (
              <Button onClick={() => setParams(filtersToParams(emptyFilters))}>
                {text.jobs.clear}
              </Button>
            )}
            <Button type="primary" ghost icon={<BellOutlined />} onClick={createAlert}>
              {text.jobs.createAlert}
            </Button>
          </Flex>
        </Flex>

        {results.length === 0 ? (
          <Empty
            className="careers-empty"
            description={
              <>
                <Typography.Title level={4}>{text.jobs.emptyTitle}</Typography.Title>
                <Typography.Text type="secondary">{text.jobs.emptyText}</Typography.Text>
              </>
            }
          >
            <Button onClick={() => setParams(filtersToParams(emptyFilters))}>
              {text.jobs.clear}
            </Button>
          </Empty>
        ) : (
          <div className={split ? 'careers-split' : undefined}>
            <div className="careers-split__list">
              <div className="careers-list">
                {shown.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    href={`${root}/jobs/${job.id}`}
                    selected={split && job.id === selected?.id}
                    onSelect={split ? (picked) => select(picked.id) : undefined}
                  />
                ))}
              </div>
              {pageCount > 1 && (
                <Pagination
                  className="careers-pagination"
                  current={page}
                  pageSize={PAGE_SIZE}
                  total={results.length}
                  showSizeChanger={false}
                  onChange={setPage}
                  size={split ? undefined : 'small'}
                />
              )}
            </div>
            {split && (
              <aside className="careers-split__detail" aria-label={text.nav.jobs}>
                {selected ? (
                  <CareersJobDetail key={selected.id} job={selected} root={root} pane />
                ) : (
                  <Empty description={text.jobs.selectPrompt} />
                )}
              </aside>
            )}
          </div>
        )}
      </section>

      <Drawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title={text.jobs.filters}
        placement={split ? 'right' : 'bottom'}
        size={split ? 'default' : 'large'}
        className="careers-filter-drawer"
        extra={
          count > 0 && (
            <Button
              type="link"
              onClick={() => update({ ...emptyFilters, q: filters.q, sort: filters.sort })}
            >
              {text.jobs.clear}
            </Button>
          )
        }
        footer={
          <Button type="primary" block size="large" onClick={() => setFiltersOpen(false)}>
            {text.jobs.showResults(results.length)}
          </Button>
        }
      >
        <CareersFilterFields filters={filters} onChange={update} />
      </Drawer>

      <CareersSavedDrawer
        open={drawer !== null}
        tab={drawer ?? 'saved'}
        onTabChange={setDrawer}
        onClose={() => setDrawer(null)}
        root={root}
      />
    </CareersSiteShell>
  )
}
