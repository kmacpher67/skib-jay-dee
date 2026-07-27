import { defineConfig, devices } from '@playwright/test'

// Two ways to run this suite:
//   npm run test:e2e          -> against local `vite preview` build (webServer below)
//   npm run test:e2e:prod     -> against the live deployed site, no webServer,
//                                set via PLAYWRIGHT_BASE_URL
const isProd = !!process.env.PLAYWRIGHT_BASE_URL

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: isProd ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:4173/',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: isProd
    ? undefined
    : {
        // In CI, build happens in the workflow to avoid startup timeout races.
        command: process.env.CI
          ? 'npm run preview -- --host 127.0.0.1 --port 4173'
          : 'npm run build && npm run preview -- --host 127.0.0.1 --port 4173',
        url: 'http://127.0.0.1:4173/',
        reuseExistingServer: !process.env.CI,
        timeout: process.env.CI ? 300_000 : 120_000,
      },
})
