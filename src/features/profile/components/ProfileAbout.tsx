import { BankOutlined, EnvironmentOutlined, MailOutlined, ReadOutlined } from '@ant-design/icons'
import { Card, Flex, Listy, Typography } from 'antd'
import type { ReactNode } from 'react'
import { profileFacts } from '@/features/profile/data'
import { useMessages } from '@/i18n/messages'

interface Fact {
  key: string
  icon: ReactNode
  label?: string
  value: string
}

export function ProfileAbout() {
  const messages = useMessages()

  const facts: Fact[] = [
    {
      key: 'location',
      icon: <EnvironmentOutlined aria-hidden="true" />,
      label: messages.profile.livesAt,
      value: profileFacts.location,
    },
    { key: 'email', icon: <MailOutlined aria-hidden="true" />, value: profileFacts.email },
    {
      key: 'company',
      icon: <BankOutlined aria-hidden="true" />,
      label: messages.profile.worksAt,
      value: profileFacts.company,
    },
    {
      key: 'school',
      icon: <ReadOutlined aria-hidden="true" />,
      label: messages.profile.studiedAt,
      value: profileFacts.school,
    },
  ]

  return (
    <Card title={messages.profile.about}>
      <Typography.Paragraph type="secondary">{messages.profile.bio}</Typography.Paragraph>

      <Listy<Fact>
        rowKey="key"
        items={facts}
        itemRender={(fact) => (
          <Flex align="center" gap={12}>
            <Typography.Text type="secondary">{fact.icon}</Typography.Text>
            <Typography.Text>
              {fact.label ? `${fact.label} ` : ''}
              <Typography.Text strong>{fact.value}</Typography.Text>
            </Typography.Text>
          </Flex>
        )}
      />
    </Card>
  )
}
