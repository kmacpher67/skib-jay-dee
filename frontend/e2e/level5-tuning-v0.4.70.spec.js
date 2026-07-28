import { test, expect } from '@playwright/test'

test.describe('Level 5 Tuning v0.4.70', () => {
  test('noob difficulty has slower chaser on Level 5 than casual', async ({ page }) => {
    await page.goto('/')

    const noobSpeed = await page.evaluate(() => {
      document.cookie = 'skib-profile={"difficulty":"noob"}'
      return new Promise(resolve => {
        window.dispatchEvent(new Event('skib-profile-loaded'))
        setTimeout(() => {
          const engine = window.__skibEngine
          engine.difficulty = 'noob'
          engine.levelIndex = 4
          engine.isHardcore = false
          engine.wallHackLevel = true
          engine.chaserSpeedMod = 1.0
          engine.runner = { x: 400, y: 400, w: 40, h: 40, speed: 200 }
          engine.chasers = [{ x: 400, y: 800, w: 40, h: 40, baseSpeed: 200, stunGracePeriod: 0, stunTimer: 0, joinRamp: 1, vx: 0, vy: 0 }]
          engine.soggyTrails = []
          engine._updateChasers(1/60)
          resolve(800 - engine.chasers[0].y)
        }, 100)
      })
    })

    const casualSpeed = await page.evaluate(() => {
      document.cookie = 'skib-profile={"difficulty":"casual"}'
      return new Promise(resolve => {
        window.dispatchEvent(new Event('skib-profile-loaded'))
        setTimeout(() => {
          const engine = window.__skibEngine
          engine.difficulty = 'casual'
          engine.levelIndex = 4
          engine.isHardcore = false
          engine.wallHackLevel = true
          engine.chaserSpeedMod = 1.0
          engine.runner = { x: 400, y: 400, w: 40, h: 40, speed: 200 }
          engine.chasers = [{ x: 400, y: 800, w: 40, h: 40, baseSpeed: 200, stunGracePeriod: 0, stunTimer: 0, joinRamp: 1, vx: 0, vy: 0 }]
          engine.soggyTrails = []
          engine._updateChasers(1/60)
          resolve(800 - engine.chasers[0].y)
        }, 100)
      })
    })

    expect(noobSpeed).toBeLessThan(casualSpeed)
  })

  test('wall overlapping Level 5 chaser is measurably slower', async ({ page }) => {
    await page.goto('/')
    const { inWallDist, openDist } = await page.evaluate(() => {
        window.dispatchEvent(new Event('skib-profile-loaded'))
        document.querySelector('button.play-btn').click()
        setTimeout(() => {
          const engine = window.__skibEngine
          engine.difficulty = 'casual'
          engine.levelIndex = 4
          engine.wallHackLevel = true
          engine.chaserSpeedMod = 1.0
          engine.runner = { x: 400, y: 400, w: 40, h: 40, speed: 200 }
          engine.soggyTrails = []
          
          // Case 1: In open space
          engine.map = { walls: [] }
          engine.chasers = [{ x: 400, y: 800, w: 40, h: 40, baseSpeed: 200, stunGracePeriod: 0, stunTimer: 0, joinRamp: 1, vx: 0, vy: 0 }]
          engine._updateChasers(1/60)
          const openDist = 800 - engine.chasers[0].y

          // Case 2: In a wall
          engine.map = { walls: [{ x: 300, y: 700, w: 200, h: 200 }] }
          engine.chasers = [{ x: 400, y: 800, w: 40, h: 40, baseSpeed: 200, stunGracePeriod: 0, stunTimer: 0, joinRamp: 1, vx: 0, vy: 0 }]
          engine._updateChasers(1/60)
          const inWallDist = 800 - engine.chasers[0].y
          
          resolve({ inWallDist, openDist })
        }, 100)
      })
    })
    
    expect(inWallDist).toBeLessThan(openDist * 0.8)
  })

  test('relocated Turdstone Token spawns at its new location on Level 4 (levelIndex === 3)', async ({ page }) => {
    await page.goto('/')
    const token = await page.evaluate(() => {
      document.cookie = 'skib-profile={"difficulty":"casual"}'
      return new Promise(resolve => {
        window.dispatchEvent(new Event('skib-profile-loaded'))
        document.querySelector('button.play-btn').click()
        setTimeout(() => {
          const engine = window.__skibEngine
          engine.levelIndex = 3
          engine.runner.hasTurdstoneToken = false
          engine.pickups = []
          engine._maybeSpawnTurdstoneToken()
          resolve(engine.pickups.find(p => p.type === 'turdstone-token'))
        }, 100)
      })
    })
    
    expect(token).toBeTruthy()
    expect(token.x).toBe(820)
    expect(token.y).toBe(220)
  })
})
