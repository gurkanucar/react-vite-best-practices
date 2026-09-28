import { BellOutlined, RightOutlined } from '@ant-design/icons'
import { Flex, Tag, Typography } from 'antd'
import type { CSSProperties } from 'react'
import { Link } from 'react-router'
import { CATEGORY_META, formatDate } from '@/features/showcases/components/remindersMeta'
import {
  reminderTitle,
  yearsAt,
  type ReminderCategory,
  type UpcomingItem,
} from '@/features/showcases/data/reminders'
import type { RemindersCopy } from '@/features/showcases/data/remindersCopy'
import type { Language } from '@/store/preferences-store'

/** A round badge with the category's icon. Its width and height are the same, always. */
export function CategoryBadge({
  category,
  size = 44,
}: {
  category: ReminderCategory
  size?: number
}) {
  const { color, icon } = CATEGORY_META[category]
  return (
    <span
      className="reminders-badge"
      style={{ '--badge-color': color, '--badge-size': `${size}px` } as CSSProperties}
      aria-hidden="true"
    >
      {icon}
    </span>
  )
}

export function DaysTag({ days, text }: { days: number; text: RemindersCopy }) {
  const tone = days < 0 ? 'is-past' : days === 0 ? 'is-today' : days <= 7 ? 'is-soon' : ''
  return (
    <span className={`reminders-days ${tone}`}>
      {days < 0 ? text.daysAgo(-days) : text.daysLeft(days)}
    </span>
  )
}

/** One upcoming day in a list: badge, title, date, the years it marks, and the countdown. */
export function ReminderRow({
  item,
  root,
  text,
  language,
}: {
  item: UpcomingItem
  root: string
  text: RemindersCopy
  language: Language
}) {
  const { reminder, occurrence, days } = item
  const years = yearsAt(reminder, occurrence)
  return (
    <Link to={`${root}/${reminder.id}`} className="reminders-row" data-reminder={reminder.id}>
      <CategoryBadge category={reminder.category} />
      <span className="reminders-row__body">
        <Typography.Text strong className="reminders-row__title">
          {reminderTitle(reminder, language)}
        </Typography.Text>
        <span className="reminders-row__meta">
          <span>{formatDate(occurrence, language)}</span>
          {years !== null && <Tag variant="filled">{text.years(reminder.category, years)}</Tag>}
          {reminder.offsets.length > 0 && (
            <span className="reminders-row__alarm">
              <BellOutlined aria-hidden="true" /> {reminder.alarmTime}
            </span>
          )}
        </span>
      </span>
      <Flex align="center" gap={8} className="reminders-row__end">
        <DaysTag days={days} text={text} />
        <RightOutlined aria-hidden="true" className="reminders-row__chevron" />
      </Flex>
    </Link>
  )
}
