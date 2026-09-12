import { ArrowDownOutlined, ArrowUpOutlined, ClockCircleOutlined } from '@ant-design/icons'
import {
  Alert,
  Badge,
  Card,
  Col,
  Flex,
  Progress,
  Row,
  Statistic,
  Table,
  Tag,
  Typography,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PageHeader } from '@/components/PageHeader/PageHeader'
// A leaf import: the components barrel would pull every chart type, and with it all of
// recharts, into the chunk this page shares.
import { ThroughputBarChart } from '@/features/analytics/components/ThroughputBarChart'
import { useMessages } from '@/i18n/messages'
import { usePreferencesStore } from '@/store/preferences-store'

interface ActivityRow {
  key: string
  event: string
  actor: string
  status: 'Completed' | 'Processing' | 'Review'
  time: string
}

export function DashboardPage() {
  const messages = useMessages()
  const language = usePreferencesStore((state) => state.language)
  const numberLocale = language === 'tr' ? 'tr-TR' : 'en-US'

  const activities: ActivityRow[] = [
    {
      key: '1',
      event: language === 'tr' ? 'Production sürümü yayınlandı' : 'Production release deployed',
      actor: 'Maya Chen',
      status: 'Completed',
      time: language === 'tr' ? '8 dk önce' : '8 min ago',
    },
    {
      key: '2',
      event: language === 'tr' ? 'Yeni çalışma alanı oluşturuldu' : 'New workspace provisioned',
      actor: 'Noah Williams',
      status: 'Processing',
      time: language === 'tr' ? '24 dk önce' : '24 min ago',
    },
    {
      key: '3',
      event: language === 'tr' ? 'Erişim politikası güncellendi' : 'Access policy updated',
      actor: 'Ava Patel',
      status: 'Review',
      time: language === 'tr' ? '1 sa önce' : '1 hour ago',
    },
  ]

  const columns: ColumnsType<ActivityRow> = [
    { title: messages.dashboard.event, dataIndex: 'event', key: 'event', width: 320 },
    { title: messages.dashboard.actor, dataIndex: 'actor', key: 'actor', width: 180 },
    {
      title: messages.dashboard.status,
      dataIndex: 'status',
      key: 'status',
      width: 140,
      render: (status: ActivityRow['status']) => {
        const color = status === 'Completed' ? 'success' : status === 'Processing' ? 'blue' : 'gold'
        return <Tag color={color}>{status}</Tag>
      },
    },
    { title: messages.dashboard.time, dataIndex: 'time', key: 'time', width: 140 },
  ]

  const metrics = [
    {
      label: messages.dashboard.revenue,
      value: 128400,
      prefix: '$',
      suffix: undefined,
      detail: messages.dashboard.revenueDelta,
      trend: 'up',
    },
    {
      label: messages.dashboard.workspaces,
      value: 2847,
      prefix: undefined,
      suffix: undefined,
      detail: messages.dashboard.workspaceDelta,
      trend: 'up',
    },
    {
      label: messages.dashboard.conversion,
      value: 24.8,
      prefix: undefined,
      suffix: '%',
      detail: messages.dashboard.conversionDelta,
      trend: 'up',
    },
    {
      label: messages.dashboard.incidents,
      value: 3,
      prefix: undefined,
      suffix: undefined,
      detail: messages.dashboard.incidentDelta,
      trend: 'down',
    },
  ] as const

  return (
    <div className="admin-page">
      <PageHeader
        title={messages.dashboard.title}
        description={messages.dashboard.description}
        extra={<Tag icon={<ClockCircleOutlined />}>{messages.dashboard.period}</Tag>}
      />

      <Row gutter={[16, 16]}>
        {metrics.map((metric) => (
          <Col xs={24} sm={12} xl={6} key={metric.label}>
            <Card className="metric-panel">
              <Statistic
                title={metric.label}
                value={metric.value}
                prefix={metric.prefix}
                suffix={metric.suffix}
                formatter={(value) => Number(value).toLocaleString(numberLocale)}
              />
              <Tag
                className="metric-panel__delta"
                color={metric.trend === 'up' ? 'success' : 'warning'}
                icon={metric.trend === 'up' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              >
                {metric.detail}
              </Tag>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} className="dashboard-grid">
        <Col xs={24} xl={16}>
          <Card className="dashboard-panel" title={messages.dashboard.throughput}>
            <Typography.Paragraph type="secondary">
              {messages.dashboard.throughputDescription}
            </Typography.Paragraph>
            <ThroughputBarChart />
          </Card>
        </Col>
        <Col xs={24} xl={8}>
          <Card
            className="dashboard-panel health-panel"
            title={messages.dashboard.health}
            extra={<Badge status="success" text={messages.dashboard.healthy} />}
          >
            <div className="health-row">
              <Flex justify="space-between">
                <Typography.Text>{messages.dashboard.api}</Typography.Text>
                <Typography.Text strong>99.98%</Typography.Text>
              </Flex>
              <Progress percent={99.98} showInfo={false} status="success" />
            </div>
            <div className="health-row">
              <Flex justify="space-between">
                <Typography.Text>{messages.dashboard.jobs}</Typography.Text>
                <Typography.Text strong>96%</Typography.Text>
              </Flex>
              <Progress percent={96} showInfo={false} status="success" />
            </div>
            <div className="health-row">
              <Flex justify="space-between">
                <Typography.Text>{messages.dashboard.storage}</Typography.Text>
                <Typography.Text strong>68%</Typography.Text>
              </Flex>
              <Progress percent={68} showInfo={false} />
            </div>
            <Alert
              className="health-panel__footer"
              showIcon
              type="success"
              title={messages.dashboard.servicesHealthy}
            />
          </Card>
        </Col>
      </Row>

      <Card className="dashboard-panel activity-panel" title={messages.dashboard.activity}>
        <Table<ActivityRow>
          columns={columns}
          dataSource={activities}
          pagination={false}
          scroll={{ x: 'max-content' }}
          size="middle"
        />
      </Card>
    </div>
  )
}
