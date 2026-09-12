import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Button, Card, Col, Flex, Modal, Result, Row, Statistic, Tag, Typography } from 'antd'
import { useState } from 'react'
import { Link } from 'react-router'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import { ExamNavigator, ExamReview, QuestionCard } from '@/features/learning/components'
import { exam, examQuestions } from '@/features/learning/data'
import { useExamSession } from '@/features/learning/hooks'
import { useMessages } from '@/i18n/messages'

export function ExamPage() {
  const messages = useMessages()
  const session = useExamSession(exam, examQuestions)
  const [confirming, setConfirming] = useState(false)
  const [reviewing, setReviewing] = useState(false)

  const totalPoints = examQuestions.reduce((sum, question) => sum + question.points, 0)

  if (session.phase === 'intro') {
    return (
      <div className="admin-page">
        <PageHeader title={messages.learning.examTitle} />

        <Card>
          <Typography.Title level={4}>{messages.learning.examIntroTitle}</Typography.Title>
          <Typography.Paragraph type="secondary">
            {messages.learning.examIntroBody}
          </Typography.Paragraph>

          <Row gutter={[16, 16]}>
            <Col xs={12} md={6}>
              <Statistic
                title={messages.learning.questionCount.replace('{count}', '')}
                value={examQuestions.length}
              />
            </Col>
            <Col xs={12} md={6}>
              <Statistic
                title={messages.learning.timeLeft}
                value={exam.durationMinutes}
                suffix="dk"
              />
            </Col>
            <Col xs={12} md={6}>
              <Statistic title={messages.learning.score} value={totalPoints} />
            </Col>
            <Col xs={12} md={6}>
              <Statistic title={messages.learning.passed} value={exam.passMark} suffix="%" />
            </Col>
          </Row>

          <Flex gap={8} wrap className="exam-kinds">
            {[...new Set(examQuestions.map((question) => question.kind))].map((kind) => (
              <Tag key={kind}>{messages.learning.kinds[kind]}</Tag>
            ))}
          </Flex>

          <Button type="primary" size="large" onClick={session.start}>
            {messages.learning.startExam}
          </Button>
        </Card>
      </div>
    )
  }

  if (session.phase === 'submitted' && session.result) {
    const { result } = session

    return (
      <div className="admin-page">
        <PageHeader title={messages.learning.resultTitle} />

        <Card>
          <Result
            status={result.passed ? 'success' : 'warning'}
            title={`${result.percentage}%`}
            subTitle={
              <Flex vertical align="center" gap={4}>
                <Typography.Text strong>
                  {result.passed ? messages.learning.passed : messages.learning.failed}
                </Typography.Text>
                <Typography.Text type="secondary">
                  {messages.learning.scoreOf
                    .replace('{earned}', String(result.earned))
                    .replace('{possible}', String(result.possible))}
                </Typography.Text>
                {result.pendingReview > 0 && (
                  <Typography.Text type="secondary">
                    {messages.learning.pendingReview.replace(
                      '{count}',
                      String(result.pendingReview),
                    )}
                  </Typography.Text>
                )}
              </Flex>
            }
            extra={[
              <Button key="review" onClick={() => setReviewing((current) => !current)}>
                {messages.learning.reviewAnswers}
              </Button>,
              <Button key="retry" type="primary" onClick={session.restart}>
                {messages.learning.tryAgain}
              </Button>,
              <Link key="back" to="/learning/courses">
                <Button type="link">{messages.learning.backToCourses}</Button>
              </Link>,
            ]}
          />
        </Card>

        {reviewing && (
          <div className="exam-review">
            <ExamReview questions={examQuestions} answers={session.answers} result={result} />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="admin-page">
      <PageHeader title={messages.learning.examTitle} />

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={16}>
          <Flex vertical gap={16}>
            <QuestionCard
              question={session.question}
              index={session.index}
              total={examQuestions.length}
              answer={session.answers[session.question.id]!}
              onChange={session.answer}
            />

            <Flex justify="space-between" gap={8}>
              <Button
                icon={<LeftOutlined aria-hidden="true" />}
                disabled={session.index === 0}
                onClick={() => session.goTo(session.index - 1)}
              >
                {messages.learning.previous}
              </Button>
              <Button
                icon={<RightOutlined aria-hidden="true" />}
                iconPlacement="end"
                disabled={session.index === examQuestions.length - 1}
                onClick={() => session.goTo(session.index + 1)}
              >
                {messages.learning.next}
              </Button>
            </Flex>
          </Flex>
        </Col>

        <Col xs={24} xl={8}>
          <ExamNavigator
            questions={examQuestions}
            answers={session.answers}
            index={session.index}
            secondsLeft={session.secondsLeft}
            answeredCount={session.answeredCount}
            onGoTo={session.goTo}
            onSubmit={() => setConfirming(true)}
          />
        </Col>
      </Row>

      <Modal
        open={confirming}
        title={messages.learning.submitExam}
        okText={messages.learning.submitExam}
        cancelText={messages.common.cancel}
        onCancel={() => setConfirming(false)}
        onOk={() => {
          setConfirming(false)
          session.submit()
        }}
      >
        <Typography.Paragraph>{messages.learning.submitConfirm}</Typography.Paragraph>
        <Typography.Text type="secondary">
          {messages.learning.answeredOf
            .replace('{answered}', String(session.answeredCount))
            .replace('{total}', String(examQuestions.length))}
        </Typography.Text>
      </Modal>
    </div>
  )
}
