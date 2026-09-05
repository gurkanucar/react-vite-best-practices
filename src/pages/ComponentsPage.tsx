import {
  AppstoreOutlined,
  CheckCircleOutlined,
  CloudUploadOutlined,
  DownloadOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons'
import {
  Alert,
  App,
  AutoComplete,
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Calendar,
  Card,
  Cascader,
  Checkbox,
  Col,
  Collapse,
  ColorPicker,
  DatePicker,
  Descriptions,
  Divider,
  Drawer,
  Dropdown,
  Empty,
  Flex,
  Form,
  Image,
  Input,
  InputNumber,
  Listy,
  Mentions,
  Menu,
  Modal,
  Pagination,
  Popconfirm,
  Popover,
  Progress,
  QRCode,
  Radio,
  Rate,
  Result,
  Row,
  Segmented,
  Select,
  Skeleton,
  Slider,
  Space,
  Spin,
  Statistic,
  Steps,
  Switch,
  Table,
  Tabs,
  Tag,
  TimePicker,
  Timeline,
  Tooltip,
  Tree,
  TreeSelect,
  Typography,
  Upload,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useState } from 'react'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import { useMessages, type Messages } from '@/i18n/messages'

interface TeamMember {
  key: string
  name: string
  role: string
  status: 'Active' | 'Invited'
}

const teamMembers: TeamMember[] = [
  { key: '1', name: 'Maya Chen', role: 'Product manager', status: 'Active' },
  { key: '2', name: 'Noah Williams', role: 'Frontend engineer', status: 'Active' },
  { key: '3', name: 'Ava Patel', role: 'Design lead', status: 'Invited' },
]

const teamColumns: ColumnsType<TeamMember> = [
  {
    title: 'Member',
    dataIndex: 'name',
    key: 'name',
    render: (name: string) => (
      <Space>
        <Avatar icon={<UserOutlined />} />
        {name}
      </Space>
    ),
  },
  { title: 'Role', dataIndex: 'role', key: 'role' },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status: TeamMember['status']) => (
      <Tag color={status === 'Active' ? 'success' : 'processing'}>{status}</Tag>
    ),
  },
]

