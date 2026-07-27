import { test, expect } from '@playwright/test'

test('shart knocker is granted on level 4 taco bell and stuns chaser on hit', async ({ page }) => {
  await page.goto('./')
  await page.locator('.play-btn').click()
  await expect(page.locator('canvas')).toBeVisible()
  await page.waitForFunction(() => window.__skibEngine?.phase === 'chase')

  // Set level to 4
  await page.evaluate(() => {
    window.__skibEngine.levelIndex = 3 // Level 4 is index 3
  })

  // Force a taco bell pickup exactly on the runner so the next update tick collects it.
  await page.evaluate(() => {
    const engine = window.__skibEngine
    engine.pickups = [{ type: 'taco-bell', x: engine.runner.x, y: engine.runner.y, w: 28, h: 28 }]
  })

  await page.waitForFunction(() => window.__skibEngine.shartCharge > 0)
  
  // Position chaser close to runner and trigger shart knocker
  await page.evaluate(() => {
    const engine = window.__skibEngine
    engine.chaser.x = engine.runner.x + 50
    engine.chaser.y = engine.runner.y
    engine.chaser.stunnedUntil = 0
    engine.fireCooldown = 0
    engine.sheebs = 0 // Reset sheebs for clean delta check
    engine._tryFire()
  })

  // Verify stun, charge consumption, and sheebs delta
  await page.waitForFunction(() => window.__skibEngine.chaser.stunnedUntil > 0)
  
  const state = await page.evaluate(() => {
    const e = window.__skibEngine
    return {
      stunnedUntil: e.chaser.stunnedUntil,
      shartCharge: e.shartCharge,
      sheebs: e.sheebs,
      earnedBadges: e.earnedBadges
    }
  })

  // Stun should be 3-12 seconds
  const levelSeconds = await page.evaluate(() => window.__skibEngine.levelSeconds)
  expect(state.stunnedUntil).toBeGreaterThan(levelSeconds + 2.9)
  expect(state.stunnedUntil).toBeLessThanOrEqual(levelSeconds + 12)

  expect(state.shartCharge).toBe(0)
  expect(state.sheebs).toBe(50) // 50 sheebs for hit
  expect(state.earnedBadges).toContain('flaming-ass')

  // Now test a miss
  await page.evaluate(() => {
    const engine = window.__skibEngine
    engine.shartCharge = 1
    engine.chaser.x = engine.runner.x + 1000 // Out of range
    engine.sheebs = 0
    engine.fireCooldown = 0
    engine._tryFire()
  })

  await page.waitForFunction(() => window.__skibEngine.shartCharge === 0)
  const missSheebs = await page.evaluate(() => window.__skibEngine.sheebs)
  expect(missSheebs).toBe(5) // 5 sheebs for miss
})
