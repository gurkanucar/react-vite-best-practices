import { Card, Typography } from 'antd'
import type { ReactNode } from 'react'
import { ResponsiveContainer } from 'recharts'

interface ChartCardProps {
  title: string
  description: string
  /**
   * `ResponsiveContainer` measures its parent, so the height has to come from somewhere
   * that is not the chart itself. A number here is that source.
   */
  height?: number
  extra?: ReactNode
  children: ReactNode
}

export function ChartCard({ title, description, height = 280, extra, children }: ChartCardProps) {
  return (
    <Card className="dashboard-panel chart-card" title={title} extra={extra}>
      <Typography.Paragraph type="secondary">{description}</Typography.Paragraph>
      <div className="chart-card__canvas" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
