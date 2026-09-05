export type ColorMode = 'system' | 'light' | 'dark'
export type ResolvedColorMode = Exclude<ColorMode, 'system'>
export type VisualTheme =
  | 'ant-design'
  | 'mui'
  | 'shadcn'
  | 'bootstrap'
  | 'cartoon'
  | 'dark'
  | 'illustration'
  | 'glass'
  | 'geek'
  | 'document'
  | 'blossom'
  | 'ant-design-v4'
  | 'serene'

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
  { value: 'cartoon', label: 'Cartoon', color: '#ffb300' },
  { value: 'dark', label: 'Dark', color: '#111827' },
  { value: 'illustration', label: 'Illustration', color: '#6d5dfc' },
  { value: 'glass', label: 'Glass', color: '#06b6d4' },
  { value: 'geek', label: 'Geek', color: '#13c2c2' },
  { value: 'document', label: 'Document', color: '#2f54eb' },
  { value: 'blossom', label: 'Blossom', color: '#eb2f96' },
  { value: 'ant-design-v4', label: 'Ant Design V4', color: '#1890ff' },
  { value: 'serene', label: 'Serene Icon', color: '#5b8c85' },
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

export function resolveVisualThemeColorMode(
  resolvedColorMode: ResolvedColorMode,
  visualTheme: VisualTheme,
): ResolvedColorMode {
  return visualTheme === 'dark' ? 'dark' : resolvedColorMode
}
