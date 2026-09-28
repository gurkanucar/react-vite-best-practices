import { EnvironmentOutlined } from '@ant-design/icons'
import { Button, Result, Segmented, Typography } from 'antd'
import { useState, type CSSProperties } from 'react'
import { useNavigate, useParams } from 'react-router'
import { ArticleCard, AuthorAvatar, TopicTag } from '@/features/showcases/components/MagazineBits'
import { MagazineSiteShell } from '@/features/showcases/components/MagazineSiteShell'
import {
  articlesByAuthor,
  authorStats,
  findAuthor,
  findTopic,
  formatViews,
  magazineRoot,
  sortArticles,
  type ArticleSort,
  type Author,
} from '@/features/showcases/data/magazine'
import { useMagazineCopy } from '@/features/showcases/hooks/useMagazineStore'

const SORTS: ArticleSort[] = ['newest', 'popular', 'shortest']

function AuthorView({ author, root }: { author: Author; root: string }) {
  const { text, language } = useMagazineCopy()
  const [sort, setSort] = useState<ArticleSort>('newest')
  const stats = authorStats(author.id, language)
  const list = sortArticles(articlesByAuthor(author.id), sort, language)
  const figures = [
    { label: text.author.stats.articles, value: String(stats.articles) },
    { label: text.author.stats.minutes, value: String(stats.minutes) },
    { label: text.author.stats.views, value: formatViews(stats.views, language) },
    { label: text.author.stats.topics, value: String(stats.topics.length) },
  ]

  return (
    <>
      <section
        className="mag-author-hero"
        style={{ '--mag-accent': author.color } as CSSProperties}
      >
        <div className="mag-wrap mag-author-hero__inner">
          <AuthorAvatar author={author} size={112} />
          <div className="mag-author-hero__copy">
            <Typography.Text className="mag-eyebrow">{author.role[language]}</Typography.Text>
            <h1>{author.name}</h1>
            <p>{author.bio[language]}</p>
            <div className="mag-author-hero__facts">
              <span>
                <EnvironmentOutlined aria-hidden="true" /> {author.city}
              </span>
              <span>{text.author.since(author.since)}</span>
            </div>
            <div className="mag-author-hero__topics">
              {stats.topics.map((id) => {
                const topic = findTopic(id)
                return topic ? <TopicTag key={id} topic={topic} root={root} /> : null
              })}
            </div>
          </div>
        </div>
        <dl className="mag-wrap mag-stats">
          {figures.map((figure) => (
            <div key={figure.label}>
              <dt>{figure.label}</dt>
              <dd>{figure.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mag-section mag-wrap">
        <div className="mag-section-title">
          <Typography.Title level={2}>{text.author.articles}</Typography.Title>
          <Segmented
            value={sort}
            options={SORTS.map((value) => ({ value, label: text.topic.sorts[value] }))}
            onChange={setSort}
          />
        </div>
        <div className="mag-grid">
          {list.map((article) => (
            <ArticleCard key={article.slug} article={article} root={root} />
          ))}
        </div>
      </section>
    </>
  )
}

export function MagazineAuthorPage({ standalone = false }: { standalone?: boolean }) {
  const { text } = useMagazineCopy()
  const navigate = useNavigate()
  const { authorId } = useParams()
  const author = findAuthor(authorId)
  const root = magazineRoot(standalone)

  return (
    <MagazineSiteShell standalone={standalone}>
      {author ? (
        <AuthorView key={author.id} author={author} root={root} />
      ) : (
        <Result
          status="404"
          title={text.author.notFound}
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
