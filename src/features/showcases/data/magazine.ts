/**
 * The magazine's catalogue: topics, contributors and the articles they wrote. Everything is
 * static and invented; the reader's bookmarks, progress and reading settings live in
 * `useMagazineStore`.
 */
import dayjs from 'dayjs'
import { magazineArticlesCulture } from '@/features/showcases/data/magazineArticlesCulture'
import { magazineArticlesTech } from '@/features/showcases/data/magazineArticlesTech'

export const magazineBrand = 'Satır Arası'

export function magazineRoot(standalone: boolean) {
  return standalone ? '/preview/magazine' : '/showcases/magazine'
}

export interface Bilingual {
  en: string
  tr: string
}

export type MagazineLanguage = keyof Bilingual

export type TopicId = 'technology' | 'design' | 'science' | 'culture' | 'travel' | 'food'

export interface Topic {
  id: TopicId
  name: Bilingual
  description: Bilingual
  /** The topic's colour, used for its tag, its covers and its page. */
  color: string
}

export interface Author {
  id: string
  name: string
  role: Bilingual
  bio: Bilingual
  city: string
  /** The year they started writing for the magazine. */
  since: number
  color: string
}

/** The pictures an article can carry. Each one is drawn, so nothing loads or shifts. */
export type FigureArt =
  | 'skeleton'
  | 'sync'
  | 'keys'
  | 'grid'
  | 'contrast'
  | 'form'
  | 'bees'
  | 'twilight'
  | 'stone'
  | 'tape'
  | 'shelves'
  | 'rails'
  | 'arches'
  | 'starter'
  | 'cezve'

export type CoverPattern = 'rings' | 'stripes' | 'grid' | 'waves' | 'sun' | 'blocks' | 'dots'

export type Block =
  | { type: 'p'; text: Bilingual }
  | { type: 'h2'; id: string; text: Bilingual }
  | { type: 'h3'; id: string; text: Bilingual }
  | { type: 'quote'; text: Bilingual; cite?: Bilingual }
  | { type: 'list'; items: Bilingual[]; ordered?: boolean }
  | { type: 'code'; language: string; code: string; caption?: Bilingual }
  | { type: 'figure'; art: FigureArt; caption: Bilingual }
  | { type: 'note'; text: Bilingual }

export interface Article {
  slug: string
  topic: TopicId
  authorId: string
  title: Bilingual
  dek: Bilingual
  /** ISO date, `YYYY-MM-DD`. */
  published: string
  cover: CoverPattern
  /** Invented page views, for "most read". */
  views: number
  featured?: boolean
  editorsPick?: boolean
  body: Block[]
}

export const topics: Topic[] = [
  {
    id: 'technology',
    name: { en: 'Technology', tr: 'Teknoloji' },
    description: {
      en: 'Software, the web and the small decisions that make tools feel good to use.',
      tr: 'Yazılım, web ve araçları kullanması keyifli kılan küçük kararlar.',
    },
    color: '#3159d6',
  },
  {
    id: 'design',
    name: { en: 'Design', tr: 'Tasarım' },
    description: {
      en: 'Grids, colour, type and forms: how interfaces earn trust one detail at a time.',
      tr: 'Grid, renk, tipografi ve formlar: arayüzler güveni ayrıntı ayrıntı nasıl kazanır.',
    },
    color: '#c2410c',
  },
  {
    id: 'science',
    name: { en: 'Science', tr: 'Bilim' },
    description: {
      en: 'Everyday questions with careful answers, from bees to the colour of the dawn.',
      tr: 'Arılardan şafağın rengine, gündelik sorulara özenli yanıtlar.',
    },
    color: '#0f766e',
  },
  {
    id: 'culture',
    name: { en: 'Culture', tr: 'Kültür' },
    description: {
      en: 'The places, objects and habits that people keep choosing to share.',
      tr: 'İnsanların paylaşmayı seçmeye devam ettiği yerler, nesneler ve alışkanlıklar.',
    },
    color: '#7c3aed',
  },
  {
    id: 'travel',
    name: { en: 'Travel', tr: 'Seyahat' },
    description: {
      en: 'Slow journeys, stone towns and the pleasure of arriving late.',
      tr: 'Yavaş yolculuklar, taş şehirler ve geç varmanın keyfi.',
    },
    color: '#0369a1',
  },
  {
    id: 'food',
    name: { en: 'Food', tr: 'Yemek' },
    description: {
      en: 'Kitchens, rituals and the chemistry hiding in a loaf or a cup.',
      tr: 'Mutfaklar, ritüeller ve bir somunla bir fincanda saklı kimya.',
    },
    color: '#b45309',
  },
]

