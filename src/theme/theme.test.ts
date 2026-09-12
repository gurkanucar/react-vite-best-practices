import { describe, expect, it } from 'vitest'
import { resolveColorMode, visualThemeOptions } from '@/theme/theme'

describe('resolveColorMode', () => {
  it('resolves the system preference and preserves explicit choices', () => {
    expect(resolveColorMode('system', true)).toBe('dark')
    expect(resolveColorMode('system', false)).toBe('light')
    expect(resolveColorMode('light', true)).toBe('light')
    expect(resolveColorMode('dark', false)).toBe('dark')
  })
})

describe('visualThemeOptions', () => {
  it('contains only the supported visual presets', () => {
    expect(visualThemeOptions.map(({ value }) => value)).toEqual([
      'ant-design',
      'mui',
      'shadcn',
      'bootstrap',
      'illustration',
    ])
  })
})
