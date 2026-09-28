import { Typography } from 'antd'
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from 'recharts'
import { NoteGlyph } from '@/features/showcases/components/SongContestArt'
import { StatsStrip } from '@/features/showcases/components/SongContestScreen'
import {
  anonymousSplit,
  clock,
  liveStats,
  recentVoters,
  roundAt,
  rollingRate,
  TURNOUT_TARGET,
  upper,
  votersBetween,
  type FeedItem,
} from '@/features/showcases/data/songContest'
import { useSongContestCopy, useSongContestNow } from '@/features/showcases/hooks/useSongContest'

/*
 * The ticking parts of the live screen. Each one reads the clock itself, so the second-by-second
 * updates re-render these pieces and not the singers' cards around them.
 */

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** A number that counts up to its new value instead of jumping there. */
export function CountUp({ value, format }: { value: number; format: (value: number) => string }) {
  const [shown, setShown] = useState(value)
  const current = useRef(value)

  useEffect(() => {
    const from = current.current
    const duration = prefersReducedMotion() ? 0 : 700
    const start = performance.now()
    let frame = 0
    const step = (time: number) => {
      const progress = duration === 0 ? 1 : Math.min(1, (time - start) / duration)
      const eased = 1 - (1 - progress) ** 3
      const next = Math.round(from + (value - from) * eased)
      current.current = next
      setShown(next)
      if (progress < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [value])

  return <span className="sc-tabular sc-count-up">{format(shown)}</span>
}

function useNumber() {
  const { language } = useSongContestCopy()
  return new Intl.NumberFormat(language === 'tr' ? 'tr-TR' : 'en-GB')
}

/**
 * A chart's box, measured rather than left to ResponsiveContainer so nothing is drawn (or
 * warned about) before the box has a size, and so it follows the screen's height too.
 */
function useBox() {
  const ref = useRef<HTMLDivElement>(null)
  const [box, setBox] = useState({ width: 0, height: 0 })
  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return
      setBox({
        width: Math.floor(entry.contentRect.width),
        height: Math.floor(entry.contentRect.height),
      })
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])
  return [ref, box] as const
}

/** Total, last minute, people voting, turnout and the countdown. */
export function LiveStrip() {
  const { text, language } = useSongContestCopy()
  const number = useNumber()
  const now = useSongContestNow()
  const round = roundAt(now)
  const stats = liveStats(round.id, round.elapsed)
  const turnout = Math.min(100, Math.round((stats.total / TURNOUT_TARGET) * 100))
  const countdown = Math.ceil(((round.open ? round.closesAt : round.nextOpensAt) - now) / 1000)
  const format = (value: number) => number.format(value)

  return (
    <StatsStrip
      items={[
        {
          label: upper(text.strip.total, language),
          value: <CountUp value={stats.total} format={format} />,
        },
        {
          label: upper(text.strip.lastMinute, language),
          value: <CountUp value={stats.lastMinute} format={format} />,
        },
        {
          label: upper(text.strip.voters, language),
          value: <CountUp value={stats.voters} format={format} />,
        },
        {
          label: upper(text.strip.turnout, language),
          value: <span className="sc-tabular">%{turnout}</span>,
        },
        {
          label: upper(round.open ? text.strip.closesIn : text.strip.opensIn, language),
          tone: 'red',
          icon: <span className={`sc-live-dot${round.open ? '' : ' is-off'}`} aria-hidden="true" />,
          value: <time className="sc-tabular sc-countdown">{clock(countdown)}</time>,
        },
      ]}
    />
  )
}

/**
 * One warm ramp for the unnamed split, dealt out by slice size. It is not any singer's
 * colour and the order is by size, so nothing on the ring points at a person.
 */
const SPLIT_COLORS = ['#f5c542', '#ff9b3d', '#ff5a3c', '#c2233f', '#7d1830']

/** The vote split so far as unnamed slices, re-proportioning smoothly as votes arrive. */
export function LiveSplit() {
  const { text, language } = useSongContestCopy()
  const number = useNumber()
  const now = useSongContestNow()
  const round = roundAt(now)
  const [ref, box] = useBox()
  const total = liveStats(round.id, round.elapsed).total
  const split = anonymousSplit(round.id, round.elapsed, total).map((value, index) => ({
    slice: `slice-${index}`,
    value,
  }))
  const size = Math.min(box.width, box.height)

  return (
    <section className="sc-panel sc-donut" aria-labelledby="sc-split-title">
      <div className="sc-panel__head">
        <Typography.Title level={2} id="sc-split-title">
          {text.live.split}
        </Typography.Title>
      </div>
      <div className="sc-donut__canvas" ref={ref}>
        {size > 0 && (
          <PieChart width={box.width} height={box.height}>
            <Pie
              data={split}
              dataKey="value"
              nameKey="slice"
              cx="50%"
              cy="50%"
              innerRadius={Math.round(size * 0.3)}
              outerRadius={Math.round(size * 0.47)}
              startAngle={90}
              endAngle={-270}
              stroke="#0a0405"
              strokeWidth={3}
              isAnimationActive
              animationDuration={900}
              animationEasing="ease-out"
            >
              {split.map((slice, index) => (
                <Cell key={slice.slice} fill={SPLIT_COLORS[index % SPLIT_COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        )}
        <span className="sc-donut__centre">
          <strong>
            <CountUp value={total} format={(value) => number.format(value)} />
          </strong>
          <span>{upper(text.strip.total, language)}</span>
        </span>
      </div>
      <p className="sc-donut__note">{text.live.splitNote}</p>
    </section>
  )
}

/** The vote rate over the last six minutes, scrolling left as the round goes on. */
export function LiveFlow() {
  const { text } = useSongContestCopy()
  const number = useNumber()
  const now = useSongContestNow()
  const round = roundAt(now)
  const [ref, box] = useBox()
  const points = rollingRate(round.id, round.elapsed)
  const current = points.at(-1)?.perMinute ?? 0

  return (
    <section className="sc-panel sc-chart" aria-labelledby="sc-chart-title">
      <div className="sc-panel__head">
        <Typography.Title level={2} id="sc-chart-title">
          {text.live.flow}
        </Typography.Title>
        <span className="sc-minis">
          {text.live.rightNow}{' '}
          <strong>
            <CountUp value={current} format={(value) => number.format(value)} />
          </strong>{' '}
          {text.live.perMinute}
        </span>
      </div>
      <div className="sc-chart__canvas" ref={ref}>
        {box.width > 0 && box.height > 0 && (
          <AreaChart
            width={box.width}
            height={box.height}
            data={points}
            margin={{ top: 6, right: 6, bottom: 0, left: 0 }}
          >
            <defs>
              <linearGradient id="sc-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#ffb020" stopOpacity={0.55} />
                <stop offset="1" stopColor="#ff3b5c" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgb(255 255 255 / 8%)" strokeDasharray="4 4" vertical={false} />
            <XAxis
              dataKey="second"
              tick={{ fill: '#b99ca1', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              minTickGap={24}
              tickFormatter={(second: number) => clock(second)}
            />
            <YAxis
              tick={{ fill: '#b99ca1', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={44}
              tickFormatter={(value: number) => number.format(value)}
            />
            <Area
              type="monotone"
              dataKey="perMinute"
              stroke="#ffb020"
              strokeWidth={2.5}
              fill="url(#sc-area)"
              isAnimationActive
              animationDuration={900}
              animationEasing="ease-out"
            />
          </AreaChart>
        )}
      </div>
    </section>
  )
}

const MAX_CHIPS = 24
/** At most one voter floats up from the ticker in this many seconds. */
const FLY_EVERY = 4

interface Fly {
  id: string
  name: string
}

interface TickerState {
  round: number
  second: number
  /** Newest first. */
  items: FeedItem[]
  flies: Fly[]
  lastFly: number
}

/**
 * The strip of people voting, as glowing notes with their masked names. New voters pop in on
 * the left and the rest slide along; now and then one floats up into the notes over the
 * screen. Nothing on a chip changes after it appears, so the strip never jitters. Hovering it
 * holds it still, and names that arrive meanwhile are added when the pointer leaves.
 */
export function VoterTicker() {
  const { text } = useSongContestCopy()
  const now = useSongContestNow()
  const round = roundAt(now)
  const [paused, setPaused] = useState(false)
  const [state, setState] = useState<TickerState>(() => ({
    round: round.id,
    second: round.elapsed,
    items: recentVoters(round.id, round.elapsed, 14),
    flies: [],
    lastFly: round.elapsed,
  }))

  // Catch up with the clock during render: new voters since the last look, newest first.
  if (!paused && (state.round !== round.id || state.second !== round.elapsed)) {
    if (state.round !== round.id) {
      setState({
        round: round.id,
        second: round.elapsed,
        items: recentVoters(round.id, round.elapsed, 14),
        flies: [],
        lastFly: round.elapsed,
      })
    } else {
      // After a long gap (a hidden tab) only the last few seconds are worth showing.
      const fresh = votersBetween(
        round.id,
        Math.max(state.second, round.elapsed - 12),
        round.elapsed,
      )
        .reverse()
        .filter((item) => item.name !== state.items[0]?.name)
      const flying =
        fresh[0] && round.elapsed - state.lastFly >= FLY_EVERY && !prefersReducedMotion()
      setState({
        round: round.id,
        second: round.elapsed,
        items: [...fresh, ...state.items].slice(0, MAX_CHIPS),
        flies: flying
          ? [
              ...state.flies.slice(-3),
              // The newest voter, who has just popped in at the start of the strip.
              { id: fresh[0].id, name: fresh[0].name },
            ]
          : state.flies,
        lastFly: flying ? round.elapsed : state.lastFly,
      })
    }
  }

  const track = useRef<HTMLUListElement>(null)
  const strip = useRef<HTMLElement>(null)
  const start = useRef<HTMLDivElement>(null)

  // Flying notes lift off where new voters appear: the start of the strip, over their chip.
  useLayoutEffect(() => {
    const section = strip.current
    const startWindow = start.current
    if (!section || !startWindow) return
    const place = () => {
      section.style.setProperty('--sc-fly-x', `${startWindow.offsetLeft}px`)
      section.style.setProperty(
        '--sc-fly-y',
        `${startWindow.offsetTop + startWindow.offsetHeight / 2}px`,
      )
    }
    place()
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(place)
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  // Hovering holds the strip still so a name can be read; it is a display, not a control.
  useEffect(() => {
    const element = strip.current
    if (!element) return
    const hold = () => setPaused(true)
    const release = () => setPaused(false)
    element.addEventListener('pointerenter', hold)
    element.addEventListener('pointerleave', release)
    return () => {
      element.removeEventListener('pointerenter', hold)
      element.removeEventListener('pointerleave', release)
    }
  }, [])
  const known = useRef(new Set(state.items.map((item) => item.id)))

  // Slide the strip: measure only the chips that just arrived, start the track that far to
  // the left and let it glide back. Existing chips are never measured again.
  useLayoutEffect(() => {
    const element = track.current
    if (!element) return
    let added = 0
    for (const child of element.children) {
      const id = (child as HTMLElement).dataset.id ?? ''
      if (known.current.has(id)) break
      const gap = parseFloat(getComputedStyle(element).columnGap) || 0
      added += (child as HTMLElement).offsetWidth + gap
    }
    known.current = new Set(state.items.map((item) => item.id))
    if (added === 0 || prefersReducedMotion()) return
    element.style.transition = 'none'
    element.style.transform = `translateX(${-added}px)`
    // Read layout once so the start position applies before the transition does.
    void element.offsetWidth
    element.style.transition = 'transform 700ms cubic-bezier(0.22, 1, 0.36, 1)'
    element.style.transform = 'translateX(0)'
  }, [state.items])

  const chip = (item: FeedItem): ReactNode => (
    <li key={item.id} data-id={item.id} className="sc-chip">
      <span className="sc-chip__note" aria-hidden="true">
        <NoteGlyph glyph={item.count > 1 ? 'beamed' : 'eighth'} />
      </span>
      <strong className="sc-chip__name">{item.name}</strong>
      <span className="sc-chip__what">{text.live.voted(item.count)}</span>
    </li>
  )

  return (
    <section className="sc-ticker" aria-labelledby="sc-feed-title" ref={strip}>
      <div className="sc-ticker__head">
        <span className="sc-live-dot" aria-hidden="true" />
        <Typography.Title level={2} id="sc-feed-title">
          {text.live.feed}
        </Typography.Title>
      </div>
      <div className="sc-ticker__window" ref={start}>
        <ul className="sc-feed__list" ref={track}>
          {state.items.map(chip)}
        </ul>
      </div>
      <div className="sc-flies" aria-hidden="true">
        {state.flies.map((fly) => (
          <span key={fly.id} className="sc-fly">
            <span className="sc-chip__note">
              <NoteGlyph glyph="eighth" />
            </span>
            <span className="sc-fly__name">{fly.name}</span>
          </span>
        ))}
      </div>
    </section>
  )
}
