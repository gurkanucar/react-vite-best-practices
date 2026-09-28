import {
  Alert,
  App,
  Button,
  Checkbox,
  Col,
  DatePicker,
  Drawer,
  Flex,
  Form,
  Grid,
  Input,
  Row,
  Segmented,
  Select,
  Switch,
  TimePicker,
} from 'antd'
import dayjs, { type Dayjs } from 'dayjs'
import { useEffect } from 'react'
import { CategoryBadge } from '@/features/showcases/components/RemindersParts'
import {
  COUNTS_YEARS,
  giftText,
  ISO,
  REMINDER_CATEGORIES,
  REMINDER_OFFSETS,
  REMINDER_REPEATS,
  reminderNote,
  reminderTitle,
  type Reminder,
  type ReminderCategory,
  type ReminderInput,
  type ReminderRepeat,
} from '@/features/showcases/data/reminders'
import { useRemindersCopy } from '@/features/showcases/hooks/useRemindersCopy'
import { useRemindersStore } from '@/features/showcases/hooks/useRemindersStore'

interface FormValues {
  title: string
  category: ReminderCategory
  date: Dayjs
  repeat: ReminderRepeat
  countYears: boolean
  offsets: number[]
  alarmTime: Dayjs
  contactName?: string
  phone?: string
  note?: string
  gifts: string[]
}

interface ReminderFormDrawerProps {
  open: boolean
  /** The reminder being edited; left out, a new one. */
  reminder?: Reminder
  /** A new reminder's date, when it is added from a calendar day. */
  defaultDate?: string
  onClose: () => void
  onSaved?: (id: string) => void
}

/**
 * Adds or edits a reminder. Days that move every year (Mother's Day, the bayrams) keep their
 * calendar: only their title, alarms and notes can change.
 */
