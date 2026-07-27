import { test, expect } from '@playwright/test'

test.describe('Broth Slip (Raman-Aunt)', () => {
  test('stepping in broth trail applies drift steering multiplier', async ({ page }) => {
    await page.goto('/')
    await page.locator('.play-btn').first().click()
    await page.waitForFunction(() => window.__skibEngine?.phase === 'chase')

    await page.evaluate(() => {
      const engine = window.__skibEngine
      engine.levelIndex = 4
      engine._syncLevelState({ resetPositions: true })
      engine.phase = 'chase'
      const size = 28
      engine.brothTrails.push({
        x: engine.runner.x + engine.runner.w / 2 - size / 2,
        y: engine.runner.y + engine.runner.h / 2 - size / 2,
        w: size,
        h: size,
        lifetime: 4,
      })
    })

    await page.evaluate(() => window.__skibEngine.update(0.1))

    const steeringMult = await page.evaluate(() => window.__skibEngine.getBrothSteeringMult())
    expect(steeringMult).toBeCloseTo(0.05)

    const frictionTimer = await page.evaluate(() => window.__skibEngine.brothFrictionTimer)
    expect(frictionTimer).toBeGreaterThan(0)
  })
})
