export type ColorMode = 'system' | 'light' | 'dark'
export type ResolvedColorMode = Exclude<ColorMode, 'system'>
export type VisualTheme = 'ant-design' | 'mui' | 'shadcn' | 'bootstrap' | 'illustration'

export interface VisualThemeOption {
  value: VisualTheme
  label: string
  color: string
}

export const visualThemeOptions: VisualThemeOption[] = [
  { value: 'ant-design', label: 'Ant Design', color: '#1677ff' },
  { value: 'mui', label: 'MUI', color: '#1976d2' },
  { value: 'shadcn', label: 'shadcn', color: '#18181b' },
  { value: 'bootstrap', label: 'Bootstrap', color: '#7952b3' },
  { value: 'illustration', label: 'Illustration', color: '#6d5dfc' },
]

export interface ThemePreferences {
  colorMode: ColorMode
  compact: boolean
  visualTheme: VisualTheme
}

export const defaultThemePreferences: ThemePreferences = {
  colorMode: 'system',
  compact: false,
  visualTheme: 'ant-design',
}

export function resolveColorMode(
  colorMode: ColorMode,
  systemPrefersDark: boolean,
): ResolvedColorMode {
  if (colorMode === 'system') {
    return systemPrefersDark ? 'dark' : 'light'
  }

  return colorMode
}
