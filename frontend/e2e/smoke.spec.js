import { test, expect } from '@playwright/test'
import { GAME_ITERATION } from '../src/version.js'

test('menu loads and quick play boots the canvas', async ({ page }) => {
  await page.goto('./')

  await expect(page.getByText('SKIB-JAY-DEE-TOILET')).toBeVisible()
  await expect(page.locator('.play-btn').first()).toBeVisible()

  await page.locator('.play-btn').first().click()

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
      { timestamp: Date.parse(olderDeathTimestamp), levelName: 'Porcelain Palace', chaserId: 'skib-default' },
      { timestamp: Date.parse(latestDeathTimestamp), levelName: 'Pipeworks', chaserId: 'dad-case' },
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
  await expect(deathsDialog.getByRole('button', { name: /Killer ID: dad-case/i })).toBeVisible()
  await deathsDialog.getByRole('button', { name: /Killer ID: dad-case/i }).click()
  const profileDialog = page.getByRole('dialog', { name: 'Chaser profile' })
  await expect(profileDialog).toBeVisible()
  await expect(profileDialog.getByText('Dad Case')).toBeVisible()
  await profileDialog.getByRole('button', { name: 'BACK TO LOG' }).click()
  await expect(deathsDialog).toBeVisible()
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

  // Check top stats remain one row
  const diffPillBox = await page.locator('.diff-pill').boundingBox()
  const deathsPillBox = await page.locator('.deaths-pill').boundingBox()
  expect(diffPillBox.y).toBe(deathsPillBox.y)

  // Check previews retain size/gap
  const runnerBox = await page.locator('.face-preview').first().boundingBox()
  const chaserBox = await page.locator('.face-preview').last().boundingBox()
  expect(runnerBox.width).toBe(88)
  expect(runnerBox.height).toBe(88)
  expect(Math.round(chaserBox.x - (runnerBox.x + runnerBox.width))).toBeGreaterThanOrEqual(14)

  // Check menu mute control is left of portraits and vertically aligned
  const muteBox = await menuMute.boundingBox()
  expect(muteBox.x + muteBox.width).toBeLessThanOrEqual(runnerBox.x)
  const runnerCenterY = runnerBox.y + runnerBox.height / 2
  const muteCenterY = muteBox.y + muteBox.height / 2
  expect(Math.abs(muteCenterY - runnerCenterY)).toBeLessThan(5)

  await menuMute.click()
  await expect(menuMute).toHaveText('🔇')

  await page.locator('.play-btn').first().click()
  const inGameMute = page.locator('.mute-btn').last()
  await expect(inGameMute).toHaveText('🔇')

  // Check in-game mute remains in its corner
  const inGameMuteBox = await inGameMute.boundingBox()
  expect(inGameMuteBox.x).toBeLessThan(20)
  expect(inGameMuteBox.y).toBeLessThan(20)
})
