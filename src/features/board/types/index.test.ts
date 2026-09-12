import { describe, expect, it } from 'vitest'
import { applyMove, cardsInColumn, type BoardCard } from '@/features/board/types'

function card(id: string, columnId: BoardCard['columnId']): BoardCard {
  return {
    id,
    columnId,
    title: id,
    assignee: 'Ava Patel',
    priority: 'medium',
    points: 3,
    dueDate: '2026-09-30',
    labels: [],
  }
}

const cards = [card('a', 'backlog'), card('b', 'backlog'), card('c', 'inProgress')]

describe('applyMove', () => {
  it('reorders within a column', () => {
    const moved = applyMove(cards, { cardId: 'b', toColumnId: 'backlog', toIndex: 0 })

    expect(cardsInColumn(moved, 'backlog').map((entry) => entry.id)).toEqual(['b', 'a'])
  })

  it('moves across columns at the requested position', () => {
    const moved = applyMove(cards, { cardId: 'a', toColumnId: 'inProgress', toIndex: 0 })

    expect(cardsInColumn(moved, 'inProgress').map((entry) => entry.id)).toEqual(['a', 'c'])
    expect(cardsInColumn(moved, 'backlog').map((entry) => entry.id)).toEqual(['b'])
  })

  it('appends when the index is past the end of the destination', () => {
    const moved = applyMove(cards, { cardId: 'a', toColumnId: 'inProgress', toIndex: 9 })

    expect(cardsInColumn(moved, 'inProgress').map((entry) => entry.id)).toEqual(['c', 'a'])
  })

  it('keeps a card grouped with its new column rather than at the end of the board', () => {
    const moved = applyMove(cards, { cardId: 'c', toColumnId: 'backlog', toIndex: 9 })

    expect(moved.map((entry) => entry.id)).toEqual(['a', 'b', 'c'])
    expect(cardsInColumn(moved, 'inProgress')).toHaveLength(0)
  })

  it('leaves the board alone when the card is unknown', () => {
    expect(applyMove(cards, { cardId: 'zzz', toColumnId: 'done', toIndex: 0 })).toBe(cards)
  })
})
