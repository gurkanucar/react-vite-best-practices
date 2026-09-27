import dayjs from 'dayjs'

/** Most pressing first: the order the list sorts by and the picker offers them in. */
export const TODO_PRIORITIES = ['urgent', 'high', 'medium', 'low'] as const
export type TodoPriority = (typeof TODO_PRIORITIES)[number]

export interface Subtask {
  id: string
  title: string
  done: boolean
}

export interface Todo {
  id: string
  title: string
  /** HTML from the rich text editor; empty when the task has no notes. */
  description: string
  done: boolean
  priority: TodoPriority
  tags: string[]
  /** A calendar day, `YYYY-MM-DD`. A task without one is "someday". */
  dueDate?: string
  subtasks: Subtask[]
  createdAt: string
  completedAt?: string
  /** Set when the task is put away: kept, out of every list but the archive, and restorable. */
  archivedAt?: string
}

export type TodoView = 'all' | 'today' | 'upcoming' | 'overdue' | 'completed' | 'archived'
export const TODO_VIEWS: TodoView[] = [
  'all',
  'today',
  'upcoming',
  'overdue',
  'completed',
  'archived',
]

export type TodoSort = 'due' | 'priority' | 'created' | 'title'

export interface TodoFilters {
  view: TodoView
  search: string
  tags: string[]
  priorities: TodoPriority[]
}

/** Where an open task stands against the calendar; a finished one is simply done. */
export type DueState = 'overdue' | 'today' | 'upcoming' | 'noDate'
export type TodoGroup = DueState | 'completed' | 'archived'
export const TODO_GROUPS: TodoGroup[] = [
  'overdue',
  'today',
  'upcoming',
  'noDate',
  'completed',
  'archived',
]

export function todayKey(now = dayjs()): string {
  return now.format('YYYY-MM-DD')
}

export function dueState(todo: Pick<Todo, 'dueDate'>, today: string): DueState {
  if (!todo.dueDate) return 'noDate'
  // ISO days compare correctly as strings, which spares a parse per task.
  if (todo.dueDate < today) return 'overdue'
  if (todo.dueDate === today) return 'today'
  return 'upcoming'
}

export function todoGroup(todo: Todo, today: string): TodoGroup {
  if (todo.archivedAt) return 'archived'
  return todo.done ? 'completed' : dueState(todo, today)
}

function inView(todo: Todo, view: TodoView, today: string): boolean {
  // The archive is its own list; everywhere else an archived task is out of the way.
  if (view === 'archived') return Boolean(todo.archivedAt)
  if (todo.archivedAt) return false
  if (view === 'all') return true
  if (view === 'completed') return todo.done
  if (todo.done) return false
  // "Today" is what has to happen today, which includes what should already have happened.
  if (view === 'today') return ['today', 'overdue'].includes(dueState(todo, today))
  return dueState(todo, today) === view
}

export function matchesFilters(
  todo: Todo,
  filters: TodoFilters,
  today: string,
  /** The description as plain text; the caller has it cached, and parsing HTML per keystroke is not free. */
  plainDescription = '',
): boolean {
  if (!inView(todo, filters.view, today)) return false
  if (filters.priorities.length > 0 && !filters.priorities.includes(todo.priority)) return false
  if (!filters.tags.every((tag) => todo.tags.includes(tag))) return false

  const search = filters.search.trim().toLocaleLowerCase()
  if (!search) return true

  return [todo.title, plainDescription, ...todo.tags, ...todo.subtasks.map((item) => item.title)]
    .join(' ')
    .toLocaleLowerCase()
    .includes(search)
}

export function viewCounts(todos: Todo[], today: string): Record<TodoView, number> {
  return Object.fromEntries(
    TODO_VIEWS.map((view) => [
      view,
      todos.filter((todo) =>
        view === 'all' ? !todo.done && !todo.archivedAt : inView(todo, view, today),
      ).length,
    ]),
  ) as Record<TodoView, number>
}

/** Every tag in use, most used first, with how many open tasks carry it. */
export function tagCounts(todos: Todo[]): { tag: string; count: number }[] {
  const counts = new Map<string, number>()
  for (const todo of todos) {
    const open = !todo.done && !todo.archivedAt
    for (const tag of todo.tags) counts.set(tag, (counts.get(tag) ?? 0) + (open ? 1 : 0))
  }

  return [...counts]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
}

const priorityRank = (priority: TodoPriority) => TODO_PRIORITIES.indexOf(priority)

export function sortTodos(todos: Todo[], sort: TodoSort): Todo[] {
  const byPriority = (a: Todo, b: Todo) => priorityRank(a.priority) - priorityRank(b.priority)
  // A task with no date sorts after every dated one.
  const byDue = (a: Todo, b: Todo) =>
    (a.dueDate ?? '9999').localeCompare(b.dueDate ?? '9999') || byPriority(a, b)

  const compare: Record<TodoSort, (a: Todo, b: Todo) => number> = {
    due: byDue,
    priority: (a, b) => byPriority(a, b) || byDue(a, b),
    created: (a, b) => b.createdAt.localeCompare(a.createdAt),
    title: (a, b) => a.title.localeCompare(b.title),
  }

  return [...todos].sort(compare[sort])
}

export function groupTodos(todos: Todo[], today: string): { group: TodoGroup; todos: Todo[] }[] {
  return TODO_GROUPS.map((group) => ({
    group,
    todos: todos.filter((todo) => todoGroup(todo, today) === group),
  })).filter((entry) => entry.todos.length > 0)
}

/** The words that set a priority from the quick-add box, in both languages. */
const PRIORITY_WORDS: Record<string, TodoPriority> = {
  urgent: 'urgent',
  acil: 'urgent',
  high: 'high',
  yuksek: 'high',
  yüksek: 'high',
  medium: 'medium',
  orta: 'medium',
  low: 'low',
  dusuk: 'low',
  düşük: 'low',
  '1': 'urgent',
  '2': 'high',
  '3': 'medium',
  '4': 'low',
}

export interface QuickAdd {
  title: string
  tags: string[]
  priority?: TodoPriority
}

/**
 * Reads the quick-add box the way task apps do: `#tag` adds a tag and `!high` (or `!1`) sets
 * the priority, wherever they appear. What is left is the title.
 */
export function parseQuickAdd(input: string): QuickAdd {
  const tags: string[] = []
  let priority: TodoPriority | undefined

  const title = input
    .replace(/(^|\s)#([\p{L}\p{N}_-]+)/gu, (_, space: string, tag: string) => {
      const normalized = tag.toLocaleLowerCase()
      if (!tags.includes(normalized)) tags.push(normalized)
      return space
    })
    .replace(/(^|\s)!([\p{L}\p{N}]+)/gu, (match, space: string, word: string) => {
      const found = PRIORITY_WORDS[word.toLocaleLowerCase()]
      if (!found) return match
      priority = found
      return space
    })
    .replace(/\s+/g, ' ')
    .trim()

  return { title, tags, priority }
}

/** antd preset colours; a tag keeps its colour everywhere because it is derived from its name. */
const TAG_COLORS = [
  'blue',
  'green',
  'purple',
  'orange',
  'cyan',
  'magenta',
  'gold',
  'geekblue',
  'volcano',
  'lime',
]

export function tagColor(tag: string): string {
  let hash = 0
  for (const char of tag) hash = (hash * 31 + char.codePointAt(0)!) >>> 0

  return TAG_COLORS[hash % TAG_COLORS.length]
}

export function subtaskProgress(todo: Todo): { done: number; total: number } {
  return {
    done: todo.subtasks.filter((item) => item.done).length,
    total: todo.subtasks.length,
  }
}
