import { defineConfig, devices } from '@playwright/test'

// Chromium maps every *.localhost name to 127.0.0.1 itself. Inside the e2e container
// that is the wrong machine, so E2E_HOST_RESOLVER_RULES sends those names to nginx instead.
const hostResolverRules = process.env.E2E_HOST_RESOLVER_RULES

export default defineConfig({
  testDir: './e2e',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://lets-discuss.localhost',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: hostResolverRules ? [`--host-resolver-rules=${hostResolverRules}`] : [],
        },
      },
    },
  ],
})
