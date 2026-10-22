import { test, expect } from '@playwright/test'

async function startRunnerGame(page) {
  await page.goto('./')
  await page.locator('.play-btn').first().click()
  await expect(page.locator('canvas')).toBeVisible()
  await page.waitForFunction(() => window.__skibEngine?.phase === 'chase')
}

// Issue #5: fixed-position pickups (Schleimy Potion, Taco Bell, Decoy,
// Turdstone Token) used to spawn inside walls on several levels, and
// random spawns could sit flush against a wall edge.
test('no pickup spawns inside a wall on any level', async ({ page }) => {
  await startRunnerGame(page)

  const bad = await page.evaluate(() => {
    const engine = window.__skibEngine
    const failures = []
    const realRandom = Math.random
    for (let level = 0; level < 6; level++) {
      engine.levelIndex = level
      for (let run = 0; run < 25; run++) {
        // Force every chance-gated pickup to spawn (Math.random() > chance fails).
        Math.random = () => 0
        engine.runner.hasTurdstoneToken = false
        engine._syncLevelState({ resetPositions: true, notify: false })
        Math.random = realRandom
        for (const p of [...engine.pickups, ...engine.rollingPickups]) {
          if (engine._hitsWall(p)) failures.push({ level: level + 1, type: p.type || 'rolling', x: p.x, y: p.y })
        }
      }
    }
    return failures
  })

  expect(bad).toEqual([])
})

test('level transition clears latched keyboard direction', async ({ page }) => {
  await startRunnerGame(page)
  const keys = await page.evaluate(() => {
    const engine = window.__skibEngine
    engine.keys.left = true
    engine.keys.up = true
    engine._syncLevelState({ resetPositions: true, notify: false })
    return { ...engine.keys }
  })
  expect(keys.left).toBe(false)
  expect(keys.up).toBe(false)
})
