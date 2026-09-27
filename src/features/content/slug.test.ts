import { describe, expect, it } from 'vitest'
import { SLUG_PATTERN, slugify } from '@/features/content/slug'

describe('slugify', () => {
  it('keeps Turkish letters readable instead of dropping them', () => {
    expect(slugify('İstanbul’da Işık Şöleni: Güz Çağrısı')).toBe(
      'istanbul-da-isik-soleni-guz-cagrisi',
    )
  })

  it('collapses punctuation and trims hyphens', () => {
    expect(slugify('  --Hello,   World!!  2026-- ')).toBe('hello-world-2026')
    expect(SLUG_PATTERN.test(slugify('Açık Gün — Demo Night'))).toBe(true)
  })

  it('returns an empty slug for a headline without letters or digits', () => {
    expect(slugify('— … —')).toBe('')
  })
})
