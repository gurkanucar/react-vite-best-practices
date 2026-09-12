import { describe, expect, it } from 'vitest'
import {
  createFolder,
  deleteNodes,
  DuplicateNameError,
  listFolder,
  renameNode,
  resolveExistingPath,
} from '@/features/files/services/filesService'

const namesIn = async (path: string) => (await listFolder(path)).entries.map((entry) => entry.name)

// The service owns one in-memory store, so these run against the state left by the ones
// before them — in the order written, which is how the seed data is set up to be read.
describe('filesService', () => {
  it('lists folders before files, each group by name', async () => {
    expect(await namesIn('/design')).toEqual(['brand', 'product', 'moodboard.png'])
  })

  it('reports a folder size as the total of everything beneath it', async () => {
    const { entries } = await listFolder('/')
    const design = entries.find((entry) => entry.name === 'design')

    // Its own files plus both subfolders', not zero and not just its direct children.
    expect(design?.size).toBe(2_140_880 + 18_420 + 16_180 + 3_260 + 1_284_600 + 8_940_200 + 940_100)
  })

  it('refuses a name already taken in the same folder', async () => {
    await expect(createFolder('/design', 'brand')).rejects.toThrow(DuplicateNameError)
  })

  it('allows the same name in a different folder', async () => {
    const folder = await createFolder('/contracts', 'brand')

    expect(folder.parentPath).toBe('/contracts')
  })

  it('carries descendants along when a folder is renamed', async () => {
    await renameNode(
      (await listFolder('/design')).entries.find((entry) => entry.name === 'brand')!.id,
      'identity',
    )

    expect(await namesIn('/design')).toContain('identity')
    expect(await namesIn('/design/identity')).toContain('logo-primary.svg')
    expect(await namesIn('/design/brand')).toEqual([])
  })

  it('removes a whole subtree when a folder is deleted', async () => {
    const identity = (await listFolder('/design')).entries.find((e) => e.name === 'identity')!

    await deleteNodes([identity.id])

    expect(await namesIn('/design')).not.toContain('identity')
    expect(await namesIn('/design/identity')).toEqual([])
  })

  it('falls back to the deepest folder that still exists', () => {
    // A link kept after the folder was renamed should still land somewhere sensible.
    expect(resolveExistingPath('/design/identity/logos')).toBe('/design')
    expect(resolveExistingPath('/design/product')).toBe('/design/product')
    expect(resolveExistingPath('/nope')).toBe('/')
  })
})
