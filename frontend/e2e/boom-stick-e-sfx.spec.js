import { test, expect } from '@playwright/test'

async function startRunnerGame(page, difficulty) {
  await page.goto('./')
  await page.locator('.play-btn').first().click()
  await expect(page.locator('canvas')).toBeVisible()
  await page.waitForFunction(() => window.__skibEngine?.phase === 'chase')
}

function setup(count, reserve) {
  const engine = window.__skibEngine
  window.__sfx = []
  engine.onBoomStickSfx = (n) => window.__sfx.push(n)
  engine.map.walls = []
  engine.chaserRespawnQueue = []
  engine.fireCooldown = 0
  engine.runner.x = 500
  engine.runner.y = 500
  engine.runner.facing = { x: 1, y: 0 }
  engine.runner.gun = { kind: 'boom_stick', ammo: 1, reserve, reloadTimer: 0 }
  const base = engine.chasers[0]
  engine.chasers = Array.from({ length: count }, (_, i) => ({
    ...base, x: 650 + i * 10, y: 490 + i * 20, stunnedUntil: 0, joinRamp: 1,
  }))
  const queue = Array(count).fill(0.01)
  Math.random = () => (queue.length ? queue.shift() : 0.99)
}

test('blast, shatter and reload SFX fire once each in order', async ({ page }) => {
  await startRunnerGame(page)
  const sfx = await page.evaluate(`(${setup.toString()})(2, 2) || (() => {
    const e = window.__skibEngine
    e._fireBoomStick()
    for (let i = 0; i < 40; i++) e.update(0.05)
    return window.__sfx
  })()`)
  expect(sfx).toEqual(['blast', 'reload', 'shatter'])
})

test('reduced motion plays shatter once up front', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await startRunnerGame(page)
  const sfx = await page.evaluate(`(${setup.toString()})(1, 0) || (() => {
    const e = window.__skibEngine
    e._fireBoomStick()
    for (let i = 0; i < 40; i++) e.update(0.05)
    return window.__sfx
  })()`)
  expect(sfx).toEqual(['blast', 'shatter'])
})

test('pickup SFX plays on boom stick and shell pickup', async ({ page }) => {
  await startRunnerGame(page)
  const sfx = await page.evaluate(() => {
    const e = window.__skibEngine
    window.__sfx = []
    e.onBoomStickSfx = (n) => window.__sfx.push(n)
    e.runner.gun = null
    const r = e.runner
    for (const type of ['boom-stick', 'boom-stick-shell']) {
      e.pickups = [{ type, x: r.x, y: r.y, w: 30, h: 30 }]
      e.update(0.016)
    }
    return window.__sfx
  })
  expect(sfx).toEqual(['pickup', 'pickup'])
})

test('empty chamber shows a click line and spends nothing', async ({ page }) => {
  await startRunnerGame(page)
  const res = await page.evaluate(() => {
    const e = window.__skibEngine
    e.fireCooldown = 0
    e.runner.gun = { kind: 'boom_stick', ammo: 0, reserve: 0, reloadTimer: 0 }
    e._fireBoomStick()
    return { line: e.runnerLine, ammo: e.runner.gun.ammo }
  })
  expect(res.line).toMatch(/click/)
  expect(res.ammo).toBe(0)
})

test('kill caption pools are difficulty routed', async ({ page }) => {
  await startRunnerGame(page)
  const res = await page.evaluate(() => {
    const e = window.__skibEngine
    const collect = (d) => {
      e.difficulty = d
      const seen = new Set()
      let seed = 12345
      Math.random = () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296 }
      for (let n = 0; n < 400; n++) seen.add(e._pickCutawayQuote())
      return [...seen]
    }
    return { noob: collect('noob'), casual: collect('casual'), hard: collect('4chan-st') }
  })
  expect(res.noob.sort()).toEqual(['BOOM GOES THE POTTY!', 'NIGHT-NIGHT, TOILET FACE!', 'YOU GOT EXTRA UGLY!'].sort())
  expect(res.casual).toContain('SHOP SMART. RUN FASTER.')
  expect(res.casual).not.toContain('PRIMITIVE MEATHEAD DELETED.')
  expect(res.hard).toContain('PRIMITIVE MEATHEAD DELETED.')
  expect(res.hard).not.toContain('SHOP SMART. RUN FASTER.')
})
