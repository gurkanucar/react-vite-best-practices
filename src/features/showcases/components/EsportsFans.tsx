import { Button, Radio, Tooltip, Typography } from 'antd'
import { useCallback, useEffect, useRef, useState } from 'react'
import { TeamCrest } from '@/features/showcases/components/EsportsBits'
import { REACTIONS, cheers, crowdCount } from '@/features/showcases/data/esportsFans'
import { formatCount, teamColor } from '@/features/showcases/data/esportsFormat'
import {
  crowdSplit,
  type Fate,
  type LiveState,
  type MatchStatus,
  type ScriptEvent,
  type Side,
} from '@/features/showcases/data/esportsSim'
import { useEsportsCopy, useEsportsStore } from '@/features/showcases/hooks/useEsportsStore'

interface Floater {
  id: number
  emoji: string
  side: Side
  /** Horizontal start inside the side's lane, in percent. */
  x: number
  /** Sideways drift while rising, in pixels. */
  drift: number
  own: boolean
}

const MAX_FLOATERS = 36
/** At most this many of your own taps per second; the rest are ignored. */
const TAPS_PER_SECOND = 6

function prefersReducedMotion() {
  try {
    return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  } catch {
    return false
  }
}

/**
 * The stands on a live match: pick a side, tap a reaction, and it floats up from that side
 * of the stage like a live stream. Other fans' reactions stream in too, and spike when their
 * side scores. With reduced motion there are no floaters; the counters pulse instead.
 */
