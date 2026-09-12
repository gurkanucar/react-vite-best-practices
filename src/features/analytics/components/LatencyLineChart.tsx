import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartCard } from '@/features/analytics/components/ChartCard'
import { latencyByHour } from '@/features/analytics/data'
import { forChart, useChartFormatters, useChartTheme } from '@/features/analytics/hooks'
import { useMessages } from '@/i18n/messages'

/**
 * Percentiles span two orders of magnitude, so a linear axis flattens the p50 into the
 * baseline. A logarithmic scale keeps all three readable at once.
 */
export function LatencyLineChart() {
  const messages = useMessages()
  const chart = useChartTheme()
  const format = useChartFormatters()

  return (
    <ChartCard title={messages.analytics.latencyTitle} description={messages.analytics.latencyBody}>
      <LineChart data={latencyByHour} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
        <CartesianGrid stroke={chart.grid} strokeDasharray="4 4" vertical={false} />
        <XAxis dataKey="hour" tick={chart.tick} stroke={chart.axis} tickLine={false} />
        <YAxis
          scale="log"
          domain={[10, 1200]}
          ticks={[10, 50, 100, 500, 1000]}
          tick={chart.tick}
          tickFormatter={(value: number) => `${format.number(value)}ms`}
          stroke={chart.axis}
          tickLine={false}
          axisLine={false}
          width={64}
        />
        <Tooltip {...chart.tooltip} formatter={forChart((value) => `${format.number(value)} ms`)} />
        <Legend wrapperStyle={chart.legend} />
        {(['p50', 'p95', 'p99'] as const).map((percentile, index) => (
          <Line
            key={percentile}
            type="monotone"
            dataKey={percentile}
            name={messages.analytics.percentiles[percentile]}
            stroke={chart.series[index]}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        ))}
      </LineChart>
    </ChartCard>
  )
}
