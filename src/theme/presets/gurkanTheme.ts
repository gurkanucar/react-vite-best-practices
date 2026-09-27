import { useMemo } from 'react'
import { theme, type ConfigProviderProps, type ThemeConfig } from 'antd'
import type { ResolvedColorMode } from '@/theme/theme'

const palette = {
  primary: '#1877f2',
  info: '#00b8d9',
  success: '#22c55e',
  warning: '#ffab00',
  error: '#ff5630',
  /** The neutral the whole design is built from. */
  grey: '145, 158, 171',
}

type Tokens = NonNullable<ThemeConfig['token']>

const lightTokens: Tokens = {
  colorPrimary: palette.primary,
  colorInfo: palette.info,
  colorSuccess: palette.success,
  colorWarning: palette.warning,
  colorError: palette.error,
  colorLink: palette.primary,

  colorBgBase: '#f9fafb',
  colorBgContainer: '#ffffff',
  colorBgElevated: '#ffffff',
  colorBgLayout: '#f9fafb',
  colorBgSpotlight: '#212b36',

  colorText: '#1c252e',
  colorTextBase: '#1c252e',
  colorTextSecondary: '#637381',
  // Each tier has to stay a step apart from its neighbours, or disabled reads as tertiary.
  colorTextTertiary: '#7b8895',
  colorTextQuaternary: '#b4bec8',
  colorTextDisabled: '#b4bec8',
  colorTextPlaceholder: '#919eab',

  colorBorder: '#dfe3e8',
  colorBorderSecondary: '#e9edf0',
  colorSplit: '#e9edf0',
  colorFillQuaternary: '#f9fafb',
  colorFillTertiary: '#f4f6f8',
  colorFillSecondary: `rgba(${palette.grey}, 0.12)`,
  controlOutline: 'rgba(24, 119, 242, 0.12)',

  boxShadow: `0 0 2px rgba(${palette.grey}, 0.2), 0 12px 24px -4px rgba(${palette.grey}, 0.12)`,
  boxShadowSecondary: `0 0 2px rgba(${palette.grey}, 0.2), 0 12px 24px -4px rgba(${palette.grey}, 0.12)`,
}

const darkTokens: Tokens = {
  colorPrimary: palette.primary,
  colorInfo: palette.info,
  colorSuccess: palette.success,
  colorWarning: palette.warning,
  colorError: palette.error,
  colorLink: '#5b9cff',

  // The dark surfaces are blue-grey rather than black, which is what keeps the palette
  // recognisable as the same theme between the two modes.
  colorBgBase: '#141a21',
  colorBgContainer: '#1c252e',
  colorBgElevated: '#212b36',
  colorBgLayout: '#141a21',
  colorBgSpotlight: '#ffffff',

  colorText: '#ffffff',
  colorTextBase: '#ffffff',
  colorTextSecondary: '#a8b3be',
  colorTextTertiary: '#8491a0',
  colorTextQuaternary: '#56636f',
  colorTextDisabled: '#56636f',
  colorTextPlaceholder: '#6c7a88',

  colorBorder: `rgba(${palette.grey}, 0.28)`,
  colorBorderSecondary: `rgba(${palette.grey}, 0.16)`,
  colorSplit: `rgba(${palette.grey}, 0.16)`,
  colorFillQuaternary: `rgba(${palette.grey}, 0.06)`,
  colorFillTertiary: `rgba(${palette.grey}, 0.1)`,
  colorFillSecondary: `rgba(${palette.grey}, 0.16)`,
  controlOutline: 'rgba(91, 156, 255, 0.2)',

  boxShadow: '0 0 2px rgba(0, 0, 0, 0.2), 0 12px 24px -4px rgba(0, 0, 0, 0.36)',
  boxShadowSecondary: '0 0 2px rgba(0, 0, 0, 0.2), 0 12px 24px -4px rgba(0, 0, 0, 0.36)',
}

/** Shape and type, which do not change between the modes. */
const sharedTokens: Tokens = {
  /*
   * DM Sans is named first but not loaded: shipping a web font would add a network
   * request for every reader on every other theme too. Anyone who has it installed, or
   * adds it themselves, gets the exact face; everyone else gets the system stack.
   */
  fontFamily:
    "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  fontSize: 14,

  borderRadius: 8,
  borderRadiusLG: 16,
  borderRadiusSM: 6,

  controlHeight: 40,
  controlHeightLG: 48,

  wireframe: false,
}

