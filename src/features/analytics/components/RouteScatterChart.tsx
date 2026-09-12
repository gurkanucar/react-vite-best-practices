import { CartesianGrid, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from 'recharts'
import { ChartCard } from '@/features/analytics/components/ChartCard'
import { routePerformance } from '@/features/analytics/data'
import { useChartFormatters, useChartTheme } from '@/features/analytics/hooks'
import { useMessages } from '@/i18n/messages'

/**
 * Three variables, one chart: payload on x, time to interactive on y, and traffic as the
 * bubble area through `ZAxis`. The correlation between the first two is the point — the
 * heaviest routes are also the slowest, and the busiest of them is worth splitting first.
 */
export function RouteScatterChart() {
  const messages = useMessages()
  const chart = useChartTheme()
  const format = useChartFormatters()
  const labels = messages.analytics.routeAxes

  return (
    <ChartCard title={messages.analytics.routesTitle} description={messages.analytics.routesBody}>
      <ScatterChart margin={{ top: 8, right: 16, bottom: 16, left: 8 }}>
        <CartesianGrid stroke={chart.grid} strokeDasharray="4 4" />
        <XAxis
          type="number"
          dataKey="transferredKb"
          name={labels.transferred}
          unit=" kB"
          tick={chart.tick}
          stroke={chart.axis}
          tickLine={false}
        />
        <YAxis
          type="number"
          dataKey="interactiveMs"
          name={labels.interactive}
          unit=" ms"
          tick={chart.tick}
          stroke={chart.axis}
          tickLine={false}
          axisLine={false}
          width={64}
        />
        <ZAxis type="number" dataKey="sessions" range={[80, 640]} name={labels.sessions} />
        <Tooltip
          {...chart.tooltip}
          cursor={{ strokeDasharray: '4 4' }}
          formatter={(value: unknown, name: unknown) => {
            if (typeof value !== 'number') return String(value ?? '')
            return name === labels.sessions ? format.number(value) : value
          }}
          labelFormatter={() => ''}
        />
        <Scatter
          data={routePerformance}
          name={labels.routes}
          fill={chart.series[0]}
          fillOpacity={0.65}
        />
      </ScatterChart>
    </ChartCard>
  )
}
