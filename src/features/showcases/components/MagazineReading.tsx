import {
  BookFilled,
  BookOutlined,
  CloseOutlined,
  FontSizeOutlined,
  MinusOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import { Button, Flex, Popover, Segmented, Slider, Tooltip, Typography } from 'antd'
import { useCallback, useEffect, useLayoutEffect, useRef, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router'
import { MagazineArticleBody } from '@/features/showcases/components/MagazineArticleBody'
import { AuthorAvatar } from '@/features/showcases/components/MagazineBits'
import {
  findAuthor,
  findTopic,
  formatDate,
  readingMinutes,
  type Article,
  type TocEntry,
} from '@/features/showcases/data/magazine'
import {
  READER_SIZES,
  useIsBookmarked,
  useMagazineCopy,
  useMagazineStore,
  type ReaderFont,
  type ReaderTheme,
  type ReaderWidth,
} from '@/features/showcases/hooks/useMagazineStore'
import {
  scrollToProgress,
  useReadingPosition,
  useRecordProgress,
} from '@/features/showcases/hooks/useMagazineReading'

// ------------------------------------------------------------------ contents

export function MagazineToc({
  entries,
  active,
  idPrefix = '',
  onNavigate,
}: {
  entries: TocEntry[]
  active?: string
  idPrefix?: string
  onNavigate?: (id: string) => void
}) {
  const { text } = useMagazineCopy()
  return (
    <nav className="mag-toc" aria-label={text.article.contents}>
      <ol>
        {entries.map((entry) => {
          const current = `${idPrefix}${entry.id}` === active
          return (
            <li key={entry.id} className={`mag-toc__item mag-toc__item--h${entry.level}`}>
              <Link
                to={{ hash: entry.id }}
                replace
                preventScrollReset
                className={current ? 'is-active' : undefined}
                aria-current={current ? 'location' : undefined}
                onClick={
                  onNavigate
                    ? (event) => {
                        event.preventDefault()
                        onNavigate(entry.id)
                      }
                    : undefined
                }
              >
                {entry.text}
              </Link>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

/** The thin bar under the header that fills as you read. */
export function ReadingProgressBar({ progress }: { progress: number }) {
  // Decorative: the same progress is written out in words beside the article.
  return (
    <div className="mag-progress" aria-hidden="true">
      <span style={{ transform: `scaleX(${progress})` }} />
    </div>
  )
}

// ------------------------------------------------------------------ reading mode

const THEMES: ReaderTheme[] = ['light', 'sepia', 'dark']
const WIDTHS: ReaderWidth[] = ['narrow', 'medium', 'wide']
const FONTS: ReaderFont[] = ['serif', 'sans']

function ReaderSettingsPanel() {
  const { text } = useMagazineCopy()
  const reader = useMagazineStore((state) => state.reader)
  const setReader = useMagazineStore((state) => state.setReader)
  return (
    <div className="mag-reader-settings">
      <Typography.Text strong>{text.reader.size}</Typography.Text>
      <Flex align="center" gap={8}>
        <Button
          size="small"
          aria-label={text.reader.smaller}
          icon={<MinusOutlined />}
          disabled={reader.size <= READER_SIZES.min}
          onClick={() => setReader({ size: reader.size - 1 })}
        />
        <Slider
          className="mag-reader-settings__slider"
          min={READER_SIZES.min}
          max={READER_SIZES.max}
          value={reader.size}
          onChange={(size) => setReader({ size })}
          tooltip={{ formatter: (value) => `${value}px` }}
          aria-label={text.reader.size}
        />
        <Button
          size="small"
          aria-label={text.reader.larger}
          icon={<PlusOutlined />}
          disabled={reader.size >= READER_SIZES.max}
          onClick={() => setReader({ size: reader.size + 1 })}
        />
      </Flex>
      <Typography.Text strong>{text.reader.width}</Typography.Text>
      <Segmented
        block
        value={reader.width}
        options={WIDTHS.map((width) => ({ value: width, label: text.reader.widths[width] }))}
        onChange={(width) => setReader({ width })}
      />
      <Typography.Text strong>{text.reader.theme}</Typography.Text>
      <div className="mag-reader-settings__themes">
        {THEMES.map((theme) => (
          <button
            key={theme}
            type="button"
            className={`mag-theme-swatch mag-theme-swatch--${theme}${reader.theme === theme ? ' is-active' : ''}`}
            aria-pressed={reader.theme === theme}
            onClick={() => setReader({ theme })}
          >
            <span aria-hidden="true">Aa</span>
            {text.reader.themes[theme]}
          </button>
        ))}
      </div>
      <Typography.Text strong>{text.reader.font}</Typography.Text>
      <Segmented
        block
        value={reader.font}
        options={FONTS.map((font) => ({ value: font, label: text.reader.fonts[font] }))}
        onChange={(font) => setReader({ font })}
      />
    </div>
  )
}

/**
 * Distraction-free reading: the article alone, in a typeface, size, width and page colour the
 * reader picks. It opens at the spot they had reached and hands back where they stopped.
 */
export function MagazineReadingMode({
  article,
  initialProgress,
  onClose,
}: {
  article: Article
  initialProgress: number
  onClose: (progress: number) => void
}) {
  const { text, language } = useMagazineCopy()
  const reader = useMagazineStore((state) => state.reader)
  const toggleBookmark = useMagazineStore((state) => state.toggleBookmark)
  const saved = useIsBookmarked(article.slug)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const topic = findTopic(article.topic)
  const author = findAuthor(article.authorId)
  const minutes = readingMinutes(article, language)
  const layoutKey = `${reader.size}-${reader.width}-${reader.font}`
  const { progress } = useReadingPosition(bodyRef, scrollerRef, [], layoutKey)
  useRecordProgress(article.slug, progress)
  const progressRef = useRef(progress)
  const initialRef = useRef(initialProgress)
  useEffect(() => {
    progressRef.current = progress
  }, [progress])

  const close = useCallback(() => onClose(progressRef.current), [onClose])

  // Open where the reader was, lock the page behind, and give focus to the close button.
  useLayoutEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    scrollToProgress(bodyRef.current, initialRef.current, scrollerRef.current)
    closeRef.current?.focus({ preventScroll: true })
    return () => {
      document.body.style.overflow = previous
    }
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !event.defaultPrevented) close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [close])

  const left = Math.ceil(minutes * (1 - progress))
  const style = {
    '--reader-size': `${reader.size}px`,
    '--mag-accent': topic?.color,
  } as CSSProperties

  return createPortal(
    <dialog
      open
      className={`mag-reader mag-reader--${reader.theme} mag-reader--${reader.width} mag-reader--${reader.font}`}
      aria-modal="true"
      aria-label={`${text.article.readingMode}: ${article.title[language]}`}
      style={style}
    >
      <div className="mag-reader__bar">
        <Tooltip title={text.reader.hint}>
          <Button
            ref={closeRef}
            type="text"
            className="mag-reader__icon"
            aria-label={text.reader.close}
            icon={<CloseOutlined />}
            onClick={close}
          />
        </Tooltip>
        <span className="mag-reader__title">{article.title[language]}</span>
        <span className="mag-reader__left">{text.reader.left(left)}</span>
        <Button
          type="text"
          className="mag-reader__icon"
          aria-label={
            saved
              ? text.common.unbookmark(article.title[language])
              : text.common.bookmark(article.title[language])
          }
          aria-pressed={saved}
          icon={saved ? <BookFilled /> : <BookOutlined />}
          onClick={() => toggleBookmark(article.slug)}
        />
        <Popover
          trigger="click"
          placement="bottomRight"
          content={<ReaderSettingsPanel />}
          title={text.reader.settings}
        >
          <Button
            type="text"
            className="mag-reader__icon"
            aria-label={text.reader.settings}
            icon={<FontSizeOutlined />}
          />
        </Popover>
        <div className="mag-reader__progress" aria-hidden="true">
          <span style={{ transform: `scaleX(${progress})` }} />
        </div>
      </div>
      <div className="mag-reader__scroll" ref={scrollerRef}>
        <article className="mag-reader__page">
          {topic && <span className="mag-reader__topic">{topic.name[language]}</span>}
          <h1>{article.title[language]}</h1>
          <p className="mag-reader__dek">{article.dek[language]}</p>
          {author && (
            <div className="mag-reader__byline">
              <AuthorAvatar author={author} size={36} />
              <span>
                <strong>{author.name}</strong>
                <span>
                  {formatDate(article.published, language)} · {text.common.minutes(minutes)}
                </span>
              </span>
            </div>
          )}
          <div ref={bodyRef}>
            <MagazineArticleBody article={article} idPrefix="reader-" headingLinks={false} />
          </div>
          <div className="mag-reader__end" aria-hidden="true">
            ◆
          </div>
        </article>
      </div>
    </dialog>,
    document.body,
  )
}
