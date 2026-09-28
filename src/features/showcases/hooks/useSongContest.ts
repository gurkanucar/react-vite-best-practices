import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import { roundAt, type Round } from '@/features/showcases/data/songContest'
import { songContestCopy } from '@/features/showcases/data/songContestCopy'
import { usePreferencesStore } from '@/store/preferences-store'

/*
 * The contest is a display for a big screen: nobody votes from it, so nothing about the
 * visitor is stored. Everything shown is worked out from the clock.
 */

export function useSongContestCopy() {
  const language = usePreferencesStore((state) => state.language)
  return { text: songContestCopy[language], language }
}

/**
 * Where the site's clock comes from. Tests pin it so the round, the counters and the feed
 * render the same way on every run.
 */
export const songContestClock = { now: () => Date.now() }

/**
 * The current time, refreshed every second so counters and countdowns tick. It stops while
 * the tab is hidden and catches up the moment it is shown again; everything is worked out
 * from the clock, so nothing is lost in between.
 */
export function useSongContestNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => songContestClock.now())
  useEffect(() => {
    const tick = () => {
      if (!document.hidden) setNow(songContestClock.now())
    }
    const timer = window.setInterval(tick, intervalMs)
    document.addEventListener('visibilitychange', tick)
    return () => {
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', tick)
    }
  }, [intervalMs])
  return now
}

const phaseKey = () => {
  const round = roundAt(songContestClock.now())
  return `${round.id}:${round.open ? 1 : 0}`
}

/**
 * Only which round it is and whether its lines are open. The key is a string, so setting the
 * same one again is ignored and the page re-renders only when the phase changes, not every
 * second; the parts that tick use `useSongContestNow` themselves.
 */
export function useRoundPhase(): { id: number; open: boolean } {
  const [key, setKey] = useState(phaseKey)
  useEffect(() => {
    const tick = () => {
      if (!document.hidden) setKey(phaseKey())
    }
    const timer = window.setInterval(tick, 1000)
    document.addEventListener('visibilitychange', tick)
    return () => {
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', tick)
    }
  }, [])
  const [id, open] = key.split(':')
  return { id: Number(id), open: open === '1' }
}

/** The live round, recomputed every second. */
export function useRound(): { now: number; round: Round } {
  const now = useSongContestNow()
  return { now, round: roundAt(now) }
}

/**
 * Stage mode: the page alone on a black stage, without the site header or the admin around
 * it, for a big screen or a projector. It is kept in the address (`?stage=1`) so a screen can
 * be pointed straight at it, and turning it on asks the browser for full screen.
 */
export function useStageMode() {
  const [params, setParams] = useSearchParams()
  const on = params.get('stage') === '1'
  const set = useCallback(
    (next: boolean) => {
      // Full screen needs the click that asked for it, so it is requested here rather than
      // when the stage mounts; opening a `?stage=1` link gives the overlay without it.
      if (next && !document.fullscreenElement)
        document.documentElement.requestFullscreen?.().catch(() => undefined)
      if (!next && document.fullscreenElement)
        void document.exitFullscreen?.().catch(() => undefined)
      setParams(
        (current) => {
          const copy = new URLSearchParams(current)
          if (next) copy.set('stage', '1')
          else copy.delete('stage')
          return copy
        },
        { replace: true },
      )
    },
    [setParams],
  )
  return { on, set }
}
