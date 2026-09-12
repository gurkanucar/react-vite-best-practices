import { Button, Card, Flex, Progress, Typography } from 'antd'
import { formatClock } from '@/features/learning/hooks'
import { isAnswered, type AnswerSheet, type Question } from '@/features/learning/types'
import { useMessages } from '@/i18n/messages'

interface ExamNavigatorProps {
  questions: Question[]
  answers: AnswerSheet
  index: number
  secondsLeft: number
  answeredCount: number
  onGoTo: (index: number) => void
  onSubmit: () => void
}

export function ExamNavigator({
  questions,
  answers,
  index,
  secondsLeft,
  answeredCount,
  onGoTo,
  onSubmit,
}: ExamNavigatorProps) {
  const messages = useMessages()
  /** Under two minutes the clock turns red, which is the only warning a timed paper gets. */
  const runningOut = secondsLeft <= 120

  return (
    <Card className="exam-navigator">
      <Flex vertical gap={16}>
        <Flex align="center" justify="space-between">
          <Typography.Text type="secondary">{messages.learning.timeLeft}</Typography.Text>
          <Typography.Title
            level={4}
            className="exam-clock"
            type={runningOut ? 'danger' : undefined}
          >
            {formatClock(secondsLeft)}
          </Typography.Title>
        </Flex>

        <div>
          <Typography.Text type="secondary">
            {messages.learning.answeredOf
              .replace('{answered}', String(answeredCount))
              .replace('{total}', String(questions.length))}
          </Typography.Text>
          <Progress percent={Math.round((answeredCount / questions.length) * 100)} />
        </div>

        <Flex gap={8} wrap>
          {questions.map((question, position) => {
            const answered = answers[question.id] && isAnswered(answers[question.id]!)

            return (
              <Button
                key={question.id}
                size="small"
                aria-current={position === index}
                type={position === index ? 'primary' : answered ? 'default' : 'dashed'}
                onClick={() => onGoTo(position)}
                aria-label={messages.learning.goToQuestion.replace('{index}', String(position + 1))}
              >
                {position + 1}
              </Button>
            )
          })}
        </Flex>

        <Button type="primary" block onClick={onSubmit}>
          {messages.learning.submitExam}
        </Button>
      </Flex>
    </Card>
  )
}
