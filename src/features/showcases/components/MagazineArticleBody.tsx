import { CheckOutlined, CopyOutlined, InfoCircleOutlined, LinkOutlined } from '@ant-design/icons'
import { App, Button, Tooltip } from 'antd'
import { useState } from 'react'
import { Link } from 'react-router'
import { MagazineFigure } from '@/features/showcases/components/MagazineArt'
import { findTopic, type Article, type Block } from '@/features/showcases/data/magazine'
import { useMagazineCopy } from '@/features/showcases/hooks/useMagazineStore'

function CodeBlock({ block }: { block: Extract<Block, { type: 'code' }> }) {
  const { text, language } = useMagazineCopy()
  const { message } = App.useApp()
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(block.code)
      setCopied(true)
      void message.success(text.article.codeCopied)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      void message.error(text.article.copyFailed)
    }
  }
  return (
    <figure className="mag-code">
      <div className="mag-code__bar">
        <span className="mag-code__lang">{block.language}</span>
        <Tooltip title={text.article.codeCopy}>
          <Button
            type="text"
            size="small"
            className="mag-code__copy"
            aria-label={text.article.codeCopy}
            icon={copied ? <CheckOutlined /> : <CopyOutlined />}
            onClick={() => void copy()}
          />
        </Tooltip>
      </div>
      <pre>
        <code>{block.code}</code>
      </pre>
      {block.caption && <figcaption>{block.caption[language]}</figcaption>}
    </figure>
  )
}

/**
 * The article's text. Headings carry ids so the contents, the address and "copy link to this
 * heading" can point at them; the reading mode passes a prefix so its copy never clashes.
 */
export function MagazineArticleBody({
  article,
  idPrefix = '',
  headingLinks = true,
}: {
  article: Article
  idPrefix?: string
  headingLinks?: boolean
}) {
  const { language } = useMagazineCopy()
  const color = findTopic(article.topic)?.color ?? '#b4412f'

  return (
    <div className="mag-prose">
      {article.body.map((block, index) => {
        switch (block.type) {
          case 'p':
            return <p key={index}>{block.text[language]}</p>
          case 'h2':
          case 'h3': {
            const Heading = block.type
            return (
              <Heading key={index} id={`${idPrefix}${block.id}`} className="mag-heading">
                {block.text[language]}
                {headingLinks && (
                  <Link
                    className="mag-heading__anchor"
                    to={{ hash: block.id }}
                    replace
                    preventScrollReset
                    aria-label={`#${block.text[language]}`}
                  >
                    <LinkOutlined aria-hidden="true" />
                  </Link>
                )}
              </Heading>
            )
          }
          case 'quote':
            return (
              <blockquote key={index} className="mag-quote">
                <p>{block.text[language]}</p>
                {block.cite && <cite>{block.cite[language]}</cite>}
              </blockquote>
            )
          case 'list': {
            const List = block.ordered ? 'ol' : 'ul'
            return (
              <List key={index}>
                {block.items.map((item) => (
                  <li key={item.en}>{item[language]}</li>
                ))}
              </List>
            )
          }
          case 'code':
            return <CodeBlock key={index} block={block} />
          case 'figure':
            return (
              <figure key={index} className="mag-figure">
                <MagazineFigure art={block.art} color={color} />
                <figcaption>{block.caption[language]}</figcaption>
              </figure>
            )
          case 'note':
            return (
              <aside key={index} className="mag-note">
                <InfoCircleOutlined aria-hidden="true" />
                <p>{block.text[language]}</p>
              </aside>
            )
        }
      })}
    </div>
  )
}
