import {
  CarOutlined,
  ClockCircleOutlined,
  MinusOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
  StarFilled,
  ThunderboltOutlined,
} from '@ant-design/icons'
import {
  App,
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Descriptions,
  Flex,
  Input,
  InputNumber,
  Result,
  Space,
  Table,
  Tabs,
  Tag,
  Typography,
} from 'antd'
import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import {
  FitBadge,
  PartCard,
  PartVisual,
  PriceTag,
  StockBadge,
} from '@/features/showcases/components/PartsBits'
import { PartsSiteShell } from '@/features/showcases/components/PartsSiteShell'
import {
  alternativesFor,
  boughtTogether,
  categoryNames,
  compatibilityRows,
  findBrand,
  findPart,
  foldText,
  positionNames,
  relatedParts,
  totalStock,
  warehouseIds,
  warehouseNames,
  type CompatibilityRow,
  type Part,
  type SpecValue,
} from '@/features/showcases/data/partsCatalog'
import { dispatchCutoff, formatTry, MAX_PER_LINE } from '@/features/showcases/data/partsCommerce'
import { partsRoot } from '@/features/showcases/data/partsCopy'
import { usePartsCopy } from '@/features/showcases/hooks/usePartsCopy'
import { usePartsNow } from '@/features/showcases/hooks/usePartsNow'
import { useActiveVehicle, usePartsStore } from '@/features/showcases/hooks/usePartsStore'

interface PartsProductPageProps {
  standalone?: boolean
}

const capitalise = (value: string, language: string) =>
  value.charAt(0).toLocaleUpperCase(language) + value.slice(1)

function SpecText({ value }: { value: SpecValue }) {
  const { text } = usePartsCopy()
  if (typeof value === 'boolean') return <>{value ? text.yes : text.no}</>
  return <>{text.specValues[value] ?? value}</>
}

function DispatchNotice({ part }: { part: Part }) {
  const { text, language } = usePartsCopy()
  const now = usePartsNow()
  if (totalStock(part) === 0) {
    return <Typography.Text type="secondary">{text.product.backorder}</Typography.Text>
  }
  const cutoff = dispatchCutoff(now)
  return (
    <Flex gap={8} align="center" className="parts-dispatch">
      {cutoff.shipsToday ? (
        <ThunderboltOutlined aria-hidden="true" />
      ) : (
        <ClockCircleOutlined aria-hidden="true" />
      )}
      <Typography.Text>
        {cutoff.shipsToday
          ? text.product.leavesToday(Math.floor(cutoff.minutesLeft / 60), cutoff.minutesLeft % 60)
          : text.product.leavesOn(cutoff.dispatchDay.locale(language).format('dddd, D MMMM'))}
      </Typography.Text>
    </Flex>
  )
}

function Compatibility({ part }: { part: Part }) {
  const { text } = usePartsCopy()
  const [filter, setFilter] = useState('')
  const rows = useMemo(() => compatibilityRows(part), [part])
  const shown = rows.filter((row) =>
    foldText(`${row.make} ${row.model} ${row.code} ${row.engine}`).includes(foldText(filter)),
  )
  if (part.fitment.kind === 'universal') {
    return <Typography.Paragraph>{text.product.universalFit}</Typography.Paragraph>
  }
  return (
    <Flex vertical gap={12}>
      {rows.length > 4 && (
        <Input
          allowClear
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          placeholder={text.product.fitFilter}
          aria-label={text.product.fitFilter}
          className="parts-fit-filter"
        />
      )}
      <Table<CompatibilityRow>
        size="small"
        rowKey="key"
        pagination={false}
        scroll={{ x: 560 }}
        dataSource={shown}
        columns={[
          { title: text.product.fitColumns.make, dataIndex: 'make' },
          {
            title: text.product.fitColumns.model,
            render: (_, row) => `${row.model} ${row.code}`,
          },
          { title: text.product.fitColumns.years, dataIndex: 'years' },
          { title: text.product.fitColumns.engine, dataIndex: 'engine' },
          {
            title: text.product.fitColumns.power,
            render: (_, row) => `${row.kw} kW / ${Math.round(row.kw * 1.36)} PS`,
          },
          {
            title: text.product.fitColumns.fuel,
            render: (_, row) => text.product.fuels[row.fuel],
          },
        ]}
      />
    </Flex>
  )
}

