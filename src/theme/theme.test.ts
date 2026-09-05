import { describe, expect, it } from 'vitest'
import { resolveColorMode, resolveVisualThemeColorMode, supportsColorMode } from '@/theme/theme'

describe('resolveColorMode', () => {
  it('resolves the system preference and preserves explicit choices', () => {
    expect(resolveColorMode('system', true)).toBe('dark')
    expect(resolveColorMode('system', false)).toBe('light')
    expect(resolveColorMode('light', true)).toBe('light')
    expect(resolveColorMode('dark', false)).toBe('dark')
  })
})

describe('resolveVisualThemeColorMode', () => {
  it('uses the selected mode for themes that support color switching', () => {
    expect(resolveVisualThemeColorMode('light', 'ant-design')).toBe('light')
    expect(resolveVisualThemeColorMode('dark', 'ant-design')).toBe('dark')
    expect(resolveVisualThemeColorMode('light', 'dark')).toBe('dark')
    expect(resolveVisualThemeColorMode('light', 'geek')).toBe('dark')
    expect(resolveVisualThemeColorMode('dark', 'blossom')).toBe('dark')
    expect(resolveVisualThemeColorMode('light', 'illustration')).toBe('light')
  })

  it('reports whether a visual theme supports color mode switching', () => {
    expect(supportsColorMode('ant-design')).toBe(true)
    expect(supportsColorMode('illustration')).toBe(true)
    expect(supportsColorMode('mui')).toBe(true)
    expect(supportsColorMode('dark')).toBe(false)
    expect(supportsColorMode('geek')).toBe(false)
  })
})
