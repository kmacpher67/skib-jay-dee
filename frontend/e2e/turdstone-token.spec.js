import { test, expect } from '@playwright/test'

// Turdstone Token — Resurrection Ward (docs/handoffs/roadmap-handoff-v0.4.52-plan.md)
// Verifies:
//   1. Pickup collection sets runner.hasTurdstoneToken = true.
//   2. Getting caught with the token: no levelIndex bump, no sheebs penalty,
//      and hasTurdstoneToken is consumed (set to false).
//   3. A normal death (no token) still advances levelIndex as before.

test('turdstone token pickup sets hasTurdstoneToken on runner', async ({ page }) => {
  await page.goto('./')
  await page.getByRole('button', { name: 'QUICK PLAY' }).click()
  await expect(page.locator('canvas')).toBeVisible()
  await page.waitForFunction(() => window.__skibEngine?.phase === 'chase')

  // Force a turdstone-token pickup directly onto the runner.
  await page.evaluate(() => {
    const engine = window.__skibEngine
    engine.pickups = [{
      type: 'turdstone-token',
      x: engine.runner.x,
      y: engine.runner.y,
      w: 32,
      h: 32,
    }]
  })

  await page.waitForFunction(() => window.__skibEngine.runner.hasTurdstoneToken === true)
  await page.waitForFunction(() => window.__skibEngine.pickups.length === 0)

  const tokenHeld = await page.evaluate(() => window.__skibEngine.runner.hasTurdstoneToken)
  expect(tokenHeld).toBe(true)
})

test('turdstone save: caught with token does not bump levelIndex or reduce sheebs, and consumes the token', async ({ page }) => {
  await page.goto('./')
  await page.getByRole('button', { name: 'QUICK PLAY' }).click()
  await expect(page.locator('canvas')).toBeVisible()
  await page.waitForFunction(() => window.__skibEngine?.phase === 'chase')

  // Give the runner a Turdstone Token and record current state.
  const beforeState = await page.evaluate(() => {
    const engine = window.__skibEngine
    // Force the runner to have a token.
    engine.runner.hasTurdstoneToken = true
    // Force highestLevel > 3 so the normal death path would apply a sheebs penalty.
    engine.highestLevel = 4
    // Give the runner some sheebs so a penalty would be visible.
    engine.sheebs = 100
    return {
      levelIndex: engine.levelIndex,
      sheebs: engine.sheebs,
    }
  })

  // Trigger a capture: move the chaser onto the runner.
  await page.evaluate(() => {
    const engine = window.__skibEngine
    engine.chaser.x = engine.runner.x
    engine.chaser.y = engine.runner.y
    engine.update(0.016)
  })

  // Wait for caught phase to start (token branch fires).
  await page.waitForFunction(() => window.__skibEngine?.phase === 'caught')

  const afterState = await page.evaluate(() => {
    const engine = window.__skibEngine
    return {
      levelIndex: engine.levelIndex,
      sheebs: engine.sheebs,
      hasTurdstoneToken: engine.runner.hasTurdstoneToken,
    }
  })

  // levelIndex should NOT have advanced.
  expect(afterState.levelIndex).toBe(beforeState.levelIndex)
  // Sheebs should NOT have decreased.
  expect(afterState.sheebs).toBe(beforeState.sheebs)
  // Token should be consumed.
  expect(afterState.hasTurdstoneToken).toBe(false)
})

test('normal death (no token) still advances levelIndex', async ({ page }) => {
  await page.goto('./')
  await page.getByRole('button', { name: 'QUICK PLAY' }).click()
  await expect(page.locator('canvas')).toBeVisible()
  await page.waitForFunction(() => window.__skibEngine?.phase === 'chase')

  const beforeLevel = await page.evaluate(() => {
    const engine = window.__skibEngine
    // Ensure no token is held.
    engine.runner.hasTurdstoneToken = false
    return engine.levelIndex
  })

  // Trigger a capture.
  await page.evaluate(() => {
    const engine = window.__skibEngine
    engine.chaser.x = engine.runner.x
    engine.chaser.y = engine.runner.y
    engine.update(0.016)
  })

  await page.waitForFunction(() => window.__skibEngine?.phase === 'caught')

  const afterLevel = await page.evaluate(() => window.__skibEngine.levelIndex)
  // Without a token, levelIndex should have advanced by 1.
  expect(afterLevel).toBe(beforeLevel + 1)
})
