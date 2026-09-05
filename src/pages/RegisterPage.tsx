import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Checkbox, Form, Input, Typography } from 'antd'
import { Link, useNavigate } from 'react-router'
import { AuthPageLayout } from '@/components/AuthPageLayout/AuthPageLayout'
import { useMessages } from '@/i18n/messages'

interface RegisterValues {
  agreement: boolean
  confirmPassword: string
  email: string
  name: string
  password: string
}

export function RegisterPage() {
  const messages = useMessages()
  const navigate = useNavigate()

  return (
    <AuthPageLayout
      title={messages.auth.registerTitle}
      description={messages.auth.registerDescription}
    >
      <Form<RegisterValues>
        layout="vertical"
        requiredMark="optional"
        onFinish={() => void navigate('/otp')}
      >
        <Form.Item
          label={messages.auth.name}
          name="name"
          rules={[{ required: true, message: messages.auth.nameRequired }]}
        >
          <Input prefix={<UserOutlined />} autoComplete="name" />
        </Form.Item>

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
          rules={[
            { required: true, message: messages.auth.passwordRequired },
            { min: 8, message: messages.auth.passwordLength },
          ]}
        >
          <Input.Password prefix={<LockOutlined />} autoComplete="new-password" />
        </Form.Item>

        <Form.Item
          label={messages.auth.confirmPassword}
          name="confirmPassword"
          dependencies={['password']}
          rules={[
            { required: true, message: messages.auth.confirmPasswordRequired },
            ({ getFieldValue }) => ({
              validator(_, value: string) {
                return !value || getFieldValue('password') === value
                  ? Promise.resolve()
                  : Promise.reject(new Error(messages.auth.passwordMismatch))
              },
            }),
          ]}
        >
          <Input.Password prefix={<LockOutlined />} autoComplete="new-password" />
        </Form.Item>

        <Form.Item
          name="agreement"
          valuePropName="checked"
          rules={[
            {
              validator: (_, checked: boolean) =>
                checked
                  ? Promise.resolve()
                  : Promise.reject(new Error(messages.auth.agreementRequired)),
            },
          ]}
        >
          <Checkbox>{messages.auth.agreement}</Checkbox>
        </Form.Item>

        <Button type="primary" htmlType="submit" block>
          {messages.auth.createAccount}
        </Button>
      </Form>

      <Typography.Paragraph className="auth-alternate">
        {messages.auth.hasAccount} <Link to="/login">{messages.auth.signIn}</Link>
      </Typography.Paragraph>
    </AuthPageLayout>
  )
}
