import { SearchOutlined } from '@ant-design/icons'
import { AutoComplete, Input, Typography } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { matchesQuery, useSearchEntries } from '@/components/GlobalSearch/useSearchEntries'
import { useMessages } from '@/i18n/messages'
import { usePreferencesStore } from '@/store/preferences-store'
import './GlobalSearch.css'

const isMac = () => navigator.platform.toUpperCase().includes('MAC')

export function GlobalSearch() {
  const messages = useMessages()
  const language = usePreferencesStore((state) => state.language)
  const entries = useSearchEntries()
  // Ant Design clones the child it is given, and reading a ref off that clone is
  // removed in React 19, so the input is reached through the wrapper instead.
  const containerRef = useRef<HTMLDivElement>(null)
  const focusInput = () => containerRef.current?.querySelector('input')?.focus()
  const [query, setQuery] = useState('')

  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== 'k' || !(event.metaKey || event.ctrlKey)) return

      event.preventDefault()
      focusInput()
    }

    window.addEventListener('keydown', focusSearch)

    return () => window.removeEventListener('keydown', focusSearch)
  }, [])

  const matches = entries.filter((entry) => matchesQuery(entry, query, language))
  const groups = [...new Set(matches.map((entry) => entry.group))]

  const options = groups.map((group) => ({
    label: group,
    options: matches
      .filter((entry) => entry.group === group)
      .map((entry) => ({
        value: entry.key,
        label: (
          <span className="global-search__option">
            {entry.icon}
            {entry.label}
          </span>
        ),
      })),
  }))

  const run = (key: string) => {
    setQuery('')
    containerRef.current?.querySelector('input')?.blur()
    entries.find((entry) => entry.key === key)?.perform()
  }

  return (
    <div className="global-search" ref={containerRef}>
      <AutoComplete
        className="global-search__field"
        options={options}
        popupMatchSelectWidth={320}
        value={query}
        onChange={setQuery}
        onSelect={run}
      >
        <Input
          allowClear
          aria-label={messages.shell.searchLabel}
          placeholder={messages.shell.searchPlaceholder}
          prefix={<SearchOutlined aria-hidden="true" />}
          suffix={
            <Typography.Text className="global-search__shortcut" aria-hidden="true">
              {isMac() ? '⌘K' : 'Ctrl K'}
            </Typography.Text>
          }
        />
      </AutoComplete>
    </div>
  )
}
