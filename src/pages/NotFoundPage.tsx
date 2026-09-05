import { Button, Result } from 'antd'
import { useNavigate } from 'react-router'
import { useMessages } from '@/i18n/messages'
import './NotFoundPage.css'

export function NotFoundPage() {
  const navigate = useNavigate()
  const messages = useMessages()

  return (
    <main className="not-found-page">
      <Result
        status="404"
        title={messages.notFound.title}
        subTitle={messages.notFound.description}
        extra={
          <Button type="primary" onClick={() => void navigate('/')}>
            {messages.notFound.home}
          </Button>
        }
      />
    </main>
  )
}
