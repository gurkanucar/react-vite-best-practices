import {
  CalendarOutlined,
  CheckSquareOutlined,
  CopyOutlined,
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  FlagOutlined,
  ContainerOutlined,
  MoreOutlined,
  RollbackOutlined,
  UpOutlined,
} from '@ant-design/icons'
import { Button, Checkbox, Dropdown, Flex, Tag, Tooltip, Typography } from 'antd'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { useState } from 'react'
import { RichTextView } from '@/components/RichTextEditor'
import { PriorityFlag } from '@/features/todos/components/PriorityFlag'
import { dueLabel, PRIORITY_TAG_COLOR } from '@/features/todos/components/todoText'
import {
  dueState,
  subtaskProgress,
  tagColor,
  TODO_PRIORITIES,
  type Todo,
  type TodoPriority,
} from '@/features/todos/types'
import { useMessages } from '@/i18n/messages'

interface TodoItemProps {
  todo: Todo
  /** The description as plain text, for the one-line preview. */
  preview: string
  today: string
  onToggle: () => void
  onToggleSubtask: (subtaskId: string) => void
  onOpen: () => void
  onDuplicate: () => void
  onDelete: () => void
  /** Archives the task, or brings an archived one back. */
  onArchive: () => void
  onPriority: (priority: TodoPriority) => void
}

export function TodoItem({
  todo,
  preview,
  today,
  onToggle,
  onToggleSubtask,
  onOpen,
  onDuplicate,
  onDelete,
  onArchive,
  onPriority,
}: TodoItemProps) {
  const messages = useMessages()
  const text = messages.todos
  const [expanded, setExpanded] = useState(false)
  const progress = subtaskProgress(todo)
  const overdue = !todo.done && dueState(todo, today) === 'overdue'
  const expandable = Boolean(preview) || progress.total > 0
  const archived = Boolean(todo.archivedAt)
  const archiveLabel = archived ? text.unarchive : text.archive

  return (
    <div className={clsx('todo-item', (todo.done || archived) && 'todo-item--done')}>
      <Checkbox
        checked={todo.done}
        onChange={onToggle}
        aria-label={(todo.done ? text.reopen : text.complete).replace('{title}', todo.title)}
        className="todo-item__check"
      />

      <div className="todo-item__body">
        <button type="button" className="todo-item__title" onClick={onOpen}>
          <Typography.Text strong delete={todo.done} type={todo.done ? 'secondary' : undefined}>
            {todo.title}
          </Typography.Text>
        </button>

        {expanded ? (
          <div className="todo-item__details">
            {todo.description && <RichTextView html={todo.description} />}
            {progress.total > 0 && (
              <Flex vertical gap={4} className="todo-item__subtasks">
                {todo.subtasks.map((item) => (
                  <Checkbox
                    key={item.id}
                    checked={item.done}
                    onChange={() => onToggleSubtask(item.id)}
                  >
                    <Typography.Text delete={item.done} type={item.done ? 'secondary' : undefined}>
                      {item.title}
                    </Typography.Text>
                  </Checkbox>
                ))}
              </Flex>
            )}
          </div>
        ) : (
          preview && (
            <Typography.Paragraph type="secondary" ellipsis className="todo-item__preview">
              {preview}
            </Typography.Paragraph>
          )
        )}

        <Flex wrap gap={6} align="center" className="todo-item__meta">
          <Tag color={PRIORITY_TAG_COLOR[todo.priority]} icon={<FlagOutlined />} variant="outlined">
            {text.priorities[todo.priority]}
          </Tag>
          {todo.dueDate && (
            <Tag
              icon={<CalendarOutlined />}
              color={overdue ? 'error' : dueState(todo, today) === 'today' ? 'success' : undefined}
            >
              {dueLabel(todo.dueDate, today, messages)}
            </Tag>
          )}
          {progress.total > 0 && (
            <Tag
              icon={<CheckSquareOutlined />}
              color={progress.done === progress.total ? 'success' : undefined}
            >
              {text.subtaskCount
                .replace('{done}', String(progress.done))
                .replace('{total}', String(progress.total))}
            </Tag>
          )}
          {todo.archivedAt && (
            <Tag icon={<ContainerOutlined />}>
              {text.archivedOn.replace('{date}', dayjs(todo.archivedAt).format('D MMM'))}
            </Tag>
          )}
          {todo.tags.map((tag) => (
            <Tag key={tag} color={tagColor(tag)} variant="filled">
              #{tag}
            </Tag>
          ))}
          {expandable && (
            <Button
              type="link"
              size="small"
              icon={expanded ? <UpOutlined /> : <DownOutlined />}
              iconPlacement="end"
              aria-expanded={expanded}
              onClick={() => setExpanded((open) => !open)}
            >
              {expanded ? text.hideDetails : text.showDetails}
            </Button>
          )}
        </Flex>
      </div>

      {/* A finished task is one click from the archive; an archived one, from coming back. */}
      {(todo.done || archived) && (
        <Tooltip title={archiveLabel}>
          <Button
            type="text"
            icon={archived ? <RollbackOutlined /> : <ContainerOutlined />}
            aria-label={`${archiveLabel}: ${todo.title}`}
            onClick={onArchive}
          />
        </Tooltip>
      )}
      <Dropdown
        trigger={['click']}
        menu={{
          items: [
            { key: 'edit', icon: <EditOutlined />, label: text.edit },
            { key: 'duplicate', icon: <CopyOutlined />, label: text.duplicate },
            {
              key: 'priority',
              icon: <FlagOutlined />,
              label: text.priority,
              children: TODO_PRIORITIES.map((priority) => ({
                key: `priority:${priority}`,
                icon: <PriorityFlag priority={priority} />,
                label: text.priorities[priority],
                disabled: priority === todo.priority,
              })),
            },
            { type: 'divider' },
            {
              key: 'archive',
              icon: archived ? <RollbackOutlined /> : <ContainerOutlined />,
              label: archiveLabel,
            },
            { key: 'delete', icon: <DeleteOutlined />, label: text.delete, danger: true },
          ],
          onClick: ({ key }) => {
            if (key === 'edit') onOpen()
            if (key === 'duplicate') onDuplicate()
            if (key === 'archive') onArchive()
            if (key === 'delete') onDelete()
            if (key.startsWith('priority:')) onPriority(key.slice(9) as TodoPriority)
          },
        }}
      >
        <Tooltip title={text.more}>
          <Button type="text" icon={<MoreOutlined />} aria-label={`${text.more}: ${todo.title}`} />
        </Tooltip>
      </Dropdown>
    </div>
  )
}
