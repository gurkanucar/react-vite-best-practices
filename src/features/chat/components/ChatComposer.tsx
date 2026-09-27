import {
  AudioOutlined,
  CloseOutlined,
  DeleteOutlined,
  FileOutlined,
  PaperClipOutlined,
  PictureOutlined,
  SendOutlined,
  SmileOutlined,
} from '@ant-design/icons'
import { FileCard, Sender } from '@ant-design/x'
import {
  App,
  Badge,
  Button,
  Dropdown,
  Flex,
  Image,
  Popover,
  Tooltip,
  Typography,
  Upload,
} from 'antd'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { authorName, contactById, messagePreview } from '@/features/chat/components/chatText'
import { useVoiceRecorder, type Draft } from '@/features/chat/hooks'
import { formatDuration, type ChatAttachment, type ChatMessage } from '@/features/chat/types'
import { useMessages } from '@/i18n/messages'
import { usePreferencesStore } from '@/store/preferences-store'

/** A picker's worth of the emoji people actually use, rather than the whole Unicode set. */
const EMOJI = (
  '😀 😄 😂 🤣 😊 😍 😘 😎 🤔 😅 😉 🙃 😴 😢 😭 😡 😮 🥳 🤩 🤗 🙄 😬 🤝 🙏 ' +
  '👍 👎 👏 🙌 💪 👋 ✌️ 👌 ❤️ 🔥 🎉 ✨ 💯 ✅ ☕ 🎁'
).split(' ')

interface ChatComposerProps {
  replyTo: ChatMessage | null
  onCancelReply: () => void
  /** Called once per message: photos travel with the text, every other file on its own. */
  onSend: (draft: Draft) => void
}

