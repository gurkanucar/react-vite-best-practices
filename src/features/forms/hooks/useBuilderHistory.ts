import { useCallback, useReducer } from 'react'
import type { FormSchema } from '@/features/forms/types'

/** How many steps undo remembers; enough for a session, small enough to stay cheap. */
const LIMIT = 100
/** Keystrokes into one input within this window are one step, not one per character. */
const COALESCE_MS = 1000

interface History {
  past: FormSchema[]
  present: FormSchema
  future: FormSchema[]
  lastKey?: string
  lastAt: number
}

type Action =
  | { type: 'change'; update: (form: FormSchema) => FormSchema; key?: string; at: number }
  | { type: 'undo' }
  | { type: 'redo' }
  | { type: 'reset'; form: FormSchema }

function reducer(state: History, action: Action): History {
  switch (action.type) {
    case 'change': {
      const form = action.update(state.present)
      if (form === state.present) return state

      // Typing replaces the present step instead of pushing a new one.
      const coalesce =
        action.key !== undefined &&
        action.key === state.lastKey &&
        action.at - state.lastAt < COALESCE_MS

      return {
        past: coalesce ? state.past : [...state.past, state.present].slice(-LIMIT),
        present: form,
        future: [],
        lastKey: action.key,
        lastAt: action.at,
      }
    }
    case 'undo': {
      const previous = state.past.at(-1)
      if (!previous) return state
      return {
        past: state.past.slice(0, -1),
        present: previous,
        future: [state.present, ...state.future],
        lastAt: 0,
      }
    }
    case 'redo': {
      const [next, ...rest] = state.future
      if (!next) return state
      return { past: [...state.past, state.present], present: next, future: rest, lastAt: 0 }
    }
    case 'reset':
      return { past: [], present: action.form, future: [], lastAt: 0 }
  }
}

/**
 * The builder edits a local copy of the form with undo and redo; the store only sees it on
 * save. A change is a whole new form object, which is what makes each step cheap to keep.
 */
export function useBuilderHistory(initial: () => FormSchema) {
  const [state, dispatch] = useReducer(reducer, undefined, () => ({
    past: [],
    present: initial(),
    future: [],
    lastAt: 0,
  }))

  // The update runs in the reducer against the latest form, so quick edits never lose one.
  const change = useCallback(
    (update: (form: FormSchema) => FormSchema, key?: string) =>
      dispatch({ type: 'change', update, key, at: Date.now() }),
    [],
  )

  return {
    form: state.present,
    change,
    undo: () => dispatch({ type: 'undo' }),
    redo: () => dispatch({ type: 'redo' }),
    reset: (form: FormSchema) => dispatch({ type: 'reset', form }),
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
  }
}
