import { assistantHandlers } from '@/features/assistant/mocks'
import { postHandlers } from '@/features/posts/mocks'

export const handlers = [...assistantHandlers, ...postHandlers]
