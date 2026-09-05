import { DownloadOutlined, PlusOutlined } from '@ant-design/icons'
import {
  Alert,
  App,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Progress,
  Row,
  Select,
  Slider,
  Space,
  Switch,
  Tag,
  Typography,
} from 'antd'
import { useState } from 'react'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import { useMessages } from '@/i18n/messages'

export function ComponentsPage() {
  const messages = useMessages()
  const { message } = App.useApp()
  const [readiness, setReadiness] = useState(72)

  return (
    <div className="admin-page">
      <PageHeader title={messages.components.title} description={messages.components.description} />

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={12}>
          <Card className="component-panel" title={messages.components.actions}>
            <Typography.Paragraph type="secondary">
              {messages.components.actionsDescription}
            </Typography.Paragraph>
            <Space wrap>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => void message.success(messages.components.created)}
              >
                {messages.components.primaryAction}
              </Button>
              <Button icon={<DownloadOutlined />}>{messages.components.secondaryAction}</Button>
              <Button danger>Archive</Button>
            </Space>
            <Divider />
            <Alert
              showIcon
              type="info"
              title="Component APIs remain theme-aware"
              description="Change the visual preset or color mode in Settings to verify every control."
            />
          </Card>
        </Col>

        <Col xs={24} xl={12}>
          <Card className="component-panel" title={messages.components.release}>
            <Typography.Paragraph type="secondary">
              {messages.components.releaseDescription}
            </Typography.Paragraph>
            <Space wrap>
              <Tag color="success">Type-safe</Tag>
              <Tag color="blue">Tested</Tag>
              <Tag color="gold">Review pending</Tag>
            </Space>
            <div className="release-meter">
              <Progress percent={readiness} />
              <Slider
                aria-label="Release readiness"
                min={20}
                value={readiness}
                onChange={setReadiness}
              />
            </div>
          </Card>
        </Col>

        <Col xs={24} xl={14}>
          <Card className="component-panel" title={messages.components.form}>
            <Typography.Paragraph type="secondary">
              {messages.components.formDescription}
            </Typography.Paragraph>
            <Form
              layout="vertical"
              initialValues={{ plan: 'growth', notifications: true }}
              onFinish={() => void message.success(messages.components.saved)}
            >
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={messages.components.company}
                    name="company"
                    rules={[{ required: true, message: 'Company name is required' }]}
                  >
                    <Input placeholder={messages.components.companyPlaceholder} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label={messages.components.plan} name="plan">
                    <Select
                      options={[
                        { value: 'starter', label: 'Starter' },
                        { value: 'growth', label: 'Growth' },
                        { value: 'enterprise', label: 'Enterprise' },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Renewal date" name="renewalDate">
                    <DatePicker className="full-width" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={messages.components.notifications}
                    name="notifications"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </Col>
              </Row>
              <Button type="primary" htmlType="submit">
                {messages.components.save}
              </Button>
            </Form>
          </Card>
        </Col>

        <Col xs={24} xl={10}>
          <Card className="component-panel component-panel--reference" title="Foundation contract">
            <dl className="reference-list">
              <div>
                <dt>Runtime</dt>
                <dd>React 19</dd>
              </div>
              <div>
                <dt>Navigation</dt>
                <dd>React Router 8</dd>
              </div>
              <div>
                <dt>State</dt>
                <dd>Zustand 5</dd>
              </div>
              <div>
                <dt>UI system</dt>
                <dd>Ant Design 6</dd>
              </div>
            </dl>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
