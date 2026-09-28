import { SearchOutlined } from '@ant-design/icons'
import { Button, Empty, Input, Result, Select, Typography } from 'antd'
import type { CSSProperties } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router'
import { ArticleCard } from '@/features/showcases/components/MagazineBits'
import { MagazineSiteShell } from '@/features/showcases/components/MagazineSiteShell'
import {
  ARTICLE_LENGTHS,
  ARTICLE_SORTS,
  articlesByTopic,
  emptyArticleFilters,
  filterArticles,
  filtersFromParams,
  filtersToParams,
  findAuthor,
  findTopic,
  magazineRoot,
  topics,
  type ArticleFilters,
  type Topic,
} from '@/features/showcases/data/magazine'
import { useMagazineCopy } from '@/features/showcases/hooks/useMagazineStore'

function TopicView({ topic, root }: { topic: Topic; root: string }) {
  const { text, language } = useMagazineCopy()
  const [params, setParams] = useSearchParams()
  const filters = filtersFromParams(params)
  const all = articlesByTopic(topic.id)
  const shown = filterArticles(all, filters, language)
  const writers = [...new Set(all.map((article) => article.authorId))].flatMap((id) => {
    const author = findAuthor(id)
    return author ? [author] : []
  })
  const update = (change: Partial<ArticleFilters>) =>
    setParams(filtersToParams({ ...filters, ...change }), {
      replace: true,
      preventScrollReset: true,
    })
  const filtered = filters.query !== '' || filters.length !== 'any' || filters.author !== ''

  return (
    <>
      <section className="mag-topic-hero" style={{ '--mag-topic': topic.color } as CSSProperties}>
        <div className="mag-wrap">
          <nav className="mag-topic-hero__chips" aria-label={text.common.allTopics}>
            {topics.map((item) => (
              <Link
                key={item.id}
                to={`${root}/topics/${item.id}`}
                className={item.id === topic.id ? 'is-active' : undefined}
                aria-current={item.id === topic.id ? 'page' : undefined}
              >
                {item.name[language]}
              </Link>
            ))}
          </nav>
          <h1>{topic.name[language]}</h1>
          <p>{topic.description[language]}</p>
          <Typography.Text className="mag-topic-hero__count">
            {text.topic.count(all.length)}
          </Typography.Text>
        </div>
      </section>

      <section className="mag-section mag-wrap">
        <div className="mag-filters">
          <Input
            allowClear
            prefix={<SearchOutlined aria-hidden="true" />}
            placeholder={text.topic.search}
            aria-label={text.topic.search}
            value={filters.query}
            onChange={(event) => update({ query: event.target.value })}
          />
          <Select
            aria-label={text.topic.sort}
            value={filters.sort}
            options={ARTICLE_SORTS.map((sort) => ({ value: sort, label: text.topic.sorts[sort] }))}
            onChange={(sort) => update({ sort })}
          />
          <Select
            aria-label={text.topic.length}
            value={filters.length}
            options={ARTICLE_LENGTHS.map((length) => ({
              value: length,
              label: text.topic.lengths[length],
            }))}
            onChange={(length) => update({ length })}
            popupMatchSelectWidth={false}
          />
          <Select
            aria-label={text.topic.author}
            value={filters.author}
            options={[
              { value: '', label: text.topic.anyAuthor },
              ...writers.map((author) => ({ value: author.id, label: author.name })),
            ]}
            onChange={(author) => update({ author })}
          />
        </div>

        <output className="mag-filters__count">{text.topic.count(shown.length)}</output>

        {shown.length > 0 ? (
          <div className="mag-grid">
            {shown.map((article) => (
              <ArticleCard key={article.slug} article={article} root={root} headingLevel={2} />
            ))}
          </div>
        ) : (
          <Empty description={text.topic.empty}>
            {filtered && (
              <Button onClick={() => update({ ...emptyArticleFilters, sort: filters.sort })}>
                {text.topic.clear}
              </Button>
            )}
          </Empty>
        )}
      </section>
    </>
  )
}

export function MagazineTopicPage({ standalone = false }: { standalone?: boolean }) {
  const { text } = useMagazineCopy()
  const navigate = useNavigate()
  const { topicId } = useParams()
  const topic = findTopic(topicId)
  const root = magazineRoot(standalone)

  return (
    <MagazineSiteShell standalone={standalone}>
      {topic ? (
        <TopicView key={topic.id} topic={topic} root={root} />
      ) : (
        <Result
          status="404"
          title={text.topic.notFound}
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
