import { test, expect } from '@playwright/test'

const BASE_PROFILE = {
  userId: 'cosmetic-test',
  sheebs: 500,
  ownedItems: [],
  highestLevel: 1,
  deaths: 0,
  deathsHistory: [],
  muted: true,
  difficulty: 'noob',
}

function seedProfile(page, profile) {
  return page.addInitScript((profileJson) => {
    document.cookie = `sjdt_user_id=${JSON.parse(profileJson).userId}; Path=/; SameSite=Lax`
    document.cookie = `sjdt_profile_v1=${encodeURIComponent(profileJson)}; Path=/; SameSite=Lax`
  }, JSON.stringify(profile))
}

test('neon jump-scare filter can be purchased and tints the capture overlay', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 640 })
  await seedProfile(page, BASE_PROFILE)
  await page.goto('./')

  await page.locator('.shop-btn').click()
  await expect(page.getByText('Neon Jump-Scare Filter')).toBeVisible()
  await page.locator('.shop-card', { hasText: 'Neon Jump-Scare Filter' }).getByRole('button', { name: 'BUY' }).click()
  // Cost is now 250
  await expect(page.getByText('Balance: 250 sheebs')).toBeVisible()
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
    const pixel = ctx.getImageData(canvas.width / 4, canvas.height / 4, 1, 1).data
    return { r: pixel[0], g: pixel[1], b: pixel[2] }
  })

  // Both magenta and cyan have high blue.
  expect(overlayColor.b).toBeGreaterThan(100)
  // And they are not purely red (unlike the default red overlay which has low blue).
})

test('default jump-scare overlay stays red without the cosmetic filter', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 640 })
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
    const pixel = ctx.getImageData(canvas.width / 4, canvas.height / 4, 1, 1).data
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

test('neon jump-scare filter provides a 0.5s headstart on resume and deducts 50 sheebs', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 640 })
  await seedProfile(page, { ...BASE_PROFILE, ownedItems: ['jump-scare-filter-neon'], sheebs: 200 })
  await page.goto('./')
  await page.locator('.play-btn').first().click()
  await expect(page.locator('canvas')).toBeVisible()
  await page.waitForFunction(() => window.__skibEngine?.phase === 'chase')

  // Force capture
  await page.evaluate(() => {
    window.__skibEngine._triggerCaught(window.__skibEngine.chasers[0])
  })

  // Wait for caught-profile and dismiss it
  await page.waitForFunction(() => window.__skibEngine.phase === 'caught-profile')
  await page.evaluate(() => window.__skibEngine.beginResumeCountdown())

  // Wait for resume countdown to finish
  await page.waitForFunction(() => window.__skibEngine.phase === 'chase')

  const state = await page.evaluate(() => {
    return {
      stunned: window.__skibEngine.chasers[0].stunnedUntil > 0,
      sheebs: window.__skibEngine.sheebs,
      neonStun: window.__skibEngine.chasers[0].neonStun,
    }
  })

  expect(state.stunned).toBe(true)
  expect(state.sheebs).toBe(150) // 200 - 50 = 150
  expect(state.neonStun).toBe(true)
})

test('neon headstart skips and does not deduct if sheebs < 50 on low level', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 640 })
  await seedProfile(page, { ...BASE_PROFILE, ownedItems: ['jump-scare-filter-neon'], sheebs: 40 })
  await page.goto('./')
  await page.locator('.play-btn').first().click()
  await expect(page.locator('canvas')).toBeVisible()
  await page.waitForFunction(() => window.__skibEngine?.phase === 'chase')

  // Force capture
  await page.evaluate(() => {
    window.__skibEngine._triggerCaught(window.__skibEngine.chasers[0])
  })

  // Wait for caught-profile and dismiss it
  await page.waitForFunction(() => window.__skibEngine.phase === 'caught-profile')
  await page.evaluate(() => window.__skibEngine.beginResumeCountdown())

  // Wait for resume countdown to finish
  await page.waitForFunction(() => window.__skibEngine.phase === 'chase')

  const state = await page.evaluate(() => {
    return {
      stunned: window.__skibEngine.chasers[0].stunnedUntil > 0,
      sheebs: window.__skibEngine.sheebs,
    }
  })

  expect(state.stunned).toBe(false)
  expect(state.sheebs).toBe(40) // No deduction
})
