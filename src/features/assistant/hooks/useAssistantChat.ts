import { useRef, useState } from 'react'
import { streamAssistantReply } from '@/features/assistant/api'
import type { ChatMessage } from '@/features/assistant/types'

let messageCounter = 0

function nextId(): string {
  messageCounter += 1
  return String(messageCounter)
}

/**
 * A streamed conversation is local, ordered, append-only state, not a server cache, so it
 * stays in the component rather than in TanStack Query. The request is abortable, because
 * a long answer the reader no longer wants should stop arriving.
 */
export function useAssistantChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const appendChunk = (id: string, chunk: string) => {
    setMessages((current) =>
      current.map((message) =>
        message.id === id ? { ...message, content: message.content + chunk } : message,
      ),
    )
  }

  const finish = (id: string) => {
    setMessages((current) =>
      current.map((message) => (message.id === id ? { ...message, streaming: false } : message)),
    )
    setIsStreaming(false)
    abortRef.current = null
  }

  const send = async (prompt: string) => {
    const trimmed = prompt.trim()
    if (!trimmed || isStreaming) return

    const replyId = nextId()
    const controller = new AbortController()
    abortRef.current = controller

    setError(null)
    setIsStreaming(true)
    setMessages((current) => [
      ...current,
      { content: trimmed, id: nextId(), role: 'user' },
      { content: '', id: replyId, role: 'assistant', streaming: true },
    ])

    try {
      for await (const chunk of streamAssistantReply({ prompt: trimmed }, controller.signal)) {
        appendChunk(replyId, chunk)
      }
    } catch (caught) {
      // Aborting is a deliberate stop, so it keeps whatever arrived rather than erroring.
      if (!controller.signal.aborted) {
        setError(caught instanceof Error ? caught : new Error(String(caught)))
      }
    } finally {
      finish(replyId)
    }
  }

  return {
    cancel: () => abortRef.current?.abort(),
    clear: () => setMessages([]),
    error,
    isStreaming,
    messages,
    send,
  }
}
