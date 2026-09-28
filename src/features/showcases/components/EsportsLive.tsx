import { Col, Row, Table, Typography } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { TeamCrest, TeamName } from '@/features/showcases/components/EsportsBits'
import type { Team } from '@/features/showcases/data/esports'
import {
  bannerFor,
  clockText,
  eventLine,
  formatScore,
  teamColor,
  type Banner,
} from '@/features/showcases/data/esportsFormat'
import {
  playerLines,
  statsFrom,
  type Fate,
  type LiveState,
  type PlayerLine,
} from '@/features/showcases/data/esportsSim'
import { useEsportsCopy } from '@/features/showcases/hooks/useEsportsStore'

/** A slim scoreboard that stays at the top of the screen while the match is live. */
export function LiveTicker({ fate, state }: { fate: Fate; state: LiveState }) {
  const { text } = useEsportsCopy()
  return (
    <section className="esp-ticker" aria-label={text.match.liveTicker}>
      <div className="esp-wrap esp-ticker__inner">
        <span className="esp-status esp-status--live">
          <span className="esp-status__dot" aria-hidden="true" />
          {text.match.liveTicker}
        </span>
        <span className="esp-ticker__side">
          <TeamCrest team={fate.teams[0]} size={22} />
          <span className="esp-ticker__tag">{fate.teams[0].tag}</span>
        </span>
        <span className="esp-ticker__score">
          {formatScore(state.score[0])}–{formatScore(state.score[1])}
        </span>
        <span className="esp-ticker__side">
          <span className="esp-ticker__tag">{fate.teams[1].tag}</span>
          <TeamCrest team={fate.teams[1]} size={22} />
        </span>
        <span className="esp-ticker__clock">{clockText(fate, state, text)}</span>
      </div>
    </section>
  )
}

/**
 * Pops a banner for each big moment that happens while you watch: a goal, a red card,
 * a set or match point, a break of serve, checkmate, the final whistle. Moments that were
 * already over when the page opened are not replayed.
 */
export function HighlightBanner({ fate, state }: { fate: Fate; state: LiveState }) {
  const { text } = useEsportsCopy()
  const seen = useRef(state.events.length)
  const [banner, setBanner] = useState<(Banner & { key: number }) | null>(null)

  useEffect(() => {
    const fresh = state.events.slice(seen.current)
    seen.current = state.events.length
    const latest = [...fresh]
      .reverse()
      .map((event) => bannerFor(event, fate, text))
      .find((item) => item !== null)
    if (!latest) return
    setBanner({ ...latest, key: Date.now() })
    const timer = window.setTimeout(() => setBanner(null), 4500)
    return () => window.clearTimeout(timer)
  }, [state.events, fate, text])

  const color = banner?.side ? teamColor(fate.teams[banner.side === 'a' ? 0 : 1]) : undefined
  return (
    <output className="esp-banner-slot" aria-live="polite">
      {banner && (
        <div
          key={banner.key}
          className={`esp-banner esp-banner--${banner.tone}`}
          style={color ? { ['--esp-banner-team' as string]: color } : undefined}
        >
          <strong className="esp-banner__title">{banner.title}</strong>
          <span className="esp-banner__detail">{banner.detail}</span>
        </div>
      )}
    </output>
  )
}

/** Play by play, newest first. Lines that arrive while you watch slide in at the top. */
export function LiveFeed({
  fate,
  state,
  limit = 50,
}: {
  fate: Fate
  state: LiveState
  limit?: number
}) {
  const { text } = useEsportsCopy()
  const [firstCount] = useState(state.events.length)
  const shown = state.events
    .map((event, index) => ({ event, index }))
    .slice(-limit)
    .reverse()
  return (
    <section className="esp-panel">
      <Typography.Title level={4}>{text.match.feed}</Typography.Title>
      {shown.length === 0 ? (
        <Typography.Text type="secondary">{text.match.feedEmpty}</Typography.Text>
      ) : (
        <ol className="esp-feed">
          {shown.map(({ event, index }) => {
            const line = eventLine(event, fate, text)
            return (
              <li
                key={index}
                className={`esp-feed__item esp-feed__item--${line.tone}${index >= firstCount ? ' is-new' : ''}`}
                style={
                  event.side
                    ? {
                        ['--esp-side' as string]: teamColor(fate.teams[event.side === 'a' ? 0 : 1]),
                      }
                    : undefined
                }
              >
                <span className="esp-feed__stamp">{line.stamp}</span>
                <span className="esp-feed__text">
                  {line.text}
                  {line.detail && <span className="esp-feed__detail">{line.detail}</span>}
                </span>
              </li>
            )
          })}
        </ol>
      )}
    </section>
  )
}

