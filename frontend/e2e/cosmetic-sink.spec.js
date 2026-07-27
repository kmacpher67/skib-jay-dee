import { test, expect } from '@playwright/test'

const BASE_PROFILE = {
  userId: 'cosmetic-test',
  sheebs: 500,
  ownedItems: [],
  highestLevel: 1,
  deaths: 0,
  deathsHistory: [],
  muted: true,
}

function seedProfile(page, profile) {
  return page.addInitScript((profileJson) => {
    document.cookie = `sjdt_user_id=${JSON.parse(profileJson).userId}; Path=/; SameSite=Lax`
    document.cookie = `sjdt_profile_v1=${encodeURIComponent(profileJson)}; Path=/; SameSite=Lax`
  }, JSON.stringify(profile))
}

test('neon jump-scare filter can be purchased and tints the capture overlay', async ({ page }) => {
  await seedProfile(page, BASE_PROFILE)
  await page.goto('./')

  await page.locator('.shop-btn').click()
  await expect(page.getByText('Neon Jump-Scare Filter')).toBeVisible()
  await page.locator('.shop-card', { hasText: 'Neon Jump-Scare Filter' }).getByRole('button', { name: 'BUY' }).click()
  await expect(page.getByText('Balance: 300 sheebs')).toBeVisible()
  await page.locator('.close-pill').click()

  await page.locator('.play-btn').first().click()
  await expect(page.locator('canvas')).toBeVisible()
  await page.waitForFunction(() => window.__skibEngine?.phase === 'chase')

  await page.evaluate(() => {
    window.__skibEngine._triggerCaught(window.__skibEngine.chasers[0])
  })

  await page.waitForFunction(() => window.__skibEngine.phase === 'caught')

  const overlayColor = await page.evaluate(() => {
    const engine = window.__skibEngine
    const canvas = engine.canvas
    const ctx = canvas.getContext('2d')
    const pixel = ctx.getImageData(canvas.width / 2, canvas.height / 2, 1, 1).data
    return { r: pixel[0], g: pixel[1], b: pixel[2] }
  })

  expect(overlayColor.g).toBeGreaterThan(overlayColor.r)
  expect(overlayColor.b).toBeGreaterThan(overlayColor.r)
})

test('default jump-scare overlay stays red without the cosmetic filter', async ({ page }) => {
  await seedProfile(page, BASE_PROFILE)
  await page.goto('./')
  await page.locator('.play-btn').first().click()
  await expect(page.locator('canvas')).toBeVisible()
  await page.waitForFunction(() => window.__skibEngine?.phase === 'chase')

  await page.evaluate(() => {
    window.__skibEngine._triggerCaught(window.__skibEngine.chasers[0])
  })

  await page.waitForFunction(() => window.__skibEngine.phase === 'caught')

  const overlayColor = await page.evaluate(() => {
    const engine = window.__skibEngine
    const canvas = engine.canvas
    const ctx = canvas.getContext('2d')
    const pixel = ctx.getImageData(canvas.width / 2, canvas.height / 2, 1, 1).data
    return { r: pixel[0], g: pixel[1], b: pixel[2] }
  })

  expect(overlayColor.r).toBeGreaterThan(overlayColor.g)
  expect(overlayColor.r).toBeGreaterThan(overlayColor.b)
})

test('mute button stays visible on wide desktop viewports', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 })
  await page.goto('./')

  await expect(page.locator('.mute-btn-menu')).toBeVisible()
})
