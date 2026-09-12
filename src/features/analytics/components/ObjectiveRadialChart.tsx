import { Legend, PolarAngleAxis, RadialBar, RadialBarChart, Tooltip } from 'recharts'
import { ChartCard } from '@/features/analytics/components/ChartCard'
import { serviceObjectives } from '@/features/analytics/data'
import { forChart, useChartTheme } from '@/features/analytics/hooks'
import { useMessages } from '@/i18n/messages'

/**
 * Availability lives in the last two percent, so a bar starting at zero shows four
 * identical full bars. A `PolarAngleAxis` with an explicit 98-100 domain spends the whole
 * arc on the range that actually differs.
 */
export function ObjectiveRadialChart() {
  const messages = useMessages()
  const chart = useChartTheme()
  const labels = messages.analytics.services
  const data = serviceObjectives.map((objective, index) => ({
    ...objective,
    name: labels[objective.id],
    fill: chart.series[index % chart.series.length],
  }))

  return (
    <ChartCard
      title={messages.analytics.objectivesTitle}
      description={messages.analytics.objectivesBody}
    >
      <RadialBarChart
        data={data}
        innerRadius="28%"
        outerRadius="95%"
        startAngle={90}
        endAngle={-270}
      >
        <PolarAngleAxis type="number" domain={[98, 100]} tick={false} />
        {/* The default background ring is a fixed light grey, which glares in dark mode. */}
        <RadialBar
          dataKey="attainment"
          background={{ fill: chart.tooltip.cursor.fill }}
          cornerRadius={6}
        />
        <Tooltip {...chart.tooltip} formatter={forChart((value) => `${value.toFixed(2)}%`)} />
        <Legend wrapperStyle={chart.legend} iconType="circle" />
      </RadialBarChart>
    </ChartCard>
  )
}
