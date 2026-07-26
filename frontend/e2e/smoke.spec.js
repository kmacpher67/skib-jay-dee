import { test, expect } from '@playwright/test'
import { GAME_ITERATION } from '../src/version.js'

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

test('version log opens from the menu', async ({ page }) => {
  await page.goto('./')

  await page.locator('.version-btn').click()

  const versionDialog = page.getByRole('dialog', { name: 'Version log' })
  await expect(versionDialog).toBeVisible()
  await expect(versionDialog.getByText(`Current build: ${GAME_ITERATION}`)).toBeVisible()
  await expect(versionDialog.getByText('Deaths history log lands')).toBeVisible()
})

test('deaths history modal opens and shows saved entries', async ({ page }) => {
  const latestDeathTimestamp = new Date('2026-07-26T14:40:00.000Z').toISOString()
  const olderDeathTimestamp = new Date('2026-07-26T13:40:00.000Z').toISOString()
  const seededProfile = {
    userId: 'sjdt-test',
    sheebs: 0,
    ownedItems: [],
    highestLevel: 1,
    deaths: 2,
    deathsHistory: [
      { timestamp: Date.parse(olderDeathTimestamp), levelName: 'Porcelain Palace' },
      { timestamp: Date.parse(latestDeathTimestamp), levelName: 'Pipeworks' },
    ],
    muted: false,
  }

  await page.addInitScript((profileJson) => {
    document.cookie = 'sjdt_user_id=sjdt-test; Path=/; SameSite=Lax'
    document.cookie = `sjdt_profile_v1=${encodeURIComponent(profileJson)}; Path=/; SameSite=Lax`
  }, JSON.stringify(seededProfile))
  await page.goto('./')

  await expect(page.locator('.deaths-pill')).toHaveText('Deaths 2')
  await page.locator('.deaths-pill').click()

  const deathsDialog = page.getByRole('dialog', { name: 'Deaths history' })
  await expect(deathsDialog).toBeVisible()
  await expect(deathsDialog.getByText('Level: Pipeworks')).toBeVisible()
  await expect(deathsDialog.getByText('Level: Porcelain Palace')).toBeVisible()
  await expect(deathsDialog.locator('time')).toHaveCount(2)
  await expect(deathsDialog.locator('time').first()).toHaveAttribute('datetime', latestDeathTimestamp)
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
