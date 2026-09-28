import { useEffect, useRef } from 'react'

/**
 * Adds `is-revealed` to the element the first time it scrolls into view, which starts its
 * entrance in agency.css. Without an observer, or with reduced motion, it is shown at once.
 */
export function useAgencyReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const reveal = () => element.classList.add('is-revealed')
    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      reveal()
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          reveal()
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return ref
}
