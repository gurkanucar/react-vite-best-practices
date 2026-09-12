import { Card, Flex, Image, Tag, Typography } from 'antd'
import { QuestionBody } from '@/features/learning/components/QuestionBody'
import type { Answer, Question } from '@/features/learning/types'
import { useMessages } from '@/i18n/messages'

interface QuestionCardProps {
  question: Question
  index: number
  total: number
  answer: Answer
  onChange: (answer: Answer) => void
}

export function QuestionCard({ question, index, total, answer, onChange }: QuestionCardProps) {
  const messages = useMessages()

  return (
    <Card
      title={messages.learning.questionOf
        .replace('{index}', String(index + 1))
        .replace('{total}', String(total))}
      extra={
        <Flex gap={8} wrap>
          <Tag>{messages.learning.kinds[question.kind]}</Tag>
          <Tag color="blue">
            {messages.learning.points.replace('{count}', String(question.points))}
          </Tag>
        </Flex>
      }
    >
      <Typography.Paragraph strong>
        {messages.learning.prompts[question.promptId as keyof typeof messages.learning.prompts]}
      </Typography.Paragraph>

      {question.image && (
        <Image src={question.image} alt="" className="exam-prompt-image" preview={{ mask: null }} />
      )}

      <div className="exam-body">
        <QuestionBody question={question} answer={answer} onChange={onChange} />
      </div>
    </Card>
  )
}
