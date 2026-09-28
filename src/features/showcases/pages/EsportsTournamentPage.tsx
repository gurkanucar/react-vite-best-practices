import {
  CalendarOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  TrophyOutlined,
} from '@ant-design/icons'
import { Col, Empty, Flex, Row, Select, Table, Tabs, Typography } from 'antd'
import { useState, type ReactNode } from 'react'
import { Link, useParams, useSearchParams } from 'react-router'
import {
  MatchCard,
  SportTag,
  StatusBadge,
  TeamCrest,
  TeamName,
  TournamentArt,
} from '@/features/showcases/components/EsportsBits'
import { EsportsBracket, type BracketColumn } from '@/features/showcases/components/EsportsBracket'
import { EsportsNotFound, EsportsSiteShell } from '@/features/showcases/components/EsportsSiteShell'
import { EsportsStandings } from '@/features/showcases/components/EsportsTable'
import {
  esportsRoot,
  sports,
  teamById,
  tournamentById,
  tournamentTeams,
  type Tournament,
} from '@/features/showcases/data/esports'
import type { EsportsCopy } from '@/features/showcases/data/esportsCopy'
import {
  displayScore,
  formatDateRange,
  formatDay,
  formatLabel,
  formatMoney,
  formatTime,
  sourceLabel,
} from '@/features/showcases/data/esportsFormat'
import {
  HOUR,
  leagueFate,
  leagueSlots,
  leagueTable,
  placements,
  startOfDay,
  statusAt,
  swissTable,
  tournamentDates,
  tournamentFates,
  tournamentStatus,
  viewMatch,
  type Fate,
} from '@/features/showcases/data/esportsSim'
import { useEsportsCopy, useEsportsNow } from '@/features/showcases/hooks/useEsportsStore'

type TabKey = 'overview' | 'bracket' | 'table' | 'rounds' | 'schedule' | 'standings' | 'prizes'

function tabsFor(tournament: Tournament): TabKey[] {
  switch (tournament.format) {
    case 'knockout':
      return ['overview', 'bracket', 'schedule', 'standings', 'prizes']
    case 'league':
      return ['overview', 'table', 'schedule', 'prizes']
    case 'swiss':
      return ['overview', 'table', 'rounds', 'prizes']
  }
}

function bracketColumns(fates: Fate[], text: EsportsCopy): BracketColumn[] {
  const rounds = [...new Set(fates.map((fate) => fate.def.round))]
  return rounds.map((round, index) => {
    const column = fates.filter((fate) => fate.def.round === round)
    return {
      key: `r${round}`,
      title: text.rounds[column[0].def.stage] ?? text.stages[column[0].def.stage],
      fates: column,
      join: index === rounds.length - 1 ? 'none' : 'pair',
    }
  })
}

function Fact({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="esp-fact">
      <span className="esp-fact__icon" aria-hidden="true">
        {icon}
      </span>
      <span>
        <span className="esp-fact__label">{label}</span>
        <span className="esp-fact__value">{children}</span>
      </span>
    </div>
  )
}

