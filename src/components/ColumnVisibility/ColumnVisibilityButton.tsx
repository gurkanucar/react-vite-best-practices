import { TableOutlined } from '@ant-design/icons'
import { Button, Checkbox, Dropdown } from 'antd'
import type { ColumnOption } from '@/components/ColumnVisibility/useColumnVisibility'
import { useMessages } from '@/i18n/messages'

interface ColumnVisibilityButtonProps {
  options: ColumnOption[]
  hiddenKeys: string[]
  onToggle: (columnKey: string, visible: boolean) => void
  onReset: () => void
}

export function ColumnVisibilityButton({
  options,
  hiddenKeys,
  onToggle,
  onReset,
}: ColumnVisibilityButtonProps) {
  const messages = useMessages()

  return (
    <Dropdown
      trigger={['click']}
      menu={{
        items: [
          ...options.map(({ key, label }) => ({
            key,
            label: (
              <Checkbox
                checked={!hiddenKeys.includes(key)}
                onChange={(event) => onToggle(key, event.target.checked)}
              >
                {label}
              </Checkbox>
            ),
          })),
          { type: 'divider' as const },
          { key: 'reset', label: messages.common.resetColumns, onClick: onReset },
        ],
      }}
    >
      <Button icon={<TableOutlined aria-hidden="true" />}>
        {hiddenKeys.length > 0
          ? `${messages.common.columns} (${options.length - hiddenKeys.length}/${options.length})`
          : messages.common.columns}
      </Button>
    </Dropdown>
  )
}
