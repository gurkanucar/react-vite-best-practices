import clsx from 'clsx'

interface RichTextViewProps {
  /** HTML written with `RichTextEditor` in this app. */
  html: string
  className?: string
}

/** Shows editor HTML with the same typography the editor uses, so a saved text looks as written. */
export function RichTextView({ html, className }: RichTextViewProps) {
  // oxlint-disable-next-line react/no-danger -- the HTML comes from the app's own editor
  return <div className={clsx('rich-text', className)} dangerouslySetInnerHTML={{ __html: html }} />
}
