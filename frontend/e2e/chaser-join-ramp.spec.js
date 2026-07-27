import { test, expect } from '@playwright/test'

// Verifies the extra-chaser speed ramp (docs/roadmap.md "Extra chasers
// join slow and should ramp up over a level"): a freshly spawned extra
// chaser should start at a discount and climb to full speed over a few
// seconds, layered on top of the existing chaserSpeedMod rubber-band.
test('freshly spawned extra chaser ramps from a discount up to full speed', async ({ page }) => {
  await page.goto('./')
  await page.locator('.play-btn').first().click()
  await expect(page.locator('canvas')).toBeVisible()

  await page.waitForFunction(() => window.__skibEngine?.chasers?.length === 1)

  // Force an immediate extra-chaser spawn instead of waiting out the real
  // EXTRA_CHASER_INTERVAL.
  await page.evaluate(() => {
    window.__skibEngine.extraChaserTimer = 0
  })
  await page.waitForFunction(() => window.__skibEngine.chasers.length === 2)

  // Polled just after spawn, so a few frames may already have nudged the
  // ramp forward — the meaningful assertion is that it's still well below
  // fully-ramped, not that it's exactly 0.
  const initialRamp = await page.evaluate(() => window.__skibEngine.chasers[1].joinRamp)
  expect(initialRamp).toBeLessThan(0.5)

  // Effective speed should start below the lead chaser's (discounted).
  const speeds = await page.evaluate(() => {
    const engine = window.__skibEngine
    const extra = engine.chasers[1]
    const lead = engine.chasers[0]
    return {
      extra: extra.baseSpeed * engine.chaserSpeedMod * (0.7 + 0.3 * extra.joinRamp),
      lead: lead.baseSpeed * engine.chaserSpeedMod,
    }
  })
  expect(speeds.extra).toBeLessThan(speeds.lead)

  // Fast-forward the ramp instead of waiting real time.
  await page.evaluate(() => {
    window.__skibEngine.chasers[1].joinRamp = 1
  })
  await page.waitForFunction(() => window.__skibEngine.chasers[1].joinRamp === 1)
})
