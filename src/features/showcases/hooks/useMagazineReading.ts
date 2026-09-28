import { useEffect, useState, type RefObject } from 'react'
import {
  activeHeading,
  offsetForProgress,
  progressFromRect,
} from '@/features/showcases/data/magazine'
import { useMagazineStore } from '@/features/showcases/hooks/useMagazineStore'

// ------------------------------------------------------------------ measuring

type Scroller = RefObject<HTMLElement | null> | null

/**
 * The space above the reading area: the admin's bar when the site sits inside it, plus any
 * toolbar the scroller itself pins. Read from the `--mag-top` custom property.
 */
function topOffset(element: HTMLElement) {
  return Number.parseFloat(getComputedStyle(element).getPropertyValue('--mag-top')) || 0
}

function measure(body: HTMLElement, scroller: HTMLElement | null) {
  const rect = body.getBoundingClientRect()
  const offset = topOffset(body)
  const containerTop = scroller ? scroller.getBoundingClientRect().top : 0
  const viewport = (scroller ? scroller.clientHeight : window.innerHeight) - offset
  return {
    top: rect.top - containerTop - offset,
    height: rect.height,
    viewport,
    offset,
    containerTop,
  }
}

/**
 * Where the reader is in an article: progress from 0 to 1 and the heading they are in. Works on
 * the window or on a scrolling element (the reading mode), and re-measures on resize.
 */
export function useReadingPosition(
  bodyRef: RefObject<HTMLElement | null>,
  scroller: Scroller,
  headingIds: string[],
  /** Anything that changes the text's height, like the reading mode's font size. */
  layoutKey?: string,
) {
  const [position, setPosition] = useState<{ progress: number; active?: string }>({
    progress: 0,
  })
  const ids = headingIds.join('|')

  useEffect(() => {
    const target: HTMLElement | Window = scroller?.current ?? window
    let frame = 0
    const update = () => {
      frame = 0
      const body = bodyRef.current
      if (!body) return
      const box = measure(body, scroller?.current ?? null)
      const progress = progressFromRect(box.top, box.height, box.viewport)
      // A heading counts as current once it passes a line a little below the top edge.
      const line = box.containerTop + box.offset + 96
      const headings = ids
        .split('|')
        .filter(Boolean)
        .flatMap((id) => {
          const element = document.getElementById(id)
          return element ? [{ id, top: element.getBoundingClientRect().top }] : []
        })
      const active = activeHeading(headings, line)
      setPosition((current) =>
        Math.abs(current.progress - progress) < 0.002 && current.active === active
          ? current
          : { progress, active },
      )
    }
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    update()
    target.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      target.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [bodyRef, scroller, ids, layoutKey])

  return position
}

/** Scrolls the window, or a scrolling element, so the article shows the given progress. */
export function scrollToProgress(
  body: HTMLElement | null,
  progress: number,
  scroller: HTMLElement | null = null,
) {
  if (!body) return
  const box = measure(body, scroller)
  const current = scroller ? scroller.scrollTop : window.scrollY
  const top = current + box.top + offsetForProgress(progress, box.height, box.viewport)
  // Assigning works on every element, including in test environments without scrollTo.
  if (scroller) scroller.scrollTop = top
  else window.scrollTo({ top })
}

/** Saves progress a moment after the reader stops scrolling, not on every frame. */
export function useRecordProgress(slug: string, progress: number, enabled = true) {
  const record = useMagazineStore((state) => state.recordProgress)
  useEffect(() => {
    if (!enabled) return
    const timer = window.setTimeout(() => record(slug, progress), 400)
    return () => window.clearTimeout(timer)
  }, [slug, progress, enabled, record])
}
