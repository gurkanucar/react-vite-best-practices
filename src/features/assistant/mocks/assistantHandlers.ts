import { delay, http, HttpResponse } from 'msw'
import { env } from '@/config/env'
import { ASSISTANT_CHAT_PATH, type ChatRequest } from '@/features/assistant/types'

const ANSWERS: { match: RegExp; reply: string }[] = [
  {
    match: /filter|sort|table/i,
    reply:
      'Both list pages keep their filters, sorting, and pagination in the URL, so a filtered table can be linked and reloaded. Sorting is sent to the API rather than applied to the rows already on screen — see docs/021 and docs/023.',
  },
  {
    match: /mock|msw|flag/i,
    reply:
      'MSW answers the post and assistant endpoints in development, while product requests still reach the real DummyJSON service. Each mocked feature has its own flag, and the worker only starts when at least one of them is on.',
  },
  {
    match: /pdf|document/i,
    reply:
      'The PDF page fetches the file as a blob through the shared API client and renders it with pdf.js. An iframe cannot do that once the endpoint needs an Authorization header.',
  },
  {
    match: /docker|deploy|nginx/i,
    reply:
      'The image builds with Node and pnpm, then serves only the generated static files from Nginx. Deep links fall back to index.html, and /healthz answers the container health check.',
  },
]

const FALLBACK =
  'This assistant is a demonstration of the Ant Design X components. Its answers come from an MSW handler rather than a model, so nothing leaves the browser. Ask about filters, mocking, PDFs, or Docker to see a longer reply.'

function answerFor(prompt: string): string {
  return ANSWERS.find(({ match }) => match.test(prompt))?.reply ?? FALLBACK
}

/**
 * The reply is streamed a word at a time, because that is what a real completion
 * endpoint does and it is the difference the interface has to be built around.
 */
export const assistantHandlers = [
  http.post(`${env.apiBaseUrl}${ASSISTANT_CHAT_PATH}`, async ({ request }) => {
    const { prompt } = (await request.json()) as ChatRequest
    const words = answerFor(prompt).match(/\S+\s*/g) ?? []
    const encoder = new TextEncoder()

    const stream = new ReadableStream({
      async start(controller) {
        for (const word of words) {
          await delay(35)
          controller.enqueue(encoder.encode(word))
        }

        controller.close()
      },
    })

    return new HttpResponse(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  }),
]
