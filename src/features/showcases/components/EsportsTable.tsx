import { Table, type TableColumnsType } from 'antd'
import type { ReactNode } from 'react'
import { TeamCrest, TeamName } from '@/features/showcases/components/EsportsBits'
import type { SportId } from '@/features/showcases/data/esports'
import { formatScore } from '@/features/showcases/data/esportsFormat'
import type { TableRow } from '@/features/showcases/data/esportsSim'
import { useEsportsCopy } from '@/features/showcases/hooks/useEsportsStore'

const signed = (value: number) => (value > 0 ? `+${value}` : `${value}`)

/**
 * A standings table with the columns each sport uses:
 * football W/D/L/GF/GA/GD/Pts, basketball W/L/PF/PA/%, volleyball W/L/sets/ratio/Pts,
 * tennis W/L/sets/games, chess points and Buchholz.
 */
export function EsportsStandings({
  rows,
  root,
  sport,
  caption,
  highlight = 0,
}: {
  rows: TableRow[]
  root: string
  sport: SportId
  caption: string
  /** Rows marked at the top, e.g. the prize places. */
  highlight?: number
}) {
  const { text } = useEsportsCopy()
  const c = text.tournament.columns
  const center = 'center' as const
  const col = (
    key: string,
    title: string,
    render: (row: TableRow) => ReactNode,
    strong = false,
  ) => ({
    key,
    title,
    align: center,
    width: 52,
    render: (_: unknown, row: TableRow) => (strong ? <strong>{render(row)}</strong> : render(row)),
  })
  const bySport: Record<SportId, TableColumnsType<TableRow>> = {
    football: [
      col('p', c.played, (row) => row.played),
      col('w', c.won, (row) => row.wins),
      col('d', c.drawn, (row) => row.draws),
      col('l', c.lost, (row) => row.losses),
      col('gf', c.goalsFor, (row) => row.scored),
      col('ga', c.goalsAgainst, (row) => row.conceded),
      col('gd', c.goalDiff, (row) => signed(row.scored - row.conceded)),
      col('pts', c.points, (row) => row.points, true),
    ],
    basketball: [
      col('p', c.played, (row) => row.played),
      col('w', c.won, (row) => row.wins),
      col('l', c.lost, (row) => row.losses),
      col('pf', c.pointsFor, (row) => row.scored),
      col('pa', c.pointsAgainst, (row) => row.conceded),
      col(
        'pct',
        c.winPct,
        (row) => (row.played ? `${Math.round((row.wins / row.played) * 100)}%` : '–'),
        true,
      ),
    ],
    volleyball: [
      col('p', c.played, (row) => row.played),
      col('w', c.won, (row) => row.wins),
      col('l', c.lost, (row) => row.losses),
      col('sets', c.sets, (row) => `${row.scored}:${row.conceded}`),
      col('ratio', c.setRatio, (row) =>
        row.conceded ? (row.scored / row.conceded).toFixed(2) : row.scored ? '∞' : '–',
      ),
      col('pts', c.points, (row) => row.points, true),
    ],
    tennis: [
      col('p', c.played, (row) => row.played),
      col('w', c.won, (row) => row.wins, true),
      col('l', c.lost, (row) => row.losses),
      col('sets', c.sets, (row) => `${row.scored}:${row.conceded}`),
      col('games', c.games, (row) => `${row.innerFor}:${row.innerAgainst}`),
    ],
    chess: [
      col('p', c.played, (row) => row.played),
      col('w', c.won, (row) => row.wins),
      col('d', c.drawn, (row) => row.draws),
      col('l', c.lost, (row) => row.losses),
      col('pts', c.points, (row) => formatScore(row.points), true),
      col('bh', c.buchholz, (row) => formatScore(row.buchholz)),
    ],
  }
  return (
    <Table<TableRow>
      className="esp-table"
      size="small"
      pagination={false}
      rowKey={(row) => row.team.id}
      dataSource={rows}
      aria-label={caption}
      rowClassName={(_, index) => (index < highlight ? 'is-advancing' : '')}
      scroll={{ x: 'max-content' }}
      columns={[
        {
          key: 'rank',
          title: '#',
          width: 44,
          render: (_, __, index) => <span className="esp-rank">{index + 1}</span>,
        },
        {
          key: 'team',
          title: text.tournament.team,
          render: (_, row) => (
            <span className="esp-tableteam">
              <TeamCrest team={row.team} size={24} />
              <TeamName team={row.team} root={root} />
            </span>
          ),
        },
        ...bySport[sport],
      ]}
    />
  )
}
