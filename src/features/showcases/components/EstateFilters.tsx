import { DownOutlined, SearchOutlined } from '@ant-design/icons'
import {
  Button,
  Checkbox,
  Flex,
  Input,
  InputNumber,
  Popover,
  Segmented,
  Select,
  Space,
  Switch,
  Tag,
  Typography,
} from 'antd'
import type { ReactNode } from 'react'
import {
  CITIES,
  formatCompactPrice,
  neighbourhoods,
  PROPERTY_TYPES,
  type City,
  type Deal,
} from '@/features/showcases/data/estate'
import {
  AGE_OPTIONS,
  AMENITY_FILTERS,
  FLOOR_OPTIONS,
  ROOM_OPTIONS,
  type EstateFilters,
  type FloorOption,
} from '@/features/showcases/data/estateSearch'
import { useEstateText } from '@/features/showcases/hooks/useEstateText'

type Patch = Partial<EstateFilters>

interface FilterProps {
  filters: EstateFilters
  onChange: (patch: Patch) => void
}

const digits = (value: string | undefined) => Number((value ?? '').replace(/\D/g, '')) || 0

function MoneyInput({
  value,
  onChange,
  placeholder,
  label,
}: {
  value?: number
  onChange: (value: number | undefined) => void
  placeholder: string
  label: string
}) {
  const { language } = useEstateText()
  return (
    <InputNumber<number>
      className="full-width"
      min={0}
      step={1000}
      prefix="₺"
      value={value}
      placeholder={placeholder}
      aria-label={label}
      controls={false}
      formatter={(entry) =>
        entry === undefined || entry === null || `${entry}` === ''
          ? ''
          : new Intl.NumberFormat(language === 'tr' ? 'tr-TR' : 'en-GB').format(Number(entry))
      }
      parser={digits}
      onChange={(entry) => onChange(entry === null ? undefined : entry)}
    />
  )
}

function RangeFields({
  min,
  max,
  onChange,
  money,
  label,
}: {
  min?: number
  max?: number
  onChange: (min: number | undefined, max: number | undefined) => void
  money?: boolean
  label: string
}) {
  const { text } = useEstateText()
  if (money) {
    return (
      <Flex gap={8}>
        <MoneyInput
          value={min}
          placeholder={text.filters.min}
          label={`${label}: ${text.filters.min}`}
          onChange={(value) => onChange(value, max)}
        />
        <MoneyInput
          value={max}
          placeholder={text.filters.max}
          label={`${label}: ${text.filters.max}`}
          onChange={(value) => onChange(min, value)}
        />
      </Flex>
    )
  }
  return (
    <Flex gap={8}>
      <InputNumber<number>
        className="full-width"
        min={0}
        value={min}
        placeholder={text.filters.min}
        aria-label={`${label}: ${text.filters.min}`}
        onChange={(value) => onChange(value ?? undefined, max)}
      />
      <InputNumber<number>
        className="full-width"
        min={0}
        value={max}
        placeholder={text.filters.max}
        aria-label={`${label}: ${text.filters.max}`}
        onChange={(value) => onChange(min, value ?? undefined)}
      />
    </Flex>
  )
}

function RoomTags({ filters, onChange }: FilterProps) {
  const { text } = useEstateText()
  return (
    <fieldset className="estate-room-tags">
      <legend className="estate-sr-only">{text.filters.rooms}</legend>
      {ROOM_OPTIONS.map((option) => {
        const checked = filters.rooms.includes(option)
        return (
          <Tag.CheckableTag
            key={option}
            checked={checked}
            className="estate-room-tag"
            onChange={(next) =>
              onChange({
                rooms: next
                  ? [...filters.rooms, option]
                  : filters.rooms.filter((entry) => entry !== option),
              })
            }
          >
            {option}
          </Tag.CheckableTag>
        )
      })}
    </fieldset>
  )
}

