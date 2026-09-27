import 'leaflet/dist/leaflet.css'
import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet'

interface CampusMapProps {
  position: [number, number]
  /** What the pin says when it is opened: the name and the address. */
  label: string
  address: string
  zoom?: number
}

/**
 * OpenStreetMap tiles with a drawn pin. A `CircleMarker` rather than Leaflet's default icon,
 * whose image paths do not survive a bundler without extra setup.
 */
export function CampusMap({ position, label, address, zoom = 15 }: CampusMapProps) {
  return (
    <MapContainer
      className="campus-map"
      center={position}
      zoom={zoom}
      // A page that scrolls should not zoom the map on the way past; the buttons still do.
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <CircleMarker
        center={position}
        radius={11}
        pathOptions={{ color: '#fff', weight: 3, fillColor: '#3157d5', fillOpacity: 1 }}
      >
        <Popup>
          <strong>{label}</strong>
          <br />
          {address}
        </Popup>
      </CircleMarker>
    </MapContainer>
  )
}
