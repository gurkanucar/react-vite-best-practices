import { AimOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import L, { type Map as LeafletMap } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Circle,
  MapContainer,
  Marker,
  Popup,
  Rectangle,
  TileLayer,
  useMap,
  useMapEvents,
} from 'react-leaflet'
import { Link } from 'react-router'
import {
  estateListingPath,
  estatePhotoUrl,
  formatCompactPrice,
  formatPrice,
  type Listing,
} from '@/features/showcases/data/estate'
import {
  boundsOf,
  clusterPoints,
  formatBounds,
  parseBounds,
  type Bounds,
} from '@/features/showcases/data/estateGeo'
import { useEstateText } from '@/features/showcases/hooks/useEstateText'

const TILES = {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
}

/** Pins overlap below this distance in pixels, and are drawn as one bubble instead. */
const CLUSTER_RADIUS = 58

const toLatLngBounds = ([south, west, north, east]: Bounds) =>
  L.latLngBounds([south, west], [north, east])

/** Leaflet measures its container once; a map that opens in a drawer or a resized column must measure again. */
function KeepSized() {
  const map = useMap()
  useEffect(() => {
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(() => map.invalidateSize())
    observer.observe(map.getContainer())
    return () => observer.disconnect()
  }, [map])
  return null
}

interface ViewTrackerProps {
  /** `formatBounds` of what should be in view: a string, so the map only moves when it changes. */
  target: string
  onUserMove: () => void
}

/** Frames the target, and reports every move the visitor made rather than the ones it made. */
function ViewTracker({ target, onUserMove }: ViewTrackerProps) {
  const map = useMap()
  const framing = useRef(false)

  useEffect(() => {
    const bounds = parseBounds(target)
    if (!bounds) return
    framing.current = true
    map.fitBounds(toLatLngBounds(bounds), { padding: [36, 36], maxZoom: 15, animate: false })
    framing.current = false
  }, [map, target])

  useMapEvents({
    moveend: () => {
      if (!framing.current) onUserMove()
    },
  })
  return null
}

interface PinsProps {
  listings: Listing[]
  activeId: string | null
  onHover: (id: string | null) => void
  standalone: boolean
}

function Pins({ listings, activeId, onHover, standalone }: PinsProps) {
  const map = useMap()
  const { text, language, titleOf } = useEstateText()
  const [zoom, setZoom] = useState(() => map.getZoom())
  useMapEvents({ zoomend: () => setZoom(map.getZoom()) })

  const clusters = useMemo(
    () =>
      clusterPoints(
        listings,
        (listing) => listing.position,
        (position) => map.project(position, zoom),
        CLUSTER_RADIUS,
      ),
    [listings, map, zoom],
  )

  return clusters.map((cluster) => {
    if (cluster.items.length > 1) {
      const count = cluster.items.length
      const active = cluster.items.some((listing) => listing.id === activeId)
      return (
        <Marker
          key={`cluster-${cluster.items[0]!.id}`}
          position={cluster.position}
          zIndexOffset={active ? 1000 : 0}
          title={text.map.homesHere(count)}
          icon={L.divIcon({
            className: 'estate-pin-anchor',
            iconSize: [0, 0],
            html: `<span class="estate-cluster${active ? ' is-active' : ''}${count > 9 ? ' is-large' : ''}">${count}</span>`,
          })}
          eventHandlers={{
            click: () => {
              const bounds = boundsOf(cluster.items.map((listing) => listing.position))!
              map.fitBounds(toLatLngBounds(bounds), { padding: [60, 60], maxZoom: 17 })
            },
          }}
        />
      )
    }

    const listing = cluster.items[0]!
    const active = listing.id === activeId
    const title = titleOf(listing)
    return (
      <Marker
        key={listing.id}
        position={listing.position}
        zIndexOffset={active ? 1000 : 0}
        title={title}
        icon={L.divIcon({
          className: 'estate-pin-anchor',
          iconSize: [0, 0],
          popupAnchor: [0, -34],
          html: `<span class="estate-pin${active ? ' is-active' : ''}">${formatCompactPrice(listing.price, language)}</span>`,
        })}
        eventHandlers={{
          mouseover: () => onHover(listing.id),
          mouseout: () => onHover(null),
        }}
      >
        <Popup className="estate-popup" closeButton={false} minWidth={220} maxWidth={240}>
          <Link to={estateListingPath(standalone, listing.id)} className="estate-popup__card">
            <img src={estatePhotoUrl(listing.photos[0]!.id, 480)} alt="" />
            <strong>
              {formatPrice(listing.price, language)}
              {listing.deal === 'rent' && ` ${text.perMonth}`}
            </strong>
            <span>{title}</span>
            <em>{text.map.view} →</em>
          </Link>
        </Popup>
      </Marker>
    )
  })
}

