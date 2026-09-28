import { useState } from 'react'
import { AgencyArtwork } from '@/features/showcases/components/AgencyArtwork'
import type { Artwork } from '@/features/showcases/data/agency'

interface AgencyCompareProps {
  before: Artwork
  after: Artwork
  labels: { before: string; after: string; slider: string }
}

/**
 * Two images stacked, the "before" one clipped to the handle. An invisible range input covers
 * the frame, so dragging, clicking and the arrow keys all come from the browser; the round
 * handle only shows where it is.
 */
export function AgencyCompare({ before, after, labels }: AgencyCompareProps) {
  const [position, setPosition] = useState(50)

  return (
    <div className="agency-compare">
      <AgencyArtwork art={after} className="agency-compare__image" />
      <div
        className="agency-compare__before"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <AgencyArtwork art={before} className="agency-compare__image" />
      </div>
      <span className="agency-compare__label agency-compare__label--before">{labels.before}</span>
      <span className="agency-compare__label agency-compare__label--after">{labels.after}</span>
      <div className="agency-compare__divider" style={{ left: `${position}%` }} aria-hidden="true">
        <span className="agency-compare__handle">
          <svg viewBox="0 0 24 24">
            <path
              d="M9 6 3 12l6 6M15 6l6 6-6 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </span>
      </div>
      <input
        type="range"
        className="agency-compare__input"
        min={0}
        max={100}
        value={position}
        aria-label={labels.slider}
        aria-valuetext={`${labels.before} ${position}%, ${labels.after} ${100 - position}%`}
        onChange={(event) => setPosition(Number(event.target.value))}
      />
    </div>
  )
}
