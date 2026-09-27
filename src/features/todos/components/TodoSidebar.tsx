import {
  CalendarOutlined,
  CheckCircleOutlined,
  FieldTimeOutlined,
  ContainerOutlined,
  InboxOutlined,
  WarningOutlined,
} from '@ant-design/icons'
import { Badge, Card, Flex, Grid, Menu, Segmented, Tag, Typography } from 'antd'
import type { ReactNode } from 'react'
import { tagColor, TODO_VIEWS, type TodoView } from '@/features/todos/types'
import { useMessages } from '@/i18n/messages'

interface TodoSidebarProps {
  view: TodoView
  counts: Record<TodoView, number>
  tags: { tag: string; count: number }[]
  selectedTags: string[]
  onView: (view: TodoView) => void
  onToggleTag: (tag: string) => void
}

const VIEW_ICONS: Record<TodoView, ReactNode> = {
  all: <InboxOutlined />,
  today: <CalendarOutlined />,
  upcoming: <FieldTimeOutlined />,
  overdue: <WarningOutlined />,
  completed: <CheckCircleOutlined />,
  archived: <ContainerOutlined />,
}

/** The lists down the side, as in any task app, and the tags to narrow them with. */
export function TodoSidebar({
  view,
  counts,
  tags,
  selectedTags,
  onView,
  onToggleTag,
}: TodoSidebarProps) {
  const text = useMessages().todos
  // On a phone the lists run across the top instead, so the tasks are not pushed off screen.
  const wide = Grid.useBreakpoint().lg ?? true

  return (
    <Card variant="borderless" className="todo-sidebar">
      {wide ? (
        <>
          <Typography.Text type="secondary" className="todo-sidebar__heading">
            {text.lists}
          </Typography.Text>
          <Menu
            mode="inline"
            selectedKeys={[view]}
            className="todo-sidebar__menu"
            onClick={({ key }) => onView(key as TodoView)}
            items={TODO_VIEWS.flatMap((key) => [
              // The archive is set apart: it is where finished work goes, not a list to work from.
              ...(key === 'archived' ? [{ type: 'divider' as const }] : []),
              {
                key,
                icon: VIEW_ICONS[key],
                label: text.views[key],
                // Only overdue work earns a red count; the rest is quiet grey.
                extra:
                  key === 'overdue' && counts[key] > 0 ? (
                    <Badge count={counts[key]} />
                  ) : (
                    <Typography.Text type="secondary">{counts[key] || ''}</Typography.Text>
                  ),
              },
            ])}
          />
        </>
      ) : (
        // Six lists do not fit across a phone; they scroll sideways rather than hide behind a "…".
        <div className="todo-sidebar__scroller">
          <Segmented<TodoView>
            value={view}
            onChange={onView}
            options={TODO_VIEWS.map((key) => ({
              value: key,
              icon: VIEW_ICONS[key],
              label: counts[key] ? `${text.views[key]} ${counts[key]}` : text.views[key],
            }))}
          />
        </div>
      )}

      <Typography.Text type="secondary" className="todo-sidebar__heading">
        {text.tags}
      </Typography.Text>
      {tags.length === 0 ? (
        <Typography.Text type="secondary">{text.noTags}</Typography.Text>
      ) : (
        <Flex wrap gap={6} className="todo-sidebar__tags">
          {tags.map(({ tag, count }) => {
            const checked = selectedTags.includes(tag)

            return (
              <Tag.CheckableTag
                key={tag}
                checked={checked}
                onChange={() => onToggleTag(tag)}
                className="todo-sidebar__tag"
              >
                <Badge color={tagColor(tag)} /> #{tag}
                <span className="todo-sidebar__tag-count">{count}</span>
              </Tag.CheckableTag>
            )
          })}
        </Flex>
      )}
    </Card>
  )
}
