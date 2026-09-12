import { App, Button, Card, Divider, Flex, Switch, Typography } from 'antd'
import { useState } from 'react'
import { notificationGroups } from '@/features/account/data'
import { useMessages } from '@/i18n/messages'

type OptionState = Record<string, boolean>

export function NotificationsTab() {
  const messages = useMessages()
  const { message } = App.useApp()
  const [enabled, setEnabled] = useState<OptionState>(() =>
    Object.fromEntries(
      notificationGroups.flatMap((group) =>
        group.options.map((option) => [option.id, option.enabled]),
      ),
    ),
  )

  return (
    <Card>
      {notificationGroups.map((group, index) => (
        <div key={group.id}>
          {index > 0 && <Divider />}

          <Typography.Title level={5}>
            {messages.account.notificationGroups[group.id as 'activity' | 'application']}
          </Typography.Title>

          <Flex vertical gap={16}>
            {group.options.map((option) => {
              const copy =
                messages.account.notificationOptions[
                  option.id as keyof typeof messages.account.notificationOptions
                ]

              return (
                <Flex key={option.id} align="center" justify="space-between" gap={16}>
                  <div>
                    <Typography.Text>{copy.title}</Typography.Text>
                    <br />
                    <Typography.Text type="secondary">{copy.description}</Typography.Text>
                  </div>

                  <Switch
                    aria-label={copy.title}
                    checked={enabled[option.id]}
                    onChange={(value) =>
                      setEnabled((current) => ({ ...current, [option.id]: value }))
                    }
                  />
                </Flex>
              )
            })}
          </Flex>
        </div>
      ))}

      <Flex justify="flex-end" style={{ marginTop: 24 }}>
        <Button type="primary" onClick={() => message.success(messages.account.saved)}>
          {messages.account.saveChanges}
        </Button>
      </Flex>
    </Card>
  )
}
