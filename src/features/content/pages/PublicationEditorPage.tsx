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
  Upload,
} from 'antd'
import dayjs, { type Dayjs } from 'dayjs'
import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import { TiptapEditor } from '@/features/content/components'
import { publicationEditorCopy } from '@/features/content/data'
import { campusAnnouncements, corporateNews } from '@/features/showcases/data'
import { localize } from '@/features/showcases/types'
import { usePreferencesStore } from '@/store/preferences-store'

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

export function PublicationEditorPage() {
  const language = usePreferencesStore((state) => state.language)
  const text = publicationEditorCopy[language]
  const { message } = App.useApp()
  const navigate = useNavigate()
  const { publicationKind, slug } = useParams<{
    publicationKind?: string
    slug?: string
  }>()
  const kind = publicationKind === 'announcements' ? 'announcements' : 'news'
  const source = kind === 'news' ? corporateNews : campusAnnouncements
  const publication = useMemo(() => source.find((item) => item.slug === slug), [slug, source])
  const [form] = Form.useForm<PublicationFormValues>()
  const [body, setBody] = useState(() =>
    publication
      ? publication.body.map((paragraph) => `<p>${localize(paragraph, language)}</p>`).join('')
      : '',
  )
  const isEditing = Boolean(publication)
  const listPath = `/content/${kind}`

  const submit = (values: PublicationFormValues) => {
    void message.success(text.saved)
    void navigate(`/content/${values.type === 'announcement' ? 'announcements' : 'news'}`)
  }

  const initialValues: PublicationFormValues = {
    type: kind === 'news' ? 'news' : 'announcement',
    headline: publication ? localize(publication.title, language) : '',
    summary: publication ? localize(publication.summary, language) : '',
    category: publication ? localize(publication.category, language) : '',
    tags: publication?.tags?.map((tag) => localize(tag, language)) ?? [],
    audience: 'everyone',
    publishDate: publication ? dayjs(publication.date) : dayjs(),
    featured: Boolean(publication?.coverImage),
    notify: false,
  }
  const selectedType = Form.useWatch('type', form) ?? initialValues.type
  const pageTitle =
    selectedType === 'news'
      ? isEditing
        ? text.editNewsTitle
        : text.createNewsTitle
      : isEditing
        ? text.editAnnouncementTitle
        : text.createAnnouncementTitle

  return (
    <div className="admin-page">
      <PageHeader
        title={pageTitle}
        description={text.description}
        extra={
          <Link to={listPath}>
            <Button icon={<ArrowLeftOutlined aria-hidden="true" />}>
              {language === 'tr' ? 'Yayın listesine dön' : 'Back to publications'}
            </Button>
          </Link>
        }
      />

      <Form<PublicationFormValues>
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={submit}
      >
        <Row gutter={[16, 16]} align="top">
          <Col xs={24} xl={16}>
            <Flex vertical gap={16}>
              <Card className="dashboard-panel" title={text.content}>
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
                  <Input placeholder={text.headlinePlaceholder} />
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
                      <Input placeholder={text.categoryPlaceholder} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={14}>
                    <Form.Item label={text.tags} name="tags">
                      <Select
                        mode="tags"
                        placeholder={text.tagsPlaceholder}
                        tokenSeparators={[',']}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item label={text.body} required>
                  <TiptapEditor
                    key={`${language}-${slug ?? 'new'}`}
                    value={body}
                    language={language}
                    placeholder={text.editorPlaceholder}
                    onChange={setBody}
                  />
                </Form.Item>
              </Card>

              <Card className="dashboard-panel" title={text.media}>
                <Form.Item label={text.coverImage}>
                  <Upload.Dragger
                    accept="image/png,image/jpeg"
                    beforeUpload={() => false}
                    maxCount={1}
                    showUploadList
                  >
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined aria-hidden="true" />
                    </p>
                    <p className="ant-upload-text">{text.coverUpload}</p>
                    <p className="ant-upload-hint">{text.coverHelp}</p>
                  </Upload.Dragger>
                </Form.Item>
                <Form.Item label={text.attachments}>
                  <Upload beforeUpload={() => false} multiple>
                    <Button icon={<FileAddOutlined aria-hidden="true" />}>
                      {text.attachmentUpload}
                    </Button>
                  </Upload>
                </Form.Item>
              </Card>
            </Flex>
          </Col>

          <Col xs={24} xl={8}>
            <Card className="dashboard-panel" title={text.settings}>
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
                <DatePicker showTime style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item label={text.expiryDate} name="expiryDate">
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item label={text.featured} name="featured" valuePropName="checked">
                <Switch />
              </Form.Item>
              <Form.Item label={text.notify} name="notify" valuePropName="checked">
                <Switch />
              </Form.Item>
              <Flex gap={8} wrap>
                <Button
                  type="primary"
                  icon={<SendOutlined aria-hidden="true" />}
                  onClick={form.submit}
                >
                  {text.publish}
                </Button>
                <Button icon={<SaveOutlined aria-hidden="true" />} onClick={form.submit}>
                  {text.saveDraft}
                </Button>
                <Button icon={<EyeOutlined aria-hidden="true" />}>{text.preview}</Button>
              </Flex>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  )
}
