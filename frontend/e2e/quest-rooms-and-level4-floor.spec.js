import { test, expect } from '@playwright/test'

// Verifies the v0.4.33 Quest Room badges
// (docs/handoffs/roadmap-handoff-v0.4.33-plan.md Feature 1): Level 4
// (Ramen Aisle) auto-spawns an optional, guaranteed pickup at the center
// of its dedicated quest room, reachable through the room's door gap, and
// collecting it never touches the (unrelated) progression-badge gate.
test('quest room badge spawns in the room and awards a badge without gating progress', async ({ page }) => {
  await page.goto('./')
  await page.locator('.play-btn').first().click()
  await expect(page.locator('canvas')).toBeVisible()
  await page.waitForFunction(() => window.__skibEngine?.phase === 'chase')

  await page.evaluate(() => {
    const engine = window.__skibEngine
    engine.levelIndex = 3
    // notify: false — skip the level-4 warning overlay's onLevelChange
    // side effect (App.jsx pauses the engine for it); unrelated to what
    // this test covers.
    engine._syncLevelState({ resetPositions: true, notify: false })
    engine.phase = 'chase'
  })
  await page.waitForFunction(() => window.__skibEngine.level.name === 'The Ramen Aisle')

  const questPickup = await page.evaluate(() => {
    const engine = window.__skibEngine
    const room = engine.map.questRoom
    const pickup = engine.pickups.find((p) => p.type === 'quest-badge')
    return {
      room,
      pickup,
      insideRoom:
        pickup &&
        pickup.x >= room.x &&
        pickup.x + pickup.w <= room.x + room.w &&
        pickup.y >= room.y &&
        pickup.y + pickup.h <= room.y + room.h,
    }
  })
  expect(questPickup.pickup?.badgeId).toBe('ramen-vault-keeper')
  expect(questPickup.insideRoom).toBe(true)

  // Walk the runner through the door and onto the pickup, then confirm the
  // badge fires and the (separate, mandatory) progression gate is untouched.
  await page.evaluate(() => {
    const engine = window.__skibEngine
    window.__lastBadge = null
    engine.onBadgeEarned = (id) => {
      window.__lastBadge = id
    }
    const pickup = engine.pickups.find((p) => p.type === 'quest-badge')
    engine.runner.x = pickup.x
    engine.runner.y = pickup.y
    engine._checkPickups()
  })
  expect(await page.evaluate(() => window.__lastBadge)).toBe('ramen-vault-keeper')
  expect(await page.evaluate(() => window.__skibEngine.levelBadgeCollected)).toBe(false)
})

// Verifies the v0.4.33 Level 4+ survival floor (Feature 2): Level 4 can't
// clear on skreems/chaser-count alone anymore — it also needs the scaled
// time floor (90s at Level 4) and all 5 chasers active, stacked on top of
// (not replacing) the existing skreems threshold.
test('Level 4 advance requires the 90s+5-chaser floor on top of the skreems threshold', async ({ page }) => {
  await page.goto('./')
  await page.locator('.play-btn').first().click()
  await expect(page.locator('canvas')).toBeVisible()
  await page.waitForFunction(() => window.__skibEngine?.phase === 'chase')

  await page.evaluate(() => {
    const engine = window.__skibEngine
    engine.levelIndex = 3
    // notify: false — skip the level-4 warning overlay's onLevelChange
    // side effect (App.jsx pauses the engine for it); unrelated to what
    // this test covers.
    engine._syncLevelState({ resetPositions: true, notify: false })
    engine.phase = 'chase'
    engine.levelBadgeCollected = true // not under test here
    engine.levelSkreems = engine.level.advanceAt
    engine.levelElapsed = 40 // well past MIN_LEVEL_SECONDS_BEFORE_ADVANCE(30), short of the 90s floor
    engine.extraChaserTimer = 0
    engine._maybeSpawnExtraChaser(0)
  })
  await page.waitForFunction(() => window.__skibEngine.chasers.length === 2)

  // Skreems + old 30s floor + 2 chasers are all satisfied, but the new
  // 90s/5-chaser floor isn't — should stay stuck in 'chase'.
  await page.waitForTimeout(400)
  expect(await page.evaluate(() => window.__skibEngine.phase)).toBe('chase')

  // Now satisfy the new floor directly and confirm it unlocks.
  await page.evaluate(() => {
    const engine = window.__skibEngine
    engine.levelElapsed = 999
    for (let i = 0; i < 4; i++) {
      engine.extraChaserTimer = 0
      engine._maybeSpawnExtraChaser(0)
    }
    engine.update(0.05)
  })
  await page.waitForFunction(() => window.__skibEngine.chasers.length === 5)
  expect(await page.evaluate(() => window.__skibEngine.phase)).toBe('level-up')
})
