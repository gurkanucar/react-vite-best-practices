import { Form, Input, Modal } from 'antd'
import { useMessages } from '@/i18n/messages'

interface NewFolderModalProps {
  open: boolean
  saving: boolean
  onCancel: () => void
  onSubmit: (name: string) => void
}

interface NewFolderForm {
  name: string
}

export function NewFolderModal({ open, saving, onCancel, onSubmit }: NewFolderModalProps) {
  const messages = useMessages()
  const [form] = Form.useForm<NewFolderForm>()

  return (
    <Modal
      open={open}
      title={messages.files.newFolder}
      okText={messages.files.create}
      cancelText={messages.common.cancel}
      confirmLoading={saving}
      onCancel={onCancel}
      afterClose={() => form.resetFields()}
      onOk={() => form.submit()}
    >
      <Form<NewFolderForm>
        form={form}
        layout="vertical"
        onFinish={({ name }) => onSubmit(name.trim())}
      >
        <Form.Item
          name="name"
          label={messages.files.name}
          rules={[{ required: true, message: messages.files.nameRequired }]}
        >
          <Input placeholder={messages.files.newFolderPlaceholder} />
        </Form.Item>
      </Form>
    </Modal>
  )
}
