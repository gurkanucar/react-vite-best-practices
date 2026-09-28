import { ShoppingOutlined } from '@ant-design/icons'
import { Badge, Button, Typography } from 'antd'
import type { ReactNode } from 'react'
import { PublicSiteShell } from '@/features/showcases/components/PublicSiteShell'
import { StoreCartDrawer } from '@/features/showcases/components/StoreCartDrawer'
import {
  storeCopy,
  STORE_BRAND,
  STORE_PRIMARY,
  storeRoot,
} from '@/features/showcases/data/storeCopy'
import { useStoreCart } from '@/features/showcases/hooks/useStoreCart'
import { useStoreCopy } from '@/features/showcases/hooks/useStoreCopy'

interface StoreSiteShellProps {
  children: ReactNode
  standalone: boolean
}

/**
 * The shop's frame: the shared site header, then a bar that stays in view while scrolling
 * with the delivery promise and the cart, which opens the cart drawer from any page.
 */
export function StoreSiteShell({ children, standalone }: StoreSiteShellProps) {
  const { text } = useStoreCopy()
  const root = storeRoot(standalone)
  const itemCount = useStoreCart((state) =>
    state.lines.reduce((sum, line) => sum + line.quantity, 0),
  )
  const openDrawer = useStoreCart((state) => state.openDrawer)

  return (
    <PublicSiteShell
      brand={STORE_BRAND}
      tagline={{ en: storeCopy.en.tagline, tr: storeCopy.tr.tagline }}
      className="store-site"
      primary={STORE_PRIMARY}
      homeHref={root}
      links={[
        { href: root, label: { en: storeCopy.en.nav.shop, tr: storeCopy.tr.nav.shop } },
        {
          href: `${root}?sort=newest#catalog`,
          label: { en: storeCopy.en.nav.newIn, tr: storeCopy.tr.nav.newIn },
        },
        {
          href: `${root}?sale=1#catalog`,
          label: { en: storeCopy.en.nav.sale, tr: storeCopy.tr.nav.sale },
        },
      ]}
    >
      <div className="store-bar">
        <div className="store-bar__inner">
          <Typography.Text className="store-bar__note">{text.announcement}</Typography.Text>
          <Badge count={itemCount} size="small" color={STORE_PRIMARY}>
            <Button
              icon={<ShoppingOutlined aria-hidden="true" />}
              onClick={openDrawer}
              aria-label={text.cartWithCount(itemCount)}
              className="store-bar__cart"
            >
              <span className="store-bar__cart-label">{text.cart}</span>
            </Button>
          </Badge>
        </div>
      </div>
      {children}
      <StoreCartDrawer root={root} />
    </PublicSiteShell>
  )
}
