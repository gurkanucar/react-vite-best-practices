import { ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons'
import { Button, Flex, Tooltip, Typography } from 'antd'
import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import type { Seat, SeatMap } from '@/features/showcases/data/cinemaBooking'
import { useCinemaText } from '@/features/showcases/data/cinemaCopy'

interface CinemaSeatMapProps {
  map: SeatMap
  taken: Set<string>
  /** Seats this visitor already booked for the showing. */
  mine: Set<string>
  selected: string[]
  priceOf: (seat: Seat) => string
  onToggle: (seatId: string) => void
}

const ZOOM_STEPS = [0.8, 1, 1.25, 1.5]

function WheelchairGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="cinema-seat__glyph">
      <circle cx="12" cy="4" r="2" fill="currentColor" />
      <path
        d="M11 7v6h5l2 5M11 10h5M9 10.5a5 5 0 1 0 6 6.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * The hall from above. Seats are buttons: one tab stop for the whole map, arrow keys move
 * between seats, and Enter or Space picks one. Taken seats stay focusable so a screen reader
 * can hear that they are taken.
 */
export function CinemaSeatMap({
  map,
  taken,
  mine,
  selected,
  priceOf,
  onToggle,
}: CinemaSeatMapProps) {
  const { text } = useCinemaText()
  const t = text.booking
  const scrollRef = useRef<HTMLDivElement>(null)
  const seatRefs = useRef(new Map<string, HTMLButtonElement>())
  const [zoom, setZoom] = useState(1)
  const [pointed, setPointed] = useState<string | null>(null)
  const chosen = useMemo(() => new Set(selected), [selected])

  // Where each seat sits, for moving with the arrow keys.
  const grid = useMemo(
    () => map.rows.map((row) => row.cells.map((cell) => (cell.kind === 'seat' ? cell : null))),
    [map],
  )

  const [focusId, setFocusId] = useState<string>(() => {
    const middle = grid[Math.floor(grid.length / 2)] ?? []
    const center = Math.floor(middle.length / 2)
    const nearest = middle
      .filter((seat): seat is Seat => seat !== null)
      .sort((a, b) => Math.abs(middle.indexOf(a) - center) - Math.abs(middle.indexOf(b) - center))
    return selected[0] ?? nearest[0]?.id ?? map.seats[0]!.id
  })

  // On a phone the hall is wider than the screen: start looking at its middle.
  useEffect(() => {
    const element = scrollRef.current
    if (element) element.scrollLeft = (element.scrollWidth - element.clientWidth) / 2
  }, [zoom])

  const move = (event: KeyboardEvent<HTMLButtonElement>) => {
    const step = { ArrowLeft: [0, -1], ArrowRight: [0, 1], ArrowUp: [-1, 0], ArrowDown: [1, 0] }[
      event.key
    ]
    if (!step) return
    event.preventDefault()
    const rowIndex = grid.findIndex((row) => row.some((seat) => seat?.id === focusId))
    if (rowIndex < 0) return
    const column = grid[rowIndex]!.findIndex((seat) => seat?.id === focusId)
    const [dRow, dColumn] = step as [number, number]

    let target: Seat | null = null
    if (dColumn !== 0) {
      const row = grid[rowIndex]!
      for (let index = column + dColumn; index >= 0 && index < row.length; index += dColumn) {
        if (row[index]) {
          target = row[index]
          break
        }
      }
    } else {
      for (let index = rowIndex + dRow; index >= 0 && index < grid.length; index += dRow) {
        const candidates = grid[index]!.map((seat, position) => ({
          seat,
          distance: Math.abs(position - column),
        }))
          .filter((entry): entry is { seat: Seat; distance: number } => entry.seat !== null)
          .sort((a, b) => a.distance - b.distance)
        if (candidates[0]) {
          target = candidates[0].seat
          break
        }
      }
    }
    if (target) {
      setFocusId(target.id)
      setPointed(target.id)
      seatRefs.current.get(target.id)?.focus()
    }
  }

  const pointedSeat = pointed ? map.seats.find((seat) => seat.id === pointed) : undefined
  const zoomIndex = ZOOM_STEPS.indexOf(zoom)

  const legend = [
    ['free', t.free],
    ['selected', t.selected],
    ['taken', t.taken],
    ['mine', t.yours],
    ['vip', text.seatType.vip],
    ['couple', text.seatType.couple],
    ['wheelchair', text.seatType.wheelchair],
  ] as const

  return (
    <div className="cinema-auditorium">
      <Flex justify="space-between" align="center" gap={8} className="cinema-auditorium__bar">
        <Typography.Text className="cinema-auditorium__info" aria-live="polite">
          {pointedSeat
            ? `${pointedSeat.id} · ${text.seatType[pointedSeat.type]} · ${
                taken.has(pointedSeat.id) || mine.has(pointedSeat.id)
                  ? t.taken
                  : priceOf(pointedSeat)
              }`
            : t.hoverHint}
        </Typography.Text>
        <Flex gap={4}>
          <Tooltip title={t.zoomOut}>
            <Button
              size="small"
              aria-label={t.zoomOut}
              icon={<ZoomOutOutlined />}
              disabled={zoomIndex <= 0}
              onClick={() => setZoom(ZOOM_STEPS[zoomIndex - 1] ?? zoom)}
            />
          </Tooltip>
          <Tooltip title={t.zoomIn}>
            <Button
              size="small"
              aria-label={t.zoomIn}
              icon={<ZoomInOutlined />}
              disabled={zoomIndex >= ZOOM_STEPS.length - 1}
              onClick={() => setZoom(ZOOM_STEPS[zoomIndex + 1] ?? zoom)}
            />
          </Tooltip>
        </Flex>
      </Flex>

      <div className="cinema-auditorium__scroll" ref={scrollRef}>
        <fieldset
          className="cinema-seatmap"
          style={{ '--cols': map.columns, '--zoom': zoom } as CSSProperties}
        >
          <legend className="cinema-sr-only">{t.seatMap}</legend>
          <div className="cinema-screen" aria-hidden="true">
            <span>{t.screen}</span>
          </div>
          {map.rows.map(({ row, cells }) => (
            <div key={row} className="cinema-row">
              <span className="cinema-row__label" aria-hidden="true">
                {row}
              </span>
              <div className="cinema-row__cells">
                {cells.map((cell, index) => {
                  if (cell.kind === 'gap') return <span key={index} className="cinema-gap" />
                  const isTaken = taken.has(cell.id) && !mine.has(cell.id)
                  const isMine = mine.has(cell.id)
                  const isSelected = chosen.has(cell.id)
                  const unavailable = isTaken || isMine
                  const half = cell.pairId
                    ? cell.pairId === cell.id
                      ? ' cinema-seat--left'
                      : ' cinema-seat--right'
                    : ''
                  const label = [
                    t.seatLabel(cell.row, cell.number, text.seatType[cell.type], priceOf(cell)),
                    isTaken ? t.takenSuffix : null,
                    isMine ? t.yours : null,
                  ]
                    .filter(Boolean)
                    .join(', ')

                  return (
                    <button
                      key={cell.id}
                      ref={(element) => {
                        if (element) seatRefs.current.set(cell.id, element)
                        else seatRefs.current.delete(cell.id)
                      }}
                      type="button"
                      className={`cinema-seat cinema-seat--${cell.type}${half}${
                        isSelected ? ' is-selected' : ''
                      }${isTaken ? ' is-taken' : ''}${isMine ? ' is-mine' : ''}`}
                      aria-label={label}
                      aria-pressed={isSelected}
                      aria-disabled={unavailable || undefined}
                      tabIndex={cell.id === focusId ? 0 : -1}
                      data-seat={cell.id}
                      onClick={() => {
                        setFocusId(cell.id)
                        if (!unavailable) onToggle(cell.id)
                      }}
                      onFocus={() => {
                        setFocusId(cell.id)
                        setPointed(cell.id)
                      }}
                      onMouseEnter={() => setPointed(cell.id)}
                      onMouseLeave={() => setPointed(null)}
                      onKeyDown={move}
                    >
                      {cell.type === 'wheelchair' && !isSelected ? (
                        <WheelchairGlyph />
                      ) : isSelected ? (
                        <span className="cinema-seat__number">{cell.number}</span>
                      ) : null}
                    </button>
                  )
                })}
              </div>
              <span className="cinema-row__label" aria-hidden="true">
                {row}
              </span>
            </div>
          ))}
        </fieldset>
      </div>

      <ul className="cinema-legend" aria-label={t.legend}>
        {legend.map(([kind, label]) => (
          <li key={kind}>
            <span
              className={`cinema-legend__swatch cinema-legend__swatch--${kind}`}
              aria-hidden="true"
            />
            {label}
          </li>
        ))}
      </ul>
    </div>
  )
}
