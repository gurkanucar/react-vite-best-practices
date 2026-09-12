# 026 — Global Search

The header carries a search field that jumps to any page in the application. It is built as a
list of entries and a way to run one, so it can grow past pages without being rewritten.

## One definition of where the application can go

The sidebar menu and the search read the same `useNavigationSections()`. A new route added in
one place cannot go missing from the other, which is the failure this extraction prevents —
previously the menu owned the list and nothing else could see it.

## Entries, not an index

```ts
export interface SearchEntry {
  key: string
  label: string
  group: string
  icon?: ReactNode
  keywords?: string[]
  perform: () => void
}
```

`perform` is a callback rather than a route, so the same field can later run an action —
open a setting, start an export, jump to a record — without the component learning about it.
Adding a source is one more array concatenated in `useSearchEntries()`.

## Matching is locale-aware

```ts
const normalize = (value: string) => value.toLocaleLowerCase(locale)
```

`toLowerCase()` maps "I" to "i", which never matches the Turkish "ı" a reader would type.
Passing the active language fixes it, and a test pins the behaviour.

## Two details the browser forced

The layout header sets `line-height: 64px`. The select's inner element inherits it, turns it
into a 64px line box, and the field stretches to the height of the whole bar. Resetting
`line-height` on the container keeps it the same height as the buttons beside it.

Ant Design clones the child element it is given, and reading `ref` off that clone was removed
in React 19 — it logs an error. The input is reached through the wrapper instead:

```ts
const focusInput = () => containerRef.current?.querySelector('input')?.focus()
```

That also powers the `⌘K` / `Ctrl K` shortcut.

## Not on small screens

The header has no room for it next to the language and theme controls, so it is hidden below
720px — the same breakpoint that already hides the profile avatar.
