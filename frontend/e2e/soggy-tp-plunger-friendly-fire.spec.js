import { test, expect } from '@playwright/test'

// Verifies the three v0.4.36 follow-ups that were left half-wired in an
// interrupted session (docs/handoffs/roadmap-handoff-v0.4.36.md's "Follow-up
// / Next Steps"): Soggy Toilet Paper (pickup -> trail -> chaser slow), the
// Heavy Plunger (pickup -> F/FIRE swing -> knockback), and the "Friendly
// Fire" secret badge (gun-stun a chaser, then get caught by that exact
// chaser right as the stun wears off).

test('soggy toilet paper pickup drops a trail that slows a chaser stepping in it', async ({ page }) => {
  await page.goto('./')
  await page.locator('.play-btn').click()
  await expect(page.locator('canvas')).toBeVisible()
  await page.waitForFunction(() => window.__skibEngine?.phase === 'chase')

  await page.evaluate(() => {
    const engine = window.__skibEngine
    engine.pickups = [{ type: 'soggy-tp', x: engine.runner.x, y: engine.runner.y, w: 24, h: 24 }]
  })
  await page.waitForFunction(() => window.__skibEngine.soggyTpActive === true)
  await page.waitForFunction(() => window.__skibEngine.pickups.length === 0)

  // Force a trail segment to exist directly on the chaser and tick the
  // engine so the chase-update loop's rectsIntersect check picks it up.
  await page.evaluate(() => {
    const engine = window.__skibEngine
    engine.soggyTrails = [{ x: engine.chaser.x, y: engine.chaser.y, w: 26, h: 26, lifetime: 5 }]
    engine.chaser.soggySlowTimer = 0
    engine.update(0.05)
  })

  const soggySlowTimer = await page.evaluate(() => window.__skibEngine.chaser.soggySlowTimer)
  expect(soggySlowTimer).toBeGreaterThan(0)
})

test('heavy plunger pickup lets the runner swing via fire input and knock a nearby chaser back', async ({ page }) => {
  await page.goto('./')
  await page.locator('.play-btn').click()
  await expect(page.locator('canvas')).toBeVisible()
  await page.waitForFunction(() => window.__skibEngine?.phase === 'chase')

  await page.evaluate(() => {
    const engine = window.__skibEngine
    engine.pickups = [{ type: 'heavy-plunger', x: engine.runner.x, y: engine.runner.y, w: 24, h: 24 }]
  })
  await page.waitForFunction(() => window.__skibEngine.runner.plunger !== null)
  await page.waitForFunction(() => window.__skibEngine.pickups.length === 0)

  const result = await page.evaluate(() => {
    const engine = window.__skibEngine
    engine.chaser.x = engine.runner.x + 40
    engine.chaser.y = engine.runner.y
    const before = { x: engine.chaser.x, y: engine.chaser.y }
    const swingsBefore = engine.runner.plunger.swings
    engine.fireCooldown = 0
    engine._tryFire()
    return {
      swingsBefore,
      swingsAfter: engine.runner.plunger?.swings ?? 0,
      dx: engine.chaser.x - before.x,
      plungerSwingActive: engine.plungerSwingActive,
    }
  })

  expect(result.swingsAfter).toBe(result.swingsBefore - 1)
  expect(result.plungerSwingActive).toBe(true)
  expect(Math.abs(result.dx)).toBeGreaterThan(0)
})

test('friendly fire badge fires when the runner is caught by the exact chaser they just gun-stunned', async ({ page }) => {
  await page.goto('./')
  await page.locator('.play-btn').click()
  await expect(page.locator('canvas')).toBeVisible()
  await page.waitForFunction(() => window.__skibEngine?.phase === 'chase')

  await page.evaluate(() => {
    const engine = window.__skibEngine
    window.__lastBadge = null
    engine.onBadgeEarned = (id) => {
      window.__lastBadge = id
    }
    // Simulate a chaser whose gun-stun just wore off (grace window active)
    // and put the runner directly on top of it so the chase-update loop's
    // capture check fires this frame.
    engine.chaser.stunnedUntil = 0
    engine.chaser.gunStunned = false
    engine.chaser.stunGracePeriod = 2
    engine.chaser.x = engine.runner.x
    engine.chaser.y = engine.runner.y
    engine.update(0.016)
  })

  await page.waitForFunction(() => window.__lastBadge === 'friendly-fire')
})
