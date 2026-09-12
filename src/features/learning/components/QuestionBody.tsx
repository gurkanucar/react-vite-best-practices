import { DeleteOutlined, DownOutlined, InboxOutlined, UpOutlined } from '@ant-design/icons'
import {
  Button,
  Checkbox,
  Flex,
  Input,
  Radio,
  Select,
  Typography,
  Upload,
  type UploadProps,
} from 'antd'
import type { Answer, Question, QuestionOption } from '@/features/learning/types'
import { useMessages } from '@/i18n/messages'

interface QuestionBodyProps {
  question: Question
  answer: Answer
  onChange: (answer: Answer) => void
  /** Review mode shows what was picked but refuses to change it. */
  readOnly?: boolean
}

/**
 * One switch over the question kind. The union is closed, so adding a kind makes this fail
 * to compile until it is handled — which is the point of modelling questions that way.
 */
export function QuestionBody({ question, answer, onChange, readOnly = false }: QuestionBodyProps) {
  const messages = useMessages()

  const labelOf = (option: QuestionOption) =>
    option.labelId
      ? messages.learning.options[option.labelId as keyof typeof messages.learning.options]
      : ''

  switch (question.kind) {
    case 'single':
      return (
        <Radio.Group
          disabled={readOnly}
          value={answer.kind === 'single' ? answer.optionId : null}
          onChange={(event) => onChange({ kind: 'single', optionId: event.target.value })}
          className="exam-options"
        >
          {question.options.map((option) => (
            <Radio key={option.id} value={option.id} className="exam-option">
              {option.image ? (
                <img src={option.image} alt={labelOf(option)} className="exam-option__image" />
              ) : (
                labelOf(option)
              )}
            </Radio>
          ))}
        </Radio.Group>
      )

    case 'multiple':
      return (
        <Checkbox.Group
          disabled={readOnly}
          value={answer.kind === 'multiple' ? answer.optionIds : []}
          onChange={(optionIds) => onChange({ kind: 'multiple', optionIds: optionIds as string[] })}
          className="exam-options"
        >
          {question.options.map((option) => (
            <Checkbox key={option.id} value={option.id} className="exam-option">
              {option.image ? (
                <img src={option.image} alt={labelOf(option)} className="exam-option__image" />
              ) : (
                labelOf(option)
              )}
            </Checkbox>
          ))}
        </Checkbox.Group>
      )

    case 'trueFalse':
      return (
        <Radio.Group
          disabled={readOnly}
          value={answer.kind === 'trueFalse' ? answer.value : null}
          onChange={(event) => onChange({ kind: 'trueFalse', value: event.target.value })}
          optionType="button"
          buttonStyle="solid"
          options={[
            { value: true, label: messages.learning.answerTrue },
            { value: false, label: messages.learning.answerFalse },
          ]}
        />
      )

    case 'text':
      return (
        <Input
          disabled={readOnly}
          value={answer.kind === 'text' ? answer.value : ''}
          onChange={(event) => onChange({ kind: 'text', value: event.target.value })}
          placeholder={messages.learning.typeAnswer}
          aria-label={messages.learning.typeAnswer}
          style={{ maxWidth: 420 }}
        />
      )

    case 'file': {
      const fileName = answer.kind === 'file' ? answer.fileName : null

      /* No endpoint behind this: `beforeUpload` returning false keeps the checks and drops
         the request, the same pattern as the account avatar. */
      const beforeUpload: UploadProps['beforeUpload'] = (file) => {
        if (!question.acceptedTypes.includes(file.type) || file.size > question.maxBytes) {
          onChange({ kind: 'file', fileName: null })
          return false
        }

        onChange({ kind: 'file', fileName: file.name })
        return false
      }

      return (
        <Flex vertical gap={12} className="exam-upload">
          <Upload.Dragger
            disabled={readOnly}
            showUploadList={false}
            accept={question.acceptedTypes.join(',')}
            beforeUpload={beforeUpload}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined aria-hidden="true" />
            </p>
            <p className="ant-upload-text">{messages.learning.uploadPrompt}</p>
            <p className="ant-upload-hint">{messages.learning.uploadHint}</p>
          </Upload.Dragger>

          {fileName && (
            <Flex align="center" gap={8}>
              <Typography.Text strong>{fileName}</Typography.Text>
              {!readOnly && (
                <Button
                  type="text"
                  size="small"
                  aria-label={messages.learning.removeFile}
                  icon={<DeleteOutlined aria-hidden="true" />}
                  onClick={() => onChange({ kind: 'file', fileName: null })}
                />
              )}
            </Flex>
          )}
        </Flex>
      )
    }

    case 'matching': {
      const pairs = answer.kind === 'matching' ? answer.pairs : {}

      return (
        <Flex vertical gap={12}>
          {question.pairs.map((pair) => (
            <Flex key={pair.id} align="center" gap={12} wrap className="exam-match-row">
              <Typography.Text className="exam-match-row__prompt">
                {messages.learning.options[pair.promptId as keyof typeof messages.learning.options]}
              </Typography.Text>
              <Select
                disabled={readOnly}
                aria-label={
                  messages.learning.options[pair.promptId as keyof typeof messages.learning.options]
                }
                value={pairs[pair.id] ?? undefined}
                placeholder={messages.learning.chooseMatch}
                onChange={(value) =>
                  onChange({ kind: 'matching', pairs: { ...pairs, [pair.id]: value } })
                }
                style={{ minWidth: 220 }}
                options={question.options.map((option) => ({
                  value: option.id,
                  label: labelOf(option),
                }))}
              />
            </Flex>
          ))}
        </Flex>
      )
    }

    case 'ordering': {
      const optionIds = answer.kind === 'ordering' ? answer.optionIds : []
      const byId = new Map(question.options.map((option) => [option.id, option]))

      const move = (from: number, to: number) => {
        if (to < 0 || to >= optionIds.length) return

        const next = [...optionIds]
        const [moved] = next.splice(from, 1)

        next.splice(to, 0, moved!)
        onChange({ kind: 'ordering', optionIds: next, touched: true })
      }

      return (
        <Flex vertical gap={8}>
          {optionIds.map((id, position) => (
            <Flex key={id} align="center" gap={12} className="exam-order-row">
              <Typography.Text type="secondary">{position + 1}</Typography.Text>
              <Typography.Text className="exam-order-row__label">
                {labelOf(byId.get(id) ?? { id })}
              </Typography.Text>
              <Flex gap={4}>
                <Button
                  size="small"
                  disabled={readOnly || position === 0}
                  aria-label={`${messages.learning.moveUp}: ${labelOf(byId.get(id) ?? { id })}`}
                  icon={<UpOutlined aria-hidden="true" />}
                  onClick={() => move(position, position - 1)}
                />
                <Button
                  size="small"
                  disabled={readOnly || position === optionIds.length - 1}
                  aria-label={`${messages.learning.moveDown}: ${labelOf(byId.get(id) ?? { id })}`}
                  icon={<DownOutlined aria-hidden="true" />}
                  onClick={() => move(position, position + 1)}
                />
              </Flex>
            </Flex>
          ))}
        </Flex>
      )
    }
  }
}
