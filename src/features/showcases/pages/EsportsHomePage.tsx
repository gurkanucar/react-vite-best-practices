import {
  ArrowDownOutlined,
  ArrowRightOutlined,
  ArrowUpOutlined,
  MinusOutlined,
} from '@ant-design/icons'
import { Button, Col, Row, Typography } from 'antd'
import { Link } from 'react-router'
import {
  MatchCard,
  SportTag,
  StatusBadge,
  TeamCrest,
  TeamName,
} from '@/features/showcases/components/EsportsBits'
import { EsportsSiteShell } from '@/features/showcases/components/EsportsSiteShell'
import { TournamentCard } from '@/features/showcases/components/EsportsTournamentCard'
import {
  esportsRoot,
  sportIds,
  sports,
  teamById,
  teams,
  tournamentById,
  tournaments,
} from '@/features/showcases/data/esports'
import { clockText, displayScore } from '@/features/showcases/data/esportsFormat'
import {
  HOUR,
  allFates,
  findFate,
  liveFates,
  liveState,
  statusAt,
  teamFates,
  upcomingFates,
  viewMatch,
  winnerTeam,
  type Fate,
} from '@/features/showcases/data/esportsSim'
import {
  useEsportsCopy,
  useEsportsNow,
  useEsportsStore,
} from '@/features/showcases/hooks/useEsportsStore'

const FEATURED_ID = 'anadolu-kupasi'

function HeroScore({ fate, now, root }: { fate: Fate; now: number; root: string }) {
  const { text } = useEsportsCopy()
  const view = viewMatch(fate, now)
  const score = displayScore(view, now)
  const tournament = tournamentById.get(fate.def.tournamentId)!
  return (
    <Link to={`${root}/matches/${fate.def.id}`} className="esp-heroscore">
      <span className="esp-heroscore__meta">
        <StatusBadge status={view.status} />
        <span>{tournament.name}</span>
      </span>
      <span className="esp-heroscore__grid">
        {fate.teams.map((team, index) => (
          <span key={team.id} className="esp-heroscore__team">
            <TeamCrest team={team} size={56} />
            <span className="esp-heroscore__name">{team.name}</span>
            <span className="esp-heroscore__score">{score ? score[index] : '–'}</span>
          </span>
        ))}
      </span>
      <span className="esp-heroscore__clock">
        {view.status === 'live'
          ? clockText(fate, liveState(fate, now), text)
          : text.common.viewMatch}
        <ArrowRightOutlined aria-hidden="true" />
      </span>
    </Link>
  )
}