export const authors: Author[] = [
  {
    id: 'deniz-aksoy',
    name: 'Deniz Aksoy',
    role: { en: 'Technology editor', tr: 'Teknoloji editörü' },
    bio: {
      en: 'Deniz spent a decade building web apps before switching sides to write about them. Interested in the gap between how software works and how it feels.',
      tr: 'Deniz, üzerine yazmaya başlamadan önce on yıl boyunca web uygulamaları geliştirdi. Yazılımın nasıl çalıştığı ile nasıl hissettirdiği arasındaki boşlukla ilgileniyor.',
    },
    city: 'İzmir',
    since: 2021,
    color: '#3159d6',
  },
  {
    id: 'mira-coskun',
    name: 'Mira Coşkun',
    role: { en: 'Design writer', tr: 'Tasarım yazarı' },
    bio: {
      en: 'Mira is a product designer who writes about the unglamorous parts of design: forms, spacing, error messages and the rules that hold a page together.',
      tr: 'Mira, tasarımın gösterişsiz taraflarını yazan bir ürün tasarımcısı: formlar, boşluklar, hata mesajları ve bir sayfayı bir arada tutan kurallar.',
    },
    city: 'İstanbul',
    since: 2022,
    color: '#c2410c',
  },
  {
    id: 'emre-tunali',
    name: 'Emre Tunalı',
    role: { en: 'Science correspondent', tr: 'Bilim muhabiri' },
    bio: {
      en: 'Emre trained as a physicist and still carries a notebook of questions nobody asked. He writes about research you can check for yourself.',
      tr: 'Emre fizik eğitimi aldı ve hâlâ kimsenin sormadığı sorularla dolu bir defter taşıyor. Kendi başınıza doğrulayabileceğiniz araştırmaları yazıyor.',
    },
    city: 'Ankara',
    since: 2020,
    color: '#0f766e',
  },
  {
    id: 'selin-varol',
    name: 'Selin Varol',
    role: { en: 'Culture editor', tr: 'Kültür editörü' },
    bio: {
      en: 'Selin writes about the ways people gather, from record shops to reading rooms. She keeps a very large collection of tickets she cannot throw away.',
      tr: 'Selin, plakçılardan okuma salonlarına, insanların bir araya gelme biçimlerini yazıyor. Atmaya kıyamadığı çok büyük bir bilet koleksiyonu var.',
    },
    city: 'Eskişehir',
    since: 2021,
    color: '#7c3aed',
  },
  {
    id: 'kaan-erdem',
    name: 'Kaan Erdem',
    role: { en: 'Travel writer', tr: 'Seyahat yazarı' },
    bio: {
      en: 'Kaan prefers trains to planes and towns to cities. He writes slowly, on purpose, and usually from a window seat.',
      tr: 'Kaan uçak yerine treni, büyük şehir yerine kasabayı seçiyor. Bilerek yavaş yazıyor, genellikle de cam kenarından.',
    },
    city: 'Trabzon',
    since: 2023,
    color: '#0369a1',
  },
  {
    id: 'ayla-demirci',
    name: 'Ayla Demirci',
    role: { en: 'Food writer', tr: 'Yemek yazarı' },
    bio: {
      en: 'Ayla cooked in restaurant kitchens for eight years. She now writes about why recipes work, and what to do when they do not.',
      tr: 'Ayla sekiz yıl restoran mutfaklarında çalıştı. Artık tariflerin neden işe yaradığını ve yaramadığında ne yapılacağını yazıyor.',
    },
    city: 'Gaziantep',
    since: 2022,
    color: '#b45309',
  },
]

export const articles: Article[] = [...magazineArticlesTech, ...magazineArticlesCulture].sort(
  (a, b) => b.published.localeCompare(a.published),
)

export function findArticle(slug: string | undefined) {
  return articles.find((article) => article.slug === slug)
}

