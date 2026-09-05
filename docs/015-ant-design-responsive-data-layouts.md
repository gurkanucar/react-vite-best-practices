# 015 — Ant Design Responsive Data Layouts

Ant Design renders both `Descriptions` and `Table` with native table layout rules. A dense horizontal `Descriptions` block can therefore become unreadable when every item creates two cells: one for the label and one for the value. Four items may become eight competing cells, causing short values such as `light` or `false` to wrap one character at a time.

This is a layout problem rather than a theme problem. Do not fix it by overriding internal `.ant-*` selectors because those selectors are implementation details and may change between Ant Design releases.

## Fixing `Descriptions`

Use the public `layout` and responsive `column` APIs. A vertical layout gives each item one full column, with its label above its value:

```tsx
<Descriptions bordered layout="vertical" column={{ xs: 1, sm: 2, lg: 4 }} items={items} />
```

The breakpoints intentionally reduce the number of visible columns as the container narrows:

- `xs`: one item per row.
- `sm`: two items per row.
- `lg`: four items per row.

This project uses that pattern for the persisted preference summary in `SettingsPage.tsx`. It keeps Ant Design and the active official theme in control of colors, borders, typography, and spacing.

If the content is sentence-like rather than a short state value, use fewer columns or give the item a larger `span`. Do not apply `word-break: break-all`; it makes identifiers and ordinary words unreadable.

## Fixing `Table`

A data table needs a minimum readable width when its columns cannot shrink further. Give meaningful columns explicit widths and let the table scroll inside its own container:

```tsx
const columns: ColumnsType<ActivityRow> = [
  { title: 'Event', dataIndex: 'event', width: 320 },
  { title: 'Actor', dataIndex: 'actor', width: 180 },
  { title: 'Status', dataIndex: 'status', width: 140 },
  { title: 'Time', dataIndex: 'time', width: 140 },
]

<Table
  columns={columns}
  dataSource={rows}
  scroll={{ x: 'max-content' }}
/>
```

`x: 'max-content'` preserves the width required by the configured columns. Narrow viewports receive horizontal scrolling instead of crushed cells. Widths should reflect the actual content rather than being copied blindly to every table.

Avoid enabling `ellipsis` only to solve width problems. Ant Design switches the table to fixed layout when ellipsis is enabled, which is appropriate for deliberate truncation but not a general responsive-layout fix.

## Decision guide

| Content                                    | Preferred component and layout                         |
| ------------------------------------------ | ------------------------------------------------------ |
| A few read-only key/value fields           | `Descriptions` with responsive columns                 |
| Dense short key/value fields               | `Descriptions layout="vertical"`                       |
| Records with repeated columns              | `Table` with intentional column widths                 |
| Narrow viewport with many required columns | `Table scroll={{ x: 'max-content' }}`                  |
| Non-tabular actions or settings            | `Space`, `Flex`, `Listy`, or `Card` instead of a table |

## References

- [Ant Design: Descriptions](https://ant.design/components/descriptions/)
- [Ant Design: Table](https://ant.design/components/table/)
