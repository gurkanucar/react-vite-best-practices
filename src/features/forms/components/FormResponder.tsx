import { Alert, Button, Result } from 'antd'
import { useState } from 'react'
import { FormRenderer } from '@/features/forms/components/FormRenderer'
import { useFormCopy, useFormStore } from '@/features/forms/hooks'
import type { FormSchema } from '@/features/forms/types'

interface FormResponderProps {
  form: FormSchema
  /**
   * The team can try a draft from the admin; the public page refuses it, because a draft's
   * questions may still change and its answers would not fit the final form.
   */
  audience: 'team' | 'public'
}

/** Answering a form, start to thanks: the questions, the success screen and "submit another". */
export function FormResponder({ form, audience }: FormResponderProps) {
  const copy = useFormCopy()
  const submitResponse = useFormStore((state) => state.submitResponse)
  const [submitted, setSubmitted] = useState(false)
  // Bumped for "submit another", which remounts the renderer with an empty form.
  const [round, setRound] = useState(0)

  if (form.status === 'closed') {
    return <Result status="warning" title={copy.closedTitle} subTitle={copy.closedDescription} />
  }
  if (form.status === 'draft' && audience === 'public') {
    return <Result status="info" title={copy.notOpenTitle} subTitle={copy.notOpenDescription} />
  }
  if (submitted) {
    return (
      <Result
        status="success"
        title={copy.thanks}
        subTitle={form.successMessage}
        extra={
          <Button
            type="primary"
            onClick={() => {
              setSubmitted(false)
              setRound((current) => current + 1)
            }}
          >
            {copy.submitAnother}
          </Button>
        }
      />
    )
  }

  return (
    <>
      {form.status === 'draft' && (
        <Alert type="warning" showIcon title={copy.draftNotice} className="form-fill__notice" />
      )}
      <FormRenderer
        key={round}
        form={form}
        copy={copy}
        onSubmit={(answers) => {
          submitResponse(form.id, answers)
          setSubmitted(true)
        }}
      />
    </>
  )
}
