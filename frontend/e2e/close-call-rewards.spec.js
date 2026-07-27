import { test, expect } from '@playwright/test'

test.describe('Close-call freeze and sheeb rewards', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => {
      window.localStorage.setItem(
        'skib-jay-dee-save-data',
        JSON.stringify({
          activeProfileId: 'test-profile',
          profiles: {
            'test-profile': {
              id: 'test-profile',
              name: 'Test',
              sheebs: 0,
              highestLevel: 1,
              ownedItems: [],
              badges: [],
            },
          },
        })
      )
    })
    await page.reload()
    await page.locator('.play-btn').first().click()
    await expect(page.locator('canvas')).toBeVisible()

    // Skip intro and menu
    await page.evaluate(() => {
      return new Promise((resolve) => {
        const check = setInterval(() => {
          if (window.__skibEngine) {
            clearInterval(check)
            window.__skibEngine.phase = 'chase'
            window.__skibEngine.introTimer = 0
            resolve()
          }
        }, 10)
      })
    })
  })

  test('close-call freezes the game and awards 50 sheebs on escape', async ({ page }) => {
    const sheebsBefore = await page.evaluate(() => window.__skibEngine.sheebs)
    
    // Force near capture
    await page.evaluate(() => {
      window.__skibEngine._triggerNearCapture()
    })

    // Drive the engine forward deterministically instead of relying on wall
    // clock timing, which is flaky in headless playback.
    await page.evaluate(() => {
      const engine = window.__skibEngine
      engine.newBadges = []
      engine._updateNearCapture(2.6)
    })

    const phaseAfterBeat = await page.evaluate(() => window.__skibEngine.phase)
    expect(phaseAfterBeat).toBe('close-call-freeze')

    await page.evaluate(() => {
      const engine = window.__skibEngine
      engine._updateCloseCallFreeze(1.1)
    })

    const phaseAfterFreeze = await page.evaluate(() => window.__skibEngine.phase)
    expect(phaseAfterFreeze).toBe('chase')

    const sheebsAfter = await page.evaluate(() => window.__skibEngine.sheebs)
    expect(sheebsAfter).toBe(sheebsBefore + 100)
    
    const hasBadge = await page.evaluate(() => window.__skibEngine.earnedBadges.includes('slippery-when-wet'))
    expect(hasBadge).toBe(true)
  })

  test('positive pickup grants 5 sheebs and non-positive does not', async ({ page }) => {
    const sheebsBefore = await page.evaluate(() => window.__skibEngine.sheebs)

    // Spawn a positive pickup (taco-bell) on runner
    await page.evaluate(() => {
      const engine = window.__skibEngine
      engine.pickups.push({
        type: 'taco-bell',
        x: engine.runner.x,
        y: engine.runner.y,
        w: engine.runner.w,
        h: engine.runner.h,
      })
    })

    // Wait a frame for physics to process pickup
    await page.waitForTimeout(100)
    
    const sheebsAfterPositive = await page.evaluate(() => window.__skibEngine.sheebs)
    // POSITIVE_PICKUPS includes 'taco-bell' so sheebs should increment by 5
    expect(sheebsAfterPositive).toBe(sheebsBefore + 5)

    // Spawn a non-positive rolling pickup (slow debuff, not in POSITIVE_PICKUPS)
    await page.evaluate(() => {
      const engine = window.__skibEngine
      engine.rollingPickups.push({
        type: 'rolling',
        effect: 'slow',
        isGood: false,
        vx: 0,
        vy: 0,
        x: engine.runner.x,
        y: engine.runner.y,
        w: engine.runner.w,
        h: engine.runner.h,
      })
    })

    await page.waitForTimeout(100)
    
    const sheebsAfterNeutral = await page.evaluate(() => window.__skibEngine.sheebs)
    expect(sheebsAfterNeutral).toBe(sheebsAfterPositive) // Should not change
  })
})
