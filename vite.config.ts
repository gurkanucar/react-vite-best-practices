import { readFileSync } from 'node:fs'
import { rm } from 'node:fs/promises'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'
import { defineConfig } from 'vitest/config'

const packageJson = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf8'),
) as { version: string }

/**
 * MSW serves its worker from `public/`, so Vite copies it into every build output.
 * The worker only ever starts in the dev server, so drop it instead of shipping it.
 */
function excludeMockServiceWorker(): Plugin {
  let outDir = 'dist'

  return {
    name: 'exclude-mock-service-worker',
    apply: 'build',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir)
    },
    async closeBundle() {
      await rm(path.join(outDir, 'mockServiceWorker.js'), { force: true })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), excludeMockServiceWorker()],
  resolve: {
    tsconfigPaths: true,
  },
  define: {
    __APP_VERSION__: JSON.stringify(packageJson.version),
  },
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          // No `maxSize`: capping a group splits packages across chunks, and a chunk that
          // loads before the one defining what it destructures throws at startup. The
          // production build failed with "Cannot destructure property 'ESC'" until this
          // was removed.
          minSize: 20_000,
          groups: [
            {
              name: 'react-vendor',
              test: /node_modules\/(?:react|react-dom|scheduler)\//,
            },
            {
              // `@ant-design/x` is excluded: only the assistant route uses it, and forcing
              // it into this group would make a shared, eagerly loaded chunk carry it.
              // Left ungrouped, it lands in that route's own lazy chunk instead.
              name: 'antd-vendor',
              test: /node_modules\/(?:antd|@ant-design\/(?!x\/)|@rc-component|rc-)/,
            },
          ],
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/main.tsx',
        'src/vite-env.d.ts',
        // Upstream Ant Design website source; covered by our provider integration tests.
        'src/theme/official-presets/**',
      ],
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
  },
})
