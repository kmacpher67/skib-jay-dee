import { test, expect } from '@playwright/test'

async function startRunnerGame(page) {
  await page.goto('./')
  await page.locator('.play-btn').first().click()
  await expect(page.locator('canvas')).toBeVisible()
  await page.waitForFunction(() => window.__skibEngine?.phase === 'chase')
}

test.describe('Pac-Man tunnel egg (issue #8, slice 1)', () => {
  test('roll gates egg when undiscovered', async ({ page }) => {
    await startRunnerGame(page)
    const r = await page.evaluate(() => {
      const e = window.__skibEngine
      const real = Math.random
      e.pacmanDiscovered = false
      e.earnedBadges = e.earnedBadges.filter((b) => b !== 'waka-waka-flush')
      Math.random = () => 0.999
      e._syncLevelState({ resetPositions: true, notify: false })
      const high = !!e.pacmanEgg
      Math.random = () => 0
      e._syncLevelState({ resetPositions: true, notify: false })
      const low = !!e.pacmanEgg
      Math.random = real
      return { high, low, active: e.pacmanActive }
    })
    expect(r.high).toBe(false)
    expect(r.low).toBe(true)
    expect(r.active).toBe(false)
  })

  test('discovered: egg always placed on levels 1-6, wall-safe, tunnels inactive', async ({ page }) => {
    await startRunnerGame(page)
    const r = await page.evaluate(() => {
      const e = window.__skibEngine
      const real = Math.random
      e.pacmanDiscovered = true
      const out = []
      for (let l = 0; l < 6; l++) {
        e.levelIndex = l
        for (let i = 0; i < 10; i++) {
          Math.random = () => 0.999
          e._syncLevelState({ resetPositions: true, notify: false })
          Math.random = real
          out.push({ l, egg: !!e.pacmanEgg, wall: e.pacmanEgg ? e._hitsWall(e.pacmanEgg) : null, active: e.pacmanActive })
        }
      }
      return out
    })
    for (const o of r) {
      expect(o.egg).toBe(true)
      expect(o.wall).toBe(false)
      expect(o.active).toBe(false)
    }
  })

  test('tunnel rows are wall-free at both edges on every level', async ({ page }) => {
    await startRunnerGame(page)
    const bad = await page.evaluate(() => {
      const e = window.__skibEngine
      const fails = []
      for (let l = 0; l < 6; l++) {
        e.levelIndex = l
        e._syncLevelState({ resetPositions: true, notify: false })
        for (const row of e.level.tunnelRows) {
          const cy = row.y + row.h / 2
          for (const x of [24, 900 - 24 - 60]) {
            if (e._hitsWall({ x, y: cy - 36, w: 60, h: 72 })) fails.push({ l, cy, x })
          }
        }
      }
      return fails
    })
    expect(bad).toEqual([])
  })

  test('touch egg: activates, extends threshold, badge once', async ({ page }) => {
    await startRunnerGame(page)
    const r = await page.evaluate(() => {
      const e = window.__skibEngine
      const earned = []
      e.onBadgeEarned = (id) => earned.push(id)
      e.earnedBadges = e.earnedBadges.filter((b) => b !== 'waka-waka-flush')
      e.pacmanDiscovered = true
      e._syncLevelState({ resetPositions: true, notify: false })
      const bonusBefore = e.levelTimeBonus
      e.runner.x = e.pacmanEgg.x
      e.runner.y = e.pacmanEgg.y
      e._checkPacmanEgg()
      const first = { active: e.pacmanActive, bonus: e.levelTimeBonus - bonusBefore, egg: e.pacmanEgg, earned: [...earned] }
      // second level: re-activation grants no badge
      e._syncLevelState({ resetPositions: true, notify: false })
      e.runner.x = e.pacmanEgg.x
      e.runner.y = e.pacmanEgg.y
      e._checkPacmanEgg()
      return { first, earnedAfter: [...earned], active2: e.pacmanActive }
    })
    expect(r.first.active).toBe(true)
    expect(r.first.bonus).toBe(20)
    expect(r.first.egg).toBeNull()
    expect(r.first.earned).toEqual(['waka-waka-flush'])
    expect(r.earnedAfter).toEqual(['waka-waka-flush'])
    expect(r.active2).toBe(true)
  })

  test('badge boosts first-appearance chance', async ({ page }) => {
    await startRunnerGame(page)
    const r = await page.evaluate(() => {
      const e = window.__skibEngine
      e.difficulty = 'casual'
      e.earnedBadges = e.earnedBadges.filter((b) => b !== 'waka-waka-flush')
      const base = e._getPacmanChance(1)
      e.earnedBadges.push('waka-waka-flush')
      const boosted = e._getPacmanChance(1)
      return { base, boosted }
    })
    expect(r.base).toBeCloseTo(0.04)
    expect(r.boosted).toBeCloseTo(0.04 * 4 + 0.25)
  })

  test('alcove: runner walks into the wall opening and teleports out the other side', async ({ page }) => {
    await startRunnerGame(page)
    const r = await page.evaluate(() => {
      const e = window.__skibEngine
      e.pacmanEgg = null
      e.pacmanActive = true
      e._tunnelWalls = e._buildTunnelWalls()
      e.pacmanLockout = 0
      const row = e.level.tunnelRows[0]
      const cy = row.y + row.h / 2
      const w = e.runner.w
      e.runner.y = cy - w / 2
      e.runner.x = 40
      // Walk left into the alcove past the wall line.
      for (let i = 0; i < 60; i++) { e._moveWithCollision(e.runner, -3, 0); e._applyPacmanWrap(-3) }
      const afterWalk = { x: e.runner.x, lock: e.pacmanLockout }
      const intoAlcove = (() => {
        e.pacmanLockout = 0; e.runner.x = 24; e.runner.y = cy - w / 2
        e._moveWithCollision(e.runner, -20, 0)
        return e.runner.x
      })()
      // Not lined up: blocked at the wall line.
      e.pacmanLockout = 0; e.runner.x = 30; e.runner.y = cy + 200
      e._moveWithCollision(e.runner, -50, 0)
      const offBand = e.runner.x
      // Inactive: blocked even when lined up.
      e.pacmanActive = false; e._tunnelWalls = null; e.runner.x = 30; e.runner.y = cy - w / 2
      e._moveWithCollision(e.runner, -50, 0)
      const inactive = e.runner.x
      // Right side back to left.
      e.pacmanActive = true; e._tunnelWalls = e._buildTunnelWalls(); e.pacmanLockout = 0
      e.runner.y = cy - w / 2; e.runner.x = 900 - 24 - w - 10
      for (let i = 0; i < 60; i++) { e._moveWithCollision(e.runner, 3, 0); e._applyPacmanWrap(3) }
      return { afterWalk, intoAlcove, offBand, inactive, backX: e.runner.x, w, wall: e._hitsWall(e.runner) }
    })
    expect(r.intoAlcove).toBeLessThan(24)
    expect(r.afterWalk.lock).toBeGreaterThan(0)
    expect(r.afterWalk.x).toBeGreaterThan(700)
    expect(r.offBand).toBeGreaterThanOrEqual(24)
    expect(r.inactive).toBeGreaterThanOrEqual(24)
    expect(r.backX).toBeLessThan(150)
    expect(r.wall).toBe(false)
  })

  test('real movement teleports through the tunnel on every level, both directions', async ({ page }) => {
    await startRunnerGame(page)
    const res = await page.evaluate(() => {
      const e = window.__skibEngine
      const out = []
      for (const side of ['right', 'left']) {
        for (let l = 0; l < 6; l++) {
          e.levelIndex = l
          e._syncLevelState({ resetPositions: true, notify: false })
          e.pacmanEgg = { x: e.runner.x, y: e.runner.y, w: 30, h: 30 }
          e._checkPacmanEgg()
          const row = e.level.tunnelRows[0]
          const cy = row.y + row.h / 2
          e.pacmanLockout = 0
          e.runner.y = cy - 20
          e.runner.x = side === 'right' ? 900 - 24 - 40 - 50 : 24 + 50
          e.keys.left = side === 'left'
          e.keys.right = side === 'right'
          let wrapped = false
          for (let i = 0; i < 300 && !wrapped; i++) {
            e.chasers.length = 0
            const before = e.pacmanLockout
            e.update(1 / 60)
            if (e.pacmanLockout > before) wrapped = true
          }
          e.keys.left = e.keys.right = false
          out.push({ side, l, wrapped, x: e.runner.x, wall: e._hitsWall(e.runner) })
        }
      }
      return out
    })
    for (const r of res) {
      expect(r.wrapped, `${r.side} level ${r.l + 1}`).toBe(true)
      expect(r.side === 'right' ? r.x > 700 === false : r.x > 700).toBe(true)
    }
  })

  test('new game resets pacmanDiscovered', async ({ page }) => {
    await startRunnerGame(page)
    await page.evaluate(() => { window.__skibEngine.pacmanDiscovered = true })
    await page.reload()
    await page.locator('.play-btn').first().click()
    await page.waitForFunction(() => window.__skibEngine?.phase === 'chase')
    expect(await page.evaluate(() => window.__skibEngine.pacmanDiscovered)).toBe(false)
  })

  test('slice 2: captions per difficulty, sfx callbacks, first-ever caption', async ({ page }) => {
    await startRunnerGame(page)
    const r = await page.evaluate(() => {
      const e = window.__skibEngine
      const sfx = []
      e.onPacmanSfx = (n) => sfx.push(n)
      const lines = {}
      for (const d of ['noob', 'casual', '4chan-st']) {
        e.difficulty = d
        e.earnedBadges = e.earnedBadges.filter((b) => b !== 'waka-waka-flush')
        e.pacmanEgg = { x: e.runner.x, y: e.runner.y, w: 30, h: 30 }
        e._checkPacmanEgg()
        const first = e.runnerLine
        e.pacmanEgg = { x: e.runner.x, y: e.runner.y, w: 30, h: 30 }
        e._checkPacmanEgg()
        lines[d] = { first, repeat: e.runnerLine }
      }
      return { lines, sfx }
    })
    for (const d of ['noob', 'casual', '4chan-st']) {
      expect(r.lines[d].first).toMatch(/WAKA WAKA FLUSH/)
      expect(r.lines[d].repeat).not.toBe(r.lines[d].first)
    }
    expect(r.sfx.filter((n) => n === 'chime')).toHaveLength(6)
  })
})
