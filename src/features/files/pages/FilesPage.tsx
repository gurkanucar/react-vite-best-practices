import { App, Card, Col, Flex, Row } from 'antd'
import { useState } from 'react'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import {
  FileBreadcrumb,
  FileTable,
  FileToolbar,
  FolderTree,
  NewFolderModal,
  RenameFileModal,
} from '@/features/files/components'
import {
  useCreateFolderMutation,
  useDeleteNodesMutation,
  useFolderPathParam,
  useFolderQuery,
  useRenameNodeMutation,
  useUploadFileMutation,
} from '@/features/files/hooks'
import { DuplicateNameError } from '@/features/files/services/filesService'
import type { FileNode } from '@/features/files/types'
import { useMessages } from '@/i18n/messages'

export function FilesPage() {
  const messages = useMessages()
  const { message } = App.useApp()
  const { path, openFolder } = useFolderPathParam()
  const folderQuery = useFolderQuery(path)

  const [search, setSearch] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [renaming, setRenaming] = useState<FileNode | null>(null)
  const [creatingFolder, setCreatingFolder] = useState(false)

  const createFolder = useCreateFolderMutation()
  const uploadFile = useUploadFileMutation()
  const renameNode = useRenameNodeMutation()
  const deleteNodes = useDeleteNodesMutation()

  const entries = (folderQuery.data?.entries ?? []).filter((entry) =>
    entry.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
  )

  /** The service rejects a duplicate name; everything else is an unexpected failure. */
  const reportFailure = (error: unknown) => {
    message.error(
      error instanceof DuplicateNameError
        ? messages.files.duplicateName
        : messages.files.actionError,
    )
  }

  const navigate = (nextPath: string) => {
    openFolder(nextPath)
    // A selection made in one folder means nothing in the next one.
    setSelectedIds([])
    setSearch('')
  }

  return (
    <div className="admin-page">
      {/* Description commented out rather than deleted: not worth the space on this screen. */}
      <PageHeader title={messages.files.title} /* description={messages.files.description} */ />

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={7} xl={6}>
          <Card className="dashboard-panel" title={messages.files.folders}>
            <FolderTree path={path} onSelect={navigate} />
          </Card>
        </Col>

        <Col xs={24} lg={17} xl={18}>
          <Card className="dashboard-panel">
            <Flex vertical gap={16}>
              <FileBreadcrumb path={path} onNavigate={navigate} />

              <FileToolbar
                search={search}
                selectedCount={selectedIds.length}
                busy={deleteNodes.isPending}
                onSearch={setSearch}
                onNewFolder={() => setCreatingFolder(true)}
                onUpload={(file) =>
                  uploadFile.mutate(
                    { parentPath: path, name: file.name, size: file.size },
                    {
                      onSuccess: () => message.success(messages.files.uploaded),
                      onError: reportFailure,
                    },
                  )
                }
                onDeleteSelected={() =>
                  deleteNodes.mutate(selectedIds, {
                    onSuccess: (ids) => {
                      setSelectedIds([])
                      message.success(`${messages.files.deleted} (${ids.length})`)
                    },
                    onError: reportFailure,
                  })
                }
              />

              <FileTable
                entries={entries}
                loading={folderQuery.isPending}
                selectedIds={selectedIds}
                onSelectionChange={setSelectedIds}
                onOpenFolder={navigate}
                onRename={setRenaming}
                onDelete={(node) =>
                  deleteNodes.mutate([node.id], {
                    onSuccess: () => message.success(messages.files.deleted),
                    onError: reportFailure,
                  })
                }
                // No file bytes exist behind this listing, so the action reports what a
                // real one would do rather than pretending to save something.
                onDownload={(node) =>
                  message.info(`${messages.files.downloadStarted}: ${node.name}`)
                }
              />
            </Flex>
          </Card>
        </Col>
      </Row>

      <NewFolderModal
        open={creatingFolder}
        saving={createFolder.isPending}
        onCancel={() => setCreatingFolder(false)}
        onSubmit={(name) =>
          createFolder.mutate(
            { parentPath: path, name },
            {
              onSuccess: () => {
                setCreatingFolder(false)
                message.success(messages.files.folderCreated)
              },
              onError: reportFailure,
            },
          )
        }
      />

      <RenameFileModal
        node={renaming}
        saving={renameNode.isPending}
        onCancel={() => setRenaming(null)}
        onSubmit={(name) => {
          if (!renaming) return

          renameNode.mutate(
            { id: renaming.id, name },
            {
              onSuccess: () => {
                setRenaming(null)
                message.success(messages.files.renamed)
              },
              onError: reportFailure,
            },
          )
        }}
      />
    </div>
  )
}
