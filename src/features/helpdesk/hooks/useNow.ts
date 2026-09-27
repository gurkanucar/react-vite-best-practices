import { useEffect, useState } from 'react'

/**
 * The current time, refreshed every minute. SLA countdowns are shown in minutes, so a
 * finer tick would only re-render the queue for nothing.
 */
export function useNow(intervalMs = 60_000): number {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), intervalMs)
    return () => window.clearInterval(timer)
  }, [intervalMs])

  return now
}
