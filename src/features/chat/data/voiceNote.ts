/**
 * A stand-in voice note, synthesised rather than bundled: a WAV of a few seconds of
 * speech-like murmur (a low tone whose loudness rises and falls in syllables). It keeps the
 * repository free of audio files while still giving the player something real to play.
 */
const SAMPLE_RATE = 8000

export function createVoiceNote(seconds: number, pitch = 180): string {
  const samples = Math.round(seconds * SAMPLE_RATE)
  const bytes = new Uint8Array(44 + samples)
  const view = new DataView(bytes.buffer)
  const text = (offset: number, value: string) =>
    [...value].forEach((char, index) => view.setUint8(offset + index, char.charCodeAt(0)))

  // RIFF header for 8-bit mono PCM.
  text(0, 'RIFF')
  view.setUint32(4, 36 + samples, true)
  text(8, 'WAVE')
  text(12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, 1, true)
  view.setUint32(24, SAMPLE_RATE, true)
  view.setUint32(28, SAMPLE_RATE, true)
  view.setUint16(32, 1, true)
  view.setUint16(34, 8, true)
  text(36, 'data')
  view.setUint32(40, samples, true)

  for (let index = 0; index < samples; index += 1) {
    const time = index / SAMPLE_RATE
    // Syllables about four times a second, with a pause every couple of seconds.
    const syllable = Math.max(0, Math.sin(time * Math.PI * 4))
    const phrase = Math.sin(time * Math.PI * 0.45) > -0.6 ? 1 : 0
    const voice =
      Math.sin(2 * Math.PI * pitch * time) * 0.6 +
      Math.sin(2 * Math.PI * pitch * 2.02 * time) * 0.25
    bytes[44 + index] = 128 + Math.round(voice * syllable * phrase * 70)
  }

  let binary = ''
  for (let offset = 0; offset < bytes.length; offset += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000))
  }

  return `data:audio/wav;base64,${btoa(binary)}`
}
