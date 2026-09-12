import { MessageOutlined, MoreOutlined, PhoneOutlined } from '@ant-design/icons'
import { Avatar, Button, Card, Col, Dropdown, Empty, Flex, Input, Row, Typography } from 'antd'
import { useState } from 'react'
import { friends } from '@/features/profile/data'
import { initialsOf } from '@/features/profile/types'
import { useMessages } from '@/i18n/messages'

export function FriendGrid() {
  const messages = useMessages()
  const [search, setSearch] = useState('')
  const visible = friends.filter((friend) =>
    friend.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
  )

  return (
    <Card
      title={messages.profile.friends}
      extra={
        <Input.Search
          allowClear
          placeholder={messages.profile.searchFriends}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          style={{ maxWidth: 220 }}
        />
      }
    >
      {visible.length === 0 ? (
        <Empty />
      ) : (
        <Row gutter={[16, 16]}>
          {visible.map((friend) => (
            <Col key={friend.id} xs={24} sm={12} xl={8}>
              <Card
                actions={[
                  <Button
                    key="message"
                    type="text"
                    aria-label={`${messages.profile.sendMessage}: ${friend.name}`}
                    icon={<MessageOutlined aria-hidden="true" />}
                  />,
                  <Button
                    key="call"
                    type="text"
                    aria-label={`${messages.profile.call}: ${friend.name}`}
                    icon={<PhoneOutlined aria-hidden="true" />}
                  />,
                  <Dropdown
                    key="more"
                    trigger={['click']}
                    menu={{
                      items: [
                        { key: 'profile', label: messages.profile.viewProfile },
                        { key: 'remove', label: messages.profile.removeFriend, danger: true },
                      ],
                    }}
                  >
                    <Button
                      type="text"
                      aria-label={`${messages.profile.postActions}: ${friend.name}`}
                      icon={<MoreOutlined aria-hidden="true" />}
                    />
                  </Dropdown>,
                ]}
              >
                <Flex vertical align="center" gap={8}>
                  <Avatar size={64}>{initialsOf(friend.name)}</Avatar>
                  <Typography.Text strong>{friend.name}</Typography.Text>
                  <Typography.Text type="secondary">
                    {messages.profile.roles[friend.roleId as keyof typeof messages.profile.roles]}
                  </Typography.Text>
                </Flex>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Card>
  )
}
