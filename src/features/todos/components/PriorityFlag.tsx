import { FlagFilled } from '@ant-design/icons'
import { theme } from 'antd'
import { priorityColor } from '@/features/todos/components/todoText'
import type { TodoPriority } from '@/features/todos/types'

export function PriorityFlag({ priority }: { priority: TodoPriority }) {
  const { token } = theme.useToken()

  // Always shown beside the priority's name, so it is decoration to a screen reader.
  return <FlagFilled aria-hidden style={{ color: priorityColor(priority, token) }} />
}
