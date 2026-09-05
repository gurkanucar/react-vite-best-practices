# 009 — Ant Design and Theming

This project uses Ant Design as its component system and implements persistent visual style, color, and density preferences around its Design Token system.

## Installed packages

The packages were installed with pnpm:

```bash
pnpm add antd@latest @ant-design/icons@latest
```

Versions at the time of integration on September 5, 2026:

- Ant Design `6.6.2`
- Ant Design Icons `6.3.4`

## Theme architecture

```text
src/
├── components/ThemeControls/
│   ├── ThemeControls.css
│   ├── ThemeControls.test.tsx
│   └── ThemeControls.tsx
├── store/preferences-store.ts
└── theme/
    ├── AppThemeProvider.tsx
    ├── theme.test.ts
    └── theme.ts
```

Responsibilities are separated deliberately:

- `theme.ts` defines preferences, shared tokens, preset algorithms, and pure helpers.
- `preferences-store.ts` owns and persists global appearance preferences.
- `AppThemeProvider.tsx` connects Ant Design, Zustand, and browser preferences.
- `ThemeControls.tsx` renders the user controls.

## Preset algorithms

Ant Design provides three official preset algorithms. This project uses all three:

- `theme.defaultAlgorithm` for light mode.
- `theme.darkAlgorithm` for dark mode.
- `theme.compactAlgorithm` when compact density is enabled.

Algorithms can be combined. Dark and compact preferences therefore use:

```ts
algorithm: [theme.darkAlgorithm, theme.compactAlgorithm]
```

## Homepage-style theme gallery

The Ant Design homepage demonstrates a gallery of visual styles. These showcase configurations are not exported from the `antd` package. This project vendors the current implementations from Ant Design's official website source instead of approximating them with a few seed tokens.

This project recreates the complete current gallery as typed presets:

- Ant Design
- MUI
- shadcn
- Bootstrap
- Cartoon
- Dark
- Illustration
- Glass
- Geek
- Document
- Blossom
- Ant Design V4
- Serene Icon

The Settings page's style button opens the gallery. A selection applies the preset's complete `ConfigProviderProps`: theme algorithm, global and component tokens, semantic `classNames`, component styles, wave behavior, and the official preview background asset where one exists.

The source-derived hooks live in `src/theme/official-presets`. `useOfficialTheme.ts` selects them without rewriting their component appearance. The source notice links to the exact upstream directory and records Ant Design's MIT license.

## User preferences

The color control is available in both the admin navigation bar and the full theme controls while the base `Ant Design` visual theme is selected. It offers:

- `System`: follows `prefers-color-scheme` and reacts to operating-system changes.
- `Light`: always uses the default light algorithm.
- `Dark`: always uses the dark algorithm.

Compact density is controlled independently. The base Ant Design theme follows the selected system, light, or dark mode. Its light showcase background is removed in dark mode so the page background and dark component tokens cannot conflict.

Homepage showcase presets preserve the algorithms from their official source. They do not expose the color control because applying a second light or dark algorithm would change the preset instead of switching a supported mode. `Dark` and `Geek` identify as dark; the remaining showcase presets identify as light. The stored Ant Design color preference remains unchanged and becomes active again when the user returns to the base theme.

Preferences are stored by Zustand under `rvbp-preferences` in `localStorage`. Invalid fields fall back safely to the defaults. See document 012 for the store and persistence design.

## ConfigProvider

`AppThemeProvider` passes the generated configuration to Ant Design's `ConfigProvider`:

```tsx
<ConfigProvider {...providerProps}>
  <AntApp>{children}</AntApp>
</ConfigProvider>
```

The `AntApp` wrapper supplies context for components and APIs that need it, such as messages, notifications, and modal hooks.

## Styling ownership

The application does not target Ant Design's internal `.ant-*` classes. Application CSS is limited to structural page layout and the tiny color swatches in the theme picker. Component appearance comes from Ant Design or the selected official homepage preset. The dashboard chart is provided by Ant Design Charts rather than custom CSS.

Responsive data layout fixes also stay on Ant Design's public API. The project uses responsive `Descriptions` columns, vertical key/value layout, explicit `Table` column widths, and horizontal table scrolling instead of overriding internal selectors. See document 015 for the rationale and reusable patterns.

## CSS reset

The official reset is imported once in the browser entry point before application styles:

```ts
import 'antd/dist/reset.css'
```

## Production bundle

Ant Design and its supporting packages are split into bounded vendor chunks through Vite's current `build.rolldownOptions.output.codeSplitting` configuration. This keeps the application entry small and removes the oversized single-chunk warning without changing minification or tree shaking.

## Application composition

The application uses real Ant Design primitives rather than recreating them:

- Buttons and links for primary actions.
- Cards and responsive grid columns for foundation modules.
- Tags and badges for status.
- Descriptions and Progress for build information.
- Segmented and Switch for theme preferences.
- Typography and Space/Flex for consistent rhythm.

The page follows Ant Design's principles of certainty, restrained typography, systematic spacing, and accessible contrast while retaining a distinct developer-tool identity.

## Testing

Tests cover:

- System, light, and dark mode resolution.
- Official preset integration and the dedicated Dark preset behavior.
- Theme selection, invalid stored values, operating-system changes, and localStorage persistence.
- Rendering the Ant Design-based application shell.

## References

- [Ant Design: Getting Started](https://ant.design/docs/react/getting-started/)
- [Ant Design: Customize Theme](https://ant.design/docs/react/customize-theme/)
- [Ant Design: ConfigProvider](https://ant.design/components/config-provider/)
- [Ant Design: Design Values](https://ant.design/docs/spec/values/)
- [Ant Design website theme preset source](https://github.com/ant-design/ant-design/tree/master/.dumi/pages/index/components/ThemePreview/previewThemes)
