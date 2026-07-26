import { test, expect } from '@playwright/test'

async function primePipeworks(page, { advance = false } = {}) {
  await page.evaluate(({ advance }) => {
    const engine = window.__skibEngine
    engine.levelIndex = 1
    engine._syncLevelState({ resetPositions: true })
    engine.phase = 'chase'
    engine.extraChaserTimer = 0
    engine._maybeSpawnExtraChaser(0)
    engine.extraChaserTimer = 0
    engine._maybeSpawnExtraChaser(0)
    engine.extraChaserTimer = 0
    engine._maybeSpawnExtraChaser(0)
    engine.extraChaserTimer = 0
    engine._maybeSpawnExtraChaser(0)
    engine.chasers.forEach((chaser) => {
      chaser.joinRamp = 1
    })
    engine.pipeworksHallCoverage = 0.8
    engine.pipeworksFourSkibSeconds = 15
    engine.pipeworksTransitionReady = true
    if (advance) engine._startLevelAdvance()
  }, { advance })

  await page.waitForFunction(() => window.__skibEngine.level.name === 'Pipeworks')
  await page.waitForFunction(() => window.__skibEngine.chasers.length === 5)
}

test('lvl2 transition overlay is dismissed when a capture starts', async ({ page }) => {
  await page.goto('./')
  await page.locator('.play-btn').click()
  await expect(page.locator('canvas')).toBeVisible()

  await primePipeworks(page, { advance: true })
  await page.evaluate(() => {
    window.__skibEngine.chaserSpeedMod = 0
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

test('lvl2 transition finishes without a crash after playback ends', async ({ page }) => {
  const pageErrors = []
  page.on('pageerror', (error) => {
    pageErrors.push(error.message)
  })

  await page.goto('./')
  await page.locator('.play-btn').click()
  await expect(page.locator('canvas')).toBeVisible()

  await primePipeworks(page, { advance: true })
  await page.waitForFunction(() => window.__skibEngine.phase === 'level-up')
  await expect(page.locator('.lvl2-transition')).toBeVisible()

  await page.evaluate(() => {
    const engine = window.__skibEngine
    engine.runner.x = 420
    engine.runner.y = 1250
    engine.chasers.forEach((chaser, index) => {
      chaser.x = index === 0 ? 60 : 760
      chaser.y = index === 0 ? 160 : 40 + index * 120
      chaser.baseSpeed = 0
    })
    engine.chaser.baseSpeed = 0
  })

  await page.waitForFunction(() => window.__skibEngine.phase === 'chase', null, { timeout: 15000 })
  await expect(page.locator('.lvl2-transition')).toHaveCount(0, { timeout: 15000 })
  expect(pageErrors).toEqual([])

  const state = await page.evaluate(() => {
    const engine = window.__skibEngine
    return {
      phase: engine.phase,
      levelIndex: engine.levelIndex,
      levelName: engine.level.name,
      chasers: engine.chasers.length,
    }
  })

  expect(state.levelIndex).toBe(2)
  expect(state.levelName).toBe('Flooded Annex')
})
