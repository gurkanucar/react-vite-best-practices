import { Col, Divider, Row, Space, Typography } from 'antd'
import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router'
import { PublicSiteShell } from '@/features/showcases/components/PublicSiteShell'
import { ShowcasePreviewFrame } from '@/features/showcases/components/ShowcasePreviewFrame'
import { esportsBrand, esportsRoot } from '@/features/showcases/data/esports'
import { esportsCopy } from '@/features/showcases/data/esportsCopy'
import { useEsportsCopy } from '@/features/showcases/hooks/useEsportsStore'
import '../showcases.css'
import '../esports.css'

function EsportsFooter() {
  const { text } = useEsportsCopy()
  return (
    <div className="esp-footer">
      <Row gutter={[32, 28]}>
        <Col xs={24} lg={9}>
          <Space orientation="vertical" size={10}>
            <Typography.Text strong className="esp-footer__brand">
              {esportsBrand}
            </Typography.Text>
            <Typography.Text type="secondary">{text.footer.about}</Typography.Text>
          </Space>
        </Col>
        {text.footer.columns.map(([title, links]) => (
          <Col xs={12} md={8} lg={5} key={title}>
            <Typography.Title level={5}>{title}</Typography.Title>
            <ul className="esp-footer__links">
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
        © 2026 {esportsBrand}. {text.footer.rights}
      </Typography.Text>
    </div>
  )
}

/**
 * The tournament site's frame. Inside the admin it sits in the preview frame, whose "open in
 * a new tab" keeps the page, its tab and its filters.
 */
export function EsportsSiteShell({
  children,
  standalone,
}: {
  children: ReactNode
  standalone: boolean
}) {
  const root = esportsRoot(standalone)
  const { pathname, search, hash } = useLocation()
  const previewPath = `${pathname.replace(esportsRoot(false), esportsRoot(true))}${search}${hash}`
  const nav = (key: keyof typeof esportsCopy.en.nav, path: string) => ({
    href: `${root}${path}`,
    label: { en: esportsCopy.en.nav[key], tr: esportsCopy.tr.nav[key] },
  })

  return (
    <ShowcasePreviewFrame
      standalone={standalone}
      standalonePath={previewPath}
      title={{ en: esportsCopy.en.frame.title, tr: esportsCopy.tr.frame.title }}
      description={{ en: esportsCopy.en.frame.description, tr: esportsCopy.tr.frame.description }}
    >
      <PublicSiteShell
        brand={esportsBrand}
        tagline={{ en: esportsCopy.en.tagline, tr: esportsCopy.tr.tagline }}
        className="esp-site"
        primary="#e8412c"
        homeHref={root}
        links={[nav('tournaments', '/tournaments'), nav('leaderboard', '/leaderboard')]}
        footer={<EsportsFooter />}
      >
        <div className="esp-page">{children}</div>
      </PublicSiteShell>
    </ShowcasePreviewFrame>
  )
}

/** A friendly dead end for an unknown tournament, team or match. */
export function EsportsNotFound({ message, root }: { message: string; root: string }) {
  const { text } = useEsportsCopy()
  return (
    <section className="esp-wrap esp-notfound">
      <Typography.Title level={2}>{message}</Typography.Title>
      <Link to={root}>{text.common.back}</Link>
    </section>
  )
}
