import { test, expect } from '@playwright/test'

test.describe('Near-miss burst', () => {
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

  test('spawns particles and vignette pulse when escaping near-capture', async ({ page }) => {
    // Force near capture
    await page.evaluate(() => {
      window.__skibEngine._triggerNearCapture()
    })

    // Advance to close-call-freeze
    await page.evaluate(() => {
      const engine = window.__skibEngine
      engine._updateNearCapture(2.6)
    })

    const phaseAfterBeat = await page.evaluate(() => window.__skibEngine.phase)
    expect(phaseAfterBeat).toBe('close-call-freeze')

    // Escape
    await page.evaluate(() => {
      const engine = window.__skibEngine
      engine._updateCloseCallFreeze(1.1)
    })

    const phaseAfterFreeze = await page.evaluate(() => window.__skibEngine.phase)
    expect(phaseAfterFreeze).toBe('chase')

    // Check if particles and vignette timer are set
    const { particleCount, vignetteTimer } = await page.evaluate(() => {
      const engine = window.__skibEngine
      return {
        particleCount: engine.nearMissParticles ? engine.nearMissParticles.length : 0,
        vignetteTimer: engine.nearMissVignetteTimer || 0
      }
    })

    expect(particleCount).toBeGreaterThan(0)
    expect(vignetteTimer).toBeGreaterThan(0)
  })
})