function InputsShowcase({ messages }: { messages: Messages }) {
  const { message } = App.useApp()
  const [readiness, setReadiness] = useState(72)

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} xl={12}>
        <Card className="component-panel" title="Text and numeric input">
          <Space orientation="vertical" size="middle" className="full-width">
            <Input prefix={<UserOutlined />} placeholder="Workspace owner" allowClear />
            <Input.Password placeholder="Password" />
            <Input.Search placeholder="Search the catalog" enterButton />
            <InputNumber
              className="full-width"
              min={1}
              max={100}
              defaultValue={12}
              suffix="seats"
            />
            <Input.OTP length={4} defaultValue="2026" />
            <Mentions
              placeholder="Mention a teammate"
              options={[
                { value: 'maya', label: 'Maya Chen' },
                { value: 'noah', label: 'Noah Williams' },
              ]}
            />
          </Space>
        </Card>
      </Col>

      <Col xs={24} xl={12}>
        <Card className="component-panel" title="Selection controls">
          <Space orientation="vertical" size="middle" className="full-width">
            <Select
              mode="multiple"
              className="full-width"
              defaultValue={['react', 'typescript']}
              options={[
                { value: 'react', label: 'React' },
                { value: 'typescript', label: 'TypeScript' },
                { value: 'vite', label: 'Vite' },
              ]}
            />
            <AutoComplete
              className="full-width"
              placeholder="Select a region"
              options={[{ value: 'Frankfurt' }, { value: 'London' }, { value: 'Istanbul' }]}
            />
            <Cascader
              className="full-width"
              placeholder="Select an environment"
              options={[
                {
                  value: 'cloud',
                  label: 'Cloud',
                  children: [
                    { value: 'production', label: 'Production' },
                    { value: 'staging', label: 'Staging' },
                  ],
                },
              ]}
            />
            <TreeSelect
              className="full-width"
              placeholder="Select a team"
              treeDefaultExpandAll
              treeData={[
                {
                  value: 'engineering',
                  title: 'Engineering',
                  children: [
                    { value: 'frontend', title: 'Frontend' },
                    { value: 'platform', title: 'Platform' },
                  ],
                },
              ]}
            />
          </Space>
        </Card>
      </Col>

      <Col xs={24} xl={10}>
        <Card className="component-panel" title="Choice and range">
          <Space orientation="vertical" size="large" className="full-width">
            <Checkbox.Group options={['Email', 'Push', 'SMS']} defaultValue={['Email']} />
            <Radio.Group
              optionType="button"
              defaultValue="monthly"
              options={[
                { label: 'Monthly', value: 'monthly' },
                { label: 'Annual', value: 'annual' },
              ]}
            />
            <Flex align="center" gap="middle" wrap>
              <Switch defaultChecked />
              <Rate allowHalf defaultValue={4.5} />
            </Flex>
            <Segmented block options={['Development', 'Staging', 'Production']} />
            <div>
              <Progress percent={readiness} />
              <Slider aria-label="Release readiness" value={readiness} onChange={setReadiness} />
            </div>
          </Space>
        </Card>
      </Col>

      <Col xs={24} xl={14}>
        <Card className="component-panel" title="Dates, color, and files">
          <Space orientation="vertical" size="middle" className="full-width">
            <Flex gap="middle" wrap>
              <DatePicker />
              <DatePicker.RangePicker />
              <TimePicker />
            </Flex>
            <ColorPicker defaultValue="#1677ff" showText />
            <Upload beforeUpload={() => false} showUploadList={false}>
              <Button icon={<CloudUploadOutlined />}>Choose a file</Button>
            </Upload>
            <Alert
              showIcon
              type="info"
              title="Demo uploads stay in the browser and are not sent to a server."
            />
          </Space>
        </Card>
      </Col>

      <Col span={24}>
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
              <Col xs={24} md={8}>
                <Form.Item
                  label={messages.components.company}
                  name="company"
                  rules={[{ required: true, message: 'Company name is required' }]}
                >
                  <Input placeholder={messages.components.companyPlaceholder} />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
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
              <Col xs={24} md={8}>
                <Form.Item label="Renewal date" name="renewalDate">
                  <DatePicker className="full-width" />
                </Form.Item>
              </Col>
              <Col span={24}>
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
    </Row>
  )
}

function DataDisplayShowcase() {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} md={8}>
        <Card className="component-panel">
          <Statistic title="Active workspaces" value={2847} suffix={<Badge status="success" />} />
          <Divider />
          <Avatar.Group max={{ count: 4 }}>
            <Avatar>M</Avatar>
            <Avatar>N</Avatar>
            <Avatar>A</Avatar>
            <Avatar>S</Avatar>
            <Avatar>J</Avatar>
          </Avatar.Group>
        </Card>
      </Col>
      <Col xs={24} md={16}>
        <Card className="component-panel" title="Descriptions">
          <Descriptions
            bordered
            column={{ xs: 1, sm: 2 }}
            items={[
              { key: 'region', label: 'Region', children: 'eu-central-1' },
              { key: 'runtime', label: 'Runtime', children: 'React 19' },
              {
                key: 'status',
                label: 'Status',
                children: <Badge status="success" text="Healthy" />,
              },
              {
                key: 'release',
                label: 'Release',
                children: <Tag color="blue">v0.0.0</Tag>,
              },
            ]}
          />
        </Card>
      </Col>

      <Col span={24}>
        <Card className="component-panel" title="Table">
          <Table<TeamMember>
            columns={teamColumns}
            dataSource={teamMembers}
            pagination={false}
            scroll={{ x: 'max-content' }}
          />
        </Card>
      </Col>

      <Col xs={24} xl={12}>
        <Card className="component-panel" title="List and timeline">
          <Listy
            rowKey="title"
            items={[
              { title: 'Production build completed', detail: 'Pipeline event 1' },
              { title: 'Quality checks passed', detail: 'Pipeline event 2' },
              { title: 'Release approved', detail: 'Pipeline event 3' },
            ]}
            itemRender={(item, index) => (
              <Flex align="center" justify="space-between" gap="middle">
                <Space>
                  <Avatar icon={index === 2 ? <CheckCircleOutlined /> : <InfoCircleOutlined />} />
                  <span>
                    <Typography.Text strong>{item.title}</Typography.Text>
                    <br />
                    <Typography.Text type="secondary">{item.detail}</Typography.Text>
                  </span>
                </Space>
                <Button type="link">Details</Button>
              </Flex>
            )}
          />
          <Divider />
          <Timeline
            items={[
              { color: 'green', content: 'Dependencies installed' },
              { color: 'green', content: 'Tests completed' },
              { color: 'blue', content: 'Deployment in progress' },
            ]}
          />
        </Card>
      </Col>

      <Col xs={24} xl={12}>
        <Card className="component-panel" title="Tree and collapsible content">
          <Tree
            defaultExpandAll
            treeData={[
              {
                key: 'src',
                title: 'src',
                children: [
                  { key: 'components', title: 'components' },
                  { key: 'pages', title: 'pages' },
                  { key: 'theme', title: 'theme' },
                ],
              },
              { key: 'docs', title: 'docs' },
            ]}
          />
          <Divider />
          <Collapse
            items={[
              {
                key: 'architecture',
                label: 'Architecture',
                children: 'Feature-oriented modules with typed boundaries.',
              },
              {
                key: 'quality',
                label: 'Quality gates',
                children: 'Lint, format, tests, and commit checks.',
              },
            ]}
          />
        </Card>
      </Col>

      <Col xs={24} xl={14}>
        <Card className="component-panel" title="Calendar">
          <Calendar fullscreen={false} />
        </Card>
      </Col>
      <Col xs={24} xl={10}>
        <Card className="component-panel" title="Image, QR code, and empty state">
          <Flex justify="space-around" align="center" gap="large" wrap>
            <Image src="/favicon.svg" width={96} preview={false} alt="RVBP application icon" />
            <QRCode value="https://example.com/react-vite-best-practices" />
          </Flex>
          <Divider />
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No archived releases" />
        </Card>
      </Col>
    </Row>
  )
}

