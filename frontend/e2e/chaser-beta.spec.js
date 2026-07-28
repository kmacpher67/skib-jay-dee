import { test, expect } from '@playwright/test'

test.describe('Chaser Beta Mode', () => {
  test('Slice A: Profile callback isolation and zero loadout', async ({ page, context }) => {
    // 1. Seed a profile with stats and a loadout
    await context.addCookies([
      {
        name: 'skib-profile-v1',
        value: encodeURIComponent(JSON.stringify({
          userId: 'test-user',
          label: 'Test User',
          sheebs: 1000,
          highestLevel: 2,
          deaths: 5,
          ownedItems: ['speed-boost-1', 'stamina-boost-1', 'luck-charm'],
          earnedBadges: ['lucky'],
          deathsHistory: [],
          rewardsHistory: []
        })),
        domain: 'localhost',
        path: '/'
      }
    ])

    await page.goto('/')
    
    // Switch to Chaser Beta
    await page.click('button:has-text("PLAY AS CHASER")')
    await page.waitForFunction(() => window.__skibEngine)

    // Force engine into a state where it has a gun pickup and chaser tags runner
    const engineDump = await page.evaluate(() => {
      const engine = window.__skibEngine
      
      // Check loadout is zeroed out
      const loadoutBefore = { ...engine.loadout }
      
      // Trigger callbacks
      engine.onSheebsChange(9999)
      engine.onBadgeEarned('flaming-ass')
      engine.onPickupConsumed('heavy-plunger', 'good')
      engine.onLevelClear({ index: 3 })
      engine.onDeath({ deaths: 10, level: 1 })
      
      return { loadout: loadoutBefore }
    })
    
    expect(engineDump.loadout.speedBonus).toBe(0)
    expect(engineDump.loadout.staminaBonus).toBe(0)
    expect(engineDump.loadout.luckBonus).toBe(0)
    
    // Check cookies hasn't changed
    const cookies = await context.cookies()
    const profileCookie = cookies.find(c => c.name === 'skib-profile-v1')
    const savedProfile = JSON.parse(decodeURIComponent(profileCookie.value))
    
    expect(savedProfile.sheebs).toBe(1000)
    expect(savedProfile.highestLevel).toBe(2)
    expect(savedProfile.deaths).toBe(5)
    expect(savedProfile.earnedBadges).not.toContain('flaming-ass')
  })
  
  test('Slice B: AI Runner Panic Fire and Win Line', async ({ page }) => {
    await page.goto('/')
    await page.click('button:has-text("PLAY AS CHASER")')
    await page.waitForFunction(() => window.__skibEngine?.phase === 'chase')

    const result = await page.evaluate(() => {
      return new Promise((resolve) => {
        const engine = window.__skibEngine
        
        // Give AI gun ammo
        engine.runner.gun = { ammo: 1, chambers: 1 }
        engine.fireCooldown = 0
        
        // Move chaser close
        engine.chasers[0].x = engine.runner.x + 100
        engine.chasers[0].y = engine.runner.y
        
        // Run one frame of update
        engine.update(1/60)
        
        const shotFired = engine.bullets.length > 0
        const isStunned = engine.chasers[0].stunnedUntil > 0
        const tauntUsed = engine.runnerLine !== ''
        
        // Now force a capture
        engine._checkCaptures = function() {
          this.phase = 'caught'
          this.zoom = 1
          this.captureLine = 'TEST WIN LINE'
          this.onCaught({ captureLine: 'TEST WIN LINE' })
        }
        engine._checkCaptures()
        
        resolve({
          shotFired,
          isStunned,
          tauntUsed
        })
      })
    })
    
    expect(result.shotFired).toBe(true)
    expect(result.tauntUsed).toBe(true)
    
    // Verify custom Chaser capture line shows in modal
    await page.waitForSelector('.profile-quote')
    const quoteText = await page.textContent('.profile-quote')
    expect(quoteText).toContain('TEST WIN LINE')
  })
})
