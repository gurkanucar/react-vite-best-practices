import { TrophyFilled } from '@ant-design/icons'
import { Col, Flex, Row, Table, Typography } from 'antd'
import { Link, useParams } from 'react-router'
import {
  FollowButton,
  FormChips,
  SportTag,
  MatchCard,
  TeamCrest,
  TeamName,
} from '@/features/showcases/components/EsportsBits'
import { formatDay, formatScore, participantLabel } from '@/features/showcases/data/esportsFormat'
import { EsportsNotFound, EsportsSiteShell } from '@/features/showcases/components/EsportsSiteShell'
import {
  esportsRoot,
  teamById,
  teamsOf,
  tournamentById,
  tournaments,
  type Honour,
  type Team,
} from '@/features/showcases/data/esports'
import {
  placements,
  recentForm,
  resultFor,
  sideOf,
  statusAt,
  teamFates,
  teamRecord,
  tournamentStatus,
  tournamentFates,
  type Fate,
} from '@/features/showcases/data/esportsSim'
import { useEsportsCopy, useEsportsNow } from '@/features/showcases/hooks/useEsportsStore'

/** Trophies from this site's finished tournaments, newest first, then the older ones. */
function honoursOf(team: Team, now: number): (Honour & { tournamentId?: string })[] {
  const won = tournaments
    .filter(
      (tournament) =>
        tournament.format === 'knockout' && tournamentStatus(tournament, now) === 'finished',
    )
    .flatMap((tournament) => {
      const placing = placements(tournament, now).find((item) => item.team.id === team.id)
      const end = Math.max(...tournamentFates(tournament.id, now).map((fate) => fate.def.startAt))
      // A shared third place (a losing semi-finalist) counts as a bronze.
      return placing && !placing.alive && placing.places[0] <= 3
        ? [
            {
              year: new Date(end).getFullYear(),
              title: tournament.name,
              place: placing.places[0] as Honour['place'],
              tournamentId: tournament.id,
            },
          ]
        : []
    })
  return [...won, ...team.honours]
}

