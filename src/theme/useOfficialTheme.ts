import { theme, type ConfigProviderProps, type ThemeConfig } from 'antd'
import antDesignBackground from '@/assets/theme-backgrounds/ant-design.jpg'
import gurkanBackground from '@/assets/theme-backgrounds/gurkan.jpg'
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

/**
 * The presets adapted from the Ant Design website. Gurkan is left out: it owns both of its
 * palettes, so its surfaces are tuned in its own file rather than overridden here.
 */
type AdaptedVisualTheme = Exclude<VisualTheme, 'ant-design' | 'gurkan'>

interface SurfacePalette {
  border: string
  borderSecondary: string
  container: string
  fill: string
  fillSubtle: string
  tableHeader: string
}

const lightSurfacePalettes: Record<AdaptedVisualTheme, SurfacePalette> = {
  mui: {
    border: 'rgba(0, 0, 0, 0.23)',
    borderSecondary: 'rgba(0, 0, 0, 0.16)',
    container: '#ffffff',
    fill: 'rgba(0, 0, 0, 0.08)',
    fillSubtle: 'rgba(0, 0, 0, 0.04)',
    tableHeader: '#f5f5f5',
  },
  shadcn: {
    border: '#d4d4d8',
    borderSecondary: '#e4e4e7',
    container: '#ffffff',
    fill: '#e4e4e7',
    fillSubtle: '#f4f4f5',
    tableHeader: '#f4f4f5',
  },
  bootstrap: {
    border: '#adb5bd',
    borderSecondary: '#ced4da',
    container: '#ffffff',
    fill: '#dee2e6',
    fillSubtle: '#f1f3f5',
    tableHeader: '#e9ecef',
  },
  illustration: {
    border: '#2c2c2c',
    borderSecondary: '#2c2c2c',
    container: '#ffffff',
    fill: '#ffe7ba',
    fillSubtle: '#fff0f6',
    tableHeader: '#fff0f6',
  },
}

const genericDarkSurface: SurfacePalette = {
  border: '#525252',
  borderSecondary: '#3f3f3f',
  container: '#141414',
  fill: 'rgba(255, 255, 255, 0.12)',
  fillSubtle: 'rgba(255, 255, 255, 0.08)',
  tableHeader: '#242424',
}

const darkSurfacePalettes: Record<AdaptedVisualTheme, SurfacePalette> = {
  bootstrap: genericDarkSurface,
  illustration: genericDarkSurface,
  mui: genericDarkSurface,
  shadcn: genericDarkSurface,
}

interface DarkBrandOverride {
  token?: NonNullable<ThemeConfig['token']>
  components?: NonNullable<ThemeConfig['components']>
}

/*
 * The dark variant keeps each preset's brand colours, which only works while they read on
 * a near-black surface. Two of them do not.
 */
const darkBrandOverrides: Partial<Record<AdaptedVisualTheme, DarkBrandOverride>> = {
  /*
   * shadcn's primary is near-black, so kept as it is it vanishes: the active tab, the
   * selected menu entry, progress and primary buttons all sat at about 1.2:1. shadcn's own
   * dark palette inverts instead — a near-white primary with dark text on it — and that is
   * what this follows, down to the light tooltip.
   */
  shadcn: {
    token: {
      colorPrimary: '#fafafa',
      colorPrimaryHover: '#e4e4e7',
      colorPrimaryActive: '#d4d4d8',
      colorPrimaryBg: '#27272a',
      colorPrimaryBgHover: '#3f3f46',
      colorPrimaryBorder: '#52525b',
      colorPrimaryBorderHover: '#71717a',
      colorPrimaryText: '#fafafa',
      colorPrimaryTextHover: '#e4e4e7',
      colorPrimaryTextActive: '#d4d4d8',
      colorInfo: '#a1a1aa',
      colorInfoBg: '#1f1f23',
      colorInfoBorder: '#3f3f46',
      colorInfoText: '#e4e4e7',
      colorLink: '#fafafa',
      colorLinkHover: '#d4d4d8',
      colorLinkActive: '#a1a1aa',
      colorTextLightSolid: '#18181b',
      colorWhite: '#18181b',
      colorBgSpotlight: '#fafafa',
    },
    components: {
      Avatar: { colorTextLightSolid: '#fafafa' },
      Button: { dangerColor: '#fafafa' },
      Image: { previewOperationColor: 'rgba(255, 255, 255, 0.85)' },
      Progress: { defaultColor: '#fafafa' },
    },
  },
  // The full-width selected row lost its tint on black; MUI's dark palette uses its light blue.
  mui: {
    components: {
      Menu: {
        itemSelectedBg: 'rgba(144, 202, 249, 0.16)',
        itemSelectedColor: '#90caf9',
        subMenuItemSelectedColor: '#90caf9',
      },
    },
  },
  // White on the illustration green is 3:1; the theme's own ink colour reads at 8:1.
  illustration: {
    components: {
      Button: { primaryColor: '#141414' },
    },
  },
}

