import {
  ArrowUpOutlined,
  EyeOutlined,
  LinkOutlined,
  MailOutlined,
  ReadOutlined,
  ShareAltOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons'
import { Alert, App, Breadcrumb, Button, Collapse, Dropdown, Grid, Result, Typography } from 'antd'
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router'
import { MagazineCover } from '@/features/showcases/components/MagazineArt'
import { MagazineArticleBody } from '@/features/showcases/components/MagazineArticleBody'
import {
  ArticleCard,
  AuthorAvatar,
  BookmarkButton,
  TopicTag,
} from '@/features/showcases/components/MagazineBits'
import {
  MagazineReadingMode,
  MagazineToc,
  ReadingProgressBar,
} from '@/features/showcases/components/MagazineReading'
import {
  scrollToProgress,
  useReadingPosition,
  useRecordProgress,
} from '@/features/showcases/hooks/useMagazineReading'
import { MagazineSiteShell } from '@/features/showcases/components/MagazineSiteShell'
import {
  FINISHED_AT,
  STARTED_AT,
  findArticle,
  findAuthor,
  findTopic,
  formatDate,
  formatViews,
  magazineRoot,
  readingMinutes,
  relatedArticles,
  tableOfContents,
  type Article,
} from '@/features/showcases/data/magazine'
import { useMagazineCopy, useMagazineStore } from '@/features/showcases/hooks/useMagazineStore'

function ShareMenu({ article }: { article: Article }) {
  const { text, language } = useMagazineCopy()
  const { message } = App.useApp()
  // Always share the standalone address: the admin one needs a login.
  const url = `${window.location.origin}${magazineRoot(true)}/articles/${article.slug}`
  const title = article.title[language]
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      void message.success(text.article.copied)
    } catch {
      void message.error(text.article.copyFailed)
    }
  }
  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function'
  return (
    <Dropdown
      trigger={['click']}
      menu={{
        items: [
          ...(canShare
            ? [{ key: 'native', icon: <ShareAltOutlined />, label: text.article.share }]
            : []),
          { key: 'copy', icon: <LinkOutlined />, label: text.article.copyLink },
          {
            key: 'email',
            icon: <MailOutlined />,
            label: (
              <a
                href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`}
              >
                {text.article.email}
              </a>
            ),
          },
        ],
        onClick: ({ key }) => {
          if (key === 'copy') void copy()
          if (key === 'native') void navigator.share({ title, url }).catch(() => undefined)
        },
      }}
    >
      <Button icon={<ShareAltOutlined />}>{text.article.share}</Button>
    </Dropdown>
  )
}

function ArticleView({ article, standalone }: { article: Article; standalone: boolean }) {
  const { text, language } = useMagazineCopy()
  const root = magazineRoot(standalone)
  const isDesktop = Grid.useBreakpoint().lg ?? false
  const [params, setParams] = useSearchParams()
  const bodyRef = useRef<HTMLDivElement>(null)
  const topic = findTopic(article.topic)
  const author = findAuthor(article.authorId)
  const toc = useMemo(() => tableOfContents(article, language), [article, language])
  const headingIds = useMemo(() => toc.map((entry) => entry.id), [toc])
  const minutes = readingMinutes(article, language)
  const related = relatedArticles(article)
  const reading = params.get('mode') === 'read'
  // Read once on arrival: the stored progress moves as soon as the reader scrolls. An article
  // already finished is not offered again.
  const [arrivedAt] = useState(() => {
    const record = useMagazineStore.getState().history[article.slug]
    return record && !record.finished ? record.progress : 0
  })
  const [resumeHidden, setResumeHidden] = useState(false)
  const resumable = arrivedAt >= STARTED_AT && arrivedAt < FINISHED_AT

  const { progress, active } = useReadingPosition(bodyRef, null, headingIds, language)
  useRecordProgress(article.slug, progress, !reading)

  const resume = useCallback(() => scrollToProgress(bodyRef.current, arrivedAt), [arrivedAt])

  // "Continue reading" links carry ?resume=1. Wait for the global scroll reset to finish.
  useEffect(() => {
    if (params.get('resume') !== '1' || !resumable) return
    const timer = window.setTimeout(() => {
      setResumeHidden(true)
      resume()
    }, 150)
    return () => window.clearTimeout(timer)
  }, [params, resumable, resume])

  const setReading = (open: boolean) => {
    const next = new URLSearchParams(params)
    next.delete('resume')
    if (open) next.set('mode', 'read')
    else next.delete('mode')
    setParams(next, { replace: true, preventScrollReset: true })
  }

  const closeReader = (readerProgress: number) => {
    setReading(false)
    // Return to the page where the reader stopped in reading mode.
    window.requestAnimationFrame(() => scrollToProgress(bodyRef.current, readerProgress))
  }

  const style = { '--mag-accent': topic?.color } as CSSProperties
  const contents = <MagazineToc entries={toc} active={active} />

  return (
    <div className="mag-article" style={style}>
      <ReadingProgressBar progress={progress} />

      <header className="mag-article__head mag-wrap">
        <Breadcrumb
          items={[
            { title: <Link to={root}>{text.common.backHome}</Link> },
            ...(topic
              ? [{ title: <Link to={`${root}/topics/${topic.id}`}>{topic.name[language]}</Link> }]
              : []),
          ]}
        />
        {topic && <TopicTag topic={topic} root={root} />}
        <h1 className="mag-article__title">{article.title[language]}</h1>
        <p className="mag-article__dek">{article.dek[language]}</p>
        <div className="mag-article__byline">
          {author && (
            <Link to={`${root}/authors/${author.id}`} className="mag-article__author">
              <AuthorAvatar author={author} size={44} />
              <span>
                <strong>{author.name}</strong>
                <span>{author.role[language]}</span>
              </span>
            </Link>
          )}
          <div className="mag-article__facts">
            <time dateTime={article.published}>
              {text.article.published(formatDate(article.published, language))}
            </time>
            <span>{text.common.minutes(minutes)}</span>
            <span>
              <EyeOutlined aria-hidden="true" />{' '}
              {text.common.views(formatViews(article.views, language))}
            </span>
          </div>
        </div>
        <div className="mag-article__actions">
          <Button type="primary" icon={<ReadOutlined />} onClick={() => setReading(true)}>
            {text.article.readingMode}
          </Button>
          <BookmarkButton article={article} withLabel />
          <ShareMenu article={article} />
        </div>
      </header>

      {topic && (
        <div className="mag-wrap mag-article__cover">
          <MagazineCover slug={article.slug} pattern={article.cover} color={topic.color} />
        </div>
      )}

      <div className="mag-wrap mag-article__layout">
        <div className="mag-article__main">
          {resumable && !resumeHidden && (
            <Alert
              className="mag-article__resume"
              type="info"
              showIcon
              closable
              onClose={() => setResumeHidden(true)}
              title={text.article.resumeTitle(Math.round(arrivedAt * 100))}
              action={
                <Button
                  size="small"
                  type="primary"
                  onClick={() => {
                    setResumeHidden(true)
                    resume()
                  }}
                >
                  {text.article.resume}
                </Button>
              }
            />
          )}
          {!isDesktop && toc.length > 0 && (
            <Collapse
              className="mag-article__toc-mobile"
              items={[
                {
                  key: 'toc',
                  label: (
                    <span>
                      <UnorderedListOutlined aria-hidden="true" /> {text.article.contents}
                    </span>
                  ),
                  children: contents,
                },
              ]}
            />
          )}
          <div ref={bodyRef}>
            <MagazineArticleBody article={article} />
          </div>

          {author && (
            <section className="mag-author-card" aria-label={text.article.aboutAuthor}>
              <AuthorAvatar author={author} size={64} />
              <div>
                <Typography.Text type="secondary">{text.article.aboutAuthor}</Typography.Text>
                <Typography.Title level={3}>{author.name}</Typography.Title>
                <Typography.Paragraph>{author.bio[language]}</Typography.Paragraph>
                <Link to={`${root}/authors/${author.id}`}>{text.article.moreByAuthor}</Link>
              </div>
            </section>
          )}
        </div>

        {isDesktop && (
          <aside className="mag-article__rail">
            <div className="mag-rail">
              {toc.length > 0 && (
                <>
                  <Typography.Text strong className="mag-rail__title">
                    {text.article.contents}
                  </Typography.Text>
                  {contents}
                </>
              )}
              <div className="mag-rail__progress">
                <span>{text.common.progress(Math.round(progress * 100))}</span>
                <span>{text.reader.left(Math.ceil(minutes * (1 - progress)))}</span>
              </div>
              <div className="mag-rail__actions">
                <Button icon={<ReadOutlined />} onClick={() => setReading(true)}>
                  {text.article.readingMode}
                </Button>
                <Button
                  type="text"
                  icon={<ArrowUpOutlined />}
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  {text.article.top}
                </Button>
              </div>
            </div>
          </aside>
        )}
      </div>

      <section className="mag-section mag-wrap">
        <div className="mag-section-title">
          <Typography.Title level={2}>{text.article.related}</Typography.Title>
        </div>
        <div className="mag-grid">
          {related.map((item) => (
            <ArticleCard key={item.slug} article={item} root={root} />
          ))}
        </div>
      </section>

      {reading && (
        <MagazineReadingMode article={article} initialProgress={progress} onClose={closeReader} />
      )}
    </div>
  )
}

export function MagazineArticlePage({ standalone = false }: { standalone?: boolean }) {
  const { text } = useMagazineCopy()
  const navigate = useNavigate()
  const { articleSlug } = useParams()
  const article = findArticle(articleSlug)
  const root = magazineRoot(standalone)

  return (
    <MagazineSiteShell standalone={standalone}>
      {article ? (
        // A new article starts with fresh state: arrival progress, reading mode, measurements.
        <ArticleView key={article.slug} article={article} standalone={standalone} />
      ) : (
        <Result
          status="404"
          title={text.article.notFound}
          extra={
            <Button type="primary" onClick={() => navigate(root)}>
              {text.common.backHome}
            </Button>
          }
        />
      )}
    </MagazineSiteShell>
  )
}
