import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import { Link } from 'react-router'
import { cityPlacePath, type Place, type PlaceCategory } from '@/features/showcases/data/cityGuide'
import { useCityCopy } from '@/features/showcases/hooks/useCityCopy'

const TILES = {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
}

const pinIcon = (category: PlaceCategory, active: boolean) =>
  L.divIcon({
    className: 'city-pin-anchor',
    iconSize: [0, 0],
    popupAnchor: [0, -30],
    html: `<span class="city-pin city-pin--${category}${active ? ' is-active' : ''}"></span>`,
  })

/** Leaflet measures its box once; a map in a column that changes size must measure again. */
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

/** Frames the pins whenever the set of them changes. */
function FitPins({ positions }: { positions: [number, number][] }) {
  const map = useMap()
  const key = positions.map((position) => position.join(',')).join(';')
  useEffect(() => {
    const points = key
      ? key.split(';').map((pair) => pair.split(',').map(Number) as [number, number])
      : []
    if (points.length === 1) map.setView(points[0]!, 15, { animate: false })
    else if (points.length > 1)
      map.fitBounds(L.latLngBounds(points), { padding: [36, 36], maxZoom: 16, animate: false })
  }, [map, key])
  return null
}

interface CityMapProps {
  places: Place[]
  center: [number, number]
  zoom: number
  standalone: boolean
  activeId?: string | null
  onHover?: (id: string | null) => void
  className?: string
  label: string
}

export function CityMap({
  places,
  center,
  zoom,
  standalone,
  activeId = null,
  onHover,
  className,
  label,
}: CityMapProps) {
  const { t, text } = useCityCopy()
  const pinned = places.filter((place) => place.position)

  return (
    <section className={`city-map ${className ?? ''}`} aria-label={label}>
      <MapContainer
        className="city-map__canvas"
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
      >
        <TileLayer attribution={TILES.attribution} url={TILES.url} />
        <KeepSized />
        <FitPins positions={pinned.map((place) => place.position!)} />
        {pinned.map((place) => (
          <Marker
            key={place.id}
            position={place.position!}
            title={t(place.name)}
            zIndexOffset={place.id === activeId ? 1000 : 0}
            icon={pinIcon(place.category, place.id === activeId)}
            eventHandlers={
              onHover
                ? { mouseover: () => onHover(place.id), mouseout: () => onHover(null) }
                : undefined
            }
          >
            <Popup className="city-popup" closeButton={false} minWidth={180} maxWidth={240}>
              <Link to={cityPlacePath(standalone, place.city, place.id)}>
                <em>{place.type ? t(place.type) : text.categoryOne[place.category]}</em>
                <strong>{t(place.name)}</strong>
                <span>{place.district}</span>
              </Link>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <ul className="city-map__legend" aria-hidden="true">
        {[...new Set(pinned.map((place) => place.category))].map((category) => (
          <li key={category}>
            <span className={`city-pin city-pin--${category}`} />
            {text.categories[category]}
          </li>
        ))}
      </ul>
    </section>
  )
}
