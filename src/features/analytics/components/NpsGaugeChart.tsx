import { theme } from 'antd'
import { Cell, Legend, Pie, PieChart, Tooltip } from 'recharts'
import { ChartCard } from '@/features/analytics/components/ChartCard'
import { npsResponses, type NpsGroupId } from '@/features/analytics/data'
import { forChart, useChartFormatters, useChartTheme } from '@/features/analytics/hooks'
import { useMessages } from '@/i18n/messages'

const groups: NpsGroupId[] = ['detractors', 'passives', 'promoters']
const total = groups.reduce((sum, group) => sum + npsResponses[group], 0)
const score = Math.round(((npsResponses.promoters - npsResponses.detractors) / total) * 100)

/**
 * A gauge is a donut cut in half: `startAngle` and `endAngle` limit the pie to the top arc,
 * and the score sits where the hole would be.
 */
export function NpsGaugeChart() {
  const messages = useMessages()
  const text = messages.analytics
  const chart = useChartTheme()
  const format = useChartFormatters()
  const { token } = theme.useToken()
  const colors: Record<NpsGroupId, string> = {
    detractors: token.colorError,
    passives: token.colorWarning,
    promoters: token.colorSuccess,
  }
  const data = groups.map((group) => ({
    id: group,
    name: text.npsGroups[group],
    value: npsResponses[group],
  }))

  return (
    <ChartCard
      title={text.npsTitle}
      description={text.npsBody.replace('{count}', format.number(total))}
    >
      <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
        <Tooltip {...chart.tooltip} formatter={forChart(format.number)} />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="72%"
          startAngle={180}
          endAngle={0}
          innerRadius="70%"
          outerRadius="100%"
          paddingAngle={2}
          stroke="none"
        >
          {data.map((slice) => (
            <Cell key={slice.id} fill={colors[slice.id]} />
          ))}
        </Pie>
        <text
          x="50%"
          y="66%"
          textAnchor="middle"
          dominantBaseline="central"
          fill={token.colorText}
          fontSize={36}
          fontWeight={600}
        >
          {score > 0 ? `+${score}` : score}
        </text>
        <Legend wrapperStyle={chart.legend} />
      </PieChart>
    </ChartCard>
  )
}
