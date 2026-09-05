import { Button, Result } from 'antd'
import { isRouteErrorResponse, useNavigate, useRouteError } from 'react-router'

export function RouteErrorPage() {
  const error = useRouteError()
  const navigate = useNavigate()
  const description = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : 'The route could not be rendered.'

  return (
    <Result
      status="error"
      title="Navigation error"
      subTitle={description}
      extra={
        <Button type="primary" onClick={() => void navigate('/dashboard')}>
          Return to dashboard
        </Button>
      }
    />
  )
}