function componentsFor(mode: ResolvedColorMode): NonNullable<ThemeConfig['components']> {
  const dark = mode === 'dark'
  const tokens = dark ? darkTokens : lightTokens
  const fieldBackground = dark ? `rgba(${palette.grey}, 0.08)` : '#f4f6f8'
  const fieldHoverBackground = dark ? `rgba(${palette.grey}, 0.12)` : '#eef1f4'
  const selectedBackground = dark ? 'rgba(24, 119, 242, 0.16)' : 'rgba(24, 119, 242, 0.08)'
  // The primary blue is too dark to carry text on the dark surfaces; the link blue is not.
  const selectedText = dark ? tokens.colorLink : palette.primary

  return {
    Layout: {
      bodyBg: tokens.colorBgLayout,
      footerBg: tokens.colorBgLayout,
      headerBg: tokens.colorBgContainer,
      headerColor: tokens.colorText,
      siderBg: tokens.colorBgContainer,
      triggerBg: tokens.colorBgElevated,
      triggerColor: tokens.colorText,
    },
    Card: {
      borderRadiusLG: 16,
      paddingLG: 24,
      colorBorderSecondary: tokens.colorBorderSecondary,
      boxShadowTertiary: tokens.boxShadow,
    },
    Menu: {
      activeBarBorderWidth: 0,
      itemBg: 'transparent',
      subMenuItemBg: 'transparent',
      itemBorderRadius: 8,
      itemHeight: 44,
      itemMarginInline: 8,
      itemColor: tokens.colorTextSecondary,
      itemHoverColor: tokens.colorText,
      itemHoverBg: dark ? `rgba(${palette.grey}, 0.08)` : '#f4f6f8',
      itemSelectedColor: selectedText,
      itemSelectedBg: selectedBackground,
      darkItemBg: 'transparent',
      darkSubMenuItemBg: 'transparent',
      darkItemColor: tokens.colorTextSecondary,
      darkItemHoverColor: tokens.colorText,
      darkItemHoverBg: `rgba(${palette.grey}, 0.08)`,
      darkItemSelectedColor: selectedText,
      darkItemSelectedBg: 'rgba(24, 119, 242, 0.16)',
    },
    Table: {
      headerBg: dark ? '#26323e' : '#edf1f4',
      headerColor: tokens.colorTextSecondary,
      headerSplitColor: 'transparent',
      rowHoverBg: dark ? `rgba(${palette.grey}, 0.08)` : '#f9fafb',
      borderColor: tokens.colorBorderSecondary,
      cellPaddingBlock: 16,
      cellPaddingInline: 16,
    },
    Input: {
      borderRadius: 10,
      colorBgContainer: fieldBackground,
      colorBorder: tokens.colorBorder,
      hoverBg: fieldHoverBackground,
      activeBg: fieldBackground,
      hoverBorderColor: tokens.colorTextTertiary,
      activeBorderColor: palette.primary,
      activeShadow: '0 0 0 2px rgba(24, 119, 242, 0.12)',
    },
    InputNumber: {
      borderRadius: 10,
      colorBgContainer: fieldBackground,
      colorBorder: tokens.colorBorder,
      hoverBg: fieldHoverBackground,
      activeBg: fieldBackground,
      hoverBorderColor: tokens.colorTextTertiary,
      activeBorderColor: palette.primary,
      activeShadow: '0 0 0 2px rgba(24, 119, 242, 0.12)',
    },
    Select: {
      borderRadius: 10,
      selectorBg: fieldBackground,
      colorBorder: tokens.colorBorder,
      hoverBorderColor: tokens.colorTextTertiary,
      activeBorderColor: palette.primary,
      activeOutlineColor: 'rgba(24, 119, 242, 0.12)',
      optionActiveBg: fieldHoverBackground,
      optionSelectedBg: selectedBackground,
    },
    DatePicker: {
      borderRadius: 10,
      colorBgContainer: fieldBackground,
      colorBorder: tokens.colorBorder,
      hoverBg: fieldHoverBackground,
      activeBg: fieldBackground,
      hoverBorderColor: tokens.colorTextTertiary,
      activeBorderColor: palette.primary,
      activeShadow: '0 0 0 2px rgba(24, 119, 242, 0.12)',
    },
    Button: {
      primaryShadow: '0 8px 16px 0 rgba(24, 119, 242, 0.24)',
      defaultShadow: 'none',
      dangerShadow: 'none',
      fontWeight: 600,
    },
    Tag: {
      borderRadiusSM: 8,
    },
    Progress: {
      defaultColor: palette.primary,
      remainingColor: dark ? `rgba(${palette.grey}, 0.16)` : '#f4f6f8',
      circleTextColor: tokens.colorText,
    },
    Segmented: {
      itemSelectedBg: tokens.colorBgContainer,
      trackBg: dark ? `rgba(${palette.grey}, 0.16)` : '#edf1f4',
    },
    Tabs: {
      itemSelectedColor: selectedText,
      itemHoverColor: selectedText,
      itemActiveColor: selectedText,
      inkBarColor: selectedText,
    },
    Collapse: {
      headerBg: tokens.colorFillTertiary,
      contentBg: tokens.colorBgContainer,
    },
    Descriptions: {
      labelBg: tokens.colorFillTertiary,
    },
    Dropdown: {
      borderRadiusLG: 12,
      boxShadowSecondary: tokens.boxShadow,
      controlItemBgHover: fieldHoverBackground,
      controlItemBgActive: selectedBackground,
    },
    Modal: {
      borderRadiusLG: 16,
      contentBg: tokens.colorBgElevated,
      headerBg: tokens.colorBgElevated,
      boxShadow: tokens.boxShadow,
    },
    Popover: {
      borderRadiusLG: 12,
      boxShadowSecondary: tokens.boxShadow,
    },
  }
}

/**
 * Takes the resolved colour mode because it owns both palettes; the presets adapted from
 * the Ant Design website take none and have a dark variant derived for them.
 */
export default function useGurkanTheme(mode: ResolvedColorMode): ConfigProviderProps {
  return useMemo<ConfigProviderProps>(
    () => ({
      theme: {
        algorithm: mode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: { ...sharedTokens, ...(mode === 'dark' ? darkTokens : lightTokens) },
        components: componentsFor(mode),
      },
    }),
    [mode],
  )
}
