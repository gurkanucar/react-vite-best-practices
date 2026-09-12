import { Form, Input, Modal } from 'antd'
import { useEffect } from 'react'
import type { FileNode } from '@/features/files/types'
import { useMessages } from '@/i18n/messages'

interface RenameFileModalProps {
  node: FileNode | null
  saving: boolean
  onCancel: () => void
  onSubmit: (name: string) => void
}

interface RenameForm {
  name: string
}

export function RenameFileModal({ node, saving, onCancel, onSubmit }: RenameFileModalProps) {
  const messages = useMessages()
  const [form] = Form.useForm<RenameForm>()

  // The modal keeps its form instance between openings, so the field has to be reset to
  // whichever row was picked this time.
  useEffect(() => {
    if (node) form.setFieldsValue({ name: node.name })
  }, [form, node])

  return (
    <Modal
      open={node !== null}
      title={messages.files.renameTitle}
      okText={messages.files.save}
      cancelText={messages.common.cancel}
      confirmLoading={saving}
      onCancel={onCancel}
      onOk={() => form.submit()}
      destroyOnHidden={false}
    >
      <Form<RenameForm>
        form={form}
        layout="vertical"
        onFinish={({ name }) => onSubmit(name.trim())}
      >
        <Form.Item
          name="name"
          label={messages.files.name}
          rules={[{ required: true, message: messages.files.nameRequired }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}