function NavigationShowcase() {
  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Card className="component-panel" title="Breadcrumb, menu, and dropdown">
          <Space orientation="vertical" size="large" className="full-width">
            <Breadcrumb
              items={[{ title: 'Workspace' }, { title: 'Components' }, { title: 'Navigation' }]}
            />
            <Menu
              mode="horizontal"
              defaultSelectedKeys={['overview']}
              items={[
                { key: 'overview', icon: <AppstoreOutlined />, label: 'Overview' },
                { key: 'members', icon: <UserOutlined />, label: 'Members' },
                { key: 'settings', icon: <SettingOutlined />, label: 'Settings' },
              ]}
            />
            <Dropdown
              menu={{
                items: [
                  { key: 'csv', label: 'Export CSV' },
                  { key: 'json', label: 'Export JSON' },
                ],
              }}
            >
              <Button icon={<DownloadOutlined />}>Export options</Button>
            </Dropdown>
          </Space>
        </Card>
      </Col>

      <Col xs={24} xl={14}>
        <Card className="component-panel" title="Steps">
          <Steps
            current={1}
            items={[
              { title: 'Configure', content: 'Choose the environment' },
              { title: 'Validate', content: 'Run quality checks' },
              { title: 'Deploy', content: 'Publish the build' },
            ]}
          />
        </Card>
      </Col>
      <Col xs={24} xl={10}>
        <Card className="component-panel" title="Pagination">
          <Pagination defaultCurrent={3} total={120} showSizeChanger showQuickJumper />
        </Card>
      </Col>

      <Col span={24}>
        <Card className="component-panel" title="Tabs and progressive disclosure">
          <Tabs
            items={[
              {
                key: 'summary',
                label: 'Summary',
                children: 'A concise view of the current release.',
              },
              {
                key: 'activity',
                label: 'Activity',
                children: 'Recent changes from the delivery pipeline.',
              },
              {
                key: 'audit',
                label: 'Audit log',
                children: 'Immutable records for administrative actions.',
              },
            ]}
          />
          <Collapse
            accordion
            items={[
              {
                key: 'one',
                label: 'How is navigation state handled?',
                children: 'React Router owns the URL and active route.',
              },
              {
                key: 'two',
                label: 'How are menus themed?',
                children: 'Ant Design tokens follow the selected official preset.',
              },
            ]}
          />
        </Card>
      </Col>
    </Row>
  )
}

