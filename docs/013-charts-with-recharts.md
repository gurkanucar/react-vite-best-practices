# 013 — Charts with Recharts

`/analytics` draws ten chart types from one dataset module. The page exists to make the
choices visible: which library, how a chart follows the theme, and what it costs to ship.

## Why Recharts

The dashboard originally used `@ant-design/charts`, the React wrapper around AntV G2. It was
replaced after measuring the same bar chart built three ways, each in its own production
build with a React-only baseline subtracted:

| Library                  | Added raw | Added gzip |
| ------------------------ | --------- | ---------- |
| `@ant-design/charts`     | ~1.40 MB  | ~411 kB    |
| `recharts`               | ~349 kB   | ~99 kB     |
| `@tanstack/react-charts` | ~117 kB   | ~40 kB     |

G2 ships a full grammar-of-graphics engine whether or not the page uses one column chart,
and in this project's build it accounted for the entire 1.43 MB dashboard chunk.

TanStack Charts is the smallest by a wide margin, and it is worth revisiting. It was not
chosen yet: it is pre-1.0 and changing fast — `0.14` through `0.18` all shipped within one
month — the axis API expects d3 scales the caller imports and configures, and it needs three
packages rather than one. A reference repository should not teach an API that moves that
quickly.

Recharts is the middle option and the one this project uses: a stable 3.x, a component API
that reads like the rest of the codebase, and a quarter of the previous weight.

## Charts follow the theme, but only because they are told to

Recharts draws plain SVG. It knows nothing about Ant Design, so nothing about it changes
when the theme or the colour mode does. `useChartTheme()` reads the active design tokens and
hands back a palette:

```ts
const { token } = theme.useToken()

return {
  series: [token.colorPrimary, token.cyan6, token.purple6, token.gold6, ...],
  grid: token.colorSplit,
  ...
}
```

Ant Design generates a matching palette for every preset and for dark mode, including the
preset hues, so the charts change with the rest of the interface for free. Anything given a
literal colour instead — the default `background` ring on `RadialBar`, for one — glares in
dark mode, which is why that one is passed a token.

## Numbers do not follow the locale either

`ConfigProvider` translates Ant Design's own strings, but an axis tick is text the chart
writes itself. `useChartFormatters()` builds `Intl` formatters from the selected language, so
`724,600` becomes `724.600` and `Sep 2026` becomes `Eyl 2026` when the reader switches.

Datasets store a translation key rather than a label:

```ts
export interface BreakdownSlice<TId extends string> {
  id: TId
  value: number
}
```

The id is a literal union, so a missing translation is a type error rather than an empty
label in one language.

## Formatter types

Recharts types every formatter argument as `string | number | array | undefined`, because one
callback signature serves every chart. `forChart()` narrows once:

```ts
export function forChart(format: (value: number) => string) {
  return (value: unknown): string =>
    typeof value === 'number' ? format(value) : String(value ?? '')
}
```

That keeps the cast out of ten components.

## Import the leaf, not the barrel

The dashboard needs one bar chart. Importing it through
`@/features/analytics/components` pulls the whole barrel — every chart type, and with it
every part of Recharts — into the chunk the dashboard shares. The leaf import keeps the
dashboard to the modules it uses:

```ts
import { ThroughputBarChart } from '@/features/analytics/components/ThroughputBarChart'
```

The barrel stays for ordinary use. This is the same rule the lazy route modules follow.

## `ResponsiveContainer` needs a measurable parent

It measures its parent, so the height has to come from somewhere that is not the chart:
`ChartCard` supplies it. The container also needs `min-width: 0` inside a grid column —
without it the measured width only ever grows and the chart stops following a window resize.

In tests, jsdom lays nothing out and every element measures zero, which makes Recharts refuse
to render and warn. The `ResizeObserver` mock in `src/test/setup.ts` reports a real size
instead, so `AnalyticsPage.test.tsx` can assert that ten charts actually drew rather than
that ten card titles exist.

## Labels recharts will not lay out for you

`LabelList` wraps its text to the width of the shape it belongs to, which splits the longest
funnel stage names across two lines. Passing `content` and drawing the `<text>` directly opts
out of that measurement — at the cost of `formatter`, which only applies to the built-in
label, so those values are formatted into the data instead. `LabelList` also injects the
segment's own colour as `fill`, which overrides anything passed in under that name; the
custom label takes a `color` prop to stay out of its way.

## What the page covers

Area (stacked), line (logarithmic), composed (bars and a line on two axes), pie, donut,
radar, radial bar, scatter with a `ZAxis` third dimension, treemap, and funnel. The datasets
in `data/analyticsData.ts` are static so the page renders identically everywhere; a real
application would swap them for query results without touching the chart components, which
take their data as props.
