import { test, expect } from '@playwright/test'

test('menu loads and quick play boots the canvas', async ({ page }) => {
  await page.goto('./')

  await expect(page.getByText('SKIB-JAY-DEE-TOILET')).toBeVisible()
  await expect(page.locator('.play-btn')).toBeVisible()

  await page.locator('.play-btn').click()

  await expect(page.locator('canvas')).toBeVisible()
  await expect(page.locator('.exit-btn')).toBeVisible()
})

test('shop modal opens and closes', async ({ page }) => {
  await page.goto('./')

  await page.locator('.shop-btn').click()
  await expect(page.getByText('Spend the stash.')).toBeVisible()
  await expect(page.locator('.close-pill')).toBeVisible()
})
