import dayjs from 'dayjs'
import { useCallback, useEffect, useReducer, useRef } from 'react'
import { autoReplies, chatContacts, createSeedConversations } from '@/features/chat/data'
import {
  ME,
  type ChatAttachment,
  type LocalizedText,
  toggleReaction,
  type ChatMessage,
  type ChatText,
  type Conversation,
  type DeliveryStatus,
} from '@/features/chat/types'
import { messages as locales } from '@/i18n/messages'

/** How the simulated other side paces itself: delivered, read, typing, answer. */
export const REPLY_TIMING = { delivered: 600, read: 1400, reply: 3200 }

export interface Draft {
  text: string
  images: string[]
  attachment?: ChatAttachment
  replyToId?: string
}

interface ChatState {
  conversations: Conversation[]
  /** Who is typing in which conversation, if anyone. */
  typing: Record<string, string | undefined>
  activeId: string | null
}

type Action =
  | { type: 'open'; conversationId: string | null }
  | { type: 'append'; conversationId: string; message: ChatMessage }
  | { type: 'status'; conversationId: string; messageId: string; status: DeliveryStatus }
  | { type: 'typing'; conversationId: string; authorId?: string }
  | { type: 'react'; conversationId: string; messageId: string; emoji: string }
  | { type: 'delete'; conversationId: string; messageId: string }
  | { type: 'clear'; conversationId: string }
  | { type: 'toggle'; conversationId: string; flag: 'muted' | 'pinned' }
  | { type: 'members'; conversationId: string; memberIds: string[] }
  | { type: 'create'; conversation: Conversation }

function updateConversation(
  state: ChatState,
  conversationId: string,
  update: (conversation: Conversation) => Conversation,
): ChatState {
  return {
    ...state,
    conversations: state.conversations.map((conversation) =>
      conversation.id === conversationId ? update(conversation) : conversation,
    ),
  }
}

function updateMessage(
  state: ChatState,
  conversationId: string,
  messageId: string,
  update: (message: ChatMessage) => ChatMessage,
): ChatState {
  return updateConversation(state, conversationId, (conversation) => ({
    ...conversation,
    messages: conversation.messages.map((message) =>
      message.id === messageId ? update(message) : message,
    ),
  }))
}

function reducer(state: ChatState, action: Action): ChatState {
  switch (action.type) {
    case 'open': {
      const opened = { ...state, activeId: action.conversationId }
      if (!action.conversationId) return opened

      return updateConversation(opened, action.conversationId, (conversation) => ({
        ...conversation,
        unread: 0,
      }))
    }
    case 'append':
      return updateConversation(state, action.conversationId, (conversation) => ({
        ...conversation,
        messages: [...conversation.messages, action.message],
        // Something arriving in a chat that is not open is what the unread badge counts.
        unread:
          action.message.authorId !== ME && state.activeId !== conversation.id
            ? conversation.unread + 1
            : conversation.unread,
      }))
    case 'status':
      return updateMessage(state, action.conversationId, action.messageId, (message) => ({
        ...message,
        status: action.status,
      }))
    case 'typing':
      return { ...state, typing: { ...state.typing, [action.conversationId]: action.authorId } }
    case 'react':
      return updateMessage(state, action.conversationId, action.messageId, (message) => ({
        ...message,
        reactions: toggleReaction(message.reactions, action.emoji, ME),
      }))
    case 'delete':
      return updateConversation(state, action.conversationId, (conversation) => ({
        ...conversation,
        messages: conversation.messages.filter((message) => message.id !== action.messageId),
      }))
    case 'clear':
      return updateConversation(state, action.conversationId, (conversation) => ({
        ...conversation,
        messages: [],
      }))
    case 'toggle':
      return updateConversation(state, action.conversationId, (conversation) => ({
        ...conversation,
        [action.flag]: !conversation[action.flag],
      }))
    case 'members':
      return updateConversation(state, action.conversationId, (conversation) => ({
        ...conversation,
        memberIds: action.memberIds,
      }))
    case 'create':
      return { ...state, conversations: [...state.conversations, action.conversation] }
  }
}

/** A line in both languages, so a system message follows a later switch of language. */
function bothLanguages(build: (language: keyof typeof locales) => string): LocalizedText {
  return { en: build('en'), tr: build('tr') }
}

function nameIn(language: keyof typeof locales, id: string): string {
  return id === ME
    ? locales[language].chat.you
    : (chatContacts.find((c) => c.id === id)?.name ?? '')
}

let sentId = 0

/**
 * The conversations and what can be done with them. Nothing leaves the browser: the other
 * side is simulated, reading and answering the user's messages a moment later, so the
 * delivery ticks, the typing indicator and the unread badge can all be seen working.
 */
