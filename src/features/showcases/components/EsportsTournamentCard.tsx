import {
  CalendarOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  TrophyOutlined,
} from '@ant-design/icons'
import { Link } from 'react-router'
import {
  SportTag,
  StatusBadge,
  TeamCrest,
  TournamentArt,
} from '@/features/showcases/components/EsportsBits'
import { formatDateRange, formatLabel, formatMoney } from '@/features/showcases/data/esportsFormat'
import { sports, tournamentTeams, type Tournament } from '@/features/showcases/data/esports'
import { placements, tournamentDates, tournamentStatus } from '@/features/showcases/data/esportsSim'
import { useEsportsCopy } from '@/features/showcases/hooks/useEsportsStore'

export function TournamentCard({
  tournament,
  now,
  root,
  featured = false,
}: {
  tournament: Tournament
  now: number
  root: string
  featured?: boolean
}) {
  const { text, language } = useEsportsCopy()
  const status = tournamentStatus(tournament, now)
  const champion =
    status === 'finished' && tournament.format === 'knockout'
      ? placements(tournament, now).find((item) => item.places[0] === 1)?.team
      : undefined
  return (
    <Link
      to={`${root}/tournaments/${tournament.id}`}
      className={`esp-tcard${featured ? ' esp-tcard--featured' : ''}`}
    >
      <span className="esp-tcard__art">
        <TournamentArt tournament={tournament} height={featured ? 180 : 110} />
        <span className="esp-tcard__badges">
          <StatusBadge status={status} />
          <span className="esp-chip esp-chip--glass">{text.tiers[tournament.tier]}</span>
        </span>
      </span>
      <span className="esp-tcard__body">
        <SportTag sport={tournament.sport} />
        <span className="esp-tcard__name">{tournament.name}</span>
        <span className="esp-tcard__format">{formatLabel(tournament, text)}</span>
        <span className="esp-tcard__meta">
          <span>
            <CalendarOutlined aria-hidden="true" />
            {formatDateRange(tournamentDates(tournament, now), language)}
          </span>
          <span>
            <EnvironmentOutlined aria-hidden="true" />
            {tournament.location[language]}
          </span>
          <span>
            <TeamOutlined aria-hidden="true" />
            {text.tournament.count(
              tournamentTeams(tournament).length,
              sports[tournament.sport].individual,
            )}
          </span>
        </span>
        <span className="esp-tcard__foot">
          <span className="esp-tcard__prize">
            <TrophyOutlined aria-hidden="true" />
            {formatMoney(tournament.prizePool, tournament.currency, language)}
          </span>
          {champion && (
            <span className="esp-tcard__champion">
              <TeamCrest team={champion} size={22} />
              {champion.name}
            </span>
          )}
        </span>
      </span>
    </Link>
  )
}