export function FanReactions({
  fate,
  state,
  status,
}: {
  fate: Fate
  state: LiveState
  status: MatchStatus
}) {
  const { text, language } = useEsportsCopy()
  const f = text.fans
  const side = useEsportsStore((store) => store.fanSides[fate.def.id])
  const setSide = useEsportsStore((store) => store.setFanSide)
  const [floaters, setFloaters] = useState<Floater[]>([])
  const [extra, setExtra] = useState<[number, number]>([0, 0])
  const [bump, setBump] = useState<Side | null>(null)
  const [announcement, setAnnouncement] = useState('')
  const nextId = useRef(0)
  const taps = useRef<number[]>([])
  const lastAnnounced = useRef(Number.NEGATIVE_INFINITY)
  const reduced = useRef(prefersReducedMotion())
  const live = status === 'live'

  const launch = useCallback((floaterSide: Side, emoji: string, own: boolean) => {
    setExtra((count) => (floaterSide === 'a' ? [count[0] + 1, count[1]] : [count[0], count[1] + 1]))
    setBump(floaterSide)
    if (reduced.current) return
    nextId.current += 1
    const floater: Floater = {
      id: nextId.current,
      emoji,
      side: floaterSide,
      x: 15 + Math.random() * 70,
      drift: (Math.random() - 0.5) * 60,
      own,
    }
    setFloaters((list) => [...list.slice(-(MAX_FLOATERS - 1)), floater])
  }, [])

  // Other fans: a steady trickle, busier for the side that just scored.
  const recent = useRef<ScriptEvent[]>([])
  useEffect(() => {
    recent.current = state.events.filter(
      (event) => cheers(event) && state.elapsed - event.at < 20_000,
    )
  }, [state.events, state.elapsed])
  useEffect(() => {
    if (!live) return
    const [shareA] = crowdSplit(fate)
    const timer = window.setInterval(() => {
      for (const crowdSide of ['a', 'b'] as const) {
        const share = crowdSide === 'a' ? shareA / 100 : 1 - shareA / 100
        const spike = recent.current.filter((event) => event.side === crowdSide)
        const boost = spike.some((event) => event.big) ? 6 : spike.length ? 2.2 : 1
        const perTick = (0.35 + share * 0.5) * boost
        let count = Math.floor(perTick) + (Math.random() < perTick % 1 ? 1 : 0)
        while (count > 0) {
          launch(crowdSide, REACTIONS[Math.floor(Math.random() * REACTIONS.length)].emoji, false)
          count -= 1
        }
      }
    }, 700)
    return () => window.clearInterval(timer)
  }, [live, fate, launch])

  useEffect(() => {
    if (!bump) return
    const timer = window.setTimeout(() => setBump(null), 450)
    return () => window.clearTimeout(timer)
  }, [bump, extra])

  /** `now` is the click's own timestamp, so taps can be throttled without reading the clock. */
  const send = (reaction: (typeof REACTIONS)[number], now: number) => {
    if (!side || !live) return
    taps.current = taps.current.filter((time) => now - time < 1000)
    if (taps.current.length >= TAPS_PER_SECOND) return
    taps.current.push(now)
    launch(side, reaction.emoji, true)
    // Tell screen readers now and then, not on every tap.
    if (now - lastAnnounced.current > 2500) {
      lastAnnounced.current = now
      setAnnouncement(f.sent(`${reaction.emoji}`))
    }
  }

  const counts: [number, number] = [
    crowdCount(fate, state, 'a') + extra[0],
    crowdCount(fate, state, 'b') + extra[1],
  ]
  const total = counts[0] + counts[1]
  const share = total ? (counts[0] / total) * 100 : 50

  return (
    <section className="esp-panel esp-fans" aria-label={f.title}>
      <Typography.Title level={4}>{f.title}</Typography.Title>
      {status === 'upcoming' ? (
        <Typography.Text type="secondary">{f.upcoming}</Typography.Text>
      ) : (
        <>
          {live && <Typography.Paragraph type="secondary">{f.lead}</Typography.Paragraph>}
          {!live && <Typography.Paragraph type="secondary">{f.finished}</Typography.Paragraph>}
          {live && (
            <div className="esp-fans__stage" aria-hidden="true">
              <span className="esp-fans__lane esp-fans__lane--a" />
              <span className="esp-fans__lane esp-fans__lane--b" />
              {floaters.map((floater) => {
                const color = teamColor(fate.teams[floater.side === 'a' ? 0 : 1])
                return (
                  <span
                    key={floater.id}
                    className={`esp-floater esp-floater--${floater.side}${floater.own ? ' is-own' : ''}`}
                    style={{
                      left: `calc(${floater.side === 'a' ? 0 : 50}% + ${floater.x / 2}%)`,
                      ['--esp-drift' as string]: `${floater.drift}px`,
                      ['--esp-floater' as string]: color,
                    }}
                    onAnimationEnd={() =>
                      setFloaters((list) => list.filter((item) => item.id !== floater.id))
                    }
                  >
                    {floater.emoji}
                  </span>
                )
              })}
            </div>
          )}
          <div className="esp-fans__meter">
            <span className="esp-fact__label">{f.meter}</span>
            <div className="esp-fans__bar" aria-hidden="true">
              <span style={{ width: `${share}%`, background: teamColor(fate.teams[0]) }} />
              <span style={{ width: `${100 - share}%`, background: teamColor(fate.teams[1]) }} />
            </div>
            <div className="esp-fans__counts">
              {fate.teams.map((team, index) => (
                <span
                  key={team.id}
                  className={`esp-fans__count${bump === (index === 0 ? 'a' : 'b') ? ' is-bump' : ''}`}
                >
                  <TeamCrest team={team} size={20} />
                  {f.reactions(formatCount(counts[index], language))}
                </span>
              ))}
            </div>
          </div>
          {live && (
            <>
              <Radio.Group
                block
                optionType="button"
                buttonStyle="solid"
                className="esp-fans__sides"
                aria-label={f.pickSide}
                value={side}
                onChange={(event) => setSide(fate.def.id, event.target.value as Side)}
                options={fate.teams.map((team, index) => ({
                  value: index === 0 ? 'a' : 'b',
                  label: (
                    <span className="esp-fans__side">
                      <TeamCrest team={team} size={18} />
                      {team.tag}
                    </span>
                  ),
                }))}
              />
              <div className="esp-fans__buttons">
                {REACTIONS.map((reaction) => (
                  <Tooltip key={reaction.key} title={side ? f.send[reaction.key] : f.pickSide}>
                    <Button
                      shape="circle"
                      size="large"
                      className="esp-fans__button"
                      aria-label={f.send[reaction.key]}
                      disabled={!side}
                      onClick={(event) => send(reaction, event.timeStamp)}
                    >
                      <span aria-hidden="true">{reaction.emoji}</span>
                    </Button>
                  </Tooltip>
                ))}
              </div>
            </>
          )}
          <output className="esp-sr" aria-live="polite">
            {announcement}
          </output>
        </>
      )}
    </section>
  )
}
