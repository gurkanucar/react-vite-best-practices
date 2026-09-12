import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useInfiniteList } from '@/features/showcases/hooks/useInfiniteList'

const items = Array.from({ length: 25 }, (_, index) => index)

describe('useInfiniteList', () => {
  it('starts at one page and reveals another on request', () => {
    const { result } = renderHook(() => useInfiniteList(items, 10))

    expect(result.current.visible).toHaveLength(10)
    expect(result.current.hasMore).toBe(true)

    act(() => result.current.loadMore())

    expect(result.current.visible).toHaveLength(20)
  })

  it('stops at the end of the collection rather than overshooting it', () => {
    const { result } = renderHook(() => useInfiniteList(items, 10))

    act(() => result.current.loadMore())
    act(() => result.current.loadMore())

    expect(result.current.visible).toHaveLength(25)
    expect(result.current.hasMore).toBe(false)

    // A stray call after the end must not grow the slice past the source.
    act(() => result.current.loadMore())
    expect(result.current.visible).toHaveLength(25)
  })

  it('starts over when a filter hands it a different collection', () => {
    const { result, rerender } = renderHook(({ source }) => useInfiniteList(source, 10), {
      initialProps: { source: items },
    })

    act(() => result.current.loadMore())
    expect(result.current.visible).toHaveLength(20)

    rerender({ source: items.slice(0, 12) })

    // Back to the first page: a reader who narrows the list expects the top of the result.
    expect(result.current.visible).toHaveLength(10)
    expect(result.current.hasMore).toBe(true)
  })

  it('keeps its place when the same collection is passed again', () => {
    const { result, rerender } = renderHook(({ source }) => useInfiniteList(source, 10), {
      initialProps: { source: items },
    })

    act(() => result.current.loadMore())
    rerender({ source: items })

    expect(result.current.visible).toHaveLength(20)
  })

  it('reports no more to load when the collection fits in one page', () => {
    const { result } = renderHook(() => useInfiniteList(items.slice(0, 4), 10))

    expect(result.current.visible).toHaveLength(4)
    expect(result.current.hasMore).toBe(false)
  })
})
