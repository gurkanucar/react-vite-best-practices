/*
 * The alarm chime, made with the Web Audio API so there is no sound file to load. Browsers
 * only let a page play sound after the viewer has interacted with it, so the context is
 * created (or resumed) on the first click and a chime that is not allowed stays silent.
 */

type AudioContextConstructor = typeof AudioContext

let context: AudioContext | undefined

function audioContext(): AudioContext | undefined {
  if (context) return context
  const Constructor: AudioContextConstructor | undefined =
    typeof window === 'undefined'
      ? undefined
      : (window.AudioContext ??
        (window as unknown as { webkitAudioContext?: AudioContextConstructor }).webkitAudioContext)
  if (!Constructor) return undefined
  try {
    context = new Constructor()
  } catch {
    return undefined
  }
  return context
}

/** Called from a click, so a later alarm is allowed to make a sound. */
export function unlockAudio() {
  const ctx = audioContext()
  if (ctx?.state === 'suspended') void ctx.resume().catch(() => undefined)
}

/** Three rising tones, repeated twice: about two seconds. */
export function playChime() {
  const ctx = audioContext()
  if (!ctx) return
  try {
    if (ctx.state === 'suspended') void ctx.resume().catch(() => undefined)
    const start = ctx.currentTime + 0.05
    const notes = [660, 880, 990, 660, 880, 990]
    notes.forEach((frequency, index) => {
      const at = start + index * 0.28 + (index >= 3 ? 0.35 : 0)
      const oscillator = ctx.createOscillator()
      const gain = ctx.createGain()
      oscillator.type = 'sine'
      oscillator.frequency.value = frequency
      gain.gain.setValueAtTime(0.0001, at)
      gain.gain.exponentialRampToValueAtTime(0.25, at + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.25)
      oscillator.connect(gain).connect(ctx.destination)
      oscillator.start(at)
      oscillator.stop(at + 0.26)
    })
  } catch {
    // No sound is better than a broken page.
  }
}

export type NotificationState = NotificationPermission | 'unsupported'

export function notificationState(): NotificationState {
  return typeof window === 'undefined' || !('Notification' in window)
    ? 'unsupported'
    : Notification.permission
}

/** A system notification, when the viewer has allowed them. Failing quietly otherwise. */
export function showSystemNotification(title: string, body: string, tag: string) {
  if (notificationState() !== 'granted') return
  try {
    new Notification(title, { body, tag })
  } catch {
    // Some browsers only allow notifications from a service worker.
  }
}
