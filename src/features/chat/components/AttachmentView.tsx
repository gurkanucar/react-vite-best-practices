import { AudioOutlined, CaretRightFilled, PauseOutlined } from '@ant-design/icons'
import { FileCard } from '@ant-design/x'
import { Avatar, Button, Flex, Slider, Tooltip, Typography } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { formatDuration, type ChatAttachment } from '@/features/chat/types'
import { useMessages } from '@/i18n/messages'

/** WhatsApp's speed button cycles through these. */
const SPEEDS = [1, 1.5, 2]

/**
 * A voice note: play, a scrubber and the time, with the speed switch WhatsApp has. The
 * `<audio>` element does the playing; antd draws the controls so they follow the theme.
 */
function VoiceNote({ attachment, color }: { attachment: ChatAttachment; color?: string }) {
  const messages = useMessages()
  const audio = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [position, setPosition] = useState(0)
  const [duration, setDuration] = useState(attachment.duration ?? 0)
  const [speed, setSpeed] = useState(1)

  useEffect(() => {
    if (audio.current) audio.current.playbackRate = speed
  }, [speed])

  const toggle = () => {
    const element = audio.current
    if (!element) return

    if (element.paused) void element.play().catch(() => setPlaying(false))
    else element.pause()
  }

  return (
    <Flex align="center" gap={8} className="chat-voice">
      <Avatar
        size={36}
        icon={<AudioOutlined />}
        style={{ flex: 'none', backgroundColor: color }}
        aria-hidden="true"
      />
      <Button
        type="text"
        shape="circle"
        icon={playing ? <PauseOutlined /> : <CaretRightFilled />}
        aria-label={playing ? messages.chat.pause : messages.chat.play}
        onClick={toggle}
      />
      <Flex vertical flex={1} className="chat-voice__track">
        <Slider
          min={0}
          max={duration || 1}
          step={0.1}
          value={position}
          tooltip={{ open: false }}
          aria-label={messages.chat.voiceMessage}
          onChange={(value) => {
            if (audio.current) audio.current.currentTime = value
            setPosition(value)
          }}
        />
        <Typography.Text type="secondary" className="chat-voice__time">
          {formatDuration(playing || position > 0 ? position : duration)}
        </Typography.Text>
      </Flex>
      <Tooltip title={messages.chat.speed}>
        <Button
          size="small"
          shape="round"
          onClick={() =>
            setSpeed((current) => SPEEDS[(SPEEDS.indexOf(current) + 1) % SPEEDS.length]!)
          }
        >
          {speed}×
        </Button>
      </Tooltip>
      {/* oxlint-disable-next-line jsx-a11y/media-has-caption -- a user's voice note has no captions to offer */}
      <audio
        ref={audio}
        src={attachment.src}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false)
          setPosition(0)
        }}
        onTimeUpdate={(event) => setPosition(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => {
          // A recording made in the browser reports Infinity until it has been played.
          const reported = event.currentTarget.duration
          if (Number.isFinite(reported)) setDuration(reported)
        }}
      />
    </Flex>
  )
}

export function AttachmentView({
  attachment,
  color,
}: {
  attachment: ChatAttachment
  /** The author's colour, for the voice note's avatar. */
  color?: string
}) {
  const messages = useMessages()

  if (attachment.kind === 'voice') return <VoiceNote attachment={attachment} color={color} />

  if (attachment.kind === 'video') {
    return (
      <div className="chat-video">
        {/* oxlint-disable-next-line jsx-a11y/media-has-caption -- a user's own clip has no captions */}
        <video src={attachment.src} poster={attachment.poster} controls preload="metadata" />
      </div>
    )
  }

  const name = attachment.name ?? messages.chat.document

  return (
    <a
      href={attachment.src}
      download={name}
      className="chat-file"
      aria-label={`${messages.chat.download} ${name}`}
    >
      <FileCard name={name} byte={attachment.size} />
    </a>
  )
}
