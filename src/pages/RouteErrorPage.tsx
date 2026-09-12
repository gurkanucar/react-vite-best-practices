import { Button, Result } from 'antd'
import { isRouteErrorResponse, useNavigate, useRouteError } from 'react-router'
import { useMessages } from '@/i18n/messages'

export function RouteErrorPage() {
  const messages = useMessages()
  const error = useRouteError()
  const navigate = useNavigate()
  const description = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : messages.routeError.description

  return (
    <Result
      status="error"
      title={messages.routeError.title}
      subTitle={description}
      extra={
        <Button type="primary" onClick={() => void navigate('/dashboard')}>
          {messages.routeError.backToDashboard}
        </Button>
      }
    />
  )
}
