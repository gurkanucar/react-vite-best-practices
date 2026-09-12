import { Bar, CartesianGrid, ComposedChart, Legend, Line, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartCard } from '@/features/analytics/components/ChartCard'
import { signupsByWeek } from '@/features/analytics/data'
import { useChartFormatters, useChartTheme } from '@/features/analytics/hooks'
import { useMessages } from '@/i18n/messages'

/**
 * Counts and a rate share an x axis but not a y axis. `ComposedChart` with two `YAxis`
 * elements — each given a `yAxisId` that the series then reference — is how recharts
 * plots them together without the rate collapsing to a flat line at the bottom.
 */
export function SignupsComposedChart() {
  const messages = useMessages()
  const chart = useChartTheme()
  const format = useChartFormatters()
  const labels = messages.analytics.signupSeries

  return (
    <ChartCard title={messages.analytics.signupsTitle} description={messages.analytics.signupsBody}>
      <ComposedChart data={signupsByWeek} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
        <CartesianGrid stroke={chart.grid} strokeDasharray="4 4" vertical={false} />
        <XAxis dataKey="week" tick={chart.tick} stroke={chart.axis} tickLine={false} />
        <YAxis
          yAxisId="count"
          tick={chart.tick}
          tickFormatter={format.compact}
          stroke={chart.axis}
          tickLine={false}
          axisLine={false}
          width={48}
        />
        <YAxis
          yAxisId="rate"
          orientation="right"
          domain={[0, 40]}
          tick={chart.tick}
          tickFormatter={format.percent}
          stroke={chart.axis}
          tickLine={false}
          axisLine={false}
          width={56}
        />
        <Tooltip
          {...chart.tooltip}
          formatter={(value: unknown, name: unknown) => {
            if (typeof value !== 'number') return String(value ?? '')
            return name === labels.conversionRate ? format.percent(value) : format.number(value)
          }}
        />
        <Legend wrapperStyle={chart.legend} />
        <Bar
          yAxisId="count"
          dataKey="trials"
          name={labels.trials}
          fill={chart.series[0]}
          radius={[4, 4, 0, 0]}
          maxBarSize={28}
        />
        <Bar
          yAxisId="count"
          dataKey="converted"
          name={labels.converted}
          fill={chart.series[1]}
          radius={[4, 4, 0, 0]}
          maxBarSize={28}
        />
        <Line
          yAxisId="rate"
          type="monotone"
          dataKey="conversionRate"
          name={labels.conversionRate}
          stroke={chart.series[3]}
          strokeWidth={2}
          dot={{ r: 3 }}
        />
      </ComposedChart>
    </ChartCard>
  )
}
