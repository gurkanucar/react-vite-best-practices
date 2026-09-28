import {
  CheckCircleFilled,
  CloseCircleFilled,
  QuestionCircleOutlined,
  SafetyCertificateFilled,
  ShoppingCartOutlined,
  StarFilled,
} from '@ant-design/icons'
import { Button, Flex, Tag, Typography } from 'antd'
import { Link } from 'react-router'
import {
  discountPercent,
  findBrand,
  fitFor,
  fitsSummary,
  stockLevel,
  totalStock,
  type CategoryId,
  type Part,
} from '@/features/showcases/data/partsCatalog'
import { formatTry } from '@/features/showcases/data/partsCommerce'
import { shortCarName, type Vehicle } from '@/features/showcases/data/partsVehicles'
import { usePartsCopy } from '@/features/showcases/hooks/usePartsCopy'
import { usePartsStore } from '@/features/showcases/hooks/usePartsStore'

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 4,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

/** A line drawing per category: a catalogue this size has no photos, and needs none. */
function CategoryDrawing({ category }: { category: CategoryId }) {
  switch (category) {
    case 'brakes':
      return (
        <>
          <circle cx="56" cy="62" r="40" {...stroke} />
          <circle cx="56" cy="62" r="14" {...stroke} />
          {[0, 72, 144, 216, 288].map((angle) => (
            <circle
              key={angle}
              cx={56 + 24 * Math.cos((angle * Math.PI) / 180)}
              cy={62 + 24 * Math.sin((angle * Math.PI) / 180)}
              r="3"
              fill="currentColor"
            />
          ))}
          <path
            d="M86 28 a46 46 0 0 1 14 34 l-12 0 a34 34 0 0 0 -10 -26 z"
            className="parts-art__accent"
          />
        </>
      )
    case 'filters':
      return (
        <>
          <ellipse cx="60" cy="28" rx="32" ry="10" {...stroke} />
          <path d="M28 28 v62 a32 10 0 0 0 64 0 v-62" {...stroke} />
          {[38, 48, 58, 68, 78].map((x) => (
            <path
              key={x}
              d={`M${x} 42 v48`}
              {...stroke}
              strokeWidth={3}
              className="parts-art__soft"
            />
          ))}
          <ellipse cx="60" cy="28" rx="12" ry="4" className="parts-art__accent" />
        </>
      )
    case 'suspension':
      return (
        <>
          <rect x="50" y="14" width="20" height="44" rx="4" {...stroke} />
          <path d="M60 58 v48" {...stroke} />
          <path
            d="M38 40 l44 8 l-44 8 l44 8 l-44 8 l44 8 l-44 8 l44 8"
            {...stroke}
            className="parts-art__accent-stroke"
          />
        </>
      )
    case 'engine':
      return (
        <>
          <rect x="32" y="16" width="56" height="46" rx="6" {...stroke} />
          <path d="M32 28 h56 M32 36 h56" {...stroke} strokeWidth={3} className="parts-art__soft" />
          <circle cx="60" cy="50" r="6" className="parts-art__accent" />
          <path d="M60 56 l-10 48 h20 z" {...stroke} />
        </>
      )
    case 'electrical':
      return (
        <>
          <circle cx="60" cy="60" r="42" {...stroke} />
          <path d="M66 26 l-20 38 h16 l-8 30 l24 -42 h-16 z" className="parts-art__accent" />
        </>
      )
    case 'lighting':
      return (
        <>
          <path
            d="M20 36 q0 -12 14 -12 h30 q22 0 22 36 q0 36 -22 36 h-30 q-14 0 -14 -12 z"
            {...stroke}
          />
          <circle cx="50" cy="60" r="14" className="parts-art__accent" />
          <path d="M94 40 l16 -6 M96 60 h18 M94 80 l16 6" {...stroke} className="parts-art__soft" />
        </>
      )
    case 'cooling':
      return (
        <>
          <rect x="18" y="22" width="84" height="72" rx="6" {...stroke} />
          {[30, 42, 54, 66, 78, 90].map((x) => (
            <path
              key={x}
              d={`M${x} 30 v56`}
              {...stroke}
              strokeWidth={3}
              className="parts-art__soft"
            />
          ))}
          <rect x="10" y="40" width="10" height="16" rx="3" className="parts-art__accent" />
        </>
      )
    case 'exhaust':
      return (
        <>
          <rect x="30" y="40" width="64" height="40" rx="20" {...stroke} />
          <path d="M8 60 h22 M94 70 h16" {...stroke} />
          <path d="M44 52 h36 M44 68 h36" {...stroke} strokeWidth={3} className="parts-art__soft" />
          <circle cx="110" cy="70" r="5" className="parts-art__accent" />
        </>
      )
    case 'transmission':
      return (
        <>
          <circle cx="60" cy="60" r="44" {...stroke} />
          <circle cx="60" cy="60" r="28" {...stroke} className="parts-art__soft" />
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <rect
              key={angle}
              x="54"
              y="26"
              width="12"
              height="8"
              rx="2"
              className="parts-art__accent"
              transform={`rotate(${angle} 60 60)`}
            />
          ))}
          <circle cx="60" cy="60" r="9" fill="currentColor" />
        </>
      )
    case 'wipers':
      return (
        <>
          <path d="M16 96 Q60 20 104 40" {...stroke} />
          <path d="M60 104 L84 46" {...stroke} className="parts-art__accent-stroke" />
          <circle cx="60" cy="104" r="6" fill="currentColor" />
        </>
      )
    case 'batteries':
      return (
        <>
          <rect x="18" y="36" width="84" height="60" rx="6" {...stroke} />
          <rect x="30" y="24" width="14" height="12" rx="2" className="parts-art__accent" />
          <rect x="76" y="24" width="14" height="12" rx="2" fill="currentColor" />
          <path d="M31 62 h12 M37 56 v12 M77 62 h12" {...stroke} />
        </>
      )
    case 'fluids':
      return (
        <>
          <path
            d="M36 32 h40 l12 16 v50 a6 6 0 0 1 -6 6 h-52 a6 6 0 0 1 -6 -6 v-54 z"
            {...stroke}
          />
          <rect x="44" y="18" width="16" height="14" rx="2" fill="currentColor" />
          <path
            d="M60 56 q-12 16 -12 24 a12 12 0 0 0 24 0 q0 -8 -12 -24 z"
            className="parts-art__accent"
          />
        </>
      )
  }
}

