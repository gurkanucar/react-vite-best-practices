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
  active: boolean
}

// Demo rows are built from the active locale; only the people's names stay as written.
function createTeamMembers(messages: Messages): TeamMember[] {
  return [
    { key: '1', name: 'Maya Chen', role: messages.components.roleProductManager, active: true },
    {
      key: '2',
      name: 'Noah Williams',
      role: messages.components.roleFrontendEngineer,
      active: true,
    },
    { key: '3', name: 'Ava Patel', role: messages.components.roleDesignLead, active: false },
  ]
}

function createTeamColumns(messages: Messages): ColumnsType<TeamMember> {
  return [
    {
      title: messages.components.member,
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          {name}
        </Space>
      ),
    },
    { title: messages.components.role, dataIndex: 'role', key: 'role' },
    {
      title: messages.components.status,
      dataIndex: 'active',
      key: 'active',
      render: (active: boolean) => (
        <Tag color={active ? 'success' : 'processing'}>
          {active ? messages.components.statusActive : messages.components.statusInvited}
        </Tag>
      ),
    },
  ]
}

function InputsShowcase({ messages }: { messages: Messages }) {
  const { message } = App.useApp()
  const [readiness, setReadiness] = useState(72)

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} xl={12}>
        <Card className="component-panel" title={messages.components.textInputs}>
          <Space orientation="vertical" size="middle" className="full-width">
            <Input
              prefix={<UserOutlined />}
              placeholder={messages.components.workspaceOwner}
              allowClear
            />
            <Input.Password placeholder={messages.components.password} />
            <Input.Search placeholder={messages.components.searchCatalog} enterButton />
            <InputNumber
              className="full-width"
              min={1}
              max={100}
              defaultValue={12}
              suffix={messages.components.seats}
            />
            <Input.OTP length={4} defaultValue="2026" />
            <Mentions
              placeholder={messages.components.mentionTeammate}
              options={[
                { value: 'maya', label: 'Maya Chen' },
                { value: 'noah', label: 'Noah Williams' },
              ]}
            />
          </Space>
        </Card>
      </Col>

      <Col xs={24} xl={12}>
        <Card className="component-panel" title={messages.components.selectionControls}>
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
              placeholder={messages.components.selectRegion}
              options={[{ value: 'Frankfurt' }, { value: 'London' }, { value: 'Istanbul' }]}
            />
            <Cascader
              className="full-width"
              placeholder={messages.components.selectEnvironment}
              options={[
                {
                  value: 'cloud',
                  label: messages.components.cloud,
                  children: [
                    { value: 'production', label: messages.components.production },
                    { value: 'staging', label: messages.components.staging },
                  ],
                },
              ]}
            />
            <TreeSelect
              className="full-width"
              placeholder={messages.components.selectTeam}
              treeDefaultExpandAll
              treeData={[
                {
                  value: 'engineering',
                  title: messages.components.engineering,
                  children: [
                    { value: 'frontend', title: messages.components.frontend },
                    { value: 'platform', title: messages.components.platform },
                  ],
                },
              ]}
            />
          </Space>
        </Card>
      </Col>

      <Col xs={24} xl={10}>
        <Card className="component-panel" title={messages.components.choiceRange}>
          <Space orientation="vertical" size="large" className="full-width">
            <Checkbox.Group
              options={[
                messages.components.email,
                messages.components.push,
                messages.components.sms,
              ]}
              defaultValue={[messages.components.email]}
            />
            <Radio.Group
              optionType="button"
              defaultValue="monthly"
              options={[
                { label: messages.components.monthly, value: 'monthly' },
                { label: messages.components.annual, value: 'annual' },
              ]}
            />
            <Flex align="center" gap="middle" wrap>
              <Switch defaultChecked />
              <Rate allowHalf defaultValue={4.5} />
            </Flex>
            <Segmented
              block
              options={[
                messages.components.development,
                messages.components.staging,
                messages.components.production,
              ]}
            />
            <div>
              <Progress percent={readiness} />
              <Slider
                aria-label={messages.components.releaseReadiness}
                value={readiness}
                onChange={setReadiness}
              />
            </div>
          </Space>
        </Card>
      </Col>

      <Col xs={24} xl={14}>
        <Card className="component-panel" title={messages.components.datesColorFiles}>
          <Space orientation="vertical" size="middle" className="full-width">
            <Flex gap="middle" wrap>
              <DatePicker />
              <DatePicker.RangePicker />
              <TimePicker />
            </Flex>
            <ColorPicker defaultValue="#1677ff" showText />
            <Upload beforeUpload={() => false} showUploadList={false}>
              <Button icon={<CloudUploadOutlined />}>{messages.components.chooseFile}</Button>
            </Upload>
            <Alert showIcon type="info" title={messages.components.uploadNotice} />
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
                  rules={[{ required: true, message: messages.components.companyRequired }]}
                >
                  <Input placeholder={messages.components.companyPlaceholder} />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item label={messages.components.plan} name="plan">
                  <Select
                    options={[
                      { value: 'starter', label: messages.components.starter },
                      { value: 'growth', label: messages.components.growth },
                      { value: 'enterprise', label: messages.components.enterprise },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item label={messages.components.renewalDate} name="renewalDate">
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

function DataDisplayShowcase({ messages }: { messages: Messages }) {
  const pipelineEvent = (index: number) =>
    messages.components.pipelineEvent.replace('{index}', String(index))

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} md={8}>
        <Card className="component-panel">
          <Statistic
            title={messages.components.activeWorkspaces}
            value={2847}
            suffix={<Badge status="success" />}
          />
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
        <Card className="component-panel" title={messages.components.descriptions}>
          <Descriptions
            bordered
            column={{ xs: 1, sm: 2 }}
            items={[
              { key: 'region', label: messages.components.region, children: 'eu-central-1' },
              { key: 'runtime', label: messages.components.runtime, children: 'React 19' },
              {
                key: 'status',
                label: messages.components.status,
                children: <Badge status="success" text={messages.components.healthy} />,
              },
              {
                key: 'release',
                label: messages.components.release,
                children: <Tag color="blue">v0.0.0</Tag>,
              },
            ]}
          />
        </Card>
      </Col>

      <Col span={24}>
        <Card className="component-panel" title={messages.components.table}>
          <Table<TeamMember>
            columns={createTeamColumns(messages)}
            dataSource={createTeamMembers(messages)}
            pagination={false}
            scroll={{ x: 'max-content' }}
          />
        </Card>
      </Col>

      <Col xs={24} xl={12}>
        <Card className="component-panel" title={messages.components.listTimeline}>
          <Listy
            rowKey="title"
            items={[
              { title: messages.components.buildCompleted, detail: pipelineEvent(1) },
              { title: messages.components.checksPassed, detail: pipelineEvent(2) },
              { title: messages.components.releaseApproved, detail: pipelineEvent(3) },
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
                <Button type="link">{messages.components.details}</Button>
              </Flex>
            )}
          />
          <Divider />
          <Timeline
            items={[
              { color: 'green', content: messages.components.dependenciesInstalled },
              { color: 'green', content: messages.components.testsCompleted },
              { color: 'blue', content: messages.components.deploymentInProgress },
            ]}
          />
        </Card>
      </Col>

      <Col xs={24} xl={12}>
        <Card className="component-panel" title={messages.components.treeCollapsible}>
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
                label: messages.components.architecture,
                children: messages.components.architectureDetail,
              },
              {
                key: 'quality',
                label: messages.components.qualityGates,
                children: messages.components.qualityGatesDetail,
              },
            ]}
          />
        </Card>
      </Col>

      <Col xs={24} xl={14}>
        <Card className="component-panel" title={messages.components.calendar}>
          <Calendar fullscreen={false} />
        </Card>
      </Col>
      <Col xs={24} xl={10}>
        <Card className="component-panel" title={messages.components.imageQrEmpty}>
          <Flex justify="space-around" align="center" gap="large" wrap>
            <Image
              src="/favicon.svg"
              width={96}
              preview={false}
              alt={messages.components.appIconAlt}
            />
            <QRCode value="https://example.com/react-vite-best-practices" />
          </Flex>
          <Divider />
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={messages.components.noArchived}
          />
        </Card>
      </Col>
    </Row>
  )
}

