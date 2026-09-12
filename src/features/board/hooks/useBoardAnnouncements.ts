import type { Announcements } from '@dnd-kit/core'
import { useMemo } from 'react'
import { useMessages } from '@/i18n/messages'

/**
 * dnd-kit narrates a drag to screen readers, and its built-in narration is English only.
 * Building the announcements from the locale files is what keeps a keyboard drag usable
 * in the selected language.
 */
export function useBoardAnnouncements(): Announcements {
  const messages = useMessages()

  return useMemo(() => {
    const { announcements } = messages.board
    const fill = (template: string, values: Record<string, string>) =>
      Object.entries(values).reduce(
        (text, [key, value]) => text.replace(`{${key}}`, value),
        template,
      )

    return {
      onDragStart: ({ active }) => fill(announcements.start, { card: String(active.id) }),
      onDragOver: ({ active, over }) =>
        over
          ? fill(announcements.over, { card: String(active.id), target: String(over.id) })
          : fill(announcements.outside, { card: String(active.id) }),
      onDragEnd: ({ active, over }) =>
        over
          ? fill(announcements.end, { card: String(active.id), target: String(over.id) })
          : fill(announcements.cancel, { card: String(active.id) }),
      onDragCancel: ({ active }) => fill(announcements.cancel, { card: String(active.id) }),
    }
  }, [messages])
}
