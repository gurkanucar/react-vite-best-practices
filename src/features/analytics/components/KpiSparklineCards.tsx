import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons'
import { Card, Col, Flex, Row, Statistic, Tag, theme, Typography } from 'antd'
import { Area, AreaChart, ResponsiveContainer, YAxis } from 'recharts'
import { kpiTrends, type KpiTrend } from '@/features/analytics/data'
import { useChartFormatters } from '@/features/analytics/hooks'
import { useMessages } from '@/i18n/messages'

/**
 * Headline numbers with a sparkline each: the figure says where things are, the line says
 * which way they are heading. The colour follows whether the change is good news, so a
 * falling churn rate is green.
 */
export function KpiSparklineCards() {
  const messages = useMessages()
  const { token } = theme.useToken()
  const format = useChartFormatters()

  const display = (kpi: KpiTrend) => {
    if (kpi.format === 'currency') return `$${format.number(kpi.value)}`
    if (kpi.format === 'percent') return format.percent(kpi.value)
    return format.number(kpi.value)
  }

  return (
    <Row gutter={[16, 16]}>
      {kpiTrends.map((kpi) => {
        const good = kpi.change >= 0 === kpi.higherIsBetter
        const color = good ? token.colorSuccess : token.colorError
        const data = kpi.trend.map((value, index) => ({ index, value }))

        return (
          <Col key={kpi.id} xs={24} sm={12} xl={6}>
            <Card className="dashboard-panel kpi-card" size="small">
              <Statistic title={messages.analytics.kpis[kpi.id]} value={display(kpi)} />
              <Flex align="center" gap={8} className="kpi-card__change">
                <Tag
                  color={good ? 'success' : 'error'}
                  icon={kpi.change >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                >
                  {format.percent(Math.abs(kpi.change))}
                </Tag>
                <Typography.Text type="secondary">
                  {messages.analytics.vsLastPeriod}
                </Typography.Text>
              </Flex>
              <div className="kpi-card__spark" aria-hidden="true">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
                    <defs>
                      <linearGradient id={`kpi-${kpi.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity={0.35} />
                        <stop offset="100%" stopColor={color} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    {/* Hidden, but it lets the line use the card's height instead of starting at 0. */}
                    <YAxis hide domain={['dataMin', 'dataMax']} />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={color}
                      strokeWidth={2}
                      fill={`url(#kpi-${kpi.id})`}
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Col>
        )
      })}
    </Row>
  )
}
