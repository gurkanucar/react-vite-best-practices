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
  Anchor,
  App,
  AutoComplete,
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Calendar,
  Card,
  Carousel,
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
  FloatButton,
  Form,
  Grid,
  Image,
  Input,
  InputNumber,
  Layout,
  Listy,
  Masonry,
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
  Splitter,
  Statistic,
  Steps,
  Switch,
  Table,
  Tabs,
  Tag,
  TimePicker,
  Timeline,
  Tooltip,
  Tour,
  Transfer,
  Tree,
  TreeSelect,
  Typography,
  Upload,
  Watermark,
} from 'antd'
import type { ResultProps } from 'antd'
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
  const [transferKeys, setTransferKeys] = useState<string[]>(['1'])

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
            <Input.Password autoComplete="off" placeholder={messages.components.password} />
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
        <Card className="component-panel" title={messages.components.transfer}>
          <Transfer
            dataSource={Array.from({ length: 6 }, (_, index) => ({
              key: String(index),
              title: messages.components.transferItem.replace('{index}', String(index + 1)),
            }))}
            render={(item) => item.title}
            targetKeys={transferKeys}
            titles={[messages.components.transferSource, messages.components.transferTarget]}
            onChange={(keys) => setTransferKeys(keys.map(String))}
          />
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

function LayoutShowcase({ messages }: { messages: Messages }) {
  const breakpoints = Grid.useBreakpoint()
  const activeBreakpoints = Object.entries(breakpoints)
    .filter(([, active]) => active)
    .map(([name]) => name)

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} xl={12}>
        <Card className="component-panel" title={messages.components.gridBreakpoints}>
          <Typography.Paragraph type="secondary">
            {messages.components.gridBreakpointsDescription}
          </Typography.Paragraph>
          <Row gutter={[8, 8]}>
            {[8, 8, 8, 12, 12, 24].map((span, index) => (
              <Col key={index} span={span}>
                <div className="grid-demo-cell">{span}</div>
              </Col>
            ))}
          </Row>
          <Divider />
          <Space wrap>
            <Typography.Text type="secondary">
              {messages.components.activeBreakpoints}:
            </Typography.Text>
            {activeBreakpoints.map((name) => (
              <Tag key={name} color="blue">
                {name}
              </Tag>
            ))}
          </Space>
        </Card>
      </Col>

      <Col xs={24} xl={12}>
        <Card className="component-panel" title={messages.components.splitter}>
          <Typography.Paragraph type="secondary">
            {messages.components.splitterDescription}
          </Typography.Paragraph>
          <Splitter className="splitter-demo">
            <Splitter.Panel defaultSize="35%" min="20%" max="70%">
              <div className="splitter-demo__panel">{messages.components.splitterNavigation}</div>
            </Splitter.Panel>
            <Splitter.Panel>
              <div className="splitter-demo__panel">{messages.components.splitterContent}</div>
            </Splitter.Panel>
          </Splitter>
        </Card>
      </Col>

      <Col xs={24} xl={12}>
        <Card className="component-panel" title={messages.components.masonry}>
          <Typography.Paragraph type="secondary">
            {messages.components.masonryDescription}
          </Typography.Paragraph>
          <Masonry
            columns={{ xs: 1, sm: 2, lg: 3 }}
            gutter={12}
            items={[120, 72, 160, 96, 130, 80].map((height, index) => ({
              key: index,
              data: { height, index },
            }))}
            itemRender={({ data }) => (
              <Card size="small" styles={{ body: { height: data.height } }}>
                {messages.components.masonryItem.replace('{index}', String(data.index + 1))}
              </Card>
            )}
          />
        </Card>
      </Col>

      <Col xs={24} xl={12}>
        <Card className="component-panel" title={messages.components.appShell}>
          <Typography.Paragraph type="secondary">
            {messages.components.appShellDescription}
          </Typography.Paragraph>
          <Layout className="layout-demo">
            <Layout.Header className="layout-demo__header">
              {messages.components.shellHeader}
            </Layout.Header>
            <Layout>
              <Layout.Sider className="layout-demo__sider" width={96}>
                {messages.components.shellSider}
              </Layout.Sider>
              <Layout.Content className="layout-demo__content">
                {messages.components.shellContent}
              </Layout.Content>
            </Layout>
            <Layout.Footer className="layout-demo__footer">
              {messages.components.shellFooter}
            </Layout.Footer>
          </Layout>
        </Card>
      </Col>
    </Row>
  )
}

