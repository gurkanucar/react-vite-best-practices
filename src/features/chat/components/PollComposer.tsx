import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Flex, Form, Input, Modal, Switch } from 'antd'
import { MAX_POLL_OPTIONS, type ChatPoll } from '@/features/chat/types'
import { useMessages } from '@/i18n/messages'

interface PollComposerProps {
  open: boolean
  onCancel: () => void
  onCreate: (poll: ChatPoll) => void
}

interface PollForm {
  question: string
  options: string[]
  multiple: boolean
}

let pollId = 0

/** The "Create poll" dialog: a question, two to twelve options, and one answer or many. */
export function PollComposer({ open, onCancel, onCreate }: PollComposerProps) {
  const messages = useMessages()
  const [form] = Form.useForm<PollForm>()

  const submit = ({ question, options, multiple }: PollForm) => {
    pollId += 1
    const cleaned = options.map((option) => option.trim())

    onCreate({
      question: question.trim(),
      multiple,
      options: cleaned.map((text, index) => ({ id: `poll-${pollId}-${index}`, text })),
      votes: {},
    })
    form.resetFields()
  }

  return (
    <Modal
      open={open}
      title={messages.chat.createPoll}
      okText={messages.chat.send}
      onCancel={onCancel}
      onOk={() => form.submit()}
      destroyOnHidden
    >
      <Form<PollForm>
        form={form}
        layout="vertical"
        requiredMark={false}
        initialValues={{ question: '', options: ['', ''], multiple: false }}
        onFinish={submit}
      >
        <Form.Item
          name="question"
          label={messages.chat.question}
          rules={[{ required: true, whitespace: true, message: messages.chat.questionRequired }]}
        >
          <Input placeholder={messages.chat.questionPlaceholder} maxLength={200} />
        </Form.Item>

        <Form.List name="options">
          {(fields, { add, remove }) => (
            <Form.Item label={messages.chat.options} required>
              <Flex vertical gap={8}>
                {fields.map((field, index) => (
                  <Flex key={field.key} gap={8} align="start">
                    <Form.Item
                      name={field.name}
                      className="chat-poll-form__option"
                      rules={[
                        { required: true, whitespace: true, message: messages.chat.optionRequired },
                        ({ getFieldValue }) => ({
                          validator: (_, value: string) => {
                            const all: string[] = getFieldValue('options') ?? []
                            const same = all.filter(
                              (other) =>
                                other?.trim().toLocaleLowerCase() ===
                                value?.trim().toLocaleLowerCase(),
                            )
                            return value?.trim() && same.length > 1
                              ? Promise.reject(new Error(messages.chat.duplicateOptions))
                              : Promise.resolve()
                          },
                        }),
                      ]}
                    >
                      <Input
                        placeholder={messages.chat.optionPlaceholder.replace(
                          '{index}',
                          String(index + 1),
                        )}
                        maxLength={100}
                      />
                    </Form.Item>
                    {/* A poll needs at least two options to be a choice at all. */}
                    <Button
                      type="text"
                      icon={<DeleteOutlined />}
                      aria-label={messages.chat.removeOption}
                      disabled={fields.length <= 2}
                      onClick={() => remove(field.name)}
                    />
                  </Flex>
                ))}
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  disabled={fields.length >= MAX_POLL_OPTIONS}
                  onClick={() => add('')}
                >
                  {messages.chat.addOption}
                </Button>
              </Flex>
            </Form.Item>
          )}
        </Form.List>

        <Form.Item name="multiple" label={messages.chat.allowMultiple} valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  )
}
