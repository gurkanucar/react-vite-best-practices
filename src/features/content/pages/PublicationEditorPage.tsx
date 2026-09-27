import {
  ArrowLeftOutlined,
  EyeOutlined,
  FileAddOutlined,
  InboxOutlined,
  SaveOutlined,
  SendOutlined,
  SyncOutlined,
} from '@ant-design/icons'
import {
  App,
  Badge,
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
  Tabs,
  Tooltip,
  Typography,
  Upload,
} from 'antd'
import GB from 'country-flag-icons/react/3x2/GB'
import TR from 'country-flag-icons/react/3x2/TR'
import dayjs, { type Dayjs } from 'dayjs'
import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import { TiptapEditor } from '@/features/content/components'
import { publicationEditorCopy } from '@/features/content/data'
import { SLUG_PATTERN, slugify } from '@/features/content/slug'
import { campusAnnouncements, corporateNews } from '@/features/showcases/data'
import { localize, type Publication } from '@/features/showcases/types'
import { usePreferencesStore, type Language } from '@/store/preferences-store'

const contentLanguages: Language[] = ['en', 'tr']
const flags = { en: GB, tr: TR }

type PublicationType = 'news' | 'announcement'

/** Everything a reader sees is written per language, including the address it lives at. */
interface LocalizedContent {
  headline: string
  slug: string
  summary: string
  category: string
  tags: string[]
  body: string
}

interface PublicationFormValues {
  type: PublicationType
  content: Record<Language, LocalizedContent>
  audience: 'everyone' | 'residents' | 'employees'
  publishDate: Dayjs
  expiryDate?: Dayjs
  featured: boolean
  notify: boolean
}

function sourceFor(type: PublicationType): Publication[] {
  return type === 'news' ? corporateNews : campusAnnouncements
}

/** Where the public site shows this type, so the slug field can show the finished address. */
function publicPathFor(type: PublicationType): string {
  return type === 'news' ? '/preview/corporate/news' : '/preview/technopark/announcements'
}

function contentFor(publication: Publication | undefined, language: Language): LocalizedContent {
  if (!publication) {
    return { headline: '', slug: '', summary: '', category: '', tags: [], body: '' }
  }
  const headline = localize(publication.title, language)
  return {
    headline,
    // The sample data has one slug, written in English; Turkish gets one from its headline.
    slug: language === 'en' ? publication.slug : slugify(headline),
    summary: localize(publication.summary, language),
    category: localize(publication.category, language),
    tags: publication.tags?.map((tag) => localize(tag, language)) ?? [],
    body: publication.body.map((paragraph) => `<p>${localize(paragraph, language)}</p>`).join(''),
  }
}

