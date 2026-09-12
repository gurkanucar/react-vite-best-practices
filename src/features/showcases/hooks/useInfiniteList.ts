import { useCallback, useEffect, useState } from 'react'

interface InfiniteList<T> {
  /** The slice to render right now. */
  visible: T[]
  hasMore: boolean
  /** Reveal the next page. Wire this to a real button, not only to the observer. */
  loadMore: () => void
  /**
   * Attach to the element that sits after the last row. When it scrolls into view the next
   * page is revealed, so the button it is attached to rarely has to be pressed.
   */
  sentinelRef: (node: HTMLElement | null) => void
}

/**
 * Paging driven by scroll position rather than by a page number.
 *
 * The whole collection is already in memory here, so this reveals more of it instead of
 * fetching. Against a real API the same shape holds: `loadMore` would ask for the next page
 * and `hasMore` would come from the response.
 *
 * Two things are deliberate. The sentinel is a real, focusable control rather than an empty
 * div, so a keyboard or screen-reader user has a way to reach the rest of the list — an
 * observer alone would strand them. And `IntersectionObserver` is only used when it exists,
 * which keeps the list working under jsdom and under any renderer that has no layout.
 */
export function useInfiniteList<T>(items: T[], pageSize: number): InfiniteList<T> {
  const [visibleCount, setVisibleCount] = useState(pageSize)
  const [renderedItems, setRenderedItems] = useState(items)
  const [sentinel, setSentinel] = useState<HTMLElement | null>(null)

  /*
   * Filtering hands us a different array, and the reader expects to be back at the top of a
   * fresh result rather than nine rows into it. Adjusting during render rather than in an
   * effect means the first paint already shows the right slice.
   */
  if (renderedItems !== items) {
    setRenderedItems(items)
    setVisibleCount(pageSize)
  }

  const hasMore = visibleCount < items.length

  const loadMore = useCallback(() => {
    setVisibleCount((count) => Math.min(count + pageSize, items.length))
  }, [items.length, pageSize])

  useEffect(() => {
    if (!sentinel || !hasMore || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) loadMore()
      },
      // Start the next page slightly before the sentinel is actually on screen, so the rows
      // are already there by the time the reader gets to them.
      { rootMargin: '240px' },
    )

    observer.observe(sentinel)

    return () => observer.disconnect()
    /*
     * visibleCount is a dependency on purpose. An observer only reports a crossing, so one
     * that stayed mounted would go quiet after the first page and the list would stall on a
     * tall screen where the sentinel never leaves the viewport. Rebuilding it after each page
     * makes it report again, which keeps loading until the sentinel is finally pushed off
     * screen or the list runs out.
     */
  }, [hasMore, loadMore, sentinel, visibleCount])

  const sentinelRef = useCallback((node: HTMLElement | null) => setSentinel(node), [])

  return { visible: items.slice(0, visibleCount), hasMore, loadMore, sentinelRef }
}
