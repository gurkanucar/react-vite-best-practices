import {
  ArrowRightOutlined,
  CustomerServiceOutlined,
  HeartOutlined,
  TrophyOutlined,
  WifiOutlined,
} from '@ant-design/icons'
import { Button, Typography } from 'antd'
import { useNavigate } from 'react-router'
import { Equalizer, FloatingNotes } from '@/features/showcases/components/SongContestArt'
import { RoundStatus } from '@/features/showcases/components/SongContestBits'
import {
  BarLink,
  PhotoCredit,
  ScreenBar,
  StageCard,
} from '@/features/showcases/components/SongContestScreen'
import { SongContestSiteShell } from '@/features/showcases/components/SongContestSiteShell'
import {
  clock,
  finalists,
  liveStats,
  songContestRoot,
  upper,
} from '@/features/showcases/data/songContest'
import { useRound, useSongContestCopy } from '@/features/showcases/hooks/useSongContest'

const HOW_ICONS = [
  <CustomerServiceOutlined key="listen" />,
  <HeartOutlined key="vote" />,
  <TrophyOutlined key="reveal" />,
]

export function SongContestHomePage({ standalone = false }: { standalone?: boolean }) {
  const { text, language } = useSongContestCopy()
  const root = songContestRoot(standalone)
  const navigate = useNavigate()
  const { now, round } = useRound()
  const total = liveStats(round.id, round.elapsed).total
  const number = new Intl.NumberFormat(language === 'tr' ? 'tr-TR' : 'en-GB')

  return (
    <SongContestSiteShell standalone={standalone}>
      <div className="sc-home">
        <div className="sc-stage-lights" aria-hidden="true" />
        <FloatingNotes count={10} seed={3} />
        <FloatingNotes count={30} seed={23} layer="front" />
        <div className="sc-wrap sc-home__inner">
          <ScreenBar
            right={
              <>
                <BarLink to={`${root}/live`} icon={<WifiOutlined />} tone="red">
                  {upper(text.nav.live, language)}
                </BarLink>
                <BarLink to={`${root}/results`} icon={<TrophyOutlined />} tone="gold">
                  {upper(text.finalResults, language)}
                </BarLink>
              </>
            }
          />

          <section className="sc-home__hero">
            <div className="sc-home__copy">
              <Typography.Text className="sc-eyebrow">{text.home.eyebrow}</Typography.Text>
              <Typography.Title className="sc-home__title">{text.home.title}</Typography.Title>
              <Typography.Paragraph className="sc-lead">{text.home.lead}</Typography.Paragraph>
              <div className="sc-actions">
                <Button
                  type="primary"
                  size="large"
                  icon={<ArrowRightOutlined />}
                  iconPlacement="end"
                  onClick={() => void navigate(`${root}/live`)}
                >
                  {text.home.toLive}
                </Button>
                <Button size="large" onClick={() => void navigate(`${root}/results`)}>
                  {text.home.toResults}
                </Button>
              </div>
            </div>
            <div className="sc-home__status">
              <RoundStatus round={round} now={now} />
              <strong className="sc-home__status-title">
                {round.open ? text.home.statusOpen : text.home.statusClosed}
              </strong>
              <span className="sc-home__count">
                <strong className="sc-tabular">{number.format(total)}</strong>
                <span>{text.home.votesSoFar}</span>
              </span>
              <Equalizer bars={22} playing={round.open} />
            </div>
          </section>

          <section className="sc-home__finalists" aria-labelledby="sc-finalists-title">
            <Typography.Title level={2} id="sc-finalists-title" className="sc-home__section-title">
              {text.home.finalistsTitle}
            </Typography.Title>
            <div className="sc-home__cards">
              {finalists.map((contestant) => (
                <StageCard
                  key={contestant.id}
                  contestant={contestant}
                  to={`${root}/contestants/${contestant.id}`}
                  photoSizes="(min-width: 1000px) 24vw, 50vw"
                  footer={
                    <span className="sc-song">
                      <strong>{contestant.song.title}</strong>
                      <span>
                        {contestant.song.credit[language]} · {clock(contestant.duration)}
                      </span>
                    </span>
                  }
                />
              ))}
            </div>
          </section>

          <section className="sc-home__how" aria-labelledby="sc-how-title">
            <Typography.Title level={2} id="sc-how-title" className="sc-visually-hidden">
              {text.home.howTitle}
            </Typography.Title>
            <ol className="sc-how">
              {text.home.how.map((step, index) => (
                <li key={step.title} className="sc-how__step">
                  <span className="sc-how__icon" aria-hidden="true">
                    {HOW_ICONS[index]}
                  </span>
                  <span>
                    <strong>
                      {index + 1}. {step.title}
                    </strong>
                    <span className="sc-muted">{step.body}</span>
                  </span>
                </li>
              ))}
            </ol>
          </section>
        </div>
        <PhotoCredit />
      </div>
    </SongContestSiteShell>
  )
}
