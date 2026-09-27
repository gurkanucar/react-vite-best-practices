import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { createSeedTodos } from '@/features/todos/data'
import type { Todo } from '@/features/todos/types'
import { usePreferencesStore } from '@/store/preferences-store'

export type TodoInput = Omit<Todo, 'id' | 'createdAt' | 'completedAt' | 'archivedAt' | 'done'> & {
  done?: boolean
}

interface TodoStore {
  todos: Todo[]
  add: (input: TodoInput) => Todo
  update: (id: string, changes: Partial<Omit<Todo, 'id'>>) => void
  toggle: (id: string) => void
  toggleSubtask: (id: string, subtaskId: string) => void
  duplicate: (id: string) => void
  remove: (id: string) => void
  /** Puts back a removed task where it was, for the undo after a delete. */
  restore: (todo: Todo, index: number) => void
  /** Puts tasks away without losing them; `unarchive` brings them back. */
  archive: (ids: string[]) => void
  unarchive: (ids: string[]) => void
  /** Archives every completed task and returns which, so the toast can undo exactly those. */
  archiveCompleted: () => string[]
  /** The one bulk delete: only what was archived first can be thrown away in one go. */
  emptyArchive: () => void
  reset: () => void
}

export const todoStorageKey = 'rvbp-todos'

let sequence = 0
const newId = (prefix = 'todo') => `${prefix}-${Date.now().toString(36)}-${(sequence += 1)}`

/** Completing a task stamps when; opening it again clears the stamp. */
function withDone(todo: Todo, done: boolean): Todo {
  return { ...todo, done, completedAt: done ? new Date().toISOString() : undefined }
}

const seed = () => createSeedTodos(usePreferencesStore.getState().language)

/**
 * The task list has no API behind it, so it lives in the browser: a store persisted to local
 * storage, which keeps a reader's tasks across reloads the way a real to-do app would.
 */
export const useTodoStore = create<TodoStore>()(
  persist(
    (set, get) => ({
      todos: seed(),
      add: (input) => {
        const todo: Todo = {
          ...input,
          id: newId(),
          done: input.done ?? false,
          createdAt: new Date().toISOString(),
          completedAt: input.done ? new Date().toISOString() : undefined,
        }
        set({ todos: [todo, ...get().todos] })
        return todo
      },
      update: (id, changes) =>
        set({
          todos: get().todos.map((todo) => {
            if (todo.id !== id) return todo
            const next = { ...todo, ...changes }
            return changes.done === undefined || changes.done === todo.done
              ? next
              : withDone(next, changes.done)
          }),
        }),
      toggle: (id) =>
        set({
          todos: get().todos.map((todo) => (todo.id === id ? withDone(todo, !todo.done) : todo)),
        }),
      toggleSubtask: (id, subtaskId) =>
        set({
          todos: get().todos.map((todo) =>
            todo.id === id
              ? {
                  ...todo,
                  subtasks: todo.subtasks.map((item) =>
                    item.id === subtaskId ? { ...item, done: !item.done } : item,
                  ),
                }
              : todo,
          ),
        }),
      duplicate: (id) => {
        const todos = get().todos
        const index = todos.findIndex((todo) => todo.id === id)
        if (index < 0) return
        const copy: Todo = {
          ...withDone(todos[index], false),
          archivedAt: undefined,
          id: newId(),
          createdAt: new Date().toISOString(),
          subtasks: todos[index].subtasks.map((item) => ({ ...item, id: newId('sub') })),
        }
        set({ todos: [...todos.slice(0, index + 1), copy, ...todos.slice(index + 1)] })
      },
      remove: (id) => set({ todos: get().todos.filter((todo) => todo.id !== id) }),
      restore: (todo, index) => {
        const todos = get().todos.filter((item) => item.id !== todo.id)
        set({ todos: [...todos.slice(0, index), todo, ...todos.slice(index)] })
      },
      archive: (ids) => {
        const archivedAt = new Date().toISOString()
        set({
          todos: get().todos.map((todo) =>
            ids.includes(todo.id) && !todo.archivedAt ? { ...todo, archivedAt } : todo,
          ),
        })
      },
      unarchive: (ids) =>
        set({
          todos: get().todos.map((todo) =>
            ids.includes(todo.id) ? { ...todo, archivedAt: undefined } : todo,
          ),
        }),
      archiveCompleted: () => {
        const ids = get()
          .todos.filter((todo) => todo.done && !todo.archivedAt)
          .map((todo) => todo.id)
        get().archive(ids)
        return ids
      },
      emptyArchive: () => set({ todos: get().todos.filter((todo) => !todo.archivedAt) }),
      reset: () => set({ todos: seed() }),
    }),
    {
      name: todoStorageKey,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ todos }) => ({ todos }),
    },
  ),
)

export const newSubtaskId = () => newId('sub')
