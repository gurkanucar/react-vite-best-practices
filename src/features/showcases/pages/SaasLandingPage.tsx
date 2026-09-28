import {
  AlertOutlined,
  ApiOutlined,
  ArrowRightOutlined,
  BellOutlined,
  CalendarOutlined,
  CheckCircleFilled,
  DashboardOutlined,
  GlobalOutlined,
  PlayCircleOutlined,
  RobotOutlined,
  ThunderboltFilled,
} from '@ant-design/icons'
import {
  Avatar,
  Button,
  Card,
  Col,
  Collapse,
  Flex,
  Form,
  Grid,
  Input,
  Rate,
  Row,
  Space,
  Steps,
  Tag,
  Typography,
} from 'antd'
import { useNavigate } from 'react-router'
import { ShowcasePreviewFrame } from '@/features/showcases/components'
import { SaasSiteShell } from '@/features/showcases/components/SaasSiteShell'
import {
  formatMoney,
  planCopy,
  plans,
  quote,
  saasCopy,
  saasRoot,
} from '@/features/showcases/data/saas'
import { usePreferencesStore } from '@/store/preferences-store'
import '../showcases.css'
import '../saas.css'

interface SaasLandingPageProps {
  standalone?: boolean
}

const featureIcons = [
  <DashboardOutlined key="dashboards" />,
  <GlobalOutlined key="uptime" />,
  <BellOutlined key="alerts" />,
  <CalendarOutlined key="oncall" />,
  <AlertOutlined key="status" />,
  <RobotOutlined key="ai" />,
]

const customers = ['Lumen Pay', 'Northwind', 'Kargoo', 'Atlas Health', 'Veridian', 'Orbitly']

const integrations = [
  { name: 'Slack', color: '#4a154b' },
  { name: 'GitHub', color: '#24292f' },
  { name: 'Datadog', color: '#632ca6' },
  { name: 'Prometheus', color: '#e6522c' },
  { name: 'AWS', color: '#ff9900' },
  { name: 'Google Cloud', color: '#4285f4' },
  { name: 'Jira', color: '#0052cc' },
  { name: 'PagerDuty', color: '#06ac38' },
  { name: 'Kubernetes', color: '#326ce5' },
  { name: 'Teams', color: '#5059c9' },
  { name: 'Grafana', color: '#f46800' },
  { name: 'Webhooks', color: '#5b4ce6' },
]

/** Requests per minute over the last hour, drawn as bars in the product mock. */
const traffic = [42, 55, 48, 61, 58, 70, 66, 74, 69, 83, 77, 91, 86, 79, 95, 88, 72, 64, 81, 90]

function ProductMock() {
  const language = usePreferencesStore((state) => state.language)
  const mock = saasCopy[language].mock

  return (
    <div className="saas-mock" aria-hidden="true">
      <div className="saas-mock__bar">
        <span />
        <span />
        <span />
      </div>
      <div className="saas-mock__body">
        <Flex justify="space-between" align="center" gap={8}>
          <Typography.Text strong>{mock.title}</Typography.Text>
          <Tag variant="filled" color="green">
            <span className="saas-mock__pulse" /> {mock.live}
          </Tag>
        </Flex>
        <div className="saas-mock__kpis">
          {[
            [mock.uptime, '99.98%', 'up'],
            [mock.latency, '182 ms', 'up'],
            [mock.errors, '0.4%', 'down'],
          ].map(([label, value, trend]) => (
            <div key={label} className="saas-mock__kpi">
              <span>{label}</span>
              <strong>{value}</strong>
              <em className={`saas-mock__trend saas-mock__trend--${trend}`} />
            </div>
          ))}
        </div>
        <div className="saas-mock__chart">
          <span className="saas-mock__chart-label">{mock.requests}</span>
          <div className="saas-mock__bars">
            {traffic.map((value, index) => (
              <span key={index} style={{ height: `${value}%` }} />
            ))}
          </div>
        </div>
        <div className="saas-mock__incidents">
          <span className="saas-mock__chart-label">{mock.incidents}</span>
          {mock.incidentItems.map(([title, status], index) => (
            <Flex key={title} justify="space-between" align="center" gap={8}>
              <span className="saas-mock__incident">
                <i className={index === 0 ? 'is-critical' : 'is-warning'} />
                {title}
              </span>
              <Tag variant="filled" color={index === 0 ? 'red' : 'gold'}>
                {status}
              </Tag>
            </Flex>
          ))}
        </div>
      </div>
      <div className="saas-mock__toast">
        <ThunderboltFilled /> {language === 'tr' ? 'Olay özeti hazır' : 'Incident summary ready'}
      </div>
    </div>
  )
}

