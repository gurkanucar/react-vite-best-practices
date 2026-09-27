import dayjs from 'dayjs'
import type { Language } from '@/store/preferences-store'

export type LocalizedText = Record<Language, string>

/** Seeded messages carry both languages; what the user types is stored as typed. */
export type ChatText = string | LocalizedText

export function localize(text: ChatText, language: Language): string {
  return typeof text === 'string' ? text : text[language]
}

/** The signed-in user, as an author id. */
export const ME = 'me'

export type Presence = 'online' | 'away' | 'offline'

export interface ChatContact {
  id: string
  name: string
  role: LocalizedText
  /** Avatar background, and the tint of the name above this person's group messages. */
  color: string
  presence: Presence
  /** ISO time; shown as "last seen" when the contact is not online. */
  lastSeen?: string
  about: LocalizedText
  phone: string
  email: string
}

/**
 * What a message can carry besides text and photos: a voice note, a video or any other
 * file. `src` is a URL the browser can load: a bundled asset, a public sample, or an object
 * URL for something the user just picked or recorded.
 */
export interface ChatAttachment {
  kind: 'voice' | 'video' | 'file'
  src: string
  name?: string
  /** Bytes, for a file's description. */
  size?: number
  /** Seconds, known up front for a voice note so the bubble can show it before loading. */
  duration?: number
  poster?: string
}

export interface PollOption {
  id: string
  text: ChatText
}

/** A WhatsApp-style poll: a question, up to twelve options, one answer or several. */
export interface ChatPoll {
  question: ChatText
  options: PollOption[]
  /** Several options may be ticked; otherwise a new vote replaces the old one. */
  multiple: boolean
  /** Option id to the ids of the people who picked it. */
  votes: Record<string, string[]>
}

export const MAX_POLL_OPTIONS = 12

/** Sent → delivered to the phone → opened. Only ever set on the user's own messages. */
export type DeliveryStatus = 'sent' | 'delivered' | 'read'

export interface ChatMessage {
  id: string
  authorId: string
  sentAt: string
  /** A system line such as "Can created the group" rather than something someone said. */
  system?: boolean
  text?: ChatText
  images?: string[]
  attachment?: ChatAttachment
  poll?: ChatPoll
  replyToId?: string
  /** Emoji to the ids of the people who reacted with it. */
  reactions?: Record<string, string[]>
  status?: DeliveryStatus
}

export interface Conversation {
  id: string
  kind: 'private' | 'group'
  /** Groups are named; a private chat is named after the other person. */
  title?: ChatText
  memberIds: string[]
  messages: ChatMessage[]
  unread: number
  /** A group's about line, shown in its details. */
  description?: ChatText
  /** Group admins; everyone else is a plain member. */
  adminIds?: string[]
  createdAt?: string
  muted?: boolean
  pinned?: boolean
}

/**
 * Messages from one person that follow each other closely read as a single block: one
 * name, one avatar and one tail. A new day, a system line, another author or a pause this
 * long starts a new block.
 */
const RUN_GAP_MINUTES = 5

export type TimelineEntry =
  | { kind: 'day'; key: string; date: string }
  | { kind: 'system'; key: string; message: ChatMessage }
  | {
      kind: 'message'
      key: string
      message: ChatMessage
      /** The first of a run of messages from the same person: it carries the name and tail. */
      first: boolean
      /** The last of the run: it carries the avatar in a group. */
      last: boolean
    }

export function buildTimeline(messages: ChatMessage[]): TimelineEntry[] {
  const entries: TimelineEntry[] = []
  let previous: ChatMessage | undefined
  let currentDay: string | undefined

  for (const message of messages) {
    const day = dayjs(message.sentAt).format('YYYY-MM-DD')

    if (day !== currentDay) {
      entries.push({ kind: 'day', key: `day:${day}`, date: day })
      currentDay = day
      previous = undefined
    }

    if (message.system) {
      entries.push({ kind: 'system', key: message.id, message })
      previous = undefined
      continue
    }

    const continues =
      previous !== undefined &&
      previous.authorId === message.authorId &&
      dayjs(message.sentAt).diff(previous.sentAt, 'minute') < RUN_GAP_MINUTES

    const last = entries.at(-1)
    if (continues && last?.kind === 'message') last.last = false

    entries.push({ kind: 'message', key: message.id, message, first: !continues, last: true })
    previous = message
  }

  return entries
}

/**
 * A message of nothing but a few emoji is drawn large and without a bubble, the way chat
 * apps do; any text beside them and it is an ordinary message again.
 */
export function isEmojiOnly(text: string): boolean {
  const trimmed = text.trim()
  if (!trimmed || /[\p{L}\p{N}]/u.test(trimmed)) return false

  const emoji = trimmed.match(/\p{Extended_Pictographic}/gu) ?? []
  const rest = trimmed.replace(
    /\p{Extended_Pictographic}|\p{Emoji_Modifier}|\u200d|\ufe0f|\s/gu,
    '',
  )

  return emoji.length > 0 && emoji.length <= 3 && rest === ''
}

/** Adds the user's reaction, swaps it for another, or takes it back if it is the same one. */
export function toggleReaction(
  reactions: Record<string, string[]> | undefined,
  emoji: string,
  userId: string,
): Record<string, string[]> {
  const had = reactions?.[emoji]?.includes(userId) ?? false
  const next: Record<string, string[]> = {}

  // One reaction per person, as in WhatsApp: reacting again replaces the old one.
  for (const [key, users] of Object.entries(reactions ?? {})) {
    const others = users.filter((id) => id !== userId)
    if (others.length > 0) next[key] = others
  }

  if (!had) next[emoji] = [...(next[emoji] ?? []), userId]

  return next
}

export function formatDuration(seconds: number): string {
  const whole = Math.max(0, Math.round(seconds))
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`
}

/**
 * Ticks or unticks an option for a voter. A single-choice poll moves the voter's one vote;
 * picking the option they already have takes it back, as WhatsApp does.
 */
export function castVote(poll: ChatPoll, optionId: string, voterId: string): ChatPoll {
  const had = poll.votes[optionId]?.includes(voterId) ?? false
  const votes: Record<string, string[]> = {}

  for (const option of poll.options) {
    const voters = poll.votes[option.id] ?? []
    const keep =
      poll.multiple || option.id === optionId ? voters : voters.filter((id) => id !== voterId)
    votes[option.id] =
      option.id === optionId
        ? had
          ? keep.filter((id) => id !== voterId)
          : [...keep, voterId]
        : keep
  }

  return { ...poll, votes }
}

/** How many different people have voted, which is what the percentages are shares of. */
export function pollVoters(poll: ChatPoll): number {
  return new Set(Object.values(poll.votes).flat()).size
}
