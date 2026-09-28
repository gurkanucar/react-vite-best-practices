import { CheckCircleFilled, CloseCircleFilled, LockOutlined } from '@ant-design/icons'
import { Col, Row, Typography } from 'antd'
import { Link, useParams } from 'react-router'
import {
  FollowButton,
  SportTag,
  StatusBadge,
  TeamCrest,
} from '@/features/showcases/components/EsportsBits'
import { ChessBoard } from '@/features/showcases/components/EsportsChessBoard'
import { FanReactions } from '@/features/showcases/components/EsportsFans'
import {
  BoxScore,
  HighlightBanner,
  LiveFeed,
  LiveTicker,
  Lineups,
  PeriodTable,
  StatsCompare,
} from '@/features/showcases/components/EsportsLive'
import { EsportsNotFound, EsportsSiteShell } from '@/features/showcases/components/EsportsSiteShell'
import { esportsRoot, tournamentById, type Team } from '@/features/showcases/data/esports'
import {
  clockText,
  formatScore,
  formatSpan,
  formatWhen,
  participantLabel,
  sourceLabel,
} from '@/features/showcases/data/esportsFormat'
import {
  crowdSplit,
  findFate,
  liveState,
  viewMatch,
  winChance,
  type Fate,
  type MatchStatus,
} from '@/features/showcases/data/esportsSim'
import {
  useEsportsCopy,
  useEsportsNow,
  useEsportsStore,
} from '@/features/showcases/hooks/useEsportsStore'

function Prediction({
  fate,
  teams,
  status,
}: {
  fate: Fate
  teams: [Team | null, Team | null]
  status: MatchStatus
}) {
  const { text } = useEsportsCopy()
  const m = text.match
  const pick = useEsportsStore((state) => state.predictions[fate.def.id])
  const predict = useEsportsStore((state) => state.predict)
  const known = teams[0] !== null && teams[1] !== null
  const crowd = crowdSplit(fate)
  const winner = fate.script.winner === null ? null : fate.teams[fate.script.winner === 'a' ? 0 : 1]

  return (
    <section className="esp-panel esp-predict">
      <Typography.Title level={4}>{m.predict}</Typography.Title>
      {!known ? (
        <Typography.Text type="secondary">{m.predictionUnknown}</Typography.Text>
      ) : (
        <>
          {status === 'upcoming' && (
            <Typography.Paragraph type="secondary">{m.predictLead}</Typography.Paragraph>
          )}
          <div className="esp-predict__options">
            {teams.map((team) =>
              team ? (
                <button
                  key={team.id}
                  type="button"
                  className={`esp-predict__option${pick === team.id ? ' is-picked' : ''}`}
                  aria-pressed={pick === team.id}
                  aria-label={m.pickTeam(team.name)}
                  disabled={status !== 'upcoming'}
                  onClick={() => predict(fate.def.id, team.id)}
                >
                  <TeamCrest team={team} size={36} />
                  <span>{team.name}</span>
                </button>
              ) : null,
            )}
          </div>
          <div className="esp-crowd">
            <span className="esp-fact__label">{m.crowd}</span>
            <span className="esp-crowd__bar" aria-hidden="true">
              <span className="esp-compare__a" style={{ width: `${crowd[0]}%` }} />
              <span className="esp-compare__b" style={{ width: `${crowd[1]}%` }} />
            </span>
            <span className="esp-crowd__values">
              <span>{crowd[0]}%</span>
              <span>{crowd[1]}%</span>
            </span>
          </div>
          {status === 'live' && (
            <Typography.Text type="secondary" className="esp-predict__note">
              <LockOutlined aria-hidden="true" /> {m.locked}
            </Typography.Text>
          )}
          {status === 'finished' && pick && (
            <div className={`esp-predict__result ${winner?.id === pick ? 'is-right' : 'is-wrong'}`}>
              {winner?.id === pick ? (
                <CheckCircleFilled aria-hidden="true" />
              ) : (
                <CloseCircleFilled aria-hidden="true" />
              )}
              {winner?.id === pick ? m.correct : m.wrong}
            </div>
          )}
        </>
      )}
    </section>
  )
}

