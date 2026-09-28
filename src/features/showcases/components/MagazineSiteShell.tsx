import { Col, Divider, Row, Space, Typography } from 'antd'
import { useEffect, type ReactNode } from 'react'
import { useLocation } from 'react-router'
import { PublicSiteShell } from '@/features/showcases/components/PublicSiteShell'
import { ShowcasePreviewFrame } from '@/features/showcases/components/ShowcasePreviewFrame'
import { magazineBrand, magazineRoot } from '@/features/showcases/data/magazine'
import { magazineCopy } from '@/features/showcases/data/magazineCopy'
import { useMagazineCopy } from '@/features/showcases/hooks/useMagazineStore'
import '../showcases.css'
import '../magazine.css'

function MagazineFooter() {
  const { text } = useMagazineCopy()
  return (
    <div className="mag-footer">
      <Row gutter={[32, 28]}>
        <Col xs={24} lg={9}>
          <Space orientation="vertical" size={10}>
            <Typography.Text strong className="mag-footer__brand">
              {magazineBrand}
            </Typography.Text>
            <Typography.Text type="secondary">{text.footer.about}</Typography.Text>
          </Space>
        </Col>
        {text.footer.columns.map(([title, links]) => (
          <Col xs={12} md={8} lg={5} key={title}>
            <Typography.Title level={5}>{title}</Typography.Title>
            <ul className="mag-footer__links">
              {links.map((link) => (
                <li key={link}>
                  <Typography.Text type="secondary">{link}</Typography.Text>
                </li>
              ))}
            </ul>
          </Col>
        ))}
      </Row>
      <Divider />
      <Typography.Text type="secondary">
        © 2026 {magazineBrand}. {text.footer.rights}
      </Typography.Text>
    </div>
  )
}

/**
 * The magazine's frame. Inside the admin it sits in the preview frame, whose "open in a new
 * tab" keeps the page and the heading in the address.
 */
export function MagazineSiteShell({
  children,
  standalone,
}: {
  children: ReactNode
  standalone: boolean
}) {
  const root = magazineRoot(standalone)
  const { pathname, search, hash } = useLocation()
  const previewPath = `${pathname.replace(magazineRoot(false), magazineRoot(true))}${search}${hash}`
  const nav = (key: keyof typeof magazineCopy.en.nav, path: string) => ({
    href: `${root}${path}`,
    label: { en: magazineCopy.en.nav[key], tr: magazineCopy.tr.nav[key] },
  })

  // Pages load lazily, so the browser's own jump to "#topics" or to a heading happens before
  // the target exists. Try again once the page has rendered.
  useEffect(() => {
    if (!hash) return
    const timer = window.setTimeout(() => {
      document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({ block: 'start' })
    }, 120)
    return () => window.clearTimeout(timer)
  }, [hash, pathname])

  return (
    <ShowcasePreviewFrame
      standalone={standalone}
      standalonePath={previewPath}
      title={{ en: magazineCopy.en.frame.title, tr: magazineCopy.tr.frame.title }}
      description={{ en: magazineCopy.en.frame.description, tr: magazineCopy.tr.frame.description }}
    >
      <PublicSiteShell
        brand={magazineBrand}
        tagline={{ en: magazineCopy.en.tagline, tr: magazineCopy.tr.tagline }}
        className="magazine-site"
        primary="#b4412f"
        homeHref={root}
        links={[
          nav('latest', '#latest'),
          nav('topics', '#topics'),
          nav('authors', '#authors'),
          nav('saved', '/bookmarks'),
        ]}
        footer={<MagazineFooter />}
      >
        <div className="mag-page">{children}</div>
      </PublicSiteShell>
    </ShowcasePreviewFrame>
  )
}
