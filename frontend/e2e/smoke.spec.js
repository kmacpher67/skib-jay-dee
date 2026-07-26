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

test('mute toggle switches icon on menu and in game', async ({ page }) => {
  // Use a phone-portrait viewport: the default landscape test viewport is
  // wide enough to trip the app's desktop-letterbox media query, which
  // stretches .portrait-frame taller than the viewport and pushes the
  // corner-anchored mute button off-screen.
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('./')

  const menuMute = page.locator('.mute-btn-menu')
  await expect(menuMute).toBeVisible()
  await expect(menuMute).toHaveText('🔊')
  await menuMute.click()
  await expect(menuMute).toHaveText('🔇')

  await page.locator('.play-btn').click()
  const inGameMute = page.locator('.mute-btn').last()
  await expect(inGameMute).toHaveText('🔇')
})
