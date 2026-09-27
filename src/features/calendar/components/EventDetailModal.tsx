import {
  ClockCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EnvironmentOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import { Button, Descriptions, Flex, Modal, Popconfirm, Tag } from 'antd'
import dayjs from 'dayjs'
import { eventTitle } from '@/features/calendar/components/eventText'
import { categoryTokens, spanInDays, type CalendarEvent } from '@/features/calendar/types'
import { useMessages } from '@/i18n/messages'

interface EventDetailModalProps {
  event: CalendarEvent | null
  onClose: () => void
  onEdit: (event: CalendarEvent) => void
  onDelete: (event: CalendarEvent) => void
}

/** A one-day event names its day; a multi-day one names both ends and how long it runs. */
function formatWhen(event: CalendarEvent, allDayLabel: string, dayCountLabel: string): string {
  if (!event.allDay) {
    return `${dayjs(event.start).format('D MMMM YYYY HH:mm')} – ${dayjs(event.end).format('HH:mm')}`
  }

  const days = spanInDays(event)

  if (days === 1) {
    return `${dayjs(event.start).format('D MMMM YYYY')} · ${allDayLabel}`
  }

  return `${dayjs(event.start).format('D MMM')} – ${dayjs(event.end).format('D MMM YYYY')} · ${dayCountLabel.replace('{count}', String(days))}`
}

export function EventDetailModal({ event, onClose, onEdit, onDelete }: EventDetailModalProps) {
  const messages = useMessages()

  return (
    <Modal
      open={event !== null}
      onCancel={onClose}
      footer={
        event && (
          <Flex justify="end" gap={8}>
            <Popconfirm
              title={messages.calendar.deleteConfirm}
              description={messages.calendar.deleteConfirmDescription}
              okText={messages.calendar.delete}
              cancelText={messages.calendar.cancel}
              okButtonProps={{ danger: true }}
              onConfirm={() => onDelete(event)}
            >
              <Button danger icon={<DeleteOutlined aria-hidden="true" />}>
                {messages.calendar.delete}
              </Button>
            </Popconfirm>
            <Button
              type="primary"
              icon={<EditOutlined aria-hidden="true" />}
              onClick={() => onEdit(event)}
            >
              {messages.calendar.edit}
            </Button>
          </Flex>
        )
      }
      title={event ? eventTitle(messages, event) : undefined}
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
            {formatWhen(event, messages.calendar.allDay, messages.calendar.dayCount)}
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
