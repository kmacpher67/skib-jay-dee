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
    await page.locator('.play-btn').click()
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

    // Wait for the near-capture beat to finish (2.5 seconds + some buffer)
    await page.waitForTimeout(2600)

    const phaseAfterBeat = await page.evaluate(() => window.__skibEngine.phase)
    expect(phaseAfterBeat).toBe('close-call-freeze')

    // Wait for the freeze to finish (1.0 seconds)
    await page.waitForTimeout(1100)

    const phaseAfterFreeze = await page.evaluate(() => window.__skibEngine.phase)
    expect(phaseAfterFreeze).toBe('chase')

    const sheebsAfter = await page.evaluate(() => window.__skibEngine.sheebs)
    expect(sheebsAfter).toBe(sheebsBefore + 50)
    
    const hasBadge = await page.evaluate(() => window.__skibEngine.slipperyBadgeEarned)
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

    // Spawn a non-positive pickup (badge, which is not in POSITIVE_PICKUPS)
    await page.evaluate(() => {
      const engine = window.__skibEngine
      engine.pickups.push({
        type: 'badge',
        badgeId: 'some-badge',
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
