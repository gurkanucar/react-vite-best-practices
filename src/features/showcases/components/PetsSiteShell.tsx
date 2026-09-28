import { Col, Divider, Row, Space, Typography } from 'antd'
import { useEffect, type ReactNode } from 'react'
import { useLocation } from 'react-router'
import { PublicSiteShell } from '@/features/showcases/components/PublicSiteShell'
import { ShowcasePreviewFrame } from '@/features/showcases/components/ShowcasePreviewFrame'
import { petsBrand, petsRoot } from '@/features/showcases/data/pets'
import { petsCopy } from '@/features/showcases/data/petsCopy'
import { usePetsCopy } from '@/features/showcases/hooks/usePetsStore'
import '../showcases.css'
import '../pets.css'

function PetsFooter() {
  const { text } = usePetsCopy()
  return (
    <div className="pets-footer">
      <Row gutter={[32, 28]}>
        <Col xs={24} lg={9}>
          <Space orientation="vertical" size={10}>
            <Typography.Text strong className="pets-footer__brand">
              {petsBrand}
            </Typography.Text>
            <Typography.Text type="secondary">{text.footer.about}</Typography.Text>
          </Space>
        </Col>
        {text.footer.columns.map(([title, links]) => (
          <Col xs={12} md={8} lg={5} key={title}>
            <Typography.Title level={5}>{title}</Typography.Title>
            <ul className="pets-footer__links">
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
        © 2026 {petsBrand}. {text.footer.rights}
      </Typography.Text>
    </div>
  )
}

/**
 * The adoption site's frame. Inside the admin it sits in the preview frame, whose "open in a
 * new tab" keeps the page and its filters.
 */
export function PetsSiteShell({
  children,
  standalone,
}: {
  children: ReactNode
  standalone: boolean
}) {
  const root = petsRoot(standalone)
  const { pathname, search, hash } = useLocation()
  const previewPath = `${pathname.replace(petsRoot(false), petsRoot(true))}${search}${hash}`
  const nav = (key: keyof typeof petsCopy.en.nav, path: string) => ({
    href: `${root}${path}`,
    label: { en: petsCopy.en.nav[key], tr: petsCopy.tr.nav[key] },
  })

  // Pages load lazily, so the browser's own jump to "#how" happens before the section exists.
  useEffect(() => {
    if (!hash) return
    // Wait a frame beat so the sections above have their final height.
    const timer = window.setTimeout(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' })
    }, 120)
    return () => window.clearTimeout(timer)
  }, [hash, pathname])

  return (
    <ShowcasePreviewFrame
      standalone={standalone}
      standalonePath={previewPath}
      title={{ en: petsCopy.en.frame.title, tr: petsCopy.tr.frame.title }}
      description={{ en: petsCopy.en.frame.description, tr: petsCopy.tr.frame.description }}
    >
      <PublicSiteShell
        brand={petsBrand}
        tagline={{ en: petsCopy.en.tagline, tr: petsCopy.tr.tagline }}
        className="pets-site"
        primary="#e0663e"
        homeHref={root}
        links={[
          nav('animals', '/animals'),
          nav('how', '#how'),
          nav('shelters', '#shelters'),
          nav('favorites', '/favorites'),
        ]}
        footer={<PetsFooter />}
      >
        <div className="pets-page">{children}</div>
      </PublicSiteShell>
    </ShowcasePreviewFrame>
  )
}
