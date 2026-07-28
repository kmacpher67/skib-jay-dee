import { test, expect } from '@playwright/test'

test('level 4 warning overlay shows once per run and pauses game', async ({ page }) => {
  await page.goto('./')
  await page.locator('.play-btn').first().click()
  await expect(page.locator('canvas')).toBeVisible()

  // Transition to Level 4 directly using the engine hook
  await page.evaluate(() => {
    window.__skibEngine.onLevelChange({ index: 4 })
  })

  // The overlay should appear
  await expect(page.locator('.level-4-warning')).toBeVisible()
  await expect(page.locator('.warning-header')).toHaveText('WARNING: WELCOME TO LEVEL 4. THE STAKES ARE REAL.')
  await expect(page.locator('.accept-btn')).toHaveText('I ACCEPT MY FATE')

  // The engine should be paused (no requestAnimationFrame)
  const isEnginePaused = await page.evaluate(() => {
    return window.__skibEngine._raf === null
  })
  expect(isEnginePaused).toBe(true)

  // Click to accept
  await page.locator('.accept-btn').click()

  // Overlay should be dismissed
  await expect(page.locator('.level-4-warning')).toHaveCount(0)

  // Engine should be unpaused
  const isEngineUnpaused = await page.evaluate(() => {
    return window.__skibEngine._raf !== null
  })
  expect(isEngineUnpaused).toBe(true)

  // Input must be re-bound after stop/start — runner can move again
  const movedAfterAccept = await page.evaluate(() => {
    const engine = window.__skibEngine
    const startY = engine.runner.y
    engine.keys.down = true
    for (let i = 0; i < 12; i += 1) {
      engine._moveWithCollision(engine.runner, 0, 8)
    }
    engine.keys.down = false
    return engine.runner.y > startY
  })
  expect(movedAfterAccept).toBe(true)

  // Trigger level 4 change again in the same run (e.g. after capture/respawn)
  await page.evaluate(() => {
    window.__skibEngine.onLevelChange({ index: 4 })
  })

  // Overlay should NOT appear a second time
  await page.waitForTimeout(500)
  await expect(page.locator('.level-4-warning')).toHaveCount(0)
})
