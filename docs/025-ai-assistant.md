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

## Capability and transport flags

`VITE_FEATURE_ASSISTANT` owns the product decision: it adds or removes the route and navigation
entry. `VITE_FEATURE_MOCK_ASSISTANT_API` owns the transport decision: it makes MSW answer the
request during development. Keeping them separate allows the feature to point at a real API.

The worker is shared, so it starts when posts are mocked or when the enabled assistant uses its
mock transport:

```ts
export function isAnyApiMocked(): boolean {
  return FEATURE_FLAGS.mockPostsApi || (FEATURE_FLAGS.assistant && FEATURE_FLAGS.mockAssistantApi)
}
```

Development enables both assistant switches. Production disables the feature by default; a real
deployment can enable it while leaving the mock flag off and serving `/chat` from its configured
API.

## Keeping it off everyone else's pages

X is only used by this route. `LazyPages.tsx` imports the concrete `AssistantPage` module, and no
manual Ant Design vendor group forces it into the initial graph. Vite/Rolldown can therefore keep
the X dependency behind the assistant route's dynamic-import boundary.

## Reference

- [Ant Design X](https://x.ant.design/components/introduce)
