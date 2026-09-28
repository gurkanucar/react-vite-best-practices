import { StarFilled, StarOutlined } from '@ant-design/icons'
import { Button, Tooltip } from 'antd'
import { Link } from 'react-router'
import {
  sports,
  tournamentById,
  type SportId,
  type Team,
  type Tournament,
} from '@/features/showcases/data/esports'
import {
  clockText,
  displayScore,
  formatSpan,
  formatWhen,
  sourceLabel,
  usesSets,
} from '@/features/showcases/data/esportsFormat'
import {
  HOUR,
  liveState,
  viewMatch,
  type Fate,
  type FormResult,
  type MatchStatus,
  type MatchView,
} from '@/features/showcases/data/esportsSim'
import { useEsportsCopy, useEsportsStore } from '@/features/showcases/hooks/useEsportsStore'

/**
 * A club's shield, or a player's round badge, in their colours. Always square. The name
 * is always written next to it, so it is hidden from screen readers.
 */
export function TeamCrest({ team, size = 40 }: { team: Team | null; size?: number }) {
  if (!team) {
    return (
      <span
        className="esp-crest esp-crest--empty"
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
        ?
      </span>
    )
  }
  const [primary, secondary] = team.colors
  if (team.individual) {
    const initials = team.name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
    return (
      <svg
        className="esp-crest"
        width={size}
        height={size}
        viewBox="0 0 40 40"
        aria-hidden="true"
        focusable="false"
      >
        <circle cx="20" cy="20" r="19" fill={primary} stroke={secondary} strokeWidth="2" />
        <text
          x="20"
          y="25"
          textAnchor="middle"
          fontSize="14"
          fontWeight="800"
          fill={secondary}
          fontFamily="Inter, system-ui, sans-serif"
        >
          {initials}
        </text>
      </svg>
    )
  }
  return (
    <svg
      className="esp-crest"
      width={size}
      height={size}
      viewBox="0 0 40 40"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M20 2 L36 8 V20 C36 29 29 35 20 38 C11 35 4 29 4 20 V8 Z" fill={primary} />
      <path d="M20 2 L36 8 V20 C36 29 29 35 20 38 Z" fill={secondary} opacity="0.28" />
      <path
        d="M20 2 L36 8 V20 C36 29 29 35 20 38 C11 35 4 29 4 20 V8 Z"
        fill="none"
        stroke={secondary}
        strokeWidth="2"
      />
      <text
        x="20"
        y="24"
        textAnchor="middle"
        fontSize="11"
        fontWeight="800"
        fill={secondary}
        fontFamily="Inter, system-ui, sans-serif"
      >
        {team.tag}
      </text>
    </svg>
  )
}

export function TeamName({
  team,
  root,
  placeholder,
}: {
  team: Team | null
  root: string
  placeholder?: string
}) {
  if (!team) return <span className="esp-muted">{placeholder}</span>
  return (
    <Link className="esp-teamlink" to={`${root}/teams/${team.id}`}>
      {team.name}
    </Link>
  )
}

export function StatusBadge({ status }: { status: MatchStatus }) {
  const { text } = useEsportsCopy()
  return (
    <span className={`esp-status esp-status--${status}`}>
      {status === 'live' && <span className="esp-status__dot" aria-hidden="true" />}
      {text.status[status]}
    </span>
  )
}

export function SportTag({ sport }: { sport: SportId }) {
  const { text } = useEsportsCopy()
  return (
    <span className="esp-gametag" style={{ ['--esp-game' as string]: sports[sport].color }}>
      {text.sports[sport]}
    </span>
  )
}

export function FormChips({ results }: { results: FormResult[] }) {
  const { text } = useEsportsCopy()
  return (
    <span className="esp-form">
      {results.map((result, index) => (
        <Tooltip key={index} title={text.formLong[result]}>
          <span
            className={`esp-form__chip esp-form__chip--${result}`}
            aria-label={text.formLong[result]}
          >
            {text.form[result]}
          </span>
        </Tooltip>
      ))}
    </span>
  )
}

export function FollowButton({ team, compact = false }: { team: Team; compact?: boolean }) {
  const { text } = useEsportsCopy()
  const following = useEsportsStore((state) => state.follows.includes(team.id))
  const toggle = useEsportsStore((state) => state.toggleFollow)
  const label = following ? text.common.unfollowTeam(team.name) : text.common.followTeam(team.name)
  if (compact) {
    return (
      <Tooltip title={label}>
        <Button
          type="text"
          className={`esp-follow-icon${following ? ' is-on' : ''}`}
          aria-label={label}
          aria-pressed={following}
          icon={following ? <StarFilled /> : <StarOutlined />}
          onClick={() => toggle(team.id)}
        />
      </Tooltip>
    )
  }
  return (
    <Button
      type={following ? 'default' : 'primary'}
      icon={following ? <StarFilled /> : <StarOutlined />}
      aria-pressed={following}
      aria-label={label}
      onClick={() => toggle(team.id)}
    >
      {following ? text.common.following : text.common.follow}
    </Button>
  )
}

