import { Col, Row, Tag } from 'antd'
import { LineChartOutlined } from '@ant-design/icons'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import {
  ActivityHeatmap,
  BreakdownPieChart,
  BrowserShareAreaChart,
  BundleTreemapChart,
  CohortRetentionTable,
  CountriesBarChart,
  DailyUsersBrushChart,
  KpiSparklineCards,
  LatencyLineChart,
  LighthouseRadarChart,
  MrrWaterfallChart,
  NpsGaugeChart,
  ObjectiveRadialChart,
  OnboardingFunnelChart,
  RevenueAreaChart,
  RouteScatterChart,
  SignupsComposedChart,
  TicketsStackedBarChart,
} from '@/features/analytics/components'
import { accountsByPlan, sessionsByDevice } from '@/features/analytics/data'
import { useMessages } from '@/i18n/messages'
import './AnalyticsPage.css'

export function AnalyticsPage() {
  const messages = useMessages()

  return (
    <div className="admin-page">
      <PageHeader
        title={messages.analytics.title}
        description={messages.analytics.description}
        extra={
          <Tag icon={<LineChartOutlined aria-hidden="true" />}>{messages.analytics.badge}</Tag>
        }
      />

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <KpiSparklineCards />
        </Col>

        <Col xs={24} xl={16}>
          <RevenueAreaChart />
        </Col>
        <Col xs={24} xl={8}>
          <BreakdownPieChart
            title={messages.analytics.devicesTitle}
            description={messages.analytics.devicesBody}
            data={sessionsByDevice}
            labels={messages.analytics.devices}
            donut
          />
        </Col>

        <Col xs={24} xl={16}>
          <DailyUsersBrushChart />
        </Col>
        <Col xs={24} xl={8}>
          <NpsGaugeChart />
        </Col>

        <Col xs={24} xl={12}>
          <MrrWaterfallChart />
        </Col>
        <Col xs={24} xl={12}>
          <TicketsStackedBarChart />
        </Col>

        <Col xs={24} xl={14}>
          <SignupsComposedChart />
        </Col>
        <Col xs={24} xl={10}>
          <OnboardingFunnelChart />
        </Col>

        <Col xs={24} xl={14}>
          <ActivityHeatmap />
        </Col>
        <Col xs={24} xl={10}>
          <CountriesBarChart />
        </Col>

        <Col xs={24} xl={14}>
          <CohortRetentionTable />
        </Col>
        <Col xs={24} xl={10}>
          <BrowserShareAreaChart />
        </Col>

        <Col xs={24} xl={14}>
          <LatencyLineChart />
        </Col>
        <Col xs={24} xl={10}>
          <ObjectiveRadialChart />
        </Col>

        <Col xs={24} xl={12}>
          <RouteScatterChart />
        </Col>
        <Col xs={24} xl={12}>
          <LighthouseRadarChart />
        </Col>

        <Col xs={24} xl={14}>
          <BundleTreemapChart />
        </Col>
        <Col xs={24} xl={10}>
          <BreakdownPieChart
            title={messages.analytics.plansTitle}
            description={messages.analytics.plansBody}
            data={accountsByPlan}
            labels={messages.analytics.plans}
          />
        </Col>
      </Row>
    </div>
  )
}
