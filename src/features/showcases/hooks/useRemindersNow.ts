import { useEffect, useState } from 'react'

/** Milliseconds since the epoch, refreshed on an interval: for countdowns and the next alarm. */
export function useRemindersNow(intervalMs = 30_000): number {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), intervalMs)
    return () => window.clearInterval(timer)
  }, [intervalMs])
  return now
}
