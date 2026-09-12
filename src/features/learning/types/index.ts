export * from './grading'
export * from './questions'

export interface Exam {
  id: string
  /** A translation key under `learning.exams`. */
  titleId: string
  durationMinutes: number
  /** The percentage needed to pass. */
  passMark: number
  questionIds: string[]
}

export interface Course {
  id: string
  /** Translation keys under `learning.courses`. */
  titleId: string
  categoryId: string
  levelId: 'beginner' | 'intermediate' | 'advanced'
  lessons: number
  hours: number
  /** 0-100. */
  progress: number
  rating: number
  students: number
  image: string
  instructor: string
}

export interface Flashcard {
  id: string
  /** Translation keys under `learning.flashcards`. */
  frontId: string
  backId: string
}

export interface ExamAttempt {
  id: string
  examId: string
  takenAt: string
  percentage: number
  passed: boolean
  durationMinutes: number
}
