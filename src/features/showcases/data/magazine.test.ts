import { beforeEach, describe, expect, it } from 'vitest'
import {
  FINISHED_AT,
  WORDS_PER_MINUTE,
  activeHeading,
  articles,
  articlesByAuthor,
  authorStats,
  authors,
  emptyArticleFilters,
  filterArticles,
  filtersFromParams,
  filtersToParams,
  findArticle,
  foldText,
  mostRead,
  offsetForProgress,
  progressFromRect,
  readingMinutes,
  relatedArticles,
  tableOfContents,
  topics,
  wordCount,
  type Article,
} from '@/features/showcases/data/magazine'
import { READER_SIZES, useMagazineStore } from '@/features/showcases/hooks/useMagazineStore'

const article = (slug: string) => {
  const found = findArticle(slug)
  if (!found) throw new Error(`missing ${slug}`)
  return found
}

describe('magazine catalogue', () => {
  it('has unique slugs, known topics and authors, and headings with unique ids', () => {
    expect(new Set(articles.map((item) => item.slug)).size).toBe(articles.length)
    for (const item of articles) {
      expect(topics.some((topic) => topic.id === item.topic)).toBe(true)
      expect(authors.some((author) => author.id === item.authorId)).toBe(true)
      const ids = tableOfContents(item, 'en').map((entry) => entry.id)
      expect(new Set(ids).size).toBe(ids.length)
      expect(ids.length).toBeGreaterThan(1)
    }
  })

  it('is written in both languages everywhere', () => {
    for (const item of articles) {
      for (const text of [item.title, item.dek]) {
        expect(text.en.trim()).not.toBe('')
        expect(text.tr.trim()).not.toBe('')
      }
      const untranslated = item.body.filter(
        (block) => 'text' in block && block.text.tr === block.text.en,
      )
      expect(untranslated).toEqual([])
    }
  })

  it('lists newest first and has exactly one cover story', () => {
    const dates = articles.map((item) => item.published)
    expect(dates).toEqual([...dates].sort().reverse())
    expect(articles.filter((item) => item.featured)).toHaveLength(1)
  })
})

describe('reading time', () => {
  const sample: Article = {
    slug: 'sample',
    topic: 'design',
    authorId: 'mira-coskun',
    title: { en: 'One two', tr: 'Bir iki' },
    dek: { en: 'three', tr: 'üç' },
    published: '2026-01-01',
    cover: 'dots',
    views: 1,
    body: [
      { type: 'p', text: { en: 'four five six', tr: 'dört beş' } },
      { type: 'code', language: 'ts', code: 'const words = "not counted at all"' },
      { type: 'list', items: [{ en: 'seven', tr: 'yedi' }] },
    ],
  }

  it('counts prose but not code', () => {
    expect(wordCount(sample, 'en')).toBe(7)
    expect(wordCount(sample, 'tr')).toBe(6)
  })

  it('rounds to whole minutes, never below one, and adds time for code and figures', () => {
    expect(readingMinutes(sample, 'en')).toBe(1)
    const long: Article = {
      ...sample,
      body: [
        { type: 'p', text: { en: 'word '.repeat(WORDS_PER_MINUTE.en * 3), tr: 'söz' } },
        { type: 'code', language: 'ts', code: '' },
        { type: 'code', language: 'ts', code: '' },
      ],
    }
    // Three minutes of words and two half-minute code blocks.
    expect(readingMinutes(long, 'en')).toBe(4)
  })

  it('gives every real article a sensible length', () => {
    for (const item of articles) {
      expect(readingMinutes(item, 'en')).toBeGreaterThanOrEqual(2)
      expect(readingMinutes(item, 'tr')).toBeGreaterThanOrEqual(2)
    }
  })
})

describe('lists', () => {
  it('ranks by views', () => {
    const top = mostRead(3)
    expect(top).toHaveLength(3)
    expect(top[0].views).toBeGreaterThanOrEqual(top[1].views)
    expect(top[0].slug).toBe('slow-train-to-kars')
  })

  it('suggests related reading from the same topic first, never the article itself', () => {
    const source = article('a-grid-is-a-promise')
    const related = relatedArticles(source)
    expect(related).toHaveLength(3)
    expect(related.map((item) => item.slug)).not.toContain(source.slug)
    expect(related.slice(0, 2).every((item) => item.topic === 'design')).toBe(true)
  })

  it('sums an author’s work', () => {
    const stats = authorStats('emre-tunali', 'en')
    expect(stats.articles).toBe(articlesByAuthor('emre-tunali').length)
    expect(stats.topics).toEqual(['science'])
    expect(stats.minutes).toBeGreaterThan(0)
  })
})

