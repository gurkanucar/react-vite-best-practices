import { MinusOutlined, PlusOutlined, SearchOutlined, TeamOutlined } from '@ant-design/icons'
import { Button, DatePicker, Flex, Popover, Typography } from 'antd'
import dayjs, { type Dayjs } from 'dayjs'
import { useState } from 'react'
import {
  DATE_FORMAT,
  GUEST_LIMITS,
  MAX_NIGHTS,
  type StaySearch,
} from '@/features/showcases/data/hotelBooking'
import { useHotelText } from '@/features/showcases/data/hotelCopy'

type GuestKey = keyof typeof GUEST_LIMITS

interface HotelSearchBarProps {
  value: StaySearch
  onSearch: (stay: StaySearch) => void
  /** `stacked` puts every control on its own row, for a narrow card. */
  layout?: 'bar' | 'stacked'
  submitLabel?: string
}

/**
 * Dates and guests, and nothing is applied until the button is pressed. Give it a `key` from
 * the stay it shows, so a new search resets what was being edited.
 */
export function HotelSearchBar({
  value,
  onSearch,
  layout = 'bar',
  submitLabel,
}: HotelSearchBarProps) {
  const { text } = useHotelText()
  const [range, setRange] = useState<[Dayjs, Dayjs] | null>([
    dayjs(value.checkIn),
    dayjs(value.checkOut),
  ])
  const [guests, setGuests] = useState({
    adults: value.adults,
    children: value.children,
    rooms: value.rooms,
  })
  const [guestsOpen, setGuestsOpen] = useState(false)
  const [error, setError] = useState<string>()

  const change = (key: GuestKey, step: number) =>
    setGuests((current) => {
      const next = current[key] + step
      const { min, max } = GUEST_LIMITS[key]
      return next < min || next > max ? current : { ...current, [key]: next }
    })

  const submit = () => {
    if (!range) {
      setError(text.search.datesRequired)
      return
    }
    setError(undefined)
    onSearch({
      checkIn: range[0].format(DATE_FORMAT),
      checkOut: range[1].format(DATE_FORMAT),
      ...guests,
    })
  }

  const rows: { key: GuestKey; label: string; hint?: string }[] = [
    { key: 'adults', label: text.search.adults, hint: text.search.adultsHint },
    { key: 'children', label: text.search.children, hint: text.search.childrenHint },
    { key: 'rooms', label: text.search.rooms },
  ]

  const guestPanel = (
    <div className="hotel-guests">
      {rows.map((row) => (
        <Flex key={row.key} align="center" justify="space-between" gap={24}>
          <div>
            <Typography.Text strong>{row.label}</Typography.Text>
            {row.hint && (
              <Typography.Text type="secondary" className="hotel-guests__hint">
                {row.hint}
              </Typography.Text>
            )}
          </div>
          <Flex align="center" gap={10}>
            <Button
              shape="circle"
              icon={<MinusOutlined aria-hidden="true" />}
              aria-label={text.search.decrease(row.label)}
              disabled={guests[row.key] <= GUEST_LIMITS[row.key].min}
              onClick={() => change(row.key, -1)}
            />
            <output className="hotel-guests__count" aria-live="polite">
              {guests[row.key]}
            </output>
            <Button
              shape="circle"
              icon={<PlusOutlined aria-hidden="true" />}
              aria-label={text.search.increase(row.label)}
              disabled={guests[row.key] >= GUEST_LIMITS[row.key].max}
              onClick={() => change(row.key, 1)}
            />
          </Flex>
        </Flex>
      ))}
      <Flex justify="end">
        <Button type="primary" onClick={() => setGuestsOpen(false)}>
          {text.search.done}
        </Button>
      </Flex>
    </div>
  )

  return (
    <div className={`hotel-search hotel-search--${layout}`}>
      <label className="hotel-search__field hotel-search__field--dates">
        <span className="hotel-search__label">{text.search.dates}</span>
        <DatePicker.RangePicker
          value={range}
          onChange={(dates) => {
            setRange(dates?.[0] && dates[1] ? [dates[0], dates[1]] : null)
            if (dates) setError(undefined)
          }}
          format="D MMM YYYY"
          placeholder={[text.search.checkIn, text.search.checkOut]}
          size="large"
          variant="borderless"
          status={error ? 'error' : undefined}
          disabledDate={(current, info) => {
            if (current.isBefore(dayjs(), 'day')) return true
            const from = info.from
            return from ? Math.abs(current.diff(from, 'day')) > MAX_NIGHTS : false
          }}
          classNames={{ popup: { root: 'hotel-range-popup' } }}
          className="full-width"
        />
      </label>

      <div className="hotel-search__field">
        <span className="hotel-search__label">{text.search.guests}</span>
        <Popover
          content={guestPanel}
          trigger="click"
          open={guestsOpen}
          onOpenChange={setGuestsOpen}
          placement="bottom"
        >
          <Button
            size="large"
            type="text"
            className="hotel-search__guests"
            icon={<TeamOutlined aria-hidden="true" />}
            aria-label={`${text.search.guests}: ${text.search.summary(guests.adults + guests.children, guests.rooms)}`}
          >
            {text.search.summary(guests.adults + guests.children, guests.rooms)}
          </Button>
        </Popover>
      </div>

      <Button
        type={layout === 'bar' ? 'primary' : 'default'}
        size="large"
        icon={<SearchOutlined aria-hidden="true" />}
        onClick={submit}
        className="hotel-search__submit"
      >
        {submitLabel ?? text.search.submit}
      </Button>

      {error && (
        <Typography.Text type="danger" className="hotel-search__error" role="alert">
          {error}
        </Typography.Text>
      )}
    </div>
  )
}
