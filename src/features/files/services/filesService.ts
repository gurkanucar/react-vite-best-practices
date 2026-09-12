import {
  ancestorPaths,
  joinPath,
  pathName,
  ROOT_PATH,
  type FileKind,
  type FileNode,
  type FolderContents,
  type FolderTreeNode,
} from '@/features/files/types'

/**
 * There is no file API behind this screen, so the feature ships its own. Keeping the
 * store in memory rather than in MSW means the page works the same in the production
 * build, where the Service Worker is never registered — and the latency below is what
 * makes the loading and optimistic states visible at all.
 */
// Tests do not need the delay, and paying it on every assertion turns a suite into a
// crawl. It is what makes the loading states visible everywhere else.
const LATENCY_MS = import.meta.env.MODE === 'test' ? 5 : 320

interface SeedEntry {
  name: string
  kind: FileKind
  parentPath: string
  size?: number
  modifiedAt: string
  owner: string
}

const seed: SeedEntry[] = [
  { name: 'design', kind: 'folder', parentPath: '/', modifiedAt: '2026-09-04', owner: 'Ava Patel' },
  {
    name: 'engineering',
    kind: 'folder',
    parentPath: '/',
    modifiedAt: '2026-09-11',
    owner: 'Maya Chen',
  },
  {
    name: 'contracts',
    kind: 'folder',
    parentPath: '/',
    modifiedAt: '2026-08-22',
    owner: 'Noah Williams',
  },
  {
    name: 'brand-guide.pdf',
    kind: 'pdf',
    parentPath: '/',
    size: 4_812_400,
    modifiedAt: '2026-09-02',
    owner: 'Ava Patel',
  },

  {
    name: 'brand',
    kind: 'folder',
    parentPath: '/design',
    modifiedAt: '2026-09-04',
    owner: 'Ava Patel',
  },
  {
    name: 'product',
    kind: 'folder',
    parentPath: '/design',
    modifiedAt: '2026-08-30',
    owner: 'Ava Patel',
  },
  {
    name: 'moodboard.png',
    kind: 'image',
    parentPath: '/design',
    size: 2_140_880,
    modifiedAt: '2026-08-28',
    owner: 'Ava Patel',
  },

  {
    name: 'logo-primary.svg',
    kind: 'image',
    parentPath: '/design/brand',
    size: 18_420,
    modifiedAt: '2026-09-04',
    owner: 'Ava Patel',
  },
  {
    name: 'logo-mono.svg',
    kind: 'image',
    parentPath: '/design/brand',
    size: 16_180,
    modifiedAt: '2026-09-04',
    owner: 'Ava Patel',
  },
  {
    name: 'palette.json',
    kind: 'code',
    parentPath: '/design/brand',
    size: 3_260,
    modifiedAt: '2026-09-01',
    owner: 'Maya Chen',
  },
  {
    name: 'typography.pdf',
    kind: 'pdf',
    parentPath: '/design/brand',
    size: 1_284_600,
    modifiedAt: '2026-08-19',
    owner: 'Ava Patel',
  },

  {
    name: 'dashboard-v3.fig',
    kind: 'document',
    parentPath: '/design/product',
    size: 8_940_200,
    modifiedAt: '2026-08-30',
    owner: 'Ava Patel',
  },
  {
    name: 'empty-states.png',
    kind: 'image',
    parentPath: '/design/product',
    size: 940_100,
    modifiedAt: '2026-08-24',
    owner: 'Ava Patel',
  },

  {
    name: 'runbooks',
    kind: 'folder',
    parentPath: '/engineering',
    modifiedAt: '2026-09-11',
    owner: 'Maya Chen',
  },
  {
    name: 'architecture.md',
    kind: 'document',
    parentPath: '/engineering',
    size: 42_180,
    modifiedAt: '2026-09-09',
    owner: 'Maya Chen',
  },
  {
    name: 'api-schema.json',
    kind: 'code',
    parentPath: '/engineering',
    size: 128_640,
    modifiedAt: '2026-09-10',
    owner: 'Noah Williams',
  },
  {
    name: 'release-2026-09.zip',
    kind: 'archive',
    parentPath: '/engineering',
    size: 64_218_900,
    modifiedAt: '2026-09-11',
    owner: 'Maya Chen',
  },

  {
    name: 'incident-response.md',
    kind: 'document',
    parentPath: '/engineering/runbooks',
    size: 18_940,
    modifiedAt: '2026-09-11',
    owner: 'Maya Chen',
  },
  {
    name: 'on-call.md',
    kind: 'document',
    parentPath: '/engineering/runbooks',
    size: 12_400,
    modifiedAt: '2026-07-30',
    owner: 'Noah Williams',
  },

  {
    name: 'msa-northwind.pdf',
    kind: 'pdf',
    parentPath: '/contracts',
    size: 2_284_000,
    modifiedAt: '2026-08-22',
    owner: 'Noah Williams',
  },
  {
    name: 'dpa-template.pdf',
    kind: 'pdf',
    parentPath: '/contracts',
    size: 812_400,
    modifiedAt: '2026-06-14',
    owner: 'Noah Williams',
  },
]

let nextId = 0
let nodes: FileNode[] = seed.map((entry) => ({
  id: `node-${(nextId += 1)}`,
  name: entry.name,
  kind: entry.kind,
  parentPath: entry.parentPath,
  size: entry.size ?? 0,
  modifiedAt: entry.modifiedAt,
  owner: entry.owner,
}))

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), LATENCY_MS))
}

