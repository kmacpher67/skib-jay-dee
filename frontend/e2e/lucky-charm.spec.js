import { test, expect } from '@playwright/test'

// Verifies the Lucky Charm shop item's proc-based badge trigger
// (docs/handoffs/roadmap-handoff-v0.4.31-plan.md, confirmed with Ken): the
// "Lucky" badge should fire the first time the luck bonus actually causes a
// positive pickup to spawn that the base roll alone would have missed, not
// just on purchase.
test('a luck-bonus proc spawns a bonus gun pickup and fires the Lucky badge', async ({ page }) => {
  await page.goto('./')
  await page.locator('.play-btn').first().click()
  await expect(page.locator('canvas')).toBeVisible()
  await page.waitForFunction(() => window.__skibEngine?.phase === 'chase')

  const result = await page.evaluate(() => {
    const engine = window.__skibEngine
    engine.setLoadout({ speedBonus: 0, staminaBonus: 0, rewardBonus: 0, luckBonus: 1 })
    engine.pickups = []
    engine.luckyBadgeEarned = false
    window.__lastBadge = null
    engine.onBadgeEarned = (id) => {
      window.__lastBadge = id
    }

    const originalRandom = Math.random
    let call = 0
    // Force the base spawn roll to fail (call 1) and the luck-bonus roll to
    // succeed (call 2) so the resulting spawn is unambiguously the proc;
    // any later rolls (spawn-point search) stay real random.
    Math.random = () => {
      call += 1
      if (call === 1) return 0.999
      if (call === 2) return 0
      return originalRandom()
    }
    engine._maybeSpawnGunPickup()
    Math.random = originalRandom

    return { pickups: engine.pickups.length }
  })

  expect(result.pickups).toBe(1)
  await page.waitForFunction(() => window.__lastBadge === 'lucky')
})
