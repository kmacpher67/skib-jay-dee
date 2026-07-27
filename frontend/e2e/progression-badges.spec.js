import { test, expect } from '@playwright/test'

// Verifies the v0.4.32 progression badge gate
// (docs/handoffs/roadmap-handoff-v0.4.32-plan.md Feature 1): Levels 1-3 must
// not be advanceable until the level's mandatory badge pickup is collected,
// even once every other advance condition (skreems/time/chaser count) is
// already satisfied.
test('progression badge blocks level advance until collected', async ({ page }) => {
  await page.goto('./')
  await page.locator('.play-btn').click()
  await expect(page.locator('canvas')).toBeVisible()
  await page.waitForFunction(() => window.__skibEngine?.phase === 'chase')

  const badgeId = await page.evaluate(() => window.__skibEngine.level.progressionBadgeId)
  expect(badgeId).toBeTruthy()

  // Satisfy every other advance condition for level 1 (Porcelain Palace).
  await page.evaluate(() => {
    const engine = window.__skibEngine
    engine.levelSkreems = engine.level.advanceAt
    engine.levelElapsed = 999
    engine.extraChaserTimer = 0
    engine._maybeSpawnExtraChaser(0)
  })
  await page.waitForFunction(() => window.__skibEngine.chasers.length === 2)

  // Should stay stuck in 'chase' — the badge hasn't been picked up yet.
  await page.waitForTimeout(400)
  expect(await page.evaluate(() => window.__skibEngine.phase)).toBe('chase')

  // Collect the progression badge and confirm the level immediately unlocks.
  await page.evaluate(() => {
    const engine = window.__skibEngine
    engine.pickups.push({
      type: 'badge',
      badgeId: engine.level.progressionBadgeId,
      x: engine.runner.x,
      y: engine.runner.y,
      w: 28,
      h: 28,
    })
  })
  await page.waitForFunction(() => window.__skibEngine.levelBadgeCollected === true)
  await page.waitForFunction(() => window.__skibEngine.phase === 'level-up')
})

// Verifies the v0.4.32 humor badge system (Feature 2): a proc'd spawn drops
// an optional pickup that awards a badge on contact but never blocks
// progression the way the Feature 1 badges above do.
test('humor badges are optional spawns that award a badge without gating progress', async ({ page }) => {
  await page.goto('./')
  await page.locator('.play-btn').click()
  await expect(page.locator('canvas')).toBeVisible()
  await page.waitForFunction(() => window.__skibEngine?.phase === 'chase')

  const spawnedType = await page.evaluate(() => {
    const engine = window.__skibEngine
    engine.pickups = []
    const originalRandom = Math.random
    Math.random = () => 0 // guarantee the low-odds spawn roll succeeds
    engine._maybeSpawnHumorBadge()
    Math.random = originalRandom
    return engine.pickups[0]?.type ?? null
  })
  expect(spawnedType).toBe('humor-badge')

  await page.evaluate(() => {
    const engine = window.__skibEngine
    window.__lastBadge = null
    engine.onBadgeEarned = (id) => {
      window.__lastBadge = id
    }
    const pickup = engine.pickups[0]
    pickup.x = engine.runner.x
    pickup.y = engine.runner.y
  })
  await page.waitForFunction(() => window.__skibEngine.pickups.length === 0)
  const earnedId = await page.evaluate(() => window.__lastBadge)
  expect(['mysterious-plunger', 'golden-tp', 'haunted-rubber-ducky']).toContain(earnedId)

  // Collecting a humor badge never touches the progression gate.
  expect(await page.evaluate(() => window.__skibEngine.levelBadgeCollected)).toBe(false)
})
