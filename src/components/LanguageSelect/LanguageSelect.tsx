import { Select } from 'antd'
import GB from 'country-flag-icons/react/3x2/GB'
import TR from 'country-flag-icons/react/3x2/TR'
import { usePreferencesStore, type Language } from '@/store/preferences-store'
import { useMessages } from '@/i18n/messages'
import './LanguageSelect.css'

interface LanguageOptionProps {
  flag: typeof GB
  label: string
}

function LanguageOption({ flag: Flag, label }: LanguageOptionProps) {
  return (
    <span className="language-option">
      <Flag aria-hidden="true" className="language-option__flag" />
      <span>{label}</span>
    </span>
  )
}

export function LanguageSelect() {
  const language = usePreferencesStore((state) => state.language)
  const setLanguage = usePreferencesStore((state) => state.setLanguage)
  const messages = useMessages()

  return (
    <Select
      aria-label={messages.shell.language}
      className="language-select"
      styles={{ root: { height: 'var(--ant-select-height)' } }}
      value={language}
      options={[
        {
          value: 'en',
          label: <LanguageOption flag={GB} label={messages.common.english} />,
        },
        {
          value: 'tr',
          label: <LanguageOption flag={TR} label={messages.common.turkish} />,
        },
      ]}
      onChange={(value) => setLanguage(value as Language)}
    />
  )
}
