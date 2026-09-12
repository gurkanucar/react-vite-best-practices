import { Card, Col, Row, Statistic } from 'antd'
import { profileStats } from '@/features/profile/data'
import { useMessages } from '@/i18n/messages'
import { usePreferencesStore } from '@/store/preferences-store'

export function ProfileStats() {
  const messages = useMessages()
  const language = usePreferencesStore((state) => state.language)
  const locale = language === 'tr' ? 'tr-TR' : 'en-US'
  const format = (value: number | string) => Number(value).toLocaleString(locale)

  return (
    <Card>
      <Row>
        <Col span={12}>
          <Statistic
            title={messages.profile.followers}
            value={profileStats.followers}
            formatter={format}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title={messages.profile.following}
            value={profileStats.following}
            formatter={format}
          />
        </Col>
      </Row>
    </Card>
  )
}