function NavigationShowcase({ messages }: { messages: Messages }) {
  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Card className="component-panel" title={messages.components.breadcrumbMenu}>
          <Space orientation="vertical" size="large" className="full-width">
            <Breadcrumb
              items={[
                { title: messages.components.workspaceCrumb },
                { title: messages.components.componentsCrumb },
                { title: messages.components.navigationCrumb },
              ]}
            />
            <Menu
              mode="horizontal"
              defaultSelectedKeys={['overview']}
              items={[
                {
                  key: 'overview',
                  icon: <AppstoreOutlined />,
                  label: messages.components.overview,
                },
                { key: 'members', icon: <UserOutlined />, label: messages.components.members },
                {
                  key: 'settings',
                  icon: <SettingOutlined />,
                  label: messages.components.settingsItem,
                },
              ]}
            />
            <Dropdown
              menu={{
                items: [
                  { key: 'csv', label: messages.components.exportCsv },
                  { key: 'json', label: messages.components.exportJson },
                ],
              }}
            >
              <Button icon={<DownloadOutlined />}>{messages.components.exportOptions}</Button>
            </Dropdown>
          </Space>
        </Card>
      </Col>

      <Col xs={24} xl={14}>
        <Card className="component-panel" title={messages.components.steps}>
          <Steps
            current={1}
            items={[
              {
                title: messages.components.configure,
                content: messages.components.configureDetail,
              },
              { title: messages.components.validate, content: messages.components.validateDetail },
              { title: messages.components.deploy, content: messages.components.deployDetail },
            ]}
          />
        </Card>
      </Col>
      <Col xs={24} xl={10}>
        <Card className="component-panel" title={messages.components.pagination}>
          <Pagination defaultCurrent={3} total={120} showSizeChanger showQuickJumper />
        </Card>
      </Col>

      <Col span={24}>
        <Card className="component-panel" title={messages.components.tabsDisclosure}>
          <Tabs
            items={[
              {
                key: 'summary',
                label: messages.components.summary,
                children: messages.components.summaryDetail,
              },
              {
                key: 'activity',
                label: messages.components.activity,
                children: messages.components.activityDetail,
              },
              {
                key: 'audit',
                label: messages.components.auditLog,
                children: messages.components.auditLogDetail,
              },
            ]}
          />
          <Collapse
            accordion
            items={[
              {
                key: 'one',
                label: messages.components.faqNavigation,
                children: messages.components.faqNavigationAnswer,
              },
              {
                key: 'two',
                label: messages.components.faqMenus,
                children: messages.components.faqMenusAnswer,
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
          <Card className="component-panel" title={messages.components.alertsMessages}>
            <Space orientation="vertical" size="middle" className="full-width">
              <Alert showIcon type="success" title={messages.components.buildCompleted} />
              <Alert showIcon type="info" title={messages.components.dependencyUpdate} />
              <Alert showIcon type="warning" title={messages.components.approvalsRequired} />
              <Alert showIcon type="error" title={messages.components.stagingFailed} closable />
              <Space wrap>
                <Button onClick={() => void message.success(messages.components.changesSaved)}>
                  {messages.components.showMessage}
                </Button>
                <Button
                  onClick={() =>
                    notification.success({
                      title: messages.components.deploymentComplete,
                      description: messages.components.deploymentCompleteDetail,
                      showProgress: true,
                    })
                  }
                >
                  {messages.components.showNotification}
                </Button>
              </Space>
            </Space>
          </Card>
        </Col>

        <Col xs={24} xl={12}>
          <Card className="component-panel" title={messages.components.progressLoading}>
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
          <Card className="component-panel" title={messages.components.overlaysConfirmation}>
            <Space wrap>
              <Button type="primary" onClick={() => setModalOpen(true)}>
                {messages.components.openModal}
              </Button>
              <Button onClick={() => setDrawerOpen(true)}>{messages.components.openDrawer}</Button>
              <Popconfirm
                title={messages.components.archiveRelease}
                description={messages.components.archiveReleaseDetail}
                onConfirm={() => void message.success(messages.components.releaseArchived)}
              >
                <Button danger>{messages.components.archive}</Button>
              </Popconfirm>
              <Popover
                title={messages.components.buildInformation}
                content={messages.components.buildInformationDetail}
              >
                <Button>{messages.components.openPopover}</Button>
              </Popover>
              <Tooltip title={messages.components.themeAwareTooltip}>
                <Button
                  shape="circle"
                  icon={<InfoCircleOutlined />}
                  aria-label={messages.components.showTooltip}
                />
              </Tooltip>
            </Space>
          </Card>
        </Col>

        <Col xs={24} xl={10}>
          <Card className="component-panel" title={messages.components.resultTitle}>
            <Result
              status="success"
              title={messages.components.workspaceReady}
              subTitle={messages.components.workspaceReadySubtitle}
              extra={<Button type="primary">{messages.components.viewRelease}</Button>}
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
              <Button disabled>{messages.components.unavailableAction}</Button>
              <Button loading>{messages.components.processing}</Button>
            </Space>
          </Card>
        </Col>
      </Row>

      <Modal
        title={messages.components.reviewChanges}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => {
          setModalOpen(false)
          void message.success(messages.components.changesApproved)
        }}
      >
        <Typography.Paragraph>{messages.components.modalBody}</Typography.Paragraph>
      </Modal>

      <Drawer
        title={messages.components.releaseDetails}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        extra={<Tag color="processing">{messages.components.inProgress}</Tag>}
      >
        <Descriptions
          column={1}
          items={[
            { key: 'branch', label: messages.components.branch, children: 'main' },
            {
              key: 'environment',
              label: messages.components.environment,
              children: messages.components.production,
            },
            { key: 'owner', label: messages.components.owner, children: 'Maya Chen' },
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
            children: <DataDisplayShowcase messages={messages} />,
          },
          {
            key: 'navigation',
            label: messages.components.navigation,
            children: <NavigationShowcase messages={messages} />,
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
