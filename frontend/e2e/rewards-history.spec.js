import { test, expect } from '@playwright/test'

test.describe('Rewards & History panel', () => {
  test.beforeEach(async ({ page }) => {
    // Clear cookies to start fresh
    await page.context().clearCookies()
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
  })

  test('empty state renders correctly', async ({ page }) => {
    // Open rewards modal
    await page.locator('button.rewards-btn').click()
    await expect(page.locator('.rewards-modal')).toBeVisible()
    
    // Should see empty message
    await expect(page.locator('.rewards-empty')).toHaveText('No rewards yet.')
    
    // Close modal
    await page.locator('.rewards-modal .close-pill').click()
    await expect(page.locator('.rewards-modal')).toBeHidden()
  })

  test('records purchases and badge earns', async ({ page }) => {
    // First, give ourselves some sheebs so we can buy something
    await page.evaluate(() => {
      window.__skibEngine = { levelIndex: 0, levels: [{ name: 'Test Level' }] }
      const mockProfile = {
        sheebs: 500,
        ownedItems: [],
        earnedBadges: [],
        highestLevel: 1,
        deaths: 0,
        deathsHistory: [],
        rewardsHistory: []
      };
      document.cookie = 'sjdt_profile_v1=' + encodeURIComponent(JSON.stringify(mockProfile)) + '; path=/'
      localStorage.setItem('sjdt_profiles_v1', JSON.stringify({
        'mock-id': mockProfile
      }))
      document.cookie = 'sjdt_user_id=mock-id; path=/'
    })
    await page.reload()

    // 1. Make a purchase
    await page.locator('button.shop-btn').click()
    await expect(page.locator('.shop-modal')).toBeVisible()
    // Buy Turbo Clogs (costs 100)
    await page.locator('button.shop-buy-btn').first().click() // buy first item
    await page.locator('.shop-modal .close-pill').click()
    await expect(page.locator('.shop-modal')).toBeHidden()

    // 2. Force a badge earn
    await page.evaluate(() => {
      // Find the react root and dispatch an event or call a method?
      // Wait, we can't easily call handleBadgeEarned from outside React,
      // but we can start the game and use __skibEngine to trigger it if exposed.
      // Wait, the e2e tests can just set the cookie, or we can trigger it in-game.
      // Let's start the game and trigger it.
    })

    await page.locator('button.play-btn').first().click()
    await expect(page.locator('canvas')).toBeVisible()

    // We can inject a badge earn by calling it if exposed, or just by manipulating sheebs for Financial Wizardry
    await page.evaluate(() => {
      if (window.__skibEngine) {
        window.__skibEngine.onBadgeEarned?.('financial-wizardry')
      }
    })

    // Wait for the badge toast
    await expect(page.locator('.badge-toast')).toBeVisible({ timeout: 5000 })
    
    // Exit to menu
    await page.locator('button.exit-btn').click()

    // Open rewards modal
    await page.locator('button.rewards-btn').click()
    await expect(page.locator('.rewards-modal')).toBeVisible()

    // Assert entries exist
    const cards = page.locator('.reward-card')
    await expect(cards).toHaveCount(2)

    // Purchase entry
    await expect(page.locator('.reward-card').filter({ hasText: 'PURCHASE:' }).first()).toBeVisible()
    
    // Badge entry
    await expect(page.locator('.reward-card').filter({ hasText: 'BADGE:' }).first()).toBeVisible()
  })
})