export function findAuthor(id: string | undefined) {
  return authors.find((author) => author.id === id)
}

export function findTopic(id: string | undefined) {
  return topics.find((topic) => topic.id === id)
}

export function isTopicId(value: string | null | undefined): value is TopicId {
  return topics.some((topic) => topic.id === value)
}

// ------------------------------------------------------------------ reading time

/**
 * Words per minute for an unhurried read. Turkish packs more meaning into each (longer) word,
 * so the same text has fewer of them and they are read more slowly.
 */
export const WORDS_PER_MINUTE: Record<MagazineLanguage, number> = { en: 200, tr: 160 }

const countWords = (text: string) => text.split(/\s+/).filter(Boolean).length

/** The words a reader actually reads: prose, headings, quotes and lists, not code. */
export function wordCount(article: Article, language: MagazineLanguage): number {
  let words = countWords(article.title[language]) + countWords(article.dek[language])
  for (const block of article.body) {
    switch (block.type) {
      case 'p':
      case 'h2':
      case 'h3':
      case 'note':
        words += countWords(block.text[language])
        break
      case 'quote':
        words += countWords(block.text[language])
        break
      case 'list':
        for (const item of block.items) words += countWords(item[language])
        break
      case 'figure':
        words += countWords(block.caption[language])
        break
      case 'code':
        break
    }
  }
  return words
}

/**
 * Whole minutes, never less than one. A code block adds half a minute to look at, a figure
 * twelve seconds.
 */
export function readingMinutes(article: Article, language: MagazineLanguage): number {
  const codeBlocks = article.body.filter((block) => block.type === 'code').length
  const figures = article.body.filter((block) => block.type === 'figure').length
  const minutes =
    wordCount(article, language) / WORDS_PER_MINUTE[language] + codeBlocks * 0.5 + figures * 0.2
  return Math.max(1, Math.round(minutes))
}

export interface TocEntry {
  id: string
  level: 2 | 3
  text: string
}

export function tableOfContents(article: Article, language: MagazineLanguage): TocEntry[] {
  return article.body.flatMap((block) =>
    block.type === 'h2' || block.type === 'h3'
      ? [{ id: block.id, level: block.type === 'h2' ? 2 : 3, text: block.text[language] }]
      : [],
  )
}

// ------------------------------------------------------------------ lists

export function articlesByTopic(topic: TopicId) {
  return articles.filter((article) => article.topic === topic)
}

export function articlesByAuthor(authorId: string) {
  return articles.filter((article) => article.authorId === authorId)
}

export const featuredArticle = articles.find((article) => article.featured) ?? articles[0]

export const editorsPicks = articles.filter((article) => article.editorsPick)

export function mostRead(limit = 5) {
  return [...articles].sort((a, b) => b.views - a.views).slice(0, limit)
}

/**
 * Articles to read next: the same topic first, then the same author, then the newest. Never
 * the article itself and never twice.
 */
