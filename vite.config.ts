import { readFileSync } from 'node:fs'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

const packageJson = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf8'),
) as { version: string }

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
          minSize: 20_000,
          maxSize: 400_000,
          groups: [
            {
              name: 'react-vendor',
              test: /node_modules\/(?:react|react-dom|scheduler)\//,
            },
            {
              name: 'antd-vendor',
              test: /node_modules\/(?:antd|@ant-design|@rc-component|rc-)/,
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
