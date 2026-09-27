import { useEffect, useRef, useState } from 'react'

export interface Recording {
  src: string
  duration: number
}

/**
 * Records a voice note with the microphone through `MediaRecorder`. `stop` hands back the
 * recording as an object URL; `cancel` throws it away. Either way the microphone is
 * released, so the browser's recording indicator goes out.
 */
export function useVoiceRecorder() {
  const recorder = useRef<MediaRecorder | null>(null)
  const startedAt = useRef(0)
  const [recording, setRecording] = useState(false)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!recording) return

    const timer = window.setInterval(() => setElapsed((Date.now() - startedAt.current) / 1000), 250)
    return () => window.clearInterval(timer)
  }, [recording])

  useEffect(() => () => release(recorder.current), [])

  const supported =
    typeof window !== 'undefined' &&
    typeof window.MediaRecorder !== 'undefined' &&
    Boolean(navigator.mediaDevices?.getUserMedia)

  /** Resolves false when there is no microphone or the user said no. */
  const start = async (): Promise<boolean> => {
    if (!supported) return false

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const next = new MediaRecorder(stream)
      next.start()
      recorder.current = next
      startedAt.current = Date.now()
      setElapsed(0)
      setRecording(true)
      return true
    } catch {
      return false
    }
  }

  const finish = (keep: boolean) =>
    new Promise<Recording | null>((resolve) => {
      const current = recorder.current
      recorder.current = null
      setRecording(false)

      if (!current) {
        resolve(null)
        return
      }

      const duration = (Date.now() - startedAt.current) / 1000
      const chunks: Blob[] = []
      current.ondataavailable = (event) => chunks.push(event.data)
      current.onstop = () => {
        release(current)
        resolve(
          keep && chunks.length > 0
            ? { src: URL.createObjectURL(new Blob(chunks, { type: current.mimeType })), duration }
            : null,
        )
      }
      current.stop()
    })

  return {
    supported,
    recording,
    elapsed,
    start,
    stop: () => finish(true),
    cancel: () => void finish(false),
  }
}

function release(recorder: MediaRecorder | null) {
  recorder?.stream.getTracks().forEach((track) => track.stop())
}
