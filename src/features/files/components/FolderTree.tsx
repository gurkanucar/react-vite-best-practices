import { FolderOutlined, HomeOutlined } from '@ant-design/icons'
import { Tree } from 'antd'
import type { DataNode } from 'antd/es/tree'
import { useState } from 'react'
import { LoadingState } from '@/components/LoadingState/LoadingState'
import { useFolderTreeQuery } from '@/features/files/hooks'
import { ancestorPaths, ROOT_PATH, type FolderTreeNode } from '@/features/files/types'
import { useMessages } from '@/i18n/messages'

interface FolderTreeProps {
  path: string
  onSelect: (path: string) => void
}

function toDataNodes(folders: FolderTreeNode[]): DataNode[] {
  return folders.map((folder) => ({
    key: folder.path,
    title: folder.name,
    icon: <FolderOutlined aria-hidden="true" />,
    children: folder.children.length > 0 ? toDataNodes(folder.children) : undefined,
  }))
}

export function FolderTree({ path, onSelect }: FolderTreeProps) {
  const messages = useMessages()
  const treeQuery = useFolderTreeQuery()
  const [expandedKeys, setExpandedKeys] = useState<string[]>(() => [
    ROOT_PATH,
    ...ancestorPaths(path),
  ])
  const [lastPath, setLastPath] = useState(path)

  /**
   * The path can change from outside the tree — a breadcrumb, a row, a pasted link — and
   * the branch holding it may be collapsed. Adjusting during render rather than in an
   * effect avoids the extra pass that would draw the selection inside a closed branch
   * first. Expanding is additive, so a folder the reader collapsed stays collapsed.
   */
  if (lastPath !== path) {
    setLastPath(path)
    setExpandedKeys((current) => [...new Set([...current, ROOT_PATH, ...ancestorPaths(path)])])
  }

  if (treeQuery.isPending) {
    return <LoadingState />
  }

  const nodes: DataNode[] = [
    {
      key: ROOT_PATH,
      title: messages.files.allFiles,
      icon: <HomeOutlined aria-hidden="true" />,
      children: toDataNodes(treeQuery.data ?? []),
    },
  ]

  return (
    <Tree
      showIcon
      blockNode
      treeData={nodes}
      selectedKeys={[path]}
      expandedKeys={expandedKeys}
      onExpand={(keys) => setExpandedKeys(keys.map(String))}
      onSelect={(keys) => {
        const [key] = keys
        if (typeof key === 'string') onSelect(key)
      }}
    />
  )
}
