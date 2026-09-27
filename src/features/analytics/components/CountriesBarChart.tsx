import { Bar, BarChart, CartesianGrid, LabelList, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartCard } from '@/features/analytics/components/ChartCard'
import { sessionsByCountry } from '@/features/analytics/data'
import { forChart, useChartFormatters, useChartTheme } from '@/features/analytics/hooks'
import { useMessages } from '@/i18n/messages'
import { usePreferencesStore } from '@/store/preferences-store'

/**
 * Long category names read badly under a column, so the bars run sideways: `layout="vertical"`
 * swaps the axes. The country names come from `Intl.DisplayNames`, already in the reader's
 * language, so the dataset needs nothing but ISO codes.
 */
export function CountriesBarChart() {
  const messages = useMessages()
  const chart = useChartTheme()
  const format = useChartFormatters()
  const language = usePreferencesStore((state) => state.language)
  const names = new Intl.DisplayNames([language], { type: 'region' })
  const data = sessionsByCountry.map((country) => ({
    ...country,
    name: names.of(country.code) ?? country.code,
  }))

  return (
    <ChartCard
      title={messages.analytics.countriesTitle}
      description={messages.analytics.countriesBody}
    >
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 48, bottom: 0, left: 8 }}>
        <CartesianGrid stroke={chart.grid} strokeDasharray="4 4" horizontal={false} />
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="name"
          tick={chart.tick}
          stroke={chart.axis}
          tickLine={false}
          axisLine={false}
          width={112}
        />
        <Tooltip {...chart.tooltip} formatter={forChart(format.number)} />
        <Bar
          dataKey="sessions"
          name={messages.analytics.sessions}
          fill={chart.series[1]}
          radius={[0, 4, 4, 0]}
          maxBarSize={22}
        >
          <LabelList
            dataKey="sessions"
            position="right"
            fill={chart.tick.fill}
            fontSize={12}
            formatter={forChart(format.compact)}
          />
        </Bar>
      </BarChart>
    </ChartCard>
  )
}
