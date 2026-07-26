import { test, expect } from '@playwright/test'

// Verifies the runner pose-to-state mapping and the new post-kill profile
// beat: Jayden should swap to the getting-captured pose the instant a
// capture happens, hold on the captured pose once the jump-scare zoom
// finishes, then show the chaser profile card before returning to the menu.
test('runner face swaps through getting-captured/captured poses on capture, then shows the chaser profile', async ({ page }) => {
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

  // The caught beat now hands off to the profile screen instead of
  // auto-resuming immediately.
  await page.waitForFunction(() => window.__skibEngine.phase === 'caught-profile', null, { timeout: 10000 })
  const profileDialog = page.getByRole('dialog', { name: 'Chaser profile' })
  await expect(profileDialog).toBeVisible()
  await expect(profileDialog.getByText('Main scare')).toBeVisible()
  await expect(profileDialog.getByText('Killing tricks')).toBeVisible()

  await profileDialog.getByRole('button', { name: 'CONTINUE' }).click()
  await expect(page.locator('.play-btn')).toBeVisible()
  await expect(page.locator('canvas')).toHaveCount(0)
  await expect(page.getByText('SKIB-JAY-DEE-TOILET')).toBeVisible()
})
