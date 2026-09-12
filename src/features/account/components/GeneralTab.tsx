import { App, Button, Card, Col, Flex, Form, Input, Row, Select, Space } from 'antd'
import { useState } from 'react'
import { AvatarUploadCard } from '@/features/account/components/AvatarUploadCard'
import { CountryFlag } from '@/features/account/components/CountryFlag'
import { countries, dialCodes, generalDefaults } from '@/features/account/data'
import type { GeneralProfileValues } from '@/features/account/types'
import { useMessages } from '@/i18n/messages'

export function GeneralTab() {
  const messages = useMessages()
  const { message } = App.useApp()
  const [form] = Form.useForm<GeneralProfileValues>()
  const [publicProfile, setPublicProfile] = useState(generalDefaults.publicProfile)

  const countryOptions = countries.map((code) => ({
    value: code,
    label: (
      <Flex align="center" gap={8}>
        <CountryFlag code={code} />
        <span>{messages.account.countries[code]}</span>
      </Flex>
    ),
  }))

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} lg={8}>
        <AvatarUploadCard
          publicProfile={publicProfile}
          onPublicProfileChange={setPublicProfile}
          onDelete={() => message.success(messages.account.userDeleted)}
          onAvatarRejected={(reason) => message.error(reason)}
        />
      </Col>

      <Col xs={24} lg={16}>
        <Card>
          <Form<GeneralProfileValues>
            form={form}
            layout="vertical"
            requiredMark={false}
            initialValues={generalDefaults}
            onFinish={() => message.success(messages.account.saved)}
          >
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="name"
                  label={messages.account.name}
                  rules={[{ required: true, message: messages.account.nameRequired }]}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="email"
                  label={messages.account.email}
                  rules={[
                    { required: true, message: messages.account.emailRequired },
                    { type: 'email', message: messages.account.emailInvalid },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item label={messages.account.phone}>
                  {/*
                   * Two fields that read as one control. `Space.Compact` is Ant Design's
                   * own answer to that, so no layout CSS is needed for it.
                   */}
                  <Space.Compact block>
                    <Form.Item name="countryCode" noStyle>
                      <Select
                        aria-label={messages.account.dialCode}
                        style={{ width: 116 }}
                        options={countries.map((code) => ({
                          value: code,
                          label: (
                            <Flex align="center" gap={6}>
                              <CountryFlag code={code} />
                              <span>{dialCodes[code]}</span>
                            </Flex>
                          ),
                        }))}
                      />
                    </Form.Item>
                    <Form.Item name="phone" noStyle>
                      <Input allowClear />
                    </Form.Item>
                  </Space.Compact>
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item name="address" label={messages.account.address}>
                  <Input />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item name="country" label={messages.account.country}>
                  <Select options={countryOptions} />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item name="region" label={messages.account.region}>
                  <Input />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item name="city" label={messages.account.city}>
                  <Input />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item name="zip" label={messages.account.zip}>
                  <Input />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item name="about" label={messages.account.about}>
                  <Input.TextArea
                    autoSize={{ minRows: 4, maxRows: 10 }}
                    showCount
                    maxLength={280}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Flex justify="flex-end">
              <Button type="primary" htmlType="submit">
                {messages.account.saveChanges}
              </Button>
            </Flex>
          </Form>
        </Card>
      </Col>
    </Row>
  )
}
