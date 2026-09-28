import { Collapse, Flex, InputNumber, Select, Slider, Table, Typography } from 'antd'
import { useState } from 'react'
import { formatPrice } from '@/features/showcases/data/estate'
import {
  annualRate,
  DEFAULT_MORTGAGE,
  MORTGAGE_TERMS,
  mortgagePlan,
  type MortgageYear,
} from '@/features/showcases/data/estateMortgage'
import { useEstateText } from '@/features/showcases/hooks/useEstateText'

const digits = (value: string | undefined) => Number((value ?? '').replace(/\D/g, '')) || 0

interface EstateMortgageCalculatorProps {
  price: number
}

/** Price, down payment, term and rate in; the instalment and what the loan really costs out. */
export function EstateMortgageCalculator({ price: listedPrice }: EstateMortgageCalculatorProps) {
  const { text, language } = useEstateText()
  const [price, setPrice] = useState(listedPrice)
  const [downPaymentPct, setDownPaymentPct] = useState(DEFAULT_MORTGAGE.downPaymentPct)
  const [months, setMonths] = useState(DEFAULT_MORTGAGE.months)
  const [monthlyRatePct, setMonthlyRatePct] = useState(DEFAULT_MORTGAGE.monthlyRatePct)
  const plan = mortgagePlan({ price, downPaymentPct, months, monthlyRatePct })
  const money = (amount: number) => formatPrice(amount, language)
  const pct = (value: number) => (language === 'tr' ? `%${value}` : `${value}%`)
  const numberLocale = language === 'tr' ? 'tr-TR' : 'en-GB'
  const interestShare = plan.totalPaid > 0 ? (plan.totalInterest / plan.totalPaid) * 100 : 0
  const annual = new Intl.NumberFormat(numberLocale, { maximumFractionDigits: 1 }).format(
    annualRate(monthlyRatePct),
  )

  return (
    <div className="estate-mortgage">
      <div className="estate-mortgage__inputs">
        <div className="estate-filter-field">
          <label htmlFor="estate-mortgage-price" className="estate-filter-field__label">
            {text.mortgage.price}
          </label>
          <InputNumber<number>
            id="estate-mortgage-price"
            className="full-width"
            min={0}
            step={50_000}
            prefix="₺"
            controls={false}
            value={price}
            formatter={(value) => new Intl.NumberFormat(numberLocale).format(Number(value ?? 0))}
            parser={digits}
            onChange={(value) => setPrice(value ?? 0)}
          />
        </div>

        <div className="estate-filter-field">
          <Flex justify="space-between" gap={8}>
            <label htmlFor="estate-mortgage-down" className="estate-filter-field__label">
              {text.mortgage.downPayment}
            </label>
            <Typography.Text type="secondary">
              {pct(downPaymentPct)} · {money(plan.downPayment)}
            </Typography.Text>
          </Flex>
          <Slider
            id="estate-mortgage-down"
            min={10}
            max={90}
            step={5}
            value={downPaymentPct}
            onChange={setDownPaymentPct}
            tooltip={{ formatter: (value) => pct(value ?? 0) }}
            aria-label={text.mortgage.downPayment}
          />
        </div>

        <Flex gap={12} className="estate-mortgage__pair">
          <div className="estate-filter-field">
            <label htmlFor="estate-mortgage-term" className="estate-filter-field__label">
              {text.mortgage.term}
            </label>
            <Select
              id="estate-mortgage-term"
              className="full-width"
              value={months}
              onChange={setMonths}
              options={MORTGAGE_TERMS.map((term) => ({
                value: term,
                label: text.mortgage.months(term),
              }))}
            />
          </div>
          <div className="estate-filter-field">
            <label htmlFor="estate-mortgage-rate" className="estate-filter-field__label">
              {text.mortgage.rate}
            </label>
            <InputNumber<number>
              id="estate-mortgage-rate"
              className="full-width"
              min={0}
              max={10}
              step={0.01}
              precision={2}
              decimalSeparator={language === 'tr' ? ',' : '.'}
              prefix={language === 'tr' ? '%' : undefined}
              suffix={language === 'tr' ? undefined : '%'}
              value={monthlyRatePct}
              onChange={(value) => setMonthlyRatePct(value ?? 0)}
            />
            <Typography.Text type="secondary" className="estate-mortgage__hint">
              {text.mortgage.rateHint(annual)}
            </Typography.Text>
          </div>
        </Flex>
      </div>

      <div className="estate-mortgage__result" aria-live="polite">
        <Typography.Text type="secondary">{text.mortgage.monthly}</Typography.Text>
        <strong className="estate-mortgage__monthly">{money(plan.monthly)}</strong>
        {/* The legend below says the same in words. */}
        <div className="estate-mortgage__bar" aria-hidden="true">
          <span style={{ width: `${100 - interestShare}%` }} />
          <span style={{ width: `${interestShare}%` }} />
        </div>
        <Flex justify="space-between" className="estate-mortgage__legend">
          <span>
            <i className="estate-dot estate-dot--principal" aria-hidden="true" />
            {text.mortgage.principalShare} {pct(Math.round(100 - interestShare))}
          </span>
          <span>
            <i className="estate-dot estate-dot--interest" aria-hidden="true" />
            {text.mortgage.interestShare} {pct(Math.round(interestShare))}
          </span>
        </Flex>
        <dl className="estate-mortgage__totals">
          <div>
            <dt>{text.mortgage.loan}</dt>
            <dd>{money(plan.loan)}</dd>
          </div>
          <div>
            <dt>{text.mortgage.totalInterest}</dt>
            <dd>{money(plan.totalInterest)}</dd>
          </div>
          <div>
            <dt>{text.mortgage.totalPaid}</dt>
            <dd>{money(plan.totalPaid)}</dd>
          </div>
        </dl>
        <Typography.Paragraph type="secondary" className="estate-mortgage__note">
          {text.mortgage.incomeHint(money(plan.monthly * 2))}
        </Typography.Paragraph>
      </div>

      <Collapse
        ghost
        className="estate-mortgage__schedule"
        items={[
          {
            key: 'schedule',
            label: text.mortgage.schedule,
            children: (
              <Table<MortgageYear>
                size="small"
                rowKey="year"
                pagination={false}
                scroll={{ x: 'max-content' }}
                dataSource={plan.years}
                columns={[
                  { title: text.mortgage.year, dataIndex: 'year', width: 56 },
                  {
                    title: text.mortgage.principal,
                    dataIndex: 'principal',
                    align: 'right',
                    render: money,
                  },
                  {
                    title: text.mortgage.interest,
                    dataIndex: 'interest',
                    align: 'right',
                    render: money,
                  },
                  {
                    title: text.mortgage.balance,
                    dataIndex: 'balance',
                    align: 'right',
                    render: money,
                  },
                ]}
              />
            ),
          },
        ]}
      />
      <Typography.Text type="secondary" className="estate-mortgage__disclaimer">
        {text.mortgage.disclaimer}
      </Typography.Text>
    </div>
  )
}
