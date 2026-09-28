import { EnvironmentOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons'
import { Flex, Space, Typography } from 'antd'
import type { ReactNode } from 'react'
import { useLocation } from 'react-router'
import { PublicSiteShell } from '@/features/showcases/components/PublicSiteShell'
import { ShowcasePreviewFrame } from '@/features/showcases/components/ShowcasePreviewFrame'
import { hotelRoot } from '@/features/showcases/data/hotel'
import { hotelCopy, useHotelText } from '@/features/showcases/data/hotelCopy'
import '../showcases.css'
import '../hotel.css'

interface HotelSiteShellProps {
  children: ReactNode
  standalone: boolean
  /** The admin preview's heading for this page. */
  title: { en: string; tr: string }
  description: { en: string; tr: string }
}

/**
 * Every Kaia Bay page: the site header and footer, inside the admin's preview frame unless it
 * is the standalone site. The "open in a new tab" link keeps the page's search, so a stay
 * opens with its dates.
 */
export function HotelSiteShell({ children, standalone, title, description }: HotelSiteShellProps) {
  const { text } = useHotelText()
  const { pathname, search } = useLocation()
  const root = hotelRoot(standalone)
  const links = (['stay', 'rooms', 'dining', 'location'] as const).map((key) => ({
    href: {
      stay: root,
      rooms: `${root}/rooms`,
      dining: `${root}#hotel-dining`,
      location: `${root}#hotel-location`,
    }[key],
    label: { en: hotelCopy.en.nav[key], tr: hotelCopy.tr.nav[key] },
  }))

  const footer = (
    <Flex justify="space-between" gap={24} wrap className="hotel-footer">
      <Space orientation="vertical" size={4}>
        <Typography.Text strong>{text.brand}</Typography.Text>
        <Typography.Text type="secondary">
          <EnvironmentOutlined aria-hidden="true" /> {text.address}
        </Typography.Text>
        <Typography.Text type="secondary">
          <PhoneOutlined aria-hidden="true" /> <a href="tel:+902523870000">+90 252 387 00 00</a>
          {' · '}
          <MailOutlined aria-hidden="true" />{' '}
          <a href="mailto:stay@kaiabay.example">stay@kaiabay.example</a>
        </Typography.Text>
      </Space>
      <Space orientation="vertical" size={4} className="hotel-footer__note">
        <Typography.Text type="secondary">{text.footerNote}</Typography.Text>
        <Typography.Text type="secondary">
          © 2026 {text.brand} ·{' '}
          <a href="https://unsplash.com" target="_blank" rel="noreferrer">
            {text.photoCredit}
          </a>
        </Typography.Text>
      </Space>
    </Flex>
  )

  return (
    <ShowcasePreviewFrame
      standalone={standalone}
      standalonePath={`${pathname.replace('/showcases/hotel', '/preview/hotel')}${search}`}
      title={title}
      description={description}
    >
      <PublicSiteShell
        brand={text.brand}
        tagline={{ en: hotelCopy.en.tagline, tr: hotelCopy.tr.tagline }}
        className="hotel-site"
        primary="#1f5f7a"
        links={links}
        footer={footer}
      >
        {children}
      </PublicSiteShell>
    </ShowcasePreviewFrame>
  )
}
