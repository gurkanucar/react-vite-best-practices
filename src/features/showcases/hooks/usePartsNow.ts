import dayjs, { type Dayjs } from 'dayjs'
import { useEffect, useState } from 'react'

/** The current time, refreshed on an interval, for countdowns and live tracking. */
export function usePartsNow(intervalMs = 30_000): Dayjs {
  const [now, setNow] = useState(() => dayjs())
  useEffect(() => {
    const timer = window.setInterval(() => setNow(dayjs()), intervalMs)
    return () => window.clearInterval(timer)
  }, [intervalMs])
  return now
}
