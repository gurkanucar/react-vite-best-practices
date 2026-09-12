import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { Alert, App, Flex, Switch, Tooltip } from 'antd'
import { useState } from 'react'
import { LoadingState } from '@/components/LoadingState/LoadingState'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import { BoardCardItem, BoardColumnPanel } from '@/features/board/components'
import { useBoardAnnouncements, useBoardQuery, useMoveCardMutation } from '@/features/board/hooks'
import { setFailNextMove } from '@/features/board/services/boardService'
import {
  applyMove,
  cardsInColumn,
  type BoardCard,
  type BoardColumnId,
} from '@/features/board/types'
import { useMessages } from '@/i18n/messages'

interface DragPreview {
  activeId: string
  cards: BoardCard[]
}

function isColumnId(value: string, columnIds: BoardColumnId[]): value is BoardColumnId {
  return (columnIds as string[]).includes(value)
}

export function BoardPage() {
  const messages = useMessages()
  const { message } = App.useApp()
  const boardQuery = useBoardQuery()
  const moveCard = useMoveCardMutation()
  const [preview, setPreview] = useState<DragPreview | null>(null)
  const [failNext, setFailNext] = useState(false)
  const announcements = useBoardAnnouncements()

  const sensors = useSensors(
    // A small distance keeps a click on the handle from registering as a drag.
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  if (boardQuery.isPending) {
    return (
      <div className="admin-page">
        {/* Commented out rather than deleted: the description is available, just not worth the space here. */}
        <PageHeader title={messages.board.title} /* description={messages.board.description} */ />
        <LoadingState />
      </div>
    )
  }

  const board = boardQuery.data
  const columnIds = board?.columns.map((column) => column.id) ?? []
  /** While dragging, the preview is the truth on screen; the cache is not touched yet. */
  const cards = preview?.cards ?? board?.cards ?? []

  /** Where a card would land given whatever the pointer is over: a card, or a column. */
  function resolveTarget(overId: string, current: BoardCard[]) {
    if (isColumnId(overId, columnIds)) {
      return { columnId: overId, index: cardsInColumn(current, overId).length }
    }

    const overCard = current.find((card) => card.id === overId)

    if (!overCard) return null

    return {
      columnId: overCard.columnId,
      index: cardsInColumn(current, overCard.columnId).indexOf(overCard),
    }
  }

  const handleDragStart = (event: DragStartEvent) => {
    setPreview({ activeId: String(event.active.id), cards })
  }

  const handleDragOver = (event: DragOverEvent) => {
    if (!event.over || !preview) return

    const target = resolveTarget(String(event.over.id), preview.cards)

    if (!target) return

    setPreview({
      activeId: preview.activeId,
      cards: applyMove(preview.cards, {
        cardId: preview.activeId,
        toColumnId: target.columnId,
        toIndex: target.index,
      }),
    })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    if (!preview) return

    const cardId = preview.activeId
    const moved = preview.cards.find((card) => card.id === cardId)
    const original = board?.cards.find((card) => card.id === cardId)

    if (!event.over || !moved || !original) {
      setPreview(null)
      return
    }

    const toIndex = cardsInColumn(preview.cards, moved.columnId).indexOf(moved)
    const fromIndex = cardsInColumn(board?.cards ?? [], original.columnId).indexOf(original)

    if (moved.columnId === original.columnId && toIndex === fromIndex) {
      setPreview(null)
      return
    }

    moveCard.mutate(
      { cardId, toColumnId: moved.columnId, toIndex },
      {
        onError: () => message.error(messages.board.moveFailed),
        // Held until the request settles so the card does not snap back to its old place
        // for a frame while the optimistic update is still being written.
        onSettled: () => setPreview(null),
      },
    )
  }

  const activeCard = preview ? cards.find((card) => card.id === preview.activeId) : undefined

  return (
    <div className="admin-page">
      <PageHeader
        title={messages.board.title}
        // Commented out rather than deleted: available, just not worth the space on this screen.
        // description={messages.board.description}
        extra={
          <Tooltip title={messages.board.simulateFailureHint}>
            <Flex align="center" gap={8}>
              <Switch
                checked={failNext}
                onChange={(checked) => {
                  setFailNext(checked)
                  setFailNextMove(checked)
                }}
              />
              <span>{messages.board.simulateFailure}</span>
            </Flex>
          </Tooltip>
        }
      />

      <Alert showIcon type="info" title={messages.board.notice} />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setPreview(null)}
        // dnd-kit announces drag progress to screen readers in English by default.
        accessibility={{ announcements }}
      >
        <div className="board-grid">
          {board?.columns.map((column) => (
            <BoardColumnPanel
              key={column.id}
              column={column}
              cards={cardsInColumn(cards, column.id)}
            />
          ))}
        </div>

        {/* The card follows the cursor detached from the list, so the list can reflow. */}
        <DragOverlay>{activeCard ? <BoardCardItem card={activeCard} overlay /> : null}</DragOverlay>
      </DndContext>
    </div>
  )
}
