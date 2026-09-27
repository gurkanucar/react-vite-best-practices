import {
  ArrowLeftOutlined,
  EyeOutlined,
  FileAddOutlined,
  InboxOutlined,
  SaveOutlined,
  SendOutlined,
} from '@ant-design/icons'
import {
  App,
  Button,
  Card,
  Col,
  DatePicker,
  Flex,
  Form,
  Input,
  Radio,
  Row,
  Segmented,
  Select,
  Space,
  Switch,
  Typography,
  Upload,
} from 'antd'
import dayjs, { type Dayjs } from 'dayjs'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import { RichTextEditor } from '@/features/showcases/components'
import { publicationEditorCopy } from '@/features/showcases/data'
import { usePreferencesStore } from '@/store/preferences-store'
import '../talent.css'

interface PublicationFormValues {
  type: 'news' | 'announcement'
  headline: string
  summary: string
  category: string
  tags: string[]
  audience: 'everyone' | 'residents' | 'employees'
  publishDate: Dayjs
  expiryDate?: Dayjs
  featured: boolean
  notify: boolean
}

export function TechParkPublicationEditorPage() {
  const language = usePreferencesStore((state) => state.language)
  const text = publicationEditorCopy[language]
  const { message } = App.useApp()
  const navigate = useNavigate()
  const [form] = Form.useForm<PublicationFormValues>()
  const [body, setBody] = useState('')

  const submit = (_values: PublicationFormValues) => {
    void message.success(text.saved)
    void navigate('/showcases/technopark')
  }

  return (
    <div className="admin-page talent-page talent-form-page">
      <PageHeader title={text.title} description={text.description} />

      <Form<PublicationFormValues>
        form={form}
        layout="vertical"
        initialValues={{
          type: 'news',
          audience: 'everyone',
          publishDate: dayjs(),
          featured: true,
          notify: false,
          tags: [],
        }}
        onFinish={submit}
      >
        <Row gutter={[20, 20]} align="top">
          <Col xs={24} xl={16}>
            <Space className="talent-form-stack" orientation="vertical" size={20}>
              <Card className="talent-form-card" variant="borderless">
                <div className="talent-form-card__heading">
                  <Typography.Title level={3}>{text.content}</Typography.Title>
                  <Typography.Text type="secondary">{text.contentHint}</Typography.Text>
                </div>
                <Form.Item label={text.type} name="type">
                  <Segmented
                    block
                    options={[
                      { value: 'news', label: text.news },
                      { value: 'announcement', label: text.announcement },
                    ]}
                  />
                </Form.Item>
                <Form.Item
                  label={text.headline}
                  name="headline"
                  rules={[{ required: true, message: text.required }]}
                >
                  <Input size="large" placeholder={text.headlinePlaceholder} />
                </Form.Item>
                <Form.Item
                  label={text.summary}
                  name="summary"
                  rules={[{ required: true, message: text.required }]}
                >
                  <Input.TextArea
                    rows={3}
                    showCount
                    maxLength={220}
                    placeholder={text.summaryPlaceholder}
                  />
                </Form.Item>
                <Row gutter={16}>
                  <Col xs={24} md={10}>
                    <Form.Item
                      label={text.category}
                      name="category"
                      rules={[{ required: true, message: text.required }]}
                    >
                      <Input size="large" placeholder={text.categoryPlaceholder} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={14}>
                    <Form.Item label={text.tags} name="tags">
                      <Select
                        mode="tags"
                        size="large"
                        placeholder={text.tagsPlaceholder}
                        tokenSeparators={[',']}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item label={text.body} required>
                  <RichTextEditor
                    key={language}
                    initialValue={body}
                    language={language}
                    placeholder={text.editorPlaceholder}
                    onChange={setBody}
                  />
                </Form.Item>
              </Card>

              <Card className="talent-form-card" variant="borderless">
                <div className="talent-form-card__heading">
                  <Typography.Title level={3}>{text.media}</Typography.Title>
                  <Typography.Text type="secondary">{text.mediaHint}</Typography.Text>
                </div>
                <Form.Item label={text.coverImage}>
                  <Upload.Dragger
                    accept="image/png,image/jpeg"
                    beforeUpload={() => false}
                    maxCount={1}
                    showUploadList
                  >
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">{text.coverUpload}</p>
                    <p className="ant-upload-hint">{text.coverHelp}</p>
                  </Upload.Dragger>
                </Form.Item>
                <Form.Item label={text.attachments}>
                  <Upload beforeUpload={() => false} multiple>
                    <Button icon={<FileAddOutlined />}>{text.attachmentUpload}</Button>
                  </Upload>
                </Form.Item>
              </Card>
            </Space>
          </Col>

          <Col xs={24} xl={8}>
            <Card className="talent-form-card talent-publish-card" variant="borderless">
              <div className="talent-form-card__heading">
                <Typography.Title level={3}>{text.settings}</Typography.Title>
                <Typography.Text type="secondary">{text.settingsHint}</Typography.Text>
              </div>
              <Form.Item label={text.audience} name="audience">
                <Radio.Group>
                  <Space orientation="vertical">
                    <Radio value="everyone">{text.everyone}</Radio>
                    <Radio value="residents">{text.residents}</Radio>
                    <Radio value="employees">{text.employees}</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>
              <Form.Item
                label={text.publishDate}
                name="publishDate"
                rules={[{ required: true, message: text.required }]}
              >
                <DatePicker className="full-width" showTime size="large" />
              </Form.Item>
              <Form.Item label={text.expiryDate} name="expiryDate">
                <DatePicker className="full-width" size="large" />
              </Form.Item>
              <Form.Item label={text.featured} name="featured" valuePropName="checked">
                <Switch />
              </Form.Item>
              <Form.Item label={text.notify} name="notify" valuePropName="checked">
                <Switch />
              </Form.Item>
              <Flex vertical gap={8}>
                <Button block size="large" icon={<SaveOutlined />} onClick={form.submit}>
                  {text.saveDraft}
                </Button>
                <Button block size="large" icon={<EyeOutlined />}>
                  {text.preview}
                </Button>
                <Button
                  block
                  size="large"
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={form.submit}
                >
                  {text.publish}
                </Button>
                <Link to="/showcases/technopark">
                  <Button block size="large" icon={<ArrowLeftOutlined />}>
                    {language === 'tr' ? 'Teknoparka dön' : 'Back to Technopark'}
                  </Button>
                </Link>
              </Flex>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  )
}
