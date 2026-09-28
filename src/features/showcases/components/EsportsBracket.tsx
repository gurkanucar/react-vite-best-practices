import { Link } from 'react-router'
import { MatchClock, TeamCrest } from '@/features/showcases/components/EsportsBits'
import { displayScore, sourceLabel } from '@/features/showcases/data/esportsFormat'
import { viewMatch, winnerTeam, type Fate } from '@/features/showcases/data/esportsSim'
import { useEsportsCopy } from '@/features/showcases/hooks/useEsportsStore'

export interface BracketColumn {
  key: string
  title: string
  fates: Fate[]
  /**
   * How this column's matches feed the next one: two into one (`pair`), one into one
   * (`straight`), or not at all (`none`, the last column).
   */
  join: 'pair' | 'straight' | 'none'
}

interface BracketProps {
  columns: BracketColumn[]
  now: number
  root: string
  label: string
  /** The team whose path is lit up. */
  highlight: string | null
  onHover: (teamId: string | null) => void
}

/**
 * A knockout tree drawn with CSS. Every column is as tall as the first, and each match
 * takes an equal share of its column, so a match sits level with the middle of the two
 * that feed it. The connector lines are borders on each slot's ::before and ::after.
 */
export function EsportsBracket({ columns, now, root, label, highlight, onHover }: BracketProps) {
  const { text } = useEsportsCopy()
  return (
    <section className="esp-bracket" aria-label={label}>
      <div
        onMouseLeave={() => onHover(null)}

        className="esp-bracket__grid"
        style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(200px, 1fr))` }}
      >
        {columns.map((column, columnIndex) => (
          <div className="esp-bracket__col" key={column.key}>
            <div className="esp-bracket__title">{column.title}</div>
            <div className="esp-bracket__slots">
              {column.fates.map((fate, index) => {
                const view = viewMatch(fate, now)
                const score = displayScore(view, now)
                const finished = view.status === 'finished'
                const winner = finished ? winnerTeam(fate) : null
                const onPath =
                  highlight !== null && view.teams.some((team) => team?.id === highlight)
                const goesOn = onPath && winner?.id === highlight
                const classes = [
                  'esp-bk-slot',
                  `esp-bk-slot--${column.join}`,
                  index % 2 === 0 ? 'is-even' : 'is-odd',
                  columnIndex > 0 ? 'has-in' : '',
                  onPath ? 'is-path' : '',
                  goesOn ? 'is-path-out' : '',
                ]
                return (
                  <div className={classes.filter(Boolean).join(' ')} key={fate.def.id}>
                    <Link
                      to={`${root}/matches/${fate.def.id}`}
                      className={`esp-bk-match esp-bk-match--${view.status}`}
                    >
                      {view.teams.map((team, side) => {
                        const won = winner !== null && team?.id === winner.id
                        return (
                          <span
                            key={side}
                            className={[
                              'esp-bk-team',
                              won ? 'is-winner' : '',
                              finished && !won ? 'is-loser' : '',
                              team && team.id === highlight ? 'is-hl' : '',
                            ]
                              .filter(Boolean)
                              .join(' ')}
                            onMouseEnter={() => team && onHover(team.id)}
                          >
                            <TeamCrest team={team} size={20} />
                            <span className="esp-bk-team__name">
                              {team?.name ?? sourceLabel(view.sources[side], text, now)}
                            </span>
                            <span className="esp-bk-team__score">{score ? score[side] : ''}</span>
                          </span>
                        )
                      })}
                      <span className="esp-bk-match__foot">
                        {view.status === 'live' ? (
                          <span className="esp-status esp-status--live">
                            <span className="esp-status__dot" aria-hidden="true" />
                            {text.status.live}
                          </span>
                        ) : (
                          <MatchClock view={view} now={now} />
                        )}
                        {fate.script.shootout && finished ? (
                          <span>
                            {text.match.pens} {fate.script.shootout[0]}–{fate.script.shootout[1]}
                          </span>
                        ) : fate.def.setsToWin ? (
                          <span>{text.tournament.bestOfSets(fate.def.setsToWin)}</span>
                        ) : null}
                      </span>
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
