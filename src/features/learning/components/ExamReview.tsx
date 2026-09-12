import { Alert, Card, Flex, Tag, Typography } from 'antd'
import { QuestionBody } from '@/features/learning/components/QuestionBody'
import type { AnswerSheet, ExamResult, Question, QuestionOutcome } from '@/features/learning/types'
import { blankAnswer } from '@/features/learning/types'
import { useMessages } from '@/i18n/messages'

const outcomeColors: Record<QuestionOutcome, string> = {
  correct: 'success',
  partial: 'gold',
  wrong: 'error',
  unanswered: 'default',
  manual: 'processing',
}

interface ExamReviewProps {
  questions: Question[]
  answers: AnswerSheet
  result: ExamResult
}

/** Every question again, with what was picked frozen and the right answer beside it. */
export function ExamReview({ questions, answers, result }: ExamReviewProps) {
  const messages = useMessages()
  const byId = new Map(result.results.map((entry) => [entry.questionId, entry]))

  const correctAnswerOf = (question: Question): string => {
    const label = (id: string) => {
      const option =
        'options' in question ? question.options.find((entry) => entry.id === id) : undefined

      return option?.labelId
        ? messages.learning.options[option.labelId as keyof typeof messages.learning.options]
        : id
    }

    switch (question.kind) {
      case 'single':
        return label(question.correctId)
      case 'multiple':
        return question.correctIds.map(label).join(', ')
      case 'trueFalse':
        return question.correct ? messages.learning.answerTrue : messages.learning.answerFalse
      case 'text':
        return question.acceptedAnswers.join(' / ')
      case 'matching':
        return question.pairs
          .map(
            (pair) =>
              `${messages.learning.options[pair.promptId as keyof typeof messages.learning.options]} → ${label(pair.answerId)}`,
          )
          .join(' · ')
      case 'ordering':
        return question.correctOrder.map(label).join(' → ')
      case 'file':
        return messages.learning.outcomes.manual
    }
  }

  return (
    <Flex vertical gap={16}>
      {questions.map((question, index) => {
        const entry = byId.get(question.id)

        return (
          <Card
            key={question.id}
            title={messages.learning.questionOf
              .replace('{index}', String(index + 1))
              .replace('{total}', String(questions.length))}
            extra={
              entry && (
                <Tag color={outcomeColors[entry.outcome]}>
                  {messages.learning.outcomes[entry.outcome]} · {entry.earned}/{entry.possible}
                </Tag>
              )
            }
          >
            <Typography.Paragraph strong>
              {
                messages.learning.prompts[
                  question.promptId as keyof typeof messages.learning.prompts
                ]
              }
            </Typography.Paragraph>

            <Typography.Text type="secondary">{messages.learning.yourAnswer}</Typography.Text>
            <div className="exam-body">
              <QuestionBody
                readOnly
                question={question}
                answer={answers[question.id] ?? blankAnswer(question)}
                onChange={() => undefined}
              />
            </div>

            <Typography.Paragraph className="exam-review__correct">
              <Typography.Text type="secondary">
                {messages.learning.correctAnswer}:{' '}
              </Typography.Text>
              <Typography.Text strong>{correctAnswerOf(question)}</Typography.Text>
            </Typography.Paragraph>

            {question.explanationId && (
              <Alert
                type="info"
                showIcon
                title={messages.learning.explanation}
                description={
                  messages.learning.explanations[
                    question.explanationId as keyof typeof messages.learning.explanations
                  ]
                }
              />
            )}
          </Card>
        )
      })}
    </Flex>
  )
}
