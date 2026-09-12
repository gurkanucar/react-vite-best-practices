export type FileKind = 'folder' | 'document' | 'image' | 'archive' | 'code' | 'pdf'

export interface FileNode {
  id: string
  name: string
  kind: FileKind
  /** The folder holding this node. `/` for the root's own children. */
  parentPath: string
  /** Bytes. Folders report the sum of their contents instead. */
  size: number
  modifiedAt: string
  owner: string
}

export interface FolderContents {
  path: string
  entries: FileNode[]
}

export interface FolderTreeNode {
  path: string
  name: string
  children: FolderTreeNode[]
}

export const FILE_QUERY_KEYS = {
  all: ['files'] as const,
  tree: () => [...FILE_QUERY_KEYS.all, 'tree'] as const,
  folders: () => [...FILE_QUERY_KEYS.all, 'folder'] as const,
  folder: (path: string) => [...FILE_QUERY_KEYS.folders(), path] as const,
}

export const ROOT_PATH = '/'

/** `/design/brand` → `['/design', '/design/brand']` */
export function ancestorPaths(path: string): string[] {
  const segments = path.split('/').filter(Boolean)

  return segments.map((_, index) => `/${segments.slice(0, index + 1).join('/')}`)
}

export function joinPath(parentPath: string, name: string): string {
  return parentPath === ROOT_PATH ? `/${name}` : `${parentPath}/${name}`
}

export function pathName(path: string): string {
  return path.split('/').filter(Boolean).at(-1) ?? ''
}
