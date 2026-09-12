import { Alert, App, Button, Card, Col, Flex, Form, Input, Row, Switch, Typography } from 'antd'
import { useState } from 'react'
import { useMessages } from '@/i18n/messages'

interface PasswordValues {
  current: string
  next: string
  confirm: string
}

export function SecurityTab() {
  const messages = useMessages()
  const { message } = App.useApp()
  const [form] = Form.useForm<PasswordValues>()
  const [twoFactor, setTwoFactor] = useState(false)

  return (
    <Flex vertical gap={16}>
      <Card title={messages.account.changePassword}>
        {/* Three short fields do not need the full width of a page. */}
        <Row>
          <Col xs={24} md={18} xl={12}>
            <Form<PasswordValues>
              form={form}
              layout="vertical"
              onFinish={() => {
                form.resetFields()
                message.success(messages.account.passwordChanged)
              }}
            >
              <Form.Item
                name="current"
                label={messages.account.currentPassword}
                rules={[{ required: true, message: messages.account.passwordRequired }]}
              >
                <Input.Password autoComplete="current-password" />
              </Form.Item>

              <Form.Item
                name="next"
                label={messages.account.newPassword}
                rules={[
                  { required: true, message: messages.account.passwordRequired },
                  { min: 8, message: messages.account.passwordTooShort },
                ]}
                extra={messages.account.passwordHint}
              >
                <Input.Password autoComplete="new-password" />
              </Form.Item>

              <Form.Item
                name="confirm"
                label={messages.account.confirmPassword}
                dependencies={['next']}
                rules={[
                  { required: true, message: messages.account.passwordRequired },
                  /*
                   * A validator rather than a plain rule, because the answer depends on
                   * another field. `getFieldValue` is what Ant Design gives it for that.
                   */
                  ({ getFieldValue }) => ({
                    validator(_rule, value) {
                      if (!value || getFieldValue('next') === value) {
                        return Promise.resolve()
                      }

                      return Promise.reject(new Error(messages.account.passwordMismatch))
                    },
                  }),
                ]}
              >
                <Input.Password autoComplete="new-password" />
              </Form.Item>

              <Flex justify="flex-end">
                <Button type="primary" htmlType="submit">
                  {messages.account.savePassword}
                </Button>
              </Flex>
            </Form>
          </Col>
        </Row>
      </Card>

      <Card title={messages.account.twoFactor}>
        <Flex align="center" justify="space-between" gap={16} wrap>
          <div>
            <Typography.Text>{messages.account.twoFactorTitle}</Typography.Text>
            <br />
            <Typography.Text type="secondary">
              {messages.account.twoFactorDescription}
            </Typography.Text>
          </div>

          <Switch
            aria-label={messages.account.twoFactorTitle}
            checked={twoFactor}
            onChange={(value) => {
              setTwoFactor(value)
              message.success(value ? messages.account.twoFactorOn : messages.account.twoFactorOff)
            }}
          />
        </Flex>

        {twoFactor && (
          <Alert
            showIcon
            type="success"
            className="account-2fa-notice"
            title={messages.account.twoFactorEnabled}
          />
        )}
      </Card>
    </Flex>
  )
}
