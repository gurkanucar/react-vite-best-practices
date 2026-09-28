import {
  CheckCircleOutlined,
  MinusOutlined,
  PlusOutlined,
  ShoppingOutlined,
  StarFilled,
} from '@ant-design/icons'
import {
  Breadcrumb,
  Button,
  Descriptions,
  Flex,
  Image,
  InputNumber,
  Progress,
  Rate,
  Result,
  Space,
  Tabs,
  Tag,
  Typography,
} from 'antd'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { ShowcasePreviewFrame } from '@/features/showcases/components'
import { StoreProductCard } from '@/features/showcases/components/StoreProductCard'
import { StoreSiteShell } from '@/features/showcases/components/StoreSiteShell'
import {
  findStoreColour,
  findStoreProduct,
  storeProducts,
  storeReviews,
  type StoreProduct,
} from '@/features/showcases/data/store'
import { ART_VIEWS, productArt } from '@/features/showcases/data/storeArt'
import {
  compareAtPrice,
  findVariant,
  formatPrice,
  stockLevel,
  unitPrice,
} from '@/features/showcases/data/storeCart'
import { storeCopy, storeRoot } from '@/features/showcases/data/storeCopy'
import { useStoreCart } from '@/features/showcases/hooks/useStoreCart'
import { useStoreCopy } from '@/features/showcases/hooks/useStoreCopy'
import '../showcases.css'
import '../store.css'

interface StoreProductPageProps {
  standalone?: boolean
}

/** Starts on the first colour and size that is in stock, so the page never opens sold out. */
function initialChoice(product: StoreProduct) {
  const variant = product.variants.find((entry) => entry.stock > 0) ?? product.variants[0]!
  return { colour: variant.colour, size: variant.size }
}

