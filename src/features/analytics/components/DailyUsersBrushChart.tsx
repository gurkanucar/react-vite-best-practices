import {
  Brush,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { theme } from 'antd'
import { ChartCard } from '@/features/analytics/components/ChartCard'
import { dailyActiveUsers, outageWindow } from '@/features/analytics/data'
import { forChart, useChartFormatters, useChartTheme } from '@/features/analytics/hooks'
import { useMessages } from '@/i18n/messages'
import { usePreferencesStore } from '@/store/preferences-store'

const average = Math.round(
  dailyActiveUsers.reduce((sum, point) => sum + point.users, 0) / dailyActiveUsers.length,
)

/**
 * A long daily series is too dense to read whole, so a `Brush` lets the reader pick a window.
 * A `ReferenceLine` gives the eye a baseline and a `ReferenceArea` explains the one dip that
 * would otherwise look like a data error.
 */
export function DailyUsersBrushChart() {
  const messages = useMessages()
  const text = messages.analytics
  const chart = useChartTheme()
  const format = useChartFormatters()
  const { token } = theme.useToken()
  const language = usePreferencesStore((state) => state.language)
  const day = new Intl.DateTimeFormat(language === 'tr' ? 'tr-TR' : 'en-US', {
    day: 'numeric',
    month: 'short',
  })
  const dayLabel = (value: unknown) => day.format(new Date(`${String(value)}T00:00:00`))

  return (
    <ChartCard title={text.dailyUsersTitle} description={text.dailyUsersBody} height={320}>
      <LineChart data={dailyActiveUsers} margin={{ top: 16, right: 16, bottom: 0, left: 8 }}>
        <CartesianGrid stroke={chart.grid} strokeDasharray="4 4" vertical={false} />
        <XAxis
          dataKey="date"
          tick={chart.tick}
          tickFormatter={dayLabel}
          stroke={chart.axis}
          tickLine={false}
          minTickGap={24}
        />
        <YAxis
          tick={chart.tick}
          tickFormatter={format.compact}
          stroke={chart.axis}
          tickLine={false}
          axisLine={false}
          width={48}
        />
        <Tooltip {...chart.tooltip} labelFormatter={dayLabel} formatter={forChart(format.number)} />
        <ReferenceArea
          x1={outageWindow.from}
          x2={outageWindow.to}
          fill={token.colorErrorBg}
          fillOpacity={0.8}
          label={{
            value: text.outage,
            position: 'insideTop',
            fill: token.colorError,
            fontSize: 12,
          }}
        />
        <ReferenceLine
          y={average}
          stroke={token.colorTextTertiary}
          strokeDasharray="6 4"
          label={{
            value: `${text.average} ${format.compact(average)}`,
            position: 'insideTopLeft',
            fill: chart.tick.fill,
            fontSize: 12,
          }}
        />
        <Line
          type="monotone"
          dataKey="users"
          name={text.dailyUsers}
          stroke={chart.series[0]}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
        <Brush
          dataKey="date"
          height={28}
          startIndex={30}
          tickFormatter={dayLabel}
          stroke={chart.series[0]}
          fill={token.colorBgContainer}
          travellerWidth={10}
        />
      </LineChart>
    </ChartCard>
  )
}