export function DealSwitch({ value, onChange }: { value: Deal; onChange: (deal: Deal) => void }) {
  const { text } = useEstateText()
  return (
    <Segmented<Deal>
      value={value}
      onChange={onChange}
      options={[
        { value: 'sale', label: text.deals.sale },
        { value: 'rent', label: text.deals.rent },
      ]}
    />
  )
}

/** Every filter, top to bottom: the drawer on a phone and "More filters" on a wide screen. */
export function EstateFilterPanel({ filters, onChange }: FilterProps) {
  const { text } = useEstateText()
  const hoods = neighbourhoods.filter((hood) => !filters.city || hood.city === filters.city)

  const field = (label: string, control: ReactNode, id?: string) => (
    <div className="estate-filter-field">
      {id ? (
        <label htmlFor={id} className="estate-filter-field__label">
          {label}
        </label>
      ) : (
        <Typography.Text strong className="estate-filter-field__label">
          {label}
        </Typography.Text>
      )}
      {control}
    </div>
  )

  return (
    <div className="estate-filter-panel">
      {field(
        text.search.location,
        <Input
          id="estate-filter-q"
          allowClear
          prefix={<SearchOutlined aria-hidden="true" />}
          placeholder={text.search.locationPlaceholder}
          value={filters.q}
          onChange={(event) => onChange({ q: event.target.value })}
        />,
        'estate-filter-q',
      )}
      {field(
        text.filters.city,
        <Select<City | ''>
          id="estate-filter-city"
          className="full-width"
          value={filters.city ?? ''}
          onChange={(city) => onChange({ city: city || undefined, hood: undefined })}
          options={[
            { value: '', label: text.filters.anyCity },
            ...CITIES.map((city) => ({ value: city, label: text.cities[city] })),
          ]}
        />,
        'estate-filter-city',
      )}
      {field(
        text.filters.neighbourhood,
        <Select
          id="estate-filter-hood"
          className="full-width"
          allowClear
          showSearch={{ optionFilterProp: 'label' }}
          placeholder={text.filters.anyHood}
          value={filters.hood}
          onChange={(hood) => onChange({ hood: hood || undefined })}
          options={hoods.map((hood) => ({
            value: hood.id,
            label: `${hood.name}, ${hood.district}`,
          }))}
        />,
        'estate-filter-hood',
      )}
      {field(
        text.filters.type,
        <Checkbox.Group
          className="estate-filter-checks"
          value={filters.types}
          onChange={(types) => onChange({ types })}
          options={PROPERTY_TYPES.map((type) => ({ value: type, label: text.types[type] }))}
        />,
      )}
      {field(text.filters.rooms, <RoomTags filters={filters} onChange={onChange} />)}
      {field(
        text.filters.price,
        <RangeFields
          money
          label={text.filters.price}
          min={filters.minPrice}
          max={filters.maxPrice}
          onChange={(minPrice, maxPrice) => onChange({ minPrice, maxPrice })}
        />,
      )}
      {field(
        text.filters.area,
        <RangeFields
          label={text.filters.area}
          min={filters.minArea}
          max={filters.maxArea}
          onChange={(minArea, maxArea) => onChange({ minArea, maxArea })}
        />,
      )}
      {field(
        text.filters.floor,
        <Select<FloorOption | ''>
          id="estate-filter-floor"
          className="full-width"
          value={filters.floor ?? ''}
          onChange={(floor) => onChange({ floor: floor || undefined })}
          options={[
            { value: '', label: text.filters.anyFloor },
            ...FLOOR_OPTIONS.map((floor) => ({ value: floor, label: text.filters.floors[floor] })),
          ]}
        />,
        'estate-filter-floor',
      )}
      {field(
        text.filters.age,
        <Select
          id="estate-filter-age"
          className="full-width"
          value={filters.maxAge ?? -1}
          onChange={(maxAge) => onChange({ maxAge: maxAge < 0 ? undefined : maxAge })}
          options={[
            { value: -1, label: text.filters.anyAge },
            ...AGE_OPTIONS.map((age) => ({ value: age, label: text.filters.ages(age) })),
          ]}
        />,
        'estate-filter-age',
      )}
      {field(
        text.filters.dues,
        <MoneyInput
          value={filters.maxDues}
          placeholder={text.search.anyPrice}
          label={text.filters.dues}
          onChange={(maxDues) => onChange({ maxDues })}
        />,
      )}
      {field(
        text.filters.amenities,
        <Checkbox.Group
          className="estate-filter-checks"
          value={filters.amenities}
          onChange={(amenities) => onChange({ amenities })}
          options={AMENITY_FILTERS.map((amenity) => ({
            value: amenity,
            label: text.filters.amenity[amenity],
          }))}
        />,
      )}
      <label className="estate-filter-switch">
        <Switch size="small" checked={filters.saved} onChange={(saved) => onChange({ saved })} />
        <span>{text.filters.saved}</span>
      </label>
    </div>
  )
}

