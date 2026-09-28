import {
  CheckCircleFilled,
  CheckOutlined,
  MinusOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import {
  Alert,
  Button,
  Card,
  Col,
  Collapse,
  Flex,
  Grid,
  InputNumber,
  Row,
  Segmented,
  Select,
  Slider,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { ShowcasePreviewFrame } from '@/features/showcases/components'
import { SaasSiteShell } from '@/features/showcases/components/SaasSiteShell'
import {
  comparison,
  CURRENCIES,
  formatMoney,
  MAX_SEATS,
  MIN_SEATS,
  parsePricingSettings,
  planCopy,
  plans,
  pricingCopy,
  quote,
  recommendedPlan,
  saasCopy,
  type BillingCycle,
  type Currency,
  type FeatureValue,
  type PlanId,
  type PricingSettings,
} from '@/features/showcases/data/saas'
import { usePreferencesStore, type Language } from '@/store/preferences-store'
import '../showcases.css'
import '../saas.css'

interface SaasPricingPageProps {
  standalone?: boolean
}

function FeatureCell({ value, language }: { value: FeatureValue; language: Language }) {
  const text = pricingCopy[language]
  if (value === true) {
    return <CheckOutlined className="saas-compare__yes" aria-label={text.included} />
  }
  if (value === false) {
    return <MinusOutlined className="saas-compare__no" aria-label={text.notIncluded} />
  }
  return <span>{value[language]}</span>
}

interface ComparisonRow {
  key: string
  group?: string
  label?: string
  values?: Record<PlanId, FeatureValue>
}

function ComparisonTable({ language }: { language: Language }) {
  const text = pricingCopy[language]
  const rows: ComparisonRow[] = comparison.flatMap((group) => [
    { key: group.key, group: group.title[language] },
    ...group.features.map((feature) => ({
      key: `${group.key}-${feature.key}`,
      label: feature.label[language],
      values: feature.values,
    })),
  ])
  const groupCell = (row: ComparisonRow) => (row.group ? { colSpan: 0 } : {})

  const columns: ColumnsType<ComparisonRow> = [
    {
      key: 'feature',
      title: text.feature,
      width: '32%',
      onCell: (row) => (row.group ? { colSpan: plans.length + 1 } : {}),
      render: (_, row) =>
        row.group ? (
          <Typography.Text strong className="saas-compare__group">
            {row.group}
          </Typography.Text>
        ) : (
          row.label
        ),
    },
    ...plans.map((plan) => ({
      key: plan.id,
      title: (
        <span className={plan.popular ? 'saas-compare__popular' : undefined}>
          {planCopy[language][plan.id].name}
        </span>
      ),
      align: 'center' as const,
      onCell: groupCell,
      render: (_: unknown, row: ComparisonRow) =>
        row.values && <FeatureCell value={row.values[plan.id]} language={language} />,
    })),
  ]

  return (
    <Table<ComparisonRow>
      className="saas-compare"
      columns={columns}
      dataSource={rows}
      pagination={false}
      sticky
      rowClassName={(row) => (row.group ? 'saas-compare__group-row' : '')}
    />
  )
}

/** On a phone four columns do not fit: one plan at a time, grouped the same way. */
function ComparisonList({ language }: { language: Language }) {
  const [planId, setPlanId] = useState<PlanId>('business')

  return (
    <div className="saas-compare-list">
      <Segmented<PlanId>
        block
        value={planId}
        onChange={setPlanId}
        options={plans.map((plan) => ({ value: plan.id, label: planCopy[language][plan.id].name }))}
      />
      {comparison.map((group) => (
        <section key={group.key}>
          <Typography.Title level={5}>{group.title[language]}</Typography.Title>
          <ul>
            {group.features.map((feature) => (
              <li key={feature.key}>
                <span>{feature.label[language]}</span>
                <FeatureCell value={feature.values[planId]} language={language} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

export function SaasPricingPage({ standalone = false }: SaasPricingPageProps) {
  const language = usePreferencesStore((state) => state.language)
  const text = pricingCopy[language]
  const isDesktop = Grid.useBreakpoint().lg ?? false
  const [params, setParams] = useSearchParams()
  const settings = parsePricingSettings(params)
  const { cycle, seats, currency } = settings
  const fits = recommendedPlan(seats)

  // The controls live in the address, so a quote for "25 people, yearly, in euros" is a link.
  const update = (change: Partial<PricingSettings>) => {
    const next = { ...settings, ...change }
    setParams(
      { billing: next.cycle, seats: String(next.seats), currency: next.currency },
      { replace: true },
    )
  }

  const page = (
    <SaasSiteShell standalone={standalone}>
      <section className="saas-pricing-hero">
        <Tag variant="filled" color="purple">
          {text.eyebrow}
        </Tag>
        <Typography.Title>{text.title}</Typography.Title>
        <Typography.Paragraph>{text.description}</Typography.Paragraph>

        <Card className="saas-controls" variant="borderless">
          <Flex gap={24} wrap align="flex-end" className="saas-controls__row">
            <div className="saas-controls__field">
              <Typography.Text strong id="saas-billing">
                {text.billing}
              </Typography.Text>
              <Segmented<BillingCycle>
                aria-labelledby="saas-billing"
                value={cycle}
                onChange={(value) => update({ cycle: value })}
                options={[
                  { value: 'monthly', label: text.monthly },
                  {
                    value: 'yearly',
                    label: (
                      <span>
                        {text.yearly}{' '}
                        <Tag variant="filled" color="green" className="saas-controls__save">
                          {text.twoMonthsFree}
                        </Tag>
                      </span>
                    ),
                  },
                ]}
              />
            </div>
            <div className="saas-controls__field saas-controls__seats">
              <Typography.Text strong>
                <TeamOutlined /> {text.seats}
              </Typography.Text>
              <Flex gap={12} align="center">
                <Slider
                  className="saas-controls__slider"
                  min={MIN_SEATS}
                  max={100}
                  value={Math.min(seats, 100)}
                  onChange={(value) => update({ seats: value })}
                  aria-label={text.seats}
                />
                <InputNumber
                  min={MIN_SEATS}
                  max={MAX_SEATS}
                  value={seats}
                  precision={0}
                  onChange={(value) => value !== null && update({ seats: value })}
                  aria-label={language === 'tr' ? 'Kişi sayısı' : 'Number of people'}
                  className="saas-controls__number"
                />
              </Flex>
            </div>
            <div className="saas-controls__field">
              <Typography.Text strong>{text.currency}</Typography.Text>
              <Select<Currency>
                value={currency}
                onChange={(value) => update({ currency: value })}
                options={CURRENCIES.map((value) => ({ value, label: value }))}
                aria-label={text.currency}
                className="saas-controls__currency"
              />
            </div>
          </Flex>
        </Card>
      </section>

      <section className="showcase-section saas-plans">
        <Row gutter={[20, 20]}>
          {plans.map((plan) => {
            const copy = planCopy[language][plan.id]
            const price = quote(plan, { cycle, seats, currency })
            const money = (amount: number) => formatMoney(amount, currency, language)

            return (
              <Col xs={24} md={12} xl={6} key={plan.id}>
                <Card
                  variant="borderless"
                  className={`saas-plan${plan.popular ? ' is-popular' : ''}${price.overLimit ? ' is-disabled' : ''}`}
                  aria-label={copy.name}
                >
                  <Flex justify="space-between" align="center" gap={8} wrap>
                    <Typography.Title level={3}>{copy.name}</Typography.Title>
                    <Space size={4} wrap>
                      {plan.popular && (
                        <Tag variant="solid" color="purple">
                          {text.popular}
                        </Tag>
                      )}
                      {plan.id === fits && !plan.popular && (
                        <Tag variant="filled" color="green">
                          {text.recommended}
                        </Tag>
                      )}
                    </Space>
                  </Flex>
                  <Typography.Paragraph type="secondary" className="saas-plan__description">
                    {copy.description}
                  </Typography.Paragraph>

                  <div className="saas-price saas-plan__price">
                    {price.custom ? (
                      <>
                        <strong>{text.custom}</strong>
                        <span>{text.customNote}</span>
                      </>
                    ) : price.perSeatMonthly === 0 ? (
                      <>
                        <strong>{text.free}</strong>
                        <span>{text.seatsLabel(Math.min(seats, plan.maxSeats ?? seats))}</span>
                      </>
                    ) : (
                      <>
                        <strong>{money(price.perSeatMonthly)}</strong>
                        <span>{text.perSeat}</span>
                      </>
                    )}
                  </div>

                  <div className="saas-plan__total" aria-live="polite">
                    {price.overLimit ? (
                      <Alert type="warning" showIcon title={text.overLimit(plan.maxSeats ?? 0)} />
                    ) : (
                      !price.custom &&
                      price.invoiceTotal > 0 && (
                        <>
                          <Typography.Text>
                            {cycle === 'yearly'
                              ? text.billedYearly(money(price.invoiceTotal))
                              : text.billedMonthly(money(price.invoiceTotal))}
                          </Typography.Text>
                          {cycle === 'yearly' && (
                            <Typography.Text type="success">
                              {text.youSave(money(price.yearlySavings))}
                            </Typography.Text>
                          )}
                          {price.billedSeats > seats && (
                            <Typography.Text type="secondary">
                              {text.minimumSeats(plan.minSeats)}
                            </Typography.Text>
                          )}
                        </>
                      )
                    )}
                  </div>

                  <Button
                    block
                    size="large"
                    type={plan.popular ? 'primary' : 'default'}
                    disabled={price.overLimit}
                    href={plan.id === 'enterprise' ? '#saas-enterprise' : undefined}
                  >
                    {copy.cta}
                  </Button>

                  <ul className="saas-plan__highlights">
                    {copy.highlights.map((item) => (
                      <li key={item}>
                        <CheckCircleFilled /> {item}
                      </li>
                    ))}
                  </ul>
                </Card>
              </Col>
            )
          })}
        </Row>
      </section>

      <section className="showcase-section saas-compare-section">
        <div className="showcase-section__heading">
          <Typography.Title level={2}>{text.compareTitle}</Typography.Title>
          <Typography.Paragraph>{text.compareDescription}</Typography.Paragraph>
        </div>
        {isDesktop ? (
          <ComparisonTable language={language} />
        ) : (
          <ComparisonList language={language} />
        )}
      </section>

      <section className="showcase-section" id="saas-enterprise">
        <Card className="saas-enterprise" variant="borderless">
          <Row gutter={[32, 24]} align="middle">
            <Col xs={24} lg={14}>
              <SafetyCertificateOutlined className="saas-enterprise__icon" />
              <Typography.Title level={2}>{text.enterpriseTitle}</Typography.Title>
              <Typography.Paragraph>{text.enterpriseDescription}</Typography.Paragraph>
            </Col>
            <Col xs={24} lg={10}>
              <ul className="saas-enterprise__points">
                {text.enterprisePoints.map((point) => (
                  <li key={point}>
                    <CheckCircleFilled /> {point}
                  </li>
                ))}
              </ul>
              <Button size="large" type="primary" href="mailto:sales@pulseboard.example">
                {text.enterpriseCta}
              </Button>
            </Col>
          </Row>
        </Card>
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
              items={text.faq.map(([question, answer], index) => ({
                key: String(index),
                label: question,
                children: <Typography.Paragraph>{answer}</Typography.Paragraph>,
              }))}
            />
          </Col>
        </Row>
      </section>
    </SaasSiteShell>
  )

  return (
    <ShowcasePreviewFrame
      standalone={standalone}
      standalonePath="/preview/saas/pricing"
      title={{ en: saasCopy.en.previewTitle, tr: saasCopy.tr.previewTitle }}
      description={{ en: saasCopy.en.previewDescription, tr: saasCopy.tr.previewDescription }}
    >
      {page}
    </ShowcasePreviewFrame>
  )
}
