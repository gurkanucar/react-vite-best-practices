import { Card, Flex, Result, Typography } from 'antd'
import { useEffect } from 'react'
import { useParams } from 'react-router'
import { LanguageSelect } from '@/components/LanguageSelect/LanguageSelect'
import { ColorModeControl } from '@/components/ThemeControls/ThemeControls'
import { FormResponder } from '@/features/forms/components'
import { useFormCopy, useFormStore } from '@/features/forms/hooks'
import { isAnswerable } from '@/features/forms/types'
import './forms.css'

/**
 * The page the people answering a form open, from a shared link or a QR code. It has no
 * admin menu, no status tag and no way back into the app: only the form, and the language
 * and colour controls a stranger might need to read it.
 */
export function PublicFormPage() {
  const copy = useFormCopy()
  const { formId } = useParams<{ formId: string }>()
  const form = useFormStore((state) => state.forms.find((entry) => entry.id === formId))
  const hasRequired = form?.fields.some((field) => isAnswerable(field) && field.required)

  useEffect(() => {
    if (!form) return
    const previous = document.title
    document.title = form.title
    return () => {
      document.title = previous
    }
  }, [form])

  return (
    <div className="public-form">
      <Flex justify="end" gap={8} className="public-form__controls">
        <ColorModeControl variant="menu" />
        <LanguageSelect />
      </Flex>

      <main className="public-form__main">
        <Card className="public-form__card">
          {form ? (
            <>
              <div className="public-form__accent" aria-hidden="true" />
              <Typography.Title level={1} className="public-form__title">
                {form.title}
              </Typography.Title>
              {form.description && (
                <Typography.Paragraph type="secondary" className="public-form__description">
                  {form.description}
                </Typography.Paragraph>
              )}
              {hasRequired && form.status === 'published' && (
                <Typography.Paragraph type="secondary" className="public-form__required">
                  {copy.requiredHint}
                </Typography.Paragraph>
              )}
              <FormResponder form={form} audience="public" />
            </>
          ) : (
            <Result status="404" title={copy.notFoundTitle} subTitle={copy.notFoundDescription} />
          )}
        </Card>
        <Typography.Text type="secondary" className="public-form__footer">
          {copy.poweredBy}
        </Typography.Text>
      </main>
    </div>
  )
}
