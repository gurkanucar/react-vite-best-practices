import { CheckOutlined } from '@ant-design/icons'
import { Button, Checkbox, Divider, Flex, Radio, Slider, Typography } from 'antd'
import { useState } from 'react'
import {
  STORE_CATEGORIES,
  STORE_COLOURS,
  storeProducts,
  type StoreCategory,
} from '@/features/showcases/data/store'
import { formatPrice } from '@/features/showcases/data/storeCart'
import {
  activeFilterCount,
  priceCeiling,
  RATING_OPTIONS,
  sizeOptions,
  type StoreFilters,
} from '@/features/showcases/data/storeFilters'
import { useStoreCopy } from '@/features/showcases/hooks/useStoreCopy'

interface StoreFilterPanelProps {
  filters: StoreFilters
  onChange: (next: Partial<StoreFilters>) => void
  onClear: () => void
  /** Left out in the drawer, whose own title already says "Filters". */
  showTitle?: boolean
}

const ceiling = priceCeiling(storeProducts)

const toggle = (values: string[], value: string) =>
  values.includes(value) ? values.filter((entry) => entry !== value) : [...values, value]

export function StoreFilterPanel({
  filters,
  onChange,
  onClear,
  showTitle = true,
}: StoreFilterPanelProps) {
  const { text, language } = useStoreCopy()
  const sizes = sizeOptions(storeProducts, filters.category)
  const committed: [number, number] = [filters.min ?? 0, filters.max ?? ceiling]
  // The slider moves freely while dragged and writes to the address bar once it is let go.
  const [dragging, setDragging] = useState<[number, number] | null>(null)
  const range = dragging ?? committed
  const countIn = (category: StoreCategory) =>
    storeProducts.filter((product) => product.category === category).length

  return (
    <div className="store-filters">
      <Flex justify={showTitle ? 'space-between' : 'end'} align="center">
        {showTitle && (
          <Typography.Title level={5} className="store-filters__title">
            {text.filters}
          </Typography.Title>
        )}
        {activeFilterCount(filters) > 0 && (
          <Button type="link" size="small" onClick={onClear}>
            {text.clearFilters}
          </Button>
        )}
      </Flex>

      <fieldset>
        <legend>{text.filterCategory}</legend>
        <Radio.Group
          value={filters.category ?? 'all'}
          onChange={(event) =>
            onChange({
              category: event.target.value === 'all' ? null : event.target.value,
              // A size from another category would hide everything.
              sizes: [],
            })
          }
          className="store-filters__list"
        >
          <Radio value="all">
            {text.allProducts} <span className="store-filters__count">{storeProducts.length}</span>
          </Radio>
          {STORE_CATEGORIES.map((category) => (
            <Radio key={category} value={category}>
              {text.categories[category]}{' '}
              <span className="store-filters__count">{countIn(category)}</span>
            </Radio>
          ))}
        </Radio.Group>
      </fieldset>

      <Divider />

      <fieldset>
        <legend>{text.filterPrice}</legend>
        <Slider
          range
          min={0}
          max={ceiling}
          step={50}
          value={range}
          ariaLabelForHandle={[text.minPrice, text.maxPrice]}
          tooltip={{ formatter: (value) => formatPrice(value ?? 0, language) }}
          onChange={(value) => setDragging(value as [number, number])}
          onChangeComplete={(value) => {
            const [min, max] = value as [number, number]
            setDragging(null)
            onChange({ min: min > 0 ? min : null, max: max < ceiling ? max : null })
          }}
        />
        <Typography.Text type="secondary">
          {text.priceRange(formatPrice(range[0], language), formatPrice(range[1], language))}
        </Typography.Text>
      </fieldset>

      <Divider />

      <fieldset>
        <legend>{text.filterColour}</legend>
        <Flex gap={8} wrap className="store-swatches">
          {STORE_COLOURS.map((colour) => {
            const selected = filters.colours.includes(colour.id)
            return (
              <button
                key={colour.id}
                type="button"
                className="store-swatch"
                aria-pressed={selected}
                aria-label={colour.name[language]}
                title={colour.name[language]}
                style={{ background: colour.hex }}
                onClick={() => onChange({ colours: toggle(filters.colours, colour.id) })}
              >
                {selected && <CheckOutlined aria-hidden="true" />}
              </button>
            )
          })}
        </Flex>
      </fieldset>

      {sizes.length > 0 && (
        <>
          <Divider />
          <fieldset>
            <legend>{text.filterSize}</legend>
            <Flex gap={8} wrap>
              {sizes.map((size) => {
                const selected = filters.sizes.includes(size)
                return (
                  <Button
                    key={size}
                    size="small"
                    type={selected ? 'primary' : 'default'}
                    aria-pressed={selected}
                    onClick={() => onChange({ sizes: toggle(filters.sizes, size) })}
                  >
                    {size}
                  </Button>
                )
              })}
            </Flex>
          </fieldset>
        </>
      )}

      <Divider />

      <fieldset>
        <legend>{text.filterAvailability}</legend>
        <Flex vertical gap={6}>
          <Checkbox
            checked={filters.inStock}
            onChange={(event) => onChange({ inStock: event.target.checked })}
          >
            {text.inStockOnly}
          </Checkbox>
          <Checkbox
            checked={filters.onSale}
            onChange={(event) => onChange({ onSale: event.target.checked })}
          >
            {text.onSaleOnly}
          </Checkbox>
        </Flex>
      </fieldset>

      <Divider />

      <fieldset>
        <legend>{text.filterRating}</legend>
        <Radio.Group
          value={filters.rating ?? 0}
          onChange={(event) => onChange({ rating: event.target.value || null })}
          className="store-filters__list"
        >
          <Radio value={0}>{text.anyRating}</Radio>
          {RATING_OPTIONS.map((value) => (
            <Radio key={value} value={value}>
              ★ {text.ratingAtLeast(value)}
            </Radio>
          ))}
        </Radio.Group>
      </fieldset>
    </div>
  )
}
