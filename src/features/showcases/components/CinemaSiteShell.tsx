import { EnvironmentOutlined } from '@ant-design/icons'
import { Flex, Space, Typography } from 'antd'
import type { ReactNode } from 'react'
import { useLocation } from 'react-router'
import { PublicSiteShell } from '@/features/showcases/components/PublicSiteShell'
import { ShowcasePreviewFrame } from '@/features/showcases/components/ShowcasePreviewFrame'
import { cinemaPaths, cinemas } from '@/features/showcases/data/cinema'
import { cinemaCopy, useCinemaText } from '@/features/showcases/data/cinemaCopy'
import '../showcases.css'
import '../cinema.css'

interface CinemaSiteShellProps {
  children: ReactNode
  standalone: boolean
  page: keyof typeof cinemaCopy.en.frame
}

/** Every Lumen page: the site header and footer, in the admin's preview frame unless standalone. */
export function CinemaSiteShell({ children, standalone, page }: CinemaSiteShellProps) {
  const { text } = useCinemaText()
  const { pathname, search } = useLocation()
  const paths = cinemaPaths(standalone)
  const links = [
    { href: paths.root, key: 'films' as const },
    { href: `${paths.root}#cinema-soon`, key: 'soon' as const },
    { href: paths.tickets, key: 'tickets' as const },
  ].map(({ href, key }) => ({
    href,
    label: { en: cinemaCopy.en.nav[key], tr: cinemaCopy.tr.nav[key] },
  }))

  const footer = (
    <Flex justify="space-between" gap={24} wrap className="cinema-footer">
      <Space orientation="vertical" size={4}>
        <Typography.Text strong>{text.brand}</Typography.Text>
        <Typography.Text type="secondary" className="cinema-footer__note">
          {text.footerNote}
        </Typography.Text>
        <Typography.Text type="secondary">© 2026 {text.brand}</Typography.Text>
      </Space>
      <ul className="cinema-footer__venues">
        {cinemas.map((cinema) => (
          <li key={cinema.id}>
            <Typography.Text strong>{cinema.name}</Typography.Text>
            <Typography.Text type="secondary">
              <EnvironmentOutlined aria-hidden="true" /> {cinema.address}
            </Typography.Text>
          </li>
        ))}
      </ul>
    </Flex>
  )

  return (
    <ShowcasePreviewFrame
      standalone={standalone}
      standalonePath={`${pathname.replace('/showcases/cinema', '/preview/cinema')}${search}`}
      title={{ en: cinemaCopy.en.frame[page].title, tr: cinemaCopy.tr.frame[page].title }}
      description={{
        en: cinemaCopy.en.frame[page].description,
        tr: cinemaCopy.tr.frame[page].description,
      }}
    >
      <PublicSiteShell
        brand={text.brand}
        tagline={{ en: cinemaCopy.en.tagline, tr: cinemaCopy.tr.tagline }}
        className="cinema-site"
        primary="#d1204f"
        links={links}
        footer={footer}
      >
        {children}
      </PublicSiteShell>
    </ShowcasePreviewFrame>
  )
}
