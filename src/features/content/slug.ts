/** Lowercase letters and digits in runs joined by single hyphens, e.g. `campus-open-day-2026`. */
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/**
 * Turkish letters that do not decompose into an ASCII letter plus a combining mark, so NFD
 * alone would drop them: `ı` would vanish instead of becoming `i`.
 */
const turkishLetters: Record<string, string> = {
  ı: 'i',
  İ: 'i',
  ş: 's',
  Ş: 's',
  ğ: 'g',
  Ğ: 'g',
  ç: 'c',
  Ç: 'c',
  ö: 'o',
  Ö: 'o',
  ü: 'u',
  Ü: 'u',
}

/** Turns a headline in either language into a URL slug. */
export function slugify(value: string): string {
  return value
    .replace(/[ıİşŞğĞçÇöÖüÜ]/g, (letter) => turkishLetters[letter] ?? letter)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/, '')
}
