import bar from '@/features/learning/assets/chart-bar.svg'
import line from '@/features/learning/assets/chart-line.svg'
import pie from '@/features/learning/assets/chart-pie.svg'
import treemap from '@/features/learning/assets/chart-treemap.svg'
import cacheDiagram from '@/features/learning/assets/diagram-cache.svg'
import designCover from '@/features/learning/assets/course-design.svg'
import reactCover from '@/features/learning/assets/course-react.svg'
import testingCover from '@/features/learning/assets/course-testing.svg'
import type { Course, Exam, ExamAttempt, Flashcard, Question } from '@/features/learning/types'

/**
 * One question of every kind the engine supports, including the combinations that are
 * easy to get wrong: a picture in the prompt, pictures instead of option labels, and a
 * question no code can score.
 */
export const questions: Question[] = [
  {
    id: 'q-cache',
    kind: 'single',
    promptId: 'cache',
    points: 4,
    image: cacheDiagram,
    options: [
      { id: 'a', labelId: 'cacheA' },
      { id: 'b', labelId: 'cacheB' },
      { id: 'c', labelId: 'cacheC' },
    ],
    correctId: 'b',
    explanationId: 'cache',
  },
  {
    id: 'q-chart',
    kind: 'single',
    promptId: 'chart',
    points: 4,
    options: [
      { id: 'bar', image: bar },
      { id: 'line', image: line },
      { id: 'pie', image: pie },
      { id: 'treemap', image: treemap },
    ],
    correctId: 'treemap',
    explanationId: 'chart',
  },
  {
    id: 'q-client',
    kind: 'multiple',
    promptId: 'client',
    points: 6,
    options: [
      { id: 'router', labelId: 'clientRouter' },
      { id: 'zustand', labelId: 'clientZustand' },
      { id: 'nginx', labelId: 'clientNginx' },
      { id: 'msw', labelId: 'clientMsw' },
    ],
    correctIds: ['router', 'zustand', 'msw'],
    explanationId: 'client',
  },
  {
    id: 'q-url',
    kind: 'trueFalse',
    promptId: 'url',
    points: 2,
    correct: true,
    explanationId: 'url',
  },
  {
    id: 'q-hook',
    kind: 'text',
    promptId: 'hook',
    points: 3,
    acceptedAnswers: ['useMemo'],
    explanationId: 'hook',
  },
  {
    id: 'q-match',
    kind: 'matching',
    promptId: 'match',
    points: 8,
    options: [
      { id: 'zustand', labelId: 'matchZustand' },
      { id: 'query', labelId: 'matchQuery' },
      { id: 'router', labelId: 'matchRouter' },
      { id: 'msw', labelId: 'matchMsw' },
    ],
    pairs: [
      { id: 'server', promptId: 'matchServer', answerId: 'query' },
      { id: 'client', promptId: 'matchClient', answerId: 'zustand' },
      { id: 'navigation', promptId: 'matchNavigation', answerId: 'router' },
      { id: 'mock', promptId: 'matchMock', answerId: 'msw' },
    ],
    explanationId: 'match',
  },
  {
    id: 'q-order',
    kind: 'ordering',
    promptId: 'order',
    points: 4,
    options: [
      { id: 'render', labelId: 'orderRender' },
      { id: 'commit', labelId: 'orderCommit' },
      { id: 'effect', labelId: 'orderEffect' },
      { id: 'paint', labelId: 'orderPaint' },
    ],
    correctOrder: ['render', 'commit', 'paint', 'effect'],
    explanationId: 'order',
  },
  {
    id: 'q-upload',
    kind: 'file',
    promptId: 'upload',
    points: 10,
    acceptedTypes: ['application/pdf', 'image/png', 'image/jpeg'],
    maxBytes: 5 * 1024 * 1024,
    explanationId: 'upload',
  },
]

export const exam: Exam = {
  id: 'exam-foundations',
  titleId: 'foundations',
  durationMinutes: 20,
  passMark: 70,
  questionIds: questions.map((question) => question.id),
}

export function findQuestion(id: string): Question | undefined {
  return questions.find((question) => question.id === id)
}

export const examQuestions = exam.questionIds
  .map((id) => findQuestion(id))
  .filter((question): question is Question => question !== undefined)

export const courses: Course[] = [
  {
    id: 'react-foundations',
    titleId: 'reactFoundations',
    categoryId: 'frontend',
    levelId: 'beginner',
    lessons: 24,
    hours: 6,
    progress: 72,
    rating: 4.7,
    students: 1_842,
    image: reactCover,
    instructor: 'Maya Chen',
  },
  {
    id: 'testing-in-practice',
    titleId: 'testing',
    categoryId: 'quality',
    levelId: 'intermediate',
    lessons: 18,
    hours: 4,
    progress: 35,
    rating: 4.5,
    students: 964,
    image: testingCover,
    instructor: 'Noah Williams',
  },
  {
    id: 'design-systems',
    titleId: 'designSystems',
    categoryId: 'design',
    levelId: 'advanced',
    lessons: 30,
    hours: 9,
    progress: 0,
    rating: 4.9,
    students: 612,
    image: designCover,
    instructor: 'Ava Patel',
  },
]

export const flashcards: Flashcard[] = [
  { id: 'fc-1', frontId: 'urlFront', backId: 'urlBack' },
  { id: 'fc-2', frontId: 'optimisticFront', backId: 'optimisticBack' },
  { id: 'fc-3', frontId: 'barrelFront', backId: 'barrelBack' },
  { id: 'fc-4', frontId: 'debounceFront', backId: 'debounceBack' },
  { id: 'fc-5', frontId: 'suspenseFront', backId: 'suspenseBack' },
]

export const attempts: ExamAttempt[] = [
  {
    id: 'at-4',
    examId: 'exam-foundations',
    takenAt: '2026-09-09 10:12',
    percentage: 88,
    passed: true,
    durationMinutes: 14,
  },
  {
    id: 'at-3',
    examId: 'exam-foundations',
    takenAt: '2026-08-30 16:40',
    percentage: 74,
    passed: true,
    durationMinutes: 18,
  },
  {
    id: 'at-2',
    examId: 'exam-foundations',
    takenAt: '2026-08-21 09:05',
    percentage: 61,
    passed: false,
    durationMinutes: 20,
  },
  {
    id: 'at-1',
    examId: 'exam-foundations',
    takenAt: '2026-08-14 11:28',
    percentage: 45,
    passed: false,
    durationMinutes: 20,
  },
]
