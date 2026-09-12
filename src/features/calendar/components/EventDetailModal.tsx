import { ClockCircleOutlined, EnvironmentOutlined, TeamOutlined } from '@ant-design/icons'
import { Descriptions, Modal, Tag } from 'antd'
import dayjs from 'dayjs'
import { categoryTokens, type CalendarEvent } from '@/features/calendar/types'
import { useMessages } from '@/i18n/messages'

interface EventDetailModalProps {
  event: CalendarEvent | null
  onClose: () => void
}

export function EventDetailModal({ event, onClose }: EventDetailModalProps) {
  const messages = useMessages()

  return (
    <Modal
      open={event !== null}
      onCancel={onClose}
      footer={null}
      title={
        event
          ? messages.calendar.events[event.titleId as keyof typeof messages.calendar.events]
          : undefined
      }
    >
      {event && (
        <Descriptions column={1} size="small" styles={{ label: { width: 120 } }}>
          <Descriptions.Item
            label={
              <>
                <ClockCircleOutlined aria-hidden="true" /> {messages.calendar.when}
              </>
            }
          >
            {event.allDay
              ? `${dayjs(event.start).format('D MMMM YYYY')} · ${messages.calendar.allDay}`
              : `${dayjs(event.start).format('D MMMM YYYY HH:mm')} – ${dayjs(event.end).format('HH:mm')}`}
          </Descriptions.Item>

          {event.location && (
            <Descriptions.Item
              label={
                <>
                  <EnvironmentOutlined aria-hidden="true" /> {messages.calendar.where}
                </>
              }
            >
              {event.location}
            </Descriptions.Item>
          )}

          {event.attendees.length > 0 && (
            <Descriptions.Item
              label={
                <>
                  <TeamOutlined aria-hidden="true" /> {messages.calendar.attendees}
                </>
              }
            >
              {event.attendees.join(', ')}
            </Descriptions.Item>
          )}

          <Descriptions.Item label={messages.calendar.category}>
            <Tag color={categoryTokens[event.category]}>
              {messages.calendar.categories[event.category]}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  )
}
