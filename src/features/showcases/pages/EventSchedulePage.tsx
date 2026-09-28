import {
  CalendarOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  LinkOutlined,
  StarOutlined,
} from '@ant-design/icons'
import {
  Alert,
  App,
  Button,
  Empty,
  Flex,
  Grid,
  Input,
  Popconfirm,
  Segmented,
  Select,
  Tabs,
  Typography,
} from 'antd'
import { useSearchParams } from 'react-router'
import { SessionCard } from '@/features/showcases/components/ConfParts'
import { ConfScheduleGrid } from '@/features/showcases/components/ConfScheduleGrid'
import { ConfSessionDrawer } from '@/features/showcases/components/ConfSessionDrawer'
import { ConfSiteShell } from '@/features/showcases/components/ConfSiteShell'
import { downloadFile } from '@/features/showcases/components/confFormat'
import {
  CONF_DAYS,
  CONF_FORMATS,
  CONF_LEVELS,
  CONF_TRACKS,
  confRoot,
  confSessions,
  findSession,
  type ConfSession,
} from '@/features/showcases/data/confData'
import { buildIcs, icsFileName } from '@/features/showcases/data/confIcs'
import {
  agendaParam,
  dayLayout,
  findConflicts,
  hasFilters,
  liveState,
  matchesFilters,
  parseAgendaParam,
  parseFilters,
  parseNowOverride,
  sortSessions,
} from '@/features/showcases/data/confSchedule'
import { useConfAgenda } from '@/features/showcases/hooks/useConfAgenda'
import { useConfNow } from '@/features/showcases/hooks/useConfNow'
import { useConfText } from '@/features/showcases/hooks/useConfText'

interface EventSchedulePageProps {
  standalone?: boolean
}

type View = 'grid' | 'list' | 'agenda'

const DAY_MS = 86_400_000

/**
 * The program: a timetable per day on a wide screen and a list on a phone, filters and the
 * open session kept in the address, and "My agenda" with clash warnings, a calendar export
 * and a link to share it.
 */
