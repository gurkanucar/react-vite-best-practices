import { ArrowDownOutlined, ArrowUpOutlined, MinusOutlined } from '@ant-design/icons'
import { Flex, Segmented, Select, Switch, Table, Typography } from 'antd'
import { useMemo } from 'react'
import { useSearchParams } from 'react-router'
import {
  FollowButton,
  FormChips,
  SportTag,
  TeamCrest,
  TeamName,
} from '@/features/showcases/components/EsportsBits'
import { EsportsSiteShell } from '@/features/showcases/components/EsportsSiteShell'
import {
  esportsRoot,
  regionIds,
  sportIds,
  teams,
  type RegionId,
  type SportId,
  type Team,
} from '@/features/showcases/data/esports'
import { recentForm, teamRecord, type FormResult } from '@/features/showcases/data/esportsSim'
import {
  useEsportsCopy,
  useEsportsNow,
  useEsportsStore,
} from '@/features/showcases/hooks/useEsportsStore'

interface Row {
  team: Team
  rank: number
  /** What the ranking is by: ranking points in tennis, Elo in chess, power for teams. */
  score: number
  change: number
  wins: number
  losses: number
  winRate: number
  form: FormResult[]
}

/** Tennis ranks by ranking points; everything else by rating. */
const scoreOf = (team: Team) => team.rankingPoints ?? team.rating

export function EsportsLeaderboardPage({ standalone = false }: { standalone?: boolean }) {
  const { text, language } = useEsportsCopy()
  const l = text.leaderboard
  const root = esportsRoot(standalone)
  const now = useEsportsNow(60_000)
  const [params, setParams] = useSearchParams()
  const follows = useEsportsStore((state) => state.follows)
  const sport = (sportIds as string[]).includes(params.get('sport') ?? '')
    ? (params.get('sport') as SportId)
    : 'all'
  const region = (regionIds as string[]).includes(params.get('region') ?? '')
    ? (params.get('region') as RegionId)
    : undefined
  const followedOnly = params.get('following') === '1'
  const number = new Intl.NumberFormat(language === 'tr' ? 'tr-TR' : 'en-GB')

  const update = (key: string, value: string | undefined) => {
    const search = new URLSearchParams(params)
    if (value) search.set(key, value)
    else search.delete(key)
    setParams(search, { replace: true })
  }

  const rows = useMemo(() => {
    const filtered = teams
      .filter((team) => sport === 'all' || team.sport === sport)
      .filter((team) => !region || team.region === region)
      .sort((first, second) =>
        sport === 'all' ? second.rating - first.rating : scoreOf(second) - scoreOf(first),
      )
    return filtered
      .map((team, index): Row => {
        const record = teamRecord(team, now)
        return {
          team,
          rank: index + 1,
          score: sport === 'all' ? team.rating : scoreOf(team),
          change: team.rating - team.previousRating,
          wins: record.wins,
          losses: record.losses,
          winRate: record.played ? Math.round((record.wins / record.played) * 100) : 0,
          form: recentForm(team, now).map((item) => item.result),
        }
      })
      .filter((row) => !followedOnly || follows.includes(row.team.id))
  }, [sport, region, followedOnly, follows, now])

  return (
    <EsportsSiteShell standalone={standalone}>
      <section className="esp-listhead">
        <div className="esp-wrap">
          <Typography.Title>{l.title}</Typography.Title>
          <Typography.Paragraph className="esp-lead">{l.lead}</Typography.Paragraph>
        </div>
      </section>
      <div className="esp-wrap esp-section">
        <Flex gap={12} wrap align="center" className="esp-filters">
          <Segmented
            aria-label={l.sport}
            value={sport}
            onChange={(value) => update('sport', value === 'all' ? undefined : String(value))}
            options={[
              { value: 'all', label: text.common.all },
              ...sportIds.map((id) => ({ value: id, label: text.sports[id] })),
            ]}
          />
          <Select
            allowClear
            className="esp-filters__select"
            aria-label={l.region}
            placeholder={l.region}
            value={region}
            onChange={(value) => update('region', value)}
            options={regionIds.map((id) => ({ value: id, label: text.regions[id] }))}
          />
          <label className="esp-switch">
            <Switch
              checked={followedOnly}
              onChange={(checked) => update('following', checked ? '1' : undefined)}
              aria-label={l.followedOnly}
            />
            {l.followedOnly}
          </label>
        </Flex>
        <Table<Row>
          className="esp-table esp-leaderboard"
          rowKey={(row) => row.team.id}
          dataSource={rows}
          pagination={false}
          scroll={{ x: 'max-content' }}
          locale={{ emptyText: text.common.empty }}
          columns={[
            {
              key: 'rank',
              title: '#',
              width: 56,
              render: (_, row) => (
                <span className={`esp-rank esp-rank--${row.rank <= 3 ? row.rank : 'n'}`}>
                  {row.rank}
                </span>
              ),
            },
            {
              key: 'team',
              title: l.team,
              render: (_, row) => (
                <span className="esp-tableteam">
                  <TeamCrest team={row.team} size={32} />
                  <span className="esp-playercell">
                    <TeamName team={row.team} root={root} />
                    <span className="esp-muted">
                      {row.team.roster[0]?.title && row.team.individual
                        ? `${row.team.roster[0].title} · `
                        : ''}
                      {row.team.city}
                    </span>
                  </span>
                </span>
              ),
            },
            ...(sport === 'all'
              ? [
                  {
                    key: 'sport',
                    title: l.sport,
                    render: (_: unknown, row: Row) => <SportTag sport={row.team.sport} />,
                  },
                ]
              : []),
            { key: 'region', title: l.region, render: (_, row) => text.regions[row.team.region] },
            {
              key: 'rating',
              title: sport === 'all' ? l.rating : l.ratingBy[sport],
              align: 'right',
              sorter: (first, second) => first.score - second.score,
              defaultSortOrder: 'descend',
              sortDirections: ['descend', 'ascend'],
              render: (_, row) => (
                <strong className="esp-rating">{number.format(row.score)}</strong>
              ),
            },
            {
              key: 'change',
              title: l.change,
              align: 'right',
              sorter: (first, second) => first.change - second.change,
              sortDirections: ['descend', 'ascend'],
              render: (_, row) => {
                const label =
                  row.change > 0 ? l.up(row.change) : row.change < 0 ? l.down(-row.change) : l.same
                return (
                  <span
                    className={`esp-trend esp-trend--${row.change > 0 ? 'up' : row.change < 0 ? 'down' : 'flat'}`}
                    aria-label={label}
                    title={label}
                  >
                    {row.change > 0 ? (
                      <ArrowUpOutlined />
                    ) : row.change < 0 ? (
                      <ArrowDownOutlined />
                    ) : (
                      <MinusOutlined />
                    )}
                    {Math.abs(row.change)}
                  </span>
                )
              },
            },
            {
              key: 'record',
              title: l.record,
              align: 'center',
              render: (_, row) => `${row.wins}–${row.losses}`,
            },
            {
              key: 'winRate',
              title: l.winRate,
              align: 'right',
              sorter: (first, second) => first.winRate - second.winRate,
              sortDirections: ['descend', 'ascend'],
              render: (_, row) => `${row.winRate}%`,
            },
            { key: 'form', title: l.form, render: (_, row) => <FormChips results={row.form} /> },
            {
              key: 'follow',
              title: '',
              width: 48,
              render: (_, row) => <FollowButton team={row.team} compact />,
            },
          ]}
        />
      </div>
    </EsportsSiteShell>
  )
}
