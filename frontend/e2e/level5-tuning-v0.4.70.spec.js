import { test, expect } from '@playwright/test'

test.describe('Level 5 Tuning v0.4.70', () => {
  test('noob difficulty has slower chaser on Level 5 than casual', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.play-btn').first()).toBeVisible()
    await page.locator('.play-btn').first().click()
    await expect(page.locator('canvas')).toBeVisible()

    const noobSpeed = await page.evaluate(() => {
      return new Promise(resolve => {
        setTimeout(() => {
          try {
            const engine = window.__skibEngine
            if (!engine) throw new Error('__skibEngine is undefined')
            engine.difficulty = 'noob'
            engine.levelIndex = 4
            engine.isHardcore = false
            engine.wallHackLevel = true
            engine.chaserSpeedMod = 1.0
            engine.runner.x = 400
            engine.runner.y = 400
            engine.chasers[0].x = 400
            engine.chasers[0].y = 800
            engine.chasers[0].joinRamp = 1
            engine.chasers[0].stunnedUntil = 0
            engine.soggyTrails = []
            engine.phase = 'chase'
            engine.update(1/60)
            resolve(800 - engine.chasers[0].y)
          } catch (e) {
            resolve('ERROR: ' + e.message)
          }
        }, 100)
      })
    })

    await page.goto('/')
    await expect(page.locator('.play-btn').first()).toBeVisible()
    await page.locator('.play-btn').first().click()
    await expect(page.locator('canvas')).toBeVisible()

    const casualSpeed = await page.evaluate(() => {
      return new Promise(resolve => {
        setTimeout(() => {
          try {
            const engine = window.__skibEngine
            if (!engine) throw new Error('__skibEngine is undefined')
            engine.difficulty = 'casual'
            engine.levelIndex = 4
            engine.isHardcore = false
            engine.wallHackLevel = true
            engine.chaserSpeedMod = 1.0
            engine.runner.x = 400
            engine.runner.y = 400
            engine.chasers[0].x = 400
            engine.chasers[0].y = 800
            engine.chasers[0].joinRamp = 1
            engine.chasers[0].stunnedUntil = 0
            engine.soggyTrails = []
            engine.phase = 'chase'
            engine.update(1/60)
            resolve(800 - engine.chasers[0].y)
          } catch (e) {
            resolve('ERROR: ' + e.message)
          }
        }, 100)
      })
    })

    if (typeof noobSpeed === 'string') throw new Error("noobSpeed failed: " + noobSpeed)
    if (typeof casualSpeed === 'string') throw new Error("casualSpeed failed: " + casualSpeed)

    expect(typeof noobSpeed).toBe('number')
    expect(typeof casualSpeed).toBe('number')
    expect(noobSpeed).toBeLessThan(casualSpeed)
  })

  test('wall overlapping Level 5 chaser is measurably slower', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.play-btn').first()).toBeVisible()
    await page.locator('.play-btn').first().click()
    await expect(page.locator('canvas')).toBeVisible()

    const { inWallDist, openDist } = await page.evaluate(() => {
      return new Promise(resolve => {
        setTimeout(() => {
          try {
            const engine = window.__skibEngine
            if (!engine) throw new Error('__skibEngine is undefined')
            engine.difficulty = 'casual'
            engine.levelIndex = 4
            engine.wallHackLevel = true
            engine.chaserSpeedMod = 1.0
            engine.runner.x = 400
            engine.runner.y = 400
            engine.soggyTrails = []
            
            engine.map = { walls: [] }
            engine.chasers[0].x = 400
            engine.chasers[0].y = 800
            engine.chasers[0].joinRamp = 1
            engine.chasers[0].stunnedUntil = 0
            engine.phase = 'chase'
            engine.update(1/60)
            const openDist = 800 - engine.chasers[0].y

            engine.map = { walls: [{ x: 300, y: 700, w: 200, h: 200 }] }
            engine.chasers[0].x = 400
            engine.chasers[0].y = 800
            engine.chasers[0].joinRamp = 1
            engine.chasers[0].stunnedUntil = 0
            engine.phase = 'chase'
            engine.update(1/60)
            const inWallDist = 800 - engine.chasers[0].y
            
            resolve({ inWallDist, openDist })
          } catch (e) {
            resolve({ inWallDist: 'ERROR', openDist: e.message })
          }
        }, 100)
      })
    })
    
    expect(typeof inWallDist).toBe('number')
    expect(inWallDist).toBeLessThan(openDist * 0.8)
  })

  test('relocated Turdstone Token spawns at its new location on Level 4 (levelIndex === 3)', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.play-btn').first()).toBeVisible()
    await page.locator('.play-btn').first().click()
    await expect(page.locator('canvas')).toBeVisible()

    const token = await page.evaluate(() => {
      return new Promise(resolve => {
        setTimeout(() => {
          try {
            const engine = window.__skibEngine
            if (!engine) throw new Error('__skibEngine is undefined')
            engine.levelIndex = 3
            engine.runner.hasTurdstoneToken = false
            engine.pickups = []
            engine._maybeSpawnTurdstoneToken()
            resolve(engine.pickups.find(p => p.type === 'turdstone-token'))
          } catch (e) {
            resolve({ error: e.message })
          }
        }, 100)
      })
    })
    
    expect(token).toBeTruthy()
    expect(token.error).toBeUndefined()
    expect(token.x).toBe(820)
    expect(token.y).toBe(220)
  })
})
