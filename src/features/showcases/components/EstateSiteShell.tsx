import { EnvironmentOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons'
import { Flex, Space, Typography } from 'antd'
import type { ReactNode } from 'react'
import { useLocation } from 'react-router'
import { PublicSiteShell } from '@/features/showcases/components/PublicSiteShell'
import { ShowcasePreviewFrame } from '@/features/showcases/components/ShowcasePreviewFrame'
import {
  CITIES,
  estateComparePath,
  estateListingsPath,
  estateRoot,
} from '@/features/showcases/data/estate'
import { estateCopy } from '@/features/showcases/data/estateCopy'
import { useEstateText } from '@/features/showcases/hooks/useEstateText'
import '../showcases.css'
import '../estate.css'

interface EstateSiteShellProps {
  children: ReactNode
  standalone: boolean
  page: keyof typeof estateCopy.en.frame
}

/**
 * Every Mesken page: the site header and footer, inside the admin's preview frame unless it
 * is the standalone site. "Open in a new tab" keeps the search, so a filtered map opens as is.
 */
export function EstateSiteShell({ children, standalone, page }: EstateSiteShellProps) {
  const { text } = useEstateText()
  const { pathname, search } = useLocation()
  const root = estateRoot(standalone)
  const listings = estateListingsPath(standalone)
  const links = (['listings', 'neighbourhoods', 'mortgage', 'agents', 'compare'] as const).map(
    (key) => ({
      href: {
        listings,
        neighbourhoods: `${root}#estate-neighbourhoods`,
        mortgage: `${root}#estate-mortgage`,
        agents: `${root}#estate-agents`,
        compare: estateComparePath(standalone),
      }[key],
      label: { en: estateCopy.en.nav[key], tr: estateCopy.tr.nav[key] },
    }),
  )

  const footer = (
    <div className="estate-footer">
      <Space orientation="vertical" size={6} className="estate-footer__brand">
        <Typography.Text strong>{text.brand}</Typography.Text>
        <Typography.Text type="secondary">{text.tagline}</Typography.Text>
        <Typography.Text type="secondary" className="estate-footer__note">
          {text.footerNote}
        </Typography.Text>
      </Space>
      <nav aria-label={text.footerColumns.cities}>
        <Typography.Text strong>{text.footerColumns.cities}</Typography.Text>
        <ul>
          {CITIES.map((city) => (
            <li key={city}>
              <a href={`${listings}?city=${city}`}>{text.cities[city]}</a>
            </li>
          ))}
        </ul>
      </nav>
      <div>
        <Typography.Text strong>{text.footerColumns.services}</Typography.Text>
        <ul>
          {text.services.map((service) => (
            <li key={service}>
              <Typography.Text type="secondary">{service}</Typography.Text>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <Typography.Text strong>{text.footerColumns.contact}</Typography.Text>
        <ul>
          <li>
            <Typography.Text type="secondary">
              <EnvironmentOutlined aria-hidden="true" /> {text.office}
            </Typography.Text>
          </li>
          <li>
            <PhoneOutlined aria-hidden="true" /> <a href="tel:+902165550100">+90 216 555 01 00</a>
          </li>
          <li>
            <MailOutlined aria-hidden="true" />{' '}
            <a href="mailto:hello@mesken.example">hello@mesken.example</a>
          </li>
        </ul>
      </div>
      <Flex justify="space-between" gap={12} wrap className="estate-footer__legal">
        <Typography.Text type="secondary">© 2026 {text.brand}</Typography.Text>
        <a href="https://unsplash.com" target="_blank" rel="noreferrer">
          {text.photoCredit}
        </a>
      </Flex>
    </div>
  )

  return (
    <ShowcasePreviewFrame
      standalone={standalone}
      standalonePath={`${pathname.replace('/showcases/estate', '/preview/estate')}${search}`}
      title={{ en: estateCopy.en.frame[page].title, tr: estateCopy.tr.frame[page].title }}
      description={{
        en: estateCopy.en.frame[page].description,
        tr: estateCopy.tr.frame[page].description,
      }}
    >
      <PublicSiteShell
        brand={text.brand}
        tagline={{ en: estateCopy.en.tagline, tr: estateCopy.tr.tagline }}
        className="estate-site"
        primary="#1d6b52"
        homeHref={root}
        links={links}
        footer={footer}
      >
        {children}
      </PublicSiteShell>
    </ShowcasePreviewFrame>
  )
}
