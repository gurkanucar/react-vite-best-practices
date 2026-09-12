import type { ReactNode } from 'react'
import { Funnel, FunnelChart, LabelList, Tooltip } from 'recharts'
import { ChartCard } from '@/features/analytics/components/ChartCard'
import { onboardingFunnel } from '@/features/analytics/data'
import { forChart, useChartFormatters, useChartTheme } from '@/features/analytics/hooks'
import { useMessages } from '@/i18n/messages'

interface StageLabelProps {
  x?: number
  y?: number
  width?: number
  height?: number
  value?: ReactNode
  /**
   * Not named `fill`: `LabelList` injects the stage's own colour under that name, which
   * would win over anything passed in here and tint the text per stage.
   */
  color?: string
  /** `left` anchors the text to its end so it grows away from the shape. */
  side?: 'left' | 'right'
}

/**
 * The built-in label wraps its text to the width of the stage it belongs to, which splits
 * the longest names across two lines on the widest stage. Drawing the `<text>` directly is
 * the way to opt out of that measurement — at the cost of `formatter`, which recharts only
 * applies to its own label, so the values arrive pre-formatted instead.
 */
function StageLabel({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  value,
  color,
  side = 'right',
}: StageLabelProps) {
  const isRight = side === 'right'

  return (
    <text
      x={isRight ? x + width + 12 : x - 12}
      y={y + height / 2}
      textAnchor={isRight ? 'start' : 'end'}
      dominantBaseline="central"
      fill={color}
      fontSize={12}
    >
      {value}
    </text>
  )
}

/**
 * A funnel reads as drop-off rather than as magnitude, so the stage name and the count
 * both belong on the chart: one `LabelList` per side.
 */
export function OnboardingFunnelChart() {
  const messages = useMessages()
  const chart = useChartTheme()
  const format = useChartFormatters()
  const labels = messages.analytics.stages
  const data = onboardingFunnel.map((stage, index) => ({
    ...stage,
    name: labels[stage.id],
    display: format.compact(stage.value),
    fill: chart.series[index % chart.series.length],
  }))

  return (
    <ChartCard title={messages.analytics.funnelTitle} description={messages.analytics.funnelBody}>
      <FunnelChart margin={{ top: 8, right: 132, bottom: 8, left: 88 }}>
        <Tooltip {...chart.tooltip} formatter={forChart(format.number)} />
        <Funnel dataKey="value" data={data} isAnimationActive={false}>
          <LabelList dataKey="name" content={<StageLabel color={chart.tick.fill} />} />
          <LabelList
            dataKey="display"
            content={<StageLabel side="left" color={chart.tick.fill} />}
          />
        </Funnel>
      </FunnelChart>
    </ChartCard>
  )
}