export function EsportsTeamPage({ standalone = false }: { standalone?: boolean }) {
  const { teamId } = useParams()
  const { text, language } = useEsportsCopy()
  const root = esportsRoot(standalone)
  const now = useEsportsNow(15_000)
  const team = teamById.get(teamId ?? '')

  if (!team) {
    return (
      <EsportsSiteShell standalone={standalone}>
        <EsportsNotFound message={text.team.notFound} root={root} />
      </EsportsSiteShell>
    )
  }

  const tt = text.team
  const fates = teamFates(team, now)
  const upcoming = fates.filter((fate) => statusAt(fate, now) !== 'finished').slice(0, 3)
  const history = fates
    .filter((fate) => statusAt(fate, now) === 'finished')
    .reverse()
    .slice(0, 12)
  const record = teamRecord(team, now)
  const form = recentForm(team, now)
  const rank =
    teamsOf(team.sport)
      .sort(
        (first, second) =>
          (second.rankingPoints ?? second.rating) - (first.rankingPoints ?? first.rating),
      )
      .indexOf(team) + 1
  const honours = honoursOf(team, now)
  const winRate = record.played ? Math.round((record.wins / record.played) * 100) : 0

  return (
    <EsportsSiteShell standalone={standalone}>
      <section
        className="esp-teamhero"
        style={{ ['--team-a' as string]: team.colors[0], ['--team-b' as string]: team.colors[1] }}
      >
        <div className="esp-wrap esp-teamhero__inner">
          <TeamCrest team={team} size={112} />
          <div className="esp-teamhero__text">
            <Flex gap={8} wrap align="center">
              <SportTag sport={team.sport} />
              <span className="esp-chip">{text.regions[team.region]}</span>
            </Flex>
            <Typography.Title className="esp-teamhero__title">
              {participantLabel(team)}
            </Typography.Title>
            <p className="esp-teamhero__sub">
              {team.individual ? `${team.roster[0].country} · ` : `${team.tag} · `}
              {team.city} · {team.individual ? tt.born(team.founded) : tt.founded(team.founded)}
            </p>
            <Flex gap={12} wrap align="center">
              <span className="esp-teamhero__rating">
                <strong>{team.rankingPoints ?? team.rating}</strong>{' '}
                {text.leaderboard.ratingBy[team.sport]}
              </span>
              <span className="esp-teamhero__rank">{tt.rankIn(rank, text.sports[team.sport])}</span>
              <FollowButton team={team} />
            </Flex>
          </div>
        </div>
      </section>

      <div className="esp-wrap esp-section">
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <div className="esp-stack esp-stack--loose">
              <section>
                <Typography.Title level={3}>{tt.upcoming}</Typography.Title>
                {upcoming.length ? (
                  <div className="esp-cardgrid">
                    {upcoming.map((fate) => (
                      <MatchCard key={fate.def.id} fate={fate} now={now} root={root} />
                    ))}
                  </div>
                ) : (
                  <Typography.Text type="secondary">{tt.noUpcoming}</Typography.Text>
                )}
              </section>
              <section>
                <Typography.Title level={3}>{tt.history}</Typography.Title>
                <Table<Fate>
                  className="esp-table"
                  size="middle"
                  pagination={false}
                  rowKey={(fate) => fate.def.id}
                  dataSource={history}
                  scroll={{ x: 'max-content' }}
                  locale={{ emptyText: tt.formEmpty }}
                  columns={[
                    {
                      key: 'date',
                      title: tt.date,
                      render: (_, fate) => formatDay(fate.def.startAt, language),
                    },
                    {
                      key: 'event',
                      title: tt.event,
                      render: (_, fate) => (
                        <span className="esp-playercell">
                          <Link to={`${root}/tournaments/${fate.def.tournamentId}`}>
                            {tournamentById.get(fate.def.tournamentId)?.name}
                          </Link>
                          <span className="esp-muted">
                            {fate.def.stage === 'swiss'
                              ? text.swissRound(fate.def.round + 1)
                              : text.stages[fate.def.stage]}
                          </span>
                        </span>
                      ),
                    },
                    {
                      key: 'opponent',
                      title: tt.opponent,
                      render: (_, fate) => {
                        const opponent =
                          sideOf(fate, team.id) === 'a' ? fate.teams[1] : fate.teams[0]
                        return (
                          <span className="esp-tableteam">
                            <TeamCrest team={opponent} size={24} />
                            <TeamName team={opponent} root={root} />
                          </span>
                        )
                      },
                    },
                    {
                      key: 'result',
                      title: tt.result,
                      render: (_, fate) => {
                        const own = sideOf(fate, team.id) === 'a' ? 0 : 1
                        const score = fate.script.score.map(formatScore)
                        const result = resultFor(fate, team.id)!
                        return (
                          <Link to={`${root}/matches/${fate.def.id}`} className="esp-result">
                            <FormChips results={[result]} />
                            <strong>
                              {score[own]}–{score[1 - own]}
                            </strong>
                          </Link>
                        )
                      },
                    },
                  ]}
                />
              </section>
            </div>
          </Col>
          <Col xs={24} lg={8}>
            <div className="esp-stack esp-stack--loose">
              <section className="esp-panel">
                <Typography.Title level={4}>{tt.record}</Typography.Title>
                <div className="esp-record">
                  <span>
                    <strong>{record.wins}</strong>
                    {text.formLong.W}
                  </span>
                  {(team.sport === 'football' || team.sport === 'chess') && (
                    <span>
                      <strong>{record.draws}</strong>
                      {text.formLong.D}
                    </span>
                  )}
                  <span>
                    <strong>{record.losses}</strong>
                    {text.formLong.L}
                  </span>
                  <span>
                    <strong>{winRate}%</strong>
                    {tt.winRate}
                  </span>
                </div>
                <Typography.Text type="secondary" className="esp-block-label">
                  {tt.form}
                </Typography.Text>
                {form.length ? (
                  <FormChips results={form.map((item) => item.result)} />
                ) : (
                  <Typography.Text type="secondary">{tt.formEmpty}</Typography.Text>
                )}
              </section>
              {team.individual ? (
                <section className="esp-panel">
                  <Typography.Title level={4}>{tt.profile}</Typography.Title>
                  <dl className="esp-profile">
                    {team.roster[0].title && (
                      <>
                        <dt>{tt.title}</dt>
                        <dd>{team.roster[0].title}</dd>
                      </>
                    )}
                    {team.rankingPoints !== undefined && (
                      <>
                        <dt>{text.leaderboard.ratingBy.tennis}</dt>
                        <dd>
                          {new Intl.NumberFormat(language === 'tr' ? 'tr-TR' : 'en-GB').format(
                            team.rankingPoints,
                          )}
                        </dd>
                      </>
                    )}
                    {team.sport === 'chess' && (
                      <>
                        <dt>{text.leaderboard.ratingBy.chess}</dt>
                        <dd>{team.rating}</dd>
                      </>
                    )}
                    {team.hand && (
                      <>
                        <dt>{tt.hand}</dt>
                        <dd>{tt.hands[team.hand]}</dd>
                      </>
                    )}
                    <dt>{tt.coach}</dt>
                    <dd>{team.coach}</dd>
                  </dl>
                </section>
              ) : (
                <section className="esp-panel">
                  <Typography.Title level={4}>{tt.roster}</Typography.Title>
                  <ul className="esp-roster">
                    {team.roster.map((player) => (
                      <li key={player.name}>
                        <span className="esp-avatar" aria-hidden="true">
                          {player.number}
                        </span>
                        <span className="esp-playercell">
                          <strong>{player.name}</strong>
                          <span className="esp-muted">{player.country}</span>
                        </span>
                        <span className="esp-chip">{text.positions[player.position]}</span>
                      </li>
                    ))}
                    <li>
                      <span className="esp-avatar esp-avatar--coach" aria-hidden="true">
                        C
                      </span>
                      <span className="esp-playercell">
                        <strong>{team.coach}</strong>
                        <span className="esp-muted">{tt.coach}</span>
                      </span>
                    </li>
                  </ul>
                </section>
              )}
              <section className="esp-panel">
                <Typography.Title level={4}>{tt.honours}</Typography.Title>
                {honours.length ? (
                  <ul className="esp-honours">
                    {honours.map((honour) => (
                      <li key={`${honour.title}-${honour.year}`}>
                        <span className={`esp-medal esp-medal--${honour.place}`} aria-hidden="true">
                          <TrophyFilled />
                        </span>
                        <span className="esp-playercell">
                          {'tournamentId' in honour && honour.tournamentId ? (
                            <Link to={`${root}/tournaments/${honour.tournamentId}`}>
                              {honour.title}
                            </Link>
                          ) : (
                            <strong>{honour.title}</strong>
                          )}
                          <span className="esp-muted">
                            {tt.places[honour.place]} · {honour.year}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Typography.Text type="secondary">{tt.noHonours}</Typography.Text>
                )}
              </section>
            </div>
          </Col>
        </Row>
      </div>
    </EsportsSiteShell>
  )
}