export function EsportsHomePage({ standalone = false }: { standalone?: boolean }) {
  const { text } = useEsportsCopy()
  const h = text.home
  const root = esportsRoot(standalone)
  const now = useEsportsNow(5_000)
  const follows = useEsportsStore((state) => state.follows)
  const predictions = useEsportsStore((state) => state.predictions)

  const live = liveFates(now)
  // The hero shows a cup match if one is on, then any live football, then anything live.
  const heroFate =
    live.find((fate) => fate.def.stage !== 'league' && fate.def.sport === 'football') ??
    live.find((fate) => fate.def.sport === 'football') ??
    live[0]
  const upcoming = upcomingFates(now, 6)
  const results = allFates(now, [-2 * HOUR, 0])
    .filter((fate) => statusAt(fate, now) === 'finished')
    .sort(
      (first, second) =>
        second.def.startAt + second.script.duration - (first.def.startAt + first.script.duration),
    )
    .slice(0, 6)
  const topTeams = [...teams].sort((first, second) => second.rating - first.rating).slice(0, 6)
  const followed = follows.map((id) => teamById.get(id)).filter((team) => team !== undefined)

  const picks = Object.entries(predictions)
    .map(([matchId, teamId]) => ({ fate: findFate(matchId, now), teamId }))
    .filter((pick): pick is { fate: Fate; teamId: string } => pick.fate !== undefined)
  const settled = picks.filter((pick) => statusAt(pick.fate, now) === 'finished')
  const right = settled.filter((pick) => winnerTeam(pick.fate)?.id === pick.teamId).length

  return (
    <EsportsSiteShell standalone={standalone}>
      <section className="esp-hero">
        <div className="esp-wrap esp-hero__inner">
          <div className="esp-hero__text">
            <span className="esp-eyebrow">{h.eyebrow}</span>
            <Typography.Title className="esp-hero__title">{h.title}</Typography.Title>
            <Typography.Paragraph className="esp-hero__lead">{h.lead}</Typography.Paragraph>
            <div className="esp-hero__actions">
              <Button type="primary" size="large" href="#live">
                {h.watchLive}
              </Button>
              <Link to={`${root}/tournaments`} className="esp-hero__link">
                {h.browse} <ArrowRightOutlined aria-hidden="true" />
              </Link>
            </div>
          </div>
          {heroFate && <HeroScore fate={heroFate} now={now} root={root} />}
        </div>
      </section>

      <div className="esp-wrap esp-section">
        <section className="esp-block">
          <Typography.Title level={2}>{h.sportsTitle}</Typography.Title>
          <div className="esp-games">
            {sportIds.map((id) => (
              <Link
                key={id}
                to={`${root}/tournaments?sport=${id}`}
                className="esp-game"
                style={{ ['--esp-game' as string]: sports[id].color }}
              >
                <span className="esp-game__mark" aria-hidden="true">
                  {text.sports[id].slice(0, 1)}
                </span>
                <span className="esp-playercell">
                  <strong>{text.sports[id]}</strong>
                  <span className="esp-muted">{text.sportBlurb[id]}</span>
                  <span className="esp-game__meta">
                    <span className="esp-status esp-status--live">
                      <span className="esp-status__dot" aria-hidden="true" />
                      {h.liveIn(live.filter((fate) => fate.def.sport === id).length)}
                    </span>
                    <span className="esp-muted">
                      {h.sportTournaments(
                        tournaments.filter((tournament) => tournament.sport === id).length,
                      )}
                    </span>
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section id="live" className="esp-block">
          <div className="esp-block__head">
            <Typography.Title level={2}>{h.liveNow}</Typography.Title>
            <span className="esp-status esp-status--live">
              <span className="esp-status__dot" aria-hidden="true" />
              {h.liveCount(live.length)}
            </span>
          </div>
          <div className="esp-cardgrid">
            {live.map((fate) => (
              <MatchCard key={fate.def.id} fate={fate} now={now} root={root} />
            ))}
          </div>
        </section>

        <Row gutter={[32, 32]}>
          <Col xs={24} lg={16}>
            <div className="esp-stack esp-stack--loose">
              <section className="esp-block">
                <Typography.Title level={2}>{h.featured}</Typography.Title>
                <TournamentCard
                  tournament={tournamentById.get(FEATURED_ID)!}
                  now={now}
                  root={root}
                  featured
                />
              </section>
              <section className="esp-block">
                <Typography.Title level={2}>{h.upcoming}</Typography.Title>
                <div className="esp-cardgrid esp-cardgrid--two">
                  {upcoming.map((fate) => (
                    <MatchCard key={fate.def.id} fate={fate} now={now} root={root} />
                  ))}
                </div>
              </section>
              <section className="esp-block">
                <Typography.Title level={2}>{h.results}</Typography.Title>
                <div className="esp-cardgrid esp-cardgrid--two">
                  {results.map((fate) => (
                    <MatchCard key={fate.def.id} fate={fate} now={now} root={root} />
                  ))}
                </div>
              </section>
            </div>
          </Col>
          <Col xs={24} lg={8}>
            <div className="esp-stack esp-stack--loose">
              <section className="esp-panel">
                <div className="esp-block__head">
                  <Typography.Title level={4}>{h.topTeams}</Typography.Title>
                  <Link to={`${root}/leaderboard`}>{h.fullRankings}</Link>
                </div>
                <ol className="esp-toplist">
                  {topTeams.map((team, index) => {
                    const change = team.rating - team.previousRating
                    return (
                      <li key={team.id}>
                        <span className="esp-rank">{index + 1}</span>
                        <TeamCrest team={team} size={28} />
                        <span className="esp-playercell">
                          <TeamName team={team} root={root} />
                          <SportTag sport={team.sport} />
                        </span>
                        <span className="esp-toplist__rating">
                          {team.rating}
                          <span
                            className={`esp-trend esp-trend--${change > 0 ? 'up' : change < 0 ? 'down' : 'flat'}`}
                          >
                            {change > 0 ? (
                              <ArrowUpOutlined />
                            ) : change < 0 ? (
                              <ArrowDownOutlined />
                            ) : (
                              <MinusOutlined />
                            )}
                          </span>
                        </span>
                      </li>
                    )
                  })}
                </ol>
              </section>
              <section className="esp-panel">
                <Typography.Title level={4}>{h.yourTeams}</Typography.Title>
                {followed.length === 0 ? (
                  <Typography.Text type="secondary">{h.yourTeamsEmpty}</Typography.Text>
                ) : (
                  <ul className="esp-followed">
                    {followed.map((team) => {
                      const next = teamFates(team, now).find(
                        (fate) => statusAt(fate, now) !== 'finished',
                      )
                      return (
                        <li key={team.id}>
                          <TeamCrest team={team} size={32} />
                          <span className="esp-playercell">
                            <TeamName team={team} root={root} />
                            {next ? (
                              <Link to={`${root}/matches/${next.def.id}`} className="esp-muted">
                                {text.common.vs}{' '}
                                {next.teams[0].id === team.id
                                  ? next.teams[1].name
                                  : next.teams[0].name}
                                {' · '}
                                {statusAt(next, now) === 'live'
                                  ? text.status.live
                                  : text.status.upcoming}
                              </Link>
                            ) : (
                              <span className="esp-muted">{text.team.noUpcoming}</span>
                            )}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </section>
              <section className="esp-panel">
                <Typography.Title level={4}>{h.predictions}</Typography.Title>
                <Typography.Paragraph type="secondary">{h.predictionsLead}</Typography.Paragraph>
                {picks.length === 0 ? (
                  <Typography.Text type="secondary">{h.noPredictions}</Typography.Text>
                ) : (
                  <div className="esp-predscore">
                    <strong>{h.predictionScore(right, settled.length)}</strong>
                    {picks.length > settled.length && (
                      <span className="esp-muted">{h.pending(picks.length - settled.length)}</span>
                    )}
                  </div>
                )}
              </section>
            </div>
          </Col>
        </Row>
        <p className="esp-disclaimer">{text.common.fictional}</p>
      </div>
    </EsportsSiteShell>
  )
}
