import { test, expect } from '@playwright/test'

test('gun hit awards +25 sheebs', async ({ page }) => {
  await page.goto('./')
  await page.locator('.play-btn').click()
  await expect(page.locator('canvas')).toBeVisible()
  await page.waitForFunction(() => window.__skibEngine?.phase === 'chase')

  const sheebsBefore = await page.evaluate(() => window.__skibEngine.sheebs)

  await page.evaluate(() => {
    const engine = window.__skibEngine
    engine.runner.gun = { ammo: 1, chambers: 1 }
    engine.chaser.x = engine.runner.x + 200
    engine.chaser.y = engine.runner.y
    engine.chaser.stunnedUntil = 0
    engine.runner.facing = { x: 1, y: 0 }
    engine.fireCooldown = 0
    engine._tryFire()
  })

  await page.waitForFunction(() => window.__skibEngine.chaser.stunnedUntil > 0)

  const sheebsAfter = await page.evaluate(() => window.__skibEngine.sheebs)
  expect(sheebsAfter).toBe(sheebsBefore + 25)
})

test('scaled death penalty applies 10 on level 2 and 30 on level 4 when debt is allowed', async ({ page }) => {
  const seededProfile = {
    userId: 'test-user',
    sheebs: 100,
    ownedItems: [],
    highestLevel: 4,
    deaths: 0,
    deathsHistory: [],
    muted: true,
    earnedBadges: [],
  }

  await page.addInitScript((profileJson) => {
    document.cookie = 'sjdt_user_id=test-user; Path=/; SameSite=Lax'
    document.cookie = `sjdt_profile_v1=${encodeURIComponent(profileJson)}; Path=/; SameSite=Lax`
  }, JSON.stringify(seededProfile))

  await page.goto('./')
  await page.locator('.play-btn').click()
  await expect(page.locator('canvas')).toBeVisible()

  await page.evaluate(() => {
    window.__skibEngine.levelIndex = 1
    window.__skibEngine._syncLevelState({ resetPositions: false, notify: false })
    window.__skibEngine.sheebs = 100
    window.__skibEngine._triggerCaught(window.__skibEngine.chasers[0])
  })

  await expect(page.getByRole('dialog', { name: 'Chaser profile' })).toBeVisible()
  await page.getByRole('button', { name: 'CONTINUE' }).click()
  await expect(page.locator('.debt-badge')).toHaveCount(0)
  await expect(page.getByText('90 sheebs')).toBeVisible()

  await page.locator('.play-btn').click()
  await expect(page.locator('canvas')).toBeVisible()

  await page.evaluate(() => {
    window.__skibEngine.levelIndex = 3
    window.__skibEngine._syncLevelState({ resetPositions: false, notify: false })
    window.__skibEngine.sheebs = 0
    window.__skibEngine._triggerCaught(window.__skibEngine.chasers[0])
  })

  await expect(page.getByRole('dialog', { name: 'Chaser profile' })).toBeVisible()
  await page.getByRole('button', { name: 'CONTINUE' }).click()
  await expect(page.locator('.debt-badge')).toBeVisible()
  await expect(page.locator('.debt-badge')).toHaveText('DEBT: -30')
})

test('chaser speed mod starts at 0.8 on a fresh run', async ({ page }) => {
  await page.goto('./')
  await page.locator('.play-btn').click()
  await expect(page.locator('canvas')).toBeVisible()
  await page.waitForFunction(() => window.__skibEngine?.phase === 'chase')

  const startMod = await page.evaluate(() => window.__skibEngine.chaserSpeedMod)
  expect(startMod).toBe(0.8)
})
