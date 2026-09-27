import {
  CalendarOutlined,
  CheckSquareOutlined,
  DashboardOutlined,
  DownSquareOutlined,
  FileTextOutlined,
  FontSizeOutlined,
  LineOutlined,
  MailOutlined,
  NumberOutlined,
  PaperClipOutlined,
  PhoneOutlined,
  StarOutlined,
  SwapOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons'
import type { ReactNode } from 'react'
import type { FieldType } from '@/features/forms/types'

export const fieldIcons: Record<FieldType, ReactNode> = {
  shortText: <FontSizeOutlined aria-hidden="true" />,
  longText: <FileTextOutlined aria-hidden="true" />,
  email: <MailOutlined aria-hidden="true" />,
  number: <NumberOutlined aria-hidden="true" />,
  phone: <PhoneOutlined aria-hidden="true" />,
  singleChoice: <UnorderedListOutlined aria-hidden="true" />,
  multipleChoice: <CheckSquareOutlined aria-hidden="true" />,
  dropdown: <DownSquareOutlined aria-hidden="true" />,
  date: <CalendarOutlined aria-hidden="true" />,
  rating: <StarOutlined aria-hidden="true" />,
  nps: <DashboardOutlined aria-hidden="true" />,
  yesNo: <SwapOutlined aria-hidden="true" />,
  file: <PaperClipOutlined aria-hidden="true" />,
  section: <LineOutlined aria-hidden="true" />,
}
