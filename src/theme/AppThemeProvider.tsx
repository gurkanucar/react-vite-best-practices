import { useEffect, useState, type ReactNode } from 'react'
import { App as AntApp, ConfigProvider } from 'antd'
import { resolveColorMode } from '@/theme/theme'
import { usePreferencesStore } from '@/store/preferences-store'
import { useOfficialTheme } from '@/theme/useOfficialTheme'

const colorSchemeQuery = '(prefers-color-scheme: dark)'

function systemPrefersDark(): boolean {
  return window.matchMedia?.(colorSchemeQuery).matches ?? false
}

interface AppThemeProviderProps {
  children: ReactNode
}

export function AppThemeProvider({ children }: AppThemeProviderProps) {
  const colorMode = usePreferencesStore((state) => state.colorMode)
  const compact = usePreferencesStore((state) => state.compact)
  const language = usePreferencesStore((state) => state.language)
  const visualTheme = usePreferencesStore((state) => state.visualTheme)
  const [prefersDark, setPrefersDark] = useState(systemPrefersDark)
  const resolvedColorMode = resolveColorMode(colorMode, prefersDark)
  const providerProps = useOfficialTheme(visualTheme, resolvedColorMode, compact)

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  useEffect(() => {
    const mediaQuery = window.matchMedia?.(colorSchemeQuery)

    if (!mediaQuery) {
      return undefined
    }

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersDark(event.matches)
    }

    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = resolvedColorMode
    document.documentElement.dataset.visualTheme = visualTheme
    document.documentElement.style.colorScheme = resolvedColorMode

    document
      .querySelector<HTMLMetaElement>('#theme-color')
      ?.setAttribute('content', resolvedColorMode === 'dark' ? '#0b101b' : '#f5f8fc')
  }, [visualTheme, resolvedColorMode])

  return (
    <ConfigProvider {...providerProps}>
      <AntApp>{children}</AntApp>
    </ConfigProvider>
  )
}
