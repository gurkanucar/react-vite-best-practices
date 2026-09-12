import { DeleteOutlined, DownloadOutlined, EditOutlined, MoreOutlined } from '@ant-design/icons'
import { Button, Dropdown, Empty, Space, Table, Tooltip, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { FileKindIcon } from '@/features/files/components/FileKindIcon'
import { joinPath, type FileNode } from '@/features/files/types'
import { useMessages } from '@/i18n/messages'
import { usePreferencesStore } from '@/store/preferences-store'

interface FileTableProps {
  entries: FileNode[]
  loading: boolean
  selectedIds: string[]
  onSelectionChange: (ids: string[]) => void
  onOpenFolder: (path: string) => void
  onRename: (node: FileNode) => void
  onDelete: (node: FileNode) => void
  onDownload: (node: FileNode) => void
}

/** `4812400` → `4.6 MB`, the way a file manager reports a size rather than as bytes. */
function formatBytes(bytes: number, locale: string): string {
  if (bytes === 0) return '—'

  const units = ['B', 'KB', 'MB', 'GB']
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  const value = bytes / 1024 ** exponent

  return `${value.toLocaleString(locale, { maximumFractionDigits: value < 10 && exponent > 0 ? 1 : 0 })} ${units[exponent]}`
}

export function FileTable({
  entries,
  loading,
  selectedIds,
  onSelectionChange,
  onOpenFolder,
  onRename,
  onDelete,
  onDownload,
}: FileTableProps) {
  const messages = useMessages()
  const language = usePreferencesStore((state) => state.language)
  const locale = language === 'tr' ? 'tr-TR' : 'en-US'

  const columns: ColumnsType<FileNode> = [
    {
      title: messages.files.name,
      dataIndex: 'name',
      key: 'name',
      sorter: (left, right) => left.name.localeCompare(right.name),
      render: (name: string, node) => (
        <Space>
          <FileKindIcon kind={node.kind} />
          {node.kind === 'folder' ? (
            <Button
              type="link"
              style={{ padding: 0 }}
              onClick={() => onOpenFolder(joinPath(node.parentPath, node.name))}
            >
              {name}
            </Button>
          ) : (
            <Typography.Text>{name}</Typography.Text>
          )}
        </Space>
      ),
    },
    {
      title: messages.files.owner,
      dataIndex: 'owner',
      key: 'owner',
      width: 160,
      responsive: ['md'],
    },
    {
      title: messages.files.size,
      dataIndex: 'size',
      key: 'size',
      width: 120,
      align: 'right',
      sorter: (left, right) => left.size - right.size,
      render: (size: number) => formatBytes(size, locale),
    },
    {
      title: messages.files.modified,
      dataIndex: 'modifiedAt',
      key: 'modifiedAt',
      width: 140,
      responsive: ['sm'],
      sorter: (left, right) => left.modifiedAt.localeCompare(right.modifiedAt),
    },
    {
      title: messages.files.actions,
      key: 'actions',
      width: 96,
      align: 'right',
      render: (_, node) => (
        <Space size={4}>
          <Tooltip title={messages.files.rename}>
            <Button
              type="text"
              aria-label={`${messages.files.rename}: ${node.name}`}
              icon={<EditOutlined aria-hidden="true" />}
              onClick={() => onRename(node)}
            />
          </Tooltip>
          <Dropdown
            trigger={['click']}
            menu={{
              items: [
                {
                  key: 'download',
                  icon: <DownloadOutlined aria-hidden="true" />,
                  label: messages.files.download,
                  disabled: node.kind === 'folder',
                  onClick: () => onDownload(node),
                },
                { type: 'divider' },
                {
                  key: 'delete',
                  icon: <DeleteOutlined aria-hidden="true" />,
                  label: messages.files.delete,
                  danger: true,
                  onClick: () => onDelete(node),
                },
              ],
            }}
          >
            <Button
              type="text"
              aria-label={`${messages.files.actions}: ${node.name}`}
              icon={<MoreOutlined aria-hidden="true" />}
            />
          </Dropdown>
        </Space>
      ),
    },
  ]

  return (
    <Table<FileNode>
      rowKey="id"
      columns={columns}
      dataSource={entries}
      loading={loading}
      pagination={false}
      size="middle"
      scroll={{ x: 'max-content' }}
      rowSelection={{
        selectedRowKeys: selectedIds,
        onChange: (keys) => onSelectionChange(keys.map(String)),
      }}
      locale={{ emptyText: <Empty description={messages.files.emptyFolder} /> }}
    />
  )
}
