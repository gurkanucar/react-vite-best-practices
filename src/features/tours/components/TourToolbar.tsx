import { FilterOutlined } from '@ant-design/icons'
import { Badge, Button, Checkbox, Drawer, Flex, Input, Select, Slider, Typography } from 'antd'
import { useState } from 'react'
import { tourCountries } from '@/features/tours/data'
import { SORT_KEYS, type TourFilters } from '@/features/tours/types'
import { useMessages } from '@/i18n/messages'

interface TourToolbarProps {
  filters: TourFilters
  onChange: (patch: Partial<TourFilters>) => void
  onReset: () => void
}

export function TourToolbar({ filters, onChange, onReset }: TourToolbarProps) {
  const messages = useMessages()
  const [open, setOpen] = useState(false)
  /** Only the two panel filters count towards the badge; search and sort are on screen. */
  const activeCount = (filters.countries.length > 0 ? 1 : 0) + (filters.minRating > 0 ? 1 : 0)

  return (
    <>
      <Flex align="center" justify="space-between" gap={12} wrap className="tour-toolbar">
        <Input.Search
          allowClear
          value={filters.search}
          placeholder={messages.tours.searchPlaceholder}
          onChange={(event) => onChange({ search: event.target.value })}
          style={{ maxWidth: 320 }}
        />

        <Flex align="center" gap={12} wrap>
          <Badge count={activeCount} size="small">
            <Button icon={<FilterOutlined aria-hidden="true" />} onClick={() => setOpen(true)}>
              {messages.tours.filters}
            </Button>
          </Badge>

          <Flex align="center" gap={8}>
            <Typography.Text type="secondary">{messages.tours.sortBy}</Typography.Text>
            <Select
              aria-label={messages.tours.sortBy}
              value={filters.sort}
              onChange={(sort) => onChange({ sort })}
              style={{ width: 168 }}
              options={SORT_KEYS.map((key) => ({ value: key, label: messages.tours.sorts[key] }))}
            />
          </Flex>
        </Flex>
      </Flex>

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title={messages.tours.filters}
        extra={<Button onClick={onReset}>{messages.tours.clearFilters}</Button>}
      >
        <Typography.Title level={5}>{messages.tours.country}</Typography.Title>
        <Checkbox.Group
          value={filters.countries}
          onChange={(countries) => onChange({ countries: countries as string[] })}
          options={tourCountries.map((id) => ({
            value: id,
            label: messages.tours.countries[id as keyof typeof messages.tours.countries],
          }))}
          className="tour-filter-group"
        />

        <Typography.Title level={5}>{messages.tours.minRating}</Typography.Title>
        <Slider
          min={0}
          max={5}
          step={0.5}
          value={filters.minRating}
          onChange={(minRating) => onChange({ minRating })}
          marks={{ 0: '0', 5: '5' }}
        />
      </Drawer>
    </>
  )
}
