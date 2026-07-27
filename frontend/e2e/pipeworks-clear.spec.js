import { test, expect } from '@playwright/test'

async function primePipeworks(page, { hallCoverage, fourSkibSeconds, advance = false } = {}) {
  await page.evaluate(({ hallCoverage, fourSkibSeconds, advance }) => {
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
    engine.pipeworksHallCoverage = hallCoverage
    engine.pipeworksFourSkibSeconds = fourSkibSeconds
    engine.pipeworksTransitionReady = hallCoverage >= 0.8 && fourSkibSeconds >= 15
    if (advance) engine._startLevelAdvance()
  }, { hallCoverage, fourSkibSeconds, advance })

  await page.waitForFunction(() => window.__skibEngine.level.name === 'Pipeworks')
  await page.waitForFunction(() => window.__skibEngine.chasers.length === 5)
}

test('Pipeworks keeps the lvl2 transition hidden until the hall coverage and 4-skib gate is met', async ({ page }) => {
  await page.goto('./')
  await page.locator('.play-btn').first().click()
  await expect(page.locator('canvas')).toBeVisible()

  await primePipeworks(page, { hallCoverage: 0.79, fourSkibSeconds: 14.9, advance: true })
  await page.waitForFunction(() => window.__skibEngine.phase === 'level-up')
  await expect(page.locator('.lvl2-transition')).toHaveCount(0)

  await page.goto('./')
  await page.locator('.play-btn').first().click()
  await expect(page.locator('canvas')).toBeVisible()

  await primePipeworks(page, { hallCoverage: 0.8, fourSkibSeconds: 15, advance: true })
  await page.waitForFunction(() => window.__skibEngine.phase === 'level-up')
  await expect(page.locator('.lvl2-transition')).toBeVisible()
})
