import { ArrowRightOutlined, MailOutlined } from '@ant-design/icons'
import { Button, Form, Input, Typography } from 'antd'
import { useState, type CSSProperties } from 'react'
import { Link } from 'react-router'
import { MagazineCover } from '@/features/showcases/components/MagazineArt'
import {
  ArticleCard,
  ArticleMeta,
  AuthorAvatar,
  BookmarkButton,
  SectionTitle,
  TopicTag,
} from '@/features/showcases/components/MagazineBits'
import { MagazineSiteShell } from '@/features/showcases/components/MagazineSiteShell'
import {
  FINISHED_AT,
  STARTED_AT,
  articles,
  articlesByAuthor,
  articlesByTopic,
  authors,
  editorsPicks,
  featuredArticle,
  findArticle,
  findTopic,
  formatViews,
  magazineRoot,
  mostRead,
  topics,
} from '@/features/showcases/data/magazine'
import { useMagazineCopy, useMagazineStore } from '@/features/showcases/hooks/useMagazineStore'

function Hero({ root }: { root: string }) {
  const { text, language } = useMagazineCopy()
  const article = featuredArticle
  const topic = findTopic(article.topic)
  const side = articles.filter((item) => item.slug !== article.slug).slice(0, 3)
  if (!topic) return null
  return (
    <section className="mag-hero">
      <div className="mag-wrap mag-hero__inner">
        <article
          className="mag-hero__feature"
          style={{ '--mag-accent': topic.color } as CSSProperties}
        >
          <div className="mag-hero__media">
            <MagazineCover slug={article.slug} pattern={article.cover} color={topic.color} />
          </div>
          <div className="mag-hero__copy">
            <span className="mag-eyebrow">
              {text.home.eyebrow} · {text.home.featured}
            </span>
            <TopicTag topic={topic} root={root} />
            <h1 className="mag-hero__title">
              <Link to={`${root}/articles/${article.slug}`}>{article.title[language]}</Link>
            </h1>
            <p className="mag-hero__dek">{article.dek[language]}</p>
            <div className="mag-hero__actions">
              <ArticleMeta article={article} root={root} />
              <BookmarkButton article={article} />
            </div>
          </div>
        </article>
        <ol className="mag-hero__side" aria-label={text.home.latest}>
          {side.map((item) => {
            const itemTopic = findTopic(item.topic)
            return (
              <li key={item.slug}>
                {itemTopic && <TopicTag topic={itemTopic} root={root} />}
                <h2 className="mag-hero__side-title">
                  <Link to={`${root}/articles/${item.slug}`}>{item.title[language]}</Link>
                </h2>
                <ArticleMeta article={item} root={root} />
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

function ContinueReading({ root }: { root: string }) {
  const { text, language } = useMagazineCopy()
  const history = useMagazineStore((state) => state.history)
  const open = Object.entries(history)
    .filter(
      ([, record]) =>
        !record.finished && record.progress >= STARTED_AT && record.progress < FINISHED_AT,
    )
    .sort(([, a], [, b]) => b.readAt - a.readAt)
    .flatMap(([slug, record]) => {
      const article = findArticle(slug)
      return article ? [{ article, record }] : []
    })
    .slice(0, 3)
  if (open.length === 0) return null
  return (
    <section className="mag-section mag-wrap" aria-labelledby="mag-continue">
      <div className="mag-section-title" id="mag-continue">
        <div>
          <Typography.Title level={2}>{text.home.continue}</Typography.Title>
          <Typography.Text type="secondary">{text.home.continueIntro}</Typography.Text>
        </div>
      </div>
      <div className="mag-continue">
        {open.map(({ article, record }) => {
          const topic = findTopic(article.topic)
          const percent = Math.round(record.progress * 100)
          return (
            <Link
              key={article.slug}
              className="mag-continue__item"
              to={`${root}/articles/${article.slug}?resume=1`}
              style={{ '--mag-accent': topic?.color } as CSSProperties}
            >
              <span className="mag-continue__title">{article.title[language]}</span>
              <span className="mag-continue__bar" aria-hidden="true">
                <span style={{ width: `${percent}%` }} />
              </span>
              <span className="mag-continue__meta">
                {text.common.progress(percent)}
                <ArrowRightOutlined aria-hidden="true" />
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

function Newsletter() {
  const { text } = useMagazineCopy()
  const [done, setDone] = useState(false)
  return (
    <section className="mag-newsletter mag-wrap">
      <div className="mag-newsletter__icon" aria-hidden="true">
        <MailOutlined />
      </div>
      <div className="mag-newsletter__copy">
        <Typography.Title level={3}>{text.home.newsletterTitle}</Typography.Title>
        <Typography.Text type="secondary">{text.home.newsletterText}</Typography.Text>
      </div>
      {done ? (
        <output className="mag-newsletter__done">{text.home.newsletterDone}</output>
      ) : (
        <Form
          className="mag-newsletter__form"
          layout="inline"
          onFinish={() => setDone(true)}
          requiredMark={false}
        >
          <Form.Item
            name="email"
            rules={[{ required: true, type: 'email', message: text.home.newsletterInvalid }]}
          >
            <Input
              type="email"
              aria-label={text.home.newsletterPlaceholder}
              placeholder={text.home.newsletterPlaceholder}
              autoComplete="email"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {text.home.newsletterButton}
            </Button>
          </Form.Item>
        </Form>
      )}
    </section>
  )
}

export function MagazineHomePage({ standalone = false }: { standalone?: boolean }) {
  const { text, language } = useMagazineCopy()
  const root = magazineRoot(standalone)
  const latest = articles.filter((article) => article.slug !== featuredArticle.slug).slice(0, 6)
  const popular = mostRead(5)

  return (
    <MagazineSiteShell standalone={standalone}>
      <Hero root={root} />
      <ContinueReading root={root} />

      <section className="mag-section mag-wrap mag-latest">
        <div className="mag-latest__main">
          <SectionTitle id="latest" title={text.home.latest} intro={text.home.latestIntro} />
          <div className="mag-grid">
            {latest.map((article) => (
              <ArticleCard key={article.slug} article={article} root={root} />
            ))}
          </div>
        </div>
        <aside className="mag-popular" aria-labelledby="mag-popular-title">
          <Typography.Title level={3} id="mag-popular-title">
            {text.home.mostRead}
          </Typography.Title>
          <ol>
            {popular.map((article, index) => (
              <li key={article.slug}>
                <span className="mag-popular__rank" aria-hidden="true">
                  {index + 1}
                </span>
                <div>
                  <Link to={`${root}/articles/${article.slug}`}>{article.title[language]}</Link>
                  <Typography.Text type="secondary">
                    {text.common.views(formatViews(article.views, language))}
                  </Typography.Text>
                </div>
              </li>
            ))}
          </ol>
        </aside>
      </section>

      <section className="mag-section mag-picks">
        <div className="mag-wrap">
          <SectionTitle title={text.home.picks} intro={text.home.picksIntro} />
          <div className="mag-grid mag-grid--picks">
            {editorsPicks.slice(0, 4).map((article) => (
              <ArticleCard key={article.slug} article={article} root={root} variant="row" />
            ))}
          </div>
        </div>
      </section>

      <section className="mag-section mag-wrap">
        <SectionTitle id="topics" title={text.home.topics} />
        <div className="mag-topics">
          {topics.map((topic) => (
            <Link
              key={topic.id}
              to={`${root}/topics/${topic.id}`}
              className="mag-topic-tile"
              style={{ '--mag-topic': topic.color } as CSSProperties}
            >
              <span className="mag-topic-tile__name">{topic.name[language]}</span>
              <span className="mag-topic-tile__text">{topic.description[language]}</span>
              <span className="mag-topic-tile__count">
                {text.common.articles(articlesByTopic(topic.id).length)}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mag-section mag-wrap">
        <SectionTitle id="authors" title={text.home.authors} />
        <div className="mag-authors">
          {authors.map((author) => (
            <Link key={author.id} to={`${root}/authors/${author.id}`} className="mag-author-tile">
              <AuthorAvatar author={author} size={52} />
              <span>
                <strong>{author.name}</strong>
                <span>{author.role[language]}</span>
                <span className="mag-author-tile__count">
                  {text.common.articles(articlesByAuthor(author.id).length)}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <Newsletter />
    </MagazineSiteShell>
  )
}
