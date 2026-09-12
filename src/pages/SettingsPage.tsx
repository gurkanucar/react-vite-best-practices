import { App, Button, Card, Col, Descriptions, Row, Typography } from 'antd'
import { LanguageSelect } from '@/components/LanguageSelect/LanguageSelect'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import { ThemeControls } from '@/components/ThemeControls/ThemeControls'
import { getMessages, useMessages } from '@/i18n/messages'
import { initialPreferences, usePreferencesStore } from '@/store/preferences-store'

export function SettingsPage() {
  const messages = useMessages()
  const { message } = App.useApp()
  const language = usePreferencesStore((state) => state.language)
  const colorMode = usePreferencesStore((state) => state.colorMode)
  const compact = usePreferencesStore((state) => state.compact)
  const visualTheme = usePreferencesStore((state) => state.visualTheme)
  const resetPreferences = usePreferencesStore((state) => state.resetPreferences)

  const reset = () => {
    resetPreferences()
    // The reset also changes the language. Read the destination locale explicitly so
    // the toast does not use the stale language captured by this render.
    void message.success(getMessages(initialPreferences.language).settings.resetDone)
  }

  return (
    <div className="admin-page">
      <PageHeader title={messages.settings.title} description={messages.settings.description} />

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={15}>
          <Card id="appearance" className="settings-panel" title={messages.settings.appearance}>
            <Typography.Paragraph type="secondary">
              {messages.settings.appearanceDescription}
            </Typography.Paragraph>
            <ThemeControls />
          </Card>
        </Col>
        <Col xs={24} xl={9}>
          <Card className="settings-panel" title={messages.settings.language}>
            <Typography.Paragraph type="secondary">
              {messages.settings.languageDescription}
            </Typography.Paragraph>
            <LanguageSelect />
          </Card>
        </Col>
        <Col span={24}>
          <Card
            id="state"
            className="settings-panel"
            title={messages.settings.state}
            extra={<Button onClick={reset}>{messages.settings.reset}</Button>}
          >
            <Typography.Paragraph type="secondary">
              {messages.settings.stateDescription}
            </Typography.Paragraph>
            <Descriptions
              bordered
              layout="vertical"
              column={{ xs: 1, sm: 2, lg: 4 }}
              items={[
                { key: 'language', label: 'language', children: <code>{language}</code> },
                { key: 'colorMode', label: 'colorMode', children: <code>{colorMode}</code> },
                { key: 'compact', label: 'compact', children: <code>{String(compact)}</code> },
                { key: 'visualTheme', label: 'visualTheme', children: <code>{visualTheme}</code> },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
