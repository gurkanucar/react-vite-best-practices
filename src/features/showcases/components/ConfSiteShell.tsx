import { MailOutlined } from '@ant-design/icons'
import { Flex, Space, Typography } from 'antd'
import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router'
import { PublicSiteShell } from '@/features/showcases/components/PublicSiteShell'
import { ShowcasePreviewFrame } from '@/features/showcases/components/ShowcasePreviewFrame'
import { confCopy } from '@/features/showcases/data/confCopy'
import { confRoot } from '@/features/showcases/data/confData'
import { useConfText } from '@/features/showcases/hooks/useConfText'
import '../showcases.css'
import '../conference.css'

interface ConfSiteShellProps {
  children: ReactNode
  standalone: boolean
  /** The admin preview's heading for this page. */
  title: { en: string; tr: string }
  description: { en: string; tr: string }
}

const sections = ['', '/schedule', '/speakers', '/tickets']

/**
 * Every Relay Summit page: the site header and footer, inside the admin's preview frame unless
 * it is the standalone site. "Open in a new tab" keeps the search, so a filtered program or a
 * shared agenda opens as it is.
 */
export function ConfSiteShell({ children, standalone, title, description }: ConfSiteShellProps) {
  const { text, language } = useConfText()
  const { pathname, search } = useLocation()
  const root = confRoot(standalone)
  const links = sections.map((path, index) => ({
    href: `${root}${path}`,
    label: { en: confCopy.en.nav[index] ?? '', tr: confCopy.tr.nav[index] ?? '' },
  }))

  const footer = (
    <Flex justify="space-between" gap={24} wrap className="conf-footer">
      <Space orientation="vertical" size={6} className="conf-footer__about">
        <Typography.Text strong>{text.brand} 2026</Typography.Text>
        <Typography.Text type="secondary">{text.home.eyebrow}</Typography.Text>
        <Typography.Text type="secondary">
          <MailOutlined aria-hidden="true" />{' '}
          <a href="mailto:hello@relaysummit.example">hello@relaysummit.example</a>
        </Typography.Text>
      </Space>
      <nav aria-label={text.brand} className="conf-footer__links">
        {links.map((link) => (
          <Link key={link.href} to={link.href}>
            {link.label[language]}
          </Link>
        ))}
      </nav>
      <Typography.Text type="secondary" className="conf-footer__note">
        {text.footerNote} © 2026 {text.brand}.
      </Typography.Text>
    </Flex>
  )

  return (
    <ShowcasePreviewFrame
      standalone={standalone}
      standalonePath={`${pathname.replace('/showcases/event', '/preview/event')}${search}`}
      title={title}
      description={description}
    >
      <PublicSiteShell
        brand={text.brand}
        tagline={{ en: confCopy.en.tagline, tr: confCopy.tr.tagline }}
        className="conf-site"
        primary="#d9401c"
        homeHref={root}
        links={links}
        footer={footer}
      >
        {children}
      </PublicSiteShell>
    </ShowcasePreviewFrame>
  )
}
