import { test, expect } from '@playwright/test'

test('Pipeworks only clears when 4 chasers are active and fully ramped', async ({ page }) => {
  
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
  })

  await page.waitForFunction(() => window.__skibEngine.chasers.length === 4)

  await page.evaluate(() => {
    window.__skibEngine.chasers.forEach(c => { c.joinRamp = 1 })
    window.__skibEngine.pipeworksSkreems = 100
  })

  await page.waitForTimeout(500)
  
  const state = await page.evaluate(() => {
    const e = window.__skibEngine
    return {
      phase: e.phase,
      levelIndex: e.levelIndex,
      pipeworksSkreems: e.pipeworksSkreems,
      chasers: e.chasers.length,
      levelName: e.level.name
    }
  })
  expect(state.phase).toBe('level-up')
})
