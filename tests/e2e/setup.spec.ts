import { test, expect } from '@playwright/test'

test('playwright is properly configured', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/FrankenSQLite/)
})