export function relatedArticles(article: Article, limit = 3): Article[] {
  const score = (other: Article) =>
    (other.topic === article.topic ? 2 : 0) + (other.authorId === article.authorId ? 1 : 0)
  return articles
    .filter((other) => other.slug !== article.slug)
    .map((other, index) => ({ other, index, score: score(other) }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, limit)
    .map(({ other }) => other)
}

export interface AuthorStats {
  articles: number
  minutes: number
  views: number
  topics: TopicId[]
}

export function authorStats(authorId: string, language: MagazineLanguage): AuthorStats {
  const own = articlesByAuthor(authorId)
  return {
    articles: own.length,
    minutes: own.reduce((sum, article) => sum + readingMinutes(article, language), 0),
    views: own.reduce((sum, article) => sum + article.views, 0),
    topics: [...new Set(own.map((article) => article.topic))],
  }
}

// ------------------------------------------------------------------ topic page filters

export type ArticleSort = 'newest' | 'oldest' | 'popular' | 'shortest'
export type ArticleLength = 'any' | 'quick' | 'long'

export const ARTICLE_SORTS: ArticleSort[] = ['newest', 'popular', 'shortest', 'oldest']
export const ARTICLE_LENGTHS: ArticleLength[] = ['any', 'quick', 'long']

/** A "quick read" is this many minutes or fewer. */
export const QUICK_READ_MINUTES = 2

export interface ArticleFilters {
  query: string
  sort: ArticleSort
  length: ArticleLength
  /** An author id, or empty for everyone. */
  author: string
}

export const emptyArticleFilters: ArticleFilters = {
  query: '',
  sort: 'newest',
  length: 'any',
  author: '',
}

/** Folds case and Turkish letters, so `cay` finds "Çay" and `ISIK` finds "ışık". */
export function foldText(value: string) {
  return value
    .toLocaleLowerCase('tr')
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ş/g, 's')
    .replace(/ü/g, 'u')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

export function filtersFromParams(params: URLSearchParams): ArticleFilters {
  const sort = params.get('sort') as ArticleSort | null
  const length = params.get('length') as ArticleLength | null
  const author = params.get('author') ?? ''
  return {
    query: params.get('q') ?? '',
    sort: sort && ARTICLE_SORTS.includes(sort) ? sort : 'newest',
    length: length && ARTICLE_LENGTHS.includes(length) ? length : 'any',
    author: findAuthor(author) ? author : '',
  }
}

export function filtersToParams(filters: ArticleFilters): URLSearchParams {
  const params = new URLSearchParams()
  if (filters.query) params.set('q', filters.query)
  if (filters.sort !== 'newest') params.set('sort', filters.sort)
  if (filters.length !== 'any') params.set('length', filters.length)
  if (filters.author) params.set('author', filters.author)
  return params
}

export function filterArticles(
  list: Article[],
  filters: ArticleFilters,
  language: MagazineLanguage,
): Article[] {
  const query = foldText(filters.query.trim())
  const matches = list.filter((article) => {
    if (filters.author && article.authorId !== filters.author) return false
    const minutes = readingMinutes(article, language)
    if (filters.length === 'quick' && minutes > QUICK_READ_MINUTES) return false
    if (filters.length === 'long' && minutes <= QUICK_READ_MINUTES) return false
    if (!query) return true
    const author = findAuthor(article.authorId)?.name ?? ''
    return foldText(`${article.title[language]} ${article.dek[language]} ${author}`).includes(query)
  })
  return sortArticles(matches, filters.sort, language)
}

export function sortArticles(list: Article[], sort: ArticleSort, language: MagazineLanguage) {
  const sorted = [...list]
  switch (sort) {
    case 'newest':
      return sorted.sort((a, b) => b.published.localeCompare(a.published))
    case 'oldest':
      return sorted.sort((a, b) => a.published.localeCompare(b.published))
    case 'popular':
      return sorted.sort((a, b) => b.views - a.views)
    case 'shortest':
      return sorted.sort(
        (a, b) =>
          readingMinutes(a, language) - readingMinutes(b, language) ||
          b.published.localeCompare(a.published),
      )
  }
}

// ------------------------------------------------------------------ reading progress

/**
 * How far through an article the reader is, from where its body sits in the viewport: 0 while
 * its top is still below the top edge, 1 once its end is on screen.
 */
export function progressFromRect(top: number, height: number, viewport: number): number {
  const travel = height - viewport
  if (travel <= 0) return top + height <= viewport ? 1 : 0
  return Math.min(1, Math.max(0, -top / travel))
}

/** The inverse: the offset from the body's top that shows a given progress. */
export function offsetForProgress(progress: number, height: number, viewport: number): number {
  return Math.max(0, Math.min(1, progress) * Math.max(0, height - viewport))
}

/** Progress below this is a glance; at or above `FINISHED_AT` the article counts as read. */
export const STARTED_AT = 0.04
export const FINISHED_AT = 0.95

/**
 * The heading the reader is in: the last one whose top has passed the reading line. Before the
 * first heading, none.
 */
export function activeHeading(
  headings: { id: string; top: number }[],
  line: number,
): string | undefined {
  let current: string | undefined
  for (const heading of headings) {
    if (heading.top - line <= 1) current = heading.id
    else break
  }
  return current
}

export function formatViews(views: number, language: MagazineLanguage) {
  return new Intl.NumberFormat(language === 'tr' ? 'tr-TR' : 'en-GB', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(views)
}

export function formatDate(
  value: string | number,
  language: MagazineLanguage,
  pattern = 'D MMM YYYY',
) {
  return dayjs(value).locale(language).format(pattern)
}
