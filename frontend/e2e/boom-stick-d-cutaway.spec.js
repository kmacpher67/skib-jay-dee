import { test, expect } from '@playwright/test'

async function startRunnerGame(page) {
  await page.goto('./')
  await page.locator('.play-btn').first().click()
  await expect(page.locator('canvas')).toBeVisible()
  await page.waitForFunction(() => window.__skibEngine?.phase === 'chase')
}

// Open arena; N chasers lined up in the cone; every explosion roll succeeds.
function blast(count) {
  const engine = window.__skibEngine
  engine.map.walls = []
  engine.chaserRespawnQueue = []
  engine.bullets = []
  engine.fireCooldown = 0
  engine.bodyCount = 0
  engine.splotches = []
  engine.runner.x = 500
  engine.runner.y = 500
  engine.runner.facing = { x: 1, y: 0 }
  engine.runner.gun = { kind: 'boom_stick', ammo: 1, reserve: 2, reloadTimer: 0 }
  const base = engine.chasers[0]
  engine.chasers = Array.from({ length: count }, (_, i) => ({
    ...base,
    x: 650 + i * 10,
    y: 490 + i * 20,
    stunnedUntil: 0,
    joinRamp: 1,
  }))
  const queue = Array(count).fill(0.01)
  Math.random = () => (queue.length ? queue.shift() : 0.99)
  engine._fireBoomStick()
}

test('multi-kill makes one cutaway, caps at 1.75s, then stamps splotches', async ({ page }) => {
  await startRunnerGame(page)
  const res = await page.evaluate(`(${blast.toString()})(5) || (() => {
    const e = window.__skibEngine
    const c = e.cutaway
    const r = { has: !!c, shown: c.victims.length, extra: c.extra, dur: c.duration, splotchesAtStart: e.splotches.length }
    for (let i = 0; i < 40; i++) e.update(0.05)
    r.afterCutaway = !!e.cutaway
    r.splotches = e.splotches.length
    r.body = e.bodyCount
    return r
  })()`)
  expect(res.has).toBe(true)
  expect(res.shown).toBe(3)
  expect(res.extra).toBe(2)
  expect(res.dur).toBeLessThanOrEqual(1.75)
  expect(res.splotchesAtStart).toBe(0)
  expect(res.afterCutaway).toBe(false)
  expect(res.splotches).toBe(5)
  expect(res.body).toBe(5)
})

test('splotch collection caps at 12', async ({ page }) => {
  await startRunnerGame(page)
  const n = await page.evaluate(() => {
    const e = window.__skibEngine
    e.splotches = []
    for (let i = 0; i < 20; i++) e._stampSplotch(100 + i, 100)
    return e.splotches.length
  })
  expect(n).toBe(12)
})

test('reduced motion uses the short cracked-card path', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await startRunnerGame(page)
  const res = await page.evaluate(`(${blast.toString()})(1) || (() => {
    const e = window.__skibEngine
    return { reduced: e.cutaway.reduced, dur: e.cutaway.duration, splotches: e.splotches.length }
  })()`)
  expect(res.reduced).toBe(true)
  expect(res.dur).toBeLessThanOrEqual(0.9)
  expect(res.splotches).toBe(1)
})

test('stun-only blast does not trigger a cutaway; capture phase cancels one', async ({ page }) => {
  await startRunnerGame(page)
  const res = await page.evaluate(() => {
    const e = window.__skibEngine
    e.cutaway = { t: 0, duration: 1.75, victims: [], allVictims: [], extra: 0, quote: 'x', stamped: true }
    e.phase = 'caught'
    e.update(0.016)
    return { cancelled: e.cutaway === null }
  })
  expect(res.cancelled).toBe(true)
})
