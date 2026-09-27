import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Drawer,
  Flex,
  Form,
  Grid,
  Input,
  Radio,
  Row,
  Select,
  Tag,
} from 'antd'
import dayjs, { type Dayjs } from 'dayjs'
import { isRichTextEmpty, RichTextEditor } from '@/components/RichTextEditor'
import { PriorityFlag } from '@/features/todos/components/PriorityFlag'
import { newSubtaskId, type TodoInput } from '@/features/todos/hooks'
import {
  tagColor,
  TODO_PRIORITIES,
  type Subtask,
  type Todo,
  type TodoPriority,
} from '@/features/todos/types'
import { useMessages } from '@/i18n/messages'

interface TodoEditorProps {
  open: boolean
  /** The task being edited; left out to write a new one. */
  todo?: Todo
  /** Starting values for a new task, such as the tag the list is filtered by. */
  defaults?: Partial<TodoInput>
  tagOptions: string[]
  onClose: () => void
  onSubmit: (input: TodoInput) => void
  onDelete?: () => void
}

interface TodoFormValues {
  title: string
  description: string
  priority: TodoPriority
  dueDate: Dayjs | null
  tags: string[]
  subtasks: Partial<Subtask>[]
  done: boolean
}

const FORM_ID = 'todo-editor'

function TodoForm({
  todo,
  defaults,
  tagOptions,
  onSubmit,
}: Pick<TodoEditorProps, 'todo' | 'defaults' | 'tagOptions' | 'onSubmit'>) {
  const text = useMessages().todos
  const source = todo ?? defaults
  const initialValues: TodoFormValues = {
    title: source?.title ?? '',
    description: source?.description ?? '',
    priority: source?.priority ?? 'medium',
    dueDate: source?.dueDate ? dayjs(source.dueDate) : null,
    tags: source?.tags ?? [],
    subtasks: source?.subtasks ?? [],
    done: todo?.done ?? false,
  }

  const submit = (values: TodoFormValues) =>
    onSubmit({
      title: values.title.trim(),
      // A description that was typed and then deleted leaves a `<br>` behind; that is no notes.
      description: isRichTextEmpty(values.description) ? '' : values.description,
      priority: values.priority,
      dueDate: values.dueDate?.format('YYYY-MM-DD'),
      tags: [...new Set(values.tags.map((tag) => tag.trim().toLocaleLowerCase()))].filter(Boolean),
      subtasks: (values.subtasks ?? [])
        .filter((item) => item.title?.trim())
        .map((item) => ({
          id: item.id ?? newSubtaskId(),
          title: item.title!.trim(),
          done: item.done ?? false,
        })),
      done: values.done,
    })

  return (
    <Form<TodoFormValues>
      name={FORM_ID}
      layout="vertical"
      requiredMark={false}
      initialValues={initialValues}
      onFinish={submit}
    >
      <Form.Item
        name="title"
        label={text.taskTitle}
        rules={[{ required: true, whitespace: true, message: text.titleRequired }]}
      >
        <Input size="large" placeholder={text.titlePlaceholder} maxLength={160} />
      </Form.Item>

      <Form.Item name="priority" label={text.priority}>
        <Radio.Group
          block
          optionType="button"
          options={TODO_PRIORITIES.map((priority) => ({
            value: priority,
            label: (
              <Flex gap={6} justify="center">
                <PriorityFlag priority={priority} />
                {text.priorities[priority]}
              </Flex>
            ),
          }))}
        />
      </Form.Item>

      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item name="dueDate" label={text.dueDate}>
            <DatePicker
              className="full-width"
              placeholder={text.noDueDate}
              format="D MMM YYYY"
              presets={[
                { label: text.presets.today, value: dayjs() },
                { label: text.presets.tomorrow, value: dayjs().add(1, 'day') },
                { label: text.presets.nextWeek, value: dayjs().add(1, 'week').startOf('week') },
              ]}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item name="tags" label={text.tags}>
            <Select
              mode="tags"
              placeholder={text.tagsPlaceholder}
              tokenSeparators={[',', ' ']}
              options={tagOptions.map((tag) => ({ value: tag, label: `#${tag}` }))}
              tagRender={({ value, closable, onClose }) => (
                <Tag
                  color={tagColor(String(value))}
                  variant="filled"
                  closable={closable}
                  onClose={onClose}
                  className="todo-editor__tag"
                >
                  #{String(value)}
                </Tag>
              )}
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item name="description" label={text.notes}>
        <RichTextEditor placeholder={text.notesPlaceholder} minHeight={140} headings={false} />
      </Form.Item>

      <Form.List name="subtasks">
        {(fields, { add, remove }) => (
          <Form.Item label={text.subtasks}>
            <Flex vertical gap={8}>
              {fields.map((field, index) => (
                <Flex key={field.key} gap={8} align="center">
                  <Form.Item name={[field.name, 'done']} valuePropName="checked" noStyle>
                    <Checkbox aria-label={`${text.completedField}: ${index + 1}`} />
                  </Form.Item>
                  <Form.Item name={[field.name, 'title']} noStyle>
                    <Input
                      placeholder={text.subtaskPlaceholder.replace('{index}', String(index + 1))}
                      maxLength={120}
                    />
                  </Form.Item>
                  <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    aria-label={text.removeSubtask}
                    onClick={() => remove(field.name)}
                  />
                </Flex>
              ))}
              <Button
                type="dashed"
                icon={<PlusOutlined />}
                onClick={() => add({ title: '', done: false })}
              >
                {text.addSubtask}
              </Button>
            </Flex>
          </Form.Item>
        )}
      </Form.List>

      {todo && (
        <Form.Item name="done" valuePropName="checked">
          <Checkbox>{text.completedField}</Checkbox>
        </Form.Item>
      )}
    </Form>
  )
}

/** The side panel a task opens in: every field, with the notes in the rich text editor. */
export function TodoEditor({
  open,
  todo,
  defaults,
  tagOptions,
  onClose,
  onSubmit,
  onDelete,
}: TodoEditorProps) {
  const text = useMessages().todos
  const screens = Grid.useBreakpoint()

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={todo ? text.editTask : text.newTask}
      size={screens.sm ? 560 : '100%'}
      destroyOnHidden
      footer={
        <Flex justify="space-between" gap={8}>
          {todo && onDelete ? (
            <Button danger icon={<DeleteOutlined />} onClick={onDelete}>
              {text.delete}
            </Button>
          ) : (
            <span />
          )}
          <Flex gap={8}>
            <Button onClick={onClose}>{text.cancel}</Button>
            {/* The form sits in the drawer body; the `form` attribute ties this button to it. */}
            <Button type="primary" htmlType="submit" form={FORM_ID}>
              {todo ? text.save : text.create}
            </Button>
          </Flex>
        </Flex>
      }
    >
      {/* Mounted fresh on every open, so it always starts from the task it was opened for. */}
      {open && (
        <TodoForm
          key={todo?.id ?? 'new'}
          todo={todo}
          defaults={defaults}
          tagOptions={tagOptions}
          onSubmit={onSubmit}
        />
      )}
    </Drawer>
  )
}
