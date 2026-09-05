# 010 — Product Branding and Favicons

This step replaces the starter's framework identity with product-owned branding. Tooling such as React and Vite remains part of the implementation, but it does not own the browser tab, install metadata, or public-facing product copy.

## Branding inventory

The public brand assets live in `public/` because Vite copies this directory to the root of the production build without transforming filenames:

```text
public/
├── apple-touch-icon.png  # 180 × 180, Apple home-screen icon
├── favicon.ico           # 16, 32, and 48 px legacy browser fallback
├── favicon.svg           # Resolution-independent modern browser icon
├── icon-192.png          # Web app manifest icon
├── icon-512.png          # High-resolution web app manifest icon
└── site.webmanifest      # Install name, colors, and icon declarations
```

The custom mark is a compact `RV` monogram. Its simple silhouette, limited palette, and generous stroke width keep it recognizable at favicon sizes.

## Browser metadata

`index.html` now owns the public page identity:

- A descriptive document title instead of the package slug.
- Product description and application name.
- A browser theme color synchronized with the application's resolved light or dark mode.
- Open Graph and X/Twitter title and description metadata.
- SVG favicon with an ICO fallback.
- Apple touch icon and web app manifest links.

Vite replaces `%VITE_APP_NAME%` in HTML from the shared `.env` file at development and build time:

```html
<title>%VITE_APP_NAME% — Production-Ready Foundation</title>
```

The React application reads the same variable through the typed environment layer. This keeps the browser title, accessible home-link label, and runtime product name aligned. `AppThemeProvider` also updates the `theme-color` metadata when the user changes the application color mode instead of only following the operating-system preference.

## Why several icon formats exist

- SVG is small and sharp at any browser-tab resolution.
- ICO provides a dependable fallback for older browsers and tools.
- The 180 px PNG is the conventional Apple touch-icon size.
- The 192 px and 512 px PNGs satisfy common installable-web-app requirements.

Generated PNG and ICO files are committed to the repository, so another developer does not need image tooling merely to install or build the project.

## Regenerating raster assets

Edit `public/favicon.svg` as the source artwork first, then render a matching 512 px PNG with an SVG-capable design or image tool. The smaller raster variants can be regenerated from that master with ImageMagick or an equivalent image pipeline. Preserve transparency, strip metadata, and use high PNG compression.

Example:

```bash
magick public/icon-512.png -resize 192x192 -strip \
  -define png:compression-level=9 public/icon-192.png

magick public/icon-512.png -resize 180x180 -strip \
  -define png:compression-level=9 public/apple-touch-icon.png

magick public/icon-512.png \
  -define icon:auto-resize=48,32,16 public/favicon.ico
```

Always inspect the 16 px result. Fine detail that looks attractive at 512 px often becomes visual noise in a browser tab.

## Web app manifest

`site.webmanifest` declares the long name, short name, description, launch path, display mode, brand colors, and install icons. Files in `public/` are not processed for Vite environment placeholders, so manifest branding must be updated directly when the product name changes.

## Social previews and production URLs

Title and description metadata can be defined before deployment. Canonical URLs, `og:url`, and a social preview image should be added only after the production origin is known. Social crawlers generally work best with an absolute HTTPS image URL and a purpose-built 1200 × 630 PNG or JPEG.

Avoid committing a fake domain merely to make the metadata look complete.

## Rebranding checklist

When adapting this foundation for a real company or product:

1. Change `VITE_APP_NAME` in `.env` and `.env.example`.
2. Update `package.json` name and description.
3. Replace the favicon source and regenerate its raster variants.
4. Update `site.webmanifest`, including its short name and colors.
5. Replace product descriptions in `index.html` and `README.md`.
6. Add canonical and social-preview URLs after the production domain exists.
7. Build the project and inspect the generated `dist/index.html` and icons.
8. Test the browser tab in both light and dark operating-system themes.

## Removed starter branding

The unused React and Vite logo files were removed from `src/assets`. The README was also replaced with project-specific setup, quality commands, and feature documentation.

## References

- [Vite: HTML Env Replacement](https://vite.dev/guide/env-and-mode.html#html-constant-replacement)
- [Vite: The `public` Directory](https://vite.dev/guide/assets.html#the-public-directory)
- [MDN: Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest)
- [MDN: `theme-color`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/theme-color)