interface EstateResultsMapProps {
  /** Every result of the search except the map area, so the pins around the area stay visible. */
  listings: Listing[]
  area?: Bounds
  activeId: string | null
  onHover: (id: string | null) => void
  onSearchArea: (bounds: Bounds) => void
  standalone: boolean
}

export function EstateResultsMap({
  listings,
  area,
  activeId,
  onHover,
  onSearchArea,
  standalone,
}: EstateResultsMapProps) {
  const { text } = useEstateText()
  const [map, setMap] = useState<LeafletMap | null>(null)
  const [moved, setMoved] = useState(false)

  const fallback = boundsOf(listings.map((listing) => listing.position))
  const target = area ?? fallback
  const targetKey = target ? formatBounds(target) : ''
  // A new search frames its results again, so the map has not been moved away from them.
  const [framed, setFramed] = useState(targetKey)
  if (framed !== targetKey) {
    setFramed(targetKey)
    setMoved(false)
  }

  const searchArea = () => {
    if (!map) return
    const bounds = map.getBounds()
    onSearchArea([bounds.getSouth(), bounds.getWest(), bounds.getNorth(), bounds.getEast()])
    setMoved(false)
  }

  return (
    <section className="estate-map" aria-label={text.results.mapTitle}>
      <MapContainer
        ref={setMap}
        className="estate-map__canvas"
        center={[41.02, 29.0]}
        zoom={11}
        scrollWheelZoom
      >
        <TileLayer attribution={TILES.attribution} url={TILES.url} />
        <KeepSized />
        {area && (
          <Rectangle
            bounds={toLatLngBounds(area)}
            interactive={false}
            pathOptions={{ color: '#1d6b52', weight: 2, dashArray: '6 6', fillOpacity: 0.04 }}
          />
        )}
        <Pins listings={listings} activeId={activeId} onHover={onHover} standalone={standalone} />
        {/* After the pins, so their zoom listener is in place before the first framing. */}
        <ViewTracker target={targetKey} onUserMove={() => setMoved(true)} />
      </MapContainer>
      {moved && (
        <Button
          type="primary"
          shape="round"
          icon={<AimOutlined aria-hidden="true" />}
          className="estate-map__search-area"
          onClick={searchArea}
        >
          {text.map.searchArea}
        </Button>
      )}
    </section>
  )
}

interface EstateLocationMapProps {
  position: [number, number]
}

/** A circle rather than a pin: the exact address is only shared once a viewing is booked. */
export function EstateLocationMap({ position }: EstateLocationMapProps) {
  return (
    <MapContainer
      className="estate-location-map"
      center={position}
      zoom={15}
      scrollWheelZoom={false}
    >
      <TileLayer attribution={TILES.attribution} url={TILES.url} />
      <KeepSized />
      <Circle
        center={position}
        radius={260}
        pathOptions={{ color: '#1d6b52', weight: 2, fillColor: '#1d6b52', fillOpacity: 0.16 }}
      />
    </MapContainer>
  )
}
