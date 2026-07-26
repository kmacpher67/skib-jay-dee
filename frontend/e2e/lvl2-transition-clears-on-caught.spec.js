import { test, expect } from '@playwright/test'

test('lvl2 transition overlay is dismissed when a capture starts', async ({ page }) => {
  await page.goto('./')
  await page.locator('.play-btn').click()
  await expect(page.locator('canvas')).toBeVisible()

  await page.evaluate(() => {
    window.__skibEngine.levelIndex = 1
    window.__skibEngine._syncLevelState({ resetPositions: true })
    window.__skibEngine.phase = 'chase'
  })

  await page.waitForFunction(() => window.__skibEngine.level.name === 'Pipeworks')

  await page.evaluate(() => {
    window.__skibEngine.extraChaserTimer = 0
    window.__skibEngine._maybeSpawnExtraChaser(0)
    window.__skibEngine.extraChaserTimer = 0
    window.__skibEngine._maybeSpawnExtraChaser(0)
    window.__skibEngine.extraChaserTimer = 0
    window.__skibEngine._maybeSpawnExtraChaser(0)
    window.__skibEngine.extraChaserTimer = 0
    window.__skibEngine._maybeSpawnExtraChaser(0)
  })

  await page.waitForFunction(() => window.__skibEngine.chasers.length === 5)

  await page.evaluate(() => {
    window.__skibEngine.chasers.forEach((chaser) => {
      chaser.joinRamp = 1
    })
    window.__skibEngine.pipeworksSkreems = 100
  })

  await page.waitForFunction(() => window.__skibEngine.phase === 'level-up')
  await expect(page.locator('.lvl2-transition')).toBeVisible()

  await page.waitForFunction(() => window.__skibEngine.phase === 'chase', null, { timeout: 5000 })
  await page.evaluate(() => {
    const engine = window.__skibEngine
    engine.chaser.x = engine.runner.x
    engine.chaser.y = engine.runner.y
  })

  await page.waitForFunction(() => window.__skibEngine.phase === 'caught')
  await expect(page.locator('.lvl2-transition')).toHaveCount(0)
})
