import { test, expect } from '@playwright/test'

async function startRunnerGame(page) {
  await page.goto('./')
  await page.locator('.play-btn').first().click()
  await expect(page.locator('canvas')).toBeVisible()
  await page.waitForFunction(() => window.__skibEngine?.phase === 'chase')
}

// Open arena; 3 chasers in the cone; every explosion roll succeeds.
function blastAndRun() {
  const engine = window.__skibEngine
  let splats = 0
  engine.onSplat = () => { splats += 1 }
  engine.map.walls = []
  engine.chaserRespawnQueue = []
  engine.fireCooldown = 0
  engine.runner.x = 500
  engine.runner.y = 500
  engine.runner.facing = { x: 1, y: 0 }
  engine.runner.gun = { kind: 'boom_stick', ammo: 1, reserve: 0, reloadTimer: 0 }
  const base = engine.chasers[0]
  engine.chasers = Array.from({ length: 3 }, (_, i) => ({
    ...base, x: 650 + i * 10, y: 490 + i * 20, stunnedUntil: 0, joinRamp: 1,
  }))
  const queue = [0.01, 0.01, 0.01]
  Math.random = () => (queue.length ? queue.shift() : 0.99)
  engine._fireBoomStick()
  for (let i = 0; i < 50; i++) engine.update(0.05)
  return { splats, cutaway: !!engine.cutaway }
}

test('splat sound fires exactly once per multi-kill blast', async ({ page }) => {
  await startRunnerGame(page)
  const res = await page.evaluate(`(${blastAndRun.toString()})()`)
  expect(res.cutaway).toBe(false)
  expect(res.splats).toBe(1)
})

test('splat sound fires exactly once under reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await startRunnerGame(page)
  const res = await page.evaluate(`(${blastAndRun.toString()})()`)
  expect(res.splats).toBe(1)
})
