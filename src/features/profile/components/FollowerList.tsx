import { EnvironmentOutlined } from '@ant-design/icons'
import { Avatar, Button, Card, Col, Flex, Row, Typography } from 'antd'
import { useState } from 'react'
import { followers } from '@/features/profile/data'
import { initialsOf } from '@/features/profile/types'
import { useMessages } from '@/i18n/messages'

export function FollowerList() {
  const messages = useMessages()
  const [followed, setFollowed] = useState(
    () => new Set(followers.filter((person) => person.following).map((person) => person.id)),
  )

  const toggle = (id: string) =>
    setFollowed((current) => {
      const next = new Set(current)

      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }

      return next
    })

  return (
    <Row gutter={[16, 16]}>
      {followers.map((person) => (
        <Col key={person.id} xs={24} sm={12} xl={8}>
          <Card>
            {/* No wrapping: a button that drops to its own line makes the row of cards
                uneven, so the location ellipsizes instead. */}
            <Flex align="center" gap={12} justify="space-between">
              <Flex align="center" gap={12} style={{ minWidth: 0 }}>
                <Avatar size="large">{initialsOf(person.name)}</Avatar>
                <div style={{ minWidth: 0 }}>
                  <Typography.Text strong ellipsis>
                    {person.name}
                  </Typography.Text>
                  <br />
                  <Typography.Text type="secondary" ellipsis>
                    <EnvironmentOutlined aria-hidden="true" /> {person.location}
                  </Typography.Text>
                </div>
              </Flex>

              <Button
                type={followed.has(person.id) ? 'default' : 'primary'}
                onClick={() => toggle(person.id)}
                style={{ flex: 'none' }}
              >
                {followed.has(person.id) ? messages.profile.followed : messages.profile.follow}
              </Button>
            </Flex>
          </Card>
        </Col>
      ))}
    </Row>
  )
}
