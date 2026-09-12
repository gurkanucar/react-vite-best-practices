import { BellOutlined } from '@ant-design/icons'
import { Badge, Button, Listy, Popover, Typography } from 'antd'
import { useState } from 'react'
import { useMessages } from '@/i18n/messages'

export function HeaderNotifications() {
  const messages = useMessages()
  const [unreadCount, setUnreadCount] = useState(3)
  const [open, setOpen] = useState(false)

  const notificationItems = [
    messages.shell.notificationBuild,
    messages.shell.notificationInvite,
    messages.shell.notificationReport,
  ]

  const content = (
    <div style={{ width: 320, maxWidth: 'calc(100vw - 32px)' }}>
      <Listy
        items={notificationItems}
        rowKey={(item) => item}
        itemRender={(item) => <Typography.Text>{item}</Typography.Text>}
      />
      <Button
        block
        disabled={unreadCount === 0}
        type="link"
        onClick={() => {
          setUnreadCount(0)
          setOpen(false)
        }}
      >
        {messages.shell.markAllRead}
      </Button>
    </div>
  )

  return (
    <Popover
      content={content}
      open={open}
      placement="bottomRight"
      title={messages.common.notifications}
      trigger="click"
      onOpenChange={setOpen}
    >
      <Badge count={unreadCount} size="small">
        <Button aria-label={messages.common.notifications} icon={<BellOutlined />} />
      </Badge>
    </Popover>
  )
}
