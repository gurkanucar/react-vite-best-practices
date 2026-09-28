import { CarOutlined, DownOutlined, PhoneOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { Badge, Button, Col, Divider, Flex, Row, Space, Typography } from 'antd'
import type { ReactNode } from 'react'
import { useLocation } from 'react-router'
import { PartsCartDrawer } from '@/features/showcases/components/PartsCartDrawer'
import { GarageModal } from '@/features/showcases/components/PartsGarage'
import { PartsSearch } from '@/features/showcases/components/PartsSearch'
import { PublicSiteShell } from '@/features/showcases/components/PublicSiteShell'
import { ShowcasePreviewFrame } from '@/features/showcases/components/ShowcasePreviewFrame'
import { partsBrand, partsCopy, partsRoot } from '@/features/showcases/data/partsCopy'
import { vehicleName } from '@/features/showcases/data/partsVehicles'
import { usePartsCopy } from '@/features/showcases/hooks/usePartsCopy'
import { useActiveVehicle, usePartsStore } from '@/features/showcases/hooks/usePartsStore'
import '../showcases.css'
import '../parts.css'

interface PartsSiteShellProps {
  children: ReactNode
  standalone: boolean
}

function PartsToolbar({ root }: { root: string }) {
  const { text } = usePartsCopy()
  const { search } = useLocation()
  const vehicle = useActiveVehicle()
  const cartCount = usePartsStore((state) =>
    state.cart.reduce((sum, line) => sum + line.quantity, 0),
  )
  const openCart = usePartsStore((state) => state.openCart)
  const openGarage = usePartsStore((state) => state.openGarage)
  const query = new URLSearchParams(search).get('q') ?? ''

  return (
    <div className="parts-toolbar">
      <div className="parts-toolbar__inner">
        <Button
          size="large"
          icon={<CarOutlined />}
          onClick={openGarage}
          className={vehicle ? 'parts-toolbar__garage has-car' : 'parts-toolbar__garage'}
        >
          <span className="parts-toolbar__garage-text">
            {vehicle ? vehicleName(vehicle) : text.garage.button}
          </span>
          <DownOutlined aria-hidden="true" className="parts-toolbar__chevron" />
        </Button>
        <div className="parts-toolbar__search">
          {/* Keyed by the query, so a new search from elsewhere refills the box. */}
          <PartsSearch key={query} root={root} initial={query} />
        </div>
        <Badge count={cartCount} size="small" offset={[-6, 6]} color="#e8590c">
          <Button
            size="large"
            icon={<ShoppingCartOutlined />}
            onClick={openCart}
            aria-label={text.cart.open(cartCount)}
            className="parts-toolbar__cart"
          >
            <span className="parts-toolbar__cart-text">{text.cart.title}</span>
          </Button>
        </Badge>
      </div>
    </div>
  )
}

function PartsFooter() {
  const { text } = usePartsCopy()
  return (
    <div className="parts-footer">
      <Row gutter={[32, 28]}>
        <Col xs={24} lg={9}>
          <Space orientation="vertical" size={10}>
            <Typography.Text strong className="parts-footer__brand">
              {partsBrand}
            </Typography.Text>
            <Typography.Text type="secondary">{text.footer.about}</Typography.Text>
            <Typography.Text>
              <PhoneOutlined aria-hidden="true" /> {text.footer.phone}
            </Typography.Text>
          </Space>
        </Col>
        {text.footer.columns.map(([title, links]) => (
          <Col xs={12} md={8} lg={5} key={title}>
            <Typography.Title level={5}>{title}</Typography.Title>
            <ul className="parts-footer__links">
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
        © 2026 {partsBrand}. {text.footer.rights}
      </Typography.Text>
    </div>
  )
}

/**
 * The shop's frame: header, a sticky bar with the garage, search and cart, and the footer.
 * Inside the admin it sits in the preview frame, whose "open in a new tab" keeps the page.
 */
export function PartsSiteShell({ children, standalone }: PartsSiteShellProps) {
  const root = partsRoot(standalone)
  const { pathname, search } = useLocation()
  const previewPath = `${pathname.replace(partsRoot(false), partsRoot(true))}${search}`
  const links = [
    { href: root, label: { en: partsCopy.en.nav.home, tr: partsCopy.tr.nav.home } },
    {
      href: `${root}/catalog`,
      label: { en: partsCopy.en.nav.catalog, tr: partsCopy.tr.nav.catalog },
    },
    {
      href: `${root}/orders`,
      label: { en: partsCopy.en.nav.orders, tr: partsCopy.tr.nav.orders },
    },
  ]

  return (
    <ShowcasePreviewFrame
      standalone={standalone}
      standalonePath={previewPath}
      title={{ en: partsCopy.en.frame.title, tr: partsCopy.tr.frame.title }}
      description={{ en: partsCopy.en.frame.description, tr: partsCopy.tr.frame.description }}
    >
      <PublicSiteShell
        brand={partsBrand}
        tagline={{ en: partsCopy.en.tagline, tr: partsCopy.tr.tagline }}
        className="parts-site"
        primary="#e8590c"
        homeHref={root}
        links={links}
        footer={<PartsFooter />}
      >
        <PartsToolbar root={root} />
        <Flex vertical className="parts-page">
          {children}
        </Flex>
        <GarageModal />
        <PartsCartDrawer root={root} />
      </PublicSiteShell>
    </ShowcasePreviewFrame>
  )
}
