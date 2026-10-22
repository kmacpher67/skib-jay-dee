import { test, expect } from '@playwright/test'

async function startRunnerGame(page) {
  await page.goto('./')
  await page.locator('.play-btn').first().click()
  await expect(page.locator('canvas')).toBeVisible()
  await page.waitForFunction(() => window.__skibEngine?.phase === 'chase')
}

// Issue #9: Level 4 lead spawn {80,190} overlapped the first shelf wall.
test('lead chaser spawns clear of walls on all six levels', async ({ page }) => {
  await startRunnerGame(page)
  const bad = await page.evaluate(() => {
    const e = window.__skibEngine
    const failures = []
    for (let level = 0; level < 6; level++) {
      e.levelIndex = level
      e._syncLevelState({ resetPositions: true, notify: false })
      const c = e.chasers[0]
      if (e._hitsWall(c)) failures.push({ level: level + 1, x: c.x, y: c.y })
      if (c.x !== c.spawn.x || c.y !== c.spawn.y) failures.push({ level: level + 1, spawnMismatch: true })
    }
    return failures
  })
  expect(bad).toEqual([])
})

test('Level 4 lead spawn is repaired but valid spawns are preserved', async ({ page }) => {
  await startRunnerGame(page)
  const res = await page.evaluate(() => {
    const e = window.__skibEngine
    e.levelIndex = 3
    e._syncLevelState({ resetPositions: true, notify: false })
    const l4 = { x: e.chasers[0].x, y: e.chasers[0].y, moved: e.chasers[0].x !== 80 || e.chasers[0].y !== 190 }
    e.levelIndex = 0
    e._syncLevelState({ resetPositions: true, notify: false })
    const l1 = { x: e.chasers[0].x, y: e.chasers[0].y, want: e.level.chaserSpawn }
    return { l4, l1 }
  })
  expect(res.l4.moved).toBe(true)
  expect(res.l1.x).toBe(res.l1.want.x)
  expect(res.l1.y).toBe(res.l1.want.y)
})

test('extra chasers and respawns land clear of walls', async ({ page }) => {
  await startRunnerGame(page)
  const res = await page.evaluate(() => {
    const e = window.__skibEngine
    const failures = []
    for (let level = 0; level < 6; level++) {
      e.levelIndex = level
      e._syncLevelState({ resetPositions: true, notify: false })
      for (let i = 0; i < 12; i++) {
        e.chasers = [e.chasers[0]]
        e.extraChaserTimer = 0
        e._maybeSpawnExtraChaser(0.01)
        const extra = e.chasers[e.chasers.length - 1]
        if (extra !== e.chasers[0] && e._hitsWall(extra)) failures.push({ level: level + 1, kind: 'extra', x: extra.x, y: extra.y })
      }
      // Respawn with a deliberately bad stored spawn (inside the first wall).
      const w = e.map.walls[0]
      const victim = { ...e.chasers[0], spawn: { x: w.x + 2, y: w.y + 2 }, stunnedUntil: 0 }
      e.chasers = [e.chasers[0]]
      e.chaserRespawnQueue = [{ chaser: victim, timer: 0 }]
      e._updateChaserRespawns(0.01)
      if (e._hitsWall(victim)) failures.push({ level: level + 1, kind: 'respawn' })
      if (!e.chasers.includes(victim)) failures.push({ level: level + 1, kind: 'respawn-missing' })
    }
    return failures
  })
  expect(res).toEqual([])
})
