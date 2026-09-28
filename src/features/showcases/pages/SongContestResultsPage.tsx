import { EyeOutlined, ReloadOutlined, StepForwardOutlined, WifiOutlined } from '@ant-design/icons'
import { Button, Grid, Segmented, Select, Tag } from 'antd'
import { useEffect, useState, type CSSProperties } from 'react'
import { useSearchParams } from 'react-router'
import { Confetti, FloatingNotes, NoteBurst } from '@/features/showcases/components/SongContestArt'
import {
  BarLink,
  ChampionPill,
  PhotoCredit,
  Medal,
  ScreenBar,
  StageCard,
  StatsStrip,
  StripTrophy,
  TiePill,
} from '@/features/showcases/components/SongContestScreen'
import { SongContestSiteShell } from '@/features/showcases/components/SongContestSiteShell'
import { Screen, StageButton } from '@/features/showcases/components/SongContestStage'
import {
  findContestant,
  findScenario,
  scenarios,
  songContestRoot,
  upper,
  type Scenario,
} from '@/features/showcases/data/songContest'
import {
  formatShare,
  rankEntries,
  revealSteps,
  totalVotes,
  type RankedEntry,
  type RevealStep,
} from '@/features/showcases/data/songContestRanking'
import { useSongContestCopy, useStageMode } from '@/features/showcases/hooks/useSongContest'

type Language = 'en' | 'tr'

/** Names joined the way a sentence would: "Elif and Zeynep", "Elif ve Zeynep". */
function joinNames(names: string[], language: Language) {
  return new Intl.ListFormat(language === 'tr' ? 'tr' : 'en', {
    style: 'long',
    type: 'conjunction',
  }).format(names)
}

/** Turkish puts the percent sign first: "%52,3"; English after: "52.3%". */
function percent(tenths: number, language: Language) {
  const value = formatShare(tenths, language)
  return language === 'tr' ? `%${value}` : `${value}%`
}

const namesOf = (step: RevealStep) =>
  step.entries.map((entry) => findContestant(entry.id)?.name ?? entry.id)

/** Keys a presenter's clicker sends: next slide is the next place. */
const NEXT_KEYS = new Set(['ArrowRight', 'PageDown', ' ', 'Enter'])

function isTyping(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    Boolean(
      target.closest('input, textarea, select, button, a, [role="combobox"], [contenteditable]'),
    )
  )
}

/** One place on the stage, face down until its turn and then opened. */
function PlaceCard({
  entry,
  step,
  open,
  next,
  onReveal,
  root,
}: {
  entry: RankedEntry
  step: RevealStep
  open: boolean
  next: boolean
  onReveal: () => void
  root: string
}) {
  const { text, language } = useSongContestCopy()
  const contestant = findContestant(entry.id)
  if (!contestant) return null
  const number = new Intl.NumberFormat(language === 'tr' ? 'tr-TR' : 'en-GB')
  const champion = step.winners && entry.rank === 1
  const medalTone =
    entry.rank === 1 ? 'gold' : entry.rank === 2 ? 'silver' : entry.rank === 3 ? 'bronze' : 'plain'

  if (!open) {
    const face = (
      <>
        <span className="sc-stage-card__corner">
          <Medal rank={entry.rank} />
        </span>
        <span className="sc-curtain__mark" aria-hidden="true">
          ?
        </span>
        <span className="sc-curtain__hint">
          {next ? text.results.tapToReveal : text.results.waiting}
        </span>
      </>
    )
    return next ? (
      <button
        type="button"
        className={`sc-curtain is-next${champion ? ' is-champion' : ''}`}
        onClick={onReveal}
        aria-label={`${text.results.tapToReveal}: ${text.results.place(entry.rank)}`}
      >
        {face}
      </button>
    ) : (
      <div className={`sc-curtain${champion ? ' is-champion' : ''}`}>{face}</div>
    )
  }

  return (
    <StageCard
      contestant={contestant}
      tone={champion ? 'mono' : 'amber'}
      champion={champion}
      className="sc-reveal-card"
      photoSizes="(min-width: 1000px) 26vw, 50vw"
      to={`${root}/contestants/${contestant.id}`}
      corner={<Medal rank={entry.rank} />}
      badge={
        (champion || step.tied) && (
          <span className="sc-badges">
            {champion && <ChampionPill />}
            {step.tied && <TiePill />}
          </span>
        )
      }
      footer={
        <>
          {champion && <NoteBurst color="#ffd23f" count={12} />}
          <span className="sc-count">
            <strong className="sc-tabular">{number.format(entry.votes)}</strong>
            <span>{upper(text.strip.votes, language)}</span>
          </span>
          <span className={`sc-rate sc-rate--${medalTone}`}>
            <strong className="sc-tabular">{percent(entry.shareTenths, language)}</strong>
            <span>{upper(text.strip.rate, language)}</span>
          </span>
        </>
      }
    />
  )
}

