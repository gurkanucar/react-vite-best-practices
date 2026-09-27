import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartCard } from '@/features/analytics/components/ChartCard'
import { ticketsByWeek, type ChannelId } from '@/features/analytics/data'
import { forChart, useChartFormatters, useChartTheme } from '@/features/analytics/hooks'
import { useMessages } from '@/i18n/messages'

const channels: ChannelId[] = ['chat', 'email', 'phone']

/** Stacked bars: the height is the week's workload, the bands are where it came from. */
export function TicketsStackedBarChart() {
  const messages = useMessages()
  const text = messages.analytics
  const chart = useChartTheme()
  const format = useChartFormatters()

  return (
    <ChartCard title={text.ticketsTitle} description={text.ticketsBody}>
      <BarChart data={ticketsByWeek} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
        <CartesianGrid stroke={chart.grid} strokeDasharray="4 4" vertical={false} />
        <XAxis dataKey="week" tick={chart.tick} stroke={chart.axis} tickLine={false} />
        <YAxis
          tick={chart.tick}
          tickFormatter={format.compact}
          stroke={chart.axis}
          tickLine={false}
          axisLine={false}
          width={40}
        />
        <Tooltip {...chart.tooltip} formatter={forChart(format.number)} />
        <Legend wrapperStyle={chart.legend} />
        {channels.map((channel, index) => (
          <Bar
            key={channel}
            dataKey={channel}
            name={text.channels[channel]}
            stackId="tickets"
            fill={chart.series[index + 1]}
            // Only the top band gets rounded corners, or the stack would show seams.
            radius={index === channels.length - 1 ? [4, 4, 0, 0] : 0}
            maxBarSize={40}
          />
        ))}
      </BarChart>
    </ChartCard>
  )
}
