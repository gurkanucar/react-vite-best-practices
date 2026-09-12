export type BoardColumnId = 'backlog' | 'inProgress' | 'inReview' | 'done'
export type CardPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface BoardCard {
  id: string
  title: string
  columnId: BoardColumnId
  assignee: string
  priority: CardPriority
  points: number
  dueDate: string
  /** Translation keys under `board.labels`. */
  labels: BoardLabelId[]
}

export type BoardLabelId = 'bug' | 'feature' | 'chore' | 'design' | 'infra'

export interface BoardColumn {
  id: BoardColumnId
  /** A team's work-in-progress cap. `undefined` means the column is not limited. */
  limit?: number
}

export interface Board {
  columns: BoardColumn[]
  /** Ordered within each column; the array order is the board order. */
  cards: BoardCard[]
}

export interface MoveCardInput {
  cardId: string
  toColumnId: BoardColumnId
  /** Position among the cards already in the destination column. */
  toIndex: number
}

export const BOARD_QUERY_KEYS = {
  all: ['board'] as const,
  board: () => [...BOARD_QUERY_KEYS.all, 'current'] as const,
}

export function cardsInColumn(cards: BoardCard[], columnId: BoardColumnId): BoardCard[] {
  return cards.filter((card) => card.columnId === columnId)
}

/**
 * Moving a card is a removal and an insertion over one flat list. Doing it in a pure
 * function means the optimistic update and the service apply exactly the same rule — if
 * they disagreed, the board would visibly jump when the response arrived.
 */
export function applyMove(
  cards: BoardCard[],
  { cardId, toColumnId, toIndex }: MoveCardInput,
): BoardCard[] {
  const moved = cards.find((card) => card.id === cardId)

  if (!moved) return cards

  const without = cards.filter((card) => card.id !== cardId)
  const destination = without.filter((card) => card.columnId === toColumnId)
  const anchor = destination[toIndex]
  const insertAt = anchor ? without.indexOf(anchor) : undefined
  const next = { ...moved, columnId: toColumnId }

  if (insertAt === undefined) {
    // Past the last card of the column: sit directly behind it, not at the end of the
    // whole board, so the flat order still groups the column together.
    const last = destination.at(-1)
    const lastIndex = last ? without.indexOf(last) + 1 : without.length

    return [...without.slice(0, lastIndex), next, ...without.slice(lastIndex)]
  }

  return [...without.slice(0, insertAt), next, ...without.slice(insertAt)]
}
