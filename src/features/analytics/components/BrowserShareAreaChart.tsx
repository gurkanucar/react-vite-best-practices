import { Area, AreaChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartCard } from '@/features/analytics/components/ChartCard'
import { browserShareByMonth, type BrowserId } from '@/features/analytics/data'
import { useChartFormatters, useChartTheme } from '@/features/analytics/hooks'
import { useMessages } from '@/i18n/messages'

const browsers: BrowserId[] = ['chrome', 'safari', 'edge', 'firefox', 'other']

/**
 * `stackOffset="expand"` scales every month to the same height, which turns a volume chart
 * into a share chart: growth disappears and only the mix is left to read.
 */
export function BrowserShareAreaChart() {
  const messages = useMessages()
  const text = messages.analytics
  const chart = useChartTheme()
  const format = useChartFormatters()

  return (
    <ChartCard title={text.browsersTitle} description={text.browsersBody}>
      <AreaChart
        data={browserShareByMonth}
        stackOffset="expand"
        margin={{ top: 8, right: 8, bottom: 0, left: 8 }}
      >
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
          tickFormatter={(value: number) => format.percent(Math.round(value * 100))}
          stroke={chart.axis}
          tickLine={false}
          axisLine={false}
          width={48}
        />
        <Tooltip
          {...chart.tooltip}
          labelFormatter={(label: unknown) => format.month(String(label))}
          // The tooltip shows the raw sessions; turning them into shares needs the month's total.
          formatter={(value: unknown, _name, item) => {
            const row = item.payload as Record<BrowserId, number>
            const total = browsers.reduce((sum, browser) => sum + row[browser], 0)
            return typeof value === 'number'
              ? format.percent(Math.round((value / total) * 1000) / 10)
              : String(value)
          }}
        />
        <Legend wrapperStyle={chart.legend} />
        {browsers.map((browser, index) => (
          <Area
            key={browser}
            type="monotone"
            dataKey={browser}
            name={text.browsers[browser]}
            stackId="browsers"
            stroke={chart.series[index]}
            fill={chart.series[index]}
            fillOpacity={0.55}
          />
        ))}
      </AreaChart>
    </ChartCard>
  )
}
