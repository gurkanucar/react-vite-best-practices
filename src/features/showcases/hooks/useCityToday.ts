import { useEffect, useState } from 'react'
import { isoDay } from '@/features/showcases/data/citySearch'

/** Today as `YYYY-MM-DD`, checked every minute so past events drop off after midnight. */
export function useCityToday(): string {
  const [today, setToday] = useState(() => isoDay(Date.now()))
  useEffect(() => {
    const timer = window.setInterval(() => setToday(isoDay(Date.now())), 60_000)
    return () => window.clearInterval(timer)
  }, [])
  return today
}