export function EsportsMatchPage({ standalone = false }: { standalone?: boolean }) {
  const { matchId } = useParams()
  const { text, language } = useEsportsCopy()
  const root = esportsRoot(standalone)
  const now = useEsportsNow(1_000)
  const fate = findFate(matchId ?? '', now)

  if (!fate) {
    return (
      <EsportsSiteShell standalone={standalone}>
        <EsportsNotFound message={text.match.notFound} root={root} />
      </EsportsSiteShell>
    )
  }

  const m = text.match
  const view = viewMatch(fate, now)
  const state = liveState(fate, now)
  const tournament = tournamentById.get(fate.def.tournamentId)!
  const known = view.teams[0] !== null && view.teams[1] !== null
  const started = view.status !== 'upcoming'
  const live = view.status === 'live'
  const chance = known ? winChance(fate.teams[0].rating, fate.teams[1].rating) : 0.5
  const stage =
    fate.def.stage === 'league'
      ? text.stages.league
      : fate.def.stage === 'swiss'
        ? `${text.swissRound(fate.def.round + 1)} · ${text.tournament.board(fate.def.position + 1)}`
        : text.stages[fate.def.stage]
  const shootout = state.finished ? fate.script.shootout : undefined

  return (
    <EsportsSiteShell standalone={standalone}>
      {live && <LiveTicker fate={fate} state={state} />}
      {live && <HighlightBanner fate={fate} state={state} />}
      <section className={`esp-scoreboard esp-scoreboard--${view.status}`}>
        <div className="esp-wrap">
          <div className="esp-scoreboard__meta">
            <SportTag sport={fate.def.sport} />
            <Link to={`${root}/tournaments/${tournament.id}`}>{tournament.name}</Link>
            <span>{stage}</span>
            <span>{formatWhen(fate.def.startAt, now, text, language)}</span>
          </div>
          <div className="esp-scoreboard__grid">
            {view.teams.map((team, side) => (
              <div
                key={side}
                className={`esp-scoreboard__team esp-scoreboard__team--${side === 0 ? 'a' : 'b'}`}
              >
                <TeamCrest team={team} size={72} />
                <div className="esp-scoreboard__name">
                  {team ? (
                    <>
                      <Link to={`${root}/teams/${team.id}`}>{participantLabel(team)}</Link>
                      <span className="esp-scoreboard__sub">
                        {team.city}
                        {fate.def.sport === 'chess' && fate.script.chess
                          ? ` · ${fate.script.chess[0].white === (side === 0 ? 'a' : 'b') ? m.white : m.black}`
                          : ''}
                      </span>
                    </>
                  ) : (
                    <span>{sourceLabel(view.sources[side], text, now)}</span>
                  )}
                </div>
                {team && <FollowButton team={team} compact />}
              </div>
            ))}
            <div className="esp-scoreboard__centre">
              <StatusBadge status={view.status} />
              {started ? (
                <div
                  className="esp-scoreboard__score"
                  aria-label={`${formatScore(state.score[0])} – ${formatScore(state.score[1])}`}
                >
                  <span className={state.winner === 'a' ? 'is-winner' : ''}>
                    {formatScore(state.score[0])}
                  </span>
                  <span className="esp-scoreboard__colon">:</span>
                  <span className={state.winner === 'b' ? 'is-winner' : ''}>
                    {formatScore(state.score[1])}
                  </span>
                </div>
              ) : (
                <div className="esp-scoreboard__vs">{text.common.vs}</div>
              )}
              <div className="esp-scoreboard__clock">
                {view.status === 'upcoming'
                  ? text.common.startsIn(formatSpan(fate.def.startAt - now, language))
                  : clockText(fate, state, text)}
              </div>
              {shootout && (
                <div className="esp-scoreboard__pens">
                  {m.pens} {shootout[0]}–{shootout[1]}
                </div>
              )}
            </div>
          </div>
          {started && fate.def.sport !== 'chess' && (
            <div className="esp-scoreboard__periods">
              <PeriodTable fate={fate} state={state} />
            </div>
          )}
        </div>
      </section>

      <div className="esp-wrap esp-section">
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={15}>
            <div className="esp-stack esp-stack--loose">
              {fate.def.sport === 'chess' && known && <ChessBoard fate={fate} state={state} />}
              {started ? (
                <>
                  <StatsCompare fate={fate} state={state} />
                  <BoxScore fate={fate} state={state} root={root} />
                </>
              ) : known ? (
                <>
                  <section className="esp-panel">
                    <Typography.Title level={4}>{m.winChance}</Typography.Title>
                    <div className="esp-crowd">
                      <span className="esp-crowd__bar esp-crowd__bar--big" aria-hidden="true">
                        <span className="esp-compare__a" style={{ width: `${chance * 100}%` }} />
                        <span
                          className="esp-compare__b"
                          style={{ width: `${(1 - chance) * 100}%` }}
                        />
                      </span>
                      <span className="esp-crowd__values">
                        <span>
                          {fate.teams[0].tag} {Math.round(chance * 100)}%
                        </span>
                        <span>
                          {Math.round((1 - chance) * 100)}% {fate.teams[1].tag}
                        </span>
                      </span>
                    </div>
                  </section>
                  <Lineups fate={fate} root={root} />
                </>
              ) : (
                <section className="esp-panel">
                  <Typography.Text type="secondary">{m.predictionUnknown}</Typography.Text>
                </section>
              )}
            </div>
          </Col>
          <Col xs={24} lg={9}>
            <div className="esp-stack esp-stack--loose">
              {known && <FanReactions fate={fate} state={state} status={view.status} />}
              {started && <LiveFeed fate={fate} state={state} />}
              <Prediction fate={fate} teams={view.teams} status={view.status} />
            </div>
          </Col>
        </Row>
      </div>
    </EsportsSiteShell>
  )
}
