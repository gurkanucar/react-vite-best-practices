import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Badge, Card, Empty, Flex, Tag } from 'antd'
import { BoardCardItem } from '@/features/board/components/BoardCardItem'
import type { BoardCard, BoardColumn } from '@/features/board/types'
import { useMessages } from '@/i18n/messages'

interface BoardColumnPanelProps {
  column: BoardColumn
  cards: BoardCard[]
}

export function BoardColumnPanel({ column, cards }: BoardColumnPanelProps) {
  const messages = useMessages()
  // The column is a drop target in its own right, so an empty one can still be dropped
  // into — there is no card underneath to collide with.
  const { isOver, setNodeRef } = useDroppable({ id: column.id })
  const overLimit = column.limit !== undefined && cards.length > column.limit

  return (
    <Card
      className={`board-column${isOver ? ' board-column--over' : ''}`}
      title={
        <Flex align="center" gap={8}>
          <span>{messages.board.columns[column.id]}</span>
          <Badge count={cards.length} showZero color={overLimit ? 'red' : 'blue'} />
        </Flex>
      }
      extra={
        column.limit !== undefined && (
          <Tag color={overLimit ? 'error' : 'default'}>
            {messages.board.wipLimit.replace('{limit}', String(column.limit))}
          </Tag>
        )
      }
    >
      <div ref={setNodeRef} className="board-column__dropzone">
        <SortableContext
          items={cards.map((card) => card.id)}
          strategy={verticalListSortingStrategy}
        >
          <Flex vertical gap={8}>
            {cards.map((card) => (
              <BoardCardItem key={card.id} card={card} />
            ))}
          </Flex>
        </SortableContext>

        {cards.length === 0 && (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={messages.board.emptyColumn} />
        )}
      </div>
    </Card>
  )
}
