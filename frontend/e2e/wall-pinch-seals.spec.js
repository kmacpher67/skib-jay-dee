import { test, expect } from '@playwright/test'

// v0.4.51 — sealed sub-40px corridor traps in Ramen Aisle (L4) and
// Jayden's Nightmare House (L6). Runner hitbox is 40px; these spots were
// 30px floor slivers that read as passable lanes but trapped the runner.

test('sealed Ramen Aisle shelf pinch blocks the runner', async ({ page }) => {
  await page.goto('./')
  await page.locator('.play-btn').click()
  await expect(page.locator('canvas')).toBeVisible()
  await page.waitForFunction(() => window.__skibEngine?.phase === 'chase')

  const result = await page.evaluate(() => {
    const engine = window.__skibEngine
    engine.levelIndex = 3
    engine._syncLevelState({ resetPositions: true, notify: false })
    engine.phase = 'chase'

    // Former 30px gap was cols 35-38 / rows 130-135 (tile=10px).
    // Place runner in the open aisle just above, then push downward into
    // the sealed shelf band — should collide, not tunnel through.
    const targetY = 1300
    engine.runner.x = 300
    engine.runner.y = 1260
    for (let i = 0; i < 40; i += 1) {
      engine._moveWithCollision(engine.runner, 0, 8)
    }
    return {
      level: engine.level.name,
      y: engine.runner.y,
      blockedBeforeGap: engine.runner.y + engine.runner.h <= targetY + 2,
    }
  })

  expect(result.level).toBe('The Ramen Aisle')
  expect(result.blockedBeforeGap).toBe(true)
})

test('sealed Nightmare House channel blocks the runner', async ({ page }) => {
  await page.goto('./')
  await page.locator('.play-btn').click()
  await expect(page.locator('canvas')).toBeVisible()
  await page.waitForFunction(() => window.__skibEngine?.phase === 'chase')

  const result = await page.evaluate(() => {
    const engine = window.__skibEngine
    engine.levelIndex = 5
    engine._syncLevelState({ resetPositions: true, notify: false })
    engine.phase = 'chase'

    // Former 30px vertical channel was cols 85-88 / rows 5-29.
    // Place runner left of the channel and push right into the sealed wall.
    const channelX = 850
    engine.runner.x = 800
    engine.runner.y = 150
    for (let i = 0; i < 40; i += 1) {
      engine._moveWithCollision(engine.runner, 8, 0)
    }
    return {
      level: engine.level.name,
      x: engine.runner.x,
      blockedBeforeChannel: engine.runner.x + engine.runner.w <= channelX + 2,
    }
  })

  expect(result.level).toBe("Jayden's Nightmare House")
  expect(result.blockedBeforeChannel).toBe(true)
})
