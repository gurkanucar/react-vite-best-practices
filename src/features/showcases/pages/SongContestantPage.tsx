import { PauseOutlined, CaretRightOutlined } from '@ant-design/icons'
import { Button, Tag, Typography } from 'antd'
import { useEffect, useState, type CSSProperties } from 'react'
import { Link, useParams } from 'react-router'
import { RoundStatus } from '@/features/showcases/components/SongContestBits'
import {
  ContestantPhoto,
  Equalizer,
  FloatingNotes,
} from '@/features/showcases/components/SongContestArt'
import { PhotoCredit } from '@/features/showcases/components/SongContestScreen'
import {
  SongContestNotFound,
  SongContestSiteShell,
} from '@/features/showcases/components/SongContestSiteShell'
import {
  clock,
  findContestant,
  finalists,
  songContestRoot,
} from '@/features/showcases/data/songContest'
import { useSongContestCopy, useRound } from '@/features/showcases/hooks/useSongContest'

/** A pretend player: the time runs and the bars dance, but there is no sound. */
function NowPlaying({ duration, color }: { duration: number; color: string }) {
  const { text } = useSongContestCopy()
  const [playing, setPlaying] = useState(false)
  const [position, setPosition] = useState(0)

  useEffect(() => {
    if (!playing) return
    const timer = window.setInterval(
      () => setPosition((seconds) => (seconds + 1 >= duration ? 0 : seconds + 1)),
      1000,
    )
    return () => window.clearInterval(timer)
  }, [playing, duration])

  return (
    <div className="sc-player" style={{ '--accent': color } as CSSProperties}>
      <div className="sc-player__top">
        <Button
          shape="circle"
          size="large"
          type="primary"
          className="sc-player__toggle"
          icon={playing ? <PauseOutlined /> : <CaretRightOutlined />}
          aria-label={playing ? text.contestant.pause : text.contestant.play}
          aria-pressed={playing}
          onClick={() => setPlaying((value) => !value)}
        />
        <span className="sc-player__label">
          <strong>{text.contestant.nowPlaying}</strong>
          <span className="sc-muted">{text.contestant.visualNote}</span>
        </span>
      </div>
      <Equalizer bars={28} playing={playing} className="sc-player__eq" />
      <div className="sc-player__time">
        <span className="sc-tabular">{clock(position)}</span>
        <span className="sc-player__track" aria-hidden="true">
          <span style={{ width: `${(position / duration) * 100}%` }} />
        </span>
        <span className="sc-tabular">{clock(duration)}</span>
      </div>
    </div>
  )
}

export function SongContestantPage({ standalone = false }: { standalone?: boolean }) {
  const { text, language } = useSongContestCopy()
  const root = songContestRoot(standalone)
  const { contestantId } = useParams()
  const contestant = findContestant(contestantId)
  const { now, round } = useRound()

  if (!contestant)
    return (
      <SongContestSiteShell standalone={standalone}>
        <SongContestNotFound root={root} />
      </SongContestSiteShell>
    )

  const others = finalists.filter((item) => item.id !== contestant.id)
  const facts = [
    [text.contestant.song, contestant.song.title],
    [text.contestant.credit, contestant.song.credit[language]],
    [text.contestant.genre, contestant.genre[language]],
    [text.contestant.key, contestant.key[language]],
    [text.contestant.tempo, `${contestant.bpm} ${text.contestant.bpm}`],
    [text.contestant.length, clock(contestant.duration)],
  ]

  return (
    <SongContestSiteShell standalone={standalone}>
      <section
        className="sc-profile-hero"
        style={{ '--accent': contestant.color } as CSSProperties}
      >
        <div className="sc-stage-lights" aria-hidden="true" />
        <FloatingNotes count={12} seed={contestant.age} />
        <div className="sc-wrap sc-profile-hero__inner">
          <figure className="sc-profile-hero__portrait">
            <ContestantPhoto contestant={contestant} sizes="(min-width: 820px) 300px, 240px" />
            <figcaption>{text.contestant.photoNote}</figcaption>
          </figure>
          <div className="sc-profile-hero__copy">
            <span className="sc-profile-hero__tags">
              <Tag className="sc-tag">
                {contestant.finalist ? text.common.finalist : text.common.wildcard}
              </Tag>
              <Tag className="sc-tag">{contestant.genre[language]}</Tag>
            </span>
            <Typography.Title className="sc-profile-hero__name" lang="tr">
              {contestant.name}
            </Typography.Title>
            <Typography.Paragraph className="sc-lead">
              {contestant.city} · {contestant.age} {text.common.years} · {text.common.coach}:{' '}
              {contestant.coach}
            </Typography.Paragraph>
            <blockquote className="sc-quote">“{contestant.quote[language]}”</blockquote>
            <div className="sc-profile-hero__vote">
              <RoundStatus round={round} now={now} />
            </div>
          </div>
        </div>
      </section>

      <section className="sc-wrap sc-section sc-profile">
        <div className="sc-panel">
          <Typography.Title level={2}>{text.contestant.performance}</Typography.Title>
          <NowPlaying duration={contestant.duration} color={contestant.color} />
          <dl className="sc-facts">
            {facts.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="sc-panel">
          <Typography.Title level={2}>{text.contestant.about}</Typography.Title>
          <Typography.Paragraph className="sc-bio">{contestant.bio[language]}</Typography.Paragraph>
        </div>
      </section>

      <section className="sc-wrap sc-section">
        <Typography.Title level={2}>{text.contestant.others}</Typography.Title>
        <div className="sc-others">
          {others.map((item) => (
            <Link
              key={item.id}
              to={`${root}/contestants/${item.id}`}
              className="sc-other"
              style={{ '--accent': item.color } as CSSProperties}
            >
              <span className="sc-other__portrait">
                <ContestantPhoto contestant={item} sizes="64px" />
              </span>
              <span>
                <strong>{item.name}</strong>
                <span className="sc-muted">{item.song.title}</span>
              </span>
            </Link>
          ))}
        </div>
        <Link to={root} className="sc-back">
          {text.common.back}
        </Link>
        <PhotoCredit />
      </section>
    </SongContestSiteShell>
  )
}
