import type { ConfigProviderProps } from 'antd'

export type UseTheme = () => ConfigProviderProps

export { default as useBootstrapTheme } from './bootstrapTheme'
export { default as useIllustrationTheme } from './illustrationTheme'
export { default as useMuiTheme } from './muiTheme'
export { default as useShadcnTheme } from './shadcnTheme'
