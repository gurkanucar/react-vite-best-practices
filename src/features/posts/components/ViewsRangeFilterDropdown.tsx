import { Button, Flex, InputNumber } from 'antd'
import type { PostFilterPatch } from '@/features/posts/hooks'
import { useMessages } from '@/i18n/messages'
import { useDebouncedFilter } from '@/lib/filters/useDebouncedFilter'

interface ViewsRangeFilterDropdownProps {
  minViews?: number
  maxViews?: number
  onChange: (patch: PostFilterPatch) => void
  onClose: () => void
}

/**
 * A range does not fit the checkbox list Ant Design renders by default, so the column
 * supplies its own dropdown. It is a component rather than an inline `filterDropdown`
 * render function so it can use the same debounce every other typed filter uses.
 */
export function ViewsRangeFilterDropdown({
  minViews,
  maxViews,
  onChange,
  onClose,
}: ViewsRangeFilterDropdownProps) {
  const messages = useMessages()
  const min = useDebouncedFilter(minViews, (value) => onChange({ minViews: value?.toString() }))
  const max = useDebouncedFilter(maxViews, (value) => onChange({ maxViews: value?.toString() }))

  return (
    <Flex vertical gap={8} style={{ padding: 8 }}>
      <InputNumber
        min={0}
        placeholder={messages.posts.minPlaceholder}
        value={min.value}
        onChange={(value) => min.change(value ?? undefined)}
      />
      <InputNumber
        min={0}
        placeholder={messages.posts.maxPlaceholder}
        value={max.value}
        onChange={(value) => max.change(value ?? undefined)}
      />
      <Button size="small" type="primary" onClick={onClose}>
        {messages.common.apply}
      </Button>
    </Flex>
  )
}
