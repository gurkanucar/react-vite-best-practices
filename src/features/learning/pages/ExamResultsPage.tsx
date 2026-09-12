import { Card, Col, Empty, Row, Statistic, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import { attempts } from '@/features/learning/data'
import type { ExamAttempt } from '@/features/learning/types'
import { useMessages } from '@/i18n/messages'

export function ExamResultsPage() {
  const messages = useMessages()

  const best = attempts.reduce((max, attempt) => Math.max(max, attempt.percentage), 0)
  const average = attempts.length
    ? Math.round(attempts.reduce((sum, attempt) => sum + attempt.percentage, 0) / attempts.length)
    : 0

  const columns: ColumnsType<ExamAttempt> = [
    { title: messages.learning.attemptDate, dataIndex: 'takenAt', key: 'takenAt' },
    {
      title: messages.learning.score,
      dataIndex: 'percentage',
      key: 'percentage',
      align: 'right',
      sorter: (left, right) => left.percentage - right.percentage,
      render: (percentage: number) => `${percentage}%`,
    },
    {
      title: messages.learning.duration,
      dataIndex: 'durationMinutes',
      key: 'duration',
      align: 'right',
      render: (minutes: number) =>
        messages.learning.durationLabel.replace('{count}', String(minutes)),
    },
    {
      title: messages.learning.outcome,
      dataIndex: 'passed',
      key: 'passed',
      render: (passed: boolean) => (
        <Tag color={passed ? 'success' : 'error'}>
          {passed ? messages.learning.passed : messages.learning.failed}
        </Tag>
      ),
    },
  ]

  return (
    <div className="admin-page">
      <PageHeader title={messages.learning.resultsTitle} />

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card>
            <Statistic title={messages.learning.bestScore} value={best} suffix="%" />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic title={messages.learning.averageScore} value={average} suffix="%" />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic title={messages.learning.attemptsCount} value={attempts.length} />
          </Card>
        </Col>

        <Col span={24}>
          <Card>
            <Table<ExamAttempt>
              rowKey="id"
              columns={columns}
              dataSource={attempts}
              pagination={false}
              size="middle"
              scroll={{ x: 'max-content' }}
              locale={{ emptyText: <Empty description={messages.learning.noAttempts} /> }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