function ResultsScreen({
  scenario,
  root,
  stage,
}: {
  scenario: Scenario
  root: string
  stage: ReturnType<typeof useStageMode>
}) {
  const { text, language } = useSongContestCopy()
  const [, setParams] = useSearchParams()
  const isWide = Grid.useBreakpoint().md ?? false
  const number = new Intl.NumberFormat(language === 'tr' ? 'tr-TR' : 'en-GB')

  const steps = revealSteps(scenario.votes)
  const ranked = rankEntries(scenario.votes)
  const [revealed, setRevealed] = useState(0)
  const done = revealed >= steps.length
  const winners = steps.at(-1)
  const last = revealed > 0 ? steps[revealed - 1] : undefined
  const count = steps.length
  const next = () => setRevealed((value) => Math.min(count, value + 1))

  // A clicker or the keyboard can drive the reveal without aiming at a card.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!NEXT_KEYS.has(event.key) || isTyping(event.target)) return
      event.preventDefault()
      setRevealed((value) => Math.min(count, value + 1))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [count])

  const options = scenarios.map((item) => ({ value: item.id, label: item.label[language] }))
  const choose = (id: string) =>
    setParams(
      (current) => {
        const copy = new URLSearchParams(current)
        if (id === scenarios[0].id) copy.delete('scenario')
        else copy.set('scenario', id)
        return copy
      },
      { replace: true },
    )
  const stageQuery = stage.on ? '?stage=1' : ''

  const announcement = !last
    ? ''
    : last.winners
      ? text.results.congrats(joinNames(namesOf(last), language))
      : text.results.revealed(last.rank, joinNames(namesOf(last), language))

  // Step index per contestant, so each card knows whether its place is open yet.
  const stepOf = new Map<string, number>()
  steps.forEach((step, index) => step.entries.forEach((entry) => stepOf.set(entry.id, index)))

  return (
    <>
      <div className="sc-stage-lights" aria-hidden="true" />
      <FloatingNotes count={10} seed={11} />
      <FloatingNotes count={40} seed={31} layer="front" />
      <h1 className="sc-visually-hidden">{text.results.heading}</h1>
      {done && <Confetti />}

      <ScreenBar
        right={
          <>
            <BarLink to={`${root}/live${stageQuery}`} icon={<WifiOutlined />} tone="red">
              {upper(text.nav.live, language)}
            </BarLink>
            <StageButton on={stage.on} onChange={stage.set} />
          </>
        }
      />

      <StatsStrip
        items={[
          {
            label: upper(text.strip.total, language),
            value: <span className="sc-tabular">{number.format(totalVotes(scenario.votes))}</span>,
          },
          {
            label: upper(text.strip.finalists, language),
            value: <span className="sc-tabular">{scenario.votes.length}</span>,
          },
          {
            label: upper(text.strip.champion, language),
            tone: 'gold',
            icon: <StripTrophy />,
            value: done && winners ? upper(joinNames(namesOf(winners), language), 'tr') : '?',
          },
        ]}
      />

      <div className="sc-controls">
        <div className="sc-controls__scenario">
          <span className="sc-controls__label">{text.results.scenario}</span>
          {isWide ? (
            <Segmented
              size="small"
              value={scenario.id}
              options={options}
              onChange={(value) => choose(String(value))}
            />
          ) : (
            <Select
              size="small"
              value={scenario.id}
              options={options}
              onChange={choose}
              aria-label={text.results.scenario}
              className="sc-controls__select"
            />
          )}
          {scenario.id !== 'final' && <Tag className="sc-tag">{text.results.demo}</Tag>}
          <span className="sc-controls__note">{scenario.note[language]}</span>
        </div>
        <div className="sc-controls__buttons">
          <Button
            size="small"
            type="primary"
            icon={<StepForwardOutlined />}
            disabled={done}
            onClick={next}
          >
            {text.results.next}
          </Button>
          <Button
            size="small"
            icon={<EyeOutlined />}
            disabled={done}
            onClick={() => setRevealed(steps.length)}
          >
            {text.results.all}
          </Button>
          <Button
            size="small"
            icon={<ReloadOutlined />}
            disabled={revealed === 0}
            onClick={() => setRevealed(0)}
          >
            {text.results.reset}
          </Button>
        </div>
      </div>

      <ol className="sc-podium" style={{ '--count': ranked.length } as CSSProperties}>
        {ranked.map((entry) => {
          const index = stepOf.get(entry.id) ?? 0
          const step = steps[index]
          return (
            <li
              key={entry.id}
              className={`sc-podium__slot${step.winners && entry.rank === 1 ? ' is-champion' : ''}`}
            >
              <span className="sc-visually-hidden">{text.results.place(entry.rank)}</span>
              <PlaceCard
                entry={entry}
                step={step}
                open={index < revealed}
                next={index === revealed}
                onReveal={() => setRevealed(index + 1)}
                root={root}
              />
            </li>
          )
        })}
      </ol>

      <PhotoCredit />
      <output className="sc-visually-hidden" aria-live="polite">
        {announcement}
      </output>
    </>
  )
}

export function SongContestResultsPage({ standalone = false }: { standalone?: boolean }) {
  const root = songContestRoot(standalone)
  const [params] = useSearchParams()
  const scenario = findScenario(params.get('scenario'))
  const stage = useStageMode()

  return (
    <SongContestSiteShell standalone={standalone} screen>
      <Screen stage={stage.on} onExitStage={() => stage.set(false)} fitted={standalone}>
        <ResultsScreen key={scenario.id} scenario={scenario} root={root} stage={stage} />
      </Screen>
    </SongContestSiteShell>
  )
}
