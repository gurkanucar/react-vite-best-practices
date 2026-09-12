import {
  FacebookOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  TwitterOutlined,
} from '@ant-design/icons'
import { Card, Flex, Listy, Typography } from 'antd'
import { socialLinks } from '@/features/profile/data'
import type { SocialLink } from '@/features/profile/types'
import { useMessages } from '@/i18n/messages'

const icons: Record<SocialLink['id'], typeof FacebookOutlined> = {
  facebook: FacebookOutlined,
  instagram: InstagramOutlined,
  linkedin: LinkedinOutlined,
  twitter: TwitterOutlined,
}

export function ProfileSocial() {
  const messages = useMessages()

  return (
    <Card title={messages.profile.social}>
      <Listy<SocialLink>
        rowKey="id"
        items={socialLinks}
        itemRender={(link) => {
          const Icon = icons[link.id]

          return (
            <Flex align="center" gap={12}>
              <Typography.Text type="secondary">
                <Icon aria-hidden="true" />
              </Typography.Text>
              <Typography.Link href={link.url} target="_blank" rel="noreferrer" ellipsis>
                {link.url}
              </Typography.Link>
            </Flex>
          )
        }}
      />
    </Card>
  )
}
