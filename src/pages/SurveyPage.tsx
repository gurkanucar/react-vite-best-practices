import { CheckCircleOutlined, ReloadOutlined, SendOutlined } from '@ant-design/icons'
import {
  App,
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  Radio,
  Rate,
  Row,
  Select,
  Slider,
  Space,
  Switch,
  Typography,
} from 'antd'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import { useMessages } from '@/i18n/messages'

interface SurveyValues {
  comments?: string
  contactPermission?: boolean
  department: string
  experience: number
  features: string[]
  launchDate?: unknown
  recommendation: number
  satisfaction: string
  summary: string
}

export function SurveyPage() {
  const { message } = App.useApp()
  const [form] = Form.useForm<SurveyValues>()
  const messages = useMessages()

  const handleFinish = () => {
    void message.success(messages.survey.submitted)
  }

  return (
    <div className="admin-page">
      <PageHeader title={messages.survey.title} description={messages.survey.description} />

      <Form<SurveyValues>
        form={form}
        layout="vertical"
        requiredMark="optional"
        initialValues={{
          contactPermission: true,
          department: 'product',
          experience: 6,
          features: ['dashboard'],
          recommendation: 4,
          satisfaction: 'satisfied',
        }}
        onFinish={handleFinish}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} xl={12}>
            <Card className="component-panel" title={messages.survey.aboutYou}>
              <Form.Item
                label={messages.survey.department}
                name="department"
                rules={[{ required: true, message: messages.survey.departmentRequired }]}
              >
                <Select
                  placeholder={messages.survey.departmentPlaceholder}
                  options={[
                    { value: 'product', label: messages.survey.product },
                    { value: 'engineering', label: messages.survey.engineering },
                    { value: 'design', label: messages.survey.design },
                    { value: 'operations', label: messages.survey.operations },
                  ]}
                />
              </Form.Item>

              <Form.Item
                label={messages.survey.summary}
                name="summary"
                rules={[{ required: true, message: messages.survey.summaryRequired }]}
              >
                <Input placeholder={messages.survey.summaryPlaceholder} maxLength={120} showCount />
              </Form.Item>

              <Form.Item label={messages.survey.launchDate} name="launchDate">
                <DatePicker className="full-width" />
              </Form.Item>
            </Card>
          </Col>

          <Col xs={24} xl={12}>
            <Card className="component-panel" title={messages.survey.productFeedback}>
              <Form.Item
                label={messages.survey.satisfaction}
                name="satisfaction"
                rules={[{ required: true, message: messages.survey.satisfactionRequired }]}
              >
                <Radio.Group>
                  <Space orientation="vertical">
                    <Radio value="very-satisfied">{messages.survey.verySatisfied}</Radio>
                    <Radio value="satisfied">{messages.survey.satisfied}</Radio>
                    <Radio value="neutral">{messages.survey.neutral}</Radio>
                    <Radio value="dissatisfied">{messages.survey.dissatisfied}</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>

              <Form.Item label={messages.survey.features} name="features">
                <Checkbox.Group
                  options={[
                    { value: 'dashboard', label: messages.navigation.dashboard },
                    { value: 'components', label: messages.navigation.components },
                    { value: 'themes', label: messages.navigation.appearance },
                    { value: 'state', label: messages.navigation.persistedState },
                  ]}
                />
              </Form.Item>
            </Card>
          </Col>

          <Col xs={24} xl={12}>
            <Card className="component-panel" title={messages.survey.ratings}>
              <Form.Item label={messages.survey.recommendation} name="recommendation">
                <Rate />
              </Form.Item>

              <Form.Item label={messages.survey.experience} name="experience">
                <Slider min={0} max={10} marks={{ 0: '0', 5: '5', 10: '10' }} />
              </Form.Item>

              <Form.Item
                label={messages.survey.contactPermission}
                name="contactPermission"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Card>
          </Col>

          <Col xs={24} xl={12}>
            <Card className="component-panel" title={messages.survey.additionalFeedback}>
              <Form.Item label={messages.survey.comments} name="comments">
                <Input.TextArea rows={7} maxLength={500} showCount />
              </Form.Item>
            </Card>
          </Col>
        </Row>

        <Card className="dashboard-grid">
          <Space wrap>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SendOutlined />}
              aria-label={messages.survey.submit}
            >
              {messages.survey.submit}
            </Button>
            <Button
              icon={<ReloadOutlined />}
              aria-label={messages.survey.reset}
              onClick={() => form.resetFields()}
            >
              {messages.survey.reset}
            </Button>
            <Typography.Text type="secondary">
              <Space>
                <CheckCircleOutlined />
                {messages.survey.exampleNotice}
              </Space>
            </Typography.Text>
          </Space>
        </Card>
      </Form>
    </div>
  )
}