/** Matches grouped by day (or by Swiss round), each a row linking to the match centre. */
function Schedule({
  fates,
  now,
  root,
  groupBy,
}: {
  fates: Fate[]
  now: number
  root: string
  groupBy: 'day' | 'round'
}) {
  const { text, language } = useEsportsCopy()
  const keyOf = (fate: Fate) => (groupBy === 'day' ? startOfDay(fate.def.startAt) : fate.def.round)
  const groups = [...new Set(fates.map(keyOf))]
  if (!groups.length) return <Empty description={text.common.empty} />
  return (
    <div className="esp-stack esp-stack--loose">
      {groups.map((group) => (
        <section key={group} className="esp-schedule-day">
          <Typography.Title level={5} className="esp-schedule-day__title">
            {groupBy === 'day' ? formatDay(group, language, true) : text.swissRound(group + 1)}
          </Typography.Title>
          <ul className="esp-schedule">
            {fates
              .filter((fate) => keyOf(fate) === group)
              .map((fate) => {
                const view = viewMatch(fate, now)
                const score = displayScore(view, now)
                return (
                  <li key={fate.def.id}>
                    <Link
                      to={`${root}/matches/${fate.def.id}`}
                      className={`esp-schedule__row esp-schedule__row--${view.status}`}
                    >
                      <span className="esp-schedule__time">
                        {formatTime(fate.def.startAt, language)}
                      </span>
                      <span className="esp-schedule__stage">
                        {fate.def.stage === 'swiss'
                          ? text.tournament.board(fate.def.position + 1)
                          : text.stages[fate.def.stage]}
                      </span>
                      <span className="esp-schedule__teams">
                        {view.teams.map((team, side) => (
                          <span key={side} className="esp-schedule__team">
                            <TeamCrest team={team} size={22} />
                            <span>{team?.name ?? sourceLabel(view.sources[side], text, now)}</span>
                            <strong>{score ? score[side] : ''}</strong>
                          </span>
                        ))}
                      </span>
                      <span className="esp-schedule__status">
                        <StatusBadge status={view.status} />
                      </span>
                    </Link>
                  </li>
                )
              })}
          </ul>
        </section>
      ))}
    </div>
  )
}