function createSurfaceTokens(
  visualTheme: AdaptedVisualTheme,
  mode: ResolvedColorMode,
): NonNullable<ThemeConfig['token']> {
  const palette =
    mode === 'dark' ? darkSurfacePalettes[visualTheme] : lightSurfacePalettes[visualTheme]

  return {
    colorBorder: palette.border,
    colorBorderSecondary: palette.borderSecondary,
    colorSplit: palette.borderSecondary,
    colorFillSecondary: palette.fill,
    colorFillTertiary: palette.fillSubtle,
    colorFillQuaternary: palette.fillSubtle,
  }
}

function applySurfaceContrast(
  components: NonNullable<ThemeConfig['components']>,
  visualTheme: AdaptedVisualTheme,
  mode: ResolvedColorMode,
): NonNullable<ThemeConfig['components']> {
  const palette =
    mode === 'dark' ? darkSurfacePalettes[visualTheme] : lightSurfacePalettes[visualTheme]

  return {
    ...components,
    Alert: { ...components.Alert, colorBorder: palette.borderSecondary },
    Card: { ...components.Card, colorBorderSecondary: palette.borderSecondary },
    Collapse: {
      ...components.Collapse,
      colorBorder: palette.borderSecondary,
      contentBg: palette.container,
      headerBg: palette.fillSubtle,
    },
    DatePicker: { ...components.DatePicker, colorBorder: palette.border },
    Descriptions: { ...components.Descriptions, labelBg: palette.fillSubtle },
    Divider: { ...components.Divider, colorSplit: palette.borderSecondary },
    Input: { ...components.Input, colorBorder: palette.border },
    InputNumber: { ...components.InputNumber, colorBorder: palette.border },
    List: { ...components.List, colorSplit: palette.borderSecondary },
    Segmented: { ...components.Segmented, trackBg: palette.fill },
    Select: { ...components.Select, colorBorder: palette.border },
    Table: {
      ...components.Table,
      borderColor: palette.borderSecondary,
      headerBg: palette.tableHeader,
      headerSplitColor: palette.borderSecondary,
    },
  }
}

function mergeComponents(
  base: NonNullable<ThemeConfig['components']>,
  overrides: NonNullable<ThemeConfig['components']>,
): NonNullable<ThemeConfig['components']> {
  const merged: Record<string, object> = { ...base }

  for (const [name, config] of Object.entries(overrides)) {
    merged[name] = { ...(merged[name] ?? {}), ...config }
  }

  return merged as NonNullable<ThemeConfig['components']>
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
  gurkan: gurkanBackground,
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
        Menu: {
          ...colorSafeComponents.Menu,
          ...darkComponents.Menu,
          // Stripped with the other colours above, but without them an open section paints
          // a grey band the same tone as the selected entry inside it.
          itemBg: 'transparent',
          subMenuItemBg: 'transparent',
        },
        Progress: {
          ...colorSafeComponents.Progress,
          circleTextColor: 'rgba(255, 255, 255, 0.85)',
          remainingColor: 'rgba(255, 255, 255, 0.12)',
        },
      }
    : colorSafeComponents
  const adaptedVisualTheme =
    visualTheme === 'ant-design' || visualTheme === 'gurkan' ? undefined : visualTheme
  const surfaceComponents = adaptedVisualTheme
    ? applySurfaceContrast(darkVariantComponents, adaptedVisualTheme, resolvedColorMode)
    : darkVariantComponents
  const brandOverride =
    applyDarkVariant && adaptedVisualTheme ? darkBrandOverrides[adaptedVisualTheme] : undefined
  const readableComponents = brandOverride?.components
    ? mergeComponents(surfaceComponents, brandOverride.components)
    : surfaceComponents
  const readableTokens = adaptedVisualTheme
    ? { ...createSurfaceTokens(adaptedVisualTheme, resolvedColorMode), ...brandOverride?.token }
    : undefined

  return {
    ...(applyDarkVariant ? sharedProviderProps : selected),
    theme: {
      ...selected.theme,
      algorithm: colorAwareAlgorithms,
      components: readableComponents,
      token: {
        ...(applyDarkVariant
          ? retainDarkSafeTokens(selected.theme.token ?? {})
          : selected.theme.token),
        ...(applyDarkVariant ? darkVariantToken : {}),
        ...readableTokens,
      },
    },
  }
}
