import { CameraOutlined, EnvironmentOutlined, HeartFilled, HeartOutlined } from '@ant-design/icons'
import { Button, Checkbox, Tag, Tooltip, Typography } from 'antd'
import { Link } from 'react-router'
import {
  cityNames,
  estateListingPath,
  estatePhotoUrl,
  formatNumber,
  formatPrice,
  hoodOf,
  isNew,
  placeLabel,
  pricePerM2,
  recentDrop,
  roomsLabel,
  type Listing,
} from '@/features/showcases/data/estate'
import { useEstateActions } from '@/features/showcases/hooks/useEstateActions'
import { useEstateText } from '@/features/showcases/hooks/useEstateText'

interface EstateListingCardProps {
  listing: Listing
  standalone: boolean
  /** Highlighted because its pin is hovered on the map. The page tracks the card's own hover. */
  active?: boolean
}

export function EstateListingCard({ listing, standalone, active }: EstateListingCardProps) {
  const { text, language, titleOf } = useEstateText()
  const actions = useEstateActions()
  const hood = hoodOf(listing)
  const title = titleOf(listing)
  const href = estateListingPath(standalone, listing.id)
  const saved = actions.isSaved(listing)
  const drop = recentDrop(listing)

  return (
    <article className={`estate-card${active ? ' is-active' : ''}`} data-listing={listing.id}>
      <div className="estate-card__media">
        <Link to={href} tabIndex={-1} aria-hidden="true">
          <img
            src={estatePhotoUrl(listing.photos[0]!.id, 640)}
            alt=""
            loading="lazy"
            decoding="async"
          />
        </Link>
        <div className="estate-card__badges">
          <Tag variant="filled" className={`estate-deal estate-deal--${listing.deal}`}>
            {text.dealTag[listing.deal]}
          </Tag>
          {listing.featured && (
            <Tag variant="filled" color="gold">
              {text.card.featured}
            </Tag>
          )}
          {isNew(listing) && (
            <Tag variant="filled" color="green">
              {text.card.new}
            </Tag>
          )}
          {drop !== undefined && (
            <Tag variant="filled" color="red">
              {text.card.drop(drop)}
            </Tag>
          )}
        </div>
        <Tooltip title={saved ? text.card.unsave : text.card.save}>
          <Button
            shape="circle"
            className={`estate-heart${saved ? ' is-saved' : ''}`}
            aria-pressed={saved}
            aria-label={saved ? text.card.unsaveLabel(title) : text.card.saveLabel(title)}
            icon={saved ? <HeartFilled /> : <HeartOutlined />}
            onClick={() => actions.toggleFavourite(listing)}
          />
        </Tooltip>
        <span className="estate-card__photos">
          <CameraOutlined aria-hidden="true" /> {listing.photos.length}
          <span className="estate-sr-only"> {text.card.photos(listing.photos.length)}</span>
        </span>
      </div>

      <div className="estate-card__body">
        <div className="estate-card__price">
          <strong>{formatPrice(listing.price, language)}</strong>
          {listing.deal === 'rent' ? (
            <Typography.Text type="secondary"> {text.perMonth}</Typography.Text>
          ) : (
            <Typography.Text type="secondary" className="estate-card__per">
              {text.perM2(formatPrice(pricePerM2(listing), language))}
            </Typography.Text>
          )}
        </div>
        <Link to={href} className="estate-card__title">
          {title}
        </Link>
        <Typography.Text type="secondary" className="estate-card__place">
          <EnvironmentOutlined aria-hidden="true" /> {placeLabel(hood)} · {cityNames[listing.city]}
        </Typography.Text>
        <ul className="estate-card__facts">
          <li>{roomsLabel(listing)}</li>
          <li>{formatNumber(listing.grossArea, language)} m²</li>
          <li>{text.floorShort(listing)}</li>
          <li>{text.age(listing.buildingAge)}</li>
        </ul>
        <div className="estate-card__footer">
          <Checkbox
            checked={actions.isCompared(listing)}
            onChange={() => actions.toggleCompare(listing)}
          >
            {text.card.compare}
          </Checkbox>
          <Typography.Text type="secondary">{text.daysAgo(listing.listedDaysAgo)}</Typography.Text>
        </div>
      </div>
    </article>
  )
}