function BoughtTogether({ part, root }: { part: Part; root: string }) {
  const { text, language } = usePartsCopy()
  const vehicle = useActiveVehicle()
  const addToCart = usePartsStore((state) => state.addToCart)
  const extras = useMemo(() => boughtTogether(part, vehicle), [part, vehicle])
  const [unticked, setUnticked] = useState<string[]>([])
  if (extras.length === 0) return null
  const chosen = [part, ...extras.filter((extra) => !unticked.includes(extra.id))]
  const total = chosen.reduce((sum, item) => sum + item.price, 0)

  return (
    <Card className="parts-together" title={text.product.together}>
      <Typography.Paragraph type="secondary">{text.product.togetherText}</Typography.Paragraph>
      <ul className="parts-together__list">
        <li>
          <Checkbox checked disabled />
          <PartVisual category={part.category} size="small" />
          <span className="parts-together__name">
            <Typography.Text strong>{text.product.thisItem}</Typography.Text>
            <Typography.Text type="secondary">{part.name[language]}</Typography.Text>
          </span>
          <Typography.Text>{formatTry(part.price, language)}</Typography.Text>
        </li>
        {extras.map((extra) => (
          <li key={extra.id}>
            <Checkbox
              checked={!unticked.includes(extra.id)}
              aria-label={extra.name[language]}
              onChange={(event) =>
                setUnticked((current) =>
                  event.target.checked
                    ? current.filter((id) => id !== extra.id)
                    : [...current, extra.id],
                )
              }
            />
            <PartVisual category={extra.category} size="small" />
            <span className="parts-together__name">
              <Link to={`${root}/products/${extra.id}`}>{extra.name[language]}</Link>
              <Typography.Text type="secondary">
                {findBrand(extra.brandId)?.name} · <span className="parts-mono">{extra.sku}</span>
              </Typography.Text>
            </span>
            <Typography.Text>{formatTry(extra.price, language)}</Typography.Text>
          </li>
        ))}
      </ul>
      <Flex justify="space-between" align="center" gap={12} wrap>
        <Typography.Text>
          {text.product.togetherTotal}:{' '}
          <Typography.Text strong>{formatTry(total, language)}</Typography.Text>
        </Typography.Text>
        <Button
          type="primary"
          icon={<ShoppingCartOutlined />}
          disabled={totalStock(part) === 0}
          onClick={() => chosen.forEach((item) => addToCart(item.id))}
        >
          {text.product.addAll(chosen.length)}
        </Button>
      </Flex>
    </Card>
  )
}

