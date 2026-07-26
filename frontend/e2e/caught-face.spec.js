import { test, expect } from '@playwright/test'

// Verifies the runner pose-to-state mapping (docs/roadmap.md "Runner
// pose-to-state mapping"): Jayden's face should swap to the
// jayden-getting-captured pose the instant a capture happens, hold on
// jayden-captured once the jump-scare zoom finishes, then restore the
// run's original face once the caught beat ends and the chase resumes.
test('runner face swaps through getting-captured/captured poses on capture, then restores', async ({ page }) => {
  await page.goto('./')
  await page.locator('.play-btn').click()
  await expect(page.locator('canvas')).toBeVisible()

  await page.waitForFunction(() => window.__skibEngine?.runner?.face)

  const originalFaceSrc = await page.evaluate(() => window.__skibEngine.runner.face.src)

  // Force an immediate capture instead of waiting on real-time chase
  // movement: teleport the lead chaser onto the runner so the next
  // update() tick's AABB check trips `caught`.
  await page.evaluate(() => {
    const engine = window.__skibEngine
    engine.chaser.x = engine.runner.x
    engine.chaser.y = engine.runner.y
  })

  await page.waitForFunction(() => window.__skibEngine.phase === 'caught')
  // Compare by object identity, not filename: jayden-getting-captured.jpg
  // and jayden-uncaring-4029.jpg are currently byte-identical duplicates
  // of jayden-captured.jpg / jayden-default.jpg (see docs/characters.md),
  // so their bundled URLs can coincide even though they're distinct pool
  // entries wired to distinct engine fields.
  const swappedToGettingCaptured = await page.evaluate(
    () => window.__skibEngine.runner.face === window.__skibEngine.runner.gettingCapturedFace,
  )
  expect(swappedToGettingCaptured).toBe(true)

  // Zoom ramps 1x -> 3x over ~0.4s; once it caps out the face should hold
  // on the resigned "captured" pose for the rest of the beat.
  await page.waitForFunction(
    () => window.__skibEngine.runner.face === window.__skibEngine.runner.capturedFace,
  )

  // The caught beat lasts 2.6s; wait for phase to return to 'chase' and
  // confirm the runner's original face comes back.
  await page.waitForFunction(() => window.__skibEngine.phase === 'chase', null, { timeout: 10000 })
  const restoredFaceSrc = await page.evaluate(() => window.__skibEngine.runner.face.src)
  expect(restoredFaceSrc).toBe(originalFaceSrc)
})
