/** A bookmark, outlined or filled; antd's icon set has none. Sized and coloured like its icons. */
export function BookmarkIcon({ filled = false }: { filled?: boolean }) {
  return (
    <span aria-hidden="true" className="anticon careers-bookmark-icon">
      <svg viewBox="0 0 24 24" width="1em" height="1em" fill={filled ? 'currentColor' : 'none'}>
        <path
          d="M6.5 3.5h11a1 1 0 0 1 1 1v16l-6.5-4.2-6.5 4.2v-16a1 1 0 0 1 1-1Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}
