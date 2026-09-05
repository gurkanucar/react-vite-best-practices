# 013 — Ant Design Charts

The dashboard uses Ant Design Charts `2.6.7` for data visualization. The package is the React chart library from the AntV and Ant Design ecosystem and provides responsive, interactive charts with useful defaults.

## Installation

```bash
pnpm add @ant-design/charts@latest
```

## Column chart

The weekly throughput visualization uses the library's `Column` component directly:

```tsx
<Column data={throughput} height={260} xField="day" yField="value" />
```

The data stays as plain typed objects. Configuration is intentionally minimal so the library owns axes, tooltips, animation, and visual defaults. Add chart options only when a product requirement calls for them.

## Testing

DOM unit tests replace the canvas-based chart with a small semantic test double. Production builds and browser checks exercise the real chart implementation.

## References

- [Ant Design Charts: Introduction](https://ant-design-charts.antgroup.com/en/manual/introduction)
- [Ant Design Charts: Quick Start](https://ant-design-charts.antgroup.com/en/manual/getting-started)
