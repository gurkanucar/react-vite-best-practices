import { describe, expect, it } from 'vitest'
import { initialsOf } from '@/features/profile/types'

describe('initialsOf', () => {
  it('takes the first letter of the first two words', () => {
    expect(initialsOf('Jaydon Frankie')).toBe('JF')
    expect(initialsOf('Maya')).toBe('M')
    expect(initialsOf('Ana Maria de Souza')).toBe('AM')
  })
})
