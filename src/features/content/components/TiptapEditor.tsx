import {
  AlignCenterOutlined,
  AlignLeftOutlined,
  AlignRightOutlined,
  BoldOutlined,
  ItalicOutlined,
  LinkOutlined,
  OrderedListOutlined,
  RedoOutlined,
  StrikethroughOutlined,
  UnderlineOutlined,
  UndoOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons'
import TextAlign from '@tiptap/extension-text-align'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Button, Card, Flex, Input, Modal, Select, Tooltip, Typography, theme } from 'antd'
import { useEffect, useState } from 'react'
import type { Language } from '@/store/preferences-store'

interface TiptapEditorProps {
  language: Language
  /** Optional so a Form.Item can supply both. */
  value?: string
  placeholder: string
  onChange?: (value: string) => void
}

const labels = {
  en: {
    paragraph: 'Paragraph',
    heading2: 'Heading 2',
    heading3: 'Heading 3',
    bold: 'Bold',
    italic: 'Italic',
    underline: 'Underline',
    strike: 'Strikethrough',
    bulletList: 'Bullet list',
    orderedList: 'Numbered list',
    quote: 'Block quote',
    alignLeft: 'Align left',
    alignCenter: 'Align center',
    alignRight: 'Align right',
    link: 'Add link',
    undo: 'Undo',
    redo: 'Redo',
    linkTitle: 'Add or edit link',
    linkLabel: 'Link URL',
    linkPlaceholder: 'https://example.com',
    removeLink: 'Remove link',
  },
  tr: {
    paragraph: 'Paragraf',
    heading2: 'Başlık 2',
    heading3: 'Başlık 3',
    bold: 'Kalın',
    italic: 'İtalik',
    underline: 'Altı çizili',
    strike: 'Üzeri çizili',
    bulletList: 'Madde işaretli liste',
    orderedList: 'Numaralı liste',
    quote: 'Alıntı',
    alignLeft: 'Sola hizala',
    alignCenter: 'Ortala',
    alignRight: 'Sağa hizala',
    link: 'Bağlantı ekle',
    undo: 'Geri al',
    redo: 'Yinele',
    linkTitle: 'Bağlantı ekle veya düzenle',
    linkLabel: 'Bağlantı adresi',
    linkPlaceholder: 'https://ornek.com',
    removeLink: 'Bağlantıyı kaldır',
  },
} as const