export function SaasLandingPage({ standalone = false }: SaasLandingPageProps) {
  const language = usePreferencesStore((state) => state.language)
  const text = saasCopy[language]
  const root = saasRoot(standalone)
  const navigate = useNavigate()
  const isDesktop = Grid.useBreakpoint().lg ?? false
  const toPricing = () => void navigate(`${root}/pricing`)

  const page = (
    <SaasSiteShell standalone={standalone}>
      <section className="showcase-hero saas-hero">
        <div className="showcase-hero__copy">
          <Tag variant="filled" color="purple" icon={<RobotOutlined />}>
            {text.eyebrow}
          </Tag>
          <Typography.Title>{text.title}</Typography.Title>
          <Typography.Paragraph>{text.description}</Typography.Paragraph>
          <Space wrap>
            <Button type="primary" size="large" onClick={toPricing}>
              {text.startFree} <ArrowRightOutlined />
            </Button>
            <Button size="large" icon={<PlayCircleOutlined />} href="#saas-demo">
              {text.bookDemo}
            </Button>
          </Space>
          <Typography.Paragraph type="secondary" className="saas-hero__note">
            <CheckCircleFilled /> {text.heroNote}
          </Typography.Paragraph>
        </div>
        <ProductMock />
      </section>

      <section className="saas-logos" aria-label={text.logosTitle}>
        <Typography.Text type="secondary">{text.logosTitle}</Typography.Text>
        <ul>
          {customers.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      </section>

      <section className="showcase-section" id="saas-features">
        <div className="showcase-section__heading">
          <Typography.Title level={2}>{text.featuresTitle}</Typography.Title>
          <Typography.Paragraph>{text.featuresDescription}</Typography.Paragraph>
        </div>
        <Row gutter={[20, 20]}>
          {text.features.map(([title, description], index) => (
            <Col xs={24} md={12} lg={8} key={title}>
              <Card className="showcase-feature-card" variant="borderless">
                <div className="showcase-feature-card__icon">{featureIcons[index]}</div>
                <Typography.Title level={4}>{title}</Typography.Title>
                <Typography.Paragraph type="secondary">{description}</Typography.Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      <section className="showcase-section saas-steps">
        <div className="showcase-section__heading">
          <Typography.Title level={2}>{text.stepsTitle}</Typography.Title>
        </div>
        <Steps
          current={4}
          orientation={isDesktop ? 'horizontal' : 'vertical'}
          items={text.steps.map(([title, description]) => ({ title, content: description }))}
        />
      </section>

      <section className="showcase-section" id="saas-customers">
        <Card className="saas-testimonial" variant="borderless">
          <Row gutter={[40, 32]} align="middle">
            <Col xs={24} lg={14}>
              <Rate disabled defaultValue={5} />
              <blockquote>{text.testimonialQuote}</blockquote>
              <Flex align="center" gap={12}>
                <Avatar size={48} className="saas-testimonial__avatar">
                  SA
                </Avatar>
                <div>
                  <Typography.Text strong>{text.testimonialName}</Typography.Text>
                  <br />
                  <Typography.Text type="secondary">{text.testimonialRole}</Typography.Text>
                </div>
              </Flex>
            </Col>
            <Col xs={24} lg={10}>
              <div className="saas-stats">
                {text.stats.map(([value, label]) => (
                  <div key={label}>
                    <strong>{value}</strong>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </Card>
      </section>

      <section className="showcase-section saas-integrations">
        <Row gutter={[40, 32]} align="middle">
          <Col xs={24} lg={9}>
            <Typography.Title level={2}>{text.integrationsTitle}</Typography.Title>
            <Typography.Paragraph>{text.integrationsDescription}</Typography.Paragraph>
            <Button icon={<ApiOutlined />}>
              {language === 'tr' ? 'API dokümantasyonu' : 'API documentation'}
            </Button>
          </Col>
          <Col xs={24} lg={15}>
            <ul className="saas-integrations__grid">
              {integrations.map((item) => (
                <li key={item.name}>
                  <span className="saas-integrations__mark" style={{ background: item.color }}>
                    {item.name.charAt(0)}
                  </span>
                  {item.name}
                </li>
              ))}
            </ul>
          </Col>
        </Row>
      </section>

      <section className="showcase-section saas-teaser">
        <div className="showcase-section__heading">
          <Typography.Title level={2}>{text.pricingTeaserTitle}</Typography.Title>
          <Typography.Paragraph>{text.pricingTeaserDescription}</Typography.Paragraph>
        </div>
        <Row gutter={[20, 20]}>
          {plans
            .filter((plan) => plan.id !== 'enterprise')
            .map((plan) => {
              const price = quote(plan, { cycle: 'yearly', seats: 1, currency: 'USD' })
              const copy = planCopy[language][plan.id]

              return (
                <Col xs={24} md={8} key={plan.id}>
                  <Card
                    className={`saas-teaser__card${plan.popular ? ' is-popular' : ''}`}
                    variant="borderless"
                  >
                    <Flex justify="space-between" align="center">
                      <Typography.Title level={4}>{copy.name}</Typography.Title>
                      {plan.popular && (
                        <Tag variant="filled" color="purple">
                          {language === 'tr' ? 'En popüler' : 'Most popular'}
                        </Tag>
                      )}
                    </Flex>
                    <Typography.Paragraph type="secondary">{copy.description}</Typography.Paragraph>
                    <div className="saas-price">
                      <strong>{formatMoney(price.perSeatMonthly, 'USD', language)}</strong>
                      <span>{text.perSeat}</span>
                    </div>
                  </Card>
                </Col>
              )
            })}
        </Row>
        <Flex justify="center" className="saas-teaser__more">
          <Button type="link" size="large" onClick={toPricing}>
            {text.seePricing} <ArrowRightOutlined />
          </Button>
        </Flex>
      </section>

      <section className="showcase-section saas-faq">
        <Row gutter={[40, 24]}>
          <Col xs={24} lg={8}>
            <Typography.Title level={2}>{text.faqTitle}</Typography.Title>
          </Col>
          <Col xs={24} lg={16}>
            <Collapse
              ghost
              size="large"
              defaultActiveKey={['0']}
              items={text.faq.map(([question, answer], index) => ({
                key: String(index),
                label: question,
                children: <Typography.Paragraph>{answer}</Typography.Paragraph>,
              }))}
            />
          </Col>
        </Row>
      </section>

      <section className="showcase-cta saas-cta" id="saas-demo">
        <Typography.Title level={2}>{text.ctaTitle}</Typography.Title>
        <Typography.Paragraph>{text.ctaDescription}</Typography.Paragraph>
        <Form
          layout="inline"
          className="saas-cta__form"
          onFinish={toPricing}
          aria-label={text.ctaTitle}
        >
          <Form.Item name="email" className="saas-cta__email">
            <Input
              size="large"
              type="email"
              placeholder={text.workEmail}
              aria-label={text.workEmail}
            />
          </Form.Item>
          <Button size="large" htmlType="submit" className="saas-cta__submit">
            {text.startFree}
          </Button>
        </Form>
      </section>
    </SaasSiteShell>
  )

  return (
    <ShowcasePreviewFrame
      standalone={standalone}
      standalonePath="/preview/saas"
      title={{ en: saasCopy.en.previewTitle, tr: saasCopy.tr.previewTitle }}
      description={{ en: saasCopy.en.previewDescription, tr: saasCopy.tr.previewDescription }}
    >
      {page}
    </ShowcasePreviewFrame>
  )
}