export function EsportsTournamentPage({ standalone = false }: { standalone?: boolean }) {
  const { tournamentId } = useParams()
  const { text, language } = useEsportsCopy()
  const root = esportsRoot(standalone)
  const now = useEsportsNow(10_000)
  const [params, setParams] = useSearchParams()
  const [hover, setHover] = useState<string | null>(null)
  const tournament = tournamentById.get(tournamentId ?? '')

  if (!tournament) {
    return (
      <EsportsSiteShell standalone={standalone}>
        <EsportsNotFound message={text.tournament.notFound} root={root} />
      </EsportsSiteShell>
    )
  }

  const t = text.tournament
  const individual = sports[tournament.sport].individual
  const tabs = tabsFor(tournament)
  const requested = params.get('tab') as TabKey | null
  const tab: TabKey = requested && tabs.includes(requested) ? requested : 'overview'
  const selected = params.get('team')
  const highlight = hover ?? selected
  const status = tournamentStatus(tournament, now)
  const fates = tournamentFates(tournament.id, now)
  const places = placements(tournament, now)
  const champion =
    status === 'finished' ? places.find((item) => item.places[0] === 1 && !item.alive) : undefined
  const teamIds = tournamentTeams(tournament)

  const update = (key: string, value: string | undefined) => {
    const search = new URLSearchParams(params)
    if (value) search.set(key, value)
    else search.delete(key)
    setParams(search, { replace: true })
  }

  const live = fates.filter((fate) => statusAt(fate, now) === 'live')
  const next = fates
    .filter((fate) => statusAt(fate, now) === 'upcoming')
    .sort((first, second) => first.def.startAt - second.def.startAt)
    .slice(0, 2)

  const overview = (
    <Row gutter={[24, 24]}>
      <Col xs={24} lg={15}>
        <section className="esp-panel">
          <Typography.Title level={3}>{t.about}</Typography.Title>
          <Typography.Paragraph>{tournament.about[language]}</Typography.Paragraph>
          {champion && (
            <div className="esp-champion">
              <TrophyOutlined aria-hidden="true" className="esp-champion__icon" />
              <TeamCrest team={champion.team} size={48} />
              <span>
                <span className="esp-fact__label">{t.champion}</span>
                <TeamName team={champion.team} root={root} />
              </span>
            </div>
          )}
        </section>
        <section className="esp-panel">
          <Typography.Title level={3}>{t.participants}</Typography.Title>
          <ul className="esp-participants">
            {teamIds.map((id) => {
              const team = teamById.get(id)!
              const placing = places.find((item) => item.team.id === id)
              const out =
                tournament.format === 'knockout' &&
                placing &&
                !placing.alive &&
                placing.places[0] > 1
              return (
                <li key={id} className={out ? 'is-out' : undefined}>
                  <TeamCrest team={team} size={32} />
                  <span>
                    <TeamName team={team} root={root} />
                    <span className="esp-muted">{team.city}</span>
                  </span>
                </li>
              )
            })}
          </ul>
        </section>
      </Col>
      <Col xs={24} lg={9}>
        {live.length > 0 && (
          <section className="esp-panel">
            <Typography.Title level={4}>{t.liveMatch}</Typography.Title>
            <div className="esp-stack">
              {live.map((fate) => (
                <MatchCard key={fate.def.id} fate={fate} now={now} root={root} />
              ))}
            </div>
          </section>
        )}
        {next.length > 0 && (
          <section className="esp-panel">
            <Typography.Title level={4}>{t.nextMatch}</Typography.Title>
            <div className="esp-stack">
              {next.map((fate) => (
                <MatchCard key={fate.def.id} fate={fate} now={now} root={root} />
              ))}
            </div>
          </section>
        )}
      </Col>
    </Row>
  )

  const bracket =
    tournament.format === 'knockout' ? (
      <div className="esp-stack esp-stack--loose">
        <Flex gap={12} align="center" wrap className="esp-highlight">
          <Select
            allowClear
            showSearch={{ optionFilterProp: 'label' }}
            className="esp-highlight__select"
            aria-label={t.highlight}
            placeholder={t.highlightPlaceholder}
            value={selected ?? undefined}
            onChange={(value) => update('team', value)}
            options={teamIds.map((id) => ({ value: id, label: teamById.get(id)!.name }))}
          />
          <Typography.Text type="secondary">{t.bracketHint}</Typography.Text>
        </Flex>
        <EsportsBracket
          columns={bracketColumns(fates, text)}
          now={now}
          root={root}
          label={t.tabs.bracket}
          highlight={highlight}
          onHover={setHover}
        />
      </div>
    ) : null

  const table =
    tournament.format === 'league' ? (
      <div className="esp-stack">
        <Typography.Paragraph type="secondary">
          {t.tableLead[tournament.sport]}
        </Typography.Paragraph>
        <EsportsStandings
          rows={leagueTable(tournament, now)}
          root={root}
          sport={tournament.sport}
          caption={t.tabs.table}
        />
      </div>
    ) : tournament.format === 'swiss' ? (
      <div className="esp-stack">
        <Typography.Paragraph type="secondary">{t.swissLead}</Typography.Paragraph>
        <EsportsStandings
          rows={swissTable(tournament, now)}
          root={root}
          sport="chess"
          caption={t.tabs.table}
          highlight={3}
        />
      </div>
    ) : null

  const scheduleFates =
    tournament.format === 'league'
      ? leagueSlots(tournament, now - 2 * HOUR, now + 2 * HOUR).map((slot) =>
          leagueFate(tournament, slot),
        )
      : [...fates].sort(
          (first, second) =>
            first.def.startAt - second.def.startAt || first.def.position - second.def.position,
        )

  const standings = (
    <Table
      className="esp-table"
      size="middle"
      pagination={false}
      rowKey={(row) => row.team.id}
      dataSource={places}
      scroll={{ x: 'max-content' }}
      columns={[
        {
          key: 'place',
          title: t.place,
          width: 80,
          render: (_, row) => (row.alive ? '—' : t.places(row.places[0], row.places[1])),
        },
        {
          key: 'team',
          title: individual ? t.player : t.team,
          render: (_, row) => (
            <span className="esp-tableteam">
              <TeamCrest team={row.team} size={28} />
              <TeamName team={row.team} root={root} />
            </span>
          ),
        },
        {
          key: 'state',
          title: text.list.status,
          render: (_, row) =>
            row.alive ? (
              <span className="esp-pill esp-pill--alive">{t.stillIn}</span>
            ) : row.places[0] === 1 ? (
              <span className="esp-pill esp-pill--gold">{t.champion}</span>
            ) : row.places[0] === 2 ? (
              <span className="esp-pill esp-pill--silver">{t.runnerUp}</span>
            ) : (
              <span className="esp-pill">{t.eliminated}</span>
            ),
        },
        {
          key: 'prize',
          title: t.amount,
          align: 'right',
          render: (_, row) => {
            if (row.alive) return '—'
            const share = tournament.prizes.find(
              (prize) => row.places[0] >= prize.places[0] && row.places[0] <= prize.places[1],
            )
            return share
              ? formatMoney(
                  (tournament.prizePool * share.percent) / 100,
                  tournament.currency,
                  language,
                )
              : '—'
          },
        },
      ]}
    />
  )

  const prizes = (
    <Row gutter={[24, 24]}>
      <Col xs={24} lg={9}>
        <div className="esp-prizepool">
          <TrophyOutlined aria-hidden="true" />
          <span className="esp-fact__label">{text.common.prize}</span>
          <span className="esp-prizepool__amount">
            {formatMoney(tournament.prizePool, tournament.currency, language)}
          </span>
        </div>
      </Col>
      <Col xs={24} lg={15}>
        <ul className="esp-prizes">
          {tournament.prizes.map((prize) => {
            const winners = places.filter(
              (item) =>
                !item.alive &&
                item.places[0] >= prize.places[0] &&
                item.places[0] <= prize.places[1],
            )
            return (
              <li key={prize.places.join('-')}>
                <span className="esp-prizes__place">
                  {t.places(prize.places[0], prize.places[1])}
                </span>
                <span className="esp-prizes__bar" aria-hidden="true">
                  <span style={{ width: `${Math.min(100, prize.percent * 2)}%` }} />
                </span>
                <span className="esp-prizes__amount">
                  {formatMoney(
                    (tournament.prizePool * prize.percent) / 100,
                    tournament.currency,
                    language,
                  )}
                  <span className="esp-muted"> · {prize.percent}%</span>
                </span>
                <span className="esp-prizes__teams">
                  {winners.length > 0 ? (
                    winners.map((item) => (
                      <span key={item.team.id} className="esp-tableteam">
                        <TeamCrest team={item.team} size={20} />
                        <TeamName team={item.team} root={root} />
                      </span>
                    ))
                  ) : (
                    <span className="esp-muted">{t.decided}</span>
                  )}
                </span>
              </li>
            )
          })}
        </ul>
      </Col>
    </Row>
  )

  const panes: Record<TabKey, ReactNode> = {
    overview,
    bracket,
    table,
    rounds: <Schedule fates={scheduleFates} now={now} root={root} groupBy="round" />,
    schedule: (
      <div className="esp-stack">
        {tournament.format === 'league' && (
          <Typography.Title level={4}>{t.around}</Typography.Title>
        )}
        <Schedule fates={scheduleFates} now={now} root={root} groupBy="day" />
      </div>
    ),
    standings,
    prizes,
  }

  return (
    <EsportsSiteShell standalone={standalone}>
      <section className="esp-thero">
        <TournamentArt tournament={tournament} height={220} />
        <div className="esp-thero__shade" aria-hidden="true" />
        <div className="esp-wrap esp-thero__content">
          <Link to={`${root}/tournaments`} className="esp-thero__back">
            {text.common.allTournaments}
          </Link>
          <Flex gap={8} wrap align="center">
            <SportTag sport={tournament.sport} />
            <StatusBadge status={status} />
            <span className="esp-chip">{text.tiers[tournament.tier]}</span>
          </Flex>
          <Typography.Title className="esp-thero__title">{tournament.name}</Typography.Title>
        </div>
      </section>
      <div className="esp-wrap esp-tabwrap">
        <div className="esp-facts">
          <Fact icon={<CalendarOutlined />} label={text.common.dates}>
            {formatDateRange(tournamentDates(tournament, now), language)}
          </Fact>
          <Fact icon={<EnvironmentOutlined />} label={text.common.location}>
            {tournament.location[language]}
          </Fact>
          <Fact icon={<TrophyOutlined />} label={text.common.prize}>
            {formatMoney(tournament.prizePool, tournament.currency, language)}
          </Fact>
          <Fact icon={<TeamOutlined />} label={t.format}>
            {formatLabel(tournament, text)} · {t.count(teamIds.length, individual)}
          </Fact>
        </div>
        <Tabs
          className="esp-tabs"
          activeKey={tab}
          onChange={(key) => update('tab', key)}
          items={tabs.map((key) => ({ key, label: t.tabs[key], children: panes[key] }))}
        />
      </div>
    </EsportsSiteShell>
  )
}
