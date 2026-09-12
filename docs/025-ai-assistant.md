# 025 — AI Assistant with Ant Design X

`/assistant` is a conversational interface built from [Ant Design X](https://x.ant.design), the
AI-oriented component library that sits on top of Ant Design.

## What it is

X provides the parts a chat screen needs and Ant Design does not: `Welcome` and `Prompts` for
the empty state, `Bubble.List` for a transcript with roles and avatars, and `Sender` for a
composer that already knows about submitting, loading, and cancelling. They read the theme and
locale from the same `ConfigProvider` as everything else, so the screen does not look bolted on.

The page uses the peer version already in the project: X 2.9 requires `antd ^6.1.1`.

## The reply is streamed

A completion endpoint answers over time, and that is the constraint the interface has to be
built around — not a detail to paper over. The mock handler sends the answer a word at a time:

```ts
const stream = new ReadableStream({
  async start(controller) {
    for (const word of words) {
      await delay(35)
      controller.enqueue(encoder.encode(word))
    }

    controller.close()
  },
})
```

The client reads the body as it arrives rather than awaiting a whole response, which is why it
does not go through `apiRequest`:

```ts
const reader = response.body.pipeThrough(new TextDecoderStream()).getReader()
```

### Stopping has to actually stop

Aborting the request does not reliably end a body that has already started arriving, so the
signal is checked after each chunk and the reader is cancelled in a `finally`. Without both, the
stop button would hide the rest of the answer while it kept downloading — a test covers this,
because it is invisible from the interface.

## Conversation state is not server state

A streamed transcript is local, ordered, append-only state, so it lives in the component rather
than in TanStack Query. There is nothing to cache, invalidate, or refetch: re-running the
request would produce a different answer, not the same one.

## Its own flag

The endpoint exists only in the mock worker, so the assistant has its own flag,
`VITE_FEATURE_MOCK_ASSISTANT_API`, separate from the posts one. The worker is shared, so it
starts when any mocked feature is on:

```ts
export function isAnyApiMocked(): boolean {
  return Object.values(FEATURE_FLAGS).some(Boolean)
}
```

With the flag off, the page says so and disables the composer rather than offering an input that
could not reach anything.

## Keeping it off everyone else's pages

X is only used by this route, so it must not land in a chunk that every page loads. It is
excluded from the Ant Design vendor group by name:

```ts
test: /node_modules\/(?:antd|@ant-design\/(?!x\/)|@rc-component|rc-)/,
```

Forcing a lazily reachable dependency into a shared vendor group is what makes it eager —
measured on the dashboard, the library was downloaded before this exclusion and is not after.

## Reference

- [Ant Design X](https://x.ant.design/components/introduce)
