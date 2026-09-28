import { InfoCircleOutlined } from '@ant-design/icons'
import { Flex, Space, Typography } from 'antd'
import type { ReactNode } from 'react'
import { useLocation } from 'react-router'
import { PublicSiteShell } from '@/features/showcases/components/PublicSiteShell'
import { ShowcasePreviewFrame } from '@/features/showcases/components/ShowcasePreviewFrame'
import {
  CITY_IDS,
  cities,
  cityEventsPath,
  cityExplorePath,
  cityPath,
  cityRoot,
} from '@/features/showcases/data/cityGuide'
import { cityCopy } from '@/features/showcases/data/cityCopy'
import { useCityCopy } from '@/features/showcases/hooks/useCityCopy'
import '../showcases.css'
import '../city.css'

interface CitySiteShellProps {
  children: ReactNode
  standalone: boolean
  page: keyof typeof cityCopy.en.frame
}

/** Every Şehirname page: the header with both cities, the footer and the demo data note. */
export function CitySiteShell({ children, standalone, page }: CitySiteShellProps) {
  const { text, t } = useCityCopy()
  const { pathname, search } = useLocation()
  const root = cityRoot(standalone)

  const links = [
    { href: root, label: { en: cityCopy.en.nav.cities, tr: cityCopy.tr.nav.cities } },
    ...CITY_IDS.map((id) => ({ href: cityPath(standalone, id), label: cities[id].name })),
  ]

  const footer = (
    <div className="city-footer">
      <Space orientation="vertical" size={6} className="city-footer__brand">
        <Typography.Text strong>{text.brand}</Typography.Text>
        <Typography.Text type="secondary">{text.footer.aboutText}</Typography.Text>
      </Space>
      {CITY_IDS.map((id) => (
        <nav key={id} aria-label={t(cities[id].name)}>
          <Typography.Text strong>{t(cities[id].name)}</Typography.Text>
          <ul>
            <li>
              <a href={cityPath(standalone, id)}>{text.city.overview}</a>
            </li>
            <li>
              <a href={cityExplorePath(standalone, id)}>{text.city.explore}</a>
            </li>
            <li>
              <a href={cityExplorePath(standalone, id, 'cat=food')}>{text.categories.food}</a>
            </li>
            <li>
              <a href={cityEventsPath(standalone, id)}>{text.city.events}</a>
            </li>
          </ul>
        </nav>
      ))}
      <p className="city-footer__note">
        <InfoCircleOutlined aria-hidden="true" /> {text.demoNote}
      </p>
      <Flex justify="space-between" gap={12} wrap className="city-footer__legal">
        <Typography.Text type="secondary">© 2026 {text.brand}</Typography.Text>
        <Typography.Text type="secondary">{text.footer.mapCredit}</Typography.Text>
      </Flex>
    </div>
  )

  return (
    <ShowcasePreviewFrame
      standalone={standalone}
      standalonePath={`${pathname.replace('/showcases/city', '/preview/city')}${search}`}
      title={{ en: cityCopy.en.frame[page].title, tr: cityCopy.tr.frame[page].title }}
      description={{
        en: cityCopy.en.frame[page].description,
        tr: cityCopy.tr.frame[page].description,
      }}
    >
      <PublicSiteShell
        brand={text.brand}
        tagline={{ en: cityCopy.en.tagline, tr: cityCopy.tr.tagline }}
        className="city-site"
        primary="#1f5f8b"
        homeHref={root}
        links={links}
        footer={footer}
      >
        {children}
      </PublicSiteShell>
    </ShowcasePreviewFrame>
  )
}
