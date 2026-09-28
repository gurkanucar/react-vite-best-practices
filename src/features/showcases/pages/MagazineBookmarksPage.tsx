import { BookOutlined, DeleteOutlined, HistoryOutlined } from '@ant-design/icons'
import { Button, Empty, Popconfirm, Progress, Tabs, Typography } from 'antd'
import type { CSSProperties, ReactNode } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { MagazineCover } from '@/features/showcases/components/MagazineArt'
import { ArticleMeta, TopicTag } from '@/features/showcases/components/MagazineBits'
import { MagazineSiteShell } from '@/features/showcases/components/MagazineSiteShell'
import {
  findArticle,
  findTopic,
  formatDate,
  magazineRoot,
  type Article,
} from '@/features/showcases/data/magazine'
import { useMagazineCopy, useMagazineStore } from '@/features/showcases/hooks/useMagazineStore'

/** One row in either list: cover, title, meta, a detail line and the row's actions. */
function ReadingRow({
  article,
  root,
  detail,
  actions,
  progress,
}: {
  article: Article
  root: string
  detail: string
  actions: ReactNode
  progress?: { percent: number; label: string }
}) {
  const { language } = useMagazineCopy()
  const topic = findTopic(article.topic)
  if (!topic) return null
  return (
    <li className="mag-row" style={{ '--mag-accent': topic.color } as CSSProperties}>
      <Link
        to={`${root}/articles/${article.slug}`}
        className="mag-row__media"
        tabIndex={-1}
        aria-hidden="true"
      >
        <MagazineCover slug={article.slug} pattern={article.cover} color={topic.color} />
      </Link>
      <div className="mag-row__body">
        <TopicTag topic={topic} root={root} />
        <h2 className="mag-row__title">
          <Link to={`${root}/articles/${article.slug}`}>{article.title[language]}</Link>
        </h2>
        <ArticleMeta article={article} root={root} />
        <Typography.Text type="secondary" className="mag-row__detail">
          {detail}
        </Typography.Text>
        {progress && (
          <Progress
            percent={progress.percent}
            size="small"
            strokeColor="var(--mag-accent)"
            format={() => progress.label}
            aria-label={progress.label}
          />
        )}
      </div>
      <div className="mag-row__actions">{actions}</div>
    </li>
  )
}

export function MagazineBookmarksPage({ standalone = false }: { standalone?: boolean }) {
  const { text, language } = useMagazineCopy()
  const root = magazineRoot(standalone)
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const tab = params.get('tab') === 'history' ? 'history' : 'saved'
  const bookmarks = useMagazineStore((state) => state.bookmarks)
  const history = useMagazineStore((state) => state.history)
  const toggleBookmark = useMagazineStore((state) => state.toggleBookmark)
  const clearBookmarks = useMagazineStore((state) => state.clearBookmarks)
  const forget = useMagazineStore((state) => state.forget)
  const clearHistory = useMagazineStore((state) => state.clearHistory)

  const saved = bookmarks.flatMap((bookmark) => {
    const article = findArticle(bookmark.slug)
    return article ? [{ article, bookmark }] : []
  })
  const read = Object.entries(history)
    .sort(([, a], [, b]) => b.readAt - a.readAt)
    .flatMap(([slug, record]) => {
      const article = findArticle(slug)
      return article ? [{ article, record }] : []
    })

  const empty = (description: string) => (
    <Empty description={description}>
      <Button type="primary" onClick={() => navigate(`${root}#latest`)}>
        {text.saved.browse}
      </Button>
    </Empty>
  )

  const clearButton = (
    label: string,
    confirm: string,
    onConfirm: () => void,
    disabled: boolean,
  ) => (
    <Popconfirm
      title={confirm}
      okText={text.saved.yes}
      cancelText={text.saved.no}
      okButtonProps={{ danger: true }}
      onConfirm={onConfirm}
      disabled={disabled}
    >
      <Button danger icon={<DeleteOutlined />} disabled={disabled}>
        {label}
      </Button>
    </Popconfirm>
  )

  return (
    <MagazineSiteShell standalone={standalone}>
      <section className="mag-section mag-wrap mag-saved">
        <div className="mag-section-title">
          <div>
            <Typography.Title level={1}>{text.saved.title}</Typography.Title>
            <Typography.Text type="secondary">{text.saved.intro}</Typography.Text>
          </div>
        </div>
        <Tabs
          activeKey={tab}
          onChange={(key) =>
            setParams(key === 'history' ? { tab: 'history' } : {}, {
              replace: true,
              preventScrollReset: true,
            })
          }
          items={[
            {
              key: 'saved',
              label: (
                <span>
                  <BookOutlined aria-hidden="true" /> {text.saved.tabSaved} ({saved.length})
                </span>
              ),
              children: (
                <>
                  <div className="mag-saved__toolbar">
                    {clearButton(
                      text.saved.clearSaved,
                      text.saved.clearSavedConfirm,
                      clearBookmarks,
                      saved.length === 0,
                    )}
                  </div>
                  {saved.length === 0 ? (
                    empty(text.saved.emptySaved)
                  ) : (
                    <ul className="mag-rows">
                      {saved.map(({ article, bookmark }) => (
                        <ReadingRow
                          key={article.slug}
                          article={article}
                          root={root}
                          detail={text.saved.savedOn(formatDate(bookmark.savedAt, language))}
                          actions={
                            <Button
                              icon={<DeleteOutlined />}
                              aria-label={`${text.saved.remove}: ${article.title[language]}`}
                              onClick={() => toggleBookmark(article.slug)}
                            >
                              {text.saved.remove}
                            </Button>
                          }
                        />
                      ))}
                    </ul>
                  )}
                </>
              ),
            },
            {
              key: 'history',
              label: (
                <span>
                  <HistoryOutlined aria-hidden="true" /> {text.saved.tabHistory} ({read.length})
                </span>
              ),
              children: (
                <>
                  <div className="mag-saved__toolbar">
                    {clearButton(
                      text.saved.clearHistory,
                      text.saved.clearHistoryConfirm,
                      clearHistory,
                      read.length === 0,
                    )}
                  </div>
                  {read.length === 0 ? (
                    empty(text.saved.emptyHistory)
                  ) : (
                    <ul className="mag-rows">
                      {read.map(({ article, record }) => {
                        const percent = record.finished ? 100 : Math.round(record.progress * 100)
                        const done = record.finished
                        return (
                          <ReadingRow
                            key={article.slug}
                            article={article}
                            root={root}
                            detail={text.saved.readOn(
                              formatDate(record.readAt, language, 'D MMM YYYY, HH:mm'),
                            )}
                            progress={{
                              percent,
                              label: done ? text.common.finished : text.common.progress(percent),
                            }}
                            actions={
                              <>
                                <Button
                                  type="primary"
                                  onClick={() =>
                                    navigate(
                                      `${root}/articles/${article.slug}${done ? '' : '?resume=1'}`,
                                    )
                                  }
                                >
                                  {done ? text.saved.readAgain : text.saved.continue}
                                </Button>
                                <Button
                                  icon={<DeleteOutlined />}
                                  aria-label={`${text.saved.remove}: ${article.title[language]}`}
                                  onClick={() => forget(article.slug)}
                                />
                              </>
                            }
                          />
                        )
                      })}
                    </ul>
                  )}
                </>
              ),
            },
          ]}
        />
      </section>
    </MagazineSiteShell>
  )
}
