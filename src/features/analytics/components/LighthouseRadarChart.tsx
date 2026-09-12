import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  Tooltip,
} from 'recharts'
import { ChartCard } from '@/features/analytics/components/ChartCard'
import { lighthouseScores } from '@/features/analytics/data'
import { useChartTheme } from '@/features/analytics/hooks'
import { useMessages } from '@/i18n/messages'

/**
 * A radar chart compares two profiles across the same fixed set of axes, which is what
 * makes a before/after audit legible at a glance. It stops working past roughly eight
 * axes, and the axes must share a scale — both hold here.
 */
export function LighthouseRadarChart() {
  const messages = useMessages()
  const chart = useChartTheme()
  const labels = messages.analytics.audits
  const data = lighthouseScores.map((score) => ({ ...score, name: labels[score.id] }))

  return (
    <ChartCard
      title={messages.analytics.lighthouseTitle}
      description={messages.analytics.lighthouseBody}
    >
      <RadarChart data={data} outerRadius="72%">
        <PolarGrid stroke={chart.grid} />
        <PolarAngleAxis dataKey="name" tick={chart.tick} />
        <PolarRadiusAxis domain={[0, 100]} tick={chart.tick} axisLine={false} angle={90} />
        <Tooltip {...chart.tooltip} />
        <Legend wrapperStyle={chart.legend} />
        <Radar
          name={messages.analytics.auditBefore}
          dataKey="before"
          stroke={chart.series[3]}
          fill={chart.series[3]}
          fillOpacity={0.25}
        />
        <Radar
          name={messages.analytics.auditAfter}
          dataKey="after"
          stroke={chart.series[0]}
          fill={chart.series[0]}
          fillOpacity={0.35}
        />
      </RadarChart>
    </ChartCard>
  )
}
