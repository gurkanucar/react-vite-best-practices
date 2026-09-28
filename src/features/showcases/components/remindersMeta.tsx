import {
  CreditCardOutlined,
  FlagOutlined,
  GiftOutlined,
  HeartFilled,
  HeartOutlined,
  MoonOutlined,
  PushpinOutlined,
  StarOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'
import type { ReactNode } from 'react'
import type { ReminderCategory } from '@/features/showcases/data/reminders'
import type { Language } from '@/store/preferences-store'

export const CATEGORY_META: Record<ReminderCategory, { color: string; icon: ReactNode }> = {
  birthday: { color: '#e8590c', icon: <GiftOutlined /> },
  anniversary: { color: '#d6336c', icon: <HeartOutlined /> },
  wedding: { color: '#9c36b5', icon: <HeartFilled /> },
  memorial: { color: '#5c677d', icon: <StarOutlined /> },
  holiday: { color: '#c92a2a', icon: <FlagOutlined /> },
  religious: { color: '#2b8a3e', icon: <MoonOutlined /> },
  bill: { color: '#b76e00', icon: <CreditCardOutlined /> },
  other: { color: '#0c8599', icon: <PushpinOutlined /> },
}

/** "Fri, 9 October 2026" / "9 Ekim 2026 Cuma". */
export function formatDate(iso: string, language: Language, { weekday = true, year = true } = {}) {
  const date = dayjs(iso).locale(language)
  if (language === 'tr') return date.format(`D MMMM${year ? ' YYYY' : ''}${weekday ? ' dddd' : ''}`)
  return date.format(`${weekday ? 'ddd, ' : ''}D MMMM${year ? ' YYYY' : ''}`)
}
