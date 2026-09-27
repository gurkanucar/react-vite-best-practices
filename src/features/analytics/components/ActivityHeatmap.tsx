import { Card, Flex, Tooltip, Typography } from 'antd'
import { sessionsByHour, type DayId } from '@/features/analytics/data'
import { useChartFormatters } from '@/features/analytics/hooks'
import { useMessages } from '@/i18n/messages'

const days: DayId[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
const hours = Array.from({ length: 24 }, (_, hour) => hour)
const peak = Math.max(...sessionsByHour.flat())
/** Five steps read better than a smooth ramp: the eye compares bands, not exact tints. */
const LEVELS = 5

const level = (value: number) => Math.min(LEVELS - 1, Math.floor((value / peak) * LEVELS))
const hourLabel = (hour: number) => String(hour).padStart(2, '0')

/**
 * Recharts has no heatmap, and a table of shaded cells is simpler than bending one of its
 * charts into one. It is a real table, so a screen reader can walk it by day and hour. Each
 * cell is the primary colour at the strength of its band, so it follows the theme.
 */
export function ActivityHeatmap() {
  const messages = useMessages()
  const text = messages.analytics
  const format = useChartFormatters()

  return (
    <Card className="dashboard-panel chart-card" title={text.heatmapTitle}>
      <Typography.Paragraph type="secondary">{text.heatmapBody}</Typography.Paragraph>
      <div className="activity-heatmap">
        <table aria-label={text.heatmapTitle}>
          <tbody>
            {days.map((day, dayIndex) => (
              <tr key={day}>
                <th scope="row">{text.days[day]}</th>
                {sessionsByHour[dayIndex].map((value, hour) => {
                  const label = text.heatmapCell
                    .replace('{day}', text.days[day])
                    .replace('{hour}', hourLabel(hour))
                    .replace('{count}', format.number(value))

                  return (
                    <Tooltip key={hour} title={label} mouseEnterDelay={0}>
                      <td
                        className={`activity-heatmap__cell activity-heatmap__cell--${level(value)}`}
                        aria-label={label}
                      />
                    </Tooltip>
                  )
                })}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td aria-hidden="true" />
              {hours.map((hour) => (
                <th key={hour} scope="col">
                  {/* Every third hour is enough to find your place without crowding the row. */}
                  {hour % 3 === 0 ? hourLabel(hour) : ''}
                </th>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
      <Flex align="center" gap={6} justify="end" className="activity-heatmap__legend">
        <Typography.Text type="secondary">{text.fewer}</Typography.Text>
        {Array.from({ length: LEVELS }, (_, index) => (
          <span
            key={index}
            className={`activity-heatmap__swatch activity-heatmap__cell--${index}`}
          />
        ))}
        <Typography.Text type="secondary">{text.more}</Typography.Text>
      </Flex>
    </Card>
  )
}