export function EventSchedulePage({ standalone = false }: EventSchedulePageProps) {
  const { text, language } = useConfText()
  const { message } = App.useApp()
  const root = confRoot(standalone)
  const [params, setParams] = useSearchParams()
  const desktop = Grid.useBreakpoint().lg ?? false
  const now = useConfNow(30_000, parseNowOverride(params.get('now')))
  const live = liveState(now)
  const starred = useConfAgenda((state) => state.starred)
  const addToAgenda = useConfAgenda((state) => state.add)
  const clearAgenda = useConfAgenda((state) => state.clear)

  const filters = parseFilters(params)
  const dayParam = Number(params.get('day'))
  const day =
    params.has('day') && CONF_DAYS.some((entry) => entry.index === dayParam)
      ? dayParam
      : live.phase === 'during'
        ? live.day
        : 0
  const requested = params.get('view')
  const view: View =
    requested === 'agenda' ? 'agenda' : requested === 'list' || !desktop ? 'list' : 'grid'
  const shared = parseAgendaParam(params.get('agenda'))
  const sharedNew = shared.filter((id) => !starred.includes(id))
  const open = findSession(params.get('session') ?? '')

  const update = (changes: Record<string, string | null>) =>
    setParams(
      (previous) => {
        const next = new URLSearchParams(previous)
        for (const [key, value] of Object.entries(changes)) {
          if (value === null || value === '') next.delete(key)
          else next.set(key, value)
        }
        return next
      },
      { replace: true },
    )

  const starredSessions = starred
    .map((id) => findSession(id))
    .filter((session): session is ConfSession => session !== undefined)
  const conflicts = findConflicts(starredSessions)
  const clashMap = new Map<string, ConfSession[]>()
  for (const [a, b] of conflicts) {
    clashMap.set(a.id, [...(clashMap.get(a.id) ?? []), b])
    clashMap.set(b.id, [...(clashMap.get(b.id) ?? []), a])
  }

  const layout = dayLayout(day)
  const daySessions = sortSessions(confSessions.filter((session) => session.day === day))
  const shown = daySessions.filter((session) => matchesFilters(session, filters))
  const visible = new Set(shown.map((session) => session.id))
  const matchCount = shown.filter((session) => session.format !== 'break').length
  const liveIds = new Set(live.phase === 'during' ? live.now.map((session) => session.id) : [])

  const openSession = (id: string) => update({ session: id })

  const exportAgenda = () => {
    downloadFile(
      icsFileName(starredSessions),
      buildIcs(starredSessions, {
        language,
        now,
        url: `${window.location.origin}${root}/schedule`,
      }),
    )
    void message.success(text.schedule.exported)
  }

  const shareAgenda = async () => {
    const url = `${window.location.origin}${root}/schedule?view=agenda&agenda=${agendaParam(starred)}`
    try {
      await navigator.clipboard.writeText(url)
      void message.success(text.schedule.linkCopied)
    } catch {
      void message.warning(text.schedule.copyFailed)
    }
  }

  const acceptShared = () => {
    const added = addToAgenda(shared)
    void message.success(text.schedule.sharedAdded(added))
    update({ agenda: null, view: 'agenda' })
  }

  const liveBanner = (
    <div className={`conf-live conf-live--${live.phase}`}>
      {live.phase === 'before' && (
        <Typography.Text>
          <ClockCircleOutlined aria-hidden="true" />{' '}
          {text.schedule.liveBefore(Math.ceil(live.startsIn / DAY_MS))}
        </Typography.Text>
      )}
      {live.phase === 'during' && (
        <Flex gap={24} wrap>
          <div>
            <Typography.Text strong className="conf-live__label">
              <span className="conf-live__dot" aria-hidden="true" /> {text.schedule.liveNow}
            </Typography.Text>
            <ul>
              {live.now.length === 0 ? (
                <li>{text.schedule.nothingNow}</li>
              ) : (
                live.now.map((session) => (
                  <li key={session.id}>
                    <button type="button" onClick={() => openSession(session.id)}>
                      {session.title[language]}
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
          {live.next.length > 0 && (
            <div>
              <Typography.Text strong className="conf-live__label">
                {text.schedule.upNext} · {live.next[0]!.start}
              </Typography.Text>
              <ul>
                {live.next.map((session) => (
                  <li key={session.id}>
                    <button type="button" onClick={() => openSession(session.id)}>
                      {session.title[language]}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Flex>
      )}
      {live.phase === 'after' && <Typography.Text>{text.schedule.liveAfter}</Typography.Text>}
    </div>
  )

  const dayList = () => {
    if (matchCount === 0) {
      return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={text.schedule.noMatches} />
    }
    const groups = new Map<string, ConfSession[]>()
    for (const session of shown)
      groups.set(session.start, [...(groups.get(session.start) ?? []), session])

    return (
      <ol className="conf-list">
        {[...groups.entries()].map(([start, sessions]) => (
          <li key={start} className="conf-list__slot">
            <span className="conf-list__time">{start}</span>
            <div className="conf-list__sessions">
              {sessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  onOpen={openSession}
                  clashesWith={clashMap.get(session.id)?.[0]}
                  live={liveIds.has(session.id)}
                />
              ))}
            </div>
          </li>
        ))}
      </ol>
    )
  }

  const agenda = () => {
    if (starredSessions.length === 0) {
      return (
        <Empty
          image={<StarOutlined className="conf-agenda__empty-icon" aria-hidden="true" />}
          description={text.schedule.agendaEmpty}
        >
          <Button type="primary" onClick={() => update({ view: null })}>
            {text.home.program}
          </Button>
        </Empty>
      )
    }

    return (
      <Flex vertical gap={20}>
        <Flex justify="space-between" align="center" gap={12} wrap>
          <Typography.Text strong>
            {text.schedule.agendaCount(starredSessions.length)}
          </Typography.Text>
          <Flex gap={8} wrap>
            <Button icon={<CalendarOutlined aria-hidden="true" />} onClick={exportAgenda}>
              {text.schedule.exportAgenda}
            </Button>
            <Button icon={<LinkOutlined aria-hidden="true" />} onClick={() => void shareAgenda()}>
              {text.schedule.shareAgenda}
            </Button>
            <Popconfirm title={text.schedule.clearAgenda} onConfirm={clearAgenda}>
              <Button danger icon={<DeleteOutlined aria-hidden="true" />}>
                {text.schedule.clearAgenda}
              </Button>
            </Popconfirm>
          </Flex>
        </Flex>

        {conflicts.length > 0 && (
          <Alert type="warning" showIcon title={text.schedule.conflictAlert(conflicts.length)} />
        )}

        {CONF_DAYS.map((entry) => {
          const ofDay = starredSessions.filter((session) => session.day === entry.index)
          if (ofDay.length === 0) return null
          return (
            <section key={entry.index} className="conf-agenda__day">
              <Typography.Title level={4}>
                {text.days[entry.index]?.name} · {text.days[entry.index]?.short}
              </Typography.Title>
              <Flex vertical gap={12}>
                {ofDay.map((session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    onOpen={openSession}
                    clashesWith={clashMap.get(session.id)?.[0]}
                    live={liveIds.has(session.id)}
                  />
                ))}
              </Flex>
            </section>
          )
        })}
      </Flex>
    )
  }

  const selectFilter = <T extends string>(
    key: 'track' | 'level' | 'format',
    label: string,
    values: T[],
    options: readonly T[],
    names: Record<T, string>,
  ) => (
    <Select<T[]>
      mode="multiple"
      allowClear
      aria-label={label}
      placeholder={label}
      value={values}
      maxTagCount="responsive"
      className="conf-filters__select"
      options={options.map((value) => ({ value, label: names[value] }))}
      onChange={(next) => update({ [key]: next.join(',') })}
    />
  )

  return (
    <ConfSiteShell
      standalone={standalone}
      title={{ en: 'Conference program', tr: 'Konferans programı' }}
      description={{
        en: 'A multi-track timetable with filters, a personal agenda, clash warnings and calendar export.',
        tr: 'Filtreli, çok salonlu zaman çizelgesi; kişisel ajanda, çakışma uyarısı ve takvime aktarma.',
      }}
    >
      <section className="showcase-section conf-page-head">
        <Typography.Title>{text.schedule.title}</Typography.Title>
        <Typography.Paragraph type="secondary">{text.schedule.description}</Typography.Paragraph>
        {liveBanner}
      </section>

      <section className="showcase-section conf-schedule" aria-label={text.schedule.title}>
        {sharedNew.length > 0 && (
          <Alert
            type="info"
            showIcon
            className="conf-shared"
            title={text.schedule.sharedTitle(shared.length)}
            description={
              <ul className="conf-shared__list">
                {shared.map((id) => {
                  const session = findSession(id)
                  return session ? <li key={id}>{session.title[language]}</li> : null
                })}
              </ul>
            }
            action={
              <Flex vertical gap={8}>
                <Button type="primary" size="small" onClick={acceptShared}>
                  {text.schedule.sharedAdd}
                </Button>
                <Button size="small" onClick={() => update({ agenda: null })}>
                  {text.schedule.sharedDismiss}
                </Button>
              </Flex>
            }
          />
        )}

        <Flex justify="space-between" align="center" gap={12} wrap className="conf-schedule__bar">
          {view === 'agenda' ? (
            <Typography.Title level={3} className="conf-schedule__agenda-title">
              {text.schedule.views.agenda}
            </Typography.Title>
          ) : (
            <Tabs
              activeKey={String(day)}
              onChange={(key) => update({ day: key })}
              className="conf-days"
              items={CONF_DAYS.map((entry) => ({
                key: String(entry.index),
                label: (
                  <span className="conf-days__tab">
                    <strong>{text.days[entry.index]?.short}</strong>
                    <span>{text.days[entry.index]?.name}</span>
                  </span>
                ),
              }))}
            />
          )}
          <Segmented<View>
            value={view}
            onChange={(next) =>
              update({ view: next === (desktop ? 'grid' : 'list') ? null : next })
            }
            options={[
              ...(desktop ? [{ value: 'grid' as View, label: text.schedule.views.grid }] : []),
              { value: 'list', label: text.schedule.views.list },
              {
                value: 'agenda',
                label: `${text.schedule.views.agenda} (${starred.length})`,
              },
            ]}
          />
        </Flex>

        {view !== 'agenda' && (
          <Flex gap={8} wrap align="center" className="conf-filters">
            <Input.Search
              allowClear
              aria-label={text.schedule.search}
              placeholder={text.schedule.search}
              defaultValue={filters.query}
              key={filters.query === '' ? 'empty' : 'query'}
              onChange={(event) => update({ q: event.target.value })}
              className="conf-filters__search"
            />
            {selectFilter(
              'track',
              text.schedule.trackFilter,
              filters.tracks,
              CONF_TRACKS,
              text.tracks,
            )}
            {selectFilter(
              'level',
              text.schedule.levelFilter,
              filters.levels,
              CONF_LEVELS,
              text.levels,
            )}
            {selectFilter(
              'format',
              text.schedule.formatFilter,
              filters.formats,
              CONF_FORMATS,
              text.formats,
            )}
            {hasFilters(filters) && (
              <>
                <Button
                  type="link"
                  onClick={() => update({ q: null, track: null, level: null, format: null })}
                >
                  {text.schedule.clearFilters}
                </Button>
                <Typography.Text type="secondary">
                  {text.schedule.matches(matchCount)}
                </Typography.Text>
              </>
            )}
          </Flex>
        )}

        <Typography.Text type="secondary" className="conf-schedule__note">
          {text.timesNote}
        </Typography.Text>

        {view === 'grid' && (
          <div className="conf-grid-scroll">
            <ConfScheduleGrid
              layout={layout}
              visible={visible}
              clashing={new Set(clashMap.keys())}
              live={liveIds}
              onOpen={openSession}
            />
          </div>
        )}
        {view === 'list' && dayList()}
        {view === 'agenda' && agenda()}
      </section>

      <ConfSessionDrawer
        session={open}
        root={root}
        clashes={open ? (clashMap.get(open.id) ?? []) : []}
        onClose={() => update({ session: null })}
      />
    </ConfSiteShell>
  )
}