/**
 * Tour resolves its target only when a step is shown, so the elements are looked up by
 * id at that moment. Its type declares the getter as always returning an element.
 */
function tourTarget(id: string) {
  return () => document.querySelector(`#${id}`) as HTMLElement
}

function DataDisplayShowcase({ messages }: { messages: Messages }) {
  const [tourOpen, setTourOpen] = useState(false)
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
                children: <Tag color="blue">v{__APP_VERSION__}</Tag>,
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

      <Col xs={24} xl={12}>
        <Card className="component-panel" title={messages.components.carousel}>
          <Carousel arrows autoplay>
            {[1, 2, 3].map((slide) => (
              <div key={slide}>
                <div className="carousel-demo__slide">
                  {messages.components.carouselSlide.replace('{index}', String(slide))}
                </div>
              </div>
            ))}
          </Carousel>
        </Card>
      </Col>

      <Col xs={24} xl={12}>
        <Card className="component-panel" title={messages.components.tour}>
          <Typography.Paragraph type="secondary">
            {messages.components.tourDescription}
          </Typography.Paragraph>
          <Space wrap>
            <Button id="tour-columns" icon={<AppstoreOutlined />}>
              {messages.common.columns}
            </Button>
            <Button id="tour-refresh" icon={<CloudUploadOutlined />}>
              {messages.posts.invalidate}
            </Button>
            <Button type="primary" onClick={() => setTourOpen(true)}>
              {messages.components.startTour}
            </Button>
          </Space>
          <Tour
            open={tourOpen}
            steps={[
              {
                title: messages.components.tourColumnsTitle,
                description: messages.components.tourColumnsDetail,
                target: tourTarget('tour-columns'),
              },
              {
                title: messages.components.tourRefreshTitle,
                description: messages.components.tourRefreshDetail,
                target: tourTarget('tour-refresh'),
              },
            ]}
            onClose={() => setTourOpen(false)}
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
        <Card className="component-panel" title={messages.components.anchor}>
          <Typography.Paragraph type="secondary">
            {messages.components.anchorDescription}
          </Typography.Paragraph>
          <Anchor
            affix={false}
            direction="horizontal"
            items={[
              { key: 'menus', href: '#catalog-menus', title: messages.components.breadcrumbMenu },
              { key: 'steps', href: '#catalog-steps', title: messages.components.steps },
              { key: 'tabs', href: '#catalog-tabs', title: messages.components.tabsDisclosure },
            ]}
          />
        </Card>
      </Col>
      <Col span={24}>
        <Card
          className="component-panel"
          id="catalog-menus"
          title={messages.components.breadcrumbMenu}
        >
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

      <Col span={24}>
        <Card className="component-panel" title={messages.components.contextMenu}>
          <Typography.Paragraph type="secondary">
            {messages.components.contextMenuDescription}
          </Typography.Paragraph>
          <Dropdown
            trigger={['contextMenu']}
            menu={{
              items: [
                { key: 'open', icon: <AppstoreOutlined />, label: messages.components.overview },
                { key: 'export', icon: <DownloadOutlined />, label: messages.components.exportCsv },
                { type: 'divider' },
                { key: 'archive', danger: true, label: messages.components.archive },
              ],
            }}
          >
            <div className="context-menu-demo">{messages.components.contextMenuTarget}</div>
          </Dropdown>
        </Card>
      </Col>

      <Col xs={24} xl={14}>
        <Card className="component-panel" id="catalog-steps" title={messages.components.steps}>
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
        <Card
          className="component-panel"
          id="catalog-tabs"
          title={messages.components.tabsDisclosure}
        >
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

type ResultStatus = 'success' | 'error' | 'info' | 'warning' | '404' | '403' | '500'

function resultOptions(messages: Messages) {
  return [
    { label: messages.components.resultSuccess, value: 'success' },
    { label: messages.components.resultError, value: 'error' },
    { label: messages.components.resultInfo, value: 'info' },
    { label: messages.components.resultWarning, value: 'warning' },
    { label: messages.components.resultNotFound, value: '404' },
    { label: messages.components.resultForbidden, value: '403' },
    { label: messages.components.resultServerError, value: '500' },
  ]
}

function resultContent(messages: Messages): Record<ResultStatus, ResultProps> {
  return {
    success: {
      status: 'success',
      title: messages.components.workspaceReady,
      subTitle: messages.components.workspaceReadySubtitle,
      extra: <Button type="primary">{messages.components.viewRelease}</Button>,
    },
    error: {
      status: 'error',
      title: messages.components.resultErrorTitle,
      subTitle: messages.components.resultErrorSubtitle,
      extra: <Button danger>{messages.components.retry}</Button>,
    },
    info: {
      status: 'info',
      title: messages.components.resultInfoTitle,
      subTitle: messages.components.resultInfoSubtitle,
    },
    warning: {
      status: 'warning',
      title: messages.components.resultWarningTitle,
      subTitle: messages.components.resultWarningSubtitle,
    },
    '404': {
      status: '404',
      title: messages.components.resultNotFoundTitle,
      subTitle: messages.components.resultNotFoundSubtitle,
      extra: <Button type="primary">{messages.components.backHome}</Button>,
    },
    '403': {
      status: '403',
      title: messages.components.resultForbiddenTitle,
      subTitle: messages.components.resultForbiddenSubtitle,
    },
    '500': {
      status: '500',
      title: messages.components.resultServerErrorTitle,
      subTitle: messages.components.resultServerErrorSubtitle,
      extra: <Button type="primary">{messages.components.retry}</Button>,
    },
  }
}

function FeedbackShowcase({ messages }: { messages: Messages }) {
  const { message, notification } = App.useApp()
  const [resultStatus, setResultStatus] = useState<ResultStatus>('success')
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
                      description: messages.components.deploymentCompleteDetail.replace(
                        '{version}',
                        __APP_VERSION__,
                      ),
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

        <Col span={24}>
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

        <Col span={24}>
          <Card className="component-panel" title={messages.components.resultTitle}>
            <Typography.Paragraph type="secondary">
              {messages.components.resultVariantsDescription}
            </Typography.Paragraph>
            <Segmented
              block
              options={resultOptions(messages)}
              value={resultStatus}
              onChange={(value) => setResultStatus(value as ResultStatus)}
            />
            <Result {...resultContent(messages)[resultStatus]} />
          </Card>
        </Col>

        <Col xs={24} xl={12}>
          <Card className="component-panel" title={messages.components.watermark}>
            <Typography.Paragraph type="secondary">
              {messages.components.watermarkDescription}
            </Typography.Paragraph>
            <Watermark content={messages.components.watermarkContent} gap={[24, 24]}>
              <div className="watermark-demo">
                <Typography.Paragraph>{messages.components.watermarkBody}</Typography.Paragraph>
                <Progress percent={45} />
              </div>
            </Watermark>
          </Card>
        </Col>

        <Col xs={24} xl={12}>
          <Card className="component-panel" title={messages.components.icons}>
            <Typography.Paragraph type="secondary">
              {messages.components.iconsDescription}
            </Typography.Paragraph>
            <Space size="large" wrap>
              <AppstoreOutlined className="icon-demo" />
              <CheckCircleOutlined className="icon-demo" />
              <CloudUploadOutlined className="icon-demo" />
              <DownloadOutlined className="icon-demo" />
              <InfoCircleOutlined className="icon-demo" />
              <SettingOutlined className="icon-demo" />
              <UserOutlined className="icon-demo" />
            </Space>
          </Card>
        </Col>

        <Col span={24}>
          <Card className="component-panel" title={messages.components.actions}>
            <Typography.Paragraph type="secondary">
              {messages.components.actionsDescription}
            </Typography.Paragraph>
            <Alert
              showIcon
              type="info"
              title={messages.components.messagesNote}
              style={{ marginBottom: 16 }}
            />
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

      <FloatButton.Group shape="circle" style={{ insetInlineEnd: 24 }}>
        <FloatButton
          icon={<InfoCircleOutlined />}
          tooltip={messages.components.floatButtonHelp}
          onClick={() => void message.info(messages.components.floatButtonDescription)}
        />
        <FloatButton.BackTop tooltip={messages.components.floatButtonBackTop} />
      </FloatButton.Group>

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
            key: 'layout',
            label: messages.components.layoutTab,
            children: <LayoutShowcase messages={messages} />,
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
