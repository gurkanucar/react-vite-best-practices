import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Button, Flex, Segmented, Typography } from 'antd'
import type dayjs from 'dayjs'
import { CALENDAR_VIEWS, type CalendarView } from '@/features/calendar/types'
import { useMessages } from '@/i18n/messages'

interface CalendarToolbarProps {
  view: CalendarView
  date: dayjs.Dayjs
  rangeLabel: string
  onViewChange: (view: CalendarView) => void
  onStep: (direction: -1 | 1) => void
  onToday: () => void
}

export function CalendarToolbar({
  view,
  rangeLabel,
  onViewChange,
  onStep,
  onToday,
}: CalendarToolbarProps) {
  const messages = useMessages()

  return (
    <Flex align="center" justify="space-between" gap={12} wrap className="calendar-toolbar">
      <Flex align="center" gap={8}>
        <Button
          icon={<LeftOutlined aria-hidden="true" />}
          aria-label={messages.calendar.previous}
          onClick={() => onStep(-1)}
        />
        <Button
          icon={<RightOutlined aria-hidden="true" />}
          aria-label={messages.calendar.next}
          onClick={() => onStep(1)}
        />
        <Button onClick={onToday}>{messages.calendar.today}</Button>
        <Typography.Title level={3} className="calendar-toolbar__range">
          {rangeLabel}
        </Typography.Title>
      </Flex>

      <Segmented<CalendarView>
        value={view}
        onChange={onViewChange}
        options={CALENDAR_VIEWS.map((option) => ({
          value: option,
          label: messages.calendar.views[option],
        }))}
      />
    </Flex>
  )
}