describe('topic filters', () => {
  it('round-trips through the address and drops unknown values', () => {
    const filters = {
      query: 'grid',
      sort: 'popular',
      length: 'quick',
      author: 'mira-coskun',
    } as const
    expect(filtersFromParams(filtersToParams(filters))).toEqual(filters)
    expect(filtersToParams(emptyArticleFilters).toString()).toBe('')
    expect(filtersFromParams(new URLSearchParams('sort=best&length=huge&author=nobody'))).toEqual(
      emptyArticleFilters,
    )
  })

  it('folds Turkish letters', () => {
    expect(foldText('Çay IŞIK Göz')).toBe('cay isik goz')
  })

  it('searches titles and authors in the reader’s language', () => {
    const design = articles.filter((item) => item.topic === 'design')
    const byTitle = filterArticles(design, { ...emptyArticleFilters, query: 'koyu tema' }, 'tr')
    expect(byTitle.map((item) => item.slug)).toEqual(['colour-that-survives-dark-mode'])
    const byAuthor = filterArticles(articles, { ...emptyArticleFilters, query: 'coskun' }, 'en')
    expect(byAuthor).toHaveLength(3)
  })

  it('sorts and splits by length', () => {
    const popular = filterArticles(articles, { ...emptyArticleFilters, sort: 'popular' }, 'en')
    expect(popular[0].slug).toBe('slow-train-to-kars')
    const quick = filterArticles(articles, { ...emptyArticleFilters, length: 'quick' }, 'en')
    const long = filterArticles(articles, { ...emptyArticleFilters, length: 'long' }, 'en')
    expect(quick.length + long.length).toBe(articles.length)
    expect(quick.length).toBeGreaterThan(0)
    expect(long.length).toBeGreaterThan(0)
  })
})

describe('reading position', () => {
  it('measures progress through the body and back', () => {
    expect(progressFromRect(100, 2000, 800)).toBe(0)
    expect(progressFromRect(-600, 2000, 800)).toBe(0.5)
    expect(progressFromRect(-5000, 2000, 800)).toBe(1)
    // A body shorter than the screen is read once its end is visible.
    expect(progressFromRect(100, 300, 800)).toBe(1)
    expect(offsetForProgress(0.5, 2000, 800)).toBe(600)
  })

  it('finds the heading the reader is in', () => {
    const headings = [
      { id: 'a', top: -400 },
      { id: 'b', top: 50 },
      { id: 'c', top: 700 },
    ]
    expect(activeHeading(headings, 96)).toBe('b')
    expect(activeHeading(headings, -500)).toBeUndefined()
  })
})

describe('magazine store', () => {
  beforeEach(() => useMagazineStore.getState().reset())

  it('toggles bookmarks, newest first', () => {
    const { toggleBookmark } = useMagazineStore.getState()
    toggleBookmark('a-grid-is-a-promise')
    toggleBookmark('slow-train-to-kars')
    expect(useMagazineStore.getState().bookmarks.map((item) => item.slug)).toEqual([
      'slow-train-to-kars',
      'a-grid-is-a-promise',
    ])
    toggleBookmark('slow-train-to-kars')
    expect(useMagazineStore.getState().bookmarks).toHaveLength(1)
  })

  it('records progress, remembers finishing and forgets on request', () => {
    const { recordProgress, forget } = useMagazineStore.getState()
    recordProgress('a-grid-is-a-promise', 0.4)
    expect(useMagazineStore.getState().history['a-grid-is-a-promise']).toMatchObject({
      progress: 0.4,
      finished: false,
    })
    recordProgress('a-grid-is-a-promise', FINISHED_AT)
    recordProgress('a-grid-is-a-promise', 0.2)
    expect(useMagazineStore.getState().history['a-grid-is-a-promise']).toMatchObject({
      progress: 0.2,
      finished: true,
    })
    forget('a-grid-is-a-promise')
    expect(useMagazineStore.getState().history).toEqual({})
  })

  it('keeps the reader’s text size within bounds', () => {
    const { setReader } = useMagazineStore.getState()
    setReader({ size: 99, theme: 'sepia' })
    expect(useMagazineStore.getState().reader).toMatchObject({
      size: READER_SIZES.max,
      theme: 'sepia',
    })
    setReader({ size: 2 })
    expect(useMagazineStore.getState().reader.size).toBe(READER_SIZES.min)
  })
})
