import { test, expect } from '@playwright/test'

test('profile switcher lists profiles, creates a new one, and switches back', async ({ page }) => {
  const seededProfile = {
    userId: 'sjdt-original',
    label: 'Original Save',
    sheebs: 340,
    ownedItems: [],
    highestLevel: 3,
    deaths: 5,
    deathsHistory: [],
    muted: false,
  }

  await page.addInitScript((profileJson) => {
    document.cookie = 'sjdt_user_id=sjdt-original; Path=/; SameSite=Lax'
    document.cookie = `sjdt_profile_v1=${encodeURIComponent(profileJson)}; Path=/; SameSite=Lax`
  }, JSON.stringify(seededProfile))
  await page.goto('./')

  await expect(page.locator('.user-pill')).toHaveText('User Original Save')

  await page.locator('.user-pill').click()
  const switcherDialog = page.getByRole('dialog', { name: 'Switch profile' })
  await expect(switcherDialog).toBeVisible()
  await expect(switcherDialog.getByText('Original Save')).toBeVisible()
  await expect(switcherDialog.getByText('ACTIVE')).toBeVisible()

  await switcherDialog.locator('.profile-switcher-input').fill('Second Save')
  await switcherDialog.getByRole('button', { name: '+ NEW PROFILE' }).click()

  await expect(page.locator('.user-pill')).toHaveText('User Second Save')
  await expect(page.getByText('0 sheebs')).toBeVisible()
  await expect(page.getByText('Best level 1')).toBeVisible()

  await page.locator('.user-pill').click()
  const reopened = page.getByRole('dialog', { name: 'Switch profile' })
  await expect(reopened.getByText('Original Save')).toBeVisible()
  await expect(reopened.getByText('Second Save')).toBeVisible()

  await reopened
    .locator('.profile-switcher-card', { hasText: 'Original Save' })
    .getByRole('button', { name: 'Play as this profile' })
    .click()

  await expect(page.locator('.user-pill')).toHaveText('User Original Save')
  await expect(page.getByText('340 sheebs')).toBeVisible()
  await expect(page.getByText('Best level 3')).toBeVisible()
})
