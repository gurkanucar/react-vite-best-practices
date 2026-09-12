import boardShot from '@/features/board/assets/attachment-board.svg'
import calendarShot from '@/features/board/assets/attachment-calendar.svg'
import chartShot from '@/features/board/assets/attachment-chart.svg'
import { applyMove, type Board, type BoardCard, type MoveCardInput } from '@/features/board/types'

/**
 * The board has no API behind it, so the feature keeps its own store. The latency is what
 * makes the optimistic update worth having: without it the card would already be in place
 * before the response, and the pattern would demonstrate nothing.
 */
// Kept non-zero under test so the optimistic write still lands before the response, but
// short enough that the suite is not waiting on a deliberate delay.
const LATENCY_MS = import.meta.env.MODE === 'test' ? 20 : 550

let cards: BoardCard[] = [
  {
    id: 'RVB-118',
    title: 'Percentile chart flattens the median on a linear axis',
    columnId: 'backlog',
    assignee: 'Maya Chen',
    priority: 'medium',
    points: 2,
    dueDate: '2026-09-26',
    labels: ['bug'],
    image: chartShot,
  },
  {
    id: 'RVB-121',
    title: 'Saved filter presets per table',
    columnId: 'backlog',
    assignee: 'Noah Williams',
    priority: 'low',
    points: 5,
    dueDate: '2026-10-09',
    labels: ['feature'],
  },
  {
    id: 'RVB-124',
    title: 'Drop moment from the dependency tree',
    columnId: 'backlog',
    assignee: 'Maya Chen',
    priority: 'low',
    points: 3,
    dueDate: '2026-10-16',
    labels: ['chore', 'infra'],
  },
  {
    id: 'RVB-126',
    title: 'Empty states for every list route',
    columnId: 'backlog',
    assignee: 'Ava Patel',
    priority: 'medium',
    points: 3,
    dueDate: '2026-10-02',
    labels: ['design'],
  },

  {
    id: 'RVB-109',
    title: 'Week and day views for the schedule',
    columnId: 'inProgress',
    assignee: 'Ava Patel',
    priority: 'high',
    points: 8,
    dueDate: '2026-09-19',
    labels: ['feature', 'design'],
    image: calendarShot,
  },
  {
    id: 'RVB-114',
    title: 'Roll back a failed card move',
    columnId: 'inProgress',
    assignee: 'Noah Williams',
    priority: 'high',
    points: 3,
    dueDate: '2026-09-18',
    labels: ['feature'],
    image: boardShot,
  },

  {
    id: 'RVB-102',
    title: 'Replace the chart library',
    columnId: 'inReview',
    assignee: 'Maya Chen',
    priority: 'urgent',
    points: 5,
    dueDate: '2026-09-15',
    labels: ['chore', 'infra'],
  },
  {
    id: 'RVB-107',
    title: 'Folder rename moves its descendants',
    columnId: 'inReview',
    assignee: 'Noah Williams',
    priority: 'medium',
    points: 2,
    dueDate: '2026-09-16',
    labels: ['bug'],
  },

  {
    id: 'RVB-094',
    title: 'Route-level code splitting',
    columnId: 'done',
    assignee: 'Maya Chen',
    priority: 'high',
    points: 5,
    dueDate: '2026-09-05',
    labels: ['infra'],
  },
  {
    id: 'RVB-097',
    title: 'Debounce every typed filter from one place',
    columnId: 'done',
    assignee: 'Noah Williams',
    priority: 'medium',
    points: 3,
    dueDate: '2026-09-03',
    labels: ['bug'],
  },
  {
    id: 'RVB-099',
    title: 'Ant Design locale for pickers and pagination',
    columnId: 'done',
    assignee: 'Ava Patel',
    priority: 'low',
    points: 1,
    dueDate: '2026-08-29',
    labels: ['chore'],
  },
]

const columns: Board['columns'] = [
  { id: 'backlog' },
  { id: 'inProgress', limit: 3 },
  { id: 'inReview', limit: 2 },
  { id: 'done' },
]

/**
 * Flipped from the page so a reader can watch the rollback happen. A real board would
 * hit this path on a conflict or a lost connection instead.
 */
let failNextMove = false

export function setFailNextMove(value: boolean) {
  failNextMove = value
}

export function shouldFailNextMove(): boolean {
  return failNextMove
}

export class CardMoveError extends Error {
  constructor() {
    super('The board rejected the move')
    this.name = 'CardMoveError'
  }
}

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), LATENCY_MS))
}

export function getBoard(): Promise<Board> {
  return delay({ columns, cards })
}

export function moveCard(input: MoveCardInput): Promise<Board> {
  if (failNextMove) {
    return new Promise((_, reject) => setTimeout(() => reject(new CardMoveError()), LATENCY_MS))
  }

  cards = applyMove(cards, input)

  return delay({ columns, cards })
}
