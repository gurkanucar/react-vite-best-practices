import { theme, type ConfigProviderProps, type ThemeConfig } from 'antd'
import {
  useBlossomTheme,
  useBootstrapTheme,
  useCartoonTheme,
  useGeekTheme,
  useGlassTheme,
  useIllustrationTheme,
  useLarkTheme,
  useMuiTheme,
  useSereneTheme,
  useShadcnTheme,
  useV4Theme,
} from '@/theme/official-presets'
import type { ResolvedColorMode, VisualTheme } from '@/theme/theme'

const baseComponents: NonNullable<ThemeConfig['components']> = {
  Layout: {
    bodyBg: '#f5f8ff',
    footerBg: '#f5f8ff',
    headerBg: '#ffffff',
    headerColor: 'rgba(0, 0, 0, 0.88)',
    siderBg: '#ffffff',
    triggerBg: '#f0f5ff',
    triggerColor: 'rgba(0, 0, 0, 0.88)',
  },
  Menu: { activeBarBorderWidth: 0, itemBg: 'transparent', subMenuItemBg: 'transparent' },
  Progress: {
    circleTextColor: 'rgba(0, 0, 0, 0.88)',
    defaultColor: '#1677ff',
    remainingColor: 'rgba(0, 0, 0, 0.06)',
  },
}

const darkComponents: NonNullable<ThemeConfig['components']> = {
  ...baseComponents,
  Layout: {
    bodyBg: '#050505',
    footerBg: '#050505',
    headerBg: '#111111',
    headerColor: 'rgba(255, 255, 255, 0.88)',
    siderBg: '#050505',
    triggerBg: '#111111',
    triggerColor: 'rgba(255, 255, 255, 0.88)',
  },
  Menu: {
    darkItemBg: 'transparent',
    darkItemColor: 'rgba(255, 255, 255, 0.68)',
    darkItemHoverBg: 'rgba(255, 255, 255, 0.08)',
    darkItemHoverColor: '#fff',
    darkItemSelectedBg: 'rgba(22, 119, 255, 0.28)',
    darkItemSelectedColor: '#fff',
    darkSubMenuItemBg: 'transparent',
  },
  Progress: {
    circleTextColor: 'rgba(255, 255, 255, 0.88)',
    defaultColor: '#1677ff',
    remainingColor: 'rgba(255, 255, 255, 0.12)',
  },
}

const sharedProviderProps: ConfigProviderProps = {
  wave: {},
  app: {},
  card: {},
  modal: {},
  button: {},
  alert: {},
  colorPicker: {},
  checkbox: {},
  dropdown: {},
  select: {},
  datePicker: {},
  input: {},
  inputNumber: {},
  popover: {},
  tooltip: {},
  notification: {},
  switch: {},
  radio: {},
  segmented: {},
  progress: {},
}

export const officialThemeBackgrounds: Partial<Record<VisualTheme, string>> = {
  'ant-design':
    'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*T8IlRaNez08AAAAARwAAAAgAegCCAQ/original',
  mui: 'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*IFkZRpIKEEkAAAAAQzAAAAgAegCCAQ/original',
  shadcn:
    'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*56tPQbwgFyEAAAAARuAAAAgAegCCAQ/original',
  cartoon:
    'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*tgpBT7vYIUsAAAAAQ-AAAAgAegCCAQ/original',
  dark: 'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*ETkNSJ-oUGwAAAAAQ_AAAAgAegCCAQ/original',
  illustration:
    'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*HuVGQKqOER0AAAAARsAAAAgAegCCAQ/original',
  geek: 'https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*fzA2T4ms154AAAAARtAAAAgAegCCAQ/original',
  document:
    'https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*iM6CQ496P3oAAAAAAAAAAAAADrJ8AQ/fmt.webp',
  blossom:
    'https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*s5OdR6wZZIkAAAAAAAAAAAAADrJ8AQ/fmt.webp',
}

export function useOfficialTheme(
  visualTheme: VisualTheme,
  resolvedColorMode: ResolvedColorMode,
  compact: boolean,
): ConfigProviderProps {
  const blossom = useBlossomTheme()
  const bootstrap = useBootstrapTheme()
  const cartoon = useCartoonTheme()
  const geek = useGeekTheme()
  const glass = useGlassTheme()
  const illustration = useIllustrationTheme()
  const document = useLarkTheme()
  const mui = useMuiTheme()
  const serene = useSereneTheme()
  const shadcn = useShadcnTheme()
  const v4 = useV4Theme()

  const selected =
    visualTheme === 'ant-design'
      ? {
          ...sharedProviderProps,
          theme: {
            algorithm: resolvedColorMode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
            components: resolvedColorMode === 'dark' ? darkComponents : baseComponents,
          },
        }
      : visualTheme === 'dark'
        ? {
            ...sharedProviderProps,
            theme: { algorithm: theme.darkAlgorithm, components: darkComponents },
          }
        : (
            {
              blossom,
              bootstrap,
              cartoon,
              geek,
              glass,
              illustration,
              document,
              mui,
              serene,
              shadcn,
              'ant-design-v4': v4,
            } as const
          )[visualTheme]

  if (!compact || !selected.theme) return selected

  const algorithm = selected.theme.algorithm
  const algorithms = Array.isArray(algorithm) ? algorithm : algorithm ? [algorithm] : []

  return {
    ...selected,
    theme: { ...selected.theme, algorithm: [...algorithms, theme.compactAlgorithm] },
  }
}
