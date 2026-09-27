/* oxlint-disable jsx-a11y/prefer-tag-over-role -- rich text requires a contenteditable textbox */
import {
  BoldOutlined,
  ItalicOutlined,
  LinkOutlined,
  OrderedListOutlined,
  UnderlineOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons'
import { Button, Divider, Select, Tooltip } from 'antd'
import { useRef } from 'react'
import type { Language } from '@/store/preferences-store'

interface RichTextEditorProps {
  initialValue?: string
  language: Language
  placeholder: string
  onChange: (html: string) => void
}

const toolbarCopy = {
  en: {
    style: 'Text style',
    paragraph: 'Paragraph',
    heading2: 'Heading 2',
    heading3: 'Heading 3',
    bold: 'Bold',
    italic: 'Italic',
    underline: 'Underline',
    bullets: 'Bulleted list',
    numbers: 'Numbered list',
    link: 'Add link',
    linkPrompt: 'Paste the link URL',
  },
  tr: {
    style: 'Metin stili',
    paragraph: 'Paragraf',
    heading2: 'Başlık 2',
    heading3: 'Başlık 3',
    bold: 'Kalın',
    italic: 'İtalik',
    underline: 'Altı çizili',
    bullets: 'Madde işaretli liste',
    numbers: 'Numaralı liste',
    link: 'Bağlantı ekle',
    linkPrompt: 'Bağlantı adresini yapıştırın',
  },
} as const

/**
 * A deliberately small editor for showcase forms. It uses the browser editing surface so the
 * example stays dependency-light while still supporting the formatting an actual job or news
 * entry needs: hierarchy, emphasis, lists, and links.
 */
export function RichTextEditor({
  initialValue = '',
  language,
  placeholder,
  onChange,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const text = toolbarCopy[language]

  const run = (command: string, value?: string) => {
    editorRef.current?.focus()
    document.execCommand(command, false, value)
    onChange(editorRef.current?.innerHTML ?? '')
  }

  return (
    <div className="showcase-editor">
      <div className="showcase-editor__toolbar" role="toolbar" aria-label={text.style}>
        <Select
          aria-label={text.style}
          className="showcase-editor__style"
          defaultValue="p"
          options={[
            { value: 'p', label: text.paragraph },
            { value: 'h2', label: text.heading2 },
            { value: 'h3', label: text.heading3 },
          ]}
          onChange={(value) => run('formatBlock', value)}
        />
        <Divider orientation="vertical" />
        <Tooltip title={text.bold}>
          <Button
            aria-label={text.bold}
            icon={<BoldOutlined />}
            type="text"
            onClick={() => run('bold')}
          />
        </Tooltip>
        <Tooltip title={text.italic}>
          <Button
            aria-label={text.italic}
            icon={<ItalicOutlined />}
            type="text"
            onClick={() => run('italic')}
          />
        </Tooltip>
        <Tooltip title={text.underline}>
          <Button
            aria-label={text.underline}
            icon={<UnderlineOutlined />}
            type="text"
            onClick={() => run('underline')}
          />
        </Tooltip>
        <Divider orientation="vertical" />
        <Tooltip title={text.bullets}>
          <Button
            aria-label={text.bullets}
            icon={<UnorderedListOutlined />}
            type="text"
            onClick={() => run('insertUnorderedList')}
          />
        </Tooltip>
        <Tooltip title={text.numbers}>
          <Button
            aria-label={text.numbers}
            icon={<OrderedListOutlined />}
            type="text"
            onClick={() => run('insertOrderedList')}
          />
        </Tooltip>
        <Tooltip title={text.link}>
          <Button
            aria-label={text.link}
            icon={<LinkOutlined />}
            type="text"
            onClick={() => {
              const href = window.prompt(text.linkPrompt, 'https://')
              if (href) run('createLink', href)
            }}
          />
        </Tooltip>
      </div>
      {/* A contenteditable surface needs textbox semantics; a textarea cannot render rich HTML. */}
      <div
        ref={editorRef}
        className="showcase-editor__surface"
        contentEditable
        data-placeholder={placeholder}
        dangerouslySetInnerHTML={{ __html: initialValue }}
        role="textbox"
        aria-label={placeholder}
        aria-multiline="true"
        suppressContentEditableWarning
        onInput={(event) => onChange(event.currentTarget.innerHTML)}
      />
    </div>
  )
}
