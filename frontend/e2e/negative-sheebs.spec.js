import { test, expect } from '@playwright/test'

test('balance goes negative on capture if highestLevel > 3', async ({ page }) => {
  const seededProfile = {
    userId: 'test-user',
    sheebs: 5,
    ownedItems: [],
    highestLevel: 4,
    deaths: 0,
    deathsHistory: [],
    muted: true,
  }
  
  await page.addInitScript((profileJson) => {
    document.cookie = 'sjdt_user_id=test-user; Path=/; SameSite=Lax'
    document.cookie = `sjdt_profile_v1=${encodeURIComponent(profileJson)}; Path=/; SameSite=Lax`
  }, JSON.stringify(seededProfile))
  
  await page.goto('./')
  await page.locator('.play-btn').click()
  await expect(page.locator('canvas')).toBeVisible()
  
  // Force a capture via the exposed __skibEngine
  await page.evaluate(() => {
    window.__skibEngine._triggerCaught(window.__skibEngine.chasers[0])
  })
  
  // HUD should eventually show the negative balance in the debt badge
  await expect(page.locator('.toast-panel')).toBeVisible()
  await page.waitForTimeout(3000) // wait for capture animation to end and menu/HUD to show if it transitions, wait, it stays on GameCanvas. GameCanvas shows the DEBT.
  
  // Wait for the profile modal to appear after capture
  await expect(page.getByRole('dialog', { name: 'Chaser profile' })).toBeVisible()
  
  // Click continue to go back to the menu
  await page.getByRole('button', { name: 'CONTINUE' }).click()
  
  // In the main menu, the debt badge should be visible
  await expect(page.locator('.debt-badge')).toBeVisible()
  await expect(page.locator('.debt-badge')).toHaveText('DEBT: -15')
})

test('balance floors at 0 on capture if highestLevel <= 3', async ({ page }) => {
  const seededProfile = {
    userId: 'test-user',
    sheebs: 5,
    ownedItems: [],
    highestLevel: 3,
    deaths: 0,
    deathsHistory: [],
    muted: true,
  }
  
  await page.addInitScript((profileJson) => {
    document.cookie = 'sjdt_user_id=test-user; Path=/; SameSite=Lax'
    document.cookie = `sjdt_profile_v1=${encodeURIComponent(profileJson)}; Path=/; SameSite=Lax`
  }, JSON.stringify(seededProfile))
  
  await page.goto('./')
  await page.locator('.play-btn').click()
  await expect(page.locator('canvas')).toBeVisible()
  
  // Force a capture via the exposed __skibEngine
  await page.evaluate(() => {
    window.__skibEngine._triggerCaught(window.__skibEngine.chasers[0])
  })
  
  await expect(page.locator('.toast-panel')).toBeVisible()
  await expect(page.getByRole('dialog', { name: 'Chaser profile' })).toBeVisible()
  await page.getByRole('button', { name: 'CONTINUE' }).click()
  
  // In the main menu, it should NOT have the debt badge, just normal 0 sheebs
  await expect(page.locator('.debt-badge')).toHaveCount(0)
  await expect(page.getByText('0 sheebs')).toBeVisible()
})
