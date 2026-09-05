import { Spin, Typography } from 'antd'
import './RouteLoading.css'

interface RouteLoadingProps {
  fullPage?: boolean
}

export function RouteLoading({ fullPage = false }: RouteLoadingProps) {
  return (
    <output
      className={`route-loading${fullPage ? ' route-loading--full-page' : ''}`}
      aria-live="polite"
    >
      <Spin size="large" />
      <Typography.Text type="secondary">Loading page…</Typography.Text>
    </output>
  )
}
