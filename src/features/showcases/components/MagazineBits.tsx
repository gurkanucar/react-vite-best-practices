import { BookFilled, BookOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { Button, Progress, Tooltip, Typography } from 'antd'
import type { CSSProperties, ReactNode } from 'react'
import { Link } from 'react-router'
import { MagazineCover } from '@/features/showcases/components/MagazineArt'
import {
  findAuthor,
  findTopic,
  formatDate,
  readingMinutes,
  type Article,
  type Author,
  type Topic,
} from '@/features/showcases/data/magazine'
import {
  useIsBookmarked,
  useMagazineCopy,
  useMagazineStore,
} from '@/features/showcases/hooks/useMagazineStore'

export function TopicTag({
  topic,
  root,
  link = true,
}: {
  topic: Topic
  root: string
  link?: boolean
}) {
  const { language } = useMagazineCopy()
  const style = { '--mag-topic': topic.color } as CSSProperties
  return link ? (
    <Link className="mag-topic-tag" style={style} to={`${root}/topics/${topic.id}`}>
      {topic.name[language]}
    </Link>
  ) : (
    <span className="mag-topic-tag" style={style}>
      {topic.name[language]}
    </span>
  )
}

/** Initials in a coloured square with rounded corners, the same width as height. */
export function AuthorAvatar({ author, size = 40 }: { author: Author; size?: number }) {
  const initials = author.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
  return (
    <span
      className="mag-avatar"
      aria-hidden="true"
      style={
        {
          '--mag-avatar': author.color,
          width: size,
          height: size,
          fontSize: size * 0.38,
        } as CSSProperties
      }
    >
      {initials}
    </span>
  )
}

export function BookmarkButton({
  article,
  withLabel = false,
  size = 'middle',
}: {
  article: Article
  withLabel?: boolean
  size?: 'small' | 'middle' | 'large'
}) {
  const { text, language } = useMagazineCopy()
  const saved = useIsBookmarked(article.slug)
  const toggle = useMagazineStore((state) => state.toggleBookmark)
  const title = article.title[language]
  const label = saved ? text.common.unbookmark(title) : text.common.bookmark(title)
  const button = (
    <Button
      className={`mag-bookmark${saved ? ' is-saved' : ''}${withLabel ? '' : ' mag-bookmark--icon'}`}
      size={size}
      aria-label={label}
      aria-pressed={saved}
      icon={saved ? <BookFilled /> : <BookOutlined />}
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        toggle(article.slug)
      }}
    >
      {withLabel ? (saved ? text.common.saved : text.common.save) : null}
    </Button>
  )
  return withLabel ? button : <Tooltip title={label}>{button}</Tooltip>
}

/** "Author · date · 4 min read", the line under every title. */
export function ArticleMeta({
  article,
  root,
  showAuthor = true,
}: {
  article: Article
  root: string
  showAuthor?: boolean
}) {
  const { text, language } = useMagazineCopy()
  const author = findAuthor(article.authorId)
  return (
    <div className="mag-meta">
      {showAuthor && author && (
        <Link className="mag-meta__author" to={`${root}/authors/${author.id}`}>
          {author.name}
        </Link>
      )}
      <time dateTime={article.published}>{formatDate(article.published, language)}</time>
      <span className="mag-meta__time">
        <ClockCircleOutlined aria-hidden="true" />{' '}
        {text.common.minutes(readingMinutes(article, language))}
      </span>
    </div>
  )
}

/** How far the reader got, if they have started this article. */
export function ReadingState({ slug }: { slug: string }) {
  const { text } = useMagazineCopy()
  const record = useMagazineStore((state) => state.history[slug])
  if (!record) return null
  const percent = Math.round(record.progress * 100)
  return (
    <div className="mag-reading-state">
      <Progress
        percent={record.finished ? 100 : percent}
        size="small"
        showInfo={false}
        strokeColor="var(--mag-accent)"
        aria-label={record.finished ? text.common.finished : text.common.progress(percent)}
      />
      <Typography.Text type="secondary">
        {record.finished ? text.common.finished : text.common.progress(percent)}
      </Typography.Text>
    </div>
  )
}

/**
 * An article in a list. The title is the link and its hit area stretches over the card; the
 * bookmark and the topic sit above it and stay clickable.
 */
export function ArticleCard({
  article,
  root,
  variant = 'card',
  headingLevel = 3,
}: {
  article: Article
  root: string
  variant?: 'card' | 'row'
  headingLevel?: 2 | 3 | 4
}) {
  const { language } = useMagazineCopy()
  const topic = findTopic(article.topic)
  if (!topic) return null
  const Heading = `h${headingLevel}` as 'h2' | 'h3' | 'h4'
  return (
    <article className={`mag-card mag-card--${variant}`}>
      <div className="mag-card__media">
        <MagazineCover slug={article.slug} pattern={article.cover} color={topic.color} />
        <div className="mag-card__save">
          <BookmarkButton article={article} size="small" />
        </div>
      </div>
      <div className="mag-card__body">
        <TopicTag topic={topic} root={root} />
        <Heading className="mag-card__title">
          <Link className="mag-card__link" to={`${root}/articles/${article.slug}`}>
            {article.title[language]}
          </Link>
        </Heading>
        <p className="mag-card__dek">{article.dek[language]}</p>
        <ArticleMeta article={article} root={root} />
        <ReadingState slug={article.slug} />
      </div>
    </article>
  )
}

export function SectionTitle({
  id,
  title,
  intro,
  extra,
}: {
  id?: string
  title: string
  intro?: string
  extra?: ReactNode
}) {
  return (
    <div className="mag-section-title" id={id}>
      <div>
        <Typography.Title level={2}>{title}</Typography.Title>
        {intro && <Typography.Text type="secondary">{intro}</Typography.Text>}
      </div>
      {extra}
    </div>
  )
}
