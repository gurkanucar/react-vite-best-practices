import { useEffect, useState } from 'react'

/** The current time in milliseconds, refreshed on an interval, for the live application steps. */
export function useCareersNow(intervalMs = 15_000): number {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), intervalMs)
    return () => window.clearInterval(timer)
  }, [intervalMs])
  return now
}
