import {
  CalendarOutlined,
  LeftOutlined,
  PlusOutlined,
  ProjectOutlined,
  RightOutlined,
  ScheduleOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons'
import { Button, Col, Flex, Grid, Row, Segmented, Typography } from 'antd'
import type { ReactNode } from 'react'
import { CALENDAR_VIEWS, type CalendarView } from '@/features/calendar/types'
import { useMessages } from '@/i18n/messages'

const viewIcons: Record<CalendarView, ReactNode> = {
  month: <CalendarOutlined aria-hidden="true" />,
  week: <ProjectOutlined aria-hidden="true" />,
  day: <ScheduleOutlined aria-hidden="true" />,
  agenda: <UnorderedListOutlined aria-hidden="true" />,
}

interface CalendarToolbarProps {
  view: CalendarView
  rangeLabel: string
  onViewChange: (view: CalendarView) => void
  onStep: (direction: -1 | 1) => void
  onToday: () => void
  onCreate: () => void
}

/**
 * Three groups — view, range, actions — laid out with the grid rather than CSS, so on a
 * phone each gets its own row, the range on top.
 */
export function CalendarToolbar({
  view,
  rangeLabel,
  onViewChange,
  onStep,
  onToday,
  onCreate,
}: CalendarToolbarProps) {
  const messages = useMessages()
  // Icons next to the labels only where there is room for both.
  const showIcons = Grid.useBreakpoint().lg ?? false

  return (
    <Row className="calendar-toolbar" align="middle" gutter={[12, 12]}>
      <Col xs={{ span: 24, order: 1 }} md={{ span: 8, order: 2 }}>
        <Flex align="center" justify="center" gap={4}>
          <Button
            type="text"
            icon={<LeftOutlined aria-hidden="true" />}
            aria-label={messages.calendar.previous}
            onClick={() => onStep(-1)}
          />
          <Typography.Title level={4} className="calendar-toolbar__range">
            {rangeLabel}
          </Typography.Title>
          <Button
            type="text"
            icon={<RightOutlined aria-hidden="true" />}
            aria-label={messages.calendar.next}
            onClick={() => onStep(1)}
          />
        </Flex>
      </Col>

      <Col xs={{ span: 24, order: 2 }} md={{ span: 8, order: 1 }}>
        <Segmented<CalendarView>
          value={view}
          onChange={onViewChange}
          options={CALENDAR_VIEWS.map((option) => ({
            value: option,
            icon: showIcons ? viewIcons[option] : undefined,
            label: messages.calendar.views[option],
          }))}
        />
      </Col>

      <Col xs={{ span: 24, order: 3 }} md={{ span: 8, order: 3 }}>
        <Flex justify="end" gap={8}>
          <Button onClick={onToday}>{messages.calendar.today}</Button>
          <Button
            type="primary"
            icon={<PlusOutlined aria-hidden="true" />}
            onClick={onCreate}
            aria-label={messages.calendar.newEvent}
          >
            {showIcons ? messages.calendar.newEvent : null}
          </Button>
        </Flex>
      </Col>
    </Row>
  )
}