export function ReminderFormDrawer({
  open,
  reminder,
  defaultDate,
  onClose,
  onSaved,
}: ReminderFormDrawerProps) {
  const { text, language } = useRemindersCopy()
  const { message } = App.useApp()
  const [form] = Form.useForm<FormValues>()
  const wide = Grid.useBreakpoint().md ?? false
  const add = useRemindersStore((state) => state.add)
  const update = useRemindersStore((state) => state.update)
  const repeat = Form.useWatch('repeat', form)
  const locked = reminder?.rule !== undefined

  useEffect(() => {
    if (!open) return
    form.resetFields()
    form.setFieldsValue(
      reminder
        ? {
            title: reminderTitle(reminder, language),
            category: reminder.category,
            date: dayjs(reminder.date),
            repeat: reminder.repeat,
            countYears: reminder.countYears,
            offsets: reminder.offsets,
            alarmTime: dayjs(`2000-01-01T${reminder.alarmTime}`),
            contactName: reminder.contact?.name,
            phone: reminder.contact?.phone,
            note: reminderNote(reminder, language),
            gifts: reminder.gifts.map((gift) => giftText(gift, language)),
          }
        : {
            title: '',
            category: 'birthday',
            date: defaultDate ? dayjs(defaultDate) : undefined,
            repeat: 'yearly',
            countYears: true,
            offsets: [1, 0],
            alarmTime: dayjs('2000-01-01T09:00'),
            gifts: [],
          },
    )
  }, [open, reminder, defaultDate, language, form])

  function submit(values: FormValues) {
    const now = Date.now()
    const input: ReminderInput = {
      title: values.title,
      category: values.category,
      date: values.date.format(ISO),
      repeat: values.repeat,
      countYears: values.countYears,
      offsets: values.offsets ?? [],
      alarmTime: values.alarmTime.format('HH:mm'),
      note: values.note,
      contact: values.contactName ? { name: values.contactName, phone: values.phone } : undefined,
      gifts: values.gifts,
    }
    if (reminder) {
      update(reminder.id, input, now)
      void message.success(text.form.saved)
      onSaved?.(reminder.id)
    } else {
      const id = add(input, now)
      void message.success(text.form.added)
      onSaved?.(id)
    }
    onClose()
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      size={wide ? 520 : '92%'}
      placement={wide ? 'right' : 'bottom'}
      title={reminder ? text.form.editTitle : text.form.addTitle}
      destroyOnHidden
      rootClassName="reminders-drawer"
      footer={
        <Flex justify="end" gap={8}>
          <Button onClick={onClose}>{text.form.cancel}</Button>
          <Button type="primary" onClick={() => form.submit()}>
            {text.form.save}
          </Button>
        </Flex>
      }
    >
      <Form<FormValues>
        form={form}
        layout="vertical"
        requiredMark={false}
        onFinish={submit}
        onValuesChange={(changed: Partial<FormValues>) => {
          if (changed.category && !reminder) {
            form.setFieldValue('countYears', COUNTS_YEARS.includes(changed.category))
            if (changed.category === 'bill') form.setFieldValue('repeat', 'monthly')
          }
        }}
      >
        <Form.Item
          name="title"
          label={text.form.title}
          rules={[
            { required: true, whitespace: true, message: text.form.titleRequired },
            { max: 80, message: text.form.titleLength },
          ]}
        >
          <Input placeholder={text.form.titlePlaceholder} maxLength={80} />
        </Form.Item>

        <Form.Item name="category" label={text.form.category}>
          <Select
            options={REMINDER_CATEGORIES.map((category) => ({
              value: category,
              label: (
                <Flex align="center" gap={8}>
                  <CategoryBadge category={category} size={22} />
                  {text.categories[category]}
                </Flex>
              ),
            }))}
          />
        </Form.Item>

        {locked && (
          <Alert
            type="info"
            showIcon
            title={text.form.ruleLocked}
            className="reminders-form__lock"
          />
        )}

        <Row gutter={12}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="date"
              label={text.form.date}
              extra={text.form.dateHelp}
              rules={[{ required: true, message: text.form.dateRequired }]}
            >
              <DatePicker format="DD.MM.YYYY" disabled={locked} className="reminders-form__full" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="repeat" label={text.form.repeat}>
              <Segmented<ReminderRepeat>
                block
                disabled={locked}
                options={REMINDER_REPEATS.map((value) => ({
                  value,
                  label: text.repeats[value],
                }))}
              />
            </Form.Item>
          </Col>
        </Row>

        {repeat === 'yearly' && !locked && (
          <Form.Item
            name="countYears"
            label={text.form.countYears}
            extra={text.form.countYearsHelp}
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        )}

        <Form.Item name="offsets" label={text.form.offsets}>
          <Checkbox.Group
            className="reminders-form__offsets"
            options={REMINDER_OFFSETS.map((offset) => ({
              value: offset,
              label: text.offset(offset),
            }))}
          />
        </Form.Item>

        <Form.Item
          name="alarmTime"
          label={text.form.alarmTime}
          rules={[{ required: true, message: text.form.alarmRequired }]}
        >
          <TimePicker format="HH:mm" minuteStep={5} needConfirm={false} />
        </Form.Item>

        <Row gutter={12}>
          <Col xs={24} sm={12}>
            <Form.Item name="contactName" label={`${text.form.contact} · ${text.form.contactName}`}>
              <Input maxLength={60} autoComplete="off" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="phone" label={text.form.phone}>
              <Input maxLength={24} inputMode="tel" autoComplete="off" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="note" label={text.form.note}>
          <Input.TextArea autoSize={{ minRows: 2, maxRows: 5 }} maxLength={400} />
        </Form.Item>

        <Form.Item name="gifts" label={text.form.gifts}>
          <Select
            mode="tags"
            open={false}
            placeholder={text.form.giftsPlaceholder}
            suffixIcon={null}
          />
        </Form.Item>
      </Form>
    </Drawer>
  )
}
