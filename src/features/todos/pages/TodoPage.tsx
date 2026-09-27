import {
  CheckCircleOutlined,
  ContainerOutlined,
  DeleteOutlined,
  EllipsisOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import {
  App,
  Button,
  Card,
  Col,
  Collapse,
  Dropdown,
  Empty,
  Flex,
  Input,
  Progress,
  Row,
  Select,
  Statistic,
  Typography,
} from 'antd'
import { useMemo, useState } from 'react'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import { richTextToPlain } from '@/components/RichTextEditor'
import { PriorityFlag, TodoEditor, TodoItem, TodoSidebar } from '@/features/todos/components'
import { useTodoStore, type TodoInput } from '@/features/todos/hooks'
import {
  groupTodos,
  matchesFilters,
  parseQuickAdd,
  sortTodos,
  tagCounts,
  todayKey,
  TODO_PRIORITIES,
  viewCounts,
  type Todo,
  type TodoFilters,
  type TodoGroup,
  type TodoSort,
} from '@/features/todos/types'
import { useMessages } from '@/i18n/messages'
import './TodoPage.css'

const NO_FILTERS: TodoFilters = { view: 'all', search: '', tags: [], priorities: [] }

type EditorState = { mode: 'closed' } | { mode: 'new' } | { mode: 'edit'; id: string }

export function TodoPage() {
  const messages = useMessages()
  const text = messages.todos
  const { message, modal } = App.useApp()
  const store = useTodoStore()
  const { todos } = store
  const [filters, setFilters] = useState<TodoFilters>(NO_FILTERS)
  const [sort, setSort] = useState<TodoSort>('due')
  const [quickAdd, setQuickAdd] = useState('')
  const [editor, setEditor] = useState<EditorState>({ mode: 'closed' })
  const [collapsed, setCollapsed] = useState<TodoGroup[]>([])
  const today = todayKey()

  // Parsing HTML is the one costly step in filtering, so it happens once per change of the list.
  const previews = useMemo(
    () => new Map(todos.map((todo) => [todo.id, richTextToPlain(todo.description)])),
    [todos],
  )
  const counts = useMemo(() => viewCounts(todos, today), [todos, today])
  const tags = useMemo(() => tagCounts(todos), [todos])
  const visible = useMemo(
    () =>
      sortTodos(
        todos.filter((todo) => matchesFilters(todo, filters, today, previews.get(todo.id))),
        sort,
      ),
    [todos, filters, today, previews, sort],
  )
  const groups = groupTodos(visible, today)
  // Archived work is put away: it no longer counts towards the open list's progress.
  const active = todos.filter((todo) => !todo.archivedAt)
  const doneCount = active.filter((todo) => todo.done).length
  const archivedCount = todos.length - active.length
  const filtered =
    filters.search.trim() !== '' || filters.tags.length > 0 || filters.priorities.length > 0

  const setFilter = <K extends keyof TodoFilters>(key: K, value: TodoFilters[K]) =>
    setFilters((current) => ({ ...current, [key]: value }))

  // A task started from a filtered list belongs in it, or it would vanish the moment it is added.
  const defaults: Partial<TodoInput> = {
    tags: filters.tags,
    priority: filters.priorities[0],
    dueDate: filters.view === 'today' ? today : undefined,
  }

  const addQuick = () => {
    const parsed = parseQuickAdd(quickAdd)
    if (!parsed.title) return

    store.add({
      title: parsed.title,
      description: '',
      priority: parsed.priority ?? defaults.priority ?? 'medium',
      tags: [...new Set([...(defaults.tags ?? []), ...parsed.tags])],
      dueDate: defaults.dueDate,
      subtasks: [],
    })
    setQuickAdd('')
    void message.success(text.created)
  }

  // Every change that takes a task out of sight is instant and forgiving: the toast offers it
  // back instead of a dialog asking first.
  const undoToast = (key: string, content: string, onUndo: () => void) =>
    void message.open({
      key,
      type: 'info',
      duration: 5,
      content: (
        <Flex align="center" gap={8} component="span">
          {content}
          <Button
            type="link"
            size="small"
            onClick={() => {
              onUndo()
              message.destroy(key)
            }}
          >
            {text.undo}
          </Button>
        </Flex>
      ),
    })

  const closeEditorFor = (id: string) => {
    if (editor.mode === 'edit' && editor.id === id) setEditor({ mode: 'closed' })
  }

  const remove = (todo: Todo) => {
    const index = todos.findIndex((item) => item.id === todo.id)
    store.remove(todo.id)
    closeEditorFor(todo.id)
    undoToast(`todo-deleted-${todo.id}`, text.deleted, () => store.restore(todo, index))
  }

  const toggleArchive = (todo: Todo) => {
    if (todo.archivedAt) {
      store.unarchive([todo.id])
      undoToast(`todo-archive-${todo.id}`, text.unarchived, () => store.archive([todo.id]))
    } else {
      store.archive([todo.id])
      closeEditorFor(todo.id)
      undoToast(`todo-archive-${todo.id}`, text.archived, () => store.unarchive([todo.id]))
    }
  }

  // Archiving loses nothing, so it needs no confirmation; the toast can take it back.
  const archiveCompleted = () => {
    const ids = store.archiveCompleted()
    if (ids.length === 0) return
    undoToast(
      'todo-archive-completed',
      text.archivedCompleted.replace('{count}', String(ids.length)),
      () => store.unarchive(ids),
    )
  }

  // Emptying the archive is the only bulk delete, and the only one that asks first.
  const emptyArchive = () =>
    modal.confirm({
      title: text.emptyArchive,
      content: text.emptyArchiveConfirm.replace('{count}', String(archivedCount)),
      okText: text.delete,
      okButtonProps: { danger: true },
      cancelText: text.cancel,
      onOk: () => {
        store.emptyArchive()
        void message.success(text.emptiedArchive)
      },
    })

  const editing = editor.mode === 'edit' ? todos.find((todo) => todo.id === editor.id) : undefined

  const submitEditor = (input: TodoInput) => {
    if (editing) {
      store.update(editing.id, input)
      void message.success(text.saved)
    } else {
      store.add(input)
      void message.success(text.created)
    }
    setEditor({ mode: 'closed' })
  }

  const stats = [
    { key: 'open', value: counts.all, color: undefined },
    { key: 'today', value: counts.today - counts.overdue, color: 'var(--ant-color-success)' },
    {
      key: 'overdue',
      value: counts.overdue,
      color: counts.overdue ? 'var(--ant-color-error)' : undefined,
    },
  ] as const

  return (
    <div className="admin-page todo-page">
      <PageHeader
        // Commented out rather than deleted, like the other workspace pages: not worth the space.
        // title={text.title}
        // description={text.description}
        extra={
          <Flex gap={8}>
            <Dropdown
              trigger={['click']}
              menu={{
                items: [
                  {
                    key: 'archive',
                    icon: <ContainerOutlined />,
                    label: text.archiveCompleted,
                    disabled: doneCount === 0,
                  },
                  {
                    key: 'empty',
                    icon: <DeleteOutlined />,
                    label: text.emptyArchive,
                    danger: true,
                    disabled: archivedCount === 0,
                  },
                  { type: 'divider' },
                  { key: 'reset', icon: <ReloadOutlined />, label: text.reset },
                ],
                onClick: ({ key }) => {
                  if (key === 'archive') archiveCompleted()
                  if (key === 'empty') emptyArchive()
                  if (key === 'reset') {
                    store.reset()
                    void message.success(text.resetDone)
                  }
                },
              }}
            >
              <Button icon={<EllipsisOutlined />} aria-label={text.more} />
            </Dropdown>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setEditor({ mode: 'new' })}
            >
              {text.newTask}
            </Button>
          </Flex>
        }
      />

      <Row gutter={[16, 16]} className="todo-stats">
        {stats.map((stat) => (
          <Col key={stat.key} xs={12} md={6}>
            <Card variant="borderless" size="small">
              <Statistic
                title={text.stats[stat.key]}
                value={stat.value}
                styles={{ content: { color: stat.color } }}
              />
            </Card>
          </Col>
        ))}
        <Col xs={12} md={6}>
          <Card variant="borderless" size="small">
            <Flex align="center" justify="space-between" gap={12}>
              <Statistic
                title={text.stats.progress}
                value={doneCount}
                suffix={`/ ${active.length}`}
              />
              <Progress
                type="circle"
                size={48}
                percent={active.length ? Math.round((doneCount / active.length) * 100) : 0}
              />
            </Flex>
          </Card>
        </Col>
      </Row>

      <Row gutter={[20, 20]} align="top">
        <Col xs={24} lg={6}>
          <TodoSidebar
            view={filters.view}
            counts={counts}
            tags={tags}
            selectedTags={filters.tags}
            onView={(view) => setFilter('view', view)}
            onToggleTag={(tag) =>
              setFilter(
                'tags',
                filters.tags.includes(tag)
                  ? filters.tags.filter((item) => item !== tag)
                  : [...filters.tags, tag],
              )
            }
          />
        </Col>

        <Col xs={24} lg={18}>
          <Card variant="borderless" className="todo-main">
            <Input
              size="large"
              prefix={<PlusOutlined />}
              value={quickAdd}
              placeholder={text.quickAddPlaceholder}
              aria-label={text.quickAdd}
              onChange={(event) => setQuickAdd(event.target.value)}
              onPressEnter={addQuick}
              suffix={
                <Button
                  type="primary"
                  size="small"
                  disabled={!parseQuickAdd(quickAdd).title}
                  onClick={addQuick}
                >
                  {text.create}
                </Button>
              }
            />

            <Flex wrap gap={8} className="todo-toolbar">
              <Input
                allowClear
                prefix={<SearchOutlined />}
                placeholder={text.search}
                aria-label={text.search}
                value={filters.search}
                onChange={(event) => setFilter('search', event.target.value)}
                className="todo-toolbar__search"
              />
              <Select
                mode="multiple"
                allowClear
                maxTagCount="responsive"
                placeholder={text.anyPriority}
                aria-label={text.priority}
                value={filters.priorities}
                onChange={(value) => setFilter('priorities', value)}
                className="todo-toolbar__priority"
                options={TODO_PRIORITIES.map((priority) => ({
                  value: priority,
                  label: (
                    <Flex gap={6} align="center">
                      <PriorityFlag priority={priority} />
                      {text.priorities[priority]}
                    </Flex>
                  ),
                }))}
              />
              <Select
                value={sort}
                aria-label={text.sortBy}
                onChange={setSort}
                prefix={`${text.sortBy}:`}
                className="todo-toolbar__sort"
                options={(['due', 'priority', 'created', 'title'] as const).map((value) => ({
                  value,
                  label: text.sort[value],
                }))}
              />
              {filtered && (
                <Button
                  type="link"
                  onClick={() => setFilters((current) => ({ ...NO_FILTERS, view: current.view }))}
                >
                  {text.clearFilters}
                </Button>
              )}
            </Flex>

            {groups.length === 0 ? (
              <Empty
                image={<CheckCircleOutlined className="todo-empty__icon" />}
                description={filtered ? text.empty.filtered : text.empty[filters.view]}
                className="todo-empty"
              />
            ) : (
              <Collapse
                ghost
                activeKey={groups
                  .map((entry) => entry.group)
                  .filter((group) => !collapsed.includes(group))}
                onChange={(keys) =>
                  setCollapsed(
                    groups.map((entry) => entry.group).filter((group) => !keys.includes(group)),
                  )
                }
                className="todo-groups"
                items={groups.map(({ group, todos: items }) => ({
                  key: group,
                  label: (
                    <Typography.Text strong type={group === 'overdue' ? 'danger' : undefined}>
                      {text.groups[group]}{' '}
                      <Typography.Text type="secondary">{items.length}</Typography.Text>
                    </Typography.Text>
                  ),
                  extra:
                    group === 'completed' || group === 'archived' ? (
                      <Button
                        type="link"
                        size="small"
                        danger={group === 'archived'}
                        icon={group === 'archived' ? <DeleteOutlined /> : <ContainerOutlined />}
                        onClick={(event) => {
                          // The button sits in the panel header; without this it folds the panel too.
                          event.stopPropagation()
                          if (group === 'archived') emptyArchive()
                          else archiveCompleted()
                        }}
                      >
                        {group === 'archived' ? text.emptyArchive : text.archiveCompleted}
                      </Button>
                    ) : undefined,
                  children: (
                    <div className="todo-list">
                      {items.map((todo) => (
                        <TodoItem
                          key={todo.id}
                          todo={todo}
                          preview={previews.get(todo.id) ?? ''}
                          today={today}
                          onToggle={() => store.toggle(todo.id)}
                          onToggleSubtask={(subtaskId) => store.toggleSubtask(todo.id, subtaskId)}
                          onOpen={() => setEditor({ mode: 'edit', id: todo.id })}
                          onDuplicate={() => store.duplicate(todo.id)}
                          onDelete={() => remove(todo)}
                          onArchive={() => toggleArchive(todo)}
                          onPriority={(priority) => store.update(todo.id, { priority })}
                        />
                      ))}
                    </div>
                  ),
                }))}
              />
            )}
          </Card>
        </Col>
      </Row>

      <TodoEditor
        open={editor.mode !== 'closed'}
        todo={editing}
        defaults={defaults}
        tagOptions={tags.map((entry) => entry.tag)}
        onClose={() => setEditor({ mode: 'closed' })}
        onSubmit={submitEditor}
        onDelete={editing ? () => remove(editing) : undefined}
      />
    </div>
  )
}
