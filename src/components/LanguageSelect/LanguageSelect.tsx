import { GlobalOutlined } from '@ant-design/icons'
import { Select } from 'antd'
import { usePreferencesStore, type Language } from '@/store/preferences-store'
import { useMessages } from '@/i18n/messages'

export function LanguageSelect() {
  const language = usePreferencesStore((state) => state.language)
  const setLanguage = usePreferencesStore((state) => state.setLanguage)
  const messages = useMessages()

  return (
    <Select
      aria-label={messages.shell.language}
      className="language-select"
      prefix={<GlobalOutlined />}
      value={language}
      options={[
        { value: 'en', label: messages.common.english },
        { value: 'tr', label: messages.common.turkish },
      ]}
      onChange={(value) => setLanguage(value as Language)}
    />
  )
}