/** A clock line for a match: countdown, the live clock, or the date. */
export function MatchClock({ view, now }: { view: MatchView; now: number }) {
  const { text, language } = useEsportsCopy()
  if (view.status === 'upcoming') {
    const wait = view.fate.def.startAt - now
    return (
      <span className="esp-muted">
        {wait < 12 * HOUR
          ? text.common.startsIn(formatSpan(wait, language))
          : formatWhen(view.fate.def.startAt, now, text, language)}
      </span>
    )
  }
  if (view.status === 'finished') {
    return (
      <span className="esp-muted">{formatWhen(view.fate.def.startAt, now, text, language)}</span>
    )
  }
  return (
    <span className="esp-live-clock">{clockText(view.fate, liveState(view.fate, now), text)}</span>
  )
}

/** Set or game scores in brackets under a set-based score: "6–4 3–2". */
function PeriodLine({ fate, now }: { fate: Fate; now: number }) {
  const state = liveState(fate, now)
  if (!usesSets(fate.def.sport) || !state.periods.length) return null
  return (
    <span className="esp-matchcard__periods">
      {state.periods.map((period, index) => (
        <span key={index}>
          {period[0]}–{period[1]}
        </span>
      ))}
    </span>
  )
}

/** A compact card for one match, used in lists and rails. */
export function MatchCard({ fate, now, root }: { fate: Fate; now: number; root: string }) {
  const { text } = useEsportsCopy()
  const view = viewMatch(fate, now)
  const score = displayScore(view, now)
  const winner = view.status === 'finished' ? fate.script.winner : null
  const tournament = tournamentById.get(fate.def.tournamentId)
  const stage =
    fate.def.stage === 'league'
      ? tournament?.name
      : fate.def.stage === 'swiss'
        ? `${tournament?.name} · ${text.swissRound(fate.def.round + 1)}`
        : `${text.stages[fate.def.stage]} · ${tournament?.name}`
  return (
    <Link
      to={`${root}/matches/${fate.def.id}`}
      className={`esp-matchcard esp-matchcard--${view.status}`}
    >
      <span className="esp-matchcard__head">
        <span className="esp-matchcard__stage">
          <SportTag sport={fate.def.sport} />
          <span className="esp-matchcard__event">{stage}</span>
        </span>
        {view.status === 'live' ? (
          <StatusBadge status="live" />
        ) : (
          <MatchClock view={view} now={now} />
        )}
      </span>
      {(['a', 'b'] as const).map((side, index) => {
        const team = view.teams[index]
        return (
          <span
            key={side}
            className={`esp-matchcard__row${winner === side ? ' is-winner' : ''}${winner && winner !== side ? ' is-loser' : ''}`}
          >
            <TeamCrest team={team} size={24} />
            <span className="esp-matchcard__name">
              {team?.name ?? sourceLabel(view.sources[index], text, now)}
            </span>
            <span className="esp-matchcard__score">{score ? score[index] : ''}</span>
          </span>
        )
      })}
      {view.status !== 'upcoming' && fate.script.shootout && view.status === 'finished' && (
        <span className="esp-matchcard__periods">
          {text.match.pens} {fate.script.shootout[0]}–{fate.script.shootout[1]}
        </span>
      )}
      {view.status !== 'upcoming' && <PeriodLine fate={fate} now={now} />}
      {view.status === 'live' && (
        <span className="esp-matchcard__foot">
          <MatchClock view={view} now={now} />
        </span>
      )}
    </Link>
  )
}

/** Abstract banner art in the tournament's colours; no photos. */
export function TournamentArt({
  tournament,
  height = 120,
}: {
  tournament: Tournament
  height?: number
}) {
  const [from, to] = tournament.art
  const id = `esp-art-${tournament.id}`
  const sport = tournament.sport
  return (
    <svg
      className="esp-art"
      viewBox="0 0 400 120"
      preserveAspectRatio="xMidYMid slice"
      style={{ height }}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
      </defs>
      <rect width="400" height="120" fill={`url(#${id})`} />
      <g stroke="#fff" strokeOpacity="0.24" fill="none" strokeWidth="2">
        {sport === 'football' && (
          <>
            <rect x="230" y="18" width="150" height="84" />
            <line x1="305" y1="18" x2="305" y2="102" />
            <circle cx="305" cy="60" r="16" />
          </>
        )}
        {sport === 'basketball' && (
          <>
            <circle cx="320" cy="60" r="38" />
            <path d="M282 60 h76 M320 22 v76 M292 33 q28 27 0 54 M348 33 q-28 27 0 54" />
          </>
        )}
        {sport === 'volleyball' && (
          <>
            <path d="M230 70 h150 M240 70 v-40 M370 70 v-40 M240 38 h130" />
            <circle cx="305" cy="24" r="10" />
          </>
        )}
        {sport === 'tennis' && (
          <>
            <rect x="240" y="20" width="130" height="80" />
            <path d="M240 60 h130 M305 20 v80 M258 20 v80 M352 20 v80" />
          </>
        )}
        {sport === 'chess' && (
          <path d="M250 20 h96 v96 M250 20 v96 h96 M274 20 v96 M298 20 v96 M322 20 v96 M250 44 h96 M250 68 h96 M250 92 h96" />
        )}
      </g>
      <g fill="#fff" fillOpacity="0.07">
        <circle cx="40" cy="110" r="70" />
        <circle cx="140" cy="-10" r="50" />
      </g>
    </svg>
  )
}