export function TiptapEditor({ language, value = '', placeholder, onChange }: TiptapEditorProps) {
  const { token } = theme.useToken()
  const text = labels[language]
  const [linkOpen, setLinkOpen] = useState(false)
  const [linkValue, setLinkValue] = useState('')
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: { openOnClick: false, autolink: true },
        underline: {},
      }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: value,
    editorProps: {
      attributes: {
        'aria-label': placeholder,
        style: `min-height: 320px; padding: 16px; outline: none; line-height: 1.75; color: ${token.colorText};`,
      },
    },
    onUpdate: ({ editor: currentEditor }) => onChange?.(currentEditor.getHTML()),
  })

  useEffect(() => {
    if (editor && !editor.isDestroyed && editor.getHTML() !== value) {
      editor.commands.setContent(value, { emitUpdate: false })
    }
  }, [editor, value])

  if (!editor) return null

  const openLinkDialog = () => {
    setLinkValue(editor.getAttributes('link').href ?? '')
    setLinkOpen(true)
  }

  const applyLink = () => {
    const href = linkValue.trim()
    if (href) editor.chain().focus().extendMarkRange('link').setLink({ href }).run()
    else editor.chain().focus().extendMarkRange('link').unsetLink().run()
    setLinkOpen(false)
  }

  const headingValue = editor.isActive('heading', { level: 2 })
    ? 'heading2'
    : editor.isActive('heading', { level: 3 })
      ? 'heading3'
      : 'paragraph'

  return (
    <>
      <Card size="small" styles={{ body: { padding: 0 } }}>
        <Flex
          gap={4}
          wrap
          align="center"
          style={{ padding: 8, borderBottom: `1px solid ${token.colorBorderSecondary}` }}
        >
          <Select
            aria-label={text.paragraph}
            value={headingValue}
            style={{ width: 132 }}
            options={[
              { value: 'paragraph', label: text.paragraph },
              { value: 'heading2', label: text.heading2 },
              { value: 'heading3', label: text.heading3 },
            ]}
            onChange={(nextValue) => {
              if (nextValue === 'heading2') editor.chain().focus().toggleHeading({ level: 2 }).run()
              else if (nextValue === 'heading3')
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              else editor.chain().focus().setParagraph().run()
            }}
          />
          <Tooltip title={text.bold}>
            <Button
              aria-label={text.bold}
              type={editor.isActive('bold') ? 'primary' : 'text'}
              icon={<BoldOutlined />}
              onClick={() => editor.chain().focus().toggleBold().run()}
            />
          </Tooltip>
          <Tooltip title={text.italic}>
            <Button
              aria-label={text.italic}
              type={editor.isActive('italic') ? 'primary' : 'text'}
              icon={<ItalicOutlined />}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            />
          </Tooltip>
          <Tooltip title={text.underline}>
            <Button
              aria-label={text.underline}
              type={editor.isActive('underline') ? 'primary' : 'text'}
              icon={<UnderlineOutlined />}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
            />
          </Tooltip>
          <Tooltip title={text.strike}>
            <Button
              aria-label={text.strike}
              type={editor.isActive('strike') ? 'primary' : 'text'}
              icon={<StrikethroughOutlined />}
              onClick={() => editor.chain().focus().toggleStrike().run()}
            />
          </Tooltip>
          <Tooltip title={text.bulletList}>
            <Button
              aria-label={text.bulletList}
              type={editor.isActive('bulletList') ? 'primary' : 'text'}
              icon={<UnorderedListOutlined />}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            />
          </Tooltip>
          <Tooltip title={text.orderedList}>
            <Button
              aria-label={text.orderedList}
              type={editor.isActive('orderedList') ? 'primary' : 'text'}
              icon={<OrderedListOutlined />}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            />
          </Tooltip>
          <Tooltip title={text.quote}>
            <Button
              aria-label={text.quote}
              type={editor.isActive('blockquote') ? 'primary' : 'text'}
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
            >
              “ ”
            </Button>
          </Tooltip>
          <Tooltip title={text.alignLeft}>
            <Button
              aria-label={text.alignLeft}
              type={editor.isActive({ textAlign: 'left' }) ? 'primary' : 'text'}
              icon={<AlignLeftOutlined />}
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
            />
          </Tooltip>
          <Tooltip title={text.alignCenter}>
            <Button
              aria-label={text.alignCenter}
              type={editor.isActive({ textAlign: 'center' }) ? 'primary' : 'text'}
              icon={<AlignCenterOutlined />}
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
            />
          </Tooltip>
          <Tooltip title={text.alignRight}>
            <Button
              aria-label={text.alignRight}
              type={editor.isActive({ textAlign: 'right' }) ? 'primary' : 'text'}
              icon={<AlignRightOutlined />}
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
            />
          </Tooltip>
          <Tooltip title={text.link}>
            <Button
              aria-label={text.link}
              type={editor.isActive('link') ? 'primary' : 'text'}
              icon={<LinkOutlined />}
              onClick={openLinkDialog}
            />
          </Tooltip>
          <Tooltip title={text.undo}>
            <Button
              aria-label={text.undo}
              type="text"
              icon={<UndoOutlined />}
              disabled={!editor.can().chain().focus().undo().run()}
              onClick={() => editor.chain().focus().undo().run()}
            />
          </Tooltip>
          <Tooltip title={text.redo}>
            <Button
              aria-label={text.redo}
              type="text"
              icon={<RedoOutlined />}
              disabled={!editor.can().chain().focus().redo().run()}
              onClick={() => editor.chain().focus().redo().run()}
            />
          </Tooltip>
        </Flex>
        <div style={{ position: 'relative' }}>
          {editor.isEmpty ? (
            <Typography.Text
              type="secondary"
              style={{ position: 'absolute', insetInlineStart: 16, top: 16, pointerEvents: 'none' }}
            >
              {placeholder}
            </Typography.Text>
          ) : null}
          <EditorContent editor={editor} />
        </div>
      </Card>
      <Modal
        open={linkOpen}
        title={text.linkTitle}
        okText={text.link}
        cancelText={language === 'tr' ? 'İptal' : 'Cancel'}
        onOk={applyLink}
        onCancel={() => setLinkOpen(false)}
        footer={(_, { OkBtn, CancelBtn }) => (
          <Flex justify="space-between">
            <Button
              danger
              disabled={!editor.isActive('link')}
              onClick={() => {
                editor.chain().focus().unsetLink().run()
                setLinkOpen(false)
              }}
            >
              {text.removeLink}
            </Button>
            <Flex gap={8}>
              <CancelBtn />
              <OkBtn />
            </Flex>
          </Flex>
        )}
      >
        <Typography.Text>{text.linkLabel}</Typography.Text>
        <Input
          value={linkValue}
          placeholder={text.linkPlaceholder}
          onChange={(event) => setLinkValue(event.target.value)}
          onPressEnter={applyLink}
        />
      </Modal>
    </>
  )
}