interface QuickFiltersProps extends FilterProps {
  activeCount: number
  onMore: () => void
}

/** The filters people change most, in one row above the results on a wide screen. */
export function EstateQuickFilters({ filters, onChange, activeCount, onMore }: QuickFiltersProps) {
  const { text, language } = useEstateText()
  const priceLabel =
    filters.minPrice !== undefined || filters.maxPrice !== undefined
      ? `${filters.minPrice !== undefined ? formatCompactPrice(filters.minPrice, language) : '₺0'} – ${
          filters.maxPrice !== undefined ? formatCompactPrice(filters.maxPrice, language) : '∞'
        }`
      : text.filters.price

  return (
    <Flex gap={8} wrap align="center" className="estate-quick-filters">
      <DealSwitch
        value={filters.deal}
        onChange={(deal) => onChange({ deal, minPrice: undefined, maxPrice: undefined })}
      />
      <Input
        allowClear
        className="estate-quick-filters__search"
        prefix={<SearchOutlined aria-hidden="true" />}
        placeholder={text.search.locationPlaceholder}
        aria-label={text.search.location}
        value={filters.q}
        onChange={(event) => onChange({ q: event.target.value })}
      />
      <Select<City | ''>
        className="estate-quick-filters__city"
        aria-label={text.filters.city}
        value={filters.city ?? ''}
        onChange={(city) => onChange({ city: city || undefined, hood: undefined })}
        options={[
          { value: '', label: text.filters.anyCity },
          ...CITIES.map((city) => ({ value: city, label: text.cities[city] })),
        ]}
      />
      <Select
        mode="multiple"
        allowClear
        maxTagCount="responsive"
        className="estate-quick-filters__type"
        aria-label={text.filters.type}
        placeholder={text.search.anyType}
        value={filters.types}
        onChange={(types) => onChange({ types })}
        options={PROPERTY_TYPES.map((type) => ({ value: type, label: text.types[type] }))}
      />
      <Popover
        trigger="click"
        placement="bottomLeft"
        content={
          <div className="estate-popover">
            <RoomTags filters={filters} onChange={onChange} />
          </div>
        }
      >
        <Button className={filters.rooms.length ? 'is-set' : undefined}>
          {filters.rooms.length ? filters.rooms.join(', ') : text.filters.rooms}{' '}
          <DownOutlined aria-hidden="true" />
        </Button>
      </Popover>
      <Popover
        trigger="click"
        placement="bottomLeft"
        content={
          <div className="estate-popover">
            <RangeFields
              money
              label={text.filters.price}
              min={filters.minPrice}
              max={filters.maxPrice}
              onChange={(minPrice, maxPrice) => onChange({ minPrice, maxPrice })}
            />
          </div>
        }
      >
        <Button
          className={
            filters.minPrice !== undefined || filters.maxPrice !== undefined ? 'is-set' : undefined
          }
        >
          {priceLabel} <DownOutlined aria-hidden="true" />
        </Button>
      </Popover>
      <Space size={8}>
        <Button onClick={onMore}>
          {text.filters.moreFilters}
          {activeCount > 0 && <span className="estate-count-badge">{activeCount}</span>}
        </Button>
      </Space>
    </Flex>
  )
}
