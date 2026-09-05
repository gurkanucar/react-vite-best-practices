import { Button, Form, Input, Space, Typography } from 'antd'
import { Link, useNavigate } from 'react-router'
import { AuthPageLayout } from '@/components/AuthPageLayout/AuthPageLayout'
import { useMessages } from '@/i18n/messages'

interface OtpValues {
  code: string
}

export function OtpPage() {
  const messages = useMessages()
  const navigate = useNavigate()

  return (
    <AuthPageLayout title={messages.auth.otpTitle} description={messages.auth.otpDescription}>
      <Form<OtpValues> layout="vertical" onFinish={() => void navigate('/dashboard')}>
        <Form.Item
          label={messages.auth.verificationCode}
          name="code"
          rules={[
            { required: true, message: messages.auth.codeRequired },
            { len: 6, message: messages.auth.codeLength },
          ]}
        >
          <Input.OTP length={6} inputMode="numeric" />
        </Form.Item>

        <Button type="primary" htmlType="submit" block>
          {messages.auth.verify}
        </Button>
      </Form>

      <Space orientation="vertical" align="center" className="full-width">
        <Typography.Text type="secondary">{messages.auth.didNotReceive}</Typography.Text>
        <Button type="link">{messages.auth.resend}</Button>
        <Link to="/login">{messages.auth.backToSignIn}</Link>
      </Space>
    </AuthPageLayout>
  )
}
