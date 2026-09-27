import { DeleteOutlined } from '@ant-design/icons'
import {
  Button,
  DatePicker,
  Flex,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Switch,
  Tag,
  TimePicker,
} from 'antd'
import dayjs, { type Dayjs } from 'dayjs'
import { useEffect } from 'react'
import { categoryTokens, type EventCategory, type EventDraft } from '@/features/calendar/types'
import { useMessages } from '@/i18n/messages'

const categories: EventCategory[] = ['meeting', 'focus', 'review', 'release', 'personal']

interface EventFormModalProps {
  /** `null` keeps the modal closed. */
  draft: EventDraft | null
  mode: 'create' | 'edit'
  onCancel: () => void
  onSave: (draft: EventDraft) => void
  /** Offered only when editing. */
  onDelete?: () => void
}

interface EventFormValues {
  title: string
  category: EventCategory
  allDay: boolean
  date: Dayjs
  time: [Dayjs, Dayjs]
  dates: [Dayjs, Dayjs]
  location?: string
  attendees: string[]
}

function toValues(draft: EventDraft): EventFormValues {
  const start = dayjs(draft.start)
  const end = dayjs(draft.end)

  return {
    title: draft.title ?? '',
    category: draft.category,
    allDay: Boolean(draft.allDay),
    date: start.startOf('day'),
    // Switching an all-day event to timed needs a time to start from.
    time: draft.allDay ? [start.hour(9), start.hour(10)] : [start, end],
    dates: [start.startOf('day'), end.startOf('day')],
    location: draft.location,
    attendees: draft.attendees,
  }
}

function toDraft(values: EventFormValues): EventDraft {
  const location = values.location?.trim()
  const common = {
    title: values.title.trim(),
    category: values.category,
    location: location || undefined,
    attendees: values.attendees ?? [],
  }

  if (values.allDay) {
    const [from, to] = values.dates

    return {
      ...common,
      allDay: true,
      start: `${from.format('YYYY-MM-DD')}T00:00`,
      end: `${to.format('YYYY-MM-DD')}T23:59`,
    }
  }

  const day = values.date.format('YYYY-MM-DD')
  const [from, to] = values.time

  return {
    ...common,
    allDay: false,
    start: `${day}T${from.format('HH:mm')}`,
    end: `${day}T${to.format('HH:mm')}`,
  }
}

/**
 * One form for adding and editing. A timed event keeps to one day, as the grid draws it,
 * so it gets a date and a time range; an all-day event gets a date range instead.
 */
export function EventFormModal({ draft, mode, onCancel, onSave, onDelete }: EventFormModalProps) {
  const messages = useMessages()
  const text = messages.calendar
  const [form] = Form.useForm<EventFormValues>()
  const allDay = Form.useWatch('allDay', form)

  useEffect(() => {
    // The modal is reused for every event, so each opening starts from its own draft.
    if (draft) form.setFieldsValue(toValues(draft))
  }, [draft, form])

  return (
    <Modal
      open={draft !== null}
      title={mode === 'create' ? text.createTitle : text.editTitle}
      onCancel={onCancel}
      forceRender
      footer={
        <Flex justify="space-between" gap={8}>
          {onDelete ? (
            <Popconfirm
              title={text.deleteConfirm}
              description={text.deleteConfirmDescription}
              okText={text.delete}
              cancelText={text.cancel}
              okButtonProps={{ danger: true }}
              onConfirm={onDelete}
            >
              <Button danger icon={<DeleteOutlined aria-hidden="true" />}>
                {text.delete}
              </Button>
            </Popconfirm>
          ) : (
            <span />
          )}
          <Flex gap={8}>
            <Button onClick={onCancel}>{text.cancel}</Button>
            <Button type="primary" onClick={form.submit}>
              {text.save}
            </Button>
          </Flex>
        </Flex>
      }
    >
      <Form<EventFormValues>
        form={form}
        layout="vertical"
        requiredMark={false}
        initialValues={draft ? toValues(draft) : undefined}
        onFinish={(values) => onSave(toDraft(values))}
      >
        <Form.Item
          name="title"
          label={text.fieldTitle}
          rules={[{ required: true, whitespace: true, message: text.titleRequired }]}
        >
          <Input placeholder={text.titlePlaceholder} />
        </Form.Item>

        <Flex gap={16} wrap>
          <Form.Item name="category" label={text.category} style={{ flex: '1 1 200px' }}>
            <Select
              options={categories.map((category) => ({
                value: category,
                label: (
                  <Tag color={categoryTokens[category]} variant="filled">
                    {text.categories[category]}
                  </Tag>
                ),
              }))}
            />
          </Form.Item>
          <Form.Item name="allDay" label={text.allDay} valuePropName="checked">
            <Switch />
          </Form.Item>
        </Flex>

        {allDay ? (
          <Form.Item
            name="dates"
            label={text.dates}
            rules={[{ required: true, message: text.timeRequired }]}
          >
            <DatePicker.RangePicker style={{ width: '100%' }} allowClear={false} />
          </Form.Item>
        ) : (
          <Flex gap={16} wrap>
            <Form.Item
              name="date"
              label={text.date}
              rules={[{ required: true, message: text.timeRequired }]}
              style={{ flex: '1 1 160px' }}
            >
              <DatePicker style={{ width: '100%' }} allowClear={false} />
            </Form.Item>
            <Form.Item
              name="time"
              label={text.time}
              style={{ flex: '1 1 220px' }}
              rules={[
                { required: true, message: text.timeRequired },
                {
                  validator: (_, value: [Dayjs, Dayjs] | undefined) =>
                    value && !value[1].isAfter(value[0])
                      ? Promise.reject(new Error(text.timeRequired))
                      : Promise.resolve(),
                },
              ]}
            >
              <TimePicker.RangePicker
                format="HH:mm"
                minuteStep={15}
                style={{ width: '100%' }}
                allowClear={false}
              />
            </Form.Item>
          </Flex>
        )}

        <Form.Item name="location" label={text.location}>
          <Input placeholder={text.locationPlaceholder} />
        </Form.Item>
        <Form.Item name="attendees" label={text.attendees}>
          <Select mode="tags" placeholder={text.attendeesPlaceholder} tokenSeparators={[',']} />
        </Form.Item>
      </Form>
    </Modal>
  )
}
