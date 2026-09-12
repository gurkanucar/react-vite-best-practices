import { Area, AreaChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartCard } from '@/features/analytics/components/ChartCard'
import { revenueByMonth } from '@/features/analytics/data'
import { forChart, useChartFormatters, useChartTheme } from '@/features/analytics/hooks'
import { useMessages } from '@/i18n/messages'

/**
 * A stacked area chart answers "how big is the total, and what is it made of" in one
 * shape. `stackId` is what stacks the series; without it they would overlap.
 */
export function RevenueAreaChart() {
  const messages = useMessages()
  const chart = useChartTheme()
  const format = useChartFormatters()
  const labels = messages.analytics.revenueSeries

  return (
    <ChartCard title={messages.analytics.revenueTitle} description={messages.analytics.revenueBody}>
      <AreaChart data={revenueByMonth} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
        <defs>
          {chart.series.slice(0, 3).map((color, index) => (
            <linearGradient key={color} id={`revenue-${index}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.7} />
              <stop offset="100%" stopColor={color} stopOpacity={0.05} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid stroke={chart.grid} strokeDasharray="4 4" vertical={false} />
        <XAxis
          dataKey="month"
          tick={chart.tick}
          tickFormatter={format.month}
          stroke={chart.axis}
          tickLine={false}
        />
        <YAxis
          tick={chart.tick}
          tickFormatter={format.compactCurrency}
          stroke={chart.axis}
          tickLine={false}
          axisLine={false}
          width={64}
        />
        <Tooltip
          {...chart.tooltip}
          labelFormatter={(label: unknown) => format.month(String(label))}
          formatter={forChart((value) => `$${format.number(value)}`)}
        />
        <Legend wrapperStyle={chart.legend} />
        <Area
          type="monotone"
          dataKey="subscriptions"
          name={labels.subscriptions}
          stackId="revenue"
          stroke={chart.series[0]}
          fill="url(#revenue-0)"
        />
        <Area
          type="monotone"
          dataKey="services"
          name={labels.services}
          stackId="revenue"
          stroke={chart.series[1]}
          fill="url(#revenue-1)"
        />
        <Area
          type="monotone"
          dataKey="marketplace"
          name={labels.marketplace}
          stackId="revenue"
          stroke={chart.series[2]}
          fill="url(#revenue-2)"
        />
      </AreaChart>
    </ChartCard>
  )
}