function pathOf(node: FileNode): string {
  return joinPath(node.parentPath, node.name)
}

/** A folder reports the total of everything beneath it, however deep. */
function folderSize(node: FileNode): number {
  if (node.kind !== 'folder') return node.size

  const prefix = `${pathOf(node)}/`

  return nodes
    .filter((entry) => entry.parentPath === pathOf(node) || entry.parentPath.startsWith(prefix))
    .reduce((total, entry) => total + entry.size, 0)
}

export function listFolder(path: string): Promise<FolderContents> {
  const entries = nodes
    .filter((node) => node.parentPath === path)
    .map((node) => ({ ...node, size: folderSize(node) }))
    // Folders first, then by name, the way every file manager orders a listing.
    .sort((left, right) => {
      if (left.kind !== right.kind && (left.kind === 'folder' || right.kind === 'folder')) {
        return left.kind === 'folder' ? -1 : 1
      }
      return left.name.localeCompare(right.name)
    })

  return delay({ path, entries })
}

export function getFolderTree(): Promise<FolderTreeNode[]> {
  const build = (parentPath: string): FolderTreeNode[] =>
    nodes
      .filter((node) => node.kind === 'folder' && node.parentPath === parentPath)
      .sort((left, right) => left.name.localeCompare(right.name))
      .map((node) => ({
        path: pathOf(node),
        name: node.name,
        children: build(pathOf(node)),
      }))

  return delay(build(ROOT_PATH))
}

export class DuplicateNameError extends Error {
  constructor(name: string) {
    super(`A file named "${name}" already exists here`)
    this.name = 'DuplicateNameError'
  }
}

/**
 * Declared `async` throughout below so a rejected name arrives as a rejected promise.
 * A function typed `Promise<T>` that throws synchronously forces every caller to write
 * both a try/catch and a `.catch`.
 */
function assertNameIsFree(parentPath: string, name: string, exceptId?: string) {
  const taken = nodes.some(
    (node) => node.parentPath === parentPath && node.name === name && node.id !== exceptId,
  )

  if (taken) {
    throw new DuplicateNameError(name)
  }
}

export async function createFolder(parentPath: string, name: string): Promise<FileNode> {
  assertNameIsFree(parentPath, name)

  const folder: FileNode = {
    id: `node-${(nextId += 1)}`,
    name,
    kind: 'folder',
    parentPath,
    size: 0,
    modifiedAt: new Date().toISOString().slice(0, 10),
    owner: 'You',
  }
  nodes = [...nodes, folder]

  return delay(folder)
}

export async function uploadFile(
  parentPath: string,
  name: string,
  size: number,
): Promise<FileNode> {
  assertNameIsFree(parentPath, name)

  const extension = name.split('.').pop()?.toLowerCase() ?? ''
  const kindByExtension: Record<string, FileKind> = {
    pdf: 'pdf',
    png: 'image',
    jpg: 'image',
    jpeg: 'image',
    svg: 'image',
    gif: 'image',
    zip: 'archive',
    gz: 'archive',
    json: 'code',
    ts: 'code',
    tsx: 'code',
    js: 'code',
  }

  const file: FileNode = {
    id: `node-${(nextId += 1)}`,
    name,
    kind: kindByExtension[extension] ?? 'document',
    parentPath,
    size,
    modifiedAt: new Date().toISOString().slice(0, 10),
    owner: 'You',
  }
  nodes = [...nodes, file]

  return delay(file)
}

export async function renameNode(id: string, name: string): Promise<FileNode> {
  const node = nodes.find((entry) => entry.id === id)

  if (!node) {
    throw new Error(`Unknown file ${id}`)
  }

  assertNameIsFree(node.parentPath, name, id)

  const previousPath = pathOf(node)
  const renamed = { ...node, name }
  const nextPath = pathOf(renamed)

  // Renaming a folder moves everything under it, so descendants need their stored
  // parent path rewritten too.
  nodes = nodes.map((entry) => {
    if (entry.id === id) return renamed
    if (entry.parentPath === previousPath) return { ...entry, parentPath: nextPath }
    if (entry.parentPath.startsWith(`${previousPath}/`)) {
      return { ...entry, parentPath: entry.parentPath.replace(previousPath, nextPath) }
    }
    return entry
  })

  return delay(renamed)
}

export function deleteNodes(ids: string[]): Promise<string[]> {
  const removedPaths = nodes.filter((node) => ids.includes(node.id)).map(pathOf)

  nodes = nodes.filter(
    (node) =>
      !ids.includes(node.id) &&
      !removedPaths.some(
        (path) => node.parentPath === path || node.parentPath.startsWith(`${path}/`),
      ),
  )

  return delay(ids)
}

/** The deepest existing folder on the way to `path`, so a stale link still lands somewhere. */
export function resolveExistingPath(path: string): string {
  const trail = [ROOT_PATH, ...ancestorPaths(path)]
  const exists = (candidate: string) =>
    candidate === ROOT_PATH ||
    nodes.some((node) => node.kind === 'folder' && pathOf(node) === candidate)

  return trail.filter(exists).at(-1) ?? ROOT_PATH
}

export { pathName }
