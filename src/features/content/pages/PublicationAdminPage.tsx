import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  FileImageOutlined,
  MoreOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import {
  Avatar,
  Button,
  Card,
  Dropdown,
  Empty,
  Flex,
  Input,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  type MenuProps,
  type TableColumnsType,
} from 'antd'
import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import { publicationAdminCopy } from '@/features/content/data'
import { campusAnnouncements, corporateNews } from '@/features/showcases/data'
import { localize, type Publication } from '@/features/showcases/types'
import { usePreferencesStore } from '@/store/preferences-store'

type PublicationKind = 'news' | 'announcements'
type PublicationStatus = 'published' | 'scheduled' | 'draft'

interface PublicationAdminPageProps {
  kind: PublicationKind
}

function getStatus(index: number): PublicationStatus {
  if (index === 1) return 'scheduled'
  if (index === 2) return 'draft'
  return 'published'
}

export function PublicationAdminPage({ kind }: PublicationAdminPageProps) {
  const language = usePreferencesStore((state) => state.language)
  const text = publicationAdminCopy[language]
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<PublicationStatus | 'all'>('all')
  const source = kind === 'news' ? corporateNews : campusAnnouncements
  const publicPath =
    kind === 'news' ? '/showcases/corporate/news' : '/showcases/technopark/announcements'

  const publications = useMemo(
    () =>
      source.filter((publication, index) => {
        const searchable = [
          localize(publication.title, language),
          localize(publication.summary, language),
          localize(publication.category, language),
        ]
          .join(' ')
          .toLocaleLowerCase(language)
        return (
          searchable.includes(query.trim().toLocaleLowerCase(language)) &&
          (status === 'all' || getStatus(index) === status)
        )
      }),
    [language, query, source, status],
  )

  const columns: TableColumnsType<Publication> = [
    {
      title: text.titleColumn,
      dataIndex: 'title',
      key: 'title',
      render: (_, publication) => (
        <Space>
          <Avatar
            shape="square"
            size={40}
            src={publication.coverImage?.src}
            icon={<FileImageOutlined />}
          />
          <Flex vertical gap={2}>
            <Link to={`/content/${kind}/${publication.slug}/edit`}>
              <Typography.Text strong>{localize(publication.title, language)}</Typography.Text>
            </Link>
            <Typography.Text type="secondary" ellipsis style={{ maxWidth: 460 }}>
              {localize(publication.summary, language)}
            </Typography.Text>
          </Flex>
        </Space>
      ),
    },
    {
      title: text.categoryColumn,
      dataIndex: 'category',
      key: 'category',
      responsive: ['md'],
      render: (_, publication) => <Tag>{localize(publication.category, language)}</Tag>,
    },
    {
      title: text.dateColumn,
      dataIndex: 'date',
      key: 'date',
      responsive: ['lg'],
      render: (date: string) =>
        new Intl.DateTimeFormat(language === 'tr' ? 'tr-TR' : 'en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }).format(new Date(date)),
    },
    {
      title: text.statusColumn,
      key: 'status',
      render: (_, publication) => {
        const publicationStatus = getStatus(source.indexOf(publication))
        const colors: Record<PublicationStatus, string> = {
          published: 'success',
          scheduled: 'processing',
          draft: 'default',
        }
        return <Tag color={colors[publicationStatus]}>{text[publicationStatus]}</Tag>
      },
    },
    {
      title: text.actionsColumn,
      key: 'actions',
      align: 'right',
      width: 84,
      render: (_, publication) => {
        const items: MenuProps['items'] = [
          {
            key: 'view',
            icon: <EyeOutlined />,
            label: <Link to={`${publicPath}/${publication.slug}`}>{text.view}</Link>,
          },
          {
            key: 'edit',
            icon: <EditOutlined />,
            label: <Link to={`/content/${kind}/${publication.slug}/edit`}>{text.edit}</Link>,
          },
          { key: 'duplicate', icon: <CopyOutlined />, label: text.duplicate },
          { type: 'divider' },
          { key: 'archive', icon: <DeleteOutlined />, label: text.archive, danger: true },
        ]
        return (
          <Dropdown menu={{ items }} trigger={['click']}>
            <Button type="text" icon={<MoreOutlined />} aria-label={text.actions} />
          </Dropdown>
        )
      },
    },
  ]

  return (
    <div className="admin-page">
      <PageHeader
        title={kind === 'news' ? text.newsTitle : text.announcementsTitle}
        description={kind === 'news' ? text.newsDescription : text.announcementsDescription}
        extra={
          <Link to={`/content/${kind}/new`}>
            <Button type="primary" icon={<PlusOutlined aria-hidden="true" />}>
              {kind === 'news' ? text.addNews : text.addAnnouncement}
            </Button>
          </Link>
        }
      />

      <Card className="dashboard-panel">
        <Flex gap={8} wrap style={{ marginBottom: 16 }}>
          <Input.Search
            allowClear
            value={query}
            placeholder={kind === 'news' ? text.searchNews : text.searchAnnouncements}
            style={{ flex: '1 1 240px', maxWidth: 360 }}
            onChange={(event) => setQuery(event.target.value)}
          />
          <Select
            value={status}
            style={{ minWidth: 160 }}
            options={[
              { value: 'all', label: text.allStatuses },
              { value: 'published', label: text.published },
              { value: 'scheduled', label: text.scheduled },
              { value: 'draft', label: text.draft },
            ]}
            onChange={setStatus}
          />
        </Flex>
        <Table<Publication>
          rowKey="slug"
          columns={columns}
          dataSource={publications}
          scroll={{ x: 720 }}
          locale={{ emptyText: <Empty description={text.noResults} /> }}
          pagination={{ pageSize: 7, showTotal: (total) => `${total} ${text.results}` }}
        />
      </Card>
    </div>
  )
}

export function NewsAdminPage() {
  return <PublicationAdminPage kind="news" />
}

export function AnnouncementsAdminPage() {
  return <PublicationAdminPage kind="announcements" />
}
