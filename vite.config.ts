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
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    /*
     * The heaviest tests mount the whole application and walk through lazy routes; one of
     * them takes 7s on its own. Spawning a worker per file on an eight-core machine then
     * puts them well past a 15s budget for no reason other than contention — and coverage
     * instrumentation roughly doubles it again. The pool is capped, and the budget is set
     * high enough that a slow machine reports a slow test rather than a false failure.
     */
    testTimeout: 60_000,
    maxWorkers: 4,
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
        branches: 65,
        functions: 69,
        lines: 77,
        statements: 76,
      },
    },
  },
})
