import { test, expect } from '@playwright/test'

test.describe('Level 5 Tuning v0.4.70', () => {
  test('noob difficulty has slower chaser on Level 5 than casual', async ({ page }) => {
    await page.goto('/')

    // Get 'noob' chaser speed
    const noobSpeed = await page.evaluate(() => {
      document.cookie = 'skib-profile={"difficulty":"noob"}'
      return new Promise(resolve => {
        window.dispatchEvent(new Event('skib-profile-loaded'))
        document.querySelector('button.play-btn').click()
        setTimeout(() => {
          const engine = window.__skibEngine
          engine.levelIndex = 4
          engine.isHardcore = false
          engine.wallHackLevel = true
          engine.chaserSpeedMod = 1.0 // Fixed for comparison
          
          engine.runner.x = 400
          engine.runner.y = 400
          engine.chaser.x = 400
          engine.chaser.y = 800
          engine.chaser.joinRamp = 1
          
          const dt = 1/60
          engine._updateChasers(dt)
          
          // distance moved in Y
          resolve(800 - engine.chaser.y)
        }, 100)
      })
    })

    // Get 'casual' chaser speed
    const casualSpeed = await page.evaluate(() => {
      document.cookie = 'skib-profile={"difficulty":"casual"}'
      return new Promise(resolve => {
        window.dispatchEvent(new Event('skib-profile-loaded'))
        document.querySelector('button.play-btn').click()
        setTimeout(() => {
          const engine = window.__skibEngine
          engine.levelIndex = 4
          engine.isHardcore = false
          engine.wallHackLevel = true
          engine.chaserSpeedMod = 1.0 // Fixed for comparison
          
          engine.runner.x = 400
          engine.runner.y = 400
          engine.chasers[0].x = 400
          engine.chasers[0].y = 800
          engine.chasers[0].joinRamp = 1
          
          const dt = 1/60
          engine._updateChasers(dt)
          
          // distance moved in Y
          resolve(800 - engine.chasers[0].y)
        }, 100)
      })
    })

    expect(noobSpeed).toBeLessThan(casualSpeed)
  })

  test('wall overlapping Level 5 chaser is measurably slower', async ({ page }) => {
    await page.goto('/')
    const { inWallDist, openDist } = await page.evaluate(() => {
      document.cookie = 'skib-profile={"difficulty":"casual"}'
      return new Promise(resolve => {
        window.dispatchEvent(new Event('skib-profile-loaded'))
        document.querySelector('button.play-btn').click()
        setTimeout(() => {
          const engine = window.__skibEngine
          engine.levelIndex = 4
          engine.wallHackLevel = true
          engine.chaser.joinRamp = 1
          engine.chaserSpeedMod = 1.0
          
          const dt = 1/60
          
          // Case 1: In open space
          engine.runner.x = 400; engine.runner.y = 400
          engine.chaser.x = 400; engine.chaser.y = 800
          engine._updateChasers(dt)
          const openDist = 800 - engine.chaser.y

          // Case 2: In a wall
          engine.map.walls = [{ x: 300, y: 700, w: 200, h: 200 }]
          engine.runner.x = 400; engine.runner.y = 400
          engine.chaser.x = 400; engine.chaser.y = 800
          engine._updateChasers(dt)
          const inWallDist = 800 - engine.chaser.y
          
          resolve({ inWallDist, openDist })
        }, 100)
      })
    })
    
    expect(inWallDist).toBeLessThan(openDist * 0.8) // Roughly 0.7x
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
