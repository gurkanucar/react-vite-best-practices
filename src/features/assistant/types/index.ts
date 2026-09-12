export type ChatRole = 'user' | 'assistant'

export interface ChatMessage {
  content: string
  id: string
  role: ChatRole
  /** True while tokens are still arriving for this message. */
  streaming?: boolean
}

export interface ChatRequest {
  prompt: string
}

export const ASSISTANT_CHAT_PATH = '/chat'
