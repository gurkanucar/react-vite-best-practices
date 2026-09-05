import { LockOutlined, MailOutlined } from '@ant-design/icons'
import { Button, Checkbox, Flex, Form, Input, Typography } from 'antd'
import { Link, useNavigate } from 'react-router'
import { AuthPageLayout } from '@/components/AuthPageLayout/AuthPageLayout'
import { useMessages } from '@/i18n/messages'

interface LoginValues {
  email: string
  password: string
  remember?: boolean
}

export function LoginPage() {
  const messages = useMessages()
  const navigate = useNavigate()

  return (
    <AuthPageLayout title={messages.auth.loginTitle} description={messages.auth.loginDescription}>
      <Form<LoginValues>
        layout="vertical"
        requiredMark="optional"
        initialValues={{ remember: true }}
        onFinish={() => void navigate('/dashboard')}
      >
        <Form.Item
          label={messages.auth.email}
          name="email"
          rules={[
            { required: true, message: messages.auth.emailRequired },
            { type: 'email', message: messages.auth.emailInvalid },
          ]}
        >
          <Input prefix={<MailOutlined />} type="email" autoComplete="email" />
        </Form.Item>

        <Form.Item
          label={messages.auth.password}
          name="password"
          rules={[{ required: true, message: messages.auth.passwordRequired }]}
        >
          <Input.Password prefix={<LockOutlined />} autoComplete="current-password" />
        </Form.Item>

        <Form.Item>
          <Flex align="center" justify="space-between" gap="middle" wrap>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>{messages.auth.remember}</Checkbox>
            </Form.Item>
            <Link to="/otp">{messages.auth.forgotPassword}</Link>
          </Flex>
        </Form.Item>

        <Button type="primary" htmlType="submit" block>
          {messages.auth.signIn}
        </Button>
      </Form>

      <Typography.Paragraph className="auth-alternate">
        {messages.auth.noAccount} <Link to="/register">{messages.auth.createAccount}</Link>
      </Typography.Paragraph>
    </AuthPageLayout>
  )
}
