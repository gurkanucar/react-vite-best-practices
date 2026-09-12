import {
  FileImageOutlined,
  FileMarkdownOutlined,
  FilePdfOutlined,
  FileZipOutlined,
  FolderFilled,
  Html5Outlined,
} from '@ant-design/icons'
import type { FileKind } from '@/features/files/types'

const icons = {
  folder: FolderFilled,
  document: FileMarkdownOutlined,
  image: FileImageOutlined,
  archive: FileZipOutlined,
  code: Html5Outlined,
  pdf: FilePdfOutlined,
} as const satisfies Record<FileKind, unknown>

/** Folders are tinted so they read as navigation rather than as one more row. */
const colors: Record<FileKind, string | undefined> = {
  folder: 'var(--ant-color-primary)',
  document: undefined,
  image: undefined,
  archive: undefined,
  code: undefined,
  pdf: 'var(--ant-color-error)',
}

export function FileKindIcon({ kind }: { kind: FileKind }) {
  const Icon = icons[kind]

  return <Icon aria-hidden="true" style={{ color: colors[kind] }} />
}
