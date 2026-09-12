import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  blankAnswer,
  gradeExam,
  isAnswered,
  type Answer,
  type AnswerSheet,
  type Exam,
  type ExamResult,
  type Question,
} from '@/features/learning/types'

export type ExamPhase = 'intro' | 'running' | 'submitted'

export interface ExamSession {
  phase: ExamPhase
  index: number
  question: Question
  answers: AnswerSheet
  answeredCount: number
  secondsLeft: number
  result: ExamResult | null
  start: () => void
  goTo: (index: number) => void
  answer: (value: Answer) => void
  submit: () => void
  restart: () => void
}

/**
 * The whole exam in one hook: which question is open, what has been answered, how long is
 * left, and the result once it is handed in. Keeping it out of the components is what lets
 * the same state drive the question panel, the navigator and the review.
 */
export function useExamSession(exam: Exam, questions: Question[]): ExamSession {
  const [phase, setPhase] = useState<ExamPhase>('intro')
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<AnswerSheet>(() => emptySheet(questions))
  const [secondsLeft, setSecondsLeft] = useState(exam.durationMinutes * 60)
  const [result, setResult] = useState<ExamResult | null>(null)

  const question = questions[index]!

  /**
   * The sheet is mirrored into a ref so the countdown can grade it. The timer fires long
   * after the effect that started it was created, and reading `answers` from that closure
   * would hand in whatever was on screen when the exam started.
   */
  const answersRef = useRef(answers)

  const finish = useCallback(() => {
    setResult(gradeExam(questions, answersRef.current, exam.passMark))
    setPhase('submitted')
  }, [exam.passMark, questions])

  /**
   * One interval for the whole paper, cleared when the phase leaves `running` so a
   * submitted exam does not keep counting down. Running out of time hands the paper in as
   * it stands rather than discarding it — and that happens here, in the tick that caused
   * it, rather than in an effect watching the clock.
   */
  useEffect(() => {
    if (phase !== 'running') return undefined

    const timer = setInterval(() => {
      setSecondsLeft((current) => {
        const next = Math.max(current - 1, 0)

        if (next === 0) {
          clearInterval(timer)
        }

        return next
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [phase])

  useEffect(() => {
    if (phase === 'running' && secondsLeft === 0) {
      finish()
    }
    // `finish` reads the sheet through the ref, so this depends only on the clock.
  }, [finish, phase, secondsLeft])

  const answeredCount = useMemo(
    () => questions.filter((entry) => answers[entry.id] && isAnswered(answers[entry.id]!)).length,
    [answers, questions],
  )

  return {
    phase,
    index,
    question,
    answers,
    answeredCount,
    secondsLeft,
    result,
    start: () => setPhase('running'),
    goTo: (next) => setIndex(Math.min(Math.max(next, 0), questions.length - 1)),
    answer: (value) => {
      const next = { ...answersRef.current, [question.id]: value }

      answersRef.current = next
      setAnswers(next)
    },
    submit: finish,
    restart: () => {
      const blank = emptySheet(questions)

      answersRef.current = blank
      setAnswers(blank)
      setSecondsLeft(exam.durationMinutes * 60)
      setResult(null)
      setIndex(0)
      setPhase('running')
    },
  }
}

function emptySheet(questions: Question[]): AnswerSheet {
  return Object.fromEntries(questions.map((question) => [question.id, blankAnswer(question)]))
}

/** `125` → `2:05`, for the countdown. */
export function formatClock(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${minutes}:${String(seconds).padStart(2, '0')}`
}
