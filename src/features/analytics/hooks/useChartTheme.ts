import { theme } from 'antd'

export interface ChartTheme {
  /** Categorical colours for series, in the order they should be assigned. */
  series: string[]
  axis: string
  grid: string
  /** Props shared by every `Tooltip`, so all of them match the active theme. */
  tooltip: {
    contentStyle: React.CSSProperties
    labelStyle: React.CSSProperties
    itemStyle: React.CSSProperties
    cursor: { fill: string }
  }
  legend: React.CSSProperties
  tick: { fill: string; fontSize: number }
}

/**
 * Recharts draws raw SVG, so nothing about it follows Ant Design automatically. Reading
 * the active design tokens here is what keeps the charts correct across every preset and
 * in dark mode — antd generates a matching palette for each, including the preset hues
 * used for categorical series.
 */
export function useChartTheme(): ChartTheme {
  const { token } = theme.useToken()

  return {
    series: [
      token.colorPrimary,
      token.cyan6,
      token.purple6,
      token.gold6,
      token.magenta6,
      token.green6,
      token.volcano6,
      token.geekblue6,
    ],
    axis: token.colorBorderSecondary,
    grid: token.colorSplit,
    tooltip: {
      contentStyle: {
        background: token.colorBgElevated,
        border: `1px solid ${token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
        boxShadow: token.boxShadowSecondary,
        color: token.colorText,
        fontSize: token.fontSizeSM,
      },
      labelStyle: { color: token.colorText, fontWeight: 600 },
      itemStyle: { color: token.colorTextSecondary },
      cursor: { fill: token.colorFillSecondary },
    },
    legend: { color: token.colorTextSecondary, fontSize: token.fontSizeSM },
    tick: { fill: token.colorTextSecondary, fontSize: token.fontSizeSM },
  }
}
