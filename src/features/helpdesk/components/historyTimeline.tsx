import {
  AppstoreOutlined,
  CheckCircleOutlined,
  FlagOutlined,
  LockOutlined,
  MessageOutlined,
  PlusCircleOutlined,
  SendOutlined,
  SwapOutlined,
  TagsOutlined,
  UserSwitchOutlined,
  WarningOutlined,
} from '@ant-design/icons'
import type { ReactNode } from 'react'
import type { HistoryEntry } from '@/features/helpdesk/types'

const icons: Record<HistoryEntry['kind'], ReactNode> = {
  created: <PlusCircleOutlined />,
  customer: <MessageOutlined />,
  reply: <SendOutlined />,
  note: <LockOutlined />,
  status: <SwapOutlined />,
  priority: <FlagOutlined />,
  assignee: <UserSwitchOutlined />,
  category: <AppstoreOutlined />,
  tags: <TagsOutlined />,
  firstResponseMet: <CheckCircleOutlined />,
  resolutionMet: <CheckCircleOutlined />,
  firstResponseBreached: <WarningOutlined />,
  resolutionBreached: <WarningOutlined />,
}

function colorFor(entry: HistoryEntry): string {
  if (entry.kind === 'created' || entry.kind.endsWith('Met')) return 'green'
  if (entry.kind.endsWith('Breached')) return 'red'
  if (entry.kind === 'note') return 'gold'
  if (entry.kind === 'customer') return 'gray'
  return 'blue'
}

/** History entries as antd Timeline items, each with the icon and colour of its kind. */
export function timelineItems(entries: HistoryEntry[], render: (entry: HistoryEntry) => ReactNode) {
  return entries.map((entry) => ({
    key: entry.id,
    color: colorFor(entry),
    icon: <span className="helpdesk-history-icon">{icons[entry.kind]}</span>,
    content: render(entry),
  }))
}
