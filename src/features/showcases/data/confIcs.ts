import {
  CONF_HALLS,
  CONF_NAME,
  findSpeaker,
  type ConfSession,
} from '@/features/showcases/data/confData'
import { sessionEnd, sessionStart } from '@/features/showcases/data/confSchedule'
import type { Language } from '@/store/preferences-store'

export const CONF_VENUE = 'Kıyı Hall, Kemankeş Cd. 12, Karaköy, İstanbul'
const UID_DOMAIN = 'relaysummit.example'

/** `20261119T071500Z`: calendars read a trailing Z as UTC, whatever the reader's time zone. */
export function icsTimestamp(ms: number) {
  return new Date(ms)
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '')
}

/** Text values escape backslashes, semicolons, commas and newlines (RFC 5545, 3.3.11). */
export function escapeIcsText(text: string) {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n')
}

const encoder = new TextEncoder()

/**
 * Lines longer than 75 octets continue on the next line after a space (RFC 5545, 3.1).
 * The limit is in bytes, so a line is cut between characters, never inside a Turkish letter.
 */
export function foldIcsLine(line: string) {
  const parts: string[] = []
  let current = ''
  let bytes = 0
  for (const char of line) {
    const size = encoder.encode(char).length
    const limit = parts.length === 0 ? 75 : 74
    if (bytes + size > limit) {
      parts.push(current)
      current = ''
      bytes = 0
    }
    current += char
    bytes += size
  }
  parts.push(current)
  return parts.join('\r\n ')
}

interface IcsOptions {
  language: Language
  /** DTSTAMP: when the file was made. */
  now: number
  /** An absolute link back to the schedule, if there is one. */
  url?: string
}

function eventLines(session: ConfSession, { language, now, url }: IcsOptions) {
  const hall = session.hall === 'all' ? undefined : CONF_HALLS[session.hall][language]
  const speakers = session.speakerIds.map((id) => findSpeaker(id)?.name).filter(Boolean)
  const description = [session.abstract?.[language], speakers.join(', ')]
    .filter(Boolean)
    .join('\n\n')

  return [
    'BEGIN:VEVENT',
    `UID:${session.id}@${UID_DOMAIN}`,
    `DTSTAMP:${icsTimestamp(now)}`,
    `DTSTART:${icsTimestamp(sessionStart(session))}`,
    `DTEND:${icsTimestamp(sessionEnd(session))}`,
    `SUMMARY:${escapeIcsText(session.title[language])}`,
    `LOCATION:${escapeIcsText(hall ? `${hall}, ${CONF_VENUE}` : CONF_VENUE)}`,
    ...(description ? [`DESCRIPTION:${escapeIcsText(description)}`] : []),
    ...(url ? [`URL:${url}`] : []),
    'END:VEVENT',
  ]
}

/** One calendar file for any number of sessions, with CRLF line endings and folded lines. */
export function buildIcs(sessions: ConfSession[], options: IcsOptions) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:-//${CONF_NAME}//Schedule//${options.language.toUpperCase()}`,
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeIcsText(CONF_NAME)}`,
    ...sessions.flatMap((session) => eventLines(session, options)),
    'END:VCALENDAR',
  ]
  return `${lines.map(foldIcsLine).join('\r\n')}\r\n`
}

export function icsFileName(sessions: ConfSession[]) {
  return sessions.length === 1 ? `relay-summit-${sessions[0]!.id}.ics` : 'relay-summit-agenda.ics'
}
