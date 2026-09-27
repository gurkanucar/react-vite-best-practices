import dayjs from 'dayjs'
import { chatContacts } from '@/features/chat/data'
import {
  formatDuration,
  localize,
  ME,
  type ChatContact,
  type ChatMessage,
  type Conversation,
} from '@/features/chat/types'
import type { Messages } from '@/i18n/messages'
import type { Language } from '@/store/preferences-store'

export function contactById(id: string): ChatContact | undefined {
  return chatContacts.find((contact) => contact.id === id)
}

/** The other person in a private chat. */
export function partnerOf(conversation: Conversation): ChatContact | undefined {
  return conversation.kind === 'private'
    ? contactById(conversation.memberIds.find((id) => id !== ME) ?? '')
    : undefined
}

export function conversationTitle(conversation: Conversation, language: Language): string {
  if (conversation.title) return localize(conversation.title, language)
  return partnerOf(conversation)?.name ?? ''
}

export function authorName(authorId: string, messages: Messages): string {
  return authorId === ME ? messages.chat.you : (contactById(authorId)?.name ?? '')
}

export function initials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toLocaleUpperCase()
}

/** One line standing in for a message: its text, or what it holds when it has none. */
export function messagePreview(message: ChatMessage, messages: Messages, language: Language) {
  if (message.text) return localize(message.text, language)

  if (message.poll) return `📊 ${localize(message.poll.question, language)}`

  const { attachment } = message
  if (attachment?.kind === 'voice') {
    return `🎤 ${messages.chat.voiceMessage} (${formatDuration(attachment.duration ?? 0)})`
  }
  if (attachment?.kind === 'video') return `🎬 ${messages.chat.videoMessage}`
  if (attachment?.kind === 'file') return `📄 ${attachment.name ?? messages.chat.document}`

  const count = message.images?.length ?? 0
  return count > 1 ? messages.chat.photos.replace('{count}', String(count)) : messages.chat.photo
}

/** Today shows the time, this week the weekday, anything older the date. */
export function listTime(iso: string, messages: Messages): string {
  const time = dayjs(iso)

  if (time.isSame(dayjs(), 'day')) return time.format('HH:mm')
  if (time.isSame(dayjs().subtract(1, 'day'), 'day')) return messages.chat.yesterday
  if (time.isAfter(dayjs().subtract(7, 'day'))) return time.format('dddd')
  return time.format('DD.MM.YYYY')
}

export function dayLabel(date: string, messages: Messages): string {
  const day = dayjs(date)

  if (day.isSame(dayjs(), 'day')) return messages.chat.today
  if (day.isSame(dayjs().subtract(1, 'day'), 'day')) return messages.chat.yesterday
  if (day.isAfter(dayjs().subtract(7, 'day'))) return day.format('dddd')
  return day.format('D MMMM YYYY')
}