function isEmptyHtml(html: string | undefined): boolean {
  return !html?.replace(/<[^>]*>/g, '').trim()
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
  const [activeLanguage, setActiveLanguage] = useState<Language>(language)
  const [languagesWithErrors, setLanguagesWithErrors] = useState<Language[]>([])
  /**
   * A slug follows its headline until someone types into it. An existing publication starts
   * pinned, because changing a published address silently would break every link to it.
   */
  const [pinnedSlugs, setPinnedSlugs] = useState<Record<Language, boolean>>(() => ({
    en: Boolean(publication),
    tr: Boolean(publication),
  }))
  const isEditing = Boolean(publication)
  const listPath = `/content/${kind}`

  const submit = (values: PublicationFormValues) => {
    void message.success(text.saved)
    void navigate(`/content/${values.type === 'announcement' ? 'announcements' : 'news'}`)
  }

  const initialValues: PublicationFormValues = {
    type: kind === 'news' ? 'news' : 'announcement',
    content: {
      en: contentFor(publication, 'en'),
      tr: contentFor(publication, 'tr'),
    },
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

  const refreshTabErrors = () => {
    setLanguagesWithErrors(
      contentLanguages.filter((contentLanguage) =>
        form
          .getFieldsError()
          .some(
            (field) =>
              field.errors.length > 0 &&
              field.name[0] === 'content' &&
              field.name[1] === contentLanguage,
          ),
      ),
    )
  }

  const regenerateSlug = (contentLanguage: Language) => {
    const headline = form.getFieldValue(['content', contentLanguage, 'headline']) as string
    form.setFieldValue(['content', contentLanguage, 'slug'], slugify(headline ?? ''))
    setPinnedSlugs((current) => ({ ...current, [contentLanguage]: false }))
    void form.validateFields([['content', contentLanguage, 'slug']])
  }

  const slugIsTaken = (contentLanguage: Language, value: string) => {
    const type = (form.getFieldValue('type') as PublicationType | undefined) ?? initialValues.type
    return sourceFor(type).some(
      (item) =>
        item.slug !== publication?.slug &&
        (item.slug === value || slugify(localize(item.title, contentLanguage)) === value),
    )
  }

  const contentTabs = contentLanguages.map((contentLanguage) => {
    const Flag = flags[contentLanguage]
    const field = (name: keyof LocalizedContent): ['content', Language, keyof LocalizedContent] => [
      'content',
      contentLanguage,
      name,
    ]
    const languageName = text.languageNames[contentLanguage]
    const hasErrors = languagesWithErrors.includes(contentLanguage)

    return {
      key: contentLanguage,
      // Both panes stay mounted so a missing Turkish headline fails validation on the English tab.
      forceRender: true,
      label: (
        <Flex align="center" gap={8}>
          <Flag aria-hidden="true" style={{ width: 20, borderRadius: 2 }} />
          {languageName}
          {hasErrors && (
            <Tooltip title={text.tabHasErrors}>
              <Badge status="error" aria-label={text.tabHasErrors} />
            </Tooltip>
          )}
        </Flex>
      ),
      children: (
        <>
          <Form.Item
            label={text.headline}
            name={field('headline')}
            rules={[{ required: true, whitespace: true, message: text.required }]}
          >
            <Input placeholder={text.headlinePlaceholder} lang={contentLanguage} />
          </Form.Item>
          <Form.Item
            label={text.slug}
            name={field('slug')}
            extra={
              <Form.Item noStyle dependencies={[field('slug')]}>
                {() => (
                  <Typography.Text type="secondary">
                    {text.slugHelp}{' '}
                    <Typography.Text code>
                      {publicPathFor(selectedType)}/
                      {(form.getFieldValue(field('slug')) as string | undefined) || '…'}
                    </Typography.Text>
                  </Typography.Text>
                )}
              </Form.Item>
            }
            rules={[
              { required: true, message: text.required },
              { pattern: SLUG_PATTERN, message: text.slugInvalid },
              {
                validator: (_, value: string | undefined) =>
                  value && slugIsTaken(contentLanguage, value)
                    ? Promise.reject(new Error(text.slugTaken))
                    : Promise.resolve(),
              },
            ]}
          >
            <Input
              placeholder={text.slugPlaceholder}
              spellCheck={false}
              autoCapitalize="off"
              onChange={() =>
                setPinnedSlugs((current) => ({ ...current, [contentLanguage]: true }))
              }
              suffix={
                <Tooltip title={text.slugRegenerate}>
                  <Button
                    type="text"
                    size="small"
                    icon={<SyncOutlined aria-hidden="true" />}
                    aria-label={`${text.slugRegenerate} (${languageName})`}
                    onClick={() => regenerateSlug(contentLanguage)}
                  />
                </Tooltip>
              }
            />
          </Form.Item>
          <Form.Item
            label={text.summary}
            name={field('summary')}
            rules={[{ required: true, whitespace: true, message: text.required }]}
          >
            <Input.TextArea
              rows={3}
              showCount
              maxLength={220}
              placeholder={text.summaryPlaceholder}
              lang={contentLanguage}
            />
          </Form.Item>
          <Row gutter={16}>
            <Col xs={24} md={10}>
              <Form.Item
                label={text.category}
                name={field('category')}
                rules={[{ required: true, whitespace: true, message: text.required }]}
              >
                <Input placeholder={text.categoryPlaceholder} lang={contentLanguage} />
              </Form.Item>
            </Col>
            <Col xs={24} md={14}>
              <Form.Item label={text.tags} name={field('tags')}>
                <Select mode="tags" placeholder={text.tagsPlaceholder} tokenSeparators={[',']} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label={text.body}
            name={field('body')}
            required
            rules={[
              {
                validator: (_, value: string | undefined) =>
                  isEmptyHtml(value) ? Promise.reject(new Error(text.required)) : Promise.resolve(),
              },
            ]}
          >
            <TiptapEditor
              key={`${contentLanguage}-${slug ?? 'new'}`}
              language={language}
              placeholder={`${text.editorPlaceholder} (${languageName})`}
            />
          </Form.Item>
        </>
      ),
    }
  })

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
        onValuesChange={(changed: Partial<PublicationFormValues>) => {
          for (const contentLanguage of contentLanguages) {
            const headline = changed.content?.[contentLanguage]?.headline
            if (headline !== undefined && !pinnedSlugs[contentLanguage]) {
              form.setFieldValue(['content', contentLanguage, 'slug'], slugify(headline))
            }
          }
        }}
        onFieldsChange={refreshTabErrors}
        onFinishFailed={({ errorFields }) => {
          refreshTabErrors()
          // Open the language whose field failed first, so the error is not hidden in a tab.
          const failed = errorFields[0]?.name
          if (failed?.[0] === 'content' && contentLanguages.includes(failed[1] as Language)) {
            setActiveLanguage(failed[1] as Language)
          }
        }}
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
                <Form.Item label={text.contentLanguages} extra={text.contentLanguagesHint}>
                  <Tabs
                    activeKey={activeLanguage}
                    onChange={(key) => setActiveLanguage(key as Language)}
                    items={contentTabs}
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
