import { CodeOutlined } from '@ant-design/icons'
import { Space, Tag, Typography } from 'antd'
import { useMessages } from '@/i18n/messages'

export function AppVersion() {
  const messages = useMessages()

  return (
    <Space
      aria-label={messages.common.appVersion.replace('{version}', __APP_VERSION__)}
      size="small"
    >
      <CodeOutlined aria-hidden="true" />
      <Typography.Text type="secondary">{messages.common.currentBuild}</Typography.Text>
      <Tag>v{__APP_VERSION__}</Tag>
    </Space>
  )
}
