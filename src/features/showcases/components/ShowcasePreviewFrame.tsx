import { ExportOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import type { ReactNode } from 'react'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import { usePreferencesStore } from '@/store/preferences-store'

interface ShowcasePreviewFrameProps {
  children: ReactNode
  description: { en: string; tr: string }
  standalone: boolean
  standalonePath: string
  title: { en: string; tr: string }
}

export function ShowcasePreviewFrame({
  children,
  description,
  standalone,
  standalonePath,
  title,
}: ShowcasePreviewFrameProps) {
  const language = usePreferencesStore((state) => state.language)

  if (standalone) return <>{children}</>

  return (
    <section>
      <PageHeader
        title={title[language]}
        description={description[language]}
        extra={
          <Button href={standalonePath} target="_blank" rel="noreferrer" icon={<ExportOutlined />}>
            {language === 'tr' ? 'Ayrı sekmede aç' : 'Open in a new tab'}
          </Button>
        }
      />
      <div className="showcase-preview-frame">{children}</div>
    </section>
  )
}
