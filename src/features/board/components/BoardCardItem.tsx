import { HolderOutlined } from '@ant-design/icons'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Avatar, Card, Flex, Tag, Tooltip, Typography } from 'antd'
import type { BoardCard, CardPriority } from '@/features/board/types'
import { useMessages } from '@/i18n/messages'

const priorityColors: Record<CardPriority, string> = {
  low: 'default',
  medium: 'blue',
  high: 'orange',
  urgent: 'red',
}

interface BoardCardItemProps {
  card: BoardCard
  /** The copy rendered inside `DragOverlay`, which must not re-register as sortable. */
  overlay?: boolean
}

export function BoardCardItem({ card, overlay = false }: BoardCardItemProps) {
  const messages = useMessages()
  const sortable = useSortable({ id: card.id, disabled: overlay })
  const initials = card.assignee
    .split(' ')
    .map((part) => part[0])
    .join('')

  return (
    <Card
      size="small"
      ref={overlay ? undefined : sortable.setNodeRef}
      className={`board-card${sortable.isDragging ? ' board-card--dragging' : ''}${overlay ? ' board-card--overlay' : ''}`}
      style={{
        transform: CSS.Translate.toString(sortable.transform),
        transition: sortable.transition,
      }}
    >
      <Flex vertical gap={8}>
        <Flex align="start" gap={8} justify="space-between">
          <Typography.Text strong>{card.title}</Typography.Text>
          {/*
           * Only the handle starts a drag. Making the whole card draggable would swallow
           * the click on anything inside it, and the handle is what keyboard users tab to.
           */}
          <Tooltip title={messages.board.dragHandle}>
            <button
              type="button"
              className="board-card__handle"
              aria-label={`${messages.board.dragHandle}: ${card.title}`}
              {...sortable.attributes}
              {...sortable.listeners}
            >
              <HolderOutlined aria-hidden="true" />
            </button>
          </Tooltip>
        </Flex>

        <Flex gap={4} wrap>
          <Tag color={priorityColors[card.priority]}>
            {messages.board.priorities[card.priority]}
          </Tag>
          {card.labels.map((label) => (
            <Tag key={label}>{messages.board.labels[label]}</Tag>
          ))}
        </Flex>

        <Flex align="center" justify="space-between" gap={8}>
          <Typography.Text type="secondary" className="board-card__meta">
            {card.id} · {messages.board.points.replace('{count}', String(card.points))}
          </Typography.Text>
          <Tooltip title={card.assignee}>
            <Avatar size="small">{initials}</Avatar>
          </Tooltip>
        </Flex>
      </Flex>
    </Card>
  )
}