export function useChat(initialActiveId: string | null = null) {
  const [state, dispatch] = useReducer(reducer, undefined, (): ChatState => ({
    conversations: createSeedConversations(),
    typing: {},
    activeId: initialActiveId,
  }))
  const timers = useRef(new Set<number>())

  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach((timer) => window.clearTimeout(timer))
  }, [])

  const later = useCallback((delay: number, run: () => void) => {
    const timer = window.setTimeout(() => {
      timers.current.delete(timer)
      run()
    }, delay)
    timers.current.add(timer)
  }, [])

  const find = (conversationId: string) =>
    state.conversations.find((item) => item.id === conversationId)

  const nextId = () => {
    sentId += 1
    return `sent-${sentId}`
  }

  const system = (conversationId: string, text: LocalizedText) =>
    dispatch({
      type: 'append',
      conversationId,
      message: { id: nextId(), authorId: ME, system: true, sentAt: dayjs().toISOString(), text },
    })

  const send = (conversationId: string, draft: Draft) => {
    const conversation = find(conversationId)
    if (!conversation?.memberIds.includes(ME)) return

    const message: ChatMessage = {
      id: nextId(),
      authorId: ME,
      sentAt: dayjs().toISOString(),
      status: 'sent',
      ...(draft.text.trim() && { text: draft.text.trim() }),
      ...(draft.images.length > 0 && { images: draft.images }),
      ...(draft.attachment && { attachment: draft.attachment }),
      ...(draft.replyToId && { replyToId: draft.replyToId }),
    }
    dispatch({ type: 'append', conversationId, message })

    const others = conversation.memberIds.filter((id) => id !== ME)
    // A group answers from its members in turn, so a few messages bring in several people.
    const responder = others[conversation.messages.length % others.length]
    if (!responder) return

    const set = (status: DeliveryStatus) =>
      dispatch({ type: 'status', conversationId, messageId: message.id, status })

    later(REPLY_TIMING.delivered, () => set('delivered'))
    later(REPLY_TIMING.read, () => {
      set('read')
      dispatch({ type: 'typing', conversationId, authorId: responder })
    })
    later(REPLY_TIMING.reply, () => {
      const text: ChatText = autoReplies[sentId % autoReplies.length]!
      dispatch({ type: 'typing', conversationId })
      dispatch({
        type: 'append',
        conversationId,
        message: {
          id: nextId(),
          authorId: responder,
          sentAt: dayjs().toISOString(),
          text,
        },
      })
    })
  }

  return {
    conversations: state.conversations,
    typing: state.typing,
    activeId: state.activeId,
    open: useCallback(
      (conversationId: string | null) => dispatch({ type: 'open', conversationId }),
      [],
    ),
    send,
    react: (conversationId: string, messageId: string, emoji: string) =>
      dispatch({ type: 'react', conversationId, messageId, emoji }),
    remove: (conversationId: string, messageId: string) =>
      dispatch({ type: 'delete', conversationId, messageId }),
    clear: (conversationId: string) => dispatch({ type: 'clear', conversationId }),
    toggle: (conversationId: string, flag: 'muted' | 'pinned') =>
      dispatch({ type: 'toggle', conversationId, flag }),
    addMembers: (conversationId: string, memberIds: string[]) => {
      const conversation = find(conversationId)
      if (!conversation || memberIds.length === 0) return

      dispatch({
        type: 'members',
        conversationId,
        memberIds: [...conversation.memberIds, ...memberIds],
      })
      system(
        conversationId,
        bothLanguages((language) =>
          locales[language].chat.addedMembers
            .replace('{actor}', nameIn(language, ME))
            .replace('{names}', memberIds.map((id) => nameIn(language, id)).join(', ')),
        ),
      )
    },
    leave: (conversationId: string) => {
      const conversation = find(conversationId)
      if (!conversation) return

      dispatch({
        type: 'members',
        conversationId,
        memberIds: conversation.memberIds.filter((id) => id !== ME),
      })
      system(
        conversationId,
        bothLanguages((language) => locales[language].chat.youLeft),
      )
    },
    /** Opens the private chat with a contact, starting one if there is none yet. */
    message: (contactId: string) => {
      const existing = state.conversations.find(
        (conversation) =>
          conversation.kind === 'private' && conversation.memberIds.includes(contactId),
      )
      const conversationId = existing?.id ?? `c-${contactId}`

      if (!existing) {
        dispatch({
          type: 'create',
          conversation: {
            id: conversationId,
            kind: 'private',
            memberIds: [ME, contactId],
            messages: [],
            unread: 0,
          },
        })
      }
      dispatch({ type: 'open', conversationId })
    },
  }
}
