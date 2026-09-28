import { EyeInvisibleOutlined, TrophyOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useNavigate } from 'react-router'
import { FloatingNotes } from '@/features/showcases/components/SongContestArt'
import {
  LiveFlow,
  LiveSplit,
  LiveStrip,
  VoterTicker,
} from '@/features/showcases/components/SongContestLive'
import {
  BarLink,
  PhotoCredit,
  ScreenBar,
  StageCard,
} from '@/features/showcases/components/SongContestScreen'
import { SongContestSiteShell } from '@/features/showcases/components/SongContestSiteShell'
import { Screen, StageButton } from '@/features/showcases/components/SongContestStage'
import { finalists, songContestRoot, upper } from '@/features/showcases/data/songContest'
import {
  useRoundPhase,
  useSongContestCopy,
  useStageMode,
} from '@/features/showcases/hooks/useSongContest'

/**
 * The live voting screen. The page itself only re-renders when the round opens or closes;
 * the strip, the charts and the ticker keep their own time.
 */
export function SongContestLivePage({ standalone = false }: { standalone?: boolean }) {
  const { text, language } = useSongContestCopy()
  const root = songContestRoot(standalone)
  const navigate = useNavigate()
  const stage = useStageMode()
  const phase = useRoundPhase()
  const stageQuery = stage.on ? '?stage=1' : ''

  const screen = (
    <>
      <div className="sc-stage-lights" aria-hidden="true" />
      <FloatingNotes count={10} seed={7} />
      <FloatingNotes count={40} seed={27} layer="front" />
      <h1 className="sc-visually-hidden">{text.live.heading}</h1>

      <ScreenBar
        right={
          <>
            <BarLink to={`${root}/results${stageQuery}`} icon={<TrophyOutlined />} tone="gold">
              {upper(text.finalResults, language)}
            </BarLink>
            <StageButton on={stage.on} onChange={stage.set} />
          </>
        }
      />

      <LiveStrip />

      <div className="sc-controls">
        <div className="sc-controls__scenario">
          <strong className="sc-controls__title">
            {phase.open ? text.live.title : text.live.closedTitle}
          </strong>
          <span className="sc-secret">
            <EyeInvisibleOutlined aria-hidden="true" />{' '}
            {phase.open ? text.live.secret : text.live.closedLead}
          </span>
        </div>
        {!phase.open && (
          <Button
            size="small"
            type="primary"
            icon={<TrophyOutlined />}
            onClick={() => void navigate(`${root}/results${stageQuery}`)}
          >
            {text.live.toResults}
          </Button>
        )}
      </div>

      <div className="sc-main">
        <section className="sc-main__singers" aria-label={text.home.finalistsTitle}>
          {finalists.map((contestant) => (
            <StageCard
              key={contestant.id}
              contestant={contestant}
              to={`${root}/contestants/${contestant.id}`}
              photoSizes="(min-width: 1000px) 19vw, 50vw"
              footer={
                <span className="sc-song">
                  <strong>{contestant.song.title}</strong>
                  <span>{contestant.song.credit[language]}</span>
                </span>
              }
            />
          ))}
        </section>

        <div className="sc-main__side">
          <LiveSplit />
          <LiveFlow />
        </div>
      </div>

      <VoterTicker />
      <PhotoCredit />
    </>
  )

  return (
    <SongContestSiteShell standalone={standalone} screen>
      <Screen stage={stage.on} onExitStage={() => stage.set(false)} fitted={standalone}>
        {screen}
      </Screen>
    </SongContestSiteShell>
  )
}
