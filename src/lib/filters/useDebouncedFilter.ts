import { debounce } from 'lodash-es'
import { useEffect, useMemo, useState } from 'react'

/** One delay for every live-typing filter in the application. */
export const FILTER_DEBOUNCE_MS = 400

interface Draft<T> {
  /** What the control shows right now. */
  value: T
  /** The committed value this draft was started from. */
  from: T
}

/**
 * A filter control bound straight to the URL fires a request per keystroke: typing
 * "500" would ask the server for 5, then 50, then 500, and the first two answers are
 * thrown away. This keeps the typed value local so the control stays responsive, and
 * delays only the commit that changes the URL and triggers the request.
 *
 * The committed value is tracked too, so the control still follows the back button and
 * "Clear filters", which change the URL from outside the control.
 */
export function useDebouncedFilter<T>(
  committedValue: T,
  commit: (value: T) => void,
  delay: number = FILTER_DEBOUNCE_MS,
) {
  const [draft, setDraft] = useState<Draft<T>>({ value: committedValue, from: committedValue })

  // The commit function is passed through the call rather than captured, because
  // callers pass a fresh closure on every render and lodash forwards the arguments of
  // the last call to the trailing invocation.
  const debouncedCommit = useMemo(
    () => debounce((next: T, run: (value: T) => void) => run(next), delay),
    [delay],
  )

  useEffect(() => () => debouncedCommit.cancel(), [debouncedCommit])

  // Derived during render: when the URL moves on its own the draft follows it.
  const outOfDate = draft.from !== committedValue
  if (outOfDate) {
    setDraft({ value: committedValue, from: committedValue })
  }

  return {
    value: outOfDate ? committedValue : draft.value,
    change: (next: T) => {
      setDraft({ value: next, from: committedValue })
      debouncedCommit(next, commit)
    },
    commitNow: (next: T) => {
      debouncedCommit.cancel()
      setDraft({ value: next, from: committedValue })
      commit(next)
    },
  }
}
