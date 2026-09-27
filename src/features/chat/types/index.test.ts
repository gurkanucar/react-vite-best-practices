import { describe, expect, it } from 'vitest'
import {
  buildTimeline,
  isEmojiOnly,
  ME,
  toggleReaction,
  type ChatMessage,
} from '@/features/chat/types'

function msg(id: string, authorId: string, sentAt: string, extra: Partial<ChatMessage> = {}) {
  return { id, authorId, sentAt, text: id, ...extra }
}

describe('buildTimeline', () => {
  it('groups messages from one person that follow closely, and splits on a new author', () => {
    const entries = buildTimeline([
      msg('a1', 'ayse', '2026-09-27T10:00:00'),
      msg('a2', 'ayse', '2026-09-27T10:02:00'),
      msg('m1', ME, '2026-09-27T10:03:00'),
      msg('a3', 'ayse', '2026-09-27T10:04:00'),
    ])

    expect(entries.map((entry) => entry.kind)).toEqual([
      'day',
      'message',
      'message',
      'message',
      'message',
    ])
    const runs = entries.flatMap((entry) =>
      entry.kind === 'message' ? [[entry.key, entry.first, entry.last]] : [],
    )
    expect(runs).toEqual([
      ['a1', true, false],
      ['a2', false, true],
      ['m1', true, true],
      ['a3', true, true],
    ])
  })

  it('starts a new run after a pause, and a new day gets one divider even after a system line', () => {
    const entries = buildTimeline([
      msg('s1', 'can', '2026-09-26T09:00:00', { system: true }),
      msg('c1', 'can', '2026-09-26T09:01:00'),
      msg('c2', 'can', '2026-09-26T09:30:00'),
      msg('c3', 'can', '2026-09-27T09:31:00'),
    ])

    expect(entries.map((entry) => entry.key)).toEqual([
      'day:2026-09-26',
      's1',
      'c1',
      'c2',
      'day:2026-09-27',
      'c3',
    ])
    expect(entries.filter((entry) => entry.kind === 'message').every((entry) => entry.first)).toBe(
      true,
    )
  })
})

describe('isEmojiOnly', () => {
  it('accepts up to three emoji and nothing else', () => {
    expect(isEmojiOnly('👍')).toBe(true)
    expect(isEmojiOnly('🎉🎉🎉')).toBe(true)
    expect(isEmojiOnly('👍🏽 ❤️')).toBe(true)
    expect(isEmojiOnly('🎉🎉🎉🎉')).toBe(false)
    expect(isEmojiOnly('Nice 👍')).toBe(false)
    expect(isEmojiOnly('123')).toBe(false)
    expect(isEmojiOnly('')).toBe(false)
  })
})

describe('toggleReaction', () => {
  it('adds, replaces and takes back the user’s one reaction', () => {
    const added = toggleReaction({ '👍': ['can'] }, '👍', ME)
    expect(added).toEqual({ '👍': ['can', ME] })

    const replaced = toggleReaction(added, '❤️', ME)
    expect(replaced).toEqual({ '👍': ['can'], '❤️': [ME] })

    expect(toggleReaction(replaced, '❤️', ME)).toEqual({ '👍': ['can'] })
  })
})
