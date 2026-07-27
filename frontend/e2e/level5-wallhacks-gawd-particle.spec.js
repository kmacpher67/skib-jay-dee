import { test, expect } from '@playwright/test'

// Verifies the v0.4.34 Level 5+ escalation
// (docs/handoffs/roadmap-handoff-v0.4.34-plan.md):
// Feature 1 — chasers ignore walls (and get a speed bump) from Level 5
// (levelIndex 4) onward, but still respect them on earlier levels.
// Feature 2 — the Gawd Particle only spawns Level 5+, grants the runner a
// timed wall-hack buff on pickup, and turns a chaser collision while the
// buff is active into a despawn + respawn instead of a capture.

test('chasers pass through walls at Level 5 but are blocked before it', async ({ page }) => {
  await page.goto('./')
  await page.locator('.play-btn').first().click()
  await expect(page.locator('canvas')).toBeVisible()
  await page.waitForFunction(() => window.__skibEngine?.phase === 'chase')

  const result = await page.evaluate(() => {
    const engine = window.__skibEngine
    const wall = { x: 400, y: 300, w: 40, h: 200 }

    function crossAttempt(levelIndex) {
      engine.levelIndex = levelIndex
      engine._syncLevelState({ resetPositions: true, notify: false })
      engine.phase = 'chase'
      engine.map.walls = [wall]
      engine.chasers = [engine.chaser]
      engine.chaser.stunnedUntil = 0
      engine.chaser.joinRamp = 1
      engine.chaser.x = wall.x - engine.chaser.w
      engine.chaser.y = wall.y + 50
      engine.runner.x = wall.x + wall.w + 200
      engine.runner.y = engine.chaser.y
      engine.keys = { up: false, down: false, left: false, right: false, sprint: false, fire: false }
      // Small per-frame steps, like the real game loop — a single huge dt
      // would tunnel a fast mover clean through a thin wall in one jump.
      for (let i = 0; i < 60; i++) engine.update(1 / 60)
      return { chaserX: engine.chaser.x, wallRight: wall.x + wall.w }
    }

    return {
      level1: crossAttempt(0),
      level5: crossAttempt(4),
    }
  })

  // Level 1 (index 0): no wall hacks yet, chaser stays on the near side.
  expect(result.level1.chaserX).toBeLessThanOrEqual(result.level1.wallRight - 40)
  // Level 5 (index 4): wall hacks active, chaser crosses clean through.
  expect(result.level5.chaserX).toBeGreaterThan(result.level5.wallRight)
})

