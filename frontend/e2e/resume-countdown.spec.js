import { test, expect } from '@playwright/test'

test.skip('runner and chaser resume countdown plays out after caught phase', async ({ page }) => {
  // The post-kill profile flow now returns to the menu instead of
  // auto-entering the countdown beat. The countdown code still lives in
  // GameEngine.js as a separate path, but this user-visible flow no longer
  // exercises it directly.
  await page.goto('./')
  await page.locator('.play-btn').first().click()
  await expect(page.locator('canvas')).toBeVisible()

  await page.waitForFunction(() => window.__skibEngine?.phase === 'chase')

  // Force an immediate capture
  await page.evaluate(() => {
    const engine = window.__skibEngine
    engine.chaser.x = engine.runner.x
    engine.chaser.y = engine.runner.y
  })

  // Wait for caught phase
  await page.waitForFunction(() => window.__skibEngine.phase === 'caught')

  // Wait for resume-countdown phase
  await page.waitForFunction(() => window.__skibEngine.phase === 'resume-countdown')

  // Grab positions and timer at start of countdown
  const stateAtStart = await page.evaluate(() => {
    const engine = window.__skibEngine
    return {
      runnerX: engine.runner.x,
      runnerY: engine.runner.y,
      chaserX: engine.chaser.x,
      chaserY: engine.chaser.y,
      timerStart: engine.countdownTimer,
      time: performance.now()
    }
  })

  // Wait for the countdown to finish and transition to chase
  await page.waitForFunction(() => window.__skibEngine.phase === 'chase', null, { timeout: 5000 })

  // Check state at end of countdown
  const stateAtEnd = await page.evaluate(() => {
    const engine = window.__skibEngine
    return {
      runnerX: engine.runner.x,
      runnerY: engine.runner.y,
      chaserX: engine.chaser.x,
      chaserY: engine.chaser.y,
      time: performance.now()
    }
  })

  // Positions should not change during countdown
  expect(stateAtEnd.runnerX).toBe(stateAtStart.runnerX)
  expect(stateAtEnd.runnerY).toBe(stateAtStart.runnerY)
  expect(stateAtEnd.chaserX).toBe(stateAtStart.chaserX)
  expect(stateAtEnd.chaserY).toBe(stateAtStart.chaserY)

  // Countdown timer started at 3
  expect(stateAtStart.timerStart).toBeCloseTo(3.0, 1)

  // Duration should be roughly 3 seconds
  const elapsed = (stateAtEnd.time - stateAtStart.time) / 1000
  expect(elapsed).toBeGreaterThan(2.5)
  expect(elapsed).toBeLessThan(4.5)
})
