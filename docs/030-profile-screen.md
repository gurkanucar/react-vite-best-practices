# 030 — A Profile Screen, Built From Components

`/profile` reproduces a social profile layout — cover, stats, about, social links, a
composer, a feed with comments, and tabs for followers, friends, and a gallery. It was
built from a Material UI template screenshot, deliberately without borrowing its CSS.

The point of the screen is that almost none of it is custom. Ant Design already has the
pieces; the work is choosing them.

| Part of the design      | Component                        |
| ----------------------- | -------------------------------- |
| Every panel             | `Card`                           |
| Profile / Followers / … | `Tabs`                           |
| Follower and post count | `Statistic` in a `Row`/`Col`     |
| About and social lists  | `Listy`                          |
| People and photo grids  | `Row` + `Col` + `Card`           |
| Who liked a post        | `Avatar.Group` with `max`        |
| Post and comment menus  | `Dropdown` + `MoreOutlined`      |
| Composer                | `Input.TextArea` with `autoSize` |
| Gallery                 | `Image.PreviewGroup`             |

## What needed CSS, and why

One thing: the cover. A name and an avatar sitting on top of a banner is a stacking
problem no component solves, so the banner is a `div` with a background image and the
identity inside it. Everything else in the stylesheet is a size or a radius.

## `List` is deprecated; `Listy` is not a drop-in

Ant Design 6 warns that `List` will be removed and points at `Listy`. They are not the
same component. `Listy` is a flat, optionally virtualised list: `items`, `rowKey`, and an
`itemRender`. It has no `grid` prop and no `List.Item.Meta`.

So the vertical lists — about, social — use `Listy`, and the grids use `Row`/`Col` with
`Card`, which is what the antd docs reach for anyway.

## Two bugs the browser found

**The banner rendered blank.** Vite inlines a small SVG as a `data:` URI, and this one
carries single quotes from its own attributes. An unquoted CSS `url()` may not contain
quotes, so the browser dropped the whole declaration — and the white-on-banner name was
then white on white. Quoting the value fixes it:

```tsx
style={{ backgroundImage: `url("${cover}")` }}
```

**Comments had a shadow with a gap around it.** They were `Listy` items, each holding a
tinted block of its own. `.ant-listy-item` brings its own padding and hover surface, so
the result was a box inside a box, and on hover the outer one's shadow appeared offset
from the visible edge. Comments here are a handful, not a virtualised list, so they are a
plain `Flex` stack now and the nesting is gone with it.

## Images

The photographs are four generated SVGs, about 600 bytes each. No external URLs, which
keeps the screen working offline and inside the project's content policy; no binary
assets, which keeps the repository small. They are abstract on purpose rather than
pretending to be photographs.

Gallery images take their subject as `alt`. An empty `alt` is for decoration, and a
gallery is the content — a test asserts the images are reachable as images.

## State

The open tab is in the URL (`?tab=friends`), so a tab can be linked and the back button
steps through the ones that were opened. Likes, the follow buttons, and the friend search
are `useState`: they are ephemeral interactions on sample data, not something a reload
should remember.
