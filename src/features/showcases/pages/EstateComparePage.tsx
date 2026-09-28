import {
  CheckOutlined,
  CloseOutlined,
  LinkOutlined,
  MinusOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import { App, Button, Empty, Flex, Tag, Typography } from 'antd'
import type { ReactNode } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { EstateSiteShell } from '@/features/showcases/components/EstateSiteShell'
import {
  cityNames,
  estateListingPath,
  estateListingsPath,
  estatePhotoUrl,
  FEATURES,
  findListing,
  formatNumber,
  formatPrice,
  hoodOf,
  pricePerM2,
  roomsLabel,
  type Listing,
} from '@/features/showcases/data/estate'
import {
  bestInComparison,
  MAX_COMPARE,
  parseCompareIds,
  type CompareRow,
} from '@/features/showcases/data/estateSearch'
import { useEstateStore } from '@/features/showcases/hooks/useEstateStore'
import { useEstateText } from '@/features/showcases/hooks/useEstateText'

interface EstateComparePageProps {
  standalone?: boolean
}

interface Row {
  key: string
  label: string
  best?: CompareRow
  cell: (listing: Listing) => ReactNode
}

export function EstateComparePage({ standalone = false }: EstateComparePageProps) {
  const { text, language, titleOf } = useEstateText()
  const { message } = App.useApp()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const stored = useEstateStore((state) => state.compare)
  const removeFromStore = useEstateStore((state) => state.removeCompare)
  const setStored = useEstateStore((state) => state.setCompare)
  const clearStore = useEstateStore((state) => state.clearCompare)

  // A shared link wins over what this browser picked; without one, the picks are the list.
  const fromLink = params.has('ids')
  const ids = fromLink
    ? parseCompareIds(params.get('ids'), (id) => Boolean(findListing(id)))
    : stored.slice(0, MAX_COMPARE)
  const picked = ids.map((id) => findListing(id)!)
  const best = bestInComparison(picked)
  const money = (amount: number) => formatPrice(amount, language)
  const listingsPath = estateListingsPath(standalone)

  const remove = (id: string) => {
    removeFromStore(id)
    if (fromLink) {
      const rest = ids.filter((entry) => entry !== id)
      setParams(rest.length ? { ids: rest.join(',') } : {}, { replace: true })
    }
  }
  const clear = () => {
    clearStore()
    setParams({}, { replace: true })
  }
  const copyLink = async () => {
    const url = new URL(window.location.href)
    url.search = `?ids=${ids.join(',')}`
    try {
      await navigator.clipboard.writeText(url.toString())
      void message.success(text.listing.linkCopied)
    } catch {
      void message.warning(text.listing.copyFailed)
    }
  }

  const yesNo = (value: boolean) =>
    value ? (
      <CheckOutlined className="estate-yes" aria-label={text.listing.yes} />
    ) : (
      <MinusOutlined className="estate-no" aria-label={text.listing.no} />
    )

  const rows: Row[] = [
    {
      key: 'price',
      label: text.compare.rows.price,
      best: 'price',
      cell: (listing) => (
        <strong>
          {money(listing.price)}
          {listing.deal === 'rent' && ` ${text.perMonth}`}
        </strong>
      ),
    },
    {
      key: 'pricePerM2',
      label: text.compare.rows.pricePerM2,
      best: 'pricePerM2',
      cell: (listing) => money(pricePerM2(listing)),
    },
    {
      key: 'grossArea',
      label: text.compare.rows.grossArea,
      best: 'grossArea',
      cell: (listing) => `${formatNumber(listing.grossArea, language)} m²`,
    },
    {
      key: 'bedrooms',
      label: text.compare.rows.bedrooms,
      best: 'bedrooms',
      cell: (listing) => roomsLabel(listing),
    },
    {
      key: 'buildingAge',
      label: text.compare.rows.buildingAge,
      best: 'buildingAge',
      cell: (listing) => text.age(listing.buildingAge),
    },
    {
      key: 'dues',
      label: text.compare.rows.dues,
      best: 'dues',
      cell: (listing) => (listing.dues ? money(listing.dues) : text.listing.noDues),
    },
    {
      key: 'location',
      label: text.compare.location,
      cell: (listing) => `${hoodOf(listing).name}, ${cityNames[listing.city]}`,
    },
    { key: 'type', label: text.compare.type, cell: (listing) => text.types[listing.type] },
    { key: 'floor', label: text.compare.floor, cell: (listing) => text.floor(listing) },
    {
      key: 'heating',
      label: text.compare.heating,
      cell: (listing) => text.heating[listing.heating],
    },
    {
      key: 'features',
      label: text.compare.rows.features,
      best: 'features',
      cell: (listing) => `${listing.features.length} / ${FEATURES.length}`,
    },
    ...FEATURES.map((feature) => ({
      key: `feature-${feature}`,
      label: text.features[feature],
      cell: (listing: Listing) => yesNo(listing.features.includes(feature)),
    })),
  ]

  return (
    <EstateSiteShell standalone={standalone} page="compare">
      <section className="estate-compare">
        <Flex
          justify="space-between"
          align="flex-end"
          gap={16}
          wrap
          className="estate-compare__head"
        >
          <div>
            <Typography.Title level={1}>{text.compare.title}</Typography.Title>
            <Typography.Text type="secondary">{text.compare.lead}</Typography.Text>
          </div>
          {picked.length > 0 && (
            <Flex gap={8} wrap>
              {picked.length < MAX_COMPARE && (
                <Button
                  icon={<PlusOutlined aria-hidden="true" />}
                  onClick={() => void navigate(listingsPath)}
                >
                  {text.compare.addMore}
                </Button>
              )}
              <Button icon={<LinkOutlined aria-hidden="true" />} onClick={() => void copyLink()}>
                {text.compare.copyLink}
              </Button>
              {fromLink && ids.join(',') !== stored.join(',') && (
                <Button onClick={() => setStored(ids)}>{text.card.save}</Button>
              )}
              <Button onClick={clear}>{text.compare.clear}</Button>
            </Flex>
          )}
        </Flex>

        {picked.length === 0 ? (
          <Empty
            className="estate-empty"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <>
                <Typography.Text strong>{text.compare.emptyTitle}</Typography.Text>
                <br />
                <Typography.Text type="secondary">{text.compare.emptyLead}</Typography.Text>
              </>
            }
          >
            <Button type="primary" onClick={() => void navigate(listingsPath)}>
              {text.compare.browse}
            </Button>
          </Empty>
        ) : (
          <div className="estate-compare__scroll">
            <table className={`estate-compare__table estate-compare__table--${picked.length}`}>
              <thead>
                <tr>
                  <td>
                    <span className="estate-sr-only">{text.compare.title}</span>
                  </td>
                  {picked.map((listing) => {
                    const title = titleOf(listing)
                    return (
                      <th key={listing.id} scope="col">
                        <div className="estate-compare__listing">
                          <img src={estatePhotoUrl(listing.photos[0]!.id, 480)} alt="" />
                          <Button
                            size="small"
                            shape="circle"
                            className="estate-compare__remove"
                            icon={<CloseOutlined />}
                            aria-label={text.compareTray.remove(title)}
                            onClick={() => remove(listing.id)}
                          />
                          <Link to={estateListingPath(standalone, listing.id)}>{title}</Link>
                        </div>
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.key}
                    className={row.key.startsWith('feature-') ? 'is-feature' : undefined}
                  >
                    <th scope="row">{row.label}</th>
                    {picked.map((listing) => {
                      const winner = row.best ? best[row.best].includes(listing.id) : false
                      return (
                        <td key={listing.id} className={winner ? 'is-best' : undefined}>
                          {row.cell(listing)}
                          {winner && (
                            <Tag variant="filled" color="green" className="estate-best-tag">
                              {text.compare.best}
                            </Tag>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </EstateSiteShell>
  )
}
