import { env } from '@/config/env'
import { ASSISTANT_CHAT_PATH, type ChatRequest } from '@/features/assistant/types'
import { ApiError } from '@/lib/api/api-client'

/**
 * The shared client resolves a whole response before returning it, which is exactly what
 * a completion endpoint must not do. This reads the body as it arrives instead, so the
 * interface can render the answer while it is still being written.
 */
export async function* streamAssistantReply(
  input: ChatRequest,
  signal?: AbortSignal,
): AsyncGenerator<string> {
  const response = await fetch(`${env.apiBaseUrl}${ASSISTANT_CHAT_PATH}`, {
    body: JSON.stringify(input),
    headers: { Accept: 'text/plain', 'Content-Type': 'application/json' },
    method: 'POST',
    signal,
  })

  if (!response.ok || !response.body) {
    throw new ApiError(`Assistant request failed with status ${response.status}`, response.status)
  }

  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader()

  try {
    while (true) {
      const { done, value } = await reader.read()

      if (done) return
      if (value) yield value

      // Aborting the request does not reliably end a body that has already started
      // arriving, so the signal is checked here as well. Without this the stop button
      // would hide the answer while the rest of it kept downloading.
      if (signal?.aborted) return
    }
  } finally {
    // Runs when the loop ends, aborts, or the consumer stops reading early.
    await reader.cancel().catch(() => undefined)
  }
}
