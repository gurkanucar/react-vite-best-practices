import { useEffect, useState } from 'react'

/** The current time, refreshed every `interval` ms, or a fixed moment when one is given. */
export function useConfNow(interval = 1000, fixed?: number) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (fixed !== undefined) return
    const timer = window.setInterval(() => setNow(Date.now()), interval)
    return () => window.clearInterval(timer)
  }, [interval, fixed])

  return fixed ?? now
}