function ProductDetail({ part, root }: { part: Part; root: string }) {
  const { text, language } = usePartsCopy()
  const { message } = App.useApp()
  const navigate = useNavigate()
  const vehicle = useActiveVehicle()
  const addToCart = usePartsStore((state) => state.addToCart)
  const closeCart = usePartsStore((state) => state.closeCart)
  const [quantity, setQuantity] = useState(1)
  const brand = findBrand(part.brandId)
  const stock = totalStock(part)
  const maxQuantity = Math.max(1, Math.min(stock, MAX_PER_LINE))
  const alternatives = useMemo(() => alternativesFor(part), [part])
  const related = useMemo(() => relatedParts(part), [part])
  const name = part.name[language]

  const general = [
    { key: 'brand', label: text.product.brand, children: brand?.name },
    {
      key: 'category',
      label: text.product.category,
      children: categoryNames[part.category][language],
    },
    ...(part.position
      ? [
          {
            key: 'position',
            label: text.product.position,
            children: capitalise(positionNames[part.position][language], language),
          },
        ]
      : []),
    ...part.specs.map(([key, value]) => ({
      key,
      label: text.specs[key],
      children: <SpecText value={value} />,
    })),
    {
      key: 'warranty',
      label: text.product.warrantyLabel,
      children: text.product.warranty(part.warranty),
    },
    { key: 'weight', label: text.product.weightLabel, children: text.product.weight(part.weight) },
  ]

  return (
    <>
      <div className="parts-product">
        <div className="parts-product__media">
          <PartVisual category={part.category} size="large" />
          <span className="parts-product__brand-mark">{brand?.name}</span>
        </div>

        <div className="parts-product__info">
          <Typography.Text type="secondary">
            {brand?.name} · {brand && text.product.brandFrom(brand.country[language])}
          </Typography.Text>
          <Typography.Title level={1} className="parts-product__title">
            {name}
          </Typography.Title>
          <Flex gap={12} wrap align="center">
            <Typography.Text>
              {text.product.partNo}:{' '}
              <Typography.Text strong copyable className="parts-mono">
                {part.sku}
              </Typography.Text>
            </Typography.Text>
            <span className="parts-card__rating">
              <StarFilled aria-hidden="true" /> {part.rating.toFixed(1)}{' '}
              <Typography.Text type="secondary">{text.card.reviews(part.reviews)}</Typography.Text>
            </span>
          </Flex>
          {part.oem.length > 0 && (
            <Flex gap={6} wrap align="center" className="parts-product__oem">
              <Typography.Text type="secondary">{text.product.oem}:</Typography.Text>
              {part.oem.map((entry) => (
                <Tag key={entry.number} className="parts-mono">
                  {entry.make} {entry.number}
                </Tag>
              ))}
            </Flex>
          )}

          <div className="parts-product__fit">
            <FitBadge part={part} vehicle={vehicle} />
          </div>

          <div className="parts-product__buy">
            <PriceTag part={part} size="large" />
            <Typography.Text type="secondary">
              {text.product.vatIncluded}
              {part.compareAt &&
                ` · ${text.product.saving(formatTry(part.compareAt - part.price, language))}`}
            </Typography.Text>

            <Flex gap={8} wrap align="center" className="parts-product__actions">
              <Space.Compact>
                <Button
                  icon={<MinusOutlined />}
                  aria-label="−"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  size="large"
                />
                <InputNumber
                  size="large"
                  min={1}
                  max={maxQuantity}
                  value={quantity}
                  controls={false}
                  aria-label={text.product.quantity}
                  className="parts-product__qty"
                  onChange={(value) => setQuantity(Math.min(Math.max(1, value ?? 1), maxQuantity))}
                />
                <Button
                  icon={<PlusOutlined />}
                  aria-label="+"
                  disabled={quantity >= maxQuantity}
                  onClick={() => setQuantity((value) => Math.min(maxQuantity, value + 1))}
                  size="large"
                />
              </Space.Compact>
              <Button
                type="primary"
                size="large"
                icon={<ShoppingCartOutlined />}
                disabled={stock === 0}
                onClick={() => {
                  addToCart(part.id, quantity)
                  void message.success(text.product.added)
                }}
              >
                {text.product.add}
              </Button>
              <Button
                size="large"
                disabled={stock === 0}
                onClick={() => {
                  addToCart(part.id, quantity)
                  closeCart()
                  void navigate(`${root}/checkout`)
                }}
              >
                {text.product.buyNow}
              </Button>
            </Flex>
            <DispatchNotice part={part} />
          </div>

          <div className="parts-product__stock">
            <Flex justify="space-between" align="center">
              <Typography.Text strong>{text.product.stockTitle}</Typography.Text>
              <StockBadge part={part} />
            </Flex>
            <ul>
              {warehouseIds.map((id) => (
                <li key={id}>
                  <span>{warehouseNames[id][language]}</span>
                  <span className={part.stock[id] > 0 ? 'has-stock' : 'no-stock'}>
                    {part.stock[id] > 0 ? text.product.units(part.stock[id]) : text.product.none}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="parts-product__below">
        <Tabs
          className="parts-product__tabs"
          items={[
            {
              key: 'specs',
              label: text.product.tabs.specs,
              children: (
                <Descriptions
                  bordered
                  size="small"
                  column={{ xs: 1, md: 2 }}
                  items={general}
                  className="parts-specs"
                />
              ),
            },
            {
              key: 'fit',
              label: (
                <span>
                  <CarOutlined /> {text.product.tabs.fit}
                </span>
              ),
              children: <Compatibility part={part} />,
            },
            ...(part.oem.length > 0
              ? [
                  {
                    key: 'oem',
                    label: text.product.tabs.oem,
                    children: (
                      <Flex vertical gap={12}>
                        <Typography.Text type="secondary">{text.product.oemHint}</Typography.Text>
                        <Table
                          size="small"
                          rowKey="number"
                          pagination={false}
                          dataSource={part.oem}
                          columns={[
                            { title: text.product.oemColumns.make, dataIndex: 'make' },
                            {
                              title: text.product.oemColumns.number,
                              dataIndex: 'number',
                              render: (value: string) => (
                                <Typography.Text copyable className="parts-mono">
                                  {value}
                                </Typography.Text>
                              ),
                            },
                          ]}
                        />
                      </Flex>
                    ),
                  },
                ]
              : []),
          ]}
        />
        <BoughtTogether key={part.id} part={part} root={root} />
      </div>

      {alternatives.length > 0 && (
        <section className="parts-section parts-section--flush">
          <Typography.Title level={3}>{text.product.alternatives}</Typography.Title>
          <div className="parts-grid parts-grid--row">
            {alternatives.map((item) => (
              <PartCard key={item.id} part={item} root={root} vehicle={vehicle} />
            ))}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="parts-section parts-section--flush">
          <Typography.Title level={3}>{text.product.related}</Typography.Title>
          <div className="parts-grid parts-grid--row">
            {related.map((item) => (
              <PartCard key={item.id} part={item} root={root} vehicle={vehicle} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}

export function PartsProductPage({ standalone = false }: PartsProductPageProps) {
  const { text, language } = usePartsCopy()
  const root = partsRoot(standalone)
  const { partId = '' } = useParams()
  const part = findPart(partId)

  return (
    <PartsSiteShell standalone={standalone}>
      <div className="parts-section">
        {part ? (
          <>
            <Breadcrumb
              className="parts-breadcrumb"
              items={[
                { title: <Link to={root}>{text.product.home}</Link> },
                { title: <Link to={`${root}/catalog`}>{text.product.catalog}</Link> },
                {
                  title: (
                    <Link to={`${root}/catalog?category=${part.category}`}>
                      {categoryNames[part.category][language]}
                    </Link>
                  ),
                },
                { title: part.name[language] },
              ]}
            />
            {/* Keyed so quantity and ticks start fresh when moving to another part. */}
            <ProductDetail key={part.id} part={part} root={root} />
          </>
        ) : (
          <Result
            status="404"
            title={text.product.notFound}
            subTitle={text.product.notFoundText}
            extra={
              <Link to={`${root}/catalog`}>
                <Button type="primary">{text.product.backToCatalog}</Button>
              </Link>
            }
          />
        )}
      </div>
    </PartsSiteShell>
  )
}
