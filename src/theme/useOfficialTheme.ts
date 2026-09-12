import { theme, type ConfigProviderProps, type ThemeConfig } from 'antd'
import antDesignBackground from '@/assets/theme-backgrounds/ant-design.jpg'
import illustrationBackground from '@/assets/theme-backgrounds/illustration.jpg'
import muiBackground from '@/assets/theme-backgrounds/mui.jpg'
import shadcnBackground from '@/assets/theme-backgrounds/shadcn.jpg'
import {
  useBootstrapTheme,
  useIllustrationTheme,
  useMuiTheme,
  useShadcnTheme,
} from '@/theme/official-presets'
import { useGurkanTheme } from '@/theme/presets'
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

const darkVariantToken: NonNullable<ThemeConfig['token']> = {
  colorBgBase: '#000000',
  colorBgContainer: '#141414',
  colorBgElevated: '#1f1f1f',
  colorBgLayout: '#000000',
  colorBgTextActive: 'rgba(255, 255, 255, 0.15)',
  colorBgTextHover: 'rgba(255, 255, 255, 0.12)',
  colorBorder: '#424242',
  colorBorderSecondary: '#303030',
  colorFill: 'rgba(255, 255, 255, 0.18)',
  colorFillQuaternary: 'rgba(255, 255, 255, 0.04)',
  colorFillSecondary: 'rgba(255, 255, 255, 0.12)',
  colorFillTertiary: 'rgba(255, 255, 255, 0.08)',
  colorIcon: 'rgba(255, 255, 255, 0.65)',
  colorIconHover: 'rgba(255, 255, 255, 0.85)',
  colorSplit: '#303030',
  colorText: 'rgba(255, 255, 255, 0.85)',
  colorTextBase: '#ffffff',
  colorTextDescription: 'rgba(255, 255, 255, 0.65)',
  colorTextDisabled: 'rgba(255, 255, 255, 0.25)',
  colorTextHeading: 'rgba(255, 255, 255, 0.85)',
  colorTextLabel: 'rgba(255, 255, 255, 0.65)',
  colorTextPlaceholder: 'rgba(255, 255, 255, 0.25)',
  colorTextQuaternary: 'rgba(255, 255, 255, 0.25)',
  colorTextSecondary: 'rgba(255, 255, 255, 0.65)',
  colorTextTertiary: 'rgba(255, 255, 255, 0.45)',
}

const preservedBrandColorTokens = new Set([
  'colorError',
  'colorInfo',
  'colorLink',
  'colorPrimary',
  'colorSuccess',
  'colorWarning',
])

function retainDarkSafeTokens<T extends object>(tokens: T | undefined): T {
  if (!tokens) return {} as T

  return Object.fromEntries(
    Object.entries(tokens).filter(
      ([name]) =>
        preservedBrandColorTokens.has(name) || !/(?:color|bg$|background|fill|shadow)/i.test(name),
    ),
  ) as T
}

function createDarkSafeComponents(
  components: NonNullable<ThemeConfig['components']>,
): NonNullable<ThemeConfig['components']> {
  return Object.fromEntries(
    Object.entries(components).map(([name, config]) => [
      name,
      config && typeof config === 'object' ? retainDarkSafeTokens(config) : config,
    ]),
  ) as NonNullable<ThemeConfig['components']>
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
  'ant-design': antDesignBackground,
  mui: muiBackground,
  shadcn: shadcnBackground,
  illustration: illustrationBackground,
}

export function useOfficialTheme(
  visualTheme: VisualTheme,
  resolvedColorMode: ResolvedColorMode,
  compact: boolean,
): ConfigProviderProps {
  const bootstrap = useBootstrapTheme()
  const illustration = useIllustrationTheme()
  const gurkan = useGurkanTheme(resolvedColorMode)
  const mui = useMuiTheme()
  const shadcn = useShadcnTheme()

  const selected =
    visualTheme === 'ant-design'
      ? {
          ...sharedProviderProps,
          theme: {
            algorithm: resolvedColorMode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
            components: resolvedColorMode === 'dark' ? darkComponents : baseComponents,
          },
        }
      : ({ bootstrap, gurkan, illustration, mui, shadcn } as const)[visualTheme]

  /*
   * The presets adapted from the Ant Design website are light-only, so a dark variant is
   * derived for them below by stripping their colours and applying a shared dark palette.
   * A preset that ships both palettes has to be left alone, or that stripping would throw
   * away the very greys that make it what it is.
   */
  const ownsDarkMode = visualTheme === 'gurkan'

  if (!selected.theme) return selected

  const algorithm = selected.theme.algorithm
  const algorithms = Array.isArray(algorithm) ? algorithm : algorithm ? [algorithm] : []
  const colorAlgorithm = resolvedColorMode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm
  const hasColorAlgorithm = algorithms.some(
    (currentAlgorithm) =>
      currentAlgorithm === theme.defaultAlgorithm || currentAlgorithm === theme.darkAlgorithm,
  )
  const mappedAlgorithms = algorithms.map((currentAlgorithm) =>
    currentAlgorithm === theme.defaultAlgorithm || currentAlgorithm === theme.darkAlgorithm
      ? colorAlgorithm
      : currentAlgorithm,
  )
  const colorAwareAlgorithms = !hasColorAlgorithm
    ? [colorAlgorithm, ...mappedAlgorithms]
    : mappedAlgorithms

  if (compact) {
    colorAwareAlgorithms.push(theme.compactAlgorithm)
  }

  const applyDarkVariant = resolvedColorMode === 'dark' && !ownsDarkMode
  const selectedComponents = selected.theme.components ?? {}
  const colorSafeComponents = applyDarkVariant
    ? createDarkSafeComponents(selectedComponents)
    : selectedComponents
  const darkVariantComponents: NonNullable<ThemeConfig['components']> = applyDarkVariant
    ? {
        ...colorSafeComponents,
        Card: { ...colorSafeComponents.Card, colorBgContainer: '#141414' },
        Layout: { ...colorSafeComponents.Layout, ...darkComponents.Layout },
        Menu: { ...colorSafeComponents.Menu, ...darkComponents.Menu },
        Progress: {
          ...colorSafeComponents.Progress,
          circleTextColor: 'rgba(255, 255, 255, 0.85)',
          remainingColor: 'rgba(255, 255, 255, 0.12)',
        },
      }
    : colorSafeComponents

  return {
    ...(applyDarkVariant ? sharedProviderProps : selected),
    theme: {
      ...selected.theme,
      algorithm: colorAwareAlgorithms,
      components: darkVariantComponents,
      token: {
        ...(applyDarkVariant
          ? retainDarkSafeTokens(selected.theme.token ?? {})
          : selected.theme.token),
        ...(applyDarkVariant ? darkVariantToken : {}),
      },
    },
  }
}
