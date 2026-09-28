import { AutoComplete, Input } from 'antd'
import { useDeferredValue, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { findBrand, fitFor, searchParts } from '@/features/showcases/data/partsCatalog'
import { formatTry } from '@/features/showcases/data/partsCommerce'
import { usePartsCopy } from '@/features/showcases/hooks/usePartsCopy'
import { useActiveVehicle } from '@/features/showcases/hooks/usePartsStore'

const SUGGESTIONS = 6

/**
 * Suggestions as you type, by name or by any part number; Enter searches the catalogue.
 * A suggestion found by number says which number matched, since that is what was typed.
 */
export function PartsSearch({ root, initial = '' }: { root: string; initial?: string }) {
  const { text, language } = usePartsCopy()
  const navigate = useNavigate()
  const vehicle = useActiveVehicle()
  const [query, setQuery] = useState(initial)
  const deferred = useDeferredValue(query)
  // Enter on a highlighted suggestion also reaches the input's own search; the pick wins.
  const pickedAt = useRef(0)

  const options = useMemo(() => {
    const trimmed = deferred.trim()
    if (trimmed.length < 2) return []
    // With a car selected, what fits it comes first and what cannot fit it is left out.
    const rank = { fits: 0, universal: 1, unknown: 1, doesNotFit: 2 }
    const matches = searchParts(trimmed)
      .filter(({ part }) => !vehicle || fitFor(part, vehicle) !== 'doesNotFit')
      .sort(
        (a, b) =>
          rank[fitFor(a.part, vehicle)] - rank[fitFor(b.part, vehicle)] ||
          b.part.sold - a.part.sold,
      )
    const parts = matches.slice(0, SUGGESTIONS).map(({ part, code }) => ({
      value: `part:${part.id}`,
      label: (
        <div className="parts-suggestion">
          <span className="parts-suggestion__name">{part.name[language]}</span>
          <span className="parts-suggestion__meta">
            {findBrand(part.brandId)?.name} ·{' '}
            <span className="parts-mono">{code ? text.search.codeMatch(code) : part.sku}</span>
          </span>
          <span className="parts-suggestion__price">{formatTry(part.price, language)}</span>
        </div>
      ),
    }))
    return matches.length > SUGGESTIONS
      ? [...parts, { value: `all:${trimmed}`, label: text.search.seeAll(trimmed) }]
      : parts
  }, [deferred, language, text, vehicle])

  const searchCatalog = (value: string) => {
    const trimmed = value.trim()
    void navigate(trimmed ? `${root}/catalog?q=${encodeURIComponent(trimmed)}` : `${root}/catalog`)
  }

  return (
    <AutoComplete
      className="parts-search"
      value={query}
      options={options}
      onChange={(value: string) => {
        // Picking a suggestion hands over its value; keep the typed words in the box.
        if (!value.startsWith('part:') && !value.startsWith('all:')) setQuery(value)
      }}
      onSelect={(value: string) => {
        pickedAt.current = Date.now()
        if (value.startsWith('part:')) {
          setQuery('')
          void navigate(`${root}/products/${value.slice(5)}`)
        } else searchCatalog(value.slice(4))
      }}
      popupMatchSelectWidth
      defaultActiveFirstOption={false}
    >
      <Input.Search
        size="large"
        allowClear
        aria-label={text.search.label}
        placeholder={text.search.placeholder}
        enterButton={text.search.button}
        onSearch={(value, _event, info) => {
          if (info?.source === 'clear') return
          window.setTimeout(() => {
            if (Date.now() - pickedAt.current > 100) searchCatalog(value)
          }, 0)
        }}
      />
    </AutoComplete>
  )
}
