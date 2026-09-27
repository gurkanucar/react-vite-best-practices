import { describe, expect, it } from 'vitest'
import {
  dueState,
  groupTodos,
  matchesFilters,
  parseQuickAdd,
  sortTodos,
  tagColor,
  tagCounts,
  viewCounts,
  type Todo,
  type TodoFilters,
} from '@/features/todos/types'

const today = '2026-09-27'

function todo(id: string, extra: Partial<Todo> = {}): Todo {
  return {
    id,
    title: id,
    description: '',
    done: false,
    priority: 'medium',
    tags: [],
    subtasks: [],
    createdAt: '2026-09-01T10:00:00.000Z',
    ...extra,
  }
}

const filters = (extra: Partial<TodoFilters> = {}): TodoFilters => ({
  view: 'all',
  search: '',
  tags: [],
  priorities: [],
  ...extra,
})

describe('parseQuickAdd', () => {
  it('takes tags and a priority out of the title, wherever they are', () => {
    expect(parseQuickAdd('Fix #bug the login !high #Frontend')).toEqual({
      title: 'Fix the login',
      tags: ['bug', 'frontend'],
      priority: 'high',
    })
  })

  it('understands Turkish words and numbers, and leaves an unknown !word in the title', () => {
    expect(parseQuickAdd('Rapor !acil').priority).toBe('urgent')
    expect(parseQuickAdd('Rapor !düşük').priority).toBe('low')
    expect(parseQuickAdd('Call !2').priority).toBe('high')
    expect(parseQuickAdd('Wow !amazing')).toEqual({ title: 'Wow !amazing', tags: [] })
  })

  it('keeps a # inside a word, such as an issue reference', () => {
    expect(parseQuickAdd('Close PR#12').title).toBe('Close PR#12')
  })
})

describe('dueState and views', () => {
  const list = [
    todo('late', { dueDate: '2026-09-25' }),
    todo('now', { dueDate: today }),
    todo('soon', { dueDate: '2026-10-01' }),
    todo('someday'),
    todo('finished', { dueDate: '2026-09-20', done: true }),
    todo('put away', { dueDate: '2026-09-01', done: true, archivedAt: '2026-09-10T00:00:00Z' }),
  ]

  it('places each task against today', () => {
    expect(list.map((item) => dueState(item, today))).toEqual([
      'overdue',
      'today',
      'upcoming',
      'noDate',
      'overdue',
      'overdue',
    ])
  })

  it('counts open tasks per list, with overdue work also due today', () => {
    expect(viewCounts(list, today)).toEqual({
      all: 4,
      today: 2,
      upcoming: 1,
      overdue: 1,
      completed: 1,
      archived: 1,
    })
  })

  it('groups a finished task as completed however late it was, and keeps archived apart', () => {
    expect(groupTodos(list, today).map((entry) => entry.group)).toEqual([
      'overdue',
      'today',
      'upcoming',
      'noDate',
      'completed',
      'archived',
    ])
  })
})

describe('the archive', () => {
  const archived = todo('old', { done: true, archivedAt: '2026-09-10T00:00:00Z', tags: ['ui'] })

  it('shows an archived task in the archive and in no other list', () => {
    expect(matchesFilters(archived, filters({ view: 'archived' }), today)).toBe(true)
    for (const view of ['all', 'completed', 'overdue'] as const) {
      expect(matchesFilters(archived, filters({ view }), today)).toBe(false)
    }
    expect(tagCounts([archived])).toEqual([{ tag: 'ui', count: 0 }])
  })
})

describe('matchesFilters', () => {
  const item = todo('Release notes', {
    tags: ['docs', 'release'],
    priority: 'high',
    subtasks: [{ id: 's', title: 'Collect PRs', done: false }],
  })

  it('needs every chosen tag and one of the chosen priorities', () => {
    expect(matchesFilters(item, filters({ tags: ['docs'] }), today)).toBe(true)
    expect(matchesFilters(item, filters({ tags: ['docs', 'bug'] }), today)).toBe(false)
    expect(matchesFilters(item, filters({ priorities: ['urgent', 'high'] }), today)).toBe(true)
    expect(matchesFilters(item, filters({ priorities: ['low'] }), today)).toBe(false)
  })

  it('searches the title, notes, tags and subtasks', () => {
    expect(matchesFilters(item, filters({ search: 'collect' }), today)).toBe(true)
    expect(matchesFilters(item, filters({ search: 'changelog' }), today, 'The changelog')).toBe(
      true,
    )
    expect(matchesFilters(item, filters({ search: 'nothing' }), today)).toBe(false)
  })
})

describe('sortTodos', () => {
  const list = [
    todo('b', { dueDate: '2026-10-02', priority: 'low', createdAt: '2026-09-03' }),
    todo('a', { priority: 'urgent', createdAt: '2026-09-02' }),
    todo('c', { dueDate: '2026-10-02', priority: 'urgent', createdAt: '2026-09-01' }),
  ]

  it('puts dated tasks first, and breaks ties on priority', () => {
    expect(sortTodos(list, 'due').map((item) => item.id)).toEqual(['c', 'b', 'a'])
    expect(sortTodos(list, 'priority').map((item) => item.id)).toEqual(['c', 'a', 'b'])
    expect(sortTodos(list, 'created').map((item) => item.id)).toEqual(['b', 'a', 'c'])
    expect(sortTodos(list, 'title').map((item) => item.id)).toEqual(['a', 'b', 'c'])
  })
})

describe('tags', () => {
  it('counts open tasks per tag, most used first', () => {
    const list = [
      todo('1', { tags: ['ui'] }),
      todo('2', { tags: ['ui', 'api'] }),
      todo('3', { tags: ['api'], done: true }),
    ]

    expect(tagCounts(list)).toEqual([
      { tag: 'ui', count: 2 },
      { tag: 'api', count: 1 },
    ])
  })

  it('gives a tag the same colour every time', () => {
    expect(tagColor('design')).toBe(tagColor('design'))
  })
})