test('Gawd Particle only spawns Level 5+, buffs the runner, and despawns a touched chaser', async ({ page }) => {
  await page.goto('./')
  await page.locator('.play-btn').first().click()
  await expect(page.locator('canvas')).toBeVisible()
  await page.waitForFunction(() => window.__skibEngine?.phase === 'chase')

  // Spawn gating: never before Level 5, even with 200 rolls.
  const earlySpawns = await page.evaluate(() => {
    const engine = window.__skibEngine
    engine.levelIndex = 3
    engine._syncLevelState({ resetPositions: true, notify: false })
    let count = 0
    for (let i = 0; i < 200; i++) {
      engine.pickups = []
      engine._maybeSpawnGawdParticle()
      if (engine.pickups.some((p) => p.type === 'gawd-particle')) count++
    }
    return count
  })
  expect(earlySpawns).toBe(0)

  const lateSpawns = await page.evaluate(() => {
    const engine = window.__skibEngine
    engine.levelIndex = 4
    engine._syncLevelState({ resetPositions: true, notify: false })
    let count = 0
    for (let i = 0; i < 400; i++) {
      engine.pickups = []
      engine._maybeSpawnGawdParticle()
      if (engine.pickups.some((p) => p.type === 'gawd-particle')) count++
    }
    return count
  })
  expect(lateSpawns).toBeGreaterThan(0)

  // Pickup grants the wall-hack buff, which lets the runner cross a wall
  // that would otherwise block it, and expires back to normal collision.
  const buffResult = await page.evaluate(() => {
    const engine = window.__skibEngine
    engine.levelIndex = 4
    engine._syncLevelState({ resetPositions: true, notify: false })
    engine.phase = 'chase'

    const wall = { x: 400, y: 300, w: 40, h: 200 }
    engine.map.walls = [wall]
    engine.runner.x = wall.x - engine.runner.w
    engine.runner.y = wall.y + 50

    engine.pickups = [{ type: 'gawd-particle', x: engine.runner.x, y: engine.runner.y, w: 28, h: 28 }]
    engine._checkPickups()
    const activeAfterPickup = engine.gawdParticleActive
    const timerAfterPickup = engine.gawdParticleTimer

    // No chasers in play for this check — it's only about the runner's own
    // wall-hack movement, not chase/capture interaction.
    engine.chasers = []
    engine.keys = { up: false, down: false, left: false, right: false, sprint: false, fire: false }
    engine.keys.right = true
    for (let i = 0; i < 60; i++) engine.update(1 / 60)
    const crossedWithBuff = engine.runner.x > wall.x + wall.w

    // Let the buff expire and confirm collision resolution comes back.
    engine.gawdParticleTimer = 0.05
    for (let i = 0; i < 6; i++) engine.update(1 / 60)
    const buffExpired = !engine.gawdParticleActive

    engine.runner.x = wall.x - engine.runner.w
    engine.runner.y = wall.y + 50
    for (let i = 0; i < 60; i++) engine.update(1 / 60)
    const blockedWithoutBuff = engine.runner.x <= wall.x

    return { activeAfterPickup, timerAfterPickup, crossedWithBuff, buffExpired, blockedWithoutBuff }
  })

  expect(buffResult.activeAfterPickup).toBe(true)
  expect(buffResult.timerAfterPickup).toBe(10)
  expect(buffResult.crossedWithBuff).toBe(true)
  expect(buffResult.buffExpired).toBe(true)
  expect(buffResult.blockedWithoutBuff).toBe(true)

  // Chaser despawn + respawn: touching a chaser while the buff is active
  // removes it from play instead of capturing the runner, then it returns
  // to its spawn point after the respawn timer.
  const despawnResult = await page.evaluate(() => {
    const engine = window.__skibEngine
    engine.levelIndex = 4
    engine._syncLevelState({ resetPositions: true, notify: false })
    engine.phase = 'chase'
    engine.map.walls = []

    engine.gawdParticleActive = true
    engine.gawdParticleTimer = 10
    engine.chaser.stunnedUntil = 0
    // A valid, in-bounds spawn point far from the runner's own spawn.
    const spawn = { x: 40, y: 40 }
    engine.chaser.spawn = spawn
    engine.chaser.x = engine.runner.x
    engine.chaser.y = engine.runner.y
    engine.keys = { up: false, down: false, left: false, right: false, sprint: false, fire: false }

    engine.update(0.016)
    const despawnedImmediately = engine.chasers.length === 0
    const queued = engine.chaserRespawnQueue.length === 1

    engine.chaserRespawnQueue[0].timer = 0.01
    engine.update(0.02)
    const respawned = engine.chasers.length === 1
    // Respawns at its spawn point, then takes one frame of movement toward
    // the runner in the same tick — check it's close, not pixel-exact.
    const distFromSpawn = respawned
      ? Math.hypot(engine.chasers[0].x - spawn.x, engine.chasers[0].y - spawn.y)
      : Infinity
    const atSpawnPoint = distFromSpawn < 10
    const phaseStillChase = engine.phase === 'chase'

    return { despawnedImmediately, queued, respawned, atSpawnPoint, phaseStillChase }
  })

  expect(despawnResult.despawnedImmediately).toBe(true)
  expect(despawnResult.queued).toBe(true)
  expect(despawnResult.respawned).toBe(true)
  expect(despawnResult.atSpawnPoint).toBe(true)
  expect(despawnResult.phaseStillChase).toBe(true)
})
