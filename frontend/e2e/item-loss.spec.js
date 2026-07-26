import { test, expect } from '@playwright/test'

test('loses item on capture if highestLevel > 4', async ({ page }) => {
  const seededProfile = {
    userId: 'test-user',
    sheebs: 50,
    ownedItems: ['turbo-clogs'],
    highestLevel: 5,
    deaths: 0,
    deathsHistory: [],
    muted: true,
  }
  
  await page.addInitScript((profileJson) => {
    document.cookie = 'sjdt_user_id=test-user; Path=/; SameSite=Lax'
    document.cookie = `sjdt_profile_v1=${encodeURIComponent(profileJson)}; Path=/; SameSite=Lax`
    
    // Override Math.random so we always lose the item (25% chance check)
    const originalRandom = Math.random;
    Math.random = () => {
       // We need to return < 0.25 for the item loss check
       // Also it's used for random face generation, but this should be fine for the test
       return 0.1;
    }
  }, JSON.stringify(seededProfile))
  
  await page.goto('./')
  await page.locator('.play-btn').click()
  await expect(page.locator('canvas')).toBeVisible()
  
  await page.evaluate(() => {
    window.__skibEngine._triggerCaught(window.__skibEngine.chasers[0])
  })
  
  await expect(page.locator('.toast-panel')).toBeVisible()
  await expect(page.getByRole('dialog', { name: 'Chaser profile' })).toBeVisible()
  await page.getByRole('button', { name: 'CONTINUE' }).click()
  
  // The item should be gone from the loadout. Check shop or perk strip.
  await expect(page.getByText('Speed +0')).toBeVisible() // turbo-clogs gives speed +28
})

test('keeps item on capture if highestLevel <= 4', async ({ page }) => {
  const seededProfile = {
    userId: 'test-user',
    sheebs: 50,
    ownedItems: ['turbo-clogs'],
    highestLevel: 4,
    deaths: 0,
    deathsHistory: [],
    muted: true,
  }
  
  await page.addInitScript((profileJson) => {
    document.cookie = 'sjdt_user_id=test-user; Path=/; SameSite=Lax'
    document.cookie = `sjdt_profile_v1=${encodeURIComponent(profileJson)}; Path=/; SameSite=Lax`
    
    const originalRandom = Math.random;
    Math.random = () => {
       return 0.1;
    }
  }, JSON.stringify(seededProfile))
  
  await page.goto('./')
  await page.locator('.play-btn').click()
  await expect(page.locator('canvas')).toBeVisible()
  
  await page.evaluate(() => {
    window.__skibEngine._triggerCaught(window.__skibEngine.chasers[0])
  })
  
  await expect(page.locator('.toast-panel')).toBeVisible()
  await expect(page.getByRole('dialog', { name: 'Chaser profile' })).toBeVisible()
  await page.getByRole('button', { name: 'CONTINUE' }).click()
  
  // The item should still be there
  await expect(page.getByText('Speed +28')).toBeVisible()
})