export function PartVisual({
  category,
  size = 'medium',
}: {
  category: CategoryId
  size?: 'small' | 'medium' | 'large'
}) {
  return (
    <div className={`parts-art parts-art--${size} parts-art--${category}`} aria-hidden="true">
      <svg viewBox="0 0 120 120" role="presentation">
        <CategoryDrawing category={category} />
      </svg>
    </div>
  )
}

export function FitBadge({ part, vehicle }: { part: Part; vehicle?: Vehicle }) {
  const { text } = usePartsCopy()
  const openGarage = usePartsStore((state) => state.openGarage)
  const fit = fitFor(part, vehicle)
  if (fit === 'universal') {
    return (
      <Tag variant="filled" color="blue" icon={<SafetyCertificateFilled />} className="parts-fit">
        {text.fit.universal}
      </Tag>
    )
  }
  if (fit === 'unknown' || !vehicle) {
    return (
      <Button
        type="link"
        size="small"
        icon={<QuestionCircleOutlined />}
        onClick={openGarage}
        className="parts-fit parts-fit--unknown"
      >
        {text.fit.unknown}
      </Button>
    )
  }
  const car = shortCarName(vehicle)
  return fit === 'fits' ? (
    <Tag variant="filled" color="green" icon={<CheckCircleFilled />} className="parts-fit">
      {text.fit.fits(car)}
    </Tag>
  ) : (
    <Tag variant="filled" color="red" icon={<CloseCircleFilled />} className="parts-fit">
      {text.fit.doesNotFit(car)}
    </Tag>
  )
}

export function StockBadge({ part }: { part: Part }) {
  const { text } = usePartsCopy()
  const level = stockLevel(part)
  return (
    <span className={`parts-stock parts-stock--${level}`}>
      <span className="parts-stock__dot" aria-hidden="true" />
      {level === 'out'
        ? text.stock.out
        : level === 'low'
          ? text.stock.low(totalStock(part))
          : text.stock.inStock}
    </span>
  )
}

export function PriceTag({ part, size = 'medium' }: { part: Part; size?: 'medium' | 'large' }) {
  const { text, language } = usePartsCopy()
  const discount = discountPercent(part)
  return (
    <Flex align="baseline" gap={8} wrap className={`parts-price parts-price--${size}`}>
      <span className="parts-price__now">{formatTry(part.price, language)}</span>
      {part.compareAt && (
        <del className="parts-price__was">{formatTry(part.compareAt, language)}</del>
      )}
      {/* A card already flags the discount on its picture. */}
      {part.compareAt && size === 'large' && (
        <Tag color="volcano" variant="solid" className="parts-price__save">
          {text.card.save(discount)}
        </Tag>
      )}
    </Flex>
  )
}

interface PartCardProps {
  part: Part
  root: string
  vehicle?: Vehicle
  layout?: 'grid' | 'list'
}

export function PartCard({ part, root, vehicle, layout = 'grid' }: PartCardProps) {
  const { text, language } = usePartsCopy()
  const addToCart = usePartsStore((state) => state.addToCart)
  const brand = findBrand(part.brandId)
  const name = part.name[language]
  const href = `${root}/products/${part.id}`
  const fits = fitsSummary(part)
  const soldOut = totalStock(part) === 0

  return (
    <article className={`parts-card parts-card--${layout}`}>
      <Link to={href} className="parts-card__media" tabIndex={-1} aria-hidden="true">
        <PartVisual category={part.category} />
        {part.compareAt && (
          <span className="parts-card__ribbon">{text.card.save(discountPercent(part))}</span>
        )}
      </Link>
      <div className="parts-card__body">
        <Typography.Text type="secondary" className="parts-card__brand">
          {brand?.name} · <span className="parts-mono">{part.sku}</span>
        </Typography.Text>
        <Link to={href} className="parts-card__name">
          {name}
        </Link>
        {fits && (
          <Typography.Text type="secondary" className="parts-card__fits" ellipsis>
            {fits}
          </Typography.Text>
        )}
        <Flex gap={6} wrap align="center" className="parts-card__meta">
          <FitBadge part={part} vehicle={vehicle} />
          <span className="parts-card__rating">
            <StarFilled aria-hidden="true" /> {part.rating.toFixed(1)}
            <Typography.Text type="secondary"> ({part.reviews})</Typography.Text>
          </span>
        </Flex>
      </div>
      <div className="parts-card__buy">
        <PriceTag part={part} />
        <StockBadge part={part} />
        <Button
          type="primary"
          icon={<ShoppingCartOutlined />}
          disabled={soldOut}
          aria-label={text.card.addLabel(name)}
          onClick={() => addToCart(part.id)}
          block={layout === 'grid'}
        >
          {text.card.add}
        </Button>
      </div>
    </article>
  )
}
