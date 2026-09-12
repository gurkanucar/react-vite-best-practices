# 024 — PDF Documents

`/documents` fetches a PDF through the API client and renders it with pdf.js, rather than
handing the file to the browser's built-in plugin.

## Why not an iframe

`<iframe src="/report.pdf">` is one line and is the right answer for a public file. It stops
being the right answer as soon as the document sits behind an authenticated endpoint: the
browser fetches that URL itself, so it cannot send an `Authorization` header, a tenant id, or
anything else the request needs. The page also gets whatever viewer the browser happens to
ship, which differs across browsers and cannot be themed or translated.

Fetching the file as a blob keeps the request under the application's control:

```ts
export function getDocument(path: string, signal?: AbortSignal): Promise<Blob> {
  return apiRequest<Blob>(path, {
    baseUrl: window.location.origin,
    responseType: 'blob',
    signal,
  })
}
```

`responseType: 'blob'` is the only addition the shared client needed. It also sends `Accept: */*`
instead of `Accept: application/json`, which a content-negotiating API would otherwise answer
with the wrong representation.

## Object URLs are a resource, not a value

`URL.createObjectURL` registers a handle the browser keeps alive — and keeps the whole blob in
memory — until it is revoked. It is therefore created at the moment the reader asks for the
file and released immediately afterwards:

```ts
export function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = fileName
  link.click()

  URL.revokeObjectURL(url)
}
```

The viewer needs no URL at all: react-pdf accepts the `Blob` directly, so there is nothing to
keep alive and nothing to clean up.

## The worker

pdf.js parses documents on a Web Worker so the main thread stays responsive. Resolving it
through `import.meta.url` lets Vite bundle and fingerprint the worker with the rest of the
application:

```ts
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()
```

Pointing `workerSrc` at a CDN instead is common and fragile: the worker version has to match
the `pdfjs-dist` version exactly, and nothing in the build checks that it still does.

## Render one page at a time

The reader renders only the active page. Previous and next controls change that page, while a
`ResizeObserver` keeps its width aligned with the available card space. Zoom multiplies the
requested page width and the viewport scrolls only when the enlarged canvas no longer fits.

This matters for real reports: rendering every page creates one canvas and text layer per page,
which multiplies memory and layout work before the user reaches most of the document. Single-page
rendering keeps work bounded while preserving download, page count, zoom, translated labels, and
the fingerprinted worker.

## Testing

pdf.js needs a worker and a canvas, and jsdom provides neither. The component test replaces
react-pdf with a narrow double and verifies that only one active page is mounted, pagination
changes its number, and zoom changes its requested width. Browser verification covers the real
canvas. API tests still verify the blob request and object-URL cleanup.

## Reference

- [react-pdf](https://github.com/wojtekmaj/react-pdf)