export function StatsCompare({ fate, state }: { fate: Fate; state: LiveState }) {
  const { text } = useEsportsCopy()
  const rows = statsFrom(fate, state)
  if (!rows.length) return null
  return (
    <section className="esp-panel">
      <Typography.Title level={4}>{text.match.stats}</Typography.Title>
      <div className="esp-compare__head">
        <span className="esp-tableteam">
          <TeamCrest team={fate.teams[0]} size={22} />
          {fate.teams[0].tag}
        </span>
        <span className="esp-tableteam">
          {fate.teams[1].tag}
          <TeamCrest team={fate.teams[1]} size={22} />
        </span>
      </div>
      <ul className="esp-compare">
        {rows.map(({ key, values: [left, right] }) => {
          const total = left + right
          const share = total === 0 ? 50 : (left / total) * 100
          return (
            <li key={key}>
              <span className={`esp-compare__value${left > right ? ' is-lead' : ''}`}>
                {formatScore(left)}
              </span>
              <span className="esp-compare__label">{text.stats[key]}</span>
              <span
                className={`esp-compare__value esp-compare__value--b${right > left ? ' is-lead' : ''}`}
              >
                {formatScore(right)}
              </span>
              <span className="esp-compare__bar" aria-hidden="true">
                <span className="esp-compare__a" style={{ width: `${share}%` }} />
                <span className="esp-compare__b" style={{ width: `${100 - share}%` }} />
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

/** Scores by half, quarter or set, with the total; tennis adds the game in progress. */
export function PeriodTable({ fate, state }: { fate: Fate; state: LiveState }) {
  const { text } = useEsportsCopy()
  const sport = fate.def.sport
  const labels = text.match.periods[sport]
  const periods = state.periods
  if (!periods.length || sport === 'chess') return null
  const tennisNow = sport === 'tennis' && !state.finished ? state.last?.tennis : undefined
  const pens =
    state.finished || state.events.some((event) => event.kind === 'penalty')
      ? fate.script.shootout
      : undefined
  const livePens = state.events.filter((event) => event.kind === 'penalty').at(-1)?.inner
  return (
    <table className="esp-periods">
      <caption className="esp-sr">{text.match.stats}</caption>
      <thead>
        <tr>
          <th scope="col">
            <span className="esp-sr">{text.tournament.team}</span>
          </th>
          {periods.map((_, index) => (
            <th scope="col" key={index}>
              {labels[index] ?? index + 1}
            </th>
          ))}
          {(pens || livePens) && <th scope="col">{text.match.pens}</th>}
          {tennisNow && <th scope="col">{text.match.points}</th>}
          <th scope="col">{text.match.total}</th>
        </tr>
      </thead>
      <tbody>
        {fate.teams.map((team, side) => (
          <tr key={team.id}>
            <th scope="row">
              <span className="esp-tableteam">
                <TeamCrest team={team} size={20} />
                {team.tag}
                {tennisNow?.server === (side === 0 ? 'a' : 'b') && (
                  <span className="esp-serve">
                    <span className="esp-sr">{text.match.serving}</span>
                  </span>
                )}
              </span>
            </th>
            {periods.map((period, index) => (
              <td key={index} className={period[side] > period[1 - side] ? 'is-lead' : undefined}>
                {formatScore(period[side])}
              </td>
            ))}
            {(pens || livePens) && <td>{(livePens ?? pens)![side]}</td>}
            {tennisNow && <td className="esp-periods__points">{tennisNow.points[side]}</td>}
            <td className="esp-periods__total">{formatScore(state.score[side])}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function BoxTable({
  fate,
  team,
  lines,
  root,
}: {
  fate: Fate
  team: Team
  lines: PlayerLine[]
  root: string
}) {
  const { text } = useEsportsCopy()
  const headers = text.match.headers[fate.def.sport]
  const flagText: Record<NonNullable<PlayerLine['flag']>, string> = {
    yellow: '',
    red: text.match.sentOff,
    foulOut: text.match.fouledOut,
    subIn: text.match.subIn,
    subOut: text.match.subOut,
  }
  // Players who took part: starters, and anyone who came on.
  const starters = fate.def.sport === 'football' ? 11 : fate.def.sport === 'basketball' ? 5 : 7
  const rows = lines.filter(
    (line) => line.player < starters || line.flag === 'subIn' || line.main || line.third,
  )
  return (
    <Table<PlayerLine>
      className="esp-table"
      size="small"
      pagination={false}
      rowKey={(line) => line.player}
      dataSource={rows}
      scroll={{ x: 'max-content' }}
      title={() => (
        <span className="esp-tableteam">
          <TeamCrest team={team} size={22} />
          <TeamName team={team} root={root} />
        </span>
      )}
      columns={[
        {
          key: 'player',
          title: text.match.player,
          render: (_, line) => {
            const player = team.roster[line.player]
            return (
              <span className="esp-playercell">
                <strong>
                  {player.number !== undefined && (
                    <span className="esp-shirt">{player.number}</span>
                  )}
                  {player.name}
                </strong>
                <span className="esp-muted">
                  {text.positions[player.position]}
                  {line.flag && flagText[line.flag] ? ` · ${flagText[line.flag]}` : ''}
                </span>
              </span>
            )
          },
        },
        { key: 'main', title: headers[0], align: 'center', render: (_, line) => line.main },
        { key: 'second', title: headers[1], align: 'center', render: (_, line) => line.second },
        {
          key: 'third',
          title: headers[2],
          align: 'center',
          render: (_, line) =>
            fate.def.sport === 'football' ? (
              line.flag === 'red' ? (
                <span className="esp-card esp-card--red">
                  <span className="esp-sr">{text.stats.red}</span>
                </span>
              ) : line.flag === 'yellow' ? (
                <span className="esp-card esp-card--yellow">
                  <span className="esp-sr">{text.stats.yellow}</span>
                </span>
              ) : (
                ''
              )
            ) : (
              line.third
            ),
        },
      ]}
    />
  )
}

export function BoxScore({ fate, state, root }: { fate: Fate; state: LiveState; root: string }) {
  const { text } = useEsportsCopy()
  if (fate.teams[0].individual) return null
  const [a, b] = playerLines(fate, state)
  return (
    <section className="esp-stack">
      <Typography.Title level={4}>{text.match.players}</Typography.Title>
      <BoxTable fate={fate} team={fate.teams[0]} lines={a} root={root} />
      <BoxTable fate={fate} team={fate.teams[1]} lines={b} root={root} />
    </section>
  )
}

/** Starting players and the bench, before a team match starts. */
export function Lineups({ fate, root }: { fate: Fate; root: string }) {
  const { text } = useEsportsCopy()
  if (fate.teams[0].individual) return null
  const starters = fate.def.sport === 'football' ? 11 : fate.def.sport === 'basketball' ? 5 : 7
  return (
    <section className="esp-stack">
      <Typography.Title level={4}>{text.match.lineups}</Typography.Title>
      <Row gutter={[16, 16]}>
        {fate.teams.map((team) => (
          <Col xs={24} md={12} key={team.id}>
            <div className="esp-panel esp-lineup">
              <span className="esp-tableteam">
                <TeamCrest team={team} size={28} />
                <TeamName team={team} root={root} />
              </span>
              <ul className="esp-lineup__list">
                {team.roster.map((player, index) => (
                  <li
                    key={player.name}
                    className={index === starters ? 'is-bench-start' : undefined}
                  >
                    <span>
                      {player.number !== undefined && (
                        <span className="esp-shirt">{player.number}</span>
                      )}
                      <strong>{player.name}</strong>
                    </span>
                    <span className="esp-muted">{text.positions[player.position]}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Col>
        ))}
      </Row>
    </section>
  )
}
