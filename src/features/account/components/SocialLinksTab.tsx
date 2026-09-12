import {
  FacebookOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  TwitterOutlined,
} from '@ant-design/icons'
import { App, Button, Card, Flex, Form, Input } from 'antd'
import { socialDefaults } from '@/features/account/data'
import { useMessages } from '@/i18n/messages'

const fields = [
  { name: 'facebook', icon: FacebookOutlined },
  { name: 'instagram', icon: InstagramOutlined },
  { name: 'linkedin', icon: LinkedinOutlined },
  { name: 'twitter', icon: TwitterOutlined },
] as const

export function SocialLinksTab() {
  const messages = useMessages()
  const { message } = App.useApp()
  const [form] = Form.useForm<typeof socialDefaults>()

  return (
    <Card>
      <Form
        form={form}
        layout="vertical"
        initialValues={socialDefaults}
        onFinish={() => message.success(messages.account.saved)}
      >
        {fields.map(({ name, icon: Icon }) => (
          <Form.Item
            key={name}
            name={name}
            label={messages.account.socialNetworks[name]}
            rules={[{ type: 'url', message: messages.account.urlInvalid }]}
          >
            <Input prefix={<Icon aria-hidden="true" />} allowClear />
          </Form.Item>
        ))}

        <Flex justify="flex-end">
          <Button type="primary" htmlType="submit">
            {messages.account.saveChanges}
          </Button>
        </Flex>
      </Form>
    </Card>
  )
}