export function ChatComposer({ replyTo, onCancelReply, onSend }: ChatComposerProps) {
  const messages = useMessages()
  const language = usePreferencesStore((state) => state.language)
  const { message } = App.useApp()
  const recorder = useVoiceRecorder()
  const [text, setText] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [files, setFiles] = useState<ChatAttachment[]>([])
  const [emojiOpen, setEmojiOpen] = useState(false)
  // Object URLs outlive the component unless they are revoked; sent ones are still shown.
  const pending = useRef<string[]>([])

  useEffect(() => {
    const urls = pending
    return () => urls.current.forEach((url) => URL.revokeObjectURL(url))
  }, [])

  const track = (file: File) => {
    const url = URL.createObjectURL(file)
    pending.current.push(url)
    return url
  }

  const addFiles = (picked: File[]) => {
    for (const file of picked) {
      if (file.type.startsWith('image/')) {
        const url = track(file)
        setImages((current) => [...current, url])
      } else {
        const kind = file.type.startsWith('video/') ? 'video' : 'file'
        const attachment: ChatAttachment = {
          kind,
          src: track(file),
          name: file.name,
          size: file.size,
        }
        setFiles((current) => [...current, attachment])
      }
    }
  }

  const forget = (url: string) => {
    URL.revokeObjectURL(url)
    pending.current = pending.current.filter((item) => item !== url)
  }

  const canSend = text.trim().length > 0 || images.length > 0 || files.length > 0

  const submit = () => {
    if (!canSend) return

    if (text.trim() || images.length > 0) onSend({ text, images, replyToId: replyTo?.id })
    files.forEach((attachment, index) =>
      onSend({
        text: '',
        images: [],
        attachment,
        // A reply with only a file attached still quotes what it answers.
        replyToId: !text.trim() && images.length === 0 && index === 0 ? replyTo?.id : undefined,
      }),
    )
    // Sent files are on screen now; they are no longer this composer's to revoke.
    pending.current = []
    setText('')
    setImages([])
    setFiles([])
  }

  const startRecording = async () => {
    if (!(await recorder.start())) void message.error(messages.chat.micUnavailable)
  }

  const sendRecording = async () => {
    const recording = await recorder.stop()
    if (!recording) return

    onSend({
      text: '',
      images: [],
      attachment: { kind: 'voice', src: recording.src, duration: recording.duration },
      replyToId: replyTo?.id,
    })
  }

  const picker = (accept: string, children: React.ReactNode) => (
    <Upload
      accept={accept}
      multiple
      showUploadList={false}
      beforeUpload={(file) => {
        addFiles([file])
        return Upload.LIST_IGNORE
      }}
    >
      {children}
    </Upload>
  )

  if (recorder.recording) {
    return (
      <Flex align="center" gap={12} className="chat-recorder" aria-live="polite">
        <Tooltip title={messages.chat.cancelRecording}>
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            aria-label={messages.chat.cancelRecording}
            onClick={recorder.cancel}
          />
        </Tooltip>
        <Badge status="error" />
        <Typography.Text className="chat-recorder__time">
          {formatDuration(recorder.elapsed)}
        </Typography.Text>
        <Typography.Text type="secondary" className="chat-recorder__label">
          {messages.chat.recording}
        </Typography.Text>
        <Button
          type="primary"
          shape="circle"
          icon={<SendOutlined />}
          aria-label={messages.chat.sendRecording}
          onClick={() => void sendRecording()}
        />
      </Flex>
    )
  }

  const header = (
    <Sender.Header
      open={Boolean(replyTo) || images.length > 0 || files.length > 0}
      closable={false}
      title={
        replyTo && (
          <Flex align="center" justify="space-between" gap={8}>
            <div
              className="chat-quote chat-quote--composer"
              style={{ '--member-color': contactById(replyTo.authorId)?.color } as CSSProperties}
            >
              <span className="chat-author">
                {messages.chat.replyingTo.replace('{name}', authorName(replyTo.authorId, messages))}
              </span>
              <Typography.Text type="secondary" ellipsis>
                {messagePreview(replyTo, messages, language)}
              </Typography.Text>
            </div>
            <Button
              type="text"
              size="small"
              icon={<CloseOutlined />}
              aria-label={messages.chat.cancelReply}
              onClick={onCancelReply}
            />
          </Flex>
        )
      }
    >
      {(images.length > 0 || files.length > 0) && (
        <Flex gap={8} wrap align="center">
          {images.map((url) => (
            <div key={url} className="chat-attachment">
              <Image src={url} width={64} height={64} alt="" />
              <Button
                size="small"
                shape="circle"
                icon={<CloseOutlined />}
                className="chat-attachment__remove"
                aria-label={messages.chat.removePhoto}
                onClick={() => {
                  forget(url)
                  setImages((current) => current.filter((item) => item !== url))
                }}
              />
            </div>
          ))}
          {files.map((attachment) => (
            <div key={attachment.src} className="chat-attachment">
              <FileCard name={attachment.name ?? ''} byte={attachment.size} size="small" />
              <Button
                size="small"
                shape="circle"
                icon={<CloseOutlined />}
                className="chat-attachment__remove"
                aria-label={messages.chat.removePhoto}
                onClick={() => {
                  forget(attachment.src)
                  setFiles((current) => current.filter((item) => item !== attachment))
                }}
              />
            </div>
          ))}
        </Flex>
      )}
    </Sender.Header>
  )

  return (
    <Sender
      className="chat-composer"
      header={header}
      value={text}
      onChange={setText}
      onSubmit={submit}
      onPasteFile={(pasted) => addFiles(Array.from(pasted))}
      placeholder={messages.chat.placeholder}
      autoSize={{ minRows: 1, maxRows: 5 }}
      prefix={
        <Flex gap={2}>
          <Popover
            open={emojiOpen}
            onOpenChange={setEmojiOpen}
            trigger="click"
            placement="topLeft"
            content={
              <div className="chat-emoji-grid">
                {EMOJI.map((emoji) => (
                  <Button
                    key={emoji}
                    type="text"
                    className="chat-emoji-button"
                    aria-label={emoji}
                    onClick={() => setText((current) => current + emoji)}
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            }
          >
            <Tooltip title={messages.chat.emoji}>
              <Button type="text" icon={<SmileOutlined />} aria-label={messages.chat.emoji} />
            </Tooltip>
          </Popover>
          <Dropdown
            trigger={['click']}
            placement="topLeft"
            menu={{
              items: [
                {
                  key: 'media',
                  icon: <PictureOutlined />,
                  label: picker('image/*,video/*', messages.chat.attachMedia),
                },
                {
                  key: 'document',
                  icon: <FileOutlined />,
                  label: picker('*', messages.chat.attachDocument),
                },
              ],
            }}
          >
            <Button type="text" icon={<PaperClipOutlined />} aria-label={messages.chat.attach} />
          </Dropdown>
        </Flex>
      }
      suffix={(_, { components: { SendButton } }) =>
        // With nothing typed the button records a voice note instead, as in WhatsApp.
        canSend || !recorder.supported ? (
          <SendButton disabled={!canSend} icon={<SendOutlined />} aria-label={messages.chat.send} />
        ) : (
          <Tooltip title={messages.chat.record}>
            <Button
              type="primary"
              shape="circle"
              icon={<AudioOutlined />}
              aria-label={messages.chat.record}
              onClick={() => void startRecording()}
            />
          </Tooltip>
        )
      }
    />
  )
}
