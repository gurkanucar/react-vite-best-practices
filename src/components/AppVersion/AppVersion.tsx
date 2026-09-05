import { CodeOutlined } from '@ant-design/icons'
import { Space, Tag, Typography } from 'antd'

export function AppVersion() {
  return (
    <Space aria-label={`Application version ${__APP_VERSION__}`} size="small">
      <CodeOutlined aria-hidden="true" />
      <Typography.Text type="secondary">Current build</Typography.Text>
      <Tag>v{__APP_VERSION__}</Tag>
    </Space>
  )
}
