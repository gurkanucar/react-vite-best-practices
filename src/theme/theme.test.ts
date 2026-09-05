import { describe, expect, it } from 'vitest'
import { resolveColorMode, resolveVisualThemeColorMode } from '@/theme/theme'

describe('resolveColorMode', () => {
  it('resolves the system preference and preserves explicit choices', () => {
    expect(resolveColorMode('system', true)).toBe('dark')
    expect(resolveColorMode('system', false)).toBe('light')
    expect(resolveColorMode('light', true)).toBe('light')
    expect(resolveColorMode('dark', false)).toBe('dark')
  })
})

describe('resolveVisualThemeColorMode', () => {
  it('keeps the selected mode except for the dedicated dark preset', () => {
    expect(resolveVisualThemeColorMode('light', 'ant-design')).toBe('light')
    expect(resolveVisualThemeColorMode('light', 'dark')).toBe('dark')
    expect(resolveVisualThemeColorMode('dark', 'blossom')).toBe('dark')
  })
})