function ProductDetail({ product, root }: { product: StoreProduct; root: string }) {
  const { text, language } = useStoreCopy()
  const add = useStoreCart((state) => state.add)
  const openDrawer = useStoreCart((state) => state.openDrawer)
  const [choice, setChoice] = useState(() => initialChoice(product))
  const [quantity, setQuantity] = useState(1)
  const [picture, setPicture] = useState(0)

  const name = product.name[language]
  const colours = [...new Set(product.variants.map((variant) => variant.colour))]
  const colour = findStoreColour(choice.colour)
  const variant = findVariant(product, choice.colour, choice.size)
  const stock = variant?.stock ?? 0
  const level = stockLevel(stock)
  const price = unitPrice(product, variant)
  const compareAt = compareAtPrice(product, variant)
  const pictures = ART_VIEWS.map((view) => productArt(product.shape, colour.hex, view))
  const reviews = [0, 1, 2].map(
    (offset) => storeReviews[(storeProducts.indexOf(product) + offset * 2) % storeReviews.length]!,
  )
  const related = storeProducts
    .filter((entry) => entry.category === product.category && entry.id !== product.id)
    .concat(storeProducts.filter((entry) => entry.category !== product.category))
    .slice(0, 4)
  // Invented, but shaped like real ratings: mostly fives, a thin tail.
  const distribution = [0.72, 0.18, 0.06, 0.03, 0.01].map((share) =>
    Math.round(share * product.reviewCount),
  )

  const pick = (next: { colour?: string; size?: string }) => {
    setChoice((current) => ({ ...current, ...next }))
    setQuantity(1)
  }

  const addToCart = () => {
    add({ productId: product.id, colour: choice.colour, size: choice.size, quantity })
    openDrawer()
  }

  return (
    <>
      <div className="store-page">
        <Breadcrumb
          className="store-breadcrumb"
          items={[
            { title: <Link to={root}>{text.breadcrumbHome}</Link> },
            {
              title: (
                <Link to={`${root}?category=${product.category}#catalog`}>
                  {text.categories[product.category]}
                </Link>
              ),
            },
            { title: name },
          ]}
        />

        <div className="store-product">
          <div className="store-gallery">
            <Image.PreviewGroup
              items={pictures.map((src) => ({ src }))}
              preview={{ current: picture, onChange: setPicture }}
            >
              <Image
                src={pictures[picture]}
                alt={text.gallery(name, picture + 1)}
                className="store-gallery__main"
                rootClassName="store-gallery__frame"
              />
            </Image.PreviewGroup>
            <div className="store-gallery__thumbs">
              {pictures.map((src, index) => (
                <button
                  key={ART_VIEWS[index]}
                  type="button"
                  className="store-gallery__thumb"
                  aria-pressed={picture === index}
                  aria-label={text.gallery(name, index + 1)}
                  onClick={() => setPicture(index)}
                >
                  <img src={src} alt="" />
                </button>
              ))}
            </div>
          </div>

          <div className="store-buy">
            <Typography.Text type="secondary" className="store-buy__category">
              {text.categories[product.category]}
            </Typography.Text>
            <Typography.Title className="store-buy__title">{name}</Typography.Title>
            <Flex align="center" gap={8} wrap>
              <Rate disabled allowHalf value={product.rating} className="store-buy__rate" />
              <Typography.Text>{product.rating.toFixed(1)}</Typography.Text>
              <Typography.Text type="secondary">
                · {text.reviews(product.reviewCount)}
              </Typography.Text>
            </Flex>

            <Flex align="baseline" gap={12} wrap className="store-buy__price">
              <Typography.Text strong className={compareAt ? 'store-price--sale' : undefined}>
                {formatPrice(price, language)}
              </Typography.Text>
              {compareAt && (
                <>
                  <Typography.Text delete type="secondary">
                    {formatPrice(compareAt, language)}
                  </Typography.Text>
                  <Tag color="volcano" variant="filled">
                    {text.youSave(formatPrice(compareAt - price, language))}
                  </Tag>
                </>
              )}
            </Flex>
            <Typography.Paragraph className="store-buy__summary">
              {product.summary[language]}
            </Typography.Paragraph>

            <div className="store-option">
              <Typography.Text strong>
                {text.colour}: <span className="store-option__value">{colour.name[language]}</span>
              </Typography.Text>
              <Flex gap={10} wrap className="store-swatches">
                {colours.map((id) => {
                  const entry = findStoreColour(id)
                  const soldOut = product.variants
                    .filter((item) => item.colour === id)
                    .every((item) => item.stock === 0)
                  return (
                    <button
                      key={id}
                      type="button"
                      className={`store-swatch store-swatch--large${soldOut ? ' store-swatch--out' : ''}`}
                      aria-pressed={choice.colour === id}
                      aria-label={entry.name[language]}
                      title={entry.name[language]}
                      style={{ background: entry.hex }}
                      onClick={() => pick({ colour: id })}
                    />
                  )
                })}
              </Flex>
            </div>

            {product.sizes && (
              <div className="store-option">
                <Typography.Text strong>{text.size}</Typography.Text>
                <Flex gap={8} wrap>
                  {product.sizes.map((size) => {
                    const out = (findVariant(product, choice.colour, size)?.stock ?? 0) === 0
                    return (
                      <Button
                        key={size}
                        type={choice.size === size ? 'primary' : 'default'}
                        aria-pressed={choice.size === size}
                        className={out ? 'store-size store-size--out' : 'store-size'}
                        onClick={() => pick({ size })}
                      >
                        {size}
                      </Button>
                    )
                  })}
                </Flex>
              </div>
            )}

            <output className={`store-stock store-stock--${level}`} aria-live="polite">
              {level === 'out'
                ? text.variantSoldOut
                : level === 'low'
                  ? text.onlyLeft(stock)
                  : text.inStock}
            </output>

            <Flex gap={12} wrap className="store-buy__actions">
              <Space.Compact>
                <Button
                  icon={<MinusOutlined aria-hidden="true" />}
                  aria-label={text.decrease}
                  disabled={quantity <= 1 || level === 'out'}
                  onClick={() => setQuantity((value) => value - 1)}
                  size="large"
                />
                <InputNumber
                  size="large"
                  min={1}
                  max={Math.max(stock, 1)}
                  value={quantity}
                  controls={false}
                  aria-label={text.quantity}
                  disabled={level === 'out'}
                  onChange={(value) => setQuantity(value ?? 1)}
                  className="store-buy__quantity"
                />
                <Button
                  icon={<PlusOutlined aria-hidden="true" />}
                  aria-label={text.increase}
                  disabled={quantity >= stock}
                  onClick={() => setQuantity((value) => value + 1)}
                  size="large"
                />
              </Space.Compact>
              <Button
                type="primary"
                size="large"
                icon={<ShoppingOutlined aria-hidden="true" />}
                disabled={level === 'out'}
                onClick={addToCart}
                className="store-buy__add"
              >
                {level === 'out' ? text.soldOut : text.addToCart}
              </Button>
            </Flex>

            <ul className="store-buy__perks">
              {text.delivery.map((line) => (
                <li key={line}>
                  <CheckCircleOutlined aria-hidden="true" /> {line}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Tabs
          className="store-product__tabs"
          items={[
            {
              key: 'description',
              label: text.description,
              children: (
                <Typography.Paragraph className="store-product__description">
                  {product.description[language]}
                </Typography.Paragraph>
              ),
            },
            {
              key: 'details',
              label: text.details,
              children: (
                <Descriptions
                  bordered
                  column={1}
                  size="small"
                  items={product.specs.map((spec) => ({
                    key: spec.label.en,
                    label: spec.label[language],
                    children: spec.value[language],
                  }))}
                />
              ),
            },
            {
              key: 'reviews',
              label: `${text.reviewsTab} (${product.reviewCount})`,
              children: (
                <div className="store-reviews">
                  <div className="store-reviews__summary">
                    <Typography.Title level={2}>{product.rating.toFixed(1)}</Typography.Title>
                    <Rate disabled allowHalf value={product.rating} />
                    <Typography.Text type="secondary">
                      {text.reviewSummary(product.reviewCount)}
                    </Typography.Text>
                    <ul className="store-reviews__bars">
                      {distribution.map((count, index) => (
                        <li key={5 - index}>
                          <span>
                            {5 - index} <StarFilled aria-hidden="true" />
                          </span>
                          <Progress
                            percent={Math.round((count / product.reviewCount) * 100)}
                            size="small"
                            showInfo={false}
                            strokeColor="#e2a73a"
                            aria-hidden="true"
                          />
                          <Typography.Text type="secondary">{count}</Typography.Text>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <ul className="store-reviews__list">
                    {reviews.map((review) => (
                      <li key={review.author}>
                        <Flex justify="space-between" gap={8} wrap>
                          <Typography.Text strong>{review.author}</Typography.Text>
                          <Typography.Text type="secondary">
                            {new Date(review.date).toLocaleDateString(
                              language === 'tr' ? 'tr-TR' : 'en-GB',
                              { day: 'numeric', month: 'long', year: 'numeric' },
                            )}
                          </Typography.Text>
                        </Flex>
                        <Rate disabled value={review.rating} className="store-reviews__stars" />
                        <Typography.Paragraph>{review.body[language]}</Typography.Paragraph>
                      </li>
                    ))}
                  </ul>
                </div>
              ),
            },
          ]}
        />
      </div>

      <section className="store-related" aria-labelledby="store-related-title">
        <Typography.Title level={2} id="store-related-title">
          {text.related}
        </Typography.Title>
        <div className="store-grid store-grid--four">
          {related.map((entry) => (
            <StoreProductCard key={entry.id} product={entry} root={root} />
          ))}
        </div>
      </section>
    </>
  )
}

export function StoreProductPage({ standalone = false }: StoreProductPageProps) {
  const { text } = useStoreCopy()
  const navigate = useNavigate()
  const { productId } = useParams()
  const product = findStoreProduct(productId)
  const root = storeRoot(standalone)

  const page = (
    <StoreSiteShell standalone={standalone}>
      {product ? (
        // Keyed so that moving to a related product starts from its own first colour.
        <ProductDetail key={product.id} product={product} root={root} />
      ) : (
        <Result
          status="404"
          title={text.notFoundTitle}
          subTitle={text.notFoundText}
          extra={
            <Button type="primary" onClick={() => void navigate(root)}>
              {text.backToShop}
            </Button>
          }
        />
      )}
    </StoreSiteShell>
  )

  return (
    <ShowcasePreviewFrame
      standalone={standalone}
      standalonePath={`/preview/store/products/${productId ?? ''}`}
      title={{ en: storeCopy.en.previewTitle, tr: storeCopy.tr.previewTitle }}
      description={{ en: storeCopy.en.previewDescription, tr: storeCopy.tr.previewDescription }}
    >
      {page}
    </ShowcasePreviewFrame>
  )
}
