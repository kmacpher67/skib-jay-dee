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
          for (const cy of [row.y, row.y + row.h]) {
            for (const x of [24, 900 - 24 - 40]) {
              if (e._hitsWall({ x, y: cy - 20, w: 40, h: 40 })) fails.push({ l, cy, x })
            }
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

  test('wrap: left<->right on tunnel row only, with lockout', async ({ page }) => {
    await startRunnerGame(page)
    const r = await page.evaluate(() => {
      const e = window.__skibEngine
      e.pacmanEgg = null
      const row = e.level.tunnelRows[0]
      const cy = row.y + row.h / 2
      const run = (x, y, step, active) => {
        e.pacmanActive = active
        e.pacmanLockout = 0
        e.runner.x = x
        e.runner.y = y - e.runner.h / 2
        e.runner.x = step < 0 ? 24 : 900 - 24 - e.runner.w
        e._applyPacmanWrap(step)
        return { x: e.runner.x, lock: e.pacmanLockout, wall: e._hitsWall(e.runner) }
      }
      const left = run(0, cy, -5, true)
      const afterLeftAgain = (() => { e._applyPacmanWrap(5); return e.runner.x })()
      const right = run(0, cy, 5, true)
      const inactive = run(0, cy, -5, false)
      const offRow = run(0, cy + 300, -5, true)
      return { left, afterLeftAgain, right, inactive, offRow, w: e.runner.w }
    })
    expect(r.left.x).toBeGreaterThan(800)
    expect(r.left.wall).toBe(false)
    expect(r.left.lock).toBeGreaterThan(0)
    expect(r.afterLeftAgain).toBe(r.left.x)
    expect(r.right.x).toBeLessThan(40)
    expect(r.right.wall).toBe(false)
    expect(r.inactive.x).toBe(24)
    expect(r.offRow.x).toBe(24)
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
