/** South, west, north, east: the order Leaflet's `toBBoxString` does not use, but reads best. */
export type Bounds = [number, number, number, number]

export function boundsContain([south, west, north, east]: Bounds, [lat, lng]: [number, number]) {
  return lat >= south && lat <= north && lng >= west && lng <= east
}

export function boundsOf(points: [number, number][]): Bounds | undefined {
  if (points.length === 0) return undefined
  let [south, west, north, east] = [Infinity, Infinity, -Infinity, -Infinity]
  for (const [lat, lng] of points) {
    south = Math.min(south, lat)
    north = Math.max(north, lat)
    west = Math.min(west, lng)
    east = Math.max(east, lng)
  }
  return [south, west, north, east]
}

export function parseBounds(value: string | null): Bounds | undefined {
  if (!value) return undefined
  const parts = value.split(',').map(Number)
  if (parts.length !== 4 || parts.some((part) => !Number.isFinite(part))) return undefined
  const [south, west, north, east] = parts as Bounds
  if (south >= north || west >= east || Math.abs(south) > 90 || Math.abs(north) > 90) {
    return undefined
  }
  return [south, west, north, east]
}

/** Four decimals is about ten metres: enough for a link, short enough to read. */
export const formatBounds = (bounds: Bounds) => bounds.map((value) => value.toFixed(4)).join(',')

export interface Cluster<T> {
  items: T[]
  /** The average position of the members, where the bubble is drawn. */
  position: [number, number]
}

/**
 * Clustering in screen space: every point starts alone, and the two nearest groups merge
 * while any two are closer than `radius` pixels, measured between their centres. `project`
 * turns a position into pixels at the map's current zoom, so the same data splits apart as
 * the map zooms in, and no two bubbles ever end up on top of each other.
 */
export function clusterPoints<T>(
  items: T[],
  positionOf: (item: T) => [number, number],
  project: (position: [number, number]) => { x: number; y: number },
  radius: number,
): Cluster<T>[] {
  const groups = items.map((item) => {
    const position = positionOf(item)
    return { items: [item], position, point: project(position) }
  })

  for (;;) {
    let closest: [number, number] | undefined
    let best = radius
    for (let a = 0; a < groups.length; a += 1) {
      for (let b = a + 1; b < groups.length; b += 1) {
        const distance = Math.hypot(
          groups[a]!.point.x - groups[b]!.point.x,
          groups[a]!.point.y - groups[b]!.point.y,
        )
        if (distance <= best) {
          best = distance
          closest = [a, b]
        }
      }
    }
    if (!closest) break
    const [a, b] = closest
    const merged = [...groups[a]!.items, ...groups[b]!.items]
    const positions = merged.map(positionOf)
    const position: [number, number] = [
      positions.reduce((sum, [lat]) => sum + lat, 0) / positions.length,
      positions.reduce((sum, [, lng]) => sum + lng, 0) / positions.length,
    ]
    groups[a] = { items: merged, position, point: project(position) }
    groups.splice(b, 1)
  }

  return groups.map(({ items: members, position }) => ({ items: members, position }))
}
