/** The words in a piece of editor HTML, for previews, search, and telling empty text apart. */
export function richTextToPlain(html: string | undefined): string {
  if (!html) return ''
  const document = new DOMParser().parseFromString(html, 'text/html')
  // Block ends become spaces, so "<p>One</p><p>Two</p>" reads "One Two" and not "OneTwo".
  document.querySelectorAll('p, h1, h2, h3, li, br, div').forEach((node) => node.after(' '))

  return (document.body.textContent ?? '').replace(/\s+/g, ' ').trim()
}

/** True when the editor holds nothing but markup, such as the `<br>` left after deleting. */
export function isRichTextEmpty(html: string | undefined): boolean {
  return richTextToPlain(html) === ''
}
