import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { streamAssistantReply } from '@/features/assistant/api'
import { mockServer } from '@/mocks/server'

beforeAll(() => mockServer.listen({ onUnhandledRequest: 'error' }))
afterEach(() => mockServer.resetHandlers())
afterAll(() => mockServer.close())

describe('streamAssistantReply', () => {
  it('yields the answer in pieces rather than in one response', async () => {
    const chunks: string[] = []

    for await (const chunk of streamAssistantReply({ prompt: 'How does filtering work?' })) {
      chunks.push(chunk)
    }

    // The point of the endpoint is that the interface can render a partial answer.
    expect(chunks.length).toBeGreaterThan(1)
    expect(chunks.join('')).toContain('URL')
  })

  it('stops reading when the caller aborts', async () => {
    const whole: string[] = []
    for await (const chunk of streamAssistantReply({ prompt: 'docker' })) {
      whole.push(chunk)
    }

    const controller = new AbortController()
    const received: string[] = []

    for await (const chunk of streamAssistantReply({ prompt: 'docker' }, controller.signal)) {
      received.push(chunk)
      if (received.length === 2) controller.abort()
    }

    // Aborting ends the stream rather than throwing, so the caller keeps what arrived.
    expect(whole.length).toBeGreaterThan(5)
    expect(received.length).toBeLessThan(whole.length)
  })
})
