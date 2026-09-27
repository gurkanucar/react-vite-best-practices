import { Card, Table, Typography, type TableColumnsType } from 'antd'
import type { CSSProperties } from 'react'
import { retentionCohorts, type Cohort } from '@/features/analytics/data'
import { useChartFormatters } from '@/features/analytics/hooks'
import { useMessages } from '@/i18n/messages'

const MONTHS = Math.max(...retentionCohorts.map((cohort) => cohort.retention.length))

/**
 * A cohort chart is a table whose cells are shaded by value: rows are signup months, columns
 * are months since signing up, and the empty lower corner is the future. antd's `Table` does
 * the layout; the shade is the primary colour mixed by the cell's percentage.
 */
export function CohortRetentionTable() {
  const messages = useMessages()
  const text = messages.analytics
  const format = useChartFormatters()

  const columns: TableColumnsType<Cohort> = [
    {
      key: 'month',
      title: text.cohort,
      dataIndex: 'month',
      fixed: 'start',
      width: 104,
      render: (month: string) => <Typography.Text strong>{format.month(month)}</Typography.Text>,
    },
    {
      key: 'size',
      title: text.cohortSize,
      dataIndex: 'size',
      align: 'end',
      width: 80,
      render: (size: number) => format.number(size),
    },
    ...Array.from({ length: MONTHS }, (_, index) => ({
      key: `m${index}`,
      title: text.monthIndex.replace('{index}', String(index)),
      align: 'center' as const,
      width: 76,
      onCell: (cohort: Cohort) => {
        const value = cohort.retention[index]
        return value === undefined
          ? {}
          : {
              className: value >= 60 ? 'cohort-cell cohort-cell--strong' : 'cohort-cell',
              style: { '--cohort-strength': `${Math.round(value * 0.85)}%` } as CSSProperties,
            }
      },
      render: (_: unknown, cohort: Cohort) => {
        const value = cohort.retention[index]
        return value === undefined ? null : format.percent(value)
      },
    })),
  ]

  return (
    <Card className="dashboard-panel chart-card" title={text.cohortsTitle}>
      <Typography.Paragraph type="secondary">{text.cohortsBody}</Typography.Paragraph>
      <Table<Cohort>
        rowKey="month"
        size="small"
        pagination={false}
        columns={columns}
        dataSource={retentionCohorts}
        scroll={{ x: 'max-content' }}
        className="cohort-table"
      />
    </Card>
  )
}
