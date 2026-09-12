import { DeleteOutlined, FolderAddOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Flex, Input, Popconfirm, Upload } from 'antd'
import { useMessages } from '@/i18n/messages'

interface FileToolbarProps {
  search: string
  selectedCount: number
  busy: boolean
  onSearch: (value: string) => void
  onNewFolder: () => void
  onUpload: (file: File) => void
  onDeleteSelected: () => void
}

export function FileToolbar({
  search,
  selectedCount,
  busy,
  onSearch,
  onNewFolder,
  onUpload,
  onDeleteSelected,
}: FileToolbarProps) {
  const messages = useMessages()

  return (
    <Flex gap={8} wrap justify="space-between" align="center">
      <Input.Search
        allowClear
        value={search}
        placeholder={messages.files.searchPlaceholder}
        onChange={(event) => onSearch(event.target.value)}
        style={{ maxWidth: 320 }}
      />
      <Flex gap={8} wrap>
        {selectedCount > 0 && (
          <Popconfirm
            title={messages.files.deleteSelectedConfirm}
            okText={messages.files.delete}
            cancelText={messages.common.cancel}
            onConfirm={onDeleteSelected}
          >
            <Button danger icon={<DeleteOutlined aria-hidden="true" />} loading={busy}>
              {messages.files.deleteSelected} ({selectedCount})
            </Button>
          </Popconfirm>
        )}
        <Upload
          showUploadList={false}
          /*
           * There is no upload endpoint behind this screen. `beforeUpload` returning
           * false stops Ant Design from starting a request while still handing over the
           * picked file, which is the hook a real `action` or `customRequest` would use.
           */
          beforeUpload={(file) => {
            onUpload(file)
            return false
          }}
        >
          <Button icon={<UploadOutlined aria-hidden="true" />}>{messages.files.upload}</Button>
        </Upload>
        <Button
          type="primary"
          icon={<FolderAddOutlined aria-hidden="true" />}
          onClick={onNewFolder}
        >
          {messages.files.newFolder}
        </Button>
      </Flex>
    </Flex>
  )
}