function FeedbackShowcase({ messages }: { messages: Messages }) {
  const { message, notification } = App.useApp()
  const [modalOpen, setModalOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col xs={24} xl={12}>
          <Card className="component-panel" title="Alerts and messages">
            <Space orientation="vertical" size="middle" className="full-width">
              <Alert showIcon type="success" title="Production build completed" />
              <Alert showIcon type="info" title="A dependency update is available" />
              <Alert showIcon type="warning" title="Two approvals are still required" />
              <Alert showIcon type="error" title="The staging deployment failed" closable />
              <Space wrap>
                <Button onClick={() => void message.success('Changes saved')}>Show message</Button>
                <Button
                  onClick={() =>
                    notification.success({
                      title: 'Deployment complete',
                      description: 'Version v0.0.0 is available in production.',
                      showProgress: true,
                    })
                  }
                >
                  Show notification
                </Button>
              </Space>
            </Space>
          </Card>
        </Col>

        <Col xs={24} xl={12}>
          <Card className="component-panel" title="Progress and loading">
            <Space orientation="vertical" size="large" className="full-width">
              <Progress percent={82} />
              <Flex justify="space-around" align="center" gap="large" wrap>
                <Progress type="circle" percent={75} size={100} />
                <Progress type="dashboard" percent={68} size={100} />
                <Spin size="large" />
              </Flex>
              <Skeleton active paragraph={{ rows: 2 }} />
            </Space>
          </Card>
        </Col>

        <Col xs={24} xl={14}>
          <Card className="component-panel" title="Overlays and confirmation">
            <Space wrap>
              <Button type="primary" onClick={() => setModalOpen(true)}>
                Open modal
              </Button>
              <Button onClick={() => setDrawerOpen(true)}>Open drawer</Button>
              <Popconfirm
                title="Archive this release?"
                description="You can restore it later from the archive."
                onConfirm={() => void message.success('Release archived')}
              >
                <Button danger>Archive</Button>
              </Popconfirm>
              <Popover
                title="Build information"
                content="Vite production build with hashed assets."
              >
                <Button>Open popover</Button>
              </Popover>
              <Tooltip title="Theme-aware tooltip">
                <Button shape="circle" icon={<InfoCircleOutlined />} aria-label="Show tooltip" />
              </Tooltip>
            </Space>
          </Card>
        </Col>

        <Col xs={24} xl={10}>
          <Card className="component-panel" title="Result">
            <Result
              status="success"
              title="The workspace is ready"
              subTitle="All required quality checks completed successfully."
              extra={<Button type="primary">View release</Button>}
            />
          </Card>
        </Col>

        <Col span={24}>
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
              <Button disabled>Unavailable action</Button>
              <Button loading>Processing</Button>
            </Space>
          </Card>
        </Col>
      </Row>

      <Modal
        title="Review workspace changes"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => {
          setModalOpen(false)
          void message.success('Changes approved')
        }}
      >
        <Typography.Paragraph>
          Modal content, actions, focus management, and motion all come from Ant Design.
        </Typography.Paragraph>
      </Modal>

      <Drawer
        title="Release details"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        extra={<Tag color="processing">In progress</Tag>}
      >
        <Descriptions
          column={1}
          items={[
            { key: 'branch', label: 'Branch', children: 'main' },
            { key: 'environment', label: 'Environment', children: 'Production' },
            { key: 'owner', label: 'Owner', children: 'Maya Chen' },
          ]}
        />
      </Drawer>
    </>
  )
}

export function ComponentsPage() {
  const messages = useMessages()

  return (
    <div className="admin-page">
      <PageHeader title={messages.components.title} description={messages.components.description} />

      <Tabs
        defaultActiveKey="inputs"
        items={[
          {
            key: 'inputs',
            label: messages.components.inputs,
            children: <InputsShowcase messages={messages} />,
          },
          {
            key: 'data-display',
            label: messages.components.dataDisplay,
            children: <DataDisplayShowcase />,
          },
          {
            key: 'navigation',
            label: messages.components.navigation,
            children: <NavigationShowcase />,
          },
          {
            key: 'feedback',
            label: messages.components.feedback,
            children: <FeedbackShowcase messages={messages} />,
          },
        ]}
      />
    </div>
  )
}
