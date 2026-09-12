import { describe, expect, it } from 'vitest'
import { sectionKeyFor, type NavigationSection } from '@/router/navigation'

const sections: NavigationSection[] = [
  {
    key: 'showcases',
    icon: null,
    label: 'Landing pages',
    children: [{ key: '/showcases/corporate/news', icon: null, label: 'News' }],
  },
]

describe('sectionKeyFor', () => {
  it('keeps the parent menu open on a nested detail route', () => {
    expect(sectionKeyFor(sections, '/showcases/corporate/news/story-slug')).toBe('showcases')
  })

  it('does not match an unrelated route with the same prefix text', () => {
    expect(sectionKeyFor(sections, '/showcases/corporate/newsroom')).toBeUndefined()
  })
})
