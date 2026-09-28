import { CompressOutlined, ExpandOutlined } from '@ant-design/icons'
import { Button, Tooltip } from 'antd'
import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useSongContestCopy } from '@/features/showcases/hooks/useSongContest'

export function StageButton({ on, onChange }: { on: boolean; onChange: (on: boolean) => void }) {
  const { text } = useSongContestCopy()
  const label = on ? text.stage.exit : text.stage.enter
  return (
    <Tooltip title={label}>
      <Button
        className="sc-stage-button"
        icon={on ? <CompressOutlined /> : <ExpandOutlined />}
        aria-label={label}
        aria-pressed={on}
        onClick={() => onChange(!on)}
      />
    </Tooltip>
  )
}

/**
 * Draws the screen over everything, full size. Leaving full screen with the browser's own
 * Esc also leaves stage mode, and Esc works the same when full screen was not granted.
 */
export function StageFrame({ children, onExit }: { children: ReactNode; onExit: () => void }) {
  // The page re-renders every second; the effect must not restart (and drop full screen) then.
  const exit = useRef(onExit)
  useEffect(() => {
    exit.current = onExit
  }, [onExit])

  useEffect(() => {
    const root = document.documentElement
    const previous = root.style.overflow
    root.style.overflow = 'hidden'
    let entered = Boolean(document.fullscreenElement)

    // Leaving full screen with the browser's Esc leaves stage mode too.
    const onFullscreenChange = () => {
      if (document.fullscreenElement) entered = true
      else if (entered) exit.current()
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !document.fullscreenElement) exit.current()
    }
    document.addEventListener('fullscreenchange', onFullscreenChange)
    window.addEventListener('keydown', onKey)
    return () => {
      root.style.overflow = previous
      document.removeEventListener('fullscreenchange', onFullscreenChange)
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  return createPortal(
    <div className="song-site sc-page sc-stage-mode">{children}</div>,
    document.body,
  )
}

/**
 * A page meant for a big screen: one viewport high on a landscape display, with its panels
 * scrolling or clipping inside rather than the page. On a phone it is an ordinary page.
 */
export function Screen({
  children,
  stage,
  onExitStage,
  fitted,
}: {
  children: ReactNode
  stage: boolean
  onExitStage: () => void
  /** Hold the screen to the viewport; the admin's own chrome makes that meaningless there. */
  fitted: boolean
}) {
  if (stage)
    return (
      <StageFrame onExit={onExitStage}>
        <div className="sc-screen is-fitted is-stage">{children}</div>
      </StageFrame>
    )
  return <div className={`sc-screen${fitted ? ' is-fitted' : ''}`}>{children}</div>
}
