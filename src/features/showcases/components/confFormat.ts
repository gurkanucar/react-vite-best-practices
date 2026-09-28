import type { ConfCopy } from '@/features/showcases/data/confCopy'
import { CONF_HALLS, findSpeaker, type ConfSession } from '@/features/showcases/data/confData'
import type { Language } from '@/store/preferences-store'

/** "Thu 19 Nov · 10:15–10:55 · Main Stage", shortened where the context already says it. */
export function sessionWhen(
  session: ConfSession,
  text: ConfCopy,
  language: Language,
  { withDay = false, withHall = true } = {},
) {
  const parts = [
    withDay ? text.days[session.day]?.short : undefined,
    `${session.start}–${session.end}`,
    withHall
      ? session.hall === 'all'
        ? text.allHalls
        : CONF_HALLS[session.hall][language]
      : undefined,
  ]
  return parts.filter(Boolean).join(' · ')
}

export function speakerNames(session: ConfSession) {
  return session.speakerIds
    .map((id) => findSpeaker(id)?.name)
    .filter(Boolean)
    .join(', ')
}

/** Hands the browser a file to save, without a server round trip. */
export function downloadFile(name: string, content: string, type = 'text/calendar;charset=utf-8') {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const link = document.createElement('a')
  link.href = url
  link.download = name
  link.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 0)
}
