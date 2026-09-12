import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { throughputByDay } from '@/features/analytics/data'
import { forChart, useChartFormatters, useChartTheme } from '@/features/analytics/hooks'
import { useMessages } from '@/i18n/messages'

interface ThroughputBarChartProps {
  height?: number
}

/**
 * The dashboard's own chart. It is deliberately bare — no card, no legend — because the
 * panel around it already carries the title and the description.
 */
export function ThroughputBarChart({ height = 260 }: ThroughputBarChartProps) {
  const messages = useMessages()
  const chart = useChartTheme()
  const format = useChartFormatters()
  const labels = messages.analytics.days
  const data = throughputByDay.map((point) => ({ ...point, name: labels[point.day] }))

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
          <CartesianGrid stroke={chart.grid} strokeDasharray="4 4" vertical={false} />
          <XAxis dataKey="name" tick={chart.tick} stroke={chart.axis} tickLine={false} />
          <YAxis
            tick={chart.tick}
            tickFormatter={format.compact}
            stroke={chart.axis}
            tickLine={false}
            axisLine={false}
            width={48}
          />
          <Tooltip {...chart.tooltip} formatter={forChart(format.number)} />
          <Bar
            dataKey="operations"
            name={messages.analytics.operations}
            fill={chart.series[0]}
            radius={[4, 4, 0, 0]}
            maxBarSize={48}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
