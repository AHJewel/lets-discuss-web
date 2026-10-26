import { expect, test } from '@playwright/test'

test('status page reports a healthy API and a live Reverb connection', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByTestId('api-status')).toHaveText('ok')
  await expect(page.getByTestId('service-database')).toHaveText('database: up')
  await expect(page.getByTestId('service-redis')).toHaveText('redis: up')
  await expect(page.getByTestId('reverb-state')).toHaveText('Connected', { timeout: 15_000 })
})
