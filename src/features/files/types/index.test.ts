import { describe, expect, it } from 'vitest'
import { ancestorPaths, joinPath, pathName, ROOT_PATH } from '@/features/files/types'

describe('path helpers', () => {
  it('expands a path into the breadcrumb trail above it', () => {
    expect(ancestorPaths('/design/brand')).toEqual(['/design', '/design/brand'])
    expect(ancestorPaths(ROOT_PATH)).toEqual([])
  })

  it('joins without doubling the root slash', () => {
    expect(joinPath(ROOT_PATH, 'design')).toBe('/design')
    expect(joinPath('/design', 'brand')).toBe('/design/brand')
  })

  it('reads the last segment as the folder name', () => {
    expect(pathName('/design/brand')).toBe('brand')
    expect(pathName(ROOT_PATH)).toBe('')
  })
})
