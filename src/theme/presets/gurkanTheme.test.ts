import { renderHook } from '@testing-library/react'
import { theme } from 'antd'
import { describe, expect, it } from 'vitest'
import useGurkanTheme from '@/theme/presets/gurkanTheme'
import { useOfficialTheme } from '@/theme/useOfficialTheme'

describe('useGurkanTheme', () => {
  it('carries a palette of its own for each colour mode', () => {
    const { result: light } = renderHook(() => useGurkanTheme('light'))
    const { result: dark } = renderHook(() => useGurkanTheme('dark'))

    expect(light.current.theme?.token?.colorBgContainer).toBe('#ffffff')
    expect(dark.current.theme?.token?.colorBgContainer).toBe('#1c252e')
    // The brand colour is the one thing that does not change between them.
    expect(dark.current.theme?.token?.colorPrimary).toBe(light.current.theme?.token?.colorPrimary)
  })

  it('keeps its shape tokens in both modes', () => {
    const { result } = renderHook(() => useGurkanTheme('dark'))

    expect(result.current.theme?.token?.borderRadiusLG).toBe(16)
    expect(result.current.theme?.token?.controlHeight).toBe(40)
  })

  it('carries the reference surface language into form and overlay components', () => {
    const { result } = renderHook(() => useGurkanTheme('light'))

    expect(result.current.theme?.components?.Input?.colorBgContainer).toBe('#f4f6f8')
    expect(result.current.theme?.components?.Input?.colorBorder).toBe('transparent')
    expect(result.current.theme?.components?.Select?.optionSelectedBg).toBe(
      'rgba(24, 119, 242, 0.08)',
    )
    expect(result.current.theme?.components?.Modal?.borderRadiusLG).toBe(16)
  })
})

describe('useOfficialTheme with the Gurkan preset', () => {
  it('leaves its dark palette alone rather than deriving one', () => {
    const { result } = renderHook(() => useOfficialTheme('gurkan', 'dark', false))

    // The shared dark variant would force these to the generic near-black values.
    expect(result.current.theme?.token?.colorBgContainer).toBe('#1c252e')
    expect(result.current.theme?.token?.colorBgBase).toBe('#141a21')
    expect(result.current.theme?.components?.Layout?.siderBg).toBe('#1c252e')
  })

  it('still derives a dark variant for the light-only presets', () => {
    const { result } = renderHook(() => useOfficialTheme('shadcn', 'dark', false))

    expect(result.current.theme?.token?.colorBgContainer).toBe('#141414')
  })

  it('adds the compact algorithm on request', () => {
    const { result } = renderHook(() => useOfficialTheme('gurkan', 'light', true))
    const algorithms = result.current.theme?.algorithm

    expect(Array.isArray(algorithms) ? algorithms : [algorithms]).toContain(theme.compactAlgorithm)
  })
})
