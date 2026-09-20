import { test, expect } from '@playwright/test'

async function startRunnerGame(page) {
  await page.goto('./')
  await page.locator('.play-btn').first().click()
  await expect(page.locator('canvas')).toBeVisible()
  await page.waitForFunction(() => window.__skibEngine?.phase === 'chase')
}

test('Boom Stick event table and Lucky cap follow the v0.4.77 C1 contract', async ({ page }) => {
  await startRunnerGame(page)

  const table = await page.evaluate(() => {
    const engine = window.__skibEngine
    const rowFor = (difficulty) => {
      engine.difficulty = difficulty
      return [1, 2, 3, 6, 10].map((level) =>
        Number(engine._getBoomStickBaseChance(level).toFixed(2))
      )
    }

    engine.difficulty = 'casual'
    engine.setLoadout({ speedBonus: 0, staminaBonus: 0, rewardBonus: 0, luckBonus: 1 })
    const luckyAtLowLevel = engine._getBoomStickLuckyChance(0.06)
    const luckyNearCap = engine._getBoomStickLuckyChance(0.89)
    const luckyAtCap = engine._getBoomStickLuckyChance(0.9)

    return {
      noob: rowFor('noob'),
      casual: rowFor('casual'),
      hardcore: rowFor('4chan-st'),
      luckyAtLowLevel,
      luckyNearCap,
      luckyAtCap,
    }
  })

  expect(table.noob).toEqual([0.06, 0.09, 0.12, 0.21, 0.33])
  expect(table.casual).toEqual([0.06, 0.12, 0.18, 0.36, 0.6])
  expect(table.hardcore).toEqual([0.06, 0.15, 0.24, 0.51, 0.87])
  expect(table.luckyAtLowLevel).toBeCloseTo(0.04)
  expect(table.luckyNearCap).toBeCloseTo(0.01)
  expect(table.luckyAtCap).toBe(0)
})

test('Boom Stick event spawns weapon first, shells after ownership, and refreshes duplicates', async ({ page }) => {
  await startRunnerGame(page)

  const firstSpawn = await page.evaluate(() => {
    const engine = window.__skibEngine
    engine.pickups = []
    engine.runner.gun = null
    engine._findRandomWalkableSpawn = () => ({ x: 120, y: 140 })

    const originalRandom = Math.random
    Math.random = () => 0
    const spawned = engine._tryBoomStickEvent()
    Math.random = originalRandom

    return { spawned, pickup: engine.pickups[0] }
  })

  expect(firstSpawn.spawned).toBe(true)
  expect(firstSpawn.pickup.type).toBe('boom-stick')
  expect(firstSpawn.pickup.lifetime).toBe(12)

  const afterPickup = await page.evaluate(() => {
    const engine = window.__skibEngine
    engine.pickups[0].x = engine.runner.x
    engine.pickups[0].y = engine.runner.y
    engine._checkPickups()
    return { gun: engine.runner.gun, pickups: engine.pickups.length }
  })

  expect(afterPickup.pickups).toBe(0)
  expect(afterPickup.gun).toMatchObject({ kind: 'boom_stick', ammo: 1, reserve: 0, reloadTimer: 0 })

  const shellSpawn = await page.evaluate(() => {
    const engine = window.__skibEngine
    engine.pickups = []
    engine._findRandomWalkableSpawn = () => ({ x: 160, y: 180 })
    engine._spawnBoomStickEventPickup()
    engine.pickups[0].lifetime = 1
    engine._spawnBoomStickEventPickup()
    return engine.pickups
  })

  expect(shellSpawn).toHaveLength(1)
  expect(shellSpawn[0].type).toBe('boom-stick-shell')
  expect(shellSpawn[0].lifetime).toBe(12)
})

test('Boom Stick shells respect reserve cap and auto-reload after 0.85 seconds', async ({ page }) => {
  await startRunnerGame(page)

  const ammoStates = await page.evaluate(() => {
    const engine = window.__skibEngine
    const collectShell = () => {
      engine.pickups = [{
        type: 'boom-stick-shell',
        x: engine.runner.x,
        y: engine.runner.y,
        w: 28,
        h: 28,
      }]
      engine._checkPickups()
      return { ...engine.runner.gun }
    }

    engine.runner.gun = { kind: 'boom_stick', ammo: 1, reserve: 4, reloadTimer: 0 }
    const capped = collectShell()
    const stillCapped = collectShell()

    engine.runner.gun = { kind: 'boom_stick', ammo: 0, reserve: 2, reloadTimer: 0 }
    const loadedDirectly = collectShell()

    engine.runner.gun = { kind: 'boom_stick', ammo: 0, reserve: 1, reloadTimer: 0 }
    engine.update(0.01)
    const reloadStarted = { ...engine.runner.gun }
    engine.update(0.85)
    const reloadFinished = { ...engine.runner.gun }

    return { capped, stillCapped, loadedDirectly, reloadStarted, reloadFinished }
  })

  expect(ammoStates.capped.reserve).toBe(5)
  expect(ammoStates.stillCapped.reserve).toBe(5)
  expect(ammoStates.loadedDirectly.ammo).toBe(1)
  expect(ammoStates.loadedDirectly.reserve).toBe(2)
  expect(ammoStates.reloadStarted.reloadTimer).toBeCloseTo(0.85)
  expect(ammoStates.reloadFinished).toMatchObject({ ammo: 1, reserve: 0, reloadTimer: 0 })
})
