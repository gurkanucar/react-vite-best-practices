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

## Scrolling, not paging

Every page renders into one scrolling column, so the reader scrolls the way they would in any
other viewer. The page controls jump to a page rather than being the only way to reach it, and
the indicator follows the scroll position — it reports the last page whose top edge has passed
the top of the viewport.

## Testing

pdf.js needs a worker and a canvas, and jsdom provides neither. The viewer itself is verified
in a browser; the test covers what surrounds it — that the document is requested as a blob with
the right `Accept` header, and that the download revokes its object URL.

## Reference

- [react-pdf](https://github.com/wojtekmaj/react-pdf)
