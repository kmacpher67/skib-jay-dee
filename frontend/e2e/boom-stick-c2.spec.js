import { test, expect } from '@playwright/test'

async function startRunnerGame(page) {
  await page.goto('./')
  await page.locator('.play-btn').first().click()
  await expect(page.locator('canvas')).toBeVisible()
  await page.waitForFunction(() => window.__skibEngine?.phase === 'chase')
}

// Open arena, runner at (500,500) facing +x, chasers placed relative to it.
function setupBlast(rolls, placements, walls = []) {
  const engine = window.__skibEngine
  engine.map.walls = walls
  engine.chaserRespawnQueue = []
  engine.bullets = []
  engine.fireCooldown = 0
  engine.bodyCount = 0
  engine.runner.x = 500
  engine.runner.y = 500
  engine.runner.facing = { x: 1, y: 0 }
  engine.runner.gun = { kind: 'boom_stick', ammo: 1, reserve: 2, reloadTimer: 0 }
  const base = engine.chasers[0]
  engine.chasers = placements.map(([dx, dy]) => ({
    ...base,
    x: 500 + dx,
    y: 500 + dy,
    stunnedUntil: 0,
    joinRamp: 1,
  }))
  engine.sheebs = 0
  const queue = [...rolls]
  Math.random = () => (queue.length ? queue.shift() : 0.99)
  return engine
}

test('cone includes in-range forward targets and excludes out-of-cone / out-of-range', async ({ page }) => {
  await startRunnerGame(page)
  const result = await page.evaluate(() => {
    const original = Math.random
    const engine = window.__skibEngine
    const out = {}
    const place = (placements) => {
      engine.map.walls = []
      engine.runner.x = 500
      engine.runner.y = 500
      engine.runner.facing = { x: 1, y: 0 }
      const base = engine.chasers[0]
      engine.chasers = placements.map(([dx, dy]) => ({ ...base, x: 500 + dx, y: 500 + dy }))
      return engine._getBoomStickTargets().length
    }
    out.forward = place([[150, 0]])
    out.insideEdge = place([[150, 60]])
    out.outsideAngle = place([[100, 150]])
    out.behind = place([[-150, 0]])
    out.tooFar = place([[400, 0]])
    Math.random = original
    return out
  })
  expect(result.forward).toBe(1)
  expect(result.insideEdge).toBe(1)
  expect(result.outsideAngle).toBe(0)
  expect(result.behind).toBe(0)
  expect(result.tooFar).toBe(0)
})

test('walls block the blast', async ({ page }) => {
  await startRunnerGame(page)
  const hits = await page.evaluate(() => {
    const engine = window.__skibEngine
    engine.map.walls = [{ x: 600, y: 400, w: 20, h: 300 }]
    engine.runner.x = 500
    engine.runner.y = 500
    engine.runner.facing = { x: 1, y: 0 }
    const base = engine.chasers[0]
    engine.chasers = [{ ...base, x: 680, y: 500 }]
    return engine._getBoomStickTargets().length
  })
  expect(hits).toBe(0)
})

test('explosion vs survivor, one reward per blast, body count, 12s respawn, out-of-cone untouched', async ({ page }) => {
  await startRunnerGame(page)
  const result = await page.evaluate(({ setupSrc }) => {
    const original = Math.random
    const engine = eval(`(${setupSrc})`)(
      [0.1, 0.9], // first target explodes (<1/3), second survives
      [[120, 0], [180, 10], [0, 200]], // third is out of cone
    )
    const outBefore = { x: engine.chasers[2].x, y: engine.chasers[2].y }
    engine._tryFire()
    const after = {
      activeCount: engine.chasers.length,
      bodyCount: engine.bodyCount,
      sheebs: engine.sheebs,
      queue: engine.chaserRespawnQueue.map((e) => e.timer),
      survivor: engine.chasers.find((c) => c.stunnedUntil > 0),
      outOfCone: engine.chasers.find((c) => c.x === outBefore.x && c.y === outBefore.y),
      ammo: engine.runner.gun.ammo,
      noBullets: engine.bullets.length === 0,
    }
    after.survivorStun = after.survivor?.stunnedUntil
    after.survivorX = after.survivor?.x
    after.outStun = after.outOfCone?.stunnedUntil
    delete after.survivor
    delete after.outOfCone
    // respawn after 12s
    engine._updateChaserRespawns(11.9)
    after.beforeRespawn = engine.chasers.length
    engine._updateChaserRespawns(0.2)
    after.afterRespawn = engine.chasers.length
    Math.random = original
    return after
  }, { setupSrc: setupBlast.toString() })

  expect(result.activeCount).toBe(2)
  expect(result.bodyCount).toBe(1)
  expect(result.sheebs).toBe(25)
  expect(result.queue).toEqual([12])
  expect(result.survivorStun).toBe(7)
  expect(result.survivorX).toBeGreaterThanOrEqual(500 + 180 + 80)
  expect(result.outStun).toBe(0)
  expect(result.noBullets).toBe(true)
  expect(result.ammo).toBe(0)
  expect(result.beforeRespawn).toBe(2)
  expect(result.afterRespawn).toBe(3)
})

test('empty cone blast still spends the shell and reload pulls from reserve', async ({ page }) => {
  await startRunnerGame(page)
  const result = await page.evaluate(({ setupSrc }) => {
    const original = Math.random
    const engine = eval(`(${setupSrc})`)([], [[-300, 0]])
    engine._tryFire()
    const afterFire = { ammo: engine.runner.gun.ammo, reserve: engine.runner.gun.reserve, sheebs: engine.sheebs }
    Math.random = original
    return afterFire
  }, { setupSrc: setupBlast.toString() })
  expect(result).toEqual({ ammo: 0, reserve: 2, sheebs: 0 })
})
