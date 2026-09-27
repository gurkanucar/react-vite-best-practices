import { theme } from 'antd'
import { Bar, BarChart, CartesianGrid, Cell, LabelList, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartCard } from '@/features/analytics/components/ChartCard'
import { mrrMovement, type MrrStepId } from '@/features/analytics/data'
import { useChartFormatters, useChartTheme } from '@/features/analytics/hooks'
import { useMessages } from '@/i18n/messages'

interface WaterfallBar {
  id: string
  name: string
  /** The invisible part of the bar that lifts the visible part to where the balance stands. */
  base: number
  amount: number
  change: number
  kind: 'total' | 'gain' | 'loss'
}

/** Walks the steps once, keeping the running balance each bar has to sit on. */
function waterfallBars(labels: Record<MrrStepId, string>): WaterfallBar[] {
  const last = mrrMovement.length - 1

  return mrrMovement.reduce<{ bars: WaterfallBar[]; balance: number }>(
    ({ bars, balance }, step, index) => {
      const name = labels[step.id]
      if (index === 0 || index === last) {
        const bar: WaterfallBar = {
          id: step.id,
          name,
          base: 0,
          amount: step.value,
          change: step.value,
          kind: 'total',
        }
        return { bars: [...bars, bar], balance: step.value }
      }
      const next = balance + step.value
      const bar: WaterfallBar = {
        id: step.id,
        name,
        base: Math.min(balance, next),
        amount: Math.abs(step.value),
        change: step.value,
        kind: step.value >= 0 ? 'gain' : 'loss',
      }
      return { bars: [...bars, bar], balance: next }
    },
    { bars: [], balance: 0 },
  ).bars
}

/**
 * Recharts has no waterfall, but a stacked bar makes one: an invisible bar lifts each step
 * to the running balance, and the visible bar on top of it is the change itself.
 */
export function MrrWaterfallChart() {
  const messages = useMessages()
  const text = messages.analytics
  const chart = useChartTheme()
  const format = useChartFormatters()
  const { token } = theme.useToken()

  const data = waterfallBars(text.mrrSteps)

  const colors = { total: chart.series[0], gain: token.colorSuccess, loss: token.colorError }
  const signed = (value: number, kind: WaterfallBar['kind']) =>
    kind === 'total'
      ? format.compactCurrency(value)
      : `${value >= 0 ? '+' : '−'}${format.compactCurrency(Math.abs(value))}`

  return (
    <ChartCard title={text.mrrBridgeTitle} description={text.mrrBridgeBody}>
      <BarChart data={data} margin={{ top: 24, right: 8, bottom: 0, left: 8 }}>
        <CartesianGrid stroke={chart.grid} strokeDasharray="4 4" vertical={false} />
        <XAxis dataKey="name" tick={chart.tick} stroke={chart.axis} tickLine={false} interval={0} />
        <YAxis
          // Starting at zero would squash every change into a sliver on top of a tall bar.
          domain={[800_000, 1_000_000]}
          allowDataOverflow
          tick={chart.tick}
          tickFormatter={format.compactCurrency}
          stroke={chart.axis}
          tickLine={false}
          axisLine={false}
          width={64}
        />
        <Tooltip
          {...chart.tooltip}
          content={({ active, payload }) => {
            const bar = payload?.[0]?.payload as WaterfallBar | undefined
            if (!active || !bar) return null
            return (
              <div style={chart.tooltip.contentStyle}>
                <div style={{ ...chart.tooltip.labelStyle, padding: '6px 10px 0' }}>{bar.name}</div>
                <div style={{ ...chart.tooltip.itemStyle, padding: '2px 10px 6px' }}>
                  {bar.kind === 'total' ? '' : bar.change >= 0 ? '+' : '−'}$
                  {format.number(Math.abs(bar.change))}
                </div>
              </div>
            )
          }}
        />
        <Bar dataKey="base" stackId="bridge" fill="transparent" isAnimationActive={false} />
        <Bar dataKey="amount" stackId="bridge" radius={[4, 4, 0, 0]} maxBarSize={56}>
          {data.map((bar) => (
            <Cell key={bar.id} fill={colors[bar.kind]} />
          ))}
          <LabelList
            dataKey="change"
            position="top"
            fill={chart.tick.fill}
            fontSize={12}
            formatter={(value: unknown) => {
              const bar = data.find((item) => item.change === value)
              return typeof value === 'number' && bar ? signed(value, bar.kind) : ''
            }}
          />
        </Bar>
      </BarChart>
    </ChartCard>
  )
}
