import { Cell, Legend, Pie, PieChart, Tooltip } from 'recharts'
import { ChartCard } from '@/features/analytics/components/ChartCard'
import type { BreakdownSlice } from '@/features/analytics/data'
import { forChart, useChartFormatters, useChartTheme } from '@/features/analytics/hooks'

interface BreakdownPieChartProps<TId extends string> {
  title: string
  description: string
  data: BreakdownSlice<TId>[]
  /** Display text for every id in `data`, so the dataset stays language-agnostic. */
  labels: Record<TId, string>
  /** Leaving the middle empty turns the pie into a donut. */
  donut?: boolean
}

/**
 * One component covers both the pie and the donut: they differ only by `innerRadius`.
 * Slice colours come from `Cell` children, because a pie draws one series whose segments
 * each need their own colour.
 */
export function BreakdownPieChart<TId extends string>({
  title,
  description,
  data,
  labels,
  donut = false,
}: BreakdownPieChartProps<TId>) {
  const chart = useChartTheme()
  const format = useChartFormatters()
  const slices = data.map((slice) => ({ name: labels[slice.id], value: slice.value }))

  return (
    <ChartCard title={title} description={description}>
      <PieChart>
        <Pie
          data={slices}
          dataKey="value"
          nameKey="name"
          innerRadius={donut ? '55%' : 0}
          outerRadius="80%"
          paddingAngle={donut ? 2 : 0}
          stroke="none"
        >
          {slices.map((slice, index) => (
            <Cell key={slice.name} fill={chart.series[index % chart.series.length]} />
          ))}
        </Pie>
        <Tooltip {...chart.tooltip} formatter={forChart(format.number)} />
        <Legend wrapperStyle={chart.legend} />
      </PieChart>
    </ChartCard>
  )
}
