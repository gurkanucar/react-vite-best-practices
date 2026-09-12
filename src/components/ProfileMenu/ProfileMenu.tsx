import { LogoutOutlined, SettingOutlined } from '@ant-design/icons'
import { App, Avatar, Button, Menu, Popover, type MenuProps } from 'antd'
import { useNavigate } from 'react-router'
import { useMessages } from '@/i18n/messages'

export function ProfileMenu() {
  const messages = useMessages()
  const navigate = useNavigate()
  const { message } = App.useApp()

  const items: MenuProps['items'] = [
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: messages.shell.profileSettings,
    },
    { type: 'divider' },
    {
      key: 'sign-out',
      danger: true,
      icon: <LogoutOutlined />,
      label: messages.shell.signOut,
    },
  ]

  const handleClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'settings') {
      void navigate('/settings#appearance')
      return
    }

    void message.success(messages.shell.signedOut)
    void navigate('/login')
  }

  return (
    <Popover
      content={<Menu items={items} selectable={false} onClick={handleClick} />}
      placement="bottomRight"
      trigger="click"
    >
      <Button
        aria-label={messages.shell.profile}
        icon={<Avatar size={22}>DA</Avatar>}
        type="text"
      />
    </Popover>
  )
}
