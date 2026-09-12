import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { exam, examQuestions } from '@/features/learning/data'
import { formatClock, useExamSession } from '@/features/learning/hooks'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('useExamSession', () => {
  it('starts on the intro with a full clock and nothing answered', () => {
    const { result } = renderHook(() => useExamSession(exam, examQuestions))

    expect(result.current.phase).toBe('intro')
    expect(result.current.answeredCount).toBe(0)
    expect(result.current.secondsLeft).toBe(exam.durationMinutes * 60)
  })

  it('counts down only once the exam is running', () => {
    const { result } = renderHook(() => useExamSession(exam, examQuestions))

    act(() => vi.advanceTimersByTime(5000))
    expect(result.current.secondsLeft).toBe(exam.durationMinutes * 60)

    act(() => result.current.start())
    act(() => vi.advanceTimersByTime(5000))
    expect(result.current.secondsLeft).toBe(exam.durationMinutes * 60 - 5)
  })

  it('hands the paper in when the clock runs out', () => {
    const { result } = renderHook(() => useExamSession(exam, examQuestions))

    act(() => result.current.start())
    act(() => vi.advanceTimersByTime(exam.durationMinutes * 60 * 1000))

    expect(result.current.phase).toBe('submitted')
    expect(result.current.result).not.toBeNull()
  })

  it('stops the clock once the paper is in', () => {
    const { result } = renderHook(() => useExamSession(exam, examQuestions))

    act(() => result.current.start())
    act(() => vi.advanceTimersByTime(3000))
    act(() => result.current.submit())

    const frozen = result.current.secondsLeft
    act(() => vi.advanceTimersByTime(10_000))

    expect(result.current.secondsLeft).toBe(frozen)
  })

  it('records an answer and counts it', () => {
    const { result } = renderHook(() => useExamSession(exam, examQuestions))

    act(() => result.current.start())
    act(() => result.current.answer({ kind: 'single', optionId: 'b' }))

    expect(result.current.answeredCount).toBe(1)
    expect(result.current.answers['q-cache']).toEqual({ kind: 'single', optionId: 'b' })
  })

  it('clamps navigation to the questions that exist', () => {
    const { result } = renderHook(() => useExamSession(exam, examQuestions))

    act(() => result.current.goTo(-5))
    expect(result.current.index).toBe(0)

    act(() => result.current.goTo(99))
    expect(result.current.index).toBe(examQuestions.length - 1)
  })

  it('clears the sheet and the clock on a restart', () => {
    const { result } = renderHook(() => useExamSession(exam, examQuestions))

    act(() => result.current.start())
    act(() => result.current.answer({ kind: 'single', optionId: 'b' }))
    act(() => vi.advanceTimersByTime(9000))
    act(() => result.current.submit())
    act(() => result.current.restart())

    expect(result.current.phase).toBe('running')
    expect(result.current.answeredCount).toBe(0)
    expect(result.current.secondsLeft).toBe(exam.durationMinutes * 60)
    expect(result.current.result).toBeNull()
  })
})

describe('formatClock', () => {
  it('pads the seconds', () => {
    expect(formatClock(125)).toBe('2:05')
    expect(formatClock(60)).toBe('1:00')
    expect(formatClock(9)).toBe('0:09')
    expect(formatClock(0)).toBe('0:00')
  })
})
