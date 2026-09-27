/* oxlint-disable jsx-a11y/prefer-tag-over-role -- rich text requires a contenteditable textbox */
import {
  BoldOutlined,
  ItalicOutlined,
  LinkOutlined,
  OrderedListOutlined,
  StrikethroughOutlined,
  UnderlineOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons'
import { Button, Divider, Flex, Input, Popover, Select, Tooltip, type InputRef } from 'antd'
import clsx from 'clsx'
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { useMessages } from '@/i18n/messages'
import './RichTextEditor.css'

export interface RichTextEditorProps {
  /** The HTML to show. The editor follows it when it changes from outside, such as a form reset. */
  value?: string
  onChange?: (html: string) => void
  placeholder?: string
  /** Set by `Form.Item`, so the field label focuses the editor. */
  id?: string
  disabled?: boolean
  /** The height of the writing area before it grows with its content. */
  minHeight?: number
  /** Leaves out the heading picker, for short text such as a task description. */
  headings?: boolean
  /** For use outside a form; inside a `Form.Item` the item's validation colours the border. */
  status?: 'error' | 'warning'
  className?: string
}

/** Only links a reader can follow safely; `javascript:` and friends are refused. */
function safeHref(raw: string): string | undefined {
  const value = raw.trim()
  if (!value) return undefined
  const href = /^[a-z][a-z\d+.-]*:/i.test(value) ? value : `https://${value}`

  return /^(https?:|mailto:)/i.test(href) ? href : undefined
}

/**
 * A deliberately small editor for forms. It uses the browser editing surface so the app stays
 * dependency-light while still supporting the formatting real content needs: hierarchy,
 * emphasis, lists, and links. It takes `value` and `onChange`, so it drops into a `Form.Item`
 * like any antd input.
 */
export function RichTextEditor({
  value = '',
  onChange,
  placeholder,
  id,
  disabled,
  minHeight = 320,
  headings = true,
  status,
  className,
}: RichTextEditorProps) {
  const messages = useMessages()
  const text = messages.editor
  const editorRef = useRef<HTMLDivElement>(null)
  // A click in the link popover takes the selection away, so it is kept to put back later.
  const selectionRef = useRef<Range | null>(null)
  const linkInputRef = useRef<InputRef>(null)
  const [linkOpen, setLinkOpen] = useState(false)
  const [link, setLink] = useState('')

  // Typing reports the editor's own HTML back as `value`, which is already on screen; only a
  // different value, one set from outside, is written in, so the caret is not thrown away.
  useEffect(() => {
    const editor = editorRef.current
    if (editor && editor.innerHTML !== value) editor.innerHTML = value
  }, [value])

  const emit = () => onChange?.(editorRef.current?.innerHTML ?? '')

  const run = (command: string, argument?: string) => {
    editorRef.current?.focus()
    document.execCommand(command, false, argument)
    emit()
  }

  const openLink = (open: boolean) => {
    if (open) {
      const selection = window.getSelection()
      const inside =
        selection && selection.rangeCount > 0 && editorRef.current?.contains(selection.anchorNode)
      selectionRef.current = inside ? selection.getRangeAt(0).cloneRange() : null
      setLink('')
    }
    setLinkOpen(open)
  }

  const insertLink = () => {
    const href = safeHref(link)
    if (!href) return

    editorRef.current?.focus()
    const selection = window.getSelection()
    if (selectionRef.current && selection) {
      selection.removeAllRanges()
      selection.addRange(selectionRef.current)
    }
    // With nothing selected there is no text to turn into a link, so the address becomes it.
    if (!selection || selection.isCollapsed) {
      const anchor = document.createElement('a')
      anchor.href = href
      anchor.textContent = href
      run('insertHTML', anchor.outerHTML)
    } else {
      run('createLink', href)
    }
    setLinkOpen(false)
  }

  const tool = (label: string, icon: ReactNode, command: string) => (
    <Tooltip title={label}>
      <Button
        aria-label={label}
        icon={icon}
        type="text"
        disabled={disabled}
        // Keeps the selection in the editor; a button that took focus would drop it.
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => run(command)}
      />
    </Tooltip>
  )

  return (
    <div
      className={clsx(
        'rich-text-editor',
        status && `rich-text-editor--${status}`,
        disabled && 'rich-text-editor--disabled',
        className,
      )}
      style={{ '--rich-text-min-height': `${minHeight}px` } as CSSProperties}
    >
      <div className="rich-text-editor__toolbar" role="toolbar" aria-label={text.toolbar}>
        {headings && (
          <>
            <Select
              aria-label={text.style}
              className="rich-text-editor__style"
              defaultValue="p"
              disabled={disabled}
              options={[
                { value: 'p', label: text.paragraph },
                { value: 'h2', label: text.heading2 },
                { value: 'h3', label: text.heading3 },
              ]}
              onChange={(block) => run('formatBlock', block)}
            />
            <Divider orientation="vertical" />
          </>
        )}
        {tool(text.bold, <BoldOutlined />, 'bold')}
        {tool(text.italic, <ItalicOutlined />, 'italic')}
        {tool(text.underline, <UnderlineOutlined />, 'underline')}
        {tool(text.strikethrough, <StrikethroughOutlined />, 'strikeThrough')}
        <Divider orientation="vertical" />
        {tool(text.bullets, <UnorderedListOutlined />, 'insertUnorderedList')}
        {tool(text.numbers, <OrderedListOutlined />, 'insertOrderedList')}
        <Popover
          trigger="click"
          open={linkOpen}
          onOpenChange={openLink}
          afterOpenChange={(open) => open && linkInputRef.current?.focus()}
          title={text.link}
          content={
            <Flex gap={8}>
              <Input
                ref={linkInputRef}
                value={link}
                placeholder="https://"
                aria-label={text.linkUrl}
                onChange={(event) => setLink(event.target.value)}
                onPressEnter={(event) => {
                  event.preventDefault()
                  insertLink()
                }}
              />
              <Button type="primary" disabled={!safeHref(link)} onClick={insertLink}>
                {text.insert}
              </Button>
            </Flex>
          }
        >
          <Tooltip title={text.link}>
            <Button
              aria-label={text.link}
              icon={<LinkOutlined />}
              type="text"
              disabled={disabled}
              onMouseDown={(event) => event.preventDefault()}
            />
          </Tooltip>
        </Popover>
      </div>
      {/* A contenteditable surface needs textbox semantics; a textarea cannot render rich HTML. */}
      <div
        ref={editorRef}
        id={id}
        className="rich-text-editor__surface rich-text"
        contentEditable={!disabled}
        data-placeholder={placeholder}
        role="textbox"
        aria-label={placeholder}
        aria-multiline="true"
        aria-invalid={status === 'error' || undefined}
        aria-disabled={disabled || undefined}
        suppressContentEditableWarning
        onInput={emit}
      />
    </div>
  )
}
