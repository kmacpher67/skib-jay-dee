import { test, expect } from '@playwright/test'

test.describe('Badge Award Counts', () => {
  test('shows total badge awards in rewards history', async ({ page }) => {
    // Seed a profile with badgeAwardCounts
    await page.addInitScript(() => {
      const profile = {
        userId: 'test-user',
        label: 'Test User',
        sheebs: 100,
        earnedBadges: ['test-badge-1', 'test-badge-2'],
        badgeAwardCounts: {
          'test-badge-1': 2,
          'test-badge-2': 1,
        },
        highestLevel: 1,
        deaths: 0,
        ownedItems: [],
        deathsHistory: [],
        rewardsHistory: [],
      }
      document.cookie = `sjdt_user_id=test-user; path=/`
      document.cookie = `sjdt_profile_v1=${encodeURIComponent(JSON.stringify(profile))}; path=/`
      localStorage.setItem('sjdt_profiles_v1', JSON.stringify({ 'test-user': profile }))
    })

    await page.goto('/')
    
    // Open rewards history
    await page.click('button:has-text("REWARDS")')
    
    // The history tab is open by default. The count should say "Badge awards: 3"
    await expect(page.locator('text=Badge awards: 3')).toBeVisible()
  })
})
