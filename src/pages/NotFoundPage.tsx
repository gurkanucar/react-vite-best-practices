import { Button, Result, Space } from 'antd'
import { useNavigate } from 'react-router'
import { useMessages } from '@/i18n/messages'

export function NotFoundPage() {
  const navigate = useNavigate()
  const messages = useMessages()

  return (
    <Result
      status="404"
      title={messages.notFound.title}
      subTitle={messages.notFound.description}
      extra={
        <Space wrap>
          <Button type="primary" onClick={() => void navigate('/dashboard')}>
            {messages.notFound.dashboard}
          </Button>
          <Button onClick={() => void navigate('/')}>{messages.notFound.home}</Button>
        </Space>
      }
    />
  )
}
