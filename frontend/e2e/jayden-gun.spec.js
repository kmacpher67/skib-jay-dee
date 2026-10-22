import { test, expect } from '@playwright/test'

// Verifies the Jayden Gun (docs/handoffs/roadmap-handoff-v0.4.31-plan.md):
// a map pickup grants 1-2 usable rounds, firing in the runner's facing
// direction stuns whatever chaser it hits for 3-5s (frozen, not removed),
// and the gun disappears once ammo hits zero.
test('gun pickup grants ammo, firing stuns the chaser, and the gun disappears at 0 ammo', async ({ page }) => {
  await page.goto('./')
  await page.locator('.play-btn').first().click()
  await expect(page.locator('canvas')).toBeVisible()
  await page.waitForFunction(() => window.__skibEngine?.phase === 'chase')

  // Force a pickup exactly on the runner so the next update tick collects it.
  await page.evaluate(() => {
    const engine = window.__skibEngine
    engine.pickups = [{ type: 'gun', x: engine.runner.x, y: engine.runner.y, w: 28, h: 28 }]
  })
  await page.waitForFunction(() => window.__skibEngine.runner.gun !== null)
  await page.waitForFunction(() => window.__skibEngine.pickups.length === 0)
  const ammo = await page.evaluate(() => window.__skibEngine.runner.gun.ammo)
  expect([1, 2]).toContain(ammo)

  // Aim directly at the chaser and fire. Keep enough separation that the
  // faster bullet (480px/s) reaches the chaser before its own chase
  // movement (~150px/s) can close the gap and trigger a real capture.
  await page.evaluate(() => {
    const engine = window.__skibEngine
    engine.chaser.x = engine.runner.x + 200
    engine.chaser.y = engine.runner.y
    engine.chaser.stunnedUntil = 0
    engine.runner.facing = { x: 1, y: 0 }
    engine.fireCooldown = 0
    engine._tryFire()
  })
  await page.waitForFunction(() => window.__skibEngine.bullets.length === 1)
  await page.waitForFunction(() => window.__skibEngine.chaser.stunnedUntil > 0)

  // Small tolerance: stunnedUntil starts decaying (dt per frame) the instant
  // it's set, and a frame or two can elapse before this read lands.
  const stunnedUntil = await page.evaluate(() => window.__skibEngine.chaser.stunnedUntil)
  expect(stunnedUntil).toBeGreaterThanOrEqual(2.9)
  expect(stunnedUntil).toBeLessThanOrEqual(5)

  // A stunned chaser stays frozen instead of closing distance.
  const distBefore = await page.evaluate(() => {
    const e = window.__skibEngine
    return Math.hypot(e.runner.x - e.chaser.x, e.runner.y - e.chaser.y)
  })
  await page.waitForTimeout(300)
  const distAfter = await page.evaluate(() => {
    const e = window.__skibEngine
    return Math.hypot(e.runner.x - e.chaser.x, e.runner.y - e.chaser.y)
  })
  expect(distAfter).toBeCloseTo(distBefore, 0)

  // Firing the last round removes the gun from inventory entirely.
  await page.evaluate(() => {
    const engine = window.__skibEngine
    engine.runner.gun = { ammo: 1 }
    engine.fireCooldown = 0
    engine._tryFire()
  })
  await page.waitForFunction(() => window.__skibEngine.runner.gun === null)

  // Firing empty-handed is a harmless comedic no-op, not a crash.
  await page.evaluate(() => {
    const engine = window.__skibEngine
    engine.fireCooldown = 0
    engine._tryFire()
  })
  const runnerLine = await page.evaluate(() => window.__skibEngine.runnerLine)
  expect(runnerLine.length).toBeGreaterThan(0)
})

test('handgun ammo stacks to six and coexists with Boom Stick fallback', async ({ page }) => {
  await page.goto('./')
  await page.locator('.play-btn').first().click()
  await expect(page.locator('canvas')).toBeVisible()
  await page.waitForFunction(() => window.__skibEngine?.phase === 'chase')

  const state = await page.evaluate(() => {
    const engine = window.__skibEngine
    engine.runner.weapons.handgun = { kind: 'handgun', ammo: 5, reserve: 0 }
    engine.runner.selectedWeapon = 'handgun'
    engine.runner.gun = engine.runner.weapons.handgun
    engine.pickups = [{ type: 'gun', x: engine.runner.x, y: engine.runner.y, w: 28, h: 28 }]
    Math.random = () => 0.99
    engine._checkPickups()
    const cappedAmmo = engine.runner.weapons.handgun.ammo
    engine.runner.weapons.boom_stick = { kind: 'boom_stick', ammo: 1, reserve: 0, reloadTimer: 0 }
    engine._selectUsableWeapon('handgun')
    engine.runner.facing = { x: 0, y: -1 }
    engine.fireCooldown = 0
    engine._tryFire()
    const afterHandgun = {
      selected: engine.runner.selectedWeapon,
      handgunAmmo: engine.runner.weapons.handgun?.ammo ?? 0,
      boomAmmo: engine.runner.weapons.boom_stick.ammo,
    }
    for (let i = 0; i < 5; i++) {
      engine.fireCooldown = 0
      engine._tryFire()
    }
    return {
      cappedAmmo,
      handgunAmmo: engine.runner.weapons.handgun?.ammo ?? 0,
      afterHandgun,
      selectedAfterEmpty: engine.runner.selectedWeapon,
      boomAmmoAfterFallback: engine.runner.weapons.boom_stick?.ammo ?? 0,
    }
  })

  expect(state.cappedAmmo).toBe(6)
  expect(state.afterHandgun).toMatchObject({ selected: 'handgun', handgunAmmo: 5, boomAmmo: 1 })
  expect(state.selectedAfterEmpty).toBe('boom_stick')
  expect(state.boomAmmoAfterFallback).toBe(1)
})

test('Level 1 lasts longer and chaser arrivals can seed guns plus mushrooms', async ({ page }) => {
  await page.goto('./')
  await page.locator('.play-btn').first().click()
  await expect(page.locator('canvas')).toBeVisible()
  await page.waitForFunction(() => window.__skibEngine?.phase === 'chase')

  const result = await page.evaluate(() => {
    const engine = window.__skibEngine
    engine.pickups = []
    engine.rollingPickups = []
    engine._findRandomWalkableSpawn = () => ({ x: 320, y: 320 })
    const originalRandom = Math.random
    Math.random = () => 0
    engine._spawnChaserArrivalPickups()
    Math.random = originalRandom
    return {
      advanceAt: engine.level.advanceAt,
      pickups: engine.pickups.map((pickup) => pickup.type),
      rolling: engine.rollingPickups.map((pickup) => ({ isGood: pickup.isGood, effect: pickup.effect })),
    }
  })

  expect(result.advanceAt).toBe(36)
  expect(result.pickups).toContain('gun')
  expect(result.rolling).toEqual([{ isGood: true, effect: 'speed' }])
})
