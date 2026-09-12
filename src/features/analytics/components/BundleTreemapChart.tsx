import { Tooltip, Treemap } from 'recharts'
import { ChartCard } from '@/features/analytics/components/ChartCard'
import { bundleComposition } from '@/features/analytics/data'
import { forChart, useChartFormatters, useChartTheme } from '@/features/analytics/hooks'
import { useMessages } from '@/i18n/messages'

interface TreemapCellProps {
  x?: number
  y?: number
  width?: number
  height?: number
  index?: number
  name?: string
  colors?: string[]
}

/**
 * Recharts renders one `<rect>` per node and leaves the contents to `content`. Labels are
 * only drawn once a cell is large enough to hold them, which is what keeps the small
 * packages from turning into a wall of clipped text.
 */
function TreemapCell({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  index = 0,
  name,
  colors = [],
}: TreemapCellProps) {
  const fits = width > 72 && height > 32

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={colors[index % colors.length]}
        fillOpacity={0.85}
        stroke="none"
        rx={4}
      />
      {fits && (
        <text x={x + 8} y={y + 20} fill="#fff" fontSize={12}>
          {name}
        </text>
      )}
    </g>
  )
}

export function BundleTreemapChart() {
  const messages = useMessages()
  const chart = useChartTheme()
  const format = useChartFormatters()

  return (
    <ChartCard title={messages.analytics.bundleTitle} description={messages.analytics.bundleBody}>
      <Treemap
        data={bundleComposition}
        dataKey="size"
        aspectRatio={16 / 9}
        content={<TreemapCell colors={chart.series} />}
      >
        <Tooltip
          {...chart.tooltip}
          formatter={forChart((value) => `${format.number(value)} kB`)}
          separator=": "
        />
      </Treemap>
    </ChartCard>
  )
}
